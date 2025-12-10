# 9. 네트워크 보안
## 9.1. ARP Level
### 9.1.1. ARP Spoofing / Poisoning / Flooding

- **개념**: 공격자가 ARP를 속여 **트래픽을 가로채거나 변경·차단**하게 만드는 기법(ARP spoofing/poisoning; 지속적 가짜 응답 전송은 ARP flooding).
- **동작**: A가 “Who is R?”라고 묻는 ARP Request에 공격자 B가 “It’s me”로 회신 → **잘못된 MAC**이 ARP 캐시에 기록됨(=poisoning) → B가 계속 가짜 Reply를 보내 캐시를 유지(=flooding).
- **영향**: A의 웹·메시지·VoIP 등 모든 내용이 B를 **경유**하므로 도청/변조 가능(대표적이고 도구도 많음).

### 9.1.2. MITM(Man-in-the-Middle)

- **정의**: 통신 양단 사이에 **중간자 프록시**가 개입하는 일반적 문제(고전 **Diffie-Hellman**도 취약).
- **대응**: **PKI**, **일회용 키(원타임 패드)**, **강한 상호 인증**, **세컨드 채널 검증** 등.

### 9.1.3. Smurf 공격 (ICMP 증폭 DoS)

- **개념**: 피해자 IP를 **소스**로 위조한 **브로드캐스트 ICMP Echo**를 발송 → 다수 호스트가 Echo Reply를 피해자에게 보내 **서비스 불능** 유발.
- **대응**: 호스트/라우터에서 **브로드캐스트 ping 응답 금지**, **브로드캐스트로 향하는 패킷 포워딩 차단**(예: Linux `echo "1" > /proc/sys/net/ipv4/icmp_echo_ignore_broadcasts`).

### 9.1.4. 패킷 스니핑(탐지·수집) 포인트

- **L1 Tap**: **네트워크 탭**으로 링크의 흐름을 직접 미러링해 관찰.
- **허브(Hub)**: 물리계층(L1) 장치, **수신 프레임을 모든 포트로 복사**하는 멀티포트 리피터 → 같은 세그먼트의 패킷을 **누구나** 볼 수 있음.
- **스위치(Switch)**: **MAC 테이블**(MAC, 인터페이스, 타임스탬프; TTL 예: 60분)로 학습 전송 → 충돌 문제를 해결.
- **주의**: 스위치도 완벽하진 않음—**ARP Request는 세그먼트 전체에 도달**, 테이블을 **오버플로**시키면 MAC flooding 가능.

### 9.1.5. MAC Flooding

- **공격**: 임의의 **소스 MAC**으로 다량의 프레임을 보내 **스위치 테이블을 넘침** → 스위치가 허브처럼 동작해 프레임이 광범위로 복사.
- <font color="#ff0000">대응</font>: **MAC-레벨 접근 통제**(예: 포트별 MAC 제한), **IP:MAC 관계 감시**(ARPwatch/IDS 등); 라우터 환경에선 **오탐**도 고려.

## 9.2. TCP/TP Level
### 9.6. IP Spoofing

- **개념**: 로우 소켓 등으로 **송신 IP를 임의 변경**해 패킷을 생성하는 기법.
- **문제점/영향**:
    - **DoS/DDoS**(예: SYN flooding, Smurf 등) 유발, 출발지 은닉으로 **추적 곤란**.
    - **IP 기반 신뢰 서비스**(RPC, rlogin/rsh 등), **IP 주소 인증 의존 서비스**에 취약.
- **대응**:
    - **Ingress/Egress 필터링**(RFC 2827, “착한 시민” 접근이지만 운영상 어렵기도 함).
    - **백본 수준의 경로 기반 분산 패킷 필터링(RDPF)**: 라우팅 경로에 맞지 않는 인접 링크에서 온 패킷을 드롭.
    - **프로토콜/서비스 설계에서 IP Source에 의존한 인증 금지**.

