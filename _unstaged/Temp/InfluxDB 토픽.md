아래는 **HA Add-on Mosquitto** 환경에서 쓰기 좋은, 실전형 **MQTT 토픽 설계 가이드(v1)** 입니다.  
목표: mTLS+ACL 격리, Influx/Grafana 분석 용이, 커스텀 퍼블리셔와 HA 공존.

---

# 1) 네임스페이스 & 식별자

```
care/v1/{site}/{device}/{component}/{signal}
```

- `site` : 설치 장소 식별자(예: `home`, `apt101`, `lab1`)
    
- `device` : mTLS **CN과 동일**(예: `esp32-001`, `z2m-bridge`, `nodered-01`)
    
- `component` : 센서/액추에이터/로직 모듈명(예: `temp`, `hum`, `relay`, `pir`, `airq`)
    
- `signal` : `state` | `cmd` | `attr` | `availability` | `cfg` | `log`
    

문자 규칙: `[a-z0-9][a-z0-9\-]{0,30}` (소문자/숫자/하이픈)  
버전 고정: `v1`(호환성 변경 시에만 `v2`로 승격)

---

# 2) 채널 의미(표준)

|signal|발행 주체|retain|QoS|용도|
|---|---|--:|--:|---|
|`state`|디바이스|✅|1|실시간 측정값/상태(최신값 유지)|
|`cmd`|서버/HA|❌|1|제어 명령(버튼/토글/목표치)|
|`attr`|디바이스|✅|1|속성/메타(기기명, 펌웨어, 단위 등)|
|`availability`|디바이스(LWT)|✅|1|온라인/오프라인( `online`/`offline` )|
|`cfg`|서버→디바이스|✅|1|구성 파라미터(주기, 임계값 등)|
|`log`|디바이스/서버|❌|0|이벤트/디버그 로그(고빈도 가능)|

---

# 3) 페이로드 스키마

## 3.1 단일 값(경량)

- `state` (숫자/불리언/문자열): **원시값**을 그대로 전송
    
    - 예: `23.6` / `true` / `"ON"`
        

## 3.2 구조화(JSON)

- 복합값, 배치 전송, 분석 메타 필요 시:
    

```json
{
  "ts": 1737512345678,          // epoch_ms (UTC)
  "val": 23.6,                  // 주 값 (state일 때)
  "fields": { "pm25": 12, "pm10": 28 },  // 복수 측정값일 때
  "unit": "°C",                 // 또는 각 필드별 단위는 attr로
  "tags": { "room": "living" }, // 선택: 분석용 태그
  "src": "esp32-001"            // 선택: 발신자
}
```

권장:

- **숫자/불리언은 단일값** 우선. 필요 시만 JSON(위 스키마로 통일).
    
- `ts`는 **epoch_ms**. (미포함 시 브로커 수신 시각 사용)
    

---

# 4) 예시 토픽/메시지

### 센서 상태

```
care/v1/home/esp32-001/temp/state        -> 23.6
care/v1/home/esp32-001/hum/state         -> 45.1
care/v1/home/esp32-001/airq/state        -> {"ts":1737512345678,"fields":{"pm25":12,"pm10":28}}
```

### 액추에이터 제어

```
# 서버 → 디바이스
care/v1/home/esp32-001/relay/cmd         -> "ON" | "OFF"

# 디바이스 → 서버 (현재 상태)
care/v1/home/esp32-001/relay/state       -> "ON"
```

### 가용성(LWT)

```
care/v1/home/esp32-001/device/availability -> "online" | "offline"
```

### 속성/메타

```
care/v1/home/esp32-001/device/attr ->
{
  "fw":"1.2.3",
  "model":"esp32s3",
  "units":{"temp":"°C","hum":"%","pm25":"µg/m³"},
  "hw_rev":"A1"
}
```

### 구성(서버→디바이스)

```
care/v1/home/esp32-001/device/cfg ->
{
  "interval_ms": 1000,
  "thresholds": {"pm25_warn":35}
}
```

---

# 5) Retain/QoS 규칙(요약)

- `state`: retain=**true**, QoS=**1** (재부팅 후 최신값 즉시 제공)
    
- `availability`: retain=**true**, QoS=**1** (LWT)
    
