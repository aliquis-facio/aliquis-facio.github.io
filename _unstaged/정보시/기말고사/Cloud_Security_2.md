# 02. 클라우드 보안 정리
## 1. 클라우드 보안 전체 그림
### 1.1. 가상화 방식 두 가지

- **하이퍼바이저 기반(VM)**
    - 물리 서버 위에 하이퍼바이저(VMware, Xen, AWS Nitro 등)를 올리고, 그 위에 **각각 OS가 깔린 VM**을 여러 개 띄우는 방식.
- **컨테이너 기반(Kubernetes 등)**
    - 하나의 OS 커널 위에서, 애플리케이션 코드 + 필요한 라이브러리/패키지를 묶은 **컨테이너 단위**로 실행.
    - 배포 환경이 달라도 동일한 컨테이너 이미지만 쓰면 되므로, **“내 PC에선 되는데 서버에선 안 된다” 문제를 줄여줌**.
    - 컨테이너들을 모아 운영하는 단위를 **클러스터**, 그 안의 최소 실행 단위를 **파드(pod)** 라고 부름(K8s).

> → **“하이퍼바이저 vs 컨테이너 차이”**: VM은 OS 단위 가상화, 컨테이너는 애플리케이션/라이브러리 레벨 격리.

### 1.2. CNAPP 개념 (CSPM + CWPP + CIEM + Micro-Segmentation)

- **CSPM (Cloud Security Posture Management)**
    - 클라우드 자산을 쭉 수집해 **무엇이 어디에 있는지** 파악
    - 리소스 보안 설정 점검(퍼블릭 노출, 암호화 여부 등)
    - 네트워크 구조 가시성 확보 및 일부 트래픽 탐지/차단
- **CWPP (Cloud Workload Protection Platform)**
    - **서버·컨테이너 워크로드** 대상
    - OS/패키지의 **CVE 취약점 점검**,
    - 런타임에서 악성 프로세스, 권한 상승, 컨테이너 이스케이프 등 모니터링
- **CIEM (Cloud Infrastructure Entitlement Management)**
    - IAM 계정·Role이 **어떤 권한을 가지고 있는지 가시화**
    - 과도한 권한, 미사용 권한, 외부에서 접근 가능한 권한 등을 찾아내 정리
- **Micro-Segmentation (마이크로 세그멘테이션)**
    - 동일 서브넷 안에서도 **서버 간 통신을 기본 차단**하고, 꼭 필요한 통신만 허용
    - 침해된 서버가 다른 서버로 옮겨 다니는 **횡이동(lateral movement)** 을 막는 제로 트러스트 관점의 네트워크 분할 방식

> 정리: 클라우드 인프라 보안은 **CSPM(구조·설정) + CWPP(워크로드) + CIEM(권한) + Micro-Segmentation(네트워크)** 를 합쳐서 보는 **CNAPP** 관점으로 이해하면 됨.


## 2. 클라우드 인프라 구조 (Region / AZ / VPC)

- **리전(Region)**
    - 특정 지리적 영역(예: 서울 리전 ap-northeast-2)에 여러 개의 **가용 영역(AZ)** 이 모여있는 단위.
- **가용 영역(AZ)**
    - 동일 재해에 함께 영향을 받지 않도록 설계된 **물리적으로 분리된 데이터센터** 집합.
- **VPC (Virtual Private Cloud)**
    - 하나의 리전 안에서 여러 AZ를 묶어 **가상 데이터센터**처럼 쓰는 논리 네트워크.
    - VPC 안에서 **퍼블릭/프라이빗 서브넷**을 쪼개 웹서버, WAS, DB 등을 배치한다(8페이지 VPC/서브넷 그림 참고).

> 포인트: 클라우드는 **물리 센터 + 네트워크 장비**를 직접 만지는 대신, **Region–AZ–VPC–Subnet** 구조를 이해하고 설계하는 것이 핵심.

## 3. 계정·권한 관리(요약)

