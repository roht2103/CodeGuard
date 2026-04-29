package com.codeguard.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private Integer totalScans;
    private Integer totalVulnerabilities;
    private Integer averageQualityScore;
    private Integer criticalTotal;
    private Integer highTotal;
    private List<QualityTrendPoint> qualityTrend;
}
