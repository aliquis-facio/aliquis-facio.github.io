# WebSocket이란?

**WebSocket**은
클라이언트와 서버가 **한 번 연결을 맺은 뒤, 그 연결을 계속 유지하면서 양방향으로 실시간 통신할 수 있게 해주는 프로토콜**이야.

즉 HTTP처럼

* 요청 보내고
* 응답 받고
* 연결이 사실상 끝나는 구조

가 아니라,

* 한 번 연결을 열고
* 그 뒤에는 클라이언트도 서버도
* 필요할 때 서로 데이터를 바로 보낼 수 있는 구조야.

---

# 왜 WebSocket이 필요한가?

HTTP는 기본적으로 **요청-응답(Request-Response)** 모델이야.
즉 클라이언트가 먼저 요청해야 서버가 응답할 수 있어.

이 구조는 일반적인 웹페이지 조회나 REST API에는 아주 잘 맞아.

예:

* 게시글 조회
* 로그인
* 상품 목록 불러오기
* 폼 제출

그런데 다음 같은 경우는 불편해져.

* 채팅
* 실시간 알림
* 주식 시세
* 게임 상태 동기화
* 실시간 위치 공유
* 실시간 협업 문서 편집

이런 기능은 서버 쪽에서 **새로운 정보가 생기자마자 바로 클라이언트에 밀어줘야** 해.

HTTP만으로 하려면 보통 이런 우회 방법을 써야 했어.

## 1. Polling

클라이언트가 계속 반복 요청

예:

* 1초마다 `/messages` 요청
* 새 메시지 있나 확인

문제:

* 요청이 너무 많아짐
* 새 데이터가 없어도 계속 요청
* 비효율적

## 2. Long Polling

서버가 응답을 일부러 늦게 주는 방식

문제:

* 구현 복잡
* 연결 관리 부담
* 진짜 양방향 실시간과는 다름

이런 한계를 해결하기 위해 WebSocket이 등장했어.

---

# WebSocket의 핵심 특징

## 1. 양방향 통신(Full-Duplex)

클라이언트와 서버가 **서로 독립적으로 언제든 데이터 전송 가능**

즉:

* 클라이언트 → 서버 전송 가능
* 서버 → 클라이언트 전송 가능

HTTP는 보통 클라이언트가 먼저 요청해야 서버가 응답하지만,
WebSocket은 서버도 필요할 때 먼저 보낼 수 있어.

---

## 2. 연결 지속(Persistent Connection)

한 번 연결을 맺으면 계속 유지된다.

즉 매번 새 연결을 만들지 않고,
이미 열린 연결을 재사용해서 계속 메시지를 주고받는다.

---

## 3. 낮은 오버헤드

HTTP는 요청할 때마다 헤더가 많이 붙고, 요청-응답 구조가 반복된다.
WebSocket은 연결 후에는 비교적 가벼운 프레임 단위로 통신해서 실시간 처리에 유리하다.

---

# HTTP와 WebSocket의 차이

## HTTP

* 요청-응답 기반
* 클라이언트가 먼저 요청해야 함
* 보통 한 번 처리 후 끝
* 문서 조회, REST API에 적합

## WebSocket

* 연결 유지 기반
* 양방향 실시간 통신 가능
* 서버도 먼저 보낼 수 있음
* 채팅, 게임, 실시간 알림에 적합

---

# WebSocket 통신은 어떻게 시작되나?

이 부분이 중요해.
WebSocket은 처음부터 완전히 별개 방식으로 시작하는 게 아니라,
**처음에는 HTTP 요청으로 시작해서 업그레이드**하는 구조야.

이 과정을 **Handshake(핸드셰이크)** 라고 해.

---

# WebSocket 연결 수립 과정

## 1단계: 클라이언트가 HTTP Upgrade 요청을 보냄

