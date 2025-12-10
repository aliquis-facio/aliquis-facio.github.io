# Software or Data Integrity Failures

## 1. 배경 (Background)

- **순위**: Software or Data Integrity Failures(A08)는 OWASP Top 10:2025에서 2021과 마찬가지로 **8위**를 유지한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
    
- **명칭 변화**: 2021의 이름은 “Software and Data Integrity Failures”였으나, 2025에서는 **“Software or Data Integrity Failures”**로 소폭 수정되었다. “and”에서 “or”로 바뀐 것은 소프트웨어 **또는** 데이터 어느 한쪽의 무결성만 깨져도 심각한 위험이라는 점을 명확히 하려는 의도이다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
    
- **카테고리 초점**: 이 카테고리는 Software Supply Chain Failures(A03)보다 한 단계 낮은 수준에서, **소프트웨어·코드·데이터 아티팩트의 무결성을 검증하지 않은 채 신뢰하는 실패**에 초점을 둔다. 즉, 소프트웨어 업데이트와 중요 데이터에 대해 “괜찮겠지”라고 가정하고, **서명·체크섬·신뢰 경계 검증 없이 사용하는 모든 상황**을 다룬다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
    
- **대표 CWE** (A08 범주에 매핑된 대표 약점들)([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
    
    - **CWE-345** – Insufficient Verification of Data Authenticity (데이터 출처·진위 검증 부족)
        
    - **CWE-353** – Missing Support for Integrity Check (무결성 검증 기능 부재)
        
    - **CWE-494** – Download of Code Without Integrity Check (무결성 검증 없이 코드 다운로드)
        
    - **CWE-502** – Deserialization of Untrusted Data (비신뢰 데이터 역직렬화)
        
    - **CWE-829** – Inclusion of Functionality from Untrusted Control Sphere (비신뢰 제어 영역 기능 포함)
        

---

## 2. Score table (점수 표)

|항목|값|
|---|---|
|매핑된 CWE 수|14|
|최대 발생률 (Max Incidence)|8.98%|
|평균 발생률 (Avg Incidence)|2.75%|
|최대 커버리지 (Max Coverage)|78.52%|
|평균 커버리지 (Avg Coverage)|45.49%|
|가중 평균 Exploit 점수|7.11|
|가중 평균 Impact 점수|4.79|
|총 발생 건수|501,327|
|총 CVE 수|3,331|

정량 지표를 종합하면 A08은 **발견 빈도는 중간 수준(평균 2.75%)이지만, 악용 난이도(Exploit)와 영향(Impact) 모두 상당히 높고, 한 번 뚫리면 공급망·배포 파이프라인 전체를 오염시키는 “신뢰 모델 붕괴형 리스크”**로 볼 수 있다.

---

## 3. 위험 설명 (Description)

Software or Data Integrity Failures는 **유효성이 검증되지 않은 코드·구성·데이터를 “신뢰된 것”으로 취급하도록 시스템이 설계·구현된 모든 상황**을 의미한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

OWASP 정의를 정리하면 다음과 같다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

- 코드·인프라가 **유효하지 않거나 비신뢰 입력을 신뢰된 코드·데이터로 취급**할 때 무결성 실패가 발생한다.
    
- 애플리케이션이 신뢰 경계(trust boundary)를 적절히 유지하지 못하거나, **소프트웨어 업데이트·CI/CD 파이프라인·중요 데이터에 대해 출처·무결성을 검증하지 않고 사용**하는 것이 핵심 문제이다.
    
- 이 카테고리는 A03 Software Supply Chain Failures처럼 공급망 전체를 다루기보다는, **개별 소프트웨어 아티팩트·데이터·업데이트·직렬화 데이터의 무결성 검증 실패**에 초점을 둔다.
    

일반적으로 애플리케이션은 다음과 같은 경우 A08에 취약할 가능성이 크다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

1. **비신뢰 소스에서 기능·라이브러리·스크립트를 가져와 그대로 신뢰**
    
    - 검증되지 않은 CDN, 외부 위젯, 서드파티 JS, 플러그인, 모듈을 애플리케이션에 포함하면서, 서명·체크섬·공급자 검증 없이 로드하는 경우이다.
        
2. **무결성 검증 없이 코드·패키지를 다운로드·실행**
    
    - `curl https://example.com/install.sh | bash` 같은 패턴처럼, 원격 스크립트·바이너리를 다운받아 **서명·해시 검증 없이 바로 실행하는 빌드/배포 스크립트**를 사용하는 경우이다.
        
3. **인증·분리·무결성 검증이 부실한 CI/CD 파이프라인**
    
    - 코드 저장소·빌드 서버·아티팩트 레지스트리·배포 단계에 대해 **역할 분리나 접근 통제 없이, 검증되지 않은 코드·아티팩트를 그대로 통과시키는 파이프라인**이다.
        
    - 신뢰할 수 없는 저장소에서 코드를 가져와 빌드하거나, 빌드 결과물에 서명·검증이 전혀 적용되지 않는 경우가 대표적이다.
        
4. **서명되지 않았거나 검증되지 않은 자동 업데이트**
    
    - 홈 라우터, 셋톱박스, 펌웨어, 데스크톱·모바일 앱 등이 **업데이트 서버에서 내려오는 바이너리를 서명·무결성 검증 없이 설치하는 경우**이다.
        
    - 공격자가 업데이트 서버·경로를 장악하면, 악성 업데이트를 합법적인 업데이트로 위장해 대량 배포할 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
5. **비신뢰 데이터의 역직렬화(Insecure Deserialization)**
    
    - 클라이언트가 보낸 직렬화 객체나 토큰을 서버가 **출처·무결성 검증 없이 역직렬화해 코드 실행 경로에 태우는 경우**이다.
        
    - Java, .NET, 언어별 직렬화 포맷 또는 JSON·JWT 등 구조화 데이터에서, 서명·MAC·버전 검증이 빠져 있으면 공격자가 페이로드를 조작해 RCE나 권한 상승을 유도할 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
6. **중요 데이터에 대한 진위·무결성 검증 부재**
    
    - 구성 파일, 정책 데이터, 가격·재고·권한 정보 등 **중요 비즈니스 데이터에 대해 디지털 서명·MAC 등 진위 검증이 없고, 단순 평문 저장·전송만 사용하는 경우**이다.
        
    - 중간자 공격이나 저장소 침해가 발생하면, 데이터가 바뀌어도 시스템이 이를 인지하지 못한다.
        

요약하면, A08은 **“무엇을 신뢰할 것인가를 명확히 정의하지 않고, 서명·해시·신뢰 경계 검증 없이 코드·데이터를 받아들이는 설계·구현 전체”**에 대한 위험으로 볼 수 있다.

---

## 4. 예방 방법 (How to prevent)

OWASP가 제시하는 예방책과 일반적인 베스트 프랙티스를 묶어 정리하면 다음과 같다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

1. **디지털 서명·무결성 검증 필수화**
    
    - 소프트웨어 업데이트, 패키지, 컨테이너 이미지, 스크립트, 중요 데이터에 대해 **디지털 서명(코드 서명, 패키지 서명, Sigstore 등) 또는 암호학적 해시(체크섬)를 검증하는 정책을 강제**한다.
        
    - 서명 실패·해시 불일치 시에는 실행·배포를 차단하고, 운영자에게 경보를 보낸다.
        
2. **신뢰된 저장소·레지스트리만 사용**
    
    - npm, Maven, PyPI, 컨테이너 레지스트리 등 **공식·신뢰된 저장소만 사용**하고, 필요 시 조직 내부에 **검증된 미러 또는 프록시 레지스트리(known-good repo)** 를 운영한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
3. **코드·구성 변경에 대한 리뷰 프로세스**
    
    - 애플리케이션 코드뿐만 아니라 **빌드 스크립트, CI/CD 정의 파일, IaC 템플릿, 구성 파일**까지 코드 리뷰 대상에 포함한다.
        
    - 리뷰가 없는 직접 커밋, 보호되지 않은 메인 브랜치, 권한 과다 계정이 파이프라인을 마음대로 수정하지 못하도록 한다.
        
4. **CI/CD 파이프라인의 분리·접근 통제·무결성 보장**
    
    - 빌드·테스트·배포 단계와 아티팩트 저장소 사이에 **분리된 권한·역할(SoD)을 적용하고, 최소 권한 원칙(Least Privilege)을 따른다.**
        
    - 파이프라인이 코드·아티팩트를 가져오는 모든 경로에 대해 **서명·체크섬 검증을 자동화**하고, 무결성 검증 실패 시 빌드를 중단하게 한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
5. **비신뢰 직렬화 데이터에 대한 보호**
    
    - 클라이언트나 외부 시스템이 보내는 직렬화 데이터는 **서명 혹은 MAC으로 보호**하고, 역직렬화 전에 **출처·버전·무결성을 검증**한다.
        
    - 가능하면 위험한 직렬화 포맷(임의 타입 로딩 등)을 피하고, JSON처럼 상대적으로 안전한 포맷과 **화이트리스트 기반 바인딩**을 사용한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
6. **쿠키·세션·중요 파라미터에 대한 무결성 체크**
    
    - 인증·인가 등 보안 의사결정에 사용되는 쿠키·토큰·파라미터에는 **서명(예: JWT 서명, HMAC)이나 암호학적 무결성 검증**을 적용한다.
        
    - 클라이언트에서 수정 가능한 값에 직접 권한 정보·금액·역할을 넣지 말고, 서버 측 보안 컨텍스트를 조회하는 방식으로 설계한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))
        
