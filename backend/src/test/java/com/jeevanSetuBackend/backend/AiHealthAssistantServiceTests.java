package com.jeevanSetuBackend.backend;

import com.jeevanSetuBackend.backend.dto.AiChatRequest;
import com.jeevanSetuBackend.backend.dto.AiChatResponse;
import com.jeevanSetuBackend.backend.repository.HealthAssistantMessageRepository;
import com.jeevanSetuBackend.backend.service.AiHealthAssistantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AiHealthAssistantServiceTests {

    @Mock
    private HealthAssistantMessageRepository messageRepository;

    private AiHealthAssistantService assistantService;

    @BeforeEach
    void setUp() {
        assistantService = new AiHealthAssistantService(messageRepository);
    }

    @Test
    void testCardiacRedFlagDetectedAsHighRiskWithEmergencyAlert() {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("I have acute crushing chest pain radiating to left arm and sweating");
        request.setSpo2(88.0); // Critical hypoxia

        AiChatResponse response = assistantService.processMessage(request);

        assertNotNull(response);
        assertEquals("HIGH", response.getRiskLevel());
        assertTrue(response.isEmergencyWarning());
        assertFalse(response.getWarningIndicators().isEmpty());
        assertTrue(response.getRecommendations().stream().anyMatch(r -> r.contains("Emergency SOS")));
        assertNotNull(response.getDisclaimer());
        assertTrue(response.getProvider().contains("Safe Rule-Based Fallback Engine"));
    }

    @Test
    void testModerateFeverTreatedAsMediumRisk() {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("I have mild fever and cough for two days");

        AiChatResponse response = assistantService.processMessage(request);

        assertNotNull(response);
        assertEquals("MEDIUM", response.getRiskLevel());
        assertFalse(response.isEmergencyWarning());
        assertNotNull(response.getFollowUpQuestions());
        assertFalse(response.getFollowUpQuestions().isEmpty());
    }

    @Test
    void testGeneralHealthQueryReturnsLowRiskEducationalAdvice() {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("What are healthy habits for controlling high blood pressure?");

        AiChatResponse response = assistantService.processMessage(request);

        assertNotNull(response);
        assertEquals("LOW", response.getRiskLevel());
        assertFalse(response.isEmergencyWarning());
        assertNotNull(response.getDisclaimer());
    }
}
