# Authentication Failures

## 1. 배경 (Background)

- **순위**: OWASP Top 10:2025에서 A07 Authentication Failures는 2021과 마찬가지로 **7위**를 유지한다.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
- **명칭 변화**: 2021의 이름은 “Identification and Authentication Failures”였으나, 2025에서는 **“Authentication Failures”**로 간단해졌고, 이는 이 카테고리에 포함된 **36개 CWE가 실제로는 “인증 그 자체의 실패”에 집중되어 있다는 점을 더 정확히 반영하기 위한 변경이다.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
- **의미**: 이 항목은 공격자가 **유효하지 않거나 잘못된 사용자를 시스템이 ‘정상 사용자’로 믿게 만드는 모든 인증 실패**를 다룬다. 표준화된 인증 프레임워크의 도입 덕분에 일부 저수준 구현 버그는 줄었지만, 로그인·세션·MFA·계정 복구 플로우 설계 실수 때문에 여전히 심각한 리스크가 지속된다는 점이 강조된다.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
- **데이터 특성**: A07에는 총 **36개 CWE**, **1,120,673건의 발생 건수**, **7,147개의 CVE**가 매핑되어 있으며, 평균 발생률은 **2.92%** 수준이다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025")) 이는 개별 취약점은 눈에 잘 안 띌 수 있지만, 실제로는 다른 모든 보안 통제로 들어가는 **“관문 계층”에서의 실패가 광범위하게 존재한다**는 것을 의미한다.
    

---

## 2. Score table (점수 표)

|항목|값|
|---|---|
|매핑된 CWE 수|36|
|최대 발생률 (Max Incidence)|15.80%|
|평균 발생률 (Avg Incidence)|2.92%|
|최대 커버리지 (Max Coverage)|100.00%|
|평균 커버리지 (Avg Coverage)|37.14%|
|가중 평균 Exploit 점수|7.69|
|가중 평균 Impact 점수|4.44|
|총 발생 건수|1,120,673|
|총 CVE 수|7,147|

정량 지표를 종합하면 Authentication Failures는 **모든 애플리케이션에서 널리 테스트되고(최대 커버리지 100%), 발견 빈도도 결코 낮지 않으며(평균 2.92%), 공격 난이도와 영향 모두 높은 “꾸준히 자주 나오고, 뚫리면 모든 것을 잃을 수 있는 관문 리스크”**로 볼 수 있다.

---

## 3. 위험 설명 (Description)

OWASP 정의에 따르면 **공격자가 유효하지 않거나 잘못된 사용자를 시스템이 ‘정상 사용자’로 인식하도록 속일 수 있을 때 Authentication Failures가 존재**한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025")) 애플리케이션이 아래와 같은 특성을 가진다면 인증 실패 위험을 안고 있을 가능성이 크다.

1. **크리덴셜 스터핑·하이브리드 패스워드 공격 허용**  
    유출된 ID/비밀번호 목록을 그대로 대입하는 **크리덴셜 스터핑**이나, `Password1!`, `Password2!`, `Password3!`처럼 비밀번호를 증가·변형해 시도하는 **하이브리드 패스워드 공격(패스워드 스프레이)** 을 방어하지 못하면 문제가 된다. 이런 방어가 없다면 애플리케이션은 사실상 “이 비밀번호가 맞는지 확인해 주는 패스워드 오라클”로 악용된다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
2. **브루트포스·스크립트 기반 자동화 공격 미차단**  
    동일 계정 또는 여러 계정에 대해 짧은 시간 안에 대량 로그인 시도가 반복되는데도 계정 잠금, 점증적 지연, IP·디바이스 기반 차단, 봇·스크립트 탐지 등 방어 기제가 없거나 매우 느슨한 경우이다.
    
3. **기본·약한·잘 알려진 비밀번호 허용**  
    “Password1”, “qwerty”, “12345678” 같은 널리 알려진 약한 비밀번호나 “admin/admin”과 같은 **기본 관리자 계정·비밀번호 조합**을 그대로 허용하는 경우이다. 이 경우 공격자는 별다른 도구 없이도 사전 지식만으로 계정을 탈취할 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
