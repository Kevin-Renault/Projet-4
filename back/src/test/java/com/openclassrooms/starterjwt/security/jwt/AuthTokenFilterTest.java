package com.openclassrooms.starterjwt.security.jwt;

import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AuthTokenFilterTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Test
    public void testDoFilterInternal_NoJwt() throws Exception {
        // Arrange : Simule une requête sans header Authorization
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert : Vérifie que la chaîne continue (pas d'exception)
        verify(filterChain).doFilter(request, response);
    }

    @Test
    public void testDoFilterInternal_InvalidJwt() throws Exception {
        // Arrange : Simule une requête avec header Authorization mais JWT invalide
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid.jwt.token");
        when(jwtUtils.validateJwtToken("invalid.jwt.token")).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert : Vérifie que la chaîne continue sans authentification
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils, never()).getUserNameFromJwtToken(anyString());
    }

    @Test
    public void testDoFilterInternal_InvalidAuthHeader() throws Exception {
        // Arrange : Simule une requête avec header Authorization qui n'est pas Bearer
        when(request.getHeader("Authorization")).thenReturn("Basic dXNlcjpwYXNz");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert : Vérifie que la chaîne continue sans authentification
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils, never()).validateJwtToken(anyString());
    }

    @Test
    public void testDoFilterInternal_ValidJwt() throws Exception {
        // Arrange : Simule une requête avec header Authorization et JWT valide
        when(request.getHeader("Authorization")).thenReturn("Bearer valid.jwt.token");
        when(jwtUtils.validateJwtToken("valid.jwt.token")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("valid.jwt.token")).thenReturn("testuser");
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("testuser").build();
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert : Vérifie que la chaîne continue et que l'authentification est définie
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils).getUserNameFromJwtToken("valid.jwt.token");
        verify(userDetailsService).loadUserByUsername("testuser");
    }
}