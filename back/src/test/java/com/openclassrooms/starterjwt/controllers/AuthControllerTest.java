package com.openclassrooms.starterjwt.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.openclassrooms.starterjwt.config.TestDataConfig;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class AuthControllerTest extends ControllerTest {

    @Test
    public void testRegisterUser() throws Exception {
        this.registerUser();
    }

    @Test
    public void testRegisterUserAlreadyExists() throws Exception {
        // Create a test user
        this.registerUser();
        userService.create(TestDataConfig.getSimpleUser());

        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(TestDataConfig.getSimpleUser().getEmail());
        signupRequest.setFirstName(TestDataConfig.getSimpleUser().getFirstName());
        signupRequest.setLastName(TestDataConfig.getSimpleUser().getLastName());
        signupRequest.setPassword(TestDataConfig.getSimpleUser().getPassword());

        // Act & Assert
        mockMvc.perform(post(REGISTER_PATH_STRING)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testRegisterUserWithInvalidData() throws Exception {

        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(TestDataConfig.INVALID_EMAIL);
        signupRequest.setFirstName(TestDataConfig.getSimpleUser().getFirstName());
        signupRequest.setLastName(TestDataConfig.getSimpleUser().getLastName());
        signupRequest.setPassword(TestDataConfig.getSimpleUser().getPassword());

        // Act & Assert
        mockMvc.perform(post(REGISTER_PATH_STRING)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAuthenticateExistedUser() throws Exception {
        this.loginUser();
    }

    @Test
    public void testAuthenticateNotExistedUser() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword(TestDataConfig.getSimpleUser().getPassword());

        // Mock authentication to fail
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        mockMvc.perform(post(LOGIN_PATH_STRING)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

}