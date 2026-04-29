package com.codeguard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommitQualityResponse {
    private String sha;
    private String message;
    private String date;
    private Integer score;
    private Integer complexity;
    private Integer duplicationPercent;
    private Integer styleIssues;
    private Integer filesAnalyzed;
}
