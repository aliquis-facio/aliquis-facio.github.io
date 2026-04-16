# 1. API 개요

이 API는 **보행자 기준 경로 탐색** API다. 출발지와 목적지 사이의 **도보 이동 경로**, 경유지 포함 경로, 그리고 경로를 구성하는 **안내 포인트와 선형 경로 정보**를 내려준다. 공식 문서상 보행자 기준 경로 정보를 확인할 수 있고, **최대 5개의 경유지**를 지정할 수 있다. 호출 방식은 **POST `https://apis.openapi.sk.com/tmap/routes/pedestrian`** 이다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

도메인상으로는 “지도/길찾기” 중에서도 **보행 경로 안내**에 속한다. 자동차 길안내처럼 차선·교통 흐름 중심이 아니라, 사용자가 실제로 **어디로 걸어가야 하는지**를 선형 경로와 안내 문장 형태로 받는 API라는 점이 핵심이다. 응답에는 `geometry.type`이 `Point` 또는 `LineString`으로 내려오고, `description`, `direction`, `nearPoiName`, `intersectionName` 같은 안내용 속성이 포함된다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

너희 서비스에서 이 API가 중요한 이유는, 시각장애인 보행 보조에서 필요한 정보 중 **방향 파악**과 **이동 방향 제시**를 담당할 수 있기 때문이다. 즉, “어디쯤 있는가”와 “어느 방향으로 얼마만큼 가야 하는가”를 앱이 설명할 수 있게 해 준다. 다만 이 API는 **실시간 장애물**, **신호등 현재 색상**, **점자블록 존재 여부**까지 직접 알려주는 API는 아니다. 따라서 이 API는 **기본 보행 경로 엔진**으로는 유용하지만, 안전 보행 플랫폼의 전체 문제를 단독으로 해결하지는 못한다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

비슷한 다른 API와 비교하면 역할은 명확하다. TMAP에는 보행자 경로안내 외에도 **지오코딩**, **POI 검색**, **가까운 도로 검색**, **ROAD API**, **교통 정보**, **Reverse Label** 같은 주변 API가 같이 제공된다. 그중 보행자 경로안내는 “목적지까지 걷는 경로 자체”를 담당하고, 나머지는 입력 보정, 위치 설명, 주변 맥락 보강에 쓰는 보조 API에 가깝다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))

---

# 2. 지원 가능한 기능 분석

## 경로 안내

- 사용 가능 여부: **가능**
    
- 활용 방식: 현재 위치와 목적지 좌표를 넣어 보행 경로를 받아 음성 안내에 사용
    
- 필요한 입력값: `startX`, `startY`, `endX`, `endY`, `reqCoordType`, `resCoordType`, `startName`, `endName`
    
- 핵심 응답값: `geometry`, `description`, `direction`, `totalDistance`, `totalTime` 계열 요약값, 교차점/주변 POI 관련 속성
    
- 앱 시나리오: 사용자가 “정문까지 안내해줘”라고 하면 앱이 보행 경로를 조회하고, 경로를 단계별로 음성·진동으로 안내 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
    

이 기능은 너희 서비스의 **기본 길안내 축**으로 바로 쓸 수 있다. 특히 시각장애인 사용자에게는 “최단거리”보다 “지금 어디로 걸어야 하는가”가 중요하므로, `Point`와 `LineString` 단위의 안내를 잘 파싱해 **단계형 안내**로 바꾸는 것이 핵심이다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 횡단보도 탐색

- 사용 가능 여부: **부분 가능**
    
- 활용 방식: 응답의 교차점/안내 포인트 문장과 선형 경로를 이용해 “횡단이 포함된 경로인지”를 간접 파악
    
- 필요한 입력값: 기본 경로 입력값 동일
    
- 핵심 응답값: `description`, `intersectionName`, 경로 상 `Point` 구간
    
- 앱 시나리오: “전방 교차로에서 횡단 필요” 같은 보행 단계 추출 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

