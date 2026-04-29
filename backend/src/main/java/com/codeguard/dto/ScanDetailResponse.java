package com.codeguard.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScanDetailResponse {
    private Long id;
    private String fileName;
    private String language;
    private Integer qualityScore;
    private Integer totalVulnerabilities;
    private Integer criticalCount;
    private Integer highCount;
    private Integer mediumCount;
    private Integer lowCount;
    private LocalDateTime scannedAt;
    private List<VulnerabilityResponse> vulnerabilities;
}
