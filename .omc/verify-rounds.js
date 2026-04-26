#!/usr/bin/env node
// Ralph Round 2-4 자동 검증 스크립트
// 사용: node verify-rounds.js
const fs = require('fs');
const path = '/Users/finito/dev/makesonggreatagain/user/donghyun/projects/tower-stack/index.html';
const html = fs.readFileSync(path, 'utf8');

const results = { US002: [], US003: [], US004: [], pass: true };

function check(group, label, ok, evidence = '') {
  results[group].push({ label, ok, evidence });
  if (!ok) results.pass = false;
}

// ── JS Syntax ────────────────────────────────────────────────────────────────
const m = html.match(/<script>([\s\S]+?)<\/script>/);
let syntaxOK = false;
let syntaxErr = '';
if (m) {
  try { new Function(m[1]); syntaxOK = true; }
  catch (e) { syntaxErr = e.message; }
}
check('US002', 'JS 구문 통과', syntaxOK, syntaxErr);

// ── US-002: 황금 블록 + 콤보 강화 ────────────────────────────────────────────
check('US002', '황금 블록 isGolden 플래그',
  /isGolden\s*[:=]/.test(html),
  'isGolden field present');
check('US002', '황금 블록 등장 확률 ~15%',
  /isGolden\s*=\s*[^\n]*<\s*0\.1[5-9]/.test(html) || /0\.15/.test(html),
  'spawn probability literal');
check('US002', '황금 보너스 점수 +5',
  /\+\s*5\b/.test(html.match(/dropBlock[\s\S]+?spawnMoving/)?.[0] || '') ||
  /score\s*\+=\s*5/.test(html),
  '+5 bonus literal in drop logic');
check('US002', 'spawnGoldenParticles 헬퍼',
  /spawnGoldenParticles|goldenParticles|GOLDEN_PARTICLE/i.test(html),
  'golden particle helper');
check('US002', '콤보 5/10/15 마일스톤 분기',
  /\[\s*5\s*,\s*10\s*,\s*15\s*\]/.test(html) ||
  (/combo[^\n]*5/.test(html) && /combo[^\n]*10/.test(html) && /combo[^\n]*15/.test(html)),
  'combo milestone (5/10/15)');
check('US002', '콤보 끊김 메시지',
  /(comboBreak|콤보\s*끊김|breakText|breakTimer)/.test(html),
  'combo break flag');
check('US002', '팡파레 텍스트 함수',
  /(drawComboFanfare|fanfareText|fanfareTimer|COMBO!)/.test(html),
  'fanfare draw');

// ── US-003: 배틀 UX ──────────────────────────────────────────────────────────
check('US003', '점수 차이 표시 (P1 +N / P2 +N / 동점)',
  /동점/.test(html) && /P1\s*\+/.test(html) && /P2\s*\+/.test(html),
  'score diff display literals');
check('US003', '카운트다운 5초',
  /BATTLE_COUNTDOWN_MS\s*=\s*5000|battleCountdown.+5000|countdown.{0,30}5/.test(html),
  '5000ms countdown constant');
check('US003', 'sfxTick 또는 카운트다운 효과음',
  /(sfxTick|sfxCountdown|countdownSfx|tickBeep)/.test(html) ||
  /beep\(8[0-9]{2},/.test(html),
  'countdown sfx');
check('US003', 'spawnFireworks 폭죽',
  /(spawnFireworks|fireworks|폭죽)/.test(html),
  'fireworks helper');
check('US003', '동시 게임오버 무승부 윈도우',
  /SIMULTANEOUS_GAMEOVER_MS|simultaneous|동시.*무승부|forceDraw/.test(html) &&
  /gameoverAt/.test(html),
  'simultaneous gameover detection');
check('US003', '리매치/새시드 버튼 hit-test',
  /battleButtons\s*\.\s*push|battleButtons\s*=\s*\[/.test(html) &&
  /(rematch|리매치|새\s*시드)/i.test(html),
  'battle button rect storage');

// ── US-004: 통계 + 폴리싱 ────────────────────────────────────────────────────
check('US004', '모드별 베스트 키 (easy)',
  /mksga_tower_best_easy_v1/.test(html), 'easy best key');
check('US004', '모드별 베스트 키 (normal)',
  /mksga_tower_best_normal_v1/.test(html), 'normal best key');
check('US004', '모드별 베스트 키 (hard)',
  /mksga_tower_best_hard_v1/.test(html), 'hard best key');
check('US004', '배틀 전적 키',
  /mksga_tower_battle_record_v1/.test(html), 'battle record key');
check('US004', 'getBest/setBest 헬퍼',
  /(getBest|bestForMode|loadBest|saveBest)/.test(html), 'best helper');
check('US004', '배틀 전적 JSON 형식 (p1Wins, p2Wins, draws)',
  /p1Wins/.test(html) && /p2Wins/.test(html) && /(draws|tie)/.test(html),
  'battle record JSON shape');
check('US004', '전적 초기화 버튼',
  /(전적\s*초기화|reset.*record|clearRecord|btn-reset-record)/i.test(html),
  'reset record button');

// ── 기존 기능 미손상 (회귀 검사) ───────────────────────────────────────────
const regressionMarkers = ['MODES', 'makePRNG', 'battleMode', 'sfxPerfect',
  'data-mode', 'btnBattle', 'currentSeed', 'navigator.vibrate', 'touchstart',
  'addEventListener', 'wobblePhase', 'wobbleAmp', 'STORAGE_MUTE'];
const missing = regressionMarkers.filter(s => !html.includes(s));
check('US004', '기존 기능 마커 미손상',
  missing.length === 0,
  missing.length ? 'MISSING: ' + missing.join(', ') : 'all preserved');

// ── 출력 ──────────────────────────────────────────────────────────────────────
function pp(group, name) {
  console.log(`\n=== ${name} ===`);
  for (const r of results[group]) {
    console.log(`${r.ok ? '✓' : '✗'} ${r.label}${r.ok ? '' : ' [' + r.evidence + ']'}`);
  }
}
pp('US002', 'US-002: 황금 블록 + 콤보');
pp('US003', 'US-003: 배틀 UX');
pp('US004', 'US-004: 통계 + 폴리싱');

const stats = { lines: html.split('\n').length, bytes: html.length };
console.log('\n=== Stats ===');
console.log('Lines:', stats.lines, 'Bytes:', stats.bytes);
console.log('\nOVERALL:', results.pass ? 'PASS ✓' : 'FAIL ✗');
process.exit(results.pass ? 0 : 1);
