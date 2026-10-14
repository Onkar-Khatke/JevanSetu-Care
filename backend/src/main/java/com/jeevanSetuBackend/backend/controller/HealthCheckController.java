package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("service", "JeevanSetu AI Backend");
        status.put("status", "UP");
        status.put("version", "1.0.0");
        status.put("environment", "production-ready");
        return ResponseEntity.ok(ApiResponse.ok("Service healthy", status));
    }
}
