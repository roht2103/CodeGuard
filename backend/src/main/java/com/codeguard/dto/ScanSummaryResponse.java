package com.codeguard.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScanSummaryResponse {
    private Long id;
    private String fileName;
    private String language;
    private Integer qualityScore;
    private Integer totalVulnerabilities;
    private LocalDateTime scannedAt;
}
