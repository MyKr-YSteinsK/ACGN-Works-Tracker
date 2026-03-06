package com.MyKr.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.MyKr.dao.WorkAdminDao;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/deleteWork")
public class DeleteWorkServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> result = new HashMap<>();
        try {
            String tableName = TableUtil.getWorkTableName(request);
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String jsonData = sb.toString();
            Map<String, Object> data = objectMapper.readValue(jsonData, Map.class);
            if (data.containsKey("ids")) {
                // 批量删除
                java.util.List<Integer> ids = (java.util.List<Integer>) data.get("ids");
                boolean success = workAdminDao.batchDelete(tableName, ids);
                if (success) {
                    result.put("success", true);
                    result.put("message", "批量删除成功");
                } else {
                    result.put("success", false);
                    result.put("message", "批量删除失败");
                }
            } else {
            int id = Integer.parseInt(data.get("id").toString());
            // type 字段可选，WorkAdminDao 只需 id
            boolean success = workAdminDao.delete(tableName, id);
            if (success) {
                result.put("success", true);
                result.put("message", "删除成功");
            } else {
                result.put("success", false);
                result.put("message", "删除失败");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "服务器错误：" + e.getMessage());
        }
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
} 