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

노트에서 더 이상 참조되지 않는 이미지 파일을 찾아 정리할 수 있게 도와주는 플러그인이다.  
사용하지 않는 이미지를 삭제하거나 휴지통으로 보내서 볼트를 깔끔하게 관리할 때 유용하다.

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
4. [추천 활용법](#4-추천-활용법)
   1. [첨부 폴더가 분리돼 있을 때 더 유용함](#41-첨부-폴더가-분리돼-있을-때-더-유용함)
   2. [대규모 삭제 전에 백업](#42-대규모-삭제-전에-백업)
   3. [주기적 정리 루틴 만들기](#43-주기적-정리-루틴-만들기)
5. [주의사항](#5-주의사항)
   1. [처음부터 `Permanently Delete`를 선택하는 경우](#51-처음부터-permanently-delete를-선택하는-경우)
   2. [공용 이미지 폴더를 제외하지 않는 경우](#52-공용-이미지-폴더를-제외하지-않는-경우)
   3. [“사용 중” 기준을 잘못 이해하는 경우](#53-사용-중-기준을-잘못-이해하는-경우)
   4. [실행 전에 로그 옵션을 확인하지 않는 경우](#54-실행-전에-로그-옵션을-확인하지-않는-경우)
6. [참고](#참고)

---

## 1. 핵심 기능

1. **마크다운 문서 전체를 검사해 현재 사용 중인 이미지 링크를 수집**
2. **볼트 내 이미지 파일과 비교해 미사용 이미지를 탐지**
3. **삭제 방식 선택 가능**
   * `Move to Obsidian Trash`
   * `Move to System Trash`
   * `Permanently Delete`
4. **특정 폴더를 검사 대상에서 제외 가능**
   * `Excluded Folder Full Paths`
   * `Exclude Subfolders`
5. **명령어 팔레트 또는 리본 아이콘으로 실행 가능**
   * `Clear Unused Images` 명령어 지원
   * 리본 아이콘 실행 지원

## 2. 설치 방법

### 2.1. Community Plugins 검색

메뉴 경로: **Settings → Community plugins → Browse**

1. **Community plugins** 화면에서 **Browse**를 클릭한다.
	![500x265](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-02-44.png)
2. 검색창에 `Clear Unused Images`를 입력한다.
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-07.png)
3. 검색 결과에서 해당 플러그인을 선택한다.

### 2.2. 설치

1. 플러그인 상세 화면에서 **Install**을 클릭한다.
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-13.png)
2. 설치가 완료될 때까지 기다린다.

### 2.3. Enable 활성화

1. 설치가 끝나면 **Enable**을 클릭한다.
	![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-19.png)
2. 활성화되면 Community Plugins 목록에서 켜진 상태로 표시된다.

### 2.4. 설정 화면 진입

메뉴 경로: **Settings → Community plugins → Clear Unused Images**

![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-03-33.png)

## 3. 설정

![500x266](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2026-04-14-15-04-21.png)

### 3.1. `Deleted Image Destination`

삭제된 이미지를 어디로 보낼지 정하는 옵션이다.

선택지는 다음과 같다.

* `Move to Obsidian Trash`: Obsidian 볼트 내부 `.trash` 폴더로 이동
* `Move to System Trash`: 운영체제 휴지통으로 이동
* `Permanently Delete`: 복구 없이 즉시 삭제

### 3.2. `Excluded Folder Full Paths`

검사에서 제외할 폴더의 전체 경로를 입력하는 설정이다.

**쉼표로 여러 폴더를 구분**할 수 있으며, **Vault 기준 전체 경로**를 입력해야 한다.

예시:

* `Templates/`
* `Assets/Keep/`
* `Projects/Archive/Images/`

### 3.3. `Exclude Subfolders`

위에서 지정한 제외 폴더의 **하위 폴더까지 함께 제외**할지 정하는 옵션이다.

### 3.4. `Delete Logs`

삭제가 끝난 뒤 어떤 이미지가 삭제되었는지 **팝업 로그(modal)** 로 확인할지 정하는 옵션이다.

### 3.5. `Ribbon Icon`

리본 아이콘을 활성화해 왼쪽 리본 메뉴에서 바로 실행할 수 있게 해주는 옵션이다.

## 4. 추천 활용법

### 4.1. 첨부 폴더가 분리돼 있을 때 더 유용함

예를 들어 모든 이미지를 `Attachments/` 폴더에 저장하는 습관이 있다면, 시간이 지나면서 불필요한 이미지가 많이 쌓이게 된다.  
이 플러그인은 이런 환경에서 특히 유용하다.

### 4.2. 대규모 삭제 전에 백업

파일을 직접 정리하는 플러그인이기 때문에, 사용 전에는 조금 더 신중할 필요가 있다.

* 중요한 볼트는 미리 백업하기
* 처음 1~2회는 `Move to Obsidian Trash`로 테스트하기
* 로그를 확인하면서 삭제 패턴 점검하기

이 흐름으로 접근하면 훨씬 안전하다.

### 4.3. 주기적 정리 루틴 만들기

예를 들면 이런 식으로 활용할 수 있다.

* 주 1회 정리
* 큰 프로젝트 문서를 정리한 직후 실행
* 이미지를 대량으로 붙여넣은 뒤 실행

정리 루틴에 포함해두면 볼트를 훨씬 깔끔하게 유지할 수 있다.

## 5. 주의사항

### 5.1. 처음부터 `Permanently Delete`를 선택하는 경우

가장 주의해야 할 옵션이다.  
README에서도 이 옵션은 되돌릴 수 없다고 안내하고 있다. 처음 사용할 때는 가급적 선택하지 않는 편이 안전하다.

### 5.2. 공용 이미지 폴더를 제외하지 않는 경우

노트에 직접 링크되지 않더라도 아래와 같은 파일은 실제로 계속 필요한 경우가 있다.

* 템플릿에서 나중에 사용할 이미지
* 디자인 에셋
* 프로젝트 리소스

이런 폴더를 제외 설정에 넣지 않으면 미사용 이미지로 판단되어 삭제될 수 있다.

### 5.3. “사용 중” 기준을 잘못 이해하는 경우

이 플러그인은 README 기준으로 **마크다운 문서 안의 이미지 링크**를 기준으로 비교한다.  
즉, 아직 문서에서 참조하지 않았지만 나중에 쓸 예정인 이미지는 사용 중으로 인식되지 않을 수 있다.

### 5.4. 실행 전에 로그 옵션을 확인하지 않는 경우

처음 사용할 때는 `Delete Logs`를 켜두는 편이 훨씬 안전하다.  
실제로 어떤 파일이 정리되었는지 바로 확인할 수 있기 때문이다.

추가로 아래 사항도 함께 확인해두면 좋다.

1. 이 플러그인은 **이미지 파일 정리용**이다. README 기준 스캔 대상 포맷은 `jpg, jpeg, png, gif, svg, bmp, webp`다. 다른 파일 형식까지 자동 정리하는 용도는 아니다.
2. 실행 전에는 반드시 삭제 목적지를 확인해야 한다.
   * `Move to Obsidian Trash`
   * `Move to System Trash`
   * `Permanently Delete`
3. “나중에 쓸 이미지 저장소”가 있다면 반드시 제외 폴더를 설정하는 것이 좋다.
4. 처음 사용할 때는 작은 테스트 볼트나 백업본에서 먼저 실행해보는 편이 안전하다.

---

## 참고

- [GitHub: Clear Unused Images README.md](https://github.com/ozntel/oz-clear-unused-images-obsidian/blob/master/README.md)
