package com.MyKr.util;

import org.junit.Assert;
import org.junit.Test;

public class PasswordUtilTest {

    @Test
    public void shouldHashPasswordWithPrefix() {
        String hashed = PasswordUtil.hashPassword("admin123");
        Assert.assertTrue(hashed.startsWith("{SHA-256}"));
        Assert.assertNotEquals("admin123", hashed);
    }

    @Test
    public void shouldMatchHashedPassword() {
        String hashed = PasswordUtil.hashPassword("admin123");
        Assert.assertTrue(PasswordUtil.matches("admin123", hashed));
    }

    @Test
    public void shouldMatchLegacyPlainPassword() {
        Assert.assertTrue(PasswordUtil.matches("admin123", "admin123"));
    }
}
