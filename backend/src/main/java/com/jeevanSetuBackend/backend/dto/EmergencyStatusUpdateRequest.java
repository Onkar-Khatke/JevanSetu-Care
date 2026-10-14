package com.jeevanSetuBackend.backend.dto;

import com.jeevanSetuBackend.backend.model.EmergencyStatus;
import jakarta.validation.constraints.NotNull;

public class EmergencyStatusUpdateRequest {

    @NotNull(message = "Emergency status is required")
    private EmergencyStatus status;

    private String ambulanceId;
    private String hospitalId;
    private String doctorId;
    private String notes;

    public EmergencyStatusUpdateRequest() {}

    public EmergencyStatus getStatus() { return status; }
    public void setStatus(EmergencyStatus status) { this.status = status; }

    public String getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(String ambulanceId) { this.ambulanceId = ambulanceId; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