하지만 문서와 스니펫 기준으로 **횡단보도 위치/종류/폭/신호 연동 여부**를 구조화된 전용 필드로 준다는 근거는 확인되지 않았다. 그래서 “횡단보도 존재 여부”를 안정적으로 쓰려면 **별도 공공데이터나 횡단보도 전용 API**를 함께 붙이는 쪽이 맞다. 이 API 단독으로는 안내 문장 수준의 보조 해석에 머물 가능성이 높다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 신호등 상태 확인

- 사용 가능 여부: **불가**
    
- 활용 방식: 없음
    
- 필요한 입력값: 없음
    
- 핵심 응답값: 없음
    
- 앱 시나리오: 불가 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

보행자 경로안내 API는 **경로**를 주는 API이지, **실시간 신호 제어 상태**를 주는 API가 아니다. 따라서 “지금 빨간불인지 초록불인지” 판단은 다른 신호등 데이터나 비전 인식이 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 보행자 안전 경고

- 사용 가능 여부: **부분 가능**
    
- 활용 방식: 경로 이탈, 교차점 접근, 회전 지점 접근, 장거리 직진 구간 접근 시 경고 생성
    
- 필요한 입력값: 경로 요청값 + 앱의 현재 GPS/방향 센서
    
- 핵심 응답값: `direction`, `description`, `geometry`, 요약 거리/시간
    
- 앱 시나리오: “10미터 후 우회전입니다”, “교차 구간 접근 중입니다” 같은 선제 경고 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

다만 이건 **경로 안전 경고**이지 **실제 장애물 경고**는 아니다. 킥보드, 공사 바리케이드, 적치물 같은 것은 API가 아니라 카메라 기반 객체 탐지로 처리해야 한다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 주변 시설 탐색

- 사용 가능 여부: **직접은 제한적 / TMAP 다른 API와 조합 시 가능**
    
- 활용 방식: 보행자 경로안내 단독보다는 POI 검색, Reverse Label, 주변 카테고리 검색과 조합
    
- 필요한 입력값: 위치 좌표 또는 검색어
    
- 핵심 응답값: POI명, 좌표, 주소, 주변 맥락
    
- 앱 시나리오: “왼쪽에 편의점이 있는 골목”, “정문 앞 버스정류장까지” 같은 랜드마크 보강 안내 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    

시각장애인 보행에서는 랜드마크가 중요하므로, 이 API 하나보다 **POI/주소/라벨 API 조합**이 훨씬 실용적이다. 경로안내 API는 이동선, 주변 API는 설명 재료라고 보면 된다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))

## 위치 기반 음성 안내

- 사용 가능 여부: **가능**
    
- 활용 방식: `description`, `direction`, 교차점 명칭, 주변 POI명을 자연어 문장으로 재구성
    
- 필요한 입력값: 경로 응답 + 앱의 현재 위치
    
- 핵심 응답값: `description`, `direction`, `nearPoiName`, `intersectionName`
    
- 앱 시나리오: 단계별 음성 안내, 백그라운드 음성 알림, 재탐색 후 즉시 새 안내 제공 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

이 기능은 너희 서비스와 가장 잘 맞는다. 다만 원문 설명을 그대로 읽기보다, 시각장애인 사용자에게 맞게 **거리 우선**, **방향 우선**, **기준선 우선** 문장으로 다시 만들어야 한다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 실시간성 필요한 기능

- 사용 가능 여부: **재호출 기반으로는 가능 / 진짜 실시간 상황 인지는 불가**
    
- 활용 방식: 사용자가 이동하거나 이탈하면 경로 재요청
    
- 필요한 입력값: 갱신된 현재 좌표
    
- 핵심 응답값: 새 `geometry`, 새 안내 포인트
    
- 앱 시나리오: 경로 이탈 시 재탐색, 목적지 변경 시 즉시 재계산 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

다만 API 자체가 “실시간 물리 환경 인지”를 하지는 않는다. 즉, 경로는 갱신할 수 있어도 **지금 인도에 킥보드가 있는지**는 알 수 없다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

