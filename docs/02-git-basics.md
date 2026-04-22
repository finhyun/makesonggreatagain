# 02. Git 기본기 — 3가지만

완전 초보용. **clone / commit / push** 이 3개만 먼저 몸에 붙이면 95% 해결돼요.

> Git은 "코드의 세이브 파일"이에요. 게임에서 저장 후 불러오기 하듯, 작업을 저장하고 GitHub에 올리는 도구.

---

## 개념 한 줄 정리

| 용어 | 비유 | 실제 의미 |
|------|------|---------|
| **Repository (레포)** | 게임 세이브 폴더 | 프로젝트 전체를 담는 그릇 |
| **Clone** | 세이브 파일 다운로드 | 서버에서 내 컴퓨터로 복사 |
| **Commit** | 체크포인트 저장 | "여기까지 작업 완료"로 박아놓는 것 |
| **Push** | 세이브를 클라우드에 올림 | 내 커밋을 GitHub에 반영 |
| **Pull** | 서버 세이브로 덮어씌우기 | GitHub의 최신을 내 컴퓨터로 |

---

## Rule #1: Clone — 레포 내려받기

처음 한 번만 해요.

```bash
git clone https://github.com/finhyun/makesonggreatagain.git
cd makesonggreatagain
```

끝. 이제 내 컴퓨터 안에 레포 복사본이 있어요.

> 이후부터는 이 폴더 안에서 작업해요.

---

## Rule #2: Commit — 작업 저장

파일을 바꾸거나 새로 만든 다음, "저장"하는 단계.

### 3줄 공식

```bash
git add .
git commit -m "여기에 뭘 바꿨는지 한 줄 메모"
git push
```

세 줄이지만 뜻은 이거예요:
1. **add .** — "이 폴더에서 바뀐 거 전부 저장 준비"
2. **commit -m "..."** — "이 이름으로 체크포인트 박음"
3. **push** — "GitHub 서버에 올림"

### 커밋 메시지 예시

좋은 메시지:
```
"첫 HTML 페이지 만들기"
"버튼 누르면 색 바뀌는 기능 추가"
"오타 수정"
```

나쁜 메시지 (다음에 보면 뭘 한 건지 모름):
```
"저장"
"update"
"asdf"
```

> 30초 투자해서 "내가 뭘 했는지" 써두면 3개월 뒤의 내가 고마워해요.

---

## Rule #3: Push 전에 Pull

**여러 기기(윈도우↔맥)에서 같은 레포 쓸 때 필수.**

작업 시작 전에:
```bash
git pull
```

→ GitHub 서버의 최신 상태를 내 컴퓨터로 가져와요.

### 왜?

- 윈도우에서 A 파일 수정 → push
- 맥에서 pull 안 하고 작업 → push 시도
- **충돌(conflict) 발생!** → 수습하는 게 복잡함

**습관**: `claude` 켜자마자 `git pull`부터. 30초 투자로 사고 방지.

---

## 자주 쓸 명령어 3개 더 (Bonus)

### status — 지금 뭐가 바뀐 상태야?

```bash
git status
```

- 수정된 파일 목록
- 아직 add 안 한 파일
- 커밋 안 된 것들

> **"뭐 하고 있었지?" 싶을 때 제일 먼저 치는 명령어.**

### log — 내가 지금까지 뭐 했는지

```bash
git log --oneline -10
```

최근 10개 커밋 메시지가 한 줄씩 나와요.

### diff — 뭐가 바뀌었는지 보기

```bash
git diff
```

파일별로 빨간색(지운 줄) / 초록색(추가한 줄)로 보여줘요.

---

## 실수했을 때 (초보가 자주 만나는 상황)

### "커밋 메시지를 잘못 썼어요"

아직 push 안 한 상태면:
```bash
git commit --amend -m "새로운 메시지"
```

### "방금 수정한 걸 되돌리고 싶어요"

**커밋하기 전 상태로 되돌리기**:
```bash
git checkout -- 파일이름
```

### "파일을 실수로 지웠어요"

커밋 전이면:
```bash
git checkout -- 파일이름
```
으로 복구 가능.

커밋 후에도 `git log`에서 이전 커밋을 찾아서 복구할 수 있지만, 이건 Claude에게 물어보는 게 빨라요.

> **원칙**: 뭔가 이상하면 **아무것도 하지 말고** Claude에게 `git status` 결과를 보여주며 물어봐요. Git은 되돌리기 어렵게 만드는 명령어(reset --hard, push --force)가 있어서 초보 때는 조심.

---

## 하지 말아야 할 것 3가지

| ❌ 하지 마 | 이유 |
|----------|------|
| `git reset --hard` | 작업물 영구 삭제 가능 |
| `git push --force` | 다른 사람 작업 지워버릴 수 있음 |
| `.env`·비밀번호 파일 커밋 | GitHub에 비밀키가 공개됨 |

위 3개 중 하나라도 쳐야 할 상황이 오면 **무조건 Claude한테 먼저 물어봐요**.

---

## 하루 작업 흐름 예시

```bash
# 아침에 작업 시작
cd ~/dev/makesonggreatagain
git pull                              # GitHub 최신 반영

claude                                # Claude Code 실행
# ... 작업 ...

# 점심 전에 중간 저장
git add .
git commit -m "버튼 UI 1차 완성"
git push

# ... 또 작업 ...

# 저녁 마무리
git add .
git commit -m "폰트 바꾸고 배경 추가"
git push
```

**3~4시간마다 한 번씩** commit + push 습관이 들면, 하루 날려먹을 일이 없어요.

---

## 다음 단계

→ [03-claude-code-basics.md](03-claude-code-basics.md) — Claude Code 첫 대화·슬래시 커맨드
