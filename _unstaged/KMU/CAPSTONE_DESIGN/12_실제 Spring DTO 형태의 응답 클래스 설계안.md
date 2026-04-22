# 실제 Spring DTO 형태의 응답 클래스 설계안

횡단보도와 음향신호기 정보를 통합할 때는  
**목록 조회용 DTO**와 **상세 조회용 DTO**를 분리하는 것이 좋다.

이유는 다음과 같다.

- 목록 조회에서는 가벼운 정보만 필요하다.
- 상세 조회에서는 음향신호기 장치 목록, 신뢰도, 데이터 출처까지 필요하다.
- 모바일 앱에서 불필요한 필드 전송을 줄일 수 있다.

아래는 **Spring Boot 기준 DTO 설계안**이다.  
형태는 `record` 기준으로 제안하되, 현재 프로젝트 스타일상 `@Builder`를 쓰고 있다면 일반 클래스 형태로 바꿔도 된다.

---

# 1. 추천 패키지 구조

```text
com.example.capstone.domain.crosswalk.dto.response
├── CrosswalkNearbyResponse.java
├── CrosswalkDetailResponse.java
├── CrosswalkLocationDto.java
├── CrosswalkInfoDto.java
├── AcousticSignalDto.java
├── AcousticSignalDeviceDto.java
├── CrosswalkGuidanceDto.java
├── CrosswalkSourceDto.java
└── CrosswalkMatchDto.java
````

---

# 2. 목록 조회 응답 DTO

## 2-1. `CrosswalkNearbyResponse`

주변 횡단보도 목록 조회용이다.

```java
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

## 2-2. `CrosswalkLocationDto`

위치 공통 DTO다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkLocationDto(
        Double latitude,
        Double longitude,
        String address,
        String sido,
        String sigungu,
        String emd
) {
}
```

목록 조회에서는 `address`, `emd`를 생략해도 된다.
그래도 공통 DTO로 재사용하려면 nullable 허용으로 두는 편이 낫다.

---

## 2-3. `CrosswalkInfoSummaryDto`

목록 조회에서는 핵심 보행 정보만 보여주는 것이 좋다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkInfoSummaryDto(
        Boolean pedestrianSignal,
        Boolean brailleBlock,
        Boolean curbLowered
) {
}
```

---

## 2-4. `AcousticSignalSummaryDto`

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record AcousticSignalSummaryDto(
        Boolean installed
) {
}
```

---

## 2-5. `CrosswalkGuidanceSummaryDto`

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkGuidanceSummaryDto(
        String summary
) {
}
```

예시 문장:

* `음향신호기가 있는 횡단보도`
* `점자블록과 보도턱낮춤이 확인된 횡단보도`
* `보행자 신호등은 있으나 음향신호기는 확인되지 않음`

---

# 3. 상세 조회 응답 DTO

## 3-1. `CrosswalkDetailResponse`

상세 조회의 최상위 응답 DTO다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkDetailResponse(
        String crosswalkId,
        CrosswalkLocationDto location,
        CrosswalkInfoDto crosswalk,
        AcousticSignalDto acousticSignal,
        CrosswalkGuidanceDto guidance,
        CrosswalkSourceDto source,
        CrosswalkMatchDto match
) {
}
```

---

## 3-2. `CrosswalkInfoDto`

횡단보도 상세 정보 DTO다.

```java
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
        Boolean lighting
) {
}
```

### 필드 의미

* `kind`: 일반횡단보도, 자전거겸용횡단보도 등
* `width`: 횡단보도 폭
* `length`: 횡단보도 연장
* `pedestrianSignal`: 보행자신호등 유무
* `actuatedSignal`: 보행자작동신호기 유무
* `greenTime`: 녹색신호시간
* `redTime`: 적색신호시간
* `brailleBlock`: 점자블록 유무
* `curbLowered`: 보도턱낮춤 유무
* `trafficIsland`: 교통섬 유무
* `lighting`: 집중조명시설 유무

---

## 3-3. `AcousticSignalDto`

음향신호기 통합 정보 DTO다.

```java
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

### 설계 포인트

* `installed`: 음향신호기 존재 여부
* `count`: 매칭된 음향신호기 수
* `status`: 전체 요약 상태

  * 예: `NORMAL`, `PARTIAL`, `UNKNOWN`
* `devices`: 실제 장치 목록

---

## 3-4. `AcousticSignalDeviceDto`

```java
package com.example.capstone.domain.crosswalk.dto.response;

import java.time.LocalDate;

public record AcousticSignalDeviceDto(
        String deviceId,
        String direction,
        String status,
        LocalDate installedAt,
        LocalDate replacedAt,
        String manufacturer,
        String kind
) {
}
```

