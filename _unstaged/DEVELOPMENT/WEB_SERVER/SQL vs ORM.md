좋아.
이번에는 **SQL과 ORM의 차이**를 정확하게 설명해볼게.

---

# 1. SQL이란

SQL은 **Structured Query Language**의 약자다.
데이터베이스와 대화하기 위한 언어라고 보면 된다.

즉, 데이터베이스에 대해 이런 작업을 직접 명령하는 언어다.

* 데이터 조회
* 데이터 삽입
* 데이터 수정
* 데이터 삭제
* 테이블 생성
* 테이블 구조 변경
* 권한 관리

예를 들면:

```sql
SELECT * FROM question;

INSERT INTO question (subject, content, create_date)
VALUES ('ORM이 뭐야?', '설명해줘', NOW());

UPDATE question
SET subject = 'SQL과 ORM 차이'
WHERE id = 1;

DELETE FROM question
WHERE id = 1;
```

이처럼 SQL은 **DB에 직접 내리는 명령어**다.

---

# 2. ORM이란

ORM은 **Object Relational Mapping**의 약자다.
객체지향 프로그래밍 언어의 객체와 관계형 데이터베이스의 테이블을 연결해주는 기술이다.

쉽게 말하면:

* DB 테이블을 **클래스**
* 테이블의 한 행(row)을 **객체**
* 컬럼(column)을 **객체 속성**

처럼 다룰 수 있게 해준다.

예를 들어 Django에서는 이런 모델을 만든다.

```python
class Question(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    create_date = models.DateTimeField()
```

이 모델은 DB 관점에서는 대략 이런 테이블과 대응된다.

```sql
CREATE TABLE question (
    id INTEGER PRIMARY KEY,
    subject VARCHAR(200),
    content TEXT,
    create_date DATETIME
);
```

즉, ORM은 개발자가 SQL을 직접 다 쓰지 않아도
**파이썬 코드로 DB를 다룰 수 있게 해주는 계층**이다.

---

# 3. SQL과 ORM의 핵심 차이

가장 중요한 차이는 이거다.

* **SQL**: 사람이 직접 데이터베이스 명령문을 작성
* **ORM**: 프로그래밍 언어 코드로 DB 작업을 표현하고, 내부적으로 SQL이 생성됨

즉, ORM을 쓰면 SQL이 사라지는 게 아니라,
**ORM이 SQL을 대신 생성해주는 것**이다.

---

# 4. 같은 작업을 SQL과 ORM으로 비교

## 4-1. 데이터 조회

### SQL

```sql
SELECT * FROM question;
```

### Django ORM

```python
Question.objects.all()
```

---

## 4-2. 조건 조회

### SQL

```sql
SELECT * FROM question WHERE id = 1;
```

### Django ORM

```python
Question.objects.get(id=1)
```

또는

```python
Question.objects.filter(id=1)
```

---

## 4-3. 데이터 삽입

### SQL

```sql
INSERT INTO question (subject, content, create_date)
VALUES ('제목', '내용', NOW());
```

### Django ORM

```python
from django.utils import timezone

q = Question(
    subject='제목',
    content='내용',
    create_date=timezone.now()
)
q.save()
```

또는

```python
Question.objects.create(
    subject='제목',
    content='내용',
    create_date=timezone.now()
)
```

---

## 4-4. 데이터 수정

### SQL

```sql
UPDATE question
SET subject = '수정된 제목'
WHERE id = 1;
```

### Django ORM

```python
q = Question.objects.get(id=1)
q.subject = '수정된 제목'
q.save()
```

---

## 4-5. 데이터 삭제

### SQL

```sql
DELETE FROM question
WHERE id = 1;
```

### Django ORM

```python
q = Question.objects.get(id=1)
q.delete()
```

---

# 5. ORM을 왜 쓰는가

ORM의 가장 큰 장점은 **개발 생산성**이다.

## 5-1. 객체지향적으로 개발 가능

파이썬, 자바 같은 언어에서는 객체 중심으로 개발한다.
ORM을 쓰면 DB도 객체처럼 다룰 수 있어서 코드 흐름이 자연스럽다.

예를 들어:

```python
question.subject
question.content
question.create_date
```

이런 식으로 객체 속성처럼 접근할 수 있다.

---

## 5-2. SQL을 일일이 다 쓰지 않아도 됨

CRUD 같은 반복 작업은 ORM으로 매우 빠르게 작성할 수 있다.

특히 이런 상황에서 편하다.

* 게시판
* 회원 관리
* 댓글
* 쇼핑몰 기본 CRUD
* 관리자 페이지

---

## 5-3. 데이터베이스 독립성이 좋아짐

ORM은 DBMS 차이를 어느 정도 추상화한다.

예를 들어 SQLite를 쓰다가 PostgreSQL, MySQL로 바꿔도
애플리케이션 코드 전체를 SQL 문법 기준으로 대규모 수정하지 않아도 되는 경우가 많다.

