---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[WEB] 웹 서버 실습"
excerpt: "모의해킹 취업반 스터디 7기 1주차"

date: 2024-10-17
last_modified_at:

categories: [WEB]
tags: [WEB, VMWare]
---

# 목차
* [웹서버 실습](#웹서버-실습)
* [1. VMWare 환경 설정](#1-vmware-환경-설정)
* [2. SSH 프로토콜 환경 설정](#2-ssh-프로토콜-환경-설정)
* [2.1. SFTP](#21-sftp26)
* [2.2. termius](#22-termius27)
* [2.3. v푸티(PuTTY)](#23-v푸티putty28)
* [3. 정적 페이지](#3-정적-페이지static)
* [4. 동적 페이지](#4-동적-페이지dynamic)
* [1주차 과제](#1주차-과제)
* [Skelton code란?](#skelton-code란39)
* [의사 코드](#의사-코드pseudo-code39)
* [참고 사이트](#참고-사이트)

# 웹서버 실습
## 1. VMWare 환경 설정
<img src = "https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-1.png?raw=true" title = "ifconfig">

결과로 나오는 docker0, ens33, lo가 무엇을 의미하는 지 궁금했다.

1. `docker0`<sup>[18](#footnote_18)</sup>:
가상환경 도커 내부와 로컬 호스트, 직접적인? 물리적인 컴퓨터의 이더넷 네트워크 인터페이스와 직접적으로 연결되는 장치  
호스트의 eth0 네트워크 인터페이스(NI)와 직접적으로 연결되는 네트워크 인터페이스(NI)  
도커를 설치하면 도커 내부 로직에 의해 자동으로 ip를 할당받게 되는데, 이는 172.17.x.x로 시작하며 netmask는 255.255.0.0으로 설정됨  
docker0 인터페이스는 호스트의 eth0 인터페이스와 컨테이너의 eth0 인터페이스 사이의 중재자 역할을 하는 가상의 브릿지이며, 컨테이너가 생성되면 컨테이너 내부에 할당되는 eth0 인터페이스와 호스트에 할당되는 *veth 인터페이스*가 연결되고 docker0에 *veth 인터페이스*가 바인딩됩니다  
`veth 인터페이스`<sup>[19](#footnote_19)</sup>: 리눅스의 버추얼 이더넷 인터페이스를 의미합니다. veth는 쌍으로 만들어지며 네트워크 네임스페이스들을 터널로서 연결하거나, 물리 디바이스와 다른 네트워크 네임스페이스의 장비를 연결하는 용도로 사용할 수 있습니다.

* 바인딩(Binding)<sup>[20](#footnote_20)</sup>: 프로그램의 어떤 기본 단위가 가질 수 있는 구성요소의 구체적인 값, 성격을 확정하는 것이다. 즉, 변수에 어떤 값을 할당하는 그 과정을 바인딩이라고 하면 될 듯 하다.

2. `ens33`<sup>[21](#footnote_21)</sup><sup>[22](#footnote_22)</sup>: 제 PC에 설치된 NIC(Network Interface Controller)였습니다.
NIC(Network Interface Controller/Card)란?<sup>[23](#footnote_23)</sup> 컴퓨터를 네트워크에 연결하여 통신하기 위해 사용하는 하드웨어 장치이다.  
여기서 인터페이스란 서로 다른 장치가 접촉하는 부분이라고 한다.

3. `lo`<sup>[24](#footnote_24)</sup>: 시스템이 자기 자신과의 통신을 하기 위한 가상 이더넷장치  
lo = loop back을 의미. 자기 자신에게 보내는 데이터를 처리하기 위한 가상 인터페이스 장치명  
  
VMWare Newtork 설정을 nat -> bridge로 바꿔줬다.<sup>[25](#footnote_25)</sup>  

## 2. SSH 프로토콜 환경 설정
### 2.1. SFTP<sup>[26](#footnote_26)</sup>
SFTP(SSH File Transfer Protocol): 파일을 다운로드하거나 인터넷에 업로드할 때 일반적으로 사용된다.  
SFTP를 사용하면 암호화를 통해 데이터를 안전하게 전송할 수 있고, 일반 텍스트 파일은 전송되지 않는다.  
-> 가상머신에 파일 넣을 때 사용할 수 있다  
VSCode STFP 플러그인 있다고 하니 VSC 이용하시는 분들은 참고하시면 좋을 듯 합니다.

### 2.2. termius<sup>[27](#footnote_27)</sup>
termius 접속하면 볼 수 있는 화면이다  
![termius 화면](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-1.png?raw=true)
host를 만들어서 
![host 만들 때](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-2.png?raw=true)
IP 주소 넣고, User name이랑 PW 입력하면 접속할 수 있다.  
VM을 새롭게 시작할 때마다 IP 주소가 바뀌더라.

### 2.3. v푸티(PuTTY)<sup>[28](#footnote_28)</sup>
SSH 프로토콜은 웹호스팅을 이용하거나, 리눅스 서버에 접속하기 위해 사용하는 원격접속 툴이다.
리눅스나 유닉스 계열의 서버에 원격으로 접속할 수 있는 클라이언트 프로그램

## 3. 정적 페이지(Static)
`sudo python -m http.server 80` = 80 포트로 웹서버를 실행한다  
결과 -> `command not found`  
python 설치가 안 돼있나? 확인을 위해 `python -v` -> python3 쓰란다  

* python과 python3의 차이점은 뭣이더냐<sup>[29](#footnote_29)</sup>  
![python2 vs python3](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-19-2.png?raw=true)<sup>[30](#footnote_30)</sup>  

`sudo python3 -m http.server 80`  
![sudo python3 -m http.server 80](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-2.png?raw=true)

ctrl + z 눌러서 나왔는데 프로세스가 제대로 안 죽은 모양이다  
ctrl + z는 일시정지였던 것 같다  
`OSError: Errno 98 Address already in use`  
![OSError: Errno 98 Address already in use](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-3.png?raw=true)

`netstat -lntp`로 봤는데<sup>[31](#footnote_31)</sup>
PID가 안 나오대?  
![netstat -lntp](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-4.png?raw=true)

`sudo lsof -i :80` 하니까 PID가 나와서  
![sudo lsof -i :80](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-5.png?raw=true)

-> 명령어 잘못 쳤다기 보다는 권한 안 줘서 안 나왔던 것 같다.

`kill -9`로 죽였는데 안 죽대?  
![kill -9](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-17-6.png?raw=true)
권한이 없다고 하는 거 뿐이니까 `sudo kill -9`로 확인사살함<sup>[32](#footnote_32)</sup>

## 4. 동적 페이지(Dynamic)
* WAS: Web + Application + Server<sup>[2](#footnote_2)</sup>  
인터넷 상에서 http 프로토콜을 통해 사용자 컴퓨터나 장치에 애플리케이션을 수행해주는 미들웨어로서, **주로 동적 서버 컨텐츠를 수행**하는 것으로 웹 서버와 구별이 되며, 주로 데이터베이스 서버와 같이 수행된다.

`sudo docker ps -a` 혹시 이미 도커가 돌아가고 있는 지 확인하고  
`sudo docker rm -f [pid]` 돌아가고 있다면 종료시키고    
`./dockerCMD &` 도커 실행 (&: background 실행)  
The container name ~ is already in use 에러가 발생했을 때<sup>[33](#footnote_33)</sup>  
![The container name ~ is already in use](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-3.png?raw=true)
Root file = webapp이었다.

```html
<html>
    <h1>Score</h1>
    <h2>Name: <?php echo $_GET['name']; ?></h2>
</html>
```
![score.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-4.jpg?raw=true)
url: http://192.168.219.139:1018/score.php?name=hello
![score.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-5.jpg?raw=true)

웹서버에서는 백엔드의 코드들이 아닌 코드의 결과물만 전달해준다

* 파라미터: 사용자가 웹서버에게 전달하는 데이터  
파라미터 입력 받는 메소드 2가지: get / post<sup>[34](#footnote_34)</sup><sup>[35](#footnote_35)</sup><sup>[36](#footnote_36)</sup>  
<table>
    <thead>
        <tr>
            <th></th>
            <th>get</th>
            <th>post</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>리소스 전달 방식</td>
            <td>쿼리스트링<br>e.g. http://192.168.219.139:1018/score.php?*name=hello*</td>
            <td>http body<br>e.g. http://192.168.219.139:1018/score.php</td>
        </tr>
        <tr>
            <td>http 응답 코드</td>
            <td>200(ok)</td>
            <td>201(created)</td>
        </tr>
        <tr>
            <td>캐시</td>
            <td>O</td>
            <td>X</td>
        </tr>
        <tr>
            <td>브라우저 기록</td>
            <td>O</td>
            <td>X</td>
        </tr>
        <tr>
            <td>북마크 추가</td>
            <td>O</td>
            <td>X</td>
        </tr>
        <tr>
            <td>길이 제한</td>
            <td>O<br>브라우저의 정책에 따라 URI 길이 제한이 다름.</td>
            <td>X</td>
        </tr>
    </tbody>
</table>

back-end: 서버 측 코드 ex) php, asp, jsp...  
front-end: 클라이언트 측 코드, 브라우저가 실행 코드 ex) html, css, js...  

```html
<form>
    <input type = "text" name = "id"/>
</form>

<?php
    echo $_['id'];
?>
```
![name.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-6.jpg?raw=true)
![name.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-7.jpg?raw=true)
![name.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-8.jpg?raw=true)

```html
<form method = "GET" action = "login_proc.php">
    <input type = "text" name = "id" placeholder = "User ID"/>
    <input type = "password" name = "pw" placeholder = "User Password"/>
    <input type = "submit" value = "login"/>
</form>
```
![login.php](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2024-10-20-9.jpg?raw=true)

&: html에서는 파라미터 구분자  

submit이 뭔데요 -> 직접 폼을 서버에 전송할 수 있다고 하네요<sup>[37](#footnote_37)</sup><sup>[38](#footnote_38)</sup>

```php
<?php
    echo $_GET['id'];
    echo $_GET['pw'];
?>
```

Web Service = Web Server(Static Resource) + WAS(Dinamic Resource) + DB

# Skelton code란?<sup>[39](#footnote_39)</sup>
문자 그대로 **뼈대**, 즉 하나의 프로그램이 동작하는 전체 과정을 한눈에 알아볼 수 있도록 그 구조를 나타낸 틀이다.

# 의사 코드(Pseudo code)<sup>[39](#footnote_39)</sup>
프로그래밍 언어의 형식을 빌려 우리말(자연어)로 표현한 코드다. 말 그대로 실제 코드를 흉내낸 가짜 코드다.

# 참고 사이트
<a name="footnote_18">[18]: <https://yoo11052.tistory.com/208></a><br>
<a name="footnote_19">[19]: <https://www.44bits.io/ko/keyword/veth></a><br>
<a name="footnote_20">[20]: <https://medium.com/pocs/%EB%B0%94%EC%9D%B8%EB%94%A9-binding-4a4a2f641b27></a><br>
<a name="footnote_21">[21]: <https://yunjipark0623.tistory.com/entry/CentOS7-%EB%A6%AC%EB%88%85%EC%8A%A4-Network-Manager-IP%EC%A3%BC%EC%86%8C-%EC%88%98%EB%8F%99-%EC%84%A4%EC%A0%95-IP-binding></a><br>
<a name="footnote_22">[22]: <https://blog.naver.com/appeal7712/222294712570></a><br>
<a name="footnote_23">[23]: <https://jettstream.tistory.com/345></a><br>
<a name="footnote_24">[24]: <https://positivemh.tistory.com/651></a><br>
<a name="footnote_25">[25]: <https://mingzz1.github.io/error/windows/2020/09/01/ssh_connection_failed.html/></a><br>
<a name="footnote_26">[26]: <https://support.google.com/merchants/answer/13813117?hl=ko></a><br>
<a name="footnote_27">[27]: <https://velog.io/@blackbean99/%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%97%BF%EB%B3%B4%EA%B8%B0%EA%B5%AC%EB%A9%8D-Terminus-ssh-platform></a><br>
<a name="footnote_28">[28]: <https://m.blog.naver.com/jeonsr/221792705148></a><br>
<a name="footnote_29">[29]: <https://velog.io/@nayoon-kim/python></a><br>
<a name="footnote_30">[30]: <https://codigospython.com/python-2-vs-python-3-diferencias-y-consideraciones/></a><br>
<a name="footnote_31">[31]: <https://philip1994.tistory.com/6></a><br>
<a name="footnote_32">[32]: <https://velog.io/@woojin/address-already-in-use-port-%ED%8F%AC%ED%8A%B8-%EC%8B%A4%ED%96%89-%EC%A4%91-%EC%97%90%EB%9F%AC%EA%B0%80-%EC%83%9D%EA%B8%B8-%EB%95%8C></a><br>
<a name="footnote_33">[33]: <https://velog.io/@ansfls/docker-The-container-name-is-already-in-use-%EC%97%90%EB%9F%AC-%EC%B2%98%EB%A6%AC-%EB%B0%A9%EB%B2%95></a><br>
<a name="footnote_34">[34]: <https://2jinishappy.tistory.com/314></a><br>
<a name="footnote_35">[35]: <https://velog.io/@songyouhyun/Get%EA%B3%BC-Post%EC%9D%98-%EC%B0%A8%EC%9D%B4%EB%A5%BC-%EC%95%84%EC%8B%9C%EB%82%98%EC%9A%94></a><br>
<a name="footnote_36">[36]: <https://brilliantdevelop.tistory.com/33></a><br>
<a name="footnote_37">[37]: <https://jamong-icetea.tistory.com/32></a><br>
<a name="footnote_38">[38]: <https://ko.javascript.info/forms-submit></a><br>
<a name="footnote_39">[39]: <https://medium.com/@marcie179c/java-script-%EC%8A%A4%EC%BC%88%EB%A0%88%ED%86%A4-%EC%BD%94%EB%93%9C-%EC%9D%98%EC%82%AC-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1-%EC%9E%90%ED%8C%90%EA%B8%B0-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-cb046014f21></a><br>

---

* 번외)  
후... 우분투 사랑해 ^^7 -> 리눅스 다시 한 번 보는 걸로
