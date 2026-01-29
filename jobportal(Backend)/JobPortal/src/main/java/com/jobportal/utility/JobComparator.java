package com.jobportal.utility;

import com.jobportal.dto.JobDTO;

import java.util.Comparator;

public class JobComparator implements Comparator<JobDTO> {
    private String sortBy;

    public JobComparator(String sortBy) {
        this.sortBy = sortBy;
    }

    @Override
    public int compare(JobDTO job1, JobDTO job2) {
        switch (sortBy) {
            case "Most Recent":
                return job2.getPostTime().compareTo(job1.getPostTime()); // Descending order (most recent first)

            case "Salary: Low to High":
                return Double.compare(job1.getPackageOffered(), job2.getPackageOffered()); // Ascending order

            case "Salary: High to Low":
                return Double.compare(job2.getPackageOffered(), job1.getPackageOffered()); // Descending order

            default:
                return 0;
        }
    }
}

