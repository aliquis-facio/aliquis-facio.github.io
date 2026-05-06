---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] Data Transfer"
excerpt: "Network Layer"

date: 2025-05-27
last_modified_at: 

categories: [NETWORK]
tags: [COMPUTER NETWORK, NETWORK, TIL]
---

# 목차

# Network Layer: Data Transfer
네트워크 계층은 데이터를 출발지 호스트에서 목적지 호스트까지 경로를 설정하고 포워딩하는 기능을 수행한다.

# 7.1 Services – 네트워크 계층의 주요 서비스
## Packetizing
상위 계층의 메시지를 **패킷(datagram)**으로 만들고, **헤더(주소 등)**를 붙여 하위 계층으로 전달

SAR (Segmentation and Reassembly): 너무 큰 데이터는 나누고, 수신 측에서 재조립
* 쪼갤 때 source와 destination 변경 금지
* 라우터는 내용 변경 금지: 단지 주소만 확인해서 다음 홉으로 포워딩
* 쪼개놓은 모든 packet 부분에 기존 header와 fragments header가 있어야 한다
![SAR|40](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-4.jpg?raw=true)
![SAR in intermediate node](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-7.jpg?raw=true)

* destination에서는 모든 fragments가 도착할 때까지 기다리고 재조립한 후 L4로 전달

## Routing(=Forwarding)
![Routing](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-2.jpg?raw=true)

Routing: destination까지 최적 경로 결정, 라우팅 알고리즘에 따라 전체 경로 계산
패킷을 적절한 인터페이스로 전달, 포워딩 테이블(라우팅 테이블)을 기반으로 동작
테이블의 output interface는 destination address 또는 label을 이용한다
multicasting에서는 신호를 증폭 -> 쪼개서 각각의 router로 보낸다

## Error Control
네트워크 계층에서는 일반적인 에러 제어 없다
하지만 ICMP와 헤더 체크섬으로 일부 오류 감지 수행
checksum을 통해 corruption 확인 -> 데이터가 깨졌을 경우 그 다음에 따라오는 packet들은 의미가 없다!
~~ICMP 개념 및 동작원리~~

## Flow Control
네트워크 계층 자체에서는 직접적인 흐름 제어를 제공하지 않는다

**상위 계층(TCP 등)**에서 담당함

## Congestion Control (혼잡 제어)
네트워크나 라우터의 처리 능력을 초과하는 패킷 발생 -> congestion 발생 -> 라우터가 드롭

상위 계층은 패킷 손실을 재전송 → 혼잡이 더 심해짐 → 시스템 마비 가능(Avalanche Effet)

네트워크 계층 차원에서는 직접 제어는 어렵지만 원인을 이해하고 예방 가능

## QoS (Quality of Service)
멀티미디어 등 실시간 트래픽의 품질 보장 필요

대부분은 상위 계층에서 구현

## 보안
인터넷 초기에는 보안 고려 X → 현재는 필수 요소

네트워크 계층에서 IPSec 같은 보안 계층이 필요함
connectionless -가상화-> connection oriented

# 7.2 Packet Switching – 패킷 스위칭
## Switch
L1: Dummy Hub
L2: L2 switching hub
L3: L2 + IP routing, router
L4: Transport layer switch
L7: Application Switch, Content Switch, Multi-Layer Switch

## L1 Switch
Dummy Hub
연결된 모든 port에 frame을 broadcast한다
bandwidth을 모든 ports와 공유한다 -> 대역폭이 감소한다

## L2 Switch
Switching Hub
신호 세기를 증폭한다
MAC 주소를 이용해 원하는 대상에게만 frame 전달이 가능하다
받는 측에서는 어디서 보냈는지 알 수 있다.
bandwidth의 감소 없이 유지가 가능하다

## L4 Switch, L7 Switch
Load Balancer
Network 또는 Server에 분산된 작업 부하(load)를 공평하게 분배(distribution)하는 장치
load balancer는 여러 대의 server나 network device에 들어오는 요청을 받아 해당 요청을 처리하는 server로 전달하는 역할
이를 통해 server load distribution, high availability(가용성), scalability(확장성) 및 performance 향상을 달성할 수 있다
주로 server group에서 사용한다
전체 시스템의 성능과 가용성을 향상할 수 있다

장점
* Load Distribution: 특정 서버의 과부하 방지 및 시스템 전체의 성능 향상
* High Availability: 여러 대의 server(cloud)를 관리하므로, 한 대의 server에 장애가 발생해도 다른 server로 요청을 전달할 수 있다
* Scalability(확장성): 새로운 server를 cloud에 추가하거나 기존 server를 제거하는 경우, load balancer는 자동으로 이를 감지하고 traffic을 새로운 server로 분배한다

