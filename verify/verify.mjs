// Fact-check harness for every JS optimal + naive reference solution.
// Run: node verify/verify.mjs
// Not shipped to the browser — dev-time only. Solutions here get transcribed into data.js once green.

let pass = 0, fail = 0
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b) }
function check(label, actual, expected) {
  if (eq(actual, expected)) { pass++ }
  else { fail++; console.log(`FAIL ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`) }
}

// ---------- shared helpers (also baked into worker.js for user code) ----------
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

// =====================================================================
// 1. TWO SUM
// =====================================================================
function twoSumOptimal(nums, target) {
  const seen = new Map()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (seen.has(complement)) return [seen.get(complement), i]
    seen.set(nums[i], i)
  }
  return []
}
function twoSumNaive(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j]
    }
  }
  return []
}
const twoSumCases = [
  [[[2, 7, 11, 15], 9], [0, 1]],
  [[[3, 2, 4], 6], [1, 2]],
  [[[3, 3], 6], [0, 1]],
  [[[1, 2, 3, 4, 5], 9], [3, 4]],
]
for (const [args, exp] of twoSumCases) {
  check('twoSumOptimal', twoSumOptimal(...args), exp)
  check('twoSumNaive', twoSumNaive(...args), exp)
}

// =====================================================================
// 2. BINARY SEARCH
// =====================================================================
function binarySearchOptimal(arr, target) {
  let left = 0, right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] === target) return mid
    else if (arr[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}
function binarySearchNaive(arr, target) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i
  return -1
}
const binarySearchCases = [
  [[[1, 3, 5, 7, 9, 11], 7], 3],
  [[[1, 3, 5, 7, 9, 11], 1], 0],
  [[[1, 3, 5, 7, 9, 11], 11], 5],
  [[[1, 3, 5, 7, 9, 11], 4], -1],
  [[[], 5], -1],
]
for (const [args, exp] of binarySearchCases) {
  check('binarySearchOptimal', binarySearchOptimal(...args), exp)
  check('binarySearchNaive', binarySearchNaive(...args), exp)
}

// =====================================================================
// 3. MERGE SORT
// =====================================================================
function mergeSortOptimal(arr) {
  if (arr.length <= 1) return arr.slice()
  const mid = Math.floor(arr.length / 2)
  const left = mergeSortOptimal(arr.slice(0, mid))
  const right = mergeSortOptimal(arr.slice(mid))
  const merged = []
  let i = 0, j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++])
    else merged.push(right[j++])
  }
  while (i < left.length) merged.push(left[i++])
  while (j < right.length) merged.push(right[j++])
  return merged
}
function bubbleSortNaive(arr) {
  const a = arr.slice()
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]] }
    }
  }
  return a
}
const sortCases = [
  [[[5, 3, 8, 1, 9, 2]], [1, 2, 3, 5, 8, 9]],
  [[[]], []],
  [[[1]], [1]],
  [[[2, 2, 1, 1]], [1, 1, 2, 2]],
  [[[5, 4, 3, 2, 1]], [1, 2, 3, 4, 5]],
]
for (const [args, exp] of sortCases) {
  check('mergeSortOptimal', mergeSortOptimal(...args), exp)
  check('bubbleSortNaive', bubbleSortNaive(...args), exp)
}

// =====================================================================
// 4. QUICK SORT
// =====================================================================
function quickSortOptimal(arr) {
  const a = arr.slice()
  function partition(lo, hi) {
    const pivot = a[hi]
    let i = lo
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++ }
    }
    [a[i], a[hi]] = [a[hi], a[i]]
    return i
  }
  function sort(lo, hi) {
    if (lo < hi) {
      const p = partition(lo, hi)
      sort(lo, p - 1)
      sort(p + 1, hi)
    }
  }
  sort(0, a.length - 1)
  return a
}
function insertionSortNaive(arr) {
  const a = arr.slice()
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j-- }
    a[j + 1] = key
  }
  return a
}
for (const [args, exp] of sortCases) {
  check('quickSortOptimal', quickSortOptimal(...args), exp)
  check('insertionSortNaive', insertionSortNaive(...args), exp)
}

