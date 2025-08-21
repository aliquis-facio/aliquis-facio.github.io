---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[LINUX] 리눅스 마스터 2급 기출 문제"
excerpt: "오답노트 1"

date: 2022-06-24
last_modified_at: 

categories: [LINUX]
tags: [LINUX, LICENSE]
---

## 2017년 06월 10일 필기 기출문제

#### 2. 다음 파일의 소유 그룹을 ihd로 변경하고자 할 때 () 안에 들어갈 명령으로 알맞은 것은?
`[root@www ~]# () :ihd test.txt`
1. ls
2. chown
3. chmod
4. chgrp
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 4. 다음 중 Sticky-Bit가 설정된 디렉토리로 알맞은 것은?
1. /home
2. /var
3. /etc
4. /tmp
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 5. 다음 () 안에 들어갈 내용으로 알맞은 것은?
```보통 실행 파일에 사용되며 ()가 부여된 파일을 실행 시, 해당 파일을 실행하는 동안에는 실행시킨 사용자의 권한이 아닌 해당 파일의 소유자 권한으로 인식한다.```
1. Set-GID
2. Set-UUID
3. Set-UID
4. Sticky-Bit
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 6. 다음 중 () 안에 들어갈 옵션으로 알맞은 것은?
```
[root@www ~] # df ()
Filesystem Type Size Used Avail Use% Mounted on /dev/sda2 ext4 15G 2.8G 9.0G 35%
```
1. -h
2. -k
3. -hT
4. -i
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 7. 다음 중 /home 디렉토리의 총 사용량을 단위를 붙여서 확인하려 할 때 알맞은 것은?
1. `du -sh /home`
2. `du -ih /home`
3. `df -sh /home`
4. `df -ih /home`
<div style="text-align: right"> 오답: 4, 정답: 1 </div>

#### 9. 다음 중 DVD 파일시스템으로 대부분의 배포판 리눅스에서 iso9660으로 지정해도 마운트 할 수 있는 파일시스템으로 알맞은 것은?
1. nfs
2. cifs
3. ntfs
4. udf
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 10. 다음 중 DVD-ROM과 같이 이동식 보조 기억장치의 미디어를 꺼낼 때 사용하는 명령으로 알맞은 것은?
1. umount
2. eject
3. fsck
4. fdisk
<div style="text-align: right"> 오답: , 정답: 2 </div>

