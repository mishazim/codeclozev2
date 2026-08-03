// Grading engine: daily problem selection, localStorage progress/streak,
// JavaScript execution (via worker.js, real timeout-protected), and
// pattern-match grading for Python/Java/C/C++ (no execution — see plan).
'use strict'

const STORAGE_KEY = 'codeclozev2:progress'
const JS_TIMEOUT_MS = 2000
const MAX_ATTEMPTS = 5

// ---------- daily problem selection ----------
function todayDateStr(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function fnv1aHash(str) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}
function dailyProblemForDate(dateStr) {
  const idx = fnv1aHash(dateStr) % PROBLEMS.length
  return PROBLEMS[idx]
}

// ---------- storage ----------
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}
function getDayEntry(dateStr) {
  const progress = loadProgress()
  return progress[dateStr] || null
}
function ensureDayEntry(dateStr, problemId) {
  const progress = loadProgress()
  if (!progress[dateStr]) {
    progress[dateStr] = { problemId, language: 'javascript', attempts: [], solved: false, gaveUp: false }
    saveProgress(progress)
  }
  return progress[dateStr]
}
function updateDayEntry(dateStr, updates) {
  const progress = loadProgress()
  progress[dateStr] = { ...progress[dateStr], ...updates }
  saveProgress(progress)
  return progress[dateStr]
}
function isDayFinished(entry) {
  return !!entry && (entry.solved || entry.gaveUp || entry.attempts.length >= MAX_ATTEMPTS)
}
function computeStreak(beforeDateStr) {
  const progress = loadProgress()
  let streak = 0
  let cursor = new Date(beforeDateStr + 'T00:00:00')
  while (true) {
    const ds = todayDateStr(cursor)
    const entry = progress[ds]
    if (entry && entry.solved) { streak++; cursor.setDate(cursor.getDate() - 1) }
    else break
  }
  return streak
}

// ---------- code normalization + pattern-match grading (Python/Java/C/C++) ----------
function stripComments(code, language) {
  if (language === 'python') {
    return code.split('\n').map(line => line.replace(/#.*$/, '')).join('\n')
  }
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}
function gradePattern(problem, language, code) {
  const langData = problem.languages[language]
  const normalized = stripComments(code, language)
  const matchesAll = (patterns) => Array.isArray(patterns) && patterns.length > 0 && patterns.every(re => re.test(normalized))
  if (matchesAll(langData.requiredOptimal)) return { passed: true, matched: 'optimal' }
  if (matchesAll(langData.requiredNaive)) return { passed: true, matched: 'naive' }
  return { passed: false, matched: null }
}

// ---------- structural "which approach does this look like" heuristic ----------
// Best-effort only — never used to determine pass/fail, only to label the
// approach in the UI. Always caveated as a heuristic, never presented as measured.
function guessApproach(code) {
  const hashSignal = /\{\}|new\s+Map|new\s+Set|dict\(|hashmap|unordered_map|std::map|Map\s*<|Set\s*<|deque|heap|priority_queue|heapq|linkedhashmap|OrderedDict/i.test(code)
  const loopCount = (code.match(/\b(for|while)\s*[(:]/g) || []).length
  const linearScanSignal = /\.includes\(|\.find\(|\.some\(|\.indexOf\(|startswith|startsWith/i.test(code)
  if (loopCount >= 2) return 'naive-shaped'
  if (loopCount >= 1 && linearScanSignal && !hashSignal) return 'naive-shaped'
  if (hashSignal) return 'optimal-shaped'
  return 'unclear'
}

// ---------- JavaScript execution (Worker, timeout-protected) ----------
function runJavaScript(problemId, code) {
  return new Promise((resolve) => {
    const worker = new Worker('worker.js')
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      worker.terminate()
      resolve({ ok: false, timedOut: true, error: `Timed out after ${JS_TIMEOUT_MS / 1000}s — check for an infinite loop.` })
    }, JS_TIMEOUT_MS)
    worker.onmessage = (event) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve(event.data)
    }
    worker.onerror = (event) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve({ ok: false, error: event.message || 'Unknown error running your code.' })
    }
    worker.postMessage({ problemId, code })
  })
}

// ---------- unified grading entry point ----------
async function gradeSubmission(problem, language, code) {
  const approach = guessApproach(code)
  if (language === 'javascript') {
    const execResult = await runJavaScript(problem.id, code)
    if (!execResult.ok) {
      return { passed: false, mode: 'executed', approach, execResult }
    }
    return { passed: execResult.allPassed, mode: 'executed', approach, execResult }
  }
  const patternResult = gradePattern(problem, language, code)
  return { passed: patternResult.passed, mode: 'pattern', approach, matched: patternResult.matched }
}

const Engine = {
  todayDateStr, dailyProblemForDate,
  loadProgress, saveProgress, getDayEntry, ensureDayEntry, updateDayEntry, isDayFinished, computeStreak,
  gradeSubmission, guessApproach,
  MAX_ATTEMPTS,
}
