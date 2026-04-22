# 현재 설계안 기준 Spring 코드 작성안

아래 코드는 **현재 정리된 설계안**을 기준으로 바로 붙여넣어 개발을 시작할 수 있게 구성한 초안이다.

범위는 다음까지 포함한다.

- Entity
- Enum
- DTO
- Repository
- 조회 서비스
- DTO 매퍼
- 스케줄러 / 동기화 서비스 뼈대
- 컨트롤러 예시

아직 포함하지 않은 것은 다음이다.

- 외부 API 실제 호출 구현
- 좌표 거리 계산 유틸의 정교한 구현
- QueryDSL / 공간 인덱스 최적화
- 관리자 강제 동기화 API
- 예외 처리 상세 코드

---

# 1. 추천 패키지 구조

```text
com.example.capstone.domain.crosswalk
├── controller
│   └── CrosswalkController.java
├── dto
│   └── response
│       ├── AcousticSignalDeviceDto.java
│       ├── AcousticSignalDto.java
│       ├── AcousticSignalSummaryDto.java
│       ├── CrosswalkDetailResponse.java
│       ├── CrosswalkGuidanceSummaryDto.java
│       ├── CrosswalkInfoDto.java
│       ├── CrosswalkInfoSummaryDto.java
│       ├── CrosswalkLocationDto.java
│       ├── CrosswalkNearbyResponse.java
│       └── CrosswalkSourceDto.java
├── entity
│   ├── AcousticSignal.java
│   ├── Crosswalk.java
│   └── CrosswalkAcousticSignalMapping.java
├── enums
│   ├── AcousticSignalAggregateStatus.java
│   ├── DataSourceType.java
│   └── MatchMethod.java
├── mapper
│   └── CrosswalkResponseMapper.java
├── repository
│   ├── AcousticSignalRepository.java
│   ├── CrosswalkAcousticSignalMappingRepository.java
│   └── CrosswalkRepository.java
├── scheduler
│   └── CrosswalkDataSyncScheduler.java
├── service
│   ├── CrosswalkDataSyncService.java
│   ├── CrosswalkQueryService.java
│   └── sync
│       ├── CrosswalkAcousticSignalMatchService.java
│       ├── CrosswalkMergeService.java
│       ├── NationalCrosswalkCollector.java
│       ├── SeoulAcousticSignalCollector.java
│       └── SeoulCrosswalkCollector.java
````

---

# 2. Enum

## 2-1. `DataSourceType.java`

```java id="9lz1ls"
package com.example.capstone.domain.crosswalk.enums;

public enum DataSourceType {
    SEOUL_TB_TRAFFIC_CRSNG,        // 서울 대로변 횡단보도 위치정보
    NATIONAL_STANDARD_CROSSWALK,  // 전국 횡단보도 표준데이터
    SEOUL_ACOUSTIC_SIGNAL,        // 서울시 음향신호기
    NATIONAL_STANDARD_TRAFFIC_LIGHT
}
```

---

## 2-2. `MatchMethod.java`

```java id="4jyy1v"
package com.example.capstone.domain.crosswalk.enums;

public enum MatchMethod {
    COORDINATE_NEAREST,
    COORDINATE_DIRECTION,
    SOURCE_FLAG,
    MANUAL_MAPPING,
    UNKNOWN
}
```

---

## 2-3. `AcousticSignalAggregateStatus.java`

```java id="c4gcd8"
package com.example.capstone.domain.crosswalk.enums;

public enum AcousticSignalAggregateStatus {
    NORMAL,
    PARTIAL,
    NONE,
    UNKNOWN
}
```

---

# 3. Entity

## 3-1. `Crosswalk.java`

```java id="9b2upf"
package com.example.capstone.domain.crosswalk.entity;

