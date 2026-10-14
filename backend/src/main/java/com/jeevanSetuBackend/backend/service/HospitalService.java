package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.HospitalAvailabilityRequest;
import com.jeevanSetuBackend.backend.exception.ResourceNotFoundException;
import com.jeevanSetuBackend.backend.model.Hospital;
import com.jeevanSetuBackend.backend.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(String id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + id));
    }

    public Hospital updateAvailability(String id, HospitalAvailabilityRequest request) {
        Hospital hospital = getHospitalById(id);
        if (request.getEmergencyAvailable() != null) {
            hospital.setEmergencyAvailable(request.getEmergencyAvailable());
        }
        if (request.getAvailableBeds() != null) {
            hospital.setAvailableBeds(Math.max(0, request.getAvailableBeds()));
        }
        return hospitalRepository.save(hospital);
    }
}
