---
layout: post
comments: true
sitemap:

title: "[OBSIDIAN] Clear Unused Images"
excerpt: "Community Plugins - Clear Unused Images"

date: 2026-04-14
last_modified_at: 2026-04-15

categories: [OBSIDIAN]
tags: [OBSIDIAN, COMMUNITY PLUGINS]
---

<!-- markdownlint-disable MD004 MD010 MD025 MD029 -->

# [OBSIDIAN] Clear Unused Images

노트에서 더 이상 링크되지 않는 이미지 파일을 찾아 삭제하거나 휴지통으로 보내는 정리 플러그인

## 목차

1. [핵심 기능](#1-핵심-기능)
2. [설치 방법](#2-설치-방법)
      1. [Community Plugins 검색](#21-community-plugins-검색)
      2. [설치](#22-설치)
      3. [Enable 활성화](#23-enable-활성화)
      4. [설정 화면 진입](#24-설정-화면-진입)
3. [설정](#3-설정)
      1. [Deleted Image Destination](#31-deleted-image-destination)
      2. [Excluded Folder Full Paths](#32-excluded-folder-full-paths)
      3. [Exclude Subfolders](#33-exclude-subfolders)
      4. [Delete Logs](#34-delete-logs)
      5. [Ribbon Icon](#35-ribbon-icon)
4. [사용 예시](#4-사용-예시)
      1. [스크린샷 정리용](#41-스크린샷-정리용)
      2. [특정 폴더는 보호하고 싶을 때](#42-특정-폴더는-보호하고-싶을-때)
      3. [리본 아이콘으로 빠르게 실행](#43-리본-아이콘으로-빠르게-실행)
5. [추천 활용법](#5-추천-활용법)
      1. [첨부 폴더가 분리돼 있을 때 더 유용함](#51-첨부-폴더가-분리돼-있을-때-더-유용함)
      2. [대규모 삭제 전에 백업](#52-대규모-삭제-전에-백업)
      3. [주기적 정리 루틴 만들기](#53-주기적-정리-루틴-만들기)
6. [주의사항](#6-주의사항)
      1. [처음부터 `Permanently Delete`를 선택함](#61-처음부터-permanently-delete를-선택함)
      2. [공용 이미지 폴더를 제외하지 않음](#62-공용-이미지-폴더를-제외하지-않음)
      3. [“사용 중” 기준을 잘못 이해함](#63-사용-중-기준을-잘못-이해함)
      4. [실행 전에 로그 옵션을 안 켬](#64-실행-전에-로그-옵션을-안-켬)
7. [참고](#참고)

---

## 1. 핵심 기능

1. **마크다운 문서 전체를 검사해서 사용 중인 이미지 링크 수집**
2. **볼트 내 이미지 파일과 비교해서 미사용 이미지 탐지**
3. **삭제 대상 파일의 이동 방식 선택**
   * `Move to Obsidian Trash`
   * `Move to System Trash`
   * `Permanently Delete`
1. **특정 폴더 제외**
   * `Excluded Folder Full Paths`
   * `Exclude Subfolders`
1. **명령어 팔레트 또는 리본 아이콘으로 실행**
   * `Clear Unused Images` 명령어
   * 리본 아이콘 실행 지원

## 2. 설치 방법

### 2.1. Community Plugins 검색

메뉴 경로: **Settings → Community plugins → Browse**

1. **Community plugins** 화면에서 **Browse** 클릭
	![500x265](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-02-44.png)
2. 검색창에 `Clear Unused Images` 입력
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-07.png)
3. 검색 결과에서 해당 플러그인 선택

### 2.2. 설치

1. 플러그인 상세 화면에서 **Install** 클릭
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-13.png)
2. 설치가 끝날 때까지 기다림

### 2.3. Enable 활성화

1. 설치가 끝나면 **Enable** 클릭
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-19.png)
2. 활성화되면 Community Plugins 목록에서 켜진 상태로 표시됨

### 2.4. 설정 화면 진입

메뉴 경로: **Settings → Community plugins → Clear Unused Images**

![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-33.png)

## 3. 설정

![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-04-21.png)

### 3.1. `Deleted Image Destination`

삭제된 이미지를 어디로 보낼지 정하는 옵션

선택지:

* `Move to Obsidian Trash`: Obsidian 볼트 내부 `.trash` 폴더로 이동
* `Move to System Trash`: 운영체제 휴지통으로 이동
* `Permanently Delete`: 복구 없이 바로 삭제

### 3.2. `Excluded Folder Full Paths`

검사에서 제외할 폴더 전체 경로를 적는 설정

**쉼표로 여러 폴더를 구분**할 수 있고, **Vault 기준 전체 경로**를 넣어야 한다.

예시:

* `Templates/`
* `Assets/Keep/`
* `Projects/Archive/Images/`

### 3.3. `Exclude Subfolders`

위에서 제외한 폴더의 **하위 폴더까지 함께 제외**할지 정하는 옵션

### 3.4. `Delete Logs`

삭제 완료 후 어떤 이미지가 지워졌는지 **팝업 로그(modal)** 를 볼 지 정하는 옵션

### 3.5. `Ribbon Icon`

리본 아이콘을 활성화해서 왼쪽 리본에서 바로 실행할 수 있게 하는 옵션

## 4. 사용 예시

### 4.1. 스크린샷 정리용

상황:

* 강의 정리 노트를 쓰다가 이미지를 여러 번 교체했다.
* 노트에서는 지웠는데 attachments 폴더에는 예전 캡처 이미지가 계속 남아 있다.

실행 순서:

1. **Settings → Community plugins → Clear Unused Images**
2. `Deleted Image Destination`를 **Move to Obsidian Trash**로 설정
3. `Delete Logs`를 **On**
4. 설정 닫기
5. **Command Palette** 열기

   * `Ctrl + P` 또는 `Cmd + P`
6. `Clear Unused Images` 검색
7. 명령 실행
8. 삭제 로그 확인

결과:

* 노트에서 참조되지 않는 이미지가 정리됨
* 실수했더라도 `.trash`나 시스템 휴지통에서 복구 가능할 수 있음

### 4.2. 특정 폴더는 보호하고 싶을 때

상황:

* `Assets/Brand/` 폴더에는 템플릿용 공용 이미지가 들어 있음
* 이 이미지는 아직 노트에서 직접 링크되지 않아도 보존하고 싶음

실행 순서:

1. **Settings → Community plugins → Clear Unused Images**
2. `Excluded Folder Full Paths`에 `Assets/Brand/` 입력
3. 하위 폴더도 모두 보호하려면 `Exclude Subfolders` 활성화
4. 이후 `Clear Unused Images` 실행

결과:

* `Assets/Brand/` 폴더의 이미지는 정리 대상에서 빠짐

### 4.3. 리본 아이콘으로 빠르게 실행

실행 순서:

1. **Settings → Community plugins → Clear Unused Images**
2. `Ribbon Icon` 활성화
3. 왼쪽 사이드 리본에서 해당 아이콘 클릭
4. 정리 실행

## 5. 추천 활용법

### 5.1. 첨부 폴더가 분리돼 있을 때 더 유용함

예를 들어 모든 이미지를 `Attachments/` 폴더에 저장하는 습관이 있다면, 시간이 지나면서 찌꺼기 이미지가 많이 생긴다. 이 플러그인은 그런 환경에서 특히 효과적이다.

### 5.2. 대규모 삭제 전에 백업

파일 삭제형 플러그인이므로,

* 중요한 볼트는 미리 백업
* 처음 1~2회는 `Move to Obsidian Trash`로 시험
* 로그를 보고 패턴 확인
  이 흐름이 안전하다.

### 5.3. 주기적 정리 루틴 만들기

예:

* 주 1회 정리
* 큰 프로젝트 문서 정리 직후 실행
* 이미지 대량 붙여넣기 작업 후 실행

## 6. 주의사항

### 6.1. 처음부터 `Permanently Delete`를 선택함

이건 가장 위험하다. README도 이 옵션은 되돌릴 수 없다고 분명히 안내한다. 초보자는 처음엔 쓰지 않는 편이 좋다.

### 6.2. 공용 이미지 폴더를 제외하지 않음

노트에 직접 링크되지 않지만,

* 템플릿에서 나중에 쓸 이미지
* 디자인 에셋
* 프로젝트 리소스
  같은 파일이 삭제될 수 있다.

### 6.3. “사용 중” 기준을 잘못 이해함

이 플러그인은 README 기준으로 **마크다운 문서 안의 이미지 링크를 기준으로 비교**한다. 즉, 네가 머릿속으로 “나중에 쓸 예정”인 이미지는 사용 중으로 판단되지 않는다.

### 6.4. 실행 전에 로그 옵션을 안 켬

처음에는 `Delete Logs`를 켜놓는 편이 훨씬 안전하다. 삭제 결과를 확인할 수 있기 때문이다.

1. 이 플러그인은 **이미지 파일 정리용**이다. README 기준 스캔 대상 포맷은 `jpg, jpeg, png, gif, svg, bmp, webp`다. 다른 파일 형식까지 자동 정리하는 용도는 아니다.

2. 실행 전에 반드시 삭제 목적지를 확인해라.

   * `Move to Obsidian Trash`
   * `Move to System Trash`
   * `Permanently Delete`

1. “나중에 쓸 이미지 저장소”가 있다면 반드시 제외 폴더를 설정해라. 그렇지 않으면 미사용으로 간주될 수 있다.

2. 처음 사용할 때는 작은 테스트 볼트나 백업본에서 먼저 실행해보는 게 좋다.

---

## 참고

- [GitHub: Clear Unused Images READMD.md](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/https://github.com/ozntel/oz-clear-unused-images-obsidian/blob/master/README.md)