// =====================================================================
// 5. BFS (no naive contrast — visited-set correctness lesson instead)
// =====================================================================
function bfsOptimal(graph, start) {
  const visited = new Set([start])
  const queue = [start]
  const order = []
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor) }
    }
  }
  return order
}
const bfsGraph = { A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'D'], D: ['B', 'C', 'E'], E: ['D'] }
check('bfsOptimal', bfsOptimal(bfsGraph, 'A'), ['A', 'B', 'C', 'D', 'E'])
check('bfsOptimal-cycle', bfsOptimal({ A: ['B'], B: ['A'] }, 'A'), ['A', 'B'])

// =====================================================================
// 6. DFS (no naive contrast)
// =====================================================================
function dfsOptimal(graph, start) {
  const visited = new Set()
  const order = []
  function visit(node) {
    if (visited.has(node)) return
    visited.add(node)
    order.push(node)
    for (const neighbor of (graph[node] || [])) visit(neighbor)
  }
  visit(start)
  return order
}
const dfsGraph = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] }
check('dfsOptimal', dfsOptimal(dfsGraph, 'A'), ['A', 'B', 'D', 'C'])
check('dfsOptimal-cycle', dfsOptimal({ A: ['B'], B: ['A'] }, 'A'), ['A', 'B'])

// =====================================================================
// 7. VALID PARENTHESES
// =====================================================================
function validParensOptimal(s) {
  const stack = []
  const pairs = { ')': '(', ']': '[', '}': '{' }
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false
    }
  }
  return stack.length === 0
}
function validParensNaive(s) {
  let str = s
  let prevLen
  do {
    prevLen = str.length
    str = str.replace('()', '').replace('[]', '').replace('{}', '')
  } while (str.length !== prevLen)
  return str.length === 0
}
const parensCases = [
  [['()[]{}'], true],
  [['(]'], false],
  [['([)]'], false],
  [['{[]}'], true],
  [[''], true],
  [['((('], false],
]
for (const [args, exp] of parensCases) {
  check('validParensOptimal', validParensOptimal(...args), exp)
  check('validParensNaive', validParensNaive(...args), exp)
}

// =====================================================================
// 8. LRU CACHE (class kind)
// =====================================================================
class LRUCacheOptimal {
  constructor(capacity) { this.capacity = capacity; this.map = new Map() }
  get(key) {
    if (!this.map.has(key)) return -1
    const val = this.map.get(key)
    this.map.delete(key); this.map.set(key, val)
    return val
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key)
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value)
    this.map.set(key, value)
  }
}
class LRUCacheNaive {
  constructor(capacity) { this.capacity = capacity; this.arr = [] } // [[key,val], ...] most-recent at end
  get(key) {
    const i = this.arr.findIndex(([k]) => k === key)
    if (i === -1) return -1
    const [, val] = this.arr[i]
    this.arr.splice(i, 1); this.arr.push([key, val])
    return val
  }
  put(key, value) {
    const i = this.arr.findIndex(([k]) => k === key)
    if (i !== -1) this.arr.splice(i, 1)
    else if (this.arr.length >= this.capacity) this.arr.shift()
    this.arr.push([key, value])
  }
}
function runLRU(Impl) {
  const c = new Impl(2)
  const results = []
  results.push(c.put(1, 1))
  results.push(c.put(2, 2))
  results.push(c.get(1))       // 1
  results.push(c.put(3, 3))    // evicts key 2
  results.push(c.get(2))       // -1
  results.push(c.put(4, 4))    // evicts key 1
  results.push(c.get(1))       // -1
  results.push(c.get(3))       // 3
  results.push(c.get(4))       // 4
  return results
}
const lruExpected = [undefined, undefined, 1, undefined, -1, undefined, -1, 3, 4]
check('LRUCacheOptimal', runLRU(LRUCacheOptimal), lruExpected)
check('LRUCacheNaive', runLRU(LRUCacheNaive), lruExpected)

