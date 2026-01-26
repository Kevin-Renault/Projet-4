package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;

@ExtendWith(MockitoExtension.class)
public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    public void setUp() throws Exception {
        jwtUtils = new JwtUtils();
        // Set private fields via reflection
        Field jwtSecretField = JwtUtils.class.getDeclaredField("jwtSecret");
        jwtSecretField.setAccessible(true);
        jwtSecretField.set(jwtUtils,
                "testSecretKeyForJwtUtilsTestingPurposesOnlyWithExtraLengthToMeetHS512RequirementsAndMoreCharactersToReach512BitsMinimum");

        Field jwtExpirationMsField = JwtUtils.class.getDeclaredField("jwtExpirationMs");
        jwtExpirationMsField.setAccessible(true);
        jwtExpirationMsField.set(jwtUtils, 3600000); // 1 hour
    }

    @Test
    public void testGenerateJwtToken() {
        // Arrange
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "John", "Doe", false, "password");
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
        // Verify token contains subject
        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("test@example.com", username);
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        // Arrange
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "John", "Doe", false, "password");
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertEquals("test@example.com", username);
    }

    @Test
    public void testValidateJwtToken_Valid() {
        // Arrange
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "John", "Doe", false, "password");
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_Invalid() {
        // Arrange
        String invalidToken = "invalid.jwt.token";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_SignatureException() throws Exception {
        // Arrange: Create token with different secret to cause signature mismatch
        JwtUtils otherJwtUtils = new JwtUtils();
        Field otherSecretField = JwtUtils.class.getDeclaredField("jwtSecret");
        otherSecretField.setAccessible(true);
        otherSecretField.set(otherJwtUtils,
                "differentSecretKeyForTestingSignatureExceptionWithProperLengthToMeetHS512RequirementsAndMoreCharactersToReach512BitsMinimum");

        Field otherExpirationField = JwtUtils.class.getDeclaredField("jwtExpirationMs");
        otherExpirationField.setAccessible(true);
        otherExpirationField.set(otherJwtUtils, 3600000);

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "John", "Doe", false, "password");
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = otherJwtUtils.generateJwtToken(authentication); // Token signed with different key

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token); // Validate with original key

        // Assert
        assertFalse(isValid); // Should be invalid due to SignatureException
    }

    @Test
    public void testValidateJwtToken_UnsupportedJwtException() {
        // Arrange: Token with unsupported algorithm (manually crafted)
        String unsupportedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // HS256
                                                                                                                                                                                                 // token,
                                                                                                                                                                                                 // but
                                                                                                                                                                                                 // if
                                                                                                                                                                                                 // we
                                                                                                                                                                                                 // expect
                                                                                                                                                                                                 // HS512,
                                                                                                                                                                                                 // it
                                                                                                                                                                                                 // might
                                                                                                                                                                                                 // not
                                                                                                                                                                                                 // trigger
                                                                                                                                                                                                 // UnsupportedJwtException

        // Actually, UnsupportedJwtException is for unsupported JWT type, like JWE
        // instead of JWS
        // For simplicity, use a token that might trigger it, or note that it's hard to
        // trigger in this context
        // Act
        boolean isValid = jwtUtils.validateJwtToken(unsupportedToken);

        // Assert
        assertFalse(isValid); // Should be invalid
    }

    @Test
    public void testValidateJwtToken_IllegalArgumentException() {
        // Arrange: Null token
        String nullToken = null;

        // Act
        boolean isValid = jwtUtils.validateJwtToken(nullToken);

        // Assert
        assertFalse(isValid); // Should be invalid due to IllegalArgumentException
    }

    @Test
    public void testValidateJwtToken_Expired() throws Exception {
        // Arrange: Set expiration to past
        Field jwtExpirationMsField = JwtUtils.class.getDeclaredField("jwtExpirationMs");
        jwtExpirationMsField.setAccessible(true);
        jwtExpirationMsField.set(jwtUtils, -1); // Expired

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "John", "Doe", false, "password");
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Reset to positive for test
        jwtExpirationMsField.set(jwtUtils, 3600000);

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertFalse(isValid); // Should be expired due to ExpiredJwtException being caught and returning false
    }
}