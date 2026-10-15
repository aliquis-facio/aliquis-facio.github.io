Windows에서 **처음 설치하는 기준**입니다. 아래는 이번에 연결을 확인한 **Ghidra 12.1.4 + GhidraMCP 2.0.0** 조합입니다.

연결 구조는 다음과 같습니다.

```text
Codex
  └─ Python MCP 서버 실행 — stdio 통신
       └─ GhidraMCPPlugin 연결 — http://127.0.0.1:8080
            └─ Ghidra에서 열어 둔 바이너리 분석
```

1. **필수 프로그램 설치**

   | 프로그램 | 준비 사항 |
   |---|---|
   | Java JDK | 64비트 JDK 21 이상 |
   | Python | 3.10 이상, 이번 환경에서는 3.11 사용 |
   | Ghidra | 12.1.4 압축 해제 |
   | Codex | 앱 설치 및 로그인 |

   Python 설치 시 **Add python.exe to PATH**를 선택합니다. PowerShell에서 확인합니다.

   ```powershell
   java -version
   python --version
   ```

   Ghidra는 압축을 푼 폴더의 `ghidraRun.bat`로 실행합니다. Java 경로를 물으면 JDK 설치 폴더를 지정합니다.

2. **GhidraMCP 파일 다운로드**

   [GhidraMCP Releases](https://github.com/LaurieWired/GhidraMCP/releases)에서 다음 파일을 준비합니다. 배포 압축파일 안에 들어 있다면 먼저 압축을 풉니다.

   - Ghidra 확장: `ghidra_12.1.4_PUBLIC_<날짜>_GhidraMCP.zip`
   - Python 서버: `ghidra_mcp-2.0.0-py3-none-any.whl`

   **확장 ZIP에 적힌 Ghidra 버전과 설치한 Ghidra 버전이 일치해야 합니다.** 확장 ZIP 자체는 압축을 풀지 않고 Ghidra에 설치합니다. [GhidraMCP 설치 안내](https://github.com/LaurieWired/GhidraMCP#installation)

3. **Ghidra 확장 설치 및 활성화**

   Ghidra 프로젝트 관리 창에서 다음 순서로 진행합니다.

   ```text
   File → Install Extensions → + → GhidraMCP 확장 ZIP 선택
   ```

   설치 후 Ghidra를 완전히 종료했다가 다시 실행합니다.

   프로젝트를 만들거나 연 뒤, 초록색 용 아이콘을 눌러 **CodeBrowser**를 실행합니다. CodeBrowser에서 다음 항목을 켭니다.

   ```text
   File → Configure → Developer → GhidraMCPPlugin 체크
   ```

   `New Plugins Found!` 창이 뜬다면 그 창에서 체크해도 됩니다. 이후 **File → Save Tool**로 설정을 저장합니다.

   기본 서버 주소는 `http://127.0.0.1:8080/`입니다. 포트는 `Edit → Tool Options → GhidraMCP HTTP Server`에서 확인할 수 있습니다. [플러그인 활성화 안내](https://github.com/LaurieWired/GhidraMCP#ghidra)

4. **Python MCP 서버 설치**

   예시에서는 다운로드한 wheel 파일을 `C:\Users\jeony\Downloads\GhidraMCP`에 두었다고 가정합니다. 실제 위치에 맞게 마지막 명령의 경로를 수정하세요.

   PowerShell에서 실행합니다.

   ```powershell
   python -m venv "$env:USERPROFILE\Tools\GhidraMCP\.venv"

   & "$env:USERPROFILE\Tools\GhidraMCP\.venv\Scripts\python.exe" -m pip install "C:\Users\jeony\Downloads\GhidraMCP\ghidra_mcp-2.0.0-py3-none-any.whl"
   ```

   설치를 확인합니다.

   ```powershell
   & "$env:USERPROFILE\Tools\GhidraMCP\.venv\Scripts\python.exe" -m ghidra_mcp --help
   ```

   사용법이 출력되면 정상입니다. 가상환경을 별도로 활성화할 필요는 없습니다.

5. **Codex에 MCP 서버 등록**

   PowerShell에서 실행합니다.

   ```powershell
   codex mcp add ghidra -- "$env:USERPROFILE\Tools\GhidraMCP\.venv\Scripts\python.exe" -m ghidra_mcp --transport stdio --ghidra-server http://127.0.0.1:8080/
   ```

   `codex` 명령을 찾을 수 없다면, 사용자 폴더의 `.codex\config.toml`에 다음 설정을 직접 추가해도 됩니다. 사용자 이름과 Python 경로는 실제 설치 위치에 맞춥니다.

   ```toml
   [mcp_servers.ghidra]
   command = 'C:\Users\jeony\Tools\GhidraMCP\.venv\Scripts\python.exe'
   args = [
     "-m", "ghidra_mcp",
     "--transport", "stdio",
     "--ghidra-server", "http://127.0.0.1:8080/"
   ]
   ```

   **명령으로 등록하거나 설정 파일에 직접 추가하는 방법 중 하나만 사용하면 됩니다.** Codex는 이 설정으로 Python MCP 서버를 실행합니다. [OpenAI 공식 MCP 설정 안내](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

6. **연결 확인 및 사용**

   Ghidra와 CodeBrowser를 켠 상태에서 PowerShell로 백엔드를 확인합니다.

   ```powershell
   Invoke-RestMethod http://127.0.0.1:8080/health |
     ConvertTo-Json -Depth 5
   ```

   응답에 `"status": "ok"`가 있으면 Ghidra 플러그인이 정상 작동 중입니다.

   Codex 등록 여부는 다음 명령으로 확인합니다.

   ```powershell
   codex mcp list
   codex mcp get ghidra
   ```

   등록 후 Codex를 재시작하고 새 채팅을 엽니다. Ghidra에서 분석할 바이너리를 가져와 CodeBrowser로 연 다음, 이렇게 요청하면 됩니다.

   > Ghidra MCP로 현재 열린 프로그램 정보를 확인하고 함수 목록을 보여줘.

   | 증상 | 확인할 내용 |
   |---|---|
   | 확장 버전 불일치 | Ghidra 버전과 확장 ZIP 버전 일치 여부 |
   | `8080` 연결 실패 | CodeBrowser 실행 및 GhidraMCPPlugin 체크 여부 |
   | `No module named ghidra_mcp` | 패키지를 설치한 가상환경의 Python 경로인지 확인 |
   | `No program is open` | 분석할 바이너리를 CodeBrowser에서 열기 |
   | Codex에 도구가 안 보임 | 등록 경로 확인 후 Codex 재시작 |

https://velog.io/@ollehmy/Ghidra-mcp-%EB%A5%BC-Codex-CLI%EC%97%90-%EB%B6%99%EC%9D%B4%EA%B8%B0