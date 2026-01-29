package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, Long> {
    public List<Job> findByPostedBy(Long postedById);
}
