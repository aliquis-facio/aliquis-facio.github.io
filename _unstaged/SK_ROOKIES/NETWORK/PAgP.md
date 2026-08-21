**PAgP(Port Aggregation Protocol)**: Cisco 장비에서 여러 물리 포트를 하나의 논리적 링크인 **EtherChannel**로 묶기 위해 사용하는 **Cisco 전용 협상 프로토콜**입니다.

### 주요 역할

* 양쪽 스위치의 포트 설정이 호환되는지 확인
* 호환되는 포트만 EtherChannel에 포함
* 링크 상태 변화 감지
* 설정 오류로 잘못된 포트가 묶이는 것을 방지

### PAgP 동작 모드

| 모드          | 동작                        |
| ----------- | ------------------------- |
| `desirable` | PAgP 협상을 능동적으로 시작         |
| `auto`      | 상대방의 PAgP 요청을 기다리고 응답     |
| `on`        | 협상 없이 강제로 EtherChannel 구성 |

연결 조합은 다음과 같습니다.

| 한쪽 장비                             | 반대쪽 장비                            | 채널 형성                            |
| --------------------------------- | --------------------------------- | -------------------------------- |
| Desirable                         | Desirable                         | 가능                               |
| Desirable                         | Auto                              | 가능                               |
| <font color="#ff0000">Auto</font> | <font color="#ff0000">Auto</font> | <font color="#ff0000">불가능</font> |
| On                                | On                                | 가능하지만 PAgP 미사용                   |
| On                                | Desirable/Auto                    | 불가능                              |

`auto + auto`는 양쪽 모두 협상을 시작하지 않기 때문에 EtherChannel이 형성되지 않습니다.

### PAgP와 LACP 비교

| 구분         | PAgP                      | LACP                              |
| ---------- | ------------------------- | --------------------------------- |
| 정식 명칭      | Port Aggregation Protocol | Link Aggregation Control Protocol |
| 표준         | Cisco 전용                  | IEEE 표준                           |
| 능동 모드      | `desirable`               | `active`                          |
| 수동 모드      | `auto`                    | `passive`                         |
| 호환성        | 주로 Cisco 장비               | 여러 제조사 장비                         |
| 일반적인 활성 포트 | 최대 8개                     | 최대 8개                             |
| 추가 대기 포트   | 일반적으로 없음                  | 장비에 따라 최대 8개                      |

### 핵심 정리

> **PAgP는 Cisco 장비끼리 EtherChannel을 자동으로 협상해 구성하는 프로토콜**입니다.

멀티벤더 환경에서는 표준 프로토콜인 **[LACP](LACP.md)를 사용하는 것이 일반적**이며, PAgP는 Cisco 장비 중심의 기존 네트워크에서 주로 볼 수 있습니다.

## 관련 문서

- [Q. ETH CHANNEL은 왜 최대 8개일까?](ETH%20CHANNEL.md)
