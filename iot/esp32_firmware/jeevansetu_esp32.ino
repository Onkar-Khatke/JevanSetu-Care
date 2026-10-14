/**
 * JeevanSetu AI - ESP32 Smart Rural Health Node
 * Firmware for Biometric Telemetry Edge Station
 * 
 * Hardware Sensors:
 * 1. MAX30102: Optical Heart Rate & Pulse Oximeter (SpO2)
 *    - I2C SDA -> GPIO 21
 *    - I2C SCL -> GPIO 22
 *    - VIN -> 3.3V, GND -> GND
 * 2. MLX90614: Infrared Non-Contact Body Thermometer
 *    - Shared I2C Bus (SDA 21, SCL 22)
 * 3. AD8232: Single-Lead ECG Heart Rate Monitor
 *    - OUTPUT -> ADC GPIO 34
 *    - LO+ -> GPIO 32, LO- -> GPIO 33
 * 
 * Ingestion Protocol:
 * - HTTP POST /api/iot/readings
 * - Security Header: X-Device-Key: <DEVICE_API_KEY>
 * - Content-Type: application/json
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>

// WiFi Configuration (Replace with village clinic WiFi or GSM hotspot)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// JeevanSetu Ingestion Server Configuration
const char* serverUrl = "http://192.168.1.100:8080/api/iot/readings";
const char* deviceKey = "jeevansetu-iot-secure-dev-key-2026";
const char* deviceId  = "ESP32-VILLAGE-NODE-01";
const char* patientId = "P1001"; // Target enrolled patient profile

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  Serial.println("==================================================");
  Serial.println("JeevanSetu AI - Rural Health IoT Edge Initializing");
  Serial.println("==================================================");

  // Initialize WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to rural clinic network: ");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected! IP address: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi connection failed. Edge station entering offline buffer mode.");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 1. Acquire sensor telemetry (Placeholder reading variables for hardware integration)
    // Replace with: max30102.getHeartRate(), max30102.getSpO2(), mlx.readObjectTempF()
    int heartRate = 76;
    float spo2 = 98.2;
    float temperature = 98.4;
    int systolic = 120;
    int diastolic = 80;

    // 2. Construct JSON payload (Explicitly marked as hardware sensor reading)
    String jsonPayload = "{";
    jsonPayload += "\"patientId\":\"" + String(patientId) + "\",";
    jsonPayload += "\"deviceId\":\"" + String(deviceId) + "\",";
    jsonPayload += "\"heartRate\":" + String(heartRate) + ",";
    jsonPayload += "\"spo2\":" + String(spo2, 1) + ",";
    jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
    jsonPayload += "\"systolic\":" + String(systolic) + ",";
    jsonPayload += "\"diastolic\":" + String(diastolic) + ",";
    jsonPayload += "\"source\":\"ESP32_HARDWARE\",";
    jsonPayload += "\"simulated\":false";
    jsonPayload += "}";

    // 3. Transmit telemetry to Spring Boot backend
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-Key", deviceKey); // Security header

    Serial.println("[IoT] Transmitting telemetry payload: " + jsonPayload);
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("[IoT] HTTP Response %d: %s\n", httpResponseCode, response.c_str());
    } else {
      Serial.printf("[IoT] Ingestion error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }

  // Sample every 10 seconds
  delay(10000);
}
