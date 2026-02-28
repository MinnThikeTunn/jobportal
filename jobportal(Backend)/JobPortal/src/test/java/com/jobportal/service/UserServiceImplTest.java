package com.jobportal.service;

import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.OTP;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.OTPRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.util.TestLogger;
import com.jobportal.utility.Utilities;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OTPRepository otpRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ProfileService profileService;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setUsername("testuser");

        testUserDTO = new UserDTO();
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setPassword("plainPassword");
        testUserDTO.setUsername("testuser");
    }

    @Test
    @DisplayName("User Registration - Success Path")
    void testRegisterUser_Success() throws JobPortalException {
        TestLogger.logTestStart("User Registration - Success Path", 
            "Email: test@example.com, Username: testuser", 
            "Registering a new user with valid data.", 
            "User should be saved and profile should be created successfully.");
        
        // Arrange
        try (MockedStatic<Utilities> utilities = mockStatic(Utilities.class)) {
            TestLogger.logSetup("Mocking Utilities.getNextSequence to return ID: 1");
            utilities.when(() -> Utilities.getNextSequence("users")).thenReturn(1L);
            
            TestLogger.logSetup("Mocking repository check: Email 'test@example.com' does not exist.");
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
            
            TestLogger.logSetup("Mocking password encoder to return 'hashedPassword'.");
            when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
            
            TestLogger.logSetup("Mocking user save operation.");
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            TestLogger.logSetup("Mocking profile creation.");
            when(profileService.createProfile(anyString(), anyString())).thenReturn(1L);

            // Act
            TestLogger.logExecution("Calling userService.registerUser(testUserDTO)...");
            UserDTO result = userService.registerUser(testUserDTO);

            // Assert
            TestLogger.logVerification("Checking if result is not null.");
            assertNotNull(result);
            
            TestLogger.logVerification("Verifying returned email matches input.");
            assertEquals("test@example.com", result.getEmail());
            
            TestLogger.logVerification("Verifying userRepository.save() was called exactly once.");
            verify(userRepository, times(1)).save(any(User.class));
            
            TestLogger.logVerification("Verifying profileService.createProfile() was called.");
            verify(profileService, times(1)).createProfile(anyString(), anyString());
            
            TestLogger.logResult("[PASS]");
        }
    }

    @Test
    @DisplayName("User Registration - Fail on Existing Email")
    void testRegisterUser_UserFound() {
        TestLogger.logTestStart("User Registration - Fail on Existing Email", 
            "Email: test@example.com (Already exists in repository)", 
            "Attempting to register a user with an existing email.", 
            "Should throw JobPortalException with message 'USER_FOUND'.");
        
        // Arrange
        TestLogger.logSetup("Mocking repository check: Email 'test@example.com' ALREADY EXISTS.");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act & Assert
        TestLogger.logExecution("Calling userService.registerUser() and expecting exception...");
        JobPortalException exception = assertThrows(JobPortalException.class, () -> userService.registerUser(testUserDTO));
        
        TestLogger.logVerification("Verifying exception message is 'USER_FOUND'.");
        assertEquals("USER_FOUND", exception.getMessage());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("User Login - Success Path")
    void testLoginUser_Success() throws JobPortalException {
        TestLogger.logTestStart("User Login - Success Path", 
            "Email: test@example.com, Password: plainPassword", 
            "Logging in with correct credentials.", 
            "Login should be successful and return UserDTO.");
        
        // Arrange
        LoginDTO loginDTO = new LoginDTO("test@example.com", "plainPassword");
        
        TestLogger.logSetup("Mocking repository to return valid user for 'test@example.com'.");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        
        TestLogger.logSetup("Mocking password check: 'plainPassword' matches 'hashedPassword'.");
        when(passwordEncoder.matches("plainPassword", "hashedPassword")).thenReturn(true);

        // Act
        TestLogger.logExecution("Calling userService.loginUser(loginDTO)...");
        UserDTO result = userService.loginUser(loginDTO);

        // Assert
        TestLogger.logVerification("Verifying result is not null.");
        assertNotNull(result);
        
        TestLogger.logVerification("Verifying returned email is 'test@example.com'.");
        assertEquals("test@example.com", result.getEmail());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("User Login - Fail on Invalid Password")
    void testLoginUser_InvalidCredentials() {
        TestLogger.logTestStart("User Login - Fail on Invalid Password", 
            "Email: test@example.com, Password: wrongPassword", 
            "Logging in with an incorrect password.", 
            "Should throw JobPortalException with message 'INVALID_CREDENTIALS'.");
        
        // Arrange
        LoginDTO loginDTO = new LoginDTO("test@example.com", "wrongPassword");
        
        TestLogger.logSetup("Mocking repository to return user.");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        
        TestLogger.logSetup("Mocking password check: 'wrongPassword' DOES NOT MATCH.");
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        TestLogger.logExecution("Calling userService.loginUser() and expecting exception...");
        JobPortalException exception = assertThrows(JobPortalException.class, () -> userService.loginUser(loginDTO));
        
        TestLogger.logVerification("Verifying exception message is 'INVALID_CREDENTIALS'.");
        assertEquals("INVALID_CREDENTIALS", exception.getMessage());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("OTP Verification - Success Path")
    void testVerifyOtp_Success() throws JobPortalException {
        TestLogger.logTestStart("OTP Verification - Success Path", 
            "Email: test@example.com, OTP: 123456", 
            "Verifying a matching OTP.", 
            "Verification should return true.");
        
        // Arrange
        OTP otpEntity = new OTP("test@example.com", "123456", LocalDateTime.now());
        
        TestLogger.logSetup("Mocking OTP repository to return code '123456'.");
        when(otpRepository.findById("test@example.com")).thenReturn(Optional.of(otpEntity));

        // Act
        TestLogger.logExecution("Calling userService.verifyOtp('test@example.com', '123456')...");
        Boolean result = userService.verifyOtp("test@example.com", "123456");

        // Assert
        TestLogger.logVerification("Verifying result is true.");
        assertTrue(result);
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("OTP Verification - Fail on Incorrect Code")
    void testVerifyOtp_InvalidOtp() {
        TestLogger.logTestStart("OTP Verification - Fail on Incorrect Code", 
            "Email: test@example.com, Input OTP: 654321, Correct OTP: 123456", 
            "Verifying a non-matching OTP.", 
            "Should throw JobPortalException with message 'INVALID_OTP'.");
        
        // Arrange
        OTP otpEntity = new OTP("test@example.com", "123456", LocalDateTime.now());
        
        TestLogger.logSetup("Mocking OTP repository to return code '123456'.");
        when(otpRepository.findById("test@example.com")).thenReturn(Optional.of(otpEntity));

        // Act & Assert
        TestLogger.logExecution("Calling userService.verifyOtp() with INCORRECT code '654321'...");
        JobPortalException exception = assertThrows(JobPortalException.class, () -> userService.verifyOtp("test@example.com", "654321"));
        
        TestLogger.logVerification("Verifying exception message is 'INVALID_OTP'.");
        assertEquals("INVALID_OTP", exception.getMessage());
        
        TestLogger.logResult("[PASS]");
    }
}
