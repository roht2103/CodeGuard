package com.codeguard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "repo_commits")
public class RepoCommit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_scan_id", nullable = false)
    private RepoScan repoScan;

    @Column(nullable = false)
    private String sha;

    @Column(length = 1000)
    private String message;

    @Column
    private String date;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer complexity;

    @Column(nullable = false)
    private Integer duplicationPercent;

    @Column(nullable = false)
    private Integer styleIssues;

    @Column(nullable = false)
    private Integer filesAnalyzed;
}
