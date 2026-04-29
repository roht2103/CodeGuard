package com.codeguard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QualityTrendPoint {
    private String date;
    private Integer score;
}
