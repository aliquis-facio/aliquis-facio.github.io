---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[NETWORK] 네트워크 근거리 통신 기술"
excerpt: "네트워크 2"

date: 2023-01-31
last_modified_at: 

categories: [NETWORK]
tags: [NETWORK]
---
<style>
    .pink {
        color: #FF6689;
    }

    .skyblue {
        color: #6666FF;
    }
</style>

# 0. 목차
* [2. 근거리 통신 기술](#2-근거리-통신-기술)
* [2.1. LAN(Local Area Network)](#21-lanlocal-area-network)
* [2.1.1. 근거리 통신 개요](#211-근거리-통신-개요)
* [2.1.1.1. 개념](#2111-개념)
* [2.1.1.2. 특징](#2112-특징)
* [2.1.1.3. 장단점](#2113-장단점)
* [2.1.1.3. 장점](#21131-장점)
* [2.1.1.3. 단점](#21132-단점)
* [2.1.3. 근거리 통신 프로토콜](#213-근거리-통신-프로토콜)
* [2.1.3.1. ALOHA(Adiitive Links Online Hawaii Area)](#2131-alohaadiitive-links-online-hawaii-area)
* [2.1.3.2. Slotted ALOHA](#2132-slotted-aloha)
* [2.1.3.3. CSMA/CD](#2133-csmacd)
* [2.1.4. IEEE 802 위원회의 LAN 표준안](#214-ieee-802-위원회의-lan-표준안)
* [2.2. 이더넷(Ethernet)](#22-이더넷ethernet)
* [2.2.1. 개요](#221-개요)
* [2.2.2. 장단점](#222-장단점)
* [2.2.2.1. 장점](#2221-장점)
* [2.2.2.2. 단점](#2222-단점)
* [2.2.3. 표준](#223-표준)
* [2.2.4. UTP 케이블(Cable)](#224-utp-케이블cable)
* [2.2.5. UTP 케이블 배열](#225-utp-케이블-배열)
* [2.3. 고속 이더넷(Fast Ethernet)](#23-고속-이더넷fast-ethernet)
* [2.3.1. 개요](#231-개요)
* [2.3.2. 특징](#232-특징)
* [2.3.3. 기존 이더넷과의 차이점](#233-기존-이더넷과의-차이점)
* [2.4. 기가비트 이더넷(Gigabit Ethernet)](#24-기가비트-이더넷gigabit-ethernet)
* [2.4.1. 개요](#241-개요)
* [2.4.2. 특징](#242-특징)
* [2.5. 토큰 패싱(Token Passing)](#25-토큰-패싱token-passing)
* [2.5.1. 개요](#251-개요)
* [2.5.2. 특징](#252-특징)
* [2.5.3. 장단점](#253-장단점)

# 2. 근거리 통신 기술
## 2.1. LAN(Local Area Network)
### 2.1.1. 근거리 통신 개요
#### 2.1.1.1. 개념
* 근거리 통신망: 제한된 일정 지역 내에 분산 설치된 각종 정보기기들 사이에서 통신을 수행하기 위해 구성된 최적화되고 신뢰성 있는 고속의 통신 채널을 제공하는 것. 일반적으로 전송 거리가 약 50m 정도의 거리임.

#### 2.1.1.2. 특징
* 건물 내에서 데이터 통신을 위해 사용되고 공유 파일 서버, 프린터 공유 등을 위해 사용됨.
* 이 기종 통신과 연결되어 데이터를 송수신 가능.
* 10Mbps ~ 100Mbps 속도로 데이터를 전송함.
* 멀티미디어 데이터 전송 가능.
<!-- * 채널(Channel)
데이터 통신을 위해 통신 매체에서 제공하는 통로. 채널을 점유해 통신이 이뤄짐. -->

* LAN(Local Area Network)의 주요 내용
<table>
    <thead>
        <tr>
            <th>목적</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>자원 공유</td>
            <td>1. 원격지의 자원을 공유함.<br>
            2. 복수의 사용자에게 독점적 사용권을 부여함.<br>
            3. 사용자는 불편 없이 모든 자원을 효율적으로 사용함.</td>
        </tr>
        <tr>
            <td>분산 처리</td>
            <td>1. 독립된 각 장비에서 계산과 작업을 처리함.<br>
            2. 전체 시스템의 능력은 연결된 모든 컴퓨터의 능력에 따라 결정됨.</td>
        </tr>
        <tr>
            <td>분산 제어</td>
            <td>1. 분산된 지역의 독립적인 장치 간의 통신을 통하여 프로세스를 제어함.<br>
            2. 높은 데이터 전송 속도와 신뢰도를 유지함.</td>
        </tr>
        <tr>
            <td>정보 교환</td>
            <td>1. video 및 voice 신호 전달.<br>
            2. text 데이터 전달.</td>
        </tr>
    </tbody>
</table>

#### 2.1.1.3. 장단점
##### 2.1.1.3.1. 장점
* 전송되는 패킷 손실 및 지연이 적음.
* 사용자 간에 쉽고 빠르게 자료(문서, 동영상 등) 공유 가능.
* 신뢰성이 높고 구축 비용이 적음.
* 오류 발생률이 낮음.

##### 2.1.1.3.2. 단점
* 전송 거리가 짧아 거리에 제약이 있음.
* UTP 및 광케이블로 구축되지만, 네트워크에 노드가 많아지면 충돌이 발생해 성능이 떨어짐.

### 2.1.3. 근거리 통신 프로토콜(Protocol)
#### 2.1.3.1. ALOHA(Adiitive Links Online Hawaii Area)
* 중앙국에 의한 제어 없이 무작위로 공통 전송 채널에 접속하는 경쟁 방식의 다원 접속 프로토콜임.
* 송신측: 전송할 패킷이 있으면 언제든지 패킷을 송신한 뒤, 수신측으로부터 오는 확인 응답 신호를 기다림.
* 수신측: 패킷이 수신되면 패킷의 오류를 검사한 후 확인 신호를 송신측으로 보냄.
* 송신측에서는 수신측으로부터 확인 신호가 도착하면 다음 패킷을 전송함.
* 패킷을 발송한 후 일정 시간 내에 확인 신호가 돌아오지 않으면 패킷이 손실된 것으로 인정하고 일정 시간 대기 후 재전송을 시도함.

* 1970년대초 하와이 군도에 있는 섬들 간에 무선 데이터 통신망을 구성하기 위한 연구에서 발전함.
* 각 station 간 synchronization을 하지 않고, 전송 전 통신 channel을 listen 하지 않는 multiple access control protocol임.
* station이 전송할 frame이 생기면, 바로 전송함.
* "max round trip time + a" 시간 동안 ACK를 기다림.
* ACK가 오면 성공, 그렇지 않으면 재전송함.
* backoff limit에 이를 때까지 재전송이 반복되면, frame 전송을 포기함.
<!-- 출처 넣기 -->

#### 2.1.3.2. Slotted ALOHA
* 중앙 제어국에서 보내 준 clock 신호를 이용해 모든 국들을 동기화시켜 패킷을 전송함.
* 패킷 충돌 확률을 감소시키고 성능을 개선함.
* ALOHA보다 전송 처리율이 2배임.
* 주로 무선 LAN에서 사용함.

#### 2.1.3.3. CSMA/CD([Carrier](#footnote_1)<sup>1</sup> Sense Multiple Access/Collision Detection)
CSMA를 발전시킨 것으로 CSMA 방식에 충돌 감지를 빨리하고 충돌이 발생하면 즉시 검출해 데이터 프레임의 송신을 중단하고 대기한 다음, 회선이 사용 중이 아닐 때 프레임을 재전송하는 방식임.

* 충돌이 없는 경우
    1. 전송을 원하는 호스트는 네트워크에 캐리어를 감지해 전송이 가능한지 검사함.

    1. 호스트는 전송이 가능할 경우 전송을 시작함.
    2. 호스트 A에서 발생한 프레임은 공유 매체를 통해 호스트 B, C, D로 broadcast 됨.
    3. 호스트 B, C는 목적지 IP 주소가 자기가 아니라는 것을 알면 바로 프레임을 폐기함.

    1. 호스트 D는 목적지가 자기라는 것을 알고 호스트 A에게 unicast로 응답함.
    2. 하지만 [shared device hub](#footnote_2)<sup>2</sup> 네트워크에서는 unicast와 broadcast의 차이가 없음.

* 충돌이 발생한 경우
    1. 전송을 원하는 호스트는 네트워크에 캐리어를 감지해 전송이 가능한지 검사함.

    1. 호스트 A에서 발생한 프레임과 호스트 B에서 발생한 프레임은 공유 매체에서 collision을 발생시킴.

    1. collision이 발생되면 jam signal을 모든 호스트로 전송해 collision 발생에 대해 알림.
    2. jam signal을 받은 호스트들은 일정 시간 후에 다시 전송을 시작함. 최대 15번까지 재전송함.

### 2.1.4. IEEE(Institute of Electrical and Electronics Engineers) 802 위원회의 LAN 표준안
* IEEE 802 위원회는 LAN 관련 표준화를 수행하는 표준화 기관이다.
* IEEE 802 위원회가 무선 LAN을 위해서는 약 50m 전송 거리, 11Mbps 전송 속도 등을 요구사항으로 정의함. -> <span class = "pink">무선 LAN은 모두 802.11로 시작함.</span>
* 위 조건을 만족하는 무선 LAN 표준들로는 IEEE 802.11b, IEEE 802.11a, IEEE 802.11g 등이 있으며 IEEE 802.11 요구사항은 좀 더 발전되어서 54Mbps, 100Mbps 등으로 변경되고 있다.

* IEEE 802 위원회 LAN 표준
<table>
    <thead>
        <tr>
            <th>표준</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>802.1</td>
            <td>상위계층 인터페이스와 MAC BRIDGE</td>
        </tr>
        <tr>
            <td>802.2</td>
            <td>LLC(Logical Link Control)</td>
        </tr>
        <tr>
            <td>802.3</td>
            <td>CSMA/CD(Carrier Sense Multiple Access/Collision Detection)</td>
        </tr>
        <tr>
            <td>802.4</td>
            <td>토큰버스(Token Bus)</td>
        </tr>
        <tr>
            <td>802.5</td>
            <td>토큰링(Token Ring)</td>
        </tr>
        <tr>
            <td>802.6</td>
            <td>MAN(Metropolitan Area Network)</td>
        </tr>
        <tr>
            <td>802.7</td>
            <td>광대역(Broadband) LAN</td>
        </tr>
        <tr>
            <td>802.8</td>
            <td>광섬유(Fiber Optic) LAN</td>
        </tr>
        <tr>
            <td>802.9</td>
            <td>종합데이터 & 음성 네트워크</td>
        </tr>
        <tr>
            <td>802.10</td>
            <td>보안(Security)</td>
        </tr>
        <tr>
            <td>802.11</td>
            <td>무선 네트워크(Wireless Network)</td>
        </tr>
    </tbody>
</table>

## 2.2. 이더넷(Ethernet)
### 2.2.1. 개요
* 근거리 유선 네트워크 통신망 기술 for LAN. IEEE 802.3에 표준으로 정의되어 있음.
* 일반적으로 동축 케이블 또는 비차폐 연선을 사용하고, 버스 형식으로 망을 구성함.
* 가장 보편적인 시스템으로 10Base-T, 100Base-T 등이 있음.

<!-- * IEEE 802.3 표준
CSMA/CD 방식으로 액세스(access) 하는 방법 및 물리 계층의 사용을 정의한 이더넷(ethernet) 국제표준 규격임. -->

### 2.2.2. 장단점
#### 2.2.2.1. 장점
* 적은 용량의 데이터를 전송할 경우 성능이 우수함.
* 설치 비용이 저렴하고 관리가 쉬움.
* 네트워크 구조가 간단함.

#### 2.2.2.2. 단점
* 네트워크 사용 시에 신호 때문에 충돌이 발생함.
* 충돌 발생 -> 네트워크에서 지연이 발생함.
* 시스템 부하 증가 -> 충돌 또한 계속적으로 증가함.

### 2.2.3. 표준
<table>
    <thead>
        <tr>
            <th>표준</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>10Base-5</td>
            <td>동축 케이블로 500m의 길이를 가짐.
            Thick 케이블이라고도 부르며, 2.5m 간격으로 트랜시버를 연결해 사용함.</td>
        </tr>
        <tr>
            <td>10Base-2</td>
            <td>Thin 케이블이라고도 부르며, 200m의 길이를 가짐.</td>
        </tr>
        <tr>
            <td>10Base-T</td>
            <td>UTP 케이블을 이용하는 것으로 현재 가장 많이 사용됨.
            100m의 길이를 가짐.</td>
        </tr>
    </tbody>
</table>

<span class = "pink">10 -> 전송속도: 10Mbps</span>

### 2.2.4. UTP 케이블(Unshielded Twisted Pair Cable)
UTP 케이블은 5개의 카테고리로 분류되며 유선 LAN을 연결함.
* UTP 케이블 카테고리(Category)
<table>
    <thead>
        <tr>
            <th>카테고리(Category)</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Category 1</td>
            <td>전화 통신에 사용하며 데이터 전송에 적합하지 않음.</td>
        </tr>
        <tr>
            <td>Category 2</td>
            <td>UTP 연결 방식 중 하나로 최대 4Mbps 속도로 데이터 전송.</td>
        </tr>
        <tr>
            <td>Category 3</td>
            <td>10Base-T 네트워크에 사용. 최대 10Mbps 데이터 전송.</td>
        </tr>
        <tr>
            <td>Category 4</td>
            <td>토큰링 네트워크에서 사용. 최대 16Mbps로 데이터 전송.</td>
        </tr>
        <tr>
            <td>Category 5</td>
            <td>UTP 케이블 연결 방식. 최대 100Mbps로 데이터 전송.</td>
        </tr>
    </tbody>
</table>

### 2.2.5. UTP 케이블 배열
* UTP 케이블에는 각 케이블의 배열 정보를 의미하는 케이블 타입이 기록되어 있음.
* UTP 케이블은 카테고리 5를 사용하고, 4쌍의 꼬임선으로 모두 8가닥으로 이뤄짐.
* 케이블 배열에는 순서가 있는데 T568A 타입과 T568B이 있음. 다이렉트 케이블 연결 시 양쪽 모두 같은 타입을 사용하고, 크로스 케이블 연결 시 한 쪽은 T568A, 다른 한 쪽은 T568B를 사용함.

* EIA-568A
<table>
    <thead>
        <tr>
            <th>핀 번호</th>
            <th>케이블 색</th>
            <th>신호</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>흰색 + 녹색</td>
            <td>Tx+</td>
        </tr>
        <tr>
            <td>2</td>
            <td>녹색</td>
            <td>Tx-</td>
        </tr>
        <tr>
            <td>3</td>
            <td>흰색 + 주황</td>
            <td>Rx+</td>
        </tr>
        <tr>
            <td>4</td>
            <td>파랑</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>5</td>
            <td>흰색 + 파랑</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>6</td>
            <td>주황</td>
            <td>Rx-</td>
        </tr>
        <tr>
            <td>7</td>
            <td>흰색 + 갈색</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>8</td>
            <td>갈색</td>
            <td>사용X</td>
        </tr>
    </tbody>
</table>

* EIA-568B
<table>
    <thead>
        <tr>
            <th>핀 번호</th>
            <th>케이블 색</th>
            <th>신호</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>흰색 + 주황</td>
            <td>Tx+</td>
        </tr>
        <tr>
            <td>2</td>
            <td>주황</td>
            <td>Tx-</td>
        </tr>
        <tr>
            <td>3</td>
            <td>흰색 + 녹색</td>
            <td>Rx+</td>
        </tr>
        <tr>
            <td>4</td>
            <td>파랑</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>5</td>
            <td>흰색 + 파랑</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>6</td>
            <td>녹색</td>
            <td>Rx-</td>
        </tr>
        <tr>
            <td>7</td>
            <td>흰색 + 갈색</td>
            <td>사용X</td>
        </tr>
        <tr>
            <td>8</td>
            <td>갈색</td>
            <td>사용X</td>
        </tr>
    </tbody>
</table>

## 2.3. 고속 이더넷(Fast Ethernet)
### 2.3.1. 개요
* IEEE 802.3에서 제안된 것. 기존 이더넷에 비해 전송 속도가 향상되었으며, 100Mbps로 데이터를 전송 가능.
* 100Base-T로 이름으로 정의됨. 여기서 100은 데이터 전송 속도를 의미함.
* 100Base-T 옵션은 모두 IEEE 802.3 매체 접근 제어 프로토콜과 프레임 형식을 사용함. 기존의 10Base-T 이더넷과 프레임과 포맷이 같고, 매체 접근 방식도 CSMA/CD로 동일하며 MAC(Media Access Protocol) 프로토콜 그대로 사용 가능함.

### 2.3.2. 특징
* 성형(Star) 네트워크 토폴로지를 사용함.
* CSMA/CD 방식을 사용하며 기존 이더넷의 10Mbps보다 10배 향상된 100Mbps의 전송 속도를 갖음.

### 2.3.3. 기존 이더넷과의 차이점
<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>이더넷(Ethernet)</th>
            <th>고속 이더넷(Fast Ethernet)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>표준</td>
            <td>IEEE 802.3</td>
            <td>IEEE 802.3</td>
        </tr>
        <tr>
            <td>속도</td>
            <td>10Mbps</td>
            <td>100Mbps</td>
        </tr>
        <tr>
            <td>토폴로지</td>
            <td>성형과 버스형</td>
            <td>성형</td>
        </tr>
        <tr>
            <td>MAC 프로토콜</td>
            <td>CSMA/CD</td>
            <td>CSMA/CD</td>
        </tr>
        <tr>
            <td>케이블</td>
            <td><acronym title="Unshielded Twisted Pair">UTP</acronym>, Fiber</td>
            <td><acronym title="Shielded Twisted Pair">STP</acronym>, UTP, Fiber</td>
        </tr>
        <tr>
            <td>전이중 케이블</td>
            <td>지원</td>
            <td>지원</td>
        </tr>
        <tr>
            <td>다른 이름</td>
            <td>10Base-T</td>
            <td>100Base-T</td>
        </tr>
    </tbody>
</table>

## 2.4. 기가비트 이더넷(Gigabit Ethernet)
### 2.4.1. 개요
* 1초에 1Gbps의 속도로 데이터를 전송할 수 있는 이더넷 표준 기술임.
* 100Base-X로 정의됨.
* 호환성이 좋아서 기존 이더넷과 호환됨.
* 1995년 후반, IEEE 802.3 위원회는 이더넷 구성 형태에서 초당 기가비트의 속도로 패킷을 전달하기 위한 방법을 연구하기 위해 고속 연구 그룹을 결성함.
* CSMA/CD 프로토콜과 10Mbps와 100Mbps의 기존 이더넷 형태를 유지하며 이더넷과 고속 이더넷의 관리 시스템 이용이 가능함.

### 2.4.2. 특징
* 성형(Star) 네트워크 토폴로지 사용함.
* MAC 프로토콜로 CSMA/CD 방식을 사용함.
* 고속 이더넷보다 고가이지만, 10배의 전송 속도를 가짐.
* 케이블의 길이를 줄이고 전송 속도를 향상함.

## 2.5. 토큰 패싱(Token Passing)
## 2.5.1. 개요
* 토큰이라는 제어비트를 송신하고, 해당 토큰을 확보해서 통신을 하는 방식임.
* 링(Ring) 형태의 네트워크 토폴로지를 사용함.
* 통신 회선에 대한 제어 신호가 논리적으로 형성된 링에서 각 노드 간을 옮겨가면서 데이터를 전송하는 방식임.
* 충돌이 발생하지 않음.

## 2.5.2. 특징
* 가변 길이의 데이터 프레임 전송 가능.
* 하드웨어 장비가 복잡하고 평균 대기 시간이 높음.
* 부하가 높을 때에는 안정감이 있고, 접근 시간이 대략적으로 일정한 값을 유지함.
* 링형 토폴로지 통신망에서 통신 회선에 대한 제어 신호가 각 노드 간을 순차적으로 옮겨 가면서 데이터를 전송하는 방식임.
* 특정한 비트 패턴으로 구성된 짧은 프레임 형태임.
* 통신 회선의 길이가 무제한임.
* 확장성이 어려움.
* [고속 버스트 전송](#footnote_3)<sup>3</sup>에 유리함.

## 2.5.3. 장단점
<table>
    <thead>
        <tr>
            <th>구분</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>장점</td>
            <td>1. 충돌 발생 X<br>
            2. 성능 저하가 적음.</td>
        </tr>
        <tr>
            <td>단점</td>
            <td>1. 설치 비용이 고가이고 복잡함.<br>
            2. 노드가 많으면 성능이 떨어짐.<br>
            3. 토큰에 대한 분실 발생 가능.</td>
        </tr>
    </tbody>
</table>

***

<a name="footnote_1">[1]</a> 반송파(carrier): 정보가 실린(변조된) 높은 주파수의 파형. 정보 전달을 위해 입력 신호를 변조한 전자기파.<br>
<a name="footnote_2">[2]</a> shared device hub: <br>
<a name="footnote_3">[3]</a> 버스트 전송: 간격을 두고 중단하면서 하는 전송. 짧은 시간 동안 상대적으로 고대역의 데이터 전송이 가능함.<br>