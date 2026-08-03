## 0. 클라우드 보안 개요

- **AWS 장점**
    - 전 세계 리전/가용 영역 기반의 **글로벌 인프라**
    - 자원 자동화·확장으로 **운영 효율/가용성** 확보
    - 로그·메트릭 등 풍부한 **가시성(Visibility)** 제공
    - 다양한 **글로벌 보안 표준·컴플라이언스** 충족
    - 보안 파트너·솔루션과의 **풍부한 생태계**
- **공유 책임 모델(Shared Responsibility Model)**
    - **AWS**: 물리 인프라, 하이퍼바이저, 관리형 서비스의 OS/엔진까지 책임
    - **고객**: OS 보안 설정, 계정/권한 관리, 데이터 암호화, 애플리케이션 보안 등
    - 서비스 유형에 따라 책임 범위가 달라짐
        - EC2: 하드웨어/하이퍼바이저는 AWS, OS·미들웨어·앱은 고객
        - RDS 등 관리형 DB: DB 엔진 운영까지 AWS, **계정·데이터 암호화·접근통제는 고객**
- **AWS 글로벌 인프라 구조 (리전 / AZ)**
    - 하나의 리전 안에 서로 다른 물리 데이터센터인 **가용 영역(AZ)** 여러 개 존재
    - **동일 재해의 영향 회피**를 위해 물리적으로 분리, 전용선으로 고속 연결
    - 서브넷을 여러 AZ에 걸쳐 구성하여 **고가용성** 확보 (한 AZ 장애 시 다른 AZ로 서비스 유지)

## 1) 계정 관리
### 1-1. AWS 계정(AWS Account)의 의미

- **하나의 계정 = 하나의 보안·과금 컨테이너**
    - VPC, EC2, RDS, S3 등 모든 리소스는 계정 안에 생성됨
- 계정의 로그인 ID가 되는 **루트 사용자(이메일)**
    - 계정 자체의 소유자, 요금/결제, 계정 삭제 등 **가장 강력한 권한** 보유
    - **실무 권장사항**: 초기 설정(관리자 IAM 사용자 생성, MFA 설정 등) 이후 **루트 사용자는 봉인**하고 사용하지 않기

### 1-2. IAM 보안 주체(Security Principal)

- **Root / IAM User / IAM Role / Group** 구조
- 자격 증명 타입
    - **장기 자격 증명**: ID/비밀번호, Access Key 등 – 유출 시 피해가 큼
    - **단기 자격 증명(STS, Role 기반)**: 일정 시간 후 만료 → 유출 위험 감소
- 베스트 프랙티스
    - 사람은 가능한 **IAM User + MFA**, 시스템 간 통신은 **Role + STS** 중심 설계
    - 각 보안 주체에 **업무에 필요한 최소 권한만 부여(Least Privilege)**

### 1-3. 멀티 계정 및 IAM Identity Center

- 여러 AWS 계정을 **조직(Organizations)** 으로 묶고, 네트워크 전용 계정, 보안 계정, 애플리케이션 계정 등 **역할별 분리**
    - 침해 발생 시 **횡이동(Lateral Movement) 최소화**
- **IAM Identity Center(구 SSO)** & 외부 IdP(Okta, Entra ID 등) 연동
    - 중앙에서 사용자/그룹 관리, 각 계정·Role에 **싱글사인온** 제공

### 1-4. 서버 OS 계정 관리 (On EC2 등)

- 직접 OS에 SSH/RDP 접속 시 **중앙 계정 관리 솔루션(PAM)** 연계
    - 전산센터 또는 보안 VPC에 **서버 계정관리/접근통제 솔루션** 배치
    - 일반 사용자는 곧바로 서버 IP로 가지 않고, **<font color="#ff0000">베스천</font> 호스트 또는 접속 포털**을 통해 간접 접속
        - 계정/비밀번호는 솔루션이 주기적으로 변경(PAM의 Password Rotation/Check-out)

### 1-5. DB 계정 관리

- RDS 등 DB 앞에 **DB 접근통제 솔루션** 배치
    - 누가, 언제, 어떤 쿼리로, 어떤 데이터(컬럼/로우)에 접근했는지 기록
    - 개인정보 컬럼에 대해서는 **마스킹/열람 통제** 적용
- 실무에서는 서버 계정 관리와 마찬가지로 1회성 패스워드 발급, OTP/MFA 결합, 세션 녹화 등 활용

## 2) 접근 통제
### 2-1. IAM 접근 권한 분석 기본 개념

