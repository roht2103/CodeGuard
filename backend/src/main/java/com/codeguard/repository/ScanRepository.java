package com.codeguard.repository;

import com.codeguard.model.Scan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScanRepository extends JpaRepository<Scan, Long> {
    List<Scan> findByUserIdOrderByScannedAtDesc(Long userId);
    List<Scan> findTop10ByUserIdOrderByScannedAtDesc(Long userId);
    Optional<Scan> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = "vulnerabilities")
    Optional<Scan> findWithVulnerabilitiesByIdAndUserId(Long id, Long userId);
}
