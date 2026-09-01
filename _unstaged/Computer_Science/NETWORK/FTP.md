# FTP(File Transfer Protocol)

## 1. 핵심 개념

| 용어     | 종류      | 설명                                    |
| ------ | ------- | ------------------------------------- |
| FTP    | 프로토콜    | 네트워크를 통해 파일을 전송하는 전통적인 프로토콜           |
| FTPS   | 프로토콜    | FTP 통신에 TLS 암호화를 적용한 방식               |
| SFTP   | 프로토콜    | SSH를 기반으로 동작하는 별도의 보안 파일 전송 프로토콜      |
| vsftpd | 서버 프로그램 | Linux·Unix에서 FTP·FTPS 서비스를 제공하는 소프트웨어 |

가장 중요한 구분은 다음과 같습니다.

```text
FTP + TLS = FTPS
SSH 기반 파일 전송 = SFTP
FTP·FTPS 서버 구현 프로그램 = vsftpd
```

SFTP는 이름에 FTP가 들어가지만 FTP의 보안 확장판이 아닙니다.

## 2. FTP

FTP(File Transfer Protocol)는 클라이언트와 서버 사이에서 파일을 업로드·다운로드하기 위한 응용 계층 프로토콜입니다.

### 연결 구조

FTP는 연결을 두 개로 분리합니다.

* **제어 연결**: 로그인과 명령 전송
* **데이터 연결**: 파일 및 디렉터리 목록 전송

일반적으로 제어 연결에는 TCP 21번 포트를 사용합니다. 능동 모드에서는 서버 데이터 연결에 TCP 20번 포트가 사용될 수 있고, 수동 모드에서는 서버가 알려준 별도의 포트를 사용합니다.

### 주요 명령

```text
USER  사용자 이름 전달
PASS  비밀번호 전달
LIST  파일 목록 조회
RETR  파일 다운로드
STOR  파일 업로드
DELE  파일 삭제
PWD   현재 경로 확인
CWD   디렉터리 변경
QUIT  연결 종료
```

### 능동 모드와 수동 모드

| 구분    | 데이터 연결 시작 주체 | 특징                           |
| ----- | ------------ | ---------------------------- |
| 능동 모드 | 서버 → 클라이언트   | 클라이언트 방화벽과 NAT에서 문제가 발생하기 쉬움 |
| 수동 모드 | 클라이언트 → 서버   | 현대 네트워크 환경에서 상대적으로 사용하기 편리함  |

현재는 NAT·공유기·방화벽과의 호환성 때문에 **수동 모드가 일반적**입니다.

### 보안상의 한계

일반 FTP에는 자체 암호화 기능이 없습니다.

* 아이디와 비밀번호가 평문으로 전송될 수 있음
* 파일 내용이 암호화되지 않음
* 패킷 도청과 세션 탈취 위험
* 서버 신원 검증이 어려움
* 제어·데이터 연결 분리로 방화벽 설정이 복잡함

따라서 공개 인터넷에서 평문 FTP를 새로 구축하는 것은 일반적으로 권장되지 않습니다.

## 3. FTPS

FTPS는 기존 FTP 통신에 TLS를 적용한 방식입니다.

```text
FTP + TLS/SSL = FTPS
```

FTP의 명령과 연결 구조를 유지하기 때문에 기존 FTP 시스템과 호환하기 쉽습니다.

### 연결 방식

| 구분       |   일반 포트 | 동작 방식                           |
| -------- | ------: | ------------------------------- |
| 명시적 FTPS |  TCP 21 | FTP 연결 후 `AUTH TLS` 명령으로 암호화 시작 |
| 암시적 FTPS | TCP 990 | 접속할 때부터 TLS 사용                  |

표준화된 방식은 일반적으로 명시적 FTPS입니다.

### 장점

* 로그인 정보와 파일을 TLS로 암호화
* 기존 FTP 클라이언트·서버 구조 활용 가능
* 서버 인증서를 통한 신원 확인 가능
* 클라이언트 인증서 적용 가능

### 단점

