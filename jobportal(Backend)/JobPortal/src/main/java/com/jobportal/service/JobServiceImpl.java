package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.JobRepository;
import com.jobportal.utility.JobComparator;
import com.jobportal.utility.Utilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service(value = "jobService")
public class JobServiceImpl implements JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public JobDTO postJob(JobDTO jobDTO) throws JobPortalException {
        if(jobDTO.getJobId() == 0 ){
            jobDTO.setJobId(Utilities.getNextSequence("jobs"));
            jobDTO.setPostTime(LocalDateTime.now());
            NotificationDTO notiDTO = new NotificationDTO();
            notiDTO.setAction("Job Posted");
            notiDTO.setMessage("Job Posted Successfully for "+jobDTO.getJobTitle()+" at "+jobDTO.getCompany());
            notiDTO.setUserId(jobDTO.getPostedBy());
            notiDTO.setRoute("/posted-jobs/"+jobDTO.getJobId());
            try {
                notificationService.sendNotification(notiDTO);
            } catch (JobPortalException e) {
                throw new RuntimeException(e);
            }
        } else {
            Job job = jobRepository.findById(jobDTO.getJobId()).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
            if(job.getJobStatus().equals(JobStatus.DRAFT) || jobDTO.getJobStatus().equals(JobStatus.CLOSED)){
                jobDTO.setPostTime(LocalDateTime.now());
            }
        }

