package com.MyKr.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一的ACGN作品实体类，支持多用户独立表（work_用户名）
 * type字段为：Anime、Comic、Novel、Game
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkAdmin {
    private int id;         // 主键，自增ID
    private String name;    // 作品名称
    private float score;    // 评分
    private String period;  // 年份+季节，如2024春
    private String type;    // 类型：Anime/Comic/Novel/Game
} 