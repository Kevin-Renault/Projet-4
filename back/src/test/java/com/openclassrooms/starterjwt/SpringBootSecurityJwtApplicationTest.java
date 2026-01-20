package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
@ActiveProfiles("test")
class SpringBootSecurityJwtApplicationTest {
    @Test
    void contextLoads() {
        // Vérifie que le contexte Spring démarre avec H2
    }

    @Test
    void mainMethodRuns() {
        assertDoesNotThrow(() -> {
            // Forcer le profil 'test' pour utiliser H2
            System.setProperty("spring.profiles.active", "test");
            SpringBootSecurityJwtApplication.main(new String[] {});
        });
        // Si aucune exception n'est levée, le test passe
    }
}