이 세션에서는 계정 자체보다는 **권한·보안주체 관리를 CNAPP/CIEM 맥락**으로 다시 강조.

- 클라우드 리소스는 모두 **API 호출**로 생성·변경·삭제됨 → **보안 주체(IAM User/Role)** 가 가진 권한이 곧 보안의 시작점.
- CIEM 관점에서 보는 것들
    - **누가(Who)**: 어떤 IAM 주체 / Role 이
    - **무엇을(What)**: 어떤 리소스에
    - **어떻게(Can Access)**: 어떤 정책으로 접근 가능한지 분석
- 서버/DB 계정은 여전히 중요 → 전산센터나 보안 VPC에 **계정 관리·접근통제 솔루션(PAM, DB 접근제어)** 을 두고, 클라우드의 EC2/RDS에 대해 중앙에서 접속 통제.

## 4. 네트워크 보안
### 4-1. 로드밸런서 & 오토스케일링

- **ELB(Elastic Load Balancing)**
    - 여러 AZ의 EC2·컨테이너·Lambda에게 트래픽을 분산.
    - 특정 알고리즘/가중치로 트래픽을 나누고, 헬스 체크를 통해 비정상 인스턴스는 빼준다(18페이지).
- **Auto Scaling**
    - CPU 사용률 등 지표에 맞춰 자동으로 인스턴스를 늘리거나 줄이는 기능(19페이지).
    - 예) 이벤트/세일 기간에는 서버 자동 증설 → 종료 후 자동 축소 → **가용성과 비용 효율 동시 달성**.

### 4-2. 온프레미스와 AWS DMZ 아키텍처 비교

- **온프레미스**
    - 외부 인터넷 → 1차 방화벽 → DMZ(웹서버) → 2차 방화벽/WAF/IPS → AP 서버 → 3차 방화벽 → DB 서버 구조(20페이지).
    - 물리 장비/케이블 순서가 곧 트래픽 흐름.
- **AWS에서의 전통적 DMZ (Ingress/Egress)**
    - **Security Group(SG)** 이 각 ENI(네트워크 인터페이스)에 붙어 방화벽 역할 수행.
    - Ingress:
        - Public Subnet의 ALB(SG) → Private Subnet의 WEB/WAS(SG) → DB Tier(SG) 형태(21페이지).
    - Egress:
        - 내부 서버 → NAT Gateway / Proxy(Web Filter) → 인터넷(22페이지).
    - 트래픽은 **물리 순서가 아니라 라우팅 테이블 규칙**에 따라 이동 → 라우팅을 잘못 짜면 **Public Subnet에서 바로 DB로 가는 등 우회 경로 위험**이 생김.

### 4-3. SG / NACL 한계와 3P 방화벽, AWS Network Firewall

- **Security Group & NACL 한계(23~24페이지)**
    - SG: ENI에 붙는 **Stateful** 방화벽, 허용 규칙만 존재, 규칙 개수/SG 개수 제한 존재.
    - NACL: 서브넷 단위 **Stateless** 필터링, 규칙 수 제한.
    - 둘 다 L3~L4 수준 IP/Port 통제 중심 → **애플리케이션 레벨 심층검사, 중앙집중 관리, 컴플라이언스 요구**를 충족하기 어렵다.
- **서드파티 NGFW 적용 구조**
    - 팔로알토, 포티넷 같은 **소프트웨어 방화벽 이미지**를 EC2 위에 올려 사용.
    - DMZ 앞단에 NLB + NGFW → ALB → EC2 구조로, 온프레미스와 비슷한 다단계 방화벽 구성(25페이지).
    - GWLB(Gateway Load Balancer)와 연동해, 여러 VPC의 트래픽을 중앙 NGFW로 보내는 아키텍처도 가능(26~28페이지).
- **AWS Network Firewall + Transit Gateway 구조**
    - **Inspection VPC** 에 AWS Network Firewall 배치, 여러 워크로드 VPC/Ingress/Egress VPC 트래픽을 TGW로 모아 통과시키는 중앙 방화벽 아키텍처(29페이지).

