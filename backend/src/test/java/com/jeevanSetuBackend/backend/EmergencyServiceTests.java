package com.jeevanSetuBackend.backend;

import com.jeevanSetuBackend.backend.dto.EmergencyCreateRequest;
import com.jeevanSetuBackend.backend.dto.EmergencyStatusUpdateRequest;
import com.jeevanSetuBackend.backend.model.*;
import com.jeevanSetuBackend.backend.repository.*;
import com.jeevanSetuBackend.backend.service.EmergencyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmergencyServiceTests {

    @Mock
    private EmergencyRequestRepository emergencyRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    @Mock
    private AmbulanceRepository ambulanceRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private DoctorRepository doctorRepository;

    private EmergencyService emergencyService;

    @BeforeEach
    void setUp() {
        emergencyService = new EmergencyService(
                emergencyRepository,
                patientProfileRepository,
                ambulanceRepository,
                hospitalRepository,
                doctorRepository
        );
    }

    @Test
    void testCreateEmergencyAutoAssignsAvailableAmbulance() {
        EmergencyCreateRequest request = new EmergencyCreateRequest();
        request.setPatientId("P1001");
        request.setSymptoms(List.of("Severe chest pain"));
        request.setLocationPermissionGranted(true);
        request.setLatitude(18.5204);
        request.setLongitude(73.8567);

        when(emergencyRepository.findFirstByPatientIdAndStatusNot(anyString(), any())).thenReturn(Optional.empty());
        when(patientProfileRepository.findById("P1001")).thenReturn(Optional.of(new PatientProfile()));

        Ambulance availableAmb = new Ambulance("Driver Dave", "9999", "MH-12-9999", 18.5, 73.8, "Pune", "Village");
        availableAmb.setId("AMB-1");
        when(ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE)).thenReturn(List.of(availableAmb));

        when(emergencyRepository.save(any(EmergencyRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmergencyRequest created = emergencyService.createEmergency(request);

        assertNotNull(created);
        assertEquals(EmergencyStatus.ASSIGNED, created.getStatus());
        assertEquals("AMB-1", created.getAssignedAmbulanceId());
        verify(ambulanceRepository, times(1)).save(availableAmb);
        assertEquals(AmbulanceStatus.ASSIGNED, availableAmb.getStatus());
    }

    @Test
    void testDuplicateEmergencyReturnsExistingActiveRequest() {
        EmergencyRequest existing = new EmergencyRequest();
        existing.setId("EM-EXISTING-01");
        existing.setPatientId("P1001");
        existing.setStatus(EmergencyStatus.ON_ROUTE);

        when(emergencyRepository.findFirstByPatientIdAndStatusNot("P1001", EmergencyStatus.COMPLETED))
                .thenReturn(Optional.of(existing));

        EmergencyCreateRequest request = new EmergencyCreateRequest();
        request.setPatientId("P1001");

        EmergencyRequest result = emergencyService.createEmergency(request);

        assertEquals("EM-EXISTING-01", result.getId());
        verify(emergencyRepository, never()).save(any());
    }
}