7. **“curl | bash” 스타일 패턴 금지**
    
    - 설치·빌드·배포 스크립트에서 **원격 스크립트를 직접 파이프해서 실행하는 패턴을 금지**하고, 서명된 패키지·검증된 아티팩트만 사용한다.([Xygeni | Software Supply Chain Security](https://xygeni.io/blog/owasp-top-10-2025-explained-for-developers/?utm_source=chatgpt.com "OWASP Top 10 2025 Explained for Developers"))
        
8. **정책·도구 기반의 무결성 모니터링**
    
    - 런타임에서 코드·구성·중요 데이터가 예상치 못하게 변경되는지 감시하는 **무결성 모니터링(예: 파일 무결성 모니터링, 이미지 서명 검증, 정책 엔진)** 을 도입한다.
        
    - 특히 CI/CD·업데이트 경로에 대해서는 **“어디에서 왔는지 모르는 코드·데이터는 절대 실행하지 않는다”는 정책을 자동화된 규칙으로 구현**한다.
        

---

## 5. 예시 공격 시나리오 (Example attack scenarios)

### 시나리오 1 – 지원 사이트에 포함된 외부 기능을 통한 세션 하이재킹

한 회사는 고객 지원 기능을 외부 서비스 제공자에게 위탁하고 있으며, 사용 편의를 위해 `myCompany.SupportProvider.com`을 `support.myCompany.com`에 CNAME으로 매핑해 두었다. 이 설정 때문에 `support.myCompany.com`에 접속한 사용자가 가진 **모든 `myCompany.com` 쿠키(인증 쿠키 포함)** 가 지원 제공자의 인프라로 전송된다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))  
지원 제공자 인프라에 접근할 수 있는 누구든지 이 쿠키들을 훔쳐서 세션 하이재킹 공격을 수행할 수 있다. 이 사례는 **비신뢰 제어 영역에서 제공하는 웹 기능을, 신뢰 경계·쿠키 무결성 검증 없이 그대로 포함한 설계**가 어떻게 세션 탈취로 이어지는지를 보여준다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

