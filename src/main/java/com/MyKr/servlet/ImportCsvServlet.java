package com.MyKr.servlet;

import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.MyKr.util.DBUtil;
import com.MyKr.util.TableUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;

@WebServlet("/importCsv")
@MultipartConfig
public class ImportCsvServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        ObjectMapper mapper = new ObjectMapper();
        
        // 获取用户对应的表名（与主页和top页保持一致）
        String tableName = TableUtil.getWorkTableName(req);
        boolean allSuccess = true;
        String errorMessage = "";
        
        try (Connection conn = DBUtil.getConnection()) {
            conn.setAutoCommit(false);
            
            // 读取CSV文件
            Part filePart = req.getPart("file");
            if (filePart == null) {
                resp.getWriter().write("{\"success\":false,\"message\":\"未找到上传的文件\"}");
                return;
            }
            
            // 插入新作品
            String insertSql = "INSERT INTO " + tableName + " (name, score, period, type) VALUES (?, ?, ?, ?)";
            try (CSVReader reader = new CSVReader(new InputStreamReader(filePart.getInputStream(), "UTF-8"));
                 PreparedStatement ps = conn.prepareStatement(insertSql)) {
                
                String[] line;
                int lineNumber = 0;
                while ((line = reader.readNext()) != null) {
                    lineNumber++;
                    // 跳过标题行
                    if (lineNumber == 1) continue;
                    
                    if (line.length < 4) {
                        errorMessage += "第" + lineNumber + "行数据不完整; ";
                        allSuccess = false;
                        continue;
                    }
                    
                    try {
                        ps.setString(1, line[0].trim()); // name
                        ps.setInt(2, Integer.parseInt(line[1].trim())); // score
                        ps.setString(3, line[2].trim()); // period
                        ps.setString(4, line[3].trim()); // type
                        ps.addBatch();
                    } catch (NumberFormatException e) {
                        errorMessage += "第" + lineNumber + "行评分格式错误; ";
                        allSuccess = false;
                    } catch (Exception e) {
                        errorMessage += "第" + lineNumber + "行数据错误; ";
                        allSuccess = false;
                    }
                }
                
                if (allSuccess) {
                    ps.executeBatch();
                    conn.commit();
                }
            }
        } catch (Exception e) {
            allSuccess = false;
            errorMessage = "数据库操作失败: " + e.getMessage();
            e.printStackTrace();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", allSuccess);
        if (!allSuccess && !errorMessage.isEmpty()) {
            result.put("message", errorMessage);
        }
        resp.getWriter().write(mapper.writeValueAsString(result));
    }
} 