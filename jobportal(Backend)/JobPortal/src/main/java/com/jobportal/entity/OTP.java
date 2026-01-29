package com.jobportal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "otp")
@Data
public class OTP {
    @Id
    private String email;
    private String otpCode;
    private LocalDateTime creationTime;

    public OTP(String email, String otpCode, LocalDateTime creationTime) {
        this.email = email;
        this.otpCode = otpCode;
        this.creationTime = creationTime;
    }

    public OTP() {};
}
