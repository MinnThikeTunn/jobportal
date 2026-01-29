package com.jobportal.service;

import com.jobportal.dto.ApplicantDTO;
import com.jobportal.dto.Application;
import com.jobportal.dto.JobDTO;
import com.jobportal.exception.JobPortalException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface JobService {

    public JobDTO postJob(JobDTO jobDTO) throws JobPortalException;

    public List<JobDTO> getAllJobs() throws JobPortalException;

    public JobDTO getJob(Long id) throws JobPortalException;

    public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalException;

    public List<JobDTO> getJobsPostedBy(Long id) throws JobPortalException;

    public void changeAppStatus(Application application) throws JobPortalException;

    public List<JobDTO> getFilteredJobs(Map<String, Object> filters, List<JobDTO> jobs) throws JobPortalException;

    public List<JobDTO> getRecommendedJobs(String desiredJobTitle, List<String> userSkills) throws JobPortalException;
}
