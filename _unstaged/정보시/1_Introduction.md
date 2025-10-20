## 1.1. 보안 목표(C.I.A.)

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-20-40.jpg?raw=true)

- **기밀성(Confidentiality)**: 허가되지 않은 정보 공개를 방지. 접근 허용 대상에게만 내용을 보게 하고, 그 외에는 내용을 알아내지 못하게 함.
	- 도구: 암호화, 접근통제(인증, 권한부여), 물리적 보안.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-22-03.jpg?raw=true)
- **무결성(Integrity)**: 정보가 비인가로 변경되지 않았음을 보장.
	- 도구: 백업, 체크섬, 오류정정코드.
- **가용성(Availability)**: 허가된 사용자가 적시에 접근·수정 가능.
	- 도구: 물리적 보호, 계산/저장 자원의 중복화.

## 1.2. Other Security Concepts(A.A.A.)

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-22-19.jpg?raw=true)

- **Assurance(보증)**: 컴퓨터 시스템에서 신뢰를 어떻게 제공·관리하는지에 대한 개념.
	- 신뢰 관리는 **정책(Policies)**, **권한(Permissions)**, **보호(Protections)** 세 축으로 구성.
		- <font color="#ff0000">정책(Policies)</font>
		- <font color="#ff0000">권한(Permissions)</font>
		- <font color="#ff0000">보호(Protections)</font>
- **Authenticity(진정성)**: 사람이나 시스템이 발행한 진술·정책·권한이 **진짜**인지 판단하는 능력.
	- 도구: **디지털 서명**
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-22-50.jpg?raw=true)
- **Anonymity(익명성)**: 특정 기록/거래가 **개인에게 귀속되지 않음**을 의미.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-23-01.jpg?raw=true)
	- 도구: **집계(aggregation)**, **믹싱(mixing)**, **프록시(proxies)**, **가명(pseudonyms)** 등

## 1.3. 위협과 공격 유형

- **도청(Eavesdropping)**: 통신 채널에서 제3자가 정보를 가로채는 행위
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-23-15.jpg?raw=true)
- **변조(Alteration)**: 무단 수정
	- **중간자 공격(MITM)**: 스트림을 가로채 수정 후 재전송
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-23-32.jpg?raw=true)
- **서비스거부(DoS)**: 데이터 서비스/접근의 중단·저하
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-23-57.jpg?raw=true)
- **가장(Masquerading)**: 실제 작성자가 아닌데 **남으로 위장**해 정보 생산
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-24-08.jpg?raw=true)
- **부인(Repudiation)**: 약속·수신 사실을 **나중에 부정**하는 행위(영수증 요구 프로토콜 회피 시도)
- **상관/추적(Correlation & Traceback)**: 여러 데이터원을 **결합**해 정보/스트림의 **발신자 추적**.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-24-26.jpg?raw=true)

## 1.4. 보안 10원칙(Design Principles)

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-24-35.jpg?raw=true)

- **경제성(Economy of mechanism)**: **단순성**을 지향해 이해·검증을 쉽게
- **실패-안전 기본값(Fail-safe defaults)**: **보수적 기본값**(초기 권한 최소화 등)
- **완전매개(Complete mediation)**: **모든 접근**을 매번 검사(세션 타임아웃 재인증 등)
- **개방형 설계(Open design)**: 설계는 **공개**, 비밀은 **키**에만 의존(은폐 보안 지양)
- **권한분리(Separation of Privilege)**: **복수 조건**을 충족해야 민감 작업 허용
- **최소권한(Least Privilege)**: **최소 권한**으로 운영해 남용·피해 범위를 최소화
- **최소공통메커니즘(Least Common Mechanism)**: 다중 사용자 간 **공유 메커니즘 최소화**(분리된 채널 사용)
- **심리적 수용성(Psychological Acceptability)**: **예측 가능한 UI/설정**으로 사용성·보안을 함께
- **작업량(Work factor)**: 공격자 **자원 대비 우회 비용**을 고려해 설계
- **침해기록(Compromise recording)**: 방지보다 **침해 기록**이 더 효율적일 때 **로깅·증적 수집**을 중시

## 1.5. 접근통제 모델(Access Control)

- **접근통제 행렬(Access Control Matrix, ACM)**: 주체×객체 테이블에 권한 기입.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-24-59.jpg?raw=true)
- **Access Control List, ACL**: 객체 중심으로 “누가/무엇을” 목록화.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-03.jpg?raw=true)
- **Capabilities**: 주체 중심으로 “어떤 객체에 어떤 권한”
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-11.jpg?raw=true)
- **Role-Based Access Control, RBAC**: 사용자 대신 역할에 권한을 부여.
	- ![Alt Images|94x24](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-18.jpg?raw=true)

## 1.6. 암호(Encryption)·암복호 구성요소

- **암호의 목적**: 안전하지 않은 채널(감청 가능) 위에서도 **기밀성**을 확보해 Alice→Bob 메시지를 안전하게 전달
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-32.jpg?raw=true)
- **기본 표기**
    - 평문: `M` / 암호문: `C`
    - 암호화: `C = E(M)` / 복호화: `M = D(C)`
    - 설계 목표: 제3자(Eve)가 `C`만 보고는 **실질적으로 `M`을 복원할 수 없어야** 함.
