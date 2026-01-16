# Logging & Alerting Failures

## 1. 배경 (Background)

- **순위**: Logging & Alerting Failures(A09)는 OWASP Top 10:2025에서 2021과 마찬가지로 **9위**를 유지한다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))
    
- **명칭 변화**: 2021의 이름은 “Security Logging and Monitoring Failures”였으나, 2025에서는 **“Logging & Alerting Failures”**로 변경되었다. 이는 단순 로그 축적이 아니라 **로그 기반으로 실제 대응을 유도하는 Alerting 기능의 중요성**을 강조하려는 의도이다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))
    
- **데이터 상 과소대표(Underrepresented)**: 이 카테고리는 테스트하기가 매우 어려워 CVE·CVSS 데이터에는 **723건만 반영**되어 있어 수치상 비중은 크지 않지만, 실제로는 **가시성(visibility), 침해 탐지, 사고 대응·포렌식** 측면에서 영향도가 매우 큰 영역이다. 2025에도 커뮤니티 설문 투표를 통해 Top 10 안에 유지되었으며, “데이터에는 잘 안 보이지만 사고의 심각도를 키우는 숨은 리스크”로 취급된다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))
    
- **대표 CWE** (대표적으로 포함되는 문제 유형)([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))
    
    - **CWE-117** – Improper Output Neutralization for Logs (로그 출력 인코딩·중화 부적절)
        
    - **CWE-221** – Information Loss of Omission (필수 정보 누락으로 인한 정보 손실)
        
    - **CWE-223** – Omission of Security-relevant Information (보안 관련 정보 누락)
        
    - **CWE-532** – Insertion of Sensitive Information into Log File (로그 파일에 민감 정보 삽입)
        
    - **CWE-778** – Insufficient Logging (로깅 부족)
        

---

## 2. Score table (점수 표)

|항목|값|
|---|---|
|매핑된 CWE 수|5|
|최대 발생률 (Max Incidence)|11.33%|
|평균 발생률 (Avg Incidence)|3.91%|
|최대 커버리지 (Max Coverage)|85.96%|
|평균 커버리지 (Avg Coverage)|46.48%|
|가중 평균 Exploit 점수|7.19|
|가중 평균 Impact 점수|2.65|
|총 발생 건수|260,288|
|총 CVE 수|723|

정량 지표를 종합하면 Logging & Alerting Failures는 **발견 빈도는 다른 항목만큼 눈에 띄지 않지만, 한 번 존재하면 공격자가 악용하기 쉬운 편(Exploit 점수 높음)이고, 다른 취약점의 피해를 키우는 “증폭기” 역할을 하는 위험 영역**으로 볼 수 있다. 또한 커버리지 수치를 보면 실제 현업 환경에서 이 영역에 대한 **점검·테스트가 충분히 이루어지지 않는 경향**도 드러난다.

---

## 3. 위험 설명 (Description)

