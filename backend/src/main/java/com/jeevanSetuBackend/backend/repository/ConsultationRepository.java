package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.Consultation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends MongoRepository<Consultation, String> {
    List<Consultation> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<Consultation> findByDoctorIdOrderByCreatedAtDesc(String doctorId);
}
