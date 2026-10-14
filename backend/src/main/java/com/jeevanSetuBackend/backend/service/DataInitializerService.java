package com.jeevanSetuBackend.backend.service;

import com.jeevanSetuBackend.backend.model.*;
import com.jeevanSetuBackend.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializerService.class);

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorRepository doctorRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final HospitalRepository hospitalRepository;
    private final HealthReadingRepository healthReadingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerService(UserRepository userRepository,
                                  PatientProfileRepository patientProfileRepository,
                                  DoctorRepository doctorRepository,
                                  AmbulanceRepository ambulanceRepository,
                                  HospitalRepository hospitalRepository,
                                  HealthReadingRepository healthReadingRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorRepository = doctorRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.hospitalRepository = hospitalRepository;
        this.healthReadingRepository = healthReadingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains users. Skipping initial demo seed.");
            return;
        }

        log.info("Initializing JeevanSetu AI demo database with standard rural healthcare personas...");

        // 1. Hospital Seed
        Hospital hospital = new Hospital(
                "Shirur Rural Sub-District Hospital",
                "Main Road, Shirur, Pune District, Maharashtra 412210",
                "Pune",
                "02138-222100",
                18.8288,
                74.3797,
                14,
                50,
                null
        );
        hospital.setId("HOSP-01");
        hospitalRepository.save(hospital);

        // 2. Patient Persona: Ramesh Patil
        User patientUser = new User(
                "patient1@jeevansetu.org",
                passwordEncoder.encode("Patient@123"),
                "Ramesh Patil",
                "9876543210",
                Role.ROLE_PATIENT,
                "P1001"
        );
        User savedPatientUser = userRepository.save(patientUser);

        PatientProfile patientProfile = new PatientProfile();
        patientProfile.setId("P1001");
        patientProfile.setUserId(savedPatientUser.getId());
        patientProfile.setName("Ramesh Patil");
        patientProfile.setAge(62);
        patientProfile.setGender("Male");
        patientProfile.setPhone("9876543210");
        patientProfile.setEmail("patient1@jeevansetu.org");
        patientProfile.setVillage("Koregaon Bhima");
        patientProfile.setDistrict("Pune");
        patientProfile.setAddress("House No. 42, Near Gram Panchayat Office");
        patientProfile.setEmergencyContact("9876543219");
        patientProfile.setBloodGroup("B+");
        patientProfile.setMedicalHistory(List.of("Hypertension", "Type 2 Diabetes"));
        patientProfile.setAllergies(List.of("Penicillin"));
        patientProfile.setCurrentMedications(List.of("Amlodipine 5mg", "Metformin 500mg"));
        patientProfileRepository.save(patientProfile);

        // Initial sample vital reading for patient P1001 (High Risk baseline)
        HealthReading initialReading = new HealthReading();
        initialReading.setPatientId("P1001");
        initialReading.setHeartRate(118);
        initialReading.setSpo2(89.0);
        initialReading.setTemperature(101.4);
        initialReading.setSystolic(158);
        initialReading.setDiastolic(98);
        initialReading.setRespiratoryRate(24);
        initialReading.setEcgSummary("Sinus Tachycardia");
        initialReading.setDeviceId("ESP32-STATION-01");
        initialReading.setSource("SIMULATOR");
        initialReading.setSimulated(true);
        initialReading.setTimestamp(LocalDateTime.now().minusHours(1));
        healthReadingRepository.save(initialReading);

        // 3. Doctor Persona: Dr. Aarav Sharma
        User doctorUser = new User(
                "doctor1@jeevansetu.org",
                passwordEncoder.encode("Doctor@123"),
                "Dr. Aarav Sharma",
                "9822011223",
                Role.ROLE_DOCTOR,
                "DOC-01"
        );
        User savedDoctorUser = userRepository.save(doctorUser);

        Doctor doctor = new Doctor(
                "Dr. Aarav Sharma",
                "Cardiology & Emergency Medicine",
                "9822011223",
                "doctor1@jeevansetu.org",
                "HOSP-01",
                savedDoctorUser.getId()
        );
        doctor.setId("DOC-01");
        doctorRepository.save(doctor);

        // 4. Healthcare Worker: Sunita Tai (ASHA Worker)
        User workerUser = new User(
                "worker1@jeevansetu.org",
                passwordEncoder.encode("Worker@123"),
                "Sunita Tai (ASHA Worker)",
                "9822011224",
                Role.ROLE_HEALTHCARE_WORKER,
                "HW-01"
        );
        userRepository.save(workerUser);

        // 5. Ambulance Driver: Suresh Yadav
        User ambulanceUser = new User(
                "ambulance1@jeevansetu.org",
                passwordEncoder.encode("Driver@123"),
                "Suresh Yadav",
                "9823055441",
                Role.ROLE_AMBULANCE,
                "AMB-01"
        );
        User savedAmbulanceUser = userRepository.save(ambulanceUser);

        Ambulance ambulance = new Ambulance(
                "Suresh Yadav",
                "9823055441",
                "MH-12-RN-4401",
                18.8200,
                74.3700,
                "Pune",
                "Shirur Rural Hub"
        );
        ambulance.setId("AMB-01");
        ambulance.setUserId(savedAmbulanceUser.getId());
        ambulanceRepository.save(ambulance);

        // 6. Administrator Persona
        User adminUser = new User(
                "admin@jeevansetu.org",
                passwordEncoder.encode("Admin@123"),
                "System Administrator",
                "9999999999",
                Role.ROLE_ADMIN,
                "ADMIN-01"
        );
        userRepository.save(adminUser);

        log.info("JeevanSetu AI demo seed completed successfully with 5 personas, 1 hospital, and 1 ambulance.");
    }
}
