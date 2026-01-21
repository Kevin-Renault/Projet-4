package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class UserMapperTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    public void testMapperWithNull() {

        UserDto userDto = null;
        User user = null;
        List<UserDto> userDtoList = null;
        List<User> userList = null;

        assertThat(userMapper.toEntity(userDto)).isNull();
        assertThat(userMapper.toDto(user)).isNull();
        assertThat(userMapper.toEntity(userDtoList)).isNull();
        assertThat(userMapper.toDto(userList)).isNull();

    }

    @Test

    public void testToEntityList() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        UserDto dto1 = new UserDto(1L, "user1@example.com", "Doe", "John", false, "password1", now, now);
        UserDto dto2 = new UserDto(2L, "user2@example.com", "Smith", "Jane", true, "password2", now, now);
        List<UserDto> dtoList = Arrays.asList(dto1, dto2);

        // When
        List<User> entityList = userMapper.toEntity(dtoList);

        // Then
        assertThat(entityList).hasSize(2);
        User entity1 = entityList.get(0);
        assertThat(entity1.getId()).isEqualTo(1L);
        assertThat(entity1.getEmail()).isEqualTo("user1@example.com");
        assertThat(entity1.getLastName()).isEqualTo("Doe");
        assertThat(entity1.getFirstName()).isEqualTo("John");
        assertThat(entity1.isAdmin()).isFalse();
        assertThat(entity1.getPassword()).isEqualTo("password1");
        assertThat(entity1.getCreatedAt()).isEqualTo(now);
        assertThat(entity1.getUpdatedAt()).isEqualTo(now);

        User entity2 = entityList.get(1);
        assertThat(entity2.getId()).isEqualTo(2L);
        assertThat(entity2.getEmail()).isEqualTo("user2@example.com");
        assertThat(entity2.getLastName()).isEqualTo("Smith");
        assertThat(entity2.getFirstName()).isEqualTo("Jane");
        assertThat(entity2.isAdmin()).isTrue();
        assertThat(entity2.getPassword()).isEqualTo("password2");
        assertThat(entity2.getCreatedAt()).isEqualTo(now);
        assertThat(entity2.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    public void testToDtoList() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        User entity1 = User.builder()
                .id(1L)
                .email("user1@example.com")
                .lastName("Doe")
                .firstName("John")
                .admin(false)
                .password("password1")
                .createdAt(now)
                .updatedAt(now)
                .build();
        User entity2 = User.builder()
                .id(2L)
                .email("user2@example.com")
                .lastName("Smith")
                .firstName("Jane")
                .admin(true)
                .password("password2")
                .createdAt(now)
                .updatedAt(now)
                .build();
        List<User> entityList = Arrays.asList(entity1, entity2);

        // When
        List<UserDto> dtoList = userMapper.toDto(entityList);

        // Then
        assertThat(dtoList).hasSize(2);
        UserDto dto1 = dtoList.get(0);
        assertThat(dto1.getId()).isEqualTo(1L);
        assertThat(dto1.getEmail()).isEqualTo("user1@example.com");
        assertThat(dto1.getLastName()).isEqualTo("Doe");
        assertThat(dto1.getFirstName()).isEqualTo("John");
        assertThat(dto1.isAdmin()).isFalse();
        assertThat(dto1.getPassword()).isEqualTo("password1");
        assertThat(dto1.getCreatedAt()).isEqualTo(now);
        assertThat(dto1.getUpdatedAt()).isEqualTo(now);

        UserDto dto2 = dtoList.get(1);
        assertThat(dto2.getId()).isEqualTo(2L);
        assertThat(dto2.getEmail()).isEqualTo("user2@example.com");
        assertThat(dto2.getLastName()).isEqualTo("Smith");
        assertThat(dto2.getFirstName()).isEqualTo("Jane");
        assertThat(dto2.isAdmin()).isTrue();
        assertThat(dto2.getPassword()).isEqualTo("password2");
        assertThat(dto2.getCreatedAt()).isEqualTo(now);
        assertThat(dto2.getUpdatedAt()).isEqualTo(now);
    }
}