package com.codeguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RepoAnalyzeRequest {
    @NotBlank
    private String owner;

    @NotBlank
    private String repo;

    private String branch;
    private String token;
    private Integer maxCommits;
}