import com.example.capstone.domain.crosswalk.enums.DataSourceType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crosswalk")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Crosswalk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String crosswalkCode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String roadAddress;
    private String sido;
    private String sigungu;
    private String emd;

    private String kind;

    private Double width;
    private Double length;

    private Boolean pedestrianSignal;
    private Boolean actuatedSignal;

    private Integer greenTime;
    private Integer redTime;

    private Boolean brailleBlock;
    private Boolean curbLowered;
    private Boolean trafficIsland;
    private Boolean safetyLighting;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataSourceType baseSource;

    @Column(nullable = false)
    private LocalDate referenceDate;

    @Column(nullable = false)
    private LocalDateTime lastSyncedAt;

    @Builder
    public Crosswalk(
            String crosswalkCode,
            Double latitude,
            Double longitude,
            String roadAddress,
            String sido,
            String sigungu,
            String emd,
            String kind,
            Double width,
            Double length,
            Boolean pedestrianSignal,
            Boolean actuatedSignal,
            Integer greenTime,
            Integer redTime,
            Boolean brailleBlock,
            Boolean curbLowered,
            Boolean trafficIsland,
            Boolean safetyLighting,
            DataSourceType baseSource,
            LocalDate referenceDate,
            LocalDateTime lastSyncedAt
    ) {
        this.crosswalkCode = crosswalkCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.roadAddress = roadAddress;
        this.sido = sido;
        this.sigungu = sigungu;
        this.emd = emd;
        this.kind = kind;
        this.width = width;
        this.length = length;
        this.pedestrianSignal = pedestrianSignal;
        this.actuatedSignal = actuatedSignal;
        this.greenTime = greenTime;
        this.redTime = redTime;
        this.brailleBlock = brailleBlock;
        this.curbLowered = curbLowered;
        this.trafficIsland = trafficIsland;
        this.safetyLighting = safetyLighting;
        this.baseSource = baseSource;
        this.referenceDate = referenceDate;
        this.lastSyncedAt = lastSyncedAt;
    }

    public void updateFrom(
            Double latitude,
            Double longitude,
            String roadAddress,
            String sido,
            String sigungu,
            String emd,
            String kind,
            Double width,
            Double length,
            Boolean pedestrianSignal,
            Boolean actuatedSignal,
            Integer greenTime,
            Integer redTime,
            Boolean brailleBlock,
            Boolean curbLowered,
            Boolean trafficIsland,
            Boolean safetyLighting,
            DataSourceType baseSource,
            LocalDate referenceDate,
            LocalDateTime lastSyncedAt
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.roadAddress = roadAddress;
        this.sido = sido;
        this.sigungu = sigungu;
        this.emd = emd;
        this.kind = kind;
        this.width = width;
        this.length = length;
        this.pedestrianSignal = pedestrianSignal;
        this.actuatedSignal = actuatedSignal;
        this.greenTime = greenTime;
        this.redTime = redTime;
        this.brailleBlock = brailleBlock;
        this.curbLowered = curbLowered;
        this.trafficIsland = trafficIsland;
        this.safetyLighting = safetyLighting;
        this.baseSource = baseSource;
        this.referenceDate = referenceDate;
        this.lastSyncedAt = lastSyncedAt;
    }
}
```

---

## 3-2. `AcousticSignal.java`

```java id="f2w1ez"
package com.example.capstone.domain.crosswalk.entity;

import com.example.capstone.domain.crosswalk.enums.DataSourceType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "acoustic_signal")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AcousticSignal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String acousticSignalCode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String direction;
    private String status;
    private String positionInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataSourceType source;

    @Column(nullable = false)
    private LocalDate referenceDate;

    @Column(nullable = false)
    private LocalDateTime lastSyncedAt;

    @Builder
    public AcousticSignal(
            String acousticSignalCode,
            Double latitude,
            Double longitude,
            String direction,
            String status,
            String positionInfo,
            DataSourceType source,
            LocalDate referenceDate,
            LocalDateTime lastSyncedAt
    ) {
        this.acousticSignalCode = acousticSignalCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.direction = direction;
        this.status = status;
        this.positionInfo = positionInfo;
        this.source = source;
        this.referenceDate = referenceDate;
        this.lastSyncedAt = lastSyncedAt;
    }

    public void updateFrom(
            Double latitude,
            Double longitude,
            String direction,
            String status,
            String positionInfo,
            DataSourceType source,
            LocalDate referenceDate,
            LocalDateTime lastSyncedAt
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.direction = direction;
        this.status = status;
        this.positionInfo = positionInfo;
        this.source = source;
        this.referenceDate = referenceDate;
        this.lastSyncedAt = lastSyncedAt;
    }
}
```

---

## 3-3. `CrosswalkAcousticSignalMapping.java`

```java id="ifii85"
package com.example.capstone.domain.crosswalk.entity;