### 필드 매핑 예시

* `deviceId` ← `SUD_SGN_MNG_NO1`
* `direction` ← `DRCT`
* `status` ← `STTS_CD`
* `installedAt` ← `INSTL_YMD`
* `replacedAt` ← `RPLC_YMD`
* `manufacturer` ← `MKR`
* `kind` ← `KND`

---

## 3-5. `CrosswalkGuidanceDto`

사용자 안내 문장 생성용 DTO다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkGuidanceDto(
        String priority,
        Boolean safeForBlindPedestrian,
        String summary
) {
}
```

### 예시 값

* `priority`

  * `HIGH`
  * `MEDIUM`
  * `LOW`

* `safeForBlindPedestrian`

  * `true`
  * `false`

* `summary`

  * `음향신호기와 점자블록이 있는 횡단보도`
  * `횡단보도는 있으나 음향신호기 정보는 확인되지 않음`

---

## 3-6. `CrosswalkSourceDto`

어떤 API에서 어떤 값을 가져왔는지 추적하기 위한 DTO다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkSourceDto(
        String crosswalkBase,
        String crosswalkDetail,
        String acousticBase
) {
}
```

### 예시 값

* `crosswalkBase`: `SEOUL_TB_TRAFFIC_CRSNG`
* `crosswalkDetail`: `NATIONAL_STANDARD_CROSSWALK`
* `acousticBase`: `SEOUL_ACOUSTIC_SIGNAL`

운영 중 디버깅할 때 꽤 유용하다.

---

## 3-7. `CrosswalkMatchDto`

횡단보도와 음향신호기 매칭 결과 DTO다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

public record CrosswalkMatchDto(
        String method,
        Double distanceMeters,
        Double confidence
) {
}
```

### 예시 값

* `method`: `COORDINATE_NEAREST`
* `distanceMeters`: `4.2`
* `confidence`: `0.91`

---

# 4. 실제 JSON 예시

## 4-1. 목록 조회 응답 예시

```json
{
  "success": true,
  "data": [
    {
      "crosswalkId": "CWK-SEOUL-001",
      "distanceMeters": 7.2,
      "location": {
        "latitude": 37.6101,
        "longitude": 126.9978,
        "address": null,
        "sido": "서울특별시",
        "sigungu": "성북구",
        "emd": null
      },
      "crosswalk": {
        "pedestrianSignal": true,
        "brailleBlock": true,
        "curbLowered": true
      },
      "acousticSignal": {
        "installed": true
      },
      "guidance": {
        "summary": "음향신호기가 있는 횡단보도"
      }
    }
  ]
}
```

---

## 4-2. 상세 조회 응답 예시

```json
{
  "success": true,
  "data": {
    "crosswalkId": "CWK-SEOUL-001",
    "location": {
      "latitude": 37.6101,
      "longitude": 126.9978,
      "address": "서울특별시 성북구 ...",
      "sido": "서울특별시",
      "sigungu": "성북구",
      "emd": "정릉동"
    },
    "crosswalk": {
      "kind": "일반횡단보도",
      "width": 4.0,
      "length": 18.0,
      "pedestrianSignal": true,
      "actuatedSignal": false,
      "greenTime": 25,
      "redTime": 40,
      "brailleBlock": true,
      "curbLowered": true,
      "trafficIsland": false,
      "lighting": false
    },
    "acousticSignal": {
      "installed": true,
      "count": 2,
      "status": "NORMAL",
      "devices": [
        {
          "deviceId": "AS-1001",
          "direction": "NORTH",
          "status": "NORMAL",
          "installedAt": "2024-03-01",
          "replacedAt": null,
          "manufacturer": "ABC",
          "kind": "시각장애인용 음향신호기"
        }
      ]
    },
    "guidance": {
      "priority": "HIGH",
      "safeForBlindPedestrian": true,
      "summary": "음향신호기와 점자블록이 있는 횡단보도"
    },
    "source": {
      "crosswalkBase": "SEOUL_TB_TRAFFIC_CRSNG",
      "crosswalkDetail": "NATIONAL_STANDARD_CROSSWALK",
      "acousticBase": "SEOUL_ACOUSTIC_SIGNAL"
    },
    "match": {
      "method": "COORDINATE_NEAREST",
      "distanceMeters": 3.8,
      "confidence": 0.94
    }
  }
}
```

---

# 5. enum으로 빼면 좋은 값들

문자열로 둬도 되지만, 아래 값들은 enum 분리를 추천한다.

## 5-1. `MatchMethod`

```java
package com.example.capstone.domain.crosswalk.enums;

