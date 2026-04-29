package com.codeguard.controller;

import com.codeguard.dto.ScanDetailResponse;
import com.codeguard.dto.ScanSummaryResponse;
import com.codeguard.exception.ApiException;
import com.codeguard.model.Scan;
import com.codeguard.model.User;
import com.codeguard.repository.ScanRepository;
import com.codeguard.repository.UserRepository;
import com.codeguard.service.ScannerService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/scans")
public class ScanController {
    private final ScannerService scannerService;
    private final ScanRepository scanRepository;
    private final UserRepository userRepository;

    public ScanController(ScannerService scannerService, ScanRepository scanRepository, UserRepository userRepository) {
        this.scannerService = scannerService;
        this.scanRepository = scanRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ScanDetailResponse upload(@RequestParam("file") MultipartFile file) {
        User user = getCurrentUser();
        return scannerService.scanAndSave(file, user);
    }

    @GetMapping
    public List<ScanSummaryResponse> getScans() {
        User user = getCurrentUser();
        List<Scan> scans = scanRepository.findByUserIdOrderByScannedAtDesc(user.getId());
        return scans.stream()
                .map(scan -> ScanSummaryResponse.builder()
                        .id(scan.getId())
                        .fileName(scan.getFileName())
                        .language(scan.getLanguage())
                        .qualityScore(scan.getQualityScore())
                        .totalVulnerabilities(scan.getTotalVulnerabilities())
                        .scannedAt(scan.getScannedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ScanDetailResponse getScan(@PathVariable Long id) {
        User user = getCurrentUser();
        return scannerService.getScanDetail(id, user);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteScan(@PathVariable Long id) {
        User user = getCurrentUser();
        scannerService.deleteScan(id, user);
        return Map.of("message", "Scan deleted.");
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found.", HttpStatus.UNAUTHORIZED));
    }
}
