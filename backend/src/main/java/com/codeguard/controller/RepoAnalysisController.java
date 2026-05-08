package com.codeguard.controller;

import com.codeguard.dto.RepoAnalyzeRequest;
import com.codeguard.dto.RepoAnalysisResponse;
import com.codeguard.dto.RepoScanSummaryResponse;
import com.codeguard.exception.ApiException;
import com.codeguard.model.User;
import com.codeguard.repository.UserRepository;
import com.codeguard.service.GitHubAnalysisService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/repos")
public class RepoAnalysisController {
    private final GitHubAnalysisService gitHubAnalysisService;
    private final UserRepository userRepository;

    public RepoAnalysisController(GitHubAnalysisService gitHubAnalysisService, UserRepository userRepository) {
        this.gitHubAnalysisService = gitHubAnalysisService;
        this.userRepository = userRepository;
    }

    @PostMapping("/analyze")
    public RepoAnalysisResponse analyze(@Valid @RequestBody RepoAnalyzeRequest request) {
        User user = getCurrentUser();
        return gitHubAnalysisService.analyzeRepository(request, user);
    }

    @GetMapping("/scans")
    public List<RepoScanSummaryResponse> getScans() {
        User user = getCurrentUser();
        return gitHubAnalysisService.getScansByUser(user);
    }

    @GetMapping("/scans/{id}")
    public RepoAnalysisResponse getScan(@PathVariable Long id) {
        User user = getCurrentUser();
        return gitHubAnalysisService.getScanById(id, user);
    }

    @DeleteMapping("/scans/{id}")
    public Map<String, String> deleteScan(@PathVariable Long id) {
        User user = getCurrentUser();
        gitHubAnalysisService.deleteScan(id, user);
        return Map.of("message", "Repo scan deleted.");
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found.", HttpStatus.UNAUTHORIZED));
    }
}
