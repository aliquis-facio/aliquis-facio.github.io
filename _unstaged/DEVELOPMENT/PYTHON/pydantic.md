---
tags:
  - python
---
# pydantic

python에서 **데이터 유효성 검사 및 설정 관리를 위한 라이브러리**이다.
주로 FastAPI와 같은 웹 프레임워크와 함께 사용되며, 데이터를 구조화하고 검증하는 데 유용하다.
코드의 가독성과 유지 보수성을 향상시킨다.

## 주요 기능

1. **유효성 검사 및 변환**: 필드에 대해 타입을 지정하면, 입력 데이터가 자동으로 그 타입으로 변환되며, 유효성 검사가 수행된다.
2. **자동 완성 및 type hinting 지원**: IDE의 자동 완성과 type hinting을 통해 개발 생산성을 높인다.
3. **데이터 직렬화 및 역직렬화**: 모델 인스턴스를 json으로 직렬화하거나 json으로부터 역직렬화할 수 있다.
4. **데이터 검증 오류 관리**: 잘못된 데이터를 입력하면, pydantic이 자동으로 유효성 검사 오류를 생성한다.
## 1. `BaseModel` Class

데이터 모델을 정의하는 데 사용한다.

## 2. `Field` Class

데이터 모델의 filed를 정의하는 데 사용된다.
이 클래스를 사용하면 filed에 대한 유효성 검사 규칙을 정의할 수 있으며, 데이터 유효성 검사를 수행하거나 filed의 기본값을 설정할 수 있다.

### 예시
``` python
from pydantic import BaseModel, Field

class User(BaseModel): # pydantic의 BaseModel 상속
    id: int
    # 각 field는 해당하는 데이터 타입으로 정의됨.
    # Field 클래스를 사용해 추가적인 유효성 검사 규칙 설정
    username: str = Field(..., min_length=4, max_length=20) # 최소 길이와 최대 길이 설정
    email: str = Field(..., regex=r"^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$") # 정규 표현식 -> 이메일 형식의 유효성 검사
    age: int = Field(..., ge=0, le=130) # 최소값과 최대값을 설정해 유효한 나이 범위 지정
```
# 참고

* [[Python] Pydantic 의  BaseModel 클래스 사용](https://mobicon.tistory.com/627)
* [Fields](https://docs.pydantic.dev/latest/concepts/fields/)
* [Pydantic - Field 클래스의 용도와 사용법](https://light-tree.tistory.com/301)