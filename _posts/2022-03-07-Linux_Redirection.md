---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[LINUX] Redirection"
excerpt: "파일관련 명령어 2: 검색조건에 맞는 파일 검색 및 리다이렉션, 파이프 명령어"

date: 2022-03-07
last_modified_at: 2022-03-09

categories: [LINUX]
tags: [LINUX]
---

redirection 명령: 입출력의 방향을 바꾸는 작업
> - 출력 형태 전환기호 (모니터상의 출력 대신 파일로 출력을 전환)
< - 입력 형태 전환기호 (표준 입력 키보드 대신 파일이나 기타 장치로 전환)
>> - 표준 출력을 파일 뒷부분에 추가해 덧붙임.
<< - 제시된 문자열이 입력될 때까지 대기했다가 한 번에 표준 출력으로 보냄

cat (opt) [file]: 파일의 내용을 화면에 출력하는 명령
-n(-b): 행 번호를 화면 왼쪽에 나타냄 (-b 공백 제외)
-E: 각 라인 맨 끝에 $ 표시를 붙여 출력
-A: 화면 제어 문자 보여줌 (라인 끝 $, 탭 문자는 ^| 로 표기)

cat etc/passwd > test1.txt
cat < test1.txt
cat etc/shadow > test2.txt
cat < test2.txt
cat < test1.txt >> test2.txt

more (opt) [file]: 화면 단위로 분할해 출력하는 명령
-d: 스페이스나 q키를 누르라는 프롬포트 출력
-p: 스크롤하지 않고 화면을 지우고 출력
-줄 수: 한 페이지에 정해진 줄 수 만큼 출력

파이프(|) 명령: 명령 실행 결과를 다른 명령의 입력으로 전환하는 것을 의미
형식: 명령1 | 명령2
명령1 결과를 명령2 입력으로 받아서 처리
ls -al /bin/ | more -20 -d

find [시작 directory] [검색 조건]: 특정 파일을 찾는 명령어. 검색 조건에 일치하는 자료를 모든 파일에 대해 검색하고자 할 경우 시작 디렉토리를 "/"로 설정
-name "문자열": 파일 이름이 문자열과 일치하는 파일을 검색 *
-user "사용자 이름": 특정 사용자의 소유권인 파일을 찾을 때 사용 *
-type 타임: 지정한 파일 유형을 찾을 때 사용. (d - 디렉토리, f - 일반 파일, l - 링크 파일, b - 블록 디바이스, c - 캐릭터 디바이스, p - 파이프, s - 소켓) *
-perm "퍼미션": 명시된 퍼미션으로 된 파일이나 디렉토리를 찾을 때 사용
-atime day: day 일 이전에 접근한 파일을 찾음. (atime +3 -> 3일 전 엑세스한 파일을 찾음. atime -3 -> 3일 내에 엑세스한 파일 찾음.)
-ok: 파일 검색 결과 확인 메시지를 출력 명령 실행 시 y/n를 입력 받음.
-print: 검색 결과를 화면으로 출력 받을 때 사용
-fprint: 출력 결과를 파일로 저장할 때 사용(리다이렉션 기호 ">"와 같음.)
-iname: 대소문자 구별하지 않고 검색 시 사용
find .: 현재 디렉토리에 존재하는 모든 파일 및 하위 디렉토리를 찾아서 보여줌.
find /bin/ -name grub2: bin 디렉토리 내에서 grub2로 시작하는 모든 파일을 보여줌.
find -type d -name "secu*": 터미널이 실행된 디렉토리 내부에서 secu로 시작하는 모든 디렉토리 

grep (opt) [검색내용] [파일명]: 파일 내에서 또는 입력값에서부터 특정 패턴을 검색하는 명령. 원하는 검색 조건을 해당 파일에서 검색해 위치나 내용을 보여줌.
-c: 검색 조건과 일치하는 내용이 있는 행의 개수를 표시
-l: 검색 조건과 일치하는 내용이 있는 파일의 이름만을 표시
-n: 검색 조건과 일치하는 내용이 있는 행 번호와 파일이름을 표시 *
-r: 하위 디렉토리까지 주어진 패턴을 검색
-v: 검색 조건과 일치하지 않는 행을 출력 *
grep -n "tester" etc/passwd
grep -v "var" etc/passwd

검색을 보다 세부적으로 할 수 있는 정규 표현식
[문자1문자2문자3]: 문자1 또는 문자2 또는 문자3 중 한 문자를 표시
[숫자0-숫자9]: 0~9 숫자 중 하나를 표시
[^숫자-숫자]: 해당 숫자를 제외한 모든 경우를 검색해 표시
"^문자": 주어진 검색조건의 문자로 줄이 시작하는 경우에만 검색해 표시
"문자$": 주어진 검색조건으로 줄이 끝나는 경우에만 검색해 표시
grep [0-5] etc/passwd: 0~5의 숫자가 들어있으면 전부 표시
grep "^demon" etc/passwd: demon으로 시작하는 전부 표시

기타 파일 관련 명령
sort (opt) [file]: 텍스트 파일 내용을 행 단위로 정렬
-f: 대소문자 무시
-r: 내림차순 정렬
split (opt) [file] (생성할 file): 하나의 파일을 여러 개 작은 파일로 분할하는 명령 (기본 1000라인 단위로 분할) *
-b: 바이트 크기로 분리
-l: 주어진 행 수 단위로 분리
head (opt) [file]: 텍스트 파일의 첫 부분을 보여주는 명령 (기본 10줄 보여줌)
-n 행: 파일의 앞에서부터 지정된 행 수만큼 출력
tail (opt) [file]: 텍스트 파일의 끝 부분을 보여주는 명령 (기본 10줄 보여줌)
-n 행: 파일의 마지막 행에서부터 지정된 행 수만큼 출력
sort etc/passwd
sort -r etc/passwd

cp etc/passwd test.txt
split -20 test.txt

head etc/passwd
tail -5 etc/passwd