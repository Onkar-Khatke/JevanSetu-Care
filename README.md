# JeevanSetu AI — Rural Smart Health & Emergency Network
*(जीवनसेतू — ग्रामीण स्मार्ट आरोग्य आणि आणीबाणी नेटवर्क)*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x%20%2F%204.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%20%2F%2021%20%2F%2025-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local%20%2F%20Atlas-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview & Features

**JeevanSetu AI (जीवनसेतू)** is a full-stack, distributed healthcare and emergency response coordination platform engineered specifically for remote and rural primary healthcare sectors. 

In rural geographies, access to emergency transit and immediate specialist evaluation is often hampered by distance and infrastructure bottlenecks. JeevanSetu AI connects patients, village health workers (ASHA/ANM), emergency ambulance fleets, consulting doctors, and district trauma hospitals into a single, cohesive network.

### Key Capabilities
1. **Landing Page & Educational Portal**: Informative, accessible overview of services and instant persona switching.
2. **Patient Registration & Medical Records**: Complete demographic profile, blood group, allergies, chronic medical history, and past health readings with role-based access control.
3. **IoT Health Telemetry Pipeline**: Validated ingestion of temperature, pulse rate, oxygen saturation (SpO2), blood pressure, and ECG with biological plausibility checking, tamper-evident `X-Device-Key` headers, and strict segregation between simulated and hardware readings.
4. **Emergency SOS & Smart Ambulance Coordination**: One-touch SOS trigger, coordinate-aware ambulance dispatch, real-time 5-stage lifecycle (`REQUESTED` → `ASSIGNED` → `ON_ROUTE` → `ARRIVED` → `COMPLETED`), duplicate submission prevention, and hospital bed preparation.
5. **Safe AI Health Assistant**: Multilingual triage guidance (English, Hindi, Marathi) with instant red-flag warning sign detection (cardiac, respiratory, stroke), contextual follow-up questions, and a safe rule-based fallback engine when external APIs are unconfigured or offline.
6. **Doctor & Healthcare Worker Portals**: Real-time vital trends (Recharts), electronic consultation records, and digital prescriptions.
7. **Hospital & Administrator Consoles**: Real-time bed counter management, intake toggle, fleet status oversight, and microservice health monitoring.

> [!IMPORTANT]
> **Clinical & Safety Disclaimer**: AI assistance in JeevanSetu AI is strictly for **preliminary health education, warning sign recognition, and triage prioritization**. It never claims to be a definitive medical diagnosis and does not prescribe medication or dangerous treatment.

---

## 2. System Architecture & Directory Structure

```
jeevansetu-ai/
│
├── backend/                                # Spring Boot 3.x/4.x Backend (Port 8080)
│   ├── pom.xml                             # Maven configuration (JJWT, Spring Web, MongoDB, Security)
│   └── src/
│       ├── main/java/com/jeevanSetuBackend/backend/
│       │   ├── BackendApplication.java     # Main Spring Boot application entry point
│       │   ├── config/                     # SecurityConfig, CORS, DataInitializerService
│       │   ├── controller/                 # Auth, Patient, Vitals, IoT, Emergency, Ambulance, Doctor, Hospital, AI, Admin
│       │   ├── dto/                        # Request/Response DTOs with Bean Validation
│       │   ├── exception/                  # GlobalExceptionHandler, ResourceNotFound, BadRequest
│       │   ├── model/                      # User, Role, PatientProfile, HealthReading, EmergencyRequest, Ambulance...
│       │   ├── repository/                 # Spring Data MongoDB Repositories (9 interfaces)
│       │   ├── security/                   # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│       │   └── service/                    # Business services and Safe Rule-Based AI Engine
│       └── test/java/com/jeevanSetuBackend/backend/
│           ├── BackendApplicationTests.java
│           ├── AuthServiceTests.java
│           ├── HealthReadingServiceTests.java
│           ├── EmergencyServiceTests.java
│           └── AiHealthAssistantServiceTests.java
│
├── frontend/                               # React 18 + Vite Frontend (Port 5173)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── api/apiClient.js                # Centralized Axios client (VITE_API_URL, Bearer JWT interceptor)
│   │   ├── context/AuthContext.jsx         # Authentication, persistent JWT token, role routing
│   │   ├── components/                     # Navbar, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx             # Public landing page explaining platform
│   │   │   ├── auth/                       # Login (with 1-click demo buttons), Register
│   │   │   ├── patient/                    # Dashboard, Vitals, History, AI Assistant, Emergency SOS, Profile
│   │   │   ├── doctor/                     # Dashboard, Patients, PatientDetail, Emergencies, Consultations
│   │   │   ├── ambulance/                  # Dashboard, ActiveDispatch (GPS waypoints & progress controls)
│   │   │   ├── hospital/                   # Dashboard (Bed manager & intake toggle), Emergencies
│   │   │   └── admin/                      # Dashboard (KPIs, Microservice health), Users directory
│   │   ├── App.jsx                         # Complete role-protected route mapping
│   │   └── main.jsx                        # React root entry point
│
├── iot/                                    # IoT Biometric Sensor Layer
│   ├── esp32_firmware/
│   │   └── jeevansetu_esp32.ino            # ESP32 C++ sketch for MAX30102, MLX90614, AD8232 with X-Device-Key
│   ├── simulator/
│   │   └── iot_simulator.py                # Python CLI simulator (--preset HIGH, --stream, --patient)
│   └── README.md                           # Hardware pinout and ingestion documentation
│
├── docs/                                   # Detailed Documentation
│   ├── architecture.md                     # System design, Mermaid diagrams, state machine
│   ├── api-documentation.md                # Comprehensive REST API reference & payloads
│   ├── database-schema.md                  # MongoDB collection definitions & ER diagram
│   ├── setup.md                            # Comprehensive setup and runtime manual
│   └── demo-flow.md                        # Step-by-step end-to-end evaluation scenario
│
├── .env.example                            # Safe environment variable template with placeholders
└── README.md                               # Root project documentation
```

