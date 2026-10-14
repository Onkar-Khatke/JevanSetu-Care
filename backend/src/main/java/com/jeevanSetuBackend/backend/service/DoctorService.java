package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.ConsultationRequest;
import com.jeevanSetuBackend.backend.exception.ResourceNotFoundException;
import com.jeevanSetuBackend.backend.model.Consultation;
import com.jeevanSetuBackend.backend.model.Doctor;
import com.jeevanSetuBackend.backend.repository.ConsultationRepository;
import com.jeevanSetuBackend.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ConsultationRepository consultationRepository;

    public DoctorService(DoctorRepository doctorRepository, ConsultationRepository consultationRepository) {
        this.doctorRepository = doctorRepository;
        this.consultationRepository = consultationRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
    }

    public Consultation createConsultation(String doctorId, String doctorName, ConsultationRequest request) {
        Consultation consultation = new Consultation();
        consultation.setPatientId(request.getPatientId());
        consultation.setDoctorId(doctorId);
        consultation.setDoctorName(doctorName);
        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setNotes(request.getNotes());
        consultation.setMedications(request.getMedications());
        consultation.setCreatedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public List<Consultation> getPatientConsultations(String patientId) {
        return consultationRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<Consultation> getDoctorConsultations(String doctorId) {
        return consultationRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }
}
