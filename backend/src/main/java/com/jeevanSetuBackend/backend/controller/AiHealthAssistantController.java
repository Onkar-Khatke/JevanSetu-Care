package com.jeevanSetuBackend.backend.controller;

import com.jeevanSetuBackend.backend.dto.AiChatRequest;
import com.jeevanSetuBackend.backend.dto.AiChatResponse;
import com.jeevanSetuBackend.backend.dto.ApiResponse;
import com.jeevanSetuBackend.backend.model.HealthAssistantMessage;
import com.jeevanSetuBackend.backend.service.AiHealthAssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiHealthAssistantController {

    private final AiHealthAssistantService assistantService;

    public AiHealthAssistantController(AiHealthAssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = assistantService.processMessage(request);
        return ResponseEntity.ok(ApiResponse.ok("Health assistant evaluation complete", response));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<ApiResponse<List<HealthAssistantMessage>>> getChatHistory(@PathVariable String patientId) {
        List<HealthAssistantMessage> history = assistantService.getPatientChatHistory(patientId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
