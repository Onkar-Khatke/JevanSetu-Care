package com.jeevanSetuBackend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class EmergencyCreateRequest {

    @NotBlank(message = "Patient ID is required")
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
    private String notes;

    public EmergencyCreateRequest() {}

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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
