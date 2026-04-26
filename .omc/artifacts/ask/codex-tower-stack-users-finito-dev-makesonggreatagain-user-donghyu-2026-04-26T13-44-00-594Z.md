# codex advisor artifact

- Provider: codex
- Exit code: 0
- Created at: 2026-04-26T13:44:00.596Z

## Original task

# 탑 쌓기(tower-stack) 난이도 상향 + 배틀 모드 구성

## 대상 파일
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html`

이 파일은 vanilla JS + Canvas 단일 HTML. 현재 콤보·시드·테마·WebAudio 효과음 등이 이미 들어있다. 리뷰 후 아래 두 가지를 추가하라.

## 작업 1: 난이도 모드 토글 (Easy / Normal / Hard)

### 요구사항
- 상단/하단 toolbar에 모드 선택 버튼 3개 (Easy / Normal / Hard)
- localStorage 키 `mksga_tower_mode_v1`로 영구 저장
- 모드 변경 시 자동으로 새 게임 시작
- 화면에 현재 모드 표시 (작은 라벨)

### 모드별 파라미터 차이
| 항목 | Easy | Normal (현재) | Hard |
|------|------|---------------|------|
| 기본 속도 | 1.4 + score*0.08 | 1.8 + score*0.12 | 2.4 + score*0.18 |
| 최대 속도 | 4.0 | 5.5 | 7.5 |
| 흔들리는 블록 등장 점수 | 50+ | 30+ | 15+ |
| 흔들림 진폭 | 4~8 | 6~14 (현재) | 10~22 |
| 가속/멈춤 패턴 빈도 | 낮음 (multTimer 기본 1.5x) | 현재 | 높음 (multTimer 기본 0.7x) |
| 블록 폭 점진 축소 | 없음 | 없음 | 매 10블록마다 BASE_WIDTH * 0.95 비율로 천천히 축소 (Hard에서만) |
| 시야 안개 (Hard 전용) | X | X | 점수 50+에서 캔버스 상단에 흐릿한 안개 띠 (블록 사이드 일부 가림) |
| PERFECT_THRESH | 8 | 6 | 4 |

### 구현 힌트
- 현재 `spawnMoving()` / `getTheme()` / `update()` / 충돌판정 부분의 상수를 모드에 따라 분기
- 모드 객체 `MODES = { easy: {...}, normal: {...}, hard: {...} }` 만들고 `currentMode` 참조하는 구조 권장

## 작업 2: 로컬 2인 Split-Screen 배틀 모드

### 요구사항
- toolbar에 **"⚔️ 배틀 모드"** 토글 버튼 추가
- 배틀 모드 ON 시:
  - 캔버스 가로로 2분할 (좌=P1, 우=P2)
  - 두 플레이어 모두 **같은 시드** 사용 (공정성 — 같은 블록 패턴이 양쪽에 똑같이 등장)
  - 키 입력:
    - P1: Space, 좌측 캔버스 클릭/터치
    - P2: Enter, 우측 캔버스 클릭/터치
  - 두 플레이어 점수 별도 표시 (좌상단/우상단)
  - **한쪽이 게임오버되면**: 그쪽은 정지, 상대는 5초 카운트다운 후 자동 종료 (시간 안에 더 쌓아도 한쪽이 끝났으니 결판)
  - **결과 화면**: 승자 표시 ("P1 승!" / "P2 승!" / "무승부"), 양쪽 점수 비교, "리매치" 버튼 (같은 시드로 재시작) + "새 시드" 버튼

### 구현 힌트
- 현재 single-player 상태(blocks, movingBlock, score, combo 등)를 P1/P2 객체로 분리
- 두 플레이어 게임 로직 각각 update/draw, 시드 RNG는 **각 플레이어가 독립 PRNG 인스턴스 보유**하되 **같은 시드값으로 시작** → 결정론적이라 양쪽이 똑같은 패턴
- draw 시 각자의 viewport에 ctx.translate / ctx.clip으로 그리기 (또는 절반 width 캔버스 두 개로 그리기 — 단일 캔버스 분할이 더 깔끔)
- 모드 토글, 난이도 모드와 직교(orthogonal): 배틀 모드는 모든 난이도와 조합 가능

### Split-Screen 레이아웃
- 캔버스를 모드 ON 시 더 넓게 (예: 720px) → 좌측 360px = P1, 우측 360px = P2
- 가운데 1px 세로 라인으로 분리
- 모바일에서는 약간 좁아질 수 있으니 반응형 처리 (최소 600px)

## 공통 제약

- 외부 라이브러리 / 외부 파일 X (vanilla JS only)
- 기존 기능 유지: 콤보, 영구 베스트, 시드 공유, 테마, 효과음, 진동, 파티클
- 한국어 주석 OK
- 코드 길어지면 `<script>` 안에서 섹션 주석으로 정리 (`// ── Battle Mode ──`)

## 검증

