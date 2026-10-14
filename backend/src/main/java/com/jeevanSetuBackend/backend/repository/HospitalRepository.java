package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {
    Optional<Hospital> findByUserId(String userId);
    List<Hospital> findByEmergencyAvailable(boolean emergencyAvailable);
}
