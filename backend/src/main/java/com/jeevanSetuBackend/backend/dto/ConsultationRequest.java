package com.jeevanSetuBackend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class ConsultationRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String notes;
    private List<String> medications = new ArrayList<>();

    public ConsultationRequest() {}

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<String> getMedications() { return medications; }
    public void setMedications(List<String> medications) { this.medications = medications; }
}
