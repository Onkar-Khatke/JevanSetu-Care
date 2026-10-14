package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.HealthReadingRequest;
import com.jeevanSetuBackend.backend.model.HealthReading;
import com.jeevanSetuBackend.backend.service.HealthReadingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vitals")
public class HealthReadingController {

    private final HealthReadingService healthReadingService;

    public HealthReadingController(HealthReadingService healthReadingService) {
        this.healthReadingService = healthReadingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HealthReading>> recordVitals(@Valid @RequestBody HealthReadingRequest request) {
        HealthReading reading = healthReadingService.recordReading(request);
        return ResponseEntity.ok(ApiResponse.ok("Health reading recorded successfully", reading));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<HealthReading>>> getPatientVitals(@PathVariable String patientId) {
        List<HealthReading> readings = healthReadingService.getPatientReadings(patientId);
        return ResponseEntity.ok(ApiResponse.ok(readings));
    }

    @GetMapping("/latest/{patientId}")
    public ResponseEntity<ApiResponse<HealthReading>> getLatestVital(@PathVariable String patientId) {
        return healthReadingService.getLatestReading(patientId)
                .map(reading -> ResponseEntity.ok(ApiResponse.ok(reading)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("No readings available yet for patient", null)));
    }
}
