---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "Burp Suite"
excerpt: "모의해킹 취업반 스터디 7기 4주차"

date: 2024-11-11
last_modified_at: 2024-11-24

categories: [WEB]
tags: [WEB, SECURITY, TOOL]
---
# Burp Suite란?

Burp Suite는 웹 애플리케이션 보안 테스트에 사용하는 **Web Proxy Tool**이다.

브라우저와 서버 사이에 Burp Suite가 프록시로 개입하여, 브라우저와 서버가 주고받는 HTTP/HTTPS 요청과 응답을 확인하거나 수정할 수 있다.

```text
Browser <-> Burp Suite <-> Server
````

즉, 사용자가 웹사이트에 요청을 보내면 그 요청이 바로 서버로 가지 않고 Burp Suite를 거친다.
반대로 서버가 응답을 보낼 때도 Burp Suite를 거쳐 브라우저로 전달된다.

이를 통해 보안 테스트자는 다음과 같은 작업을 할 수 있다.

* 요청 값 확인
* 응답 값 확인
* 쿠키 확인
* 세션 토큰 확인
* 파라미터 변조
* 인증 우회 가능성 확인
* 반복 요청 테스트
* 취약점 분석

---

# Proxy란?

Proxy는 클라이언트와 서버 사이에서 중간 역할을 하는 시스템이다.

일반적인 통신은 다음과 같다.

```text
Client <-> Server
```

프록시를 사용하면 다음과 같이 통신한다.

```text
Client <-> Proxy <-> Server
```

웹 프록시는 클라이언트의 요청을 대신 서버에 전달하고, 서버의 응답을 다시 클라이언트에게 전달한다.

Burp Suite는 이 구조를 이용해 웹 요청과 응답을 중간에서 관찰하고 조작할 수 있게 해준다.

---

# Burp Suite의 기본 구조

Burp Suite를 사용할 때 가장 기본적인 구조는 다음과 같다.

```text
브라우저 <-> Burp Suite Proxy <-> 웹 서버
```

브라우저는 Burp Suite를 프록시 서버로 사용하도록 설정한다.

예를 들어 로컬 컴퓨터에서 Burp Suite를 실행한다면 보통 다음과 같이 설정한다.

```text
Proxy IP: 127.0.0.1
Proxy Port: 8080
```

여기서 `127.0.0.1`은 자기 자신, 즉 로컬 컴퓨터를 의미한다.

---

# Proxy Listener란?

Proxy Listener는 Burp Suite가 브라우저나 다른 클라이언트의 요청을 받아들이기 위해 열어두는 프록시 수신 지점이다.

쉽게 말하면 Burp Suite가 다음과 같이 대기하는 것이다.

```text
"나는 127.0.0.1:8080에서 프록시 요청을 받을 준비가 되어 있다."
```

브라우저가 `127.0.0.1:8080`으로 요청을 보내면 Burp Suite가 그 요청을 받아 서버로 전달한다.

---

# Proxy Listener를 사용하는 이유

Proxy Listener를 사용하는 이유는 클라이언트의 웹 요청을 Burp Suite로 보내기 위해서이다.

브라우저, 모바일 앱, 외부 컴퓨터, Docker 컨테이너 등 다양한 클라이언트가 Burp Suite를 통해 요청을 보내려면 Burp Suite가 요청을 받을 주소와 포트를 열어두어야 한다.

```text
클라이언트 요청
        ↓
Burp Suite Proxy Listener
        ↓
