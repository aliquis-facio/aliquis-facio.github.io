---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[LINUX] 디렉토리 조작명령어 설명 및 실습"
excerpt: "디렉토리 조작명령어 설명 및 실습"

date: 2022-02-27
last_modified_at: 

categories: [LINUX]
tags: [LINUX]
---

1. `pwd`: 현재 위치한 디렉토리의 절대 경로 표시

2. `cd [이동할 directory]`: 현재 위치에서 디렉토리 변경 시 사용
    * `cd ..`: 상위 디렉토리로 이동
    * `cd \`: 무조건 루트 디렉토리로 이동
    * `cd ~`: 어떤 위치에서든 현재 계정의 홈디렉토리로 이동

1. `ls [option] [directory]`: 도스의  dir과 같은 명령으로써 파일명, 디렉토리 등을 화면에 출력하는 명령
    * `-a`: .로 설정된 숨김 파일을 화면에 보여줌
    * `-l`: 파일에 대한 정보(파일 허용권한, 소유자, 그룹, 파일 크기, 파일 변경 날짜) 등을 보여줌
    * `-m`: 파일을 쉼표(,)로 구분해 가로로 출력해 보여줌
    * `-t`: 가장 최근에 변경된 파일을 최근 순서대로 보여줌
    * `-u`: 최근에 엑세스했던 파일목록을 보여줌
    * `-R`: 하위디렉토리 파일도 모두 보여줌

1. `mkdir [opt] [생성할 directory]`: 디렉토리를 생성하는 명령
    * `-m`: 생성할 디렉토리에 권한(premission)까지 지정
    * `-p`: 상위 디렉토리까지 생성
        * `mkdir -p test1/test2`

1. `rmdir [opt] [삭제할 directory]`: 비어있는 디렉토리를 삭제
    * `-p`: 상위 디렉토리까지 삭제
        * `rmdir -p test1/test2`