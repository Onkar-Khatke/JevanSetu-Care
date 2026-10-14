package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.ConsultationRequest;
import com.jeevanSetuBackend.backend.model.Consultation;
import com.jeevanSetuBackend.backend.model.Doctor;
import com.jeevanSetuBackend.backend.security.UserPrincipal;
import com.jeevanSetuBackend.backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.ok(doctorService.getAllDoctors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(doctorService.getDoctorById(id)));
    }

    @PostMapping("/consultations")
    public ResponseEntity<ApiResponse<Consultation>> createConsultation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ConsultationRequest request) {
        String doctorId = userPrincipal != null ? userPrincipal.getEntityId() : "DOC-01";
        String doctorName = userPrincipal != null ? userPrincipal.getFullName() : "Attending Physician";

        Consultation consultation = doctorService.createConsultation(doctorId, doctorName, request);
        return ResponseEntity.ok(ApiResponse.ok("Consultation and prescription recorded", consultation));
    }

    @GetMapping("/consultations/{patientId}")
    public ResponseEntity<ApiResponse<List<Consultation>>> getPatientConsultations(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.ok(doctorService.getPatientConsultations(patientId)));
    }
}
