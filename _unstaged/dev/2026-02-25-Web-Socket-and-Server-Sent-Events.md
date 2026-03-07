---
layout: post
comments: true
sitemap:

title: "[DEVELOP] "
excerpt: ""

date: 2025-04-14
last_modified_at: 

categories: []
tags: [TIL]
---

# 웹소켓(WebSocket)과 SSE(Server-Sent Events) 정리

## 1. 정의

- **웹소켓**: 클라이언트 ↔ 서버가 **하나의 연결을 계속 유지**하면서 **양방향(Full-duplex)** 으로 실시간 메시지를 주고받는 프로토콜.
- **SSE**: 서버 → 클라이언트로 **단방향 스트리밍**(Server push)을 **HTTP 연결** 위에서 지속적으로 보내는 방식.

---

## 2) 통신 방향/연결 모델

### 웹소켓

- **양방향**: 클라이언트도 서버에 즉시 push 가능
- 연결 과정: HTTP로 시작 → **Upgrade** 후 WebSocket 프로토콜로 전환
- 메시지 단위: **프레임(frame)** 기반 (텍스트/바이너리)

### SSE

- **단방향(서버→클라)**: 클라이언트가 서버에 보내려면 일반 HTTP 요청(POST 등) 별도로 사용
- 연결 과정: 일반 HTTP 요청으로 `Accept: text/event-stream` → 서버가 연결을 **열어둔 채로** 이벤트를 계속 흘려보냄
- 메시지 단위: 텍스트 기반 이벤트 포맷 (`event:`, `data:`, `id:` 등)

> event: 정의한 포맷에 따라 UTF-8로 인코딩된 텍스트 데이터의 스트림

## 3) 재연결/내구성(끊김 대응)

### 웹소켓

- 브라우저 기본 API(WebSocket)는 **자동 재연결 없음** → 앱 레벨에서 재시도/백오프/세션 복구 설계 필요
- 순서/유실 보장은 기본적으로 애플리케이션 설계에 달림

### SSE

- 브라우저 `EventSource`는 **자동 재연결 기본 제공**
- `Last-Event-ID`(또는 `id:`) 기반으로 **끊긴 지점부터 재전송**을 설계하기 쉬움  
    → “알림/피드” 같은 **유실 최소화**에 유리

---

## 4) 프록시/방화벽/인프라 친화성

- **SSE가 대체로 더 무난**: 그냥 HTTP 스트리밍이라 기존 인프라(프록시, 로드밸런서)에서 통과가 쉬운 편.
- **웹소켓은** 중간 장비가 Upgrade/Keep-alive를 제대로 지원해야 하고, 타임아웃/Idle 정책에 영향 받기 쉬움.
- 단, 요즘은 둘 다 잘 지원되지만 **운영 난이도는 SSE가 보통 더 낮음**.

---

## 5) 성능/확장 관점(현실적인 포인트)

- 둘 다 “연결을 오래 유지”하므로 **동시 접속 수**가 커지면 서버 리소스(스레드/파일디스크립터/메모리)와 로드밸런싱 전략이 중요.
- 웹소켓은 양방향으로 트래픽이 많거나, 바이너리/저지연 상호작용이 많은 경우 효율적.
- SSE는 텍스트 기반이고 서버→클라 위주라 **구현 단순 + 운영 단순**.

## 참고

https://conanmoon.medium.com/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EC%9D%BC%EA%B8%B0-sse-vs-websocket-62d4b7c90fc7
https://matt1235.tistory.com/79
https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-Polling-Long-Polling-Server-Sent-Event-WebSocket-%EC%9A%94%EC%95%BD-%EC%A0%95%EB%A6%AC
https://surviveasdev.tistory.com/entry/%EC%9B%B9%EC%86%8C%EC%BC%93-%EA%B3%BC-SSEServer-Sent-Event-%EC%B0%A8%EC%9D%B4%EC%A0%90-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B3%A0-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0
