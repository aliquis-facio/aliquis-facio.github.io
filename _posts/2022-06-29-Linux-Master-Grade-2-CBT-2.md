---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[LINUX] 리눅스 마스터 2급 기출 문제"
excerpt: "오답노트 2"

date: 2022-06-29
last_modified_at: 

categories: [LINUX]
tags: [LINUX, LICENSE]
---

## 2017년 09월 09일 필기 기출문제

#### 1. 다음 중 파일이나 디렉토리 생성 시 부여되는 기본 허가권 값을 지정하는 명령으로 알맞은 것은?
1. `chmod`
2. `chown`
3. `chgrp`
4. `umask`
<div style="text-align: right"> 오답: 1, 정답: 4 </div>

#### 3. 다음 중 디렉터리에 설정되는 x 권한에 대한 설명으로 알맞은 것은?
1. 디렉터리 내부로 접근할 수 있는 권한
2. 디렉터리 내부의 내용을 볼 수 있는 권한
3. 디렉터리 내부에 파일을 생성 또는 삭제할 수 있는 권한
4. 디렉터리 내부의 실행 파일을 실행할 수 있는 권한
<div style="text-align: right"> 오답: 4, 정답: 1 </div>

#### 8. 다음 중 사용자의 용량 제한을 위해 /etc/fstab에 설정하는 옵션으로 알맞은 것은?
1. aquota.user
2. quota
3. usrquota
4. userquota
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 9. 다음 설명과 가장 관련 있는 명령어로 알맞은 것은?
```
리눅스 시스템에 USB 메모리를 장착한 후 대용량의 파일을 복사했다.
USB 메모리를 빼서 다른 리눅스 시스템에서 관련 파일을 확인하려 했으나 보이지 않았다.
```
1. `umount`
2. `e2fsck`
3. `mke2fs`
4. `tune2fs`
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 10. 다음 그림에 해당하는 명령어로 알맞은 것은?
```
/dev/sda1 on / type ext4 (rw)
proc on /proc type proc (rw)
sysfs on /sys type sysfs (rw)
devpts on /dev/pts type devpts (rw,gid=5,mode=620)
tmpfs on /dev/shm type tmpfs (rw,rootcontext="system_u:object_r:tmpfs_t:s0")
none on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)
gvfs-fuse-daemon on /root/.gvfs type fuse.gvfs-fuse-daemon (rw,nosuid,nodev)
/dev/sda3 on /backup type ext2 (rw)
```
1. df
2. du
3. free
4. mount
<div style="text-align: right"> 오답: 1, 정답: 4 </div>

#### 13. 다음 중 기본 셸 변경에 관한 설명으로 알맞은 것은?
1. 사용자가 로그인한 셸을 변경하는 명령어는 echo $SHELL 이다.
2. chsh 명령으로 변경한 셸은 다음 로그인부터 유효하다.
3. cat /etc/shells 명령을 통해 현재 사용 중인 셸의 확인할 수 있다.
4. 변경할 셸을 지정할 때는 상대경로로 입력해야 한다.
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 14. 다음 중 사용가능한 셸을 확인 할 때 사용하는 명령으로 틀린 것은?
1. `echo $SHELL`
2. `cat /etc/shells`
3. `chsh --list-shells`
4. `chsh -l`
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 17. 다음은 히스토리 사용법에 관한 내용이다. 명령문과 관련 설명의 조합으로 알맞은 것은?
1. history : 가장 마지막에 실행한 명령을 재실행한다.
2. history 5 : 5번째 사용한 명령을 실행한다.
3. !all : 히스토리에 등록된 모든 명령을 재실행한다.
4. !5 : 히스토리 목록의 번호중 5번째에 해당하는 명령을 실행한다.
<div style="text-align: right"> 오답: , 정답: 4 </div>

#### 18. 주요 프롬프트 형식에 관한 설명으로 틀린 것은?
1. \d : '년 월 일' 형태로 날짜를 표시한다.
2. \s : 사용중인 셸의 이름을 표시한다.
3. \t : 24시 형태의 현재 시간을 표시한다.
4. \u : 현재 사용자의 이름을 표시한다.
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 22. kill 명령을 사용해 프로세스를 종료 하려고 한다. 다음과 동일한 명령으로 알맞은 것은?
```
- PID 값은 1109이다.
# kill 1109
```
1. `kill –1 1109`
2. `kill –HUP 1109`
3. `kill –9 1109`
4. `kill –15 1109`
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 23. 다음 중 프로세스에 관한 설명으로 틀린 것은?
1. 특정 프로그램이 메모리에 상주해서 실행되고 있으면 이는 프로세스라 부른다.
2. 리눅스에서 프로세스는 실행시 PID가 할당되어 관리된다.
3. 리눅스 부팅시 최초의 프로세스의 PID는 0번이고, 최대 65536 까지 할당 가능하다.
4. 셸에서 명령을 실행하고 해당 프로세스가 종료될 때까지 기다리는 프로세스를 포어그라운드 프로세스라 한다.
<div style="text-align: right"> 오답: , 정답: 3 </div>

