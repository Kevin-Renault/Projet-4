package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.repository.SessionRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Spy
    @InjectMocks
    private SessionService sessionService;

    @Test
    public void testDeleteSessionNotFound() {
        // Arrange
        Long nonExistentId = 999L;
        doReturn(null).when(sessionService).getById(nonExistentId);

        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            sessionService.delete(nonExistentId);
        });
    }
}