### 4-4. DDoS & L7 방어

- **AWS Shield Standard (L3/L4)**
    - 별도 비용 없이 기본 제공.
    - Edge/Border에서 SYN Proxy, 패킷 유효성 검증, 분산 스크러빙, 자동 라우팅으로 대규모 네트워크 공격 완화(30페이지).
- **AWS WAF (L7, 웹 공격/DDoS)**
    - AWS Managed Rules, 익명 프록시/토르 탐지, Rate-based Rule(임계치 기반) 지원.
    - CloudFront / ALB / API Gateway 앞단에서 애플리케이션 계층 공격을 수초 내 탐지·차단(31페이지).
- **L7 DDoS 아키텍처**
    - Route53 → CloudFront+WAF+Shield → DMZ VPC(ALB, Network Firewall) → Workload VPC(EC2/EKS/RDS) 구조(32페이지).

## 5. 암호화 및 키 관리
### 5-1. 통신 구간 암호화

- AWS는 **AZ 간, 리전 간, Nitro 기반 인스턴스 간** 트래픽에 대해 기본적으로 네트워크 레벨 암호화를 제공.
- 고객은 그 위에 **HTTPS/TLS, SSH같은 애플리케이션 레벨 암호화**를 추가해 엔드투엔드 보안을 확보해야 한다(34페이지 다이어그램 참고).

### 5-2. ACM(AWS Certificate Manager)

- **Public/Private TLS 인증서 발급·관리 서비스**(35페이지).
    - Public CA(ATS) 기반 인터넷용 인증서
    - Private CA 기반 내부용 인증서
- 통합 대상: **ALB, NLB, CloudFront, API Gateway, Nitro Enclaves** 등.
- 인증서 자동 갱신, 만료 모니터링(CloudWatch/EventBridge)까지 제공 → **개인 도메인 서비스 만들 때 별도 유료 인증서 없이도 HTTPS 구성 가능**.

### 5-3. AWS KMS와 저장시 암호화

- **AWS KMS**
    - 암호화 키 생성·저장·사용·감사를 담당하는 중앙 키 관리 서비스(36페이지).
    - 데이터 암복호화, 서명/검증, 데이터 키 생성·내보내기, MAC 생성/검증 지원.
    - S3, EBS, EFS, RDS, CloudTrail, Secrets Manager 등 거의 모든 서비스와 통합.
- **저장 시 암호화 패턴**
    - **서버사이드 암호화(Server-side)**:
        - 스토리지(S3/EBS 등)에 저장될 때 KMS 키를 사용해 자동 암호화.
    - **클라이언트사이드 암호화(Client-side)**:
        - 애플리케이션에서 SDK를 통해 **직접 암호화 후** S3 등에 저장.
    - 국가 핵심기술 등에서는 **이중 암호화** 요구 →
        - ① AWS KMS 기반 서버사이드 암호화 + ② 자체 키 관리 시스템으로 클라이언트 사이드 암호화 조합.

## 6. 로깅과 모니터링
### 6-1. 주요 로그 종류

슬라이드 38페이지 그림 기준.

- **WAF 로그** – 웹 공격 시도, 우회 시도 등
- **ALB Access 로그** – 요청 경로, 응답 코드, 지연시간
- **VPC Flow Logs** – 출발지/목적지 IP, 포트, 프로토콜, 바이트/패킷 수
- **DNS 쿼리 로그(Route 53 Resolver)**
- **RDS Audit 로그** – DB 로그인/쿼리
- **CloudTrail** – 관리 이벤트/API 호출 내역
- **AWS Config / Security Hub / GuardDuty / Inspector** – 규정 준수/위협탐지/취약점 이벤트

이들을 **CloudWatch Logs & Metrics, Security Hub**로 모아 통합 관제.

### 6-2. CloudTrail – “누가 언제 무엇을 했는지”

