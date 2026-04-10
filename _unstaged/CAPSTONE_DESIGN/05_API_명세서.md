# API 명세서

분석 범위는 `Controller`, `Service`, `DTO`, `Entity`, `Exception`, `SecurityConfig`, `WebClientConfig`, `GlobalExceptionHandler` 기준이다.

## 프로젝트에서 확인된 API 목록

| No | HTTP Method | Endpoint                       | 기능                           | 인증      |
| -- | ----------- | ------------------------------ | ---------------------------- | ------- |
| 1  | POST        | `/api/auth/kakao/login`        | 카카오 Access Token 기반 로그인      | 불필요     |
| 2  | POST        | `/api/auth/reissue`            | Refresh Token 재발급            | 불필요     |
| 3  | POST        | `/api/auth/logout`             | 로그아웃                         | 코드상 불명확 |
| 4  | POST        | `/api/auth/test-login`         | 테스트 로그인                      | 불필요     |
| 5  | POST        | `/api/guide/image`             | 이미지 프레임 AI 서버 전달             | 필요      |
| 6  | POST        | `/api/guide/event`             | 가이드 이벤트를 사용자 WebSocket 큐로 전송 | 필요      |
| 7  | POST        | `/api/navigation/routes`       | 보행 경로 조회                     | 필요      |
| 8  | GET         | `/api/places/nearby`           | 주변 카테고리 장소 조회                | 불필요     |
| 9  | GET         | `/api/places/search`           | 키워드 기반 장소 검색                 | 불필요     |
| 10 | GET         | `/api/places/{placeId}`        | 장소 상세 조회(캐시 기반)              | 선택      |
| 11 | GET         | `/api/places/geocode`          | 주소/키워드 지오코딩                  | 불필요     |
| 12 | GET         | `/api/places/reverse-geocode`  | 좌표 기반 역지오코딩                  | 불필요     |
| 13 | GET         | `/api/users/me/favorites`      | 내 즐겨찾기 목록 조회                 | 필요      |
| 14 | POST        | `/api/users/me/favorites`      | 즐겨찾기 등록                      | 필요      |
| 15 | DELETE      | `/api/users/me/favorites/{id}` | 즐겨찾기 삭제                      | 필요      |
| 16 | GET         | `/api/users/me/recent`         | 최근 검색 장소 목록 조회               | 필요      |
| 17 | DELETE      | `/api/users/me/recent/{id}`    | 최근 검색 장소 1건 삭제               | 필요      |
| 18 | DELETE      | `/api/users/me/recent`         | 최근 검색 장소 전체 삭제               | 필요      |
| 19 | GET         | `/api/users/me/profile`        | 내 프로필 조회                     | 필요      |
| 20 | GET         | `/api/users/me/settings`       | 내 설정 조회                      | 필요      |
| 21 | PATCH       | `/api/users/me/settings`       | 내 설정 수정                      | 필요      |
| 22 | GET         | `/api/weather`                 | 현재 날씨 조회                     | 필요      |

---

## 1. 카카오 로그인

* **HTTP Method**: POST
* **Endpoint**: `/api/auth/kakao/login`
* **설명**: 클라이언트가 전달한 카카오 Access Token으로 카카오 사용자 정보를 조회한 뒤, 서비스용 JWT Access/Refresh Token을 발급한다.
* **인증 필요 여부**: 불필요
* **권한 조건**: 없음
* **요청 헤더**:

  * Content-Type: application/json
* **데이터 소스**: 외부 API(Kakao User API) + DB(users, user_settings, refresh_tokens)

### 요청 파라미터

#### Path Variable

| 필드명 | 타입 | 필수 여부 | 설명 |
| --- | -- | ----- | -- |

#### Query Parameter

| 필드명 | 타입 | 필수 여부 | 기본값 | 설명 |
| --- | -- | ----- | --- | -- |

#### Request Body

| 필드명              | 타입     | 필수 여부 | 제약조건        | 설명                     |
| ---------------- | ------ | ----- | ----------- | ---------------------- |
| kakaoAccessToken | String | 필수    | `@NotBlank` | 카카오 OAuth Access Token |

### 요청 예시

```json
{
  "kakaoAccessToken": "kakao-access-token"
}
```

### 응답 데이터

| 필드명                  | 타입     | 설명                               |
| -------------------- | ------ | -------------------------------- |
| grantType            | String | 토큰 타입. 고정값 `Bearer`              |
| accessToken          | String | 서비스용 JWT Access Token            |
| refreshToken         | String | 서비스용 JWT Refresh Token           |
| accessTokenExpiresIn | Long   | Access Token 만료 시각(epoch millis) |

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "grantType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "accessTokenExpiresIn": 1775750400000
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지              | 발생 조건                        |
| --------- | --------------------- | ---------------- | ---------------------------- |
| 400       | VALIDATION_ERROR      | 요청 값이 올바르지 않습니다. | `kakaoAccessToken` 누락/공백     |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다.   | 카카오 사용자 정보 조회 실패, DB 처리 실패 등 |

