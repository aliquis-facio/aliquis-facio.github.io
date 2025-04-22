---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[OS] Process"
excerpt: "Operating System: Three Easy Pieces 정리"

date: 2025-04-22
last_modified_at: 

categories: [OS]
tags: [OS, TIL]
---

# 목록
1. [프로세스(Process)란?](#1-프로세스process란)
1. [프로세스 생성 단계](#2-프로세스-생성-단계)
1. [프로세스 상태 및 전이](#3-프로세스-상태-및-전이)
1. [주요 자료구조](#4-주요-자료구조)
1. [참고](#참고)

# Process
## 1. 프로세스(Process)란?
**프로세스(process)**: 운영체제의 기본 추상화로, <mark>“실행 중인 프로그램”</mark>을 의미합니다. 프로세스는 자신의 주소 공간, CPU 레지스터 상태, I/O 상태(열린 파일 디스크립터 등)를 캡처하여 독립된 실행 환경을 제공한다

## 2. 프로세스 생성 단계
1. **코드·정적 데이터 로드**: 실행 파일을 메모리에 담는다
1. **스택 초기화**: 초기 스택 프레임(인수, 반환 주소 등)을 설정한다
1. **힙 초기화**: malloc() 호출을 대비해 힙 영역을 설정한다
1. **I/O 초기화**: UNIX 시스템의 기본 표준 입력/출력/오류 디스크립터(descriptor)를 연다
1. **실행 시작**: OS가 진입점 main()으로 점프해 사용자 코드를 실행 및 개시한다

## 3. 프로세스 상태 및 전이
* **Running**: 실제 CPU에서 명령을 수행 중
* **Ready**: 실행 준비는 되어 있으나 스케줄러 대기
* **Blocked**: I/O 요청 등으로 이벤트 완료 전까지 대기

**전이 조건**:
* Ready -> Running: 스케줄러가 선택(“Scheduled”)
* Running -> Ready: 탈스케줄(“Descheduled”)
* Running -> Blocked: I/O 시작 등
* Blocked -> Ready: I/O 완료 등

## 4. 주요 자료구조
**프로세스 리스트**: Ready 상태 큐, Running 프로세스 정보, Blocked 큐 등을 관리한다

**PCB (Process Control Block)**: 프로세스별 상태(enum proc_state), pid, 부모 포인터, 메모리 크기·시작 주소, 커널 스택 포인터, 컨텍스트 저장 공간(struct context), 트랩 프레임(struct trapframe) 등을 포함한다

# 참고
* [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)