// =====================================================================
// 9. LINKED LIST REVERSAL
// =====================================================================
function reverseListOptimal(head) {
  let prev = null, curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
function reverseListNaive(head) {
  if (!head || !head.next) return head
  const rest = reverseListNaive(head.next)
  head.next.next = head
  head.next = null
  return rest
}
const llCases = [[[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]], [[1], [1]], [[], []]]
for (const [inArr, exp] of llCases) {
  check('reverseListOptimal', listToArray(reverseListOptimal(arrayToList(inArr))), exp)
  check('reverseListNaive', listToArray(reverseListNaive(arrayToList(inArr))), exp)
}

// =====================================================================
// 10. FLOYD'S CYCLE DETECTION
// =====================================================================
function hasCycleOptimal(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
function hasCycleNaive(head) {
  const seen = new Set()
  let curr = head
  while (curr) {
    if (seen.has(curr)) return true
    seen.add(curr)
    curr = curr.next
  }
  return false
}
function makeCyclicList(arr, pos) {
  if (!arr.length) return null
  const nodes = arr.map(v => new ListNode(v))
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1]
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos]
  return nodes[0]
}
const cycleCases = [[[3, 2, 0, -4], 1, true], [[1, 2], 0, true], [[1], -1, false], [[1, 2, 3], -1, false]]
for (const [arr, pos, exp] of cycleCases) {
  check('hasCycleOptimal', hasCycleOptimal(makeCyclicList(arr, pos)), exp)
  check('hasCycleNaive', hasCycleNaive(makeCyclicList(arr, pos)), exp)
}

// =====================================================================
// 11. KADANE'S ALGORITHM
// =====================================================================
function kadaneOptimal(nums) {
  let best = nums[0], curr = nums[0]
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i])
    best = Math.max(best, curr)
  }
  return best
}
function kadaneNaive(nums) {
  let best = -Infinity
  for (let i = 0; i < nums.length; i++) {
    let sum = 0
    for (let j = i; j < nums.length; j++) {
      sum += nums[j]
      best = Math.max(best, sum)
    }
  }
  return best
}
const kadaneCases = [
  [[-2, 1, -3, 4, -1, 2, 1, -5, 4], 6],
  [[1], 1],
  [[5, 4, -1, 7, 8], 23],
  [[-1, -2, -3], -1],
]
for (const [args, exp] of kadaneCases) {
  check('kadaneOptimal', kadaneOptimal(args), exp)
  check('kadaneNaive', kadaneNaive(args), exp)
}

// =====================================================================
// 12. SLIDING WINDOW MAXIMUM
// =====================================================================
function slidingWindowMaxOptimal(nums, k) {
  const deque = [] // indices, values decreasing
  const result = []
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift()
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop()
    deque.push(i)
    if (i >= k - 1) result.push(nums[deque[0]])
  }
  return result
}
function slidingWindowMaxNaive(nums, k) {
  const result = []
  for (let i = 0; i <= nums.length - k; i++) {
    let max = -Infinity
    for (let j = i; j < i + k; j++) max = Math.max(max, nums[j])
    result.push(max)
  }
  return result
}
const swCases = [
  [[[1, 3, -1, -3, 5, 3, 6, 7], 3], [3, 3, 5, 5, 6, 7]],
  [[[1], 1], [1]],
  [[[9, 8, 7, 6], 2], [9, 8, 7]],
]
for (const [args, exp] of swCases) {
  check('slidingWindowMaxOptimal', slidingWindowMaxOptimal(...args), exp)
  check('slidingWindowMaxNaive', slidingWindowMaxNaive(...args), exp)
}

// =====================================================================
// 13. BINARY TREE LEVEL ORDER (no naive contrast)
// =====================================================================
function levelOrderOptimal(root) {
  if (!root) return []
  const result = []
  let queue = [root]
  while (queue.length) {
    const level = []
    const next = []
    for (const node of queue) {
      level.push(node.val)
      if (node.left) next.push(node.left)
      if (node.right) next.push(node.right)
    }
    result.push(level)
    queue = next
  }
  return result
}
check('levelOrderOptimal', levelOrderOptimal(arrayToTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]])
check('levelOrderOptimal-single', levelOrderOptimal(arrayToTree([1])), [[1]])
check('levelOrderOptimal-empty', levelOrderOptimal(arrayToTree([])), [])

