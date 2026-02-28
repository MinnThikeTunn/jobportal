package com.jobportal.service;

import com.jobportal.dto.ProfileDTO;
import com.jobportal.entity.Profile;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.ProfileRepository;
import com.jobportal.util.TestLogger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceImplTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileServiceImpl profileService;

    private Profile testProfile1;
    private Profile testProfile2;

    @BeforeEach
    void setUp() {
        testProfile1 = new Profile();
        testProfile1.setId(1L);
        testProfile1.setName("Alice");
        testProfile1.setEmail("alice@example.com");
        testProfile1.setJobTitle("Java Developer");
        testProfile1.setLocation("Bangalore");
        testProfile1.setSkills(Arrays.asList("Java", "Spring"));
        testProfile1.setTotalExp(5L);

        testProfile2 = new Profile();
        testProfile2.setId(2L);
        testProfile2.setName("Bob");
        testProfile2.setEmail("bob@example.com");
        testProfile2.setJobTitle("React Developer");
        testProfile2.setLocation("Remote");
        testProfile2.setSkills(Arrays.asList("React", "JavaScript"));
        testProfile2.setTotalExp(10L);
    }

    @Test
    @DisplayName("Filter Profiles - Name Filtering")
    void testGetFilteredProfiles_Name() throws JobPortalException {
        TestLogger.logTestStart("Filter Profiles - Name Filtering", 
            "Target Name: 'Alice', Available Profiles: ['Alice', 'Bob']", 
            "Applying name filter to the profile list.", 
            "Only 'Alice' should be returned in the filtered list.");
        
        // Arrange
        TestLogger.logSetup("Mocking profile repository to return test profiles.");
        when(profileRepository.findAll()).thenReturn(Arrays.asList(testProfile1, testProfile2));
        Map<String, Object> filters = new HashMap<>();
        filters.put("name", "Alice");

        // Act
        TestLogger.logExecution("Calling profileService.getFilteredProfiles() with name filter...");
        List<ProfileDTO> result = profileService.getFilteredProfiles(filters);

        // Assert
        TestLogger.logVerification("Verifying filtered list size is 1.");
        assertEquals(1, result.size());
        
        TestLogger.logVerification("Verifying profile name is Alice.");
        assertEquals("Alice", result.get(0).getName());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Filter Profiles - Skill Filtering")
    void testGetFilteredProfiles_Skills() throws JobPortalException {
        TestLogger.logTestStart("Filter Profiles - Skill Filtering", 
            "Target Skill: ['Java'], Profiles: [Alice: {Java, Spring}, Bob: {React, JS}]", 
            "Applying skill filter.", 
            "Only Alice's profile should match.");
        
        // Arrange
        TestLogger.logSetup("Mocking profile repository to return test profiles.");
        when(profileRepository.findAll()).thenReturn(Arrays.asList(testProfile1, testProfile2));
        Map<String, Object> filters = new HashMap<>();
        filters.put("Skills", Arrays.asList("Java"));

        // Act
        TestLogger.logExecution("Calling profileService.getFilteredProfiles() with skill filter...");
        List<ProfileDTO> result = profileService.getFilteredProfiles(filters);

        // Assert
        TestLogger.logVerification("Verifying filtered list size is 1.");
        assertEquals(1, result.size());
        
        TestLogger.logVerification("Verifying profile contains Java.");
        assertTrue(result.get(0).getSkills().contains("Java"));
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Filter Profiles - Experience Range Filtering")
    void testGetFilteredProfiles_Experience() throws JobPortalException {
        TestLogger.logTestStart("Filter Profiles - Experience Range Filtering", 
            "Range: [8, 15], Profiles: [Alice: 5 yrs, Bob: 10 yrs]", 
            "Applying experience range filter.", 
            "Only Bob's profile (10 yrs) should match.");
        
        // Arrange
        TestLogger.logSetup("Mocking profile repository to return test profiles.");
        when(profileRepository.findAll()).thenReturn(Arrays.asList(testProfile1, testProfile2));
        Map<String, Object> filters = new HashMap<>();
        filters.put("exp", Arrays.asList("8", "15"));

        // Act
        TestLogger.logExecution("Calling profileService.getFilteredProfiles() with experience filter...");
        List<ProfileDTO> result = profileService.getFilteredProfiles(filters);

        // Assert
        TestLogger.logVerification("Verifying filtered list size is 1.");
        assertEquals(1, result.size());
        
        TestLogger.logVerification("Verifying profile name is Bob.");
        assertEquals("Bob", result.get(0).getName());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Get Profile - Fail on Missing Profile")
    void testGetProfile_NotFound() {
        TestLogger.logTestStart("Get Profile - Fail on Missing Profile", 
            "Target Profile ID: 99 (Non-existent)", 
            "Attempting to retrieve a profile that doesn't exist.", 
            "Should throw JobPortalException with message 'PROFILE_NOT_FOUND'.");
        
        // Arrange
        TestLogger.logSetup("Mocking profile repository to return EMPTY for ID 99.");
        when(profileRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        TestLogger.logExecution("Calling profileService.getProfile(99) and expecting exception...");
        JobPortalException exception = assertThrows(JobPortalException.class, () -> profileService.getProfile(99L));
        
        TestLogger.logVerification("Verifying exception message is 'PROFILE_NOT_FOUND'.");
        assertEquals("PROFILE_NOT_FOUND", exception.getMessage());
        
        TestLogger.logResult("[PASS]");
    }

    @Test
    @DisplayName("Update Profile - Success Path")
    void testUpdateProfile_Success() throws JobPortalException {
        TestLogger.logTestStart("Update Profile - Success Path", 
            "Profile ID: 1, Updated Data: Alice's DTO", 
            "Updating an existing profile.", 
            "Profile should be successfully updated and saved.");
        
        // Arrange
        ProfileDTO profileDTO = testProfile1.toDTO();
        TestLogger.logSetup("Mocking profile repository to return existing profile for ID 1.");
        when(profileRepository.findById(1L)).thenReturn(Optional.of(testProfile1));

        // Act
        TestLogger.logExecution("Calling profileService.updateProfile()...");
        ProfileDTO result = profileService.updateProfile(profileDTO);

        // Assert
        TestLogger.logVerification("Verifying result is not null.");
        assertNotNull(result);
        
        TestLogger.logVerification("Verifying returned ID is 1.");
        assertEquals(1L, result.getId());
        
        TestLogger.logVerification("Verifying profile repository save was called.");
        verify(profileRepository, times(1)).save(any(Profile.class));
        
        TestLogger.logResult("[PASS]");
    }
}
