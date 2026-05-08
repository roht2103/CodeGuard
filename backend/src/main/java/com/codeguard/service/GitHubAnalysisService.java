package com.codeguard.service;

import com.codeguard.dto.CommitQualityResponse;
import com.codeguard.dto.RepoAnalyzeRequest;
import com.codeguard.dto.RepoAnalysisResponse;
import com.codeguard.dto.RepoScanSummaryResponse;
import com.codeguard.exception.ApiException;
import com.codeguard.model.RepoCommit;
import com.codeguard.model.RepoScan;
import com.codeguard.model.User;
import com.codeguard.repository.RepoScanRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

@Service
public class GitHubAnalysisService {
    private static final int DEFAULT_MAX_COMMITS = 10;
    private static final int MAX_COMMITS_LIMIT = 100;
    private static final int MAX_FILES_PER_COMMIT = 200;
    private static final int MAX_FILE_SIZE = 200_000;
    private static final Pattern COMPLEXITY_PATTERN = Pattern.compile("\\b(if|for|while|case|catch|switch|elif|except)\\b|&&|\\|\\|");
    private static final Pattern TODO_PATTERN = Pattern.compile("(?i)(TODO|FIXME|HACK|XXX)");

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String defaultToken;
    private final RepoScanRepository repoScanRepository;

