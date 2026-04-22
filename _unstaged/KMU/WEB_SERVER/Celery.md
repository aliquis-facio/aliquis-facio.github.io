Celery는 **파이썬 기반 비동기 작업 큐(Task Queue)** 다.  
쉽게 말하면, 웹 요청 처리처럼 **빨리 끝나야 하는 일**과 이메일 발송, 대용량 파일 처리, 이미지 변환, 크롤링, 알림 전송, 주기적 배치처럼 **오래 걸리거나 나중에 해도 되는 일**을 분리해서 처리하게 해 주는 시스템이다. Celery는 작업을 메시지로 큐에 넣고, 별도의 워커 프로세스가 그 작업을 가져가 실행하는 구조를 사용한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/configuration.html?utm_source=chatgpt.com "Configuration and defaults — Celery 5.6.2 documentation"))

# 1. 왜 Celery를 쓰는가

웹 서버에서 시간이 오래 걸리는 로직을 바로 실행하면 다음 문제가 생긴다.

- 사용자는 응답을 오래 기다린다.
    
- 서버 스레드/프로세스가 묶인다.
    
- 동시에 많은 요청이 오면 전체 성능이 급격히 떨어진다.
    

예를 들어 Django에서 회원가입 직후 환영 메일을 보낸다고 하자.  
메일 서버가 느리면 사용자는 “가입하기” 버튼을 누른 뒤 몇 초 이상 기다려야 할 수 있다.

이럴 때 흐름을 바꾸면 된다.

1. 웹 서버는 “회원가입 성공”까지만 빠르게 처리
    
2. 메일 발송 작업을 Celery 큐에 등록
    
3. 워커가 뒤에서 메일 발송 수행
    

즉, **사용자 응답과 백그라운드 작업을 분리**하는 것이 Celery의 핵심이다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/tasks.html?utm_source=chatgpt.com "Tasks — Celery 5.6.2 documentation"))

# 2. Celery의 핵심 구성 요소

Celery를 이해하려면 아래 5개를 잡아야 한다.

## 2-1. Producer

작업을 큐에 넣는 쪽이다.  
보통 Django, FastAPI, Flask 같은 웹 애플리케이션이 producer 역할을 한다.

예:

- 회원가입 후 이메일 보내기 요청
    
- 이미지 업로드 후 썸네일 생성 요청
    
- 결제 완료 후 영수증 PDF 생성 요청
    

## 2-2. Broker

작업 메시지를 전달하는 중간자다.  
Celery는 브로커를 통해 “이 작업을 누가 실행할지” 연결한다. Redis와 RabbitMQ가 대표적이다. Celery 공식 문서는 Redis를 broker와 result backend로 모두 사용할 수 있다고 설명한다. ([Celery Documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html?utm_source=chatgpt.com "Using Redis — Celery 5.6.3 documentation"))

## 2-3. Worker

실제 작업을 실행하는 프로세스다.  
큐에서 작업을 꺼내서 task 함수를 실행한다.

여러 worker를 띄우면 병렬 처리량을 늘릴 수 있다.

## 2-4. Task

Celery가 실행하는 실제 작업 단위다.  
파이썬 함수에 `@app.task` 같은 데코레이터를 붙여 정의한다. Celery는 `delay()` 또는 `apply_async()`로 task를 호출할 수 있고, `apply_async()`는 추가 실행 옵션을 줄 때 사용한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/tasks.html?utm_source=chatgpt.com "Tasks — Celery 5.6.2 documentation"))

## 2-5. Result Backend

작업 결과나 상태를 저장하는 저장소다.  
필수는 아니지만, 작업 상태 추적이나 결과 조회가 필요하면 사용한다. Redis, 데이터베이스 등으로 구성할 수 있다. ([Celery Documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html?utm_source=chatgpt.com "Using Redis — Celery 5.6.3 documentation"))

# 3. Celery 동작 흐름

가장 기본적인 흐름은 이렇다.

1. 사용자가 웹에서 요청을 보낸다.
    
2. 서버는 Celery task를 큐에 넣는다.
    
3. Broker가 그 메시지를 보관한다.
    
4. Worker가 큐에서 메시지를 가져간다.
    
5. Worker가 task를 실행한다.
    
6. 필요하면 결과를 backend에 저장한다.
    

그림처럼 표현하면:

`Client -> Web App -> Broker -> Worker -> Result Backend(선택)`

이 구조 덕분에 웹 서버와 무거운 작업 실행 환경이 분리된다.  
그래서 **응답 속도**, **확장성**, **장애 분리** 면에서 유리하다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/tasks.html?utm_source=chatgpt.com "Tasks — Celery 5.6.2 documentation"))

# 4. 비동기, 지연 실행, 주기 실행

