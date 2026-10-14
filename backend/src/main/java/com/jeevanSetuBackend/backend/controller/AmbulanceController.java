package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.AmbulanceLocationRequest;
import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.model.Ambulance;
import com.jeevanSetuBackend.backend.model.AmbulanceStatus;
import com.jeevanSetuBackend.backend.service.AmbulanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Ambulance>>> getAllAmbulances() {
        return ResponseEntity.ok(ApiResponse.ok(ambulanceService.getAllAmbulances()));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Ambulance>>> getAvailableAmbulances() {
        return ResponseEntity.ok(ApiResponse.ok(ambulanceService.getAvailableAmbulances()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ambulance>> getAmbulanceById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(ambulanceService.getAmbulanceById(id)));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<ApiResponse<Ambulance>> updateLocation(
            @PathVariable String id,
            @RequestBody AmbulanceLocationRequest request) {
        Ambulance ambulance = ambulanceService.updateLocationAndStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Ambulance location updated", ambulance));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Ambulance>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        AmbulanceStatus status = AmbulanceStatus.valueOf(statusStr);
        Ambulance ambulance = ambulanceService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Ambulance status updated", ambulance));
    }
}
