package com.jobportal.dto;

import lombok.Data;

@Data
public class LoginDTO {

    private String email;
    private String password;

    // Default constructor
    public LoginDTO() {}

    // Parameterized constructor
    public LoginDTO(String email, String password) {

        this.email = email;
        this.password = password;

    }

    // Optionally, override toString() for better readability
    @Override
    public String toString() {
        return "UserDTO{" +

                ", email='" + email + '\'' +
                ", password='" + password + '\'' +

                '}';
    }
}