4. **이미 유출된 자격 증명으로 신규 계정 생성·비밀번호 변경 허용**  
    계정 생성이나 비밀번호 변경 시 **유출된 크리덴셜 목록(전 세계 침해 사고에서 수집된 이메일·비밀번호 조합)** 을 조회하지 않고 그대로 사용을 허용하는 경우이다. 다른 서비스에서 이미 털린 비밀번호를 그대로 쓰는 사용자가 많기 때문에 공격자가 재사용만으로 손쉽게 계정을 장악할 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
5. **위험한 계정 복구·비밀번호 찾기 플로우**  
    “어머니의 성함은?”, “첫 학교 이름은?” 같은 **지식 기반 질문(Knowledge-based answers)에 의존하는 계정 복구·비밀번호 찾기 플로우**는 NIST와 OWASP 양쪽에서 안전하게 만들 수 없다고 본다. OSINT, SNS, 사회공학으로 추론 가능한 정보에 의존하기 때문에 설계 자체가 취약하며, 이 점만으로도 Authentication Failures에 해당한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
6. **비밀번호 스토어에서의 평문·약한 해시·단순 암호화 사용**  
    비밀번호를 평문으로 저장하거나, 복호화 가능한 단순 암호화, 솔트·워크팩터 없는 단순 해시(SHA-1, MD5 등)를 사용하는 경우이다. 이는 A04 Cryptographic Failures와도 직접 연결되며, 비밀번호 스토어가 탈취되는 즉시 대규모 계정 탈취로 이어질 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
7. **부재하거나 비효과적인 MFA**  
    중요 시스템에 대해 **다단계 인증(MFA)이 전혀 없거나, 있어도 선택 사항에 그쳐 대부분 사용자가 사용하지 않는 경우**이다. 설계·구현상의 허점으로 인해 MFA 우회가 가능한 경우도 포함되며, 이는 공격자가 도난 계정 정보를 재사용하는 것을 매우 쉽게 만든다.([Orca Security](https://orca.security/resources/blog/owasp-top-10-2025-key-changes/?utm_source=chatgpt.com "OWASP Top 10 2025: Key Changes & What They Mean"))
    
8. **MFA 실패 시 취약한 폴백 경로 허용**  
    2FA 토큰 분실 또는 기기 교체 시 이메일 링크 하나, 콜센터 전화, 단일 지식 기반 질문 등 **약한 폴백 경로**만으로 MFA를 우회하도록 허용하는 경우이다. 공격자는 강한 요소 대신 항상 가장 약한 폴백 채널을 노리게 된다.
    
9. **세션 식별자를 URL·숨은 필드 등 클라이언트 측 취약 위치에 노출**  
    세션 ID를 쿼리스트링, 프래그먼트, 숨은 필드, 로컬 스토리지 등 **사용자나 스크립트가 쉽게 접근·유출 가능한 위치에 저장·노출하는 경우**이다. URL에 포함된 세션 ID는 브라우저 히스토리, 리퍼러, 로그 등에 남아 세션 탈취 위험이 매우 크다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
10. **로그인 전후 동일 세션 ID 재사용(Session Fixation)**  
    로그인 전에 발급한 세션 ID를 로그인 후에도 그대로 재사용하는 경우이다. 공격자가 미리 세션 ID를 피해자에게 강제로 사용하게 만든 뒤, 나중에 같은 세션 ID를 재사용해 계정을 가로챌 수 있는 **세션 고정(Session Fixation)** 공격이 가능해진다.
    
11. **로그아웃·타임아웃 시 세션·토큰 무효화 실패**  
    로그아웃하거나 일정 시간 활동이 없더라도 세션 또는 SSO 토큰을 제대로 무효화하지 않는 경우이다. 이 경우 사용자가 브라우저 탭만 닫고 떠났을 때 이후에 같은 브라우저를 사용하는 사람이 그대로 세션을 이어받아 민감 정보에 접근할 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    

---

## 4. 예방 방법 (How to prevent)

OWASP는 인증 실패를 줄이기 위해 다음과 같은 예방책을 제안한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))