import com.example.capstone.domain.crosswalk.enums.MatchMethod;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "crosswalk_acoustic_signal_mapping",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_crosswalk_signal_mapping",
                        columnNames = {"crosswalk_id", "acoustic_signal_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CrosswalkAcousticSignalMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crosswalk_id")
    private Crosswalk crosswalk;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "acoustic_signal_id")
    private AcousticSignal acousticSignal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchMethod matchMethod;

    @Column(nullable = false)
    private Double distanceMeters;

    @Column(nullable = false)
    private Double confidence;

    @Column(nullable = false)
    private LocalDateTime matchedAt;

    @Builder
    public CrosswalkAcousticSignalMapping(
            Crosswalk crosswalk,
            AcousticSignal acousticSignal,
            MatchMethod matchMethod,
            Double distanceMeters,
            Double confidence,
            LocalDateTime matchedAt
    ) {
        this.crosswalk = crosswalk;
        this.acousticSignal = acousticSignal;
        this.matchMethod = matchMethod;
        this.distanceMeters = distanceMeters;
        this.confidence = confidence;
        this.matchedAt = matchedAt;
    }

    public void updateMatch(MatchMethod matchMethod, Double distanceMeters, Double confidence, LocalDateTime matchedAt) {
        this.matchMethod = matchMethod;
        this.distanceMeters = distanceMeters;
        this.confidence = confidence;
        this.matchedAt = matchedAt;
    }
}
```

---

# 4. DTO

## 4-1. `CrosswalkLocationDto.java`

```java id="dyk3og"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkLocationDto(
        Double latitude,
        Double longitude,
        String roadAddress,
        String sido,
        String sigungu,
        String emd
) {
}
```

---

## 4-2. `CrosswalkInfoSummaryDto.java`

```java id="zzhy2z"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkInfoSummaryDto(
        Boolean pedestrianSignal,
        Boolean brailleBlock,
        Boolean curbLowered
) {
}
```

---

## 4-3. `CrosswalkInfoDto.java`

```java id="nh7npi"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkInfoDto(
        String kind,
        Double width,
        Double length,
        Boolean pedestrianSignal,
        Boolean actuatedSignal,
        Integer greenTime,
        Integer redTime,
        Boolean brailleBlock,
        Boolean curbLowered,
        Boolean trafficIsland,
        Boolean safetyLighting
) {
}
```

---

## 4-4. `AcousticSignalSummaryDto.java`

```java id="81c3x9"
package com.example.capstone.domain.crosswalk.dto.response;

public record AcousticSignalSummaryDto(
        Boolean installed
) {
}
```

---

## 4-5. `AcousticSignalDeviceDto.java`

```java id="7m3dnd"
package com.example.capstone.domain.crosswalk.dto.response;

public record AcousticSignalDeviceDto(
        String deviceId,
        String direction,
        String status
) {
}
```

---

## 4-6. `AcousticSignalDto.java`

```java id="moeez1"
package com.example.capstone.domain.crosswalk.dto.response;

import java.util.List;