---

## 3. Prerequisites & Installation

Ensure the following tools are installed on your workstation:
- **Java**: JDK 17, 21, or 25
- **Apache Maven**: 3.8+ (or use included `mvnw.cmd`)
- **Node.js**: v18+ and npm
- **Python**: 3.9+ (for IoT simulator)
- **MongoDB**: Local MongoDB community edition running on `localhost:27017` or MongoDB Atlas

---

## 4. Configuration & Environment Variables

Create a local `.env` or export environment variables as needed (see `.env.example`):

```bash
# Server Port
PORT=8080

# MongoDB Connection String (Defaults to local standalone)
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/jeevansetu

# JWT Secret (Minimum 256 bits)
JWT_SECRET=9a3f2c4e8b1d7a6f5e0c3b8a2d1e4f7a9b0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e
JWT_EXPIRATION_MS=86400000

# IoT Security Header Key
DEVICE_API_KEY=jeevansetu-iot-secure-dev-key-2026

# AI Health Assistant Provider Adapter
# Options: "safe-fallback" (default safe engine), "gemini", "openai", "http-service"
AI_PROVIDER=safe-fallback
AI_API_KEY=
AI_SERVICE_URL=http://localhost:5000

# Frontend API URL
VITE_API_URL=http://localhost:8080/api
```

---

## 5. Startup Commands

### Step 1: Start MongoDB
Ensure `mongod` is running on `localhost:27017`.

### Step 2: Start the Spring Boot Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*Note: On initial startup, `DataInitializerService` automatically creates all demo accounts and seed facilities.*

### Step 3: Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### Step 4: Run the IoT Biometric Simulator
```bash
cd iot/simulator
python iot_simulator.py --preset HIGH --patient P1001
```

---

## 6. Pre-Seeded Demo Personas

You can click any of the **1-Click Demo Buttons** on `/login` or enter credentials manually:

| Role | Email | Password | Pre-Seeded Name | Function |
|---|---|---|---|---|
| **PATIENT** | `patient1@jeevansetu.org` | `Patient@123` | Ramesh Patil (P1001) | Rural citizen dashboard, vitals, SOS, AI chat |
| **DOCTOR** | `doctor1@jeevansetu.org` | `Doctor@123` | Dr. Aarav Sharma (DOC-01) | Clinical review, Recharts vitals, prescriptions |
| **HEALTHCARE_WORKER**| `worker1@jeevansetu.org` | `Worker@123` | Sunita Tai (HW-01) | Village ASHA health worker |
| **AMBULANCE** | `ambulance1@jeevansetu.org` | `Driver@123` | Suresh Yadav (AMB-01) | Emergency dispatch & journey progression |
| **ADMIN** | `admin@jeevansetu.org` | `Admin@123` | Network Operations Admin | System KPIs, user directory, facility oversight |

---