        return jobRepository.save(jobDTO.toEntity()).toDTO();
    }

    @Override
    public List<JobDTO> getAllJobs() throws JobPortalException {
        return jobRepository.findAll().stream().map((x)->x.toDTO()).toList();
    }

    @Override
    public JobDTO getJob(Long id) throws JobPortalException {
        return jobRepository.findById(id).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND")).toDTO();
    }

    @Override
    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalException {
        Job job = jobRepository.findById(id).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
        List<Applicant> applicants = job.getApplicants();
        if(applicants==null) applicants = new ArrayList<Applicant>();
        if(applicants.stream().filter((x)->x.getApplicantId()==applicantDTO.getApplicantId()).toList().size()>0) throw new JobPortalException("JOB_APPLIED_ALREADY");
        applicantDTO.setApplicationStatus(ApplicationStatus.APPLIED);
        applicants.add(applicantDTO.toEntity());
        job.setApplicants(applicants);
        jobRepository.save(job);
    }

    @Override
    public List<JobDTO> getJobsPostedBy(Long id) throws JobPortalException {
        return jobRepository.findByPostedBy(id).stream().map((x)->x.toDTO()).toList();
    }

    @Override
    public void changeAppStatus(Application application) throws JobPortalException {
        Job job = jobRepository.findById(application.getId()).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
        List<Applicant> applicants = job.getApplicants().stream().map((x)->{
            if(application.getApplicantId()==x.getApplicantId()){
                x.setApplicationStatus(application.getApplicationStatus());
                if(application.getApplicationStatus().equals(ApplicationStatus.INTERVIEWING)) {
                    x.setInterviewTime(application.getInterviewTime());
                    NotificationDTO notiDTO = new NotificationDTO();
                    notiDTO.setAction("Interview Scheduled");
                    notiDTO.setMessage("Interview Scheduled for job id: "+application.getId());
                    notiDTO.setUserId(application.getApplicantId());
                    notiDTO.setRoute("/job-history");
                    try {
                        notificationService.sendNotification(notiDTO);
                    } catch (JobPortalException e) {
                        throw new RuntimeException(e);
                    }
                }

            }
            return x;
        }).toList();
        job.setApplicants(applicants);
        jobRepository.save(job);
    }

    @Override
    public List<JobDTO> getFilteredJobs(Map<String, Object> filters, List<JobDTO> jobs) throws JobPortalException {

        if(jobs == null || jobs.isEmpty()){
            jobs = jobRepository.findAll().stream().map(Job::toDTO).collect(Collectors.toList());
        }

        // 🔹 Check if all filters are empty ("" or [])
        boolean hasValidFilters = filters.entrySet().stream().anyMatch(entry -> {
            Object value = entry.getValue();
            if (value instanceof String) return !((String) value).isEmpty();
            if (value instanceof List) return !((List<?>) value).isEmpty();
            return false;
        });

        if (!hasValidFilters) {
            return jobs; // Return all jobs if all filters are empty
        }

        if (filters.containsKey("sortBy")) {
            String sortBy = filters.get("sortBy").toString();

            // Check if sortBy is not empty
            if (!sortBy.isEmpty()) {
                jobs = quickSort(jobs, sortBy);
            }

        }

        // 2️⃣ Job Title Filtering - Supports Multiple Selections
        if (filters.containsKey("Experience") && filters.get("Experience") instanceof List<?> experience && !experience.isEmpty()) {
            Set<String> experienceSet = experience.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            jobs = jobs.stream()
                    .filter(job -> job.getExperience() != null && experienceSet.contains(job.getExperience().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 2️⃣ Job Title Filtering - Supports Multiple Selections
        if (filters.containsKey("Job Title") && filters.get("Job Title") instanceof List<?> jobTitles && !jobTitles.isEmpty()) {
            Set<String> jobTitleSet = jobTitles.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            jobs = jobs.stream()
                    .filter(job -> job.getJobTitle() != null && jobTitleSet.contains(job.getJobTitle().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 3️⃣ Location Filtering - Supports Multiple Selections
        if (filters.containsKey("Location") && filters.get("Location") instanceof List<?> locations && !locations.isEmpty()) {
            Set<String> locationSet = locations.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            jobs = jobs.stream()
                    .filter(job -> job.getLocation() != null && locationSet.contains(job.getLocation().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 4️⃣ Skills Filtering - Uses Set Intersection (Match Any Skill)
        if (filters.containsKey("Job Type") && filters.get("Job Type") instanceof List<?> jobTypes && !jobTypes.isEmpty()) {
            Set<String> jobTypeSet = jobTypes.stream()
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            jobs = jobs.stream()
                    .filter(job -> job.getJobType() != null && jobTypeSet.contains(job.getJobType().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // 5️⃣ Experience Range Filtering - Supports Min & Max Experience
        if (filters.containsKey("salary") && filters.get("salary") instanceof List<?> salaryRange && salaryRange.size() == 2) {
            try {
                long minSalary = Long.parseLong(salaryRange.get(0).toString());
                long maxSalary = Long.parseLong(salaryRange.get(1).toString());
                jobs = jobs.stream()
                        .filter(profile -> profile.getPackageOffered() != null &&
                                profile.getPackageOffered() >= minSalary && profile.getPackageOffered() <= maxSalary)
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                throw new JobPortalException("Invalid salary range format");
            }
        }

        return jobs;
    }

    @Override
    public List<JobDTO> getRecommendedJobs(String desiredJobTitle, List<String> userSkills) throws JobPortalException {
        List<JobDTO> allJobs = jobRepository.findAll().stream()
                .map(job -> job.toDTO())
                .collect(Collectors.toList());

        if(desiredJobTitle == null || desiredJobTitle.trim().isEmpty() || userSkills == null || userSkills.isEmpty()){
            return allJobs;
        }


        return allJobs.stream()
                .filter(job -> job.getJobTitle().equalsIgnoreCase(desiredJobTitle))
                .sorted(Comparator.comparingLong(JobDTO::getPackageOffered).reversed()
                        .thenComparing((job1, job2) -> Long.compare(
                                job2.getSkillsRequired().stream().filter(userSkills::contains).count(),
                                job1.getSkillsRequired().stream().filter(userSkills::contains).count()))
                        .thenComparing(JobDTO::getPostTime, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    public List<JobDTO> quickSort(List<JobDTO> jobs, String sortBy) {
        if (jobs == null || jobs.size() <= 1) {
            return jobs;
        }

        JobDTO pivot = jobs.get(jobs.size() / 2);
        List<JobDTO> less = new ArrayList<>();
        List<JobDTO> greater = new ArrayList<>();
        List<JobDTO> equal = new ArrayList<>();

        // Partitioning step
        for (JobDTO job : jobs) {
            int comparison = new JobComparator(sortBy).compare(job, pivot);
            if (comparison < 0) {
                less.add(job);
            } else if (comparison > 0) {
                greater.add(job);
            } else {
                equal.add(job);
            }
        }

        // Recursively sort the sublists
        List<JobDTO> sortedJobs = new ArrayList<>();
        sortedJobs.addAll(quickSort(less, sortBy));
        sortedJobs.addAll(equal);
        sortedJobs.addAll(quickSort(greater, sortBy));

        return sortedJobs;
    }
}
