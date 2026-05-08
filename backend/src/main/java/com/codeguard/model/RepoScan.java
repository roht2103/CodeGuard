package com.codeguard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "repo_scans")
public class RepoScan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false)
    private String repo;

    @Column
    private String branch;

    @Column(nullable = false)
    private Integer analyzedCommits;

    @Column(name = "avg_score")
    @Builder.Default
    private Integer avgScore = 0;

    @Column(nullable = false)
    private LocalDateTime scannedAt;

    @Builder.Default
    @OneToMany(mappedBy = "repoScan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepoCommit> commits = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (scannedAt == null) {
            scannedAt = LocalDateTime.now();
        }
    }
}