#### 26. 다음 중 프로세스 우선순위를 변경하는 명령어에 관한 설명으로 틀린 것은?
1. 프로세스 우선순위를 변경하는 명령으로는 nice, renice가 있으며, 모든 사용자는 NI 값을 증감할 수 있다.
2. nice 명령어 사용시 값을 지정하지 않으면 기본적으로 NI 값이 10이 지정된다.
3. nice 명령은 프로세스 명으로 우선순위를 조정하고, renice 명령은 주로 PID로 조정한다.
4. 기존의 NI 값에 상관없이 지정한 NI 값으로 바로 적용하려면 renice명령어를 이용해야 한다.
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 28. 다음 중 ps 명령어의 프로세스 상태코드인 STAT의 값과 설명으로 틀린 것은?
1. S : 특정 이벤트가 끝나기를 기다리는 상태
2. D : 작업이 종료되었으나 부모 프로세스로부터 회수되지 않아 메모리를 차지하고 있는 상태
3. R : 실행 중 혹은 실행될 수 있는 상태
4. T : 정지된 상태
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 29. 다음 () 안에 들어갈 내용으로 알맞은 것은?
```
(ㄱ)는 (ㄴ)가 자유 소프트웨어 라이선스가 아니었기 때문에
GNU 프로젝트에 의해서 (ㄴ)의 복제 버전으로 개발되었다.
(ㄴ)은 University of Washington에서 개발되었으며 현재는 Apache 라이선스이다.
```
1. `ㄱ` pico `ㄴ` nano
2. `ㄱ` nano `ㄴ` pico
3. `ㄱ` emacs `ㄴ` vi
4. `ㄱ` vim `ㄴ` vi
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 31. 다음 중 vi 편집기를 개발한 사람으로 알맞은 것은?
1. 데니스 리치
2. 빌 조이
3. 리처드 스톨먼
4. 브람 무레나르
<div style="text-align: right"> 오답: 3, 정답: 2 </div>

#### 33. vi 편집기를 이용해서 파일 전체의 linux로 시작하는 줄을 Linux로 시작하도록 치환하려고 할 때 알맞은 것은?
1. :% s/linux/^Linux/
2. :% s/^Linux/linux/
3. :% s/^linux/Linux/
4. :% s/^linux/^Linux/
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 34. 다음 중 vi 편집기의 명령모드에서 입력 모드로 전환할 때 현재 커서가 위치한 곳의 윗줄에 삽입할 때 사용하는 명령으로 알맞은 것은?
1. o
2. O
3. s
4. S
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 35. 다음 중 소스파일로 제공되는 프로그램을 설치하기 위해서는 먼저 압축을 풀고, 디렉터리 이동 후 거쳐야 하는 작업으로 알맞은 것은?
1. setup - configure - make
2. setup - configure - make install
3. configure - setup - make install
4. configure - make - make install
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 36. 다음 중 cmake 에 관한 설명으로 틀린 것은?
1. make의 대체프로그램이다.
2. make과정 없이 운영체제에 맞는 make파일 생성을 목적으로 한다.
3. 유닉스계열 운영체제만 지원한다.
4. 크로스 컴파일을 할 수 있다.
<div style="text-align: right"> 오답: 2, 정답: 3 </div>

#### 37. 리눅스배포판과 패키지관리기법의연결이알맞은 것은?
1. RedHat - DPKG
2. CentOS - RPM
3. Debian - YAST
4. SuSe - YUM
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 40. 다음 tar 명령의 결과에 대한 설명으로 틀린 것은?
`tar zcvf ihd.tar.gz *.c`
1. 현재디렉터리에서 새로운 tar 파일을 생성한다.
2. 파일명은 ihd.tar.gz 으로 지정한다.
3. bzip2 압축을 진행한다.
4. tar 작업이 진행되는동안 파일의 이름을 보여준다.
<div style="text-align: right"> 오답: 2, 정답: 3 </div>

