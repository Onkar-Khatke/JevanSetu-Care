package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.HospitalAvailabilityRequest;
import com.jeevanSetuBackend.backend.model.Hospital;
import com.jeevanSetuBackend.backend.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hospital>>> getAllHospitals() {
        return ResponseEntity.ok(ApiResponse.ok(hospitalService.getAllHospitals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> getHospitalById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(hospitalService.getHospitalById(id)));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<Hospital>> updateAvailability(
            @PathVariable String id,
            @RequestBody HospitalAvailabilityRequest request) {
        Hospital updated = hospitalService.updateAvailability(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Hospital availability updated successfully", updated));
    }
}