public record AcousticSignalDto(
        Boolean installed,
        Integer count,
        String status,
        List<AcousticSignalDeviceDto> devices
) {
}
```

---

## 4-7. `CrosswalkGuidanceSummaryDto.java`

```java id="veozb2"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkGuidanceSummaryDto(
        String summary
) {
}
```

---

## 4-8. `CrosswalkSourceDto.java`

```java id="2fwvgj"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkSourceDto(
        String crosswalkBase,
        String crosswalkDetail,
        String acousticBase
) {
}
```

---

## 4-9. `CrosswalkNearbyResponse.java`

```java id="6gvagk"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkNearbyResponse(
        String crosswalkId,
        Double distanceMeters,
        CrosswalkLocationDto location,
        CrosswalkInfoSummaryDto crosswalk,
        AcousticSignalSummaryDto acousticSignal,
        CrosswalkGuidanceSummaryDto guidance
) {
}
```

---

## 4-10. `CrosswalkDetailResponse.java`

```java id="6t3m8q"
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkDetailResponse(
        String crosswalkId,
        CrosswalkLocationDto location,
        CrosswalkInfoDto crosswalk,
        AcousticSignalDto acousticSignal,
        CrosswalkGuidanceSummaryDto guidance,
        CrosswalkSourceDto source
) {
}
```

---

# 5. Repository

## 5-1. `CrosswalkRepository.java`

```java id="t8v2se"
package com.example.capstone.domain.crosswalk.repository;

import com.example.capstone.domain.crosswalk.entity.Crosswalk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CrosswalkRepository extends JpaRepository<Crosswalk, Long> {

    Optional<Crosswalk> findByCrosswalkCode(String crosswalkCode);

    List<Crosswalk> findBySigungu(String sigungu);
}
```

---

## 5-2. `AcousticSignalRepository.java`

```java id="djg9l0"
package com.example.capstone.domain.crosswalk.repository;

import com.example.capstone.domain.crosswalk.entity.AcousticSignal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcousticSignalRepository extends JpaRepository<AcousticSignal, Long> {

    Optional<AcousticSignal> findByAcousticSignalCode(String acousticSignalCode);
}
```

---

## 5-3. `CrosswalkAcousticSignalMappingRepository.java`

```java id="pg7xgo"
package com.example.capstone.domain.crosswalk.repository;

import com.example.capstone.domain.crosswalk.entity.Crosswalk;
import com.example.capstone.domain.crosswalk.entity.CrosswalkAcousticSignalMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrosswalkAcousticSignalMappingRepository extends JpaRepository<CrosswalkAcousticSignalMapping, Long> {

    List<CrosswalkAcousticSignalMapping> findByCrosswalk(Crosswalk crosswalk);
}
```

---

# 6. 응답 매퍼

## `CrosswalkResponseMapper.java`

```java id="44xzz7"
package com.example.capstone.domain.crosswalk.mapper;

