package com.codeguard.service;

import com.codeguard.dto.DashboardStatsResponse;
import com.codeguard.dto.QualityTrendPoint;
import com.codeguard.model.Scan;
import com.codeguard.model.User;
import com.codeguard.model.RepoScan;
import com.codeguard.repository.RepoScanRepository;
import com.codeguard.repository.ScanRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final ScanRepository scanRepository;
    private final RepoScanRepository repoScanRepository;

    public DashboardService(ScanRepository scanRepository, RepoScanRepository repoScanRepository) {
        this.scanRepository = scanRepository;
        this.repoScanRepository = repoScanRepository;
    }

    public DashboardStatsResponse getStats(User user) {
        List<Scan> scans = scanRepository.findByUserIdOrderByScannedAtDesc(user.getId());
        List<RepoScan> repoScans = repoScanRepository.findByUserIdOrderByScannedAtDesc(user.getId());

        int totalScans = scans.size() + repoScans.size();
        int totalVulnerabilities = scans.stream().mapToInt(Scan::getTotalVulnerabilities).sum();
        int criticalTotal = scans.stream().mapToInt(Scan::getCriticalCount).sum();
        int highTotal = scans.stream().mapToInt(Scan::getHighCount).sum();
        
        long totalQualityScore = 0;
        totalQualityScore += scans.stream().mapToLong(Scan::getQualityScore).sum();
        totalQualityScore += repoScans.stream().mapToLong(rs -> rs.getAvgScore() == null ? 0 : rs.getAvgScore()).sum();
        
        int averageQualityScore = totalScans == 0
                ? 0
                : (int) Math.round((double) totalQualityScore / totalScans);

        List<QualityTrendPoint> trend = new ArrayList<>();
        
        for (Scan scan : scans) {
            trend.add(QualityTrendPoint.builder()
                    .date(scan.getScannedAt().toLocalDate().toString())
                    .score(scan.getQualityScore())
                    .build());
        }
        
        for (RepoScan repoScan : repoScans) {
            trend.add(QualityTrendPoint.builder()
                    .date(repoScan.getScannedAt().toLocalDate().toString())
                    .score(repoScan.getAvgScore() == null ? 0 : repoScan.getAvgScore())
                    .build());
        }
        
        // Sort trend by date ascending
        trend.sort(Comparator.comparing(QualityTrendPoint::getDate));
        
        // Only keep the last 10 points for the trend
        if (trend.size() > 10) {
            trend = trend.subList(trend.size() - 10, trend.size());
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
