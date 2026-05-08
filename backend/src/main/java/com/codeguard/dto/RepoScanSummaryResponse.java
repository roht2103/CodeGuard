package com.codeguard.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoScanSummaryResponse {
    private Long id;
    private String owner;
    private String repo;
    private String branch;
    private Integer analyzedCommits;
    private LocalDateTime scannedAt;
    private Integer avgScore;
}
