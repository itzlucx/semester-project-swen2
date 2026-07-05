package at.technikum.tourplanner.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret",
                "meinSuperGeheimerSchluesselDerMindestens32ZeichenLangSeinMuss");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    void generateToken_shouldReturnNonNullToken() {
        String token = jwtUtil.generateToken("testuser");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractUsername_shouldReturnCorrectUsername() {
        String token = jwtUtil.generateToken("testuser");
        String extracted = jwtUtil.extractUsername(token);
        assertEquals("testuser", extracted);
    }

    @Test
    void isTokenValid_validToken_shouldReturnTrue() {
        String token = jwtUtil.generateToken("testuser");
        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_invalidToken_shouldReturnFalse() {
        assertFalse(jwtUtil.isTokenValid("invalid.token.here"));
    }

    @Test
    void isTokenValid_expiredToken_shouldReturnFalse() {
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1000L);
        String expiredToken = jwtUtil.generateToken("testuser");
        assertFalse(jwtUtil.isTokenValid(expiredToken));
    }
}