1. **MFA(다단계 인증) 구현 및 강제**  
    가능한 경우 크리덴셜 스터핑, 브루트포스, 도난된 비밀번호 재사용 공격을 막기 위해 **MFA를 구현하고 사용을 강제**한다. 중요 시스템에서는 “비밀번호만”으로 로그인 가능한 구간을 없애는 것이 이상적이다.
    
2. **비밀번호 관리자 사용 권장**  
    사용자가 각 사이트마다 복잡하고 긴 비밀번호를 쓰도록 **비밀번호 관리자 사용을 적극 권장하고 UX 차원에서 자연스럽게 유도**한다.
    
3. **기본 크리덴셜로 배포 금지**  
    특히 관리자 계정에 대해 **기본 ID·비밀번호(admin/admin 등)를 포함한 어떠한 기본 크리덴셜도 제품·서비스에 탑재하거나 배포하지 않도록 정책화**한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
4. **약한 비밀번호 차단(Worst Password List 활용)**  
    신규·변경 비밀번호는 **상위 10,000개 약한 비밀번호 목록**과 같은 리스트를 기반으로 필터링하여 가장 위험한 비밀번호 조합은 애초에 사용할 수 없게 한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
5. **유출된 크리덴셜 목록과의 대조**  
    계정 생성·비밀번호 변경 시 `haveibeenpwned` 같은 서비스나 자체 구축한 **유출 크리덴셜 DB와 대조하여 이미 침해된 비밀번호 조합은 사용을 금지**한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
6. **현대적 비밀번호 정책(NIST 800-63b 등) 준수**  
    비밀번호 길이·복잡도·회전 정책을 NIST 800-63b의 Memorized Secrets 가이드와 같은 **증거 기반 정책**에 맞추고, 정기적 강제 변경은 침해가 의심될 때만 요구하는 것을 원칙으로 한다. 복잡도만 강조하는 구식 정책 대신 유출 비밀번호 차단과 MFA를 중심으로 설계해야 한다.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    
7. **계정 열거(Account Enumeration) 방지**  
    회원 가입, 로그인 실패, 비밀번호 찾기, API 경로 등에서 “존재하지 않는 ID입니다.”와 같이 결과에 따라 다른 메시지를 주지 말고, **항상 동일한 메시지(예: ‘아이디 또는 비밀번호가 올바르지 않습니다.’)를 사용하여 계정 유무를 추측하지 못하도록 설계**한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
8. **로그인 실패 제한·지연과 탐지·알림**  
    로그인 실패 횟수를 제한하거나 실패 횟수에 따라 지연 시간을 점진적으로 늘리되, 서비스 전체 DoS를 유발하지 않도록 주의해야 한다. 모든 실패는 로그로 남기고 크리덴셜 스터핑·브루트포스 등 의심스러운 패턴이 탐지되면 **운영자에게 경보를 발행**한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
9. **서버 측 안전한 세션 매니저 사용**  
    서버 측의 안전한 세션 매니저를 사용하여 로그인 성공 시 **고엔트로피의 새로운 세션 ID를 재발급**하고, 세션 ID는 URL에 포함하지 않은 채 **보안 쿠키(HttpOnly, Secure 플래그)** 로만 저장한다. 로그아웃·유휴 타임아웃·절대 타임아웃 시 세션이 확실히 무효화되도록 설계해야 한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))
    
