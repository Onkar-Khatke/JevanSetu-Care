package com.jeevanSetuBackend.backend;

import com.jeevanSetuBackend.backend.dto.HealthReadingRequest;
import com.jeevanSetuBackend.backend.exception.BadRequestException;
import com.jeevanSetuBackend.backend.model.HealthReading;
import com.jeevanSetuBackend.backend.repository.HealthReadingRepository;
import com.jeevanSetuBackend.backend.repository.PatientProfileRepository;
import com.jeevanSetuBackend.backend.service.HealthReadingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class HealthReadingServiceTests {

    @Mock
    private HealthReadingRepository healthReadingRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    private HealthReadingService healthReadingService;

    @BeforeEach
    void setUp() {
        healthReadingService = new HealthReadingService(healthReadingRepository, patientProfileRepository);
    }

    @Test
    void testRecordValidReading() {
        HealthReadingRequest request = new HealthReadingRequest();
        request.setPatientId("P1001");
        request.setHeartRate(78);
        request.setSpo2(98.5);
        request.setTemperature(98.6);
        request.setSystolic(120);
        request.setDiastolic(80);
        request.setSource("ESP32_HARDWARE");
        request.setSimulated(false);

        when(healthReadingRepository.save(any(HealthReading.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HealthReading result = healthReadingService.recordReading(request);

        assertNotNull(result);
        assertEquals("P1001", result.getPatientId());
        assertEquals(78, result.getHeartRate());
        assertEquals(98.5, result.getSpo2());
        assertFalse(result.isSimulated());
    }

    @Test
    void testRecordImplausibleHeartRateThrowsBadRequest() {
        HealthReadingRequest request = new HealthReadingRequest();
        request.setPatientId("P1001");
        request.setHeartRate(320); // Implausibly high

        assertThrows(BadRequestException.class, () -> healthReadingService.recordReading(request));
    }

    @Test
    void testRecordImplausibleSpo2ThrowsBadRequest() {
        HealthReadingRequest request = new HealthReadingRequest();
        request.setPatientId("P1001");
        request.setSpo2(40.0); // Implausibly low

        assertThrows(BadRequestException.class, () -> healthReadingService.recordReading(request));
    }
}
