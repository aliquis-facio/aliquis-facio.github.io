# Injection
## 1. 배경 (Background) 

- **순위 변화:** 2021에서 `#3`였던 Injection이 2025 RC1에서는 `#5`로 두 단계 하락.
    
- **여전히 핵심 취약점:**
    
    - 모든 앱의 **100%가 어떤 형태로든 Injection에 대해 테스트**되고 있음.
        
    - **가장 많은 CVE**가 연결된 카테고리.
        
- **주요 구성 CWE 특징:**
    
    - Injection 카테고리에 **37개의 CWE**가 매핑.
        
    - 그 중에서도:
        
        - **XSS(CWE-79)**: 발생 빈도는 매우 높지만 영향도는 상대적으로 낮은 편, CVE **3만+** 개.
            
        - **SQL Injection(CWE-89)**: 발생 빈도는 낮지만 영향도가 매우 큼, CVE **1만4천+** 개.
            
- XSS의 엄청난 CVE 개수 때문에, 카테고리 전체 **평균 Impact 점수는 상대적으로 낮아지는 효과**가 있음.
    



## 2. 점수표 (Score table) 

OWASP 데이터 집계 기준 점수는 다음과 같아요:

| 항목                    | 값         |
| --------------------- | --------- |
| 매핑된 CWE 개수            | 37        |
| 최대 발생률(Max Incidence) | 13.77%    |
| 평균 발생률(Avg Incidence) | 3.08%     |
| 최대 커버리지(Max Coverage) | 100.00%   |
| 평균 커버리지(Avg Coverage) | 42.93%    |
| 가중 Exploit 점수 평균      | 7.15      |
| 가중 Impact 점수 평균       | 4.32      |
| 총 발생 건수               | 1,404,249 |
| 관련 CVE 개수             | 62,445    |

**해석 포인트:**

- 분석된 애플리케이션 중 평균 **3.08%**가 Injection 취약점을 최소 1개 이상 갖고 있음.
    
- **62,445개의 CVE**가 이 카테고리와 연관 → Injection은 여전히 가장 “실전에서 많이 터지는” 취약점 군.
    



## 3. 설명 (Description) 

### 3-1. Injection이란?

> 공격자가 프로그램의 입력값에 악의적인 **코드나 명령(SQL, 쉘 커맨드 등)**을 주입해서  
> 시스템이 이를 **원래 코드의 일부처럼 실행**하도록 속이는 취약점.

**결과:**  
데이터 유출, 데이터 변조/삭제, 시스템 장악 등 치명적인 결과로 이어질 수 있음.

### 3-2. 애플리케이션이 취약해지는 상황

다음과 같은 조건이 있으면 Injection에 취약해지기 쉽습니다:

- **사용자 입력을 검증/필터링/정규화하지 않고 그대로 사용**할 때.
    
- **동적 쿼리**나 **비(非)파라미터화된 호출**에 사용자 입력을 바로 넣을 때.
    
- **ORM(Hibernate 등) 검색 조건**에 검증되지 않은 값을 그대로 사용해서  
    더 많은/민감한 레코드를 뽑을 수 있게 만드는 경우.
    
- SQL/명령문 문자열에 **문자열 연결(concatenation)**로 쿼리 구조 + 데이터가 섞여 있을 때.
    
- 파라미터, 헤더, URL, 쿠키, JSON/SOAP/XML 요청 값 등  
    다양한 입력 채널에서 입력을 제대로 처리하지 않을 때.
    

**대표적인 Injection 유형:**

- **SQL Injection**
    
- **NoSQL Injection**
    
- **OS Command Injection**
    
- **ORM Injection**
    
- **LDAP Injection**
    
- **Expression Language(EL), OGNL Injection**
    
- (간접적으로) 다양한 **템플릿/표현식 기반 Injection**
    

탐지는 **소스 코드 리뷰 + 자동화 테스트(특히 퍼징)** 조합이 가장 효과적이고,  
SAST/DAST/IAST를 CI/CD에 넣어서 배포 전에 잡는 걸 권장합니다. 

또한, LLM 시대에는 **Prompt Injection**처럼 별도의 Injection 카테고리도 등장해서  
OWASP LLM Top 10 (LLM01:2025 Prompt Injection)에서 따로 다룹니다. 



