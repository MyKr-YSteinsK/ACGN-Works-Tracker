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

/**
 * 作品更新Servlet，处理作品信息的修改请求
 * 
 * 访问路径：/updateWork
 * 请求方式：POST
 * 内容类型：application/json
 * 
 * 数据流向：
 * - 输入：前端AJAX请求，携带JSON格式的作品信息
 * - 处理：解析JSON数据，根据作品类型调用对应的DAO更新数据库
 * - 输出：返回JSON格式的操作结果（成功/失败）
 * 
 * 功能说明：
 * - 支持四种作品类型的更新：动画、漫画、游戏、小说
 * - 根据type字段判断作品类型，调用对应的DAO方法
 * - 返回统一的操作结果格式
 * 
 * 技术实现：
 * - 使用@WebServlet注解配置访问路径
 * - 使用Jackson库进行JSON反序列化和序列化
 * - 使用Map存储操作结果
 * - 使用try-with-resources读取请求体
 * - 统一的异常处理机制
 */
@WebServlet("/updateWork")
public class UpdateWorkServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 处理POST请求，更新作品信息
     * 
     * @param request HTTP请求对象，包含JSON格式的作品数据
     * @param response HTTP响应对象，用于返回操作结果
     * 
     * 处理流程：
     * 1. 设置请求和响应的字符编码
     * 2. 读取请求体中的JSON数据
     * 3. 使用ObjectMapper解析JSON为Map对象
     * 4. 提取作品信息（id、name、score、period、type）
     * 5. 根据type字段判断作品类型
     * 6. 创建对应的实体对象并设置属性
     * 7. 调用对应的DAO方法更新数据库
     * 8. 返回操作结果（成功/失败）
     * 
     * JSON数据格式示例：
     * {
     *   "id": 1,
     *   "name": "进击的巨人",
     *   "score": 48,
     *   "period": "2024春",
     *   "type": 0
     * }
     * 
     * 返回结果格式：
     * 成功：{"success": true, "message": "更新成功"}
     * 失败：{"success": false, "message": "错误信息"}
     */
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
            int id = Integer.parseInt(data.get("id").toString());
            String name = (String) data.get("name");
            float score = Float.parseFloat(data.get("score").toString());
            String period = (String) data.get("period");
            String type = data.get("type").toString();
            WorkAdmin work = new WorkAdmin(id, name, score, period, type);
            boolean success = workAdminDao.update(tableName, work);
            if (success) {
                result.put("success", true);
                result.put("message", "更新成功");
            } else {
                result.put("success", false);
                result.put("message", "更新失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "服务器错误：" + e.getMessage());
        }
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
} 