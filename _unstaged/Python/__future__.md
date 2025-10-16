---
tags:
  - python
---
# `__future__`

## 1. `from __future__ import annotations`

### 1.1. 개요
**함수나 클래스가 정의될 때 타입 힌트를 평가하지 않고 문자열 형태로 저장**한다.
클래스를 선언하기 전에 참조할 수 있고, 불필요한 의존성 문제를 해결하며, 성능을 향상시킬 수 있다.
Python 3.11부터는 기본적으로 활성화되어 있지만, 이전 버전(3.7 ~ 3.10)에서는 직접 사용해야 한다.

### 1.2. 필요성
#### 1.2.1. Forward Reference 간소화
두 클래스가 서로 참조해야 할 때, 타입 이름을 문자열로 감싸야 'NameError'가 발생 X
`from __future__ import annotations`를 사용하면 문자열로 감쌀 필요 X

#### 1.2.2. 순환 참조 문제 해결
여러 모듈이 서로 참조하는 상황에서 Circular Import 문제가 발생할 수 있다.
`from __future__ import annotations`를 사용하면 타입 힌트 평가가 나중으로 지연되기 때문에 문제 해결 O

# 참고

* [__future__ 문 | from __future__ import annotations](https://iambeginnerdeveloper.tistory.com/290)
* [Python의 from __future__ import annotations 기능](https://memoryhub.tistory.com/entry/from-future-import-annotations-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)