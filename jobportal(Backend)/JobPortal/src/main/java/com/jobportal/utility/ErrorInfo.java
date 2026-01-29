package com.jobportal.utility;

import java.time.LocalDateTime;

public class ErrorInfo {
    private String errorMessage;
    private Integer errorCode;
    private LocalDateTime timeStamp;

    // No-args constructor
    public ErrorInfo() {
    }

    // Constructor with parameters
    public ErrorInfo(String errorMessage, Integer errorCode, LocalDateTime timeStamp) {
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.timeStamp = timeStamp;
    }

    // Getters and setters (if you don't use Lombok)
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }
}
