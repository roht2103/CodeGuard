package com.codeguard.service;

import com.codeguard.dto.DashboardStatsResponse;
import com.codeguard.dto.QualityTrendPoint;
import com.codeguard.model.Scan;
import com.codeguard.model.User;
import com.codeguard.repository.ScanRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final ScanRepository scanRepository;

    public DashboardService(ScanRepository scanRepository) {
        this.scanRepository = scanRepository;
    }

    public DashboardStatsResponse getStats(User user) {
        List<Scan> scans = scanRepository.findByUserIdOrderByScannedAtDesc(user.getId());
        int totalScans = scans.size();
        int totalVulnerabilities = scans.stream().mapToInt(Scan::getTotalVulnerabilities).sum();
        int criticalTotal = scans.stream().mapToInt(Scan::getCriticalCount).sum();
        int highTotal = scans.stream().mapToInt(Scan::getHighCount).sum();
        int averageQualityScore = totalScans == 0
                ? 0
                : (int) Math.round(scans.stream().mapToInt(Scan::getQualityScore).average().orElse(0));

        List<Scan> recent = scanRepository.findTop10ByUserIdOrderByScannedAtDesc(user.getId());
        Collections.reverse(recent);
        List<QualityTrendPoint> trend = new ArrayList<>();
        for (Scan scan : recent) {
            trend.add(QualityTrendPoint.builder()
                    .date(scan.getScannedAt().toLocalDate().toString())
                    .score(scan.getQualityScore())
                    .build());
        }

        return DashboardStatsResponse.builder()
                .totalScans(totalScans)
                .totalVulnerabilities(totalVulnerabilities)
                .averageQualityScore(averageQualityScore)
                .criticalTotal(criticalTotal)
                .highTotal(highTotal)
                .qualityTrend(trend)
                .build();
    }
}
