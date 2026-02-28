package com.jobportal;

import com.jobportal.dto.AccountType;
import com.jobportal.dto.JobStatus;
import com.jobportal.entity.*;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ProfileService;
import com.jobportal.utility.Utilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        logger.info("\n" + "=".repeat(80));
        logger.info(" DATABASE INITIALIZATION ");
        logger.info("=".repeat(80));
        
        logger.info("[Step 1/2] Clearing existing database collections...");
        clearDatabase();
        
        logger.info("[Step 2/2] Seeding database with fresh test data...");
        seedUsersAndJobs();
        
        logger.info("=".repeat(80));
        logger.info(" DATABASE READY: Fresh test environment configured. ");
        logger.info("=".repeat(80) + "\n");
    }

    private void clearDatabase() {
        mongoTemplate.dropCollection("users");
        mongoTemplate.dropCollection("jobs");
        mongoTemplate.dropCollection("profiles");
        mongoTemplate.dropCollection("notification");
        mongoTemplate.dropCollection("otp");
        mongoTemplate.dropCollection("sequence");
    }

    private void seedUsersAndJobs() throws Exception {
        // Create a test employer
        String employerEmail = "employer@example.com";
        String employerName = "Main Employer";
        Long profileId = profileService.createProfile(employerEmail, employerName);
        
        User employer = new User();
        employer.setId(Utilities.getNextSequence("users"));
        employer.setUsername(employerName);
        employer.setEmail(employerEmail);
        employer.setPassword(passwordEncoder.encode("Password@123"));
        employer.setAccountType(AccountType.EMPLOYER);
        employer.setProfileId(profileId);
        userRepository.save(employer);

        // Create a test applicant
        String applicantEmail = "applicant@example.com";
        String applicantName = "Test Applicant";
        Long applicantProfileId = profileService.createProfile(applicantEmail, applicantName);
        
        User applicant = new User();
        applicant.setId(Utilities.getNextSequence("users"));
        applicant.setUsername(applicantName);
        applicant.setEmail(applicantEmail);
        applicant.setPassword(passwordEncoder.encode("Password@123"));
        applicant.setAccountType(AccountType.APPLICANT);
        applicant.setProfileId(applicantProfileId);
        userRepository.save(applicant);

        // Seed some jobs
        List<Job> jobs = new ArrayList<>();
        
        jobs.add(createJob("Product Designer", "Meta", "New York", "Entry Level", "Full Time", 3200000L, employer.getId(), 
            "Meta is seeking a Product Designer to join our team. You'll be working on designing user-centric interfaces for our blockchain wallet platform.",
            Arrays.asList("Figma", "UI/UX", "User Research")));
            
        jobs.add(createJob("Sr. UX Designer", "Netflix", "San Francisco", "Expert", "Part Time", 4000000L, employer.getId(), 
            "Netflix is looking for a Sr. UX Designer to enhance our user experience on streaming platforms.",
            Arrays.asList("UX Design", "Interaction Design", "Prototyping")));
            
        jobs.add(createJob("Backend Developer", "Google", "Bangalore", "Entry Level", "Full Time", 3800000L, employer.getId(), 
            "Google is hiring a Backend Developer to join our team in Bangalore. You'll be responsible for developing scalable backend systems.",
            Arrays.asList("Java", "Spring Boot", "MongoDB")));
            
        jobs.add(createJob("Frontend Developer", "Amazon", "Seattle", "Intermediate", "Full Time", 3600000L, employer.getId(), 
            "Amazon is looking for a Frontend Developer to build and maintain our customer-facing applications.",
            Arrays.asList("React", "TypeScript", "Tailwind CSS")));

        jobRepository.saveAll(jobs);
    }

    private Job createJob(String title, String company, String location, String exp, String type, Long pkg, Long postedBy, String desc, List<String> skills) throws Exception {
        Job job = new Job();
        job.setJobId(Utilities.getNextSequence("jobs"));
        job.setJobTitle(title);
        job.setCompany(company);
        job.setLocation(location);
        job.setExperience(exp);
        job.setJobType(type);
        job.setPackageOffered(pkg);
        job.setPostedBy(postedBy);
        job.setDescription(desc);
        job.setSkillsRequired(skills);
        job.setPostTime(LocalDateTime.now());
        job.setJobStatus(JobStatus.ACTIVE);
        job.setAbout("About " + company);
        return job;
    }
}
