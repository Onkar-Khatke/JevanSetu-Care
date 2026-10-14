package com.jeevanSetuBackend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "health_readings")
public class HealthReading {

    @Id
    private String id;

    @Indexed
    private String patientId;

    private Integer heartRate;          // BPM (e.g. 75)
    private Double spo2;                // Percentage (e.g. 98.0)
    private Double temperature;         // Fahrenheit (e.g. 98.4)
    private Integer systolic;           // mmHg (e.g. 120)
    private Integer diastolic;          // mmHg (e.g. 80)
    private Integer respiratoryRate;    // Breaths/min
    private String ecgSummary;          // Normal, Arrhythmia, Tachycardia, etc.

    @Indexed
    private LocalDateTime timestamp;

    private String deviceId;            // e.g. "ESP32-RURAL-NODE-01"
    private String source;              // "ESP32_HARDWARE", "SIMULATOR", "MANUAL_STATION"
    private boolean simulated = false;  // Clear distinction between hardware and simulation
    private LocalDateTime createdAt = LocalDateTime.now();

    public HealthReading() {
        this.timestamp = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public boolean isSimulated() { return simulated; }
    public void setSimulated(boolean simulated) { this.simulated = simulated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