Celery는 단순히 “뒤에서 실행”만 하는 도구가 아니다. 보통 세 가지 방식으로 많이 쓴다.

## 4-1. 비동기 실행

지금 바로 시작하되, 호출한 쪽은 기다리지 않는다.

예:

- 이메일 발송
    
- 푸시 알림
    
- 로그 후처리
    
- 파일 업로드 후 썸네일 생성
    

## 4-2. 지연 실행

몇 초 후, 몇 분 후, 특정 시각에 실행한다.  
`apply_async()`는 ETA나 countdown 같은 실행 옵션을 지원한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/calling.html?utm_source=chatgpt.com "Calling Tasks — Celery 5.6.2 documentation"))

예:

- 10분 뒤 미결제 주문 자동 취소
    
- 내일 오전 9시에 알림 발송
    

## 4-3. 주기 실행

정해진 주기로 반복 실행한다.  
이때 **Celery Beat**를 함께 쓴다. Beat는 스케줄러 역할을 하며 주기적 task를 큐에 넣는다. 일부 backend 정리 작업에도 beat가 필요할 수 있다고 문서에 나온다. ([Celery Documentation](https://docs.celeryq.dev/en/3.1/configuration.html?utm_source=chatgpt.com "Configuration and defaults — Celery 3.1.25 documentation"))

예:

- 매일 새벽 통계 집계
    
- 5분마다 외부 API 데이터 동기화
    
- 1시간마다 캐시 갱신
    

# 5. Django에서 Celery를 많이 쓰는 이유

Django는 전통적으로 요청-응답 기반 웹 프레임워크다.  
즉, 뷰 함수 안에서 오래 걸리는 작업을 직접 돌리면 성능과 사용자 경험이 나빠질 수 있다.

그래서 Django + Celery 조합이 많이 쓰인다.

대표 사례:

- 회원가입/비밀번호 재설정 이메일 발송
    
- 이미지 리사이징
    
- 엑셀/CSV/PDF 내보내기
    
- AI 추론 요청 비동기 처리
    
- 배치 데이터 수집
    
- 알림/문자 발송
    
- 대용량 DB 후처리
    

웹 서버는 HTTP 요청 처리에 집중하고, Celery는 백그라운드 작업 처리에 집중하는 식으로 역할을 나눌 수 있다.

# 6. 기본 코드 예시

Django 기준으로 아주 단순화해서 보면 이런 느낌이다.

## 6-1. task 정의

```python
# tasks.py
from celery import shared_task
import time

@shared_task
def send_welcome_email(user_email):
    time.sleep(5)  # 오래 걸리는 작업 가정
    print(f"send email to {user_email}")
    return "done"
```

## 6-2. view에서 호출

```python
# views.py
from .tasks import send_welcome_email

def signup(request):
    # 회원가입 처리
    user_email = "test@example.com"

    # 비동기 실행
    send_welcome_email.delay(user_email)

    return JsonResponse({"message": "회원가입 완료"})
```

여기서 중요한 점은:

- `send_welcome_email()`을 그냥 호출하면 동기 실행
    
- `send_welcome_email.delay()`를 쓰면 Celery 큐로 들어감
    

`delay()`는 간단 호출용이고, 실행 시간·재시도·우선순위 등 옵션이 필요하면 `apply_async()`를 쓴다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/calling.html?utm_source=chatgpt.com "Calling Tasks — Celery 5.6.2 documentation"))

# 7. delay()와 apply_async() 차이

## delay()

간단하다.

```python
task.delay(1, 2)
```

## apply_async()

옵션 제어가 가능하다.

```python
task.apply_async(args=[1, 2], countdown=10)
```

공식 문서도 `delay()`는 편의 메서드이고, 추가 실행 옵션이 필요하면 `apply_async()`를 사용하라고 설명한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/calling.html?utm_source=chatgpt.com "Calling Tasks — Celery 5.6.2 documentation"))

# 8. Celery의 장점

## 8-1. 응답 속도 개선

무거운 작업을 웹 요청에서 분리하므로 사용자 입장에서는 더 빨라진다.

## 8-2. 확장성

worker 수를 늘려 처리량을 늘릴 수 있다.

## 8-3. 장애 분리

메일 서버가 느리거나 이미지 처리 작업이 오래 걸려도 웹 서버 전체가 직접 묶이지 않는다.

## 8-4. 재시도 기능

외부 API 호출처럼 일시적으로 실패할 수 있는 작업에 유용하다.

## 8-5. 스케줄링 가능

Beat를 통해 cron 비슷한 주기 작업을 구현할 수 있다.

## 8-6. 작업 워크플로 구성