## 사전 데이터 조회 기능

- 사용 가능 여부: **제한적**
    
- 활용 방식: 출발 전 전체 경로 구조를 미리 분석하여 위험 구간 후보를 태깅
    
- 필요한 입력값: 출발지/목적지/경유지
    
- 핵심 응답값: 전체 경로 선형 정보, 안내 포인트, 총거리/총시간
    
- 앱 시나리오: “이 경로는 교차점이 많습니다”, “장거리 직진이 길어 기준선 유지가 중요합니다” 같은 출발 전 안내 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

---

# 3. 엔드포인트별 상세 분석

## `POST https://apis.openapi.sk.com/tmap/routes/pedestrian`

### 1) 역할

출발지부터 목적지까지의 **보행자 경로**를 계산하고, 경유지가 있으면 그것을 포함한 전체 도보 경로를 반환한다. 공식 설명상 **보행자 기준 경로 정보 확인**이 목적이며 경유지는 최대 5개까지 가능하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

### 2) 요청 방식

- HTTP Method: `POST`
    
- URL: `https://apis.openapi.sk.com/tmap/routes/pedestrian`
    
- Query Parameter: 스니펫 기준 `version=1`, `callback=function` 예시가 확인됨
    
- Header: `appKey`, `accept: application/json`, `content-type: application/json`
    
- Body 주요 필드:
    
    - `startX`, `startY`
        
    - `endX`, `endY`
        
    - `reqCoordType`, `resCoordType`
        
    - `startName`, `endName`
        
    - `passList`
        
    - `angle`
        
    - `speed`
        
    - `endPoiId`
        
    - `searchOption`
        
    - `sort` ([SK Open API](https://openapi.sk.com/qnaCommunity/385?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 503오류"))
        

좌표 예시로는 `WGS84GEO` 사용 사례가 공식 Q&A에 보이고, `passList`는 `X,Y_X,Y...` 형식으로 나열하며 **최대 5곳**까지 넣는다고 안내돼 있다. ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))

### 3) 응답 데이터

주요 응답은 GeoJSON 성격의 구조로 보이며, 검색 스니펫 기준 다음 정보가 확인된다.

- `geometry.type`: `Point` 또는 `LineString`
    
- `description`: 안내 문구
    
- `direction`: 방향 정보
    
- `nearPoiName`, `nearPoiX`, `nearPoiY`
    
- `intersectionName`
    
- 요약 정보: `totalDistance`, `totalTime` 계열 값 존재
    
- 정렬 관련 `sort`
    
- 회전/안내 관련 속성 일부 존재 가능성 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

여기서 실제 서비스에 중요한 것은 `geometry`, `description`, `direction`, 총거리/총시간, 주변 POI/교차점 명칭이다. 반면 `angle`, `speed`, `searchOption`, `sort`, `endPoiId`는 동작에 영향을 주는 보조 제어값으로 보이지만, 문서 본문 전체를 구조적으로 확인한 것은 아니므로 일부 의미는 **추정**으로 봐야 한다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

### 4) 서비스 활용도

이 엔드포인트는 너희 앱에서 다음 영역에 직접 붙일 수 있다.

- **음성 안내**: 가장 적합
    
- **진동 안내**: 회전/교차점 접근 시 적합
    
- **지도 표시**: 경로 시각화에 적합
    
- **위험 감지**: 단독으로는 제한적, 후처리 필요 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

단독 사용으로도 “A에서 B까지 걷기 안내”는 가능하다. 하지만 시각장애인 안전 보행 수준으로 끌어올리려면, **신호등 데이터**, **횡단보도 데이터**, **공사/장애물 데이터**, **카메라 기반 AI 인식**과의 조합이 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))

### 5) 한계 및 주의점

