package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.JobRepository;
import com.jobportal.util.TestLogger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private JobServiceImpl jobService;

    private Job testJob;
    private List<JobDTO> testJobs;

    @BeforeEach
    void setUp() {
        testJob = new Job();
        testJob.setJobId(1L);
        testJob.setJobTitle("Java Developer");
        testJob.setPackageOffered(1200000L);
        testJob.setLocation("Bangalore");
        testJob.setApplicants(new ArrayList<>());
        testJob.setSkillsRequired(Arrays.asList("Java", "Spring"));

        testJobs = new ArrayList<>();
        testJobs.add(new JobDTO(1L, "Java Dev", "Google", null, "", "Entry Level", "Full Time", "Bangalore", 1000000L, null, "", Arrays.asList("Java"), JobStatus.ACTIVE, 1L));
        testJobs.add(new JobDTO(2L, "React Dev", "Meta", null, "", "Expert", "Full Time", "Remote", 2000000L, null, "", Arrays.asList("React"), JobStatus.ACTIVE, 1L));
    }

    @Test
    @DisplayName("Apply Job - Success Path")
    void testApplyJob_Success() throws JobPortalException {
        TestLogger.logTestStart("Apply Job - Success Path", 
            "Job ID: 1, Applicant ID: 101", 
            "Attempting to apply for an existing job with a new applicant.", 
            "Application should be successful and applicant list size should increment.");
        // Arrange
        ApplicantDTO applicant = new ApplicantDTO();
        applicant.setApplicantId(101L);
        TestLogger.logSetup("Mocking job repository to return test job.");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(testJob));

        // Act
        TestLogger.logExecution("Calling jobService.applyJob()...");
        jobService.applyJob(1L, applicant);

        // Assert
        TestLogger.logVerification("Verifying applicant list size increased to 1.");
        assertEquals(1, testJob.getApplicants().size());
        
        TestLogger.logVerification("Verifying application status is APPLIED.");
        assertEquals(ApplicationStatus.APPLIED, applicant.getApplicationStatus());
        
        TestLogger.logVerification("Verifying job repository save was called.");
        verify(jobRepository, times(1)).save(testJob);
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Apply Job - Fail on Duplicate Application")
    void testApplyJob_DuplicateApplication() {
        TestLogger.logTestStart("Apply Job - Fail on Duplicate Application", 
            "Job ID: 1, Applicant ID: 101", 
            "Job already has Applicant ID 101 in its list.",
            "Attempting to apply again with the same Applicant ID.", 
            "Should throw JobPortalException with message 'JOB_APPLIED_ALREADY'.");
        // Arrange
        ApplicantDTO applicant = new ApplicantDTO();
        applicant.setApplicantId(101L);
        // Add existing applicant entity to the job
        testJob.getApplicants().add(new Applicant(101L, "Test", "t@t.com", 1L, "", null, "", null, ApplicationStatus.APPLIED, null));
        
        TestLogger.logSetup("Mocking job repository to return job WITH existing applicant.");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(testJob));

        // Act & Assert
        TestLogger.logExecution("Calling jobService.applyJob() and expecting exception...");
        JobPortalException exception = assertThrows(JobPortalException.class, () -> jobService.applyJob(1L, applicant));
        
        TestLogger.logVerification("Verifying exception message is 'JOB_APPLIED_ALREADY'.");
        assertEquals("JOB_APPLIED_ALREADY", exception.getMessage());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("QuickSort - Sort by Salary High to Low")
    void testQuickSort_SalaryHighToLow() {
        TestLogger.logTestStart("QuickSort - Sort by Salary High to Low", 
            "Job 1 Salary: 1,000,000, Job 2 Salary: 2,000,000", 
            "Sorting jobs using 'Salary: High to Low' criteria.", 
            "First job in sorted list should have salary 2,000,000.");
        // Act
        TestLogger.logExecution("Calling jobService.quickSort()...");
        List<JobDTO> sorted = jobService.quickSort(testJobs, "Salary: High to Low");

        // Assert
        TestLogger.logVerification("Verifying first job salary is 2,000,000.");
        assertEquals(2000000L, sorted.get(0).getPackageOffered());
        
        TestLogger.logVerification("Verifying second job salary is 1,000,000.");
        assertEquals(1000000L, sorted.get(1).getPackageOffered());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Get Recommended Jobs - Ranking based on Skills")
    void testGetRecommendedJobs_SkillRanking() throws JobPortalException {
        TestLogger.logTestStart("Get Recommended Jobs - Ranking based on Skills", 
            "User Skills: [Java, Spring, Docker], Job Required Skills: [Java, Spring]", 
            "Requesting recommendations for 'Java Developer'.", 
            "Job matching user skills should be returned and ranked correctly.");
        // Arrange
        TestLogger.logSetup("Mocking job repository to return all jobs.");
        when(jobRepository.findAll()).thenReturn(Arrays.asList(testJob));
        List<String> userSkills = Arrays.asList("Java", "Spring", "Docker");

        // Act
        TestLogger.logExecution("Calling jobService.getRecommendedJobs()...");
        List<JobDTO> recommended = jobService.getRecommendedJobs("Java Developer", userSkills);

        // Assert
        TestLogger.logVerification("Verifying recommended list is not empty.");
        assertFalse(recommended.isEmpty());
        
        TestLogger.logVerification("Verifying job title matches.");
        assertEquals("Java Developer", recommended.get(0).getJobTitle());
        // Verify skill match ranking logic (Java and Spring match)
        
        TestLogger.logVerification("Verifying skills match.");
        assertTrue(recommended.get(0).getSkillsRequired().stream().anyMatch(userSkills::contains));
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Filter Jobs - Location Filtering")
    void testGetFilteredJobs_Location() throws JobPortalException {
        TestLogger.logTestStart("Filter Jobs - Location Filtering", 
            "Filter: {Location: [Bangalore]}, Available Jobs: [Bangalore, Remote]", 
            "Applying location filter to the job list.", 
            "Only the job in 'Bangalore' should be returned.");
        // Arrange
        Map<String, Object> filters = new HashMap<>();
        filters.put("Location", Arrays.asList("Bangalore"));

        // Act
        TestLogger.logExecution("Calling jobService.getFilteredJobs() with location filter...");
        List<JobDTO> filtered = jobService.getFilteredJobs(filters, testJobs);

        // Assert
        TestLogger.logVerification("Verifying filtered list size is 1.");
        assertEquals(1, filtered.size());
        
        TestLogger.logVerification("Verifying location is Bangalore.");
        assertEquals("Bangalore", filtered.get(0).getLocation());
        
        TestLogger.logResult("[PASS]");
    }
}
