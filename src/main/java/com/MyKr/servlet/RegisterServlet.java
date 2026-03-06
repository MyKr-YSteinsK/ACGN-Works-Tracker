package com.MyKr.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.MyKr.dao.UserDao;
import com.MyKr.model.User;
import com.MyKr.util.DBUtil;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private final UserDao userDao = new UserDao();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        Map<String, Object> result = new HashMap<>();

        try {
            username = username == null ? null : username.trim();
            password = password == null ? null : password.trim();

            if (username == null || username.isEmpty()) {
                result.put("success", false);
                result.put("msg", "用户名不能为空");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (!TableUtil.isValidUsername(username)) {
                result.put("success", false);
                result.put("msg", "用户名只能包含字母、数字或下划线，长度为3到32位");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (password == null || password.isEmpty()) {
                result.put("success", false);
                result.put("msg", "密码不能为空");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            if (password.length() < 6) {
                result.put("success", false);
                result.put("msg", "密码长度至少6位");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            User existingUser = userDao.getUserByUsername(username);
            if (existingUser != null) {
                result.put("success", false);
                result.put("msg", "用户名已存在");
                response.getWriter().write(objectMapper.writeValueAsString(result));
                return;
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(password);

            boolean success = userDao.addUser(newUser);

            if (success) {
                createUserWorkTable(newUser.getUsername());
                result.put("success", true);
                result.put("msg", "注册成功");
            } else {
                result.put("success", false);
                result.put("msg", "注册失败，请稍后重试");
            }

        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("msg", "服务器异常，请稍后再试");
        }

        response.getWriter().write(objectMapper.writeValueAsString(result));
    }

    private void createUserWorkTable(String username) {
        String tableName = TableUtil.getWorkTableName(username);
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + tableName + " ("
                + "id INT PRIMARY KEY AUTO_INCREMENT,"
                + "name VARCHAR(255) NOT NULL,"
                + "score INT NOT NULL,"
                + "period VARCHAR(32) NOT NULL,"
                + "type VARCHAR(16) NOT NULL"
                + ")";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(createTableSql)) {
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
