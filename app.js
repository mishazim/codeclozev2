'use strict'

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
]

const state = {
  mode: 'daily',
  problem: null,
  language: localStorage.getItem('codeclozev2:lastLanguage') || 'javascript',
  code: '',
  starterSnapshot: '',
  dateStr: Engine.todayDateStr(),
  dayEntry: null,
  practiceAttempts: [],
  finished: false,
  busy: false,
}

const root = document.getElementById('app-root')
const streakDisplay = document.getElementById('streak-display')

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
function fmtValue(v) {
  if (v === undefined) return 'undefined'
  try { return JSON.stringify(v) } catch { return String(v) }
}

// ---------- mode switching ----------
document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab')
  if (!btn) return
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
  btn.classList.add('active')
  if (btn.dataset.mode === 'daily') startDaily()
  else renderPracticeList()
})

function currentAttempts() {
  return state.mode === 'daily' ? (state.dayEntry ? state.dayEntry.attempts : []) : state.practiceAttempts
}

// ---------- daily ----------
function startDaily() {
  state.mode = 'daily'
  state.dateStr = Engine.todayDateStr()
  state.problem = Engine.dailyProblemForDate(state.dateStr)
  state.dayEntry = Engine.ensureDayEntry(state.dateStr, state.problem.id)
  state.language = state.dayEntry.language || state.language
  state.finished = Engine.isDayFinished(state.dayEntry)
  const lastAttempt = state.dayEntry.attempts[state.dayEntry.attempts.length - 1]
  state.code = lastAttempt ? lastAttempt.code : state.problem.languages[state.language].starter
  state.starterSnapshot = state.problem.languages[state.language].starter
  updateStreakDisplay()
  render()
}

function updateStreakDisplay() {
  const streak = Engine.computeStreak(state.dateStr)
  streakDisplay.textContent = `🔥 ${streak}`
}

// ---------- practice ----------
function renderPracticeList() {
  state.mode = 'practice'
  const byDifficulty = { easy: [], medium: [], hard: [] }
  for (const p of PROBLEMS) byDifficulty[p.difficulty].push(p)
  const section = (label, cls, items) => `
    <h3>${label}</h3>
    <div class="practice-grid">
      ${items.map(p => `
        <button class="practice-card" data-id="${p.id}">
          <div class="pc-name">${escapeHtml(p.name)}</div>
          <span class="badge badge-${p.difficulty}">${p.difficulty}</span>
          <span class="badge badge-category">${p.category === 'algorithms' ? 'Algorithm' : 'Data Structure'}</span>
        </button>
      `).join('')}
    </div>`
  root.innerHTML = `
    <div class="panel">
      <h2>Practice — pick any problem</h2>
      <p class="muted" style="margin-bottom:8px">Practice mode doesn't affect your daily streak.</p>
      ${section('Easy', 'easy', byDifficulty.easy)}
      ${section('Medium', 'medium', byDifficulty.medium)}
      ${section('Hard', 'hard', byDifficulty.hard)}
    </div>`
  root.querySelectorAll('.practice-card').forEach(card => {
    card.addEventListener('click', () => startPractice(card.dataset.id))
  })
}

function startPractice(problemId) {
  state.mode = 'practice'
  state.problem = PROBLEMS.find(p => p.id === problemId)
  state.practiceAttempts = []
  state.finished = false
  state.code = state.problem.languages[state.language].starter
  state.starterSnapshot = state.code
  render()
}

// ---------- rendering ----------
function render() {
  if (!state.problem) return
  if (state.finished) renderFinished()
  else renderActiveGame()
}

