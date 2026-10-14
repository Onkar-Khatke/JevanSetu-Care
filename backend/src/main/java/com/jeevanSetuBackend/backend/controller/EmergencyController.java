package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.EmergencyCreateRequest;
import com.jeevanSetuBackend.backend.dto.EmergencyStatusUpdateRequest;
import com.jeevanSetuBackend.backend.model.EmergencyRequest;
import com.jeevanSetuBackend.backend.service.EmergencyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmergencyRequest>> createEmergency(@Valid @RequestBody EmergencyCreateRequest request) {
        EmergencyRequest emergency = emergencyService.createEmergency(request);
        return ResponseEntity.ok(ApiResponse.ok("Emergency request created and dispatched", emergency));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<EmergencyRequest>>> getActiveEmergencies() {
        return ResponseEntity.ok(ApiResponse.ok(emergencyService.getActiveEmergencies()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<EmergencyRequest>>> getPatientEmergencies(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(emergencyService.getPatientEmergencies(patientId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmergencyRequest>> getEmergencyById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(emergencyService.getEmergencyById(id)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EmergencyRequest>> updateEmergencyStatus(
            @PathVariable String id,
            @Valid @RequestBody EmergencyStatusUpdateRequest request) {
        EmergencyRequest updated = emergencyService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Emergency status updated successfully", updated));
    }
}
