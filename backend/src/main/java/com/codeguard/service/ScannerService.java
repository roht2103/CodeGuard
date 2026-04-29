package com.codeguard.service;

import com.codeguard.dto.ScanDetailResponse;
import com.codeguard.dto.VulnerabilityResponse;
import com.codeguard.exception.ApiException;
import com.codeguard.model.Scan;
import com.codeguard.model.Severity;
import com.codeguard.model.User;
import com.codeguard.model.Vulnerability;
import com.codeguard.repository.ScanRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ScannerService {
    private static final Pattern HARDCODED_PASSWORD = Pattern.compile("(?i)(password|passwd|pwd)\\s*=\\s*[\"'][^\"']{3,}[\"']");
    private static final Pattern HARDCODED_API = Pattern.compile("(?i)(api_key|apikey|secret|token)\\s*=\\s*[\"'][^\"']{8,}[\"']");
    private static final Pattern SQL_INJECTION = Pattern.compile("(?i)(query|sql)\\s*=\\s*[\"'].*\\+");
    private static final Pattern COMMAND_INJECTION = Pattern.compile("Runtime\\.getRuntime\\(\\)\\.exec\\(");
    private static final Pattern HARDCODED_IP = Pattern.compile("\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b");
    private static final Pattern INSECURE_HTTP = Pattern.compile("http://(?!localhost)");
    private static final Pattern MD5_USAGE = Pattern.compile("(?i)md5|MessageDigest\\.getInstance\\(\\\"MD5\\\"\\)");
    private static final Pattern EVAL_USAGE = Pattern.compile("\\beval\\s*\\(");
    private static final Pattern PRINT_STACK_TRACE = Pattern.compile("\\.printStackTrace\\(\\)");
    private static final Pattern TODO_FIXME = Pattern.compile("(?i)(TODO|FIXME|HACK|XXX)");
    private static final Pattern EMPTY_CATCH = Pattern.compile("catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}");
    private static final Pattern DEPRECATED = Pattern.compile("@Deprecated");
    private static final Pattern CONSOLE_LOG = Pattern.compile("console\\.log\\(");
    private static final Pattern MAGIC_NUMBER = Pattern.compile("(?<![.\\w])\\b([2-9]\\d{2,}|\\d{4,})\\b(?![.\\w%\"'])");

    private final ScanRepository scanRepository;

    public ScannerService(ScanRepository scanRepository) {
        this.scanRepository = scanRepository;
    }

    public ScanDetailResponse scanAndSave(MultipartFile file, User user) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Uploaded file is empty.", HttpStatus.BAD_REQUEST);
        }

        String language = detectLanguage(file.getOriginalFilename());
        List<Vulnerability> vulnerabilities = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 0;
            String previousNonEmptyLine = "";

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                String trimmed = line.trim();

                applyRules(language, line, lineNumber, vulnerabilities);

                if (line.length() > 120) {
                    vulnerabilities.add(buildVulnerability(Severity.LOW, "Long Line", lineNumber, line,
                            "Line exceeds 120 characters.", "Split the line into smaller statements."));
                }

                if (MAGIC_NUMBER.matcher(line).find()) {
                    vulnerabilities.add(buildVulnerability(Severity.LOW, "Magic Number", lineNumber, line,
                            "Potential magic number detected.", "Extract the number into a named constant."));
                }

                if ("JAVA".equals(language) && isPublicMethod(line) && !previousNonEmptyLine.startsWith("/**")) {
                    vulnerabilities.add(buildVulnerability(Severity.LOW, "Missing Javadoc", lineNumber, line,
                            "Public method lacks Javadoc.", "Add a Javadoc comment describing the method."));
                }

                if (!trimmed.isEmpty()) {
                    previousNonEmptyLine = trimmed;
                }
            }
        } catch (IOException ex) {
            throw new ApiException("Failed to read uploaded file.", HttpStatus.BAD_REQUEST);
        }

        SeverityCounts counts = countBySeverity(vulnerabilities);
        int qualityScore = calculateQualityScore(counts);

        Scan scan = Scan.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .language(language)
                .qualityScore(qualityScore)
                .totalVulnerabilities(vulnerabilities.size())
                .criticalCount(counts.critical)
                .highCount(counts.high)
                .mediumCount(counts.medium)
                .lowCount(counts.low)
                .scannedAt(LocalDateTime.now())
                .build();

        for (Vulnerability vulnerability : vulnerabilities) {
            vulnerability.setScan(scan);
        }
        scan.setVulnerabilities(vulnerabilities);

        Scan saved = scanRepository.save(scan);
        return mapToDetailResponse(saved);
    }

    public ScanDetailResponse getScanDetail(Long id, User user) {
        Scan scan = scanRepository.findWithVulnerabilitiesByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException("Scan not found.", HttpStatus.NOT_FOUND));
        return mapToDetailResponse(scan);
    }

    public void deleteScan(Long id, User user) {
        Scan scan = scanRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException("Scan not found.", HttpStatus.NOT_FOUND));
        scanRepository.delete(scan);
    }

    private void applyRules(String language, String line, int lineNumber, List<Vulnerability> vulnerabilities) {
        for (Rule rule : buildRules()) {
            if (!rule.appliesTo(language)) {
                continue;
            }
            if (rule.pattern.matcher(line).find()) {
                vulnerabilities.add(buildVulnerability(rule.severity, rule.type, lineNumber, line,
                        rule.description, rule.suggestion));
            }
        }
    }

    private List<Rule> buildRules() {
        return Arrays.asList(
                new Rule(HARDCODED_PASSWORD, Severity.CRITICAL, "Hardcoded Password",
                        "Hardcoded password assignment detected.", "Move secrets to environment variables.", allLanguages()),
                new Rule(HARDCODED_API, Severity.CRITICAL, "Hardcoded API Key",
                        "Hardcoded API key or secret detected.", "Use a secure secrets manager or env var.", allLanguages()),
                new Rule(SQL_INJECTION, Severity.CRITICAL, "SQL Injection Risk",
                        "SQL string concatenation detected.", "Use parameterized queries or prepared statements.", allLanguages()),
                new Rule(COMMAND_INJECTION, Severity.CRITICAL, "Command Injection",
                        "Runtime exec usage detected.", "Avoid executing commands with user input.", setOf("JAVA")),
                new Rule(HARDCODED_IP, Severity.HIGH, "Hardcoded IP",
                        "Hardcoded IP address detected.", "Move IP configuration to environment variables.", allLanguages()),
                new Rule(INSECURE_HTTP, Severity.HIGH, "Insecure HTTP",
                        "HTTP URL detected.", "Use HTTPS for all network calls.", allLanguages()),
                new Rule(MD5_USAGE, Severity.HIGH, "Weak Hash Algorithm",
                        "MD5 usage detected.", "Use SHA-256 or a stronger hash function.", allLanguages()),
                new Rule(EVAL_USAGE, Severity.HIGH, "Eval Usage",
                        "Eval usage detected.", "Avoid eval and use safer parsing alternatives.", setOf("JAVASCRIPT")),
                new Rule(PRINT_STACK_TRACE, Severity.HIGH, "printStackTrace",
                        "printStackTrace usage detected.", "Use structured logging instead.", setOf("JAVA")),
                new Rule(TODO_FIXME, Severity.MEDIUM, "TODO/FIXME",
                        "TODO or FIXME comment detected.", "Track this task in a ticket and resolve it.", allLanguages()),
                new Rule(EMPTY_CATCH, Severity.MEDIUM, "Empty Catch Block",
                        "Empty catch block detected.", "Log the error or handle the exception properly.", setOf("JAVA")),
                new Rule(DEPRECATED, Severity.MEDIUM, "Deprecated API",
                        "Deprecated API usage detected.", "Migrate to a supported alternative.", setOf("JAVA")),
                new Rule(CONSOLE_LOG, Severity.MEDIUM, "Console Log",
                        "console.log usage detected.", "Remove debug logs before release.", setOf("JAVASCRIPT"))
        );
    }

    private String detectLanguage(String fileName) {
        if (fileName == null) {
            throw new ApiException("File name is missing.", HttpStatus.BAD_REQUEST);
        }
        String lower = fileName.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".java")) {
            return "JAVA";
        }
        if (lower.endsWith(".js")) {
            return "JAVASCRIPT";
        }
        if (lower.endsWith(".py")) {
            return "PYTHON";
        }
        throw new ApiException("Unsupported file type.", HttpStatus.BAD_REQUEST);
    }

    private boolean isPublicMethod(String line) {
        String trimmed = line.trim();
        if (trimmed.startsWith("public ") && trimmed.contains("(") && trimmed.contains(")")
                && !trimmed.contains(" class ") && !trimmed.contains(" interface ") && !trimmed.contains(" enum ")) {
            return Pattern.compile("public\\s+(?!class|interface|enum)[^;=]+\\(.*\\)").matcher(trimmed).find();
        }
        return false;
    }

    private Vulnerability buildVulnerability(Severity severity, String type, int lineNumber, String lineContent,
                                             String description, String suggestion) {
        return Vulnerability.builder()
                .severity(severity)
                .type(type)
                .lineNumber(lineNumber)
                .lineContent(lineContent)
                .description(description)
                .suggestion(suggestion)
                .build();
    }

    private SeverityCounts countBySeverity(List<Vulnerability> vulnerabilities) {
        SeverityCounts counts = new SeverityCounts();
        for (Vulnerability vulnerability : vulnerabilities) {
            switch (vulnerability.getSeverity()) {
                case CRITICAL -> counts.critical++;
                case HIGH -> counts.high++;
                case MEDIUM -> counts.medium++;
                case LOW -> counts.low++;
                default -> {
                }
            }
        }
        return counts;
    }

    private int calculateQualityScore(SeverityCounts counts) {
        int score = 100;
        score -= counts.critical * 15;
        score -= counts.high * 8;
        score -= counts.medium * 3;
        score -= counts.low * 1;
        return Math.max(0, score);
    }

    private ScanDetailResponse mapToDetailResponse(Scan scan) {
        List<VulnerabilityResponse> items = new ArrayList<>();
        for (Vulnerability vulnerability : scan.getVulnerabilities()) {
            items.add(VulnerabilityResponse.builder()
                    .id(vulnerability.getId())
                    .type(vulnerability.getType())
                    .severity(vulnerability.getSeverity())
                    .lineNumber(vulnerability.getLineNumber())
                    .lineContent(vulnerability.getLineContent())
                    .description(vulnerability.getDescription())
                    .suggestion(vulnerability.getSuggestion())
                    .build());
        }

        return ScanDetailResponse.builder()
                .id(scan.getId())
                .fileName(scan.getFileName())
                .language(scan.getLanguage())
                .qualityScore(scan.getQualityScore())
                .totalVulnerabilities(scan.getTotalVulnerabilities())
                .criticalCount(scan.getCriticalCount())
                .highCount(scan.getHighCount())
                .mediumCount(scan.getMediumCount())
                .lowCount(scan.getLowCount())
                .scannedAt(scan.getScannedAt())
                .vulnerabilities(items)
                .build();
    }

    private Set<String> allLanguages() {
        return new HashSet<>(Arrays.asList("JAVA", "JAVASCRIPT", "PYTHON"));
    }

    private Set<String> setOf(String value) {
        return new HashSet<>(List.of(value));
    }

    private static class Rule {
        private final Pattern pattern;
        private final Severity severity;
        private final String type;
        private final String description;
        private final String suggestion;
        private final Set<String> languages;

        private Rule(Pattern pattern, Severity severity, String type, String description, String suggestion,
                     Set<String> languages) {
            this.pattern = pattern;
            this.severity = severity;
            this.type = type;
            this.description = description;
            this.suggestion = suggestion;
            this.languages = languages;
        }

        private boolean appliesTo(String language) {
            return languages.contains(language);
        }
    }

    private static class SeverityCounts {
        private int critical;
        private int high;
        private int medium;
        private int low;
    }
}
