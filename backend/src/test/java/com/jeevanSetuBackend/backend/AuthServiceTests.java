package com.jeevanSetuBackend.backend;

import com.jeevanSetuBackend.backend.dto.AuthRequest;
import com.jeevanSetuBackend.backend.dto.AuthResponse;
import com.jeevanSetuBackend.backend.dto.RegisterRequest;
import com.jeevanSetuBackend.backend.exception.BadRequestException;
import com.jeevanSetuBackend.backend.exception.UnauthorizedException;
import com.jeevanSetuBackend.backend.model.Role;
import com.jeevanSetuBackend.backend.model.User;
import com.jeevanSetuBackend.backend.repository.AmbulanceRepository;
import com.jeevanSetuBackend.backend.repository.DoctorRepository;
import com.jeevanSetuBackend.backend.repository.PatientProfileRepository;
import com.jeevanSetuBackend.backend.repository.UserRepository;
import com.jeevanSetuBackend.backend.security.JwtTokenProvider;
import com.jeevanSetuBackend.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private AmbulanceRepository ambulanceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                patientProfileRepository,
                doctorRepository,
                ambulanceRepository,
                passwordEncoder,
                tokenProvider
        );
    }

    @Test
    void testLoginSuccess() {
        User user = new User("test@example.com", "encodedPass", "Test User", "1234567890", Role.ROLE_PATIENT, "P1001");
        user.setId("u-1");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPass", "encodedPass")).thenReturn(true);
        when(tokenProvider.generateToken(anyString(), anyString(), anyString())).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(new AuthRequest("test@example.com", "rawPass"));

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        assertEquals(Role.ROLE_PATIENT, response.getUser().getRole());
    }

    @Test
    void testLoginInvalidPasswordThrowsUnauthorized() {
        User user = new User("test@example.com", "encodedPass", "Test User", "1234567890", Role.ROLE_PATIENT, "P1001");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPass", "encodedPass")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () ->
                authService.login(new AuthRequest("test@example.com", "wrongPass"))
        );
    }

    @Test
    void testRegisterAdminDemotedToPatientForSafety() {
        when(userRepository.existsByEmail("admin@hack.org")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId("u-admin-test");
            return u;
        });
        when(tokenProvider.generateToken(anyString(), anyString(), anyString())).thenReturn("mock-token");

        RegisterRequest request = new RegisterRequest();
        request.setEmail("admin@hack.org");
        request.setPassword("Password@123");
        request.setFullName("Unauthorized Admin Applicant");
        request.setRole(Role.ROLE_ADMIN); // Attempting to register as admin publicly

        AuthResponse response = authService.register(request);

        // Security requirement: Never allow public registration to assign administrator privileges
        assertEquals(Role.ROLE_PATIENT, response.getUser().getRole());
    }

    @Test
    void testRegisterDuplicateEmailThrowsBadRequest() {
        when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        RegisterRequest request = new RegisterRequest();
        request.setEmail("exists@example.com");
        request.setPassword("Password@123");
        request.setFullName("Existing User");

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }
}