- **Who (보안 주체)** – 사용자, Role 등
- **Can Access (Policy)** – 부여된 IAM 정책
- **What (리소스)** – S3, DynamoDB, EC2 등 대상 리소스

### 2-2. IAM Access Analyzer – 최소 권한 가이드

1. **설정(정책 생성)**: 권한을 정의하는 IAM 정책 생성
2. **검증(Validation)**
    - `ValidatePolicy`: AWS 모범 사례 기반 **100+ 검사를 자동 수행**
    - `CheckNoNewAccess`: 정책 변경으로 새로운 권한이 추가되었는지 확인
    - `CheckNoPublicAccess`: Public 허용 여부 점검
    - `CheckAccessNotGranted`: 특정 중요 작업(Action) 부여 여부 확인
3. **정제(Unused/외부 접근 제거)**
    - 미사용 권한·역할·자격증명 탐지 → 제거 권고
    - 퍼블릭/교차 계정 액세스 상시 모니터링 & 알림

### 2-3. 외부·내부 접근 권한 탐지

- **외부 접근 권한 탐지**
    - S3, IAM Role, DynamoDB 등 리소스에 대한 인터넷 공개, 다른 계정(조직 외부)에서의 접근 경로 자동 분석
- **내부 접근 권한 탐지**
    - 조직 내에서 **중요 리소스에 접근 가능한 주체**를 식별
    - 신규 권한 부여, 권한 변동 사항에 대해 **일일 모니터링 및 알림**

## 3) 네트워크 보안
### 3-1. 인그레스/이그레스/내부 세그멘테이션

- **Ingress**: 외부 사용자가 서비스(웹, 앱)에 접속하는 인바운드 경로
- **Egress**: 내부 시스템이 외부 인터넷/외부 기관으로 나가는 아웃바운드 경로
- **내부 세그멘테이션**: 내부망 간에도 세분화된 네트워크 구획/방화벽으로 침해 발생 시 **전파 범위를 최소화**

### 3-2. AWS Network Firewall & Transit Gateway

- **Inspection VPC + AWS Network Firewall** 기반 중앙 방화벽 아키텍처
    - 각 Workload VPC의 트래픽(ingress/egress)을 **Transit Gateway(TGW)** 통해 방화벽으로 전달
- **다중 VPC 엔드포인트 지원**
    - 여러 VPC/AZ의 방화벽 엔드포인트를 하나의 Network Firewall에 연결
    - **운영 단순화, 엔드포인트 요금 절감**
- **TGW Native Integration**
    - 별도의 Inspection VPC 없이 TGW에 방화벽을 바로 부착
    - 멀티 AZ 방화벽 배포, 정책 통합 관리, 요금 분리 등 지원

### 3-3. DDoS 방어 – L3/L4: AWS Shield Standard

- **기본 제공(추가 비용 없음)**
    - AWS Edge와 Network Border에서 대규모 네트워크 공격 흡수
    - SYN Proxy, 패킷 유효성 검증, 분산 스크러빙, 자동 라우팅 정책 등으로 **네트워크 계층 볼륨 공격 완화**

### 3-4. L7 DDoS & 웹 공격 방어 – AWS WAF

- **AWS Managed Rules**
    - 익명 프록시/토르, 공통 취약점 시그니처, IP 평판 기반 룰 등 기본 제공
- **임계치 기반 규칙** (Rate-based Rule)
    - 특정 IP/경로/UA가 일정 시간 동안 너무 많은 요청을 보내면 차단
- **L7 DDoS 자동 완화**
    - CloudFront/ALB/API Gateway 앞에 적용해 **애플리케이션 계층 공격을 수 초 내 탐지/차단**

### 3-5. L7 DDoS 대응 아키텍처

- **CloudFront + WAF + DMZ VPC + Workload VPC** 구조
    - CloudFront(캐시/엣지) – 1차 L3/L4, L7 방어
    - DMZ VPC – ALB, Network Firewall 등 1·2차 방화벽
    - Workload VPC – 실제 EC2/EKS/RDS 등 내부 자원
    - 정적 리소스(S3 Origin)와 동적 리소스(VPC Origin)를 분리해 캐싱·보안 최적화

## 4) 내부 시스템과 클라우드 시스템 연계
### 4-1. 관리 콘솔(AWS Management Console) 통제

- **내부망 단말 → Proxy → AWS Console** 구조
    - 내부 PC는 AWS로 직접 가지 않고, **사내 Proxy**를 통해서만 접속
    - Proxy에서는 AWS Console에 필요한 도메인/URL만 허용
    - 인터넷 카페·개인 PC 등 외부 단말에서의 콘솔 접속은 **SCP(서비스 제어 정책)** 또는 IAM 정책에서 **출발 IP를 NAT Gateway/Proxy IP로만 제한**

