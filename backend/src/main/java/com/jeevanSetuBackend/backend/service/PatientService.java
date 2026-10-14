package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.PatientProfileRequest;
import com.jeevanSetuBackend.backend.exception.ResourceNotFoundException;
import com.jeevanSetuBackend.backend.model.PatientProfile;
import com.jeevanSetuBackend.backend.repository.PatientProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientService {

    private final PatientProfileRepository patientProfileRepository;

    public PatientService(PatientProfileRepository patientProfileRepository) {
        this.patientProfileRepository = patientProfileRepository;
    }

    public List<PatientProfile> getAllPatients() {
        return patientProfileRepository.findAll();
    }

    public PatientProfile getPatientById(String id) {
        return patientProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
    }

    public PatientProfile getPatientByUserId(String userId) {
        return patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not linked to user ID: " + userId));
    }

    public PatientProfile updateProfile(String id, PatientProfileRequest request) {
        PatientProfile profile = patientProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        if (request.getName() != null) profile.setName(request.getName());
        if (request.getAge() != null) profile.setAge(request.getAge());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getVillage() != null) profile.setVillage(request.getVillage());
        if (request.getDistrict() != null) profile.setDistrict(request.getDistrict());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null) profile.setEmergencyContact(request.getEmergencyContact());
        if (request.getBloodGroup() != null) profile.setBloodGroup(request.getBloodGroup());
        if (request.getMedicalHistory() != null) profile.setMedicalHistory(request.getMedicalHistory());
        if (request.getAllergies() != null) profile.setAllergies(request.getAllergies());
        if (request.getCurrentMedications() != null) profile.setCurrentMedications(request.getCurrentMedications());

        profile.setUpdatedAt(LocalDateTime.now());
        return patientProfileRepository.save(profile);
    }
}