// =====================================================================
// 14. DIJKSTRA'S SHORTEST PATH
// =====================================================================
// graph: { node: [[neighbor, weight], ...] }
function dijkstraOptimal(graph, start) {
  const dist = {}
  for (const node of Object.keys(graph)) dist[node] = Infinity
  dist[start] = 0
  const visited = new Set()
  // simple binary min-heap via array (kept small/simple for a reference solution)
  const heap = [[0, start]]
  function heapPush(item) {
    heap.push(item)
    let i = heap.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (heap[parent][0] <= heap[i][0]) break
      ;[heap[parent], heap[i]] = [heap[i], heap[parent]]
      i = parent
    }
  }
  function heapPop() {
    const top = heap[0]
    const last = heap.pop()
    if (heap.length) {
      heap[0] = last
      let i = 0
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2
        let smallest = i
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r
        if (smallest === i) break
        ;[heap[i], heap[smallest]] = [heap[smallest], heap[i]]
        i = smallest
      }
    }
    return top
  }
  while (heap.length) {
    const [d, node] = heapPop()
    if (visited.has(node)) continue
    visited.add(node)
    for (const [neighbor, weight] of (graph[node] || [])) {
      const nd = d + weight
      if (nd < dist[neighbor]) { dist[neighbor] = nd; heapPush([nd, neighbor]) }
    }
  }
  return dist
}
function dijkstraNaive(graph, start) {
  const dist = {}
  for (const node of Object.keys(graph)) dist[node] = Infinity
  dist[start] = 0
  const visited = new Set()
  const nodes = Object.keys(graph)
  while (visited.size < nodes.length) {
    let u = null, best = Infinity
    for (const node of nodes) {
      if (!visited.has(node) && dist[node] < best) { best = dist[node]; u = node }
    }
    if (u === null) break
    visited.add(u)
    for (const [neighbor, weight] of (graph[u] || [])) {
      const nd = dist[u] + weight
      if (nd < dist[neighbor]) dist[neighbor] = nd
    }
  }
  return dist
}
const dijkstraGraph = { A: [['B', 4], ['C', 1]], B: [['D', 1]], C: [['B', 1], ['D', 5]], D: [] }
const dijkstraExpected = { A: 0, B: 2, C: 1, D: 3 }
check('dijkstraOptimal', dijkstraOptimal(dijkstraGraph, 'A'), dijkstraExpected)
check('dijkstraNaive', dijkstraNaive(dijkstraGraph, 'A'), dijkstraExpected)

// =====================================================================
// 15. UNION-FIND (class kind, tested via connected() to stay implementation-independent)
// =====================================================================
class UnionFindOptimal {
  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i); this.rank = new Array(n).fill(0) }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x])
    return this.parent[x]
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b)
    if (ra === rb) return
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra
    else { this.parent[rb] = ra; this.rank[ra]++ }
  }
  connected(a, b) { return this.find(a) === this.find(b) }
}
class UnionFindNaive {
  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i) } // no rank, no path compression
  find(x) { while (this.parent[x] !== x) x = this.parent[x]; return x }
  union(a, b) { const ra = this.find(a), rb = this.find(b); if (ra !== rb) this.parent[ra] = rb }
  connected(a, b) { return this.find(a) === this.find(b) }
}
function runUnionFind(Impl) {
  const uf = new Impl(6)
  uf.union(0, 1); uf.union(1, 2); uf.union(3, 4)
  return [uf.connected(0, 2), uf.connected(0, 3), uf.connected(3, 4), uf.connected(4, 5)]
}
check('UnionFindOptimal', runUnionFind(UnionFindOptimal), [true, false, true, false])
check('UnionFindNaive', runUnionFind(UnionFindNaive), [true, false, true, false])

// =====================================================================
// 16. TRIE (class kind)
// =====================================================================
class TrieOptimal {
  constructor() { this.root = {} }
  insert(word) {
    let node = this.root
    for (const ch of word) { if (!(ch in node)) node[ch] = {}; node = node[ch] }
    node.isEnd = true
  }
  search(word) {
    let node = this.root
    for (const ch of word) { if (!(ch in node)) return false; node = node[ch] }
    return !!node.isEnd
  }
  startsWith(prefix) {
    let node = this.root
    for (const ch of prefix) { if (!(ch in node)) return false; node = node[ch] }
    return true
  }
}
class TrieNaive {
  constructor() { this.words = [] }
  insert(word) { this.words.push(word) }
  search(word) { return this.words.includes(word) }
  startsWith(prefix) { return this.words.some(w => w.startsWith(prefix)) }
}
function runTrie(Impl) {
  const t = new Impl()
  t.insert('apple')
  return [t.search('apple'), t.search('app'), t.startsWith('app'), (t.insert('app'), t.search('app'))]
}
check('TrieOptimal', runTrie(TrieOptimal), [true, false, true, true])
check('TrieNaive', runTrie(TrieNaive), [true, false, true, true])

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
