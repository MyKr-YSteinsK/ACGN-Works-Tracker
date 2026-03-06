package com.MyKr.servlet;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;

@WebServlet("/importCsvPreview")
@MultipartConfig
public class ImportCsvPreviewServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        List<Map<String, String>> previewList = new ArrayList<>();
        try {
            Part filePart = req.getPart("csvFile");
            if (filePart == null) {
                resp.getWriter().write("[]");
                return;
            }
            try (CSVReader reader = new CSVReader(new InputStreamReader(filePart.getInputStream(), "UTF-8"))) {
                String[] line;
                while ((line = reader.readNext()) != null) {
                    if (line.length < 4) continue;
                    Map<String, String> row = new HashMap<>();
                    row.put("name", line[0]);
                    row.put("score", line[1]);
                    row.put("period", line[2]);
                    row.put("type", line[3]);
                    previewList.add(row);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        resp.getWriter().write(new ObjectMapper().writeValueAsString(previewList));
    }
} 