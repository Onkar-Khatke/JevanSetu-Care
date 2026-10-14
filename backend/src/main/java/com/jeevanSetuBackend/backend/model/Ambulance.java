package com.jeevanSetuBackend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ambulances")
public class Ambulance {

    @Id
    private String id;
    private String driverName;
    private String phone;
    private String vehicleNumber;
    private Double latitude;
    private Double longitude;
    private AmbulanceStatus status = AmbulanceStatus.AVAILABLE;
    private String currentEmergencyId;
    private String userId;
    private String district;
    private String villageBase;
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Ambulance() {}

    public Ambulance(String driverName, String phone, String vehicleNumber, Double latitude, Double longitude, String district, String villageBase) {
        this.driverName = driverName;
        this.phone = phone;
        this.vehicleNumber = vehicleNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = AmbulanceStatus.AVAILABLE;
        this.district = district;
        this.villageBase = villageBase;
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public AmbulanceStatus getStatus() { return status; }
    public void setStatus(AmbulanceStatus status) { this.status = status; }

    public String getCurrentEmergencyId() { return currentEmergencyId; }
    public void setCurrentEmergencyId(String currentEmergencyId) { this.currentEmergencyId = currentEmergencyId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVillageBase() { return villageBase; }
    public void setVillageBase(String villageBase) { this.villageBase = villageBase; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
