"""Fact-check harness for every Python optimal + naive reference solution.
Run: python verify/verify.py
Not shipped to the browser (v2 grades Python by pattern-matching, not execution) —
this is a dev-time correctness check before code gets transcribed into data.js.
"""
import heapq

results = {"pass": 0, "fail": 0}

def check(label, actual, expected):
    if actual == expected:
        results["pass"] += 1
    else:
        results["fail"] += 1
        print(f"FAIL {label}\n  expected: {expected}\n  actual:   {actual}")

# ---------- shared helpers ----------
class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def array_to_list(arr):
    head = tail = None
    for v in arr:
        n = ListNode(v)
        if head is None:
            head = tail = n
        else:
            tail.next = n
            tail = n
    return head

def list_to_array(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    q = [root]
    i = 1
    while q and i < len(arr):
        node = q.pop(0)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.left = TreeNode(v)
                q.append(node.left)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.right = TreeNode(v)
                q.append(node.right)
    return root

# =====================================================================
# 1. TWO SUM
# =====================================================================
def two_sum_optimal(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

def two_sum_naive(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

two_sum_cases = [
    (([2, 7, 11, 15], 9), [0, 1]),
    (([3, 2, 4], 6), [1, 2]),
    (([3, 3], 6), [0, 1]),
    (([1, 2, 3, 4, 5], 9), [3, 4]),
]
for args, exp in two_sum_cases:
    check("two_sum_optimal", two_sum_optimal(*args), exp)
    check("two_sum_naive", two_sum_naive(*args), exp)

# =====================================================================
# 2. BINARY SEARCH
# =====================================================================
def binary_search_optimal(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def binary_search_naive(arr, target):
    for i, v in enumerate(arr):
        if v == target:
            return i
    return -1

binary_search_cases = [
    (([1, 3, 5, 7, 9, 11], 7), 3),
    (([1, 3, 5, 7, 9, 11], 1), 0),
    (([1, 3, 5, 7, 9, 11], 11), 5),
    (([1, 3, 5, 7, 9, 11], 4), -1),
    (([], 5), -1),
]
for args, exp in binary_search_cases:
    check("binary_search_optimal", binary_search_optimal(*args), exp)
    check("binary_search_naive", binary_search_naive(*args), exp)

# =====================================================================
# 3. MERGE SORT
# =====================================================================
def merge_sort_optimal(arr):
    if len(arr) <= 1:
        return arr[:]
    mid = len(arr) // 2
    left = merge_sort_optimal(arr[:mid])
    right = merge_sort_optimal(arr[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

def bubble_sort_naive(arr):
    a = arr[:]
    n = len(a)
    for i in range(n):
        for j in range(n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

sort_cases = [
    (([5, 3, 8, 1, 9, 2],), [1, 2, 3, 5, 8, 9]),
    (([],), []),
    (([1],), [1]),
    (([2, 2, 1, 1],), [1, 1, 2, 2]),
    (([5, 4, 3, 2, 1],), [1, 2, 3, 4, 5]),
]
for args, exp in sort_cases:
    check("merge_sort_optimal", merge_sort_optimal(*args), exp)
    check("bubble_sort_naive", bubble_sort_naive(*args), exp)

# =====================================================================
# 4. QUICK SORT
# =====================================================================
def quick_sort_optimal(arr):
    a = arr[:]
    def partition(lo, hi):
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        return i
    def sort(lo, hi):
        if lo < hi:
            p = partition(lo, hi)
            sort(lo, p - 1)
            sort(p + 1, hi)
    sort(0, len(a) - 1)
    return a

def insertion_sort_naive(arr):
    a = arr[:]
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a

for args, exp in sort_cases:
    check("quick_sort_optimal", quick_sort_optimal(*args), exp)
    check("insertion_sort_naive", insertion_sort_naive(*args), exp)

# =====================================================================
# 5. BFS (no naive contrast)
# =====================================================================
def bfs_optimal(graph, start):
    visited = {start}
    queue = [start]
    order = []
    while queue:
        node = queue.pop(0)
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

bfs_graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C", "E"], "E": ["D"]}
check("bfs_optimal", bfs_optimal(bfs_graph, "A"), ["A", "B", "C", "D", "E"])
check("bfs_optimal-cycle", bfs_optimal({"A": ["B"], "B": ["A"]}, "A"), ["A", "B"])

# =====================================================================
# 6. DFS (no naive contrast)
# =====================================================================
def dfs_optimal(graph, start):
    visited = set()
    order = []
    def visit(node):
        if node in visited:
            return
        visited.add(node)
        order.append(node)
        for neighbor in graph.get(node, []):
            visit(neighbor)
    visit(start)
    return order

dfs_graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
check("dfs_optimal", dfs_optimal(dfs_graph, "A"), ["A", "B", "D", "C"])
check("dfs_optimal-cycle", dfs_optimal({"A": ["B"], "B": ["A"]}, "A"), ["A", "B"])

# =====================================================================
# 7. VALID PARENTHESES
# =====================================================================
def valid_parens_optimal(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0

def valid_parens_naive(s):
    string = s
    prev_len = -1
    while len(string) != prev_len:
        prev_len = len(string)
        string = string.replace("()", "").replace("[]", "").replace("{}", "")
    return len(string) == 0

parens_cases = [
    (("()[]{}",), True),
    (("(]",), False),
    (("([)]",), False),
    (("{[]}",), True),
    (("",), True),
    (("(((",), False),
]
for args, exp in parens_cases:
    check("valid_parens_optimal", valid_parens_optimal(*args), exp)
    check("valid_parens_naive", valid_parens_naive(*args), exp)

# =====================================================================
# 8. LRU CACHE (class kind)
# =====================================================================
from collections import OrderedDict

class LRUCacheOptimal:
    def __init__(self, capacity):
        self.capacity = capacity
        self.map = OrderedDict()
    def get(self, key):
        if key not in self.map:
            return -1
        self.map.move_to_end(key)
        return self.map[key]
    def put(self, key, value):
        if key in self.map:
            self.map.move_to_end(key)
        elif len(self.map) >= self.capacity:
            self.map.popitem(last=False)
        self.map[key] = value

class LRUCacheNaive:
    def __init__(self, capacity):
        self.capacity = capacity
        self.arr = []  # [(key, val), ...] most-recent at end
    def get(self, key):
        for i, (k, v) in enumerate(self.arr):
            if k == key:
                self.arr.pop(i)
                self.arr.append((k, v))
                return v
        return -1
    def put(self, key, value):
        for i, (k, _) in enumerate(self.arr):
            if k == key:
                self.arr.pop(i)
                break
        else:
            if len(self.arr) >= self.capacity:
                self.arr.pop(0)
        self.arr.append((key, value))

def run_lru(Impl):
    c = Impl(2)
    results = []
    results.append(c.put(1, 1))
    results.append(c.put(2, 2))
    results.append(c.get(1))
    results.append(c.put(3, 3))
    results.append(c.get(2))
    results.append(c.put(4, 4))
    results.append(c.get(1))
    results.append(c.get(3))
    results.append(c.get(4))
    return results

lru_expected = [None, None, 1, None, -1, None, -1, 3, 4]
check("LRUCacheOptimal", run_lru(LRUCacheOptimal), lru_expected)
check("LRUCacheNaive", run_lru(LRUCacheNaive), lru_expected)

# =====================================================================
# 9. LINKED LIST REVERSAL
# =====================================================================
def reverse_list_optimal(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def reverse_list_naive(head):
    if head is None or head.next is None:
        return head
    rest = reverse_list_naive(head.next)
    head.next.next = head
    head.next = None
    return rest

ll_cases = [([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]), ([1], [1]), ([], [])]
for in_arr, exp in ll_cases:
    check("reverse_list_optimal", list_to_array(reverse_list_optimal(array_to_list(in_arr))), exp)
    check("reverse_list_naive", list_to_array(reverse_list_naive(array_to_list(in_arr))), exp)

# =====================================================================
# 10. FLOYD'S CYCLE DETECTION
# =====================================================================
def has_cycle_optimal(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def has_cycle_naive(head):
    seen = set()
    curr = head
    while curr:
        if id(curr) in seen:
            return True
        seen.add(id(curr))
        curr = curr.next
    return False

def make_cyclic_list(arr, pos):
    if not arr:
        return None
    nodes = [ListNode(v) for v in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if pos >= 0:
        nodes[-1].next = nodes[pos]
    return nodes[0]

cycle_cases = [([3, 2, 0, -4], 1, True), ([1, 2], 0, True), ([1], -1, False), ([1, 2, 3], -1, False)]
for arr, pos, exp in cycle_cases:
    check("has_cycle_optimal", has_cycle_optimal(make_cyclic_list(arr, pos)), exp)
    check("has_cycle_naive", has_cycle_naive(make_cyclic_list(arr, pos)), exp)

# =====================================================================
# 11. KADANE'S ALGORITHM
# =====================================================================
def kadane_optimal(nums):
    best = curr = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        best = max(best, curr)
    return best

def kadane_naive(nums):
    best = float("-inf")
    for i in range(len(nums)):
        s = 0
        for j in range(i, len(nums)):
            s += nums[j]
            best = max(best, s)
    return best

kadane_cases = [
    ([-2, 1, -3, 4, -1, 2, 1, -5, 4], 6),
    ([1], 1),
    ([5, 4, -1, 7, 8], 23),
    ([-1, -2, -3], -1),
]
for args, exp in kadane_cases:
    check("kadane_optimal", kadane_optimal(args), exp)
    check("kadane_naive", kadane_naive(args), exp)

# =====================================================================
# 12. SLIDING WINDOW MAXIMUM
# =====================================================================
from collections import deque as dq

def sliding_window_max_optimal(nums, k):
    dq_ = dq()
    result = []
    for i, n in enumerate(nums):
        while dq_ and dq_[0] <= i - k:
            dq_.popleft()
        while dq_ and nums[dq_[-1]] < n:
            dq_.pop()
        dq_.append(i)
        if i >= k - 1:
            result.append(nums[dq_[0]])
    return result

def sliding_window_max_naive(nums, k):
    result = []
    for i in range(len(nums) - k + 1):
        result.append(max(nums[i:i + k]))
    return result

sw_cases = [
    (([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]),
    (([1], 1), [1]),
    (([9, 8, 7, 6], 2), [9, 8, 7]),
]
for args, exp in sw_cases:
    check("sliding_window_max_optimal", sliding_window_max_optimal(*args), exp)
    check("sliding_window_max_naive", sliding_window_max_naive(*args), exp)

# =====================================================================
# 13. BINARY TREE LEVEL ORDER (no naive contrast)
# =====================================================================
def level_order_optimal(root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        level = []
        nxt = []
        for node in queue:
            level.append(node.val)
            if node.left:
                nxt.append(node.left)
            if node.right:
                nxt.append(node.right)
        result.append(level)
        queue = nxt
    return result

check("level_order_optimal", level_order_optimal(array_to_tree([3, 9, 20, None, None, 15, 7])), [[3], [9, 20], [15, 7]])
check("level_order_optimal-single", level_order_optimal(array_to_tree([1])), [[1]])
check("level_order_optimal-empty", level_order_optimal(array_to_tree([])), [])

# =====================================================================
# 14. DIJKSTRA'S SHORTEST PATH
# =====================================================================
def dijkstra_optimal(graph, start):
    dist = {node: float("inf") for node in graph}
    dist[start] = 0
    visited = set()
    heap = [(0, start)]
    while heap:
        d, node = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        for neighbor, weight in graph.get(node, []):
            nd = d + weight
            if nd < dist[neighbor]:
                dist[neighbor] = nd
                heapq.heappush(heap, (nd, neighbor))
    return dist

def dijkstra_naive(graph, start):
    dist = {node: float("inf") for node in graph}
    dist[start] = 0
    visited = set()
    nodes = list(graph.keys())
    while len(visited) < len(nodes):
        u, best = None, float("inf")
        for node in nodes:
            if node not in visited and dist[node] < best:
                best = dist[node]; u = node
        if u is None:
            break
        visited.add(u)
        for neighbor, weight in graph.get(u, []):
            nd = dist[u] + weight
            if nd < dist[neighbor]:
                dist[neighbor] = nd
    return dist

dijkstra_graph = {"A": [("B", 4), ("C", 1)], "B": [("D", 1)], "C": [("B", 1), ("D", 5)], "D": []}
dijkstra_expected = {"A": 0, "B": 2, "C": 1, "D": 3}
check("dijkstra_optimal", dijkstra_optimal(dijkstra_graph, "A"), dijkstra_expected)
check("dijkstra_naive", dijkstra_naive(dijkstra_graph, "A"), dijkstra_expected)

# =====================================================================
# 15. UNION-FIND (class kind, tested via connected())
# =====================================================================
class UnionFindOptimal:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.rank[ra] < self.rank[rb]:
            self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]:
            self.parent[rb] = ra
        else:
            self.parent[rb] = ra
            self.rank[ra] += 1
    def connected(self, a, b):
        return self.find(a) == self.find(b)

class UnionFindNaive:
    def __init__(self, n):
        self.parent = list(range(n))
    def find(self, x):
        while self.parent[x] != x:
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[ra] = rb
    def connected(self, a, b):
        return self.find(a) == self.find(b)

def run_union_find(Impl):
    uf = Impl(6)
    uf.union(0, 1); uf.union(1, 2); uf.union(3, 4)
    return [uf.connected(0, 2), uf.connected(0, 3), uf.connected(3, 4), uf.connected(4, 5)]

check("UnionFindOptimal", run_union_find(UnionFindOptimal), [True, False, True, False])
check("UnionFindNaive", run_union_find(UnionFindNaive), [True, False, True, False])

# =====================================================================
# 16. TRIE (class kind)
# =====================================================================
class TrieOptimal:
    def __init__(self):
        self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True
    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return node.get("$", False)
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node:
                return False
            node = node[ch]
        return True

class TrieNaive:
    def __init__(self):
        self.words = []
    def insert(self, word):
        self.words.append(word)
    def search(self, word):
        return word in self.words
    def starts_with(self, prefix):
        return any(w.startswith(prefix) for w in self.words)

def run_trie(Impl):
    t = Impl()
    t.insert("apple")
    out = [t.search("apple"), t.search("app"), t.starts_with("app")]
    t.insert("app")
    out.append(t.search("app"))
    return out

check("TrieOptimal", run_trie(TrieOptimal), [True, False, True, True])
check("TrieNaive", run_trie(TrieNaive), [True, False, True, True])

# =====================================================================
# 17. HEAPSORT
# =====================================================================
def heap_sort_optimal(arr):
    a = arr[:]
    n = len(a)
    def heapify(size, i):
        largest = i
        l, r = 2 * i + 1, 2 * i + 2
        if l < size and a[l] > a[largest]:
            largest = l
        if r < size and a[r] > a[largest]:
            largest = r
        if largest != i:
            a[i], a[largest] = a[largest], a[i]
            heapify(size, largest)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    for i in range(n - 1, 0, -1):
        a[0], a[i] = a[i], a[0]
        heapify(i, 0)
    return a

def selection_sort_naive(arr):
    a = arr[:]
    for i in range(len(a)):
        min_idx = i
        for j in range(i + 1, len(a)):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a

for args, exp in sort_cases:
    check("heap_sort_optimal", heap_sort_optimal(*args), exp)
    check("selection_sort_naive", selection_sort_naive(*args), exp)

# =====================================================================
# 18. INSERTION SORT
# =====================================================================
def insertion_sort_optimal(arr):
    a = arr[:]
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a

def bubble_sort_naive2(arr):
    a = arr[:]
    n = len(a)
    for i in range(n):
        for j in range(n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

for args, exp in sort_cases:
    check("insertion_sort_optimal", insertion_sort_optimal(*args), exp)
    check("bubble_sort_naive2", bubble_sort_naive2(*args), exp)

# =====================================================================
# 19. COUNTING SORT
# =====================================================================
def counting_sort_optimal(arr):
    if not arr:
        return []
    m = max(arr)
    counts = [0] * (m + 1)
    for n in arr:
        counts[n] += 1
    result = []
    for v in range(m + 1):
        result.extend([v] * counts[v])
    return result

counting_sort_cases = [
    (([4, 2, 2, 8, 3, 3, 1],), [1, 2, 2, 3, 3, 4, 8]),
    (([],), []),
    (([1],), [1]),
    (([5, 5, 5],), [5, 5, 5]),
    (([0, 0, 3, 1, 2],), [0, 0, 1, 2, 3]),
]
for args, exp in counting_sort_cases:
    check("counting_sort_optimal", counting_sort_optimal(*args), exp)

# =====================================================================
# 20. RADIX SORT
# =====================================================================
def radix_sort_optimal(arr):
    if not arr:
        return []
    result = arr[:]
    m = max(result)
    exp = 1
    while m // exp > 0:
        counts = [0] * 10
        for n in result:
            counts[(n // exp) % 10] += 1
        for i in range(1, 10):
            counts[i] += counts[i - 1]
        output = [0] * len(result)
        for i in range(len(result) - 1, -1, -1):
            digit = (result[i] // exp) % 10
            counts[digit] -= 1
            output[counts[digit]] = result[i]
        result = output
        exp *= 10
    return result

radix_sort_cases = [
    (([170, 45, 75, 90, 802, 24, 2, 66],), [2, 24, 45, 66, 75, 90, 170, 802]),
    (([],), []),
    (([5],), [5]),
    (([100, 10, 1],), [1, 10, 100]),
    (([0, 0, 0],), [0, 0, 0]),
]
for args, exp in radix_sort_cases:
    check("radix_sort_optimal", radix_sort_optimal(*args), exp)

# =====================================================================
# 21. BUCKET SORT
# =====================================================================
def bucket_sort_optimal(arr):
    n = len(arr)
    if n == 0:
        return []
    buckets = [[] for _ in range(n)]
    for v in arr:
        idx = int(v * n)
        if idx >= n:
            idx = n - 1
        buckets[idx].append(v)
    for bucket in buckets:
        for i in range(1, len(bucket)):
            key = bucket[i]
            j = i - 1
            while j >= 0 and bucket[j] > key:
                bucket[j + 1] = bucket[j]
                j -= 1
            bucket[j + 1] = key
    result = []
    for bucket in buckets:
        result.extend(bucket)
    return result

bucket_sort_cases = [
    (([0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68],), [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]),
    (([],), []),
    (([0.5],), [0.5]),
    (([0.9, 0.9, 0.1],), [0.1, 0.9, 0.9]),
    (([0.1, 0.2, 0.3],), [0.1, 0.2, 0.3]),
]
for args, exp in bucket_sort_cases:
    check("bucket_sort_optimal", bucket_sort_optimal(*args), exp)

print(f"\n{results['pass']} passed, {results['fail']} failed")
import sys
sys.exit(1 if results["fail"] else 0)
