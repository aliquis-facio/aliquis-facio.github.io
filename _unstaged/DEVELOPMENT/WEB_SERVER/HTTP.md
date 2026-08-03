# HTTP란?

**HTTP(HyperText Transfer Protocol)** 는
브라우저(클라이언트)와 웹 서버가 서로 데이터를 주고받기 위한 **애플리케이션 계층 프로토콜**이야.

즉,

* 사용자가 브라우저에 주소를 입력하거나
* 링크를 클릭하거나
* 로그인 버튼을 누르면

브라우저가 서버에 **HTTP 요청(Request)** 을 보내고,
서버는 그에 대한 **HTTP 응답(Response)** 을 돌려준다.

예를 들어:

* 브라우저: “`/posts/1` 페이지 주세요”
* 서버: “여기 HTML입니다”
* 브라우저: 그 HTML을 렌더링해서 화면에 보여줌

---

# 왜 HTTP가 필요한가?

인터넷에서 컴퓨터끼리는 그냥 전기 신호나 바이트만 주고받는다고 해서 웹이 동작하지 않아.
서로 **어떤 형식으로**, **무슨 의미의 데이터인지**, **어떻게 요청하고 응답할지**에 대한 약속이 필요해.

HTTP는 바로 그 약속이야.

즉 HTTP는 다음을 정해 준다.

* 요청을 어떤 형태로 보낼지
* 응답을 어떤 형태로 받을지
* 어떤 종류의 작업인지
* 데이터 형식은 무엇인지
* 성공인지 실패인지 어떻게 표현할지

---

# HTTP의 위치

보통 네트워크를 계층적으로 보면 HTTP는 **애플리케이션 계층**에 속한다.

대략 아래처럼 생각하면 된다.

* **애플리케이션 계층**: HTTP
* **전송 계층**: TCP
* **인터넷 계층**: IP

즉 HTTP는 보통 **TCP 위에서 동작**한다.
그리고 HTTPS는 여기에 **TLS(암호화 계층)** 가 추가된 형태다.

흐름을 단순화하면:

`HTTP → TCP → IP`

---

# HTTP 통신의 기본 구조

HTTP는 기본적으로 **클라이언트-서버 모델**이다.

## 1. 클라이언트가 요청

브라우저나 앱이 서버에 요청을 보낸다.

예:

* 페이지 요청
* 로그인 요청
* 게시글 작성 요청
* 이미지 요청
* API 데이터 요청

## 2. 서버가 응답

서버는 요청을 처리한 뒤 응답을 보낸다.

예:

* HTML 문서
* JSON 데이터
* 이미지 파일
* 에러 메시지

---

# HTTP는 Stateless이다

HTTP의 가장 중요한 특징 중 하나가 **Stateless(무상태성)** 이야.

이 말은
**각 요청이 서로 독립적**이라는 뜻이다.

예를 들어:

1. 사용자가 로그인 요청을 보냄
2. 다음에 마이페이지 요청을 보냄

HTTP 자체는
“이 사용자가 방금 로그인했던 그 사용자다” 를 자동으로 기억하지 못한다.

즉 서버는 기본적으로 요청 하나만 보고 처리한다.

그래서 로그인 상태 유지를 위해 별도로 사용하는 것이:

* **쿠키(Cookie)**
* **세션(Session)**
* **JWT 토큰**

같은 메커니즘이다.

---

# HTTP 메시지 구조

HTTP는 요청과 응답 모두 **메시지** 형태로 오간다.

## 1. HTTP Request

요청 메시지는 대체로 이렇게 생긴다.

```http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

필요하면 body도 포함된다.

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "user1",
  "password": "1234"
}
```

### 요청의 구성 요소

#### 요청 라인(Request Line)

```http
GET /index.html HTTP/1.1
```

여기에는 3가지가 있다.

* **Method**: GET, POST 같은 요청 방식
* **Path**: 요청 대상 경로
* **HTTP Version**: 사용 중인 HTTP 버전

#### 헤더(Header)

부가 정보를 담는다.

예:

* Host
* User-Agent
* Accept
* Authorization
* Content-Type
* Cookie

#### 바디(Body)

실제로 서버에 전달할 데이터가 들어간다.

주로:

* JSON
* form 데이터
* 파일 업로드 데이터

---

## 2. HTTP Response

응답 메시지는 대체로 이렇게 생긴다.

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>
  <body>Hello</body>