웹 서버
```

따라서 Proxy Listener는 Burp Suite가 웹 트래픽을 가로채고 분석하기 위한 입구라고 볼 수 있다.

---

# Loopback과 All Interfaces

Burp Suite Proxy Listener를 설정할 때 중요한 개념이 **Loopback**과 **All Interfaces**이다.

## 1. Loopback

Loopback은 자기 자신을 의미한다.

대표적인 주소는 다음과 같다.

```text
127.0.0.1
localhost
```

Burp Suite를 실행하는 컴퓨터에서 같은 컴퓨터의 브라우저 요청만 받을 때 사용한다.

```text
내 컴퓨터의 브라우저 <-> 내 컴퓨터의 Burp Suite
```

이 경우 Proxy Listener는 보통 다음처럼 설정한다.

```text
Bind to address: 127.0.0.1
Port: 8080
```

---

## 2. All Interfaces

All Interfaces는 현재 컴퓨터가 가진 모든 네트워크 인터페이스에서 요청을 받겠다는 의미이다.

예를 들어 내 컴퓨터가 다음 IP를 가지고 있다고 하자.

```text
127.0.0.1
192.168.0.10
172.17.0.1
```

All Interfaces로 설정하면 Burp Suite는 이 주소들로 들어오는 요청을 모두 받을 수 있다.

즉, 같은 컴퓨터뿐만 아니라 같은 네트워크에 있는 다른 기기에서도 내 Burp Suite로 요청을 보낼 수 있다.

```text
핸드폰 <-> 내 컴퓨터의 Burp Suite <-> 서버
다른 컴퓨터 <-> 내 컴퓨터의 Burp Suite <-> 서버
Docker 컨테이너 <-> 내 컴퓨터의 Burp Suite <-> 서버
```

---

# 상황별 Proxy Listener 설정

## 1. 로컬 컴퓨터에서 Burp Suite를 사용할 때

같은 컴퓨터에서 브라우저와 Burp Suite를 모두 실행하는 경우이다.

```text
내 브라우저 <-> 내 Burp Suite <-> 서버
```

이 경우에는 Loopback을 사용하면 된다.

```text
Bind to address: 127.0.0.1
Proxy 설정: 127.0.0.1:8080
```

---

## 2. 모바일 앱 해킹을 할 때

핸드폰의 트래픽을 컴퓨터의 Burp Suite로 보내야 한다.

```text
핸드폰 <-> 컴퓨터의 Burp Suite <-> 서버
```

이 경우 핸드폰은 컴퓨터의 `127.0.0.1`에 접근할 수 없다.
핸드폰 입장에서 `127.0.0.1`은 핸드폰 자기 자신이기 때문이다.

따라서 Burp Suite는 외부 기기에서 접근 가능한 IP로 열려 있어야 한다.

```text
Bind to address: All Interfaces
```

그리고 핸드폰의 Wi-Fi 프록시 설정에는 컴퓨터의 내부 IP를 입력한다.

```text
Proxy IP: 컴퓨터의 Wi-Fi IP
Proxy Port: 8080
```

예시:

```text
Proxy IP: 192.168.0.10
Proxy Port: 8080
```

핸드폰과 컴퓨터는 같은 Wi-Fi 네트워크에 있어야 한다.

---

## 3. 외부 컴퓨터에서 내 Burp Suite를 사용할 때

다른 컴퓨터의 트래픽을 내 컴퓨터의 Burp Suite로 보내는 경우이다.

```text
외부 컴퓨터 <-> 내 Burp Suite <-> 서버
```

이 경우도 외부 컴퓨터가 내 컴퓨터의 Burp Suite에 접근해야 하므로 All Interfaces로 열어야 한다.

```text
Bind to address: All Interfaces
```

외부 컴퓨터의 프록시 설정에는 내 컴퓨터의 IP와 Burp 포트를 입력한다.

```text
Proxy IP: 내 컴퓨터의 내부 IP
Proxy Port: 8080
```

---

## 4. 내 컴퓨터가 외부 컴퓨터의 Burp Suite를 사용할 때

이번에는 반대로 Burp Suite가 외부 컴퓨터에서 실행 중인 경우이다.

```text
내 컴퓨터 <-> 외부 컴퓨터의 Burp Suite <-> 서버
```

이 경우 Burp Suite가 실행 중인 외부 컴퓨터에서 Proxy Listener를 All Interfaces로 열어야 한다.

내 컴퓨터의 브라우저 프록시 설정에는 외부 컴퓨터의 IP와 포트를 입력한다.

```text
Proxy IP: 외부 컴퓨터 IP
Proxy Port: 8080
```

---

# Docker 같은 가상 컴퓨터의 경우

Docker 컨테이너는 일반적으로 호스트 컴퓨터와 분리된 네트워크 안에서 실행된다.

```text
Docker Container <-> Host PC <-> Internet
```

Docker 컨테이너 안에서 실행되는 프로그램의 트래픽을 호스트 컴퓨터의 Burp Suite로 보내고 싶다면, 컨테이너에서 호스트의 Burp Suite에 접근할 수 있어야 한다.

## Windows / macOS Docker Desktop

보통 다음 주소를 사용할 수 있다.

```text
host.docker.internal
```

예를 들어 Burp Suite가 호스트 컴퓨터의 8080 포트에서 실행 중이라면 Docker 컨테이너에서는 다음 프록시를 사용한다.

```text
Proxy Host: host.docker.internal
Proxy Port: 8080
```

Burp Suite의 Proxy Listener는 외부 인터페이스에서 접근 가능해야 하므로 보통 다음처럼 설정한다.

```text
Bind to address: All Interfaces
Port: 8080
```

## Linux Docker

Linux에서는 환경에 따라 `host.docker.internal`이 바로 동작하지 않을 수 있다.

이 경우 보통 Docker bridge gateway IP를 사용한다.

```text
172.17.0.1
```

컨테이너에서는 다음처럼 프록시를 설정할 수 있다.

```text
Proxy Host: 172.17.0.1
Proxy Port: 8080
```

또는 Docker 실행 시 host gateway를 추가할 수 있다.

```bash
docker run --add-host=host.docker.internal:host-gateway ...
```

그 후 컨테이너 내부에서는 다음 주소를 사용한다.

```text
host.docker.internal:8080
```

---

# Docker에서 Burp Suite 연결 예시

컨테이너 안에서 `curl` 요청을 Burp Suite로 보내고 싶다면 다음처럼 실행할 수 있다.

```bash
curl -x http://host.docker.internal:8080 http://example.com
```

Linux 환경에서는 다음처럼 사용할 수도 있다.

```bash
curl -x http://172.17.0.1:8080 http://example.com
```

HTTPS 요청을 제대로 확인하려면 Burp Suite CA 인증서를 컨테이너나 애플리케이션에 신뢰 인증서로 등록해야 한다.

---

# HTTPS와 Burp 인증서

HTTP 요청은 비교적 쉽게 Burp Suite에서 볼 수 있다.

하지만 HTTPS는 암호화되어 있기 때문에 Burp Suite가 중간에서 내용을 확인하려면 Burp Suite의 CA 인증서를 클라이언트가 신뢰해야 한다.

브라우저나 모바일 기기에서 Burp Suite 인증서를 설치하지 않으면 다음과 같은 문제가 발생할 수 있다.

```text
인증서 오류
HTTPS 연결 실패
응답 확인 불가
```

따라서 HTTPS 테스트를 하려면 Burp Suite CA 인증서를 설치해야 한다.

```text
브라우저 / 모바일 / Docker 환경에 Burp CA 인증서 설치
```

---

# 모바일에서 Burp Suite 사용하기

핸드폰에서도 Wi-Fi 프록시 설정을 통해 Burp Suite를 사용할 수 있다.

기본 흐름은 다음과 같다.

```text
1. 컴퓨터와 핸드폰을 같은 Wi-Fi에 연결한다.
2. 컴퓨터에서 Burp Suite를 실행한다.
3. Proxy Listener를 All Interfaces로 설정한다.
4. 컴퓨터의 내부 IP를 확인한다.
5. 핸드폰 Wi-Fi 설정에서 프록시를 수동으로 설정한다.
6. 프록시 IP에 컴퓨터 IP를 입력한다.
7. 포트에 Burp Suite 포트인 8080을 입력한다.
8. HTTPS 분석이 필요하면 핸드폰에 Burp CA 인증서를 설치한다.
```

예시:

```text
컴퓨터 IP: 192.168.0.10
Burp Port: 8080