작업 후 다음을 보고하라:
1. 모드 토글 동작 확인 (3가지 모드 차이가 실제 코드 분기로 들어갔는지)
2. 배틀 모드에서 양쪽 시드/패턴 동기화 확인
3. JS 구문 에러 없음 (`node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 통과)
4. 파일 크기, 라인 수
5. 변경 핵심 5줄 요약

## Final prompt

# 탑 쌓기(tower-stack) 난이도 상향 + 배틀 모드 구성

## 대상 파일
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html`

이 파일은 vanilla JS + Canvas 단일 HTML. 현재 콤보·시드·테마·WebAudio 효과음 등이 이미 들어있다. 리뷰 후 아래 두 가지를 추가하라.

## 작업 1: 난이도 모드 토글 (Easy / Normal / Hard)

### 요구사항
- 상단/하단 toolbar에 모드 선택 버튼 3개 (Easy / Normal / Hard)
- localStorage 키 `mksga_tower_mode_v1`로 영구 저장
- 모드 변경 시 자동으로 새 게임 시작
- 화면에 현재 모드 표시 (작은 라벨)

### 모드별 파라미터 차이
| 항목 | Easy | Normal (현재) | Hard |
|------|------|---------------|------|
| 기본 속도 | 1.4 + score*0.08 | 1.8 + score*0.12 | 2.4 + score*0.18 |
| 최대 속도 | 4.0 | 5.5 | 7.5 |
| 흔들리는 블록 등장 점수 | 50+ | 30+ | 15+ |
| 흔들림 진폭 | 4~8 | 6~14 (현재) | 10~22 |
| 가속/멈춤 패턴 빈도 | 낮음 (multTimer 기본 1.5x) | 현재 | 높음 (multTimer 기본 0.7x) |
| 블록 폭 점진 축소 | 없음 | 없음 | 매 10블록마다 BASE_WIDTH * 0.95 비율로 천천히 축소 (Hard에서만) |
| 시야 안개 (Hard 전용) | X | X | 점수 50+에서 캔버스 상단에 흐릿한 안개 띠 (블록 사이드 일부 가림) |
| PERFECT_THRESH | 8 | 6 | 4 |

### 구현 힌트
- 현재 `spawnMoving()` / `getTheme()` / `update()` / 충돌판정 부분의 상수를 모드에 따라 분기
- 모드 객체 `MODES = { easy: {...}, normal: {...}, hard: {...} }` 만들고 `currentMode` 참조하는 구조 권장

## 작업 2: 로컬 2인 Split-Screen 배틀 모드

### 요구사항
- toolbar에 **"⚔️ 배틀 모드"** 토글 버튼 추가
- 배틀 모드 ON 시:
  - 캔버스 가로로 2분할 (좌=P1, 우=P2)
  - 두 플레이어 모두 **같은 시드** 사용 (공정성 — 같은 블록 패턴이 양쪽에 똑같이 등장)
  - 키 입력:
    - P1: Space, 좌측 캔버스 클릭/터치
    - P2: Enter, 우측 캔버스 클릭/터치
  - 두 플레이어 점수 별도 표시 (좌상단/우상단)
  - **한쪽이 게임오버되면**: 그쪽은 정지, 상대는 5초 카운트다운 후 자동 종료 (시간 안에 더 쌓아도 한쪽이 끝났으니 결판)
  - **결과 화면**: 승자 표시 ("P1 승!" / "P2 승!" / "무승부"), 양쪽 점수 비교, "리매치" 버튼 (같은 시드로 재시작) + "새 시드" 버튼

### 구현 힌트
- 현재 single-player 상태(blocks, movingBlock, score, combo 등)를 P1/P2 객체로 분리
- 두 플레이어 게임 로직 각각 update/draw, 시드 RNG는 **각 플레이어가 독립 PRNG 인스턴스 보유**하되 **같은 시드값으로 시작** → 결정론적이라 양쪽이 똑같은 패턴
- draw 시 각자의 viewport에 ctx.translate / ctx.clip으로 그리기 (또는 절반 width 캔버스 두 개로 그리기 — 단일 캔버스 분할이 더 깔끔)
- 모드 토글, 난이도 모드와 직교(orthogonal): 배틀 모드는 모든 난이도와 조합 가능

### Split-Screen 레이아웃
- 캔버스를 모드 ON 시 더 넓게 (예: 720px) → 좌측 360px = P1, 우측 360px = P2
- 가운데 1px 세로 라인으로 분리
- 모바일에서는 약간 좁아질 수 있으니 반응형 처리 (최소 600px)

## 공통 제약

- 외부 라이브러리 / 외부 파일 X (vanilla JS only)
- 기존 기능 유지: 콤보, 영구 베스트, 시드 공유, 테마, 효과음, 진동, 파티클
- 한국어 주석 OK
- 코드 길어지면 `<script>` 안에서 섹션 주석으로 정리 (`// ── Battle Mode ──`)

## 검증

작업 후 다음을 보고하라:
1. 모드 토글 동작 확인 (3가지 모드 차이가 실제 코드 분기로 들어갔는지)
2. 배틀 모드에서 양쪽 시드/패턴 동기화 확인
3. JS 구문 에러 없음 (`node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 통과)
4. 파일 크기, 라인 수
5. 변경 핵심 5줄 요약

## Raw output

```text
완료했습니다. 변경 파일: [index.html](/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html)

1. 모드 토글 확인  
`MODES` 객체로 Easy / Normal / Hard 분기 추가했고, 속도·최대속도·흔들림 시작 점수·진폭·가속 패턴 빈도·Hard 폭 축소·Hard 안개·`perfectThresh`가 모두 `getMode()` 경유로 적용됩니다. 모드는 `mksga_tower_mode_v1`에 저장되고 변경 즉시 새 게임이 시작됩니다.

2. 배틀 모드 시드/패턴 동기화 확인  
P1/P2가 독립 PRNG 인스턴스를 가지되 같은 `currentSeed`와 같은 salt로 시작합니다. mock 실행에서 5회 연속 동일 드롭 후에도 다음 블록 `worldX/worldY/width/dir/speed/wobbleAmp` 동기화 확인했습니다.

3. JS 구문 에러 없음  
요청하신 검사 통과:
```bash
node -e "const fs=require('fs');const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8');new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"
```

4. 파일 크기 / 라인 수  
`998` lines, `36,426` bytes.

5. 변경 핵심 5줄 요약  
- Easy / Normal / Hard 모드 버튼, 현재 모드 라벨, localStorage 저장 추가.
- 기존 싱글 플레이 상태를 `players[]` 기반 플레이어 객체 구조로 전환.
- 배틀 모드 ON 시 2분할 캔버스, P1 Space/좌측 입력, P2 Enter/우측 입력 지원.
- 한쪽 게임오버 후 5초 카운트다운, 결과 화면, 리매치/새 시드 버튼 추가.
- Hard 전용 점진 폭 축소와 점수 50+ 상단 안개 띠 추가.

추가 검증: `git diff --check` 통과. 실제 브라우저 수동 플레이는 실행하지 않았고, 문법 및 mock DOM 런타임 검증까지 수행했습니다.


OpenAI Codex v0.125.0 (research preview)
--------
workdir: /Users/finito/dev/makesonggreatagain
model: gpt-5.5
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: medium
reasoning summaries: none
session id: 019dca03-36c3-75e1-ae4b-0a89b2228fcd
--------
user
# 탑 쌓기(tower-stack) 난이도 상향 + 배틀 모드 구성

## 대상 파일
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html`

이 파일은 vanilla JS + Canvas 단일 HTML. 현재 콤보·시드·테마·WebAudio 효과음 등이 이미 들어있다. 리뷰 후 아래 두 가지를 추가하라.

## 작업 1: 난이도 모드 토글 (Easy / Normal / Hard)

### 요구사항
- 상단/하단 toolbar에 모드 선택 버튼 3개 (Easy / Normal / Hard)
- localStorage 키 `mksga_tower_mode_v1`로 영구 저장
- 모드 변경 시 자동으로 새 게임 시작
- 화면에 현재 모드 표시 (작은 라벨)

### 모드별 파라미터 차이
| 항목 | Easy | Normal (현재) | Hard |
|------|------|---------------|------|
| 기본 속도 | 1.4 + score*0.08 | 1.8 + score*0.12 | 2.4 + score*0.18 |
| 최대 속도 | 4.0 | 5.5 | 7.5 |
| 흔들리는 블록 등장 점수 | 50+ | 30+ | 15+ |
| 흔들림 진폭 | 4~8 | 6~14 (현재) | 10~22 |
| 가속/멈춤 패턴 빈도 | 낮음 (multTimer 기본 1.5x) | 현재 | 높음 (multTimer 기본 0.7x) |
| 블록 폭 점진 축소 | 없음 | 없음 | 매 10블록마다 BASE_WIDTH * 0.95 비율로 천천히 축소 (Hard에서만) |
| 시야 안개 (Hard 전용) | X | X | 점수 50+에서 캔버스 상단에 흐릿한 안개 띠 (블록 사이드 일부 가림) |
| PERFECT_THRESH | 8 | 6 | 4 |

### 구현 힌트
- 현재 `spawnMoving()` / `getTheme()` / `update()` / 충돌판정 부분의 상수를 모드에 따라 분기
- 모드 객체 `MODES = { easy: {...}, normal: {...}, hard: {...} }` 만들고 `currentMode` 참조하는 구조 권장

## 작업 2: 로컬 2인 Split-Screen 배틀 모드

### 요구사항
- toolbar에 **"⚔️ 배틀 모드"** 토글 버튼 추가
- 배틀 모드 ON 시:
  - 캔버스 가로로 2분할 (좌=P1, 우=P2)
  - 두 플레이어 모두 **같은 시드** 사용 (공정성 — 같은 블록 패턴이 양쪽에 똑같이 등장)
  - 키 입력:
    - P1: Space, 좌측 캔버스 클릭/터치
    - P2: Enter, 우측 캔버스 클릭/터치
  - 두 플레이어 점수 별도 표시 (좌상단/우상단)
  - **한쪽이 게임오버되면**: 그쪽은 정지, 상대는 5초 카운트다운 후 자동 종료 (시간 안에 더 쌓아도 한쪽이 끝났으니 결판)
  - **결과 화면**: 승자 표시 ("P1 승!" / "P2 승!" / "무승부"), 양쪽 점수 비교, "리매치" 버튼 (같은 시드로 재시작) + "새 시드" 버튼

### 구현 힌트
- 현재 single-player 상태(blocks, movingBlock, score, combo 등)를 P1/P2 객체로 분리
- 두 플레이어 게임 로직 각각 update/draw, 시드 RNG는 **각 플레이어가 독립 PRNG 인스턴스 보유**하되 **같은 시드값으로 시작** → 결정론적이라 양쪽이 똑같은 패턴
- draw 시 각자의 viewport에 ctx.translate / ctx.clip으로 그리기 (또는 절반 width 캔버스 두 개로 그리기 — 단일 캔버스 분할이 더 깔끔)
- 모드 토글, 난이도 모드와 직교(orthogonal): 배틀 모드는 모든 난이도와 조합 가능

### Split-Screen 레이아웃
- 캔버스를 모드 ON 시 더 넓게 (예: 720px) → 좌측 360px = P1, 우측 360px = P2
- 가운데 1px 세로 라인으로 분리
- 모바일에서는 약간 좁아질 수 있으니 반응형 처리 (최소 600px)

## 공통 제약

- 외부 라이브러리 / 외부 파일 X (vanilla JS only)
- 기존 기능 유지: 콤보, 영구 베스트, 시드 공유, 테마, 효과음, 진동, 파티클
- 한국어 주석 OK
- 코드 길어지면 `<script>` 안에서 섹션 주석으로 정리 (`// ── Battle Mode ──`)

## 검증

작업 후 다음을 보고하라:
1. 모드 토글 동작 확인 (3가지 모드 차이가 실제 코드 분기로 들어갔는지)
2. 배틀 모드에서 양쪽 시드/패턴 동기화 확인
3. JS 구문 에러 없음 (`node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 통과)
4. 파일 크기, 라인 수
5. 변경 핵심 5줄 요약
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
작업 파일을 먼저 읽고 현재 게임 상태 구조를 확인하겠습니다. 이후 단일 플레이 기존 흐름을 보존하면서 플레이어 상태를 객체화하고, 난이도 모드와 배틀 모드를 같은 루프에 얹는 쪽으로 진행하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "wc -l -c user/donghyun/projects/tower-stack/index.html && sed -n '1,260p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'pwd && rg -n "function|const |let |var |spawnMoving|update|draw|localStorage|canvas|keydown|click|touch|PERFECT|score|seed" user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "sed -n '261,620p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
 succeeded in 550ms:
     672   25101 user/donghyun/projects/tower-stack/index.html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <title>탑 쌓기 게임</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { overflow: hidden; touch-action: none; }
    body {
      background: #0f0f1a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      color: white;
      user-select: none;
      -webkit-user-select: none;
      padding: 8px;
    }
    #stage {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    canvas {
      display: block;
      border-radius: 12px;
      box-shadow: 0 0 40px rgba(100,100,255,0.2);
      touch-action: none;
    }
    /* 화면 흔들림 (게임오버) */
    canvas.shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake {
      10%, 90% { transform: translateX(-2px); }
      20%, 80% { transform: translateX(4px); }
      30%, 50%, 70% { transform: translateX(-7px); }
      40%, 60% { transform: translateX(7px); }
    }
    #ui {
      margin-top: 12px;
      display: flex;
      gap: 14px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 95vw;
    }
    .stat {
      font-size: 0.95rem;
      color: #aaa;
    }
    .stat span { color: #facc15; font-weight: bold; font-size: 1.2rem; }
    .stat.combo span { color: #fb7185; }
    .stat.best span { color: #60a5fa; font-size: 1rem; }
    #hint { font-size: 0.78rem; color: #555; }
    #toolbar {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      background: #1f2937;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn:hover { background: #334155; color: white; }
    .btn:active { background: #475569; }
    #seed-display {
      font-size: 0.7rem;
      color: #64748b;
      margin-top: 6px;
      font-family: monospace;
    }
    #toast {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%) translateY(-80px);
      background: #1e293b;
      border: 1px solid #475569;
      color: white;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.85rem;
      transition: transform 0.35s cubic-bezier(.5,1.6,.4,1), opacity 0.3s;
      opacity: 0;
      pointer-events: none;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    @media (max-width: 420px) {
      .stat { font-size: 0.85rem; }
      .stat span { font-size: 1.05rem; }
    }
  </style>
</head>
<body>
  <div id="stage">
    <canvas id="canvas"></canvas>
    <div id="ui">
      <div class="stat">점수: <span id="score">0</span></div>
      <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
      <div class="stat best">최고: <span id="best">0</span></div>
    </div>
    <div id="toolbar">
      <button class="btn" id="btn-share">🔗 시드 공유</button>
      <button class="btn" id="btn-reset">🔄 새 시드</button>
      <button class="btn" id="btn-mute">🔊 소리</button>
    </div>
    <div id="seed-display">seed: --</div>
    <div id="hint" style="margin-top:8px">스페이스바 · 클릭 · 터치</div>
  </div>
  <div id="toast"></div>

<script>
'use strict';

// ── DOM ──────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const comboEl = document.getElementById('combo');
const comboWrap = document.getElementById('combo-wrap');
const seedDisplay = document.getElementById('seed-display');
const toastEl = document.getElementById('toast');
const btnShare = document.getElementById('btn-share');
const btnReset = document.getElementById('btn-reset');
const btnMute = document.getElementById('btn-mute');

// ── Constants ────────────────────────────────────────────────────────────────
const BLOCK_H = 22;
const BASE_WIDTH = 200;
const MOVING_Y = 90;
const PERFECT_THRESH = 6;
const STORAGE_BEST = 'mksga_tower_best_v1';
const STORAGE_MUTE = 'mksga_tower_mute_v1';
const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';

// ── Responsive canvas ────────────────────────────────────────────────────────
function fitCanvas() {
  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
  canvas.width = targetW;
  canvas.height = targetH;
}
fitCanvas();
window.addEventListener('resize', () => { fitCanvas(); });

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function parseSeedFromURL() {
  const m = window.location.search.match(/seed=(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}
function makeSeed() { return (Math.random() * 1e9) | 0; }
function makePRNG(seed) {
  let s = seed >>> 0;
  return function() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let currentSeed = parseSeedFromURL() ?? makeSeed();
let rng = makePRNG(currentSeed);
function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }

// ── State ────────────────────────────────────────────────────────────────────
let blocks = [];
let movingBlock = {};
let falling = [];
let particles = [];
let cameraY = 0;
let score = 0;
let combo = 0;
let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
let phase = 'playing';
let perfectText = '';
let perfectTimer = 0;
let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
let muted = localStorage.getItem(STORAGE_MUTE) === '1';
let gameoverShakeApplied = false;

bestEl.textContent = bestScore;
btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';

// ── WebAudio ─────────────────────────────────────────────────────────────────
let audioCtx = null;
function ensureAudio() {
  if (audioCtx) return audioCtx;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  return audioCtx;
}
function beep(freq, duration, type = 'sine', gain = 0.12) {
  if (muted) return;
  const ac = ensureAudio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(g); g.connect(ac.destination);
  osc.start(); osc.stop(ac.currentTime + duration);
}
function sfxDrop(stableness) {
  // stableness 0~1 (퍼펙트=1, 빗나갈수록 0)
  beep(180 + stableness * 220, 0.09, 'square', 0.10);
}
function sfxPerfect() {
  // 짧은 아르페지오
  beep(523, 0.10, 'sine', 0.13);
  setTimeout(() => beep(659, 0.10, 'sine', 0.13), 70);
  setTimeout(() => beep(784, 0.16, 'sine', 0.13), 140);
}
function sfxCombo(level) {
  beep(440 + level * 80, 0.12, 'triangle', 0.12);
}
function sfxGameover() {
  beep(220, 0.15, 'sawtooth', 0.14);
  setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
}

// ── Vibration ─────────────────────────────────────────────────────────────────
function vibrate(pattern) {
  if (navigator.vibrate) try { navigator.vibrate(pattern); } catch (_) {}
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function toast(msg, ms = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

// ── Color & Theme ─────────────────────────────────────────────────────────────
function blockColor(n) {
  const hue = (n * 37) % 360;
  return `hsl(${hue}, 75%, 58%)`;
}
function getTheme(s) {
  // 점수에 따른 5단계 테마
  if (s < 20)       return { name: 'night',  topH: 230, topS: 40, topL: 18, botH: 240, botS: 30, botL: 12, starHue: 0, starAlpha: 0.4 };
  if (s < 50)       return { name: 'dawn',   topH: 280, topS: 45, topL: 26, botH: 20,  botS: 40, botL: 18, starHue: 280, starAlpha: 0.3 };

 succeeded in 556ms:
  if (s < 100)      return { name: 'day',    topH: 200, topS: 65, topL: 60, botH: 195, botS: 55, botL: 35, starHue: 0,   starAlpha: 0.0 };
  if (s < 200)      return { name: 'sunset', topH: 25,  topS: 75, topL: 50, botH: 320, botS: 50, botL: 28, starHue: 30,  starAlpha: 0.2 };
  return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
}

// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
function spawnMoving() {
  const top = blocks[blocks.length - 1];
  const speed = Math.min(1.8 + score * 0.12, 5.5);
  movingBlock = {
    worldX: rng() * (canvas.width - top.width - 8) + 4,
    worldY: top.worldY - BLOCK_H,
    width: top.width,
    dir: rng() < 0.5 ? 1 : -1,
    speed,
    color: blockColor(score + 1),
    speedMult: 1.0,
    targetMult: 1.0,
    multTimer: 800 + rng() * 600,
    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
    wobblePhase: rng() * Math.PI * 2,
    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
  };
  cameraY = movingBlock.worldY - MOVING_Y;
}

function initGame(opts = {}) {
  if (opts.newSeed) {
    currentSeed = makeSeed();
    rng = makePRNG(currentSeed);
    refreshSeedDisplay();
  } else if (opts.replay) {
    rng = makePRNG(currentSeed); // 같은 시드로 재시작
  }
  score = 0;
  combo = 0;
  cameraY = 0;
  falling = [];
  particles = [];
  perfectText = '';
  perfectTimer = 0;
  phase = 'playing';
  gameoverShakeApplied = false;
  scoreEl.textContent = '0';
  comboWrap.style.display = 'none';
  blocks = [{
    worldX: canvas.width / 2 - BASE_WIDTH / 2,
    worldY: 500,
    width: BASE_WIDTH,
    color: blockColor(0),
  }];
  spawnMoving();
}

// ── Particle ─────────────────────────────────────────────────────────────────
function spawnPerfectParticles(cx, cy) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * (1.5 + Math.random() * 2),
      vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
      life: 1, decay: 0.025 + Math.random() * 0.02,
      color: '#facc15',
      size: 2 + Math.random() * 2,
    });
  }
}
function spawnDustParticles(cx, cy, color) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5,
      life: 1, decay: 0.04,
      color: color || '#fff',
      size: 1.5,
    });
  }
}

// ── Drop logic ────────────────────────────────────────────────────────────────
function dropBlock() {
  ensureAudio(); // 첫 입력에서 오디오 unlock
  if (phase !== 'playing') {
    initGame({ replay: true });
    return;
  }

  const top = blocks[blocks.length - 1];
  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
  const mw = movingBlock.width;
  const tx = top.worldX;
  const tw = top.width;

  const overlapLeft  = Math.max(mx, tx);
  const overlapRight = Math.min(mx + mw, tx + tw);
  const overlapW = overlapRight - overlapLeft;

  if (overlapW <= 0) {
    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
    triggerGameover();
    return;
  }

  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
  const stableness = Math.min(overlapW / mw, 1);
  sfxDrop(stableness);

  if (isPerfect) {
    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
    combo++;
    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
    perfectTimer = 1100;
    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
    sfxPerfect();
    if (combo % 3 === 0 && combo >= 3) {
      sfxCombo(combo);
      vibrate(40);
      toast(`🔥 ${combo} 연속 퍼펙트!`);
    }
    if (combo > comboRecord) {
      comboRecord = combo;
      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
    }
  } else {
    if (mx < tx) {
      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
    } else {
      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
    }
    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
    combo = 0;
  }

  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
  score += gained;
  scoreEl.textContent = score;
  if (combo >= 2) {
    comboWrap.style.display = '';
    comboEl.textContent = combo;
  } else {
    comboWrap.style.display = 'none';
  }

  if (blocks[blocks.length - 1].width < 4) {
    triggerGameover();
    return;
  }

  spawnMoving();
}

function triggerGameover() {
  phase = 'gameover';
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(STORAGE_BEST, String(bestScore));
    bestEl.textContent = bestScore;
    toast('🎉 신기록 달성!');
  }
  sfxGameover();
  vibrate([60, 40, 90]);
  if (!gameoverShakeApplied) {
    gameoverShakeApplied = true;
    canvas.classList.remove('shake');
    void canvas.offsetWidth; // reflow
    canvas.classList.add('shake');
  }
}

function toScreenY(worldY) { return worldY - cameraY; }

// ── Update ───────────────────────────────────────────────────────────────────
function update(dt) {
  if (phase === 'playing') {
    movingBlock.multTimer -= dt;
    if (movingBlock.multTimer <= 0) {
      const r = rng();
      if (r < 0.20) {
        movingBlock.targetMult = 0.05;
        movingBlock.multTimer = 250 + rng() * 300;
      } else if (r < 0.45) {
        movingBlock.targetMult = 2.2 + rng() * 1.2;
        movingBlock.multTimer = 180 + rng() * 250;
      } else {
        movingBlock.targetMult = 0.6 + rng() * 0.8;
        movingBlock.multTimer = 600 + rng() * 900;
      }
    }
    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;

    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
    movingBlock.wobblePhase += dt * 0.005;

    // 경계 (effective worldX 기준)
    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
    const effRight = effLeft + movingBlock.width;
    if (effRight >= canvas.width - 4) {
      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
      movingBlock.dir = -1;
    }
    if (effLeft <= 4) {
      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
      movingBlock.dir = 1;
    }
  }

  for (const f of falling) {
    f.vy = Math.min(f.vy + dt * 0.015, 8);
    f.worldY += f.vy;
  }
  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);

  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
  }
  particles = particles.filter(p => p.life > 0);

  if (perfectTimer > 0) perfectTimer -= dt;
  if (perfectTimer <= 0) perfectText = '';
}

// ── Draw ─────────────────────────────────────────────────────────────────────
function drawBackground() {
  const theme = getTheme(score);
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
  grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 별 (테마에 따라 밀도 변화)
  if (theme.starAlpha > 0) {
    const count = Math.floor(20 + score * 0.15);
    ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
    for (let i = 0; i < count; i++) {
      const sx = ((i * 137 + score * 3) % canvas.width);
      const sy = ((i * 97) % canvas.height);
      const size = 1 + ((i * 7) % 3) * 0.4;
      ctx.fillRect(sx, sy, size, size);
    }
  }

  // 우주 테마: 은하 띠
  if (theme.name === 'space') {
    ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
  }
}

function drawBlock(worldX, worldY, width, color, alpha) {
  const sy = toScreenY(worldY);
  if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
  ctx.save();
  ctx.globalAlpha = alpha ?? 1;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.roundRect(worldX + 3, sy + 4, width, BLOCK_H, 4); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
  ctx.restore();
}

function drawMoving() {
  if (phase !== 'playing') return;
  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
  const effX = movingBlock.worldX + wob;
  const { worldY, width, color } = movingBlock;
  const top = blocks[blocks.length - 1];
  const sy = toScreenY(worldY);

  // 가이드 라인
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(top.worldX, sy + BLOCK_H / 2);
  ctx.lineTo(top.worldX + top.width, sy + BLOCK_H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  drawBlock(effX, worldY, width, color);

  // 가장자리 강조
  const mult = movingBlock.speedMult ?? 1;
  const wobActive = movingBlock.wobbleAmp > 0;
  const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
  let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
  if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
  if (wobActive)  edgeColor = `rgba(168,85,247,${edgeAlpha + 0.1})`;
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = (mult > 1.5 || wobActive) ? 2.5 : 1.5;
  ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

function drawPerfect() {
  if (!perfectText || perfectTimer <= 0) return;
  const alpha = Math.min(1, perfectTimer / 350);
  const rise = (1100 - perfectTimer) * 0.04;
  const top = blocks[blocks.length - 1];
  const sy = toScreenY(top.worldY) - 10 - rise;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
  ctx.restore();
}

function drawGameOver() {
  if (phase !== 'gameover') return;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);

  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
}

// ── Loop ─────────────────────────────────────────────────────────────────────
let lastTime = 0;

 succeeded in 581ms:
/Users/finito/dev/makesonggreatagain
9:    html, body { overflow: hidden; touch-action: none; }
29:    canvas {
33:      touch-action: none;
36:    canvas.shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
79:    #seed-display {
111:    <canvas id="canvas"></canvas>
113:      <div class="stat">점수: <span id="score">0</span></div>
122:    <div id="seed-display">seed: --</div>
131:const canvas = document.getElementById('canvas');
132:const ctx = canvas.getContext('2d');
133:const scoreEl = document.getElementById('score');
134:const bestEl = document.getElementById('best');
135:const comboEl = document.getElementById('combo');
136:const comboWrap = document.getElementById('combo-wrap');
137:const seedDisplay = document.getElementById('seed-display');
138:const toastEl = document.getElementById('toast');
139:const btnShare = document.getElementById('btn-share');
140:const btnReset = document.getElementById('btn-reset');
141:const btnMute = document.getElementById('btn-mute');
144:const BLOCK_H = 22;
145:const BASE_WIDTH = 200;
146:const MOVING_Y = 90;
147:const PERFECT_THRESH = 6;
148:const STORAGE_BEST = 'mksga_tower_best_v1';
149:const STORAGE_MUTE = 'mksga_tower_mute_v1';
150:const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
152:// ── Responsive canvas ────────────────────────────────────────────────────────
153:function fitCanvas() {
154:  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
155:  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
156:  canvas.width = targetW;
157:  canvas.height = targetH;
163:function parseSeedFromURL() {
164:  const m = window.location.search.match(/seed=(\d+)/);
167:function makeSeed() { return (Math.random() * 1e9) | 0; }
168:function makePRNG(seed) {
169:  let s = seed >>> 0;
170:  return function() {
172:    let t = Math.imul(s ^ (s >>> 15), 1 | s);
177:let currentSeed = parseSeedFromURL() ?? makeSeed();
178:let rng = makePRNG(currentSeed);
179:function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
182:let blocks = [];
183:let movingBlock = {};
184:let falling = [];
185:let particles = [];
186:let cameraY = 0;
187:let score = 0;
188:let combo = 0;
189:let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
190:let phase = 'playing';
191:let perfectText = '';
192:let perfectTimer = 0;
193:let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
194:let muted = localStorage.getItem(STORAGE_MUTE) === '1';
195:let gameoverShakeApplied = false;
201:let audioCtx = null;
202:function ensureAudio() {
207:function beep(freq, duration, type = 'sine', gain = 0.12) {
209:  const ac = ensureAudio();
211:  const osc = ac.createOscillator();
212:  const g = ac.createGain();
220:function sfxDrop(stableness) {
224:function sfxPerfect() {
230:function sfxCombo(level) {
233:function sfxGameover() {
239:function vibrate(pattern) {
244:let toastTimer = null;
245:function toast(msg, ms = 1800) {
253:function blockColor(n) {
254:  const hue = (n * 37) % 360;
257:function getTheme(s) {
266:// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
267:function spawnMoving() {
268:  const top = blocks[blocks.length - 1];
269:  const speed = Math.min(1.8 + score * 0.12, 5.5);
271:    worldX: rng() * (canvas.width - top.width - 8) + 4,
276:    color: blockColor(score + 1),
282:    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
287:function initGame(opts = {}) {
295:  score = 0;
304:  scoreEl.textContent = '0';
307:    worldX: canvas.width / 2 - BASE_WIDTH / 2,
312:  spawnMoving();
316:function spawnPerfectParticles(cx, cy) {
317:  for (let i = 0; i < 10; i++) {
318:    const a = (i / 10) * Math.PI * 2;
329:function spawnDustParticles(cx, cy, color) {
330:  for (let i = 0; i < 6; i++) {
344:function dropBlock() {
351:  const top = blocks[blocks.length - 1];
352:  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
353:  const mw = movingBlock.width;
354:  const tx = top.worldX;
355:  const tw = top.width;
357:  const overlapLeft  = Math.max(mx, tx);
358:  const overlapRight = Math.min(mx + mw, tx + tw);
359:  const overlapW = overlapRight - overlapLeft;
367:  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
368:  const stableness = Math.min(overlapW / mw, 1);
374:    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
385:      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
399:  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
400:  score += gained;
401:  scoreEl.textContent = score;
414:  spawnMoving();
417:function triggerGameover() {
419:  if (score > bestScore) {
420:    bestScore = score;
421:    localStorage.setItem(STORAGE_BEST, String(bestScore));
429:    canvas.classList.remove('shake');
430:    void canvas.offsetWidth; // reflow
431:    canvas.classList.add('shake');
435:function toScreenY(worldY) { return worldY - cameraY; }
438:function update(dt) {
442:      const r = rng();
461:    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
462:    const effRight = effLeft + movingBlock.width;
463:    if (effRight >= canvas.width - 4) {
464:      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
473:  for (const f of falling) {
477:  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
479:  for (const p of particles) {
489:function drawBackground() {
490:  const theme = getTheme(score);
491:  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
495:  ctx.fillRect(0, 0, canvas.width, canvas.height);
499:    const count = Math.floor(20 + score * 0.15);
501:    for (let i = 0; i < count; i++) {
502:      const sx = ((i * 137 + score * 3) % canvas.width);
503:      const sy = ((i * 97) % canvas.height);
504:      const size = 1 + ((i * 7) % 3) * 0.4;
512:    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
516:function drawBlock(worldX, worldY, width, color, alpha) {
517:  const sy = toScreenY(worldY);
518:  if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
530:function drawMoving() {
532:  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
533:  const effX = movingBlock.worldX + wob;
534:  const { worldY, width, color } = movingBlock;
535:  const top = blocks[blocks.length - 1];
536:  const sy = toScreenY(worldY);
548:  drawBlock(effX, worldY, width, color);
551:  const mult = movingBlock.speedMult ?? 1;
552:  const wobActive = movingBlock.wobbleAmp > 0;
553:  const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
554:  let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
562:function drawParticles() {
563:  for (const p of particles) {
572:function drawPerfect() {
574:  const alpha = Math.min(1, perfectTimer / 350);
575:  const rise = (1100 - perfectTimer) * 0.04;
576:  const top = blocks[blocks.length - 1];
577:  const sy = toScreenY(top.worldY) - 10 - rise;
583:  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
587:function drawGameOver() {
590:  ctx.fillRect(0, 0, canvas.width, canvas.height);
595:  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
599:  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
603:  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
604:  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
608:  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
612:  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
616:  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
620:let lastTime = 0;
621:function loop(t) {
622:  const dt = Math.min(t - lastTime, 50);
625:  update(dt);
627:  ctx.clearRect(0, 0, canvas.width, canvas.height);
628:  drawBackground();
629:  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
630:  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
631:  drawMoving();
632:  drawParticles();
633:  drawPerfect();
634:  drawGameOver();
640:document.addEventListener('keydown', e => {
643:canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
644:canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
647:btnShare.addEventListener('click', async () => {
648:  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
656:btnReset.addEventListener('click', () => {
660:btnMute.addEventListener('click', () => {
662:  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '620,760p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
let lastTime = 0;
function loop(t) {
  const dt = Math.min(t - lastTime, 50);
  lastTime = t;

  update(dt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
  drawMoving();
  drawParticles();
  drawPerfect();
  drawGameOver();

  requestAnimationFrame(loop);
}

// ── Input ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
});
canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });

// ── Toolbar ──────────────────────────────────────────────────────────────────
btnShare.addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
  try {
    await navigator.clipboard.writeText(url);
    toast(`📋 시드 ${currentSeed} 링크 복사됨!`);
  } catch (_) {
    prompt('이 시드 링크를 복사하세요', url);
  }
});
btnReset.addEventListener('click', () => {
  initGame({ newSeed: true });
  toast(`🎲 새 시드: ${currentSeed}`);
});
btnMute.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');
  btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
});

// ── Boot ─────────────────────────────────────────────────────────────────────
refreshSeedDisplay();
initGame();
requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
</script>
</body>
</html>

hook: PostToolUse
exec
/bin/zsh -lc 'git status --short -- user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
hook: PostToolUse Completed
 succeeded in 224ms:
 M user/donghyun/projects/tower-stack/index.html

hook: PostToolUse Completed
codex
현재 파일은 이미 수정 상태라 기존 변경을 보존하면서 같은 파일 안에서만 패치하겠습니다. 구조상 가장 안전한 축은 플레이어 상태를 `player` 객체로 감싸고, 기존 렌더/판정 함수를 플레이어와 뷰포트를 받는 함수로 바꾸는 방식입니다.
apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..e6c061d8e6d1d094c151e299f687e8b5d5f90810
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..e6c061d8e6d1d094c151e299f687e8b5d5f90810
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>

codex
이제 스크립트 본문을 교체합니다. 핵심은 `players[]` 두 슬롯을 만들고, 싱글 모드는 `players[0]`만 쓰며 배틀 모드는 같은 `currentSeed`에서 시작한 독립 PRNG 두 개로 같은 블록 시퀀스를 생성하게 하는 것입니다.
apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..0a8d84e59a32791869a017e12019943a9acdc248
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..0a8d84e59a32791869a017e12019943a9acdc248
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..137599b430ae40ede728ca194b2014fcad12f8b2
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..137599b430ae40ede728ca194b2014fcad12f8b2
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '240,520p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "sed -n '520,760p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
function update(dt) {
  if (phase === 'playing') {
    movingBlock.multTimer -= dt;
    if (movingBlock.multTimer <= 0) {
      const r = rng();
      if (r < 0.20) {
        movingBlock.targetMult = 0.05;
        movingBlock.multTimer = 250 + rng() * 300;
      } else if (r < 0.45) {
        movingBlock.targetMult = 2.2 + rng() * 1.2;
        movingBlock.multTimer = 180 + rng() * 250;
      } else {
        movingBlock.targetMult = 0.6 + rng() * 0.8;
        movingBlock.multTimer = 600 + rng() * 900;
      }
    }
    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;

    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
    movingBlock.wobblePhase += dt * 0.005;

    // 경계 (effective worldX 기준)
    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
    const effRight = effLeft + movingBlock.width;
    if (effRight >= canvas.width - 4) {
      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
      movingBlock.dir = -1;
    }
    if (effLeft <= 4) {
      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
      movingBlock.dir = 1;
    }
  }

  for (const f of falling) {
    f.vy = Math.min(f.vy + dt * 0.015, 8);
    f.worldY += f.vy;
  }
  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);

  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
  }
  particles = particles.filter(p => p.life > 0);

  if (perfectTimer > 0) perfectTimer -= dt;
  if (perfectTimer <= 0) perfectText = '';
}

// ── Draw ─────────────────────────────────────────────────────────────────────
function drawBackground() {
  const theme = getTheme(score);
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
  grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 별 (테마에 따라 밀도 변화)
  if (theme.starAlpha > 0) {
    const count = Math.floor(20 + score * 0.15);
    ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
    for (let i = 0; i < count; i++) {
      const sx = ((i * 137 + score * 3) % canvas.width);
      const sy = ((i * 97) % canvas.height);
      const size = 1 + ((i * 7) % 3) * 0.4;
      ctx.fillRect(sx, sy, size, size);
    }
  }

  // 우주 테마: 은하 띠
  if (theme.name === 'space') {
    ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
  }
}

function drawBlock(worldX, worldY, width, color, alpha) {
  const sy = toScreenY(worldY);
  if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
  ctx.save();
  ctx.globalAlpha = alpha ?? 1;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.roundRect(worldX + 3, sy + 4, width, BLOCK_H, 4); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
  ctx.restore();
}

function drawMoving() {
  if (phase !== 'playing') return;
  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
  const effX = movingBlock.worldX + wob;
  const { worldY, width, color } = movingBlock;
  const top = blocks[blocks.length - 1];
  const sy = toScreenY(worldY);

  // 가이드 라인
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(top.worldX, sy + BLOCK_H / 2);
  ctx.lineTo(top.worldX + top.width, sy + BLOCK_H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  drawBlock(effX, worldY, width, color);

  // 가장자리 강조
  const mult = movingBlock.speedMult ?? 1;
  const wobActive = movingBlock.wobbleAmp > 0;
  const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
  let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
  if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
  if (wobActive)  edgeColor = `rgba(168,85,247,${edgeAlpha + 0.1})`;
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = (mult > 1.5 || wobActive) ? 2.5 : 1.5;
  ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

function drawPerfect() {
  if (!perfectText || perfectTimer <= 0) return;
  const alpha = Math.min(1, perfectTimer / 350);
  const rise = (1100 - perfectTimer) * 0.04;
  const top = blocks[blocks.length - 1];
  const sy = toScreenY(top.worldY) - 10 - rise;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
  ctx.restore();
}

function drawGameOver() {
  if (phase !== 'gameover') return;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);

  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
}

// ── Loop ─────────────────────────────────────────────────────────────────────
let lastTime = 0;
function loop(t) {
  const dt = Math.min(t - lastTime, 50);
  lastTime = t;

  update(dt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
  drawMoving();
  drawParticles();
  drawPerfect();
  drawGameOver();

  requestAnimationFrame(loop);
}

// ── Input ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
});
canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });

// ── Toolbar ──────────────────────────────────────────────────────────────────
btnShare.addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
  try {
    await navigator.clipboard.writeText(url);
    toast(`📋 시드 ${currentSeed} 링크 복사됨!`);
  } catch (_) {
    prompt('이 시드 링크를 복사하세요', url);
  }
});
btnReset.addEventListener('click', () => {
  initGame({ newSeed: true });
  toast(`🎲 새 시드: ${currentSeed}`);
});
btnMute.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');
  btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
});

// ── Boot ─────────────────────────────────────────────────────────────────────
refreshSeedDisplay();
initGame();
requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
</script>
</body>
</html>

 succeeded in 0ms:
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── State ────────────────────────────────────────────────────────────────────
let currentSeed = parseSeedFromURL() ?? makeSeed();
let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
if (!MODES[currentModeKey]) currentModeKey = 'normal';
let battleMode = false;
let gamePhase = 'playing';
let players = [];
let battleCountdown = 0;
let battleWinner = '';
let battleButtons = [];
let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
let muted = localStorage.getItem(STORAGE_MUTE) === '1';
let gameoverShakeApplied = false;

bestEl.textContent = bestScore;
btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';

// ── Responsive canvas ────────────────────────────────────────────────────────
function getMode() { return MODES[currentModeKey]; }
function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
function fitCanvas() {
  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
  const battleMax = Math.min(window.innerWidth - 16, 720);
  const battleMin = Math.min(window.innerWidth - 16, 600);
  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
  canvas.width = targetW;
  canvas.height = targetH;
  for (const p of players) {
    p.viewWidth = getPlayWidth();
  }
}
window.addEventListener('resize', () => {
  fitCanvas();
  initGame({ replay: true, silent: true });
});

// ── WebAudio ─────────────────────────────────────────────────────────────────
let audioCtx = null;
function ensureAudio() {
  if (audioCtx) return audioCtx;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  return audioCtx;
}
function beep(freq, duration, type = 'sine', gain = 0.12) {
  if (muted) return;
  const ac = ensureAudio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(g); g.connect(ac.destination);
  osc.start(); osc.stop(ac.currentTime + duration);
}
function sfxDrop(stableness) {
  // stableness 0~1 (퍼펙트=1, 빗나갈수록 0)
  beep(180 + stableness * 220, 0.09, 'square', 0.10);
}
function sfxPerfect() {
  // 짧은 아르페지오
  beep(523, 0.10, 'sine', 0.13);
  setTimeout(() => beep(659, 0.10, 'sine', 0.13), 70);
  setTimeout(() => beep(784, 0.16, 'sine', 0.13), 140);
}
function sfxCombo(level) {
  beep(440 + level * 80, 0.12, 'triangle', 0.12);
}
function sfxGameover() {
  beep(220, 0.15, 'sawtooth', 0.14);
  setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
}

// ── Vibration ─────────────────────────────────────────────────────────────────
function vibrate(pattern) {
  if (navigator.vibrate) try { navigator.vibrate(pattern); } catch (_) {}
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function toast(msg, ms = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

// ── Color & Theme ─────────────────────────────────────────────────────────────
function blockColor(n) {
  const hue = (n * 37) % 360;
  return `hsl(${hue}, 75%, 58%)`;
}
function getTheme(s) {
  // 점수에 따른 5단계 테마
  if (s < 20)       return { name: 'night',  topH: 230, topS: 40, topL: 18, botH: 240, botS: 30, botL: 12, starHue: 0, starAlpha: 0.4 };
  if (s < 50)       return { name: 'dawn',   topH: 280, topS: 45, topL: 26, botH: 20,  botS: 40, botL: 18, starHue: 280, starAlpha: 0.3 };
  if (s < 100)      return { name: 'day',    topH: 200, topS: 65, topL: 60, botH: 195, botS: 55, botL: 35, starHue: 0,   starAlpha: 0.0 };
  if (s < 200)      return { name: 'sunset', topH: 25,  topS: 75, topL: 50, botH: 320, botS: 50, botL: 28, starHue: 30,  starAlpha: 0.2 };
  return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
}

// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
function spawnMoving() {
  const top = blocks[blocks.length - 1];
  const speed = Math.min(1.8 + score * 0.12, 5.5);
  movingBlock = {
    worldX: rng() * (canvas.width - top.width - 8) + 4,
    worldY: top.worldY - BLOCK_H,
    width: top.width,
    dir: rng() < 0.5 ? 1 : -1,
    speed,
    color: blockColor(score + 1),
    speedMult: 1.0,
    targetMult: 1.0,
    multTimer: 800 + rng() * 600,
    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
    wobblePhase: rng() * Math.PI * 2,
    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
  };
  cameraY = movingBlock.worldY - MOVING_Y;
}

function initGame(opts = {}) {
  if (opts.newSeed) {
    currentSeed = makeSeed();
    rng = makePRNG(currentSeed);
    refreshSeedDisplay();
  } else if (opts.replay) {
    rng = makePRNG(currentSeed); // 같은 시드로 재시작
  }
  score = 0;
  combo = 0;
  cameraY = 0;
  falling = [];
  particles = [];
  perfectText = '';
  perfectTimer = 0;
  phase = 'playing';
  gameoverShakeApplied = false;
  scoreEl.textContent = '0';
  comboWrap.style.display = 'none';
  blocks = [{
    worldX: canvas.width / 2 - BASE_WIDTH / 2,
    worldY: 500,
    width: BASE_WIDTH,
    color: blockColor(0),
  }];
  spawnMoving();
}

// ── Particle ─────────────────────────────────────────────────────────────────
function spawnPerfectParticles(cx, cy) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * (1.5 + Math.random() * 2),
      vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
      life: 1, decay: 0.025 + Math.random() * 0.02,
      color: '#facc15',
      size: 2 + Math.random() * 2,
    });
  }
}
function spawnDustParticles(cx, cy, color) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5,
      life: 1, decay: 0.04,
      color: color || '#fff',
      size: 1.5,
    });
  }
}

// ── Drop logic ────────────────────────────────────────────────────────────────
function dropBlock() {
  ensureAudio(); // 첫 입력에서 오디오 unlock
  if (phase !== 'playing') {
    initGame({ replay: true });
    return;
  }

  const top = blocks[blocks.length - 1];
  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
  const mw = movingBlock.width;
  const tx = top.worldX;
  const tw = top.width;

  const overlapLeft  = Math.max(mx, tx);
  const overlapRight = Math.min(mx + mw, tx + tw);
  const overlapW = overlapRight - overlapLeft;

  if (overlapW <= 0) {
    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
    triggerGameover();
    return;
  }

  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
  const stableness = Math.min(overlapW / mw, 1);
  sfxDrop(stableness);

  if (isPerfect) {
    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
    combo++;
    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
    perfectTimer = 1100;
    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
    sfxPerfect();
    if (combo % 3 === 0 && combo >= 3) {
      sfxCombo(combo);
      vibrate(40);
      toast(`🔥 ${combo} 연속 퍼펙트!`);
    }
    if (combo > comboRecord) {
      comboRecord = combo;
      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
    }
  } else {
    if (mx < tx) {
      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
    } else {
      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
    }
    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
    combo = 0;
  }

  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
  score += gained;
  scoreEl.textContent = score;
  if (combo >= 2) {
    comboWrap.style.display = '';
    comboEl.textContent = combo;
  } else {
    comboWrap.style.display = 'none';
  }

  if (blocks[blocks.length - 1].width < 4) {
    triggerGameover();
    return;
  }

  spawnMoving();
}

function triggerGameover() {
  phase = 'gameover';
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(STORAGE_BEST, String(bestScore));
    bestEl.textContent = bestScore;
    toast('🎉 신기록 달성!');
  }
  sfxGameover();
  vibrate([60, 40, 90]);
  if (!gameoverShakeApplied) {
    gameoverShakeApplied = true;
    canvas.classList.remove('shake');
    void canvas.offsetWidth; // reflow
    canvas.classList.add('shake');
  }
}

function toScreenY(worldY) { return worldY - cameraY; }

// ── Update ───────────────────────────────────────────────────────────────────
function update(dt) {

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..137599b430ae40ede728ca194b2014fcad12f8b2
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..87053dbdd3e8fad068e147e3dd3e18d0df050629
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE + id),
+    motionRng: makePRNG(seed, 0xB4771E + id),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE + player.id);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E + player.id);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..87053dbdd3e8fad068e147e3dd3e18d0df050629
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE + id),
+    motionRng: makePRNG(seed, 0xB4771E + id),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE + player.id);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E + player.id);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

codex
첫 패치가 들어갔습니다. 지금은 문법과 요구사항 매칭을 확인하면서 PRNG 동기화처럼 코드상으로는 작지만 배틀 공정성에 직접 영향을 주는 부분을 바로 잡겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "makePRNG|MODES|perfectThresh|multTimerScale|wobbleStart|shrink|fog|btnBattle|battleCountdown|finishBattle|dropBlock|drawBattleOverlay|refreshUI" user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
174:const btnBattle = document.getElementById('btn-battle');
186:const MODES = {
192:    wobbleStart: 50,
195:    multTimerScale: 1.5,
196:    shrink: false,
197:    fog: false,
198:    perfectThresh: 8,
205:    wobbleStart: 30,
208:    multTimerScale: 1.0,
209:    shrink: false,
210:    fog: false,
211:    perfectThresh: 6,
218:    wobbleStart: 15,
221:    multTimerScale: 0.7,
222:    shrink: true,
223:    fog: true,
224:    perfectThresh: 4,
234:function makePRNG(seed, salt = 0) {
247:if (!MODES[currentModeKey]) currentModeKey = 'normal';
251:let battleCountdown = 0;
263:function getMode() { return MODES[currentModeKey]; }
354:    patternRng: makePRNG(seed, 0xA51CE + id),
355:    motionRng: makePRNG(seed, 0xB4771E + id),
370:  return ms * getMode().multTimerScale;
374:  if (!getMode().shrink) return topWidth;
375:  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
376:  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
385:  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
386:  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
405:  player.patternRng = makePRNG(currentSeed, 0xA51CE + player.id);
406:  player.motionRng = makePRNG(currentSeed, 0xB4771E + player.id);
428:  battleCountdown = 0;
436:  refreshUI();
471:function dropBlock(player) {
498:  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
531:  refreshUI();
563:  refreshUI();
570:    finishBattle();
573:  if (gamePhase !== 'battleCountdown') {
574:    gamePhase = 'battleCountdown';
575:    battleCountdown = BATTLE_COUNTDOWN_MS;
580:function finishBattle() {
585:  refreshUI();
652:  if (gamePhase === 'battleCountdown') {
653:    battleCountdown -= dt;
654:    if (battleCountdown <= 0) finishBattle();
756:  if (!getMode().fog || player.score < 50) return;
828:function drawBattleOverlay() {
838:  if (gamePhase === 'battleCountdown') {
839:    const secs = Math.ceil(battleCountdown / 1000);
882:function refreshUI() {
886:  btnBattle.classList.toggle('active', battleMode);
887:  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
916:    drawBattleOverlay();
939:    dropBlock(players[0]);
942:  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
948:    dropBlock(players[0]);
952:    if (battleMode) dropBlock(players[1]);
968:btnBattle.addEventListener('click', () => {

hook: PostToolUse
exec
/bin/zsh -lc "node - <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8');
new Function(html.match(/<script>([\\s\\S]+?)<\\/script>/)[1]);
console.log('syntax ok');
NODE" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 succeeded in 129ms:
syntax ok

hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..87053dbdd3e8fad068e147e3dd3e18d0df050629
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE + id),
+    motionRng: makePRNG(seed, 0xB4771E + id),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE + player.id);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E + player.id);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

codex
문법 검사는 통과했고, 배틀 공정성 때문에 P1/P2 PRNG salt를 동일하게 조정했습니다. 이제 실제 스크립트를 mock DOM 환경에서 실행해 모드 값과 배틀 초기 패턴 동기화까지 확인하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "node - <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('user/donghyun/projects/tower-stack/index.html', 'utf8');
let raf = 0;
const ctx = new Proxy({}, { get(target, prop) {
  if (prop === 'createLinearGradient') return () => ({ addColorStop() {} });
  if (prop === 'measureText') return () => ({ width: 0 });
  return target[prop] || function() {};
}, set(target, prop, value) { target[prop] = value; return true; } });
const elements = {};
function makeEl(id) {
  return elements[id] ||= {
    id,
    textContent: '',
    style: {},
    dataset: {},
    classList: { add(){}, remove(){}, toggle(){} },
    addEventListener(){},
    parentElement: { style: {} },
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 720, height: 600 }),
    width: 0,
    height: 0,
  };
}
const modeBtns = ['easy','normal','hard'].map(mode => ({ dataset: { mode }, classList: { toggle(){} }, addEventListener(){} }));
global.window = { innerWidth: 900, innerHeight: 900, location: { search: '' }, addEventListener(){}, AudioContext: function(){ this.currentTime = 0; this.createOscillator = () => ({ connect(){}, start(){}, stop(){}, frequency: {} }); this.createGain = () => ({ connect(){}, gain: { setValueAtTime(){}, exponentialRampToValueAtTime(){} } }); } };
global.location = { origin: 'http://local', pathname: '/tower-stack/' };
global.document = { getElementById: makeEl, querySelectorAll: () => modeBtns, addEventListener(){} };
global.localStorage = { store: {}, getItem(k){ return this.store[k] ?? null; }, setItem(k,v){ this.store[k] = String(v); } };
global.navigator = { vibrate(){}, clipboard: { writeText(){ return Promise.resolve(); } } };
global.requestAnimationFrame = cb => { if (raf++ < 1) cb(16); };
global.prompt = () => {};
makeEl('canvas');
const script = html.match(/<script>([\\s\\S]+?)<\\/script>/)[1];
new Function(script + "'`
currentModeKey = '"'hard';
battleMode = true;
currentSeed = 424242;
initGame({ replay: true, silent: true });
if (canvas.width "'!== 720) throw new Error('"'battle width not 720');
const a = players[0].movingBlock;
const b = players[1].movingBlock;
const same = ['worldX','worldY','width','dir','speed','wobbleAmp'].every(k => a[k] === b[k]);
if ("'!same) throw new Error('"'battle first block pattern desynced');
if (getMode().perfectThresh "'!== 4 || getMode().maxSpeed !== 7.5) throw new Error('"'hard mode params missing');
currentModeKey = 'easy';
if (getMode().perfectThresh "'!== 8 || getMode().multTimerScale !== 1.5) throw new Error('"'easy mode params missing');
console.log('runtime checks ok', canvas.width, players.length, a.width, b.width);
"'`)();
NODE' in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "node -e \"const fs=require('fs');const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8');new Function(html.match(/<script>([\\\\s\\\\S]+?)<\\\\/script>/)[1]);console.log('new Function syntax ok')\"" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
hook: PostToolUse
 succeeded in 158ms:
new Function syntax ok

 succeeded in 166ms:
runtime checks ok 720 2 200 200

hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "node - <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('user/donghyun/projects/tower-stack/index.html', 'utf8');
let raf = 0;
const ctx = new Proxy({}, { get(target, prop) { if (prop === 'createLinearGradient') return () => ({ addColorStop() {} }); return target[prop] || function() {}; }, set(target, prop, value) { target[prop] = value; return true; } });
const elements = {};
function makeEl(id) { return elements[id] ||= { textContent:'', style:{}, dataset:{}, classList:{add(){},remove(){},toggle(){}}, addEventListener(){}, parentElement:{style:{}}, getContext:()=>ctx, getBoundingClientRect:()=>({left:0,top:0,width:720,height:600}), width:0, height:0 }; }
const modeBtns = ['easy','normal','hard'].map(mode => ({ dataset:{ mode }, classList:{ toggle(){} }, addEventListener(){} }));
global.window = { innerWidth: 900, innerHeight: 900, location: { search: '' }, addEventListener(){}, AudioContext: function(){ this.currentTime=0; this.createOscillator=()=>({connect(){},start(){},stop(){},frequency:{}}); this.createGain=()=>({connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}}); } };
global.location = { origin:'http://local', pathname:'/tower-stack/' };
global.document = { getElementById: makeEl, querySelectorAll: () => modeBtns, addEventListener(){} };
global.localStorage = { store:{}, getItem(k){return this.store[k] ?? null;}, setItem(k,v){this.store[k]=String(v);} };
global.navigator = { vibrate(){}, clipboard:{ writeText(){ return Promise.resolve(); } } };
global.requestAnimationFrame = cb => { if (raf++ < 1) cb(16); };
global.prompt = () => {};
makeEl('canvas');
const script = html.match(/<script>([\\s\\S]+?)<\\/script>/)[1];
new Function(script + "'`
battleMode = true; currentModeKey = '"'normal'; currentSeed = 777; initGame({ replay:true, silent:true });
for (let i = 0; i < 5; i++) {
  for (const p of players) p.movingBlock.worldX = p.blocks[p.blocks.length - 1].worldX;
  dropBlock(players[0]);
  dropBlock(players[1]);
  const a = players[0].movingBlock;
  const b = players[1].movingBlock;
  const same = ['worldX','worldY','width','dir','speed','wobbleAmp'].every(k => a[k] === b[k]);
  if ("'!same) throw new Error('"'desync after drop ' + i);
}
console.log('battle sequence sync ok', players[0].score, players[1].score);
"'`)();
NODE
wc -l -c user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

 succeeded in 1920ms:
battle sequence sync ok 21 21
     998   36426 user/donghyun/projects/tower-stack/index.html

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

codex
추가 실행 검증도 통과했습니다. P1/P2가 같은 시드에서 5번 연속 퍼펙트 드롭을 해도 다음 블록의 위치·폭·방향·속도·흔들림 값이 계속 일치하는 것을 확인했습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "STORAGE_MODE|const MODES|function spawnMoving|function nextBlockWidth|function finishBattle|function drawBattleOverlay|modeButtons|btnBattle|new Function syntax ok" user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
174:const btnBattle = document.getElementById('btn-battle');
175:const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
184:const STORAGE_MODE = 'mksga_tower_mode_v1';
186:const MODES = {
246:let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
373:function nextBlockWidth(player, topWidth) {
380:function spawnMoving(player) {
580:function finishBattle() {
828:function drawBattleOverlay() {
886:  btnBattle.classList.toggle('active', battleMode);
887:  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
888:  for (const btn of modeButtons) {
960:for (const btn of modeButtons) {
963:    localStorage.setItem(STORAGE_MODE, currentModeKey);
968:btnBattle.addEventListener('click', () => {

hook: PostToolUse
exec
/bin/zsh -lc "git diff --stat -- user/donghyun/projects/tower-stack/index.html && git diff -- user/donghyun/projects/tower-stack/index.html | sed -n '1,260p'" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 succeeded in 113ms:
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index ac11492..6638785 100644
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -2,9 +2,11 @@
 <html lang="ko">
 <head>
   <meta charset="UTF-8">
+  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
   <title>탑 쌓기 게임</title>
   <style>
-    * { margin: 0; padding: 0; box-sizing: border-box; }
+    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
+    html, body { overflow: hidden; touch-action: none; }
     body {
       background: #0f0f1a;
       display: flex;
@@ -12,115 +14,474 @@
       align-items: center;
       justify-content: center;
       min-height: 100vh;
-      font-family: 'Segoe UI', sans-serif;
+      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
       color: white;
+      user-select: none;
+      -webkit-user-select: none;
+      padding: 8px;
+    }
+    #stage {
+      position: relative;
+      display: flex;
+      flex-direction: column;
+      align-items: center;
     }
     canvas {
       display: block;
       border-radius: 12px;
       box-shadow: 0 0 40px rgba(100,100,255,0.2);
+      touch-action: none;
+    }
+    /* 화면 흔들림 (게임오버) */
+    canvas.shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
+    @keyframes shake {
+      10%, 90% { transform: translateX(-2px); }
+      20%, 80% { transform: translateX(4px); }
+      30%, 50%, 70% { transform: translateX(-7px); }
+      40%, 60% { transform: translateX(7px); }
     }
     #ui {
-      margin-top: 14px;
+      margin-top: 12px;
       display: flex;
-      gap: 20px;
+      gap: 14px;
       align-items: center;
+      flex-wrap: wrap;
+      justify-content: center;
+      max-width: 95vw;
     }
-    #score-display {
-      font-size: 1.1rem;
+    .stat {
+      font-size: 0.95rem;
       color: #aaa;
     }
-    #score-display span {
-      color: #facc15;
-      font-weight: bold;
-      font-size: 1.3rem;
+    .stat span { color: #facc15; font-weight: bold; font-size: 1.2rem; }
+    .stat.combo span { color: #fb7185; }
+    .stat.best span { color: #60a5fa; font-size: 1rem; }
+    #hint { font-size: 0.78rem; color: #555; }
+    #toolbar {
+      display: flex;
+      gap: 8px;
+      margin-top: 10px;
+      flex-wrap: wrap;
+      justify-content: center;
+    }
+    .btn {
+      background: #1f2937;
+      color: #cbd5e1;
+      border: 1px solid #334155;
+      padding: 7px 14px;
+      border-radius: 8px;
+      font-size: 0.78rem;
+      cursor: pointer;
+      transition: background 0.15s;
+    }
+    .btn:hover { background: #334155; color: white; }
+    .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
     }
-    #hint {
+    #battle-scores span { color: #facc15; }
+    #seed-display {
+      font-size: 0.7rem;
+      color: #64748b;
+      margin-top: 6px;
+      font-family: monospace;
+    }
+    #toast {
+      position: fixed;
+      top: 16px;
+      left: 50%;
+      transform: translateX(-50%) translateY(-80px);
+      background: #1e293b;
+      border: 1px solid #475569;
+      color: white;
+      padding: 10px 18px;
+      border-radius: 10px;
       font-size: 0.85rem;
-      color: #555;
+      transition: transform 0.35s cubic-bezier(.5,1.6,.4,1), opacity 0.3s;
+      opacity: 0;
+      pointer-events: none;
+      z-index: 100;
+      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
+    }
+    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
+    @media (max-width: 420px) {
+      .stat { font-size: 0.85rem; }
+      .stat span { font-size: 1.05rem; }
     }
   </style>
 </head>
 <body>
-  <canvas id="canvas" width="360" height="580"></canvas>
-  <div id="ui">
-    <div id="score-display">점수: <span id="score">0</span></div>
-    <div id="hint">스페이스바 또는 클릭</div>
+  <div id="stage">
+    <canvas id="canvas"></canvas>
+    <div id="ui">
+      <div class="stat">점수: <span id="score">0</span></div>
+      <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
+      <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
+    </div>
+    <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
+      <button class="btn" id="btn-share">🔗 시드 공유</button>
+      <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-mute">🔊 소리</button>
+    </div>
+    <div id="seed-display">seed: --</div>
+    <div id="hint" style="margin-top:8px">스페이스바 · 클릭 · 터치</div>
   </div>
+  <div id="toast"></div>
 
 <script>
+'use strict';
+
+// ── DOM ──────────────────────────────────────────────────────────────────────
 const canvas = document.getElementById('canvas');
 const ctx = canvas.getContext('2d');
 const scoreEl = document.getElementById('score');
-
+const bestEl = document.getElementById('best');
+const comboEl = document.getElementById('combo');
+const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
+const seedDisplay = document.getElementById('seed-display');
+const toastEl = document.getElementById('toast');
+const btnShare = document.getElementById('btn-share');
+const btnReset = document.getElementById('btn-reset');
+const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
+
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
-const MOVING_Y = 90;       // 화면상 움직이는 블록의 고정 y 위치
-const PERFECT_THRESH = 6;  // 이 픽셀 이내면 퍼펙트
+const MOVING_Y = 90;
+const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_MUTE = 'mksga_tower_mute_v1';
+const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
+
+// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
+function parseSeedFromURL() {
+  const m = window.location.search.match(/seed=(\d+)/);
+  return m ? parseInt(m[1], 10) : null;
+}
+function makeSeed() { return (Math.random() * 1e9) | 0; }
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
+  return function() {
+    s |= 0; s = (s + 0x6D2B79F5) | 0;

hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '820,990p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
}

function drawBattleOverlay() {
  if (!battleMode) return;
  const mid = canvas.width / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mid + 0.5, 0);
  ctx.lineTo(mid + 0.5, canvas.height);
  ctx.stroke();

  if (gamePhase === 'battleCountdown') {
    const secs = Math.ceil(battleCountdown / 1000);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(mid - 54, 42, 108, 42);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${secs}`, mid, 70);
  }

  if (gamePhase !== 'battleResult') return;
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);

  battleButtons = [
    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
  ];
  for (const btn of battleButtons) {
    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
  }
}

// ── UI ───────────────────────────────────────────────────────────────────────
function refreshSeedDisplay() {
  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
}

function refreshUI() {
  const p1 = players[0];
  const p2 = players[1];
  modeLabel.textContent = `모드: ${getMode().label}`;
  btnBattle.classList.toggle('active', battleMode);
  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
  for (const btn of modeButtons) {
    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
  }
  battleScores.style.display = battleMode ? 'flex' : 'none';
  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
  if (p1) {
    scoreEl.textContent = p1.score;
    comboEl.textContent = p1.combo;
    p1ScoreEl.textContent = p1.score;
  }
  if (p2) p2ScoreEl.textContent = p2.score;
  bestEl.textContent = bestScore;
  refreshSeedDisplay();
}

// ── Loop ─────────────────────────────────────────────────────────────────────
let lastTime = 0;
function loop(t) {
  const dt = Math.min(t - lastTime, 50);
  lastTime = t;
  update(dt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (battleMode) {
    const half = canvas.width / 2;
    drawPlayer(players[0], 0, half);
    drawPlayer(players[1], half, half);
    drawBattleOverlay();
  } else {
    drawPlayer(players[0], 0, canvas.width);
  }

  requestAnimationFrame(loop);
}

// ── Input ────────────────────────────────────────────────────────────────────
function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  const source = evt.touches ? evt.touches[0] : evt;
  return {
    x: (source.clientX - rect.left) * (canvas.width / rect.width),
    y: (source.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function handleCanvasAction(evt) {
  evt.preventDefault();
  const pt = canvasPoint(evt);
  if (handleBattleButton(pt.x, pt.y)) return;
  if (!battleMode) {
    dropBlock(players[0]);
    return;
  }
  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    dropBlock(players[0]);
  }
  if (e.code === 'Enter') {
    e.preventDefault();
    if (battleMode) dropBlock(players[1]);
    else if (gamePhase === 'singleGameover') initGame({ replay: true });
  }
});
canvas.addEventListener('click', handleCanvasAction);
canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });

// ── Toolbar ──────────────────────────────────────────────────────────────────
for (const btn of modeButtons) {
  btn.addEventListener('click', () => {
    currentModeKey = btn.dataset.mode;
    localStorage.setItem(STORAGE_MODE, currentModeKey);
    initGame({ replay: true });
  });
}

btnBattle.addEventListener('click', () => {
  battleMode = !battleMode;
  initGame({ replay: true });
});

btnShare.addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
  try {
    await navigator.clipboard.writeText(url);
    toast(`📋 시드 ${currentSeed} 링크 복사됨!`);
  } catch (_) {
    prompt('이 시드 링크를 복사하세요', url);
  }
});
btnReset.addEventListener('click', () => {
  initGame({ newSeed: true });
  toast(`🎲 새 시드: ${currentSeed}`);
});
btnMute.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');
  btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
});

hook: PostToolUse
exec
/bin/zsh -lc "sed -n '330,450p' user/donghyun/projects/tower-stack/index.html && sed -n '560,610p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

// ── Color & Theme ─────────────────────────────────────────────────────────────
function blockColor(n) {
  const hue = (n * 37) % 360;
  return `hsl(${hue}, 75%, 58%)`;
}
function getTheme(s) {
  // 점수에 따른 5단계 테마
  if (s < 20)       return { name: 'night',  topH: 230, topS: 40, topL: 18, botH: 240, botS: 30, botL: 12, starHue: 0, starAlpha: 0.4 };
  if (s < 50)       return { name: 'dawn',   topH: 280, topS: 45, topL: 26, botH: 20,  botS: 40, botL: 18, starHue: 280, starAlpha: 0.3 };
  if (s < 100)      return { name: 'day',    topH: 200, topS: 65, topL: 60, botH: 195, botS: 55, botL: 35, starHue: 0,   starAlpha: 0.0 };
  if (s < 200)      return { name: 'sunset', topH: 25,  topS: 75, topL: 50, botH: 320, botS: 50, botL: 28, starHue: 30,  starAlpha: 0.2 };
  return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
}

// ── Player State ─────────────────────────────────────────────────────────────
function makePlayer(id, label, seed) {
  return {
    id,
    label,
    viewWidth: getPlayWidth(),
    patternRng: makePRNG(seed, 0xA51CE),
    motionRng: makePRNG(seed, 0xB4771E),
    blocks: [],
    movingBlock: null,
    falling: [],
    particles: [],
    cameraY: 0,
    score: 0,
    combo: 0,
    phase: 'playing',
    perfectText: '',
    perfectTimer: 0,
  };
}

function scaledTimer(ms) {
  return ms * getMode().multTimerScale;
}

function nextBlockWidth(player, topWidth) {
  if (!getMode().shrink) return topWidth;
  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
  return Math.max(18, Math.min(topWidth, cap));
}

function spawnMoving(player) {
  const mode = getMode();
  const top = player.blocks[player.blocks.length - 1];
  const width = nextBlockWidth(player, top.width);
  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
  player.movingBlock = {
    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
    worldY: top.worldY - BLOCK_H,
    width,
    dir: player.patternRng() < 0.5 ? 1 : -1,
    speed,
    color: blockColor(player.score + 1),
    speedMult: 1.0,
    targetMult: 1.0,
    multTimer: scaledTimer(800 + player.motionRng() * 600),
    wobblePhase: player.patternRng() * Math.PI * 2,
    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
  };
  player.cameraY = player.movingBlock.worldY - MOVING_Y;
}

function initPlayer(player) {
  player.viewWidth = getPlayWidth();
  player.patternRng = makePRNG(currentSeed, 0xA51CE);
  player.motionRng = makePRNG(currentSeed, 0xB4771E);
  player.score = 0;
  player.combo = 0;
  player.cameraY = 0;
  player.falling = [];
  player.particles = [];
  player.perfectText = '';
  player.perfectTimer = 0;
  player.phase = 'playing';
  player.blocks = [{
    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
    worldY: 500,
    width: BASE_WIDTH,
    color: blockColor(0),
  }];
  spawnMoving(player);
}

function initGame(opts = {}) {
  if (opts.newSeed) currentSeed = makeSeed();
  fitCanvas();
  gamePhase = 'playing';
  battleCountdown = 0;
  battleWinner = '';
  battleButtons = [];
  gameoverShakeApplied = false;
  canvas.classList.remove('shake');
  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
  for (const player of players) initPlayer(player);
  refreshSeedDisplay();
  refreshUI();
  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
}

// ── Particle ─────────────────────────────────────────────────────────────────
function toScreenY(player, worldY) { return worldY - player.cameraY; }

function spawnPerfectParticles(player, cx, cy) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    player.particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * (1.5 + Math.random() * 2),
      vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
      life: 1, decay: 0.025 + Math.random() * 0.02,
  } else {
    gamePhase = 'singleGameover';
  }
  refreshUI();
}

// ── Battle Mode ──────────────────────────────────────────────────────────────
function startBattleCountdown() {
  const alive = players.filter(p => p.phase === 'playing');
  if (alive.length === 0) {
    finishBattle();
    return;
  }
  if (gamePhase !== 'battleCountdown') {
    gamePhase = 'battleCountdown';
    battleCountdown = BATTLE_COUNTDOWN_MS;
    toast('상대 5초 추가 턴');
  }
}

function finishBattle() {
  for (const player of players) player.phase = 'gameover';
  gamePhase = 'battleResult';
  const [p1, p2] = players;
  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
  refreshUI();
}

function handleBattleButton(x, y) {
  if (gamePhase !== 'battleResult') return false;
  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
  if (!hit) return false;
  if (hit.action === 'rematch') initGame({ replay: true });
  if (hit.action === 'newSeed') initGame({ newSeed: true });
  return true;
}

// ── Update ───────────────────────────────────────────────────────────────────
function updatePlayer(player, dt) {
  if (player.phase === 'playing') {
    const moving = player.movingBlock;
    moving.multTimer -= dt;
    if (moving.multTimer <= 0) {
      const r = player.motionRng();
      if (r < 0.20) {
        moving.targetMult = 0.05;
        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
      } else if (r < 0.45) {
        moving.targetMult = 2.2 + player.motionRng() * 1.2;
        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
      } else {

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '430,590p' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "rg -n \"\\bblocks\\b|\\bmovingBlock\\b|\\bphase\\b|\\bscore\\b|PERFECT_THRESH|\\brng\\b\" user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
hook: PostToolUse
 succeeded in 134ms:
  battleButtons = [];
  gameoverShakeApplied = false;
  canvas.classList.remove('shake');
  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
  for (const player of players) initPlayer(player);
  refreshSeedDisplay();
  refreshUI();
  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
}

// ── Particle ─────────────────────────────────────────────────────────────────
function toScreenY(player, worldY) { return worldY - player.cameraY; }

function spawnPerfectParticles(player, cx, cy) {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    player.particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * (1.5 + Math.random() * 2),
      vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
      life: 1, decay: 0.025 + Math.random() * 0.02,
      color: '#facc15',
      size: 2 + Math.random() * 2,
    });
  }
}
function spawnDustParticles(player, cx, cy, color) {
  for (let i = 0; i < 6; i++) {
    player.particles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5,
      life: 1, decay: 0.04,
      color: color || '#fff',
      size: 1.5,
    });
  }
}

// ── Drop logic ────────────────────────────────────────────────────────────────
function dropBlock(player) {
  ensureAudio(); // 첫 입력에서 오디오 unlock
  if (!player) return;
  if (gamePhase === 'battleResult') return;
  if (!battleMode && gamePhase !== 'playing') {
    initGame({ replay: true });
    return;
  }
  if (player.phase !== 'playing') return;

  const top = player.blocks[player.blocks.length - 1];
  const moving = player.movingBlock;
  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
  const mw = moving.width;
  const tx = top.worldX;
  const tw = top.width;

  const overlapLeft  = Math.max(mx, tx);
  const overlapRight = Math.min(mx + mw, tx + tw);
  const overlapW = overlapRight - overlapLeft;

  if (overlapW <= 0) {
    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
    triggerGameover(player);
    return;
  }

  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
  const stableness = Math.min(overlapW / mw, 1);
  sfxDrop(stableness);

  if (isPerfect) {
    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
    player.combo++;
    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
    player.perfectTimer = 1100;
    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
    sfxPerfect();
    if (player.combo % 3 === 0 && player.combo >= 3) {
      sfxCombo(player.combo);
      vibrate(40);
      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
    }
    if (player.combo > comboRecord) {
      comboRecord = player.combo;
      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
    }
  } else {
    if (mx < tx) {
      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
    } else {
      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
    }
    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
    player.combo = 0;
  }

  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
  player.score += gained;
  refreshUI();

  if (player.blocks[player.blocks.length - 1].width < 4) {
    triggerGameover(player);
    return;
  }

  spawnMoving(player);
}

function triggerGameover(player) {
  if (player.phase !== 'playing') return;
  player.phase = 'gameover';
  if (player.score > bestScore) {
    bestScore = player.score;
    localStorage.setItem(STORAGE_BEST, String(bestScore));
    bestEl.textContent = bestScore;
    toast('🎉 신기록 달성!');
  }
  sfxGameover();
  vibrate([60, 40, 90]);
  if (!gameoverShakeApplied) {
    gameoverShakeApplied = true;
    canvas.classList.remove('shake');
    void canvas.offsetWidth; // reflow
    canvas.classList.add('shake');
  }
  if (battleMode) {
    startBattleCountdown();
  } else {
    gamePhase = 'singleGameover';
  }
  refreshUI();
}

// ── Battle Mode ──────────────────────────────────────────────────────────────
function startBattleCountdown() {
  const alive = players.filter(p => p.phase === 'playing');
  if (alive.length === 0) {
    finishBattle();
    return;
  }
  if (gamePhase !== 'battleCountdown') {
    gamePhase = 'battleCountdown';
    battleCountdown = BATTLE_COUNTDOWN_MS;
    toast('상대 5초 추가 턴');
  }
}

function finishBattle() {
  for (const player of players) player.phase = 'gameover';
  gamePhase = 'battleResult';
  const [p1, p2] = players;
  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
  refreshUI();
}

function handleBattleButton(x, y) {
  if (gamePhase !== 'battleResult') return false;
  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);

 succeeded in 146ms:
132:      <div class="stat">점수: <span id="score">0</span></div>
137:        <div>P1 <span id="p1-score">0</span></div>
138:        <div>P2 <span id="p2-score">0</span></div>
161:const scoreEl = document.getElementById('score');
167:const p1ScoreEl = document.getElementById('p1-score');
168:const p2ScoreEl = document.getElementById('p2-score');
356:    blocks: [],
357:    movingBlock: null,
361:    score: 0,
363:    phase: 'playing',
375:  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
382:  const top = player.blocks[player.blocks.length - 1];
384:  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
385:  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
386:  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
387:  player.movingBlock = {
393:    color: blockColor(player.score + 1),
400:  player.cameraY = player.movingBlock.worldY - MOVING_Y;
407:  player.score = 0;
414:  player.phase = 'playing';
415:  player.blocks = [{
479:  if (player.phase !== 'playing') return;
481:  const top = player.blocks[player.blocks.length - 1];
482:  const moving = player.movingBlock;
503:    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
524:    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
530:  player.score += gained;
533:  if (player.blocks[player.blocks.length - 1].width < 4) {
542:  if (player.phase !== 'playing') return;
543:  player.phase = 'gameover';
544:  if (player.score > bestScore) {
545:    bestScore = player.score;
568:  const alive = players.filter(p => p.phase === 'playing');
581:  for (const player of players) player.phase = 'gameover';
584:  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
599:  if (player.phase === 'playing') {
600:    const moving = player.movingBlock;
660:  const theme = getTheme(player.score);
668:    const count = Math.floor(20 + player.score * 0.15);
671:      const sx = ((i * 137 + player.score * 3) % width);
700:  if (player.phase !== 'playing') return;
701:  const moving = player.movingBlock;
705:  const top = player.blocks[player.blocks.length - 1];
744:  const top = player.blocks[player.blocks.length - 1];
756:  if (!getMode().fog || player.score < 50) return;
772:  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
791:  ctx.fillText(`${player.label} ${player.score}`, x, 22);
792:  if (player.phase === 'gameover') {
811:  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
857:  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
895:    scoreEl.textContent = p1.score;
897:    p1ScoreEl.textContent = p1.score;
899:  if (p2) p2ScoreEl.textContent = p2.score;

hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e \"const fs=require('fs');const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8');new Function(html.match(/<script>([\\\\s\\\\S]+?)<\\\\/script>/)[1])\" && wc -l -c user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'git diff --check -- user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc 'git status --short -- user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
 M user/donghyun/projects/tower-stack/index.html

hook: PostToolUse
 succeeded in 106ms:
     998   36426 user/donghyun/projects/tower-stack/index.html

hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

codex
완료했습니다. 변경 파일: [index.html](/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html)

1. 모드 토글 확인  
`MODES` 객체로 Easy / Normal / Hard 분기 추가했고, 속도·최대속도·흔들림 시작 점수·진폭·가속 패턴 빈도·Hard 폭 축소·Hard 안개·`perfectThresh`가 모두 `getMode()` 경유로 적용됩니다. 모드는 `mksga_tower_mode_v1`에 저장되고 변경 즉시 새 게임이 시작됩니다.

2. 배틀 모드 시드/패턴 동기화 확인  
P1/P2가 독립 PRNG 인스턴스를 가지되 같은 `currentSeed`와 같은 salt로 시작합니다. mock 실행에서 5회 연속 동일 드롭 후에도 다음 블록 `worldX/worldY/width/dir/speed/wobbleAmp` 동기화 확인했습니다.

3. JS 구문 에러 없음  
요청하신 검사 통과:
```bash
node -e "const fs=require('fs');const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8');new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"
```

4. 파일 크기 / 라인 수  
`998` lines, `36,426` bytes.

5. 변경 핵심 5줄 요약  
- Easy / Normal / Hard 모드 버튼, 현재 모드 라벨, localStorage 저장 추가.
- 기존 싱글 플레이 상태를 `players[]` 기반 플레이어 객체 구조로 전환.
- 배틀 모드 ON 시 2분할 캔버스, P1 Space/좌측 입력, P2 Enter/우측 입력 지원.
- 한쪽 게임오버 후 5초 카운트다운, 결과 화면, 리매치/새 시드 버튼 추가.
- Hard 전용 점진 폭 축소와 점수 50+ 상단 안개 띠 추가.

추가 검증: `git diff --check` 통과. 실제 브라우저 수동 플레이는 실행하지 않았고, 문법 및 mock DOM 런타임 검증까지 수행했습니다.
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index fa5da7518c96ff449964afcd1197756490e0e147..66387856519ed91318ea4d115c25b9508de4ca87
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -76,6 +76,25 @@
     }
     .btn:hover { background: #334155; color: white; }
     .btn:active { background: #475569; }
+    .btn.active {
+      background: #2563eb;
+      border-color: #60a5fa;
+      color: white;
+    }
+    #mode-label {
+      color: #86efac;
+      font-size: 0.78rem;
+    }
+    #battle-scores {
+      display: none;
+      width: 100%;
+      justify-content: space-between;
+      gap: 12px;
+      font-size: 0.9rem;
+      color: #cbd5e1;
+      font-weight: 700;
+    }
+    #battle-scores span { color: #facc15; }
     #seed-display {
       font-size: 0.7rem;
       color: #64748b;
@@ -113,8 +132,17 @@
       <div class="stat">점수: <span id="score">0</span></div>
       <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
       <div class="stat best">최고: <span id="best">0</span></div>
+      <div class="stat" id="mode-label">모드: Normal</div>
+      <div id="battle-scores">
+        <div>P1 <span id="p1-score">0</span></div>
+        <div>P2 <span id="p2-score">0</span></div>
+      </div>
     </div>
     <div id="toolbar">
+      <button class="btn mode-btn" data-mode="easy">Easy</button>
+      <button class="btn mode-btn" data-mode="normal">Normal</button>
+      <button class="btn mode-btn" data-mode="hard">Hard</button>
+      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
@@ -134,30 +162,68 @@
 const bestEl = document.getElementById('best');
 const comboEl = document.getElementById('combo');
 const comboWrap = document.getElementById('combo-wrap');
+const modeLabel = document.getElementById('mode-label');
+const battleScores = document.getElementById('battle-scores');
+const p1ScoreEl = document.getElementById('p1-score');
+const p2ScoreEl = document.getElementById('p2-score');
 const seedDisplay = document.getElementById('seed-display');
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
 const btnMute = document.getElementById('btn-mute');
+const btnBattle = document.getElementById('btn-battle');
+const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
 
-// ── Constants ────────────────────────────────────────────────────────────────
+// ── Constants & Modes ────────────────────────────────────────────────────────
 const BLOCK_H = 22;
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
-const PERFECT_THRESH = 6;
 const STORAGE_BEST = 'mksga_tower_best_v1';
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
-
-// ── Responsive canvas ────────────────────────────────────────────────────────
-function fitCanvas() {
-  const targetW = Math.max(320, Math.min(window.innerWidth - 32, 480));
-  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
-  canvas.width = targetW;
-  canvas.height = targetH;
-}
-fitCanvas();
-window.addEventListener('resize', () => { fitCanvas(); });
+const STORAGE_MODE = 'mksga_tower_mode_v1';
+const BATTLE_COUNTDOWN_MS = 5000;
+const MODES = {
+  easy: {
+    label: 'Easy',
+    speedBase: 1.4,
+    speedScore: 0.08,
+    maxSpeed: 4.0,
+    wobbleStart: 50,
+    wobbleMin: 4,
+    wobbleMax: 8,
+    multTimerScale: 1.5,
+    shrink: false,
+    fog: false,
+    perfectThresh: 8,
+  },
+  normal: {
+    label: 'Normal',
+    speedBase: 1.8,
+    speedScore: 0.12,
+    maxSpeed: 5.5,
+    wobbleStart: 30,
+    wobbleMin: 6,
+    wobbleMax: 14,
+    multTimerScale: 1.0,
+    shrink: false,
+    fog: false,
+    perfectThresh: 6,
+  },
+  hard: {
+    label: 'Hard',
+    speedBase: 2.4,
+    speedScore: 0.18,
+    maxSpeed: 7.5,
+    wobbleStart: 15,
+    wobbleMin: 10,
+    wobbleMax: 22,
+    multTimerScale: 0.7,
+    shrink: true,
+    fog: true,
+    perfectThresh: 4,
+  },
+};
 
 // ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
 function parseSeedFromURL() {
@@ -165,8 +231,8 @@
   return m ? parseInt(m[1], 10) : null;
 }
 function makeSeed() { return (Math.random() * 1e9) | 0; }
-function makePRNG(seed) {
-  let s = seed >>> 0;
+function makePRNG(seed, salt = 0) {
+  let s = (seed ^ salt) >>> 0;
   return function() {
     s |= 0; s = (s + 0x6D2B79F5) | 0;
     let t = Math.imul(s ^ (s >>> 15), 1 | s);
@@ -174,22 +240,18 @@
     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };
 }
-let currentSeed = parseSeedFromURL() ?? makeSeed();
-let rng = makePRNG(currentSeed);
-function refreshSeedDisplay() { seedDisplay.textContent = `seed: ${currentSeed}`; }
 
 // ── State ────────────────────────────────────────────────────────────────────
-let blocks = [];
-let movingBlock = {};
-let falling = [];
-let particles = [];
-let cameraY = 0;
-let score = 0;
-let combo = 0;
+let currentSeed = parseSeedFromURL() ?? makeSeed();
+let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
+if (!MODES[currentModeKey]) currentModeKey = 'normal';
+let battleMode = false;
+let gamePhase = 'playing';
+let players = [];
+let battleCountdown = 0;
+let battleWinner = '';
+let battleButtons = [];
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let phase = 'playing';
-let perfectText = '';
-let perfectTimer = 0;
 let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
@@ -197,6 +259,26 @@
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
+// ── Responsive canvas ────────────────────────────────────────────────────────
+function getMode() { return MODES[currentModeKey]; }
+function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
+function fitCanvas() {
+  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
+  const battleMax = Math.min(window.innerWidth - 16, 720);
+  const battleMin = Math.min(window.innerWidth - 16, 600);
+  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
+  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
+  canvas.width = targetW;
+  canvas.height = targetH;
+  for (const p of players) {
+    p.viewWidth = getPlayWidth();
+  }
+}
+window.addEventListener('resize', () => {
+  fitCanvas();
+  initGame({ replay: true, silent: true });
+});
+
 // ── WebAudio ─────────────────────────────────────────────────────────────────
 let audioCtx = null;
 function ensureAudio() {
@@ -263,60 +345,105 @@
   return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
 }
 
-// ── Block spawn (seeded RNG) ─────────────────────────────────────────────────
-function spawnMoving() {
-  const top = blocks[blocks.length - 1];
-  const speed = Math.min(1.8 + score * 0.12, 5.5);
-  movingBlock = {
-    worldX: rng() * (canvas.width - top.width - 8) + 4,
+// ── Player State ─────────────────────────────────────────────────────────────
+function makePlayer(id, label, seed) {
+  return {
+    id,
+    label,
+    viewWidth: getPlayWidth(),
+    patternRng: makePRNG(seed, 0xA51CE),
+    motionRng: makePRNG(seed, 0xB4771E),
+    blocks: [],
+    movingBlock: null,
+    falling: [],
+    particles: [],
+    cameraY: 0,
+    score: 0,
+    combo: 0,
+    phase: 'playing',
+    perfectText: '',
+    perfectTimer: 0,
+  };
+}
+
+function scaledTimer(ms) {
+  return ms * getMode().multTimerScale;
+}
+
+function nextBlockWidth(player, topWidth) {
+  if (!getMode().shrink) return topWidth;
+  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
+  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
+  return Math.max(18, Math.min(topWidth, cap));
+}
+
+function spawnMoving(player) {
+  const mode = getMode();
+  const top = player.blocks[player.blocks.length - 1];
+  const width = nextBlockWidth(player, top.width);
+  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
+  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
+  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
+  player.movingBlock = {
+    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
     worldY: top.worldY - BLOCK_H,
-    width: top.width,
-    dir: rng() < 0.5 ? 1 : -1,
+    width,
+    dir: player.patternRng() < 0.5 ? 1 : -1,
     speed,
-    color: blockColor(score + 1),
+    color: blockColor(player.score + 1),
     speedMult: 1.0,
     targetMult: 1.0,
-    multTimer: 800 + rng() * 600,
-    // 흔들리는 블록 (점수 30+에서 등장 확률 점증)
-    wobblePhase: rng() * Math.PI * 2,
-    wobbleAmp: score >= 30 && rng() < Math.min(0.15 + (score - 30) * 0.01, 0.55) ? 6 + rng() * 8 : 0,
+    multTimer: scaledTimer(800 + player.motionRng() * 600),
+    wobblePhase: player.patternRng() * Math.PI * 2,
+    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   };
-  cameraY = movingBlock.worldY - MOVING_Y;
+  player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
-function initGame(opts = {}) {
-  if (opts.newSeed) {
-    currentSeed = makeSeed();
-    rng = makePRNG(currentSeed);
-    refreshSeedDisplay();
-  } else if (opts.replay) {
-    rng = makePRNG(currentSeed); // 같은 시드로 재시작
-  }
-  score = 0;
-  combo = 0;
-  cameraY = 0;
-  falling = [];
-  particles = [];
-  perfectText = '';
-  perfectTimer = 0;
-  phase = 'playing';
-  gameoverShakeApplied = false;
-  scoreEl.textContent = '0';
-  comboWrap.style.display = 'none';
-  blocks = [{
-    worldX: canvas.width / 2 - BASE_WIDTH / 2,
+function initPlayer(player) {
+  player.viewWidth = getPlayWidth();
+  player.patternRng = makePRNG(currentSeed, 0xA51CE);
+  player.motionRng = makePRNG(currentSeed, 0xB4771E);
+  player.score = 0;
+  player.combo = 0;
+  player.cameraY = 0;
+  player.falling = [];
+  player.particles = [];
+  player.perfectText = '';
+  player.perfectTimer = 0;
+  player.phase = 'playing';
+  player.blocks = [{
+    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
     worldY: 500,
     width: BASE_WIDTH,
     color: blockColor(0),
   }];
-  spawnMoving();
+  spawnMoving(player);
 }
 
+function initGame(opts = {}) {
+  if (opts.newSeed) currentSeed = makeSeed();
+  fitCanvas();
+  gamePhase = 'playing';
+  battleCountdown = 0;
+  battleWinner = '';
+  battleButtons = [];
+  gameoverShakeApplied = false;
+  canvas.classList.remove('shake');
+  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
+  for (const player of players) initPlayer(player);
+  refreshSeedDisplay();
+  refreshUI();
+  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
+}
+
 // ── Particle ─────────────────────────────────────────────────────────────────
-function spawnPerfectParticles(cx, cy) {
+function toScreenY(player, worldY) { return worldY - player.cameraY; }
+
+function spawnPerfectParticles(player, cx, cy) {
   for (let i = 0; i < 10; i++) {
     const a = (i / 10) * Math.PI * 2;
-    particles.push({
+    player.particles.push({
       x: cx, y: cy,
       vx: Math.cos(a) * (1.5 + Math.random() * 2),
       vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
@@ -326,9 +453,9 @@
     });
   }
 }
-function spawnDustParticles(cx, cy, color) {
+function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
-    particles.push({
+    player.particles.push({
       x: cx + (Math.random() - 0.5) * 10,
       y: cy + (Math.random() - 0.5) * 4,
       vx: (Math.random() - 0.5) * 1.5,
@@ -341,16 +468,20 @@
 }
 
 // ── Drop logic ────────────────────────────────────────────────────────────────
-function dropBlock() {
+function dropBlock(player) {
   ensureAudio(); // 첫 입력에서 오디오 unlock
-  if (phase !== 'playing') {
+  if (!player) return;
+  if (gamePhase === 'battleResult') return;
+  if (!battleMode && gamePhase !== 'playing') {
     initGame({ replay: true });
     return;
   }
+  if (player.phase !== 'playing') return;
 
-  const top = blocks[blocks.length - 1];
-  const mx = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const mw = movingBlock.width;
+  const top = player.blocks[player.blocks.length - 1];
+  const moving = player.movingBlock;
+  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const mw = moving.width;
   const tx = top.worldX;
   const tw = top.width;
 
@@ -359,65 +490,59 @@
   const overlapW = overlapRight - overlapLeft;
 
   if (overlapW <= 0) {
-    falling.push({ worldX: mx, worldY: movingBlock.worldY, width: mw, color: movingBlock.color, vy: 0 });
-    triggerGameover();
+    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+    triggerGameover(player);
     return;
   }
 
-  const isPerfect = Math.abs(mx - tx) < PERFECT_THRESH;
+  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
   sfxDrop(stableness);
 
   if (isPerfect) {
-    blocks.push({ worldX: tx, worldY: movingBlock.worldY, width: tw, color: movingBlock.color });
-    combo++;
-    perfectText = combo > 1 ? `PERFECT x${combo}!` : 'PERFECT!';
-    perfectTimer = 1100;
-    spawnPerfectParticles(tx + tw / 2, toScreenY(movingBlock.worldY) + BLOCK_H / 2);
+    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
+    player.combo++;
+    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
+    player.perfectTimer = 1100;
+    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
     sfxPerfect();
-    if (combo % 3 === 0 && combo >= 3) {
-      sfxCombo(combo);
+    if (player.combo % 3 === 0 && player.combo >= 3) {
+      sfxCombo(player.combo);
       vibrate(40);
-      toast(`🔥 ${combo} 연속 퍼펙트!`);
+      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
-    if (combo > comboRecord) {
-      comboRecord = combo;
+    if (player.combo > comboRecord) {
+      comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
     }
   } else {
     if (mx < tx) {
-      falling.push({ worldX: mx, worldY: movingBlock.worldY, width: tx - mx, color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
     } else {
-      falling.push({ worldX: tx + tw, worldY: movingBlock.worldY, width: (mx + mw) - (tx + tw), color: movingBlock.color, vy: 0 });
+      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
     }
-    blocks.push({ worldX: overlapLeft, worldY: movingBlock.worldY, width: overlapW, color: movingBlock.color });
-    spawnDustParticles(overlapLeft + overlapW / 2, toScreenY(movingBlock.worldY), movingBlock.color);
-    combo = 0;
+    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
+    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    player.combo = 0;
   }
 
-  // 콤보 보너스: 퍼펙트 시 (콤보^1.3) 추가 점수, 아니면 1점
-  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(combo, 1.3))) : 1;
-  score += gained;
-  scoreEl.textContent = score;
-  if (combo >= 2) {
-    comboWrap.style.display = '';
-    comboEl.textContent = combo;
-  } else {
-    comboWrap.style.display = 'none';
-  }
+  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
+  player.score += gained;
+  refreshUI();
 
-  if (blocks[blocks.length - 1].width < 4) {
-    triggerGameover();
+  if (player.blocks[player.blocks.length - 1].width < 4) {
+    triggerGameover(player);
     return;
   }
 
-  spawnMoving();
+  spawnMoving(player);
 }
 
-function triggerGameover() {
-  phase = 'gameover';
-  if (score > bestScore) {
-    bestScore = score;
+function triggerGameover(player) {
+  if (player.phase !== 'playing') return;
+  player.phase = 'gameover';
+  if (player.score > bestScore) {
+    bestScore = player.score;
     localStorage.setItem(STORAGE_BEST, String(bestScore));
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
@@ -430,91 +555,134 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
+  if (battleMode) {
+    startBattleCountdown();
+  } else {
+    gamePhase = 'singleGameover';
+  }
+  refreshUI();
+}
+
+// ── Battle Mode ──────────────────────────────────────────────────────────────
+function startBattleCountdown() {
+  const alive = players.filter(p => p.phase === 'playing');
+  if (alive.length === 0) {
+    finishBattle();
+    return;
+  }
+  if (gamePhase !== 'battleCountdown') {
+    gamePhase = 'battleCountdown';
+    battleCountdown = BATTLE_COUNTDOWN_MS;
+    toast('상대 5초 추가 턴');
+  }
 }
 
-function toScreenY(worldY) { return worldY - cameraY; }
+function finishBattle() {
+  for (const player of players) player.phase = 'gameover';
+  gamePhase = 'battleResult';
+  const [p1, p2] = players;
+  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  refreshUI();
+}
+
+function handleBattleButton(x, y) {
+  if (gamePhase !== 'battleResult') return false;
+  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
+  if (!hit) return false;
+  if (hit.action === 'rematch') initGame({ replay: true });
+  if (hit.action === 'newSeed') initGame({ newSeed: true });
+  return true;
+}
 
 // ── Update ───────────────────────────────────────────────────────────────────
-function update(dt) {
-  if (phase === 'playing') {
-    movingBlock.multTimer -= dt;
-    if (movingBlock.multTimer <= 0) {
-      const r = rng();
+function updatePlayer(player, dt) {
+  if (player.phase === 'playing') {
+    const moving = player.movingBlock;
+    moving.multTimer -= dt;
+    if (moving.multTimer <= 0) {
+      const r = player.motionRng();
       if (r < 0.20) {
-        movingBlock.targetMult = 0.05;
-        movingBlock.multTimer = 250 + rng() * 300;
+        moving.targetMult = 0.05;
+        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
       } else if (r < 0.45) {
-        movingBlock.targetMult = 2.2 + rng() * 1.2;
-        movingBlock.multTimer = 180 + rng() * 250;
+        moving.targetMult = 2.2 + player.motionRng() * 1.2;
+        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
       } else {
-        movingBlock.targetMult = 0.6 + rng() * 0.8;
-        movingBlock.multTimer = 600 + rng() * 900;
+        moving.targetMult = 0.6 + player.motionRng() * 0.8;
+        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
       }
     }
-    movingBlock.speedMult += (movingBlock.targetMult - movingBlock.speedMult) * dt * 0.007;
-    movingBlock.worldX += movingBlock.dir * movingBlock.speed * movingBlock.speedMult * dt * 0.06;
-
-    // 흔들리는 블록은 위치에 sin 노이즈 추가 (그리기와 판정에서 같은 식 사용)
-    movingBlock.wobblePhase += dt * 0.005;
+    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
+    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
+    moving.wobblePhase += dt * 0.005;
 
-    // 경계 (effective worldX 기준)
-    const effLeft  = movingBlock.worldX + Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-    const effRight = effLeft + movingBlock.width;
-    if (effRight >= canvas.width - 4) {
-      movingBlock.worldX = canvas.width - 4 - movingBlock.width - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = -1;
+    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+    const effLeft  = moving.worldX + wob;
+    const effRight = effLeft + moving.width;
+    if (effRight >= player.viewWidth - 4) {
+      moving.worldX = player.viewWidth - 4 - moving.width - wob;
+      moving.dir = -1;
     }
     if (effLeft <= 4) {
-      movingBlock.worldX = 4 - Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-      movingBlock.dir = 1;
+      moving.worldX = 4 - wob;
+      moving.dir = 1;
     }
   }
 
-  for (const f of falling) {
+  for (const f of player.falling) {
     f.vy = Math.min(f.vy + dt * 0.015, 8);
     f.worldY += f.vy;
   }
-  falling = falling.filter(f => toScreenY(f.worldY) < canvas.height + 60);
+  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
 
-  for (const p of particles) {
-    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= p.decay;
+  for (const particle of player.particles) {
+    particle.x += particle.vx;
+    particle.y += particle.vy;
+    particle.vy += 0.18;
+    particle.life -= particle.decay;
   }
-  particles = particles.filter(p => p.life > 0);
+  player.particles = player.particles.filter(p => p.life > 0);
+
+  if (player.perfectTimer > 0) player.perfectTimer -= dt;
+  if (player.perfectTimer <= 0) player.perfectText = '';
+}
 
-  if (perfectTimer > 0) perfectTimer -= dt;
-  if (perfectTimer <= 0) perfectText = '';
+function update(dt) {
+  for (const player of players) updatePlayer(player, dt);
+  if (gamePhase === 'battleCountdown') {
+    battleCountdown -= dt;
+    if (battleCountdown <= 0) finishBattle();
+  }
 }
 
 // ── Draw ─────────────────────────────────────────────────────────────────────
-function drawBackground() {
-  const theme = getTheme(score);
+function drawBackground(player, width) {
+  const theme = getTheme(player.score);
   const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   ctx.fillStyle = grad;
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.fillRect(0, 0, width, canvas.height);
 
-  // 별 (테마에 따라 밀도 변화)
   if (theme.starAlpha > 0) {
-    const count = Math.floor(20 + score * 0.15);
+    const count = Math.floor(20 + player.score * 0.15);
     ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
     for (let i = 0; i < count; i++) {
-      const sx = ((i * 137 + score * 3) % canvas.width);
+      const sx = ((i * 137 + player.score * 3) % width);
       const sy = ((i * 97) % canvas.height);
       const size = 1 + ((i * 7) % 3) * 0.4;
       ctx.fillRect(sx, sy, size, size);
     }
   }
 
-  // 우주 테마: 은하 띠
   if (theme.name === 'space') {
     ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
-    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
+    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   }
 }
 
-function drawBlock(worldX, worldY, width, color, alpha) {
-  const sy = toScreenY(worldY);
+function drawBlock(player, worldX, worldY, width, color, alpha) {
+  const sy = toScreenY(player, worldY);
   if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   ctx.save();
   ctx.globalAlpha = alpha ?? 1;
@@ -523,19 +691,20 @@
   ctx.fillStyle = color;
   ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   ctx.fillStyle = 'rgba(255,255,255,0.18)';
-  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, width - 8, 5, 2); ctx.fill();
+  const shineWidth = Math.max(2, width - 8);
+  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   ctx.restore();
 }
 
-function drawMoving() {
-  if (phase !== 'playing') return;
-  const wob = Math.sin(movingBlock.wobblePhase) * movingBlock.wobbleAmp;
-  const effX = movingBlock.worldX + wob;
-  const { worldY, width, color } = movingBlock;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(worldY);
+function drawMoving(player) {
+  if (player.phase !== 'playing') return;
+  const moving = player.movingBlock;
+  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
+  const effX = moving.worldX + wob;
+  const { worldY, width, color } = moving;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, worldY);
 
-  // 가이드 라인
   ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   ctx.lineWidth = 1;
   ctx.setLineDash([4, 6]);
@@ -545,11 +714,10 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
-  drawBlock(effX, worldY, width, color);
+  drawBlock(player, effX, worldY, width, color);
 
-  // 가장자리 강조
-  const mult = movingBlock.speedMult ?? 1;
-  const wobActive = movingBlock.wobbleAmp > 0;
+  const mult = moving.speedMult ?? 1;
+  const wobActive = moving.wobbleAmp > 0;
   const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
@@ -559,61 +727,178 @@
   ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
 }
 
-function drawParticles() {
-  for (const p of particles) {
+function drawParticles(player) {
+  for (const particle of player.particles) {
     ctx.save();
-    ctx.globalAlpha = Math.max(0, p.life);
-    ctx.fillStyle = p.color;
-    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
+    ctx.globalAlpha = Math.max(0, particle.life);
+    ctx.fillStyle = particle.color;
+    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
     ctx.restore();
   }
 }
 
-function drawPerfect() {
-  if (!perfectText || perfectTimer <= 0) return;
-  const alpha = Math.min(1, perfectTimer / 350);
-  const rise = (1100 - perfectTimer) * 0.04;
-  const top = blocks[blocks.length - 1];
-  const sy = toScreenY(top.worldY) - 10 - rise;
+function drawPerfect(player, width) {
+  if (!player.perfectText || player.perfectTimer <= 0) return;
+  const alpha = Math.min(1, player.perfectTimer / 350);
+  const rise = (1100 - player.perfectTimer) * 0.04;
+  const top = player.blocks[player.blocks.length - 1];
+  const sy = toScreenY(player, top.worldY) - 10 - rise;
   ctx.save();
   ctx.globalAlpha = alpha;
-  ctx.fillStyle = combo >= 3 ? '#fb7185' : '#facc15';
-  ctx.font = `bold ${combo >= 3 ? 26 : 22}px sans-serif`;
+  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
+  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   ctx.textAlign = 'center';
-  ctx.fillText(perfectText + ' ✨', canvas.width / 2, sy);
+  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
+  ctx.restore();
+}
+
+function drawHardFog(player, width) {
+  if (!getMode().fog || player.score < 50) return;
+  const grad = ctx.createLinearGradient(0, 0, 0, 170);
+  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
+  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
+  grad.addColorStop(1, 'rgba(15,23,42,0)');
+  ctx.fillStyle = grad;
+  ctx.fillRect(0, 0, width, 170);
+}
+
+function drawPlayer(player, offsetX, width) {
+  ctx.save();
+  ctx.beginPath();
+  ctx.rect(offsetX, 0, width, canvas.height);
+  ctx.clip();
+  ctx.translate(offsetX, 0);
+  drawBackground(player, width);
+  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
+  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
+  drawMoving(player);
+  drawParticles(player);
+  drawPerfect(player, width);
+  drawHardFog(player, width);
+  drawPlayerStatus(player, width);
+  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
 }
 
-function drawGameOver() {
-  if (phase !== 'gameover') return;
+function drawPlayerStatus(player, width) {
+  if (!battleMode) return;
+  ctx.fillStyle = 'rgba(15,23,42,0.55)';
+  ctx.fillRect(0, 0, width, 34);
+  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
+  ctx.font = 'bold 14px sans-serif';
+  ctx.textAlign = player.id === 1 ? 'left' : 'right';
+  const x = player.id === 1 ? 10 : width - 10;
+  ctx.fillText(`${player.label} ${player.score}`, x, 22);
+  if (player.phase === 'gameover') {
+    ctx.fillStyle = 'rgba(0,0,0,0.45)';
+    ctx.fillRect(0, 34, width, canvas.height - 34);
+    ctx.fillStyle = '#e5e7eb';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText('종료', width / 2, canvas.height / 2);
+  }
+}
+
+function drawSingleGameOver(player, width) {
   ctx.fillStyle = 'rgba(0,0,0,0.65)';
-  ctx.fillRect(0, 0, canvas.width, canvas.height);
-
+  ctx.fillRect(0, 0, width, canvas.height);
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 32px sans-serif';
-  ctx.fillText('게임 오버', canvas.width / 2, canvas.height / 2 - 80);
-
+  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   ctx.font = 'bold 22px sans-serif';
   ctx.fillStyle = '#facc15';
-  ctx.fillText(`점수: ${score}`, canvas.width / 2, canvas.height / 2 - 38);
-
+  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   ctx.font = '14px sans-serif';
   ctx.fillStyle = '#aaa';
-  ctx.fillText(`최고 기록: ${bestScore}`, canvas.width / 2, canvas.height / 2 - 12);
-  ctx.fillText(`최장 콤보: ${comboRecord}`, canvas.width / 2, canvas.height / 2 + 8);
-
+  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
+  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   ctx.fillStyle = '#60a5fa';
   ctx.beginPath();
-  ctx.roundRect(canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
+  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = 'bold 16px sans-serif';
-  ctx.fillText('다시 하기', canvas.width / 2, canvas.height / 2 + 67);
-
+  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   ctx.fillStyle = '#94a3b8';
   ctx.font = '12px sans-serif';
-  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', canvas.width / 2, canvas.height / 2 + 105);
+  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
+}
+
+function drawBattleOverlay() {
+  if (!battleMode) return;
+  const mid = canvas.width / 2;
+  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
+  ctx.lineWidth = 1;
+  ctx.beginPath();
+  ctx.moveTo(mid + 0.5, 0);
+  ctx.lineTo(mid + 0.5, canvas.height);
+  ctx.stroke();
+
+  if (gamePhase === 'battleCountdown') {
+    const secs = Math.ceil(battleCountdown / 1000);
+    ctx.fillStyle = 'rgba(0,0,0,0.35)';
+    ctx.fillRect(mid - 54, 42, 108, 42);
+    ctx.fillStyle = '#facc15';
+    ctx.font = 'bold 24px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(`${secs}`, mid, 70);
+  }
+
+  if (gamePhase !== 'battleResult') return;
+  ctx.fillStyle = 'rgba(0,0,0,0.72)';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#fff';
+  ctx.font = 'bold 34px sans-serif';
+  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
+  ctx.font = 'bold 22px sans-serif';
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
+  ctx.font = '13px sans-serif';
+  ctx.fillStyle = '#cbd5e1';
+  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+
+  battleButtons = [
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+  ];
+  for (const btn of battleButtons) {
+    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
+    ctx.beginPath();
+    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
+    ctx.fill();
+    ctx.fillStyle = '#fff';
+    ctx.font = 'bold 16px sans-serif';
+    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
+  }
+}
+
+// ── UI ───────────────────────────────────────────────────────────────────────
+function refreshSeedDisplay() {
+  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
+}
+
+function refreshUI() {
+  const p1 = players[0];
+  const p2 = players[1];
+  modeLabel.textContent = `모드: ${getMode().label}`;
+  btnBattle.classList.toggle('active', battleMode);
+  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
+  for (const btn of modeButtons) {
+    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
+  }
+  battleScores.style.display = battleMode ? 'flex' : 'none';
+  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
+  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
+  if (p1) {
+    scoreEl.textContent = p1.score;
+    comboEl.textContent = p1.combo;
+    p1ScoreEl.textContent = p1.score;
+  }
+  if (p2) p2ScoreEl.textContent = p2.score;
+  bestEl.textContent = bestScore;
+  refreshSeedDisplay();
 }
 
 // ── Loop ─────────────────────────────────────────────────────────────────────
@@ -621,29 +906,70 @@
 function loop(t) {
   const dt = Math.min(t - lastTime, 50);
   lastTime = t;
-
   update(dt);
 
   ctx.clearRect(0, 0, canvas.width, canvas.height);
-  drawBackground();
-  for (const b of blocks) drawBlock(b.worldX, b.worldY, b.width, b.color);
-  for (const f of falling) drawBlock(f.worldX, f.worldY, f.width, f.color, 0.7);
-  drawMoving();
-  drawParticles();
-  drawPerfect();
-  drawGameOver();
+  if (battleMode) {
+    const half = canvas.width / 2;
+    drawPlayer(players[0], 0, half);
+    drawPlayer(players[1], half, half);
+    drawBattleOverlay();
+  } else {
+    drawPlayer(players[0], 0, canvas.width);
+  }
 
   requestAnimationFrame(loop);
 }
 
-// ── Input ─────────────────────────────────────────────────────────────────────
+// ── Input ────────────────────────────────────────────────────────────────────
+function canvasPoint(evt) {
+  const rect = canvas.getBoundingClientRect();
+  const source = evt.touches ? evt.touches[0] : evt;
+  return {
+    x: (source.clientX - rect.left) * (canvas.width / rect.width),
+    y: (source.clientY - rect.top) * (canvas.height / rect.height),
+  };
+}
+
+function handleCanvasAction(evt) {
+  evt.preventDefault();
+  const pt = canvasPoint(evt);
+  if (handleBattleButton(pt.x, pt.y)) return;
+  if (!battleMode) {
+    dropBlock(players[0]);
+    return;
+  }
+  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
+}
+
 document.addEventListener('keydown', e => {
-  if (e.code === 'Space') { e.preventDefault(); dropBlock(); }
+  if (e.code === 'Space') {
+    e.preventDefault();
+    dropBlock(players[0]);
+  }
+  if (e.code === 'Enter') {
+    e.preventDefault();
+    if (battleMode) dropBlock(players[1]);
+    else if (gamePhase === 'singleGameover') initGame({ replay: true });
+  }
 });
-canvas.addEventListener('click', e => { e.preventDefault(); dropBlock(); });
-canvas.addEventListener('touchstart', e => { e.preventDefault(); dropBlock(); }, { passive: false });
+canvas.addEventListener('click', handleCanvasAction);
+canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
 
 // ── Toolbar ──────────────────────────────────────────────────────────────────
+for (const btn of modeButtons) {
+  btn.addEventListener('click', () => {
+    currentModeKey = btn.dataset.mode;
+    localStorage.setItem(STORAGE_MODE, currentModeKey);
+    initGame({ replay: true });
+  });
+}
+
+btnBattle.addEventListener('click', () => {
+  battleMode = !battleMode;
+  initGame({ replay: true });
+});
+
 btnShare.addEventListener('click', async () => {
   const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   try {
@@ -664,8 +990,8 @@
 });
 
 // ── Boot ─────────────────────────────────────────────────────────────────────
-refreshSeedDisplay();
-initGame();
+fitCanvas();
+initGame({ silent: true });
 requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
 </script>
 </body>

hook: Stop
hook: Stop Completed
2026-04-26T13:44:00.304939Z ERROR codex_core::session: failed to record rollout items: thread 019dca03-36c3-75e1-ae4b-0a89b2228fcd not found
tokens used
99,590

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