### 실패 응답 예시

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "요청 값이 올바르지 않습니다.",
    "details": [
      {
        "field": "kakaoAccessToken",
        "reason": "kakaoAccessToken은 필수입니다."
      }
    ]
  }
}
```

### 내부 처리 흐름

1. 카카오 사용자 정보 조회: `https://kapi.kakao.com/v2/user/me`
2. 기존 사용자 조회 (`kakaoUserId`)
3. 없으면 `users`, `user_settings` 기본값 생성
4. JWT Access/Refresh Token 생성
5. Refresh Token DB 저장 또는 갱신

---

## 2. 토큰 재발급

* **HTTP Method**: POST
* **Endpoint**: `/api/auth/reissue`
* **설명**: Refresh Token을 검증한 뒤 새 Access/Refresh Token을 발급한다.
* **인증 필요 여부**: 불필요
* **권한 조건**: 없음
* **요청 헤더**:

  * Content-Type: application/json
* **데이터 소스**: DB(refresh_tokens) + JWT

### Request Body

| 필드명          | 타입     | 필수 여부 | 제약조건        | 설명                     |
| ------------ | ------ | ----- | ----------- | ---------------------- |
| refreshToken | String | 필수    | `@NotBlank` | 재발급에 사용할 Refresh Token |

### 요청 예시

```json
{
  "refreshToken": "refresh-token"
}
```

### 응답 데이터

| 필드명                  | 타입     | 설명                                 |
| -------------------- | ------ | ---------------------------------- |
| grantType            | String | `Bearer`                           |
| accessToken          | String | 새 Access Token                     |
| refreshToken         | String | 새 Refresh Token                    |
| accessTokenExpiresIn | Long   | 새 Access Token 만료 시각(epoch millis) |

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "grantType": "Bearer",
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token",
    "accessTokenExpiresIn": 1775750400000
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                  | 메시지                    | 발생 조건                    |
| --------- | ---------------------- | ---------------------- | ------------------------ |
| 400       | VALIDATION_ERROR       | 요청 값이 올바르지 않습니다.       | `refreshToken` 누락/공백     |
| 400       | AUTH_INVALID_TOKEN     | 토큰이 유효하지 않습니다.         | JWT 검증 실패                |
| 400       | AUTH_TOKEN_TYPE        | Refresh 토큰이 필요합니다.     | Access Token 등 잘못된 타입 전달 |
| 400       | AUTH_REFRESH_NOT_FOUND | Refresh 토큰이 존재하지 않습니다. | DB에 저장된 Refresh Token 없음 |
| 400       | AUTH_REFRESH_EXPIRED   | 만료된 Refresh 토큰입니다.     | 저장된 Refresh Token 만료     |
| 500       | INTERNAL_SERVER_ERROR  | 서버 오류가 발생했습니다.         | 기타 예외                    |

