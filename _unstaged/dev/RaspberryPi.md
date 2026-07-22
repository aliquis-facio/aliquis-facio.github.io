# RaspberryPi
## Check the Free Space of SD Card
`df -Bm`

## 전원
```
sudo shutdown -h now
sudo poweroff
```
위 명령어를 친 뒤 기다리면 라즈베리파이의 녹색 LED가(ACTLED) 깜박이다가 완전히 꺼지는데요. 그 때 전원 플러그를 빼면 안전하게 종료시킬 수 있습니다.
## Port Forwarding
### 0. 라우터 설정 페이지 접속하기
iptime 설정 페이지: 192.168.0.1
![2025-09-14-20-46-33](/_image/2025-09-14-20-46-33.png)

기본 id 및 pw
> id: admin
> pw: admin

![2025-09-14-20-47-28](/_image/2025-09-14-20-47-28.png)
로그인 후 화면

### 1. DHCP 고정 할당하기
`[Advanced Setup]-[Network]-[DHCP Server Setup]`
![2025-09-14-20-45-34](/_image/2025-09-14-20-45-34.png)
HostName으로 기기 구분 → 고정 DHCP 설정

### 2. 포트포워딩 설정하기

`[Advanced Setup]-[NAT/Routing]-[Port Fowarding]`
![2025-09-14-21-04-19](/_image/2025-09-14-21-04-19.png)
![2025-09-15-20-56-12](/_image/2025-09-15-20-56-12.png)
`Rule Name`: 본인이 식별할 수 있는 규칙 이름
`Internal IP`: 내부 ip 주소, DHCP 고정 할당을 등록한 ip 주소
`External Port`: 외부 접속 시 사용할 포트 번호(0 ~ 1024 외 번호 사용 권장)
`Internal Port`: SSH 접속 포트 (Default: 22)
![2025-09-15-20-48-34](/_image/2025-09-15-20-48-34.png)
### 3. SSH 접속하기
`ssh <username>@<external ip> -p <external port>`
e.g. `ssh pi@192.168.0.45 -p 8080`

#### Termius
![2025-09-14-21-09-22](/_image/2025-09-14-21-09-22.png)
IP or Hostname: 외부 IP
Label: 본인이 식별할 수 있는 라벨 이름
Port: 외부 Port
Username: 로그인할 사용자명
Password: 로그인할 비밀번호

### 4. 관련 명령어
* `ifconfig`: ip 확인
	![2025-09-14-20-53-50](/_image/2025-09-14-20-53-50.png)
* `ip route`: 라우터 정보 확인
	![2025-09-14-20-55-11](/_image/2025-09-14-20-55-11.png)
* `netstat -nr`: 게이트웨이 주소 확인
	![2025-09-14-20-57-40](/_image/2025-09-14-20-57-40.png)
* `hostname -I`: 내부 IP 확인
* `curl ifconfig.me`: 공인 IP 확인

![2025-09-14-20-48-52](/_image/2025-09-14-20-48-52.png)

# 참고
* [[포트포워딩] 라즈베리파이 외부접속하기](https://poalim.tistory.com/12)
* [라즈베리파이, 고정IP, 포트포워딩, SSH, 외부접속](https://m.blog.naver.com/ab415/222019568460)
* [외부에서 라즈베리파이 접속하기 - 포트포워딩](https://velog.io/@zero-black/%EC%99%B8%EB%B6%80%EC%97%90%EC%84%9C-%EB%9D%BC%EC%A6%88%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0-%ED%8F%AC%ED%8A%B8%ED%8F%AC%EC%9B%8C%EB%94%A9)