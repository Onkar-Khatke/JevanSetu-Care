package com.jeevanSetuBackend.backend.repository;

import com.jeevanSetuBackend.backend.model.HealthAssistantMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthAssistantMessageRepository extends MongoRepository<HealthAssistantMessage, String> {
    List<HealthAssistantMessage> findByPatientIdOrderByTimestampAsc(String patientId);
}