import com.example.capstone.domain.crosswalk.dto.response.*;
import com.example.capstone.domain.crosswalk.entity.AcousticSignal;
import com.example.capstone.domain.crosswalk.entity.Crosswalk;
import com.example.capstone.domain.crosswalk.entity.CrosswalkAcousticSignalMapping;
import com.example.capstone.domain.crosswalk.enums.AcousticSignalAggregateStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CrosswalkResponseMapper {

    public CrosswalkNearbyResponse toNearbyResponse(Crosswalk crosswalk, double distanceMeters, List<CrosswalkAcousticSignalMapping> mappings) {
        boolean installed = !mappings.isEmpty();

        return new CrosswalkNearbyResponse(
                crosswalk.getCrosswalkCode(),
                distanceMeters,
                toLocationDto(crosswalk),
                new CrosswalkInfoSummaryDto(
                        crosswalk.getPedestrianSignal(),
                        crosswalk.getBrailleBlock(),
                        crosswalk.getCurbLowered()
                ),
                new AcousticSignalSummaryDto(installed),
                new CrosswalkGuidanceSummaryDto(buildGuidanceSummary(crosswalk, installed))
        );
    }

    public CrosswalkDetailResponse toDetailResponse(Crosswalk crosswalk, List<CrosswalkAcousticSignalMapping> mappings) {
        List<AcousticSignalDeviceDto> devices = mappings.stream()
                .map(CrosswalkAcousticSignalMapping::getAcousticSignal)
                .map(this::toAcousticSignalDeviceDto)
                .toList();

        boolean installed = !devices.isEmpty();

        return new CrosswalkDetailResponse(
                crosswalk.getCrosswalkCode(),
                toLocationDto(crosswalk),
                new CrosswalkInfoDto(
                        crosswalk.getKind(),
                        crosswalk.getWidth(),
                        crosswalk.getLength(),
                        crosswalk.getPedestrianSignal(),
                        crosswalk.getActuatedSignal(),
                        crosswalk.getGreenTime(),
                        crosswalk.getRedTime(),
                        crosswalk.getBrailleBlock(),
                        crosswalk.getCurbLowered(),
                        crosswalk.getTrafficIsland(),
                        crosswalk.getSafetyLighting()
                ),
                new AcousticSignalDto(
                        installed,
                        devices.size(),
                        calculateAggregateStatus(installed, devices.size()).name(),
                        devices
                ),
                new CrosswalkGuidanceSummaryDto(buildGuidanceSummary(crosswalk, installed)),
                new CrosswalkSourceDto(
                        crosswalk.getBaseSource().name(),
                        "NATIONAL_STANDARD_CROSSWALK",
                        installed ? "SEOUL_ACOUSTIC_SIGNAL" : null
                )
        );
    }

    private CrosswalkLocationDto toLocationDto(Crosswalk crosswalk) {
        return new CrosswalkLocationDto(
                crosswalk.getLatitude(),
                crosswalk.getLongitude(),
                crosswalk.getRoadAddress(),
                crosswalk.getSido(),
                crosswalk.getSigungu(),
                crosswalk.getEmd()
        );
    }

    private AcousticSignalDeviceDto toAcousticSignalDeviceDto(AcousticSignal signal) {
        return new AcousticSignalDeviceDto(
                signal.getAcousticSignalCode(),
                signal.getDirection(),
                signal.getStatus()
        );
    }

    private AcousticSignalAggregateStatus calculateAggregateStatus(boolean installed, int count) {
        if (!installed) {
            return AcousticSignalAggregateStatus.NONE;
        }
        if (count >= 2) {
            return AcousticSignalAggregateStatus.NORMAL;
        }
        if (count == 1) {
            return AcousticSignalAggregateStatus.PARTIAL;
        }
        return AcousticSignalAggregateStatus.UNKNOWN;
    }

    private String buildGuidanceSummary(Crosswalk crosswalk, boolean acousticInstalled) {
        if (Boolean.TRUE.equals(acousticInstalled) && Boolean.TRUE.equals(crosswalk.getBrailleBlock())) {
            return "음향신호기와 점자블록이 있는 횡단보도";
        }
        if (Boolean.TRUE.equals(acousticInstalled)) {
            return "음향신호기가 있는 횡단보도";
        }
        if (Boolean.TRUE.equals(crosswalk.getPedestrianSignal())) {
            return "보행자 신호는 있으나 음향신호기 정보는 확인되지 않음";
        }
        return "횡단보도 정보가 확인됨";
    }
}
```

---

# 7. 조회 서비스

## `CrosswalkQueryService.java`

```java id="8e55u7"
package com.example.capstone.domain.crosswalk.service;