- `cmd`: retain=**false**, QoS=**1** (중복 실행 방지)
    
- `attr`/`cfg`: retain=**true**, QoS=**1**
    
- `log`: retain=**false**, QoS=**0** (고빈도/베스트에포트)
    

---

# 6) LWT/Birth(디바이스 측)

- 연결 시:
    
    - `birth`: `availability -> "online"` 발행
        
- 브로커와 연결 끊김 시:
    
    - LWT: `availability -> "offline"` 자동 발행
        
- 예: ESPHome/paho-mqtt에서 will 설정, birth 메시지 퍼블리시
    

---

# 7) ACL( mTLS + `use_identity_as_username true` 가정 )

Mosquitto 설정:

```
require_certificate true
use_identity_as_username true   # 클라 인증서 CN → username
```

ACL 템플릿( `/share/mosquitto/acl` ):

```
# 디바이스별 격리
user esp32-001
topic read  care/v1/home/esp32-001/+/cfg
topic read  care/v1/home/esp32-001/+/cmd
topic write care/v1/home/esp32-001/+/state
topic write care/v1/home/esp32-001/+/attr
topic write care/v1/home/esp32-001/device/availability
topic write care/v1/home/esp32-001/log

# HA/서버(제어 & 수집)
user ha
topic readwrite care/v1/home/+/+/+
```

멀티 사이트 운영 시 `site`별 그룹 사용자로 확장:

```
pattern readwrite care/v1/%G/+/+/+
```

---

# 8) Influx 라인프로토콜(참고)

- measurement = `component`
    
- tags = `site`, `device`, (선택)`room` 등
    
- fields = `val` 또는 `fields` 키 내부
    

예(온도 단일값):

```
temp,site=home,device=esp32-001 val=23.6 1737512345678000000
```

예(공기질 복합):

```
airq,site=home,device=esp32-001 pm25=12i,pm10=28i 1737512345678000000
```

---

# 9) Telegraf(원시 MQTT 수집 시) 최소 설정

```toml
[[inputs.mqtt_consumer]]
  servers   = ["ssl://192.168.0.23:8883"]
  topics    = ["care/v1/+/+/+/state", "care/v1/+/+/+/attr", "care/v1/+/+/+/availability", "care/v1/+/+/+/log"]
  qos       = 1
  client_id = "telegraf"
  tls_ca    = "/etc/telegraf/certs/ca.crt"
  tls_cert  = "/etc/telegraf/certs/telegraf.crt"
  tls_key   = "/etc/telegraf/certs/telegraf.key"
  data_format = "json"          # 단일값 채널은 processors로 캐스팅

# 단일값(state) 캐스팅 예시
[[processors.regex]]
  namepass = ["mqtt_consumer"]
  [[processors.regex.fields]]
    key = "value"
    pattern = "^(\\d+\\.?\\d*)$"
    replacement = "${1}"
    result_key = "val"
```

---

# 10) 마이그레이션/버전 전략

- 신규부터 `care/v1/...` 채택
    
- 규약 변경 시 `v2` 병행 발행(이중화 기간) → 구독 측 전환 완료 후 `v1` 종료
    

---

# 11) HA와의 공존

- **엔티티 중심 장치**(ESPHome, 정식 통합)는 **디스커버리 규약 그대로** 사용
    
- **커스텀 퍼블리시**가 필요한 디바이스만 위 **토픽 규칙(v1)** 채택
    
- 필요 시 MQTT → HA 센서 매핑(template)으로 엔티티화
    

---

## 빠른 스타터(당신 환경)

- 사이트: `home` 고정
    
- 디바이스ID=클라 인증서 CN
    
- 바로 쓰는 예:
    

```
# temp/hum 센서
care/v1/home/esp32-001/temp/state  -> 23.6
care/v1/home/esp32-001/hum/state   -> 45.1

# 릴레이 제어
care/v1/home/esp32-001/relay/cmd   -> "ON"
care/v1/home/esp32-001/relay/state -> "ON"

# LWT
care/v1/home/esp32-001/device/availability -> "online"
```

필요하면 **당신 장치 목록** 기준으로 `site/device/component` 카탈로그와  
ACL 파일을 **자동 생성**하는 스크립트까지 바로 만들어 드리겠습니다.