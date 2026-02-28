package com.jobportal.api;

import com.jobportal.dto.*;
import com.jobportal.exception.JobPortalException;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/jobs")
public class JobAPI {
    @Autowired
    private JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<JobDTO> postJob(@Valid @RequestBody JobDTO jobDTO) throws JobPortalException {
        return new ResponseEntity<>(jobService.postJob(jobDTO), HttpStatus.CREATED);
    }

    @PostMapping("/postAll")
    public ResponseEntity<List<JobDTO>> postAllJobs(@Valid @RequestBody List<JobDTO> jobDTOs) throws JobPortalException {
        List<JobDTO> postedJobs = jobDTOs.stream().map(jobDTO -> {
            try {
                return jobService.postJob(jobDTO);
            } catch (JobPortalException e) {
                throw new RuntimeException("Failed to post job");
            }
        }).collect(Collectors.toList());  // Collect the stream output

        return new ResponseEntity<>(postedJobs, HttpStatus.OK);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<JobDTO>> getAllJobs() throws JobPortalException {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<JobDTO> getJob(@PathVariable Long id) throws JobPortalException {
        return new ResponseEntity<>(jobService.getJob(id), HttpStatus.OK);
    }

    @PostMapping("/apply/{id}")
    public ResponseEntity<ResponseDTO> applyJob(@Valid @PathVariable Long id,
                                                @Valid @RequestBody ApplicantDTO applicantDTO) throws JobPortalException {
        jobService.applyJob(id, applicantDTO);
        return new ResponseEntity<>(new ResponseDTO("Applied Successfully"), HttpStatus.OK);
    }

    @GetMapping("/postedBy/{id}")
    public ResponseEntity<List<JobDTO>> getJobsPostedBy(@PathVariable Long id) throws JobPortalException {
        return new ResponseEntity<>(jobService.getJobsPostedBy(id), HttpStatus.OK);
    }

    @PostMapping("/changeAppStatus")
    public ResponseEntity<ResponseDTO> changeAppStatus(@Valid @RequestBody Application application) throws JobPortalException {
        jobService.changeAppStatus(application);
        return new ResponseEntity<>(new ResponseDTO("Application Status Changed Successfully"), HttpStatus.OK);
    }

    @PostMapping("/filter")
    public ResponseEntity<List<JobDTO>> filterProfile(@RequestBody JobFilterDTO request) throws JobPortalException {
        // Ensure filters and jobs are not null
        Map<String, Object> filters = (request.getFilters() != null) ? request.getFilters() : Collections.emptyMap();
        List<JobDTO> jobs = (request.getJobs() != null) ? request.getJobs() : Collections.emptyList();


        // If both filters and jobs are empty, return empty response
        if (filters.isEmpty() && jobs.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<JobDTO> filteredJobs = jobService.getFilteredJobs(filters, jobs);
        return ResponseEntity.ok(filteredJobs);
    }


    @PostMapping("/getRecommendedJobs")
    public ResponseEntity<List<JobDTO>> getRecommendedJobs(@RequestBody RecommendedJobsReqDTO request) throws JobPortalException{
        return new ResponseEntity<>(jobService.getRecommendedJobs(request.getDesiredJobTitle(),
                request.getUserSkills()), HttpStatus.OK);
    }
}
