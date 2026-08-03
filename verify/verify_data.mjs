// Re-verifies the ACTUAL code strings living in data.js (not the scratch copies in
// verify.mjs) by eval-ing them and running them through each problem's testCases,
// using the same io.prepare/serialize contract the browser engine will use.
// Run: node verify/verify_data.mjs
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PROBLEMS } = require('../data.js')

let pass = 0, fail = 0
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b) }

// ---------- helpers available to eval'd solutions + prepare/serialize ----------
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
const helpers = { arrayToList, listToArray, makeCyclicList, arrayToTree }

function evalDefinition(code, kind, name) {
  // Evaluate the code string in a fresh function scope with helper classes available,
  // then return the defined function/class by name.
  const factory = new Function(
    'ListNode', 'TreeNode',
    `${code}\nreturn ${name}`
  )
  return factory(ListNode, TreeNode)
}

function runFunctionCases(problem, code, label) {
  const fn = evalDefinition(code, 'function', problem.io.name)
  for (const tc of problem.testCases) {
    const args = problem.io.prepare ? problem.io.prepare(tc.args, helpers) : tc.args
    let result = fn(...args)
    if (problem.io.serialize) result = problem.io.serialize(result, helpers)
    if (eq(result, tc.expected)) pass++
    else { fail++; console.log(`FAIL [${problem.id}/${label}] args=${JSON.stringify(tc.args)}\n  expected: ${JSON.stringify(tc.expected)}\n  actual:   ${JSON.stringify(result)}`) }
  }
}

function runClassCases(problem, code, label) {
  const Cls = evalDefinition(code, 'class', problem.io.name)
  for (const tc of problem.testCases) {
    const instance = new Cls(...(tc.ctorArgs || []))
    for (const op of tc.ops) {
      const result = instance[op.call](...op.args)
      if ('expected' in op) {
        if (eq(result, op.expected)) pass++
        else { fail++; console.log(`FAIL [${problem.id}/${label}] ${op.call}(${JSON.stringify(op.args)})\n  expected: ${JSON.stringify(op.expected)}\n  actual:   ${JSON.stringify(result)}`) }
      }
    }
  }
}

for (const problem of PROBLEMS) {
  const runner = problem.io.kind === 'class' ? runClassCases : runFunctionCases
  runner(problem, problem.optimal.code.javascript, 'optimal')
  if (problem.naive && problem.naive.code && problem.naive.code.javascript) {
    runner(problem, problem.naive.code.javascript, 'naive')
  }
}

console.log(`\n${pass} passed, ${fail} failed (across ${PROBLEMS.length} problems)`)
process.exit(fail ? 1 : 0)
