---
layout: post
comments: true
sitemap: true

title: "[PYTHON] __future__와 annotations 지연 평가"
excerpt: "Python의 future 모듈과 from future import annotations의 동작 원리, Forward Reference 및 순환 import 문제 해결 방법 정리"

date: 2026-07-22
last_modified_at: 2026-07-22

categories:
  - PYTHON
tags:
  - PYTHON
  - FUTURE
  - ANNOTATIONS
  - TYPE-HINT
  - TYPE-CHECKING
---

<!-- markdownlint-disable MD010 MD025 MD060 -->

# `__future__`

---

## 목차

1. [`__future__` 개요](#1-개요)
2. [`from __future__ import annotations`](#2-from-__future__-import-annotations)
	  1. [개요](#21-개요)
	  2. [Forward Reference](#22-forward-reference)
	  3. [상호 참조 클래스](#23-상호-참조-클래스)
	  4. [순환 import 완화](#24-순환-import-완화)
3. [타입 어노테이션 확인](#3-타입-어노테이션-확인)
	  1. [`typing.get_type_hints()`](#31-typingget_type_hints)
4. [장점](#4-장점)
    1. [타입 표현 간소화](#41-타입-표현-간소화)
    2. [타입 전용 import 분리](#42-타입-전용-import-분리)
    3. [순환 import 위험 감소](#43-순환-import-위험-감소)
    4. [코드 가독성 향상](#44-코드-가독성-향상)
5. [주의사항](#5-주의사항)
    1. [모든 순환 import를 해결하지는 않는다](#51-모든-순환-import를-해결하지는-않는다)
    2. [런타임 어노테이션 검사](#52-런타임-어노테이션-검사)
    3. [Python 버전별 차이](#53-python-버전별-차이)
6. [사용 권장 사례](#6-사용-권장-사례)
7. [요약](#7-요약)
8. [참고](#참고)

---

## 1. 개요

`__future__` 모듈: 향후 Python 버전에 도입될 기능을 이전 버전에서 미리 사용할 수 있도록 제공한다.

다음과 같이 파일 상단에서 `from __future__ import ...` 형태로 선언한다.

```python
from __future__ import annotations
```

`__future__` 문은 일반적인 모듈 가져오기와 달리 Python 컴파일러가 직접 처리한다.

> `from __future__ import` 문은 모듈의 최상단에 작성해야 한다.
> 모듈 독스트링이 있다면 독스트링 바로 다음에 작성한다.

## 2. `from __future__ import annotations`

### 2.1. 개요

```python
from __future__ import annotations
```

`annotations` 기능을 활성화하면 함수, 클래스 및 변수에 작성된 타입 어노테이션을 정의 시점에 즉시 평가하지 않는다.

Python 3.7부터 사용할 수 있으며, Python 3.7~3.13에서는 필요한 모듈에 직접 선언해야 한다.

이 기능을 사용하면 다음과 같은 장점이 있다.

* 아직 정의되지 않은 클래스를 타입으로 참조할 수 있다.
* Forward Reference를 문자열로 직접 감싸지 않아도 된다.
* 타입 검사만을 위한 불필요한 런타임 의존성을 줄일 수 있다.
* 일부 순환 import 문제를 완화할 수 있다.

### 2.2. Forward Reference

**Forward Reference** 아직 정의되지 않은 클래스나 타입을 타입 어노테이션에서 먼저 참조하는 것을 의미한다.

다음 코드에서는 `Node` 클래스가 완전히 생성되기 전에 `Node` 타입을 참조한다.

#### `annotations`를 사용하지 않는 경우

```python
class Node:
    def __init__(self, next_node: "Node | None" = None):
        self.next_node = next_node
```

아직 `Node` 클래스가 정의되지 않았기 때문에 타입 이름을 문자열로 작성해야 한다.

#### `annotations`를 사용하는 경우

```python
from __future__ import annotations


class Node:
    def __init__(self, next_node: Node | None = None):
        self.next_node = next_node
```

타입 어노테이션의 평가가 지연되므로 `Node`를 문자열로 감쌀 필요가 없다.

### 2.3. 상호 참조 클래스

두 클래스가 서로를 타입으로 참조해야 하는 경우에도 유용하다.

```python
from __future__ import annotations


class User:
    def __init__(self, group: Group):
        self.group = group


class Group:
    def __init__(self, members: list[User]):
        self.members = members
```

`User` 클래스가 정의될 때는 아직 `Group` 클래스가 존재하지 않는다.

하지만 `from __future__ import annotations`를 사용하면 타입 어노테이션이 즉시 평가되지 않으므로 오류 없이 작성할 수 있다.

### 2.4. 순환 import 완화

타입 힌트를 작성하기 위해 두 모듈이 서로를 import하면 순환 import가 발생할 수 있다.

예를 들어 다음과 같은 구조가 있다고 가정한다.

```text
project/
├── user.py
└── group.py
```

`user.py`가 `Group`을 가져오고 `group.py`가 다시 `User`를 가져오면 순환 import가 발생할 수 있다.

이 경우 `TYPE_CHECKING`과 함께 사용할 수 있다.

#### `user.py`

```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from group import Group


class User:
    def __init__(self, group: Group):
        self.group = group
```

#### `group.py`

```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from user import User


class Group:
    def __init__(self, members: list[User]):
        self.members = members
```

`TYPE_CHECKING`은 정적 타입 검사기가 코드를 분석할 때만 `True`로 취급된다.

따라서 다음 import는 정적 타입 검사에서는 사용되지만 실제 프로그램 실행 중에는 수행되지 않는다.

```python
if TYPE_CHECKING:
    from group import Group
```

이를 통해 런타임 순환 import를 피하면서 타입 검사 기능은 유지할 수 있다.

> `from __future__ import annotations`만으로 모든 순환 import 문제가 해결되는 것은 아니다.
> 타입 어노테이션과 관련된 import 시점을 지연하여 일부 문제를 완화하는 기능이다.

## 3. 타입 어노테이션 확인

`from __future__ import annotations`를 사용한 환경에서는 `__annotations__`에 저장된 값을 직접 사용하는 것보다 표준 라이브러리 함수를 사용하는 것이 안전하다.

### 3.1. `typing.get_type_hints()`

```python
from __future__ import annotations

from typing import get_type_hints


class User:
    pass


def find_user() -> User:
    return User()


print(find_user.__annotations__)
print(get_type_hints(find_user))
```

실행 환경에 따라 `__annotations__`에는 평가되지 않은 표현식이 저장될 수 있다.

```python
{
    "return": "User"
}
```

`get_type_hints()`는 타입 어노테이션을 실제 타입 객체로 해석한다.

```python
{
    "return": <class "__main__.User">
}
```

## 4. 장점

### 4.1. 타입 표현 간소화

아직 정의되지 않은 타입을 문자열로 감쌀 필요가 없다.

```python
# 사용 전
def clone(node: "Node") -> "Node":
    ...

# 사용 후
def clone(node: Node) -> Node:
    ...
```

### 4.2. 타입 전용 import 분리

`TYPE_CHECKING`과 함께 사용하면 타입 검사만을 위한 모듈을 런타임에 import하지 않을 수 있다.

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from package.service import Service
```

### 4.3. 순환 import 위험 감소

타입 어노테이션을 위한 import를 실행 시점에서 제거하여 모듈 간 순환 의존성을 완화할 수 있다.

### 4.4. 코드 가독성 향상

문자열 형태의 타입 표현을 줄이고 일반적인 타입 문법으로 일관성 있게 작성할 수 있다.

## 5. 주의사항

### 5.1. 모든 순환 import를 해결하지는 않는다

다음과 같이 import한 객체를 실제 실행 코드에서 사용하면 여전히 런타임 import가 필요하다.

```python
from service import Service


def create_service() -> Service:
    return Service()
```

`Service`를 함수 본문에서 생성하고 있으므로 단순히 타입 평가를 지연하는 것만으로 import를 제거할 수 없다.

### 5.2. 런타임 어노테이션 검사

일부 라이브러리는 `__annotations__`를 직접 읽어 타입 정보를 처리한다.

이 경우 어노테이션이 실제 타입 객체가 아니라 평가되지 않은 표현식으로 제공될 수 있으므로 주의해야 한다.

가능하면 다음 함수를 사용한다.

```python
from typing import get_type_hints

hints = get_type_hints(target)
```

Python 3.10 이상에서는 `inspect.get_annotations()`도 사용할 수 있다.

### 5.3. Python 버전별 차이

| Python 버전       | 동작                                                                    |
| --------------- | --------------------------------------------------------------------- |
| Python 3.6 이하   | `from __future__ import annotations` 사용 불가                            |
| Python 3.7~3.13 | 명시적으로 선언하면 PEP 563 방식의 어노테이션 지연 적용                                    |
| Python 3.14 이상  | PEP 649 기반의 지연 평가가 기본 적용                                              |
| Python 3.14 이상  | 기존 `from __future__ import annotations`와 기본 동작의 내부 처리 방식에 차이가 있을 수 있음 |

`from __future__ import annotations`가 Python 3.10 또는 3.11부터 기본 기능이 될 예정이었으나 해당 계획은 최종적으로 취소되었다.

따라서 Python 3.11이나 Python 3.12에서도 이 기능이 필요하다면 직접 선언해야 한다.

## 6. 사용 권장 사례

다음과 같은 상황에서 사용하는 것이 유용하다.

* 클래스가 자기 자신을 타입으로 참조하는 경우
* 여러 클래스가 서로를 타입으로 참조하는 경우
* 타입 힌트 때문에 순환 import가 발생하는 경우
* `TYPE_CHECKING`을 이용해 타입 전용 import를 분리하는 경우
* Python 3.7~3.13을 지원하면서 최신 타입 표현을 사용하려는 경우

일반적으로 Python 3.7~3.13을 지원하는 타입 힌트 중심 프로젝트에서는 파일 상단에 다음 문장을 사용하는 방법을 고려할 수 있다.

```python
from __future__ import annotations
```

## 7. 요약

`from __future__ import annotations`는 타입 어노테이션의 평가 시점을 지연하는 기능이다.

주요 효과는 다음과 같다.

1. 아직 정의되지 않은 타입을 직접 참조할 수 있다.
2. Forward Reference를 문자열로 감쌀 필요가 없다.
3. `TYPE_CHECKING`과 함께 타입 전용 import를 분리할 수 있다.
4. 타입 힌트로 발생하는 일부 순환 import 문제를 완화할 수 있다.
5. 런타임에서 타입 정보를 사용할 때는 `typing.get_type_hints()` 등을 이용하는 것이 안전하다.

---

## 참고

* [Python Docs: `__future__`](https://docs.python.org/3/library/__future__.html)
* [Python Docs: Annotations Best Practices](https://docs.python.org/3/howto/annotations.html)
* [PEP: PEP 563 — Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)
* [PEP: PEP 649 — Deferred Evaluation of Annotations](https://peps.python.org/pep-0649/)
* [PEP: PEP 749 — Implementing PEP 649](https://peps.python.org/pep-0749/)
* [Tistory: Python의 `from __future__ import annotations` 기능](https://memoryhub.tistory.com/entry/from-future-import-annotations-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
