package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findByAvailable(boolean available);
}
