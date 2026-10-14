package com.jeevanSetuBackend.backend.dto;

import com.jeevanSetuBackend.backend.model.AmbulanceStatus;

public class AmbulanceLocationRequest {

    private Double latitude;
    private Double longitude;
    private AmbulanceStatus status;

    public AmbulanceLocationRequest() {}

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public AmbulanceStatus getStatus() { return status; }
    public void setStatus(AmbulanceStatus status) { this.status = status; }
}
