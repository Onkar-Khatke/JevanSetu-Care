package com.jeevanSetuBackend.backend.dto;

import com.jeevanSetuBackend.backend.model.Role;

public class UserDto {

    private String id;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private String entityId;
    private boolean active;

    public UserDto() {}

    public UserDto(String id, String email, String fullName, String phone, Role role, String entityId, boolean active) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.entityId = entityId;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
