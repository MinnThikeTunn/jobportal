package com.jobportal.entity;

import com.jobportal.dto.AccountType;
import com.jobportal.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private Long id;
    private String username;
    @Indexed(unique = true)
    private String email;
    private String password;
    private AccountType accountType;
    private Long profileId;



    // Convert User entity to UserDTO
    public UserDTO toDTO() {
        return new UserDTO(this.id, this.username, this.email, this.password, this.accountType, this.profileId);
    }

    // Optionally, override toString() for better readability
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", accountType=" + accountType +
                ", profileId=" + profileId +
                '}';
    }
}