#### 42. 다음 예시에 맞게 tar작업을 할 때 () 안에 들어갈 내용으로 알맞은 것은?
```
bzip2로 압축된 php-5.5.4.tar.bz2를 /usr/local/src 디렉토리에 푼다
tar (ㄱ) php-5.5.4.tar.bz2 (ㄴ) /usr/local/src
```
1. `ㄱ` jxvf `ㄴ` -C
2. `ㄱ` jcvf `ㄴ` -D
3. `ㄱ` zxvf `ㄴ` -C
4. `ㄱ` zcvf `ㄴ` -D
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 44. 다음 중 () 안에 들어갈 내용으로 알맞은 것은?
```
XSANE은 SANE 스캐너 인터페이스를 이용하여 (ㄱ) 기반으로 만든 프로그램이다.
XSANE은 GTK+ 라이브러리로 만들어졌으며, 실행 명령은 (ㄴ)이다.
```
1. `ㄱ` : Console `ㄴ` : xsane
2. `ㄱ` : Console `ㄴ` : sane
3. `ㄱ` : X-윈도 `ㄴ` : xsane
4. `ㄱ` : X-윈도 `ㄴ` : sane
<div style="text-align: right"> 오답: , 정답: 3 </div>

#### 45. 다음 중 ( 괄호 ) 안에 들어갈 내용으로 틀린 것은?
```
SANE는 평판 스캐너, 핸드 스캐너 등 이미지 관련 하드웨어를 사용할 수 있도록 해주는 (ㄱ)이다.
SANE는 (ㄴ) 라이선스로 리눅스 및 유닉스롸 windows도 지원한다.
스캐너 관련 드라이버가 있는 (ㄷ)와 사용자 관련 명령이 있는 (ㄹ) 등 2개의 패키지로 배포된다.
```
1. `ㄱ` : API
2. `ㄴ` : LGPL
3. `ㄷ` : sane-backends
4. `ㄹ` : sane-frontends
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 51. 다음 중 리눅스에서 사용하는 데스크톱 환경으로 알맞은 것은?
1. Luna
2. Aqua
3. Mutter
4. XFCE
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 52. 다음에 제시된 X 관련 라이브러리 중 가장 저수준에 속하는 클라이언트 라이브러리로 알맞은 것은?
1. Xm
2. Xview
3. Xlib
4. XCB
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 53. 다음 중 원격지의 X 서버에 프로그램이 전달되기 위해 수정하는 환경변수로 알맞은 것은?
1. DISPLAY
2. TERM
3. DESKTOP_SESSION
4. WINDOWPATH
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 54. 다음 () 안에 들어갈 내용으로 알맞은 것은?
```
# xauth list $DISPLAY
www/unix:0 () b9898cdf7508afe3vbd55
```
1. authority
2. xauthority
3. .Xauthority
4. MIT-MAGIC-COOKIE-1
<div style="text-align: right"> 오답: 3, 정답: 4 </div>

#### 55. 다음 중 프레젠테이션(Presentation) 문서 작업을 위해 사용하는 프로그램으로 알맞은 것은?
1. LibreOffice Writer
2. LibreOffice Impress
3. LibreOffice Calc
4. LibreOffice Draw
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 57. 다음 중 OSI 7계층 모델에서 데이터링크 계층의 데이터 전송 단위로 알맞은 것은?
1. segments
2. packets
3. frames
4. bits
<div style="text-align: right"> 오답: 2, 정답: 3 </div>

#### 58. 다음 설명에 해당하는 OSI 계층으로 알맞은 것은?
```
데이터 전송에 관한 서비스를 제공하는 계층으로
송신 측과 수신 측 사이의 실제적인 연결 설정 및 유지, 오류 복구와 흐름 제어들을 통해
투명하고 신뢰성 있는 통신이 가능하도록 한다.
특히 이 계층은 전체 메시지의 전송을 책임진다.
```
1. 데이터링크 계층
2. 네트워크 계층
3. 전송 계층
4. 세션 계층
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 59. 다음 설명과 같은 단점을 보이는 LAN 구성방식으로 알맞은 것은?
```
중앙 컴퓨터 고장 시에는 전체 네트워크가 중단되고 설치비용이 많이 든다.
또한 회선 수가 증가하면 제어가 복잡해진다.
```
1. 망(Mesh)형
2. 스타(Star)형
3. 링(Ring)형
4. 버스(Bus)형
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 61. 다음 설명에 해당하는 프로토콜로 알맞은 것은?
```
OSI 네트워크 계층에서 호스트의 주소지정과 패킷 분할 및 조립 기능을 담당하며
데이터 세그먼트를 패킷으로 만들어 전송하는 역할을 수행한다.
라우터 간의 패킷을 전송할 때 최선을 다하지만 100% 도착을 보장하지 않는다.
비신뢰성과 비연결형이 특징이다.
```
1. IP
2. TCP
3. UDP
4. ICMP
<div style="text-align: right"> 오답: 2, 정답: 1 </div>

