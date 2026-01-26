package com.openclassrooms.starterjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.config.TestDataConfig;
import com.openclassrooms.starterjwt.config.TestDatabaseConfig;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.BeforeEach;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@ContextConfiguration(classes = TestDatabaseConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ControllerTest {
        public static final String AUTH_PATH_STRING = "/api/auth";
        public static final String LOGIN_PATH_STRING = AUTH_PATH_STRING + "/login";
        public static final String REGISTER_PATH_STRING = AUTH_PATH_STRING + "/register";
        public static final String TEACHER_PATH_STRING = "/api/teacher";
        public static final String USER_PATH_STRING = "/api/user";
        public static final String SESSION_PATH_STRING = "/api/session";

        @Autowired
        protected TeacherRepository teacherRepository;

        @Autowired
        protected UserRepository userRepository;

        @Autowired
        protected SessionRepository sessionRepository;

        @Autowired
        protected MockMvc mockMvc;

        @MockBean
        protected AuthenticationManager authenticationManager;

        @MockBean
        protected JwtUtils jwtUtils;

        @MockBean
        protected PasswordEncoder passwordEncoder;

        @MockBean
        protected com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl userDetailsService;

        @Autowired
        protected UserService userService;

        @Autowired
        protected ObjectMapper objectMapper;

        @BeforeEach
        public void setupEach() {
                when(passwordEncoder.encode(anyString()))
                                .thenReturn("encoded" + TestDataConfig.getSimpleUser().getPassword());
                when(jwtUtils.validateJwtToken(anyString())).thenReturn(true);
                // Mock UserDetailsServiceImpl to return the correct UserDetailsImpl for the
                // username (email)
                org.mockito.Mockito.lenient()
                                .when(userDetailsService.loadUserByUsername(org.mockito.ArgumentMatchers.anyString()))
                                .thenAnswer(invocation -> {
                                        String email = invocation.getArgument(0);
                                        com.openclassrooms.starterjwt.models.User user = userRepository
                                                        .findByEmail(email).orElse(null);
                                        if (user == null)
                                                return null;
                                        return com.openclassrooms.starterjwt.security.services.UserDetailsImpl.builder()
                                                        .id(user.getId())
                                                        .username(user.getEmail())
                                                        .firstName(user.getFirstName())
                                                        .lastName(user.getLastName())
                                                        .admin(user.isAdmin())
                                                        .password(user.getPassword())
                                                        .build();
                                });
        }

        protected void registerUser() throws Exception {

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

        protected JwtResponse loginSimpleUser() throws Exception {
                User testUser = TestDataConfig.getSimpleUser();
                return this.loginUser(testUser);
        }

        protected JwtResponse loginAdminUser() throws Exception {
                User testUser = TestDataConfig.getAdminUser();
                return this.loginUser(testUser);
        }

        private JwtResponse loginUser(User user) throws Exception {
                user.setId(null);
                userService.create(user);

                // Recharge l'utilisateur depuis la base pour avoir l'id et admin corrects
                User userFromDb = userService.findByEmail(user.getEmail());

                // Arrange
                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail(userFromDb.getEmail());
                loginRequest.setPassword(userFromDb.getPassword());

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                                new UserDetailsImpl(userFromDb.getId(), userFromDb.getEmail(),
                                                userFromDb.getFirstName(),
                                                userFromDb.getLastName(),
                                                userFromDb.isAdmin(), userFromDb.getPassword()),
                                null);

                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(authentication);
                when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
                // Mock dynamique pour matcher l'utilisateur courant
                when(jwtUtils.getUserNameFromJwtToken(anyString())).thenReturn(userFromDb.getEmail());
                // Act & Assert
                String response = mockMvc.perform(post(LOGIN_PATH_STRING)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").value("jwt-token"))
                                .andExpect(jsonPath("$.id").value(userFromDb.getId()))
                                .andExpect(jsonPath("$.username").value(userFromDb.getEmail()))
                                .andExpect(jsonPath("$.firstName").value(userFromDb.getFirstName()))
                                .andExpect(jsonPath("$.lastName").value(userFromDb.getLastName()))
                                .andExpect(jsonPath("$.admin").value(userFromDb.isAdmin()))
                                .andReturn().getResponse().getContentAsString();
                JwtResponse jwtResponse = objectMapper.readValue(response, JwtResponse.class);
                // Ajout pour que le principal soit bien dans le SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return jwtResponse;
        }
}