10. **표준·검증된 인증·세션 관리 솔루션 활용**  
    가능하다면 직접 인증을 구현하기보다 **충분히 검증된 인증·ID·세션 관리 솔루션(예: 상용·오픈소스 IdP, 인증 서버)을 도입하여 리스크를 이전(transfer)** 하는 전략이 바람직하다. 이를 통해 구현 실수·논리 오류 위험을 크게 줄일 수 있다.([OWASP Foundation](https://owasp.org/Top10/2025/0x00_2025-Introduction/?utm_source=chatgpt.com "Introduction - OWASP Top 10:2025"))
    

---

## 5. 예시 공격 시나리오 (Example attack scenarios)

### 시나리오 1 – 크리덴셜 스터핑·하이브리드 패스워드 공격으로 인한 계정 대량 탈취

한 서비스는 로그인 시도에 대해 별도의 봇 방어, 크리덴셜 스터핑 탐지, 속도 제한을 구현하지 않았다. 공격자는 다른 침해 사고에서 유출된 이메일·비밀번호 조합 수십만 건을 입수한 뒤 이 리스트를 이용해 로그인 엔드포인트에 자동화된 요청을 보낸다. 처음에는 완전히 동일한 조합으로 시도하다가 점차 인간의 습관을 반영한 하이브리드 공격을 시도한다. 예를 들어 “Winter2025”가 유출된 비밀번호라면 “Winter2026”으로 증가시키거나 “ILoveMyDog5”를 “ILoveMyDog6”, “ILoveMyDog7”로 시도한다. 서비스는 이러한 패턴을 탐지하거나 차단하지 못하기 때문에 사실상 “이 비밀번호가 맞는지 확인해 주는 패스워드 오라클”이 되고, 최종적으로 공격자는 수많은 계정에 무단 로그인하는 데 성공한다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))

### 시나리오 2 – 비밀번호 정책 오해로 인한 MFA 미도입 및 패스워드 재사용 유도

어떤 조직은 과거 베스트 프랙티스에 따라 “비밀번호 복잡성 규칙(특수문자 필수, 대문자 필수 등)과 90일 주기 강제 변경”을 엄격히 적용하지만 **MFA는 선택 사항으로만 제공**하고 있다. 사용자는 여러 시스템에서 이러한 복잡한 규칙을 맞추기 귀찮기 때문에 비밀번호를 재사용하거나 기억하기 쉬운 약간의 변형(연도 늘리기, 숫자 증가 등)만 반복적으로 사용한다. 공격자가 한 시스템에서 비밀번호를 탈취하면 동일 계정·이메일 조합으로 다른 여러 시스템에도 쉽게 로그인할 수 있다. 이 상황은 A07에서 말하는 것처럼 **비밀번호만을 유일한 인증 요소로 사용하는 설계와 잘못된 비밀번호 정책** 때문에 인증 공격이 성공하는 전형적인 사례이다.([Orca Security](https://orca.security/resources/blog/owasp-top-10-2025-key-changes/?utm_source=chatgpt.com "OWASP Top 10 2025: Key Changes & What They Mean"))

### 시나리오 3 – 세션 타임아웃·로그아웃 처리 실패로 인한 공용 PC 계정 탈취

한 웹 애플리케이션은 로그인·세션 관리를 자체 구현했지만 **타임아웃과 로그아웃 처리를 제대로 설계하지 않았다.** 사용자는 공용 PC에서 메일·문서·채팅이 통합된 포털 서비스에 로그인한 뒤 작업을 마치고 브라우저 탭만 닫고 자리를 떠난다. 이 애플리케이션은 브라우저 탭을 닫아도 서버 측 세션이 유지되고, SSO 세션에 대해서도 단일 로그아웃(SLO)이 구현되어 있지 않아 현재 보고 있던 서비스에서만 로그아웃하고 나머지 서비스의 세션은 그대로 유지된다. 이후 같은 PC를 사용하는 다른 사람이 브라우저를 열어 포털에 접근하면 이전 사용자의 세션이 여전히 활성 상태이며, 비밀번호를 다시 입력하지 않아도 메일·문서·채팅에 모두 접근할 수 있다. 이 사례는 **세션 만료·로그아웃 설계 실패가 어떻게 Authentication Failures로 이어져 계정 탈취와 정보 유출로 연결되는지**를 잘 보여 준다.([OWASP Foundation](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/?utm_source=chatgpt.com "A07 Authentication Failures - OWASP Top 10:2025"))

---

## 참고

- [OWASP Foundation – A07:2025 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/ "A07 Authentication Failures - OWASP Top 10:2025")