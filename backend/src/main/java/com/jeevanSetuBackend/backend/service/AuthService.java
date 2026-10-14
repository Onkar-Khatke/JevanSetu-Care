package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.AuthRequest;
import com.jeevanSetuBackend.backend.dto.AuthResponse;
import com.jeevanSetuBackend.backend.dto.RegisterRequest;
import com.jeevanSetuBackend.backend.dto.UserDto;
import com.jeevanSetuBackend.backend.exception.BadRequestException;
import com.jeevanSetuBackend.backend.exception.UnauthorizedException;
import com.jeevanSetuBackend.backend.model.*;
import com.jeevanSetuBackend.backend.repository.*;
import com.jeevanSetuBackend.backend.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorRepository doctorRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PatientProfileRepository patientProfileRepository,
                       DoctorRepository doctorRepository,
                       AmbulanceRepository ambulanceRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorRepository = doctorRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account is currently disabled. Please contact administrator.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getEntityId(),
                user.isActive()
        );

        return new AuthResponse(token, userDto);
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        // Security rule: Never allow public registration to assign administrator privileges
        Role role = request.getRole();
        if (role == null || role == Role.ROLE_ADMIN) {
            log.info("Public registration requested without role or with ROLE_ADMIN. Defaulting to ROLE_PATIENT for safety.");
            role = Role.ROLE_PATIENT;
        }

        String entityId = null;

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Auto-create corresponding profile based on role
        if (role == Role.ROLE_PATIENT) {
            entityId = "P" + (1000 + (int) patientProfileRepository.count() + 1);
            PatientProfile profile = new PatientProfile();
            profile.setId(entityId);
            profile.setUserId(savedUser.getId());
            profile.setName(savedUser.getFullName());
            profile.setEmail(savedUser.getEmail());
            profile.setPhone(savedUser.getPhone());
            profile.setVillage(request.getVillage() != null ? request.getVillage() : "Koregaon Bhima");
            profile.setDistrict(request.getDistrict() != null ? request.getDistrict() : "Pune");
            profile.setAddress(request.getAddress() != null ? request.getAddress() : "Village Center");
            profile.setEmergencyContact(request.getEmergencyContact());
            profile.setAge(request.getAge() != null ? request.getAge() : 35);
            profile.setGender(request.getGender() != null ? request.getGender() : "Not Specified");
            patientProfileRepository.save(profile);

            savedUser.setEntityId(entityId);
            userRepository.save(savedUser);
        } else if (role == Role.ROLE_DOCTOR) {
            entityId = "DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            Doctor doctor = new Doctor(savedUser.getFullName(), "General Medicine & Emergency Care", savedUser.getPhone(), savedUser.getEmail(), "hosp1", savedUser.getId());
            doctor.setId(entityId);
            doctorRepository.save(doctor);

            savedUser.setEntityId(entityId);
            userRepository.save(savedUser);
        } else if (role == Role.ROLE_AMBULANCE) {
            entityId = "AMB-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            Ambulance ambulance = new Ambulance(savedUser.getFullName(), savedUser.getPhone(), "MH-12-JS-" + (1000 + (int) ambulanceRepository.count()), 18.5204, 73.8567, request.getDistrict(), request.getVillage());
            ambulance.setId(entityId);
            ambulance.setUserId(savedUser.getId());
            ambulanceRepository.save(ambulance);

            savedUser.setEntityId(entityId);
            userRepository.save(savedUser);
        }

        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        UserDto userDto = new UserDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getPhone(),
                savedUser.getRole(),
                savedUser.getEntityId(),
                savedUser.isActive()
        );

        return new AuthResponse(token, userDto);
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User profile not found"));
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getEntityId(),
                user.isActive()
        );
    }
}
