package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.dto.HealthReadingRequest;
import com.jeevanSetuBackend.backend.exception.BadRequestException;
import com.jeevanSetuBackend.backend.exception.UnauthorizedException;
import com.jeevanSetuBackend.backend.model.HealthReading;
import com.jeevanSetuBackend.backend.service.HealthReadingService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/iot")
public class IotIngestionController {

    private static final Logger log = LoggerFactory.getLogger(IotIngestionController.class);

    @Value("${jeevansetu.iot.device-key:jeevansetu-iot-secure-dev-key-2026}")
    private String expectedDeviceKey;

    private final HealthReadingService healthReadingService;

    public IotIngestionController(HealthReadingService healthReadingService) {
        this.healthReadingService = healthReadingService;
    }

    @PostMapping("/readings")
    public ResponseEntity<ApiResponse<HealthReading>> ingestIotReading(
            @RequestHeader(value = "X-Device-Key", required = false) String deviceKey,
            @Valid @RequestBody HealthReadingRequest request) {

        // Validate IoT Device Security Key
        if (deviceKey == null || !expectedDeviceKey.equals(deviceKey.trim())) {
            log.warn("Rejected unauthorized IoT telemetry ingestion attempt with invalid/missing device key.");
            throw new UnauthorizedException("Unauthorized IoT device: Invalid or missing X-Device-Key header.");
        }

        // Validate presence of Patient ID and Device Identifier
        if (request.getDeviceId() == null || request.getDeviceId().trim().isEmpty()) {
            throw new BadRequestException("Device Identifier (deviceId) is mandatory for IoT sensor ingestion.");
        }

        // Tag hardware vs simulated telemetry
        if (request.getSource() == null || request.getSource().trim().isEmpty()) {
            request.setSource(request.isSimulated() ? "SIMULATOR" : "ESP32_HARDWARE");
        }

        HealthReading reading = healthReadingService.recordReading(request);
        log.info("Successfully ingested IoT telemetry from device '{}' for patient '{}' [Simulated: {}]",
                reading.getDeviceId(), reading.getPatientId(), reading.isSimulated());

        return ResponseEntity.ok(ApiResponse.ok("IoT telemetry ingested successfully", reading));
    }
}
