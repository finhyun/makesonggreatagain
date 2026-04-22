# 01. 맥으로 이전하기

맥북이 배송 온 이후, 윈도우에서 쓰던 Claude Code 환경을 맥으로 옮기는 가이드.

> **예상 소요 시간**: 20~30분 (윈도우 초기 세팅보다 조금 쉬움)
> **사전 조건**: [00-setup-windows.md](00-setup-windows.md)를 먼저 돌려본 상태 (개념이 같음)

---

## 맥이 윈도우보다 쉬운 이유

맥에는 **터미널이 기본 내장**돼 있고, 개발 도구 설치가 더 단순해요.

설치할 것도 동일한 3가지:
1. **Homebrew** — 맥용 패키지 매니저 (winget 역할)
2. **Node.js + Git** — Homebrew로 한 번에
3. **Claude Code CLI** — npm으로

---

## 1단계: 터미널 앱 열기

- `Command + Space` → "터미널" 입력 → 엔터
- 또는 `Applications / 응용 프로그램 > 유틸리티 > 터미널`

검은 창(또는 흰 창)이 뜨면 OK.

---

## 2단계: Homebrew 설치

터미널에 복사해서 붙여넣기:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

중간에 비밀번호를 물어봐요 → **맥 로그인 비밀번호** 입력 (터미널은 보안상 비번이 안 보여요. 그냥 쳐도 입력은 돼요).

설치 끝나면 화면에 나오는 **"Next steps" 명령어 2~3줄**을 그대로 복사해서 실행하세요. (Homebrew를 PATH에 등록하는 과정)

확인:
```bash
brew --version
```

---

## 3단계: Node.js + Git 설치

```bash
brew install node git
```

> 맥은 Git이 기본 내장된 경우도 있지만, 최신 버전으로 덮어씌우는 게 안전해요.

확인:
```bash
node --version
git --version
```

---

## 4단계: Claude Code CLI 설치

```bash
npm install -g @anthropic-ai/claude-code
```

> 만약 `EACCES` 에러가 나면 `sudo npm install -g @anthropic-ai/claude-code` 로 재시도.

확인:
```bash
claude --version
```

---

## 5단계: Git 사용자 정보 (윈도우랑 동일하게)

```bash
git config --global user.name "동현"
git config --global user.email "형의 GitHub 이메일"
```

---

## 6단계: Claude 인증

```bash
claude
```

브라우저 열어서 로그인. 윈도우에서 했던 거랑 똑같은 계정으로.

---

## 7단계: 레포 Clone

```bash
cd ~
mkdir -p dev
cd dev
git clone https://github.com/finhyun/makesonggreatagain.git
cd makesonggreatagain
```

> `~`는 내 홈 폴더 (`/Users/{내이름}`) 를 뜻해요.

---

## 8단계: 윈도우 쪽 작업물 가져오기 (선택)

윈도우에서 작업하던 게 있으면:

### 방법 A — GitHub 경유 (추천)

윈도우에서:
```powershell
cd C:\Users\{내이름}\dev\makesonggreatagain
git add .
git commit -m "맥으로 이전하기 전 작업 저장"
git push
```

맥에서:
```bash
cd ~/dev/makesonggreatagain
git pull
```

→ 모든 작업이 맥으로 따라옴.

### 방법 B — 직접 복사

USB나 에어드롭으로 `makesonggreatagain` 폴더째 옮겨도 되긴 해요.
단, `.git` 폴더까지 전부 복사해야 Git 이력이 살아있어요.

---

## 9단계: CLAUDE.local.md 다시 만들기

`CLAUDE.local.md`는 Git에 안 올라가니까 맥에서 새로 만들어야 해요.

```bash
cp CLAUDE.local.md.template CLAUDE.local.md
```

그 다음 `CLAUDE.local.md`를 열어서 내 정보로 채워요.

> 윈도우에 만들어둔 내용이 있으면 그걸 보고 똑같이 옮겨적으면 돼요.

---

## 10단계: 확인

```bash
claude
```

실행 후 입력창에:
```
/onboard-donghyun
```

→ 내 진행 상태를 기억하고 "지금 여기까지 왔네, 다음 할 일은 이거예요" 알려줘요.

---

## 맥 VS 윈도우 차이 정리

| 항목 | 윈도우 | 맥 |
|------|-------|---|
| 터미널 | PowerShell | 터미널 (기본 내장) |
| 패키지 매니저 | winget | Homebrew (brew) |
| 경로 구분자 | `\` (백슬래시) | `/` (슬래시) |
| 홈 폴더 | `C:\Users\{이름}` | `/Users/{이름}` 또는 `~` |
| 기본 쉘 | PowerShell | zsh |

> **명령어 99%는 둘 다 똑같이 동작**해요. `cd`, `ls`, `git`, `npm`, `claude` 전부.

---

## 맥 전용 꿀팁

- **Cmd+C / Cmd+V** (윈도우는 Ctrl) — 복사 붙여넣기
- **Cmd+Space** → 앱 검색 (스포트라이트)
- **터미널에서 폴더 열기**: `open .` (현재 폴더가 Finder로 열림)
- **폴더에서 터미널 열기**: Finder에서 폴더 우클릭 → "폴더에서 새로운 터미널 열기"

---

## 막히면?

| 증상 | 해결 |
|------|------|
| `brew install` 권한 에러 | Homebrew 재설치 (Apple Silicon과 Intel Mac 경로가 다를 수 있음) |
| `zsh: command not found: claude` | 터미널 재시작. 그래도 안 되면 `npm install -g @anthropic-ai/claude-code` 재실행 |
| git push에서 인증 실패 | GitHub CLI 설치: `brew install gh` → `gh auth login` |
| 키체인 관련 팝업 | "항상 허용" 누르고 맥 비번 입력 |

---

## 다음 단계

이제 윈도우 때랑 똑같이 쓰면 돼요.
→ [03-claude-code-basics.md](03-claude-code-basics.md) 로 가면 Claude Code 기본 사용법.