</html>
```

### 응답의 구성 요소

#### 상태 라인(Status Line)

```http
HTTP/1.1 200 OK
```

* HTTP 버전
* 상태 코드
* 상태 메시지

#### 헤더(Header)

응답과 관련된 부가 정보

예:

* Content-Type
* Content-Length
* Set-Cookie
* Cache-Control

#### 바디(Body)

실제 응답 데이터

예:

* HTML
* JSON
* 이미지 바이너리
* 파일

---

# HTTP 메서드

HTTP 메서드는
“클라이언트가 서버에게 무엇을 하려는지”를 나타낸다.

---

## GET

**조회**를 위한 메서드

예:

* 게시글 목록 보기
* 특정 유저 정보 보기
* 웹페이지 가져오기

특징:

* 서버의 데이터를 가져오는 용도
* 보통 body를 거의 사용하지 않음
* URL에 쿼리 문자열을 붙여서 조건 전달 가능

예:

```http
GET /posts?page=2
```

---

## POST

**데이터 생성** 또는 처리 요청

예:

* 회원가입
* 로그인
* 게시글 작성

특징:

* 요청 body에 데이터를 담아서 보냄
* 서버 상태를 바꿀 가능성이 큼

---

## PUT

**전체 수정**

예:

* 기존 회원 정보 전체 업데이트

---

## PATCH

**부분 수정**

예:

* 닉네임만 변경
* 프로필 사진만 변경

---

## DELETE

**삭제**

예:

* 게시글 삭제
* 댓글 삭제

---

## HEAD

GET과 유사하지만 **본문 없이 헤더만** 받는다.

---

## OPTIONS

서버가 지원하는 메서드 등을 확인할 때 사용한다.
특히 **CORS preflight 요청**에서 많이 등장한다.

---

# HTTP 상태 코드

상태 코드는 서버가 요청 처리 결과를 숫자로 알려주는 것이다.

---

## 1xx: 정보 응답

잘 안 쓰는 편이지만 처리 중임을 나타냄

예:

* 100 Continue

---

## 2xx: 성공

요청이 성공적으로 처리됨

대표 예:

* **200 OK**: 정상 성공
* **201 Created**: 생성 성공
* **204 No Content**: 성공했지만 응답 body 없음

예:

* 게시글 조회 성공 → 200
* 회원가입 성공 → 201
* 삭제 성공 → 204

---

## 3xx: 리다이렉션

다른 위치로 이동해야 함

대표 예:

* **301 Moved Permanently**: 영구 이동
* **302 Found**: 임시 이동
* **304 Not Modified**: 캐시 사용 가능

---

## 4xx: 클라이언트 오류

요청을 잘못 보냄

대표 예:

* **400 Bad Request**: 잘못된 요청
* **401 Unauthorized**: 인증 필요
* **403 Forbidden**: 권한 없음
* **404 Not Found**: 리소스 없음
* **405 Method Not Allowed**: 허용되지 않은 메서드

---

## 5xx: 서버 오류

서버 내부 문제

대표 예:

* **500 Internal Server Error**
* **502 Bad Gateway**
* **503 Service Unavailable**

---

# URL과 HTTP의 관계

HTTP 요청은 보통 URL을 기반으로 이루어진다.

예:

```text
https://example.com:443/posts/10?sort=desc
```

구성 요소를 보면:

* **https**: 프로토콜
* **example.com**: 호스트
* **443**: 포트
* **/posts/10**: 경로
* **sort=desc**: 쿼리 문자열

브라우저는 이 URL을 해석해서 해당 서버에 HTTP 요청을 보낸다.

---

# 헤더는 왜 중요한가?

HTTP 헤더는 요청/응답의 메타데이터를 담는다.
실무에서는 헤더를 이해해야 API, 인증, 캐시, 파일 전송 등을 제대로 다룰 수 있다.

대표적인 헤더를 보자.

---

## 요청 헤더 예시

### Host

어느 호스트로 요청하는지 나타냄

```http
Host: example.com
```

### User-Agent

클라이언트 정보

```http
User-Agent: Mozilla/5.0
```

### Accept

받고 싶은 데이터 형식

```http
Accept: application/json
```

### Authorization

인증 정보

```http
Authorization: Bearer <token>
```

### Content-Type

보내는 body의 형식

```http
Content-Type: application/json
```

---

## 응답 헤더 예시

### Content-Type

응답 body 형식

```http
Content-Type: application/json
```

### Content-Length

본문 길이

```http
Content-Length: 512
```

### Set-Cookie

쿠키 저장 지시

```http
Set-Cookie: sessionid=abc123
```

### Cache-Control

캐시 정책

```http
Cache-Control: max-age=3600
```

---

# MIME Type / Content-Type

서버는 응답 body가 어떤 종류의 데이터인지 알려줘야 한다.
이때 쓰는 것이 **Content-Type** 이다.

예:

* `text/html` → HTML 문서
* `application/json` → JSON 데이터
* `text/css` → CSS
* `application/javascript` → JavaScript
* `image/png` → PNG 이미지
* `multipart/form-data` → 파일 업로드 폼 데이터

브라우저는 이 값을 보고 데이터를 어떻게 처리할지 결정한다.

---

# HTTP 요청 예시 1: 웹페이지 보기

사용자가 브라우저에 주소를 입력:

```text
http://example.com
```

그러면 내부적으로 대략 이런 일이 일어난다.

1. 브라우저가 DNS 조회
2. 서버 IP를 찾음
3. TCP 연결
4. HTTP 요청 전송
5. 서버가 HTML 응답
6. 브라우저가 HTML 해석
7. CSS, JS, 이미지가 있으면 추가 HTTP 요청

즉 웹페이지 하나를 여는 것도 사실은
**여러 개의 HTTP 요청/응답**으로 이루어진다.

---

# HTTP 요청 예시 2: 로그인

클라이언트가 로그인 정보를 보냄

```http
POST /login HTTP/1.1
Content-Type: application/json

