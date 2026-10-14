package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.EmergencyCreateRequest;
import com.jeevanSetuBackend.backend.dto.EmergencyStatusUpdateRequest;
import com.jeevanSetuBackend.backend.exception.ResourceNotFoundException;
import com.jeevanSetuBackend.backend.model.*;
import com.jeevanSetuBackend.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmergencyService {

    private static final Logger log = LoggerFactory.getLogger(EmergencyService.class);

    private final EmergencyRequestRepository emergencyRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public EmergencyService(EmergencyRequestRepository emergencyRepository,
                            PatientProfileRepository patientProfileRepository,
                            AmbulanceRepository ambulanceRepository,
                            HospitalRepository hospitalRepository,
                            DoctorRepository doctorRepository) {
        this.emergencyRepository = emergencyRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
    }

    public EmergencyRequest createEmergency(EmergencyCreateRequest request) {
        String patientId = request.getPatientId();

        // Prevent duplicate emergency requests if an active ongoing request already exists
        Optional<EmergencyRequest> existing = emergencyRepository.findFirstByPatientIdAndStatusNot(
                patientId, EmergencyStatus.COMPLETED
        );
        if (existing.isPresent() && existing.get().getStatus() != EmergencyStatus.CANCELLED) {
            log.info("Active emergency already exists for patient {}. Returning existing Case #{}",
                    patientId, existing.get().getId());
            return existing.get();
        }

        PatientProfile patient = patientProfileRepository.findById(patientId).orElse(null);

        EmergencyRequest emergency = new EmergencyRequest();
        emergency.setId("EM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        emergency.setPatientId(patientId);
        emergency.setPatientName(patient != null ? patient.getName() : request.getPatientName());
        emergency.setPatientPhone(patient != null ? patient.getPhone() : request.getPatientPhone());
        emergency.setVillage(patient != null ? patient.getVillage() : request.getVillage());
        emergency.setDistrict(patient != null ? patient.getDistrict() : request.getDistrict());

        // Privacy rule: Record location only if permission is granted
        emergency.setLocationPermissionGranted(request.isLocationPermissionGranted());
        if (request.isLocationPermissionGranted() && request.getLatitude() != null && request.getLongitude() != null) {
            emergency.setLatitude(request.getLatitude());
            emergency.setLongitude(request.getLongitude());
        } else {
            // Default village regional centroid coordinates
            emergency.setLatitude(18.5204);
            emergency.setLongitude(73.8567);
        }

        emergency.setSymptoms(request.getSymptoms() != null ? request.getSymptoms() : List.of("Acute distress"));
        emergency.setRiskLevel(request.getRiskLevel() != null ? request.getRiskLevel() : "HIGH");
        emergency.setStatus(EmergencyStatus.REQUESTED);
        emergency.setNotes(request.getNotes() != null ? request.getNotes() : "One-Touch Emergency SOS activated");
        emergency.setCreatedAt(LocalDateTime.now());
        emergency.setUpdatedAt(LocalDateTime.now());

        // Smart Ambulance Allocation: Find closest available ambulance
        List<Ambulance> availableAmbulances = ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE);
        if (!availableAmbulances.isEmpty()) {
            Ambulance selectedAmbulance = availableAmbulances.get(0);
            emergency.setAssignedAmbulanceId(selectedAmbulance.getId());
            emergency.setStatus(EmergencyStatus.ASSIGNED);

            // Update fleet status
            selectedAmbulance.setStatus(AmbulanceStatus.ASSIGNED);
            selectedAmbulance.setCurrentEmergencyId(emergency.getId());
            selectedAmbulance.setUpdatedAt(LocalDateTime.now());
            ambulanceRepository.save(selectedAmbulance);
            log.info("Auto-assigned ambulance {} to emergency {}", selectedAmbulance.getId(), emergency.getId());
        }

        // Pair with nearest ready hospital
        List<Hospital> readyHospitals = hospitalRepository.findByEmergencyAvailable(true);
        if (!readyHospitals.isEmpty()) {
            emergency.setAssignedHospitalId(readyHospitals.get(0).getId());
        }

        // Assign on-call doctor
        List<Doctor> availableDoctors = doctorRepository.findByAvailable(true);
        if (!availableDoctors.isEmpty()) {
            emergency.setAssignedDoctorId(availableDoctors.get(0).getId());
        }

        return emergencyRepository.save(emergency);
    }

    public List<EmergencyRequest> getActiveEmergencies() {
        return emergencyRepository.findByStatusNotOrderByCreatedAtDesc(EmergencyStatus.COMPLETED);
    }

    public List<EmergencyRequest> getPatientEmergencies(String patientId) {
        return emergencyRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public EmergencyRequest getEmergencyById(String id) {
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency request not found with ID: " + id));
    }

    public EmergencyRequest updateStatus(String id, EmergencyStatusUpdateRequest request) {
        EmergencyRequest emergency = getEmergencyById(id);
        EmergencyStatus newStatus = request.getStatus();
        emergency.setStatus(newStatus);
        emergency.setUpdatedAt(LocalDateTime.now());

        if (request.getAmbulanceId() != null) emergency.setAssignedAmbulanceId(request.getAmbulanceId());
        if (request.getHospitalId() != null) emergency.setAssignedHospitalId(request.getHospitalId());
        if (request.getDoctorId() != null) emergency.setAssignedDoctorId(request.getDoctorId());
        if (request.getNotes() != null) emergency.setNotes(request.getNotes());

        // Synchronize ambulance fleet status
        if (emergency.getAssignedAmbulanceId() != null) {
            ambulanceRepository.findById(emergency.getAssignedAmbulanceId()).ifPresent(amb -> {
                if (newStatus == EmergencyStatus.ON_ROUTE) {
                    amb.setStatus(AmbulanceStatus.ON_ROUTE);
                } else if (newStatus == EmergencyStatus.COMPLETED || newStatus == EmergencyStatus.CANCELLED) {
                    amb.setStatus(AmbulanceStatus.AVAILABLE);
                    amb.setCurrentEmergencyId(null);
                }
                amb.setUpdatedAt(LocalDateTime.now());
                ambulanceRepository.save(amb);
            });
        }

        log.info("Updated emergency {} status to {}", id, newStatus);
        return emergencyRepository.save(emergency);
    }
}