OWASP 정의에 따르면 **적절한 로깅·모니터링이 없다면 공격·침해를 사실상 “보지 못하게” 되며, Alerting이 없다면 사고가 발생해도 신속한 대응이 매우 어렵다.**([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025")) 로그·모니터링·알림 체계가 다음과 같은 특징을 보이면 A09 범주의 리스크가 존재할 가능성이 크다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))

1. **감사 이벤트 미로그·불일치 로그**  
    로그인, 로그인 실패, 계정 잠금, 고가치 트랜잭션 등 감사·보안 이벤트를 로그로 남기지 않거나, 시스템·컴포넌트별로 기록 방식이 제각각이라 상관분석이 어렵다.
    
2. **경고·에러 로그 부실**  
    경고나 에러가 발생해도 로그를 남기지 않거나, 원인 분석이 불가능할 정도로 불명확한 메시지만 남겨 조사·포렌식에 도움이 되지 않는다.
    
3. **로그 무결성 보호 미흡**  
    로그 파일이 위·변조·삭제에 취약하고, append-only 스토리지나 해시 체인 같은 무결성 보호 통제가 없다.
    
4. **의심 활동 모니터링 부족**  
    애플리케이션·API·인프라 로그를 수상한 활동에 대해 모니터링하지 않거나, 수집만 하고 실제로 분석·탐지 로직이 적용되지 않는다.
    
5. **로컬 저장 + 백업·집중 수집 미흡**  
    로그를 애플리케이션 서버 로컬 디스크에만 저장하고 중앙집중 수집·보관이나 장기 백업 체계가 없어, 장애나 침해 시점에 로그가 유실된다.
    
6. **알림 기준·에스컬레이션 미비**  
    언제 무엇에 대해 알림을 보낼지 기준이 없고, 알림을 받더라도 적시에 검토·조치로 이어지는 운영 프로세스(에스컬레이션)가 없다.
    
7. **공격·스캔 탐지 실패**  
    Burp, ZAP 같은 DAST 도구나 모의침투 테스트에서 명백한 공격이 발생하는데도 이를 탐지하거나 알림을 발생시키지 못한다.
    
8. **실시간·근실시간 탐지 불가**  
    로그는 쌓이지만 실시간·근실시간으로 이상 징후를 감지하고 알리는 체계가 없어, 사고를 발견하는 시점이 수일·수주 단위로 지연된다.
    
9. **민감 정보 노출**  
    로그·알림 메시지가 사용자나 공격자에게 그대로 노출되거나, 로그에 PII/PHI 같은 민감 정보를 직접 기록해 정보 유출·규제 위반 위험을 키운다.
    
10. **로그 시스템 자체에 대한 공격 가능**  
    로그 데이터가 적절히 인코딩·중화되지 않아, 로그 수집기·대시보드·SIEM 등 로깅·모니터링 시스템을 향한 인젝션·XSS·RCE 공격이 가능해진다.
    
11. **에러·예외 처리 부실**  
    에러·예외가 발생해도 시스템이 이를 인지하지 못하고, 로그에도 남지 않아 문제가 있었다는 사실조차 모르는 상태가 지속된다.
    
12. **알림 Use Case 부족·노후화**  
    어떤 패턴·조합에서 알림을 발생시킬지에 대한 시나리오(Use Case)가 부족하거나 최신 공격 패턴·위협 환경을 반영하지 못하고 오래된 상태로 방치된다.
    
13. **오탐 과다로 인한 Alert Fatigue**  
    False positive 알림이 너무 많아 SOC·운영 인력이 중요한 알림을 놓치거나 아예 보지 않게 되는 Alert Fatigue 상태가 된다.
    
14. **플레이북 미비**  
    “이 알림이 오면 어떤 조치를 어떤 순서로 할 것인가”에 대한 플레이북이 부실하거나 존재하지 않아 대응이 매번 Ad-hoc으로 이루어진다.
    

---

## 4. 예방 방법 (How to prevent)

OWASP가 제시하는 권고를 정리하면 다음과 같다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))

1. **주요 보안 이벤트 로깅·장기 보관**  
    로그인·로그아웃, 로그인 실패, 계정 잠금, 권한 변경, 고가치 트랜잭션 등 보안·감사 이벤트를 충분한 컨텍스트(계정 ID, IP, User-Agent, 세션 ID 등)와 함께 로그에 기록하고, 장애·침해 후 포렌식을 위해 충분 기간 보관한다.
    
2. **보안 통제 로직: 성공·실패 모두 로깅**  
    인증, 인가, 입력 검증, 중요한 비즈니스 검증 등 보안 통제가 존재하는 부분에서 성공과 실패 모두를 일관되게 로깅해, 공격 시도와 정상 사용 패턴을 함께 분석할 수 있도록 한다.
    
3. **표준화된 구조화 로그 포맷 사용**  
    로그를 JSON, CEF 등 머신 파서블한 구조화 포맷으로 출력하여 SIEM·로그 관리 시스템이 손쉽게 파싱·상관분석 할 수 있도록 설계한다.
    
4. **로그 데이터 인코딩·중화**  
    로그에 들어가는 값들을 적절히 인코딩·중화하여 로그 수집기·분석기가 로그 데이터를 통해 공격받지 않도록 예방하고, CWE-117 범주의 문제를 피한다.
    
5. **감사 추적(Audit Trail)의 무결성 보장**  
    중요 행위에 대해서는 삭제·변조가 불가능하거나 매우 어려운 형태의 감사 추적을 유지하고, append-only 테이블, WORM 스토리지 등을 활용해 무결성을 보호한다.
    
