package com.MyKr.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.MyKr.dao.WorkAdminDao;
import com.MyKr.model.WorkAdmin;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/api/search")
public class SearchServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        
        try {
            // 读取请求体
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            // 解析JSON请求
            Map<String, Object> requestData = objectMapper.readValue(sb.toString(), Map.class);
            
            // 获取用户对应的表名（与主页和top页保持一致）
            String tableName = TableUtil.getWorkTableName(request);
            
            // 提取搜索参数
            String keyword = (String) requestData.get("keyword");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> filters = (Map<String, Object>) requestData.get("filters");
            
            List<String> years = null;
            List<String> seasons = null;
            List<String> types = null;
            Float minScore = null;
            Float maxScore = null;
            
            if (filters != null) {
                // 年份
                Object yearsObj = filters.get("years");
                if (yearsObj instanceof List<?>) {
                    years = new java.util.ArrayList<>();
                    for (Object o : (List<?>) yearsObj) {
                        if (o != null) years.add(o.toString());
                    }
                }
                // 季节
                Object seasonsObj = filters.get("seasons");
                if (seasonsObj instanceof List<?>) {
                    seasons = new java.util.ArrayList<>();
                    for (Object o : (List<?>) seasonsObj) {
                        if (o != null) seasons.add(o.toString());
                    }
                }
                // 类型
                Object typesObj = filters.get("types");
                if (typesObj instanceof List<?>) {
                    types = new java.util.ArrayList<>();
                    for (Object o : (List<?>) typesObj) {
                        if (o != null) types.add(o.toString());
                    }
                }
                // 评分
                Map<String, Object> scoreRange = null;
                Object scoreRangeObj = filters.get("scoreRange");
                if (scoreRangeObj instanceof Map<?,?>) {
                    scoreRange = (Map<String, Object>) scoreRangeObj;
                }
                if (scoreRange != null) {
                    Object minObj = scoreRange.get("min");
                    Object maxObj = scoreRange.get("max");
                    if (minObj instanceof Number) {
                        minScore = ((Number) minObj).floatValue();
                    } else if (minObj != null) {
                        try { minScore = Float.parseFloat(minObj.toString()); } catch (Exception ignore) {}
                    }
                    if (maxObj instanceof Number) {
                        maxScore = ((Number) maxObj).floatValue();
                    } else if (maxObj != null) {
                        try { maxScore = Float.parseFloat(maxObj.toString()); } catch (Exception ignore) {}
                    }
                }
            }
            
            // 执行搜索
            List<WorkAdmin> results = workAdminDao.searchWorks(tableName, keyword, years, seasons, types, minScore, maxScore);
            
            // 转换为前端需要的格式
            List<Map<String, Object>> formattedResults = results.stream()
                .map(work -> {
                    Map<String, Object> workMap = new HashMap<>();
                    workMap.put("id", work.getId());
                    workMap.put("name", work.getName());
                    workMap.put("score", work.getScore());
                    workMap.put("period", work.getPeriod());
                    
                    // 提取年份和季节
                    String period = work.getPeriod();
                    if (period != null && period.length() >= 5) {
                        workMap.put("year", period.substring(0, 4));
                        workMap.put("season", period.substring(4));
                    } else {
                        workMap.put("year", "");
                        workMap.put("season", "");
                    }
                    
                    // 转换类型为数字
                    String typeStr = work.getType();
                    int typeNum = 0; // 默认动画
                    switch (typeStr) {
                        case "Anime": typeNum = 0; break;
                        case "Comic": typeNum = 1; break;
                        case "Game": typeNum = 2; break;
                        case "Novel": typeNum = 3; break;
                    }
                    workMap.put("type", typeNum);
                    
                    return workMap;
                })
                .collect(java.util.stream.Collectors.toList());
            
            // 返回成功响应
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", formattedResults);
            
            objectMapper.writeValue(response.getWriter(), result);
            
        } catch (Exception e) {
            e.printStackTrace();
            
            // 返回错误响应
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "搜索失败: " + e.getMessage());
            
            objectMapper.writeValue(response.getWriter(), result);
        }
    }
} 