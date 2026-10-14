package com.jeevanSetuBackend.backend.dto;

public class HospitalAvailabilityRequest {

    private Boolean emergencyAvailable;
    private Integer availableBeds;

    public HospitalAvailabilityRequest() {}

    public Boolean getEmergencyAvailable() { return emergencyAvailable; }
    public void setEmergencyAvailable(Boolean emergencyAvailable) { this.emergencyAvailable = emergencyAvailable; }

    public Integer getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(Integer availableBeds) { this.availableBeds = availableBeds; }
}
