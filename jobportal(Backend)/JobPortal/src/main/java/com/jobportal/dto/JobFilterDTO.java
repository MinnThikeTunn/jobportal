package com.jobportal.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class JobFilterDTO {
    private Map<String, Object> filters;
    private List<JobDTO> jobs;
}
