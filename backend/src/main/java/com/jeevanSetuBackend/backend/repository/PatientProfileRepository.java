package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.PatientProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientProfileRepository extends MongoRepository<PatientProfile, String> {
    Optional<PatientProfile> findByUserId(String userId);
    List<PatientProfile> findByVillage(String village);
    List<PatientProfile> findByDistrict(String district);
}