* 제어 연결과 데이터 연결이 분리됨
* 수동 모드용 포트 범위를 별도로 열어야 할 수 있음
* NAT와 방화벽 설정이 복잡함
* TLS 인증서 발급·갱신·폐기 관리 필요

FTPS는 새로운 시스템보다는 **기존 FTP 기반 업무 시스템에 보안을 추가할 때** 적합합니다.

## 4. SFTP

SFTP(SSH File Transfer Protocol)는 SSH 연결 위에서 파일을 전송하는 프로토콜입니다.

```text
SFTP ≠ FTP + SSH
SFTP = SSH 기반의 독립적인 파일 전송 프로토콜
```

일반적으로 TCP 22번 포트 하나를 사용하고, 명령과 파일 데이터가 같은 암호화 연결을 통해 전달됩니다.

### 장점

* 인증 정보, 명령과 파일을 모두 암호화
* 단일 포트를 사용해 방화벽 설정이 비교적 간단함
* 비밀번호뿐 아니라 SSH 공개키 인증 지원
* Linux·Unix 환경에서 OpenSSH를 통해 쉽게 제공
* 파일 전송 자동화에 적합
* 파일 조회·삭제·이름 변경·권한 관리 지원

### 단점

* 기존 FTP 클라이언트와 직접 호환되지 않음
* 서버의 SSH 계정 및 파일 권한을 신중하게 설정해야 함
* 호스트 키를 확인하지 않으면 중간자 공격 가능성이 있음
* 계정을 적절히 제한하지 않으면 불필요한 서버 경로에 접근할 수 있음

신규 Linux 서버나 자동화된 보안 파일 전송에서는 일반적으로 **SFTP가 우선 선택지**입니다.

## 5. vsftpd

vsftpd는 `Very Secure FTP Daemon`의 약자로, Linux·Unix 서버에서 FTP 서비스를 제공하는 오픈소스 서버 프로그램입니다.

### vsftpd가 제공하는 기능

* 일반 FTP 서비스
* TLS 설정을 통한 FTPS
* 시스템 계정 로그인
* 가상 사용자 인증
* 익명 FTP
* 업로드·다운로드 권한 관리
* 사용자 홈 디렉터리 제한
* 접속 인원과 전송 속도 제한
* PAM 기반 인증

대표 설정 파일은 일반적으로 다음 위치에 있습니다.

```text
/etc/vsftpd.conf
```

주요 설정 예시는 다음과 같습니다.

```ini
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
ssl_enable=YES
```

여기서 `ssl_enable=YES`와 인증서 관련 설정을 적용하면 vsftpd를 FTPS 서버로 운영할 수 있습니다.

### vsftpd가 하지 않는 것

vsftpd는 SFTP 서버가 아닙니다.

```text
FTP/FTPS 클라이언트 ──→ vsftpd
SFTP 클라이언트 ─────→ OpenSSH sshd
```

SFTP 서비스는 일반적으로 OpenSSH의 `sshd`와 `sftp-server` 또는 내부 SFTP 서브시스템이 제공합니다.

## 6. FTP, FTPS, SFTP, vsftpd 비교

| 구분        | FTP       | FTPS          | SFTP      | vsftpd                 |
| --------- | --------- | ------------- | --------- | ---------------------- |
| 종류        | 프로토콜      | 프로토콜          | 프로토콜      | 서버 프로그램                |
| 기반        | FTP       | FTP + TLS     | SSH       | FTP                    |
| 암호화       | 없음        | TLS           | SSH       | 설정에 따라 없음 또는 TLS       |
| 일반 포트     | TCP 21    | TCP 21 또는 990 | TCP 22    | 기본 TCP 21              |
| 연결 구조     | 제어·데이터 분리 | 제어·데이터 분리     | 단일 SSH 연결 | FTP 방식                 |
| 공개키 인증    | 기본 미지원    | 일반적으로 인증서 기반  | 지원        | SFTP 방식의 SSH 키 인증은 미지원 |
| 방화벽 설정    | 복잡할 수 있음  | 비교적 복잡        | 비교적 간단    | FTP/FTPS 설정에 따라 다름     |
| 기존 FTP 호환 | 해당        | 가능            | 불가능       | 가능                     |
| 신규 구축 권장도 | 낮음        | 특정 호환 환경에서 사용 | 높음        | FTP·FTPS가 필요할 때 사용     |

