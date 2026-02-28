package com.jobportal.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jwt.AuthenticationRequest;
import com.jobportal.jwt.JwtAuthenticationEntryPoint;
import com.jobportal.jwt.JwtAuthenticationFilter;
import com.jobportal.jwt.JwtHelper;
import com.jobportal.util.TestLogger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthAPI.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthAPITest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private JwtHelper jwtHelper;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Auth API - Login Success")
    void testLogin_Success() throws Exception {
        TestLogger.logTestStart("Auth API - Login Success", 
            "Email: test@example.com, Password: password", 
            "Sending POST request to /auth/login with valid credentials.", 
            "Status 200 OK and a valid JWT token in response.");

        // Arrange
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
        UserDetails userDetails = new User("test@example.com", "password", new ArrayList<>());
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtHelper.generateToken(any(UserDetails.class))).thenReturn("mocked-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value("mocked-jwt-token"));
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Auth API - Login Failure (Bad Credentials)")
    void testLogin_BadCredentials() throws Exception {
        TestLogger.logTestStart("Auth API - Login Failure (Bad Credentials)", 
            "Email: test@example.com, Password: wrong-password", 
            "Sending POST request to /auth/login with invalid credentials.", 
            "Status 401 Unauthorized should be returned.");

        // Arrange
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "wrong-password");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        TestLogger.logResult("[PASS]");
    }
}
