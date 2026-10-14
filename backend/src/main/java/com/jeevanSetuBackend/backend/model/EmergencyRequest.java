package com.jeevanSetuBackend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "emergencies")
public class EmergencyRequest {

    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String patientPhone;
    private String village;
    private String district;
    private Double latitude;
    private Double longitude;
    private boolean locationPermissionGranted = false;
    private List<String> symptoms = new ArrayList<>();
    private String riskLevel = "HIGH";
    private EmergencyStatus status = EmergencyStatus.REQUESTED;
    private String assignedAmbulanceId;
    private String assignedHospitalId;
    private String assignedDoctorId;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public EmergencyRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public boolean isLocationPermissionGranted() { return locationPermissionGranted; }
    public void setLocationPermissionGranted(boolean locationPermissionGranted) { this.locationPermissionGranted = locationPermissionGranted; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public EmergencyStatus getStatus() { return status; }
    public void setStatus(EmergencyStatus status) { this.status = status; }

    public String getAssignedAmbulanceId() { return assignedAmbulanceId; }
    public void setAssignedAmbulanceId(String assignedAmbulanceId) { this.assignedAmbulanceId = assignedAmbulanceId; }

    public String getAssignedHospitalId() { return assignedHospitalId; }
    public void setAssignedHospitalId(String assignedHospitalId) { this.assignedHospitalId = assignedHospitalId; }

    public String getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(String assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
