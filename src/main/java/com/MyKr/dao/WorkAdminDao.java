package com.MyKr.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.MyKr.model.WorkAdmin;
import com.MyKr.util.DBUtil;

public class WorkAdminDao {
    // 查询指定 period 和 type 的作品列表
    public List<WorkAdmin> findByPeriodAndType(String tableName, String period, String type, String sort) {
        List<WorkAdmin> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM " + tableName + " WHERE period = ?");
        if (type != null && !type.equalsIgnoreCase("ALL")) {
            sql.append(" AND type = ?");
        }
        
        // 添加排序
        if ("time_desc".equals(sort)) {
            sql.append(" ORDER BY id DESC"); // 时间倒序：按id降序
        } else {
            sql.append(" ORDER BY id ASC"); // 时间顺序：按id升序（自然添加顺序）
        }
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            ps.setString(1, period);
            if (type != null && !type.equalsIgnoreCase("ALL")) {
                ps.setString(2, type);
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    WorkAdmin work = new WorkAdmin(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getFloat("score"),
                        rs.getString("period"),
                        rs.getString("type")
                    );
                    list.add(work);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // 添加新作品
    public boolean add(String tableName, WorkAdmin work) {
        String sql = "INSERT INTO " + tableName + " (name, score, period, type) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, work.getName());
            ps.setFloat(2, work.getScore());
            ps.setString(3, work.getPeriod());
            ps.setString(4, work.getType());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 更新作品
    public boolean update(String tableName, WorkAdmin work) {
        String sql = "UPDATE " + tableName + " SET name=?, score=?, period=?, type=? WHERE id=?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, work.getName());
            ps.setFloat(2, work.getScore());
            ps.setString(3, work.getPeriod());
            ps.setString(4, work.getType());
            ps.setInt(5, work.getId());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 删除作品
    public boolean delete(String tableName, int id) {
        String sql = "DELETE FROM " + tableName + " WHERE id=?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 获取所有年份
    public List<String> getAllYears(String tableName) {
        List<String> years = new ArrayList<>();
        String sql = "SELECT DISTINCT SUBSTRING(period, 1, 4) as year FROM " + tableName + " ORDER BY year DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                years.add(rs.getString("year"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return years;
    }

    // 搜索作品
    public List<WorkAdmin> searchWorks(String tableName, String keyword, List<String> years, 
                                     List<String> seasons, List<String> types, 
                                     Float minScore, Float maxScore) {
        List<WorkAdmin> results = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM " + tableName + " WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        // 关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append(" AND name LIKE ?");
            params.add("%" + keyword.trim() + "%");
        }
        
        // 年份+季节组合筛选
        if (years != null && !years.isEmpty() && seasons != null && !seasons.isEmpty()) {
            sql.append(" AND (");
            boolean first = true;
            for (String year : years) {
                for (String season : seasons) {
                    if (!first) sql.append(" OR ");
                    sql.append("period = ?");
                    params.add(year + season);
                    first = false;
                }
            }
            sql.append(")");
        } else {
            // 仅年份筛选
            if (years != null && !years.isEmpty()) {
                sql.append(" AND (");
                for (int i = 0; i < years.size(); i++) {
                    if (i > 0) sql.append(" OR ");
                    sql.append("period LIKE ?");
                    params.add(years.get(i) + "%");
                }
                sql.append(")");
            }
            // 仅季节筛选
            if (seasons != null && !seasons.isEmpty()) {
                sql.append(" AND (");
                for (int i = 0; i < seasons.size(); i++) {
                    if (i > 0) sql.append(" OR ");
                    sql.append("SUBSTRING(period, 5) = ?");
                    params.add(seasons.get(i).trim());
                }
                sql.append(")");
            }
        }
        
        // 类型筛选
        if (types != null && !types.isEmpty()) {
            sql.append(" AND (");
            for (int i = 0; i < types.size(); i++) {
                if (i > 0) sql.append(" OR ");
                sql.append("type = ?");
                params.add(types.get(i));
            }
            sql.append(")");
        }
        
        // 评分范围筛选
        if (minScore != null) {
            sql.append(" AND score >= ?");
            params.add(minScore);
        }
        if (maxScore != null) {
            sql.append(" AND score <= ?");
            params.add(maxScore);
        }
        
        // 修改排序逻辑：先按period（年份升序，季节按春夏秋冬顺序），再按id升序
        sql.append(" ORDER BY SUBSTRING(period, 1, 4) ASC, FIELD(SUBSTRING(period, 5), '春', '夏', '秋', '冬'), id ASC");
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            // 设置参数
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    WorkAdmin work = new WorkAdmin(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getFloat("score"),
                        rs.getString("period"),
                        rs.getString("type")
                    );
                    results.add(work);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return results;
    }

    // 批量删除作品
    public boolean batchDelete(String tableName, List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return false;
        StringBuilder sql = new StringBuilder("DELETE FROM " + tableName + " WHERE id IN (");
        for (int i = 0; i < ids.size(); i++) {
            if (i > 0) sql.append(",");
            sql.append("?");
        }
        sql.append(")");
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            conn.setAutoCommit(false);
            for (int i = 0; i < ids.size(); i++) {
                ps.setInt(i + 1, ids.get(i));
            }
            int affected = ps.executeUpdate();
            conn.commit();
            return affected == ids.size();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 根据ID列表获取作品
    public List<WorkAdmin> getWorksByIds(String tableName, List<Integer> ids) {
        List<WorkAdmin> results = new ArrayList<>();
        if (ids == null || ids.isEmpty()) return results;
        
        StringBuilder sql = new StringBuilder("SELECT * FROM " + tableName + " WHERE id IN (");
        for (int i = 0; i < ids.size(); i++) {
            if (i > 0) sql.append(",");
            sql.append("?");
        }
        sql.append(") ORDER BY id ASC");
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < ids.size(); i++) {
                ps.setInt(i + 1, ids.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    WorkAdmin work = new WorkAdmin(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getFloat("score"),
                        rs.getString("period"),
                        rs.getString("type")
                    );
                    results.add(work);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return results;
    }
} 