브라우저나 클라이언트는 먼저 서버에 이런 식의 HTTP 요청을 보낸다.

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: abcdefg123456==
Sec-WebSocket-Version: 13
```

핵심은 이것들이야.

* `Upgrade: websocket`
* `Connection: Upgrade`

즉 클라이언트가 서버에게
“이 HTTP 연결을 WebSocket으로 전환하고 싶다”
라고 요청하는 거야.

---

## 2단계: 서버가 업그레이드 수락

서버가 WebSocket을 지원하면 이런 응답을 보낸다.

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: ...
```

여기서 **101 Switching Protocols** 가 중요해.

의미:

* 프로토콜을 HTTP에서 WebSocket으로 전환한다

이 시점 이후부터는 더 이상 일반적인 HTTP 요청/응답이 아니라,
WebSocket 프레임 단위 통신으로 바뀐다.

---

# 연결 후에는 어떻게 통신하나?

핸드셰이크가 끝나면 연결은 계속 살아 있고,
그 뒤에는 **메시지(message)** 또는 더 정확히는 **프레임(frame)** 을 주고받는다.

예를 들어 채팅이라고 하면:

* 클라이언트: `"안녕"`
* 서버: `"서버가 메시지 받음"`
* 서버: `"새 사용자 입장"`
* 클라이언트: `"현재 접속자 수 갱신"`

이런 식으로 자유롭게 오간다.

---

# WebSocket URL

HTTP가 `http://`, `https://` 를 쓰는 것처럼
WebSocket도 전용 스킴을 사용해.

* `ws://` → 암호화 없는 WebSocket
* `wss://` → TLS 기반 암호화 WebSocket

예:

```text
ws://example.com/chat
wss://example.com/chat
```

실무에서는 대부분 **`wss://`** 를 쓰는 편이야.
HTTPS 사이트에서 보안되지 않은 `ws://` 연결은 브라우저에서 제한될 수도 있어.

---

# WebSocket 메시지 구조 개념

WebSocket은 HTTP처럼 매번 거대한 헤더를 붙이지 않고,
프레임 구조를 사용해서 데이터를 보낸다.

프레임에는 대략 이런 정보가 들어간다.

* FIN: 메시지 종료 여부
* opcode: 데이터 타입
* mask: 마스킹 여부
* payload length: 데이터 길이
* payload data: 실제 데이터

---

## opcode란?

프레임 종류를 구분하는 값이야.

대표적으로:

* `0x1` : 텍스트 데이터
* `0x2` : 바이너리 데이터
* `0x8` : 연결 종료
* `0x9` : ping
* `0xA` : pong

즉 WebSocket은 단순 문자열만 보내는 게 아니라
텍스트, 바이너리, 제어 프레임까지 다룰 수 있어.

---

# 텍스트와 바이너리

WebSocket은 두 가지 주요 데이터 전송을 지원해.

## 텍스트 프레임

예:

* JSON 문자열
* 채팅 메시지
* 알림 내용

```json
{"type":"chat","message":"안녕하세요"}
```

## 바이너리 프레임

예:

* 음성 데이터
* 이미지 조각
* 게임용 바이너리 패킷

실시간 스트리밍이나 고성능 서비스에서는 바이너리 전송도 자주 쓴다.

---

# 마스킹(Masking)

이건 프로토콜 레벨에서 특징적인 부분이야.

* **클라이언트 → 서버** 프레임은 보통 마스킹됨
* **서버 → 클라이언트** 프레임은 보통 마스킹되지 않음

이건 보안 및 프록시/캐시 계층에서의 오작동 방지를 위한 프로토콜 규칙이야.
애플리케이션 개발자는 직접 다루지 않는 경우가 많지만, 내부 동작 이해에는 중요해.

---

# Ping / Pong

WebSocket 연결은 오래 유지되기 때문에
중간에 연결이 끊겼는지 확인해야 해.

그래서 **Ping / Pong** 프레임이 있다.

* 한쪽이 `ping` 전송
* 상대가 `pong` 응답

이걸 통해:

* 연결 생존 여부 확인
* idle timeout 대응
* 네트워크 끊김 감지

