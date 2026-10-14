package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.AmbulanceLocationRequest;
import com.jeevanSetuBackend.backend.exception.ResourceNotFoundException;
import com.jeevanSetuBackend.backend.model.Ambulance;
import com.jeevanSetuBackend.backend.model.AmbulanceStatus;
import com.jeevanSetuBackend.backend.repository.AmbulanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;

    public AmbulanceService(AmbulanceRepository ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    public List<Ambulance> getAvailableAmbulances() {
        return ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE);
    }

    public Ambulance getAmbulanceById(String id) {
        return ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with ID: " + id));
    }

    public Ambulance updateLocationAndStatus(String id, AmbulanceLocationRequest request) {
        Ambulance ambulance = getAmbulanceById(id);
        if (request.getLatitude() != null) ambulance.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) ambulance.setLongitude(request.getLongitude());
        if (request.getStatus() != null) ambulance.setStatus(request.getStatus());
        ambulance.setUpdatedAt(LocalDateTime.now());
        return ambulanceRepository.save(ambulance);
    }

    public Ambulance updateStatus(String id, AmbulanceStatus status) {
        Ambulance ambulance = getAmbulanceById(id);
        ambulance.setStatus(status);
        if (status == AmbulanceStatus.AVAILABLE) {
            ambulance.setCurrentEmergencyId(null);
        }
        ambulance.setUpdatedAt(LocalDateTime.now());
        return ambulanceRepository.save(ambulance);
    }
}