## 7. FTP의 변천사

| 시기       | 변화                                       |
| -------- | ---------------------------------------- |
| 1971년    | RFC 114를 통해 초기 FTP 제안                    |
| 1970년대 초 | 제어 연결과 데이터 연결을 분리하는 구조 발전                |
| 1980년    | RFC 765에서 TCP 기반 FTP 정리                  |
| 1985년    | RFC 959로 현대 FTP 표준 확립                    |
| 1990년대   | 웹사이트 업로드·소프트웨어 배포·공개 자료 제공에 광범위하게 사용     |
| 1998년    | NAT·IPv6 대응을 위한 `EPRT`, `EPSV` 확장        |
| 2000년대   | 평문 전송 문제로 FTPS와 SFTP 확산                  |
| 2010년대   | 공개 다운로드는 HTTPS·CDN, 데이터 전송은 클라우드 API로 이동 |
| 2020년대   | SFTP·HTTPS API·오브젝트 스토리지·MFT 중심으로 전환     |
| 2026년    | 평문 FTP는 구형 시스템과 폐쇄망에 주로 잔존               |

### 초기 FTP

FTP는 ARPANET에 연결된 서로 다른 컴퓨터 사이에서 파일을 효율적으로 전달하기 위해 만들어졌습니다. 당시에는 운영체제와 파일 표현 방식이 달랐기 때문에 파일 구조와 문자 표현 방식까지 고려해야 했습니다.

### RFC 959 이후

1985년 발표된 RFC 959에서 FTP 명령과 연결 구조가 정리됐습니다. 오늘날 사용되는 FTP도 이 구조를 기반으로 합니다.

하지만 FTP는 신뢰할 수 있는 초기 네트워크를 전제로 설계됐기 때문에 암호화와 현대적인 인증 기능이 부족했습니다.

### 보안 전송 방식의 등장

인터넷이 확대되면서 계정과 파일을 평문으로 전송하는 문제가 부각됐습니다.

* FTPS는 기존 FTP에 TLS를 추가
* SFTP는 SSH 기반의 별도 프로토콜로 발전

OpenSSH에는 2000년부터 SFTP 서버 기능이 포함되기 시작했고, Linux 서버 환경을 중심으로 SFTP가 널리 보급됐습니다.

### HTTPS와 클라우드로 전환

공개 파일 다운로드는 FTP보다 HTTPS와 CDN이 적합해졌습니다. 애플리케이션에서는 REST API, 오브젝트 스토리지, 사전 서명 URL 방식이 보편화됐습니다.

FTP가 하나의 범용 파일 전송 수단이던 시대에서, 현재는 목적에 따라 여러 기술을 선택하는 구조로 바뀐 것입니다.

## 8. 2026년 9월 기준 사용 경향

정확한 전 세계 프로토콜별 점유율을 보여주는 통일된 공신력 있는 통계는 제한적입니다. 다만 주요 서버·클라우드 제품의 지원 현황과 보안 특성을 기준으로 보면 다음과 같이 정리할 수 있습니다.

| 사용 환경            | 일반적인 선택                     |
| ---------------- | --------------------------- |
| Linux 서버 간 파일 전송 | SFTP                        |
| SSH 기반 서버 관리     | SFTP·SCP                    |
| 기업 간 정기 파일 교환    | SFTP·MFT                    |
| 기존 FTP 프로그램과 연동  | FTPS                        |
| 웹 브라우저 파일 다운로드   | HTTPS·CDN                   |
| 애플리케이션 데이터 전송    | HTTPS API                   |
| 클라우드 대용량 데이터 저장  | S3·Blob Storage 등 오브젝트 스토리지 |
| 금융·EDI 등 기업 간 전송 | SFTP·FTPS·AS2·MFT           |
| 폐쇄망·구형 장비        | FTP 일부 유지                   |