를 할 수 있어.

실무에서는 서버나 클라이언트가 주기적으로 heartbeat를 보내기도 해.

---

# Close 프레임

연결을 종료할 때는 그냥 TCP를 무식하게 끊는 게 아니라
보통 **close frame** 을 주고받는다.

예:

* 클라이언트가 종료 요청
* 서버가 close 응답
* 연결 정리

이렇게 해야 더 정상적으로 세션 종료를 처리할 수 있어.

---

# WebSocket은 상태를 가지는가?

HTTP는 무상태(stateless)라고 설명했지.
WebSocket은 **연결 자체가 지속**되므로, 그 연결 컨텍스트를 통해 사실상 상태적인 성격을 가진다.

예를 들어 서버는 특정 소켓 연결에 대해:

* 어떤 사용자인지
* 어느 채팅방에 들어왔는지
* 마지막 활동 시각이 언제인지

같은 정보를 메모리에 매핑해서 관리할 수 있어.

즉 프로토콜 자체가 세션 기반처럼 동작하기 쉬워.

---

# WebSocket 서버는 무엇을 관리해야 하나?

HTTP 서버보다 WebSocket 서버가 어려운 이유가 여기 있어.
연결을 오래 유지하므로 서버가 관리해야 할 것이 많아진다.

## 1. 연결 목록

현재 어떤 클라이언트가 연결되어 있는지

## 2. 사용자-연결 매핑

이 소켓이 누구의 것인지

## 3. 방(room) / 채널(channel)

채팅방, 게임방, 주제 구독 그룹 등

## 4. 끊긴 연결 정리

네트워크가 끊겼는데 정리 안 되면 메모리 누수 위험

## 5. heartbeat

죽은 연결 감지

## 6. 재연결 처리

클라이언트가 다시 접속했을 때 상태 복구

---

# WebSocket이 실시간 채팅에서 쓰이는 방식

가장 대표적인 예가 채팅이야.

흐름을 보면:

## 1. 사용자가 채팅방 입장

클라이언트가 WebSocket 연결

## 2. 서버가 연결 등록

해당 사용자를 방에 참가시킴

## 3. 사용자가 메시지 전송

클라이언트 → 서버

```json
{"type":"chat","roomId":1,"message":"안녕하세요"}
```

## 4. 서버가 다른 사용자들에게 broadcast

서버 → 같은 방의 다른 클라이언트들

```json
{"type":"chat","user":"alice","message":"안녕하세요"}
```

이게 HTTP였다면 매번 요청하거나 새 메시지를 계속 polling해야 했을 거야.

---

# Broadcast란?

WebSocket에서는 한 클라이언트에게만 보내는 게 아니라
특정 그룹 전체에 보내는 일이 많아.

예:

* 채팅방 참가자 전체에게 메시지 전송
* 주식 종목 구독자 전체에게 현재 가격 전송
* 게임방 플레이어 전체에게 상태 업데이트 전송

이걸 보통 **broadcast** 라고 해.

---

# Pub/Sub와 WebSocket

실무에서 WebSocket 서버가 커지면 서버 한 대만으로 처리하지 않는 경우가 많아.
그러면 여러 서버 인스턴스가 떠 있을 수 있는데, 이때 broadcast가 어려워져.

예:

* 유저 A는 서버 1에 연결
* 유저 B는 서버 2에 연결

이때 한 서버에서 받은 메시지를 다른 서버의 연결들에게도 보내야 해.

그래서 보통 다음과 함께 사용해:

* Redis Pub/Sub
* Kafka
* RabbitMQ

즉:

1. 서버 1이 메시지 받음
2. Redis 채널에 publish
3. 서버 1, 서버 2가 모두 subscribe 중
4. 각 서버가 자기에게 연결된 클라이언트에게 전송

---

# 브라우저에서 WebSocket 사용 예시

자바스크립트에서는 보통 이렇게 사용해.

