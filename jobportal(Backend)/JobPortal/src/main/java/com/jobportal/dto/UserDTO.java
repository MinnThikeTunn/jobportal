package com.jobportal.dto;

import com.jobportal.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    @NotBlank(message = "{user.username.absent}")
    private String username;
    @NotBlank(message = "{user.email.absent}")
    @Email(message = "{user.email.invalid}")
    private String email;
    @NotBlank(message = "{user.password.absent}")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}", message =
            "{user.password.invalid}")
    private String password;
    private AccountType accountType;
    private Long profileId;




    // Optionally, override toString() for better readability
    @Override
    public String toString() {
        return "UserDTO{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", accountType=" + accountType +
                ", profileId=" + profileId +
                '}';
    }

    // Convert UserDTO to User entity
    public User toEntity() {
        return new User(this.id, this.username, this.email, this.password, this.accountType, this.profileId);
    }
}
