package com.openclassrooms.starterjwt.config;

import com.openclassrooms.starterjwt.models.User;

public class TestDataConfig {

    public static String INVALID_EMAIL = "invalidemail.com";

    static User simpleUser;
    static User adminUser;
    static User newUser;

    public static User getNewUser() {
        if (newUser == null) {
            newUser = new User();
            newUser.setEmail("newuser@example.com");
            newUser.setLastName("Smith");
            newUser.setFirstName("Jane");
            newUser.setPassword("password");
            newUser.setAdmin(false);
        }
        return newUser;
    }

    public static User getSimpleUser() {
        if (simpleUser == null) {
            simpleUser = new User();
            simpleUser.setEmail("test@example.com");
            simpleUser.setLastName("Doe");
            simpleUser.setFirstName("John");
            simpleUser.setPassword("password");
            simpleUser.setAdmin(false);
        }
        return simpleUser;
    }

    public static User getAdminUser() {
        if (adminUser == null) {
            adminUser = new User();
            adminUser.setEmail("testAdmin@example.com");
            adminUser.setLastName("Admin");
            adminUser.setFirstName("John");
            adminUser.setPassword("adminPassword");
            adminUser.setAdmin(true);
        }
        return adminUser;
    }

}