### 9.7. Session Hijacking (TCP)

- **정의**: 유효한 세션을 **가로채 비인가 접근**을 얻는 공격(애플리케이션 계층—예: **HTTP 쿠키 탈취**—도 가능).
- **핵심 메커니즘**: **TCP Initial Sequence Number(초기 시퀀스 번호)** 예측 가능성 악용 → 가능성 높은 시퀀스 범위를 **패킷 폭주로 주입**하여 기존 연결에 **주입/명령 실행**.
- **공격 시나리오 예**: B와 신뢰 관계인 A에 대해, E가 **B의 IP로 스푸핑**하고, A의 초기 ISN을 추정·큐를 DoS로 막은 뒤 **B인 척 패킷 주입**(수신은 못해도 명령 실행 가능).
- ![](2025-10-14-12.jpg)
- **대응**:
    - **강한 ISN 생성(RFC 1948)**: ISN = M + F(sip, sport, dip, dport, secret).
	    - M: Monotonically increasing clock/counter
	    - F: Crypto hash
	    - secret: 해시 함수의 선택적 파라미터. 서버에서만 생성 및 사용
    - **암호화 사용**, **중요 앱은 애플리케이션 계층 인증 추가**.

### 9.8. Injecting False Routing Information

- **개념**: 공격자가 **라우팅 프로토콜 패킷 위조**로 라우터의 테이블을 오염시켜 트래픽 방향을 바꾸는 공격
- **대상 프로토콜**: OSPF, RIP, BGP 등.
- **효과**:
    - **라우팅 루프 유도**(A→D→C→A…로 순환).
	    - ![](2025-10-14-1.jpg)
    - **모니터링 지점으로 유도**(트래픽 스니핑/검열).
	    - ![](2025-10-14-2.jpg)
- **대응**: **신뢰 가능한 피어와만 인접/피어링**, **라우팅 메시지 인증(HMAC-MD5 등)**, **IPsec 활용**.

### 9.9. Port Scan

- **정의/목적**: 호스트의 **다양한 포트로 요청**을 보내 **열린 포트** 및 취약 서비스 식별(주공격 전 준비 단계). Finger Printing 기법. Reconnaissance
	- 도구: **Nmap, hping3**, <https://shodan.io>
	- Vertical Scanning: IP 주소 고정하고 모든 Port 번호 조합에 대해서 스캔
	- Horizontal Scanning: Port 번호 고정하고 여러 IP 주소에 대해서 스캔
- Stealthy Port Scan: 탐지 회피위한 포트 스캔 방법
- TCP SYN Scan, ACK Scan, FIN Scan, XMAS, YMAS
- **예시**:
	- SSH 취약점 노림 → **TCP/22**, UDP/22 탐색
	- LDAP 취약점 노림 → **TCP/389, UDP/389** 탐색.
- **스캔 기법**:
    - **SYN 스캔**(반개방): 열림=**SYN/ACK→RST**, 닫힘=**RST/ACK**.
    - RST을 보내면 로깅이 안 남았음
	    - ![|509x300](2025-10-14-4.jpg)
    - **ACK 스캔**: 방화벽 **필터링 판단** 등에 활용.
    - **FIN/XMAS/NULL(YMAS) 스캔**: **응답 부재/ RST** 패턴을 이용한 은닉 스캔.
    - **hping3**: 16바이트 단편화로 **보안장비 회피 시도*).
    - **IP 단편화**: **MTU 차이**로 조각난 패킷을 목적지에서 재조립.
- **탐지/대응**:
- **한 출발지에서 다수 포트 접촉** 패턴 탐지,
- 완전 분산 스캔은 난해.
- **의심 패킷 미응답** 등 소극적 대응(완전 차단은 어려움).
- Hardening: banner 정보 삭제
- CVE(Common Valnerable and Exposure): MITRE가 관리, attack이라는 체계로 분류 중

