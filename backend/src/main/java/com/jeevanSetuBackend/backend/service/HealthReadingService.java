package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.HealthReadingRequest;
import com.jeevanSetuBackend.backend.exception.BadRequestException;
import com.jeevanSetuBackend.backend.model.HealthReading;
import com.jeevanSetuBackend.backend.repository.HealthReadingRepository;
import com.jeevanSetuBackend.backend.repository.PatientProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HealthReadingService {

    private static final Logger log = LoggerFactory.getLogger(HealthReadingService.class);

    private final HealthReadingRepository healthReadingRepository;
    private final PatientProfileRepository patientProfileRepository;

    public HealthReadingService(HealthReadingRepository healthReadingRepository,
                                PatientProfileRepository patientProfileRepository) {
        this.healthReadingRepository = healthReadingRepository;
        this.patientProfileRepository = patientProfileRepository;
    }

    public HealthReading recordReading(HealthReadingRequest request) {
        if (request.getPatientId() == null || request.getPatientId().trim().isEmpty()) {
            throw new BadRequestException("Patient ID is required to log health readings.");
        }

        // Validate and sanitize plausible biological measurement boundaries
        HealthReading reading = new HealthReading();
        reading.setPatientId(request.getPatientId().trim());

        // Heart Rate plausibility (30 to 250 bpm)
        if (request.getHeartRate() != null) {
            if (request.getHeartRate() < 30 || request.getHeartRate() > 250) {
                log.warn("Implausible Heart Rate value rejected: {} bpm for patient {}", request.getHeartRate(), request.getPatientId());
                throw new BadRequestException("Implausible Heart Rate: must be between 30 and 250 bpm.");
            }
            reading.setHeartRate(request.getHeartRate());
        }

        // SpO2 plausibility (50% to 100%)
        if (request.getSpo2() != null) {
            if (request.getSpo2() < 50.0 || request.getSpo2() > 100.0) {
                log.warn("Implausible SpO2 value rejected: {}% for patient {}", request.getSpo2(), request.getPatientId());
                throw new BadRequestException("Implausible SpO2: must be between 50% and 100%.");
            }
            reading.setSpo2(request.getSpo2());
        }

        // Body Temperature in Fahrenheit (80.0°F to 115.0°F)
        if (request.getTemperature() != null) {
            if (request.getTemperature() < 80.0 || request.getTemperature() > 115.0) {
                log.warn("Implausible Temperature rejected: {}°F for patient {}", request.getTemperature(), request.getPatientId());
                throw new BadRequestException("Implausible Temperature: must be between 80.0°F and 115.0°F.");
            }
            reading.setTemperature(request.getTemperature());
        }

        // Blood Pressure (Systolic 50 - 260, Diastolic 30 - 160)
        if (request.getSystolic() != null) {
            if (request.getSystolic() < 50 || request.getSystolic() > 260) {
                throw new BadRequestException("Implausible Systolic Blood Pressure: must be between 50 and 260 mmHg.");
            }
            reading.setSystolic(request.getSystolic());
        }

        if (request.getDiastolic() != null) {
            if (request.getDiastolic() < 30 || request.getDiastolic() > 160) {
                throw new BadRequestException("Implausible Diastolic Blood Pressure: must be between 30 and 160 mmHg.");
            }
            reading.setDiastolic(request.getDiastolic());
        }

        reading.setRespiratoryRate(request.getRespiratoryRate());
        reading.setEcgSummary(request.getEcgSummary() != null ? request.getEcgSummary() : "Normal Sinus");
        reading.setDeviceId(request.getDeviceId() != null ? request.getDeviceId() : "MANUAL-INPUT");
        reading.setSource(request.getSource() != null ? request.getSource() : "MANUAL_STATION");
        reading.setSimulated(request.isSimulated());
        reading.setTimestamp(LocalDateTime.now());
        reading.setCreatedAt(LocalDateTime.now());

        log.info("Recorded health reading for patient {} [Source: {}, Simulated: {}]",
                reading.getPatientId(), reading.getSource(), reading.isSimulated());

        return healthReadingRepository.save(reading);
    }

    public List<HealthReading> getPatientReadings(String patientId) {
        return healthReadingRepository.findByPatientIdOrderByTimestampDesc(patientId);
    }

    public Optional<HealthReading> getLatestReading(String patientId) {
        return healthReadingRepository.findFirstByPatientIdOrderByTimestampDesc(patientId);
    }
}
