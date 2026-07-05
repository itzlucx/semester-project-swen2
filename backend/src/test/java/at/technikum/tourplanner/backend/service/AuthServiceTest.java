package at.technikum.tourplanner.backend.service;

import at.technikum.tourplanner.backend.config.JwtUtil;
import at.technikum.tourplanner.backend.dto.AuthRequest;
import at.technikum.tourplanner.backend.dto.AuthResponse;
import at.technikum.tourplanner.backend.model.User;
import at.technikum.tourplanner.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private AuthRequest validRequest;
    private User existingUser;

    @BeforeEach
    void setUp() {
        validRequest = new AuthRequest();
        validRequest.setUsername("testuser");
        validRequest.setPassword("password123");

        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("hashedPassword");
    }

    // --- Register Tests ---

    @Test
    void register_success_shouldReturnTokenAndUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        when(jwtUtil.generateToken("testuser")).thenReturn("mockToken");

        AuthResponse response = authService.register(validRequest);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("testuser", response.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateUsername_shouldThrowException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(validRequest));

        assertEquals("Username already exists", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_shouldEncodePassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(jwtUtil.generateToken(anyString())).thenReturn("mockToken");

        authService.register(validRequest);

        verify(passwordEncoder).encode("password123");
    }

    // --- Login Tests ---

    @Test
    void login_success_shouldReturnTokenAndUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("testuser")).thenReturn("mockToken");

        AuthResponse response = authService.login(validRequest);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("testuser", response.getUsername());
    }

    @Test
    void login_userNotFound_shouldThrowException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(validRequest));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void login_wrongPassword_shouldThrowException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(validRequest));

        assertEquals("Invalid password", ex.getMessage());
    }
}