function renderProblemPanelHtml(problem) {
  return `
    <div class="panel">
      <div class="problem-meta">
        <span class="badge badge-${problem.difficulty}">${problem.difficulty}</span>
        <span class="badge badge-category">${problem.category === 'algorithms' ? 'Algorithm' : 'Data Structure'}</span>
      </div>
      <div class="problem-title">${escapeHtml(problem.name)}</div>
      <div class="problem-desc">${escapeHtml(problem.description)}</div>
      ${problem.examples.map(ex => `
        <div class="example-block">
          <div class="ex-io"><span class="ex-label">Input</span><code>${escapeHtml(ex.input)}</code></div>
          <div class="ex-io"><span class="ex-label">Output</span><code>${escapeHtml(ex.output)}</code></div>
          ${ex.note ? `<div class="ex-note">${escapeHtml(ex.note)}</div>` : ''}
        </div>`).join('')}
      ${problem.constraints && problem.constraints.length ? `
        <h3>Constraints</h3>
        <ul class="constraints-list">${problem.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>` : ''}
    </div>`
}

function renderActiveGame() {
  const problem = state.problem
  const attempts = currentAttempts()
  const langData = problem.languages[state.language]
  const isPattern = state.language !== 'javascript'
  const backLink = state.mode === 'practice' ? `<button class="back-link" id="back-to-practice">← back to practice list</button>` : ''

  root.innerHTML = `
    ${backLink}
    <div class="game-grid">
      ${renderProblemPanelHtml(problem)}
      <div class="panel">
        <h2>Your Solution</h2>
        <div class="lang-picker">
          ${LANGUAGES.map(l => `<button class="lang-btn ${l.id === state.language ? 'active' : ''}" data-lang="${l.id}">${l.label}</button>`).join('')}
        </div>
        ${isPattern ? `<div class="pattern-note">⚠ ${LANGUAGES.find(l => l.id === state.language).label} is graded by matching your code's structure against the reference solution (checked by structure, not executed) — JavaScript is the only language actually run.</div>` : ''}
        <textarea class="code-editor" id="code-editor" spellcheck="false">${escapeHtml(state.code)}</textarea>
        <div class="editor-actions">
          <button class="btn btn-primary" id="submit-btn" ${state.busy ? 'disabled' : ''}>${state.busy ? 'Running…' : 'Submit'}</button>
          <button class="btn btn-ghost" id="giveup-btn" ${attempts.length === 0 ? 'disabled' : ''}>Give up</button>
          <div class="attempt-pips">${renderPips(attempts)}</div>
        </div>
        ${renderLatestResult(attempts)}
        ${renderHints(problem, attempts)}
      </div>
    </div>`

  document.getElementById('code-editor').addEventListener('input', (e) => { state.code = e.target.value })
  document.getElementById('code-editor').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.target
      const start = el.selectionStart, end = el.selectionEnd
      el.value = el.value.slice(0, start) + '  ' + el.value.slice(end)
      el.selectionStart = el.selectionEnd = start + 2
      state.code = el.value
    }
  })
  root.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => onLanguageChange(btn.dataset.lang)))
  document.getElementById('submit-btn').addEventListener('click', onSubmit)
  document.getElementById('giveup-btn').addEventListener('click', onGiveUp)
  const backBtn = document.getElementById('back-to-practice')
  if (backBtn) backBtn.addEventListener('click', renderPracticeList)
}

function renderPips(attempts) {
  const pips = []
  for (let i = 0; i < Engine.MAX_ATTEMPTS; i++) {
    const a = attempts[i]
    const cls = !a ? '' : (a.passed ? 'pass' : 'fail')
    pips.push(`<span class="pip ${cls}"></span>`)
  }
  return pips.join('')
}

function renderLatestResult(attempts) {
  if (!attempts.length) return ''
  const a = attempts[attempts.length - 1]
  if (a.mode === 'executed') {
    const exec = a.execResult
    if (!exec.ok) {
      return `<div class="error-box">${escapeHtml(exec.error || 'Unknown error.')}</div>`
    }
    const rows = exec.results.map((r, i) => {
      if (state.problem.io.kind === 'class') {
        const opRows = (r.ops || []).map(op => `
          <div class="result-row ${op.passed ? 'pass' : 'fail'}">
            <span class="result-tag">${op.passed ? 'PASS' : 'FAIL'}</span>
            <span>${escapeHtml(op.call)}(${op.args.map(fmtValue).join(', ')})</span>
            <span class="result-detail">expected ${fmtValue(op.expected)}, got ${fmtValue(op.actual)}</span>
          </div>`).join('')
        return r.error ? `<div class="result-row fail"><span class="result-tag">FAIL</span><span class="result-detail">${escapeHtml(r.error)}</span></div>` : opRows
      }
      return `
        <div class="result-row ${r.passed ? 'pass' : 'fail'}">
          <span class="result-tag">${r.passed ? 'PASS' : 'FAIL'}</span>
          <span>test ${i + 1}</span>
          <span class="result-detail">${r.error ? escapeHtml(r.error) : `expected ${fmtValue(r.expected)}, got ${fmtValue(r.actual)}`}</span>
        </div>`
    }).join('')
    return `<div class="results-list">${rows}</div>`
  }
  // pattern mode
  const label = a.matched ? `matched the "${a.matched}" reference pattern` : 'didn’t match either reference pattern yet'
  return `<div class="results-list"><div class="result-row ${a.passed ? 'pass' : 'fail'}">
    <span class="result-tag">${a.passed ? 'PASS' : 'FAIL'}</span>
    <span class="result-detail">${label} (checked by structure, not executed)</span>
  </div></div>`
}

function renderHints(problem, attempts) {
  const n = attempts.length
  const hints = []
  if (n >= 2 && problem.hints[0]) hints.push(problem.hints[0])
  if (n >= 4 && problem.hints[1]) hints.push(problem.hints[1])
  if (!hints.length) return ''
  return `<div class="hint-box">${hints.map(h => `💡 ${escapeHtml(h)}`).join('<br/>')}</div>`
}

function onLanguageChange(lang) {
  if (lang === state.language) return
  const untouched = state.code === state.starterSnapshot || state.code.trim() === ''
  if (!untouched && !confirm('Switch language and reset the editor to that language’s starter code? Your current code will be lost.')) return
  state.language = lang
  state.code = state.problem.languages[lang].starter
  state.starterSnapshot = state.code
  localStorage.setItem('codeclozev2:lastLanguage', lang)
  if (state.mode === 'daily') Engine.updateDayEntry(state.dateStr, { language: lang })
  render()
}

async function onSubmit() {
  if (state.busy) return
  state.busy = true
  render()
  const result = await Engine.gradeSubmission(state.problem, state.language, state.code)
  const attempt = {
    language: state.language,
    code: state.code,
    passed: result.passed,
    mode: result.mode,
    approach: result.approach,
    execResult: result.execResult,
    matched: result.matched,
    timestamp: Date.now(),
  }
  const attempts = currentAttempts()
  attempts.push(attempt)
  if (state.mode === 'daily') {
    Engine.updateDayEntry(state.dateStr, { attempts: state.dayEntry.attempts, solved: state.dayEntry.solved || result.passed, language: state.language })
    state.dayEntry = Engine.getDayEntry(state.dateStr)
  }
  state.busy = false
  if (result.passed || attempts.length >= Engine.MAX_ATTEMPTS) {
    state.finished = true
    if (state.mode === 'daily') updateStreakDisplay()
  }
  render()
}

function onGiveUp() {
  if (currentAttempts().length === 0) return
  state.finished = true
  if (state.mode === 'daily') {
    Engine.updateDayEntry(state.dateStr, { gaveUp: true })
    state.dayEntry = Engine.getDayEntry(state.dateStr)
  }
  render()
}

// ---------- finished view: coaching (if needed) + always-on reveal panel ----------
function renderFinished() {
  const problem = state.problem
  const attempts = currentAttempts()
  const solved = attempts.some(a => a.passed)
  const backLink = state.mode === 'practice' ? `<button class="back-link" id="back-to-practice">← back to practice list</button>` : ''

  const lastAttempt = attempts[attempts.length - 1]
  const approachNote = lastAttempt && lastAttempt.approach && lastAttempt.approach !== 'unclear'
    ? `<span class="approach-tag">your code looked ${lastAttempt.approach === 'optimal-shaped' ? 'optimal-shaped' : 'naive-shaped'} (heuristic, not measured)</span>`
    : ''

  root.innerHTML = `
    ${backLink}
    <div class="finished-banner ${solved ? 'solved' : 'failed'}">
      <div>
        <div class="finished-title">${solved ? '✓ Solved' : (attempts.length ? '5 attempts used' : 'Gave up')} — ${escapeHtml(problem.name)}</div>
        <div class="muted">${attempts.length} attempt${attempts.length === 1 ? '' : 's'} · ${approachNote || ''}</div>
      </div>
      ${state.mode === 'daily' ? '<div class="muted">Come back tomorrow for the next daily.</div>' : `<button class="btn btn-ghost" id="try-again-btn">Try again</button>`}
    </div>

    ${!solved ? `
    <div class="panel coaching-panel">
      <h2>Coaching</h2>
      <p class="problem-desc">Here’s where solutions like this usually go wrong:</p>
      <ul class="mistake-list">${(problem.commonMistakes || []).map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
    </div>` : ''}

    <div class="panel reveal-panel">
      <h2>Optimal Solution</h2>
      <div class="complexity-row">
        <div class="complexity-stat"><div class="label">Time</div><div class="value">${escapeHtml(problem.optimal.time)}</div></div>
        <div class="complexity-stat"><div class="label">Space</div><div class="value">${escapeHtml(problem.optimal.space)}</div></div>
      </div>
      <p class="problem-desc">${escapeHtml(problem.optimal.explanation)}</p>
      <pre class="code-block">${escapeHtml(problem.optimal.code[state.language] || problem.optimal.code.python)}</pre>
      <h3>Used in production</h3>
      <ul class="use-case-list">${problem.useCases.map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>
      ${problem.naive ? `
        <h3>Naive approach, for comparison (${escapeHtml(problem.naive.time)} / ${escapeHtml(problem.naive.space)})</h3>
        <pre class="code-block">${escapeHtml(problem.naive.code[state.language] || problem.naive.code.javascript)}</pre>
      ` : ''}
    </div>`

  const backBtn = document.getElementById('back-to-practice')
  if (backBtn) backBtn.addEventListener('click', renderPracticeList)
  const tryAgainBtn = document.getElementById('try-again-btn')
  if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => startPractice(problem.id))
}

// ---------- boot ----------
startDaily()
