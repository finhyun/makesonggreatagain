# makesonggreatagain

송가네 재건 프로젝트 — **바이브 코딩 베이스캠프**.

형(동현)이 Claude Code + 바이브 코딩을 배우고, 게임·여러 프로젝트를 찍어나가기 위한 개인 레포.
동생(일현)이 초기 세팅과 참고 자료를 제공한다.

---

## 여기서 뭐부터 해?

Claude Code·터미널 처음이면 이 순서로:

1. **[docs/00-setup-windows.md](docs/00-setup-windows.md)** — 윈도우에 Node·Git·Claude Code CLI 설치
2. **[docs/02-git-basics.md](docs/02-git-basics.md)** — Git clone/commit/push 3가지만
3. **[docs/03-claude-code-basics.md](docs/03-claude-code-basics.md)** — Claude Code 첫 대화
4. **Claude Code를 레포 루트에서 실행 후 `/onboard-donghyun` 입력** — 대화형 온보딩 시작

맥이 도착하면:
- **[docs/01-move-to-mac.md](docs/01-move-to-mac.md)** — 맥으로 환경 이전

---

## 폴더 지도

```
makesonggreatagain/
├── README.md                       ← 지금 이 파일
├── CLAUDE.md                       ← AI가 이 레포에서 지켜야 할 규칙 (AI가 자동으로 읽음)
├── CLAUDE.local.md.template        ← 개인 선호 설정 템플릿 (복사해서 사용)
├── .gitignore                      ← Git이 무시할 파일 목록
│
├── docs/                           ← 완전 초보용 가이드
│   ├── 00-setup-windows.md         ← 윈도우 초기 세팅
│   ├── 01-move-to-mac.md           ← 맥 이전 가이드
│   ├── 02-git-basics.md            ← Git 3가지만
│   └── 03-claude-code-basics.md    ← Claude Code 기본 사용법
│
├── .claude/
│   └── skills/
│       └── onboard-donghyun/       ← 대화형 온보딩 스킬 (/onboard-donghyun)
│
└── user/
    ├── donghyun/                   ← 형의 실제 작업장 (여기서 자유롭게)
    └── ilhyun/                     ← 동생이 주는 참고 자료 (읽기용)
        ├── daily-workflows/        ← 일현이 매일 쓰는 루틴
        ├── favorite-skills/        ← 일현이 자주 쓰는 범용 스킬
        └── tips/                   ← 실전 팁 모음
```

---

## 규칙

- **내 작업 = `user/donghyun/` 안에서만** (실험·프로젝트·메모 전부 여기)
- **`user/ilhyun/`은 읽기 전용** (동생이 준 참고 자료. 수정 X)
- **CLAUDE.local.md**는 개인 파일이라 Git에 올라가지 않음 (템플릿 복사해서 직접 작성)
- 막히면 Claude Code에게 그냥 물어봐도 됨 — "이거 뭐야?" "이거 왜 안 돼?"

---

## 다음 한 걸음

터미널 처음 켠 거면 → [docs/00-setup-windows.md](docs/00-setup-windows.md) 맨 위부터.