#### 62. 다음 중 B 클래스의 사설 IP 주소 대역으로 알맞은 것은?
1. 172.1.0.0 ~ 172.15.255.255
2. 172.15.0.0 ~ 172.31.255.255
3. 172.16.0.0 ~ 172.31.255.255
4. 172.16.0.0 ~ 172.32.255.255
<div style="text-align: right"> 오답: 1, 정답: 3 </div>

#### 63. 다음 중 IP주소와 도메인을 관리하는 국제기관 및 국내기관 조합으로 알맞은 것은?
1. ISO - KISA
2. ICANN - KISA
3. ISO - NIPA
4. ICANN - NIPA
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 64. 리눅스를 사용 중인 상태에서 원격지에 있는 유닉스 서버의 디렉터리를 하위 디렉터리인 것처럼 자유롭게 이용 한다. 다음에 제시된 인터넷 서비스 중에서 가장 알맞은 것은?
1. NIS
2. NFS
3. SAMBA
4. TELNET
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 65. 다음 중 원격지 서버에 접속해서 명령 실행, 파일 복사 등의 작업이 가능한 서비스로 틀린 것은?
1. NIS
2. RLOGIN
3. SSH
4. TELNET
<div style="text-align: right"> 오답: 3, 정답: 1 </div>

#### 66. 다음 중 삼바 서비스와 가장 거리가 먼 것은?
1. SMB
2. RPC
3. CIFS
4. NetBIOS
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 67. 다음 중 파이어폭스 웹 브라우저를 개발한 곳으로 알맞은 것은?
1. 아파치 재단
2. 모질라 재단
3. ASA
4. 원격 복사 기능 지원
<div style="text-align: right"> 오답: 1, 정답: 2 </div>

#### 68. 다음 중 접속된 FTP 서버의 연결을 해제하고 셸 프롬프트로 빠져나오는 명령으로 틀린 것은?
1. `bye`
2. `exit`
3. `quit`
4. `close`
<div style="text-align: right"> 오답: 1, 정답: 4 </div>

#### 72. 다음은 DNS 서버 설정을 변경하는 과정이다. () 안에 들어갈 내용으로 알맞은 것은?
```
# vi /etc/resolv.conf
() 168.126.63.1
```
1. ns
2. dns
3. domain
4. nameserver
<div style="text-align: right"> 오답: 2, 정답: 4 </div>

#### 74. 다음 그림에 해당하는 명령으로 알맞은 것은?
![image](https://cdn.jsdelivr.net/gh/jenych0314/jenych0314.github.io@master/_image/2022-06-29-74_image.png)
1. setup ➔ Network configuration
2. neat
3. nm-connection-editor
4. system-config-network
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 76. 다음 중 서버와 클라이언트가 서로 연결된 상태를 나타내는 netstat 명령의 상태값으로 알맞은 것은?
1. LISTEN
2. ESTABLISHED
3. SYS-SENT
4. SYN_RECEIVED
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 77. 다음 설명에 해당하는 기술로 알맞은 것은?
```
호스트 컴퓨터에서 안정성이나 전송속도를 높이기 위해서 두 개 이상의 네트워크 인터페이스를 다루는 방식
```
1. 클러스터링
2. 임베디드
3. HPC
4. 채널본딩
<div style="text-align: right"> 오답: 1, 정답: 4 </div>

#### 78. 다음 중 리눅스와 가장 거리가 먼 것은?
1. GENIVI
2. QNX
3. TIZEN
4. Web OS
<div style="text-align: right"> 오답: 4, 정답: 2 </div>

#### 79. 다음 CPU 반가상화를 지원하는 가상화 기술로 알맞은 것은?
1. Docker
2. KVM
3. XEN
4. VirtualBox
<div style="text-align: right"> 오답: 4, 정답: 3 </div>

#### 80. 다음 중 리눅스 가상화 기술인 XEN에 대한 설명으로 알맞은 것은?
1. 상용화된 제품으로는 RHEV가 있다.
2. 반가상화 구성 시에 호스트와 다른 아키텍처의 게스트는 실행할 수 없다.
3. 반가상화 구성 시에는 QEMU 기반으로 동작한다.
4. CPU 전가상화 지원으로 다른 기술과 비교해서 물리적 서버 대비 효율성이 가장 좋다.
<div style="text-align: right"> 오답: 3, 정답: 2 </div>