#### 12. 다음 중 배시 쉘에 대한 설명으로 틀린 것은?
1. 리눅스에서 가장 많이 사용한다.
2. 명령 편집 기능을 제공한다.
3. 1989년 GNU 프로젝트를 위해 리누스 토발즈가 만들었다.
4. ksh 와 csh의 특징이 결합되어 있다.
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 13. 다음 중 시스템에서 사용 가능한 쉘(Shell) 목록을 확인하는 명령어로 알맞은 것은?
1. `echo $SHELL`
2. `chsh -l`
3. `ls /etc/shells`
4. `cat /etc/password`
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 15. 다음에서 설명하는 내용으로 알맞은 것은?
`개별 사용자의 쉘 환경을 설정하는 파일로 경로, 환경변수 등이 설정되어 있고 로그인 시 읽어 들인다.`
1. /etc/profile
2. ~/.bash_profile
3. ~/.bash_logout
4. /etc/bashrc
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 16. 다음 중 현재 사용자가 위치한 디렉토리 경로를 알 수 있는 환경변수로 알맞은 것은?
1. PATH
2. PWD
3. DIR
4. USER
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 17. 다음 중 cat seoul.txt 명령의 출력 결과를 korea.txt 파일에 추가하기 위한 명령어로 알맞은 것은?
1. `cat seoul.txt >> korea.txt`
2. `cat korea.txt >> seoul.txt`
3. `cat seoul.txt > korea.txt`
4. `cat korea.txt > seoul.txt`
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 19. 다음 () 안에 들어갈 내용으로 알맞은 것은?
`프로세스는 크게 두 가지로 나눌 수 있는데, 사용자의 입력에 관계없이 실행되는 (ㄱ) 프로세스와 명령 입력 후 수행종료까지 기다려야 하는 (ㄴ) 프로세스가 있다.`
1. `ㄱ` Background `ㄴ` Frontground
2. `ㄱ` Frontground `ㄴ` Background
3. `ㄱ` Background `ㄴ` Foreground
4. `ㄱ` Foreground `ㄴ` Background
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 21. 다음 중 메모리에 탑재되어 작업 중인 프로세스를 일시적으로 중지시키는 것을 의미하는 것으로 알맞은 것은?
1. Halt
2. Hold
3. Boot
4. Suspend
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 24. ps 명령으로 볼 수 있는 프로세스 STAT 값 중에서 Z에 대한 설명으로 가장 알맞은 것은?
1. 작업 종료 후 Parent Process로부터 회수되지 않아 메모리에 적재되어 있는 상태
2. 인터럽트에 의한 sleep 상태로 특정 이벤트가 끝나기를 기다리는 상태
3. 프로세스가 죽어있는 상태
4. 디스크 I/O에 의해 대기하고 있는 상태
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 25. 동작 중인 프로세스의 상태를 실시간으로 화면에 출력할 때 CPU 항목을 ON/OFF 하려고 한다. 다음 제시된 방법 중에 알맞은 것은?
1. pstree -f 명령어 실행 상태에서 [c]키를 입력한다.
2. pstree 명령어 실행 상태에서 [p]키를 입력한다.
3. top 명령어 실행 상태에서 [t]키를 입력한다.
4. top 명령어 실행 상태에서 [c]키를 입력한다.
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 26. top 명령을 이용해, 프로세스 상태를 실시간으로 모니터링 하던 중 특정 프로세스를 종료하고자 할 때 사용할 수 있는 방법으로 알맞은 것은?
1. 해당 PID를 입력 후 [esc]키를 입력한다.
2. s키를 입력하고 해당 PID를 입력한다.
3. 해당 PID를 입력 후 [q]키를 입력한다.
4. k키를 입력하고 해당 PID를 입력한다.
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 27. 백그라운드로 실행 중인 작업 중, 작업번호 3번인 프로세스만 조회하여 PID와 함께 명령어를 출력하는 것으로 알맞은 것은?
1. `jobs -l | grep '^\[3\]'`
2. `jobs -p | grep '^\[3\]'`
3. `ps aux | grep '\[3\]'`
4. `jobs -p | head -3`
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 28. 다음 중 특정 사용자의 cron 작업을 수정하는 명령어로 알맞은 것은?
1. `crontab -u user01 -e`
2. `crond -m -u user01`
3. `crontab -m -u user01`
4. `crond -r -u user01`
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 32. 다음 중 pico 에디터 단축키 조합의 설명으로 틀린 것은?
1. [ctrl] + [g]: 도움말 출력
2. [ctrl] + [x]: 프로그램 종료
3. [ctrl] + [o]: 새 파일명 지정
4. [ctrl] + [j]: 상위 줄과 결합해 한 문단으로 만들어줌.
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 33. 다음 중 vi 편집에서 현재 커서가 위치한 곳의 문자를 삭제하는 명령으로 알맞은 것은?
1. p
2. dd
3. yy
4. x
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 36. 다음 중 rpm 명령을 이용해 설치과정을 보기 위해서 사용하는 옵션으로 알맞은 것은?
```
warning: ntp-4.2.6p5-10.el6.centos.2.x86_64.rpm: Header
V3 RSA/SHA1 Signature, key ID c105b9de: NOKEY
Preparing...####################[100%]
1:ntp       ####################[100%]
```
1. -k
2. -l
3. -h
4. -vv
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 38. rpm으로 설치된 패키지를 재설치 하려고 한다. 하지만 의존성이 걸려있어 설치가 되지 않았다. 다음 중 재설치를 위한 옵션의 조합으로 가장 알맞은 것은?
1. --nodeps, --force
2. --nodeps, --allfiles
3. --force, --ignoreos
4. --force, --excludedocs
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 40. 데비안 패키지 관리인 deb 파일의 형식으로 알맞은 것은?
1. 패키지이름_버전-릴리즈-아키텍처.deb
2. 패키지이름_릴리즈-버전-아키텍처.deb
3. 패키지이름_버전-아키텍처-릴리즈.deb
4. 패키지이름_아키텍처-릴리즈-버전.deb
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 41. dpkg 명령어의 결과가 다음과 같다. () 안에 알맞은 옵션은?
```
# dpkg () gcc
Package: gcc
Status: install ok installed
Priority: optional
Section: devel
Instatlled-Size: 64
Maintainer: Ubuntu Developers
<ubuntu-devel-dicsucc@lists.ubuntu.com>
Architecture: i386
Source: gcc-defaults (1.98ubuntu3)
Version: 4:4.5.2-1ubuntu3
```
1. --configure
2. --unpack
3. -L
4. -s
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 42. ihd2.tgz라는 파일의 압축내용은 아래와 같다. 이 압축 파일을 /home 디렉터리에 풀기 위해 () 안에 들어갈 옵션으로 알맞은 것은?
```
# pwd
/root/TEST
# tar tvf ihd2.tgz
drwx------ user1/user1 0 2017-02-11 01:33 /home/user1/
-rw-r--r-- user1/user1 176 2013-07-18 22:19 /home/user1/.bash_profile
-rw-r--r-- user1/user1 18 2013-07-18 22:19 /home/user1/.bash_lofout
# tar () ihd2.tgz
```
1. xvf
2. Jxvf
3. zxvfP
4. rvf
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 45. 다음 중 프린터와 관련된 장치 파일로 알맞은 것은?
1. lp0
2. fd0
3. sr0
4. sg0
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 46. 다음 중 이미지를 스캔하는 scanimage 명령어 옵션에 대한 설명으로 틀린 것은?
1. --format : 이미지 형식 지정
2. -d : 장치 파일명 지정
3. -h : 프로그램 버전 확인
4. -L : 사용 가능한 장치 목록 표시
<div style="text-align: right"> 오답: 2, 정답: 3 </div>