핸드폰 프록시 설정:
Host: 192.168.0.10
Port: 8080
```

---

# DMZ와 웹 서버

웹 서버는 외부 사용자의 요청을 받아야 하므로 보통 외부 네트워크와 내부 네트워크 사이에 위치한 DMZ 영역에 배치될 수 있다.

DMZ는 Demilitarized Zone의 약자로, 외부 인터넷과 내부 사설망 사이에 위치한 중간 네트워크 구간이다.

```text
Internet <-> DMZ <-> Internal Network
```

웹 서버를 DMZ에 두는 이유는 외부 사용자가 웹 서버에 접근할 수 있도록 하면서도, 내부망 전체가 직접 노출되지 않도록 하기 위해서이다.

예를 들어 다음과 같은 구조가 가능하다.

```text
Internet
   |
Firewall
   |
DMZ
   |
Web Server
   |
Firewall
   |
Internal DB Server
```

이 구조에서는 웹 서버가 공격받더라도 내부 DB 서버나 사내망까지 바로 접근하기 어렵게 만들 수 있다.

---

# OSCP 관점의 기본 흐름

OSCP나 모의해킹에서는 보통 다음과 같은 흐름으로 대상을 분석한다.

```text
정보수집 -> 서비스 분석 -> Exploit -> Post-Exploit
```

## 1. 정보수집

대상 시스템에 대해 기본 정보를 수집하는 단계이다.

예시:

* IP 확인
* 도메인 확인
* 포트 확인
* 사용 중인 서비스 확인
* 웹 페이지 구조 확인

---

## 2. 서비스 분석

열려 있는 포트와 서비스가 어떤 역할을 하는지 분석한다.

예시:

```text
80/tcp  -> HTTP
443/tcp -> HTTPS
22/tcp  -> SSH
3306/tcp -> MySQL
```

웹 서비스가 열려 있다면 Burp Suite를 이용해 요청과 응답을 분석할 수 있다.

---

## 3. Exploit

분석한 정보를 바탕으로 취약점을 검증하는 단계이다.

웹 애플리케이션에서는 다음과 같은 취약점을 점검할 수 있다.

* 인증 우회
* SQL Injection
* XSS
* 파일 업로드 취약점
* 경로 조작
* 접근 제어 오류
* 취약한 세션 관리

---

## 4. Post-Exploit

취약점 검증 이후 영향 범위를 확인하는 단계이다.

예를 들어 다음과 같은 것을 확인한다.

* 어떤 권한을 얻었는가?
* 어떤 파일에 접근 가능한가?
* 시스템 내부에서 추가 정보 수집이 가능한가?
* 권한 상승 가능성이 있는가?
* 내부망 접근 가능성이 있는가?

실제 보안 테스트에서는 반드시 허가된 범위 안에서만 수행해야 한다.

---

# Burp Suite의 주요 기능

## 1. Proxy

브라우저와 서버 사이의 요청과 응답을 가로채서 확인하고 수정하는 기능이다.

```text
Browser -> Burp Proxy -> Server
Server -> Burp Proxy -> Browser
```

Proxy 기능을 사용하면 로그인 요청, 검색 요청, 게시글 작성 요청 등의 파라미터를 확인할 수 있다.

---

## 2. Repeater

Repeater는 하나의 요청을 여러 번 반복해서 보내며 테스트할 수 있는 기능이다.

예를 들어 로그인 요청을 Repeater로 보내면 비밀번호, 토큰, 쿠키, 파라미터 등을 수정하면서 서버 응답이 어떻게 바뀌는지 확인할 수 있다.

```text
요청 수정 -> Send -> 응답 확인 -> 다시 요청 수정 -> Send
```

그래서 Repeater는 다음과 같은 상황에서 많이 사용된다.

* 파라미터 변조 테스트
* 인증 우회 가능성 확인
* SQL Injection 테스트
* 권한 검증 테스트
* 응답 차이 비교
* API 요청 분석

---

## 3. Intruder

Intruder는 많은 값을 자동으로 대입하면서 요청을 반복하는 기능이다.

예를 들어 특정 파라미터에 여러 값을 넣어 응답 차이를 확인할 수 있다.

단, 허가받지 않은 서비스에 무분별하게 사용하면 공격으로 간주될 수 있다.

---

## 4. Decoder

Decoder는 인코딩된 값을 변환할 때 사용한다.

예시:

* URL Encoding
* Base64
* HTML Encoding
* Hex

---

## 5. Comparer

Comparer는 두 요청이나 응답의 차이를 비교할 때 사용한다.

예를 들어 정상 로그인 응답과 실패 로그인 응답의 차이를 비교할 수 있다.

---

# Burp Suite 사용 예시 흐름

```text
1. Burp Suite 실행
2. Proxy Listener 확인
3. 브라우저 프록시를 127.0.0.1:8080으로 설정
4. 웹사이트 접속
5. Burp Proxy에서 요청 확인
6. 필요한 요청을 Repeater로 보냄
7. 파라미터를 수정하며 반복 요청
8. 응답 차이를 분석
9. 취약점 여부 판단
```