## 7. REST API Endpoints Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (public admin assignment blocked) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return stateless JWT |
| `GET` | `/api/auth/me` | Authenticated | Current user profile |
| `GET` | `/api/patients` | Doctor/Worker/Admin | List patient roster |
| `GET` | `/api/patients/{id}` | Authenticated | Retrieve patient profile |
| `PUT` | `/api/patients/{id}` | Authenticated | Update patient demographic & medical history |
| `POST` | `/api/vitals` | Authenticated | Record health readings with plausibility checks |
| `GET` | `/api/vitals/patient/{id}` | Authenticated | Historical biometric telemetry |
| `GET` | `/api/vitals/latest/{id}` | Authenticated | Latest biometric reading |
| `POST` | `/api/iot/readings` | `X-Device-Key` Protected | Ingest hardware or simulated sensor data |
| `POST` | `/api/emergency` | Authenticated | Trigger Emergency SOS (duplicate protected) |
| `GET` | `/api/emergency/active` | Authenticated | List all active SOS missions |
| `PUT` | `/api/emergency/{id}/status` | Authenticated | Advance status (`REQUESTED` → `COMPLETED`) |
| `GET` | `/api/ambulances` | Authenticated | Fleet units and GPS coordinates |
| `PUT` | `/api/ambulances/{id}/status` | Ambulance/Admin | Update ambulance status |
| `GET` | `/api/doctors` | Authenticated | List practicing doctors |
| `POST` | `/api/doctors/consultations`| Doctor | Create clinical consultation & prescription |
| `GET` | `/api/hospitals` | Authenticated | Hospital facility directory |
| `PUT` | `/api/hospitals/{id}/availability` | Hospital/Admin | Update available beds & intake toggle |
| `POST` | `/api/ai/chat` | Authenticated | Multilingual triage, red-flags & safe advice |
| `GET` | `/api/admin/stats` | Admin | System counters, active emergencies & microservices |
| `GET` | `/api/admin/users` | Admin | System user directory |
| `GET` | `/api/health` | Public | Microservice health check |

---

## 8. Automated Testing & Verification

The project includes unit and integration tests across all tiers:
- **Backend Tests**: Run `mvn test` in `backend/`
  - Results: **13 tests executed, 0 failures, 0 errors, 100% success rate**.
  - Verified: Authentication, public admin registration block, vital plausibility checking, emergency auto-assignment, duplicate prevention, and AI red-flag symptom detection.
- **Frontend Build**: Run `npm run build` in `frontend/`
  - Results: **Built cleanly in 57s with 0 errors**.

---

## 9. AI Health Assistant & Safe Fallback Architecture

When evaluating symptoms, the backend inspects `AI_PROVIDER` and `AI_API_KEY`:
- If an external provider is configured and consented to, it can invoke external models.
- If **no API key is provided** or the provider is `safe-fallback` (default):
  The embedded **Safe Rule-Based Clinical Triage Engine** executes locally:
  - Scans for critical red flags:
    - Cardiac distress: *"chest pain"*, *"pressure"*, *"radiating to arm"* → `HIGH` risk, immediate emergency warning.
    - Acute dyspnea: *"cannot breathe"*, *"severe shortness of breath"* → `HIGH` risk.
    - Stroke signs: *"facial drooping"*, *"slurred speech"*, *"paralysis"* → `HIGH` risk.
  - Considers vital telemetries: SpO2 < 90% (Hypoxia), HR > 120 bpm (Tachycardia), BP ≥ 160/100 (Hypertension Stage 2).
  - Formulates contextual follow-up questions.
  - Generates clear, non-jargon recommendations in English, Hindi, or Marathi.
  - Clearly labels its output: `"Engine: Safe Rule-Based Fallback Engine (No External API Required)"`.
  - Appends mandatory clinical disclaimer.

---

## 10. Known Limitations & Next Steps

1. **Hardware Ingestion**: Physical ESP32 hardware requires a local WiFi network and configured server IP in `jeevansetu_esp32.ino`. For local machine testing, `iot_simulator.py` provides exact byte-for-byte protocol parity.
2. **External AI API Keys**: To connect Gemini or OpenAI models, provide `AI_API_KEY` and set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai`. The safe fallback engine works out-of-the-box with zero external dependencies.
3. **SMS Gateway**: For live SMS alerts to feature phones (non-smartphones in deep rural areas), an integration with Twilio or DLT-registered Indian SMS gateways (e.g. Gupshup/MSG91) can be attached to the notification pipeline.