#### 47. lp 명령어로 파일을 여러 장 출력하고자 할 때 사용하는 옵션으로 알맞은 것은?
1. -d
2. -p
3. -#
4. -n
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 49. 다음 중 xlib를 대체하기 위해 등장한 것으로 향상된 쓰레드 기능을 지원하고 확장성이 뛰어난 라이브러리로 알맞은 것은?
1. Xt
2. XCB
3. Xm
4. Xaw
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 51. X 윈도에 필요한 도움말이 저장되어 있는 디렉터리로 알맞은 것은?
1. /etc/X11/xinit/Xclients
2. /etc/sysconfig/desktop
3. /usr/X11R6/man
4. /usr/X11R6/lib/xinit/.xinitr
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 53. 다음 중 X윈도의 구성요소 중에 사용자 로그인 및 세션 관리 역할을 수행하는 것으로 알맞은 것은?
1. 디스플레이 매니저
2. 데스크톱 환경
3. 윈도 매니저
4. 유저 인터페이스
<div style="text-align: right"> 오답: 4, 정답: 1 </div>

#### 54. 다음 중 콘솔 모드에 X윈도를 실행하기 위한 명령으로 알맞은 것은?
1. xstart
2. xrun
3. runx
4. startx
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 55. X 프로토콜은 Xlib라는 저수준 인터페이스와 상위 라이브러리인 X toolkit을 사용한다. 다음 중 X toolkit으로 틀린 것은?
1. Xt Intrinsics
2. Xing
3. Qt
4. GTK
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 57. 다음 중 설치비용이 많이 들지만 장애 발생 시 다른 시스템의 영향이 적고 신뢰성이 가장 높은 LAN 구성 방식으로 알맞은 것은?
1. 스타(Star)형
2. 버스(Bus)형
3. 링(Ring)형
4. 망(Mesh)형
<div style="text-align: right"> 오답: 1, 정답: 4 </div>

