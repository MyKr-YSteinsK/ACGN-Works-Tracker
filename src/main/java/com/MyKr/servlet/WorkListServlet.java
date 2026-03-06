package com.MyKr.servlet;

import java.io.IOException;
import java.util.List;

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
 * 统一的ACGN作品列表Servlet，支持 period/type 查询
 * 路径：/work/list
 * 请求方式：GET
 * 参数：period（必填），type（可选，ALL为全部），sort（可选，time_desc为时间倒序）
 */
@WebServlet("/work/list")
public class WorkListServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String period = req.getParameter("period");
        String type = req.getParameter("type"); // 可为null或ALL
        String sort = req.getParameter("sort"); // 排序方式：time_desc为时间倒序，其他为时间顺序
        
        // 简单调试信息
        System.out.println("WorkListServlet - period: " + period + ", type: " + type + ", sort: " + sort);
        
        if (period == null || period.trim().isEmpty()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"period参数必填\"}");
            return;
        }
        String tableName = TableUtil.getWorkTableName(req);
        System.out.println("WorkListServlet - tableName: " + tableName);
        
        List<WorkAdmin> list = workAdminDao.findByPeriodAndType(tableName, period, type, sort);
        System.out.println("WorkListServlet - result count: " + (list != null ? list.size() : "null"));
        
        resp.setContentType("application/json;charset=UTF-8");
        objectMapper.writeValue(resp.getWriter(), list);
    }
} 