# JeevanSetu AI – Comprehensive Setup & Installation Guide

This guide walks through configuring, installing, and starting all tiers of the **JeevanSetu AI** rural healthcare platform.

---

## 1. Prerequisites

Ensure the following runtimes and build tools are installed on your workstation:

| Component | Minimum Version | Verified Version | Purpose |
|---|---|---|---|
| **Java Development Kit (JDK)** | Java 17+ | OpenJDK 17 / 21 / 25 | Spring Boot backend |
| **Apache Maven** | 3.8+ | 3.9.x | Java dependency management & compilation |
| **Node.js & npm** | Node 18+ / npm 9+ | Node 20.x / npm 10+ | React Vite frontend |
| **Python** | 3.9+ | Python 3.10 / 3.11 / 3.12 | FastAPI AI service & IoT Simulator |
| **MongoDB** | 6.0+ | Local `mongod` or Atlas cloud | NoSQL persistence tier |

---

## 2. Directory Layout

Navigate to the project root:
```bash
cd "C:\Users\onkar khatke\.gemini\antigravity\scratch\jeevansetu-ai"
```

The workspace consists of:
- `backend/`: Spring Boot 3.x REST API service.
- `frontend/`: React 18 + Vite + Tailwind CSS Single Page Application.
- `ai-service/`: FastAPI preliminary triage and multilingual symptom engine.
- `iot/`: ESP32 Arduino C++ firmware and command-line Python IoT telemetry simulator.
- `docs/`: Technical guides, API specifications, and architecture diagrams.

---

## 3. Tier-by-Tier Setup Instructions

### Tier 1: MongoDB Database

1. **Option A: Local MongoDB**
   Start your local MongoDB service:
   ```bash
   mongod --dbpath "C:\data\db"
   ```
   Default connection string: `mongodb://localhost:27017/jeevansetu`

2. **Option B: MongoDB Atlas (Cloud)**
   Obtain your connection string from MongoDB Atlas:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/jeevansetu?retryWrites=true&w=majority`

---

### Tier 2: Python AI Microservice (Port 5000)

1. Open a new terminal and navigate to `ai-service`:
   ```bash
   cd ai-service
   ```

2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the automated test suite to verify the AI rules and multilingual triage:
   ```bash
   python test_ai.py
   ```
   *Expected output: `ALL AI ENGINE TESTS PASSED`*

5. Start the AI service on port 5000:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 5000 --reload
   ```
   *Verification:* Visit `http://localhost:5000/health` in your browser. It should return `{"status":"HEALTHY","service":"JeevanSetu AI Engine"}`.

---

### Tier 3: Spring Boot 3.x Backend (Port 8080)

1. Open a second terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Review `src/main/resources/application.properties`:
   ```properties
   server.port=8080
   spring.data.mongodb.uri=mongodb://localhost:27017/jeevansetu
   ai.service.url=http://localhost:5000
   jeevansetu.jwt.secret=9a3f2c4e8b1d7a6f5e0c3b8a2d1e4f7a9b0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e
   jeevansetu.jwt.expiration-ms=86400000
   ```

3. Compile and execute unit/integration tests:
   ```bash
   mvn test
   ```
   *Expected output: `BUILD SUCCESS (4 tests passed, 0 failures)`*

4. Launch the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *Note: On initial startup, `DataInitializer` automatically pre-seeds all demo accounts (Patients, Doctors, Fleet, Hospitals, Admin).*

---

### Tier 4: React Single Page Application (Port 5173)

1. Open a third terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Verify `.env` configuration:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. Install frontend dependencies (if not already completed):
   ```bash
   npm install
   ```

4. Verify production build:
   ```bash
   npm run build
   ```

5. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Verification:* Open `http://localhost:5173` in your browser. You will see the JeevanSetu AI portal.

---

### Tier 5: IoT Biometric Telemetry & Simulation

1. Open a fourth terminal and navigate to `iot/simulator`:
   ```bash
   cd iot/simulator
   ```

2. Ingest single-shot abnormal vitals to trigger high risk:
   ```bash
   python iot_simulator.py --preset HIGH --patient P1001
   ```

3. Or start continuous telemetry streaming (pushing new biometrics every 5 seconds):
   ```bash
   python iot_simulator.py --stream --interval 5 --patient P1001
   ```

---

## 4. Default Seeded Credentials

The system comes pre-configured with 1-click login buttons on `/login`, or you can log in manually:

| Persona | Email | Password | Entity ID |
|---|---|---|---|
| **Patient** (High Risk) | `patient1@jeevansetu.org` | `Patient@123` | `P1001` (Ramesh Patil) |
| **Doctor** | `doctor1@jeevansetu.org` | `Doctor@123` | `doc1` (Dr. Aarav Sharma) |
| **Ambulance Driver** | `ambulance1@jeevansetu.org` | `Driver@123` | `amb1` (Suresh Yadav) |
| **Hospital Admin** | `hospital1@jeevansetu.org` | `Hospital@123` | `hosp1` (Shirur Sub-District) |
| **System Admin** | `admin@jeevansetu.org` | `Admin@123` | `admin1` (System Admin) |

---

## 5. Troubleshooting & Health Checks

- **Spring Boot fails to connect to MongoDB**:
  Check if `mongod` is running. If using MongoDB Atlas, make sure your IP is allowlisted in Network Access.
- **AI Service shows offline in Admin Dashboard**:
  Verify `uvicorn` is active on port 5000. Note that Spring Boot will automatically fallback to internal clinical heuristics if Python is down.
- **CORS Errors**:
  The backend permits `http://localhost:5173`, `http://localhost:3000`, and `http://127.0.0.1:5173` by default in `SecurityConfig.java`.