6. **에러 시 롤백 + Fail-Closed 설계**  
    트랜잭션 중 에러가 발생하면 전체를 롤백 후 재처리하고, 가능한 한 항상 보안 측면에서 안전한 방향(닫힌 상태)으로 실패하도록 설계한다.
    
7. **수상한 행위에 대한 알림 설계**  
    비정상적인 로그인 시도, 권한 상승, 평소와 다른 지역·디바이스에서의 접근, 대량 데이터 조회·다운로드 등 의심스러운 패턴에 대해 자동 알림을 생성하고, 알림 기준·임계값·에스컬레이션 정책을 명확히 정의한다.
    
8. **DevSecOps·보안팀·SOC 협업 체계 구축**  
    DevSecOps, 보안팀, 운영팀, SOC가 협력해 어떤 이벤트·패턴에서 알림을 만들지(Use Case)와, 알림이 왔을 때 누가 어떤 순서로 무엇을 할지를 정의한 플레이북을 함께 설계한다.
    
9. **허니토큰(Honeytokens) 활용**  
    실제로 사용되지 않는 더미 계정·더미 데이터·더미 토큰을 심어 두고, 여기에 대한 접근이 발생하면 거의 False positive 없는 공격 시그널로 알림을 발행한다.
    
10. **행위 분석 및 AI 도입**  
    단순 규칙 기반 룰만이 아니라 행위 기반 이상 탐지(UEBA 등)와 AI 모델을 도입해 오탐을 줄이고, 평소와 다른 패턴을 더 잘 잡아낸다.
    
11. **사고 대응·복구 계획 및 보호 솔루션 활용**  
    NIST 800-61r2 등 표준에 따른 Incident Response & Recovery Plan을 수립하고, WAF(예: ModSecurity CRS), SIEM/ELK, Observability 플랫폼 등을 활용해 실시간·근실시간 탐지·대응 능력을 강화한다.
    

---

## 5. 예시 공격 시나리오 (Example attack scenarios)

### 시나리오 1 – 아동 건강보험 제공자 웹사이트의 장기 침해 미탐지

한 아동 건강보험 제공자의 웹사이트는 심각한 취약점을 가지고 있었지만 로깅·모니터링이 거의 없어 장기간 공격을 감지하지 못했다. 외부 제3자가 “이상한 점이 있다”고 제보하면서 뒤늦게 침해 사실을 인지했으며, 그 사이 350만 명 이상의 아동 건강 관련 레코드가 수정·유출되었다. 조사 결과 이 침해는 최대 7년 이상 지속되었을 가능성이 있는 것으로 드러났고, 적절한 로깅·모니터링·알림 체계 부재가 사고의 장기화를 초래한 대표 사례로 평가되었다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))

### 시나리오 2 – 인도 항공사의 3자 클라우드 호스팅 환경 침해

한 인도 항공사는 3자 클라우드 호스팅 사업자를 통해 고객 데이터를 보관하고 있었는데, 해당 호스팅 환경이 침해되었음에도 충분한 로깅·알림이 없어 장기간 이를 인지하지 못했다. 나중에야 호스팅 사업자로부터 침해 사실을 통보받았고, 이미 10년 이상 축적된 탑승객 개인정보(여권 정보, 결제 정보 등)가 유출된 후였다. 이 사고는 **자체 시스템뿐 아니라 위탁·클라우드 환경에서의 로깅·알림 체계 미비**가 어떤 규모의 장기 데이터 유출로 이어질 수 있는지 보여 준다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))

### 시나리오 3 – 유럽 항공사의 결제 애플리케이션 침해 및 GDPR 벌금

유럽의 한 항공사는 결제 애플리케이션의 취약점이 공격에 악용되어 40만 건 이상의 고객 결제 데이터가 유출되는 사고를 겪었다. 이 애플리케이션에는 충분한 로깅·알림 체계가 구현되어 있지 않아 침해 탐지가 지연되었고, 대응도 늦어졌다. 결국 이 사고는 GDPR 위반으로 판정되어 항공사는 2천만 파운드의 과징금을 부과받았다. 이는 **결제·개인정보 처리 시스템에서 로깅·알림 실패가 법적·재무적 리스크로 직결되는 사례**이다.([OWASP Foundation](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025"))

---

## 참고

- [OWASP Foundation – A09:2025 Logging & Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Logging_and_Alerting_Failures/ "A09 Logging and Alerting Failures - OWASP Top 10:2025")