    public GitHubAnalysisService(@Value("${app.github.token:}") String defaultToken, RepoScanRepository repoScanRepository) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.defaultToken = defaultToken;
        this.repoScanRepository = repoScanRepository;
    }

    public RepoAnalysisResponse analyzeRepository(RepoAnalyzeRequest request, User user) {
        String owner = request.getOwner() == null ? "" : request.getOwner().trim();
        String repo = request.getRepo() == null ? "" : request.getRepo().trim();
        String branch = request.getBranch() == null ? "" : request.getBranch().trim();
        String inputToken = request.getToken() == null ? "" : request.getToken().trim();

        int maxCommits = normalizeMaxCommits(request.getMaxCommits());
        String token = resolveToken(inputToken);

        String commitsUrl = String.format("https://api.github.com/repos/%s/%s/commits?per_page=%d",
                owner, repo, maxCommits);
        if (!branch.isEmpty()) {
            commitsUrl += "&sha=" + branch;
        }

        List<Map<String, Object>> commitItems = fetchJsonList(commitsUrl, token);
        List<CommitQualityResponse> commits = new ArrayList<>();
        List<RepoCommit> repoCommits = new ArrayList<>();

        for (Map<String, Object> commitItem : commitItems) {
            String sha = (String) commitItem.get("sha");
            Map<String, Object> commitDetails = castMap(commitItem.get("commit"));
            String message = commitDetails == null ? "" : (String) commitDetails.getOrDefault("message", "");
            Map<String, Object> committer = commitDetails == null ? null : castMap(commitDetails.get("committer"));
            String date = committer == null ? Instant.now().toString() : (String) committer.getOrDefault("date", "");

            CommitMetrics metrics = analyzeCommit(owner, repo, sha, token);

            commits.add(CommitQualityResponse.builder()
                    .sha(sha)
                    .message(message)
                    .date(date)
                    .score(metrics.score)
                    .complexity(metrics.complexity)
                    .duplicationPercent(metrics.duplicationPercent)
                    .styleIssues(metrics.styleIssues)
                    .filesAnalyzed(metrics.filesAnalyzed)
                    .build());

            repoCommits.add(RepoCommit.builder()
                    .sha(sha)
                    .message(message)
                    .date(date)
                    .score(metrics.score)
                    .complexity(metrics.complexity)
                    .duplicationPercent(metrics.duplicationPercent)
                    .styleIssues(metrics.styleIssues)
                    .filesAnalyzed(metrics.filesAnalyzed)
                    .build());
        }

        Collections.reverse(commits);
        Collections.reverse(repoCommits);

        int avgScore = repoCommits.isEmpty() ? 0 : 
            (int) Math.round(repoCommits.stream().mapToInt(RepoCommit::getScore).average().orElse(0));

        RepoScan repoScan = RepoScan.builder()
                .user(user)
                .owner(owner)
                .repo(repo)
                .branch(branch.isEmpty() ? null : branch)
                .analyzedCommits(commits.size())
                .avgScore(avgScore)
                .build();

        for (RepoCommit rc : repoCommits) {
            rc.setRepoScan(repoScan);
        }
        repoScan.setCommits(repoCommits);

        repoScanRepository.save(repoScan);

        return RepoAnalysisResponse.builder()
                .id(repoScan.getId())
                .owner(repoScan.getOwner())
                .repo(repoScan.getRepo())
                .branch(repoScan.getBranch())
                .analyzedCommits(repoScan.getAnalyzedCommits())
                .scannedAt(repoScan.getScannedAt())
                .commits(commits)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RepoScanSummaryResponse> getScansByUser(User user) {
        return repoScanRepository.findByUserIdOrderByScannedAtDesc(user.getId()).stream()
                .map(scan -> RepoScanSummaryResponse.builder()
                        .id(scan.getId())
                        .owner(scan.getOwner())
                        .repo(scan.getRepo())
                        .branch(scan.getBranch())
                        .analyzedCommits(scan.getAnalyzedCommits())
                        .scannedAt(scan.getScannedAt())
                        .avgScore(scan.getAvgScore() == null ? 0 : scan.getAvgScore())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RepoAnalysisResponse getScanById(Long id, User user) {
        RepoScan repoScan = repoScanRepository.findById(id)
                .orElseThrow(() -> new ApiException("Repo Scan not found.", HttpStatus.NOT_FOUND));

        if (!repoScan.getUser().getId().equals(user.getId())) {
            throw new ApiException("Access denied.", HttpStatus.FORBIDDEN);
        }

        List<CommitQualityResponse> commits = repoScan.getCommits().stream()
                .map(rc -> CommitQualityResponse.builder()
                        .sha(rc.getSha())
                        .message(rc.getMessage())
                        .date(rc.getDate())
                        .score(rc.getScore())
                        .complexity(rc.getComplexity())
                        .duplicationPercent(rc.getDuplicationPercent())
                        .styleIssues(rc.getStyleIssues())
                        .filesAnalyzed(rc.getFilesAnalyzed())
                        .build())
                .collect(Collectors.toList());

        return RepoAnalysisResponse.builder()
                .id(repoScan.getId())
                .owner(repoScan.getOwner())
                .repo(repoScan.getRepo())
                .branch(repoScan.getBranch())
                .analyzedCommits(repoScan.getAnalyzedCommits())
                .scannedAt(repoScan.getScannedAt())
                .commits(commits)
                .build();
    }

    @Transactional
    public void deleteScan(Long id, User user) {
        RepoScan repoScan = repoScanRepository.findById(id)
                .orElseThrow(() -> new ApiException("Repo Scan not found.", HttpStatus.NOT_FOUND));

        if (!repoScan.getUser().getId().equals(user.getId())) {
            throw new ApiException("Access denied.", HttpStatus.FORBIDDEN);
        }

        repoScanRepository.delete(repoScan);
    }

    private CommitMetrics analyzeCommit(String owner, String repo, String sha, String token) {
        String commitUrl = String.format("https://api.github.com/repos/%s/%s/commits/%s", owner, repo, sha);
        Map<String, Object> commit = fetchJsonMap(commitUrl, token);
        List<Map<String, Object>> files = castList(commit.get("files"));

        if (files == null || files.isEmpty()) {
            return CommitMetrics.empty();
        }

        int filesAnalyzed = 0;
        int totalComplexity = 0;
        int totalStyleIssues = 0;
        int totalNonEmptyLines = 0;
        int totalDuplicateLines = 0;

        for (Map<String, Object> file : files) {
            if (filesAnalyzed >= MAX_FILES_PER_COMMIT) {
                break;
            }
            String filename = (String) file.get("filename");
            if (!isSupportedFile(filename)) {
                continue;
            }
            String content = fetchFileContent(owner, repo, filename, sha, token);
            if (content == null) {
                continue;
            }

            ContentMetrics metrics = analyzeContent(content);
            filesAnalyzed++;
            totalComplexity += metrics.complexity;
            totalStyleIssues += metrics.styleIssues;
            totalNonEmptyLines += metrics.nonEmptyLines;
            totalDuplicateLines += metrics.duplicateLines;
        }

        int duplicationPercent = totalNonEmptyLines == 0
                ? 0
                : (int) Math.round((totalDuplicateLines * 100.0) / totalNonEmptyLines);
        int score = calculateScore(totalComplexity, duplicationPercent, totalStyleIssues);

        return new CommitMetrics(score, totalComplexity, duplicationPercent, totalStyleIssues, filesAnalyzed);
    }

    private ContentMetrics analyzeContent(String content) {
        String[] lines = content.split("\\R", -1);
        int complexity = 0;
        int styleIssues = 0;
        int nonEmptyLines = 0;
        Map<String, Integer> lineCounts = new HashMap<>();

        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                nonEmptyLines++;
                lineCounts.put(trimmed, lineCounts.getOrDefault(trimmed, 0) + 1);
            }

            Matcher matcher = COMPLEXITY_PATTERN.matcher(line);
            while (matcher.find()) {
                complexity++;
            }

            if (line.length() > 120) {
                styleIssues++;
            }
            if (line.endsWith(" ") || line.endsWith("\t")) {
                styleIssues++;
            }
            if (TODO_PATTERN.matcher(line).find()) {
                styleIssues++;
            }
        }

        int duplicateLines = 0;
        for (int count : lineCounts.values()) {
            if (count > 1) {
                duplicateLines += (count - 1);
            }
        }

        return new ContentMetrics(complexity, styleIssues, nonEmptyLines, duplicateLines);
    }

    private int calculateScore(int complexity, int duplicationPercent, int styleIssues) {
        int complexityPenalty = Math.min(30, complexity);
        int duplicationPenalty = Math.min(30, duplicationPercent);
        int stylePenalty = Math.min(20, styleIssues);
        int score = 100 - complexityPenalty - duplicationPenalty - stylePenalty;
        return Math.max(0, score);
    }

    private String fetchFileContent(String owner, String repo, String path, String sha, String token) {
        String fileUrl = String.format("https://api.github.com/repos/%s/%s/contents/%s?ref=%s",
                owner, repo, path, sha);
        Map<String, Object> payload = fetchJsonMap(fileUrl, token);
        String encoding = (String) payload.get("encoding");
        Object sizeObj = payload.get("size");
        int size = sizeObj instanceof Number ? ((Number) sizeObj).intValue() : 0;
        if (!"base64".equalsIgnoreCase(encoding) || size > MAX_FILE_SIZE) {
            return null;
        }
        String content = (String) payload.get("content");
        if (content == null) {
            return null;
        }
        byte[] decoded = Base64.getMimeDecoder().decode(content.getBytes(StandardCharsets.UTF_8));
        return new String(decoded, StandardCharsets.UTF_8);
    }

    private List<Map<String, Object>> fetchJsonList(String url, String token) {
        String json = fetchJson(url, token);
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception ex) {
            throw new ApiException("Failed to parse GitHub response.", HttpStatus.BAD_GATEWAY);
        }
    }

    private Map<String, Object> fetchJsonMap(String url, String token) {
        String json = fetchJson(url, token);
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            throw new ApiException("Failed to parse GitHub response.", HttpStatus.BAD_GATEWAY);
        }
    }

    private String fetchJson(String url, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Accept", "application/vnd.github+json");
        if (token != null && !token.isBlank()) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ApiException("GitHub API request failed.", HttpStatus.BAD_GATEWAY);
            }
            return response.getBody() == null ? "{}" : response.getBody();
        } catch (RestClientResponseException ex) {
            int statusCode = ex.getRawStatusCode();
            String message;
            if (statusCode == 404) {
                message = "GitHub API returned 404 Not Found. Please verify the owner, repository name, and branch exist, and ensure your token has access.";
            } else if (statusCode == 401) {
                message = "GitHub API returned 401 Unauthorized. Your GitHub Token is invalid or expired.";
            } else if (statusCode == 403) {
                message = "GitHub API returned 403 Forbidden. You may have exceeded the API rate limit or lack permissions.";
            } else {
                String statusText = ex.getStatusText() == null ? "" : ex.getStatusText();
                message = "GitHub API error: " + statusCode + " " + statusText;
            }
            throw new ApiException(message.trim(), HttpStatus.BAD_REQUEST);
        }
    }

    private int normalizeMaxCommits(Integer maxCommits) {
        if (maxCommits == null) {
            return DEFAULT_MAX_COMMITS;
        }
        if (maxCommits < 1) {
            return 1;
        }
        return Math.min(maxCommits, MAX_COMMITS_LIMIT);
    }

    private String resolveToken(String token) {
        if (token != null && !token.isBlank()) {
            return token;
        }
        return defaultToken;
    }

    private boolean isSupportedFile(String filename) {
        if (filename == null) {
            return false;
        }
        String lower = filename.toLowerCase(Locale.ROOT);
        return lower.endsWith(".java")
            || lower.endsWith(".js")
            || lower.endsWith(".jsx")
            || lower.endsWith(".ts")
            || lower.endsWith(".tsx")
            || lower.endsWith(".py");
    }

    private Map<String, Object> castMap(Object value) {
        if (value instanceof Map<?, ?>) {
            return (Map<String, Object>) value;
        }
        return null;
    }

    private List<Map<String, Object>> castList(Object value) {
        if (value instanceof List<?>) {
            return (List<Map<String, Object>>) value;
        }
        return null;
    }

    private static class CommitMetrics {
        private final int score;
        private final int complexity;
        private final int duplicationPercent;
        private final int styleIssues;
        private final int filesAnalyzed;

        private CommitMetrics(int score, int complexity, int duplicationPercent, int styleIssues, int filesAnalyzed) {
            this.score = score;
            this.complexity = complexity;
            this.duplicationPercent = duplicationPercent;
            this.styleIssues = styleIssues;
            this.filesAnalyzed = filesAnalyzed;
        }

        private static CommitMetrics empty() {
            return new CommitMetrics(100, 0, 0, 0, 0);
        }
    }

    private static class ContentMetrics {
        private final int complexity;
        private final int styleIssues;
        private final int nonEmptyLines;
        private final int duplicateLines;

        private ContentMetrics(int complexity, int styleIssues, int nonEmptyLines, int duplicateLines) {
            this.complexity = complexity;
            this.styleIssues = styleIssues;
            this.nonEmptyLines = nonEmptyLines;
            this.duplicateLines = duplicateLines;
        }
    }
}