```javascript
const socket = new WebSocket("ws://localhost:8000/ws/chat");

socket.onopen = () => {
  console.log("연결 성공");
  socket.send("hello server");
};

socket.onmessage = (event) => {
  console.log("서버 메시지:", event.data);
};

socket.onclose = () => {
  console.log("연결 종료");
};

socket.onerror = (error) => {
  console.log("에러 발생:", error);
};
```

핵심 이벤트는 이 정도야.

* `onopen` : 연결 열림
* `onmessage` : 메시지 수신
* `onclose` : 연결 닫힘
* `onerror` : 오류 발생

---

# Django / FastAPI에서 WebSocket

## Django

기본 Django는 전통적인 WSGI 기반이라 HTTP 처리에 강해.
WebSocket은 보통 **Django Channels** 를 사용해서 처리한다.

즉:

* Django 기본: HTTP
* Django Channels: WebSocket, 비동기 연결 처리

간단한 개념 예시:

```python
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        await self.send(text_data=json.dumps({
            "message": message
        }))
```

---

## FastAPI

FastAPI는 ASGI 기반이라 WebSocket 지원이 비교적 자연스럽다.

```python
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
```

여기서 흐름은:

* `accept()` 로 연결 수락
* `receive_text()` 로 메시지 받기
* `send_text()` 로 메시지 보내기

---

# WebSocket이 HTTP보다 항상 좋은가?

아니야. 이건 아주 중요해.

WebSocket은 강력하지만, 모든 곳에 쓰는 게 정답은 아니야.

## WebSocket이 적합한 경우

* 채팅
* 실시간 알림
* 주식/코인 시세
* 멀티플레이 게임
* 협업 문서
* 실시간 모니터링 대시보드

## HTTP가 더 적합한 경우

* 게시글 조회
* 회원가입
* 로그인
* CRUD API
* 파일 다운로드
* 일반적인 웹페이지 렌더링

즉 **실시간성이 핵심일 때만 WebSocket을 쓰는 게 보통 맞다.**

---

# WebSocket의 장점

## 1. 실시간성

데이터를 즉시 주고받을 수 있다.

## 2. 양방향 통신

서버도 먼저 전송 가능

## 3. 반복 요청 감소

Polling보다 훨씬 효율적

## 4. 낮은 지연

실시간 UX에 적합

---

# WebSocket의 단점

## 1. 서버 관리가 복잡

연결 상태, 끊김, 재연결, 세션, 메모리 관리 필요

## 2. 확장성이 더 어렵다

HTTP처럼 무상태 요청만 처리하는 것보다 수평 확장이 까다롭다

## 3. 로드밸런싱 이슈

특정 사용자의 연결이 유지되어야 하므로 sticky session이나 중앙 브로커가 필요할 수 있다

## 4. 유휴 연결 비용

접속자 수가 많으면 아무 메시지가 없어도 연결을 계속 유지해야 한다

---

# WebSocket과 보안

WebSocket도 보안을 신경 써야 해.

## 1. `wss://` 사용

암호화된 연결 사용

## 2. 인증

연결 시 사용자 인증이 필요

예:

* 쿠키 기반 인증
* JWT 토큰 전달
* 쿼리 파라미터 또는 헤더 기반 인증

## 3. Origin 체크

악성 사이트에서 임의로 연결 시도하는 것 방지

## 4. 메시지 검증

클라이언트가 보내는 JSON 구조, 권한, 입력값 검증 필수

HTTP API처럼 WebSocket 메시지도 절대 신뢰하면 안 돼.

---

# 인증은 어떻게 하나?

이건 실무에서 자주 헷갈려.

WebSocket은 처음 핸드셰이크가 HTTP 기반이라
그 시점의 쿠키나 헤더 정보를 이용해 인증하는 경우가 많아.

예:

* 브라우저가 기존 로그인 쿠키를 함께 보냄
* 서버가 세션 확인
* 인증 성공 시 소켓 연결 허용

또는 JWT를 사용해서:

