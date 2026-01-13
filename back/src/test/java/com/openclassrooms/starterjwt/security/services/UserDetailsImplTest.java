package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    @Test
    public void testEquals_SameObject() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .build();

        // Act & Assert
        assertTrue(user.equals(user));
    }

    @Test
    public void testEquals_NullObject() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .build();

        // Act & Assert
        assertFalse(user.equals(null));
    }

    @Test
    public void testEquals_DifferentClass() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .build();

        // Act & Assert
        assertFalse(user.equals("string"));
    }

    @Test
    public void testEquals_SameId() {
        // Arrange
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("test1")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(1L)
                .username("test2")
                .build();

        // Act & Assert
        assertTrue(user1.equals(user2));
    }

    @Test
    public void testEquals_DifferentId() {
        // Arrange
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(2L)
                .username("test")
                .build();

        // Act & Assert
        assertFalse(user1.equals(user2));
    }

    @Test
    public void testEquals_NullId() {
        // Arrange
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(null)
                .username("test")
                .build();
        UserDetailsImpl user2 = UserDetailsImpl.builder()
                .id(1L)
                .username("test")
                .build();

        // Act & Assert
        assertFalse(user1.equals(user2));
    }
}