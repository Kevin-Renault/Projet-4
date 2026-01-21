package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class SessionMapperTest {

    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    @Test
    public void testMapperWithNull() {
        // Test that the mapper handles null inputs correctly by returning null
        SessionDto sessionDto = null;
        Session session = null;
        List<SessionDto> sessionDtoList = null;
        List<Session> sessionList = null;

        assertThat(sessionMapper.toEntity(sessionDto)).isNull();
        assertThat(sessionMapper.toDto(session)).isNull();
        assertThat(sessionMapper.toEntity(sessionDtoList)).isNull();
        assertThat(sessionMapper.toDto(sessionList)).isNull();

    }

}