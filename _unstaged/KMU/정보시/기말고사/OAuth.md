## 1. OAuth 2.0이 필요한 이유

기존 방식:  
우리 서비스(Mine)가 사용자(User)의 구글/페북 계정(Their)에 접근하려고 할 때, 사용자의 **ID/비밀번호를 직접 받아서** Their에 로그인하는 방식이었음.  
→ 문제점:

- 처음 보는 서비스에 계정 비밀번호를 맡겨야 해서 **사용자 입장에서 매우 불안**함
- 우리 서비스 쪽에서도 비밀번호를 안전하게 보관·관리해야 하는 부담이 생김
- 한 번 비밀번호를 넘겨주면 Their의 **모든 기능**에 접근 가능해서, 최소 권한 원칙이 깨짐

**OAuth 2.0의 핵심 목적**  
→ 사용자의 ID/비밀번호를 공유하지 않고, **access token**이라는 토큰을 이용해, 필요한 기능(scope)만 최소 권한으로 위임해서 쓰게 해주는 표준 프로토콜.

## 2. 등장인물(역할) 정리

1. **Resource Owner**
    - 자원의 실제 주인, 즉 **사용자(User)**
    - 예: 내 구글 캘린더, 내 페북 글
2. **Client**
    - 우리가 만드는 서비스(Mine)
    - 사용자를 대신해 Resource Server의 API를 호출해서 데이터 조회/생성/수정/삭제를 하고 싶어하는 쪽
3. **Resource Server**
    - 실제 데이터를 들고 있는 서버 (Google API 서버, Facebook Graph API 등)
    - “Their”라고 부르던 그 서비스
4. **Authorization Server**
    - 로그인/권한 동의/토큰 발급을 담당하는 서버
    - 공식 스펙에선 Resource Server와 분리되지만, 생활코딩 강의 및 블로그들은 두 개를 묶어서 Resource Server로 다루기도 함

## 3. 사전 준비: 등록(Register)

Client가 외부 서비스의 자원을 쓰려면 먼저 **개발자 콘솔 같은 곳에 ‘앱 등록’**을 해야 해. 이를 Register라고 부름.

등록 시 공통적으로 오가는 정보:
- **Client ID**
    - Resource Server가 “어느 서비스에서 온 요청인지” 구분하는 **식별자**
- **Client Secret
    - Client ID에 대응되는 **비밀번호
    - 절대 외부에 노출되면 안 되고, 보통 서버 측에서만 안전하게 관리
- **Authorized Redirect URI(s)
    - 나중에 Authorization Server가 **authorization code나 토큰 등을 되돌려 줄 콜백 주소**
    - 등록된 URI와 다르면 요청을 무시

등록을 마치면 Resource Server는 이 **Client ID / Secret / Redirect URI** 정보를 기억하고, Client 쪽에서도 이 값들을 저장해서 이후 흐름에서 사용함.

## 4. 권한 위임 흐름: Authorization Code Grant
### 4-1. Resource Owner의 승인 (사용자 동의 단계)

1. 사용자가 우리 서비스(Client)에 접속해서 **“Google로 로그인”, “Facebook으로 연동”** 같은 버튼을 클릭
2. 이 버튼은 사실 다음과 비슷한 URL로 redirect 하는 링크:
    ```text
    https://resource.server/authorize?
      client_id={클라이언트ID}
      &scope={요청할 기능 목록}
      &redirect_uri={https://client/callback}
      &response_type=code
    ```
3. 사용자가 아직 Resource Server에 로그인 안 되어 있으면 **로그인 화면**을 보여줌
4. 로그인 성공 후 Resource Server는
    - client_id가 등록된 앱인지
    - redirect_uri가 등록된 URI와 정확히 일치하는지를 확인함        
5. 모두 OK라면 “이 앱이 A, B, C 기능에 접근하려고 하는데 허용하겠습니까?” 같은 **동의 화면(scope)** 을 보여줌
6. 사용자가 예를 들어 B, C만 허용하면, Resource Server는 DB에  `user_id = 1 → scope: B, C 허용` 처럼 **어떤 사용자에게 어떤 권한을 줬는지 기록**함

이 단계까지가 **“사용자(Resource Owner)의 승인”** 이고, 아직 토큰은 발급되지 않은 상태야.

### 4-2. Authorization Code 발급 (Resource Server 1차 승인)

1. Resource Server는 바로 access token을 주지 않고, 먼저 **임시 비밀번호 역할의 `authorization code`** 를 발급함
2. 이 코드는 보통 다음처럼 **redirect_uri로 리다이렉트**하면서 URL 쿼리로 전달됨:
    ```text
    Location: https://client/callback?code={authorization_code}
    ```
