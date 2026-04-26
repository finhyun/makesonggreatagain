# codex advisor artifact

- Provider: codex
- Exit code: 0
- Created at: 2026-04-26T14:00:41.442Z

## Original task

# tower-stack 라운드 2~4 통합 패치

## 대상
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html` (현재 999줄)

이 파일은 vanilla JS + Canvas 단일 HTML. MODES, makePlayer, dropBlock, spawnMoving, drawBlock, drawGameOver, drawBattleOverlay, sfx*, particles 등이 이미 잘 구조화되어 있다. 아래 3가지 보강을 추가하라.

## US-002: 재미 보강 #1 — 황금 블록 + 콤보 강화

### 구현 사항
1. **황금 블록**: spawnMoving 시 15% 확률로 isGolden=true. 색상 `#fcd34d`, 외곽 빛 효과(drawMoving에서 isGolden일 때 추가 glow). 일반 블록과 같이 움직이되 시각적으로 구분.
2. **퍼펙트로 황금 잡기**: dropBlock에서 isPerfect 분기 안에서 isGolden이면 score += 5 보너스, 별 파티클 25개 분출 (기존 spawnPerfectParticles 호출 후 추가 spawnGoldenParticles 헬퍼 신설). 토스트 "💰 +5 보너스!"
3. **빗나가도 잡으면 점수 1만 (보너스 없음)**: 일반 블록과 동일
4. **콤보 5/10/15 마일스톤**:
   - 콤보 도달 시 화면 중앙에 큰 텍스트 (`drawComboFanfare(player)` 헬퍼) 1.2초 표시: "🔥 5 COMBO!", "💥 10 COMBO!!", "⚡ 15 COMBO!!!"
   - sfxCombo 호출 시 level 2배로 더 높은 음정 (예: combo 5에서 700Hz, 10에서 900Hz, 15에서 1200Hz)
   - vibrate 패턴: [40, 30, 60] (5), [60, 30, 90] (10), [80, 40, 120] (15)
5. **콤보 끊김**: 빗나갔을 때(isPerfect=false) 직전 combo가 3 이상이었으면 화면 중앙에 "콤보 끊김" 회색 텍스트 0.5초 페이드아웃 (player.comboBreakTimer 사용)

### 새로 추가할 함수 (선택지)
- `spawnGoldenParticles(player, cx, cy)` — 25개, 노란색·황금색 혼합, 더 큰 size
- `drawComboFanfare(player)` — perfectText 별도. 새 player 필드 player.fanfareText / player.fanfareTimer
- `drawComboBreak(player)` — player.breakText / player.breakTimer

## US-003: 배틀모드 UX 강화

### 구현 사항
1. **점수 차이 실시간 표시**: 배틀 모드 update 또는 draw 사이클에서 분할선 위(canvas 중앙 상단)에 텍스트 표시. 형식:
   - 동점이면 "동점" (회색)
   - P1 우세면 "P1 +N" (파란색)
   - P2 우세면 "P2 +N" (빨간색)
   - 글씨 크기 16px, 매 프레임 갱신
2. **카운트다운 강화**: 한쪽 게임오버 후 5초 카운트다운 시:
   - 남은 초를 캔버스 중앙 상단에 큰 숫자 (48px, 색상 빨강 → 노랑 → 초록 그라디언트로 시간에 따라 변화)
   - 매 초마다 sfxTick (beep 880Hz, 0.05s, 'sine', 0.08)
   - 마지막 1초는 깜빡임
3. **승리 폭죽**: 배틀 결과 화면에서 승자 쪽 viewport 중앙에 폭죽 파티클 30개+ (각 방향 랜덤 분출, 색상 무지개) — `spawnFireworks(player, cx, cy)` 헬퍼.
4. **양쪽 동시 게임오버 처리**: dropBlock 또는 update에서 한쪽 phase='gameover'로 변경된 시점에서 0.3초(300ms) 윈도우 내에 다른 쪽도 gameover면 무승부. 그 외엔 카운트다운 시작.
5. **리매치/새 시드 버튼 클릭 영역 정확**: 배틀 결과 화면(drawBattleResult)에서 그린 버튼 사각형 좌표를 battleButtons 배열에 저장하고, canvas click/touchstart 핸들러에서 좌표 hit-test하여 처리. (이미 battleButtons 변수가 있으니 이 패턴 사용)

## US-004: 통계 + 폴리싱

### 구현 사항
1. **모드별 베스트 분리**: 
   - localStorage 키: `mksga_tower_best_easy_v1`, `_normal_v1`, `_hard_v1` (배틀 모드 점수는 베스트에 포함하지 않음 — 단일 플레이만)
   - dropBlock의 triggerGameover에서 player.score를 currentMode 베스트와 비교 후 갱신
   - getBest(mode) / setBest(mode, score) 헬퍼 추가
2. **배틀 전적 누적**: 
   - localStorage 키: `mksga_tower_battle_record_v1`
   - JSON 형식: `{ p1Wins: 0, p2Wins: 0, draws: 0 }`
   - 배틀 결과 결정 시 갱신
3. **게임오버 화면 베스트 표시**: 현재 모드 베스트 점수를 게임오버 화면에 추가
4. **배틀 결과 화면 누적 전적 표시**: 결과 캔버스에 "P1 X승 P2 Y승 무 Z" 표시 (작은 글씨)
5. **전적 초기화 버튼**: toolbar에 "🗑️ 전적 초기화" 버튼 추가, 클릭 시 confirm() → 배틀 전적만 초기화 (베스트 점수는 유지). toast로 결과 알림.

### 호환성
- 기존 STORAGE_BEST 키('mksga_tower_best_v1')는 마이그레이션 위해 normal 베스트로 옮긴다 (1회 실행 시 STORAGE_BEST 값을 STORAGE_BEST_NORMAL로 복사 후 STORAGE_BEST 삭제 또는 그대로 둠).

## 공통 제약
- 외부 라이브러리 / 외부 자원 X
- 기존 모든 기능 미손상: Easy/Normal/Hard 토글, 배틀 토글, 콤보 점수, 시드 공유, 테마 전환, 효과음, 진동, 모바일 터치, 화면 흔들림
- 한국어 주석 OK
- 코드 추가 시 섹션 주석으로 정리: `// ── Golden Block ──`, `// ── Combo Fanfare ──`, `// ── Battle Stats ──` 등

## 검증 후 보고
1. 각 US (002/003/004)별 acceptance criteria 충족 여부 (yes/no + 근거 라인 번호)
2. JS 구문 통과: `node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 결과
3. 라인 수, 바이트 수
4. 변경 핵심 6줄 요약

## Final prompt

# tower-stack 라운드 2~4 통합 패치

## 대상
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html` (현재 999줄)

이 파일은 vanilla JS + Canvas 단일 HTML. MODES, makePlayer, dropBlock, spawnMoving, drawBlock, drawGameOver, drawBattleOverlay, sfx*, particles 등이 이미 잘 구조화되어 있다. 아래 3가지 보강을 추가하라.

## US-002: 재미 보강 #1 — 황금 블록 + 콤보 강화

### 구현 사항
1. **황금 블록**: spawnMoving 시 15% 확률로 isGolden=true. 색상 `#fcd34d`, 외곽 빛 효과(drawMoving에서 isGolden일 때 추가 glow). 일반 블록과 같이 움직이되 시각적으로 구분.
2. **퍼펙트로 황금 잡기**: dropBlock에서 isPerfect 분기 안에서 isGolden이면 score += 5 보너스, 별 파티클 25개 분출 (기존 spawnPerfectParticles 호출 후 추가 spawnGoldenParticles 헬퍼 신설). 토스트 "💰 +5 보너스!"
3. **빗나가도 잡으면 점수 1만 (보너스 없음)**: 일반 블록과 동일
4. **콤보 5/10/15 마일스톤**:
   - 콤보 도달 시 화면 중앙에 큰 텍스트 (`drawComboFanfare(player)` 헬퍼) 1.2초 표시: "🔥 5 COMBO!", "💥 10 COMBO!!", "⚡ 15 COMBO!!!"
   - sfxCombo 호출 시 level 2배로 더 높은 음정 (예: combo 5에서 700Hz, 10에서 900Hz, 15에서 1200Hz)
   - vibrate 패턴: [40, 30, 60] (5), [60, 30, 90] (10), [80, 40, 120] (15)
5. **콤보 끊김**: 빗나갔을 때(isPerfect=false) 직전 combo가 3 이상이었으면 화면 중앙에 "콤보 끊김" 회색 텍스트 0.5초 페이드아웃 (player.comboBreakTimer 사용)

### 새로 추가할 함수 (선택지)
- `spawnGoldenParticles(player, cx, cy)` — 25개, 노란색·황금색 혼합, 더 큰 size
- `drawComboFanfare(player)` — perfectText 별도. 새 player 필드 player.fanfareText / player.fanfareTimer
- `drawComboBreak(player)` — player.breakText / player.breakTimer

## US-003: 배틀모드 UX 강화

### 구현 사항
1. **점수 차이 실시간 표시**: 배틀 모드 update 또는 draw 사이클에서 분할선 위(canvas 중앙 상단)에 텍스트 표시. 형식:
   - 동점이면 "동점" (회색)
   - P1 우세면 "P1 +N" (파란색)
   - P2 우세면 "P2 +N" (빨간색)
   - 글씨 크기 16px, 매 프레임 갱신
2. **카운트다운 강화**: 한쪽 게임오버 후 5초 카운트다운 시:
   - 남은 초를 캔버스 중앙 상단에 큰 숫자 (48px, 색상 빨강 → 노랑 → 초록 그라디언트로 시간에 따라 변화)
   - 매 초마다 sfxTick (beep 880Hz, 0.05s, 'sine', 0.08)
   - 마지막 1초는 깜빡임
3. **승리 폭죽**: 배틀 결과 화면에서 승자 쪽 viewport 중앙에 폭죽 파티클 30개+ (각 방향 랜덤 분출, 색상 무지개) — `spawnFireworks(player, cx, cy)` 헬퍼.
4. **양쪽 동시 게임오버 처리**: dropBlock 또는 update에서 한쪽 phase='gameover'로 변경된 시점에서 0.3초(300ms) 윈도우 내에 다른 쪽도 gameover면 무승부. 그 외엔 카운트다운 시작.
5. **리매치/새 시드 버튼 클릭 영역 정확**: 배틀 결과 화면(drawBattleResult)에서 그린 버튼 사각형 좌표를 battleButtons 배열에 저장하고, canvas click/touchstart 핸들러에서 좌표 hit-test하여 처리. (이미 battleButtons 변수가 있으니 이 패턴 사용)

## US-004: 통계 + 폴리싱

### 구현 사항
1. **모드별 베스트 분리**: 
   - localStorage 키: `mksga_tower_best_easy_v1`, `_normal_v1`, `_hard_v1` (배틀 모드 점수는 베스트에 포함하지 않음 — 단일 플레이만)
   - dropBlock의 triggerGameover에서 player.score를 currentMode 베스트와 비교 후 갱신
   - getBest(mode) / setBest(mode, score) 헬퍼 추가
2. **배틀 전적 누적**: 
   - localStorage 키: `mksga_tower_battle_record_v1`
   - JSON 형식: `{ p1Wins: 0, p2Wins: 0, draws: 0 }`
   - 배틀 결과 결정 시 갱신
3. **게임오버 화면 베스트 표시**: 현재 모드 베스트 점수를 게임오버 화면에 추가
4. **배틀 결과 화면 누적 전적 표시**: 결과 캔버스에 "P1 X승 P2 Y승 무 Z" 표시 (작은 글씨)
5. **전적 초기화 버튼**: toolbar에 "🗑️ 전적 초기화" 버튼 추가, 클릭 시 confirm() → 배틀 전적만 초기화 (베스트 점수는 유지). toast로 결과 알림.

### 호환성
- 기존 STORAGE_BEST 키('mksga_tower_best_v1')는 마이그레이션 위해 normal 베스트로 옮긴다 (1회 실행 시 STORAGE_BEST 값을 STORAGE_BEST_NORMAL로 복사 후 STORAGE_BEST 삭제 또는 그대로 둠).

## 공통 제약
- 외부 라이브러리 / 외부 자원 X
- 기존 모든 기능 미손상: Easy/Normal/Hard 토글, 배틀 토글, 콤보 점수, 시드 공유, 테마 전환, 효과음, 진동, 모바일 터치, 화면 흔들림
- 한국어 주석 OK
- 코드 추가 시 섹션 주석으로 정리: `// ── Golden Block ──`, `// ── Combo Fanfare ──`, `// ── Battle Stats ──` 등

## 검증 후 보고
1. 각 US (002/003/004)별 acceptance criteria 충족 여부 (yes/no + 근거 라인 번호)
2. JS 구문 통과: `node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 결과
3. 라인 수, 바이트 수
4. 변경 핵심 6줄 요약

## Raw output

```text
구현 완료: [index.html](/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html)

**Acceptance**
- US-002: yes. 황금 블록 15%/색상 `#fcd34d` `454-456`, 황금 퍼펙트 보너스/파티클/토스트 `608-627`, +5 점수 `649`, 콤보 팬페어/진동/고음 `613-620`, 콤보 끊김 `641`, 렌더 `915-940`.
- US-003: yes. 점수 차이 표시 `1028-1036`, 카운트다운 대형 숫자/색상/깜빡임 `1039-1051`, tick 사운드 `362`, `800-802`, 동시 게임오버 300ms `684-687`, 폭죽 `540-557`, `723`, 결과 버튼 hit-test `731`, 버튼 좌표 저장 `1081-1083`.
- US-004: yes. 모드별 best/마이그레이션 `184-189`, `271-283`, 배틀 전적 `192`, `286-300`, 단일 best 갱신 `664-667`, 게임오버 best 표시 `1005`, 결과 전적 표시 `1077-1079`, 전적 초기화 버튼 `148`, `1207-1210`.

**검증**
- JS 구문: `JS syntax OK`
- 실행한 검증: `node -e "const fs=require('fs'); const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8'); new Function(html.match(/<script>([\\s\\S]+?)<\\/script>/)[1]); console.log('JS syntax OK');"`
- 라인 수/바이트 수: `1224` lines, `44903` bytes