Metrics:
Throughput: 처리량
CPS(Connection Per Second): 초당 접속률
L7 TPS(Transaction Per Second): 초당 처리량
Concurrent connection: 동시접속자수

### L4 Switch
Transport Layer Switch
L4에서 load balacing 역할을 하는 switch
transport layer의 header 정보를 분석해 packet을 처리하고 전송방향을 결정
주로 port 정보를 활용해 TCP/UDP segment의 정보를 분석해 데이터의 전송 방향을 처리
traffic pattern을 분석해 QoS(Quality of Service) 정책 적용
port로의 access control 가능
application 내의 다양한 형태의 packet 내용을 살펴보기 어렵고 사용자의 IP가 수시로 바뀌는 경우 해당 사용자에 대한 연속적인 service를 제공하기 어렵다

### L7 Switch
Application Switch, Content Switch, Multi-Layer Switch
전체 layer의 정보를 바탕으로 switching을 한다
payload(URL, cookie, SSL(Secure Sockets Layer) session ID 등)
고급 load balancing, traffic control, 보안기능 제공
worm, e-mail virus와 같이 특정 pattern을 갖고 있는 packet 등 제어 가능
DoS, DDoS 해결

## Datagram 방식 (Connectionless)
![Connectinoless](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-3.jpg?raw=true)

각 패킷이 독립적으로 전송, 서로 다른 경로를 갈 수도 있음

IP 네트워크가 사용하는 방식

각 라우터는 패킷의 목적지 주소만 보고 처리

## Virtual Circuit 방식 (Connection-oriented)
![Connection-oriented](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-8.jpg?raw=true)

가상 회선 설정 후 모든 패킷이 동일 경로로 이동

각 패킷에 flow label = VCI(Virtual Circuit Identifier) 포함

3단계 절차: Setup → Data Transfer → Teardown

Set-up Phase
2개의 보조 packets(request packet, ACK packet)을 이용해 가상 회선의 entry를 만든다
request packet: source와 destination의 주소를 옮긴다
![Set-up Phase 1](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-9.jpg?raw=true)
![Set-up Phase 2](https://github.com/aliquis-facio/aliquis-facio.github.io/blob/master/_image/2025-05-28-10.jpg?raw=true)

Data-Transfer Phase
가상회선을 따라 packet이 전송된다

Teardown Phase
source가 destination에게 teardown packet을 전송한다
destination이 source에게 confirmation packet을 전송한다
모든 router들이 대응하는 entry를 제거한다

_MPLS 같은 네트워크에서 활용_

# 7.3 Network Performance – 네트워크 성능

## Delay (지연)
종류	설명
Transmission Delay	프레임을 전송하는 데 걸리는 시간
Propagation Delay	신호가 매체를 따라 전파되는 시간
Processing Delay	라우터에서 패킷 처리 시간
Queueing Delay	큐에서 대기하는 시간

전체 지연 = (n+1)(전송 + 전파 + 처리 지연) + n(큐 지연)
(n: 경유하는 라우터 수)
x
## Throughput (처리량)
단위 시간당 전달되는 데이터 비트 수

경로상 **가장 느린 링크의 속도(bottleneck)**에 의해 결정됨

Throughput = min(𝑇𝑅1,𝑇𝑅2,...,𝑇𝑅𝑛)
Throughput=min(TR 1​ ,TR 2​ ,...,TR n )

## Packet Loss
라우터 버퍼가 가득 차면 패킷 드롭

재전송이 혼잡 유발 → 악순환

## Congestion Control (혼잡 제어)
네트워크 계층 자체는 혼잡 제어 기능 미흡

**전송 계층(TCP)**에서 본격적으로 제어하나, 혼잡 원인을 네트워크 계층에서 이해하는 것도 중요

# 7.4 IPv4 – 인터넷 프로토콜 버전 4
기본 구조: 헤더 + 데이터

32비트 주소 체계, 최대 4.3억 개 주소

ARP로 MAC 주소를 찾고, ICMP로 오류 통보

(※ 본 내용은 7장 후반부와 별도로 Chapter 8에서 더 상세히 설명됨)

📌 요약
항목	설명
Packetizing	상위 계층 데이터에 IP 헤더를 추가해 패킷 생성
Forwarding	목적지 주소 기반으로 다음 홉 선택
Routing	전체 네트워크 최적 경로 계산
Delay 종류	전송, 전파, 처리, 대기
Throughput	가장 느린 링크가 병목
Congestion	드롭 → 재전송 → 더 혼잡
Switch 종류	L1 (허브), L2 (스위치), L3 (라우터), L4/L7 (로드 밸런서)

# 참고
* [IPv6 기본 헤더](http://www.ktword.co.kr/test/view/view.php?m_temp1=3251&id=1065)
* [IPv4, IPv6 헤더 비교](http://www.ktword.co.kr/test/view/view.php?no=5185)