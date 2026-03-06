package com.MyKr.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBUtil {
    private static final String DRIVER_KEY = "driver";
    private static final String URL_KEY = "url";
    private static final String USERNAME_KEY = "username";
    private static final String PASSWORD_KEY = "password";

    private static String driver;
    private static String url;
    private static String username;
    private static String password;

    static {
        try {
            Properties properties = new Properties();
            try (InputStream inputStream = DBUtil.class.getClassLoader().getResourceAsStream("db.properties")) {
                if (inputStream == null) {
                    throw new IllegalStateException("Missing db.properties in classpath");
                }
                properties.load(inputStream);
            }

            driver = resolveProperty(properties, DRIVER_KEY, "ACGN_DB_DRIVER");
            url = resolveProperty(properties, URL_KEY, "ACGN_DB_URL");
            username = resolveProperty(properties, USERNAME_KEY, "ACGN_DB_USERNAME");
            password = resolveProperty(properties, PASSWORD_KEY, "ACGN_DB_PASSWORD");

            Class.forName(driver);
        } catch (Exception e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    private DBUtil() {
    }

    private static String resolveProperty(Properties properties, String propertyKey, String envKey) {
        String systemValue = System.getProperty("acgn.db." + propertyKey);
        if (systemValue != null && !systemValue.trim().isEmpty()) {
            return systemValue.trim();
        }

        String envValue = System.getenv(envKey);
        if (envValue != null && !envValue.trim().isEmpty()) {
            return envValue.trim();
        }

        String propertyValue = properties.getProperty(propertyKey);
        if (propertyValue == null || propertyValue.trim().isEmpty()) {
            throw new IllegalStateException("Missing database config: " + propertyKey);
        }
        return propertyValue.trim();
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}
