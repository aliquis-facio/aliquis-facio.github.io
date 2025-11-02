# 보안의 속성
## 1. 전통적 3요소 C.I.A.

![Alt Images](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-20-40.jpg?raw=true)

### 1.1. Confidentiality(기밀성)

: 인가된 사용자만 정보 자산에 접근할 수 있다. 허가되지 않은 정보 공개를 방지한다.
도구:
- Encryption(암호화): 
- Access control(접근 통제)
	- Authentication(인증)
		- 인증 방법 4가지:
			1. 알고 있는 것: 머릿속에 기억하고 있는 정보를 이용해 인증을 수행한다.
			2. 가지고 있는 것: 신분증이나 OTP(One Time Password) 장치 등으로 인증을 수행한다.
			3. 자신의 모습: 홍채 같은 생체 정보로 인증을 수행한다.
			4. 위치하는 곳: 현재 접속을 시도하는 위치의 적절성을 확인하거나 콜백을 이용해 인증을 수행한다.
	- Authorization(권한 부여)
- Physical security(물리적 보안)

### 1.2. Integrity(무결성)
- **무결성(Integrity)**: 정보가 비인가로 변경되지 않았음을 보장.
	- 도구: 백업, 체크섬, 오류정정코드.

### 1.3. Availability(가용성)
- **가용성(Availability)**: 허가된 사용자가 적시에 접근·수정 가능.
	- 도구: 물리적 보호, 계산/저장 자원의 중복화.

## 2. 추가, 확장된 요소 A.A.A.

![Alt Images|394x24](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-22-19.jpg?raw=true)

### Assurance(보증)
- **Assurance(보증)**: 컴퓨터 시스템에서 신뢰를 어떻게 제공·관리하는지에 대한 개념.
	- 신뢰 관리는 **정책(Policies)**, **권한(Permissions)**, **보호(Protections)** 세 축으로 구성.
		- **정책(policies)**
			- **의미**: 조직, 시스템, 혹은 개인이 **어떤 행동이 허용되고 금지되는지 명시적으로 규정한 규칙**
			- **목적**: 보안 목표(기밀성, 무결성, 가용성)를 유지하기 위한 **행동 기준**을 설정
		-  **권한 (Permissions)**
			- **의미**: 정책에 따라 **특정 행위를 수행할 수 있는 권리나 허용 범위**
			- **주체**: 사용자, 프로세스, 애플리케이션 등
		-  **보호 (Protections)**
			- **의미**: 정의된 **권한과 정책을 실제로 강제(enforce)** 하기 위한 **기술적 또는 관리적 메커니즘**
			- **목적**: 정책 위반이나 권한 남용을 방지

### Authenticity(진위)
- **Authenticity(진위)**: 사람이나 시스템이 발행한 진술·정책·권한이 **진짜**인지 판단하는 능력.
	- 도구: **디지털 서명**
	- ![Alt Images|94x24](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-22-50.jpg?raw=true)

### Anonymity(익명성)
- **Anonymity(익명성)**: 특정 기록/거래가 **개인에게 귀속되지 않음**을 의미.
	- ![Alt Images|94x24](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@main/_image/2025-10-20-17-23-01.jpg?raw=true)
	- 도구: **집계(aggregation)**, **믹싱(mixing)**, **프록시(proxies)**, **가명(pseudonyms)** 등

---

# 참고

- [Tistory: [정보보호개론] 보안의 속성(CIA triad, AAA triad)](https://junbyeol.tistory.com/20)
- [Velog: Security](https://velog.io/@kimjihong9/Security)
- 