# Mishandling of Exceptional Conditions

## 1. 배경 (Background)

- **순위**: Mishandling of Exceptional Conditions(A10)은 OWASP Top 10:2025에서 **10위**에 위치하며, 2021년 A10이었던 SSRF(Server-Side Request Forgery)가 A01 Broken Access Control로 흡수된 자리를 대신하는 **완전 신규 카테고리**이다. ([equixly.com](https://equixly.com/blog/2025/12/01/owasp-top-10-2025-vs-2021/?utm_source=chatgpt.com "OWASP Top 10 2025 vs 2021: What Has Changed?"))
    
- **명칭 변화**: 2021년에는 A10 항목명이 “Server-Side Request Forgery(SSRF)”였고, 2025에서는 이 위치를 **“Mishandling of Exceptional Conditions(예외 상황 처리 실패)”** 가 새로 차지한다. 즉, 특정 취약점 유형(SSRF)에서 벗어나, **“예외·에러 상황을 잘못 다루는 전반적인 설계·구현 실패”** 를 별도 카테고리로 분리한 것이다. ([equixly.com](https://equixly.com/blog/2025/12/01/owasp-top-10-2025-vs-2021/?utm_source=chatgpt.com "OWASP Top 10 2025 vs 2021: What Has Changed?"))
    
- **카테고리 성격**: A10은 **예외·에러·비정상 상태를 제대로 예방·감지·복구하지 못해 시스템이 예측 불가능하거나 불안정한 상태로 빠지는 모든 경우**를 포괄한다. 구체적으로는 잘못된 오류 처리, 논리적 오류, fail-open, 환경 이상(메모리 부족, 네트워크 장애, 권한 문제 등)에 대한 대응 실패까지 포함한다. 이전에는 “poor code quality” 아래 뭉뚱그려져 있던 여러 CWE를 떼어내어, 보다 구체적인 설계·구현 가이드를 제공하려는 목적이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
- **대표 CWE** (A10 범주에 포함되는 대표적인 약점들) ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
    - **CWE-209** – Generation of Error Message Containing Sensitive Information (민감 정보가 포함된 오류 메시지 생성)
        
    - **CWE-234** – Failure to Handle Missing Parameter (필수 파라미터 누락 처리 실패)
        
    - **CWE-274** – Improper Handling of Insufficient Privileges (권한 부족 상황 처리 부적절)
        
    - **CWE-476** – NULL Pointer Dereference (NULL 포인터 역참조)
        
    - **CWE-636** – Not Failing Securely ('Failing Open') (실패 시 안전하지 않은 상태로 열어 두기)
        

---

## 2. Score table (점수 표)

|항목|값|
|---|---|
|매핑된 CWE 수|24|
|최대 발생률 (Max Incidence)|20.67%|
|평균 발생률 (Avg Incidence)|2.95%|
|최대 커버리지 (Max Coverage)|100.00%|
|평균 커버리지 (Avg Coverage)|37.95%|
|가중 평균 Exploit 점수|7.11|
|가중 평균 Impact 점수|3.81|
|총 발생 건수|769,581|
|총 CVE 수|3,416|

정량 지표를 종합하면 A10은 **평균 발생률은 중간(2.95%)이지만, 거의 모든 애플리케이션에서 테스트되고(최대 커버리지 100%), 악용 난이도도 높은 편이며(Exploit 7.11), “에러 한 번 잘못 처리해서 전체 서비스가 망가지는” 류의 리스크를 대표**한다고 볼 수 있다. 특히 24개의 CWE와 34백여 개의 CVE가 묶여 있을 만큼, 예외 처리 실패는 과거 “코드 품질 문제” 정도로 취급되기에는 지나치게 광범위하고 치명적인 영역이라는 점이 수치로 드러난다.

---

## 3. 위험 설명 (Description)

OWASP 정의에 따르면 Mishandling of Exceptional Conditions는 **프로그램이 비정상·예외 상황을 적절히 예방·감지·대응하지 못해, 크래시·예측 불가능한 동작·보안 취약점으로 이어지는 모든 경우**를 의미한다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

조금 풀어서 말하면 다음과 같다.

- 애플리케이션이 **예외 상황 자체가 발생하지 않도록 설계·검증하지 못했거나**,
    
- 예외가 발생하는 순간 **그 상황을 제대로 인지·분류하지 못했거나**,
    
- 예외 이후에 **롤백·정리·차단 등 적절한 후속 조치를 하지 못하는 경우**,  
    이 세 가지 축 중 하나 이상이 실패하면 “예외 상황 처리 실패”로 간주된다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    

OWASP와 주변 해설들을 기준으로 볼 때, 아래와 같은 특징이 보이면 A10 리스크가 존재할 가능성이 크다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

1. **입력 검증·경계 조건 부족으로 인한 예외 남발**  
    타입·범위·필수 여부·포맷 등의 입력 검증이 부족해, NULL 포인터 역참조, 인덱스 범위 초과, 0으로 나누기, 누락 파라미터(CWE-234) 등 “막았어야 할 예외”가 빈번하게 발생한다.
    
2. **예외를 삼키거나(Uncaught, Empty catch) 아무 조치도 하지 않음**  
    예외를 상위로 전달하지도 않고, catch 블록 안에서 아무 동작도 하지 않거나(로그·롤백 없음), “에러 여부를 무시한 채” 계속 로직을 진행하는 패턴(CWE-390, CWE-391, CWE-703 등)이 널려 있다.
    
3. **예외 처리 위치가 너무 상위 레벨에만 존재**  
    예외가 발생한 함수·모듈 근처에서는 제대로 처리하지 않고, UI나 전역 핸들러에서만 한 번에 처리하려고 해서 **어디에서 무엇이 잘못됐는지 정보가 부족하고, 복구 단위도 너무 넓어지는** 설계이다.
    
4. **Fail-Open, 안전하지 않은 실패(default allow)**  
    권한 체크·인증·검증 로직에서 에러가 발생했을 때, “사용자 경험”이나 “장애 회피”를 이유로 **검증을 건너뛰거나, 기본 허용(default allow)으로 흘려보내는 설계(CWE-636)** 이 있다. 예를 들어, “권한 조회 서비스가 응답하지 않으면 일단 허용” 같은 패턴이다.
    
5. **예외 시 트랜잭션 롤백·상태 정리 실패**  
    다단계 트랜잭션 도중 네트워크 장애·DB 에러 등이 발생했는데, **그 시점까지의 변경 사항을 전부 되돌리지 않고 일부만 반영된 상태로 남겨 두는 설계**이다. 이는 특히 금융·포인트·재고·권한 변경 등에서 치명적인 상태 불일치와 사기성 거래로 이어질 수 있다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
6. **예외 상황에서 자원·핸들러·세션을 정리하지 않아 리소스 고갈**  
    파일 업로드·소켓 통신·스레드 사용 등에서 예외가 발생했을 때, 파일 핸들·소켓·락·스레드 풀 리소스를 해제하지 않고 남겨 두어, 반복 시도만으로 **리소스 고갈(메모리, 파일 디스크립터, 커넥션 풀 등)을 일으키는 패턴**이다.
    
7. **오류 메시지에 민감 정보 포함 (에러 기반 정찰)**  
    예외 발생 시 스택 트레이스, SQL 쿼리, 내부 경로, 구성 정보, 비밀 값 등을 그대로 클라이언트에 노출(CWE-209, CWE-550 등)해, 공격자가 이를 기반으로 SQLi·경로 조작·구성 공격을 정교하게 다듬을 수 있게 된다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
8. **예외 종류·코드를 통일하지 않아 방어 로직이 깨짐**  
    동일한 실패 조건이 위치에 따라 서로 다른 예외 타입·코드·메시지로 표현되어, 상위 보안 로직이나 탐지 로직이 제대로 인지·처리하지 못하는 경우이다. 예를 들어 어떤 곳에서는 인증 실패를 일반 에러로 처리해 로그인 방어·로깅·알림에서 누락되는 패턴이다.
    
9. **특정 환경(메모리 부족·네트워크 불안정·권한 상실 등)에 대한 설계 부재**  
    평상시에만 잘 작동하고, **네트워크 지연·DNS 오류·일시적 권한 오류·저장 공간 부족**과 같은 비정상 상태를 고려하지 않은 채 “무한 재시도”나 “이상한 상태로 방치”하는 설계이다. 이런 부분은 실제 운영 환경에서만 드러나는 경우가 많다.
    

요약하면 A10은 **“모든 것이 정상일 때는 잘 돌아가지만, 조금만 삐끗하면 보안 사고로 이어지는 예외 처리·실패 처리의 설계/구현 실패”**를 다루는 항목이라고 이해하면 된다.

---

## 4. 예방 방법 (How to prevent)

OWASP가 제시하는 권고와 주변 해설을 합쳐 보면, 핵심 키워드는 **“Fail Closed, Plan for the Worst, 일관된 예외 처리 체계”**이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

1. **예외 상황을 전제로 한 설계(Plan for Exceptional Conditions)**  
    기능 설계 시 “정상 플로우”만 그리지 말고, 입력 누락·타임아웃·네트워크 끊김·권한 부족·리소스 부족 등 **비정상 조건을 구체적으로 정의하고 어떻게 막고/감지하고/복구할지 설계 단계에서 명시**해야 한다.
    
2. **발생 지점에서의 예외 포착·처리 + 전역 핸들러 보완**  
    가능한 한 **예외가 발생하는 함수·모듈 근처에서 예외를 포착하고, 의미 있는 롤백·정리·로그 기록·재시도 여부 결정**을 수행해야 한다. 그 위에 “마지막 방어선”으로 전역 예외 핸들러를 두어, 예기치 못한 예외가 올라왔을 때 안전하게 실패하고 적절한 알림·로깅을 수행하도록 한다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
3. **Fail-Closed(안전하게 닫힌 상태로 실패) 원칙 적용**  
    인증·인가·결제·트랜잭션·업데이트·파일 처리 등 보안에 민감한 경로에서는 **오류 시 기본값을 ‘허용’이 아니라 ‘거부·롤백’으로 두는 Fail-Closed 원칙**을 적용해야 한다. 권한 서비스 장애를 이유로 검증을 건너뛰거나, 일부 단계만 성공했는데 그대로 커밋하는 설계는 금물이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
4. **예외 시 트랜잭션 전체 롤백과 상태 정리**  
    멱등하지 않은 다단계 작업(예: 계좌 이체, 재고 이동, 포인트 적립/차감 등)은 **어느 단계에서 에러가 나더라도 전체를 롤백하는 것을 기본 정책으로** 삼아야 한다. 파셜 커밋 후 “추후 수동 조정”에 의존하는 설계는 상태 불일치와 사기 공격에 취약해진다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
5. **리소스 정리와 제한(Resilience·Rate Limiting)**  
    파일·소켓·스레드·메모리·DB 커넥션 등에 대해 **예외 발생 시 반드시 해제·반납하는 패턴(try/finally, using, defer 등)을 표준화**하고, 동시에 **속도 제한·쿼터·쓰로틀링·최대 크기·최대 재시도 횟수 등 상한을 설정**해 자원 고갈형 예외가 애초에 발생하지 않도록 한다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
6. **민감 정보가 없는 안전한 오류 메시지 설계**  
    사용자에게 보여 주는 오류 메시지는 **내부 구조·쿼리·경로·스택 트레이스를 포함하지 않는 “친절하지만 정보는 적은” 메시지**로 제한하고, 상세 정보는 서버 측 로그에만 남긴다. 이렇게 하면 A02/A04/A09와의 연결 리스크도 함께 줄일 수 있다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
7. **중앙집중형 에러 처리·로깅·모니터링·알림 체계 구축**  
    예외가 발생할 때마다 **일관된 포맷으로 로깅하고(A09), 모니터링/Observability 도구에서 반복 패턴·이상 징후를 인지해 알림을 발행**하도록 설계한다. 오류가 잦은 지점·패턴을 기반으로 추가 보완 설계·성능 튜닝도 할 수 있다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
8. **입력 검증·정규화·화이트리스트를 통한 예외 예방**  
    많은 예외는 사실 **입력 검증과 정규화에서 미리 걸렀으면 발생하지 않았을 문제**이다. 길이·타입·범위·형식에 대한 화이트리스트 검증을 통해 “예외 상황 자체”의 발생 빈도를 줄이는 것이 중요하다.
    
9. **조직 차원의 예외 처리 가이드·코딩 표준 수립**  
    프로젝트마다 제각각 예외를 다루면 리뷰·감사가 어렵다. **조직 차원의 예외 처리 가이드(어떤 예외를 어디서 잡고 무엇을 로그에 남기며 무엇을 사용자에게 보여 줄지)를 표준화**하고, 코드 리뷰·정적 분석 도구로 이를 강제하는 것이 좋다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    
10. **스트레스·성능·Failover·침투 테스트에서 예외 시나리오 포함**  
    기능 테스트뿐 아니라 **스트레스 테스트, 장애 주입(Chaos Engineering), 성능 테스트, 침투 테스트**에 예외 상황(네트워크 끊김, DB 다운, 타임아웃, 리소스 부족, 에러 폭주 등)을 포함해 실제로 어떻게 실패하고 회복하는지 검증해야 한다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))
    

---

## 5. 예시 공격 시나리오 (Example attack scenarios)

### 시나리오 1 – 파일 업로드 예외 처리 실패를 이용한 자원 고갈(DoS)

어떤 웹 애플리케이션은 대용량 파일 업로드 기능을 제공하면서, 업로드 중 예외가 발생했을 때 단순히 예외를 잡고 에러 메시지만 반환하도록 구현되어 있다. 그러나 예외 처리 코드에서는 이미 할당된 파일 핸들·임시 파일·버퍼 메모리·스레드 등을 제대로 해제하지 않고 그대로 남겨 두고, 다음 요청을 계속 받아들인다. 공격자는 의도적으로 잘못된 포맷·손상된 파일·비정상적인 청크를 반복해서 업로드하여 예외를 연속적으로 발생시킨다. 각 예외는 리소스를 조금씩 점유한 채 해제되지 않고 쌓이게 되고, 결국 서버의 파일 핸들·메모리·커넥션 풀 등이 고갈되어 정상 사용자는 더 이상 서비스를 이용할 수 없게 된다. 이는 **예외 시 리소스를 정리하지 않은 설계 탓에 단순 요청 반복만으로 DoS를 유도할 수 있게 된 전형적인 A10 시나리오**이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

### 시나리오 2 – DB 에러 메시지를 통한 민감 정보 노출 및 SQL Injection 정찰

한 서비스는 데이터베이스 쿼리 오류가 발생하면 애플리케이션 레이어에서 이를 catch하지 않고, 프레임워크 기본 동작대로 **전체 스택 트레이스와 SQL 오류 메시지를 브라우저에 그대로 출력**한다. 공격자는 의도적으로 잘못된 파라미터를 보내거나 따옴표·특수문자를 주입해 쿼리 에러를 유도하고, 그때마다 화면에 노출되는 **테이블 이름, 컬럼 이름, 인덱스 정보, 내부 경로, 사용 DB 종류** 등을 수집한다. 이렇게 모은 정보를 바탕으로 공격자는 더 정교한 SQL Injection 페이로드를 구성하고, 결국 데이터베이스의 민감 데이터를 탈취한다. 이 사례는 **오류 메시지에 민감 정보를 포함시키고, 예외를 사용자에게 그대로 노출한 결과가 본격적인 공격 전 “정찰 단계”로 악용된 경우**로, A10과 A04/A09가 교차하는 전형적인 문제이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

### 시나리오 3 – 금융 트랜잭션 중단 시 롤백 실패로 인한 잔액·상태 불일치

어떤 금융 시스템에서 송금 트랜잭션은 “발신자 계좌에서 금액 차감 → 수신자 계좌에 금액 입금 → 거래 로그 기록”의 세 단계로 이루어져 있다. 설계상 이 세 단계를 하나의 원자적 트랜잭션으로 관리하지 않고, 각 단계를 개별 API 호출과 부분 커밋으로 처리한 상태이며, 중간에 예외가 발생했을 때 전체를 롤백하는 로직도 구현되어 있지 않다. 공격자는 네트워크 장애를 의도적으로 유도하거나, 중간 단계에서 연결을 끊는 방식으로 오류를 일으킨다. 그 결과 “발신자 계좌 차감은 성공했지만 수신자 계좌 입금은 실패”하거나, 반대로 “입금은 되었는데 차감은 이루어지지 않는” 비정상 상태가 발생한다. 혹은 에러 처리 과정의 타이밍 문제를 악용해 동일 거래를 여러 번 반복시키는 레이스 컨디션을 유도하여, 실제 잔액보다 많은 돈을 송금받는 상황도 만들어 낼 수 있다. 이는 **예외 발생 시 트랜잭션을 Fail-Closed(전체 롤백) 하지 않고 중간 상태로 방치한 설계가 재무적 손실·사기성 거래로 직결된 사례**로, A10에서 특히 강조하는 위험 유형이다. ([OWASP](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025"))

---

## 참고

- [OWASP Foundation – A10:2025 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ "A10 Mishandling of Exceptional Conditions - OWASP Top 10:2025")
    

- [Cyber Security News](https://cyberpress.org/owasp-releases-2025-top-10-list/?utm_source=chatgpt.com)
- [Aikido](https://www.aikido.dev/blog/owasp-top-10-2025-changes-for-developers?utm_source=chatgpt.com)
- [eSecurity Planet](https://www.esecurityplanet.com/threats/news-owasp-top-10-2025/?utm_source=chatgpt.com)
- [Orca Security](https://orca.security/resources/blog/owasp-top-10-2025-key-changes/?utm_source=chatgpt.com)
- [blog.gitguardian.com](https://blog.gitguardian.com/owasp-top-10-2025/?utm_source=chatgpt.com)