package com.jobportal.dto;

import lombok.Data;

@Data
public class ResponseDTO {
    String message;

    public ResponseDTO(String message) {
        this.message = message;
    }

    public ResponseDTO() {}

}