### 4-2. AWS Management Console Private Access

- EC2 인스턴스에서 브라우저를 띄워 전용 Private 콘솔 엔드포인트로 접속하는 방식
- 내부 Route 53 Resolver, S3 Private Endpoint 등과 연계하여 인터넷을 거치지 않고 **VPC 내부에서 콘솔/서비스 접근** 가능

## 5) 암호화 및 키 관리
### 5-1. 통신 구간 암호화

- AWS 내·외부 주요 구간에 **TLS 기반 암호화** 적용
    - 온프레미스 ↔ AWS (VPN / Direct Connect + MACsec 등)
    - VPC ↔ VPC (Transit Gateway, VPC Peering 등)
    - 클라이언트 ↔ ELB/CloudFront(API, 웹) 구간

### 5-2. ACM(AWS Certificate Manager)

- **공개/사설 TLS 인증서** 통합 관리 서비스
    - Public CA(ATS) 인증서 발급 – 인터넷 공개 도메인용
    - Private CA 기반 내부용 인증서 – 내부 서비스/TLS 오프로드용
- 주요 통합 서비스
    - ALB/NLB, CloudFront, API Gateway, Nitro Enclaves 등
    - 인증서 자동 갱신, 만료 알림, CloudWatch/EventBridge 기반 모니터링

### 5-3. AWS KMS (Key Management Service)

- **암호화 키 생성·저장·사용·감사**를 담당하는 중앙 서비스
- 주요 기능: 데이터 암호화/복호화, 서명/검증, 데이터 키 생성·내보내기, MAC 생성·검증
- 통합 서비스
    - EBS, S3, EFS, RDS, CloudTrail, Secrets Manager 등 다수
    - KMS 사용 로그는 CloudTrail·CloudWatch로 모니터링

## 6) 로깅 및 모니터링
### 6-1. 주요 보안 로그 맵

