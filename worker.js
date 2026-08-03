// Runs user-submitted JavaScript against a problem's test cases, in an isolated
// Web Worker so an infinite loop can be killed (Worker.terminate()) from the main
// thread without freezing the page. One fresh worker per submission — see
// engine.js runJavaScript() for the timeout/terminate wiring.
importScripts('data.js')

// ---------- shared test helpers, also given to problem.io.prepare/serialize ----------
class ListNode { constructor(val, next = null) { this.val = val; this.next = next } }
function arrayToList(arr) {
  let head = null, tail = null
  for (const v of arr) {
    const n = new ListNode(v)
    if (!head) { head = n; tail = n } else { tail.next = n; tail = n }
  }
  return head
}
function listToArray(head) {
  const out = []
  while (head) { out.push(head.val); head = head.next }
  return out
}
function makeCyclicList(arr, pos) {
  if (!arr.length) return null
  const nodes = arr.map(v => new ListNode(v))
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1]
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos]
  return nodes[0]
}
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right } }
function arrayToTree(arr) {
  if (!arr.length || arr[0] === null) return null
  const root = new TreeNode(arr[0])
  const q = [root]
  let i = 1
  while (q.length && i < arr.length) {
    const node = q.shift()
    if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.left = new TreeNode(v); q.push(node.left) } }
    if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.right = new TreeNode(v); q.push(node.right) } }
  }
  return root
}
const HELPERS = { arrayToList, listToArray, makeCyclicList, arrayToTree }

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b) }

function evalDefinition(code, name) {
  // User code gets ListNode/TreeNode in scope so problems like Linked List
  // Reversal can reference them directly, matching the starter's stated assumption.
  const factory = new Function('ListNode', 'TreeNode', `${code}\nreturn typeof ${name} !== 'undefined' ? ${name} : undefined`)
  return factory(ListNode, TreeNode)
}

function runFunctionProblem(problem, code) {
  const fn = evalDefinition(code, problem.io.name)
  if (typeof fn !== 'function') {
    return { ok: false, error: `Couldn't find a function named "${problem.io.name}". Check the function name matches the starter exactly.` }
  }
  const results = []
  let allPassed = true
  for (const tc of problem.testCases) {
    try {
      const args = problem.io.prepare ? problem.io.prepare(tc.args, HELPERS) : tc.args
      let actual = fn(...args)
      if (problem.io.serialize) actual = problem.io.serialize(actual, HELPERS)
      const passed = deepEqual(actual, tc.expected)
      if (!passed) allPassed = false
      results.push({ args: tc.args, expected: tc.expected, actual, passed })
    } catch (err) {
      allPassed = false
      results.push({ args: tc.args, expected: tc.expected, actual: null, passed: false, error: String(err && err.message || err) })
    }
  }
  return { ok: true, allPassed, results }
}

function runClassProblem(problem, code) {
  const Cls = evalDefinition(code, problem.io.name)
  if (typeof Cls !== 'function') {
    return { ok: false, error: `Couldn't find a class named "${problem.io.name}". Check the class name matches the starter exactly.` }
  }
  const results = []
  let allPassed = true
  for (const tc of problem.testCases) {
    try {
      const instance = new Cls(...(tc.ctorArgs || []))
      const ops = []
      for (const op of tc.ops) {
        const actual = instance[op.call](...op.args)
        if ('expected' in op) {
          const passed = deepEqual(actual, op.expected)
          if (!passed) allPassed = false
          ops.push({ call: op.call, args: op.args, expected: op.expected, actual, passed })
        }
      }
      results.push({ ops })
    } catch (err) {
      allPassed = false
      results.push({ ops: [], error: String(err && err.message || err) })
    }
  }
  return { ok: true, allPassed, results }
}

self.onmessage = (event) => {
  const { problemId, code, useNaive } = event.data
  const problem = PROBLEMS.find(p => p.id === problemId)
  if (!problem) { self.postMessage({ ok: false, error: 'Unknown problem id: ' + problemId }); return }
  try {
    const outcome = problem.io.kind === 'class'
      ? runClassProblem(problem, code)
      : runFunctionProblem(problem, code)
    self.postMessage(outcome)
  } catch (err) {
    // Syntax errors in user code (new Function throws at parse time) land here.
    self.postMessage({ ok: false, error: String(err && err.message || err) })
  }
}
