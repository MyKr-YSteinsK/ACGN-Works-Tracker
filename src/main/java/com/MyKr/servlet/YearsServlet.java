package com.MyKr.servlet;

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
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/api/years")
public class YearsServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        
        try {
            // 获取用户对应的表名（与主页和top页保持一致）
            String tableName = TableUtil.getWorkTableName(request);
            
            // 获取所有年份
            List<String> years = workAdminDao.getAllYears(tableName);
            
            // 返回成功响应
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", years);
            
            objectMapper.writeValue(response.getWriter(), result);
            
        } catch (Exception e) {
            e.printStackTrace();
            
            // 返回错误响应
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "获取年份数据失败: " + e.getMessage());
            
            objectMapper.writeValue(response.getWriter(), result);
        }
    }
} 