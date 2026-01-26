package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTest extends ControllerTest {
        @Autowired
        private UserMapper userMapper;

        @Test
        public void findById() throws Exception {
                JwtResponse loginResponse = this.loginSimpleUser();

                String token = loginResponse.getToken();

                // Appeler /api/user avec le token
                String response = mockMvc.perform(get(USER_PATH_STRING + "/" + loginResponse.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getContentAsString();

                UserDto userDto = objectMapper.readValue(response, UserDto.class);
                // TODO: corriger cette erreur
                userDto.setPassword("password");
                User user = userMapper.toEntity(userDto);
                Assertions.assertAll(
                                () -> Assertions.assertEquals(loginResponse.getUsername(), user.getEmail()),
                                () -> Assertions.assertEquals(loginResponse.getAdmin(), user.isAdmin()),
                                () -> Assertions.assertEquals(loginResponse.getId(), user.getId()),
                                () -> Assertions.assertEquals(loginResponse.getFirstName(), user.getFirstName()),
                                () -> Assertions.assertEquals(loginResponse.getLastName(), user.getLastName()));
        }

        @Test
        public void deleteById() throws Exception {
                JwtResponse loginResponse = this.loginSimpleUser();

                String token = loginResponse.getToken();

                // Appeler /api/user avec le token
                mockMvc.perform(delete(USER_PATH_STRING + "/" + loginResponse.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk());

                // Appeler /api/user avec le token
                mockMvc.perform(get(USER_PATH_STRING + "/" + loginResponse.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isUnauthorized());

        }
}