{
  "username": "alice",
  "password": "1234"
}
```

서버가 로그인 성공 시 응답:

```http
HTTP/1.1 200 OK
Set-Cookie: sessionid=xyz789
Content-Type: application/json

{
  "message": "login success"
}
```

이후 브라우저는 쿠키를 저장하고
다음 요청부터 자동으로 쿠키를 포함해서 서버에 보낼 수 있다.

---

# 쿠키와 세션

HTTP는 무상태라서 상태 유지를 따로 해야 한다고 했지.
그때 핵심이 쿠키와 세션이야.

## 쿠키

브라우저에 저장되는 작은 데이터

서버가 응답에서:

```http
Set-Cookie: sessionid=abc123
```

를 보내면, 브라우저가 저장한다.

이후 같은 서버에 요청할 때:

```http
Cookie: sessionid=abc123
```

를 자동으로 붙여 보낸다.

## 세션

실제 로그인 상태 정보는 보통 서버에 저장하고,
클라이언트는 그 세션을 식별할 ID만 쿠키로 가진다.

즉:

* 브라우저: 세션 ID 보관
* 서버: 세션 데이터 보관

---

# HTTP와 HTTPS의 차이

## HTTP

암호화되지 않은 평문 통신

즉 중간에서 패킷을 보면 내용이 노출될 수 있다.

## HTTPS

HTTP + TLS(SSL)
암호화된 안전한 통신

장점:

* 데이터 도청 방지
* 위변조 방지
* 서버 신뢰성 검증 가능

오늘날 로그인, 결제, 개인정보 처리뿐 아니라
일반 사이트도 거의 HTTPS를 기본으로 쓴다.

---

# HTTP의 비연결성과 지속 연결

초기 HTTP에서는 요청 하나마다 연결을 새로 맺고 끊는 방식이 비효율적이었다.

그래서 HTTP/1.1에서는 **keep-alive**, 즉 **지속 연결** 개념이 일반화되었다.

즉 한 번 TCP 연결을 맺으면 여러 요청/응답에 재사용할 수 있다.

이렇게 하면:

* 연결 생성 비용 감소
* 속도 향상
* 서버/클라이언트 부담 감소

---

# HTTP 버전별 특징

## HTTP/1.0

* 요청마다 연결을 새로 맺는 경향
* 비효율적

## HTTP/1.1

* persistent connection 기본화
* Host 헤더 필수
* 현재도 개념 학습용으로 많이 사용

## HTTP/2

* 성능 개선이 핵심
* 하나의 연결에서 여러 요청을 병렬적으로 처리
* 헤더 압축
* 훨씬 빠름

## HTTP/3

* TCP 대신 QUIC(UDP 기반) 사용
* 지연 감소
* 연결 복구 성능 개선

웹서버 프로그래밍 입문에서는 보통
**HTTP/1.1 구조를 먼저 정확히 이해하는 것**이 가장 중요하다.

---

# HTTP와 REST API

웹 개발에서 HTTP는 단순히 HTML만 주고받는 게 아니라
API 통신의 핵심이기도 하다.

예를 들어 REST API에서는 HTTP 메서드와 상태 코드를 적극적으로 활용한다.

예:

* `GET /posts` → 게시글 목록 조회
* `GET /posts/1` → 게시글 1개 조회
* `POST /posts` → 게시글 생성
* `PATCH /posts/1` → 게시글 수정
* `DELETE /posts/1` → 게시글 삭제

응답은 보통 JSON:

```json
{
  "id": 1,
  "title": "hello"
}
```

---

# HTTP는 텍스트 기반 프로토콜인가?

HTTP/1.1은 사람이 읽을 수 있는 **텍스트 기반** 메시지 구조를 가진다.
그래서 디버깅할 때 이해하기 좋다.

예:

```http
GET /hello HTTP/1.1
Host: example.com
```

하지만 HTTP/2 이후에는 내부 전송 방식이 더 바이너리화되어 있다.
그래도 개념상 요청/응답, 메서드, 헤더, 상태 코드라는 핵심은 동일하다.

---

# HTTP의 핵심 특징 정리

## 1. 클라이언트-서버 구조

클라이언트가 요청하고 서버가 응답한다.

## 2. 무상태성

각 요청은 독립적이다.

## 3. 요청-응답 기반

항상 요청이 먼저 있고 응답이 따라온다.

## 4. 확장 가능성

헤더, 메서드, 상태 코드 등을 통해 다양한 웹 기능을 지원한다.

## 5. 범용성

HTML뿐 아니라 JSON, 이미지, 파일, 동영상 등 거의 모든 데이터 전달 가능

---

# Django나 FastAPI에서 HTTP가 어떻게 보이냐?

웹 프레임워크에서는 HTTP가 코드에서 이렇게 대응된다.

## Django 예시

```python
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, HTTP")
```

* `request`는 클라이언트가 보낸 HTTP 요청
* `HttpResponse`는 서버가 돌려주는 HTTP 응답

## FastAPI 예시

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "Hello, HTTP"}
```

