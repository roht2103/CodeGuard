package com.codeguard.repository;

import com.codeguard.model.RepoScan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoScanRepository extends JpaRepository<RepoScan, Long> {
    List<RepoScan> findByUserIdOrderByScannedAtDesc(Long userId);
}
