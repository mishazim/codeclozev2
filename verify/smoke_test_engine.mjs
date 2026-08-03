// Headless smoke test of engine.js's pure logic (daily selection, storage,
// streak, pattern grading, JS grading) since browser automation isn't
// available in this environment. Stubs localStorage/Worker and runs the
// actual engine.js/data.js source through Node's vm module so real browser
// script-tag semantics (top-level const visible as context globals) apply.
// Run: node verify/smoke_test_engine.mjs
import vm from 'vm'
import fs from 'fs'

let pass = 0, fail = 0
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) pass++
  else { fail++; console.log(`FAIL ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`) }
}

// ---------- in-memory localStorage stub ----------
class LocalStorageStub {
  constructor() { this.store = {} }
  getItem(k) { return Object.prototype.hasOwnProperty.call(this.store, k) ? this.store[k] : null }
  setItem(k, v) { this.store[k] = String(v) }
  removeItem(k) { delete this.store[k] }
}

// ---------- Worker stub: mirrors worker.js's grading logic synchronously ----------
class ListNode { constructor(val, next = null) { this.val = val; this.next = next } }
function arrayToList(arr) { let head = null, tail = null; for (const v of arr) { const n = new ListNode(v); if (!head) { head = n; tail = n } else { tail.next = n; tail = n } } return head }
function listToArray(head) { const out = []; while (head) { out.push(head.val); head = head.next }; return out }
function makeCyclicList(arr, pos) { if (!arr.length) return null; const nodes = arr.map(v => new ListNode(v)); for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1]; if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos]; return nodes[0] }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right } }
function arrayToTree(arr) { if (!arr.length || arr[0] === null) return null; const root = new TreeNode(arr[0]); const q = [root]; let i = 1; while (q.length && i < arr.length) { const node = q.shift(); if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.left = new TreeNode(v); q.push(node.left) } } if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.right = new TreeNode(v); q.push(node.right) } } } return root }
const HELPERS = { arrayToList, listToArray, makeCyclicList, arrayToTree }
function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b) }
function evalDefinition(code, name) {
  const factory = new Function('ListNode', 'TreeNode', `${code}\nreturn typeof ${name} !== 'undefined' ? ${name} : undefined`)
  return factory(ListNode, TreeNode)
}
function runFunctionProblem(problem, code) {
  const fn = evalDefinition(code, problem.io.name)
  const results = []; let allPassed = true
  for (const tc of problem.testCases) {
    try {
      const args = problem.io.prepare ? problem.io.prepare(tc.args, HELPERS) : tc.args
      let actual = fn(...args)
      if (problem.io.serialize) actual = problem.io.serialize(actual, HELPERS)
      const passed = deepEqual(actual, tc.expected)
      if (!passed) allPassed = false
      results.push({ expected: tc.expected, actual, passed })
    } catch (err) { allPassed = false; results.push({ passed: false, error: String(err) }) }
  }
  return { ok: true, allPassed, results }
}
function runClassProblem(problem, code) {
  const Cls = evalDefinition(code, problem.io.name)
  const results = []; let allPassed = true
  for (const tc of problem.testCases) {
    const instance = new Cls(...(tc.ctorArgs || []))
    const ops = []
    for (const op of tc.ops) {
      const actual = instance[op.call](...op.args)
      if ('expected' in op) { const passed = deepEqual(actual, op.expected); if (!passed) allPassed = false; ops.push({ passed }) }
    }
    results.push({ ops })
  }
  return { ok: true, allPassed, results }
}
class WorkerStub {
  constructor() { this._onmessage = null }
  set onmessage(fn) { this._onmessage = fn }
  get onmessage() { return this._onmessage }
  set onerror(fn) { }
  postMessage({ problemId, code }) {
    setTimeout(() => {
      const problem = context.PROBLEMS.find(p => p.id === problemId)
      const outcome = problem.io.kind === 'class' ? runClassProblem(problem, code) : runFunctionProblem(problem, code)
      this._onmessage({ data: outcome })
    }, 0)
  }
  terminate() { }
}

// ---------- build vm context and run data.js + engine.js in it ----------
const context = {
  localStorage: new LocalStorageStub(),
  Worker: WorkerStub,
  console,
  setTimeout, clearTimeout,
  Math, JSON, Date, Promise,
}
vm.createContext(context)
vm.runInContext(fs.readFileSync('data.js', 'utf8'), context, { filename: 'data.js' })
vm.runInContext(fs.readFileSync('engine.js', 'utf8'), context, { filename: 'engine.js' })
// top-level `const` bindings from runInContext don't become context properties
// (unlike `var`) -- explicitly promote the two we need for this test harness.
vm.runInContext('this.PROBLEMS = PROBLEMS; this.Engine = Engine;', context)
const Engine = context.Engine

