# 방화벽(Firewall)
## 1. 정의와 역할

![방화벽이란?](https://cf-assets.www.cloudflare.com/slt3lc6tev37/5wfmLijgWmcfy3AqBkmYKc/7d52f8a30aec966d734bf17a0f14573a/what-is-a-firewall.svg)

- **정의**: 내부 네트워크와 외부(인터넷) 사이에서,  **허가된 트래픽만 통과시키고 나머지는 차단**하는 장비/소프트웨어.
- 정책(rule set)에 따라 “허용(accept)” / “차단(deny)”을 결정.
- 보안은 **“정책을 얼마나 제대로 구성했느냐”** 에 달려 있음.

## 2. Stateless Firewall와 한계

packet filtering/classification
기본 예시 룰:

![](2025-11-17-00-27-47.png)

1. 외부 → 웹서버(80/tcp) 허용
2. 웹서버(80/tcp) → 외부 응답 허용
3. 내부 사용자망(210.123.37.0/24)에서 임의의 외부 목적지로 나가는 출구 허용
4. 외부에서 내부 사용자망으로 들어오는 대응 패킷 허용
5. 나머지는 모두 deny

- 특징:
    - 각 규칙이 **방향성을 따로따로** 보고 있음.
    - **세션 개념(상태)** 없이 “이 패킷이 단독으로 허용 대상인가?”만 판단.
- 문제점:
    - 3번 / 4번 규칙처럼 출발지/목적지를 넓게 열어두면,  세션과 관계없는 외부 패킷도 들어올 수 있음.
    - 포트 범위를 너무 넓게 허용하면 **백도어 포트**도 같이 열리는 꼴.
    - Rule 수가 많아지면 “위에서부터 첫 매치(First-match)” 때문에 성능 저하.
    - 한 패킷에 대해 승인이 되면 같은 연결에서 이어지는 패킷들도 승인이 되어야 하지만, Stateless Firewall은 이러한 사실에 대한 이점이 없음.

## 3. Stateful Inspection

- **TCP 세션** 개념을 도입:
    - 최초 SYN/3-way handshake를 통과한 이후,  그 세션에 속한 후속 패킷(ACK 등)은 **세션 테이블을 기준으로 자동 허용**.
- 장점:
	![](2025-11-17-00-49-39.png)
    - 3번/4번처럼 “쌍을 이루는 규칙”을 세션 레벨에서 관리 → 정책 간소화.
    - 응답 패킷을 굳이 넓게 열 필요 없이, “이미 허가된 세션에 대한 응답”만 허용.
- 교수님이 강조한 포인트:
    - “어떤 프로토콜이든 결국 **요청/응답의 관계**를 이해하고,  그 관계를 깨뜨리는 패턴이 시큐리티 홀(Security hole)이 된다.”

## 4. DMZ(DeMilitarized Zone)

- 배경:
    - 웹 서버(Web)와 DB 서버(DB)를 **같은 내부 망**에 두면,  공격자가 Web만 뚫어도 곧바로 DB로 이동 가능.
    - Web은 인터넷에 열려 있어 공격 당하기 쉬움, DB는 내부 핵심 정보라 더 잘 보호해야 함.

![](2025-11-17-00-34-42.png)
> 단일 방화벽 DMZ

![](2025-11-17-00-53-22.png)
> 듀얼 방화벽 DMZ

- DMZ 구조:
    - 방화벽에 **인터페이스를 3개** 이상 두고,
        - 외부(Internet)
        - **DMZ 구간(Web, Mail 등 외부 서비스 서버)**
        - 내부(사내망, DB 등)
    - Web 서버는 DMZ에, DB는 내부망에 위치.
    - DMZ → DB 방향은 **정말 필요한 포트(ex. 1521/Oracle)** 만 하나 딱 열어둠.

- 효과:
    - Web이 완전히 컴프로마이즈(compromised) 되어도  DB로 향하는 트래픽은 방화벽 규칙 하나를 또 통과해야 하므로 방어선 추가.
    - Web 쪽은 공격/스캔을 허용해야 하지만, DB 쪽은 강하게 제한 가능.

---

# 참고

- [Naver: 방화벽(Firewall)이란 무엇인가?](https://blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=kebinj&logNo=40102444089)
- [Cloudflare: 방화벽이란? 네트워크 방화벽의 작동 방식](https://www.cloudflare.com/ko-kr/learning/security/what-is-a-firewall/)
- [Tistory: Stateful/Stateless 방화벽 이해하기](https://logforlog.tistory.com/entry/StatefulStateless-%EB%B0%A9%ED%99%94%EB%B2%BD-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
- [방화벽에서의 Stateful VS Stateless](http://blog.omoknooni.me/64)
- [ITpedia: 비무장지대(DMZ)란 무엇입니까?](https://ko.itpedia.nl/2023/01/28/wat-is-een-demilitarized-zone-dmz/)
- [Fortinet: DMZ 네트워크](https://www.fortinet.com/kr/resources/cyberglossary/what-is-dmz)
- 