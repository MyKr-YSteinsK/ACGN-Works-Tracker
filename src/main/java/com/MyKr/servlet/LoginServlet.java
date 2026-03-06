package com.MyKr.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.MyKr.dao.UserDao;
import com.MyKr.model.User;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            out.write("{\"success\":false, \"msg\":\"用户名或密码不能为空\"}");
            out.close();
            return;
        }

        UserDao userDao = new UserDao();
        User user = userDao.findByUsernameAndPassword(username, password);
        if (user != null) {
            HttpSession session = req.getSession();
            session.setAttribute("user", user);
            out.write("{\"success\":true}");
        } else {
            out.write("{\"success\":false, \"msg\":\"用户名或密码错误\"}");
        }
        out.close();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.sendRedirect(req.getContextPath() + "/pages/login.html");
    }
} 