---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GIT] Commit 메시지 규칙"
excerpt: ""

date: 2025-11-01
last_modified_at: 

categories: [GIT]
tags: [GIT]
---

# 목차

1. [7가지 규칙](#1-7가지-규칙)
2. [커밋 메시지 구조](#2-커밋-메시지-구조)
    1. [Type](#21-type)
    2. [Footer](#22-footer)

---

# Git Commit Message Rules
## 1. 7가지 규칙

1. 제목과 본문을 **빈 행으로 구분**한다.
2. 제목은 **50글자** 이내로 제한한다.
3. 제목의 **첫 글자는 대문자**로 작성한다.
4. 제목 끝에는 **마침표를 넣지 않는다**.
5. 제목은 **명령문**으로 사용하며 **과거형을 사용하지 않는다**.
6. 본문의 **각 행은 72글자 내**로 제한한다.
7. 어떻게 보다는 **무엇과 왜를 설명**한다.

## 2. 커밋 메시지 구조

```text
// Header, Body, Footer는 빈 행으로 구분한다.
타입: 주제(제목) // Header(헤더)

본문 // Body(바디)

바닥글 // Footer
```

- **Header**: **타입**(해당 커밋의 성격), **필수**
- **Body**: **상세 내용**, **생략 가능**
- **Footer**: **참조 정보 추가**, **생략 가능**
	- Resolves: #issueNo

### 2.1. Type

| 타입 이름    | 내용                                    |
| -------- | ------------------------------------- |
| feat     | 새로운 기능 추가                             |
| fix      | 버그 수정                                 |
| build    | 빌드 관련 파일 수정 / 모듈 설치 또는 삭제             |
| chore    | 빌드 업무 수정, 패키지 매니지 수정 (gitignore 수정 등) |
| ci       | ci 설정 수정                              |
| docs     | 문서 수정                                 |
| style    | 코드 스타일, 포맷 등 기능 수정 X                  |
| refactor | 코드 리팩토링                               |
| test     | 테스트 코드 수정                             |
| perf     | 성능 개선                                 |
| rename   | 파일/폴더명 수정                             |
| remove   | 파일 삭제                                 |
| design   | 사용자 UI 디자인 변경 (CSS 등)                 |

### 2.2. Footer

| 사용 시점 | 사용 키워드                                |
| ----- | ------------------------------------- |
| 해결    | Closes(종료), Fixes(수정), Resolves(해결)   |
| 참고    | Ref(참고), Related to(관련), See also(참고) |

---

# 참고

* [Velog: Git 커밋 메시지 규칙](https://velog.io/@chojs28/Git-%EC%BB%A4%EB%B0%8B-%EB%A9%94%EC%8B%9C%EC%A7%80-%EA%B7%9C%EC%B9%99)
* [Tistory: 좋은 commit message 작성법](https://jane-aeiou.tistory.com/93)
* [[Git] 깃 커밋 메시지 작성법(git commit message) - 1](https://richone.tistory.com/26)
* [[Git] 깃 커밋 메시지 작성법(git commit message) - 2](https://richone.tistory.com/27)