package com.MyKr.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.MyKr.model.User;

public class TableUtil {
    private static final String DEFAULT_TABLE_NAME = "work_admin";
    private static final String USERNAME_PATTERN = "^[A-Za-z0-9_]{3,32}$";

    private TableUtil() {
    }

    public static String getWorkTableName(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String tableName = DEFAULT_TABLE_NAME;

        if (session != null && session.getAttribute("user") != null) {
            User user = (User) session.getAttribute("user");
            tableName = getWorkTableName(user.getUsername());
        }

        return tableName;
    }

    public static String getWorkTableName(String username) {
        validateUsername(username);
        return "work_" + username.trim();
    }

    public static boolean isValidUsername(String username) {
        return username != null && username.trim().matches(USERNAME_PATTERN);
    }

    public static void validateUsername(String username) {
        if (!isValidUsername(username)) {
            throw new IllegalArgumentException("Username must be 3-32 chars and contain only letters, digits, or underscore.");
        }
    }
}