### 실패 응답 예시

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "토큰이 유효하지 않습니다.",
    "details": null
  }
}
```

---

## 3. 로그아웃

* **HTTP Method**: POST
* **Endpoint**: `/api/auth/logout`
* **설명**: 현재 사용자 기준으로 저장된 Refresh Token을 삭제한다.
* **인증 필요 여부**: 코드상 불명확
* **권한 조건**: 없음
* **요청 헤더**:

  * Authorization: Bearer {accessToken} (실사용상 필요해 보임)
* **데이터 소스**: DB(refresh_tokens)

### 요청 예시

```json
{}
```

### 응답 데이터

| 필드명 | 타입 | 설명 |
| --- | -- | -- |

### 성공 응답 예시

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지             | 발생 조건      |
| --------- | --------------------- | --------------- | ---------- |
| 400       | USER_NOT_FOUND        | 사용자를 찾을 수 없습니다. | 사용자 조회 실패  |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다.  | 인증 주입 실패 등 |

### 확인 포인트

`SecurityConfig`에서 `/api/auth/**` 전체가 `permitAll`이라서, 현재 구현상 `/logout`도 비인증 접근이 허용된다. 하지만 컨트롤러는 `@AuthenticationPrincipal Long userId`를 사용한다.

---

## 4. 테스트 로그인

* **HTTP Method**: POST
* **Endpoint**: `/api/auth/test-login`
* **설명**: 테스트용 계정(`test-kakao-10001`)으로 JWT를 발급한다.
* **인증 필요 여부**: 불필요
* **권한 조건**: 없음
* **요청 헤더**: 없음
* **데이터 소스**: DB(users, user_settings, refresh_tokens)

### 요청 예시

```json
{}
```

### 응답 데이터

로그인 API와 동일

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "grantType": "Bearer",
    "accessToken": "access-token",
    "refreshToken": "refresh-token",
    "accessTokenExpiresIn": 1775750400000
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건        |
| --------- | --------------------- | -------------- | ------------ |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | DB/JWT 처리 실패 |

### 확인 필요 사항

* `TestAuthController`에 `@Profile` 제한이 없다. 현재 코드 기준으로는 운영 환경에서도 노출될 수 있다.
* `TestLoginRequest` DTO는 존재하지만 실제로 사용되지 않는다.

---

## 5. 가이드 이미지 업로드

* **HTTP Method**: POST
* **Endpoint**: `/api/guide/image`
* **설명**: 클라이언트가 업로드한 이미지를 FastAPI 분석 서버로 전달한다.
* **인증 필요 여부**: 필요
* **권한 조건**: JWT Access Token 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
  * Content-Type: multipart/form-data
* **데이터 소스**: 외부 API(FastAPI)

### Request Body

| 필드명         | 타입            | 필수 여부 | 제약조건            | 설명      |
| ----------- | ------------- | ----- | --------------- | ------- |
| image       | MultipartFile | 필수    | 이미지 타입, 10MB 이하 | 분석할 이미지 |
| captured_at | String        | 필수    | 빈 문자열 불가        | 촬영 시각   |

### 요청 예시

multipart/form-data

* `image`: 파일
* `captured_at`: `"2026-04-10T00:00:00"`

### 응답 데이터

없음

### 성공 응답 예시

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지               | 발생 조건                                 |
| --------- | --------------------- | ----------------- | ------------------------------------- |
| 401       | AUTH_INVALID_TOKEN    | 토큰이 유효하지 않습니다.    | JWT 필터 검증 실패                          |
| 401       | AUTH_TOKEN_TYPE       | Access 토큰이 필요합니다. | Refresh Token 전달                      |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다.    | `GuideException`이 공통 핸들러에서 별도 처리되지 않음 |

### 내부 처리 흐름

1. 이미지/사용자/captured_at 검증
2. multipart로 FastAPI `/api/analyze` 호출
3. 응답 본문 없이 성공 여부만 반영

### 확인 필요 사항

`GuideErrorCode`에는 세부 상태코드가 정의되어 있으나, `GlobalExceptionHandler`가 `GuideException`을 처리하지 않아 실제 응답은 대부분 500으로 귀결된다.

---

## 6. 가이드 이벤트 수신

* **HTTP Method**: POST
* **Endpoint**: `/api/guide/event`
* **설명**: 가이드 이벤트를 수신해 WebSocket 사용자 큐(`/user/queue/guide`)로 전달한다.
* **인증 필요 여부**: 필요
* **권한 조건**: JWT Access Token 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
  * Content-Type: application/json
* **데이터 소스**: WebSocket 메시지 브로커

### Request Body

| 필드명                  | 타입      | 필수 여부 | 제약조건   | 설명            |
| -------------------- | ------- | ----- | ------ | ------------- |
| user_id              | String  | 필수    | 빈 값 불가 | 대상 사용자 ID 문자열 |
| status               | String  | 필수    | 빈 값 불가 | 이벤트 상태        |
| processed_at         | String  | 선택    |        | 처리 시각         |
| processing_time_ms   | Integer | 선택    |        | 처리 시간(ms)     |
| guide_text           | String  | 필수    | 빈 값 불가 | 안내 문구         |
| primary_object_class | String  | 선택    |        | 주요 객체 분류      |
| clock_direction      | String  | 선택    |        | 방향 정보         |
| distance             | String  | 선택    |        | 거리 정보         |
| alert_level          | String  | 선택    |        | 경고 레벨         |

### 요청 예시

```json
{
  "user_id": "1",
  "status": "SUCCESS",
  "processed_at": "2026-04-10T00:00:00",
  "processing_time_ms": 120,
  "guide_text": "전방 3시 방향에 장애물이 있습니다.",
  "primary_object_class": "chair",
  "clock_direction": "3",
  "distance": "1.2m",
  "alert_level": "HIGH"
}
```

### 응답 데이터

없음

### 성공 응답 예시

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건                             |
| --------- | --------------------- | -------------- | --------------------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | `GuideException` 발생 시 실제 공통 처리 결과 |

---

## 7. 보행 경로 조회

* **HTTP Method**: POST
* **Endpoint**: `/api/navigation/routes`
* **설명**: TMAP 보행자 경로 API를 호출해 경로를 반환한다.
* **인증 필요 여부**: 필요
* **권한 조건**: JWT Access Token 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
  * Content-Type: application/json
* **데이터 소스**: 외부 API(TMAP 보행자 경로 API)

### Request Body

| 필드명       | 타입     | 필수 여부     | 제약조건 | 설명     |
| --------- | ------ | --------- | ---- | ------ |
| startX    | String | 코드상 필수 아님 |      | 출발지 경도 |
| startY    | String | 코드상 필수 아님 |      | 출발지 위도 |
| endX      | String | 코드상 필수 아님 |      | 도착지 경도 |
| endY      | String | 코드상 필수 아님 |      | 도착지 위도 |
| startName | String | 코드상 필수 아님 |      | 출발지명   |
| endName   | String | 코드상 필수 아님 |      | 도착지명   |

### 요청 예시

```json
{
  "startX": "126.97843",
  "startY": "37.56668",
  "endX": "126.98200",
  "endY": "37.57000",
  "startName": "출발지",
  "endName": "도착지"
}
```

### 응답 데이터

| 필드명           | 타입      | 설명       |
| ------------- | ------- | -------- |
| totalDistance | Integer | 총 거리     |
| totalTime     | Integer | 총 소요 시간  |
| steps         | Array   | 경로 스텝 목록 |

`steps`는 두 형태가 있다.

1. Point Step

* type
* latitude
* longitude
* description
* turnType
* pointType

2. Line Step

* type
* path
* distance
* time

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "totalDistance": 722,
    "totalTime": 640,
    "steps": [
      {
        "type": "POINT",
        "latitude": 37.56646,
        "longitude": 126.97835,
        "description": "보행자도로를 따라 65m 이동",
        "turnType": 200,
        "pointType": "SP"
      }
    ]
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건                |
| --------- | --------------------- | -------------- | -------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | TMAP API 오류, 파싱 오류 등 |

---

## 8. 주변 카테고리 장소 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/places/nearby`
* **설명**: 특정 카테고리 1개에 대해 주변 장소를 카카오 로컬 API에서 여러 페이지 수집 후 거리순 정렬해 반환한다.
* **인증 필요 여부**: 불필요
* **권한 조건**: 없음
* **요청 헤더**: 없음
* **데이터 소스**: 외부 API(Kakao Local Category Search) + 캐시(조회 결과 저장)

### Query Parameter

| 필드명             | 타입     | 필수 여부 | 기본값  | 설명                                      |
| --------------- | ------ | ----- | ---- | --------------------------------------- |
| lat             | double | 필수    |      | 기준 위도                                   |
| lng             | double | 필수    |      | 기준 경도                                   |
| radius          | int    | 선택    | 3000 | 검색 반경(m), `@Min(0)`, `@Max(20000)`      |
| code            | String | 필수    |      | 카테고리 코드. 현재 구현상 정확히 1개만 허용              |
| sizePerCategory | int    | 선택    | 10   | 카카오 API 페이지당 사이즈, `@Min(1)`, `@Max(30)` |
| page            | int    | 선택    | 1    | 응답 페이지 번호, `@Min(1)`, `@Max(45)`        |
| size            | int    | 선택    | 10   | 최종 응답 페이지 사이즈, `@Min(1)`, `@Max(15)`    |

### 요청 예시

```json
{
  "lat": 37.61029,
  "lng": 126.99849,
  "radius": 3000,
  "code": "CS2",
  "sizePerCategory": 10,
  "page": 1,
  "size": 10
}
```

### 응답 데이터

| 필드명     | 타입                   | 설명           |
| ------- | -------------------- | ------------ |
| items   | Array<PlaceResponse> | 장소 목록        |
| page    | int                  | 요청 페이지       |
| size    | int                  | 요청 크기        |
| total   | int                  | 전체 개수        |
| hasNext | boolean              | 다음 페이지 존재 여부 |

`PlaceResponse`

* placeId: String
* name: String
* category: String
* roadAddress: String
* lat: double
* lng: double
* distanceM: Long
* directionClock: Integer

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "placeId": "ext:KAKAO:12345",
        "name": "편의점",
        "category": "편의점 > 생활",
        "roadAddress": "서울특별시 ...",
        "lat": 37.61,
        "lng": 126.99,
        "distanceM": 120,
        "directionClock": 3
      }
    ],
    "page": 1,
    "size": 10,
    "total": 23,
    "hasNext": true
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건                                                                   |
| --------- | --------------------- | -------------- | ----------------------------------------------------------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | `IllegalArgumentException`, `ConstraintViolationException`, 외부 API 오류 등 |

### 확인 필요 사항

* `code` 누락/복수 전달 시 `IllegalArgumentException`을 던지므로 현재 공통 처리상 500이 된다.
* `@RequestParam` 제약 위반(`@Min`, `@Max`)에 대한 `ConstraintViolationException` 핸들러가 없어 실제 응답 상태는 확인 필요하다.

---

## 9. 장소 검색

* **HTTP Method**: GET
* **Endpoint**: `/api/places/search`
* **설명**: 키워드로 장소를 검색한다.
* **인증 필요 여부**: 불필요
* **권한 조건**: 없음
* **요청 헤더**: 없음
* **데이터 소스**: 외부 API(Kakao Local Keyword Search) + 캐시

### Query Parameter

| 필드명    | 타입     | 필수 여부 | 기본값  | 설명                                 |
| ------ | ------ | ----- | ---- | ---------------------------------- |
| query  | String | 필수    |      | 검색어                                |
| lat    | double | 필수    |      | 기준 위도                              |
| lng    | double | 필수    |      | 기준 경도                              |
| radius | int    | 선택    | 3000 | 검색 반경(m), `@Min(0)`, `@Max(20000)` |
| page   | int    | 선택    | 1    | 요청 페이지, `@Min(1)`, `@Max(45)`      |
| size   | int    | 선택    | 10   | 요청 크기, `@Min(1)`, `@Max(15)`       |

### 요청 예시

```json
{
  "query": "국민대학교",
  "lat": 37.61029,
  "lng": 126.99849,
  "radius": 3000,
  "page": 1,
  "size": 10
}
```

### 응답 데이터

`PlacePageResponse`

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "size": 10,
    "total": 0,
    "hasNext": false
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지               | 발생 조건       |
| --------- | --------------------- | ----------------- | ----------- |
| 400       | BAD_REQUEST           | query is required | 검색어 공백      |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다.    | 외부 API 오류 등 |

### 내부 처리 흐름

* 입력 page/size는 카카오 API 제한에 맞춰 내부적으로 보정된다.

  * page: 1~45
  * size: 1~15

---

## 10. 장소 상세 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/places/{placeId}`
* **설명**: 캐시에 저장된 장소 상세 정보를 조회한다. 인증 사용자가 조회하면 최근 검색 장소로 기록한다.
* **인증 필요 여부**: 선택
* **권한 조건**: 인증 시 최근 검색 기록 저장
* **요청 헤더**:

  * Authorization: Bearer {accessToken} (선택)
* **데이터 소스**: 캐시 + 인증 시 DB(최근 검색 저장)

### Path Variable

| 필드명     | 타입     | 필수 여부 | 설명                        |
| ------- | ------ | ----- | ------------------------- |
| placeId | String | 필수    | `ext:KAKAO:{id}` 형태의 캐시 키 |

### 응답 데이터

| 필드명                 | 타입          | 설명              |
| ------------------- | ----------- | --------------- |
| placeId             | String      | 장소 ID           |
| name                | String      | 장소명             |
| category            | String      | 카테고리            |
| address             | String      | 지번 주소           |
| roadAddress         | String      | 도로명 주소          |
| lat                 | double      | 위도              |
| lng                 | double      | 경도              |
| distanceFromCenterM | Long        | 기준 거리           |
| phone               | String      | 전화번호            |
| placeUrl            | String      | 카카오 장소 URL      |
| openingHours        | Object/null | 현재 구현상 항상 null  |
| extra.provider      | String      | 제공자. 현재 `KAKAO` |

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "placeId": "ext:KAKAO:12345",
    "name": "국민대학교",
    "category": "교육,학문 > 대학",
    "address": "서울특별시 ...",
    "roadAddress": "서울특별시 ...",
    "lat": 37.61,
    "lng": 126.99,
    "distanceFromCenterM": 200,
    "phone": "02-000-0000",
    "placeUrl": "https://place.map.kakao.com/12345",
    "openingHours": null,
    "extra": {
      "provider": "KAKAO"
    }
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드           | 메시지                                 | 발생 조건        |
| --------- | --------------- | ----------------------------------- | ------------ |
| 400       | BAD_REQUEST     | placeId is required                 | placeId 공백   |
| 400       | PLACE_NOT_FOUND | place not found in cache: {placeId} | 캐시에 없는 장소 조회 |

---

## 11. 지오코딩

* **HTTP Method**: GET
* **Endpoint**: `/api/places/geocode`
* **설명**: 주소/검색어를 좌표로 변환한다.
* **인증 필요 여부**: 불필요
* **데이터 소스**: 외부 API(Kakao Address Search)

### Query Parameter

| 필드명   | 타입     | 필수 여부 | 기본값 | 설명        |
| ----- | ------ | ----- | --- | --------- |
| query | String | 필수    |     | 주소/장소 검색어 |

### 응답 데이터

| 필드명         | 타입     | 설명     |
| ----------- | ------ | ------ |
| query       | String | 입력 검색어 |
| address     | String | 지번 주소  |
| roadAddress | String | 도로명 주소 |
| lat         | double | 위도     |
| lng         | double | 경도     |

### 실패 응답

| HTTP 상태코드 | 에러 코드              | 메시지                               | 발생 조건    |
| --------- | ------------------ | --------------------------------- | -------- |
| 400       | BAD_REQUEST        | query is required                 | query 공백 |
| 400       | PLACE_NOT_FOUND    | geocode result not found          | 결과 없음    |
| 400       | EXTERNAL_API_ERROR | invalid y value from external api | 위도 파싱 실패 |
| 400       | EXTERNAL_API_ERROR | invalid x value from external api | 경도 파싱 실패 |

---

## 12. 역지오코딩

* **HTTP Method**: GET
* **Endpoint**: `/api/places/reverse-geocode`
* **설명**: 좌표를 주소로 변환한다.
* **인증 필요 여부**: 불필요
* **데이터 소스**: 외부 API(Kakao Coord to Address)

### Query Parameter

| 필드명 | 타입     | 필수 여부 | 기본값 | 설명 |
| --- | ------ | ----- | --- | -- |
| lat | double | 필수    |     | 위도 |
| lng | double | 필수    |     | 경도 |

### 응답 데이터

| 필드명         | 타입     | 설명     |
| ----------- | ------ | ------ |
| address     | String | 지번 주소  |
| roadAddress | String | 도로명 주소 |
| lat         | double | 입력 위도  |
| lng         | double | 입력 경도  |

### 실패 응답

| HTTP 상태코드 | 에러 코드           | 메시지                               | 발생 조건    |
| --------- | --------------- | --------------------------------- | -------- |
| 400       | BAD_REQUEST     | lat must be between -90 and 90    | 위도 범위 오류 |
| 400       | BAD_REQUEST     | lng must be between -180 and 180  | 경도 범위 오류 |
| 400       | PLACE_NOT_FOUND | address not found for coordinates | 결과 없음    |

---

## 13. 내 즐겨찾기 목록 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/users/me/favorites`
* **설명**: 현재 사용자의 즐겨찾기 목록을 최신 생성순으로 조회한다.
* **인증 필요 여부**: 필요
* **권한 조건**: JWT Access Token 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
* **데이터 소스**: DB(favorite_places, users)

### Query Parameter

| 필드명  | 타입  | 필수 여부 | 기본값 | 설명                    |
| ---- | --- | ----- | --- | --------------------- |
| page | int | 선택    | 1   | `@Min(1)`             |
| size | int | 선택    | 15  | `@Min(1)`, `@Max(50)` |

### 응답 데이터

| 필드명        | 타입                           | 설명       |
| ---------- | ---------------------------- | -------- |
| items      | Array<FavoritePlaceResponse> | 목록       |
| page       | int                          | 요청 페이지   |
| size       | int                          | 요청 크기    |
| totalItems | long                         | 전체 건수    |
| totalPages | int                          | 전체 페이지 수 |

`FavoritePlaceResponse`

* id
* placeId
* name
* alias
* address
* lat
* lng
* category
* createdAt

### enum 값

`FavoritePlaceCategory`

* HOME
* WORK
* SCHOOL
* RESTAURANT_CAFE
* MART_CONVENIENCE
* HOSPITAL_PHARMACY
* ETC

### 실패 응답

| HTTP 상태코드 | 에러 코드              | 메시지               | 발생 조건            |
| --------- | ------------------ | ----------------- | ---------------- |
| 401       | AUTH_INVALID_TOKEN | 토큰이 유효하지 않습니다.    | JWT 검증 실패        |
| 401       | AUTH_TOKEN_TYPE    | Access 토큰이 필요합니다. | Refresh Token 전달 |
| 400       | USER_NOT_FOUND     | 사용자를 찾을 수 없습니다.   | 사용자 없음           |

### 페이징 정책

* 외부 요청: 1부터 시작
* 내부 JPA `PageRequest`: 0부터 시작
* 구현은 `Math.max(page, 1) - 1`로 변환되어 정상 동작

---

## 14. 즐겨찾기 등록

* **HTTP Method**: POST
* **Endpoint**: `/api/users/me/favorites`
* **설명**: 즐겨찾기를 등록한다.
* **인증 필요 여부**: 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
  * Content-Type: application/json
* **데이터 소스**: DB(favorite_places, users)

### Request Body

| 필드명      | 타입                    | 필수 여부 | 제약조건                                                    | 설명    |
| -------- | --------------------- | ----- | ------------------------------------------------------- | ----- |
| placeId  | String                | 필수    | `@NotBlank`, `@Size(max=128)`                           | 장소 ID |
| name     | String                | 필수    | `@NotBlank`, `@Size(max=255)`                           | 장소명   |
| alias    | String                | 선택    | `@Size(max=255)`                                        | 별칭    |
| address  | String                | 선택    | `@Size(max=500)`                                        | 주소    |
| lat      | Double                | 필수    | `@NotNull`, `@DecimalMin(-90.0)`, `@DecimalMax(90.0)`   | 위도    |
| lng      | Double                | 필수    | `@NotNull`, `@DecimalMin(-180.0)`, `@DecimalMax(180.0)` | 경도    |
| category | FavoritePlaceCategory | 필수    | `@NotNull`                                              | 카테고리  |

### 성공 응답 데이터

| 필드명      | 타입                    | 설명          |
| -------- | --------------------- | ----------- |
| created  | boolean               | 생성 여부       |
| id       | Long                  | 생성된 즐겨찾기 ID |
| category | FavoritePlaceCategory | 저장된 카테고리    |

### 실패 응답

| HTTP 상태코드 | 에러 코드                   | 메시지                        | 발생 조건     |
| --------- | ----------------------- | -------------------------- | --------- |
| 400       | VALIDATION_ERROR        | 요청 값이 올바르지 않습니다.           | DTO 검증 실패 |
| 400       | FAVORITE_ALREADY_EXISTS | 이미 즐겨찾기에 등록된 장소입니다.        | 중복 등록     |
| 400       | FAVORITE_LIMIT_EXCEEDED | 즐겨찾기는 최대 50개까지 등록할 수 있습니다. | 최대 개수 초과  |
| 400       | USER_NOT_FOUND          | 사용자를 찾을 수 없습니다.            | 사용자 없음    |

---

## 15. 즐겨찾기 삭제

* **HTTP Method**: DELETE
* **Endpoint**: `/api/users/me/favorites/{id}`
* **설명**: 지정한 즐겨찾기를 삭제한다.
* **인증 필요 여부**: 필요

### Path Variable

| 필드명 | 타입   | 필수 여부 | 설명      |
| --- | ---- | ----- | ------- |
| id  | Long | 필수    | 즐겨찾기 ID |

### 응답 데이터

| 필드명     | 타입      | 설명       |
| ------- | ------- | -------- |
| deleted | boolean | 삭제 성공 여부 |

### 실패 응답

| HTTP 상태코드 | 에러 코드              | 메시지                 | 발생 조건           |
| --------- | ------------------ | ------------------- | --------------- |
| 400       | FAVORITE_NOT_FOUND | 해당 즐겨찾기를 찾을 수 없습니다. | id/userId 조합 없음 |
| 400       | USER_NOT_FOUND     | 사용자를 찾을 수 없습니다.     | 사용자 없음          |

---

## 16. 최근 검색 장소 목록 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/users/me/recent`
* **설명**: 최근 검색 장소 목록을 조회한다.
* **인증 필요 여부**: 필요
* **데이터 소스**: DB(place_recent_search)

### Query Parameter

| 필드명  | 타입  | 필수 여부 | 기본값 | 설명                     |
| ---- | --- | ----- | --- | ---------------------- |
| page | int | 선택    | 1   | `@Min(1)`              |
| size | int | 선택    | 20  | `@Min(1)`, `@Max(100)` |

### 응답 데이터

| 필드명        | 타입    | 설명       |
| ---------- | ----- | -------- |
| items      | Array | 최근 검색 목록 |
| page       | int   | 요청 페이지   |
| size       | int   | 요청 크기    |
| totalItems | long  | 전체 건수    |
| totalPages | int   | 전체 페이지 수 |

### 실패 응답

| HTTP 상태코드 | 에러 코드              | 메시지            | 발생 조건     |
| --------- | ------------------ | -------------- | --------- |
| 401       | AUTH_INVALID_TOKEN | 토큰이 유효하지 않습니다. | JWT 검증 실패 |

### 페이징 정책

* 컨트롤러 요청값은 1부터 시작
* 그러나 서비스 구현은 `PageRequest.of(Math.max(page, 1), ...)` 를 사용하므로, 코드상 `page=1`이 내부적으로 두 번째 페이지로 처리된다.

### 확인 필요 사항

실제 의도와 다르게 페이지 오프셋 버그가 있는 상태다.

---

## 17. 최근 검색 장소 1건 삭제

* **HTTP Method**: DELETE
* **Endpoint**: `/api/users/me/recent/{id}`
* **설명**: 최근 검색 장소 1건을 삭제한다.
* **인증 필요 여부**: 필요

### 응답 데이터

| 필드명     | 타입      | 설명    |
| ------- | ------- | ----- |
| deleted | boolean | 삭제 여부 |

### 특징

존재하지 않는 항목을 삭제해도 예외를 던지지 않고 `deleted: false`를 반환한다.

---

## 18. 최근 검색 장소 전체 삭제

* **HTTP Method**: DELETE
* **Endpoint**: `/api/users/me/recent`
* **설명**: 현재 사용자의 최근 검색 장소를 모두 삭제한다.
* **인증 필요 여부**: 필요

### 응답 데이터

| 필드명          | 타입  | 설명     |
| ------------ | --- | ------ |
| deletedCount | int | 삭제된 건수 |

---

## 19. 내 프로필 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/users/me/profile`
* **설명**: 현재 사용자 프로필을 조회한다.
* **인증 필요 여부**: 필요
* **데이터 소스**: DB(users)

### 응답 데이터

| 필드명         | 타입            | 설명         |
| ----------- | ------------- | ---------- |
| id          | Long          | 사용자 ID     |
| kakaoUserId | String        | 카카오 사용자 ID |
| nickname    | String        | 닉네임        |
| createdAt   | LocalDateTime | 생성일시       |
| updatedAt   | LocalDateTime | 수정일시       |

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건                       |
| --------- | --------------------- | -------------- | --------------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | `UserException`이 별도 처리되지 않음 |

---

## 20. 내 설정 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/users/me/settings`
* **설명**: 현재 사용자 설정을 조회한다.
* **인증 필요 여부**: 필요
* **데이터 소스**: DB(user_settings)

### 응답 데이터

| 필드명                  | 타입      | 설명           |
| -------------------- | ------- | ------------ |
| sentenceLength       | Integer | 문장 길이 설정     |
| vibrationStrength    | Integer | 진동 강도        |
| voiceGuidanceEnabled | Boolean | 음성 안내 활성화 여부 |

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건               |
| --------- | --------------------- | -------------- | ------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | `UserException` 미처리 |

---

## 21. 내 설정 수정

* **HTTP Method**: PATCH
* **Endpoint**: `/api/users/me/settings`
* **설명**: 현재 사용자 설정을 부분 수정한다.
* **인증 필요 여부**: 필요
* **요청 헤더**:

  * Authorization: Bearer {accessToken}
  * Content-Type: application/json
* **데이터 소스**: DB(user_settings)

### Request Body

| 필드명                  | 타입      | 필수 여부 | 제약조건 | 설명            |
| -------------------- | ------- | ----- | ---- | ------------- |
| sentenceLength       | Integer | 선택    | 없음   | null이면 기존값 유지 |
| vibrationStrength    | Integer | 선택    | 없음   | null이면 기존값 유지 |
| voiceGuidanceEnabled | Boolean | 선택    | 없음   | null이면 기존값 유지 |

### 요청 예시

```json
{
  "sentenceLength": 60,
  "vibrationStrength": 80,
  "voiceGuidanceEnabled": true
}
```

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "sentenceLength": 60,
    "vibrationStrength": 80,
    "voiceGuidanceEnabled": true
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건               |
| --------- | --------------------- | -------------- | ------------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | `UserException` 미처리 |

### 확인 필요 사항

입력값 범위 검증이 없다.

---

## 22. 날씨 조회

* **HTTP Method**: GET
* **Endpoint**: `/api/weather`
* **설명**: OpenWeather 현재 날씨를 조회한다.
* **인증 필요 여부**: 필요
* **데이터 소스**: 외부 API(OpenWeather)

### Query Parameter

| 필드명 | 타입     | 필수 여부 | 기본값 | 설명 |
| --- | ------ | ----- | --- | -- |
| lat | double | 필수    |     | 위도 |
| lon | double | 필수    |     | 경도 |

### 응답 데이터

| 필드명         | 타입     | 설명    |
| ----------- | ------ | ----- |
| weather     | String | 날씨 그룹 |
| description | String | 상세 설명 |
| temperature | double | 섭씨 온도 |
| windSpeed   | double | 풍속    |

### 성공 응답 예시

```json
{
  "success": true,
  "data": {
    "weather": "Clouds",
    "description": "broken clouds",
    "temperature": 18.2,
    "windSpeed": 2.6
  },
  "error": null
}
```

### 실패 응답

| HTTP 상태코드 | 에러 코드                 | 메시지            | 발생 조건             |
| --------- | --------------------- | -------------- | ----------------- |
| 500       | INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. | 외부 API 실패, 응답 비정상 |

---

# 공통 응답 구조

모든 API는 아래 공통 포맷을 사용한다.

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

실패 시:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": []
  }
}
```

구조:

* `success`: 성공 여부
* `data`: 성공 시 응답 데이터
* `error.code`: 에러 코드
* `error.message`: 에러 메시지
* `error.details`: Validation 세부 정보 배열 또는 null

---

# 공통 에러 처리

## 현재 구현된 핸들러

1. `MethodArgumentNotValidException`

   * HTTP 400
   * code: `VALIDATION_ERROR`

2. `BusinessException`

   * HTTP 400
   * code/message는 예외 생성값 사용

3. 그 외 `Exception`

   * HTTP 500
   * code: `INTERNAL_SERVER_ERROR`

## 주의사항

* `UserException`, `GuideException` 전용 핸들러가 없다.
* 각 enum에는 `HttpStatus`가 정의되어 있지만 실제 응답에 반영되지 않는다.
* `@RequestParam` 검증 실패용 `ConstraintViolationException` 핸들러가 없다.
* `IllegalArgumentException`도 별도 처리되지 않아 500이 될 수 있다.

---

# 인증 방식

## HTTP 인증

* JWT Bearer 방식
* 헤더 형식:

  * `Authorization: Bearer {accessToken}`

## JWT 필터 동작

* 토큰 유효성 검증 실패 시 401

  * `AUTH_INVALID_TOKEN`
* Access Token이 아닌 경우 401

  * `AUTH_TOKEN_TYPE`
* principal에는 `Long userId`가 저장되며 `@AuthenticationPrincipal Long userId`로 사용

## 인증 제외 경로

* `/api/auth/**`
* `/swagger-ui/**`
* `/v3/api-docs/**`
* `GET /api/places/**`

## 인증 필요 경로

* `/api/users/me/recent/**`
* `/api/users/me/favorites/**`
* 그 외 대부분 `authenticated()`

---

# 페이징 정책

## 장소 검색/근처 조회

* 외부 요청 page는 1부터 시작
* `PlacePageResponse.page`도 요청값 그대로 반환
* `/api/places/search`: 카카오 API 제한에 맞춰 내부 page 1~45, size 1~15로 보정
* `/api/places/nearby`: 서비스에서 전체 리스트 수집 후 컨트롤러에서 수동 페이징

## 즐겨찾기

* 외부 요청 page는 1부터 시작
* 내부 `PageRequest.of(page - 1, size)` 방식으로 정상 변환

## 최근 검색

* 외부 요청 page는 1부터 시작하도록 설계된 것으로 보이나
* 실제 구현은 `PageRequest.of(Math.max(page, 1), ...)`
* 코드 기준으로 page 오프셋 버그 존재

---

# 확인 필요 사항

* **로그아웃 인증 정책**: `/api/auth/**`가 모두 permitAll이라 `/logout`도 비인증 허용 상태다. `SecurityConfig` 수정 의도 확인 필요.
* ~~**테스트 로그인 노출 여부**: `/api/auth/test-login`이 프로필 제한 없이 활성화되어 있다. 운영 배포 의도 확인 필요.~~
* **UserException / GuideException 처리**: 각 예외 enum의 status가 실제 응답에 반영되지 않는다. `GlobalExceptionHandler` 보완 필요.
* **RequestParam 검증 예외 처리**: `@Min`, `@Max` 위반 시 어떤 응답을 표준으로 할지 `ConstraintViolationException` 핸들러 추가 필요.
* **최근 검색 페이징**: `RecentPlaceService.getRecent()`의 page 인덱스가 1-based/0-based 혼용으로 보인다.
* **/api/guide/event 인증 의도**: 현재 전체 나머지 API가 인증 필요라 이 엔드포인트도 인증 필요 상태다. FastAPI 서버 간 호출이라면 별도 허용 정책 검토 필요.
* **User settings 입력 검증**: `sentenceLength`, `vibrationStrength` 등에 허용 범위가 정의되어 있지 않다.