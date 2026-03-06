package com.MyKr.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.MyKr.dao.UserDao;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/resetPassword")
public class ResetPasswordServlet extends HttpServlet {
    private final UserDao userDao = new UserDao();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String username = request.getParameter("username");
        String newPassword = request.getParameter("newPassword");

        Map<String, Object> result = new HashMap<>();

        try {
            username = username == null ? null : username.trim();
            newPassword = newPassword == null ? null : newPassword.trim();

            if (username == null || username.isEmpty()) {
                result.put("success", false);
                result.put("msg", "用户名不能为空");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (!TableUtil.isValidUsername(username)) {
                result.put("success", false);
                result.put("msg", "用户名格式不正确");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (newPassword == null || newPassword.isEmpty()) {
                result.put("success", false);
                result.put("msg", "新密码不能为空");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (newPassword.length() < 6) {
                result.put("success", false);
                result.put("msg", "密码长度至少6位");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (userDao.getUserByUsername(username) == null) {
                result.put("success", false);
                result.put("msg", "用户名不存在");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            boolean success = userDao.updatePassword(username, newPassword);

            if (success) {
                result.put("success", true);
                result.put("msg", "密码重置成功");
            } else {
                result.put("success", false);
                result.put("msg", "密码重置失败，请稍后重试");
            }

        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("msg", "服务器异常，请稍后再试");
        }

        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
