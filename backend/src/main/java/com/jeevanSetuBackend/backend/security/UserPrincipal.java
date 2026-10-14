package com.jeevanSetuBackend.backend.security;

import com.jeevanSetuBackend.backend.model.Role;
import com.jeevanSetuBackend.backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final String id;
    private final String email;
    private final String password;
    private final String fullName;
    private final Role role;
    private final String entityId;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.fullName = user.getFullName();
        this.role = user.getRole();
        this.entityId = user.getEntityId();
        this.active = user.isActive();
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public String getEntityId() { return entityId; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return active; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }
}
