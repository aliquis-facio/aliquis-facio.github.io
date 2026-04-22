# 횡단보도·음향신호기 중심 API 응답 통합 방향

횡단보도와 음향신호기 정보를 함께 쓰려면, 응답의 중심을 **시설물 관리 데이터**가 아니라 **사용자 보행 판단 데이터**로 바꾸는 것이 좋다.  
즉, “어느 기관이 관리하는 시설인가”보다 **지금 이 위치에 횡단보도가 있는지**, **보행자 신호 관련 시설이 있는지**, **음향신호기가 있는지**, **앱이 안내에 활용할 수 있는 상태인지**가 먼저 드러나야 한다.

서울 횡단보도 시설물 API는 관리번호, 상태, 설치일 등 **행정·시설 관리 정보**가 많아 실시간 안내 응답의 중심으로 쓰기에는 무겁다. 반면 서울 대로변 횡단보도 위치정보는 노드·링크 기반 공간정보라서 **횡단보도 위치 기준 데이터**로 쓰기 적합하다. 전국 횡단보도 표준데이터는 **보행자신호등 유무, 음향신호기 설치 여부, 점자블록, 보도턱낮춤**까지 함께 제공하므로 사용자 안내용 속성 보강에 유리하다. 서울 음향신호기 API는 **실제 음향신호기 개별 시설 좌표와 방향 정보**를 제공하므로, 횡단보도와 좌표 기반으로 연결해 쓸 수 있다. 

## 1. 통합의 기준 엔티티

통합 응답의 기준은 **횡단보도**로 두는 것이 좋다.

이유는 다음과 같다.

- 사용자는 보통 “근처에 어떤 횡단보도가 있는가”를 먼저 필요로 한다.
- 음향신호기는 단독 목적물이라기보다 **횡단보도에 부속된 보행 보조 시설**에 가깝다.
- 전국 횡단보도 표준데이터에도 이미 `sondSgngnrYn` 같은 음향신호기 여부 필드가 포함되어 있다.
- 서울 음향신호기 API는 음향신호기 자체 정보는 풍부하지만, **어느 횡단보도와 연결되는지 직접 주지는 않으므로** 횡단보도 기준으로 묶는 편이 자연스럽다.

따라서 응답 최상위는 다음처럼 잡는 것이 적절하다.

- `crosswalk`
  - 위치
  - 기본 속성
  - 보행자 신호 관련 속성
  - 음향신호기 통합 정보
  - 데이터 출처
  - 매칭 신뢰도

---

## 2. 추천 통합 구조

## 2-1. 최종 응답 개념