Celery는 callback, chain, chord 같은 방식으로 task 연결을 지원한다. 공식 문서의 Calling Tasks와 Canvas 가이드에서 이런 연결 개념을 설명한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/calling.html?utm_source=chatgpt.com "Calling Tasks — Celery 5.6.2 documentation"))

# 9. Celery를 쓸 때 주의할 점

Celery는 강력하지만, 그냥 붙인다고 끝나는 도구는 아니다.

## 9-1. 작업은 가능하면 idempotent하게 설계

같은 작업이 두 번 실행되어도 큰 문제가 없게 만드는 것이 좋다.  
공식 문서도 `acks_late`를 사용할 때 작업이 idempotent하면 적합하다고 설명한다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/tasks.html?utm_source=chatgpt.com "Tasks — Celery 5.6.2 documentation"))

예:

- 같은 이메일이 두 번 발송되면 곤란
    
- 같은 결제 승인 로직이 두 번 실행되면 매우 위험
    

그래서 결제, 포인트 적립, 재고 차감 같은 작업은 **중복 실행 방지 전략**이 중요하다.

## 9-2. ack와 재전송 이해

Celery에는 메시지를 언제 “처리 완료”로 인정할지와 관련된 ack 개념이 있다.  
`task_acks_late`를 켜면 작업 실행 후 ack하도록 할 수 있다. 기본은 비활성화이며, 실패/타임아웃 시 ack 처리 설정도 별도로 존재한다. Celery 5.7부터는 `task_acks_on_failure`, `task_acks_on_timeout` 설정이 추가되었고, 기존 `task_acks_on_failure_or_timeout`는 6.0 기준 deprecated로 안내된다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/configuration.html?utm_source=chatgpt.com "Configuration and defaults — Celery 5.6.2 documentation"))

이 부분은 실무에서 매우 중요하다.  
잘못 설정하면 작업이 유실되거나, 반대로 중복 실행될 수 있다.

## 9-3. 긴 작업과 prefetch

길게 걸리는 작업이 많은 경우 worker가 작업을 미리 너무 많이 가져가면 비효율이 생길 수 있다. 공식 최적화 문서는 Redis broker 사용 시 `worker_disable_prefetch` 옵션을 설명한다. 실행 슬롯이 비었을 때만 새 작업을 가져오게 해 긴 작업 환경에서 유리할 수 있다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/optimizing.html?utm_source=chatgpt.com "Optimizing — Celery 5.6.2 documentation"))

## 9-4. ETA/지연 작업과 Redis visibility timeout

Redis broker를 쓸 때 긴 ETA 작업은 visibility timeout 설정과 연관된 주의점이 있다. 공식 문서는 이 값을 너무 길게 잡는 것은 신뢰성 측면에서 권장되지 않으며, worker 종료 시 재전송 지연에 영향을 줄 수 있다고 설명한다. ([Celery Documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html?utm_source=chatgpt.com "Using Redis — Celery 5.6.3 documentation"))

즉, “나중에 실행” 기능을 쓸 때는 단순히 countdown만 넣는 게 아니라 브로커 특성까지 알아야 한다.

# 10. Redis와 RabbitMQ 중 무엇을 많이 쓰나

둘 다 많이 쓴다. 다만 성격이 조금 다르다.

## Redis

- 설정이 간단하다
    
- 개발/소규모 프로젝트에서 진입이 쉽다
    
- broker와 result backend를 같이 쓰기 편하다 ([Celery Documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html?utm_source=chatgpt.com "Using Redis — Celery 5.6.3 documentation"))
    

## RabbitMQ

- 메시지 큐 전용 브로커로 더 정석적인 선택인 경우가 많다
    
- 복잡한 메시징 패턴에서 강점이 있다
    

입문 단계에서는 보통 **Redis + Celery** 조합을 많이 시작한다.  
프로젝트 복잡도와 운영 요구가 커지면 RabbitMQ도 고려한다.

# 11. Celery Beat는 무엇인가

Celery Beat는 **주기 작업 스케줄러**다.  
worker가 “실행자”라면 beat는 “언제 실행할지 정해서 큐에 넣는 관리자”에 가깝다.

예:

- 매일 00:00에 로그 정리
    
- 매주 월요일 09:00에 리포트 생성
    
- 10분마다 외부 API 동기화
    

즉,

- worker: 일을 한다
    
- beat: 일을 등록한다
    

# 12. Celery Flower는 무엇인가

실무나 학습에서 종종 같이 언급되는 도구다.  
Flower는 Celery 모니터링 도구로, task 상태와 worker 상태를 웹 UI로 볼 수 있게 해 준다.  
운영 중 task가 쌓였는지, 실패했는지, worker가 살아 있는지 확인할 때 유용하다.