* 연결 URL 쿼리스트링에 토큰 포함
* 혹은 별도 서브프로토콜/헤더 방식 사용

주의할 점은 **연결 이후에도 권한 체크가 계속 필요할 수 있다**는 점이야.
예를 들어 연결은 성공했더라도 특정 채팅방 입장 권한은 따로 검증해야 해.

---

# 재연결(Reconnection)

현실에서는 네트워크가 자주 끊겨.

그래서 WebSocket 클라이언트는 보통:

* 연결이 끊기면
* 몇 초 뒤 재시도
* 실패하면 점점 간격 늘리기

같은 **자동 재연결 로직**을 넣는다.

이를 흔히 **exponential backoff** 방식으로 구현해.

즉:

* 1초 후 재시도
* 2초 후 재시도
* 4초 후 재시도
* 8초 후 재시도

이렇게 무한 폭주를 막는다.

---

# WebSocket과 SSE 차이

실시간 통신에서 비교 대상이 하나 더 있어.
바로 **SSE(Server-Sent Events)** 야.

## SSE

* 서버 → 클라이언트 단방향 실시간 전송
* 텍스트 기반
* 구현 단순

## WebSocket

* 양방향
* 더 범용적
* 더 복잡

예를 들면:

* 알림 스트림만 보내면 되는 경우 → SSE도 가능
* 채팅처럼 양방향이어야 함 → WebSocket이 적합

---

# WebSocket과 TCP의 관계

WebSocket은 TCP 위에서 동작하는 상위 프로토콜이야.
즉 그냥 “TCP 소켓 = WebSocket”은 아니야.

TCP는 단순히 바이트 스트림을 안정적으로 전달하는 계층이고,
WebSocket은 그 위에서:

* 메시지 경계
* 텍스트/바이너리 구분
* 핑/퐁
* 핸드셰이크 규칙

같은 웹 친화적 규약을 제공해.

즉 브라우저에서 직접 TCP 소켓을 열 수는 없지만,
WebSocket은 웹 환경에서 안전하게 사용할 수 있는 표준 실시간 프로토콜인 셈이야.

---

# WebSocket 서버 개발 시 자주 만나는 문제

## 1. 연결은 됐는데 메시지가 안 감

* room 등록 누락
* 브로드캐스트 대상 관리 오류
* 비동기 await 누락

## 2. 새로고침하면 중복 연결

* 기존 연결 해제 처리 부족
* 사용자별 소켓 정리 안 됨

## 3. 서버 재시작 후 연결 끊김

* 클라이언트 자동 재연결 필요

## 4. 여러 서버에서 메시지 불일치

* Redis Pub/Sub 같은 중앙 메시지 브로커 필요

## 5. 인증은 됐는데 권한 누락

* 연결 인증과 메시지 권한 검증을 분리해야 함

---

# WebSocket을 한 문장으로 정리하면

WebSocket은
**클라이언트와 서버가 한 번 연결을 맺은 뒤, 그 연결을 유지하면서 실시간으로 양방향 통신할 수 있게 해주는 프로토콜**이야.

---

# HTTP와 함께 최종 비교 정리

## HTTP

* 문서 조회와 일반 API에 적합
* 요청-응답 구조
* 무상태
* 단순하고 확장 쉬움

## WebSocket

* 실시간 서비스에 적합
* 연결 유지
* 양방향
* 상태 관리와 확장이 더 복잡함

---

# 꼭 기억해야 할 핵심 7개

1. **처음은 HTTP 핸드셰이크로 시작한다**
2. **101 Switching Protocols로 WebSocket으로 전환된다**
3. **연결 후에는 지속적인 양방향 통신이 가능하다**
4. **서버도 먼저 데이터를 보낼 수 있다**
5. **채팅, 알림, 게임, 시세에 적합하다**
6. **연결 관리, 인증, 재연결, 확장 처리가 중요하다**
7. **모든 API를 WebSocket으로 바꾸는 건 오히려 비효율적일 수 있다**
