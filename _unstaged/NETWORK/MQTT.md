# MQTT
## 설치
### 1. 패키지 업데이트
`sudo apt update && sudo apt upgrade -y`

### 2. Mosquitto 설치
`sudo apt install mosquitto mosquitto-clients`

### 3. 자동 실행 활성화
```bash
sudo systemctl enable mosquitto
sudo systemctl start mosquitto
```

### 4. 설치 확인
`systemctl status mosquitto`

## 기본 테스트
1. 구독:
	`mosquitto_sub -h localhost -t test/topic`
2. 발행:
	`mosquitto_pub -h localhost -t test/topic -m "Hello MQTT"`

## 보안 설정
1. 설정 파일 열기:
    `sudo nano /etc/mosquitto/mosquitto.conf`
2. 다음 추가:
    `listener 1883 allow_anonymous false password_file /etc/mosquitto/passwd`
3. 사용자 계정 생성:
    `sudo mosquitto_passwd -c /etc/mosquitto/passwd mqttuser`
4. 서비스 재시작:
    `sudo systemctl restart mosquitto`

