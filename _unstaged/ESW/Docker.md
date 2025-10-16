# Docker

## 1. Docker 설치
### 1.1. 준비
```bash
sudo apt-get update
sudo apt-get upgrade
```

### 1.2. 설치
```bash
# 도커 설치 shell 파일 받기
curl -fsSL https://get.docker.com -o get-docker.sh

# shell 파일 실행 -> docker 설치
sudo sh get-docker.sh

# 권한 부여
sudo usermod -aG docker ${USER}

# 권한 그룹에 도커가 추가됐는지 확인 (재부팅 후 확인)
groups ${user}

# 도커 설치 확인
docker version
```

## 2. Docker Compose 설치
```bash
# Docker Compose Install
mkdir -p ~/.docker/cli-plugins curl -SL https://github.com/docker/compose/releases/download/v2.39.3/docker-compose-linux-aarch64 -o ~/.docker/cli-plugins/docker-compose

# 폴더 권한 부여
chmod +x ~/.docker/cli-plugins/docker-compose

# Docker Compose 설치 확인
docker compose version
```

[Docker Compose Github Release](https://github.com/docker/compose/releases)

## 3. 백업/복원

### 3.1. 
`local` 볼륨(`docker volume ls`에서 나오는 이름들)을 사용 중이라면,

```
# 백업
docker run --rm -v <volume_name>:/data -v $(pwd):/backup busybox tar cvf /backup/volume.tar /data

# 복원
docker run --rm -v <volume_name>:/data -v $(pwd):/backup busybox tar xvf /backup/volume.tar -C /
```

### 3.2. Docker 상위 폴더 자체 백업/복원
#### 체크리스트
- 두 기기 아키텍처 동일(둘 다 라즈베리파이/ARM64 등)
- 새 기기에 Docker & Compose 플러그인 설치
- 라우터 포트포워딩/DNS(도메인 쓰면 A/AAAA 레코드) 새 공인 IP로 반영
- 포트(9000/9443)가 새 기기에서 비어 있음
- 시스템 시간 동기화(시간 틀어지면 TLS 에러 가능)

#### 백업 (원본 라즈베리)

```bash
# 1) 정합성 위해 컨테이너 잠깐 중지
cd ~/docker/authentik
docker compose down

# 2) 상위 docker 폴더 전체 보존 백업(소유권/권한 유지가 중요)
cd ~ sudo tar --numeric-owner -czpf docker-backup-$(date +%F).tar.gz docker
# 또는 rsync 권장
# sudo rsync -aHAX --numeric-ids ~/docker/ /mnt/usb/docker/
```

#### 복원 (새 라즈베리)

```bash
# 1) Docker 설치 후
cd ~
sudo tar --numeric-owner -xzpf docker-backup-YYYY-MM-DD.tar.gz

# 2) 권한 한 번 점검(필수는 아니지만 깔끔하게)
sudo chown -R $USER:$USER ~/docker

# 3) 올리기
cd ~/docker/authentik
docker compose pull
docker compose up -d

# 4) 확인
docker ps
docker logs -f authentik-server-1
```

#### 자주 생기는 이슈와 해법
- **포트 충돌**: 새 기기에 9000/9443을 이미 쓰는 서비스가 있으면 `.env`의 `COMPOSE_PORT_HTTP/HTTPS`를 바꿔서 재기동.
- **권한/소유권**: 백업·복원 시 `--numeric-owner`/`rsync --numeric-ids`를 써서 컨테이너가 만든 파일 UID/GID를 그대로 유지하세요.
- **이미지 재받기**: 새 기기는 이미지가 없으니 `docker compose pull`로 받아와야 합니다(자동으로 캐시됨).
- **외부 접속**: 라우터에서 새 내부 IP로 포워딩 다시 설정(예: 80→9000, 443→9443), 혹은 리버스 프록시 사용 시 프록시 설정 갱신.
- **도메인**: 도메인 쓴다면 DNS를 새 공인 IP로 업데이트.

# 참고
* [[Rasp/Docker] 라즈베리파이4에 도커 설치하기](https://ban2aru.tistory.com/70)
* [Raspberry Pi OS(라즈비안)에 Docker & Docker Compose 설치 (ft. transmission)](https://ansimcode.tistory.com/19)
* 