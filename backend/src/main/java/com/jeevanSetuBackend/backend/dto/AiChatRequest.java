package com.jeevanSetuBackend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class AiChatRequest {

    private String patientId;

    @NotBlank(message = "Message or symptoms description cannot be blank")
    private String message;

    private String language = "en"; // "en", "hi", "mr"

    // Consent flag to respect privacy
    private boolean consentGiven = true;

    // Optional recent vital metrics for preliminary context
    private Integer heartRate;
    private Double spo2;
    private Double temperature;
    private Integer systolic;
    private Integer diastolic;
    private List<String> knownConditions = new ArrayList<>();

    public AiChatRequest() {}

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public boolean isConsentGiven() { return consentGiven; }
    public void setConsentGiven(boolean consentGiven) { this.consentGiven = consentGiven; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getSystolic() { return systolic; }
    public void setSystolic(Integer systolic) { this.systolic = systolic; }

    public Integer getDiastolic() { return diastolic; }
    public void setDiastolic(Integer diastolic) { this.diastolic = diastolic; }

    public List<String> getKnownConditions() { return knownConditions; }
    public void setKnownConditions(List<String> knownConditions) { this.knownConditions = knownConditions; }
}