// ---------- tests ----------
// 1. Daily selection is deterministic for a given date
const d1a = Engine.dailyProblemForDate('2026-07-29')
const d1b = Engine.dailyProblemForDate('2026-07-29')
check('daily selection deterministic', d1a.id, d1b.id)

// 2. Different dates (usually) pick different problems -- sample a week and expect >1 distinct
const ids = new Set()
for (let i = 0; i < 16; i++) {
  const d = new Date('2026-07-01T00:00:00')
  d.setDate(d.getDate() + i)
  ids.add(Engine.dailyProblemForDate(Engine.todayDateStr(d)).id)
}
check('daily selection varies across dates (16 days should hit multiple problems)', ids.size > 1, true)

// 3. Storage round-trip
const today = '2026-07-29'
const entry = Engine.ensureDayEntry(today, d1a.id)
check('ensureDayEntry creates entry', entry.problemId, d1a.id)
check('fresh entry unsolved', entry.solved, false)
Engine.updateDayEntry(today, { solved: true, attempts: [{ passed: true }] })
check('isDayFinished after solve', Engine.isDayFinished(Engine.getDayEntry(today)), true)

// 4. Streak: solve 3 consecutive days ending "today", expect streak 3
const progressKey = 'codeclozev2:progress'
context.localStorage.setItem(progressKey, JSON.stringify({
  '2026-07-27': { solved: true, attempts: [] },
  '2026-07-28': { solved: true, attempts: [] },
  '2026-07-29': { solved: true, attempts: [] },
}))
check('streak of 3 consecutive solved days', Engine.computeStreak('2026-07-29'), 3)
// break the streak
context.localStorage.setItem(progressKey, JSON.stringify({
  '2026-07-27': { solved: true, attempts: [] },
  '2026-07-28': { solved: false, attempts: [] },
  '2026-07-29': { solved: true, attempts: [] },
}))
check('streak stops at a non-solved day', Engine.computeStreak('2026-07-29'), 1)

// 5. Pattern grading (Python) -- Two Sum optimal vs naive vs neither
const twoSum = context.PROBLEMS.find(p => p.id === 'two-sum')
const optimalPy = twoSum.optimal.code.python
const naivePy = twoSum.naive.code.python
const garbagePy = 'def two_sum(nums, target):\n    return None'

async function checkPatternGrading() {
  const rOpt = await Engine.gradeSubmission(twoSum, 'python', optimalPy)
  check('python optimal code -> passed + matched optimal', [rOpt.passed, rOpt.matched], [true, 'optimal'])
  const rNaive = await Engine.gradeSubmission(twoSum, 'python', naivePy)
  check('python naive code -> passed + matched naive', [rNaive.passed, rNaive.matched], [true, 'naive'])
  const rGarbage = await Engine.gradeSubmission(twoSum, 'python', garbagePy)
  check('python garbage code -> not passed', rGarbage.passed, false)

  // 6. JS execution path via WorkerStub
  const rJsOptimal = await Engine.gradeSubmission(twoSum, 'javascript', twoSum.optimal.code.javascript)
  check('js optimal code executes and passes', rJsOptimal.passed, true)
  const rJsBroken = await Engine.gradeSubmission(twoSum, 'javascript', 'function twoSum(nums, target) { return [999, 999] }')
  check('js wrong code executes and fails', rJsBroken.passed, false)

  // 7. Class-kind problem (LRU Cache) via JS execution
  const lru = context.PROBLEMS.find(p => p.id === 'lru-cache')
  const rLru = await Engine.gradeSubmission(lru, 'javascript', lru.optimal.code.javascript)
  check('lru cache optimal class executes and passes', rLru.passed, true)

  // 8. Linked-list prepare/serialize path (Linked List Reversal) via JS execution
  const llr = context.PROBLEMS.find(p => p.id === 'linked-list-reversal')
  const rLlr = await Engine.gradeSubmission(llr, 'javascript', llr.optimal.code.javascript)
  check('linked list reversal optimal executes and passes', rLlr.passed, true)

  console.log(`\n${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}
checkPatternGrading()
