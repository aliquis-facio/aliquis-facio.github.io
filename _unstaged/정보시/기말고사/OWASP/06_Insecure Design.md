# Insecure Design

## 1. 배경 (Background)

- **순위**: OWASP Top 10:2025에서 A06 Insecure Design은 2021년 4위에서 **두 단계 하락해 6위**로 내려옴. 상위에 Security Misconfiguration(A02), Software Supply Chain Failures(A03)가 새로 치고 올라간 결과이며, 그만큼 **설계 보안 인식은 개선되고 있지만 여전히 상위 리스크**로 남아 있다는 의미. ([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
- **카테고리 성격**:
    
    - 2021년에 새로 추가된 이후 유지되고 있는 항목으로, **설계·아키텍처 차원에서 빠진 보안 통제(“missing or ineffective control design”)** 를 다룸.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 단순 구현 버그가 아니라, **요구사항·설계 단계에서 보안을 잘못 설계해서 생기는 구조적인 취약점**이 대상.
        
    - 코드가 아무리 “깔끔”해도, 설계 단계에서 공격 시나리오·위협 모델·비즈니스 로직 위험을 고려하지 않으면 Insecure Design에 해당.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
- **초점**:
    
    - Threat modeling, secure design pattern, reference architecture 같은 **“코드 이전(pre-code) 활동”을 포함한 Secure by Design 문화**를 요구.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 특히 **비즈니스 로직 상의 원치 않는 상태(unwanted / unexpected state)를 정의하지 않거나, 그에 대한 통제가 없는 설계**를 큰 위험으로 본다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
- **대표 CWE** (A06 범주에 포함되는 대표적인 약점들)([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
    
    - **CWE-256** – Unprotected Storage of Credentials (인증 정보 비보호 저장)
        
    - **CWE-269** – Improper Privilege Management (권한 관리 부적절)
        
    - **CWE-434** – Unrestricted Upload of File with Dangerous Type (위험한 파일 타입 무제한 업로드)
        
    - **CWE-501** – Trust Boundary Violation (신뢰 경계 위반)
        
    - **CWE-522** – Insufficiently Protected Credentials (불충분하게 보호된 인증 정보)
        

---

## 2. Score table (점수 표)

|항목|값|
|---|---|
|매핑된 CWE 수|39|
|최대 발생률 (Max Incidence)|22.18%|
|평균 발생률 (Avg Incidence)|1.86%|
|최대 커버리지 (Max Coverage)|88.76%|
|평균 커버리지 (Avg Coverage)|35.18%|
|가중 평균 Exploit 점수|6.96|
|가중 평균 Impact 점수|4.05|
|총 발생 건수|729,882|
|총 CVE 수|7,647|

정량 지표를 종합하면, **Insecure Design은 평균 발생률(1.86%) 자체는 중간 수준이지만, 매핑된 CWE 수와 CVE 수가 많고(39개·7,647개), 공격 난이도·영향 점수도 모두 높게 형성된 “폭넓은 설계 결함 카테고리”**로 볼 수 있습니다. 무엇보다 **테스트 도구로 바로 “찍혀 나오기 어려운 설계 문제”들이라, 발견 자체가 쉽지 않고 사업 전체에 구조적인 영향을 주는 리스크**라는 점이 특징입니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

---

## 3. 위험 설명 (Description)

OWASP 정의에 따르면 Insecure Design은 **“보안 통제가 설계 단계에서 빠졌거나 비효과적으로 설계된 상태 전체”**를 의미합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

- **Insecure Design vs. Insecure Implementation**
    
    - _Insecure Implementation_: 설계는 맞지만 구현이 잘못된 경우 (버그, 검증 누락 등)
        
    - _Insecure Design_: **설계 자체에 필요한 보안 통제가 존재하지 않는 경우** – 코드 품질이 완벽해도 보완 불가.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
- 이 카테고리가 생긴 이유는, 기존 Top 10이 주로 “구현 레벨의 취약점”에 집중하면서,  
    **요구사항·설계 단계에서의 잘못된 결정이 얼마나 큰 위험을 만드는지 별도로 조명할 필요가 있었기 때문**.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
- 특히 **위협 모델링 부재, 안전하지 않은 워크플로우, 과도하게 단순화된 신뢰 경계(Trust Boundary)** 가 대표적인 원인으로 지적됩니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
    

아래는 OWASP 설명과 실제 사례들을 바탕으로 정리한 대표적인 Insecure Design 패턴입니다.

1. **보안 요구사항·리스크 프로파일링 부재**
    
    - 기밀성(C), 무결성(I), 가용성(A), 진정성(Au)에 대한 **보호 요구사항을 명시적으로 수집·정의하지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 애플리케이션이 어느 정도 노출되는지(인터넷 공개, 멀티 테넌트 여부 등)에 따른 **필요 보안 수준을 정하지 않고 설계가 진행**됨.
        
2. **리소스·예산 차원에서 보안 고려 누락**
    
    - 설계·구현·테스트·운영 전체 라이프사이클에서 **보안 활동에 필요한 예산·시간·인력 계획이 빠져 있음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 그 결과, 위협 모델링·보안 테스트·리뷰가 “시간 남으면 하는 일”로 밀려나고, 구조적인 취약점이 방치됨.
        
3. **Threat Modeling이 없는/형식적인 설계 문화**
    
    - 주요 플로우(인증, 인가, 결제, 계정 복구, 파일 업로드, 멀티 테넌트 분리 등)에 대해 **정기적인 Threat Modeling이 수행되지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 데이터 흐름, 신뢰 경계, 권한 상승 경로, 실패 시나리오 등을 도식화·검토하지 않아,  
        설계 단계에서 차단했어야 할 공격 경로가 그대로 남음.
        
4. **비즈니스 로직 상 “원치 않는 상태” 정의·제어 부재**
    
    - “할인 룰 악용”, “재고 고갈 유도”, “예약 좌석 선점” 등 **비즈니스 로직 레벨의 악용 가능 상태를 정의하지 않거나, 이를 막는 도메인 규칙이 설계에 포함되지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 예: 한 번에 수백 좌석을 예약해두고 결제를 하지 않아도 시스템이 허용하도록 설계된 경우.
        
5. **보안 통제를 ‘구현 문제’로만 취급하는 설계**
    
    - 설계 단계에서 “보안은 나중에 구현 시점에 프레임워크/라이브러리로 처리”한다고 가정하고,  
        **인증·인가·입력 검증·안티봇·속도 제한·세션 관리 등 핵심 통제가 아키텍처 다이어그램에 등장하지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
6. **신뢰 경계(Trust Boundary)를 과도하게 단순화**
    
    - 내부 서비스, 파트너 API, 클라이언트 측 검증 결과 등 **검증되지 않은 입력을 “신뢰”하는 설계**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 예: 클라이언트가 보내는 `isAdmin=true` 같은 플래그를 별도의 서버측 검증 없이 그대로 신뢰.
        
7. **테넌트·레이어 분리 설계의 부재 또는 약함**
    
    - 멀티 테넌트 SaaS에서 **테넌트 간 데이터·리소스가 설계상 충분히 분리돼 있지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 프레젠테이션·애플리케이션·데이터 계층을 **네트워크·시스템 단에서 분리하지 않아**, 한 지점이 뚫리면 전체가 연쇄적으로 노출.
        
8. **Secure Development Lifecycle(SDLC) 프로세스 부재**
    
    - 보안 설계 패턴, “paved road” 컴포넌트, 보안 컴포넌트 라이브러리, 보안 툴링, 포스트모텀 등  
        **SDLC 차원의 보안 프로세스가 체계화되어 있지 않음**.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 프로젝트 초기에 AppSec 담당자·보안팀이 참여하지 않고, 막판에 취약점 스캔만 수행하는 문화.
        
9. **사용자 스토리에 보안 언어·실패 상태가 녹아 있지 않음**
    
    - User Story가 “기능이 잘 되는 정상 플로우”만 명시하고,
        
    - **오용 플로우(misuse case), 실패 플로우, 경계 조건, 비정상 시 처리**가 설계 문서·스토리 어디에도 등장하지 않음.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        

요약하면, Insecure Design은 **“설계 단계에서 보안 통제/위협 모델/도메인 규칙이 빠져 있는 상태 전체”**이며,  
이는 이후 구현이 아무리 잘 되어도 **근본적으로 메꿀 수 없는 구멍**으로 남을 수 있습니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

---

## 4. 예방 방법 (How to prevent)

OWASP가 제안하는 Insecure Design 예방 전략을 정리하면 다음과 같습니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

1. **Secure Development Lifecycle(SDLC) 수립·운영**
    
    - AppSec 전문가가 참여하는 **보안 중심 SDLC**를 도입하고,
        
    - 요구사항·설계·구현·테스트·운영 전 단계에서 **보안·프라이버시 통제 설계·검토 활동을 프로세스에 내장**합니다.
        
2. **Secure Design Pattern / Paved Road 라이브러리 구축**
    
    - 인증·인가·세션 관리·파일 업로드·멀티테넌시·로깅 등 **자주 쓰이는 설계 패턴을 “안전한 참고 아키텍처”로 표준화**합니다.
        
    - 개발팀은 가능하면 이 “포장된 길(paved road)” 위에서만 설계·구현하도록 유도합니다.
        
3. **위협 모델링(Threat Modeling)의 정례화**
    
    - 인증/인가, 비즈니스 로직, 결제, 계정 복구, 파일 업로드, API 게이트웨이 등  
        **핵심 플로우마다 Threat Modeling을 도입**하고, 데이터 흐름·신뢰 경계·공격/방어 시나리오를 설계 단계에서 검토합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
4. **보안 언어·통제를 User Story에 직접 통합**
    
    - User Story·EPIC에 **보안 요구사항, 실패 상태, 경계 조건, 오용 시나리오**를 함께 기술하도록 표준화합니다.
        
    - 예: “비밀번호 재설정은 단일 채널이 아니라 이메일 + 추가 인증을 요구해야 한다” 같은 내용을 스토리에 포함.
        
5. **계층별 Plausibility Check(타당성 검증) 설계**
    
    - 프론트엔드, 백엔드, 데이터 계층 등 **각 계층에서 입력·상태·동작의 타당성을 검증하는 설계**를 반영합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 예: “한 계정이 1초 사이에 100건 주문” 같은 비정상 패턴을 계층별로 감지·차단.
        
6. **위협 모델 기반 테스트(단위·통합 테스트) 작성**
    
    - Threat Modeling에서 도출한 **핵심 플로우·오용 케이스를 테스트 케이스로 승격**합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
    - 유닛/통합 테스트로 “이 플로우는 해당 위협 모델에 대해 견딘다”를 지속적으로 검증.
        
7. **시스템·네트워크 레벨의 계층 분리(Segregation)**
    
    - 프론트·백엔드·DB·관리 콘솔 등 **티어별로 네트워크·시스템 레벨에서 분리**하고, 최소 권한 원칙으로 통신·접근을 제한합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
8. **테넌트 분리(멀티테넌시) 설계**
    
    - 멀티테넌트 환경에서는 테넌트 간 데이터·리소스·로그·메타데이터까지 **설계 단계에서부터 분리 전략을 명시**합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        
9. **OWASP SAMM 등 성숙도 모델 활용**
    
    - OWASP SAMM의 Design / Secure Architecture / Threat Assessment 프랙티스를 참고해  
        조직 내 설계·아키텍처 보안 역량을 체계적으로 강화합니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))
        

---

## 5. 예시 공격 시나리오 (Example attack scenarios)

### 시나리오 1 – 보안 질문 기반 계정 복구 설계 실패

어떤 서비스의 계정 복구 절차는 여전히 **“보안 질문/답변(예: 어머니의 성함, 첫 학교 이름)”**에 의존하고 있습니다.  
이 방식은 NIST 800-63b, OWASP ASVS, OWASP Top 10에서 **신원 증명 수단으로 사용하지 말 것을 명시적으로 권고**하는 기법입니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

- 실제로는 여러 사람이 답을 알 수 있고, SNS·OSINT로 추론도 가능하기 때문에  
    공격자가 비교적 쉽게 계정 복구 절차를 악용해 계정을 탈취할 수 있습니다.
    
- 이 문제는 “입력 검증 버그”가 아니라 **“계정 복구 설계 자체가 안전하지 않은 것(Insecure Design)”** 이기 때문에,  
    해당 기능은 설계 수준에서 제거하고, **MFA·Email 링크·FIDO 등 더 강한 수단으로 대체**해야 합니다.
    

---

### 시나리오 2 – 영화관 그룹 예약 할인 로직 악용

한 영화관 체인은 그룹 예약 시 일정 인원까지는 **보증금 없이 할인된 가격으로 예매**할 수 있도록 설계했습니다.  
설계 상 “최대 15명까지 보증금 없이 할인” 정도만 정의되어 있고, **동시 예약 건수·전체 좌석 수에 대한 상한**은 고려되지 않았습니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

공격자는 이 플로우를 Threat Modeling 해 보고, 다음과 같은 공격을 시도합니다.

- 여러 상영관·상영 시간을 대상으로,
    
- **몇 번의 요청만으로 수백 석의 좌석을 한꺼번에 예약**하지만 실제 결제는 하지 않음.
    

결과적으로:

- 정상 고객이 예매 가능한 좌석이 없어져 **영업 손실**이 발생하고,
    
- 공격자는 별다른 기술적 취약점(예: SQL Injection) 없이 **비즈니스 로직 설계의 허점을 이용해 DoS와 유사한 효과**를 얻습니다.
    

이 문제도 “입력 검증 실패”가 아니라, **애초에 비즈니스 규칙·도메인 제약이 설계에 반영되지 않은 Insecure Design** 사례입니다.

---

### 시나리오 3 – 고가 그래픽 카드 쇼핑몰의 안티봇 설계 부재

한 리테일 체인의 e-commerce 사이트는 고가 그래픽 카드 신제품을 판매하면서도,  
**봇/스캐퍼(scalper)에 대한 별도의 보호 설계가 전혀 없는 상태**로 운영되고 있습니다.([OWASP Foundation](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025"))

- 상품이 재고에 올라오자마자, 자동화된 스크립트·봇이  
    **몇 초 만에 대부분의 물량을 구매**해 버리고,
    
- 정상 사용자는 “장바구니에 담는 순간 품절”을 반복적으로 겪게 됩니다.
    

그 결과:

- 제조사·리테일 체인 모두 **심각한 이미지 타격과 고객 불만**을 겪고,
    
- 제품은 중고/경매 사이트에서만 웃돈을 얹어 거래됩니다.
    

이 역시 구현 버그가 아니라,

- **봇 탐지·속도 제한·구매 제한·행위 분석 등 안티봇/도메인 룰이 설계 단계에서 고려되지 않은 Insecure Design** 문제입니다.
    
- Threat Modeling을 통해 “봇 기반 re-sale” 시나리오를 미리 정의하고,  
    구매 속도·패턴·계정 연관성 등에 기반한 도메인 규칙을 설계에 포함했다면 예방이 가능했을 사례입니다.
    

---

## 참고

- [OWASP Foundation – A06:2025 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/ "A06 Insecure Design - OWASP Top 10:2025")
    

- [aikido.dev](https://www.aikido.dev/blog/owasp-top-10-2025-changes-for-developers?utm_source=chatgpt.com)
- [Cyber Security News](https://cybersecuritynews.com/owasp-top-10-2025/?utm_source=chatgpt.com)
- [eSecurity Planet](https://www.esecurityplanet.com/threats/news-owasp-top-10-2025/?utm_source=chatgpt.com)