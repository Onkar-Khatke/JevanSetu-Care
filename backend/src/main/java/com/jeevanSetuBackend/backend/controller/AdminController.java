package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.UserDto;
import com.jeevanSetuBackend.backend.model.EmergencyStatus;
import com.jeevanSetuBackend.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final HealthReadingRepository healthReadingRepository;

    public AdminController(UserRepository userRepository,
                           PatientProfileRepository patientProfileRepository,
                           DoctorRepository doctorRepository,
                           HospitalRepository hospitalRepository,
                           AmbulanceRepository ambulanceRepository,
                           EmergencyRequestRepository emergencyRepository,
                           HealthReadingRepository healthReadingRepository) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRepository = emergencyRepository;
        this.healthReadingRepository = healthReadingRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientProfileRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("totalAmbulances", ambulanceRepository.count());
        stats.put("activeEmergencies", emergencyRepository.findByStatusNotOrderByCreatedAtDesc(EmergencyStatus.COMPLETED).size());
        stats.put("totalReadings", healthReadingRepository.count());
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getEmail(),
                        u.getFullName(),
                        u.getPhone(),
                        u.getRole(),
                        u.getEntityId(),
                        u.isActive()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}
