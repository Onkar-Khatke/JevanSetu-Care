# JeevanSetu AI – End-to-End Demo & Evaluation Walkthrough

Follow this step-by-step scenario to demonstrate the complete, interconnected capabilities of **JeevanSetu AI**: from IoT biometric telemetry and AI preliminary triage to real-time ambulance dispatch, doctor tele-consultation, and hospital bed reception.

---

## Scenario Overview
- **Rural Patient**: Ramesh Patil (Age 62, Village Koregaon Bhima, Shirur, Pune).
- **Assigned Doctor**: Dr. Aarav Sharma (Emergency Medicine, Sub-District Sector).
- **Rapid Ambulance**: Unit `MH-12-RN-4401` driven by Suresh Yadav.
- **Receiving Facility**: Rural Sub-District Hospital Shirur (Trauma Unit).

---

## Step 1: Telemetry Ingestion from IoT Simulator

1. Open your terminal and navigate to `iot/simulator`:
   ```bash
   cd iot/simulator
   ```

2. Trigger critical vital telemetry for patient `P1001`:
   ```bash
   python iot_simulator.py --preset HIGH --patient P1001
   ```
   *Terminal Output:*
   ```
   [IoT ESP32 Station] Ingesting vitals payload:
   Heart Rate: 122 BPM | SpO2: 87% | Blood Pressure: 162/102 mmHg | Temp: 101.4°F
   HTTP 200 OK: Vitals stored. Preliminary AI Triage: HIGH (Score: 89)
   ```

---

## Step 2: Patient Portal Experience

1. Open your browser at `http://localhost:5173/login`.
2. Click the **"Patient Demo"** 1-click button or enter:
   - Email: `patient1@jeevansetu.org`
   - Password: `Patient@123`
3. You are redirected to `/patient/dashboard`:
   - **Vitals Tiles**: Observe Heart Rate (122 BPM - Red), SpO2 (87% - Red Hypoxia warning), Blood Pressure (162/102 mmHg).
   - **AI Preliminary Risk Banner**: Displays **HIGH RISK (Score: 89%)** with indicators:
     - *SpO2 < 90% (Acute Hypoxia)*
     - *Elevated Heart Rate (Tachycardia)*
     - *Stage 2 Hypertensive Crisis*
4. Navigate to `/patient/ai-assistant`:
   - Switch language selector to **मराठी (Marathi)** or **हिंदी (Hindi)**.
   - Enter message: `"माझ्या छातीत खूप दुखत आहे आणि श्वास घेता येत नाही"`
   - Observe immediate conversational guidance urging the patient to press the Emergency SOS button, accompanied by the standard preliminary disclaimer.

---

## Step 3: Triggering Emergency SOS

1. On the patient portal, click **"Emergency SOS"** in the top navigation or on the dashboard.
2. Click the large red **"TRIGGER EMERGENCY SOS"** button.
3. A confirmation modal will appear: click **"Confirm SOS Alert"**.
4. The screen transitions into the **Live Emergency Dispatch Tracker**:
   - Stage indicators advance:
     - `✓ Emergency Created`
     - `✓ Doctor Alerted (Dr. Aarav Sharma)`
     - `✓ Ambulance Assigned (Unit MH-12-RN-4401)`
     - `✓ Hospital Notified (Shirur Sub-District Hospital)`
   - Cards display GPS pickup coordinates, driver contact (`9823055441`), and target hospital telephone.

---

## Step 4: Doctor Tele-Consultation & Review

1. In a separate browser tab or incognito window, open `http://localhost:5173/login`.
2. Click the **"Doctor Demo"** button:
   - Email: `doctor1@jeevansetu.org`
   - Password: `Doctor@123`
3. Notice the red notification bell ringing in the header: *"URGENT: Rural Emergency SOS Alert for patient Ramesh Patil"*.
4. Navigate to `/doctor/patients/P1001`:
   - **Recharts Biometric Trends**: View historical graphs of Heart Rate, SpO2, and Blood Pressure.
   - **Clinical Triage Note**: Scroll to the consultation box, input diagnosis (`Acute Angina / Suspicious ACS`), add prescriptions (`Tab Sorbitrate 5mg sublingual stat`, `Tab Aspirin 300mg stat`), and click **"Save Consultation"**.
   - Prescriptions instantly sync to the patient's record.

---

## Step 5: Ambulance Driver Dispatch Navigation

1. In a separate tab, log in as Ambulance Driver:
   - Email: `ambulance1@jeevansetu.org`
   - Password: `Driver@123`
2. The dashboard flashes an active dispatch banner: *"Active Emergency Assigned for Ramesh Patil"*.
3. Click **"Manage Journey"** to open `/ambulance/active`:
   - View pickup waypoint: `18.5204° N, 73.8567° E (Koregaon Bhima)`.
   - View target hospital: `Shirur Sub-District Hospital`.
   - Click **"Start Journey (Ambulance On Route)"**:
     - Status updates to `AMBULANCE_ON_ROUTE`.
     - Patient's screen updates in real time to show ambulance en route.
4. Once arrived at destination, click **"Arrived at Destination (Hospital / Patient)"**:
   - Status updates to `PATIENT_ARRIVED`.

---

## Step 6: Hospital Emergency Reception & Bed Admission

1. In a separate tab, log in as Hospital Admin:
   - Email: `hospital1@jeevansetu.org`
   - Password: `Hospital@123`
2. On `/hospital/dashboard`:
   - Observe live bed counter (e.g., 14 available beds).
   - In the emergency queue, locate Case `Ramesh Patil` with status `PATIENT_ARRIVED`.
3. Click **"Discharge / Complete"** or open `/hospital/emergencies`:
   - Confirm emergency intake and admit patient to trauma bay.
   - Status updates to `COMPLETED`.

---

## Step 7: Mission Closure & Network Realignment

1. Switch back to the **Ambulance Driver Portal**:
   - Status automatically reverts to `AVAILABLE`.
   - Fleet unit is ready for the next rural dispatch.
2. Switch back to the **Patient Portal**:
   - Live tracker shows `✓ Emergency Completed`.
3. Log in as **System Admin** (`admin@jeevansetu.org` / `Admin@123`):
   - Network Operations Center displays all microservices healthy (Spring Boot, Python AI, MongoDB, IoT telemetry).
   - Active emergency count updates, and high-risk case analytics reflect complete resolution.
