package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotAuthorizedException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import java.util.Objects;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void create(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Error: Email is already taken!");
        }
        this.userRepository.save(user);
    }

    public void delete(Long id) {
        User user = this.findById(Long.valueOf(id));
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        if (!Objects.equals(userDetails.getUsername(), user.getEmail())) {
            throw new NotAuthorizedException();
        }
        this.userRepository.deleteById(id);
    }

    public User findById(Long id) {
        User user = this.userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new NotFoundException();
        }
        return user;
    }

    public User findByEmail(String email) {
        User user = this.userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new NotFoundException();
        }
        return user;
    }
}