import com.example.capstone.domain.crosswalk.dto.response.CrosswalkDetailResponse;
import com.example.capstone.domain.crosswalk.dto.response.CrosswalkNearbyResponse;
import com.example.capstone.domain.crosswalk.entity.Crosswalk;
import com.example.capstone.domain.crosswalk.entity.CrosswalkAcousticSignalMapping;
import com.example.capstone.domain.crosswalk.mapper.CrosswalkResponseMapper;
import com.example.capstone.domain.crosswalk.repository.CrosswalkAcousticSignalMappingRepository;
import com.example.capstone.domain.crosswalk.repository.CrosswalkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrosswalkQueryService {

    private final CrosswalkRepository crosswalkRepository;
    private final CrosswalkAcousticSignalMappingRepository mappingRepository;
    private final CrosswalkResponseMapper mapper;

    public List<CrosswalkNearbyResponse> getNearbyCrosswalks(double latitude, double longitude, double radiusMeters) {
        return crosswalkRepository.findAll().stream()
                .map(crosswalk -> {
                    double distance = calculateDistanceMeters(latitude, longitude, crosswalk.getLatitude(), crosswalk.getLongitude());
                    return new CrosswalkDistance(crosswalk, distance);
                })
                .filter(it -> it.distanceMeters() <= radiusMeters)
                .sorted(Comparator.comparingDouble(CrosswalkDistance::distanceMeters))
                .map(it -> {
                    List<CrosswalkAcousticSignalMapping> mappings = mappingRepository.findByCrosswalk(it.crosswalk());
                    return mapper.toNearbyResponse(it.crosswalk(), it.distanceMeters(), mappings);
                })
                .toList();
    }

    public CrosswalkDetailResponse getCrosswalkDetail(String crosswalkCode) {
        Crosswalk crosswalk = crosswalkRepository.findByCrosswalkCode(crosswalkCode)
                .orElseThrow(() -> new IllegalArgumentException("횡단보도를 찾을 수 없습니다. code=" + crosswalkCode));

        List<CrosswalkAcousticSignalMapping> mappings = mappingRepository.findByCrosswalk(crosswalk);

        return mapper.toDetailResponse(crosswalk, mappings);
    }

    private double calculateDistanceMeters(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371000.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    private record CrosswalkDistance(Crosswalk crosswalk, double distanceMeters) {
    }
}
```

---

# 8. 컨트롤러

## `CrosswalkController.java`

```java id="f6guk5"
package com.example.capstone.domain.crosswalk.controller;

import com.example.capstone.domain.crosswalk.dto.response.CrosswalkDetailResponse;
import com.example.capstone.domain.crosswalk.dto.response.CrosswalkNearbyResponse;
import com.example.capstone.domain.crosswalk.service.CrosswalkQueryService;
import com.example.capstone.global.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crosswalks")
@RequiredArgsConstructor
public class CrosswalkController {

    private final CrosswalkQueryService crosswalkQueryService;

    @GetMapping("/nearby")
    public ApiResponse<List<CrosswalkNearbyResponse>> getNearbyCrosswalks(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "50") double radiusMeters
    ) {
        return ApiResponse.ok(
                crosswalkQueryService.getNearbyCrosswalks(latitude, longitude, radiusMeters)
        );
    }

    @GetMapping("/{crosswalkCode}")
    public ApiResponse<CrosswalkDetailResponse> getCrosswalkDetail(
            @PathVariable String crosswalkCode
    ) {
        return ApiResponse.ok(
                crosswalkQueryService.getCrosswalkDetail(crosswalkCode)
        );
    }
}
```

---

# 9. 동기화 스케줄러 / 서비스 뼈대

## `CrosswalkDataSyncScheduler.java`

```java id="wlqqsb"
package com.example.capstone.domain.crosswalk.scheduler;

import com.example.capstone.domain.crosswalk.service.CrosswalkDataSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CrosswalkDataSyncScheduler {

    private final CrosswalkDataSyncService crosswalkDataSyncService;

    @Scheduled(cron = "0 0 3 * * *")
    public void syncDaily() {
        crosswalkDataSyncService.syncAll();
    }
}
```

---

## `CrosswalkDataSyncService.java`

```java id="mwyq6z"
package com.example.capstone.domain.crosswalk.service;