- 실시간성 한계: 경로는 재탐색 가능하지만 **실시간 장애물/신호 변화**는 반영 근거가 없다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 정확도 한계: 보행 경로는 주지만, **점자블록 연속성**이나 **보도 경계 안정성**을 직접 평가하지 않는다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 좌표계 문제: `reqCoordType`, `resCoordType`가 있으므로 입력·출력 좌표계 일치가 중요하다. 공식 예시에는 `WGS84GEO`, `EPSG3857`, `KATECH`가 보인다. ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
    
- 데이터 누락 가능성: 횡단보도, 점자블록, 공사구간 같은 보행 안전 요소를 구조 필드로 다 주는 근거는 확인되지 않았다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 지역별 편차 가능성: 공식 Q&A에 “서비스 지역 문의”가 따로 있는 것으로 보아 지역 지원 범위 점검이 필요하다. ([SK Open API](https://openapi.sk.com/qnaCommunity/357?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 서비스 지역 문의입니다. - SK open API"))
    
- 호출량 제한 가능성: 인증형 상용 API이며 요금/대시보드 기반 사용 구조다. 구체 한도는 별도 상품 요금/정책 확인이 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    
- 인증 필요 여부: `appKey` 헤더가 필요하다. ([SK Open API](https://openapi.sk.com/qnaCommunity/385?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 503오류"))
    
- 모바일 환경 주의점: 이동 중 잦은 재호출 시 배터리·지연·요금 이슈가 생길 수 있어, 앱에서 **위치 변화 임계값** 기준 재탐색 정책이 필요하다. 이는 문서가 아니라 구현상 판단이다. ([SK Open API](https://openapi.sk.com/qnaCommunity/385?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 503오류"))
    

---

# 4. 핵심 필드 정리

## 위치 관련

- `startX`, `startY`
    
    - 의미: 출발지 좌표
        
    - 중요한 이유: 현재 위치를 경로 계산의 시작점으로 넣어야 함
        
    - 앱 사용 방식: GPS 위치를 좌표계에 맞게 변환해 입력 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
        
- `endX`, `endY`
    
    - 의미: 목적지 좌표
        
    - 중요한 이유: 목적지까지의 보행선 계산의 기준
        
    - 앱 사용 방식: 검색 결과 또는 선택한 장소 좌표 입력 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
        
- `passList`
    
    - 의미: 경유지 목록
        
    - 중요한 이유: 안전 경로 우선 설계, 특정 횡단점 우회, 엘리베이터 경유 같은 전략 가능
        
    - 앱 사용 방식: `X,Y_X,Y...` 형식, 최대 5곳 ([SK Open API](https://openapi.sk.com/qnaCommunity/235 "SK open API"))
        

## 방향 관련

- `direction`
    
    - 의미: 진행 방향 정보
        
    - 중요한 이유: “좌회전/우회전/직진” 안내 생성의 핵심
        
    - 앱 사용 방식: 음성 및 진동 패턴으로 변환 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        
- `angle`
    
    - 의미: 요청값으로 보이는 방향 관련 값
        
    - 중요한 이유: 현재 바라보는 방향을 반영할 가능성 있음
        
    - 앱 사용 방식: 사용자 단말의 나침반과 조합 가능
        
    - 비고: 정확한 의미는 문서 전문 미확인으로 **추정** ([SK Open API](https://openapi.sk.com/qnaCommunity/385?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 503오류"))
        

## 거리/시간 관련

- `totalDistance`
    
    - 의미: 총 이동 거리
        
    - 중요한 이유: 사용자에게 전체 안내 길이와 남은 거리 계산에 필요
        
    - 앱 사용 방식: “총 180미터 이동” 같은 출발 전 안내 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        
- `totalTime`
    
    - 의미: 총 예상 이동 시간
        
    - 중요한 이유: 보행 시간 안내, 장거리 경고에 유용
        
    - 앱 사용 방식: “약 4분 거리” 안내 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        

## 경로/안내 생성 관련

- `geometry.type`
    
    - 의미: `Point` 또는 `LineString`
        
    - 중요한 이유: 포인트는 이벤트 지점, 라인은 실제 이동 구간
        
    - 앱 사용 방식: 포인트 접근 시 안내, 선형 구간은 지도·이탈 판정에 사용 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        
- `description`
    
    - 의미: 단계 설명 문구
        
    - 중요한 이유: 사용자 음성 안내의 기본 재료
        
    - 앱 사용 방식: 앱 맞춤 문장으로 다시 생성 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        
- `intersectionName`
    
    - 의미: 교차점 이름
        
    - 중요한 이유: 횡단·교차점 접근 알림의 기준점
        
    - 앱 사용 방식: “앞 교차로” 또는 “OO교차점” 안내 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        
- `nearPoiName`, `nearPoiX`, `nearPoiY`
    
    - 의미: 근처 랜드마크 POI
        
    - 중요한 이유: 시각장애인 보행에서 랜드마크 안내에 유용
        
    - 앱 사용 방식: “OO편의점 앞” 같은 문장 생성 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
        

## 좌표계 관련

- `reqCoordType`
    
    - 의미: 요청 좌표계
        
    - 중요한 이유: 잘못 넣으면 경로가 엉뚱한 위치에서 계산될 수 있음
        
    - 앱 사용 방식: 보통 GPS는 `WGS84GEO` 기준으로 맞추는 쪽이 안전 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
        
- `resCoordType`
    
    - 의미: 응답 좌표계
        
    - 중요한 이유: 지도 렌더링과 거리 계산 일관성에 영향
        
    - 앱 사용 방식: 앱 내부 좌표계 표준을 정해서 일관 처리 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
        

---

# 5. 사용자 안내 관점 해석

이 API 데이터는 그대로 읽으면 개발용 정보에 가깝다. 시각장애인 사용자에게는 아래처럼 **재구성**해야 한다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

- `totalDistance=120m`, 첫 구간 `description` 직진 계열  
    → “목적지까지 약 120미터입니다. 우선 직진하세요.” ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- `direction`이 우회전, 전방 `Point` 접근  
    → “10미터 앞에서 오른쪽으로 방향을 바꾸세요.” ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- `intersectionName` 존재  
    → “앞 교차 구간입니다. 차량 소리를 확인하며 천천히 접근하세요.”  
    이 문장은 안전 문구를 앱이 덧붙인 것이고, 교차점 이름 자체는 API 응답 기반이다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- `nearPoiName` 존재  
    → “왼쪽에 편의점이 있는 지점을 지나 계속 직진하세요.” ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 경유지를 인위적으로 안전 지점으로 넣은 경우  
    → “다음 기준 지점까지 직진 후, 다시 경로를 이어갑니다.” ([SK Open API](https://openapi.sk.com/qnaCommunity/235?utm_source=chatgpt.com "[TMAP] - 다중경유지 30"))
    

중요한 점은, 시각장애인 보행에서는 단순히 “100미터 이동”보다 **기준선**, **교차 시점**, **회전 시점**, **랜드마크**가 더 중요하다는 것이다. 따라서 API의 `description`을 그대로 읽지 말고 다음 순서로 재가공하는 것이 좋다.

1. 거리
    
2. 방향
    
3. 기준점
    
4. 주의 문구
    
5. 다음 행동 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

예를 들면 이런 식이다.

- “20미터 직진 후 오른쪽”
    
- “교차 구간 접근 중”
    
- “왼쪽 건물 입구를 지나 계속 직진”
    
- “경로에서 벗어났습니다. 안전한 방향으로 다시 안내합니다”
    

마지막 문장은 API의 재탐색 결과를 이용한 앱 레벨 기능이다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

---

# 6. 우리 서비스 적용 구조

구조는 아래 흐름이 현실적이다.

## 앱

사용자 GPS, 나침반, 카메라 입력을 받는다. 목적지를 선택하거나 음성으로 입력받는다. 현재 위치와 목적지를 서버 또는 직접 API 호출 모듈로 넘긴다. ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))

## 백엔드

- 좌표계 정규화
    
- TMAP 보행자 경로 API 호출
    
- 응답 파싱
    
- 포인트/선형 구간 분리
    
- 교차점, 회전 지점, 랜드마크 포인트 추출
    
- 앱용 안내 데이터로 재구성 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

## 외부 API

- TMAP 보행자 경로안내: 기본 이동선
    
- 필요 시 TMAP POI/지오코딩/Reverse Label: 랜드마크와 주소 설명 보강
    
- 필요 시 별도 횡단보도/신호등 공공데이터: 안전 맥락 보강 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    

## AI 모델

- 카메라 영상 기반 장애물 탐지
    
- 보도 경계/점자블록 세그멘테이션
    
- 신호등 색상 인식
    
- 위험도 판단 모델 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

## 최종 안내 흐름

1. 사용자 위치 수집
    
2. 목적지 설정
    
3. 보행자 경로 API 호출
    
4. 응답에서 단계 정보 추출
    
5. 현재 위치와 비교해 다음 포인트 계산
    
6. 음성/진동 안내 생성
    
7. 카메라 AI로 실시간 위험 보정
    
8. 경로 이탈 시 재탐색 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

이 구조에서 TMAP API는 **길의 뼈대**, AI는 **현장 안전 감지**, 앱은 **사용자 인터페이스**, 백엔드는 **의미 해석과 안내 생성**을 맡는 게 가장 자연스럽다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))

---

# 7. 부족한 점과 추가 구현 필요 사항

이 API만으로 부족한 점은 명확하다.

첫째, **실시간 장애물 탐지 불가**다. 경로는 알려주지만, 보도 위 킥보드·콘·공사 바리케이드·적치물은 알 수 없다. 이 부분은 카메라 기반 객체 탐지 모델이 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

둘째, **신호등 상태 제공 근거 없음**이다. 따라서 “지금 건너도 되는지”는 이 API로 해결되지 않는다. 신호등 공공데이터가 있으면 붙이고, 없으면 카메라 인식이 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

셋째, **점자블록 정보 없음**이다. 시각장애인 보행에서 핵심인 기준선 보행 지원이 약하다. 이 부분은 지도 데이터만으로 해결되기 어렵고, 현장 비전 모델이나 별도 공간 데이터가 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

넷째, **보도 경계 안전성 평가 없음**이다. 경로는 보행 경로지만, 실제로 얼마나 안전한지, 보도 폭이 충분한지, 차도 인접 위험이 큰지 같은 판단은 별도 후처리가 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

다섯째, **횡단보도 정보를 구조화해서 충분히 준다고 보기 어렵다**. 교차점/설명 문구는 보이지만, 보행약자용으로 필요한 “횡단 시작 지점”, “횡단 길이”, “보행 신호 연계 가능성”은 별도 데이터가 더 적합하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))

보완 방법은 다음이 적절하다.

- 공공데이터 추가: 횡단보도, 음향신호기, 공사구간, 장애인 편의시설
    
- 지도 API 추가: POI, 건물 입구, 주소 라벨
    
- 비전 AI 모델 추가: 장애물, 점자블록, 보도 경계, 신호등
    
- 서버 후처리: 경로를 안전 우선 문장으로 재작성
    
- 센서 활용: GPS + 자이로 + 나침반으로 방향 정합성 강화 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    

---

# 8. 구현 우선순위 제안

## 지금 바로 쓸 수 있는 기능

- 현재 위치 → 목적지 **보행 경로 안내**
    
- 총거리/예상시간 안내
    
- 단계별 직진/회전 음성 안내
    
- 경유지를 이용한 제한적 우회 경로 구성
    
- 경로 이탈 시 재탐색 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

## 추가 가공 후 쓸 수 있는 기능

- 랜드마크 기반 안내 문장 생성
    
- 교차점 접근 경고
    
- 안전 후보 경유지 기반 경로 튜닝
    
- 사용자 맞춤 음성/진동 패턴 변환 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

## 장기적으로 붙일 기능

- 신호등 상태 기반 횡단 허용 안내
    
- 실시간 보도 장애물 회피
    
- 점자블록 연속성 기반 경로 점수화
    
- 보행 안전도 랭킹 기반 경로 추천
    
- 개인별 보행 성향 반영 경로 최적화 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    

---

# 9. 최종 결론

- 이 API는 **보행자 경로 생성과 단계형 도보 안내**에 가장 적합하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 너희 서비스에서는 **기본 길안내 엔진**으로 충분히 활용 가능하다. 특히 현재 위치에서 목적지까지의 안전 안내 흐름 중 **방향 제시**와 **이동 단계 관리**를 맡기기 좋다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 다만 단독으로는 충분하지 않다. **실시간 장애물**, **신호등 상태**, **점자블록/보도 경계**, **횡단 안전성**은 별도 데이터와 AI가 반드시 필요하다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 도입 우선순위는 **높은 편**이다. 이유는 MVP에서도 바로 쓸 수 있는 “도보 경로 안내” 기능이 있기 때문이다. ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 실제 구현 시 가장 중요한 주의점은 **좌표계 정합**, **응답 문장을 그대로 읽지 말고 사용자용 안내로 재구성할 것**, **경로 API를 안전 판단 API로 오해하지 말 것**이다. ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
    

---

## A. 이 API로 당장 구현 가능한 기능

- 현재 위치에서 목적지까지 보행 경로 계산
    
- 단계별 직진/회전 음성 안내
    
- 총거리/총시간 안내
    
- 경로 선형 표시
    
- 경유지 최대 5개를 활용한 제한적 우회 경로
    
- 경로 이탈 시 재탐색 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

## B. 다른 데이터/API/AI가 추가로 필요한 기능

- 신호등 현재 상태 안내
    
- 횡단보도 구조 정보 정밀 안내
    
- 공사구간, 킥보드, 적치물 실시간 탐지
    
- 점자블록 및 보도 경계 추적
    
- 보행 안전도 기반 경로 추천
    
- 랜드마크 중심의 고품질 안내 문장 생성 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45 "SK open API"))
    

## C. 실제 앱 연결 시 개발자가 먼저 확인해야 할 체크리스트

- `appKey` 인증 방식과 배포 환경 분리 여부 확인 ([SK Open API](https://openapi.sk.com/qnaCommunity/385?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 503오류"))
    
- `reqCoordType` / `resCoordType` 표준 통일 여부 확인 ([SK Open API](https://openapi.sk.com/qnaCommunity/437 "SK open API"))
    
- `passList` 형식과 최대 5개 제한 반영 여부 확인 ([SK Open API](https://openapi.sk.com/qnaCommunity/235?utm_source=chatgpt.com "[TMAP] - 다중경유지 30"))
    
- 응답의 `Point` / `LineString` 파싱 로직 설계 여부 확인 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- `description`, `direction`, `nearPoiName`, `intersectionName`를 사용자 안내 문장으로 바꾸는 후처리 설계 여부 확인 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    
- 재탐색 주기와 호출량/요금 정책 확인 ([SK Open API](https://openapi.sk.com/products/calc?menuSeq=5&svcSeq=4&utm_source=chatgpt.com "요금제 가입하기"))
    
- 지역 지원 범위와 실제 서비스 지역 테스트 확인 ([SK Open API](https://openapi.sk.com/qnaCommunity/357?utm_source=chatgpt.com "[TMAP] - 보행자 경로안내 서비스 지역 문의입니다. - SK open API"))
    
- 경로 API와 안전 인지 AI를 분리 설계했는지 확인 ([SK Open API](https://openapi.sk.com/products/detail?linkMenuSeq=45&utm_source=chatgpt.com "보행자 경로 안내"))
    

원하면 다음 단계로 이어서 **“이 API를 기준으로 한 실제 백엔드 DTO 설계 + 앱 안내 문장 규칙 + MVP 호출 플로우”**까지 바로 정리해줄게.