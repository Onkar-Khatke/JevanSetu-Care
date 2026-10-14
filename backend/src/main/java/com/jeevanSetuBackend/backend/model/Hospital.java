package com.jeevanSetuBackend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hospitals")
public class Hospital {

    @Id
    private String id;
    private String name;
    private String address;
    private String district;
    private String phone;
    private Double latitude;
    private Double longitude;
    private boolean emergencyAvailable = true;
    private int availableBeds = 10;
    private int totalBeds = 40;
    private String userId;

    public Hospital() {}

    public Hospital(String name, String address, String district, String phone, Double latitude, Double longitude, int availableBeds, int totalBeds, String userId) {
        this.name = name;
        this.address = address;
        this.district = district;
        this.phone = phone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.availableBeds = availableBeds;
        this.totalBeds = totalBeds;
        this.emergencyAvailable = true;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public boolean isEmergencyAvailable() { return emergencyAvailable; }
    public void setEmergencyAvailable(boolean emergencyAvailable) { this.emergencyAvailable = emergencyAvailable; }

    public int getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(int availableBeds) { this.availableBeds = availableBeds; }

    public int getTotalBeds() { return totalBeds; }
    public void setTotalBeds(int totalBeds) { this.totalBeds = totalBeds; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
