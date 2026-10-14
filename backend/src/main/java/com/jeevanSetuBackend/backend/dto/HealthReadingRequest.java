package com.jeevanSetuBackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class HealthReadingRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    private Integer heartRate;          // BPM
    private Double spo2;                // Percentage (0 - 100)
    private Double temperature;         // Fahrenheit
    private Integer systolic;           // mmHg
    private Integer diastolic;          // mmHg
    private Integer respiratoryRate;    // Breaths per min
    private String ecgSummary;          // e.g. "Normal", "Tachycardia"
    private String deviceId;            // e.g. "ESP32-STATION-01"
    private String source;              // "ESP32_HARDWARE", "SIMULATOR", "MANUAL_STATION"
    private boolean simulated = false;  // Flag for synthetic/test data

    public HealthReadingRequest() {}

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

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

    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }

    public String getEcgSummary() { return ecgSummary; }
    public void setEcgSummary(String ecgSummary) { this.ecgSummary = ecgSummary; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public boolean isSimulated() { return simulated; }
    public void setSimulated(boolean simulated) { this.simulated = simulated; }
}
