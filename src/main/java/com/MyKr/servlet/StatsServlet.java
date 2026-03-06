package com.MyKr.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.MyKr.util.DBUtil;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 统计数据Servlet，支持多用户独立表，根据当前登录用户动态选择表
 */
@WebServlet("/stats/*")
public class StatsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ObjectMapper objectMapper = new ObjectMapper();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        // 获取当前用户表名
        String tableName = TableUtil.getWorkTableName(request);
        
        try {
            if ("/seasonDistribution".equals(pathInfo)) {
                // 季节分布统计
                String year = request.getParameter("year");
                String type = request.getParameter("type");
                List<Map<String, Object>> data = getSeasonDistribution(tableName, year, type);
                out.write(objectMapper.writeValueAsString(data));
                
            } else if ("/seasonTypeCount".equals(pathInfo)) {
                // 指定季节各类型数量统计
                String year = request.getParameter("year");
                String season = request.getParameter("season");
                List<Integer> data = getSeasonTypeCount(tableName, year, season);
                out.write(objectMapper.writeValueAsString(data));
                
            } else if ("/yearTypeCount".equals(pathInfo)) {
                // 指定年份各类型数量统计
                String year = request.getParameter("year");
                List<Integer> data = getYearTypeCount(tableName, year);
                out.write(objectMapper.writeValueAsString(data));
                
            } else if ("/availablePeriods".equals(pathInfo)) {
                // 获取所有可用的时间段数据
                Map<String, Object> data = getAvailablePeriods(tableName);
                out.write(objectMapper.writeValueAsString(data));
                
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.write("{\"error\": \"API not found\"}");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Internal server error\"}");
        }
    }
    
    /**
     * 获取季节分布统计
     */
    private List<Map<String, Object>> getSeasonDistribution(String tableName, String year, String type) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT period, COUNT(*) as count FROM " + tableName + " WHERE period LIKE ?");
        if (type != null && !type.equalsIgnoreCase("ALL")) {
            sql.append(" AND type = ?");
        }
        sql.append(" GROUP BY period");
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            
            ps.setString(1, year + "%");
            if (type != null && !type.equalsIgnoreCase("ALL")) {
                ps.setString(2, type);
            }
            
            try (ResultSet rs = ps.executeQuery()) {
                int total = 0;
                List<Map<String, Object>> tempList = new ArrayList<>();
                
                while (rs.next()) {
                    String period = rs.getString("period");
                    int count = rs.getInt("count");
                    total += count;
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", period);
                    item.put("value", count);
                    tempList.add(item);
                }
                
                // 计算百分比
                for (Map<String, Object> item : tempList) {
                    int count = (Integer) item.get("value");
                    double percentage = total > 0 ? (double) count / total * 100 : 0;
                    item.put("percentage", Math.round(percentage * 10.0) / 10.0);
                    result.add(item);
                }
            }
        }
        
        return result;
    }
    
    /**
     * 获取指定季节各类型数量统计
     */
    private List<Integer> getSeasonTypeCount(String tableName, String year, String season) throws Exception {
        List<Integer> result = new ArrayList<>();
        String period = year + season;
        String[] types = {"Anime", "Comic", "Game", "Novel"};
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE period = ? AND type = ?";
        
        try (Connection conn = DBUtil.getConnection()) {
            for (String type : types) {
                try (PreparedStatement ps = conn.prepareStatement(sql)) {
                    ps.setString(1, period);
                    ps.setString(2, type);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            result.add(rs.getInt(1));
                        } else {
                            result.add(0);
                        }
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * 获取指定年份各类型数量统计
     */
    private List<Integer> getYearTypeCount(String tableName, String year) throws Exception {
        List<Integer> result = new ArrayList<>();
        String[] types = {"Anime", "Comic", "Game", "Novel"};
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE period LIKE ? AND type = ?";
        
        try (Connection conn = DBUtil.getConnection()) {
            for (String type : types) {
                try (PreparedStatement ps = conn.prepareStatement(sql)) {
                    ps.setString(1, year + "%");
                    ps.setString(2, type);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            result.add(rs.getInt(1));
                        } else {
                            result.add(0);
                        }
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * 获取所有可用的时间段数据（优化版：只查唯一组合，极快）
     */
    private Map<String, Object> getAvailablePeriods(String tableName) throws Exception {
        Map<String, Object> result = new HashMap<>();
        List<String> availableYears = new ArrayList<>();
        Map<String, List<String>> yearSeasons = new HashMap<>();
        Map<String, Map<String, List<Integer>>> yearSeasonTypes = new HashMap<>();

        // 只查唯一的year, season, type组合
        String sql = "SELECT DISTINCT SUBSTRING(period,1,4) as year, SUBSTRING(period,5) as season, type FROM " + tableName;
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                String year = rs.getString("year");
                String season = rs.getString("season");
                String type = rs.getString("type");
                int typeIndex = getTypeIndex(type);

                // 年份
                if (!availableYears.contains(year)) {
                    availableYears.add(year);
                }
                // 季节
                if (!yearSeasons.containsKey(year)) {
                    yearSeasons.put(year, new ArrayList<>());
                }
                if (!yearSeasons.get(year).contains(season)) {
                    yearSeasons.get(year).add(season);
                }
                // 类型
                if (!yearSeasonTypes.containsKey(year)) {
                    yearSeasonTypes.put(year, new HashMap<>());
                }
                if (!yearSeasonTypes.get(year).containsKey(season)) {
                    yearSeasonTypes.get(year).put(season, new ArrayList<>());
                }
                if (!yearSeasonTypes.get(year).get(season).contains(typeIndex)) {
                    yearSeasonTypes.get(year).get(season).add(typeIndex);
                }
            }
        }
        // 按年份降序排列
        availableYears.sort((a, b) -> b.compareTo(a));
        result.put("availableYears", availableYears);
        result.put("yearSeasons", yearSeasons);
        result.put("yearSeasonTypes", yearSeasonTypes);
        return result;
    }
    
    /**
     * 将类型字符串转换为数字索引
     */
    private int getTypeIndex(String type) {
        switch (type) {
            case "Anime": return 0;
            case "Comic": return 1;
            case "Game": return 2;
            case "Novel": return 3;
            default: return 0;
        }
    }
} 