- VPC Flow Logs, ALB Access Logs, WAF 로그, DNS 쿼리 로그(Route53RDS Audit Log, CloudTrail, AWS Config, GuardDuty, Inspector 등
- 이 모든 로그/이벤트를 **CloudWatch Logs / Metrics / EventBridge / Security Hub**로 연계하여 통합 모니터링, 경보, 자동 대응을 설계

### 6-2. CloudWatch Logs & Metrics

- **Logs**
    - EC2, CloudTrail, Route53, 애플리케이션 로그 등을 중앙 수집
    - Agent, FireLens, FluentBit, OTel Collector 등 다양한 수집 방식
- **Metrics**
    - 시간 순서 데이터 포인트의 집합
    - Namespace(메트릭 컨테이너) / Dimension(메트릭을 구분하는 name=value 쌍) / 보존 기간(1m~1h 기준 15일~15개월) 등 개념 중요
- **활용 모범 사례**
    - 비즈니스 지표와 인프라 지표를 함께 모니터링
    - 로그에서 의미 있는 값 추출 → 메트릭 변환 → 알람/대시보드 구성

### 6-3. AWS CloudTrail

- **AWS API 호출(관리 이벤트/데이터 이벤트)을 기록하는 감사 로그**
- 핵심 기능
    - Event history: 최근 90일 관리 이벤트 조회 (무료)
    - Trail: S3/CloudWatch Logs/EventBridge로 장기 보관·분석
    - Lake: 여러 계정·리전 데이터 집계, 쿼리·시각화
    - Insights: 비정상적인 컨트롤 플레인 활동 탐지
- 중요한 필드
    - `eventTime`, `eventSource`, `eventName`, `userIdentity`, `sourceIPAddress`, `requestParameters`, `responseElements` 등 – **누가 무엇을 언제 어디서 했는지** 추적 가능

### 6-4. VPC Flow Logs

- ENI/VPC/Subnet/TGW 단위로 **네트워크 흐름(5-tuple + bytes/packets)을 기록**
- 기본/확장 포맷으로 VPC ID, Subnet ID, Instance ID, TCP Flags, Region, AZ 등 추가 필드 제공
- **로깅되지 않는 트래픽**도 존재
    - 인스턴스 → Amazon DNS, 메타데이터(169.254.169.254), Time Sync, DHCP, ARP 등은 예외

## 7) 가상 환경 보안
### 7-1. EC2 Image Builder – Golden Image

- **보안 기준을 적용한 표준 OS 이미지(Golden Image)를 자동 생성/배포**하는 서비스
    - 이미지 레시피(소스 이미지 + 컴포넌트)
    - 인프라 구성(인스턴스 타입, 서브넷, 보안 그룹, 로깅)
    - 배포 구성(리전, 계정) + 스케줄(정기 빌드)
- 최대한 OS를 최신/패치된 상태로 유지해 **취약점 노출 최소화**

### 7-2. GuardDuty Runtime Monitoring

- EC2 및 컨테이너 런타임 수준에서 **프로세스 활동을 모니터링**
    - 컨테이너 이스케이프, 권한 상승, 악성 프로세스 실행, 데이터 유출 시도, 크립토마이닝 등 탐지
- EKS 클러스터에 대해서도
    - 파드 자격증명 악용, 권한 상승, 무단 접근 등 컨테이너 환경 공격 탐지

## 8) 보안 모니터링 및 취약점 분석·평가
### 8-1. AWS Security Hub – CSPM

- 여러 계정/리전에 걸친 **보안 상태 중앙 대시보드**
- 지원 표준
    - CIS AWS Foundations(1.2, 1.4, 3.0), PCI DSS(3.2.1, 4.0), NIST 800-53, NIST 800-171, AWS Foundational Best Practices 등
- 기능
    - 각 표준별 **컴플라이언스 점수** 제공
    - 비준수 리소스 실시간 탐지
    - Config, Organizations, SSM과 통합 + EventBridge로 자동 교정(수정) 워크플로우 실행

### 8-2. AWS Config

- 리소스의 설정 변경을 기록하고 **규정 준수 여부를 지속적으로 평가**하는 서비스
    - 리소스 생성~현재까지 변경 이력 추적
    - Config Rule(관리형/커스텀)로 정책 위반 리소스를 탐지
    - 위반 시 SNS/CloudWatch Events로 알림

### 8-3. AWS Resource Explorer

- 여러 리전에 흩어진 리소스를 **태그·키워드로 검색**
    - “어느 계정/리전에 뭐가 얼마나 있는지”를 빠르게 파악하는 **현황판 역할**

### 8-4. Amazon GuardDuty – 위협 탐지

- 상위 2,000개 고객 중 95%가 사용한다고 소개된 **기본 위협 탐지 서비스**
- 로그 소스
    - CloudTrail, VPC Flow Logs, DNS Logs, S3 데이터 이벤트, Lambda/EKS 런타임 이벤트 등
- 기능
    - AWS 위협 인텔, ML 기반 이상 탐지, TTP 탐지 알고리즘을 이용해
        - 자격 증명 유출, 데이터 유출, 클러스터 침해 등 **175+ 탐지 유형** 제공
    - 결과는 Security Hub, Detective, EventBridge 등과 연동

### 8-5. Amazon Inspector – 취약점 관리

- EC2, ECR 이미지, Lambda 등 워크로드에 대해
    - **소프트웨어 취약점(CVE)** + **네트워크 노출**을 지속 스캔하는 관리형 서비스
- EC2의 경우
    - **에이전트 없이 네트워크 접근성 검사**(IGW로 노출된 포트 등) – 24시간마다
    - SSM 에이전트 기반으로 **설치된 패키지의 취약점**을 CVE DB와 비교
- 발견된 취약점은 심각도·노출 여부 기준으로 우선순위를 부여하여
    - 보안팀이 **패치 우선순위를 정하기 쉽게** 제공


## 정리 – 시험/실무에서 꼭 기억할 포인트

1. **공유 책임 모델**: 서비스 유형(EC2 vs RDS vs 완전 관리형)에 따라 책임 범위가 달라진다.
2. **계정·권한 관리**: 루트 계정 최소 사용, IAM Role 중심, Access Analyzer로 최소 권한 유지.
3. **네트워크 보안**: Ingress/Egress/내부 세그멘테이션, Network Firewall + TGW, Shield + WAF 조합.
4. **콘솔/내부 연계**: Proxy·NAT IP 제한, Private Access로 인터넷 미노출 설계.
5. **암호화**: ACM으로 인증서, KMS로 키·암호화 수명주기 관리.
6. **로깅**: CloudTrail(누가 무엇을 언제), VPC Flow Logs(트래픽 흐름), CloudWatch(로그·메트릭).
7. **가상 환경 보안**: Image Builder로 Golden Image, GuardDuty Runtime으로 런타임 위협 탐지.
8. **CSPM/취약점 관리**: Security Hub(표준 기반 점검), Config(설정 준수), Inspector(패치 대상 관리).