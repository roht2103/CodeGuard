package com.codeguard.controller;

import com.codeguard.dto.RepoAnalyzeRequest;
import com.codeguard.dto.RepoAnalysisResponse;
import com.codeguard.service.GitHubAnalysisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/repos")
public class RepoAnalysisController {
    private final GitHubAnalysisService gitHubAnalysisService;

    public RepoAnalysisController(GitHubAnalysisService gitHubAnalysisService) {
        this.gitHubAnalysisService = gitHubAnalysisService;
    }

    @PostMapping("/analyze")
    public RepoAnalysisResponse analyze(@Valid @RequestBody RepoAnalyzeRequest request) {
        return gitHubAnalysisService.analyzeRepository(request);
    }
}