```json
{
  "crosswalkId": "CWK-SEOUL-...",
  "location": {
    "latitude": 37.000000,
    "longitude": 127.000000,
    "address": "서울특별시 ...",
    "sido": "서울특별시",
    "sigungu": "성북구",
    "emd": "..."
  },
  "crosswalk": {
    "kind": "일반횡단보도",
    "width": 4.0,
    "length": 18.0,
    "roadType": null,
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
    "devices": [
      {
        "deviceId": "AS-...",
        "direction": "북쪽",
        "status": "정상",
        "installedAt": "2023-04-01",
        "replacedAt": null,
        "manufacturer": "..."
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
    "distanceMeters": 4.2,
    "confidence": 0.91
  }
}
````

이 구조의 핵심은 `crosswalk`와 `acousticSignal`를 분리하되, 사용자 입장에서는 한 객체처럼 보이게 만드는 것이다.

---

## 3. 어떤 데이터를 무엇에 쓸지

## 3-1. 횡단보도 위치 기준 데이터

서울에서는 **서울시 대로변 횡단보도 위치정보 API**를 우선 기준으로 두는 것이 좋다.
이 API는 `NODE_WKT`, `LNKG_WKT`, `NODE_ID`, `LNKG_ID`, `LNKG_LEN` 등을 제공하므로 **지도 표시, 근처 횡단보도 탐색, 경로 주변 횡단보도 분석**의 기반으로 적합하다. 

서울 외 지역이나 서울 데이터 보강에는 **전국 횡단보도 표준데이터**를 쓴다.
이 데이터는 위도·경도 기반이고, `tfclghtYn`, `fnctngSgngnrYn`, `sondSgngnrYn`, `brllBlckYn`, `ftpthLowerYn` 등을 제공하므로 **보행자 안내에 필요한 속성 데이터**를 붙이기 좋다. 

## 3-2. 음향신호기 데이터

서울에서는 **서울시 음향신호기 관련 정보 API**를 직접 붙이는 것이 가장 좋다.
이 API는 `SUD_SGN_MNG_NO1`, `XCRD`, `YCRD`, `PSTN_INFO`, `DRCT`, `INSTL_YMD`, `RPLC_YMD`, `STTS_CD`, `MKR`, `KND` 등을 제공하므로, 단순 유무를 넘어서 **설치 방향, 상태, 설치 이력**까지 응답에 담을 수 있다. 

전국 단위에서는 **전국 신호등 표준데이터**와 **전국 횡단보도 표준데이터**의 `sondSgngnrYn`를 보조적으로 사용할 수 있다.
전국 신호등 표준데이터는 `sondSgngnrYn`, `fnctngSgngnrYn`, `remndrIdctYn` 같은 보행 신호 부가시설 정보를 제공한다. 다만 이것은 **신호등 기준 데이터**이므로, 횡단보도 기준 응답에 넣을 때는 매칭 과정이 필요하다. 

---

## 4. 통합 우선순위 추천

서울 기준으로는 아래 순서가 가장 현실적이다.

### 1단계. 횡단보도 기본 위치 확보

* 서울 대로변 횡단보도 위치정보 API 사용 

### 2단계. 횡단보도 보행 편의 속성 보강

* 전국 횡단보도 표준데이터 사용
* `tfclghtYn`, `sondSgngnrYn`, `brllBlckYn`, `ftpthLowerYn` 등 반영 

### 3단계. 실제 음향신호기 개별 장치 매칭

* 서울시 음향신호기 API 사용
* 좌표 기준 근접 매칭
* 가능하면 방향 정보까지 연결 

### 4단계. 신호등 관련 속성 보강

* 전국 신호등 표준데이터 사용
* `fnctngSgngnrYn`, `remndrIdctYn`, `sondSgngnrYn` 등 추가 

이렇게 하면 서울에서는 **공간 정확도 + 보행 편의 정보 + 실제 음향신호기 시설 정보**를 모두 얻을 수 있다.

---

## 5. 필드 통합 규칙

## 5-1. 횡단보도 관련 핵심 필드

최종 응답에는 아래만 우선 노출하는 것이 좋다.

* `crosswalkId`
* `latitude`
* `longitude`
* `kind`
* `pedestrianSignal`
* `acousticSignalInstalled`
* `brailleBlock`
* `curbLowered`
* `greenTime`
* `redTime`

원본 API의 관리용 필드 예를 들면 `CRSWK_MNG_NO1`, `HSTRY_ID`, `CSTRN_MNG_NO`, `NEW_NMLZ_ID` 같은 값은 내부 저장용으로 두고, 기본 응답에서는 숨기는 편이 낫다. 서울 교통안전시설물 횡단보도 정보 API는 이런 관리 항목 비중이 크다. 

## 5-2. 음향신호기 관련 핵심 필드

최종 응답에는 아래 중심으로 두는 것이 좋다.

* `installed`
* `count`
* `status`
* `directions`
* `devices[]`

그리고 `devices[]` 내부에만 아래를 선택적으로 둔다.

* `deviceId`
* `direction`
* `status`
* `installedAt`
* `replacedAt`
* `manufacturer`
* `kind`

이렇게 하면 앱에서 간단 모드와 상세 모드를 모두 처리하기 쉽다.

---

## 6. 매칭 방식

서울 음향신호기 API는 횡단보도와 직접 연결 키를 주지 않으므로, **좌표 기반 근접 매칭**이 필요하다. 파일에서도 횡단보도와 음향신호기의 직접 연결 관계는 없고, 실제 서비스에서는 좌표 기반 매칭 로직이 필요하다고 정리되어 있다. 

추천 순서는 다음과 같다.

## 6-1. 1차 매칭

횡단보도 중심 좌표와 음향신호기 좌표 사이 거리 계산

## 6-2. 2차 필터

같은 구/동 또는 근접 행정구역인지 확인

## 6-3. 3차 필터

방향 정보 `DRCT`와 횡단보도 링크 방향이 크게 어긋나지 않는지 확인

## 6-4. 신뢰도 계산

* 5m 이하: 높음
* 5~15m: 보통
* 15m 초과: 낮음

최종 응답에는 아래를 넣는 것이 좋다.

```json
"match": {
  "method": "COORDINATE_NEAREST",
  "distanceMeters": 6.7,
  "confidence": 0.82
}
```

이 필드가 있으면, 나중에 앱에서 “확실한 정보인지”를 판단하기 쉽다.

---

## 7. 통합 응답 레벨 구분

하나의 큰 응답으로 다 주기보다 목적에 따라 나누는 것이 좋다.

## 7-1. 목록 조회용

지도나 주변 탐색용

```json
{
  "crosswalkId": "...",
  "latitude": 37.123,
  "longitude": 127.123,
  "acousticSignalInstalled": true,
  "brailleBlock": true,
  "curbLowered": false,
  "summary": "음향신호기 있음"
}
```

## 7-2. 상세 조회용

특정 횡단보도 눌렀을 때

```json
{
  "crosswalkId": "...",
  "location": { ... },
  "crosswalk": { ... },
  "acousticSignal": { ... },
  "guidance": { ... },
  "source": { ... },
  "match": { ... }
}
```

즉, 목록 응답은 가볍게, 상세 응답은 풍부하게 가는 구조가 좋다.

---

## 8. 사용자 안내 관점에서 정말 필요한 값

너희 프로젝트는 시각장애인 보행 보조 서비스이므로, 응답은 관리 데이터보다 **보행 판단 데이터**를 우선 노출해야 한다.
프로젝트 기획서에서도 점자블록은 대표적 보행 기준선이고, 랜드마크와 기준선을 따라 직선 보행하는 특성이 중요하다고 정리되어 있다. 따라서 횡단보도 응답에서도 **점자블록**, **보도턱낮춤**, **음향신호기**, **보행자신호등** 여부가 우선이다. 

그래서 최종적으로 중요한 값은 아래다.

* 횡단보도 존재 여부
* 현재 위치와의 거리
* 음향신호기 설치 여부
* 보행자 신호등 유무
* 점자블록 유무
* 보도턱낮춤 여부
* 신호 시간 정보
* 매칭 신뢰도

이 값들만 잘 보여도 앱 음성 안내 문장을 만들기 쉽다.

예:

* “앞쪽 8미터에 횡단보도가 있습니다.”
* “이 횡단보도에는 음향신호기가 있습니다.”
* “점자블록이 연결되어 있습니다.”
* “보도턱낮춤이 확인되었습니다.”

---

## 9. 추천 응답 명세 초안

## 9-1. 주변 횡단보도 조회

`GET /api/crosswalks/nearby?lat=...&lng=...`

```json
{
  "success": true,
  "data": [
    {
      "crosswalkId": "CWK-001",
      "distanceMeters": 7.2,
      "location": {
        "latitude": 37.0001,
        "longitude": 127.0001
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
        "summary": "음향신호기와 점자블록이 있는 횡단보도"
      }
    }
  ]
}
```

## 9-2. 횡단보도 상세 조회

`GET /api/crosswalks/{crosswalkId}`

```json
{
  "success": true,
  "data": {
    "crosswalkId": "CWK-001",
    "location": {
      "latitude": 37.0001,
      "longitude": 127.0001,
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
      "greenTime": 20,
      "redTime": 35,
      "brailleBlock": true,
      "curbLowered": true,
      "trafficIsland": false,
      "lighting": false
    },
    "acousticSignal": {
      "installed": true,
      "count": 2,
      "devices": [
        {
          "deviceId": "AS-1001",
          "direction": "동쪽",
          "status": "정상",
          "installedAt": "2024-03-01",
          "replacedAt": null,
          "manufacturer": "..."
        }
      ]
    },
    "match": {
      "method": "COORDINATE_NEAREST",
      "distanceMeters": 3.8,
      "confidence": 0.94
    },
    "source": {
      "crosswalkBase": "SEOUL_TB_TRAFFIC_CRSNG",
      "crosswalkDetail": "NATIONAL_STANDARD_CROSSWALK",
      "acousticBase": "SEOUL_ACOUSTIC_SIGNAL"
    }
  }
}
```

---

## 10. 구현 시 주의점

### 좌표계 통일이 먼저다

서울 횡단보도 시설물 API와 서울 음향신호기 API는 `XCRD`, `YCRD` 기반이고, 문서에 EPSG:5186으로 정리되어 있다. 서울 대로변 횡단보도 위치정보는 WGS84로 정리되어 있다. 전국 표준데이터는 위도·경도 기반이다. 따라서 **저장 전에 WGS84로 통일**하는 것이 안전하다.    

### 데이터 출처 우선순위를 정해야 한다

같은 값이 여러 API에서 다를 수 있다.
예를 들어 음향신호기 여부는 전국 횡단보도 표준데이터의 `sondSgngnrYn`와 서울 음향신호기 실제 장치 매칭 결과가 다를 수 있다.

이 경우 추천 규칙은 다음과 같다.

* 서울 지역에서 실제 장치 좌표 매칭 성공 시: **서울 음향신호기 API 우선**
* 매칭 실패 시: **전국 횡단보도 표준데이터 보조 사용**
* 둘 다 없으면: `unknown`

### 내부 관리 필드와 외부 응답 필드를 분리해야 한다

관리번호, 이력번호, 공사번호 같은 값은 DB에는 저장하되, 앱 응답에는 꼭 필요한 것만 내려야 한다.

---

## 11. 결론

가장 좋은 방향은 **횡단보도를 기준 엔티티로 두고, 음향신호기를 부속 정보로 통합하는 구조**다.
서울에서는 **서울 대로변 횡단보도 위치정보**를 위치 기준으로, **전국 횡단보도 표준데이터**를 보행 편의 속성 보강용으로, **서울시 음향신호기 API**를 실제 음향신호기 장치 정보용으로 결합하는 구성이 가장 적합하다. 여기에 필요하면 **전국 신호등 표준데이터**로 보행 신호 부가시설 정보를 보강하면 된다.    

즉, 응답은 아래 원칙으로 가면 된다.

1. 최상위 기준은 횡단보도
2. 음향신호기는 하위 객체로 통합
3. 사용자 안내에 필요한 값만 우선 노출
4. 좌표 기반 매칭 결과와 신뢰도를 함께 제공
5. 서울 데이터와 전국 데이터를 역할별로 분리해서 사용

다음 단계로 원하면 이 구조를 바탕으로 **실제 Spring DTO 형태의 응답 클래스 설계안**까지 바로 이어서 정리해주겠다.