**핵심 요약**
1. 황금 블록 생성, glow, 퍼펙트 보너스/파티클을 추가했습니다.
2. 5/10/15 콤보 중앙 팬페어와 콤보 끊김 피드백을 추가했습니다.
3. 배틀 점수 차이, 강화 카운트다운, tick 사운드를 추가했습니다.
4. 동시 게임오버 300ms 무승부 처리와 승리 폭죽을 추가했습니다.
5. 모드별 best 저장소와 legacy normal best 마이그레이션을 추가했습니다.
6. 배틀 전적 저장/표시/초기화와 결과 버튼 좌표 hit-test를 정리했습니다.


OpenAI Codex v0.125.0 (research preview)
--------
workdir: /Users/finito/dev/makesonggreatagain
model: gpt-5.5
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: medium
reasoning summaries: none
session id: 019dca0a-fdd7-73a1-b2a7-fa88b71ffcce
--------
user
# tower-stack 라운드 2~4 통합 패치

## 대상
`/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html` (현재 999줄)

이 파일은 vanilla JS + Canvas 단일 HTML. MODES, makePlayer, dropBlock, spawnMoving, drawBlock, drawGameOver, drawBattleOverlay, sfx*, particles 등이 이미 잘 구조화되어 있다. 아래 3가지 보강을 추가하라.

## US-002: 재미 보강 #1 — 황금 블록 + 콤보 강화

### 구현 사항
1. **황금 블록**: spawnMoving 시 15% 확률로 isGolden=true. 색상 `#fcd34d`, 외곽 빛 효과(drawMoving에서 isGolden일 때 추가 glow). 일반 블록과 같이 움직이되 시각적으로 구분.
2. **퍼펙트로 황금 잡기**: dropBlock에서 isPerfect 분기 안에서 isGolden이면 score += 5 보너스, 별 파티클 25개 분출 (기존 spawnPerfectParticles 호출 후 추가 spawnGoldenParticles 헬퍼 신설). 토스트 "💰 +5 보너스!"
3. **빗나가도 잡으면 점수 1만 (보너스 없음)**: 일반 블록과 동일
4. **콤보 5/10/15 마일스톤**:
   - 콤보 도달 시 화면 중앙에 큰 텍스트 (`drawComboFanfare(player)` 헬퍼) 1.2초 표시: "🔥 5 COMBO!", "💥 10 COMBO!!", "⚡ 15 COMBO!!!"
   - sfxCombo 호출 시 level 2배로 더 높은 음정 (예: combo 5에서 700Hz, 10에서 900Hz, 15에서 1200Hz)
   - vibrate 패턴: [40, 30, 60] (5), [60, 30, 90] (10), [80, 40, 120] (15)
5. **콤보 끊김**: 빗나갔을 때(isPerfect=false) 직전 combo가 3 이상이었으면 화면 중앙에 "콤보 끊김" 회색 텍스트 0.5초 페이드아웃 (player.comboBreakTimer 사용)

### 새로 추가할 함수 (선택지)
- `spawnGoldenParticles(player, cx, cy)` — 25개, 노란색·황금색 혼합, 더 큰 size
- `drawComboFanfare(player)` — perfectText 별도. 새 player 필드 player.fanfareText / player.fanfareTimer
- `drawComboBreak(player)` — player.breakText / player.breakTimer

## US-003: 배틀모드 UX 강화

### 구현 사항
1. **점수 차이 실시간 표시**: 배틀 모드 update 또는 draw 사이클에서 분할선 위(canvas 중앙 상단)에 텍스트 표시. 형식:
   - 동점이면 "동점" (회색)
   - P1 우세면 "P1 +N" (파란색)
   - P2 우세면 "P2 +N" (빨간색)
   - 글씨 크기 16px, 매 프레임 갱신
2. **카운트다운 강화**: 한쪽 게임오버 후 5초 카운트다운 시:
   - 남은 초를 캔버스 중앙 상단에 큰 숫자 (48px, 색상 빨강 → 노랑 → 초록 그라디언트로 시간에 따라 변화)
   - 매 초마다 sfxTick (beep 880Hz, 0.05s, 'sine', 0.08)
   - 마지막 1초는 깜빡임
3. **승리 폭죽**: 배틀 결과 화면에서 승자 쪽 viewport 중앙에 폭죽 파티클 30개+ (각 방향 랜덤 분출, 색상 무지개) — `spawnFireworks(player, cx, cy)` 헬퍼.
4. **양쪽 동시 게임오버 처리**: dropBlock 또는 update에서 한쪽 phase='gameover'로 변경된 시점에서 0.3초(300ms) 윈도우 내에 다른 쪽도 gameover면 무승부. 그 외엔 카운트다운 시작.
5. **리매치/새 시드 버튼 클릭 영역 정확**: 배틀 결과 화면(drawBattleResult)에서 그린 버튼 사각형 좌표를 battleButtons 배열에 저장하고, canvas click/touchstart 핸들러에서 좌표 hit-test하여 처리. (이미 battleButtons 변수가 있으니 이 패턴 사용)

## US-004: 통계 + 폴리싱

### 구현 사항
1. **모드별 베스트 분리**: 
   - localStorage 키: `mksga_tower_best_easy_v1`, `_normal_v1`, `_hard_v1` (배틀 모드 점수는 베스트에 포함하지 않음 — 단일 플레이만)
   - dropBlock의 triggerGameover에서 player.score를 currentMode 베스트와 비교 후 갱신
   - getBest(mode) / setBest(mode, score) 헬퍼 추가
2. **배틀 전적 누적**: 
   - localStorage 키: `mksga_tower_battle_record_v1`
   - JSON 형식: `{ p1Wins: 0, p2Wins: 0, draws: 0 }`
   - 배틀 결과 결정 시 갱신
3. **게임오버 화면 베스트 표시**: 현재 모드 베스트 점수를 게임오버 화면에 추가
4. **배틀 결과 화면 누적 전적 표시**: 결과 캔버스에 "P1 X승 P2 Y승 무 Z" 표시 (작은 글씨)
5. **전적 초기화 버튼**: toolbar에 "🗑️ 전적 초기화" 버튼 추가, 클릭 시 confirm() → 배틀 전적만 초기화 (베스트 점수는 유지). toast로 결과 알림.

### 호환성
- 기존 STORAGE_BEST 키('mksga_tower_best_v1')는 마이그레이션 위해 normal 베스트로 옮긴다 (1회 실행 시 STORAGE_BEST 값을 STORAGE_BEST_NORMAL로 복사 후 STORAGE_BEST 삭제 또는 그대로 둠).

## 공통 제약
- 외부 라이브러리 / 외부 자원 X
- 기존 모든 기능 미손상: Easy/Normal/Hard 토글, 배틀 토글, 콤보 점수, 시드 공유, 테마 전환, 효과음, 진동, 모바일 터치, 화면 흔들림
- 한국어 주석 OK
- 코드 추가 시 섹션 주석으로 정리: `// ── Golden Block ──`, `// ── Combo Fanfare ──`, `// ── Battle Stats ──` 등

## 검증 후 보고
1. 각 US (002/003/004)별 acceptance criteria 충족 여부 (yes/no + 근거 라인 번호)
2. JS 구문 통과: `node -e "new Function(html.match(/<script>([\s\S]+?)<\/script>/)[1])"` 결과
3. 라인 수, 바이트 수
4. 변경 핵심 6줄 요약
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
작업 범위가 단일 HTML 파일에 명확히 한정되어 있어서 solo execute로 진행합니다. 먼저 현재 구조와 관련 함수 위치를 확인한 뒤, 작은 패치로 추가하고 Node 구문 검증까지 돌리겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "STORAGE|MODES|function makePlayer|function spawnMoving|function dropBlock|function drawMoving|function drawGameOver|function drawBattleOverlay|function drawBattleResult|battleButtons|addEventListener|sfxCombo|particles|triggerGameover" user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'wc -l -c user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'git status --short user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 1189ms:
     998   36426 user/donghyun/projects/tower-stack/index.html

 succeeded in 1256ms:
