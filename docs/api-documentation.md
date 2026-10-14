# JeevanSetu AI – REST API Documentation

**Base URL**: `http://localhost:8080/api`  
**Authentication**: HTTP Bearer JWT Header (`Authorization: Bearer <jwt_token>`)

All responses adhere to the standard envelope format:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-10-14T10:00:00"
}
```

---

## 1. Authentication Endpoints

### 1.1. Register Account
`POST /api/auth/register` (Public)

**Request Body:**
```json
{
  "name": "Ramesh Patil",
  "email": "ramesh@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "role": "PATIENT",
  "village": "Koregaon Bhima",
  "district": "Pune"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "user": {
      "id": "670...",
      "name": "Ramesh Patil",
      "email": "ramesh@example.com",
      "role": "PATIENT",
      "entityId": "P1001"
    }
  }
}
```

### 1.2. Login
`POST /api/auth/login` (Public)

**Request Body:**
```json
{
  "email": "patient1@jeevansetu.org",
  "password": "Patient@123"
}
```

### 1.3. Current User Profile
`GET /api/auth/me` (Authenticated)

---

## 2. Patient Management

### 2.1. Create / Update Patient Profile
`POST /api/patients`  
`PUT /api/patients/{id}`

**Request Body:**
```json
{
  "name": "Ramesh Patil",
  "age": 62,
  "gender": "Male",
  "phone": "9876543210",
  "email": "patient1@jeevansetu.org",
  "village": "Koregaon Bhima",
  "district": "Pune",
  "address": "Near Gram Panchayat, House No. 42",
  "emergencyContact": "9876543219",
  "medicalHistory": ["Hypertension", "Type 2 Diabetes"]
}
```

### 2.2. Get Patient by ID
`GET /api/patients/{id}`

---

## 3. IoT Biometric Telemetry (Vitals)

### 3.1. Submit Vitals
`POST /api/vitals` (Public / IoT Unauthenticated)

**Request Body:**
```json
{
  "patientId": "P1001",
  "heartRate": 118,
  "spo2": 89,
  "temperature": 101.4,
  "systolic": 158,
  "diastolic": 98,
  "ecg": "SINUS_TACHYCARDIA_SAMPLE",
  "source": "ESP32_MAX30102"
}
```

*Note: Ingesting vitals automatically runs preliminary AI risk triage and persists the risk assessment score.*

### 3.2. Get Latest Patient Vitals
`GET /api/vitals/latest/{patientId}`

### 3.3. Get Patient Vital History
`GET /api/vitals/patient/{patientId}`

---

## 4. AI Risk Assessment

### 4.1. Trigger On-Demand AI Risk Analysis
`POST /api/risk/analyze`

**Request Body:**
```json
{
  "patientId": "P1001",
  "age": 62,
  "heartRate": 120,
  "spo2": 88,
  "temperature": 101.2,
  "systolic": 160,
  "diastolic": 100,
  "symptoms": ["chest discomfort", "breathing difficulty"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "AI risk assessment completed",
  "data": {
    "patientId": "P1001",
    "riskLevel": "HIGH",
    "riskScore": 88,
    "indicators": [
      "Low SpO2 (Hypoxia risk)",
      "Elevated heart rate (Tachycardia)",
      "Stage 2 hypertension"
    ],
    "recommendation": "URGENT: Alert doctor and prepare emergency ambulance dispatch.",
    "disclaimer": "AI-assisted preliminary risk assessment. Never claim it is a medical diagnosis."
  }
}
```

---

## 5. Emergency SOS Coordination

### 5.1. Trigger Emergency SOS
`POST /api/emergency`

**Request Body:**
```json
{
  "patientId": "P1001",
  "riskLevel": "HIGH",
  "symptoms": ["Acute chest pain radiating to left arm", "Severe shortness of breath"],
  "latitude": 18.5204,
  "longitude": 73.8567,
  "notes": "Triggered via one-touch SOS button"
}
```

*Workflow Action: Automatically matches available ambulance unit, alerts nearest ready trauma hospital, and pushes alerts to assigned doctor.*

### 5.2. Get Active Emergencies
`GET /api/emergency/active`

### 5.3. Get Patient Emergencies
`GET /api/emergency/patient/{patientId}`

### 5.4. Update Emergency Status
`PUT /api/emergency/{id}/status`

**Request Body:**
```json
{
  "status": "AMBULANCE_ON_ROUTE",
  "notes": "Ambulance en route. Expected arrival in 12 mins."
}
```

**Allowed Status Values:**
- `CREATED`
- `DOCTOR_ALERTED`
- `AMBULANCE_ASSIGNED`
- `AMBULANCE_ON_ROUTE`
- `HOSPITAL_NOTIFIED`
- `PATIENT_ARRIVED`
- `COMPLETED`
- `CANCELLED`

---

## 6. Ambulance Fleet Management

### 6.1. Get All Ambulances
`GET /api/ambulances`

### 6.2. Get Available Ambulances
`GET /api/ambulances/available`

### 6.3. Assign Ambulance
`POST /api/ambulances/assign`

**Request Body:**
```json
{
  "ambulanceId": "amb1",
  "emergencyId": "em101"
}
```

### 6.4. Update Ambulance Fleet Status
`PUT /api/ambulances/{id}/status`

**Request Body:**
```json
{
  "status": "ON_ROUTE"
}
```
*(Statuses: `AVAILABLE`, `ASSIGNED`, `ON_ROUTE`, `ARRIVED`, `COMPLETED`)*

---

## 7. Hospital Facility Management

### 7.1. Get All Hospitals
`GET /api/hospitals`

### 7.2. Get Nearby Ready Hospitals
`GET /api/hospitals/nearby`

### 7.3. Update Bed Availability & Intake
`PUT /api/hospitals/{id}/availability`

**Request Body:**
```json
{
  "emergencyAvailable": true,
  "availableBeds": 18
}
```

---

## 8. Doctor Tele-Consultation

### 8.1. Create Consultation Note & Prescription
`POST /api/consultations`

**Request Body:**
```json
{
  "patientId": "P1001",
  "doctorId": "doc1",
  "diagnosis": "Preliminary acute coronary syndrome evaluation",
  "notes": "Administer Sorbitrate sublingual, keep oxygen flow at 4L/min.",
  "prescriptions": [
    "Aspirin 300mg stat",
    "Clopidogrel 300mg stat",
    "Atorvastatin 80mg stat"
  ]
}
```

### 8.2. Get Patient Consultations
`GET /api/consultations/{patientId}`

---

## 9. In-App Notifications

### 9.1. Get User Notifications
`GET /api/notifications/{userId}`

### 9.2. Mark Notification as Read
`PUT /api/notifications/{id}/read`

---

## 10. Admin Telemetry & Statistics

### 10.1. Network KPI Stats
`GET /api/admin/stats`

### 10.2. User Directory
`GET /api/admin/users`

---

## 11. Python AI Service Endpoints (Port 5000)

### 11.1. Multilingual Symptom Chat
`POST http://localhost:5000/symptom-chat`

**Request Body:**
```json
{
  "message": "माझ्या छातीत खूप दुखत आहे आणि श्वास घेता येत नाही",
  "language": "mr",
  "patientId": "P1001"
}
```

**Response (200 OK):**
```json
{
  "response": "आपल्या लक्षणांनुसार ही अत्यंत तातडीची वैद्यकीय आणीबाणी असू शकते. कृपया त्वरित ॲपमधील लाल 'Emergency SOS' बटण दाबा.",
  "riskLevel": "HIGH",
  "disclaimer": "AI assistance is for preliminary guidance and does not replace professional medical advice."
}
```