- API 호출을 **Capture → Store → Act → Review** 흐름으로 관리(39페이지).
- 로그 필드로 **eventTime, eventSource, eventName, userIdentity, sourceIPAddress** 등 포함 → “누가, 언제, 어디서, 어떤 API로, 어떤 리소스를 생성/변경/삭제했는지” 추적 가능.
- 암호화폐 채굴용 인스턴스 생성 등 이상 징후도 CloudTrail로 추적 가능하다고 설명.

### 6-3. VPC Flow Logs – 네트워크 흐름 가시화

- VPC/Subnet/ENI/TGW 단위로 Flow Logs 생성, 1분 또는 10분 단위로 집계(40페이지).
- 로그엔 출발지/목적지 IP, 포트, 프로토콜, 바이트·패킷 수가 기록 → 내부 자원이 외부와 **얼마나, 어떤 방향으로 통신하는지**를 분석해 데이터 유출 시도나 비정상 통신을 조기에 발견 가능.

### 6-4. 로그 무결성·보존 전략 (Q&A)

- **Landing Zone** 구성 시 **Log Archive 계정**을 별도로 두고, 각 계정에서 발생한 로그를 이 계정의 S3로 모아 저장.
- 로그 버킷에 대해
    - 서비스에게는 **쓰기(Write)** 권한만 주고,
    - 사람(사용자)에게는 **읽기(Read)** 권한만 주며, 상위 정책(SCP)에서 삭제·변경을 막는 식으로 구성.
- S3 **Object Lock(Compliance 모드)** 를 사용해 WORM(Write Once Read Many) 형태로 일정 기간 동안 삭제/수정 불가하게 설정할 수 있음.
    - 단, 기간을 잘못(예: 7일 → 7년) 설정하면 그 기간 동안 **비용·운영 부담**이 커지므로 주의.

## 7. 가상 환경 보안 – 이미지 & 런타임
### 7-1. EC2 Image Builder – 골든 이미지

- **패치/보안 설정이 반영된 표준 OS 이미지(Golden Image)를 자동으로 빌드·배포** 하는 서비스(42~43페이지).
- 파이프라인 구성 요소
    - 이미지 레시피: 소스 이미지(예: Amazon Linux 2), 보안 에이전트/설정 컴포넌트
    - 인프라 구성: 인스턴스 타입, 서브넷, 보안 그룹, 로깅 설정
    - 배포 구성 & 스케줄: 리전·계정·정기 실행
- Auto Scaling으로 서버를 빈번히 늘렸다 줄여도, **항상 검증된 보안 기준의 이미지**로 인스턴스를 띄울 수 있다.

### 7-2. 런타임 보안 – GuardDuty Runtime 등

- OS·이미지 설정을 아무리 잘해도, 애플리케이션 취약점·신종 악성코드(BPFdoor 사례 언급)로 인해 런타임에서 공격이 발생할 수 있음.
- 이를 위해 **서버용 백신/에이전트** 혹은 **GuardDuty Runtime Monitoring** 같은 서비스를 사용해
    - 새로운 파일/프로세스 생성, 권한 상승, 메모리 상에서만 실행되는 악성코드 행위 등을 모니터링.
- 컨테이너 환경(EKS 등)에서도 파드/컨테이너 단위 런타임 보안이 필요하며, GuardDuty가 이를 지원.

> - **이미지 단계 보안(Image Builder)** + **런타임 모니터링(GuardDuty Runtime/에이전트)** 을 같이 봐야 실제 공격에 대응 가능.

## 8. 보안 모니터링 & 취약점 관리
### 8-1. Resource Explorer – 자산 식별

- 여러 계정·리전에 흩어져 있는 리소스를 **검색/필터링해 “무엇을 가지고 있는지” 파악**(47페이지).
- 클라우드 보안의 가장 첫 단계는 **자산 식별** 이라는 점을 강조.

### 8-2. Security Hub (CSPM) + AWS Config

- **Security Hub**
    - CIS, PCI DSS, NIST, AWS 모범 사례 등 보안 표준 기준으로 각 계정의 상태를 평가하고, 비준수 리소스를 중앙에서 보여주는 CSPM 서비스(48페이지).
