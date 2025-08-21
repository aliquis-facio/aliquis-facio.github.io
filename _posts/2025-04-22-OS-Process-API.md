---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[OS] Process API"
excerpt: "Operating System: Three Easy Pieces 정리"

date: 2025-04-22
last_modified_at: 

categories: [OS]
tags: [OS, TIL]
---

# 목차
1. []()

# Process API
## 프로세스 생성·종료 API
* **fork()**: 부모 프로세스에는 자식 PID(>0), 자식 프로세스에는 0을 반환하며, 실패 시 –1 반환 및 errno 설정
* **exec*() 계열**: execvp(), execl(), execle() 등으로 현재 프로세스를 완전히 새로운 프로그램 이미지로 덮어씀. 열려 있는 파일 디스크립터와 PID는 그대로 유지됨
* **wait() / waitpid()**: 부모가 자식 프로세스의 종료를 대기하며, 반환값으로 종료된 자식의 PID를 받고, WIFEXITED, WEXITSTATUS 매크로로 종료 코드를 해석

## 시그널(signal) API
* **kill(pid, sig)**: 특정 프로세스나 프로세스 그룹에 시그널 전송 (예: SIGINT, SIGTSTP). 일반 사용자는 동일 UID 프로세스에만, root는 모든 프로세스에 시그널 송신 가능
* **signal(sig, handler)**: 사용자 정의 시그널 핸들러 등록. 비동기 이벤트(타이머, I/O 완료 등)를 프로세스에 전달

## 권한과 격리
UID 기반 권한 검사로, 사용자는 자신의 프로세스만 제어  
<mark>슈퍼유저(root)</mark>만이 시스템 전체의 프로세스 관리 및 시그널 송신 권한을 가짐

## 유용한 시스템 모니터링 도구
* **ps / top**: 프로세스 상태·자원 사용량 실시간 모니터링
* **killall**: 프로세스 이름 기준 일괄 시그널 전송

macOS 등에서 MenuMeters 같은 GUI 유틸리티 활용 가능

## 요약
**PID (Process ID)**: 각 프로세스를 식별하는 고유 번호

**프로세스 생성 API**: fork(), exec(), wait()
* **fork()**: 부모 프로세스의 거의 완전한 복사본인 자식 프로세스를 생성
* **exec()**: 현재 프로세스 이미지를 새로운 프로그램으로 덮어쓰기
* **wait()**: 부모가 자식의 종료를 대기

**프로세스 제어**: 시그널(kill(), signal())을 이용해 중단, 일시 중단, 종료 가능
* **시그널**: 프로세스 제어(중단·재개·종료 등)를 위해 OS가 보내는 소프트웨어 인터럽트

**사용자 격리**: 일반 사용자는 자신의 프로세스만 제어하고, root는 모든 프로세스를 관리
* **superuser(root)**: 모든 프로세스와 시스템 자원에 대한 무제한 권한 사용자