### 현재의 우선순위

신규 시스템을 구축한다면 일반적인 우선순위는 다음과 같습니다.

1. 웹·애플리케이션 중심이라면 **HTTPS API 또는 오브젝트 스토리지**
2. 서버 간 단순하고 안전한 파일 전송이라면 **SFTP**
3. 기존 FTP 시스템과의 호환성이 필요하면 **FTPS**
4. 평문 FTP는 특별한 사유가 있는 폐쇄망에서만 제한적으로 사용

## 9. 선택 기준

### SFTP가 적합한 경우

* Linux 서버를 사용함
* 파일 전송을 자동화해야 함
* SSH 키 인증이 필요함
* 방화벽 포트를 최소화하고 싶음
* 신규 보안 파일 전송 시스템을 구축함

### FTPS가 적합한 경우

* 기존 FTP 클라이언트와 연동해야 함
* 거래처가 FTPS만 지원함
* TLS 인증서 기반 인증이 필요함
* FTP 업무 구조를 그대로 유지해야 함

### vsftpd가 적합한 경우

* Linux에 직접 FTP 또는 FTPS 서버를 구축함
* 익명 FTP나 기존 FTP 호환 기능이 필요함
* 사용자별 디렉터리와 전송 권한을 세밀하게 설정해야 함

### FTP가 제한적으로 적합한 경우

* 외부에 노출되지 않는 폐쇄망
* 전송 데이터가 민감하지 않음
* 구형 장비가 FTP만 지원함
* VPN 등 별도의 암호화된 통신 구간 안에서 사용함

이 경우에도 계정 제한, IP 접근 제어, 전용 VLAN, 최소 권한, 로그 모니터링 등의 보완책이 필요합니다.

## 10. 최종 결론

FTP는 파일 전송 기술의 기반을 만든 중요한 프로토콜이지만, 암호화되지 않는다는 근본적인 한계가 있습니다.

현재는 용도에 따라 다음과 같이 구분하는 것이 적절합니다.

* **일반적인 안전한 서버 파일 전송:** SFTP
* **기존 FTP 시스템의 보안 강화:** FTPS
* **Linux의 FTP·FTPS 서버 구축:** vsftpd
* **웹과 클라우드 애플리케이션:** HTTPS API·오브젝트 스토리지
* **평문 FTP:** 구형 시스템이나 통제된 폐쇄망에서만 제한적으로 사용

따라서 `vsftpd와 SFTP 중 무엇을 선택하는가`라는 질문보다는 다음처럼 표현하는 것이 정확합니다.

> FTP 계열이 필요하면 vsftpd로 FTPS 서버를 구축하고, FTP 호환성이 필요하지 않은 신규 Linux 환경이라면 OpenSSH 기반 SFTP를 우선 고려한다.

### 출처

* [RFC 959—File Transfer Protocol](https://www.rfc-editor.org/rfc/rfc959)
* [RFC 2228—FTP Security Extensions](https://www.rfc-editor.org/rfc/rfc2228)
* [RFC 2428—FTP Extensions for IPv6 and NATs](https://www.rfc-editor.org/rfc/rfc2428)
* [RFC 4217—Securing FTP with TLS](https://www.rfc-editor.org/rfc/rfc4217)
* [RFC 4253—SSH Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253)
* [vsftpd 공식 사이트](https://security.appspot.com/vsftpd.html)
* [OpenSSH 프로젝트 역사](https://www.openssh.com/history.html)
* [AWS Transfer Family 공식 문서](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)
* [Microsoft Azure Blob Storage SFTP 문서](https://learn.microsoft.com/en-us/azure/storage/blobs/secure-file-transfer-protocol-support)
* [Google Cloud SFTP 문서](https://docs.cloud.google.com/integration-connectors/docs/connectors/sftp/configure)

https://medium.com/@r62138808/one-smiley-face-one-root-shell-the-vsftpd-2-3-4-backdoor-in-metasploitable-2-9211680b2412