- **AWS Config**
    - 리소스 설정 변경 이력을 계속 기록하고, **Config Rule** 로 정책 준수 여부를 평가(49페이지).
    - 흐름:
        1. 리소스 생성/변경 API 호출 → CloudTrail에 기록
        2. Config가 해당 이벤트를 받아 규칙 평가
        3. 위반(예: 0.0.0.0/0로 열린 SG) 시 비준수로 표시하고 SNS/EventBridge로 알림 또는 자동 수정

### 8-3. GuardDuty – 위협 탐지

- 상위 2,000개 AWS 고객 중 95%가 사용 중이라고 언급된 대표 위협 탐지 서비스(50페이지).
- 로그 소스: CloudTrail, VPC Flow Logs, DNS Logs, S3 데이터 이벤트, EKS Audit, Lambda Flow, 런타임 이벤트 등(51페이지).
- AWS 위협 인텔 + ML 기반 이상 탐지 + TTP 탐지 알고리즘으로 **175+ 유형의 Finding** 제공.
- 결과는 Security Hub, Detective, EventBridge와 연계해 알림·추가 분석·자동 대응에 활용.

### 8-4. Amazon Inspector – 취약점 관리

- EC2, ECR 이미지, Lambda 함수/레이어 등에 대해
    - **소프트웨어 취약점(CVE)**
    - **의도치 않은 네트워크 노출** 을 지속적으로 스캔하는 관리형 서비스(52페이지).
- CI/CD 파이프라인과 연동해 **이미지가 배포되기 전에 취약점 여부를 검사**하는 패턴도 가능(53페이지).

## 9. (부록) RDS / Aurora 데이터 복제 방식

강의 끝부분에서 고가용성과 관련해 RDS/Aurora 복제 방식을 간단히 설명.

- **RDS Multi-AZ (동기식 복제)**
    - Primary와 Standby 인스턴스 간 디스크 단위로 **동기식 복제**.
    - 커밋 시 Standby 반영까지 확인 후 완료 → 데이터 일관성 높음, 대신 지연이 조금 증가(55페이지).
- **RDS Read Replica (비동기식)**
    - 읽기 전용 복제본으로, 트랜잭션 로그를 비동기로 흘려보내 재생.
    - 읽기 부하 분산에 유리하지만, 약간의 지연으로 인해 Primary와 Replica 간 데이터 차이가 있을 수 있음.
- **Aurora**
    - 3개의 AZ에 6개 블록 복제, **4/6 쿼럼** 방식으로 쓰기를 완료하는 구조(56페이지).
    - 일부 복제본이 깨져도 자동 복구 가능, 고가용성과 성능 향상.

## 10. 정리 – 이 세션에서 꼭 기억할 것

1. **클라우드 보안은 CNAPP 관점**: CSPM(구조/설정) + CWPP(워크로드) + CIEM(권한) + Micro-Segmentation(네트워크).
2. **네트워크는 “라우팅 + SG/NACL + 방화벽” 조합**으로 설계하며, 필요 시 3P NGFW·AWS Network Firewall·WAF·Shield를 함께 사용.
3. **암호화는 통신(TLS, AWS Native) + 저장(KMS, Server/Client-side)** 를 함께 고려하고, 규제 환경에서는 이중 암호화 패턴을 기억.
4. **로깅·무결성이 핵심**: CloudTrail, Flow Logs, WAF 로그 등을 S3/CloudWatch에 모으고, Log Archive 계정 + Object Lock으로 보호.
5. **가상 환경 보안은 “이미지 단계 + 런타임 단계” 둘 다 필요**: EC2 Image Builder와 GuardDuty Runtime/에이전트 조합.
6. **CSPM·위협 탐지·취약점 관리는 별도가 아니라 연결된 흐름**:
    - Resource Explorer → Security Hub/Config → GuardDuty → Inspector 순으로 **자산 식별–설정 점검–위협 탐지–취약점 관리**를 이어서 보는 것이 포인트.