### 시나리오 2 – 서명 검증 없는 펌웨어 업데이트로 인한 대규모 장비 감염

많은 홈 라우터, 셋톱박스, IoT 기기, 펌웨어 등은 **업데이트 시 디지털 서명 검증을 수행하지 않는다.** 장비는 단순히 특정 URL에서 바이너리를 다운로드하고, 그 결과물을 무결성 검증 없이 펌웨어로 플래시한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))  
공격자가 업데이트 서버 또는 DNS를 장악하거나, 공급망 어딘가에서 업데이트 파일을 바꿔치기하면, 악성 펌웨어가 합법적인 업데이트처럼 전 세계 수많은 기기에 배포된다. 많은 장비는 롤백·재설치 수단조차 부실해, 사실상 “다음 세대 기기로 교체될 때까지” 악성 코드가 장비에 상주하게 된다.

### 시나리오 3 – 비공식 사이트에서 서명 없는 패키지 다운로드 후 악성 코드 실행

한 개발자는 필요로 하는 특정 패키지를 공식 패키지 매니저에서 찾지 못해, 검색을 통해 어떤 웹사이트에서 해당 패키지의 “업데이트 버전”을 발견한다. 패키지는 서명되어 있지 않고, 개발자는 출처를 검증하지 않은 채 이 패키지를 다운로드해 애플리케이션에 포함한다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))  
패키지 내부에는 백도어가 심어져 있어, 애플리케이션이 배포된 뒤 공격자 C2 서버와 통신하며 내부 데이터를 외부로 전송하고, 특정 조건에서 추가 페이로드를 내려받아 실행한다. 이 경우 **“공식 저장소 밖에서 서명 없는 패키지를 받아 쓴 것”** 자체가 A08에 해당하는 핵심 무결성 실패이다.

### 시나리오 4 – 직렬화된 사용자 상태를 통한 Java RCE(Insecure Deserialization)

한 React 프런트엔드와 Spring Boot 기반 마이크로서비스 세트가 함께 동작하고 있다. 팀은 “함수형·불변” 설계를 유지하기 위해, 사용자 상태 전체를 매 요청마다 직렬화해 클라이언트와 서버 간에 주고받는 구조를 채택했다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))  
한 공격자는 요청 페이로드 안에서 Base64로 인코딩된 `"rO0"` Java 객체 시그니처를 발견하고, 공개된 Java 역직렬화 툴을 사용해 악성 객체 그래프를 주입한 뒤, 서버 측에서 이를 그대로 역직렬화할 때 **원격 코드 실행(RCE)** 을 달성한다. 이 사례는 **비신뢰 클라이언트가 보낸 직렬화 데이터를 서명·무결성 검증 없이 신뢰하고 역직렬화하는 전형적인 A08 시나리오**이다.([OWASP Foundation](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025"))

---

## 참고

- [OWASP Foundation – A08:2025 Software or Data Integrity Failures](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/ "A08 Software or Data Integrity Failures - OWASP Top 10:2025")