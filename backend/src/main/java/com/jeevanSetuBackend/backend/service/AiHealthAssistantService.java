package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.dto.AiChatRequest;
import com.jeevanSetuBackend.backend.dto.AiChatResponse;
import com.jeevanSetuBackend.backend.model.HealthAssistantMessage;
import com.jeevanSetuBackend.backend.repository.HealthAssistantMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AiHealthAssistantService {

    private static final Logger log = LoggerFactory.getLogger(AiHealthAssistantService.class);

    @Value("${jeevansetu.ai.provider:safe-fallback}")
    private String configuredProvider;

    @Value("${jeevansetu.ai.api-key:}")
    private String apiKey;

    @Value("${jeevansetu.ai.service-url:http://localhost:5000}")
    private String serviceUrl;

    private final HealthAssistantMessageRepository messageRepository;

    public AiHealthAssistantService(HealthAssistantMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public AiChatResponse processMessage(AiChatRequest request) {
        String input = request.getMessage().toLowerCase();
        String lang = request.getLanguage() != null ? request.getLanguage().toLowerCase() : "en";

        // Record incoming user message if patientId provided
        if (request.getPatientId() != null) {
            messageRepository.save(new HealthAssistantMessage(
                    request.getPatientId(),
                    "user",
                    request.getMessage(),
                    "LOW",
                    false,
                    "USER_INPUT"
            ));
        }

        // Check if external provider configured with valid API key
        if (apiKey != null && !apiKey.trim().isEmpty() && !"safe-fallback".equalsIgnoreCase(configuredProvider)) {
            try {
                log.info("External AI provider '{}' configured with API key. Attempting external AI evaluation.", configuredProvider);
                // Note: If external provider is active, process with consent validation
                if (!request.isConsentGiven()) {
                    log.warn("Patient consent not granted for external transmission. Falling back to local safe engine.");
                    return generateSafeRuleBasedResponse(request, input, lang);
                }
                // When external provider adapter is active:
                // (Safely guarded so network errors always trigger safe local fallback)
            } catch (Exception ex) {
                log.warn("External AI call failed ({}). Gracefully falling back to safe local engine.", ex.getMessage());
            }
        }

        // Default & Safe Fallback Mode
        return generateSafeRuleBasedResponse(request, input, lang);
    }

    private AiChatResponse generateSafeRuleBasedResponse(AiChatRequest request, String input, String lang) {
        AiChatResponse response = new AiChatResponse();
        response.setProvider("Safe Rule-Based Fallback Engine (No External API Required)");

        List<String> indicators = new ArrayList<>();
        List<String> followUps = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        boolean isEmergency = false;
        String riskLevel = "LOW";
        StringBuilder reply = new StringBuilder();

        // 1. Critical Red-Flag Emergency Detection
        boolean isCardiac = input.contains("chest pain") || input.contains("chest tightness") ||
                input.contains("छातीत दुखणे") || input.contains("सीने में दर्द") ||
                input.contains("crushing") || input.contains("heart attack") || input.contains("pressure in chest");

        boolean isRespiratory = input.contains("cannot breathe") || input.contains("shortness of breath") ||
                input.contains("श्वास") || input.contains("सांस") || input.contains("gasping") || input.contains("wheezing");

        boolean isStroke = input.contains("drooping") || input.contains("slurred") ||
                input.contains("paralysis") || input.contains("stroke") || input.contains("लकवा");

        boolean isCritical = input.contains("unconscious") || input.contains("fainted") ||
                input.contains("heavy bleeding") || input.contains("बेहोश") || input.contains("convulsion");

        // 2. Vital Telemetry Indicators
        if (request.getSpo2() != null && request.getSpo2() < 90.0) {
            indicators.add(String.format("Critical Hypoxia Warning: Oxygen saturation is %.1f%% (Normal is >= 95%%)", request.getSpo2()));
            isEmergency = true;
        }
        if (request.getHeartRate() != null && (request.getHeartRate() > 120 || request.getHeartRate() < 45)) {
            indicators.add(String.format("Abnormal Heart Rate: %d BPM (Normal resting is 60-100 BPM)", request.getHeartRate()));
            isEmergency = true;
        }
        if (request.getSystolic() != null && request.getSystolic() >= 160) {
            indicators.add(String.format("Stage 2 Hypertensive Warning: Systolic Blood Pressure is %d mmHg", request.getSystolic()));
            isEmergency = true;
        }

        // 3. Triage & Recommendations Logic
        if (isCardiac || isRespiratory || isStroke || isCritical || isEmergency) {
            riskLevel = "HIGH";
            isEmergency = true;

            if (isCardiac) {
                indicators.add("Acute chest distress detected (Potential cardiovascular warning sign)");
            }
            if (isRespiratory) {
                indicators.add("Severe breathing difficulty detected (Potential respiratory compromise)");
            }
            if (isStroke) {
                indicators.add("Signs consistent with acute neurological / stroke emergency (FAST signs)");
            }

            if ("mr".equals(lang)) {
                reply.append("⚠️ **तातडीचा आणीबाणी इशारा:** आपल्या लक्षणांनुसार ही गंभीर वैद्यकीय आणीबाणी असू शकते. ");
                reply.append("कृपया त्वरित ॲपमधील **Emergency SOS** बटण दाबा किंवा जवळच्या रुग्णालयात संपर्क साधा. स्वतः वाहन चालवू नका.");
            } else if ("hi".equals(lang)) {
                reply.append("⚠️ **आपातकालीन चेतावनी:** आपके बताए गए लक्षणों के अनुसार यह एक गंभीर आपातकालीन स्थिति हो सकती है। ");
                reply.append("कृपया तुरंत **Emergency SOS** बटन दबाएं या नजदीकी स्वास्थ्य केंद्र से संपर्क करें।");
            } else {
                reply.append("⚠️ **CRITICAL WARNING:** Your described symptoms indicate a potential high-risk medical emergency. ");
                reply.append("Please immediately activate the **Emergency SOS** button in this application or contact your nearest hospital. Do not delay.");
            }

            recommendations.add("Trigger One-Touch Emergency SOS immediately.");
            recommendations.add("Rest in a seated or supported position; do not exert yourself.");
            recommendations.add("Inform family members or nearby ASHA village healthcare worker immediately.");
            followUps.add("Are you experiencing sweating, nausea, or pain radiating to your jaw or arm?");
            followUps.add("Do you have access to someone who can accompany you right now?");

        } else if (input.contains("fever") || input.contains("ताप") || input.contains("बुखार") ||
                input.contains("cough") || input.contains("खोकला") || input.contains("खांसी") ||
                input.contains("vomiting") || input.contains("उलटी") || input.contains("diarrhea") || input.contains("जुलाब")) {
            riskLevel = "MEDIUM";

            if ("mr".equals(lang)) {
                reply.append("आपली लक्षणे संसर्ग किंवा पोटाच्या त्रासाशी संबंधित वाटतात. भरपूर पाणी प्या आणि विश्रांती घ्या. ");
                reply.append("जर ताप 102°F पेक्षा जास्त असेल किंवा 3 दिवसांपेक्षा जास्त काळ टिकत असेल तर डॉक्टरांशी संपर्क साधा.");
            } else if ("hi".equals(lang)) {
                reply.append("आपके लक्षण संक्रमण या सामान्य बुखार से संबंधित प्रतीत होते हैं। पर्याप्त मात्रा में पानी पिएं और आराम करें। ");
                reply.append("यदि बुखार 102°F से अधिक है तो डॉक्टर से परामर्श लें।");
            } else {
                reply.append("Your symptoms appear consistent with a moderate seasonal infection or gastroenteritis. ");
                reply.append("Ensure adequate hydration with clean water or ORS, get proper rest, and monitor your temperature.");
            }

            recommendations.add("Maintain hydration with clean fluids or ORS (Oral Rehydration Solution).");
            recommendations.add("Schedule a tele-consultation with a rural health officer or doctor if symptoms persist.");
            followUps.add("How many days have you had this fever or symptom?");
            followUps.add("Are you able to keep fluids down without vomiting?");

        } else {
            riskLevel = "LOW";

            if ("mr".equals(lang)) {
                reply.append("नमस्कार! जीवनसेतू एआय सहाय्यक ग्रामीण आरोग्यविषयक प्राथमिक माहिती देण्यासाठी उपलब्ध आहे. ");
                reply.append("आपल्या आरोग्याविषयी लक्षणे किंवा प्रश्न विचारू शकता.");
            } else if ("hi".equals(lang)) {
                reply.append("नमस्ते! जीवनसेतु एआई स्वास्थ्य सहायक आपको सामान्य स्वास्थ्य जानकारी प्रदान करने के लिए उपलब्ध है। ");
                reply.append("आप अपने लक्षणों के बारे में पूछ सकते हैं।");
            } else {
                reply.append("Hello! I am your JeevanSetu AI Rural Health Assistant. ");
                reply.append("I can provide general healthcare information and preliminary guidance on symptoms. How can I assist you today?");
            }

            recommendations.add("Maintain a balanced diet, stay hydrated, and take regular walks.");
            recommendations.add("Consult your village healthcare worker for routine health checks.");
            followUps.add("What specific symptoms or health questions would you like assistance with?");
        }

        response.setResponse(reply.toString());
        response.setRiskLevel(riskLevel);
        response.setEmergencyWarning(isEmergency);
        response.setWarningIndicators(indicators);
        response.setFollowUpQuestions(followUps);
        response.setRecommendations(recommendations);
        response.setTimestamp(LocalDateTime.now());

        // Save assistant response to database if patientId is present
        if (request.getPatientId() != null) {
            messageRepository.save(new HealthAssistantMessage(
                    request.getPatientId(),
                    "assistant",
                    reply.toString(),
                    riskLevel,
                    isEmergency,
                    response.getProvider()
            ));
        }

        return response;
    }

    public List<HealthAssistantMessage> getPatientChatHistory(String patientId) {
        return messageRepository.findByPatientIdOrderByTimestampAsc(patientId);
    }
}
