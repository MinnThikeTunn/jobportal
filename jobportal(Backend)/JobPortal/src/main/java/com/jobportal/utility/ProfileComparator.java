package com.jobportal.utility;

import com.jobportal.dto.ProfileDTO;

import java.util.Comparator;

public class ProfileComparator implements Comparator<ProfileDTO> {
    private final String sortBy;

    public ProfileComparator(String sortBy) {
        this.sortBy = sortBy;
    }

    @Override
    public int compare(ProfileDTO p1, ProfileDTO p2) {
        if (p1.getTotalExp() == null) p1.setTotalExp(0L);
        if (p2.getTotalExp() == null) p2.setTotalExp(0L);

        if (sortBy.equals("Experience: Low to High")) {
            return Long.compare(p1.getTotalExp(), p2.getTotalExp());
        } else if (sortBy.equals("Experience: High to Low")) {
            return Long.compare(p2.getTotalExp(), p1.getTotalExp());
        }

        return 0; // No sorting applied if sortBy doesn't match any criteria
    }
}
