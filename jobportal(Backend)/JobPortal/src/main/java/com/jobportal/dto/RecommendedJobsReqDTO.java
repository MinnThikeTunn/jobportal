package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendedJobsReqDTO {
    private String desiredJobTitle;
    private List<String> userSkills;
}