#### 58. 다음 중 이더넷 배선 방식과 설명으로 알맞은 것은?
1. 1000BASE-T : 1000Mbps의 전송속도에 전송매체는 UTP-5를 사용
2. 1000BASE-LX : 단파장의 광섬유를 사용하는 규격으로 최대 200∼550Mbps까지 가능
3. 1000BASE-SX : 장파장의 광섬유를 사용하는 규격으로 최대 단일 모드일 때 최대 전송거리는 5KM까지 가능
4. 100BASE-FX : 100Mbps의 전송속도에 전송매체는 UTP-5 또는 STP사용
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 60. 다음 중 OSI 7계층과 해당 계층과 관련된 내용으로 알맞은 것은?
1. 데이터링크 계층 : 이더넷, 토큰링, DSL
2. 네트워크 계층 : ICMP, POP3, ARP
3. 전송 계층 : IP, TCP, UDP
4. 응용 계층 : HTTP, NFS, SSH
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 61. 다음 중 OSI 7계층의 하위 계층부터 상위 계층의 순서로 알맞은 것은?
```
ㄱ: 네트워크 계층
ㄴ: 전송 계층
ㄷ: 물리 계층
ㄹ: 세션 계층
ㅁ: 표현 계층
ㅂ: 데이터링크 계층
ㅅ: 응용 계층
```
1. `ㄷ` -> `ㅂ` -> `ㄴ` -> `ㄹ` -> `ㄱ` -> `ㅁ` -> `ㅅ`
2. `ㅂ` -> `ㄷ` -> `ㄴ` -> `ㄹ` -> `ㄱ` -> `ㅅ` -> `ㅁ`
3. `ㄷ` -> `ㅂ` -> `ㄱ` -> `ㄴ` -> `ㄹ` -> `ㅁ` -> `ㅅ`
4. `ㅂ` -> `ㄷ` -> `ㄱ` -> `ㄴ` -> `ㄹ` -> `ㅁ` -> `ㅅ`
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 62. 다음에서 설명하는 OSI 7계층으로 알맞은 것은?
1. 데이터 링크 계층
2. 네트워크 계층
3. 전송 계층
4. 세션 계층
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 64. 다음 중 NFS서비스와 관련 있는 데몬으로 알맞은 것은?
1. nmbd
2. rpcbind
3. smb
4. export
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 65. 다음에서 설명하는 인터넷 서비스 종류로 알맞은 것은?
```
- 1984년에 썬 마이크로시스템즈 사에서 개발한 프로토콜로 다른 컴퓨터의 파일 시스템을 마운트하고 공유하며 자신의 디렉토리인 것처럼 사용할 수 있게 해주는 프로토콜로 보안에 취약하다.
- 클라이언트/서버형 응용프로그램이다.
```
1. FTP
2. SAMBA
3. NFS
4. CIFS
<div style="text-align: right"> 오답: 2, 정답: 3 </div>

#### 66. 다음 중 윈도우-리눅스간 파일시스템 공유를 위한 프로토콜로 알맞은 것은?
1. CIFS
2. NIS
3. NFS
4. UFS
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 69. 다음 중 www.ihd.or.kr 서버에 admin 계정으로 접속하는 명령으로 알맞은 것은?
1. `ssh –l www.ihd.or.kr admin`
2. `ssh admin@www.ihd.or.kr`
3. `telnet admin@www.ihd.or.kr`
4. `telnet –l www.ihd.or.kr admin`
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 71. 다음 중 C클래스의 netmask값이 255.255.255.128 일 경우 분할되는 서브넷 개수와 사용가능한 총 IP주소 개수로 알맞은 것은?
1. 2개의 서브넷, 128개 IP
2. 1개의 서브넷, 248개 IP
3. 2개의 서브넷, 252개 IP
4. 1개의 서브넷, 256개 IP
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 72. 다음에서 설명하는 네트워크 관련 명령어로 알맞은 것은?
```
- 소켓의 PID 및 프로그램명과 포트 번호를 출력한다.
- 라우팅 테이블 정보를 출력한다.
- IP 주소 기반의 접속한 목록을 출력한다.
```
1. route
2. netstat
3. ipconfig
4. mii-tool
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 73. 다음은 IP주소를 설정하는 명령이다. () 안에 들어갈 명령어로 알맞은 것은?
`# () addr add 192.168.0.109/24 dev eth1`
1. ip
2. ifconfig
3. ethtool
4. mii-tool
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 75. 다음 중 netstat의 state 결과와 내용으로 알맞은 것은?
1. TIME_WAIT : 패킷 처리는 끝났지만 분실 되었을지 모를 느린 세그먼트를 위해 소켓을 열어놓은 상태
2. FIN_WAIT1 : 소켓이 닫히고 호스트에 다시 연결을 요청한 상태
3. ESTABLISHED : 소켓이 원격호스트로부터 종료되었다는 정보를 기다리는 상태
4. SYN_RECEIVED : 서버와 클라이언트가 서로 연결된 상태
<div style="text-align: right"> 오답: 4, 정답: 1 </div>

#### 76. vi 편집기를 이용해서 eth0 네트워크 인터페이스에 관련 파일을 직접 변경해 네트워크를 설정하려 한다. 다음 중 /etc/sysconfig/network-scripts/ifcfg-eth0 파일에 설정되는 항목으로 틀린 것은?
1. NAMESERVER
2. IPADDR
3. HWADDR
4. GATEWAY
<div style="text-align: right"> 오답: 4, 정답: 1 </div>

#### 78. 다음 중 기상청과 같이 고성능의 계산 능력이 요구되는 곳에서 구성하는 시스템으로 알맞은 것은?
1. 임베디드 시스템
2. 부하분산 클러스터
3. 베어울프 클러스터
4. 고가용성 클러스터
<div style="text-align: right"> 오답: 2, 정답: 3 </div>