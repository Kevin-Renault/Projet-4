package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    public void testMapperWithNull() {
        // Test that the mapper handles null inputs correctly by returning null
        TeacherDto teacherDto = null;
        Teacher teacher = null;
        List<TeacherDto> teacherDtoList = null;
        List<Teacher> teacherList = null;

        assertThat(teacherMapper.toEntity(teacherDto)).isNull();
        assertThat(teacherMapper.toDto(teacher)).isNull();
        assertThat(teacherMapper.toEntity(teacherDtoList)).isNull();
        assertThat(teacherMapper.toDto(teacherList)).isNull();
    }
}