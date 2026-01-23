package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotAuthorizedException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testCreateUser_Success() {
        // Arrange
        User user = new User("test@example.com", "Doe", "John", "password", false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // Act
        userService.create(user);

        // Assert
        verify(userRepository).save(user);
    }

    @Test
    public void testCreateUser_EmailAlreadyTaken() {
        // Arrange
        User user = new User("test@example.com", "Doe", "John", "password", false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(BadRequestException.class, () -> userService.create(user));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testFindById_Success() {
        // Arrange
        User user = new User("test@example.com", "Doe", "John", "password", false);
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        User result = userService.findById(1L);

        // Assert
        assertEquals(user, result);
    }

    @Test
    public void testFindById_NotFound() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> userService.findById(1L));
    }

    @Test
    public void testFindByEmail() {
        // Arrange
        User user = new User("test@example.com", "Doe", "John", "password", false);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Act
        User result = userService.findByEmail("test@example.com");

        // Assert
        assertEquals(user, result);
    }

    @Test
    public void testDeleteUser_NotAuthorized() {
        // Arrange
        User user = new User("user@example.com", "Doe", "John", "password", false);
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("admin@example.com"); // Different email

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        try (MockedStatic<SecurityContextHolder> mockedStatic = mockStatic(SecurityContextHolder.class)) {
            mockedStatic.when(SecurityContextHolder::getContext).thenReturn(securityContext);

            // Act & Assert
            assertThrows(NotAuthorizedException.class, () -> userService.delete(1L));
            verify(userRepository, never()).deleteById(1L);
        }
    }
}