# JeevanSetu AI – IoT Biometric Telemetry & Hardware Guide

This module manages the edge telemetry ingestion pipeline connecting physical sensor microcontrollers (ESP32) and local development simulators to the JeevanSetu AI backend.

---

## 1. IoT Ingestion API Specification

- **Endpoint**: `POST /api/iot/readings`
- **Security Header**: `X-Device-Key: <DEVICE_API_KEY>` (Configured via `DEVICE_API_KEY` in backend)
- **Content-Type**: `application/json`

### Payload Schema
```json
{
  "patientId": "P1001",
  "deviceId": "ESP32-VILLAGE-NODE-01",
  "heartRate": 78,
  "spo2": 98.2,
  "temperature": 98.4,
  "systolic": 120,
  "diastolic": 80,
  "respiratoryRate": 16,
  "ecgSummary": "Normal Sinus",
  "source": "ESP32_HARDWARE",
  "simulated": false
}
```

### Safety & Integrity Controls
1. **Device Authentication**: Requests lacking or presenting an invalid `X-Device-Key` header are immediately rejected with `HTTP 401 Unauthorized`.
2. **Biological Plausibility Validation**:
   - `heartRate`: 30 – 250 BPM
   - `spo2`: 50% – 100%
   - `temperature`: 80.0°F – 115.0°F
   - `systolic`: 50 – 260 mmHg
   - `diastolic`: 30 – 160 mmHg
   Readings outside these boundaries trigger `HTTP 400 Bad Request` with an explicit diagnostic message.
3. **Simulated vs. Real Hardware Segregation**:
   - All synthetic telemetry must declare `"simulated": true` and `"source": "SIMULATOR"`.
   - Real hardware readings transmitted by ESP32 firmware declare `"simulated": false` and `"source": "ESP32_HARDWARE"`.

---

## 2. ESP32 Hardware Wiring Reference

| Sensor Module | Measured Biometrics | ESP32 Pin Connection | Bus Protocol |
|---|---|---|---|
| **MAX30102** | Pulse Rate & Blood Oxygen (SpO2) | `SDA -> GPIO 21`, `SCL -> GPIO 22`, `VIN -> 3.3V`, `GND -> GND` | I2C |
| **MLX90614** | Non-Contact Infrared Body Temperature | `SDA -> GPIO 21`, `SCL -> GPIO 22`, `VIN -> 3.3V`, `GND -> GND` | I2C (Shared Bus) |
| **AD8232** | Single-Lead ECG Waveform | `OUTPUT -> ADC GPIO 34`, `LO+ -> GPIO 32`, `LO- -> GPIO 33`, `3.3V/GND` | Analog ADC |

Firmware source: `iot/esp32_firmware/jeevansetu_esp32.ino`.

---

## 3. IoT Sensor Simulator (Development Testing)

When physical microcontrollers are unavailable, use the Python CLI simulator:

### Single-Shot High-Risk Telemetry
```bash
python iot/simulator/iot_simulator.py --preset HIGH --patient P1001
```

### Continuous 5-Second Telemetry Stream
```bash
python iot/simulator/iot_simulator.py --stream --interval 5 --preset NORMAL --patient P1001
```

### Supported Presets
- `NORMAL`: Resting heart rate (68-78 bpm), normal oxygen (97.5-99.2%), normal BP (118/76).
- `MEDIUM`: Mild tachycardia (95-105 bpm), borderline SpO2 (93-95%), low-grade fever (100.8°F).
- `HIGH`: Severe tachycardia (118-135 bpm), acute hypoxia (86-89.5%), Stage 2 hypertensive crisis (160+/98+ mmHg).
