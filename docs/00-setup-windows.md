# 00. 윈도우 초기 세팅

Claude Code를 처음 깔고 이 레포에 접속할 때까지의 한 번만 하는 과정.

> **예상 소요 시간**: 30~45분 (네트워크 속도 포함)
> **필요한 것**: 윈도우 PC, 인터넷, GitHub 계정, 관리자 권한

---

## 0단계: 전체 그림

우리가 깔아야 할 것 3가지:
1. **Node.js** — Claude Code CLI가 돌아가는 엔진
2. **Git** — 코드를 GitHub에 올리고 내리는 도구
3. **Claude Code CLI** — 실제 AI와 대화하는 프로그램

이것들을 "PowerShell" 이라는 터미널에서 명령어로 설치해요.

> **터미널이 뭐야?** — 검은 창에 명령어를 쳐서 컴퓨터를 조종하는 곳. 마우스 대신 글로 명령하는 거라고 생각하면 돼요.

---

## 1단계: PowerShell 열기

1. 윈도우 키 누르고 `powershell` 입력
2. "Windows PowerShell" 우클릭 → **"관리자 권한으로 실행"** 클릭
3. "이 앱이 디바이스를 변경할 수 있도록 허용?" → 예

> ⚠️ 그냥 더블클릭 말고 **반드시 관리자 권한으로**. 그래야 설치 명령어가 먹혀요.

<!-- 스크린샷 자리: PowerShell 관리자 권한 실행 -->

---

## 2단계: Node.js 설치

PowerShell에 아래 명령어를 **복사해서 붙여넣기** (Ctrl+V) 후 엔터:

```powershell
winget install OpenJS.NodeJS.LTS
```

> **winget이 뭐야?** — 윈도우 10/11 기본 내장 패키지 매니저. 앱스토어의 명령어 버전.

설치 끝나면 확인:
```powershell
node --version
```

`v20.x.x` 같은 숫자가 나오면 성공. **안 나오면 PowerShell을 완전히 닫고 다시 열어서** 한 번 더 확인해봐요.

---

## 3단계: Git 설치

```powershell
winget install Git.Git
```

확인:
```powershell
git --version
```

`git version 2.x.x` 나오면 OK.

### Git 기본 정보 한 번만 설정

```powershell
git config --global user.name "동현"
git config --global user.email "형의 GitHub 이메일"
```

> 이거 안 하면 나중에 커밋할 때 에러 나요. **GitHub에 가입할 때 쓴 이메일**을 그대로 넣으세요.

---

## 4단계: Claude Code CLI 설치

```powershell
npm install -g @anthropic-ai/claude-code
```

> `-g`는 "global" — 컴퓨터 어디서든 `claude` 명령어를 쓸 수 있게 설치한다는 뜻.

확인:
```powershell
claude --version
```

---

## 5단계: 첫 인증

```powershell
claude
```

실행하면 브라우저가 열리거나 "여기 링크로 가서 로그인하세요" 메시지가 떠요. 로그인하면 끝.

> **로그인 어떻게?** — Claude.ai 계정 있으면 그거로, 없으면 만들어요. 구독 플랜에 따라 사용량 제한이 달라지니 형이 이미 가입한 상태로 쓰면 돼요.

---

## 6단계: 이 레포 Clone (내 컴퓨터로 복사)

작업할 폴더를 정해요. 보통 `C:\Users\{내이름}\dev` 밑에 둬요.

```powershell
cd $HOME
mkdir dev
cd dev
git clone https://github.com/finhyun/makesonggreatagain.git
cd makesonggreatagain
```

> **cd는 "change directory"** = 폴더 이동
> **mkdir는 "make directory"** = 폴더 만들기

여기까지 오면 `C:\Users\{내이름}\dev\makesonggreatagain` 안에 있는 거예요.

---

## 7단계: Claude Code 실행

```powershell
claude
```

시작 메시지가 뜨고 입력창이 나와요. 여기에 이렇게 쳐봐요:

```
/onboard-donghyun
```

→ 이게 **대화형 온보딩 스킬**이에요. 내가 지금 어디까지 왔는지 보고 다음에 뭐 할지 알려줘요.

---

## 막히면?

| 증상 | 해결 |
|------|------|
| `winget`이 안 먹힘 | 윈도우 11 / 10 최신 업데이트 필요. 수동 설치: [nodejs.org](https://nodejs.org/) |
| `npm install`에서 EACCES 에러 | PowerShell을 **관리자 권한**으로 다시 열어서 재시도 |
| `claude` 쳐도 "명령을 찾을 수 없음" | PowerShell 창 닫고 다시 열기. 그래도 안 되면 Node 재설치 |
| git clone이 안 됨 | GitHub 로그인 확인. private repo라서 인증이 필요할 수 있음 |
| 뭐가 뭔지 모르겠음 | 그냥 동생(일현)한테 전화 |

---

## 다음 단계

→ [02-git-basics.md](02-git-basics.md) — Git clone/commit/push 3가지 배우기
→ [03-claude-code-basics.md](03-claude-code-basics.md) — Claude Code 기본 사용법
