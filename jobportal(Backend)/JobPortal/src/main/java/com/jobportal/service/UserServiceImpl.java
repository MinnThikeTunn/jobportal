package com.jobportal.service;

import com.jobportal.dto.LoginDTO;
import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.OTP;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.OTPRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.utility.Data;
import com.jobportal.utility.Utilities;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service(value = "userService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationService notificationService;

    @Override
    public UserDTO registerUser(UserDTO userDTO) throws JobPortalException {

        Optional<User> optional = userRepository.findByEmail(userDTO.getEmail());

        if (optional.isPresent()) {
            throw new JobPortalException("USER_FOUND");
        }

        userDTO.setProfileId(profileService.createProfile(userDTO.getEmail(), userDTO.getUsername()));

        userDTO.setId(Utilities.getNextSequence("users"));

        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Convert the passed userDTO to an entity
        User user = userDTO.toEntity();

        // Save the user entity to the database
        user = userRepository.save(user);

        // Convert the saved entity back to DTO
        return user.toDTO();
    }

    @Override
    public UserDTO getUserByEmail(String email) throws JobPortalException {
        return userRepository.findByEmail(email).orElseThrow(() -> new JobPortalException(
                "USER_NOT_FOUND")).toDTO();
    }

    @Override
    public UserDTO loginUser(LoginDTO loginDTO) throws JobPortalException {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(() -> new JobPortalException(
                "USER_NOT_FOUND"));
        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())){
            throw new JobPortalException("INVALID_CREDENTIALS");
        }
        return user.toDTO();
    }

    @Override
    public Boolean sendOtp(String email) throws Exception{
        User user = userRepository.findByEmail(email).orElseThrow(() -> new JobPortalException(
                "USER_NOT_FOUND"));

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(email);

        String genOtp = Utilities.generateOTP();
        OTP otp = new OTP(email, genOtp, LocalDateTime.now());

        otpRepository.save(otp);

        mimeMessageHelper.setSubject("Your OTP Code");
        mimeMessageHelper.setText(Data.getMessageBody(genOtp, user.getUsername()), true);
        mailSender.send(mimeMessage);
        return true;
    }

    @Override
    public Boolean verifyOtp(String email, String otp) throws JobPortalException{
        OTP otpEntity = otpRepository.findById(email).orElseThrow(() -> new JobPortalException("OTP_NOT_FOUND"));
        if(!otpEntity.getOtpCode().equals(otp)){
            throw new JobPortalException("INVALID_OTP");
        }
        return true;
    }

    @Override
    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalException {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElseThrow(() -> new JobPortalException(
                "USER_NOT_FOUND"));

        user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
        userRepository.save(user);

        NotificationDTO noti = new NotificationDTO();
        noti.setUserId(user.getId());
        noti.setMessage("Password Reset Successfully");
        noti.setAction("Password Reset");
        notificationService.sendNotification(noti);
        return new ResponseDTO("Password changed successfully");
    }

    @Scheduled(fixedRate = 60000)
    public void removeExpiredOtp(){
        LocalDateTime expiry = LocalDateTime.now().minusMinutes(5);
        List<OTP> expiredOTP = otpRepository.findByCreationTimeBefore(expiry);
        if(!expiredOTP.isEmpty()){
            otpRepository.deleteAll(expiredOTP);
            System.out.println("Removed "+expiredOTP.size()+" expired Otps.");
        }
    }

}
