package com.codeguard.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RepoAnalysisResponse {
    private String owner;
    private String repo;
    private String branch;
    private Integer analyzedCommits;
    private List<CommitQualityResponse> commits;
}
