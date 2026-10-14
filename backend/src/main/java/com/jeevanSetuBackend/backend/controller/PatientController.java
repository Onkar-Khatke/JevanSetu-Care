package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.PatientProfileRequest;
import com.jeevanSetuBackend.backend.model.PatientProfile;
import com.jeevanSetuBackend.backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientProfile>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.ok(patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientProfile>> getPatientById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(patientService.getPatientById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientProfile>> updatePatientProfile(
            @PathVariable String id,
            @Valid @RequestBody PatientProfileRequest request) {
        PatientProfile updated = patientService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Patient profile updated successfully", updated));
    }
}