public enum MatchMethod {
    COORDINATE_NEAREST,
    ADMINISTRATIVE_AREA,
    MANUAL_MAPPING,
    UNKNOWN
}
```

---

## 5-2. `GuidancePriority`

```java
package com.example.capstone.domain.crosswalk.enums;

public enum GuidancePriority {
    HIGH,
    MEDIUM,
    LOW
}
```

---

## 5-3. `FacilityStatus`

```java
package com.example.capstone.domain.crosswalk.enums;

public enum FacilityStatus {
    NORMAL,
    PARTIAL,
    INACTIVE,
    UNKNOWN
}
```

---

# 6. record 대신 class + Builder로 쓸 경우

현재 프로젝트에서 Lombok `@Builder` 스타일을 유지하고 싶으면 아래처럼 바꾸면 된다.

## 예시: `CrosswalkDetailResponse`

```java
package com.example.capstone.domain.crosswalk.dto.response;

import lombok.Builder;

@Builder
public record CrosswalkDetailResponse(
        String crosswalkId,
        CrosswalkLocationDto location,
        CrosswalkInfoDto crosswalk,
        AcousticSignalDto acousticSignal,
        CrosswalkGuidanceDto guidance,
        CrosswalkSourceDto source,
        CrosswalkMatchDto match
) {
}
```

혹은 진짜 클래스로 써도 된다.

```java
package com.example.capstone.domain.crosswalk.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CrosswalkDetailResponse {

    private final String crosswalkId;
    private final CrosswalkLocationDto location;
    private final CrosswalkInfoDto crosswalk;
    private final AcousticSignalDto acousticSignal;
    private final CrosswalkGuidanceDto guidance;
    private final CrosswalkSourceDto source;
    private final CrosswalkMatchDto match;
}
```

---

# 7. 서비스 계층에서 조립 예시

```java
CrosswalkDetailResponse response = new CrosswalkDetailResponse(
        crosswalkId,
        new CrosswalkLocationDto(latitude, longitude, address, sido, sigungu, emd),
        new CrosswalkInfoDto(
                kind,
                width,
                length,
                pedestrianSignal,
                actuatedSignal,
                greenTime,
                redTime,
                brailleBlock,
                curbLowered,
                trafficIsland,
                lighting
        ),
        new AcousticSignalDto(
                installed,
                devices.size(),
                overallStatus,
                devices
        ),
        new CrosswalkGuidanceDto(
                "HIGH",
                true,
                "음향신호기와 점자블록이 있는 횡단보도"
        ),
        new CrosswalkSourceDto(
                "SEOUL_TB_TRAFFIC_CRSNG",
                "NATIONAL_STANDARD_CROSSWALK",
                "SEOUL_ACOUSTIC_SIGNAL"
        ),
        new CrosswalkMatchDto(
                "COORDINATE_NEAREST",
                3.8,
                0.94
        )
);
```

---

# 8. 추가로 분리하면 좋은 내부 DTO

외부 응답 DTO 말고, 서비스 내부 조합용 DTO도 두면 좋다.

예를 들면:

* `CrosswalkRawData`
* `AcousticSignalRawData`
* `CrosswalkMatchResult`
* `CrosswalkIntegratedResult`

이렇게 두면

* 외부 API 응답 파싱
* 좌표 매칭
* 최종 응답 변환

을 단계별로 분리할 수 있다.

즉, 구조는 아래처럼 가면 좋다.

```text
외부 API 응답 DTO
→ 내부 통합 DTO
→ 최종 응답 DTO
```

---

# 9. 가장 추천하는 최종 설계

실무적으로는 아래 조합이 가장 안정적이다.

## 외부 응답

* `CrosswalkNearbyResponse`
* `CrosswalkDetailResponse`

## 공통 하위 DTO

* `CrosswalkLocationDto`
* `CrosswalkInfoDto`
* `AcousticSignalDto`
* `AcousticSignalDeviceDto`
* `CrosswalkGuidanceDto`
* `CrosswalkSourceDto`
* `CrosswalkMatchDto`

## 목록 전용 요약 DTO

* `CrosswalkInfoSummaryDto`
* `AcousticSignalSummaryDto`
* `CrosswalkGuidanceSummaryDto`

이렇게 분리하면

* 목록은 가볍게
* 상세는 풍부하게
* 프론트는 쓰기 쉽게
* 서비스는 확장 가능하게

가져갈 수 있다.

원하면 다음 단계로 이어서
**Entity 없이 서비스에서 DTO 조립하는 방식**, 또는 **Swagger 응답 예시까지 포함한 컨트롤러 설계안**으로 바로 정리해줄게.