import com.example.capstone.domain.crosswalk.service.sync.CrosswalkAcousticSignalMatchService;
import com.example.capstone.domain.crosswalk.service.sync.CrosswalkMergeService;
import com.example.capstone.domain.crosswalk.service.sync.NationalCrosswalkCollector;
import com.example.capstone.domain.crosswalk.service.sync.SeoulAcousticSignalCollector;
import com.example.capstone.domain.crosswalk.service.sync.SeoulCrosswalkCollector;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CrosswalkDataSyncService {

    private final SeoulCrosswalkCollector seoulCrosswalkCollector;
    private final NationalCrosswalkCollector nationalCrosswalkCollector;
    private final SeoulAcousticSignalCollector seoulAcousticSignalCollector;
    private final CrosswalkMergeService crosswalkMergeService;
    private final CrosswalkAcousticSignalMatchService matchService;

    public void syncAll() {
        seoulCrosswalkCollector.collectAndSave();
        nationalCrosswalkCollector.collectAndSave();
        seoulAcousticSignalCollector.collectAndSave();

        crosswalkMergeService.mergeCrosswalkData();
        matchService.matchCrosswalkAndSignals();
    }
}
```

---

# 10. 동기화 관련 서비스 인터페이스 뼈대

## `SeoulCrosswalkCollector.java`

```java id="1rxyvi"
package com.example.capstone.domain.crosswalk.service.sync;

public interface SeoulCrosswalkCollector {
    void collectAndSave();
}
```

## `NationalCrosswalkCollector.java`

```java id="9m4vjs"
package com.example.capstone.domain.crosswalk.service.sync;

public interface NationalCrosswalkCollector {
    void collectAndSave();
}
```

## `SeoulAcousticSignalCollector.java`

```java id="fkde5s"
package com.example.capstone.domain.crosswalk.service.sync;

public interface SeoulAcousticSignalCollector {
    void collectAndSave();
}
```

## `CrosswalkMergeService.java`

```java id="7uu6wm"
package com.example.capstone.domain.crosswalk.service.sync;

public interface CrosswalkMergeService {
    void mergeCrosswalkData();
}
```

## `CrosswalkAcousticSignalMatchService.java`

```java id="w7yxmm"
package com.example.capstone.domain.crosswalk.service.sync;

public interface CrosswalkAcousticSignalMatchService {
    void matchCrosswalkAndSignals();
}
```

---

# 11. 구현 시 바로 손봐야 하는 부분

## 1) `findAll()` 기반 nearby 조회는 임시 구현

현재 `CrosswalkQueryService`는 단순 예시라서 전체 조회 후 거리 계산한다.
데이터가 많아지면 비효율적이므로 나중에는 아래 중 하나로 바꾸는 게 좋다.

* 위경도 bounding box 조건 검색
* QueryDSL
* MySQL 공간 인덱스
* PostGIS 같은 공간 쿼리

## 2) `CrosswalkSourceDto`

현재는 `crosswalkDetail`을 문자열 `"NATIONAL_STANDARD_CROSSWALK"`로 넣어두었는데,
실제로는 저장 구조에 맞춰 더 정확히 계산하는 편이 좋다.

## 3) `AcousticSignalDto.status`

지금은 단순히 매칭 개수 기준으로 계산했다.
나중에는 거리, 방향 일치, 원천 플래그 여부 등을 포함해서 더 정교하게 바꿀 수 있다.

## 4) 내부 판단값은 아직 응답 DTO에서 제외

현재 설계 기준으로는 아래는 응답에서 뺐다.

* `blindPedestrianFriendly`
* `CrosswalkMatchDto`

이 값들은 나중에 관리자 응답이나 디버그 응답으로 따로 분리하는 게 맞다.

---

# 12. 다음 단계 추천

이제 바로 이어서 작업하기 좋은 순서는 아래다.

1. Entity / DTO / Repository 먼저 생성
2. `CrosswalkQueryService` + `CrosswalkController` 연결
3. 더미 데이터 넣고 nearby / detail 응답 확인
4. 수집기 구현
5. 병합 서비스 구현
6. 매칭 서비스 구현

원하면 다음 답변에서 이어서
**외부 API 수집기 구현용 raw DTO + WebClient 코드 뼈대**까지 바로 작성해드리겠습니다.