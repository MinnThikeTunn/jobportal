package com.jobportal.repository;

import com.jobportal.dto.NotificationStatus;
import com.jobportal.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, Long> {
    public List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
}