- **고전 예시**: **카이사르 암호**—알파벳을 고정 폭(예: 3)만큼 이동해 치환.
	- ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-39.jpg?raw=true)
- **대칭키 암호(symmetric)**
    - **하나의 “공유 비밀키”** 를 **암·복호에 모두 사용**.
    - 장점: 빠르고 효율적.
    - 단점: **키 분배**가 어렵고, 통신쌍이 많아지면 필요한 키 개수가 `n(n−1)/2`로 급증.
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-46.jpg?raw=true)
- **공개키 암호(public key)**
    - 각 사용자가 **(공개키, 개인키)** 한 쌍을 가짐.
    - 송신자는 **수신자의 공개키**로 암호화(`C=E_P(M)`), 수신자는 **개인키**로 복호(`M=D_S(C)`).
    - 장점: **키 배포/관리 용이**(수신자 수만큼 키쌍)
	    - ![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-25-55.jpg?raw=true)
    - 단점: 대칭에 비해 **연산이 무겁다**.
- **키 배포 관점**
    - 대칭: 통신쌍마다 **서로 다른 공유키**를 **안전하게** 배포해야 함(규모가 커질수록 어려움).
    - 공개키: 사용자당 **한 쌍**만 관리(공개키는 널리 배포, 개인키는 비밀 유지).

## 1.7. 전자서명·해시·MAC·인증서

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-26-34.jpg?raw=true)

- **전자서명(Digital Signature)**
    - 발신자(Alice)가 **개인키**로 `M`을 서명해 `S = Sign_SA(M)`을 만들면, 누구나 **Alice의 공개키**로 검증(`Verify_PA(M,S)`) 가능.
    - 성질: **무결성**, **서명자 인증(진정성)**, **부인방지**.
- **암호학적 해시 함수(Hash)**
    - 입력 `M`을 고정 길이 `Y = H(M)`로 매핑.
    - 요구 속성: **단방향성**(역상 계산 곤란), **충돌내성**(서로 다른 `M≠N`에 대해 `H(M)=H(N)` 찾기 곤란).
    - 예: **SHA-256** 등.
- **메시지 인증 코드(MAC)**
    - **공유 비밀키 `K`** 를 쓰는 무결성 검증: 예) `MAC = H(K || M)`.
    - 수신자는 같은 `K`로 재계산해 **변조 여부를 판별**. (무결성·출처 인증 제공, _부인방지_ 는 일반적으로 제공하지 않음)
- **디지털 인증서(Certificate)**
    - **CA**가 **식별자(주체) ↔ 공개키** 바인딩에 **전자서명**을 부여한 문서.
    - 목적: “이 공개키가 **정말 그 주체의 것**인지” 신뢰 사슬로 증명.

## 1.8. 비밀번호(저장·강도·브루트포스)와 구성

![Alt Images|394x24](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-26-46.jpg?raw=true)

- **비밀번호 저장 방법(개념)**
    - 원문 저장 금지. **해시(가급적 Salt+느린 KDF)** 저장.
    - 검증 시 사용자가 입력한 비밀번호를 같은 방식으로 해시해 **일치 여부**만 확인.
- **강한 비밀번호의 특징**
    - **대문자/소문자/숫자/특수문자** 등 **문자군을 넓게** 사용하고, **길이**를 충분히 길게.
    - 예시 비교에서 보듯, 가능한 문자 집합(알파벳·숫자·특수문자)과 **길이**가 커질수록 **탐색 공간이 기하급수적**으로 커짐.
    - 실전: 복잡도보다 **길이+문자군 다양성**, 그리고 **문장형(passphrase)** 이 효과적.
- **브루트포스(무차별 대입) 관점**
    - “비밀번호 변경 주기(예: 60일), 초당 시도 가능한 횟수”를 가정하면, **짧고 단순한 비밀번호는 순식간에 뚫림**.
    - 방어: **길이 확장**, **사전·유추 어려운 구조**, **서버 측 레이트리밋/락아웃**, **2FA**.
- **실무 팁**
    - 사용자에게는 **금지 목록(최악 비번) 차단**·**길이 우선 정책**·**비밀 답변 대신 MFA**를 권고.
    - 서버는 **Salt+KDF(예: bcrypt/Argon2)**, **인증 시도 제한**·**이상징후 모니터링**.

## 1.9. 사회공학(Social Engineering)

- **주요 패턴**
    - **Pretexting**: 믿을만한 **구실(시나리오)** 로 비밀을 유도.
    - **Baiting**: **미끼(경품·파일 등)** 로 위험 행동을 유도.
    - **Quid pro quo**: **대가 교환**을 미끼로 보안 약속을 깨게 함.
- **대응**
    - **사용자 교육**(신분 확인·절차 준수), **정책 강제**(전화/메일 통한 민감정보 요청 금지), **2차 확인**과 **내부 신고 채널** 확보.