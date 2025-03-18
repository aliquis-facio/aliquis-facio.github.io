---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[LINUX] 부트로더 grub에 대한 설명과 실행레벨 설명"
excerpt: "리눅스 부트로더 - 부트로더인 LILO, GRUB"

date: 2022-02-18
last_modified_at: 2024-12-27

categories: [LINUX]
tags: [LINUX]
---

# 부트로더
1. 정의: 커널이 올바르게 부팅되기 위해 필요한 작업을 수행하고 최종적으로 운영체제를 부팅시키는 역할담당
2. 종류
    * LILO: MBR이나 파티션의 시동섹터 안에(만) 위치. **/etc/lilo.conf**
    * GRUB: 리눅스의 기본 부트로더. GNU에서 만든 부트로더. LILO보다 강화된 형태. 

## GRUB 특징
* LILO에 비해 설정 및 사용의 편리성
* 부트 정보가 올바르지 않더라도 부팅 시 이를 바로 수정해 부팅 가능
* 윈도우 계열 및 기타 OS를 지원해 멀티 부팅 가능
* 메뉴 인터페이스 환경을 지원해 대화형 모드로 부트 정보를 설정 가능
* 네트워크 상에서 부트로더의 설정 수정 가능
* 커널의 물리적 위치를 기록하지 않고도 커널 파일명과 커널이 위치하고 있는 파티션의 위치만 알고 있으면 시스템 부팅 가능.

## GRUB 장치 명명
GRUB의 장치 이름은 블록 디바이스 표기법과 다르게 파티션 순서를 알바벳이 아닌 숫자로 표기  
ex) hda, hdb... -> hd0, hd1  
(hd0, 0) -> 첫 번째 하드 디스크의 첫 번째 파티션

## GRUB 환경설정파일(grub.conf)
* default: 멀티부팅일 경우 기본으로 부팅할 OS의 레이블 번호(0부터 시작)
* timeout: 정해진 시간이 경과 후 default에 설정된 OS로 부팅
* splashimage: 배경그림 경로 설정
* title: GRUB에 나타나는 OS 이름 설정
* boot: 부팅할 OS가 설치된 파티션을 설정
* kernal: OS 부팅 시 읽어올 커널 파일 지정
* initrd: 초기 램 디스크; 부팅 시 초기화에 필요한 루트 디스크의 이미지 파일을 지정

## GRUB 환경설정파일 - 명령어
* boot: 지정한 장치와 커널 명령어로 부팅.
* cat file_name: 파일의 내용을 확인.
* clear: 화면을 클리어
* displaymem: 메모리 정보를 출력
* find file_name: 지정 파일이 위치하는 장치명 검색
* kernal (kernal_file_name): 부팅에 사용할 커널 이미지 파일의 경로를 지정
* makeactive: 루트디스크에 존재하는 GRUB의 루트 디바이스를 부팅 가능한 파티션으로 지정
* root (device_name): 지정한 장치를 부트 파티션으로 지정
* rootnoverify (device_name): root와 비슷하나 파티션을 마운트 하지 않음. 주로 grub 에서 지원하지 않는 파일 시스템 부팅 시 사용.
* Setup (device_name): 지정 장치로 grub 자동 설치

## GRUB 부트 디스크를 이용한 OS별 부팅 작업
1. 윈도우로 부팅  
```
rootnoverify (hd0, 0)
makeactive
chainloader+l
boot
```

2. 리눅스로 부팅  
```
root (hd0, 1)
kernal /boot/vmlinuz-version ro root=/dev/hda2
boot
```

## linux 실행레벨(runlevel)
```shell
cat /etc/inittab
systemctl get-default
```
0. halt
1. Single user mode
2. multiusr, without nfs(no network)
3. full multiuser mode *
4. unused
5. X11(graphic user) *
6. reboot

_grub은 ide 하드디스크를 장착한 순서대로 인식한다._


9강. 리눅스 시스템 종료를 위한 명령어

1. 기본 명령어 - 디렉토리 관련명령: 리눅스 시스템 종료 및 재시동을 위한 명령머 및 디렉토리 조작을 위한 명령 학습

