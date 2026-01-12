package com.openclassrooms.starterjwt.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.config.TestDataConfig;
import com.openclassrooms.starterjwt.config.TestDatabaseConfig;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;

import org.junit.Before;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@ContextConfiguration(classes = TestDatabaseConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class AuthControllerTest {

    public static final String AUTH_PATH_STRING = "/api/auth";
    public static final String LOGIN_PATH_STRING = AUTH_PATH_STRING + "/login";
    public static final String REGISTER_PATH_STRING = AUTH_PATH_STRING + "/register";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setupEach() {
        when(passwordEncoder.encode(anyString())).thenReturn("encoded" + TestDataConfig.getSimpleUser().getPassword());
    }

    @Test
    public void testRegisterUser() throws Exception {

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(TestDataConfig.getNewUser().getEmail());
        signupRequest.setFirstName(TestDataConfig.getNewUser().getFirstName());
        signupRequest.setLastName(TestDataConfig.getNewUser().getLastName());
        signupRequest.setPassword(TestDataConfig.getNewUser().getPassword());

        // Act & Assert
        mockMvc.perform(post(REGISTER_PATH_STRING)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testRegisterUserAlreadyExists() throws Exception {

        // Create a test user
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
        // Create a test user
        User testUser = TestDataConfig.getSimpleUser();
        testUser.setId(null);
        userService.create(testUser);

        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TestDataConfig.getSimpleUser().getEmail());
        loginRequest.setPassword(TestDataConfig.getSimpleUser().getPassword());

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new UserDetailsImpl(testUser.getId(), TestDataConfig.getSimpleUser().getEmail(),
                        TestDataConfig.getSimpleUser().getFirstName(), TestDataConfig.getSimpleUser().getLastName(),
                        false, TestDataConfig.getSimpleUser().getPassword()),
                null);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");

        // Act & Assert
        mockMvc.perform(post(LOGIN_PATH_STRING)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value(TestDataConfig.getSimpleUser().getEmail()))
                .andExpect(jsonPath("$.firstName").value(TestDataConfig.getSimpleUser().getFirstName()))
                .andExpect(jsonPath("$.lastName").value(TestDataConfig.getSimpleUser().getLastName()))
                .andExpect(jsonPath("$.admin").value(TestDataConfig.getSimpleUser().isAdmin()));

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