3. 사용자의 브라우저는 이 Location으로 이동하면서, 우리 서비스(Client)의 `/callback` 엔드포인트가 **code 값을 알게 됨**
4. 이 시점에서 authorization code는 “짧은 유효기간 + 1회용”에 가까운 개념이야.

### 4-3. Access Token 발급 요청 (Resource Server 2차 승인)

이제부터는 브라우저가 아니라 **우리 서버(Client 서버)** 가 Resource Server에 직접 통신해.

1. Client는 받은 `authorization_code`를 가지고 **Token Endpoint**에 다음과 같은 요청을 보냄:
    ```text
    POST https://resource.server/token
    grant_type=authorization_code&
    code={authorization_code}&
    redirect_uri={https://client/callback}&
    client_id={client_id}&
    client_secret={client_secret}
    ```
2. 여기서 중요한 점
    - **client_secret을 포함**한다는 것
    - 그래서 이 요청은 **서버-서버 통신(백엔드)** 으로 보내야 하고, 브라우저나 JS에서 노출되면 안 됨
3. Resource Server는 전달받은
    - authorization_code
    - client_id / client_secret
    - redirect_uri  
        를 모두 검증해서 일치하면 다음 단계로 넘어감

### 4-4. Access Token (및 Refresh Token) 발급

검증이 끝나면 Resource Server는 마지막으로:
1. 사용된 **authorization code는 폐기**하고
2. 새로 **Access Token** (필요시 **Refresh Token**도 함께) 을 생성
3. 그 값을 Client에게 응답으로 반환함

Client는 이 토큰들을 DB나 서버 세션 등에 안전하게 저장해 두고, 이후 사용자 대신 Resource Server API를 호출할 때 사용하게 돼.

## 5. Access Token & Refresh Token
### 5-1. Access Token

- OAuth의 **핵심 결과물**
- Client가 Resource Server의 API를 호출할 때, `“이 요청은 user_id=1에 대해 B, C 기능을 쓸 수 있는 권한이 있음”` 을 증명하는 값
- 보통 유효기간이 짧음 (수 시간 ~ 길어도 일정 기간)
- 만료된 토큰으로 API를 호출하면 **권한 없음/만료 응답**을 받게 됨

### 5-2. Refresh Token

- Access Token이 만료됐을 때, 다시 사용자 동의를 받지 않고 **새 Access Token을 발급받기 위해 사용하는 토큰**
- Client는 보통 서버 측에 이 Refresh Token을 보관해 두었다가, Access Token이 유효하지 않다는 응답을 받으면 Refresh Token으로 새 토큰을 요청함

 “액세스 토큰이 만료되면, **리프레시 토큰으로 재발급받는다**” 라는 패턴으로 요약 가능.
  
## 6. API 호출 시 토큰 사용하는 방법

Access Token을 손에 쥔 Client는 이제 Resource Server가 제공하는 **REST API**를 호출해서  
데이터를 가져오거나 조작할 수 있어. (예: Google Calendar API)

대표적인 방법 두 가지:
1. **쿼리 스트링 파라미터로 전달**
    ```http
    GET /drive/v2/files?access_token={ACCESS_TOKEN}
    ```
2. **HTTP Authorization 헤더에 Bearer 토큰으로 전달 (권장)**
```http
GET /drive/v2/files HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer {ACCESS_TOKEN}
```

실무에서는 거의 대부분 **2번(Bearer 헤더)** 방식을 사용해.

## 7. 전체 흐름을 “서비스 관점”에서 한 번에 보기

마지막으로, wild-type-dev 글에서 요약한 관점을 포함해서 전체를 서비스 입장에서 정리하면:
1. 구글·페북 등 **개발자 페이지에서 앱 등록**
    - client_id, client_secret, redirect_uri 확보
2. 우리 서비스에 **“구글로 로그인” 버튼**을 만들고
    - 클릭 시 authorization endpoint로 redirect (client_id, scope, redirect_uri 포함)
3. 사용자가 로그인 & 권한 동의를 마치면
    - Authorization Server가 redirect_uri로 **authorization code**를 돌려줌
4. 우리 서버는 이 code와 client_secret을 이용해서
    - token endpoint로 접속, **Access Token(+Refresh Token)** 발급 요청
5. 발급받은 Access Token으로 필요한 API 호출
    - ex. 구글 캘린더 일정 조회/생성
6. Access Token이 만료되면
    - Refresh Token으로 새 Access Token 재발급

이게 지금까지 링크해준 5개 글이 공통적으로 설명하는 **OAuth 2.0(특히 Authorization Code Grant) 전체 그림**이야.