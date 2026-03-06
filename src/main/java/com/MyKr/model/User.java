package com.MyKr.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户实体类，对应数据库中的user表
 * 
 * 数据流向：
 * - 数据来源：数据库user表，用户注册时创建
 * - 数据流出：通过UserDao传递给LoginServlet、RegisterServlet等
 * - 用途：存储用户登录信息，用于身份验证和用户管理
 * 
 * 字段说明：
 * - id: 主键，数据库自动生成，用于唯一标识用户
 * - username: 用户名，用于登录，要求唯一
 * - password: 密码，存储加密后的密码字符串
 * 
 * Lombok注解说明：
 * - @Data: 自动生成getter、setter、toString、equals、hashCode方法
 * - @NoArgsConstructor: 生成无参构造函数
 * - @AllArgsConstructor: 生成包含所有字段的构造函数
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private int id; // 主键，数据库自增ID，用于唯一标识用户
    private String username; // 用户名，用于登录，要求唯一，如"admin"、"user123"
    private String password; // 密码，存储加密后的密码字符串，如"e10adc3949ba59abbe56e057f20f883e"
} 