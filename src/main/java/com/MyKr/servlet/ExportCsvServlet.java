package com.MyKr.servlet;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URLEncoder;
import java.util.ArrayList;
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
import com.opencsv.CSVWriter;

@WebServlet("/exportCsv")
public class ExportCsvServlet extends HttpServlet {
    private WorkAdminDao workAdminDao = new WorkAdminDao();
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 获取用户对应的表名（与主页和top页保持一致）
        String tableName = TableUtil.getWorkTableName(req);
        
        List<WorkAdmin> list;
        
        // 检查是否有选中的作品ID
        String selectedIdsStr = req.getParameter("selectedIds");
        if (selectedIdsStr != null && !selectedIdsStr.isEmpty()) {
            // 导出选中的作品
            List<Integer> selectedIds = objectMapper.readValue(selectedIdsStr, List.class);
            list = workAdminDao.getWorksByIds(tableName, selectedIds);
        } else {
            // 导出筛选条件下的所有作品（原有逻辑）
            String keyword = req.getParameter("keyword");
            List<String> years = paramToList(req.getParameterValues("years[]"));
            List<String> seasons = paramToList(req.getParameterValues("seasons[]"));
            List<String> types = paramToList(req.getParameterValues("types[]"));
            Float minScore = req.getParameter("minScore") != null ? Float.parseFloat(req.getParameter("minScore")) : null;
            Float maxScore = req.getParameter("maxScore") != null ? Float.parseFloat(req.getParameter("maxScore")) : null;
            list = workAdminDao.searchWorks(tableName, keyword, years, seasons, types, minScore, maxScore);
        }
        
        resp.setContentType("text/csv;charset=UTF-8");
        resp.setCharacterEncoding("UTF-8");
        
        // 设置文件名，兼容中文
        String filename = "作品数据.csv";
        String encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
        resp.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename);
        
        // 写入BOM标记，确保Excel正确识别UTF-8编码
        resp.getOutputStream().write(0xEF);
        resp.getOutputStream().write(0xBB);
        resp.getOutputStream().write(0xBF);
        
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(resp.getOutputStream(), "UTF-8"), ',', '"', '\\', "\r\n")) {
            writer.writeNext(new String[]{"名称", "评分", "年份+季节", "类型"});
            for (WorkAdmin w : list) {
                // 评分为整数，年份+季节无空格
                String scoreStr = String.valueOf((int)w.getScore());
                String periodStr = w.getPeriod() != null ? w.getPeriod().replaceAll("\\s+", "") : "";
                writer.writeNext(new String[]{w.getName(), scoreStr, periodStr, w.getType()});
            }
        }
    }
    
    private List<String> paramToList(String[] arr) {
        List<String> list = new ArrayList<>();
        if (arr != null) {
            for (String s : arr) {
                if (s != null && !s.trim().isEmpty()) list.add(s);
            }
        }
        return list;
    }
} 