## 4. 예방 방법 (How to prevent) 

핵심 원칙 한 줄 요약:

> **“데이터”와 “명령/쿼리”를 철저하게 분리해라.**

### 4-1. 안전한 API / 파라미터 바인딩 사용

- **가장 중요한 예방책:**
    
    - 인터프리터를 직접 다루지 않는 **안전한 API** 사용.
        
    - 모든 입력을 **파라미터 바인딩(Prepared Statement)**로 넘김.
        
    - 가능하면 ORM 도구 사용 (단, ORM 쿼리에 문자열 연결을 하면 의미 없음).
        
- 주의: Stored Procedure도 **내부에서 문자열 연결로 쿼리를 만들면** 그대로 SQL Injection 발생.
    

### 4-2. 입력 검증 (positive validation)

- **서버 사이드에서 화이트리스트 기반 입력 검증**:
    
    - 예상되는 형식/길이/패턴만 허용.
        
- 단, 텍스트 박스나 다양한 특수문자가 필요한 API에서는  
    **입력 검증만으로는 완전 방어가 안 되므로** 다른 대책(파라미터 바인딩, escaping)과 병행.
    

### 4-3. 남은 동적 쿼리에 대한 escaping

- 정말 어쩔 수 없이 동적 쿼리를 써야 한다면:
    
    - 해당 인터프리터/DB에 맞는 **전용 escaping 함수**로 특수 문자를 이스케이프.
        
- 하지만:
    
    - 테이블명, 컬럼명 등 **스키마 구조 요소는 보통 escaping이 안 됨** → 사용자 입력으로 스키마를 구성하게 하면 매우 위험.
        
    - 문자열 파싱 + escaping은 **조금만 환경이 바뀌어도 깨지기 쉬운, 취약한 접근**이라는 경고가 명시돼 있음.
        

### 4-4. 테스트 자동화

- **SAST, DAST, IAST 도구를 CI/CD 파이프라인에 통합**해서
    
    - 코드 단계에서,
        
    - 테스트 단계에서
        
    - 운영 전 단계에서  
        Injection 취약점을 조기에 식별.
        



## 5. 예시 공격 시나리오 (Example attack scenarios) 

### 시나리오 #1 – 기본적인 SQL Injection

애플리케이션이 다음과 같은 코드로 쿼리를 만든다고 하자:

```java
String query = "SELECT * FROM accounts WHERE custID='" + request.getParameter("id") + "'";
```

또는 Hibernate HQL로:

```java
Query HQLQuery = session.createQuery(
    "FROM accounts WHERE custID='" + request.getParameter("id") + "'"
);
```

공통 문제점:

- `request.getParameter("id")` 값이 **그대로 문자열에 붙어서 쿼리**가 됨.
    
- 아무 검증, 파라미터 바인딩 없이 **직접 쿼리 문자열 조합**.
    

공격자는 브라우저에서 `id` 파라미터를 이런 값으로 바꿉니다:

```text
' UNION SELECT SLEEP(10);--
```

요청 URL 예:

```text
http://example.com/app/accountView?id=' UNION SELECT SLEEP(10);--
```

이렇게 되면 실제 실행되는 쿼리는 대략:

```sql
SELECT * FROM accounts WHERE custID='' UNION SELECT SLEEP(10);--'
```

**영향:**

- 단순 예시에서는 쿼리를 지연시켜 (10초) **Blind SQL Injection 테스트**에 활용.
    
- 더 공격적인 페이로드로 바꾸면:
    
    - 모든 레코드 조회
        
    - 특정 계정 수정/삭제
        
    - 중요 테이블 드랍, Stored Procedure 실행 등 훨씬 치명적인 공격도 가능.
        



정리하면, A05:2025 Injection은:

- 여전히 **가장 광범위하게 테스트되고, 가장 많은 CVE가 보고되는 카테고리**이고,
    
- 핵심 방어 전략은
    
    1. **데이터와 명령을 분리(파라미터 바인딩, 안전한 API)**
        
    2. **화이트리스트 기반 입력 검증**
        
    3. **최소한의 동적 쿼리 + 철저한 escaping**
        
    4. **자동화된 보안 테스트 도입**
        
- “문자열 더하기로 쿼리/명령 만들면 거의 무조건 취약하다” 정도로 기억해두면 편합니다.