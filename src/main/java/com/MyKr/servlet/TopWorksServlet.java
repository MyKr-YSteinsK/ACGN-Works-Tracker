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
 * TOP作品Servlet
 * 返回评分大于等于48分的作品
 * 
 * 访问路径：/top/works
 * 请求方式：GET
 * 参数：type（可选，指定作品类型）
 * 
 * 返回格式：
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "作品名称",
 *       "score": 48,
 *       "period": "2024春",
 *       "type": "Anime"
 *     }
 *   ]
 * }
 */
@WebServlet("/top/works")
public class TopWorksServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ObjectMapper objectMapper = new ObjectMapper();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取当前用户表名
            String tableName = TableUtil.getWorkTableName(request);
            
            String type = request.getParameter("type");
            List<Map<String, Object>> topWorks = getTopWorks(tableName, type);
            
            result.put("success", true);
            result.put("data", topWorks);
            
            out.write(objectMapper.writeValueAsString(result));
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "服务器错误：" + e.getMessage());
            out.write(objectMapper.writeValueAsString(result));
        }
    }
    
    /**
     * 获取TOP作品列表
     * @param tableName 表名
     * @param type 作品类型（可选）
     * @return 作品列表
     */
    private List<Map<String, Object>> getTopWorks(String tableName, String type) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        
        StringBuilder sql = new StringBuilder(
            "SELECT id, name, score, period, type FROM " + tableName + " WHERE score >= 48"
        );
        
        if (type != null && !type.trim().isEmpty()) {
            sql.append(" AND type = ?");
        }
        
        sql.append(" ORDER BY score DESC, period ASC");
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            
            if (type != null && !type.trim().isEmpty()) {
                ps.setString(1, type);
            }
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> work = new HashMap<>();
                    work.put("id", rs.getInt("id"));
                    work.put("name", rs.getString("name"));
                    work.put("score", rs.getInt("score"));
                    work.put("period", rs.getString("period"));
                    work.put("type", rs.getString("type"));
                    result.add(work);
                }
            }
        }
        
        return result;
    }
} 