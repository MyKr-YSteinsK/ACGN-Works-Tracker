package com.MyKr.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 退出登录Servlet
 * 功能：清除用户session，实现安全退出
 */
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // 获取当前session
            HttpSession session = request.getSession(false);
            
            if (session != null) {
                // 清除session中的所有属性
                session.invalidate();
            }
            
            // 返回成功响应
            out.println("{\"success\": true, \"message\": \"退出登录成功\"}");
            
        } catch (Exception e) {
            // 返回错误响应
            out.println("{\"success\": false, \"message\": \"退出登录失败: " + e.getMessage() + "\"}");
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // GET请求也支持退出登录
        doPost(request, response);
    }
} 