# 13. Celery가 적합한 작업 / 부적합한 작업

## 적합한 작업

- 이메일 발송
    
- 문자/푸시 알림
    
- 이미지/영상 변환
    
- PDF/엑셀 생성
    
- 통계 집계
    
- 외부 API 호출
    
- 크롤링
    
- AI 추론 후처리
    
- 배치 동기화
    

## 조심해야 하는 작업

- 매우 짧고 즉시 끝나는 단순 계산
    
- 강한 실시간성이 필요한 처리
    
- 중복 실행 시 치명적인 작업
    
- 강한 트랜잭션 일관성이 필요한 작업
    

예를 들어 “사용자가 버튼 누른 즉시 50ms 안에 결과를 보여줘야 하는 기능”은 Celery보다 동기 처리나 다른 이벤트 아키텍처가 더 맞을 수 있다.

# 14. Celery와 비슷한 개념 비교

## Celery vs Python threading

- threading은 같은 프로세스 안에서 동작
    
- Celery는 **프로세스/서버를 분리한 분산 작업 처리**까지 가능
    

## Celery vs cron

- cron은 운영체제 수준의 단순 스케줄 실행
    
- Celery Beat는 애플리케이션 수준에서 task를 스케줄링
    

## Celery vs WebSocket

- WebSocket은 실시간 통신 기술
    
- Celery는 백그라운드 작업 처리 기술
    

둘은 경쟁 관계가 아니라 함께 쓸 수 있다.  
예를 들어 Celery가 오래 걸리는 작업을 처리하고, 완료되면 WebSocket으로 사용자에게 알릴 수 있다.

# 15. 실무에서 자주 나오는 문제

실무에서는 아래 이슈를 자주 만난다.

## 작업 중복 실행

네트워크 문제, worker 재시작, ack 설정 때문에 발생 가능  
→ idempotency key, DB 상태 체크, 락 전략 필요

## 작업 유실

broker/worker 설정이 잘못되면 발생 가능  
→ durable queue, 적절한 ack/retry 정책 필요

## 결과 저장소 과부하

모든 task 결과를 오래 저장하면 backend 부담 증가  
→ 결과가 필요 없는 task는 저장 안 하거나 만료 정책 필요

## 긴 작업으로 인한 병목

짧은 작업과 긴 작업을 같은 큐에 두면 대기열이 꼬일 수 있다  
→ 큐 분리, worker 분리, prefetch 조정 고려

## 재시도 폭주

외부 API 장애 시 retry가 몰리면 시스템 전체 부하 증가  
→ exponential backoff, 최대 재시도 수 제한 필요

# 16. Django에서 보통 어떻게 구성하나

보통 이런 구조가 많다.

- Django app
    
- Redis
    
- Celery worker
    
- Celery beat
    
- Flower(선택)
    

예:

- `web`: Django 서버
    
- `redis`: broker/backend
    
- `worker`: 비동기 작업 실행
    
- `beat`: 주기 작업 스케줄러
    
- `flower`: 모니터링
    

Docker Compose로도 자주 묶는다.

# 17. 입문자가 꼭 기억해야 할 핵심 7가지

1. Celery는 **비동기 작업 큐**다.
    
2. 웹 요청에서 오래 걸리는 작업을 분리할 때 쓴다.
    
3. 핵심 구성은 **task, broker, worker, result backend, beat**다.
    
4. `delay()`는 간단 호출, `apply_async()`는 옵션 제어용이다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/calling.html?utm_source=chatgpt.com "Calling Tasks — Celery 5.6.2 documentation"))
    
5. Redis는 시작하기 쉽고 많이 쓰인다. ([Celery Documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html?utm_source=chatgpt.com "Using Redis — Celery 5.6.3 documentation"))
    
6. 실무에서는 **중복 실행, 재시도, ack, idempotency**가 중요하다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/configuration.html?utm_source=chatgpt.com "Configuration and defaults — Celery 5.6.2 documentation"))
    
7. Celery는 “그냥 비동기”가 아니라 **운영 관점까지 포함한 작업 처리 시스템**이다.
    

# 18. 한 줄로 정리

Celery는  
**“웹 애플리케이션에서 오래 걸리는 작업을 분리해, 메시지 큐를 통해 안정적으로 비동기 처리하게 해 주는 파이썬 작업 큐 시스템”**이라고 이해하면 된다. ([Celery Documentation](https://docs.celeryq.dev/en/main/userguide/configuration.html?utm_source=chatgpt.com "Configuration and defaults — Celery 5.6.2 documentation"))

원하면 다음으로 이어서  
**“Django + Redis + Celery 설정 방법”**,  
또는 **“Celery와 RabbitMQ/Redis 구조 비교”**까지 바로 정리해줄게.