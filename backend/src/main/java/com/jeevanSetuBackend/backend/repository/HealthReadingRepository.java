package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.HealthReading;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthReadingRepository extends MongoRepository<HealthReading, String> {
    List<HealthReading> findByPatientIdOrderByTimestampDesc(String patientId);
    Optional<HealthReading> findFirstByPatientIdOrderByTimestampDesc(String patientId);
}
