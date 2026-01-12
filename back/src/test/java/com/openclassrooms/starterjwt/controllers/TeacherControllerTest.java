package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;

import io.jsonwebtoken.lang.Arrays;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Random;

public class TeacherControllerTest extends ControllerTest {
    @Autowired
    private TeacherMapper teacherMapper;

    @Test
    public void findById() throws Exception {
        String token = this.loginUser().getToken();

        // Créer un teacher en DB
        Teacher teacher = new Teacher();
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        Teacher savedTeacher = teacherRepository.save(teacher);

        // Appeler /api/teacher/{id} avec le token (optionnel, mais pour end-to-end)
        mockMvc.perform(get(TEACHER_PATH_STRING + "/" + savedTeacher.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    public void findByIdNotFound() throws Exception {
        String token = this.loginUser().getToken();
        // Appeler /api/teacher/{id} avec le token (optionnel, mais pour end-to-end)
        mockMvc.perform(get(TEACHER_PATH_STRING + "/" + 65148546)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    public void findAll() throws Exception {
        String token = this.loginUser().getToken();

        // Créer des teachers en DB
        List<Teacher> teachersToSave = createRandomTeachers(7);

        List<Teacher> savedTeachers = new ArrayList<>();
        for (Teacher teacher : teachersToSave) {
            savedTeachers.add(teacherRepository.save(teacher));
        }

        // Appeler /api/teacher avec le token
        String response = mockMvc.perform(get(TEACHER_PATH_STRING)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extraire le tableau d'objets et boucler dessus
        TeacherDto[] teachers = objectMapper.readValue(response, TeacherDto[].class);

        List<Teacher> teacherList = teacherMapper.toEntity(Arrays.asList(teachers));
        // Comparaison : vérifier que les listes contiennent les mêmes éléments
        // (sans ordre)
        Assertions.assertEquals(savedTeachers.size(), teacherList.size());
        Assertions.assertTrue(teacherList.containsAll(savedTeachers),
                "La liste retournée doit contenir tous les enseignants sauvegardés");
        Assertions.assertTrue(savedTeachers.containsAll(teacherList),
                "Les enseignants sauvegardés doivent être tous présents dans la réponse");
        // Si A contient tous les éléments de B et B contient tous les éléments de A,
        // alors A == B
    }

    /**
     * Crée un nombre spécifié de teachers avec des noms aléatoires.
     * 
     * @param count Le nombre de teachers à créer (entre 2 et 10).
     * @return Une liste de teachers avec des noms aléatoires.
     */
    private List<Teacher> createRandomTeachers(int count) {
        if (count < 2 || count > 10) {
            throw new IllegalArgumentException("Le nombre doit être entre 2 et 10");
        }
        List<Teacher> teachers = new ArrayList<>();
        Random random = new Random();
        for (int i = 0; i < count; i++) {
            Teacher teacher = new Teacher();
            teacher.setFirstName("First" + random.nextInt(1000));
            teacher.setLastName("Last" + random.nextInt(1000));
            teachers.add(teacher);
        }
        return teachers;
    }
}
