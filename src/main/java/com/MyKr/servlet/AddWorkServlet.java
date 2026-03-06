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
import com.MyKr.model.WorkAdmin;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/addWork")
public class AddWorkServlet extends HttpServlet {
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
            String name = (String) data.get("name");
            double score = Double.parseDouble(data.get("score").toString());
            String period = (String) data.get("period");
            String type = (String) data.get("type");
            WorkAdmin work = new WorkAdmin();
            work.setName(name);
            work.setScore((float) score);
            work.setPeriod(period);
            work.setType(type);
            workAdminDao.add(tableName, work);
            result.put("success", true);
            result.put("message", "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "服务器错误：" + e.getMessage());
        }
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
 