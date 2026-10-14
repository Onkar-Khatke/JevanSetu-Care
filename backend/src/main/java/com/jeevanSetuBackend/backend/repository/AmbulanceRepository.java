package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.Ambulance;
import com.jeevanSetuBackend.backend.model.AmbulanceStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends MongoRepository<Ambulance, String> {
    List<Ambulance> findByStatus(AmbulanceStatus status);
    Optional<Ambulance> findByUserId(String userId);
    List<Ambulance> findByDistrict(String district);
}
