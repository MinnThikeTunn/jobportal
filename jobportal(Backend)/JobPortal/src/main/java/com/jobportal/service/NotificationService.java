package com.jobportal.service;

import com.jobportal.dto.NotificationDTO;
import com.jobportal.entity.Notification;
import com.jobportal.exception.JobPortalException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationService {
    public void sendNotification(NotificationDTO notificationDTO) throws JobPortalException;

    public List<Notification> getUnreadNotifications(Long userId);

    public void readNotification(Long id) throws JobPortalException;
}
