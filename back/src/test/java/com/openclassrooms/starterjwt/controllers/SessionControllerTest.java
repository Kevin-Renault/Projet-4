package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.config.TestDataConfig;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

public class SessionControllerTest extends ControllerTest {
        @Autowired
        private SessionMapper sessionMapper;

        @Test
        public void findById() throws Exception {
                JwtResponse loginResponse = this.loginUser();

                String token = loginResponse.getToken();
                Session sessionIndDB = createRandomSessions(1).get(0);
                // Appeler /api/user avec le token
                String response = mockMvc.perform(get(SESSION_PATH_STRING + "/" + sessionIndDB.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getContentAsString();

                SessionDto sessionDto = objectMapper.readValue(response, SessionDto.class);
                Session session = sessionMapper.toEntity(sessionDto);
                Assertions.assertAll(
                                () -> Assertions.assertEquals(sessionIndDB.getName(), session.getName()),
                                () -> Assertions.assertEquals(sessionIndDB.getDescription(), session.getDescription()),
                                () -> Assertions.assertEquals(sessionIndDB.getId(), session.getId()),
                                () -> Assertions.assertEquals(sessionIndDB.getDate(), session.getDate()),
                                () -> Assertions.assertTrue(
                                                sessionIndDB.getUsers().containsAll(session.getUsers()) &&
                                                                session.getUsers()
                                                                                .containsAll(sessionIndDB.getUsers())));
        }

        @Test
        public void deleteById() throws Exception {
                JwtResponse loginResponse = this.loginUser();

                String token = loginResponse.getToken();

                Session sessionIndDB = createRandomSessions(1).get(0);
                // Appeler /api/user avec le token
                mockMvc.perform(delete(SESSION_PATH_STRING + "/" + sessionIndDB.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk());
                mockMvc.perform(get(SESSION_PATH_STRING + "/" + sessionIndDB.getId())
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isNotFound());
        }

        @Test
        public void create() throws Exception {
                JwtResponse loginResponse = this.loginUser();

                String token = loginResponse.getToken();

                Session sessionIndDB = createRandomSessions(1).get(0);
                SessionDto sessionDto = sessionMapper.toDto(sessionIndDB);
                // Appeler /api/user avec le token

                String response = mockMvc.perform(post(SESSION_PATH_STRING)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sessionDto))
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getContentAsString();

                sessionDto = objectMapper.readValue(response, SessionDto.class);
                Session session = sessionMapper.toEntity(sessionDto);
                Assertions.assertAll(
                                () -> Assertions.assertEquals(sessionIndDB.getName(), session.getName()),
                                () -> Assertions.assertEquals(sessionIndDB.getDescription(),
                                                session.getDescription()),
                                () -> Assertions.assertEquals(sessionIndDB.getId(), session.getId()),
                                () -> Assertions.assertEquals(sessionIndDB.getDate(), session.getDate()),
                                () -> Assertions.assertTrue(
                                                sessionIndDB.getUsers().containsAll(session.getUsers()) &&
                                                                session.getUsers()
                                                                                .containsAll(sessionIndDB
                                                                                                .getUsers())));
        }

        @Test
        public void update() throws Exception {
                JwtResponse loginResponse = this.loginUser();

                String token = loginResponse.getToken();

                Session sessionIndDB = createRandomSessions(1).get(0);
                SessionDto sessionDto = sessionMapper.toDto(sessionIndDB);
                // Appeler /api/user avec le token
                sessionDto.setName(sessionDto.getName() + " - updated");
                String response = mockMvc.perform(put(SESSION_PATH_STRING + "/" + sessionIndDB.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sessionDto))
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getContentAsString();

                sessionDto = objectMapper.readValue(response, SessionDto.class);
                Session session = sessionMapper.toEntity(sessionDto);
                Assertions.assertAll(
                                () -> Assertions.assertEquals(sessionIndDB.getName() + " - updated",
                                                session.getName()),
                                () -> Assertions.assertEquals(sessionIndDB.getDescription(),
                                                session.getDescription()),
                                () -> Assertions.assertEquals(sessionIndDB.getId(), session.getId()),
                                () -> Assertions.assertEquals(sessionIndDB.getDate(), session.getDate()),
                                () -> Assertions.assertTrue(
                                                sessionIndDB.getUsers().containsAll(session.getUsers()) &&
                                                                session.getUsers()
                                                                                .containsAll(sessionIndDB
                                                                                                .getUsers())));
        }

        /**
         * Crée un nombre spécifié de teachers avec des noms aléatoires.
         * 
         * @param count Le nombre de teachers à créer (entre 2 et 10).
         * @return Une liste de teachers avec des noms aléatoires.
         */
        private List<Session> createRandomSessions(int count) {
                if (count < 1 || count > 10) {
                        throw new IllegalArgumentException("Le nombre doit être entre 2 et 10");
                }
                List<Session> sessions = new ArrayList<>();
                Random random = new Random();
                for (int i = 0; i < count; i++) {
                        Session session = new Session();

                        session.setCreatedAt(LocalDateTime.now());
                        session.setDate(new Date());
                        session.setDescription("Decription ostentatoire " + random.nextInt(1000));
                        Teacher teacher = new Teacher();
                        teacher.setFirstName("First" + random.nextInt(1000));
                        teacher.setLastName("Last" + random.nextInt(1000));
                        teacher = teacherRepository.save(teacher);
                        session.setTeacher(teacher);
                        session.setName("Nom sympa mais pas trop " + random.nextInt(1000));
                        session.setUsers(createRandomUser(random.nextInt(9) + 1));
                        session = sessionRepository.save(session);
                        sessions.add(session);
                }
                return sessions;
        }

        /**
         * Crée un nombre spécifié de users avec des noms aléatoires.
         * 
         * @param count Le nombre de users à créer (entre 1 et 10).
         * @return Une liste de users avec des noms aléatoires.
         */
        private List<User> createRandomUser(int count) {
                if (count < 1 || count > 10) {
                        throw new IllegalArgumentException("Le nombre doit être entre 1 et 10");
                }
                List<User> users = new ArrayList<>();
                Random random = new Random();
                for (int i = 0; i < count; i++) {
                        User user = new User();
                        user.setFirstName("First" + random.nextInt(1000));
                        user.setLastName("Last" + random.nextInt(1000));
                        user.setCreatedAt(LocalDateTime.now());
                        String email = UUID.randomUUID().toString() + "@example.com";
                        user.setEmail(email);
                        user.setPassword(TestDataConfig.getSimpleUser().getPassword());
                        user = userRepository.save(user);
                        users.add(user);
                }
                return users;
        }
}
