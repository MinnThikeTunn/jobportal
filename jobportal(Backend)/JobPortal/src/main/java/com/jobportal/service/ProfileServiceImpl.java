package com.jobportal.service;

import com.jobportal.dto.JobDTO;
import com.jobportal.dto.ProfileDTO;
import com.jobportal.entity.Profile;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.ProfileRepository;
import com.jobportal.utility.JobComparator;
import com.jobportal.utility.ProfileComparator;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service(value = "profileService")
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public Long createProfile(String email, String name) throws JobPortalException {
        Profile profile = new Profile();
        profile.setId(Utilities.getNextSequence("profiles"));
        profile.setEmail(email);
        profile.setName(name);
        profile.setSkills(new ArrayList<>());
        profile.setExperiences(new ArrayList<>());
        profile.setCertifications(new ArrayList<>());

        profileRepository.save(profile);
        return profile.getId();
    }

    @Override
    public ProfileDTO getProfile(Long id) throws JobPortalException {
        return profileRepository.findById(id).orElseThrow(() -> new JobPortalException("PROFILE_NOT_FOUND")).toDTO();
    }

    @Override
    public ProfileDTO updateProfile(ProfileDTO profileDTO) throws JobPortalException {
        profileRepository.findById(profileDTO.getId()).orElseThrow(() -> new JobPortalException("PROFILE_NOT_FOUND"));

        profileRepository.save(profileDTO.toEntity());
        return profileDTO;
    }

    @Override
    public List<ProfileDTO> getAllProfiles() throws JobPortalException {
        return profileRepository.findAll().stream().map((x)->x.toDTO()).toList();
    }

    @Override
    public List<ProfileDTO> getFilteredProfiles(Map<String, Object> filters) throws JobPortalException {
        List<ProfileDTO> profiles = profileRepository.findAll().stream()
                .map(Profile::toDTO)
                .collect(Collectors.toList());

        // 🔹 Check if all filters are empty ("" or [])
        boolean hasValidFilters = filters.entrySet().stream().anyMatch(entry -> {
            Object value = entry.getValue();
            if (value instanceof String) return !((String) value).isEmpty();
            if (value instanceof List) return !((List<?>) value).isEmpty();
            return false;
        });

        if (!hasValidFilters) {
            return profiles; // Return all profiles if all filters are empty
        }

        if (filters.containsKey("sortBy")) {
            String sortBy = filters.get("sortBy").toString();

            // Check if sortBy is not empty
            if (!sortBy.isEmpty()) {
                profiles = quickSort(profiles, sortBy);
            }

        }

        // 1️⃣ Name Filtering - Supports Partial Match (Contains)
        if (filters.containsKey("name") && filters.get("name") instanceof String nameFilter && !nameFilter.isEmpty()) {
            profiles = profiles.stream()
                    .filter(profile -> profile.getName() != null && profile.getName().toLowerCase().contains(nameFilter.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 2️⃣ Job Title Filtering - Supports Multiple Selections
        if (filters.containsKey("Job Title") && filters.get("Job Title") instanceof List<?> jobTitles && !jobTitles.isEmpty()) {
            Set<String> jobTitleSet = jobTitles.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            profiles = profiles.stream()
                    .filter(profile -> profile.getJobTitle() != null && jobTitleSet.contains(profile.getJobTitle().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 3️⃣ Location Filtering - Supports Multiple Selections
        if (filters.containsKey("Location") && filters.get("Location") instanceof List<?> locations && !locations.isEmpty()) {
            Set<String> locationSet = locations.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            profiles = profiles.stream()
                    .filter(profile -> profile.getLocation() != null && locationSet.contains(profile.getLocation().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 4️⃣ Skills Filtering - Uses Set Intersection (Match Any Skill)
        if (filters.containsKey("Skills") && filters.get("Skills") instanceof List<?> skills && !skills.isEmpty()) {
            Set<String> skillSet = skills.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            profiles = profiles.stream()
                    .filter(profile -> profile.getSkills() != null &&
                            profile.getSkills().stream()
                                    .map(String::toLowerCase)
                                    .anyMatch(skillSet::contains))
                    .collect(Collectors.toList());
        }

        // 5️⃣ Experience Range Filtering - Supports Min & Max Experience
        if (filters.containsKey("exp") && filters.get("exp") instanceof List<?> expRange && expRange.size() == 2) {
            try {
                long minExp = Long.parseLong(expRange.get(0).toString());
                long maxExp = Long.parseLong(expRange.get(1).toString());
                profiles = profiles.stream()
                        .filter(profile -> profile.getTotalExp() != null &&
                                profile.getTotalExp() >= minExp && profile.getTotalExp() <= maxExp)
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                throw new JobPortalException("Invalid experience range format");
            }
        }

        return profiles;
    }

    public List<ProfileDTO> quickSort(List<ProfileDTO> profiles, String sortBy) {
        if (profiles == null || profiles.size() <= 1) {
            return profiles;
        }

        ProfileDTO pivot = profiles.get(profiles.size() / 2);
        List<ProfileDTO> less = new ArrayList<>();
        List<ProfileDTO> greater = new ArrayList<>();
        List<ProfileDTO> equal = new ArrayList<>();

        // Partitioning step
        for (ProfileDTO profile : profiles) {
            int comparison = new ProfileComparator(sortBy).compare(profile, pivot);
            if (comparison < 0) {
                less.add(profile);
            } else if (comparison > 0) {
                greater.add(profile);
            } else {
                equal.add(profile);
            }
        }

        // Recursively sort the sublists
        List<ProfileDTO> sortedProfiles = new ArrayList<>();
        sortedProfiles.addAll(quickSort(less, sortBy));
        sortedProfiles.addAll(equal);
        sortedProfiles.addAll(quickSort(greater, sortBy));

        return sortedProfiles;
    }


}