181:const STORAGE_BEST = 'mksga_tower_best_v1';
182:const STORAGE_MUTE = 'mksga_tower_mute_v1';
183:const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
184:const STORAGE_MODE = 'mksga_tower_mode_v1';
186:const MODES = {
246:let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
247:if (!MODES[currentModeKey]) currentModeKey = 'normal';
253:let battleButtons = [];
254:let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
255:let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
256:let muted = localStorage.getItem(STORAGE_MUTE) === '1';
263:function getMode() { return MODES[currentModeKey]; }
277:window.addEventListener('resize', () => {
312:function sfxCombo(level) {
349:function makePlayer(id, label, seed) {
359:    particles: [],
380:function spawnMoving(player) {
411:  player.particles = [];
430:  battleButtons = [];
446:    player.particles.push({
458:    player.particles.push({
471:function dropBlock(player) {
494:    triggerGameover(player);
510:      sfxCombo(player.combo);
516:      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
534:    triggerGameover(player);
541:function triggerGameover(player) {
546:    localStorage.setItem(STORAGE_BEST, String(bestScore));
590:  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
638:  for (const particle of player.particles) {
644:  player.particles = player.particles.filter(p => p.life > 0);
699:function drawMoving(player) {
731:  for (const particle of player.particles) {
828:function drawBattleOverlay() {
862:  battleButtons = [
866:  for (const btn of battleButtons) {
945:document.addEventListener('keydown', e => {
956:canvas.addEventListener('click', handleCanvasAction);
957:canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
961:  btn.addEventListener('click', () => {
963:    localStorage.setItem(STORAGE_MODE, currentModeKey);
968:btnBattle.addEventListener('click', () => {
973:btnShare.addEventListener('click', async () => {
982:btnReset.addEventListener('click', () => {
986:btnMute.addEventListener('click', () => {
988:  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

 succeeded in 1547ms:
 M user/donghyun/projects/tower-stack/index.html

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
codex
파일은 이미 수정 상태라서 기존 변경을 보존하면서 필요한 위치만 덧대겠습니다. 지금은 저장소 패턴을 따라 `makePlayer`, `spawnMoving`, `dropBlock`, 배틀 결과/오버레이, toolbar 핸들러 주변만 읽고 있습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '170,280p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '1,140p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '560,900p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '300,560p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '900,1010p'" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
hook: PostToolUse
 succeeded in 358ms:
     1	<!DOCTYPE html>
     2	<html lang="ko">
     3	<head>
     4	  <meta charset="UTF-8">
     5	  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
     6	  <title>탑 쌓기 게임</title>
     7	  <style>
     8	    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
     9	    html, body { overflow: hidden; touch-action: none; }
    10	    body {
    11	      background: #0f0f1a;
    12	      display: flex;
    13	      flex-direction: column;
    14	      align-items: center;
    15	      justify-content: center;
    16	      min-height: 100vh;
    17	      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    18	      color: white;
    19	      user-select: none;
    20	      -webkit-user-select: none;
    21	      padding: 8px;
    22	    }
    23	    #stage {
    24	      position: relative;
    25	      display: flex;
    26	      flex-direction: column;
    27	      align-items: center;
    28	    }
    29	    canvas {
    30	      display: block;
    31	      border-radius: 12px;
    32	      box-shadow: 0 0 40px rgba(100,100,255,0.2);
    33	      touch-action: none;
    34	    }
    35	    /* 화면 흔들림 (게임오버) */
    36	    canvas.shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
    37	    @keyframes shake {
    38	      10%, 90% { transform: translateX(-2px); }
    39	      20%, 80% { transform: translateX(4px); }
    40	      30%, 50%, 70% { transform: translateX(-7px); }
    41	      40%, 60% { transform: translateX(7px); }
    42	    }
    43	    #ui {
    44	      margin-top: 12px;
    45	      display: flex;
    46	      gap: 14px;
    47	      align-items: center;
    48	      flex-wrap: wrap;
    49	      justify-content: center;
    50	      max-width: 95vw;
    51	    }
    52	    .stat {
    53	      font-size: 0.95rem;
    54	      color: #aaa;
    55	    }
    56	    .stat span { color: #facc15; font-weight: bold; font-size: 1.2rem; }
    57	    .stat.combo span { color: #fb7185; }
    58	    .stat.best span { color: #60a5fa; font-size: 1rem; }
    59	    #hint { font-size: 0.78rem; color: #555; }
    60	    #toolbar {
    61	      display: flex;
    62	      gap: 8px;
    63	      margin-top: 10px;
    64	      flex-wrap: wrap;
    65	      justify-content: center;
    66	    }
    67	    .btn {
    68	      background: #1f2937;
    69	      color: #cbd5e1;
    70	      border: 1px solid #334155;
    71	      padding: 7px 14px;
    72	      border-radius: 8px;
    73	      font-size: 0.78rem;
    74	      cursor: pointer;
    75	      transition: background 0.15s;
    76	    }
    77	    .btn:hover { background: #334155; color: white; }
    78	    .btn:active { background: #475569; }
    79	    .btn.active {
    80	      background: #2563eb;
    81	      border-color: #60a5fa;
    82	      color: white;
    83	    }
    84	    #mode-label {
    85	      color: #86efac;
    86	      font-size: 0.78rem;
    87	    }
    88	    #battle-scores {
    89	      display: none;
    90	      width: 100%;
    91	      justify-content: space-between;
    92	      gap: 12px;
    93	      font-size: 0.9rem;
    94	      color: #cbd5e1;
    95	      font-weight: 700;
    96	    }
    97	    #battle-scores span { color: #facc15; }
    98	    #seed-display {
    99	      font-size: 0.7rem;
   100	      color: #64748b;
   101	      margin-top: 6px;
   102	      font-family: monospace;
   103	    }
   104	    #toast {
   105	      position: fixed;
   106	      top: 16px;
   107	      left: 50%;
   108	      transform: translateX(-50%) translateY(-80px);
   109	      background: #1e293b;
   110	      border: 1px solid #475569;
   111	      color: white;
   112	      padding: 10px 18px;
   113	      border-radius: 10px;
   114	      font-size: 0.85rem;
   115	      transition: transform 0.35s cubic-bezier(.5,1.6,.4,1), opacity 0.3s;
   116	      opacity: 0;
   117	      pointer-events: none;
   118	      z-index: 100;
   119	      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
   120	    }
   121	    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
   122	    @media (max-width: 420px) {
   123	      .stat { font-size: 0.85rem; }
   124	      .stat span { font-size: 1.05rem; }
   125	    }
   126	  </style>
   127	</head>
   128	<body>
   129	  <div id="stage">
   130	    <canvas id="canvas"></canvas>
   131	    <div id="ui">
   132	      <div class="stat">점수: <span id="score">0</span></div>
   133	      <div class="stat combo" id="combo-wrap" style="display:none">콤보: <span id="combo">0</span></div>
   134	      <div class="stat best">최고: <span id="best">0</span></div>
   135	      <div class="stat" id="mode-label">모드: Normal</div>
   136	      <div id="battle-scores">
   137	        <div>P1 <span id="p1-score">0</span></div>
   138	        <div>P2 <span id="p2-score">0</span></div>
   139	      </div>
   140	    </div>

 succeeded in 388ms:
   170	const toastEl = document.getElementById('toast');
   171	const btnShare = document.getElementById('btn-share');
   172	const btnReset = document.getElementById('btn-reset');
   173	const btnMute = document.getElementById('btn-mute');
   174	const btnBattle = document.getElementById('btn-battle');
   175	const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
   176	
   177	// ── Constants & Modes ────────────────────────────────────────────────────────
   178	const BLOCK_H = 22;
   179	const BASE_WIDTH = 200;
   180	const MOVING_Y = 90;
   181	const STORAGE_BEST = 'mksga_tower_best_v1';
   182	const STORAGE_MUTE = 'mksga_tower_mute_v1';
   183	const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
   184	const STORAGE_MODE = 'mksga_tower_mode_v1';
   185	const BATTLE_COUNTDOWN_MS = 5000;
   186	const MODES = {
   187	  easy: {
   188	    label: 'Easy',
   189	    speedBase: 1.4,
   190	    speedScore: 0.08,
   191	    maxSpeed: 4.0,
   192	    wobbleStart: 50,
   193	    wobbleMin: 4,
   194	    wobbleMax: 8,
   195	    multTimerScale: 1.5,
   196	    shrink: false,
   197	    fog: false,
   198	    perfectThresh: 8,
   199	  },
   200	  normal: {
   201	    label: 'Normal',
   202	    speedBase: 1.8,
   203	    speedScore: 0.12,
   204	    maxSpeed: 5.5,
   205	    wobbleStart: 30,
   206	    wobbleMin: 6,
   207	    wobbleMax: 14,
   208	    multTimerScale: 1.0,
   209	    shrink: false,
   210	    fog: false,
   211	    perfectThresh: 6,
   212	  },
   213	  hard: {
   214	    label: 'Hard',
   215	    speedBase: 2.4,
   216	    speedScore: 0.18,
   217	    maxSpeed: 7.5,
   218	    wobbleStart: 15,
   219	    wobbleMin: 10,
   220	    wobbleMax: 22,
   221	    multTimerScale: 0.7,
   222	    shrink: true,
   223	    fog: true,
   224	    perfectThresh: 4,
   225	  },
   226	};
   227	
   228	// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
   229	function parseSeedFromURL() {
   230	  const m = window.location.search.match(/seed=(\d+)/);
   231	  return m ? parseInt(m[1], 10) : null;
   232	}
   233	function makeSeed() { return (Math.random() * 1e9) | 0; }
   234	function makePRNG(seed, salt = 0) {
   235	  let s = (seed ^ salt) >>> 0;
   236	  return function() {
   237	    s |= 0; s = (s + 0x6D2B79F5) | 0;
   238	    let t = Math.imul(s ^ (s >>> 15), 1 | s);
   239	    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
   240	    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   241	  };
   242	}
   243	
   244	// ── State ────────────────────────────────────────────────────────────────────
   245	let currentSeed = parseSeedFromURL() ?? makeSeed();
   246	let currentModeKey = localStorage.getItem(STORAGE_MODE) || 'normal';
   247	if (!MODES[currentModeKey]) currentModeKey = 'normal';
   248	let battleMode = false;
   249	let gamePhase = 'playing';
   250	let players = [];
   251	let battleCountdown = 0;
   252	let battleWinner = '';
   253	let battleButtons = [];
   254	let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
   255	let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
   256	let muted = localStorage.getItem(STORAGE_MUTE) === '1';
   257	let gameoverShakeApplied = false;
   258	
   259	bestEl.textContent = bestScore;
   260	btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
   261	
   262	// ── Responsive canvas ────────────────────────────────────────────────────────
   263	function getMode() { return MODES[currentModeKey]; }
   264	function getPlayWidth() { return battleMode ? canvas.width / 2 : canvas.width; }
   265	function fitCanvas() {
   266	  const maxSingleW = Math.max(320, Math.min(window.innerWidth - 32, 480));
   267	  const battleMax = Math.min(window.innerWidth - 16, 720);
   268	  const battleMin = Math.min(window.innerWidth - 16, 600);
   269	  const targetW = battleMode ? Math.max(battleMin, battleMax) : maxSingleW;
   270	  const targetH = Math.max(520, Math.min(window.innerHeight - 180, 720));
   271	  canvas.width = targetW;
   272	  canvas.height = targetH;
   273	  for (const p of players) {
   274	    p.viewWidth = getPlayWidth();
   275	  }
   276	}
   277	window.addEventListener('resize', () => {
   278	  fitCanvas();
   279	  initGame({ replay: true, silent: true });
   280	});

 succeeded in 342ms:
   560	  } else {
   561	    gamePhase = 'singleGameover';
   562	  }
   563	  refreshUI();
   564	}
   565	
   566	// ── Battle Mode ──────────────────────────────────────────────────────────────
   567	function startBattleCountdown() {
   568	  const alive = players.filter(p => p.phase === 'playing');
   569	  if (alive.length === 0) {
   570	    finishBattle();
   571	    return;
   572	  }
   573	  if (gamePhase !== 'battleCountdown') {
   574	    gamePhase = 'battleCountdown';
   575	    battleCountdown = BATTLE_COUNTDOWN_MS;
   576	    toast('상대 5초 추가 턴');
   577	  }
   578	}
   579	
   580	function finishBattle() {
   581	  for (const player of players) player.phase = 'gameover';
   582	  gamePhase = 'battleResult';
   583	  const [p1, p2] = players;
   584	  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
   585	  refreshUI();
   586	}
   587	
   588	function handleBattleButton(x, y) {
   589	  if (gamePhase !== 'battleResult') return false;
   590	  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
   591	  if (!hit) return false;
   592	  if (hit.action === 'rematch') initGame({ replay: true });
   593	  if (hit.action === 'newSeed') initGame({ newSeed: true });
   594	  return true;
   595	}
   596	
   597	// ── Update ───────────────────────────────────────────────────────────────────
   598	function updatePlayer(player, dt) {
   599	  if (player.phase === 'playing') {
   600	    const moving = player.movingBlock;
   601	    moving.multTimer -= dt;
   602	    if (moving.multTimer <= 0) {
   603	      const r = player.motionRng();
   604	      if (r < 0.20) {
   605	        moving.targetMult = 0.05;
   606	        moving.multTimer = scaledTimer(250 + player.motionRng() * 300);
   607	      } else if (r < 0.45) {
   608	        moving.targetMult = 2.2 + player.motionRng() * 1.2;
   609	        moving.multTimer = scaledTimer(180 + player.motionRng() * 250);
   610	      } else {
   611	        moving.targetMult = 0.6 + player.motionRng() * 0.8;
   612	        moving.multTimer = scaledTimer(600 + player.motionRng() * 900);
   613	      }
   614	    }
   615	    moving.speedMult += (moving.targetMult - moving.speedMult) * dt * 0.007;
   616	    moving.worldX += moving.dir * moving.speed * moving.speedMult * dt * 0.06;
   617	    moving.wobblePhase += dt * 0.005;
   618	
   619	    const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
   620	    const effLeft  = moving.worldX + wob;
   621	    const effRight = effLeft + moving.width;
   622	    if (effRight >= player.viewWidth - 4) {
   623	      moving.worldX = player.viewWidth - 4 - moving.width - wob;
   624	      moving.dir = -1;
   625	    }
   626	    if (effLeft <= 4) {
   627	      moving.worldX = 4 - wob;
   628	      moving.dir = 1;
   629	    }
   630	  }
   631	
   632	  for (const f of player.falling) {
   633	    f.vy = Math.min(f.vy + dt * 0.015, 8);
   634	    f.worldY += f.vy;
   635	  }
   636	  player.falling = player.falling.filter(f => toScreenY(player, f.worldY) < canvas.height + 60);
   637	
   638	  for (const particle of player.particles) {
   639	    particle.x += particle.vx;
   640	    particle.y += particle.vy;
   641	    particle.vy += 0.18;
   642	    particle.life -= particle.decay;
   643	  }
   644	  player.particles = player.particles.filter(p => p.life > 0);
   645	
   646	  if (player.perfectTimer > 0) player.perfectTimer -= dt;
   647	  if (player.perfectTimer <= 0) player.perfectText = '';
   648	}
   649	
   650	function update(dt) {
   651	  for (const player of players) updatePlayer(player, dt);
   652	  if (gamePhase === 'battleCountdown') {
   653	    battleCountdown -= dt;
   654	    if (battleCountdown <= 0) finishBattle();
   655	  }
   656	}
   657	
   658	// ── Draw ─────────────────────────────────────────────────────────────────────
   659	function drawBackground(player, width) {
   660	  const theme = getTheme(player.score);
   661	  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
   662	  grad.addColorStop(0, `hsl(${theme.topH}, ${theme.topS}%, ${theme.topL}%)`);
   663	  grad.addColorStop(1, `hsl(${theme.botH}, ${theme.botS}%, ${theme.botL}%)`);
   664	  ctx.fillStyle = grad;
   665	  ctx.fillRect(0, 0, width, canvas.height);
   666	
   667	  if (theme.starAlpha > 0) {
   668	    const count = Math.floor(20 + player.score * 0.15);
   669	    ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
   670	    for (let i = 0; i < count; i++) {
   671	      const sx = ((i * 137 + player.score * 3) % width);
   672	      const sy = ((i * 97) % canvas.height);
   673	      const size = 1 + ((i * 7) % 3) * 0.4;
   674	      ctx.fillRect(sx, sy, size, size);
   675	    }
   676	  }
   677	
   678	  if (theme.name === 'space') {
   679	    ctx.fillStyle = 'rgba(180, 120, 220, 0.10)';
   680	    ctx.fillRect(0, canvas.height * 0.4, width, canvas.height * 0.2);
   681	  }
   682	}
   683	
   684	function drawBlock(player, worldX, worldY, width, color, alpha) {
   685	  const sy = toScreenY(player, worldY);
   686	  if (sy > canvas.height + 10 || sy + BLOCK_H < -10) return;
   687	  ctx.save();
   688	  ctx.globalAlpha = alpha ?? 1;
   689	  ctx.fillStyle = 'rgba(0,0,0,0.3)';
   690	  ctx.beginPath(); ctx.roundRect(worldX + 3, sy + 4, width, BLOCK_H, 4); ctx.fill();
   691	  ctx.fillStyle = color;
   692	  ctx.beginPath(); ctx.roundRect(worldX, sy, width, BLOCK_H, 4); ctx.fill();
   693	  ctx.fillStyle = 'rgba(255,255,255,0.18)';
   694	  const shineWidth = Math.max(2, width - 8);
   695	  ctx.beginPath(); ctx.roundRect(worldX + 4, sy + 3, shineWidth, 5, 2); ctx.fill();
   696	  ctx.restore();
   697	}
   698	
   699	function drawMoving(player) {
   700	  if (player.phase !== 'playing') return;
   701	  const moving = player.movingBlock;
   702	  const wob = Math.sin(moving.wobblePhase) * moving.wobbleAmp;
   703	  const effX = moving.worldX + wob;
   704	  const { worldY, width, color } = moving;
   705	  const top = player.blocks[player.blocks.length - 1];
   706	  const sy = toScreenY(player, worldY);
   707	
   708	  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
   709	  ctx.lineWidth = 1;
   710	  ctx.setLineDash([4, 6]);
   711	  ctx.beginPath();
   712	  ctx.moveTo(top.worldX, sy + BLOCK_H / 2);
   713	  ctx.lineTo(top.worldX + top.width, sy + BLOCK_H / 2);
   714	  ctx.stroke();
   715	  ctx.setLineDash([]);
   716	
   717	  drawBlock(player, effX, worldY, width, color);
   718	
   719	  const mult = moving.speedMult ?? 1;
   720	  const wobActive = moving.wobbleAmp > 0;
   721	  const edgeAlpha = Math.min(0.3 + mult * 0.15, 0.9);
   722	  let edgeColor = `rgba(255,255,255,${edgeAlpha})`;
   723	  if (mult > 1.5) edgeColor = `rgba(255,100,100,${edgeAlpha})`;
   724	  if (wobActive)  edgeColor = `rgba(168,85,247,${edgeAlpha + 0.1})`;
   725	  ctx.strokeStyle = edgeColor;
   726	  ctx.lineWidth = (mult > 1.5 || wobActive) ? 2.5 : 1.5;
   727	  ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
   728	}
   729	
   730	function drawParticles(player) {
   731	  for (const particle of player.particles) {
   732	    ctx.save();
   733	    ctx.globalAlpha = Math.max(0, particle.life);
   734	    ctx.fillStyle = particle.color;
   735	    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
   736	    ctx.restore();
   737	  }
   738	}
   739	
   740	function drawPerfect(player, width) {
   741	  if (!player.perfectText || player.perfectTimer <= 0) return;
   742	  const alpha = Math.min(1, player.perfectTimer / 350);
   743	  const rise = (1100 - player.perfectTimer) * 0.04;
   744	  const top = player.blocks[player.blocks.length - 1];
   745	  const sy = toScreenY(player, top.worldY) - 10 - rise;
   746	  ctx.save();
   747	  ctx.globalAlpha = alpha;
   748	  ctx.fillStyle = player.combo >= 3 ? '#fb7185' : '#facc15';
   749	  ctx.font = `bold ${player.combo >= 3 ? 26 : 22}px sans-serif`;
   750	  ctx.textAlign = 'center';
   751	  ctx.fillText(player.perfectText + ' ✨', width / 2, sy);
   752	  ctx.restore();
   753	}
   754	
   755	function drawHardFog(player, width) {
   756	  if (!getMode().fog || player.score < 50) return;
   757	  const grad = ctx.createLinearGradient(0, 0, 0, 170);
   758	  grad.addColorStop(0, 'rgba(226,232,240,0.42)');
   759	  grad.addColorStop(0.55, 'rgba(148,163,184,0.20)');
   760	  grad.addColorStop(1, 'rgba(15,23,42,0)');
   761	  ctx.fillStyle = grad;
   762	  ctx.fillRect(0, 0, width, 170);
   763	}
   764	
   765	function drawPlayer(player, offsetX, width) {
   766	  ctx.save();
   767	  ctx.beginPath();
   768	  ctx.rect(offsetX, 0, width, canvas.height);
   769	  ctx.clip();
   770	  ctx.translate(offsetX, 0);
   771	  drawBackground(player, width);
   772	  for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   773	  for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   774	  drawMoving(player);
   775	  drawParticles(player);
   776	  drawPerfect(player, width);
   777	  drawHardFog(player, width);
   778	  drawPlayerStatus(player, width);
   779	  if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   780	  ctx.restore();
   781	}
   782	
   783	function drawPlayerStatus(player, width) {
   784	  if (!battleMode) return;
   785	  ctx.fillStyle = 'rgba(15,23,42,0.55)';
   786	  ctx.fillRect(0, 0, width, 34);
   787	  ctx.fillStyle = player.id === 1 ? '#bfdbfe' : '#fecdd3';
   788	  ctx.font = 'bold 14px sans-serif';
   789	  ctx.textAlign = player.id === 1 ? 'left' : 'right';
   790	  const x = player.id === 1 ? 10 : width - 10;
   791	  ctx.fillText(`${player.label} ${player.score}`, x, 22);
   792	  if (player.phase === 'gameover') {
   793	    ctx.fillStyle = 'rgba(0,0,0,0.45)';
   794	    ctx.fillRect(0, 34, width, canvas.height - 34);
   795	    ctx.fillStyle = '#e5e7eb';
   796	    ctx.font = 'bold 24px sans-serif';
   797	    ctx.textAlign = 'center';
   798	    ctx.fillText('종료', width / 2, canvas.height / 2);
   799	  }
   800	}
   801	
   802	function drawSingleGameOver(player, width) {
   803	  ctx.fillStyle = 'rgba(0,0,0,0.65)';
   804	  ctx.fillRect(0, 0, width, canvas.height);
   805	  ctx.textAlign = 'center';
   806	  ctx.fillStyle = '#fff';
   807	  ctx.font = 'bold 32px sans-serif';
   808	  ctx.fillText('게임 오버', width / 2, canvas.height / 2 - 80);
   809	  ctx.font = 'bold 22px sans-serif';
   810	  ctx.fillStyle = '#facc15';
   811	  ctx.fillText(`점수: ${player.score}`, width / 2, canvas.height / 2 - 38);
   812	  ctx.font = '14px sans-serif';
   813	  ctx.fillStyle = '#aaa';
   814	  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
   815	  ctx.fillText(`최장 콤보: ${comboRecord}`, width / 2, canvas.height / 2 + 8);
   816	  ctx.fillStyle = '#60a5fa';
   817	  ctx.beginPath();
   818	  ctx.roundRect(width / 2 - 80, canvas.height / 2 + 40, 160, 44, 10);
   819	  ctx.fill();
   820	  ctx.fillStyle = 'white';
   821	  ctx.font = 'bold 16px sans-serif';
   822	  ctx.fillText('다시 하기', width / 2, canvas.height / 2 + 67);
   823	  ctx.fillStyle = '#94a3b8';
   824	  ctx.font = '12px sans-serif';
   825	  ctx.fillText('하단 [🔄 새 시드]로 다른 패턴', width / 2, canvas.height / 2 + 105);
   826	}
   827	
   828	function drawBattleOverlay() {
   829	  if (!battleMode) return;
   830	  const mid = canvas.width / 2;
   831	  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
   832	  ctx.lineWidth = 1;
   833	  ctx.beginPath();
   834	  ctx.moveTo(mid + 0.5, 0);
   835	  ctx.lineTo(mid + 0.5, canvas.height);
   836	  ctx.stroke();
   837	
   838	  if (gamePhase === 'battleCountdown') {
   839	    const secs = Math.ceil(battleCountdown / 1000);
   840	    ctx.fillStyle = 'rgba(0,0,0,0.35)';
   841	    ctx.fillRect(mid - 54, 42, 108, 42);
   842	    ctx.fillStyle = '#facc15';
   843	    ctx.font = 'bold 24px sans-serif';
   844	    ctx.textAlign = 'center';
   845	    ctx.fillText(`${secs}`, mid, 70);
   846	  }
   847	
   848	  if (gamePhase !== 'battleResult') return;
   849	  ctx.fillStyle = 'rgba(0,0,0,0.72)';
   850	  ctx.fillRect(0, 0, canvas.width, canvas.height);
   851	  ctx.textAlign = 'center';
   852	  ctx.fillStyle = '#fff';
   853	  ctx.font = 'bold 34px sans-serif';
   854	  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
   855	  ctx.font = 'bold 22px sans-serif';
   856	  ctx.fillStyle = '#facc15';
   857	  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
   858	  ctx.font = '13px sans-serif';
   859	  ctx.fillStyle = '#cbd5e1';
   860	  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
   861	
   862	  battleButtons = [
   863	    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
   864	    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
   865	  ];
   866	  for (const btn of battleButtons) {
   867	    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
   868	    ctx.beginPath();
   869	    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
   870	    ctx.fill();
   871	    ctx.fillStyle = '#fff';
   872	    ctx.font = 'bold 16px sans-serif';
   873	    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   874	  }
   875	}
   876	
   877	// ── UI ───────────────────────────────────────────────────────────────────────
   878	function refreshSeedDisplay() {
   879	  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
   880	}
   881	
   882	function refreshUI() {
   883	  const p1 = players[0];
   884	  const p2 = players[1];
   885	  modeLabel.textContent = `모드: ${getMode().label}`;
   886	  btnBattle.classList.toggle('active', battleMode);
   887	  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
   888	  for (const btn of modeButtons) {
   889	    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
   890	  }
   891	  battleScores.style.display = battleMode ? 'flex' : 'none';
   892	  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
   893	  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
   894	  if (p1) {
   895	    scoreEl.textContent = p1.score;
   896	    comboEl.textContent = p1.combo;
   897	    p1ScoreEl.textContent = p1.score;
   898	  }
   899	  if (p2) p2ScoreEl.textContent = p2.score;
   900	  bestEl.textContent = bestScore;

 succeeded in 313ms:
   900	  bestEl.textContent = bestScore;
   901	  refreshSeedDisplay();
   902	}
   903	
   904	// ── Loop ─────────────────────────────────────────────────────────────────────
   905	let lastTime = 0;
   906	function loop(t) {
   907	  const dt = Math.min(t - lastTime, 50);
   908	  lastTime = t;
   909	  update(dt);
   910	
   911	  ctx.clearRect(0, 0, canvas.width, canvas.height);
   912	  if (battleMode) {
   913	    const half = canvas.width / 2;
   914	    drawPlayer(players[0], 0, half);
   915	    drawPlayer(players[1], half, half);
   916	    drawBattleOverlay();
   917	  } else {
   918	    drawPlayer(players[0], 0, canvas.width);
   919	  }
   920	
   921	  requestAnimationFrame(loop);
   922	}
   923	
   924	// ── Input ────────────────────────────────────────────────────────────────────
   925	function canvasPoint(evt) {
   926	  const rect = canvas.getBoundingClientRect();
   927	  const source = evt.touches ? evt.touches[0] : evt;
   928	  return {
   929	    x: (source.clientX - rect.left) * (canvas.width / rect.width),
   930	    y: (source.clientY - rect.top) * (canvas.height / rect.height),
   931	  };
   932	}
   933	
   934	function handleCanvasAction(evt) {
   935	  evt.preventDefault();
   936	  const pt = canvasPoint(evt);
   937	  if (handleBattleButton(pt.x, pt.y)) return;
   938	  if (!battleMode) {
   939	    dropBlock(players[0]);
   940	    return;
   941	  }
   942	  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
   943	}
   944	
   945	document.addEventListener('keydown', e => {
   946	  if (e.code === 'Space') {
   947	    e.preventDefault();
   948	    dropBlock(players[0]);
   949	  }
   950	  if (e.code === 'Enter') {
   951	    e.preventDefault();
   952	    if (battleMode) dropBlock(players[1]);
   953	    else if (gamePhase === 'singleGameover') initGame({ replay: true });
   954	  }
   955	});
   956	canvas.addEventListener('click', handleCanvasAction);
   957	canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
   958	
   959	// ── Toolbar ──────────────────────────────────────────────────────────────────
   960	for (const btn of modeButtons) {
   961	  btn.addEventListener('click', () => {
   962	    currentModeKey = btn.dataset.mode;
   963	    localStorage.setItem(STORAGE_MODE, currentModeKey);
   964	    initGame({ replay: true });
   965	  });
   966	}
   967	
   968	btnBattle.addEventListener('click', () => {
   969	  battleMode = !battleMode;
   970	  initGame({ replay: true });
   971	});
   972	
   973	btnShare.addEventListener('click', async () => {
   974	  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
   975	  try {
   976	    await navigator.clipboard.writeText(url);
   977	    toast(`📋 시드 ${currentSeed} 링크 복사됨!`);
   978	  } catch (_) {
   979	    prompt('이 시드 링크를 복사하세요', url);
   980	  }
   981	});
   982	btnReset.addEventListener('click', () => {
   983	  initGame({ newSeed: true });
   984	  toast(`🎲 새 시드: ${currentSeed}`);
   985	});
   986	btnMute.addEventListener('click', () => {
   987	  muted = !muted;
   988	  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');
   989	  btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
   990	});
   991	
   992	// ── Boot ─────────────────────────────────────────────────────────────────────
   993	fitCanvas();
   994	initGame({ silent: true });
   995	requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
   996	</script>
   997	</body>
   998	</html>

hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
 succeeded in 874ms:
   300	  osc.start(); osc.stop(ac.currentTime + duration);
   301	}
   302	function sfxDrop(stableness) {
   303	  // stableness 0~1 (퍼펙트=1, 빗나갈수록 0)
   304	  beep(180 + stableness * 220, 0.09, 'square', 0.10);
   305	}
   306	function sfxPerfect() {
   307	  // 짧은 아르페지오
   308	  beep(523, 0.10, 'sine', 0.13);
   309	  setTimeout(() => beep(659, 0.10, 'sine', 0.13), 70);
   310	  setTimeout(() => beep(784, 0.16, 'sine', 0.13), 140);
   311	}
   312	function sfxCombo(level) {
   313	  beep(440 + level * 80, 0.12, 'triangle', 0.12);
   314	}
   315	function sfxGameover() {
   316	  beep(220, 0.15, 'sawtooth', 0.14);
   317	  setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
   318	}
   319	
   320	// ── Vibration ─────────────────────────────────────────────────────────────────
   321	function vibrate(pattern) {
   322	  if (navigator.vibrate) try { navigator.vibrate(pattern); } catch (_) {}
   323	}
   324	
   325	// ── Toast ─────────────────────────────────────────────────────────────────────
   326	let toastTimer = null;
   327	function toast(msg, ms = 1800) {
   328	  toastEl.textContent = msg;
   329	  toastEl.classList.add('show');
   330	  clearTimeout(toastTimer);
   331	  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
   332	}
   333	
   334	// ── Color & Theme ─────────────────────────────────────────────────────────────
   335	function blockColor(n) {
   336	  const hue = (n * 37) % 360;
   337	  return `hsl(${hue}, 75%, 58%)`;
   338	}
   339	function getTheme(s) {
   340	  // 점수에 따른 5단계 테마
   341	  if (s < 20)       return { name: 'night',  topH: 230, topS: 40, topL: 18, botH: 240, botS: 30, botL: 12, starHue: 0, starAlpha: 0.4 };
   342	  if (s < 50)       return { name: 'dawn',   topH: 280, topS: 45, topL: 26, botH: 20,  botS: 40, botL: 18, starHue: 280, starAlpha: 0.3 };
   343	  if (s < 100)      return { name: 'day',    topH: 200, topS: 65, topL: 60, botH: 195, botS: 55, botL: 35, starHue: 0,   starAlpha: 0.0 };
   344	  if (s < 200)      return { name: 'sunset', topH: 25,  topS: 75, topL: 50, botH: 320, botS: 50, botL: 28, starHue: 30,  starAlpha: 0.2 };
   345	  return                  { name: 'space',  topH: 270, topS: 70, topL: 8,  botH: 230, botS: 80, botL: 5,  starHue: 200, starAlpha: 0.7 };
   346	}
   347	
   348	// ── Player State ─────────────────────────────────────────────────────────────
   349	function makePlayer(id, label, seed) {
   350	  return {
   351	    id,
   352	    label,
   353	    viewWidth: getPlayWidth(),
   354	    patternRng: makePRNG(seed, 0xA51CE),
   355	    motionRng: makePRNG(seed, 0xB4771E),
   356	    blocks: [],
   357	    movingBlock: null,
   358	    falling: [],
   359	    particles: [],
   360	    cameraY: 0,
   361	    score: 0,
   362	    combo: 0,
   363	    phase: 'playing',
   364	    perfectText: '',
   365	    perfectTimer: 0,
   366	  };
   367	}
   368	
   369	function scaledTimer(ms) {
   370	  return ms * getMode().multTimerScale;
   371	}
   372	
   373	function nextBlockWidth(player, topWidth) {
   374	  if (!getMode().shrink) return topWidth;
   375	  const shrinkSteps = Math.floor((player.blocks.length - 1) / 10);
   376	  const cap = BASE_WIDTH * Math.pow(0.95, shrinkSteps);
   377	  return Math.max(18, Math.min(topWidth, cap));
   378	}
   379	
   380	function spawnMoving(player) {
   381	  const mode = getMode();
   382	  const top = player.blocks[player.blocks.length - 1];
   383	  const width = nextBlockWidth(player, top.width);
   384	  const speed = Math.min(mode.speedBase + player.score * mode.speedScore, mode.maxSpeed);
   385	  const wobbleChance = Math.min(0.15 + Math.max(0, player.score - mode.wobbleStart) * 0.01, 0.55);
   386	  const hasWobble = player.score >= mode.wobbleStart && player.patternRng() < wobbleChance;
   387	  player.movingBlock = {
   388	    worldX: player.patternRng() * Math.max(1, player.viewWidth - width - 8) + 4,
   389	    worldY: top.worldY - BLOCK_H,
   390	    width,
   391	    dir: player.patternRng() < 0.5 ? 1 : -1,
   392	    speed,
   393	    color: blockColor(player.score + 1),
   394	    speedMult: 1.0,
   395	    targetMult: 1.0,
   396	    multTimer: scaledTimer(800 + player.motionRng() * 600),
   397	    wobblePhase: player.patternRng() * Math.PI * 2,
   398	    wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
   399	  };
   400	  player.cameraY = player.movingBlock.worldY - MOVING_Y;
   401	}
   402	
   403	function initPlayer(player) {
   404	  player.viewWidth = getPlayWidth();
   405	  player.patternRng = makePRNG(currentSeed, 0xA51CE);
   406	  player.motionRng = makePRNG(currentSeed, 0xB4771E);
   407	  player.score = 0;
   408	  player.combo = 0;
   409	  player.cameraY = 0;
   410	  player.falling = [];
   411	  player.particles = [];
   412	  player.perfectText = '';
   413	  player.perfectTimer = 0;
   414	  player.phase = 'playing';
   415	  player.blocks = [{
   416	    worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
   417	    worldY: 500,
   418	    width: BASE_WIDTH,
   419	    color: blockColor(0),
   420	  }];
   421	  spawnMoving(player);
   422	}
   423	
   424	function initGame(opts = {}) {
   425	  if (opts.newSeed) currentSeed = makeSeed();
   426	  fitCanvas();
   427	  gamePhase = 'playing';
   428	  battleCountdown = 0;
   429	  battleWinner = '';
   430	  battleButtons = [];
   431	  gameoverShakeApplied = false;
   432	  canvas.classList.remove('shake');
   433	  players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
   434	  for (const player of players) initPlayer(player);
   435	  refreshSeedDisplay();
   436	  refreshUI();
   437	  if (!opts.silent) toast(`${getMode().label}${battleMode ? ' 배틀' : ''} 시작`);
   438	}
   439	
   440	// ── Particle ─────────────────────────────────────────────────────────────────
   441	function toScreenY(player, worldY) { return worldY - player.cameraY; }
   442	
   443	function spawnPerfectParticles(player, cx, cy) {
   444	  for (let i = 0; i < 10; i++) {
   445	    const a = (i / 10) * Math.PI * 2;
   446	    player.particles.push({
   447	      x: cx, y: cy,
   448	      vx: Math.cos(a) * (1.5 + Math.random() * 2),
   449	      vy: Math.sin(a) * (1.5 + Math.random() * 2) - 0.5,
   450	      life: 1, decay: 0.025 + Math.random() * 0.02,
   451	      color: '#facc15',
   452	      size: 2 + Math.random() * 2,
   453	    });
   454	  }
   455	}
   456	function spawnDustParticles(player, cx, cy, color) {
   457	  for (let i = 0; i < 6; i++) {
   458	    player.particles.push({
   459	      x: cx + (Math.random() - 0.5) * 10,
   460	      y: cy + (Math.random() - 0.5) * 4,
   461	      vx: (Math.random() - 0.5) * 1.5,
   462	      vy: -Math.random() * 1.5,
   463	      life: 1, decay: 0.04,
   464	      color: color || '#fff',
   465	      size: 1.5,
   466	    });
   467	  }
   468	}
   469	
   470	// ── Drop logic ────────────────────────────────────────────────────────────────
   471	function dropBlock(player) {
   472	  ensureAudio(); // 첫 입력에서 오디오 unlock
   473	  if (!player) return;
   474	  if (gamePhase === 'battleResult') return;
   475	  if (!battleMode && gamePhase !== 'playing') {
   476	    initGame({ replay: true });
   477	    return;
   478	  }
   479	  if (player.phase !== 'playing') return;
   480	
   481	  const top = player.blocks[player.blocks.length - 1];
   482	  const moving = player.movingBlock;
   483	  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
   484	  const mw = moving.width;
   485	  const tx = top.worldX;
   486	  const tw = top.width;
   487	
   488	  const overlapLeft  = Math.max(mx, tx);
   489	  const overlapRight = Math.min(mx + mw, tx + tw);
   490	  const overlapW = overlapRight - overlapLeft;
   491	
   492	  if (overlapW <= 0) {
   493	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
   494	    triggerGameover(player);
   495	    return;
   496	  }
   497	
   498	  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   499	  const stableness = Math.min(overlapW / mw, 1);
   500	  sfxDrop(stableness);
   501	
   502	  if (isPerfect) {
   503	    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
   504	    player.combo++;
   505	    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
   506	    player.perfectTimer = 1100;
   507	    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
   508	    sfxPerfect();
   509	    if (player.combo % 3 === 0 && player.combo >= 3) {
   510	      sfxCombo(player.combo);
   511	      vibrate(40);
   512	      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
   513	    }
   514	    if (player.combo > comboRecord) {
   515	      comboRecord = player.combo;
   516	      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
   517	    }
   518	  } else {
   519	    if (mx < tx) {
   520	      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
   521	    } else {
   522	      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
   523	    }
   524	    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
   525	    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
   526	    player.combo = 0;
   527	  }
   528	
   529	  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   530	  player.score += gained;
   531	  refreshUI();
   532	
   533	  if (player.blocks[player.blocks.length - 1].width < 4) {
   534	    triggerGameover(player);
   535	    return;
   536	  }
   537	
   538	  spawnMoving(player);
   539	}
   540	
   541	function triggerGameover(player) {
   542	  if (player.phase !== 'playing') return;
   543	  player.phase = 'gameover';
   544	  if (player.score > bestScore) {
   545	    bestScore = player.score;
   546	    localStorage.setItem(STORAGE_BEST, String(bestScore));
   547	    bestEl.textContent = bestScore;
   548	    toast('🎉 신기록 달성!');
   549	  }
   550	  sfxGameover();
   551	  vibrate([60, 40, 90]);
   552	  if (!gameoverShakeApplied) {
   553	    gameoverShakeApplied = true;
   554	    canvas.classList.remove('shake');
   555	    void canvas.offsetWidth; // reflow
   556	    canvas.classList.add('shake');
   557	  }
   558	  if (battleMode) {
   559	    startBattleCountdown();
   560	  } else {

hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '140,176p'" in /Users/finito/dev/makesonggreatagain
 succeeded in 0ms:
   140	    </div>
   141	    <div id="toolbar">
   142	      <button class="btn mode-btn" data-mode="easy">Easy</button>
   143	      <button class="btn mode-btn" data-mode="normal">Normal</button>
   144	      <button class="btn mode-btn" data-mode="hard">Hard</button>
   145	      <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
   146	      <button class="btn" id="btn-share">🔗 시드 공유</button>
   147	      <button class="btn" id="btn-reset">🔄 새 시드</button>
   148	      <button class="btn" id="btn-mute">🔊 소리</button>
   149	    </div>
   150	    <div id="seed-display">seed: --</div>
   151	    <div id="hint" style="margin-top:8px">스페이스바 · 클릭 · 터치</div>
   152	  </div>
   153	  <div id="toast"></div>
   154	
   155	<script>
   156	'use strict';
   157	
   158	// ── DOM ──────────────────────────────────────────────────────────────────────
   159	const canvas = document.getElementById('canvas');
   160	const ctx = canvas.getContext('2d');
   161	const scoreEl = document.getElementById('score');
   162	const bestEl = document.getElementById('best');
   163	const comboEl = document.getElementById('combo');
   164	const comboWrap = document.getElementById('combo-wrap');
   165	const modeLabel = document.getElementById('mode-label');
   166	const battleScores = document.getElementById('battle-scores');
   167	const p1ScoreEl = document.getElementById('p1-score');
   168	const p2ScoreEl = document.getElementById('p2-score');
   169	const seedDisplay = document.getElementById('seed-display');
   170	const toastEl = document.getElementById('toast');
   171	const btnShare = document.getElementById('btn-share');
   172	const btnReset = document.getElementById('btn-reset');
   173	const btnMute = document.getElementById('btn-mute');
   174	const btnBattle = document.getElementById('btn-battle');
   175	const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
   176	

hook: PostToolUse
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "git diff -- user/donghyun/projects/tower-stack/index.html | sed -n '1,220p'" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 succeeded in 237ms:
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

hook: PostToolUse Completed
codex
구현은 네 군데로 나눠 넣겠습니다: 저장소/전적 헬퍼, 플레이어 상태와 드롭 보상, 배틀 카운트다운/결과 처리, 캔버스 렌더링과 toolbar 초기화 버튼입니다. 기존 시드/모드/배틀 흐름은 건드리지 않고 필요한 상태 필드만 추가합니다.
apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..6a7504cf1e56163d3481a643510273f4fa0410a2
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..6a7504cf1e56163d3481a643510273f4fa0410a2
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..407dba1510f362bbe4753a016672428cbf0582d8
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..407dba1510f362bbe4753a016672428cbf0582d8
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..a2da98e636c0734048cce87981e48621eecd157b
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..a2da98e636c0734048cce87981e48621eecd157b
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..d1bd71052c1f427e4e416a482289e36b1dce44bc
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..d1bd71052c1f427e4e416a482289e36b1dce44bc
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f1bb4a473959c5ea027bf55b074cfd2f21207fe0
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f1bb4a473959c5ea027bf55b074cfd2f21207fe0
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..de1b2e98f1ef299aa48eb05de77090e0ccfafa67
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..de1b2e98f1ef299aa48eb05de77090e0ccfafa67
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f53db5d157e2a0b0ad0f1437860fe241ab5bf30b
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f53db5d157e2a0b0ad0f1437860fe241ab5bf30b
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..0a3e3314dab986f45e9f2757265dd3edf537e363
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -554,16 +670,22 @@
     canvas.classList.remove('shake');
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
-  }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
   }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..0a3e3314dab986f45e9f2757265dd3edf537e363
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -554,16 +670,22 @@
     canvas.classList.remove('shake');
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
-  }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
   }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..8ec1ffe0a032bb62e81496e2d06f27de44937096
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..8ec1ffe0a032bb62e81496e2d06f27de44937096
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..005ad218e9cbbc981fd17d5fb55b4072223f83f9
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..005ad218e9cbbc981fd17d5fb55b4072223f83f9
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e8d16babf536f999c6b40c183536c99fabbbb092
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +957,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e8d16babf536f999c6b40c183536c99fabbbb092
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +957,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f41f87aea0d405baf35c59738971607d26cce556
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +957,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1022,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1070,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1085,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..f41f87aea0d405baf35c59738971607d26cce556
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -428,6 +489,9 @@
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +517,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +587,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +603,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +633,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +656,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +671,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +695,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +782,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +860,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +907,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +957,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1022,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1070,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1085,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..57d980e64cea2e4cc2542fbb558fe57149ec4791
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +672,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..57d980e64cea2e4cc2542fbb558fe57149ec4791
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +672,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..b6987294179fea58d58bb053f73fcfdeab37dbed
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +672,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1099,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..b6987294179fea58d58bb053f73fcfdeab37dbed
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +672,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1099,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..dbcf9e8a453f196a549ff93ec4be13201c5762fa
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -554,16 +671,22 @@
     canvas.classList.remove('shake');
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
-  }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
   }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1099,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1201,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..dbcf9e8a453f196a549ff93ec4be13201c5762fa
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,7 +604,19 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    if (moving.isGolden) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
@@ -523,11 +634,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +657,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -554,16 +671,22 @@
     canvas.classList.remove('shake');
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
-  }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
   }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +696,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +783,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +861,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +908,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +958,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1023,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1071,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1086,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1099,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1201,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

codex
패치가 들어갔고 이제 구문/동작 위험을 확인합니다. 특히 단일 플레이 베스트가 배틀 점수로 오염되지 않는지, 배틀 결과가 중복 기록되지 않는지, 렌더링 함수 호출 순서가 깨지지 않는지 확인하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8'); new Function(html.match(/<script>([\\s\\S]+?)<\\/script>/)[1]); console.log('JS syntax OK');\"" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'wc -l -c user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'rg -n "Golden Block|isGolden|spawnGoldenParticles|fanfareText|drawComboFanfare|breakText|drawComboBreak|sfxTick|SIMULTANEOUS|finishBattle|spawnFireworks|Battle Stats|STORAGE_BEST_BY_MODE|STORAGE_BATTLE_RECORD|btn-record-reset|전적 초기화|battleButtons|동점|최고 기록" user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
 succeeded in 2081ms:
148:      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
174:const btnRecordReset = document.getElementById('btn-record-reset');
184:const STORAGE_BEST_BY_MODE = {
192:const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
194:const SIMULTANEOUS_GAMEOVER_MS = 300;
262:let battleButtons = [];
270:// ── Battle Stats ──────────────────────────────────────────────────────────────
273:  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
274:    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
279:  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
283:  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
288:    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
295:  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
361:function sfxTick() {
416:    fanfareText: '',
418:    breakText: '',
453:    isGolden: player.patternRng() < 0.15,
455:  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
470:  player.fanfareText = '';
472:  player.breakText = '';
492:  battleButtons = [];
522:// ── Golden Block ──────────────────────────────────────────────────────────────
523:function spawnGoldenParticles(player, cx, cy) {
539:function spawnFireworks(player, cx, cy) {
607:    const goldenPerfect = moving.isGolden;
609:      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
616:      player.fanfareText = marks[player.combo];
640:      player.breakText = '콤보 끊김';
648:  if (isPerfect && moving.isGolden) player.score += 5;
685:  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
686:    finishBattle({ forceDraw: true });
695:    finishBattle();
706:function finishBattle(opts = {}) {
722:    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
730:  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
789:  if (player.fanfareTimer <= 0) player.fanfareText = '';
791:  if (player.breakTimer <= 0) player.breakText = '';
800:      sfxTick();
803:    if (battleCountdown <= 0) finishBattle();
866:  if (moving.isGolden) {
914:function drawComboFanfare(player, width) {
915:  if (!player.fanfareText || player.fanfareTimer <= 0) return;
925:  ctx.fillText(player.fanfareText, 3, 3);
927:  ctx.fillText(player.fanfareText, 0, 0);
931:function drawComboBreak(player, width) {
932:  if (!player.breakText || player.breakTimer <= 0) return;
939:  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
965:	  drawComboFanfare(player, width);
966:	  drawComboBreak(player, width);
1004:  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
1030:    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
1080:  battleButtons = [
1084:  for (const btn of battleButtons) {
1207:  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
1209:  toast('🗑️ 배틀 전적 초기화 완료');

 succeeded in 3410ms:
    1223   44883 user/donghyun/projects/tower-stack/index.html

diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

 succeeded in 6988ms:
JS syntax OK

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '1095,1215p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '1018,1095p'" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "nl -ba user/donghyun/projects/tower-stack/index.html | sed -n '580,655p'" in /Users/finito/dev/makesonggreatagain
 succeeded in 1925ms:
  1095	
  1096	// ── UI ───────────────────────────────────────────────────────────────────────
  1097	function refreshSeedDisplay() {
  1098	  seedDisplay.textContent = `seed: ${currentSeed} · mode: ${getMode().label}${battleMode ? ' · battle' : ''}`;
  1099	}
  1100	
  1101	function refreshUI() {
  1102	  const p1 = players[0];
  1103	  const p2 = players[1];
  1104	  bestScore = getBest(currentModeKey);
  1105	  modeLabel.textContent = `모드: ${getMode().label}`;
  1106	  btnBattle.classList.toggle('active', battleMode);
  1107	  btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
  1108	  for (const btn of modeButtons) {
  1109	    btn.classList.toggle('active', btn.dataset.mode === currentModeKey);
  1110	  }
  1111	  battleScores.style.display = battleMode ? 'flex' : 'none';
  1112	  scoreEl.parentElement.style.display = battleMode ? 'none' : '';
  1113	  comboWrap.style.display = !battleMode && p1 && p1.combo >= 2 ? '' : 'none';
  1114	  if (p1) {
  1115	    scoreEl.textContent = p1.score;
  1116	    comboEl.textContent = p1.combo;
  1117	    p1ScoreEl.textContent = p1.score;
  1118	  }
  1119	  if (p2) p2ScoreEl.textContent = p2.score;
  1120	  bestEl.textContent = bestScore;
  1121	  refreshSeedDisplay();
  1122	}
  1123	
  1124	// ── Loop ─────────────────────────────────────────────────────────────────────
  1125	let lastTime = 0;
  1126	function loop(t) {
  1127	  const dt = Math.min(t - lastTime, 50);
  1128	  lastTime = t;
  1129	  update(dt);
  1130	
  1131	  ctx.clearRect(0, 0, canvas.width, canvas.height);
  1132	  if (battleMode) {
  1133	    const half = canvas.width / 2;
  1134	    drawPlayer(players[0], 0, half);
  1135	    drawPlayer(players[1], half, half);
  1136	    drawBattleOverlay();
  1137	  } else {
  1138	    drawPlayer(players[0], 0, canvas.width);
  1139	  }
  1140	
  1141	  requestAnimationFrame(loop);
  1142	}
  1143	
  1144	// ── Input ────────────────────────────────────────────────────────────────────
  1145	function canvasPoint(evt) {
  1146	  const rect = canvas.getBoundingClientRect();
  1147	  const source = evt.touches ? evt.touches[0] : evt;
  1148	  return {
  1149	    x: (source.clientX - rect.left) * (canvas.width / rect.width),
  1150	    y: (source.clientY - rect.top) * (canvas.height / rect.height),
  1151	  };
  1152	}
  1153	
  1154	function handleCanvasAction(evt) {
  1155	  evt.preventDefault();
  1156	  const pt = canvasPoint(evt);
  1157	  if (handleBattleButton(pt.x, pt.y)) return;
  1158	  if (!battleMode) {
  1159	    dropBlock(players[0]);
  1160	    return;
  1161	  }
  1162	  dropBlock(pt.x < canvas.width / 2 ? players[0] : players[1]);
  1163	}
  1164	
  1165	document.addEventListener('keydown', e => {
  1166	  if (e.code === 'Space') {
  1167	    e.preventDefault();
  1168	    dropBlock(players[0]);
  1169	  }
  1170	  if (e.code === 'Enter') {
  1171	    e.preventDefault();
  1172	    if (battleMode) dropBlock(players[1]);
  1173	    else if (gamePhase === 'singleGameover') initGame({ replay: true });
  1174	  }
  1175	});
  1176	canvas.addEventListener('click', handleCanvasAction);
  1177	canvas.addEventListener('touchstart', handleCanvasAction, { passive: false });
  1178	
  1179	// ── Toolbar ──────────────────────────────────────────────────────────────────
  1180	for (const btn of modeButtons) {
  1181	  btn.addEventListener('click', () => {
  1182	    currentModeKey = btn.dataset.mode;
  1183	    localStorage.setItem(STORAGE_MODE, currentModeKey);
  1184	    initGame({ replay: true });
  1185	  });
  1186	}
  1187	
  1188	btnBattle.addEventListener('click', () => {
  1189	  battleMode = !battleMode;
  1190	  initGame({ replay: true });
  1191	});
  1192	
  1193	btnShare.addEventListener('click', async () => {
  1194	  const url = `${location.origin}${location.pathname}?seed=${currentSeed}`;
  1195	  try {
  1196	    await navigator.clipboard.writeText(url);
  1197	    toast(`📋 시드 ${currentSeed} 링크 복사됨!`);
  1198	  } catch (_) {
  1199	    prompt('이 시드 링크를 복사하세요', url);
  1200	  }
  1201	});
  1202	btnReset.addEventListener('click', () => {
  1203	  initGame({ newSeed: true });
  1204	  toast(`🎲 새 시드: ${currentSeed}`);
  1205	});
  1206	btnRecordReset.addEventListener('click', () => {
  1207	  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
  1208	  resetBattleRecord();
  1209	  toast('🗑️ 배틀 전적 초기화 완료');
  1210	});
  1211	btnMute.addEventListener('click', () => {
  1212	  muted = !muted;
  1213	  localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');
  1214	  btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
  1215	});

 succeeded in 2668ms:
  1018	function drawBattleOverlay() {
  1019	  if (!battleMode) return;
  1020	  const mid = canvas.width / 2;
  1021	  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  1022	  ctx.lineWidth = 1;
  1023	  ctx.beginPath();
  1024	  ctx.moveTo(mid + 0.5, 0);
  1025	  ctx.lineTo(mid + 0.5, canvas.height);
  1026	  ctx.stroke();
  1027	
  1028	  if (players.length >= 2) {
  1029	    const diff = players[0].score - players[1].score;
  1030	    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
  1031	    ctx.fillStyle = 'rgba(15,23,42,0.62)';
  1032	    ctx.fillRect(mid - 48, 8, 96, 26);
  1033	    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
  1034	    ctx.font = 'bold 16px sans-serif';
  1035	    ctx.textAlign = 'center';
  1036	    ctx.fillText(label, mid, 27);
  1037	  }
  1038	
  1039	  if (gamePhase === 'battleCountdown') {
  1040	    const secs = Math.ceil(battleCountdown / 1000);
  1041	    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
  1042	    if (!blinkOff) {
  1043	      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
  1044	      const hue = 120 * ratio;
  1045	      ctx.fillStyle = 'rgba(0,0,0,0.42)';
  1046	      ctx.fillRect(mid - 58, 42, 116, 66);
  1047	      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
  1048	      ctx.font = '900 48px sans-serif';
  1049	      ctx.textAlign = 'center';
  1050	      ctx.fillText(`${secs}`, mid, 92);
  1051	    }
  1052	  }
  1053	
  1054	  if (gamePhase !== 'battleResult') return;
  1055	  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  1056	  ctx.fillRect(0, 0, canvas.width, canvas.height);
  1057	
  1058	  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
  1059	  if (winnerPlayer) {
  1060	    ctx.save();
  1061	    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
  1062	    drawParticles(winnerPlayer);
  1063	    ctx.restore();
  1064	  }
  1065	
  1066	  ctx.textAlign = 'center';
  1067	  ctx.fillStyle = '#fff';
  1068	  ctx.font = 'bold 34px sans-serif';
  1069	  ctx.fillText(battleWinner, mid, canvas.height / 2 - 92);
  1070	  ctx.font = 'bold 22px sans-serif';
  1071	  ctx.fillStyle = '#facc15';
  1072	  ctx.fillText(`P1 ${players[0].score} : ${players[1].score} P2`, mid, canvas.height / 2 - 50);
  1073	  ctx.font = '13px sans-serif';
  1074	  ctx.fillStyle = '#cbd5e1';
  1075	  ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
  1076	  const record = getBattleRecord();
  1077	  ctx.fillStyle = '#94a3b8';
  1078	  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
  1079	
  1080	  battleButtons = [
  1081	    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
  1082	    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
  1083	  ];
  1084	  for (const btn of battleButtons) {
  1085	    ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
  1086	    ctx.beginPath();
  1087	    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
  1088	    ctx.fill();
  1089	    ctx.fillStyle = '#fff';
  1090	    ctx.font = 'bold 16px sans-serif';
  1091	    ctx.textAlign = 'center';
  1092	    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
  1093	  }
  1094	}
  1095	

 succeeded in 2573ms:
   580	  const top = player.blocks[player.blocks.length - 1];
   581	  const moving = player.movingBlock;
   582	  const mx = moving.worldX + Math.sin(moving.wobblePhase) * moving.wobbleAmp;
   583	  const mw = moving.width;
   584	  const tx = top.worldX;
   585	  const tw = top.width;
   586	
   587	  const overlapLeft  = Math.max(mx, tx);
   588	  const overlapRight = Math.min(mx + mw, tx + tw);
   589	  const overlapW = overlapRight - overlapLeft;
   590	
   591		  if (overlapW <= 0) {
   592		    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
   593		    triggerGameover(player);
   594		    return;
   595		  }
   596	
   597	  const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   598	  const stableness = Math.min(overlapW / mw, 1);
   599	  sfxDrop(stableness);
   600	
   601	  if (isPerfect) {
   602	    player.blocks.push({ worldX: tx, worldY: moving.worldY, width: tw, color: moving.color });
   603	    player.combo++;
   604	    player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
   605	    player.perfectTimer = 1100;
   606	    spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
   607	    const goldenPerfect = moving.isGolden;
   608	    if (goldenPerfect) {
   609	      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
   610	      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
   611	    }
   612	    sfxPerfect();
   613	    if ([5, 10, 15].includes(player.combo)) {
   614	      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
   615	      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
   616	      player.fanfareText = marks[player.combo];
   617	      player.fanfareTimer = 1200;
   618	      sfxCombo(player.combo * 2);
   619	      vibrate(vib[player.combo]);
   620	    }
   621	    if (player.combo % 3 === 0 && player.combo >= 3) {
   622	      sfxCombo(player.combo);
   623	      vibrate(40);
   624	      toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
   625	    }
   626	    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
   627	    if (player.combo > comboRecord) {
   628	      comboRecord = player.combo;
   629	      localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
   630	    }
   631	  } else {
   632	    if (mx < tx) {
   633	      player.falling.push({ worldX: mx, worldY: moving.worldY, width: tx - mx, color: moving.color, vy: 0 });
   634	    } else {
   635	      player.falling.push({ worldX: tx + tw, worldY: moving.worldY, width: (mx + mw) - (tx + tw), color: moving.color, vy: 0 });
   636	    }
   637	    player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
   638	    spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
   639	    if (player.combo >= 3) {
   640	      player.breakText = '콤보 끊김';
   641	      player.breakTimer = 500;
   642	    }
   643	    player.combo = 0;
   644	  }
   645	
   646	  const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   647	  player.score += gained;
   648	  if (isPerfect && moving.isGolden) player.score += 5;
   649	  refreshUI();
   650	
   651	  if (player.blocks[player.blocks.length - 1].width < 4) {
   652	    triggerGameover(player);
   653	    return;
   654	  }
   655	

diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..e57d0c8a801ac9ddceae587fccc58d3bca100f02
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -489,11 +588,11 @@
   const overlapRight = Math.min(mx + mw, tx + tw);
   const overlapW = overlapRight - overlapLeft;
 
-  if (overlapW <= 0) {
-    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
-    triggerGameover(player);
-    return;
-  }
+	  if (overlapW <= 0) {
+	    player.falling.push({ worldX: mx, worldY: moving.worldY, width: mw, color: moving.color, vy: 0 });
+	    triggerGameover(player);
+	    return;
+	  }
 
   const isPerfect = Math.abs(mx - tx) < getMode().perfectThresh;
   const stableness = Math.min(overlapW / mw, 1);
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+      toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..12338d44500bc822a37c34deaa0b029c5c1d7137
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +604,25 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +635,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +658,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +673,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +697,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +784,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +862,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +909,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +959,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1024,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1072,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1087,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1100,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1202,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..12338d44500bc822a37c34deaa0b029c5c1d7137
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +604,25 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
+    if ([5, 10, 15].includes(player.combo)) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
     if (player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +635,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +658,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +673,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +697,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +784,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +862,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +909,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +959,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1024,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1072,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1087,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1100,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1202,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..3d19f9829d364c65c0a6933dd9a6f9c630df3991
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..3d19f9829d364c65c0a6933dd9a6f9c630df3991
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,48 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +358,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +410,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +450,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +467,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +485,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +518,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +604,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +636,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +659,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +674,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +698,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +785,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +863,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +910,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +960,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1025,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1073,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1088,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1101,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1203,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

apply patch
patch: completed
/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

codex
구문 검증은 통과했습니다. 마지막으로 라인 번호 기준 근거를 다시 뽑고, 변경 후 파일 크기를 확인해서 요청한 검증 보고 형식에 맞추겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8'); new Function(html.match(/<script>([\\s\\S]+?)<\\/script>/)[1]); console.log('JS syntax OK');\"" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc "rg -n \"STORAGE_BEST_BY_MODE|migrateLegacyBest|getBest|setBest|STORAGE_BATTLE_RECORD|getBattleRecord|resetBattleRecord|isGolden|spawnGoldenParticles|spawnFireworks|goldenPerfect|isMilestoneCombo|fanfareText|breakText|drawComboFanfare|drawComboBreak|handleBattleGameover|SIMULTANEOUS_GAMEOVER_MS|battleLastTickSecond|sfxTick|동점|battleButtons =|P1 \\"'$'"\\{record|btnRecordReset|최고 기록\" user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
exec
/bin/zsh -lc 'wc -l -c user/donghyun/projects/tower-stack/index.html && git diff --stat -- user/donghyun/projects/tower-stack/index.html' in /Users/finito/dev/makesonggreatagain
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

 succeeded in 15066ms:
174:const btnRecordReset = document.getElementById('btn-record-reset');
184:const STORAGE_BEST_BY_MODE = {
192:const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
194:const SIMULTANEOUS_GAMEOVER_MS = 300;
262:let battleButtons = [];
263:let battleLastTickSecond = 0;
271:function migrateLegacyBest() {
273:  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
274:    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
278:function getBest(mode = currentModeKey) {
279:  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
282:function setBest(mode, score) {
283:  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
286:function getBattleRecord() {
288:    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
296:  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
299:function resetBattleRecord() {
303:migrateLegacyBest();
304:let bestScore = getBest(currentModeKey);
362:function sfxTick() {
417:    fanfareText: '',
419:    breakText: '',
454:    isGolden: player.patternRng() < 0.15,
456:  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
471:  player.fanfareText = '';
473:  player.breakText = '';
489:  bestScore = getBest(currentModeKey);
493:  battleButtons = [];
494:  battleLastTickSecond = 0;
524:function spawnGoldenParticles(player, cx, cy) {
540:function spawnFireworks(player, cx, cy) {
608:    const goldenPerfect = moving.isGolden;
609:    if (goldenPerfect) {
610:      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
613:    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
614:    if (isMilestoneCombo) {
617:      player.fanfareText = marks[player.combo];
622:    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
627:    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
641:      player.breakText = '콤보 끊김';
649:  if (isPerfect && moving.isGolden) player.score += 5;
666:    setBest(currentModeKey, bestScore);
678:  if (battleMode) handleBattleGameover(player);
684:function handleBattleGameover(player) {
686:  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
702:    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
714:    const record = getBattleRecord();
723:    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
790:  if (player.fanfareTimer <= 0) player.fanfareText = '';
792:  if (player.breakTimer <= 0) player.breakText = '';
800:    if (secs > 0 && secs !== battleLastTickSecond) {
801:      sfxTick();
802:      battleLastTickSecond = secs;
867:  if (moving.isGolden) {
915:function drawComboFanfare(player, width) {
916:  if (!player.fanfareText || player.fanfareTimer <= 0) return;
926:  ctx.fillText(player.fanfareText, 3, 3);
928:  ctx.fillText(player.fanfareText, 0, 0);
932:function drawComboBreak(player, width) {
933:  if (!player.breakText || player.breakTimer <= 0) return;
940:  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
966:	  drawComboFanfare(player, width);
967:	  drawComboBreak(player, width);
1005:  ctx.fillText(`최고 기록: ${bestScore}`, width / 2, canvas.height / 2 - 12);
1031:    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
1077:  const record = getBattleRecord();
1081:  battleButtons = [
1105:  bestScore = getBest(currentModeKey);
1207:btnRecordReset.addEventListener('click', () => {
1208:  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
1209:  resetBattleRecord();

 succeeded in 16272ms:
JS syntax OK

 succeeded in 16491ms:
    1224   44903 user/donghyun/projects/tower-stack/index.html
 user/donghyun/projects/tower-stack/index.html | 1242 +++++++++++++++++++++----
 1 file changed, 1046 insertions(+), 196 deletions(-)

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse
hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "rg -n \"sfxCombo\\(player.combo \\* 2|vibrate\\(vib|hsl\\(\\"'$'"\\{hue|font = '900 48px|startsWith\\('P1'|P1 \\"'$'"\\{record|btn\\.x && y\" user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 succeeded in 242ms:
619:      sfxCombo(player.combo * 2);
620:      vibrate(vib[player.combo]);
1049:      ctx.font = '900 48px sans-serif';
1059:  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);

hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "hue =|ctx.fillStyle = `hsl|P1 '"\\"'$'"\\{record|x >= btn.x\" user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 exited 1 in 417ms:
zsh:1: unmatched "

hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "rg -n 'hue =|ctx.fillStyle = "'`hsl|P1 '"\\"'$'"\\{record|x >= btn.x' user/donghyun/projects/tower-stack/index.html" in /Users/finito/dev/makesonggreatagain
hook: PostToolUse
 succeeded in 374ms:
386:  const hue = (n * 37) % 360;
731:  const hit = battleButtons.find(btn => x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h);
819:    ctx.fillStyle = `hsla(${theme.starHue}, 80%, 90%, ${theme.starAlpha})`;
1045:      const hue = 120 * ratio;
1048:      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
1079:  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);

hook: PostToolUse Completed
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

codex
구현 완료: [index.html](/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html)

**Acceptance**
- US-002: yes. 황금 블록 15%/색상 `#fcd34d` `454-456`, 황금 퍼펙트 보너스/파티클/토스트 `608-627`, +5 점수 `649`, 콤보 팬페어/진동/고음 `613-620`, 콤보 끊김 `641`, 렌더 `915-940`.
- US-003: yes. 점수 차이 표시 `1028-1036`, 카운트다운 대형 숫자/색상/깜빡임 `1039-1051`, tick 사운드 `362`, `800-802`, 동시 게임오버 300ms `684-687`, 폭죽 `540-557`, `723`, 결과 버튼 hit-test `731`, 버튼 좌표 저장 `1081-1083`.
- US-004: yes. 모드별 best/마이그레이션 `184-189`, `271-283`, 배틀 전적 `192`, `286-300`, 단일 best 갱신 `664-667`, 게임오버 best 표시 `1005`, 결과 전적 표시 `1077-1079`, 전적 초기화 버튼 `148`, `1207-1210`.

**검증**
- JS 구문: `JS syntax OK`
- 실행한 검증: `node -e "const fs=require('fs'); const html=fs.readFileSync('user/donghyun/projects/tower-stack/index.html','utf8'); new Function(html.match(/<script>([\\s\\S]+?)<\\/script>/)[1]); console.log('JS syntax OK');"`
- 라인 수/바이트 수: `1224` lines, `44903` bytes

**핵심 요약**
1. 황금 블록 생성, glow, 퍼펙트 보너스/파티클을 추가했습니다.
2. 5/10/15 콤보 중앙 팬페어와 콤보 끊김 피드백을 추가했습니다.
3. 배틀 점수 차이, 강화 카운트다운, tick 사운드를 추가했습니다.
4. 동시 게임오버 300ms 무승부 처리와 승리 폭죽을 추가했습니다.
5. 모드별 best 저장소와 legacy normal best 마이그레이션을 추가했습니다.
6. 배틀 전적 저장/표시/초기화와 결과 버튼 좌표 hit-test를 정리했습니다.
diff --git a/user/donghyun/projects/tower-stack/index.html b/user/donghyun/projects/tower-stack/index.html
index 66387856519ed91318ea4d115c25b9508de4ca87..5ad4cffa4c25cab34dac4cf9138adcb4fe443b38
--- a/user/donghyun/projects/tower-stack/index.html
+++ b/user/donghyun/projects/tower-stack/index.html
@@ -145,6 +145,7 @@
       <button class="btn" id="btn-battle">⚔️ 배틀 모드</button>
       <button class="btn" id="btn-share">🔗 시드 공유</button>
       <button class="btn" id="btn-reset">🔄 새 시드</button>
+      <button class="btn" id="btn-record-reset">🗑️ 전적 초기화</button>
       <button class="btn" id="btn-mute">🔊 소리</button>
     </div>
     <div id="seed-display">seed: --</div>
@@ -170,6 +171,7 @@
 const toastEl = document.getElementById('toast');
 const btnShare = document.getElementById('btn-share');
 const btnReset = document.getElementById('btn-reset');
+const btnRecordReset = document.getElementById('btn-record-reset');
 const btnMute = document.getElementById('btn-mute');
 const btnBattle = document.getElementById('btn-battle');
 const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
@@ -179,10 +181,17 @@
 const BASE_WIDTH = 200;
 const MOVING_Y = 90;
 const STORAGE_BEST = 'mksga_tower_best_v1';
+const STORAGE_BEST_BY_MODE = {
+  easy: 'mksga_tower_best_easy_v1',
+  normal: 'mksga_tower_best_normal_v1',
+  hard: 'mksga_tower_best_hard_v1',
+};
 const STORAGE_MUTE = 'mksga_tower_mute_v1';
 const STORAGE_COMBO_RECORD = 'mksga_tower_combo_record_v1';
 const STORAGE_MODE = 'mksga_tower_mode_v1';
+const STORAGE_BATTLE_RECORD = 'mksga_tower_battle_record_v1';
 const BATTLE_COUNTDOWN_MS = 5000;
+const SIMULTANEOUS_GAMEOVER_MS = 300;
 const MODES = {
   easy: {
     label: 'Easy',
@@ -251,11 +260,49 @@
 let battleCountdown = 0;
 let battleWinner = '';
 let battleButtons = [];
+let battleLastTickSecond = 0;
+let battleRecordApplied = false;
+let battleFireworksSpawned = false;
 let comboRecord = parseInt(localStorage.getItem(STORAGE_COMBO_RECORD) || '0', 10);
-let bestScore = parseInt(localStorage.getItem(STORAGE_BEST) || '0', 10);
 let muted = localStorage.getItem(STORAGE_MUTE) === '1';
 let gameoverShakeApplied = false;
 
+// ── Battle Stats ──────────────────────────────────────────────────────────────
+function migrateLegacyBest() {
+  const legacy = localStorage.getItem(STORAGE_BEST);
+  if (legacy !== null && localStorage.getItem(STORAGE_BEST_BY_MODE.normal) === null) {
+    localStorage.setItem(STORAGE_BEST_BY_MODE.normal, legacy);
+  }
+}
+
+function getBest(mode = currentModeKey) {
+  return parseInt(localStorage.getItem(STORAGE_BEST_BY_MODE[mode]) || '0', 10);
+}
+
+function setBest(mode, score) {
+  localStorage.setItem(STORAGE_BEST_BY_MODE[mode], String(score));
+}
+
+function getBattleRecord() {
+  try {
+    const saved = JSON.parse(localStorage.getItem(STORAGE_BATTLE_RECORD) || '{}') || {};
+    return { p1Wins: 0, p2Wins: 0, draws: 0, ...saved };
+  } catch (_) {
+    return { p1Wins: 0, p2Wins: 0, draws: 0 };
+  }
+}
+
+function setBattleRecord(record) {
+  localStorage.setItem(STORAGE_BATTLE_RECORD, JSON.stringify(record));
+}
+
+function resetBattleRecord() {
+  setBattleRecord({ p1Wins: 0, p2Wins: 0, draws: 0 });
+}
+
+migrateLegacyBest();
+let bestScore = getBest(currentModeKey);
+
 bestEl.textContent = bestScore;
 btnMute.textContent = muted ? '🔇 음소거' : '🔊 소리';
 
@@ -312,6 +359,9 @@
 function sfxCombo(level) {
   beep(440 + level * 80, 0.12, 'triangle', 0.12);
 }
+function sfxTick() {
+  beep(880, 0.05, 'sine', 0.08);
+}
 function sfxGameover() {
   beep(220, 0.15, 'sawtooth', 0.14);
   setTimeout(() => beep(165, 0.30, 'sawtooth', 0.14), 130);
@@ -361,8 +411,13 @@
     score: 0,
     combo: 0,
     phase: 'playing',
+    gameoverAt: 0,
     perfectText: '',
     perfectTimer: 0,
+    fanfareText: '',
+    fanfareTimer: 0,
+    breakText: '',
+    breakTimer: 0,
   };
 }
 
@@ -396,7 +451,9 @@
     multTimer: scaledTimer(800 + player.motionRng() * 600),
     wobblePhase: player.patternRng() * Math.PI * 2,
     wobbleAmp: hasWobble ? mode.wobbleMin + player.patternRng() * (mode.wobbleMax - mode.wobbleMin) : 0,
+    isGolden: player.patternRng() < 0.15,
   };
+  if (player.movingBlock.isGolden) player.movingBlock.color = '#fcd34d';
   player.cameraY = player.movingBlock.worldY - MOVING_Y;
 }
 
@@ -411,6 +468,11 @@
   player.particles = [];
   player.perfectText = '';
   player.perfectTimer = 0;
+  player.fanfareText = '';
+  player.fanfareTimer = 0;
+  player.breakText = '';
+  player.breakTimer = 0;
+  player.gameoverAt = 0;
   player.phase = 'playing';
   player.blocks = [{
     worldX: player.viewWidth / 2 - BASE_WIDTH / 2,
@@ -424,10 +486,14 @@
 function initGame(opts = {}) {
   if (opts.newSeed) currentSeed = makeSeed();
   fitCanvas();
+  bestScore = getBest(currentModeKey);
   gamePhase = 'playing';
   battleCountdown = 0;
   battleWinner = '';
   battleButtons = [];
+  battleLastTickSecond = 0;
+  battleRecordApplied = false;
+  battleFireworksSpawned = false;
   gameoverShakeApplied = false;
   canvas.classList.remove('shake');
   players = battleMode ? [makePlayer(1, 'P1', currentSeed), makePlayer(2, 'P2', currentSeed)] : [makePlayer(1, 'P1', currentSeed)];
@@ -453,6 +519,40 @@
     });
   }
 }
+
+// ── Golden Block ──────────────────────────────────────────────────────────────
+function spawnGoldenParticles(player, cx, cy) {
+  const colors = ['#fcd34d', '#facc15', '#fde68a', '#f59e0b'];
+  for (let i = 0; i < 25; i++) {
+    const a = (i / 25) * Math.PI * 2 + Math.random() * 0.25;
+    const speed = 2.2 + Math.random() * 3.2;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed - 1.2,
+      life: 1, decay: 0.018 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 3 + Math.random() * 3,
+    });
+  }
+}
+
+function spawnFireworks(player, cx, cy) {
+  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9'];
+  for (let i = 0; i < 36; i++) {
+    const a = Math.random() * Math.PI * 2;
+    const speed = 2 + Math.random() * 5;
+    player.particles.push({
+      x: cx, y: cy,
+      vx: Math.cos(a) * speed,
+      vy: Math.sin(a) * speed,
+      life: 1, decay: 0.012 + Math.random() * 0.018,
+      color: colors[i % colors.length],
+      size: 2.5 + Math.random() * 3.5,
+    });
+  }
+}
+
 function spawnDustParticles(player, cx, cy, color) {
   for (let i = 0; i < 6; i++) {
     player.particles.push({
@@ -505,12 +605,26 @@
     player.perfectText = player.combo > 1 ? `PERFECT x${player.combo}!` : 'PERFECT!';
     player.perfectTimer = 1100;
     spawnPerfectParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    const goldenPerfect = moving.isGolden;
+    if (goldenPerfect) {
+      spawnGoldenParticles(player, tx + tw / 2, toScreenY(player, moving.worldY) + BLOCK_H / 2);
+    }
     sfxPerfect();
-    if (player.combo % 3 === 0 && player.combo >= 3) {
+    const isMilestoneCombo = [5, 10, 15].includes(player.combo);
+    if (isMilestoneCombo) {
+      const marks = { 5: '🔥 5 COMBO!', 10: '💥 10 COMBO!!', 15: '⚡ 15 COMBO!!!' };
+      const vib = { 5: [40, 30, 60], 10: [60, 30, 90], 15: [80, 40, 120] };
+      player.fanfareText = marks[player.combo];
+      player.fanfareTimer = 1200;
+      sfxCombo(player.combo * 2);
+      vibrate(vib[player.combo]);
+    }
+    if (!isMilestoneCombo && player.combo % 3 === 0 && player.combo >= 3) {
       sfxCombo(player.combo);
       vibrate(40);
       toast(`${battleMode ? player.label + ' ' : ''}🔥 ${player.combo} 연속 퍼펙트!`);
     }
+    if (goldenPerfect) toast(`${battleMode ? player.label + ' ' : ''}💰 +5 보너스!`);
     if (player.combo > comboRecord) {
       comboRecord = player.combo;
       localStorage.setItem(STORAGE_COMBO_RECORD, String(comboRecord));
@@ -523,11 +637,16 @@
     }
     player.blocks.push({ worldX: overlapLeft, worldY: moving.worldY, width: overlapW, color: moving.color });
     spawnDustParticles(player, overlapLeft + overlapW / 2, toScreenY(player, moving.worldY), moving.color);
+    if (player.combo >= 3) {
+      player.breakText = '콤보 끊김';
+      player.breakTimer = 500;
+    }
     player.combo = 0;
   }
 
   const gained = isPerfect ? Math.max(1, Math.floor(Math.pow(player.combo, 1.3))) : 1;
   player.score += gained;
+  if (isPerfect && moving.isGolden) player.score += 5;
   refreshUI();
 
   if (player.blocks[player.blocks.length - 1].width < 4) {
@@ -541,9 +660,10 @@
 function triggerGameover(player) {
   if (player.phase !== 'playing') return;
   player.phase = 'gameover';
-  if (player.score > bestScore) {
+  player.gameoverAt = performance.now();
+  if (!battleMode && player.score > bestScore) {
     bestScore = player.score;
-    localStorage.setItem(STORAGE_BEST, String(bestScore));
+    setBest(currentModeKey, bestScore);
     bestEl.textContent = bestScore;
     toast('🎉 신기록 달성!');
   }
@@ -555,15 +675,21 @@
     void canvas.offsetWidth; // reflow
     canvas.classList.add('shake');
   }
-  if (battleMode) {
-    startBattleCountdown();
-  } else {
-    gamePhase = 'singleGameover';
-  }
+  if (battleMode) handleBattleGameover(player);
+  else gamePhase = 'singleGameover';
   refreshUI();
 }
 
 // ── Battle Mode ──────────────────────────────────────────────────────────────
+function handleBattleGameover(player) {
+  const other = players.find(p => p !== player);
+  if (other?.phase === 'gameover' && Math.abs(player.gameoverAt - other.gameoverAt) <= SIMULTANEOUS_GAMEOVER_MS) {
+    finishBattle({ forceDraw: true });
+    return;
+  }
+  startBattleCountdown();
+}
+
 function startBattleCountdown() {
   const alive = players.filter(p => p.phase === 'playing');
   if (alive.length === 0) {
@@ -573,15 +699,30 @@
   if (gamePhase !== 'battleCountdown') {
     gamePhase = 'battleCountdown';
     battleCountdown = BATTLE_COUNTDOWN_MS;
+    battleLastTickSecond = Math.ceil(BATTLE_COUNTDOWN_MS / 1000) + 1;
     toast('상대 5초 추가 턴');
   }
 }
 
-function finishBattle() {
+function finishBattle(opts = {}) {
   for (const player of players) player.phase = 'gameover';
   gamePhase = 'battleResult';
   const [p1, p2] = players;
-  battleWinner = p1.score === p2.score ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  const draw = opts.forceDraw || p1.score === p2.score;
+  battleWinner = draw ? '무승부' : (p1.score > p2.score ? 'P1 승!' : 'P2 승!');
+  if (!battleRecordApplied) {
+    const record = getBattleRecord();
+    if (draw) record.draws++;
+    else if (p1.score > p2.score) record.p1Wins++;
+    else record.p2Wins++;
+    setBattleRecord(record);
+    battleRecordApplied = true;
+  }
+  if (!draw && !battleFireworksSpawned) {
+    const winner = p1.score > p2.score ? p1 : p2;
+    spawnFireworks(winner, winner.viewWidth / 2, canvas.height / 2 - 92);
+    battleFireworksSpawned = true;
+  }
   refreshUI();
 }
 
@@ -645,12 +786,21 @@
 
   if (player.perfectTimer > 0) player.perfectTimer -= dt;
   if (player.perfectTimer <= 0) player.perfectText = '';
+  if (player.fanfareTimer > 0) player.fanfareTimer -= dt;
+  if (player.fanfareTimer <= 0) player.fanfareText = '';
+  if (player.breakTimer > 0) player.breakTimer -= dt;
+  if (player.breakTimer <= 0) player.breakText = '';
 }
 
 function update(dt) {
   for (const player of players) updatePlayer(player, dt);
   if (gamePhase === 'battleCountdown') {
     battleCountdown -= dt;
+    const secs = Math.ceil(Math.max(0, battleCountdown) / 1000);
+    if (secs > 0 && secs !== battleLastTickSecond) {
+      sfxTick();
+      battleLastTickSecond = secs;
+    }
     if (battleCountdown <= 0) finishBattle();
   }
 }
@@ -714,6 +864,15 @@
   ctx.stroke();
   ctx.setLineDash([]);
 
+  if (moving.isGolden) {
+    ctx.save();
+    ctx.shadowColor = '#facc15';
+    ctx.shadowBlur = 18;
+    ctx.strokeStyle = 'rgba(252,211,77,0.72)';
+    ctx.lineWidth = 6;
+    ctx.beginPath(); ctx.roundRect(effX, sy, width, BLOCK_H, 4); ctx.stroke();
+    ctx.restore();
+  }
   drawBlock(player, effX, worldY, width, color);
 
   const mult = moving.speedMult ?? 1;
@@ -752,6 +911,36 @@
   ctx.restore();
 }
 
+// ── Combo Fanfare ─────────────────────────────────────────────────────────────
+function drawComboFanfare(player, width) {
+  if (!player.fanfareText || player.fanfareTimer <= 0) return;
+  const alpha = Math.min(1, player.fanfareTimer / 250);
+  const scale = 1 + Math.sin((1200 - player.fanfareTimer) * 0.012) * 0.06;
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.translate(width / 2, canvas.height / 2 - 40);
+  ctx.scale(scale, scale);
+  ctx.textAlign = 'center';
+  ctx.fillStyle = 'rgba(0,0,0,0.34)';
+  ctx.font = '900 34px sans-serif';
+  ctx.fillText(player.fanfareText, 3, 3);
+  ctx.fillStyle = '#facc15';
+  ctx.fillText(player.fanfareText, 0, 0);
+  ctx.restore();
+}
+
+function drawComboBreak(player, width) {
+  if (!player.breakText || player.breakTimer <= 0) return;
+  const alpha = Math.max(0, player.breakTimer / 500);
+  ctx.save();
+  ctx.globalAlpha = alpha;
+  ctx.textAlign = 'center';
+  ctx.fillStyle = '#9ca3af';
+  ctx.font = 'bold 24px sans-serif';
+  ctx.fillText(player.breakText, width / 2, canvas.height / 2 - 18);
+  ctx.restore();
+}
+
 function drawHardFog(player, width) {
   if (!getMode().fog || player.score < 50) return;
   const grad = ctx.createLinearGradient(0, 0, 0, 170);
@@ -772,9 +961,11 @@
   for (const b of player.blocks) drawBlock(player, b.worldX, b.worldY, b.width, b.color);
   for (const f of player.falling) drawBlock(player, f.worldX, f.worldY, f.width, f.color, 0.7);
   drawMoving(player);
-  drawParticles(player);
-  drawPerfect(player, width);
-  drawHardFog(player, width);
+	  drawParticles(player);
+	  drawPerfect(player, width);
+	  drawComboFanfare(player, width);
+	  drawComboBreak(player, width);
+	  drawHardFog(player, width);
   drawPlayerStatus(player, width);
   if (!battleMode && gamePhase === 'singleGameover') drawSingleGameOver(player, width);
   ctx.restore();
@@ -835,19 +1026,44 @@
   ctx.lineTo(mid + 0.5, canvas.height);
   ctx.stroke();
 
+  if (players.length >= 2) {
+    const diff = players[0].score - players[1].score;
+    const label = diff === 0 ? '동점' : (diff > 0 ? `P1 +${diff}` : `P2 +${Math.abs(diff)}`);
+    ctx.fillStyle = 'rgba(15,23,42,0.62)';
+    ctx.fillRect(mid - 48, 8, 96, 26);
+    ctx.fillStyle = diff === 0 ? '#cbd5e1' : (diff > 0 ? '#60a5fa' : '#f87171');
+    ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
+    ctx.fillText(label, mid, 27);
+  }
+
   if (gamePhase === 'battleCountdown') {
     const secs = Math.ceil(battleCountdown / 1000);
-    ctx.fillStyle = 'rgba(0,0,0,0.35)';
-    ctx.fillRect(mid - 54, 42, 108, 42);
-    ctx.fillStyle = '#facc15';
-    ctx.font = 'bold 24px sans-serif';
-    ctx.textAlign = 'center';
-    ctx.fillText(`${secs}`, mid, 70);
+    const blinkOff = secs <= 1 && Math.floor(performance.now() / 160) % 2 === 0;
+    if (!blinkOff) {
+      const ratio = Math.max(0, Math.min(1, battleCountdown / BATTLE_COUNTDOWN_MS));
+      const hue = 120 * ratio;
+      ctx.fillStyle = 'rgba(0,0,0,0.42)';
+      ctx.fillRect(mid - 58, 42, 116, 66);
+      ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
+      ctx.font = '900 48px sans-serif';
+      ctx.textAlign = 'center';
+      ctx.fillText(`${secs}`, mid, 92);
+    }
   }
 
   if (gamePhase !== 'battleResult') return;
   ctx.fillStyle = 'rgba(0,0,0,0.72)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  const winnerPlayer = battleWinner.startsWith('P1') ? players[0] : (battleWinner.startsWith('P2') ? players[1] : null);
+  if (winnerPlayer) {
+    ctx.save();
+    ctx.translate(winnerPlayer.id === 1 ? 0 : mid, 0);
+    drawParticles(winnerPlayer);
+    ctx.restore();
+  }
+
   ctx.textAlign = 'center';
   ctx.fillStyle = '#fff';
   ctx.font = 'bold 34px sans-serif';
@@ -858,10 +1074,13 @@
   ctx.font = '13px sans-serif';
   ctx.fillStyle = '#cbd5e1';
   ctx.fillText(`mode ${getMode().label} · seed ${currentSeed}`, mid, canvas.height / 2 - 24);
+  const record = getBattleRecord();
+  ctx.fillStyle = '#94a3b8';
+  ctx.fillText(`P1 ${record.p1Wins}승 P2 ${record.p2Wins}승 무 ${record.draws}`, mid, canvas.height / 2 - 2);
 
   battleButtons = [
-    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 24, w: 150, h: 46, label: '리매치' },
-    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 24, w: 150, h: 46, label: '새 시드' },
+    { action: 'rematch', x: mid - 170, y: canvas.height / 2 + 30, w: 150, h: 46, label: '리매치' },
+    { action: 'newSeed', x: mid + 20, y: canvas.height / 2 + 30, w: 150, h: 46, label: '새 시드' },
   ];
   for (const btn of battleButtons) {
     ctx.fillStyle = btn.action === 'rematch' ? '#2563eb' : '#475569';
@@ -870,6 +1089,7 @@
     ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.font = 'bold 16px sans-serif';
+    ctx.textAlign = 'center';
     ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + 29);
   }
 }
@@ -882,6 +1102,7 @@
 function refreshUI() {
   const p1 = players[0];
   const p2 = players[1];
+  bestScore = getBest(currentModeKey);
   modeLabel.textContent = `모드: ${getMode().label}`;
   btnBattle.classList.toggle('active', battleMode);
   btnBattle.textContent = battleMode ? '⚔️ 배틀 ON' : '⚔️ 배틀 모드';
@@ -983,6 +1204,11 @@
   initGame({ newSeed: true });
   toast(`🎲 새 시드: ${currentSeed}`);
 });
+btnRecordReset.addEventListener('click', () => {
+  if (!confirm('배틀 전적만 초기화할까요? 최고 기록은 유지됩니다.')) return;
+  resetBattleRecord();
+  toast('🗑️ 배틀 전적 초기화 완료');
+});
 btnMute.addEventListener('click', () => {
   muted = !muted;
   localStorage.setItem(STORAGE_MUTE, muted ? '1' : '0');

hook: Stop
hook: Stop Completed
2026-04-26T14:00:40.894941Z ERROR codex_core::session: failed to record rollout items: thread 019dca0a-fdd7-73a1-b2a7-fa88b71ffcce not found
tokens used
82,249

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
