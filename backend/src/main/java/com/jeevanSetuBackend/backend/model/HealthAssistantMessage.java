package com.jeevanSetuBackend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "health_assistant_messages")
public class HealthAssistantMessage {

    @Id
    private String id;
    private String patientId;
    private String role; // "user" or "assistant"
    private String content;
    private String riskLevel = "LOW";
    private boolean emergencyWarning = false;
    private String providerUsed; // "safe-fallback", "gemini", "openai", "http-service"
    private LocalDateTime timestamp = LocalDateTime.now();

    public HealthAssistantMessage() {}

    public HealthAssistantMessage(String patientId, String role, String content, String riskLevel, boolean emergencyWarning, String providerUsed) {
        this.patientId = patientId;
        this.role = role;
        this.content = content;
        this.riskLevel = riskLevel;
        this.emergencyWarning = emergencyWarning;
        this.providerUsed = providerUsed;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public boolean isEmergencyWarning() { return emergencyWarning; }
    public void setEmergencyWarning(boolean emergencyWarning) { this.emergencyWarning = emergencyWarning; }

    public String getProviderUsed() { return providerUsed; }
    public void setProviderUsed(String providerUsed) { this.providerUsed = providerUsed; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