---

## 5-4. 유지보수가 쉬움

모델 구조가 코드에 드러나기 때문에
테이블 구조와 비즈니스 로직을 함께 이해하기 쉽다.

장고에서는 모델 클래스를 보면
어떤 데이터가 저장되는지 바로 파악 가능하다.

---

# 6. ORM의 한계

ORM이 편리하지만 만능은 아니다.

## 6-1. 복잡한 쿼리는 오히려 불편할 수 있음

단순 조회는 쉬운데, 아주 복잡한 집계나 튜닝이 필요한 쿼리는
직접 SQL이 더 명확할 수 있다.

예를 들면:

* 복잡한 JOIN
* 서브쿼리
* 윈도우 함수
* 성능 최적화가 중요한 대용량 조회
* DBMS 전용 기능 활용

이런 경우 ORM 표현이 지나치게 복잡해질 수 있다.

---

## 6-2. 실제 실행 SQL을 모르면 성능 문제가 생길 수 있음

ORM은 내부적으로 SQL을 만들어 실행한다.
그래서 개발자가 “코드 한 줄이니까 가볍겠지”라고 생각하면 위험하다.

대표적인 문제가:

* N+1 문제
* 불필요한 JOIN
* 과도한 쿼리 발생
* lazy loading으로 인한 성능 저하

즉, ORM을 써도 **결국 SQL 이해는 필요하다**.

---

## 6-3. DB를 완전히 추상화하지는 못함

ORM이 있어도 관계형 DB 개념을 모르면 제대로 쓰기 어렵다.

여전히 알아야 하는 것들:

* PK / FK
* JOIN
* INDEX
* 정규화
* 트랜잭션
* 락
* 실행 계획

즉, ORM은 SQL을 없애는 기술이 아니라
**SQL을 더 편하게 다루도록 돕는 기술**이다.

---

# 7. SQL의 장점

이번에는 반대로 SQL의 장점을 보자.

## 7-1. 직접적이고 명확하다

DB에 어떤 작업을 하는지 그대로 보인다.

```sql
SELECT subject, create_date
FROM question
WHERE create_date >= '2026-01-01'
ORDER BY create_date DESC;
```

이건 누가 봐도 DB에 무슨 요청을 하는지 واضح하게 드러난다.

---

## 7-2. 복잡한 쿼리에 강하다

집계, JOIN, 분석성 쿼리, 튜닝 쿼리는 SQL이 훨씬 강력하다.

특히 실무에서 리포트성 조회나 통계 API는
ORM보다 SQL이 더 적합한 경우가 많다.

---

## 7-3. 성능 최적화에 유리하다

직접 SQL을 제어하면:

* 필요한 컬럼만 조회
* JOIN 방식 조절
* 인덱스 활용 고려
* DB 전용 기능 사용

같은 최적화를 더 세밀하게 할 수 있다.

---

# 8. SQL의 단점

하지만 SQL만 쓰는 것도 단점이 있다.

## 8-1. 반복 코드가 많아질 수 있다

단순 CRUD도 매번 SQL을 작성해야 한다.

## 8-2. 코드와 DB 구조가 분리되기 쉽다

비즈니스 로직은 애플리케이션 코드에 있고,
데이터 접근 로직은 SQL 문자열로 흩어질 수 있다.

## 8-3. DBMS 의존성이 커질 수 있다

MySQL 문법, PostgreSQL 문법, Oracle 문법 차이 때문에
이식성이 떨어질 수 있다.

---

# 9. 한 문장으로 비교

* **SQL**: 데이터베이스를 직접 제어하는 언어
* **ORM**: 객체 코드로 DB를 다루게 해주고, 내부적으로 SQL을 생성하는 기술

---

# 10. 실무에서는 무엇을 더 많이 쓰는가

실무에서는 보통 **둘 다 쓴다**.

이게 가장 정확한 답이다.

## ORM을 주로 쓰는 영역

* 일반 CRUD
* 관리자 기능
* 게시판
* 회원 시스템
* 빠른 개발이 중요한 서비스 로직

## SQL을 직접 쓰는 영역

* 복잡한 통계 쿼리
* 대용량 데이터 조회
* 성능 최적화 구간
* 배치 처리
* DB 고유 기능 활용

즉,
**기본은 ORM으로 가고, 필요한 곳만 SQL을 직접 쓴다**가 흔한 방식이다.

---

# 11. Django에서 ORM은 어떻게 보나

Django는 ORM 중심 프레임워크다.
`models.py`에 모델을 정의하고, 이를 기반으로 테이블과 쿼리를 다룬다.

예:

```python
Question.objects.all()
Question.objects.filter(subject__contains='장고')
Question.objects.get(id=1)
```

그리고 모델 간 관계도 자연스럽게 다룬다.

```python
answer.question
question.answer_set.all()
```

이런 점은 장고 학습 자료에서도 핵심으로 다뤄진다. 