1. 시스템 종료와 재부팅
- 1. shutdown (opt)(time)(msg): 시스템을 종료하거나 재부팅할 때 사용
- 옵션
-r: 시스템 재부팅
-f: 다음 부팅 시 파일 시스템 검사를 하지 않음.
-h: 셧다운 시 halt 작업 실행
-c: 예약되어 있는 shutdown 작업 취소
-t n: 경고메시지 보낸 후 n초 후에 kill 시그널 전송
shutdown -r now
- 2. halt (opt): 시스템을 종료할 때 사용
- 옵션
-f: 강제종료
-d: /var/log/wtmp 파일에 기록을 남기지 않음.
- 3. reboot: 재부팅
    reboot 명령어의 수행 과정
    1. 파일 시스템을 언마운트함
    2. 시스템을 shutdown함
    3. 시스템 실행 수준(run level)을 3으로 변경시킴.(multiusr, without nfs(no network))
- 4. init (n): 종료/재부팅 런레벨번호

1. 디렉토리(directory)
- 1. /(root) 디렉토리: 시스템 근간이 되는 가장 중요한 디렉토리로 반드시 존재해야 함. 모든 파티션, 디렉토리는 루트 디렉토리 아래에 위치.

- 2. /의 주요 서브 디렉토리
/bin (binary 실행파일 저장): 리눅스 기본 명령어가 저장되어 있는 공간
/dev (device): 리눅스 시스템의 모든 장치들이 파일로 표시되어 있음. 주요 디바이스 표시 ex /dev/nda: Master IDE 하드디스크 /dev/ndb: Slave IDE 하드디스크 /dev/sda: 첫 번째 SCSI 혹은 S-ATA 하드디스크 /dev/cdrom: cdrom 드라이브 /dev/tty0: 첫 번째 가상 콘솔
/boot (커널 부트 이미지 파티션): 시스템이 부팅될 때 부팅 가능한 커널 이미지 파일을 담고 있는 디렉토리
/home (사용자 계정 파티션): 사용자 계정이 위치하는 파티션으로, 익명 ftp 서비스를 할 때 혹은 웹 호스팅 서비스를 하고자 하는 경우에는 파티션 용량을 크게 설정
/etc: 시스템 환경설정 파일 및 부팅 관련 스크립트, 사용자 계정 정보가 저장. 사용자 계정 추가할 때도 사용.
/lib (library): 시스템 운영에 필요한 공유 라이브러리 이미지와 프로그램 공유 코드 부분을 저장.
/usr (user, 대부분의 프로그램이 설치될 파티션): 리눅스 디렉토리 중 가장 많은 용량을 차지하는 곳으로 사용자에 대한 대부분 프로그램 설치(응용 프로그램). /usr/local: 새로운 프로그램이 설치되는 곳 /usr/src: 프로그램의 소스가 저장 /usr/include: c/c++ 프로그램의 헤더 파일이 들어있는 곳
/sbin (system binary): 시스템 관리용 프로그램 저장

- 3. etc 디렉토리의 구조
/etc/fstab: 파일 시스템 관리
/etc/group: 유저 그룹 관리
/etc/inittab: init 프로세스 관리
/etc/passwd: 유저 관리
사용자 계정명: 패스워드: 사용자 계정 uid: 사용자 계정 group id:사용자 정보: 사용자 계정 홈 디렉토리: 사용자 계정 로그인 쉘

cat etc/shadow 패스워드가 암호화되서 저장

- 4. proc 디렉토리의 구조
/proc/cpuinfo: cpu의 정보
/proc/devices: 현재 커널에 설정되어 있는 장치의 목록 표시
/proc/filesystems: 현재 커널에 설정되어 있는 파일 시스템 목록 표시
/proc/interrups: 현재 사용 중인 인터럽트에 대한 정보 표시
/proc/loadavg: 시스템의 평균 부하량 표시
/proc/meminfo: 메모리 정보 표시
/proc/stat: 시스템 상태 표시

- 5. usr 디렉토리의 구조
/usr/bin: 응용 프로그램의 실행 파일이 존재
/usr/include: c언어의 헤더파일 존재
/usr/lib: 실행 파일들을 위한 라이브러리 저장
/usr/local: 일반적 프로그램 설치
/usr/src: rpm, 소스 파일들을 저장해 사용

# 참고
1. <https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=akohong&logNo=220797668319>
2. <https://doongdangdoongdangdong.tistory.com/129>
3. <https://www.hanbit.co.kr/channel/category/category_view.html?cms_code=CMS6259570844>
1. <https://helloitstory.tistory.com/25>