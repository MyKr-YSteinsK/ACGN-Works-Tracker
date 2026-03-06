package com.MyKr.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.MyKr.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 获取当前登录用户信息的Servlet
 * 
 * 访问路径：/getCurrentUser
 * 请求方式：GET
 * 
 * 返回格式：
 * {
 *   "success": true,
 *   "username": "admin"
 * }
 */
@WebServlet("/getCurrentUser")
public class GetCurrentUserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ObjectMapper objectMapper = new ObjectMapper();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("user") != null) {
                User user = (User) session.getAttribute("user");
                result.put("success", true);
                result.put("username", user.getUsername());
            } else {
                // 如果没有登录，返回默认用户
                result.put("success", true);
                result.put("username", "admin");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "获取用户信息失败：" + e.getMessage());
        }
        
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
} 