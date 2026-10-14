package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.EmergencyRequest;
import com.jeevanSetuBackend.backend.model.EmergencyStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyRequestRepository extends MongoRepository<EmergencyRequest, String> {
    List<EmergencyRequest> findByStatusNotOrderByCreatedAtDesc(EmergencyStatus status);
    List<EmergencyRequest> findByPatientIdOrderByCreatedAtDesc(String patientId);
    Optional<EmergencyRequest> findFirstByPatientIdAndStatusNot(String patientId, EmergencyStatus status);
    List<EmergencyRequest> findByStatus(EmergencyStatus status);
}
