package com.jeevanSetuBackend.backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AiChatResponse {

    private String response;
    private String riskLevel = "LOW"; // "LOW", "MEDIUM", "HIGH"
    private boolean emergencyWarning = false;
    private List<String> warningIndicators = new ArrayList<>();
    private List<String> followUpQuestions = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
    private String provider = "Safe Rule-Based Fallback Engine";
    private String disclaimer = "AI guidance is for preliminary health education and triage assistance only. It does NOT constitute a definitive medical diagnosis, nor does it prescribe medication. If experiencing severe symptoms, activate the Emergency SOS immediately.";
    private LocalDateTime timestamp = LocalDateTime.now();

    public AiChatResponse() {}

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public boolean isEmergencyWarning() { return emergencyWarning; }
    public void setEmergencyWarning(boolean emergencyWarning) { this.emergencyWarning = emergencyWarning; }

    public List<String> getWarningIndicators() { return warningIndicators; }
    public void setWarningIndicators(List<String> warningIndicators) { this.warningIndicators = warningIndicators; }

    public List<String> getFollowUpQuestions() { return followUpQuestions; }
    public void setFollowUpQuestions(List<String> followUpQuestions) { this.followUpQuestions = followUpQuestions; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