여기서도 결국:

* 클라이언트가 `GET /hello` 요청
* 서버가 JSON 응답

이라는 HTTP 흐름이 그대로 작동한다.

---

# HTTP와 WebSocket의 차이

이건 웹서버 프로그래밍에서 자주 헷갈리는 부분이야.

## HTTP

* 요청이 오면 응답하고 끝
* 기본적으로 단방향 요청-응답 모델
* 매번 요청이 필요함

## WebSocket

* 한 번 연결 후 계속 유지
* 서버도 클라이언트에게 먼저 데이터 전송 가능
* 실시간 채팅, 알림, 게임 등에 적합

즉:

* 게시글 조회, 로그인, 일반 API → HTTP
* 실시간 채팅, 실시간 알림 → WebSocket

---

# 실제 개발에서 자주 보는 HTTP 문제

## 1. 404 Not Found

경로가 잘못됨

예:

* URL 오타
* 라우팅 미설정

## 2. 405 Method Not Allowed

메서드가 맞지 않음

예:

* `GET`만 허용한 API에 `POST` 요청

## 3. 400 Bad Request

요청 데이터 형식이 잘못됨

예:

* JSON 형식 오류
* 필수값 누락

## 4. 401 / 403

인증이나 권한 문제

## 5. CORS 문제

브라우저에서 다른 출처의 서버로 요청할 때 정책 위반

---

# 한 문장으로 HTTP를 정리하면

HTTP는
**웹에서 클라이언트와 서버가 요청과 응답을 주고받기 위한 표준 통신 규약**이다.

---

# 꼭 이해해야 하는 핵심만 다시 압축하면

HTTP를 공부할 때 가장 먼저 잡아야 할 건 6개야.

1. **Request / Response 구조**
2. **Method(GET, POST, PUT, PATCH, DELETE)**
3. **Status Code(200, 404, 500 등)**
4. **Header와 Body**
5. **Stateless와 Cookie/Session**
6. **HTTP와 HTTPS 차이**

이 6개를 이해하면 Django, FastAPI, REST API, 브라우저 네트워크 탭까지 전부 연결된다.