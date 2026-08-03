/*
 * CodeCloze v2 — problem content.
 * Every optimal + naive reference solution below was independently compiled/run
 * (node, python, javac+java, gcc, g++) via verify/ before being transcribed here —
 * see verify/verify.mjs, verify.py, Verify.java, verify.c, verify.cpp.
 *
 * Schema per problem:
 *   io.kind: 'function' | 'class'
 *   io.name: function/class name the user's code must define
 *   io.prepare(args, helpers): optional — transforms raw JSON test-case args into
 *     real objects (linked lists / trees) before calling the user's function
 *   io.serialize(result, helpers): optional — transforms the user's return value
 *     back into a plain JSON-comparable value
 *   testCases: for 'function' kind, [{ args, expected }]
 *              for 'class' kind, [{ ctorArgs, ops: [{ call, args, expected? }] }]
 *              (ops without `expected` are executed but not checked — e.g. put/insert)
 *   languages.<lang>.starter: skeleton shown in the editor
 *   languages.<lang>.requiredOptimal / requiredNaive: regexes ALL of which must
 *     match the (comment-stripped, lowercased) submission for python/java/c/cpp —
 *     JavaScript is graded by real execution instead, see engine.js
 */

const PROBLEMS = [
  // ===================================================================
  // 1. TWO SUM
  // ===================================================================
  {
    id: 'two-sum',
    name: 'Two Sum',
    category: 'algorithms',
    difficulty: 'easy',
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Assume exactly one valid answer exists, and you may not use the same element twice.',
    constraints: ['2 <= nums.length <= 10^4', 'Exactly one valid pair exists'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', note: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    io: { kind: 'function', name: 'twoSum' },
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 2, 3, 4, 5], 9], expected: [3, 4] },
    ],
    languages: {
      javascript: {
        starter: 'function twoSum(nums, target) {\n  \n}',
        requiredOptimal: [], requiredNaive: [],
      },
      python: {
        starter: 'def two_sum(nums, target):\n    pass',
        requiredOptimal: [/\{\}|dict\(/, /in\s+\w+/, /return/],
        requiredNaive: [/for .+ in range\(len\(/, /for .+ in range\(\w+\s*\+\s*1/],
      },
      java: {
        starter: 'static int[] twoSum(int[] nums, int target) {\n    \n}',
        requiredOptimal: [/hashmap|map<\s*integer/i, /containskey/i, /put\(/],
      },
      c: {
        starter: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}',
        requiredOptimal: [/for\s*\(/, /return/],
      },
      cpp: {
        starter: 'vector<int> twoSum(vector<int>& nums, int target) {\n    \n}',
        requiredOptimal: [/unordered_map|map\s*</, /find\(|count\(/, /return/],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(n)',
      explanation: 'Walk the array once, keeping a hash map of value -> index seen so far. For each number, check whether its complement (target - number) is already in the map — if so, you have your pair in one pass.',
      code: {
        javascript: `function twoSum(nums, target) {\n  const seen = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i]\n    if (seen.has(complement)) return [seen.get(complement), i]\n    seen.set(nums[i], i)\n  }\n  return []\n}`,
        python: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []`,
        java: `static int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};\n        seen.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
        c: `// hash map via a fixed-size open-addressed table (C has no generic map in its stdlib)\n#define TS_TABLE_SIZE 1024\ntypedef struct { int key; int value; int used; } TSEntry;\nvoid twoSum(const int* nums, int n, int target, int* out) {\n    TSEntry table[TS_TABLE_SIZE] = {0};\n    for (int i = 0; i < n; i++) {\n        int complement = target - nums[i];\n        int h = ((unsigned int)complement) % TS_TABLE_SIZE;\n        while (table[h].used) {\n            if (table[h].key == complement) { out[0] = table[h].value; out[1] = i; return; }\n            h = (h + 1) % TS_TABLE_SIZE;\n        }\n        h = ((unsigned int)nums[i]) % TS_TABLE_SIZE;\n        while (table[h].used) h = (h + 1) % TS_TABLE_SIZE;\n        table[h] = (TSEntry){ nums[i], i, 1 };\n    }\n}`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int complement = target - nums[i];\n        auto it = seen.find(complement);\n        if (it != seen.end()) return {it->second, i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
      },
    },
    naive: {
      time: 'O(n^2)', space: 'O(1)',
      code: {
        javascript: `function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j]\n    }\n  }\n  return []\n}`,
        python: `def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`,
      },
    },
    useCases: [
      'Reconciling transactions/records that must sum to a target value in finance and accounting software',
      'Any "find a pair matching a constraint" lookup — the hash-map-while-scanning pattern generalizes to three-sum, subarray-sum, and pair-difference problems',
    ],
    hints: [
      'What if, for every number, you already knew whether its "partner" (target - number) had appeared earlier?',
      'A hash map storing value -> index lets you check for the complement in O(1) instead of scanning the rest of the array.',
    ],
    commonMistakes: [
      'Using two nested loops (checks every pair — works, but is O(n^2) and won\u2019t scale)',
      'Inserting into the hash map before checking for the complement, which can incorrectly match a number with itself',
    ],
  },

  // ===================================================================
  // 2. BINARY SEARCH
  // ===================================================================
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'algorithms',
    difficulty: 'easy',
    description: 'Given a sorted array of distinct integers `arr` and a `target`, return the index of `target`, or -1 if it isn\u2019t present.',
    constraints: ['arr is sorted ascending with no duplicates', '0 <= arr.length <= 10^4'],
    examples: [
      { input: 'arr = [1,3,5,7,9,11], target = 7', output: '3' },
      { input: 'arr = [1,3,5,7,9,11], target = 4', output: '-1' },
    ],
    io: { kind: 'function', name: 'binarySearch' },
    testCases: [
      { args: [[1, 3, 5, 7, 9, 11], 7], expected: 3 },
      { args: [[1, 3, 5, 7, 9, 11], 1], expected: 0 },
      { args: [[1, 3, 5, 7, 9, 11], 11], expected: 5 },
      { args: [[1, 3, 5, 7, 9, 11], 4], expected: -1 },
      { args: [[], 5], expected: -1 },
    ],
    languages: {
      javascript: { starter: 'function binarySearch(arr, target) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def binary_search(arr, target):\n    pass',
        requiredOptimal: [/left|lo\b/, /right|hi\b/, /\/\/\s*2|>>\s*1/],
        requiredNaive: [/for .+ in enumerate|for .+ in range\(len/],
      },
      java: {
        starter: 'static int binarySearch(int[] arr, int target) {\n    \n}',
        requiredOptimal: [/left|lo\b/, /right|hi\b/, /\/\s*2|>>\s*1/],
      },
      c: {
        starter: 'int binarySearch(int* arr, int n, int target) {\n    \n}',
        requiredOptimal: [/left|lo\b/, /right|hi\b/, /\/\s*2|>>\s*1/],
      },
      cpp: {
        starter: 'int binarySearch(vector<int>& arr, int target) {\n    \n}',
        requiredOptimal: [/left|lo\b/, /right|hi\b/, /\/\s*2|>>\s*1/],
      },
    },
    optimal: {
      time: 'O(log n)', space: 'O(1)',
      explanation: 'Keep a shrinking [left, right] window. Compare the middle element to the target and discard the half that can\u2019t contain it — each step halves the search space.',
      code: {
        javascript: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2)\n    if (arr[mid] === target) return mid\n    else if (arr[mid] < target) left = mid + 1\n    else right = mid - 1\n  }\n  return -1\n}`,
        python: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
        java: `static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
        c: `int binarySearch(int* arr, int n, int target) {\n    int left = 0, right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
        cpp: `int binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = (int)arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
      },
    },
    naive: {
      time: 'O(n)', space: 'O(1)',
      code: {
        javascript: `function binarySearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i\n  return -1\n}`,
        python: `def binary_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target:\n            return i\n    return -1`,
      },
    },
    useCases: [
      'Database index lookups and B-tree/B+-tree node search',
      'Autocomplete/dictionary lookups, version-control bisect (git bisect uses this exact idea to find the commit that introduced a bug)',
    ],
    hints: [
      'The array is sorted — you don\u2019t need to look at every element.',
      'Compare the middle element to the target, then throw away the half of the array that can\u2019t contain it.',
    ],
    commonMistakes: [
      'Scanning left to right (correct, but O(n) — ignores that the array is sorted)',
      'Off-by-one errors in the loop condition (`left <= right` vs `left < right`) or forgetting to update `left`/`right` after checking mid',
    ],
  },

  // ===================================================================
  // 3. MERGE SORT
  // ===================================================================
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'algorithms',
    difficulty: 'medium',
    description: 'Sort an array of integers in ascending order and return the sorted array.',
    constraints: ['0 <= arr.length <= 10^4'],
    examples: [{ input: 'arr = [5,3,8,1,9,2]', output: '[1,2,3,5,8,9]' }],
    io: { kind: 'function', name: 'mergeSort' },
    testCases: [
      { args: [[5, 3, 8, 1, 9, 2]], expected: [1, 2, 3, 5, 8, 9] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[2, 2, 1, 1]], expected: [1, 1, 2, 2] },
      { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    ],
    languages: {
      javascript: { starter: 'function mergeSort(arr) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def merge_sort(arr):\n    pass',
        requiredOptimal: [/def\s+\w*merge/, /len\(arr\)\s*\/\/\s*2|len\(arr\)\s*\/\s*2/],
        requiredNaive: [/for .+ in range\(len\(.+\)\)/, /for .+ in range\(len\(.+\)\s*-\s*1/],
      },
      java: {
        starter: 'static int[] mergeSort(int[] arr) {\n    \n}',
        requiredOptimal: [/mergesort/i, /\/\s*2/],
      },
      c: {
        starter: 'void mergeSort(int* arr, int n) {\n    \n}',
        requiredOptimal: [/mergesort/i, /malloc|buf/],
      },
      cpp: {
        starter: 'vector<int> mergeSort(vector<int> arr) {\n    \n}',
        requiredOptimal: [/mergesort/i, /\/\s*2/],
      },
    },
    optimal: {
      time: 'O(n log n)', space: 'O(n)',
      explanation: 'Recursively split the array in half until each piece has one element, then merge sorted halves back together in linear time. The log n levels of splitting times the O(n) merge work at each level gives O(n log n) — this is the best possible worst-case for a comparison sort.',
      code: {
        javascript: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr.slice()\n  const mid = Math.floor(arr.length / 2)\n  const left = mergeSort(arr.slice(0, mid))\n  const right = mergeSort(arr.slice(mid))\n  const merged = []\n  let i = 0, j = 0\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) merged.push(left[i++])\n    else merged.push(right[j++])\n  }\n  while (i < left.length) merged.push(left[i++])\n  while (j < right.length) merged.push(right[j++])\n  return merged\n}`,
        python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr[:]\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    merged = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            merged.append(left[i]); i += 1\n        else:\n            merged.append(right[j]); j += 1\n    merged.extend(left[i:])\n    merged.extend(right[j:])\n    return merged`,
        java: `static int[] mergeSort(int[] arr) {\n    if (arr.length <= 1) return arr.clone();\n    int mid = arr.length / 2;\n    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));\n    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));\n    int[] merged = new int[arr.length];\n    int i = 0, j = 0, k = 0;\n    while (i < left.length && j < right.length) merged[k++] = left[i] <= right[j] ? left[i++] : right[j++];\n    while (i < left.length) merged[k++] = left[i++];\n    while (j < right.length) merged[k++] = right[j++];\n    return merged;\n}`,
        c: `void mergeSortHelper(int* arr, int lo, int hi, int* buf) {\n    if (hi - lo <= 1) return;\n    int mid = (lo + hi) / 2;\n    mergeSortHelper(arr, lo, mid, buf);\n    mergeSortHelper(arr, mid, hi, buf);\n    int i = lo, j = mid, k = lo;\n    while (i < mid && j < hi) buf[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];\n    while (i < mid) buf[k++] = arr[i++];\n    while (j < hi) buf[k++] = arr[j++];\n    for (int x = lo; x < hi; x++) arr[x] = buf[x];\n}\nvoid mergeSort(int* arr, int n) {\n    int* buf = malloc(sizeof(int) * n);\n    mergeSortHelper(arr, 0, n, buf);\n    free(buf);\n}`,
        cpp: `vector<int> mergeSort(vector<int> arr) {\n    if (arr.size() <= 1) return arr;\n    int mid = arr.size() / 2;\n    vector<int> left(arr.begin(), arr.begin() + mid), right(arr.begin() + mid, arr.end());\n    left = mergeSort(left);\n    right = mergeSort(right);\n    vector<int> merged;\n    size_t i = 0, j = 0;\n    while (i < left.size() && j < right.size()) merged.push_back(left[i] <= right[j] ? left[i++] : right[j++]);\n    while (i < left.size()) merged.push_back(left[i++]);\n    while (j < right.size()) merged.push_back(right[j++]);\n    return merged;\n}`,
      },
    },
    naive: {
      time: 'O(n^2)', space: 'O(1)',
      code: {
        javascript: `function mergeSort(arr) {\n  const a = arr.slice()\n  for (let i = 0; i < a.length; i++) {\n    for (let j = 0; j < a.length - i - 1; j++) {\n      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]] }\n    }\n  }\n  return a\n}`,
        python: `def merge_sort(arr):\n    a = arr[:]\n    n = len(a)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n    return a`,
      },
    },
    useCases: [
      'External sorting for datasets too large to fit in memory (merge sorted chunks from disk)',
      'Stable sorting where preserving the relative order of equal elements matters (e.g. sorting orders by price while keeping original timestamp order) — the standard library sorts in Python (Timsort) and Java\u2019s `Collections.sort` for objects are merge-sort derivatives specifically because of this stability guarantee',
    ],
    hints: [
      'A single loop with swaps (bubble/selection-style) works but is O(n^2) — can you exploit the fact that two already-sorted lists can be merged in linear time?',
      'Split the array in half recursively until pieces are size 1, then merge sorted halves back together.',
    ],
    commonMistakes: [
      'Reaching for a swap-based sort (bubble/selection/insertion) — correct but quadratic',
      'Forgetting to drain the remaining elements of whichever half finishes merging first',
    ],
  },

  // ===================================================================
  // 4. QUICK SORT
  // ===================================================================
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'algorithms',
    difficulty: 'medium',
    description: 'Sort an array of integers in ascending order and return the sorted array, using an in-place partitioning approach.',
    constraints: ['0 <= arr.length <= 10^4'],
    examples: [{ input: 'arr = [5,3,8,1,9,2]', output: '[1,2,3,5,8,9]' }],
    io: { kind: 'function', name: 'quickSort' },
    testCases: [
      { args: [[5, 3, 8, 1, 9, 2]], expected: [1, 2, 3, 5, 8, 9] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[2, 2, 1, 1]], expected: [1, 1, 2, 2] },
      { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    ],
    languages: {
      javascript: { starter: 'function quickSort(arr) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def quick_sort(arr):\n    pass',
        requiredOptimal: [/pivot/, /partition|<\s*pivot/],
        requiredNaive: [/key\s*=\s*a\[/, /while .+ > key|while .+ > \w+\[i\]/],
      },
      java: {
        starter: 'static int[] quickSort(int[] arr) {\n    \n}',
        requiredOptimal: [/pivot/i, /partition/i],
      },
      c: {
        starter: 'void quickSort(int* arr, int n) {\n    \n}',
        requiredOptimal: [/pivot/i, /partition/i],
      },
      cpp: {
        starter: 'vector<int> quickSort(vector<int> arr) {\n    \n}',
        requiredOptimal: [/pivot/i, /partition/i],
      },
    },
    optimal: {
      time: 'O(n log n) average', space: 'O(log n)',
      explanation: 'Pick a pivot, partition the array so smaller elements land left and larger land right of it, then recursively sort each side in place. Average case is O(n log n); a pathological pivot choice (already-sorted input with a naive last-element pivot) degrades to O(n^2) worst case — that\u2019s an inherent tradeoff of quicksort, not a bug, and is why production sorts (e.g. introsort) fall back to heapsort when recursion gets too deep.',
      code: {
        javascript: `function quickSort(arr) {\n  const a = arr.slice()\n  function partition(lo, hi) {\n    const pivot = a[hi]\n    let i = lo\n    for (let j = lo; j < hi; j++) {\n      if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++ }\n    }\n    [a[i], a[hi]] = [a[hi], a[i]]\n    return i\n  }\n  function sort(lo, hi) {\n    if (lo < hi) {\n      const p = partition(lo, hi)\n      sort(lo, p - 1)\n      sort(p + 1, hi)\n    }\n  }\n  sort(0, a.length - 1)\n  return a\n}`,
        python: `def quick_sort(arr):\n    a = arr[:]\n    def partition(lo, hi):\n        pivot = a[hi]\n        i = lo\n        for j in range(lo, hi):\n            if a[j] < pivot:\n                a[i], a[j] = a[j], a[i]\n                i += 1\n        a[i], a[hi] = a[hi], a[i]\n        return i\n    def sort(lo, hi):\n        if lo < hi:\n            p = partition(lo, hi)\n            sort(lo, p - 1)\n            sort(p + 1, hi)\n    sort(0, len(a) - 1)\n    return a`,
        java: `static int[] quickSort(int[] arr) {\n    int[] a = arr.clone();\n    quickSortHelper(a, 0, a.length - 1);\n    return a;\n}\nstatic void quickSortHelper(int[] a, int lo, int hi) {\n    if (lo < hi) {\n        int p = partition(a, lo, hi);\n        quickSortHelper(a, lo, p - 1);\n        quickSortHelper(a, p + 1, hi);\n    }\n}\nstatic int partition(int[] a, int lo, int hi) {\n    int pivot = a[hi], i = lo;\n    for (int j = lo; j < hi; j++) {\n        if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }\n    }\n    int t = a[i]; a[i] = a[hi]; a[hi] = t;\n    return i;\n}`,
        c: `int partition(int* a, int lo, int hi) {\n    int pivot = a[hi], i = lo;\n    for (int j = lo; j < hi; j++) if (a[j] < pivot) { int t=a[i]; a[i]=a[j]; a[j]=t; i++; }\n    int t = a[i]; a[i] = a[hi]; a[hi] = t;\n    return i;\n}\nvoid quickSortHelper(int* a, int lo, int hi) {\n    if (lo < hi) { int p = partition(a, lo, hi); quickSortHelper(a, lo, p - 1); quickSortHelper(a, p + 1, hi); }\n}\nvoid quickSort(int* arr, int n) { quickSortHelper(arr, 0, n - 1); }`,
        cpp: `int partition(vector<int>& a, int lo, int hi) {\n    int pivot = a[hi], i = lo;\n    for (int j = lo; j < hi; j++) if (a[j] < pivot) swap(a[i++], a[j]);\n    swap(a[i], a[hi]);\n    return i;\n}\nvoid quickSortHelper(vector<int>& a, int lo, int hi) {\n    if (lo < hi) { int p = partition(a, lo, hi); quickSortHelper(a, lo, p - 1); quickSortHelper(a, p + 1, hi); }\n}\nvector<int> quickSort(vector<int> arr) {\n    quickSortHelper(arr, 0, (int)arr.size() - 1);\n    return arr;\n}`,
      },
    },
    naive: {
      time: 'O(n^2)', space: 'O(1)',
      code: {
        javascript: `function quickSort(arr) {\n  const a = arr.slice()\n  for (let i = 1; i < a.length; i++) {\n    const key = a[i]\n    let j = i - 1\n    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j-- }\n    a[j + 1] = key\n  }\n  return a\n}`,
        python: `def quick_sort(arr):\n    a = arr[:]\n    for i in range(1, len(a)):\n        key = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > key:\n            a[j + 1] = a[j]\n            j -= 1\n        a[j + 1] = key\n    return a`,
      },
    },
    useCases: [
      'General-purpose in-memory sorting — C\u2019s qsort, and most language standard-library primitive-array sorts, are quicksort variants because of its low constant factor and in-place partitioning',
      'Quickselect (the same partitioning idea) powers "find the k-th smallest/median" in O(n) average time without a full sort',
    ],
    hints: [
      'Insertion sort (shift each new element into its sorted position) works but is O(n^2) on random input.',
      'Pick a pivot and partition the array around it so everything smaller ends up to its left — then you only need to recursively sort each side.',
    ],
    commonMistakes: [
      'Using insertion sort instead — correct output, but quadratic on random/large input',
      'Picking a fixed pivot (e.g. always the first element) without considering that already-sorted input triggers quicksort\u2019s O(n^2) worst case',
    ],
  },

  // ===================================================================
  // 5. BFS
  // ===================================================================
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'algorithms',
    difficulty: 'easy',
    description: 'Given a graph as an adjacency list (an object mapping each node to an array of its neighbors) and a `start` node, return the nodes in breadth-first traversal order.',
    constraints: ['Graph may contain cycles', 'All node ids are strings'],
    examples: [{ input: 'graph = {A:["B","C"], B:["A","D"], C:["A","D"], D:["B","C"]}, start = "A"', output: '["A","B","C","D"]' }],
    io: { kind: 'function', name: 'bfs' },
    testCases: [
      { args: [{ A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'D'], D: ['B', 'C', 'E'], E: ['D'] }, 'A'], expected: ['A', 'B', 'C', 'D', 'E'] },
      { args: [{ A: ['B'], B: ['A'] }, 'A'], expected: ['A', 'B'] },
    ],
    languages: {
      javascript: { starter: 'function bfs(graph, start) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def bfs(graph, start):\n    pass',
        requiredOptimal: [/visited|seen/, /\.pop\(0\)|deque\(/],
      },
      java: {
        starter: 'static List<String> bfs(Map<String, List<String>> graph, String start) {\n    \n}',
        requiredOptimal: [/visited|seen/i, /queue|arraydeque/i],
      },
      c: {
        starter: 'void bfs(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {\n    \n}',
        requiredOptimal: [/visited/i, /queue|qhead|qtail/i],
      },
      cpp: {
        starter: 'vector<string> bfs(map<string, vector<string>>& graph, const string& start) {\n    \n}',
        requiredOptimal: [/visited/i, /queue|deque/i],
      },
    },
    optimal: {
      time: 'O(V + E)', space: 'O(V)',
      explanation: 'Use a queue and a visited set. Dequeue a node, record it, and enqueue any unvisited neighbors. Every node and edge is processed once. There isn\u2019t a "faster" correct BFS — the real risk with this one is forgetting the visited set, which isn\u2019t a complexity tradeoff so much as a correctness bug (see Common Mistakes).',
      code: {
        javascript: `function bfs(graph, start) {\n  const visited = new Set([start])\n  const queue = [start]\n  const order = []\n  while (queue.length) {\n    const node = queue.shift()\n    order.push(node)\n    for (const neighbor of (graph[node] || [])) {\n      if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor) }\n    }\n  }\n  return order\n}`,
        python: `def bfs(graph, start):\n    visited = {start}\n    queue = [start]\n    order = []\n    while queue:\n        node = queue.pop(0)\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order`,
        java: `static List<String> bfs(Map<String, List<String>> graph, String start) {\n    Set<String> visited = new HashSet<>(List.of(start));\n    Deque<String> queue = new ArrayDeque<>(List.of(start));\n    List<String> order = new ArrayList<>();\n    while (!queue.isEmpty()) {\n        String node = queue.poll();\n        order.add(node);\n        for (String neighbor : graph.getOrDefault(node, List.of())) {\n            if (!visited.contains(neighbor)) { visited.add(neighbor); queue.add(neighbor); }\n        }\n    }\n    return order;\n}`,
        c: `void bfs(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {\n    int visited[64] = {0};\n    int queue[64], qHead = 0, qTail = 0;\n    visited[start] = 1;\n    queue[qTail++] = start;\n    *orderLen = 0;\n    while (qHead < qTail) {\n        int node = queue[qHead++];\n        order[(*orderLen)++] = node;\n        for (int i = 0; i < graph[node].count; i++) {\n            int neighbor = graph[node].neighbors[i];\n            if (!visited[neighbor]) { visited[neighbor] = 1; queue[qTail++] = neighbor; }\n        }\n    }\n}`,
        cpp: `vector<string> bfs(map<string, vector<string>>& graph, const string& start) {\n    set<string> visited{start};\n    deque<string> queue{start};\n    vector<string> order;\n    while (!queue.empty()) {\n        string node = queue.front(); queue.pop_front();\n        order.push_back(node);\n        for (auto& neighbor : graph[node]) {\n            if (!visited.count(neighbor)) { visited.insert(neighbor); queue.push_back(neighbor); }\n        }\n    }\n    return order;\n}`,
      },
    },
    useCases: [
      'Shortest path in an unweighted graph (fewest hops) — social network "degrees of separation", web crawlers',
      'Level-by-level processing: GPS/map routing on unweighted road segments, broadcasting in peer-to-peer networks',
    ],
    hints: [
      'A queue naturally processes nodes in the order they were discovered — that\u2019s what gives you level-by-level (breadth-first) order.',
      'Mark a node visited the moment you enqueue it, not when you dequeue it, or you can enqueue the same node multiple times.',
    ],
    commonMistakes: [
      'Skipping the visited set — on a graph with cycles this revisits nodes forever (infinite loop) instead of just being slow',
      'Using a stack instead of a queue, which silently turns your "BFS" into a DFS-like order',
    ],
  },

  // ===================================================================
  // 6. DFS
  // ===================================================================
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'algorithms',
    difficulty: 'easy',
    description: 'Given a graph as an adjacency list and a `start` node, return the nodes in depth-first traversal order (visit each neighbor\u2019s full subtree before moving to the next neighbor).',
    constraints: ['Graph may contain cycles', 'All node ids are strings'],
    examples: [{ input: 'graph = {A:["B","C"], B:["D"], C:["D"], D:[]}, start = "A"', output: '["A","B","D","C"]' }],
    io: { kind: 'function', name: 'dfs' },
    testCases: [
      { args: [{ A: ['B', 'C'], B: ['D'], C: ['D'], D: [] }, 'A'], expected: ['A', 'B', 'D', 'C'] },
      { args: [{ A: ['B'], B: ['A'] }, 'A'], expected: ['A', 'B'] },
    ],
    languages: {
      javascript: { starter: 'function dfs(graph, start) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def dfs(graph, start):\n    pass',
        requiredOptimal: [/visited|seen/, /def\s+visit|recursion|append\(node\)/],
      },
      java: {
        starter: 'static List<String> dfs(Map<String, List<String>> graph, String start) {\n    \n}',
        requiredOptimal: [/visited|seen/i],
      },
      c: {
        starter: 'void dfs(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {\n    \n}',
        requiredOptimal: [/visited/i],
      },
      cpp: {
        starter: 'vector<string> dfs(map<string, vector<string>>& graph, const string& start) {\n    \n}',
        requiredOptimal: [/visited/i],
      },
    },
    optimal: {
      time: 'O(V + E)', space: 'O(V)',
      explanation: 'Recurse into each unvisited neighbor before backtracking, tracking a visited set. Like BFS, there\u2019s no faster "optimal" alternative for DFS itself — the real lesson is the visited-set and recursion-depth pitfalls (see Common Mistakes).',
      code: {
        javascript: `function dfs(graph, start) {\n  const visited = new Set()\n  const order = []\n  function visit(node) {\n    if (visited.has(node)) return\n    visited.add(node)\n    order.push(node)\n    for (const neighbor of (graph[node] || [])) visit(neighbor)\n  }\n  visit(start)\n  return order\n}`,
        python: `def dfs(graph, start):\n    visited = set()\n    order = []\n    def visit(node):\n        if node in visited:\n            return\n        visited.add(node)\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            visit(neighbor)\n    visit(start)\n    return order`,
        java: `static List<String> dfs(Map<String, List<String>> graph, String start) {\n    Set<String> visited = new HashSet<>();\n    List<String> order = new ArrayList<>();\n    dfsVisit(graph, start, visited, order);\n    return order;\n}\nstatic void dfsVisit(Map<String, List<String>> graph, String node, Set<String> visited, List<String> order) {\n    if (visited.contains(node)) return;\n    visited.add(node);\n    order.add(node);\n    for (String neighbor : graph.getOrDefault(node, List.of())) dfsVisit(graph, neighbor, visited, order);\n}`,
        c: `void dfsVisit(AdjNode* graph, int node, int* visited, int* order, int* orderLen) {\n    if (visited[node]) return;\n    visited[node] = 1;\n    order[(*orderLen)++] = node;\n    for (int i = 0; i < graph[node].count; i++) dfsVisit(graph, graph[node].neighbors[i], visited, order, orderLen);\n}\nvoid dfs(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {\n    int visited[64] = {0};\n    *orderLen = 0;\n    dfsVisit(graph, start, visited, order, orderLen);\n}`,
        cpp: `void dfsVisit(map<string, vector<string>>& graph, const string& node, set<string>& visited, vector<string>& order) {\n    if (visited.count(node)) return;\n    visited.insert(node);\n    order.push_back(node);\n    for (auto& neighbor : graph[node]) dfsVisit(graph, neighbor, visited, order);\n}\nvector<string> dfs(map<string, vector<string>>& graph, const string& start) {\n    set<string> visited;\n    vector<string> order;\n    dfsVisit(graph, start, visited, order);\n    return order;\n}`,
      },
    },
    useCases: [
      'Cycle detection, topological sort, and connected-components analysis',
      'Maze/puzzle solvers and dependency-graph resolution (e.g. package managers resolving install order)',
    ],
    hints: [
      'Go as deep as possible down one path before trying the next neighbor — recursion (or an explicit stack) naturally does this.',
      'Track visited nodes so you don\u2019t recurse forever on a cycle.',
    ],
    commonMistakes: [
      'Missing the visited set — infinite recursion (stack overflow) on any cyclic graph',
      'Using unbounded recursion on very deep graphs instead of an explicit stack, risking a stack overflow independent of cycles',
    ],
  },

  // ===================================================================
  // 7. VALID PARENTHESES
  // ===================================================================
  {
    id: 'valid-parentheses',
    name: 'Valid Parentheses',
    category: 'algorithms',
    difficulty: 'easy',
    description: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[`, `]`, determine if the brackets are validly matched and nested.',
    constraints: ['0 <= s.length <= 10^4'],
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    io: { kind: 'function', name: 'isValid' },
    testCases: [
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
      { args: ['((('], expected: false },
    ],
    languages: {
      javascript: { starter: 'function isValid(s) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def is_valid(s):\n    pass',
        requiredOptimal: [/stack\s*=\s*\[\]|stack\s*=\s*list\(\)/, /\.append\(/, /\.pop\(\)/],
        requiredNaive: [/\.replace\(/],
      },
      java: {
        starter: 'static boolean isValid(String s) {\n    \n}',
        requiredOptimal: [/deque|stack/i, /push\(/, /pop\(\)/],
      },
      c: {
        starter: 'int isValid(const char* s) {\n    \n}',
        requiredOptimal: [/stack\[/, /top/],
      },
      cpp: {
        starter: 'bool isValid(const string& s) {\n    \n}',
        requiredOptimal: [/stack\s*<|vector\s*<\s*char/, /push_back|push\(/, /pop_back|pop\(\)/],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(n)',
      explanation: 'Push opening brackets onto a stack; on a closing bracket, it must match the top of the stack (the most recently opened, unclosed bracket). A single pass with O(1) work per character.',
      code: {
        javascript: `function isValid(s) {\n  const stack = []\n  const pairs = { ')': '(', ']': '[', '}': '{' }\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)\n    else if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false\n    }\n  }\n  return stack.length === 0\n}`,
        python: `def is_valid(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return len(stack) == 0`,
        java: `static boolean isValid(String s) {\n    Deque<Character> stack = new ArrayDeque<>();\n    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');\n    for (char ch : s.toCharArray()) {\n        if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);\n        else if (pairs.containsKey(ch)) {\n            if (stack.isEmpty() || stack.pop() != pairs.get(ch)) return false;\n        }\n    }\n    return stack.isEmpty();\n}`,
        c: `int isValid(const char* s) {\n    char stack[10000];\n    int top = -1;\n    for (const char* p = s; *p; p++) {\n        char ch = *p;\n        if (ch == '(' || ch == '[' || ch == '{') stack[++top] = ch;\n        else if (ch == ')' || ch == ']' || ch == '}') {\n            if (top < 0) return 0;\n            char open = stack[top--];\n            if ((ch == ')' && open != '(') || (ch == ']' && open != '[') || (ch == '}' && open != '{')) return 0;\n        }\n    }\n    return top == -1;\n}`,
        cpp: `bool isValid(const string& s) {\n    vector<char> stack;\n    map<char, char> pairs{{')', '('}, {']', '['}, {'}', '{'}};\n    for (char ch : s) {\n        if (ch == '(' || ch == '[' || ch == '{') stack.push_back(ch);\n        else if (pairs.count(ch)) {\n            if (stack.empty() || stack.back() != pairs[ch]) return false;\n            stack.pop_back();\n        }\n    }\n    return stack.empty();\n}`,
      },
    },
    naive: {
      time: 'O(n^2)', space: 'O(n)',
      code: {
        javascript: `function isValid(s) {\n  let str = s\n  let prevLen\n  do {\n    prevLen = str.length\n    str = str.replace('()', '').replace('[]', '').replace('{}', '')\n  } while (str.length !== prevLen)\n  return str.length === 0\n}`,
        python: `def is_valid(s):\n    string = s\n    prev_len = -1\n    while len(string) != prev_len:\n        prev_len = len(string)\n        string = string.replace('()', '').replace('[]', '').replace('{}', '')\n    return len(string) == 0`,
      },
    },
    useCases: [
      'Syntax validation in parsers/compilers/linters (matching brackets, tags, quotes)',
      'The stack-based "match the most recent unclosed thing" pattern generalizes to XML/HTML tag matching, expression evaluation, and undo/redo stacks',
    ],
    hints: [
      'What\u2019s the most recently opened bracket that hasn\u2019t been closed yet? That\u2019s the one the next closing bracket must match.',
      'A stack naturally tracks "most recent unclosed" — push on open, pop-and-compare on close.',
    ],
    commonMistakes: [
      'Repeatedly deleting matched pairs with string.replace() — works but is quadratic (re-scans the whole string every pass)',
      'Forgetting to check the stack is empty at the end (catches unclosed opening brackets like `"((("`)',
    ],
  },

  // ===================================================================
  // 8. LRU CACHE
  // ===================================================================
  {
    id: 'lru-cache',
    name: 'LRU Cache',
    category: 'dataStructures',
    difficulty: 'medium',
    description: 'Design a Least-Recently-Used cache with a fixed `capacity`. Implement `get(key)` (return the value, or -1 if absent, and mark it recently used) and `put(key, value)` (insert/update; if inserting over capacity, evict the least-recently-used entry).',
    constraints: ['1 <= capacity <= 1000'],
    examples: [{ input: 'capacity=2; put(1,1); put(2,2); get(1); put(3,3) evicts key 2', output: 'get(1) -> 1' }],
    io: { kind: 'class', name: 'LRUCache' },
    testCases: [
      {
        ctorArgs: [2],
        ops: [
          { call: 'put', args: [1, 1] },
          { call: 'put', args: [2, 2] },
          { call: 'get', args: [1], expected: 1 },
          { call: 'put', args: [3, 3] },
          { call: 'get', args: [2], expected: -1 },
          { call: 'put', args: [4, 4] },
          { call: 'get', args: [1], expected: -1 },
          { call: 'get', args: [3], expected: 3 },
          { call: 'get', args: [4], expected: 4 },
        ],
      },
    ],
    languages: {
      javascript: {
        starter: 'class LRUCache {\n  constructor(capacity) {\n    \n  }\n  get(key) {\n    \n  }\n  put(key, value) {\n    \n  }\n}',
        requiredOptimal: [], requiredNaive: [],
      },
      python: {
        starter: 'class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass',
        requiredOptimal: [/orderedDict|ordereddict/i, /move_to_end/],
        requiredNaive: [/self\.arr\s*=\s*\[\]|self\.list\s*=\s*\[\]/, /for .+ enumerate\(self\.(arr|list)\)/],
      },
      java: {
        starter: 'class LRUCache {\n    LRUCache(int capacity) {\n        \n    }\n    int get(int key) {\n        \n    }\n    void put(int key, int value) {\n        \n    }\n}',
        requiredOptimal: [/linkedhashmap/i],
      },
      c: {
        starter: 'typedef struct LRUCache LRUCache;\nLRUCache* lruCreate(int capacity);\nint lruGet(LRUCache* c, int key);\nvoid lruPut(LRUCache* c, int key, int value);',
        requiredOptimal: [/prev|next/, /table\[/],
      },
      cpp: {
        starter: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    int get(int key) {\n        \n    }\n    void put(int key, int value) {\n        \n    }\n};',
        requiredOptimal: [/list\s*<|unordered_map/, /splice/],
      },
    },
    optimal: {
      time: 'O(1)', space: 'O(capacity)',
      explanation: 'Combine a hash map (key -> node) with a doubly linked list ordered by recency. Every get/put touches the map for O(1) lookup and splices the node to the front of the list for O(1) reordering — no scanning required. JavaScript\u2019s Map and Java\u2019s LinkedHashMap (access-order mode) already maintain this insertion/access order internally, so they can stand in for the hand-rolled list.',
      code: {
        javascript: `class LRUCache {\n  constructor(capacity) { this.capacity = capacity; this.map = new Map() }\n  get(key) {\n    if (!this.map.has(key)) return -1\n    const val = this.map.get(key)\n    this.map.delete(key); this.map.set(key, val)\n    return val\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key)\n    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value)\n    this.map.set(key, value)\n  }\n}`,
        python: `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.map = OrderedDict()\n    def get(self, key):\n        if key not in self.map:\n            return -1\n        self.map.move_to_end(key)\n        return self.map[key]\n    def put(self, key, value):\n        if key in self.map:\n            self.map.move_to_end(key)\n        elif len(self.map) >= self.capacity:\n            self.map.popitem(last=False)\n        self.map[key] = value`,
        java: `class LRUCache {\n    int capacity;\n    LinkedHashMap<Integer, Integer> map;\n    LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<>(16, 0.75f, true);\n    }\n    int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        return map.get(key);\n    }\n    void put(int key, int value) {\n        if (map.size() >= capacity && !map.containsKey(key)) {\n            Iterator<Integer> it = map.keySet().iterator();\n            it.next(); it.remove();\n        }\n        map.put(key, value);\n    }\n}`,
        c: `typedef struct LRUNode { int key, value; struct LRUNode *prev, *next; } LRUNode;\ntypedef struct LRUCache {\n    int capacity, size;\n    LRUNode *head, *tail;\n    LRUNode* table[128]; // direct-mapped by key % 128\n} LRUCache;\nLRUCache* lruCreate(int capacity) {\n    LRUCache* c = calloc(1, sizeof(LRUCache));\n    c->capacity = capacity;\n    return c;\n}\nstatic void lruDetach(LRUCache* c, LRUNode* n) {\n    if (n->prev) n->prev->next = n->next; else c->head = n->next;\n    if (n->next) n->next->prev = n->prev; else c->tail = n->prev;\n}\nstatic void lruPushFront(LRUCache* c, LRUNode* n) {\n    n->prev = NULL; n->next = c->head;\n    if (c->head) c->head->prev = n;\n    c->head = n;\n    if (!c->tail) c->tail = n;\n}\nint lruGet(LRUCache* c, int key) {\n    LRUNode* n = c->table[key % 128];\n    if (!n || n->key != key) return -1;\n    lruDetach(c, n); lruPushFront(c, n);\n    return n->value;\n}\nvoid lruPut(LRUCache* c, int key, int value) {\n    LRUNode* n = c->table[key % 128];\n    if (n && n->key == key) { n->value = value; lruDetach(c, n); lruPushFront(c, n); return; }\n    if (c->size >= c->capacity) {\n        LRUNode* victim = c->tail;\n        c->table[victim->key % 128] = NULL;\n        lruDetach(c, victim);\n        free(victim);\n        c->size--;\n    }\n    LRUNode* fresh = malloc(sizeof(LRUNode));\n    fresh->key = key; fresh->value = value;\n    lruPushFront(c, fresh);\n    c->table[key % 128] = fresh;\n    c->size++;\n}`,
        cpp: `class LRUCache {\n    int capacity;\n    list<pair<int, int>> order; // front = most recently used\n    unordered_map<int, list<pair<int, int>>::iterator> map_;\npublic:\n    LRUCache(int cap) : capacity(cap) {}\n    int get(int key) {\n        auto it = map_.find(key);\n        if (it == map_.end()) return -1;\n        order.splice(order.begin(), order, it->second);\n        return it->second->second;\n    }\n    void put(int key, int value) {\n        auto it = map_.find(key);\n        if (it != map_.end()) { order.erase(it->second); map_.erase(it); }\n        else if ((int)order.size() >= capacity) { map_.erase(order.back().first); order.pop_back(); }\n        order.push_front({key, value});\n        map_[key] = order.begin();\n    }\n};`,
      },
    },
    naive: {
      time: 'O(n) per op', space: 'O(capacity)',
      code: {
        javascript: `class LRUCache {\n  constructor(capacity) { this.capacity = capacity; this.arr = [] }\n  get(key) {\n    const i = this.arr.findIndex(([k]) => k === key)\n    if (i === -1) return -1\n    const [, val] = this.arr[i]\n    this.arr.splice(i, 1); this.arr.push([key, val])\n    return val\n  }\n  put(key, value) {\n    const i = this.arr.findIndex(([k]) => k === key)\n    if (i !== -1) this.arr.splice(i, 1)\n    else if (this.arr.length >= this.capacity) this.arr.shift()\n    this.arr.push([key, value])\n  }\n}`,
        python: `class LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.arr = []  # [(key, val), ...] most-recent at end\n    def get(self, key):\n        for i, (k, v) in enumerate(self.arr):\n            if k == key:\n                self.arr.pop(i)\n                self.arr.append((k, v))\n                return v\n        return -1\n    def put(self, key, value):\n        for i, (k, _) in enumerate(self.arr):\n            if k == key:\n                self.arr.pop(i)\n                break\n        else:\n            if len(self.arr) >= self.capacity:\n                self.arr.pop(0)\n        self.arr.append((key, value))`,
      },
    },
    useCases: [
      'CPU/OS page caches, CDN edge caches, and database buffer pools all use LRU or an LRU-derived eviction policy',
      'In-memory application caches (e.g. memoizing expensive API responses) where memory is bounded but recently-used data should stay hot',
    ],
    hints: [
      'Which two operations do you need to be fast? Lookup by key, and "move this to the front / evict from the back."',
      'A hash map gives O(1) lookup; pairing it with a doubly linked list gives O(1) reordering — together, O(1) for both get and put.',
    ],
    commonMistakes: [
      'Storing entries in a plain array/list and linear-scanning to find or evict — correct but O(n) per operation',
      'Forgetting to mark an entry as recently-used on `get`, not just on `put` (a `get` should also refresh recency)',
    ],
  },

  // ===================================================================
  // 9. LINKED LIST REVERSAL
  // ===================================================================
  {
    id: 'linked-list-reversal',
    name: 'Linked List Reversal',
    category: 'dataStructures',
    difficulty: 'easy',
    description: 'Given the head of a singly linked list, reverse it in place and return the new head. (A `ListNode` class with `val`/`next` is already defined for you.)',
    constraints: ['0 <= list length <= 10^4'],
    examples: [{ input: '1 -> 2 -> 3 -> 4 -> 5', output: '5 -> 4 -> 3 -> 2 -> 1' }],
    io: {
      kind: 'function', name: 'reverseList',
      prepare: (args, h) => [h.arrayToList(args[0])],
      serialize: (result, h) => h.listToArray(result),
    },
    testCases: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { args: [[1]], expected: [1] },
      { args: [[]], expected: [] },
    ],
    languages: {
      javascript: { starter: 'function reverseList(head) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def reverse_list(head):\n    pass',
        requiredOptimal: [/prev\s*=\s*none/i, /while\s+curr/],
        requiredNaive: [/def\s+\w*reverse.*\(/, /reverse_list\(head\.next\)|reverse\(head\.next\)/],
      },
      java: {
        starter: 'static ListNode reverseList(ListNode head) {\n    \n}',
        requiredOptimal: [/prev\s*=\s*null/i, /while\s*\(\s*curr/i],
      },
      c: {
        starter: 'ListNode* reverseList(ListNode* head) {\n    \n}',
        requiredOptimal: [/prev\s*=\s*null/i, /while\s*\(\s*curr/i],
      },
      cpp: {
        starter: 'ListNode* reverseList(ListNode* head) {\n    \n}',
        requiredOptimal: [/prev\s*=\s*nullptr|prev\s*=\s*null/i, /while\s*\(\s*curr/i],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(1)',
      explanation: 'Walk the list once, re-pointing each node\u2019s `next` back to the previous node as you go, using three pointers (prev, curr, next-temp). No extra memory beyond a few pointers.',
      code: {
        javascript: `function reverseList(head) {\n  let prev = null, curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}`,
        python: `def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
        java: `static ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
        c: `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = NULL, *curr = head;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
        cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      },
    },
    naive: {
      time: 'O(n)', space: 'O(n)',
      code: {
        javascript: `function reverseList(head) {\n  if (!head || !head.next) return head\n  const rest = reverseList(head.next)\n  head.next.next = head\n  head.next = null\n  return rest\n}`,
        python: `def reverse_list(head):\n    if head is None or head.next is None:\n        return head\n    rest = reverse_list(head.next)\n    head.next.next = head\n    head.next = None\n    return rest`,
      },
    },
    useCases: [
      'Undo/redo history and browser back/forward stacks implemented as linked structures',
      'A building-block subroutine inside harder problems: reverse-in-groups-of-k, palindrome-list checks, and "reverse a sub-portion" problems all reuse this exact pointer-rewiring technique',
    ],
    hints: [
      'You can\u2019t just flip `next` pointers without first saving where you were headed — you\u2019ll lose the rest of the list.',
      'Keep three pointers: the node before current, the current node, and a temporary save of current\u2019s next before you overwrite it.',
    ],
    commonMistakes: [
      'Recursing one call per node (correct, but O(n) call-stack space — and risks a stack overflow on very long lists) instead of an O(1)-space iterative walk',
      'Overwriting `curr.next` before saving it, which disconnects the rest of the list before you\u2019ve moved to it',
    ],
  },

  // ===================================================================
  // 10. FLOYD'S CYCLE DETECTION
  // ===================================================================
  {
    id: 'floyd-cycle-detection',
    name: "Floyd's Cycle Detection",
    category: 'algorithms',
    difficulty: 'medium',
    description: 'Given the head of a singly linked list, determine whether it contains a cycle (a node reachable again by following `next` pointers).',
    constraints: ['0 <= list length <= 10^4'],
    examples: [{ input: 'list with the tail pointing back into the middle', output: 'true' }],
    io: {
      kind: 'function', name: 'hasCycle',
      prepare: (args, h) => [h.makeCyclicList(args[0], args[1])],
    },
    testCases: [
      { args: [[3, 2, 0, -4], 1], expected: true },
      { args: [[1, 2], 0], expected: true },
      { args: [[1], -1], expected: false },
      { args: [[1, 2, 3], -1], expected: false },
    ],
    languages: {
      javascript: { starter: 'function hasCycle(head) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def has_cycle(head):\n    pass',
        requiredOptimal: [/slow/, /fast/, /fast\.next\.next|fast\s*=\s*fast\.next\.next/],
        requiredNaive: [/seen\s*=\s*set\(\)|visited\s*=\s*set\(\)/, /id\(curr\)|curr in seen/],
      },
      java: {
        starter: 'static boolean hasCycle(ListNode head) {\n    \n}',
        requiredOptimal: [/slow/i, /fast/i],
      },
      c: {
        starter: 'int hasCycle(ListNode* head) {\n    \n}',
        requiredOptimal: [/slow/i, /fast/i],
      },
      cpp: {
        starter: 'bool hasCycle(ListNode* head) {\n    \n}',
        requiredOptimal: [/slow/i, /fast/i],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(1)',
      explanation: "Floyd's tortoise-and-hare: advance a slow pointer by 1 and a fast pointer by 2 each step. If there\u2019s a cycle, the fast pointer eventually laps the slow one and they meet; if the list ends, fast hits null first. Only two pointers needed — no extra memory.",
      code: {
        javascript: `function hasCycle(head) {\n  let slow = head, fast = head\n  while (fast && fast.next) {\n    slow = slow.next\n    fast = fast.next.next\n    if (slow === fast) return true\n  }\n  return false\n}`,
        python: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False`,
        java: `static boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
        c: `int hasCycle(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return 1;\n    }\n    return 0;\n}`,
        cpp: `bool hasCycle(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
      },
    },
    naive: {
      time: 'O(n)', space: 'O(n)',
      code: {
        javascript: `function hasCycle(head) {\n  const seen = new Set()\n  let curr = head\n  while (curr) {\n    if (seen.has(curr)) return true\n    seen.add(curr)\n    curr = curr.next\n  }\n  return false\n}`,
        python: `def has_cycle(head):\n    seen = set()\n    curr = head\n    while curr:\n        if id(curr) in seen:\n            return True\n        seen.add(id(curr))\n        curr = curr.next\n    return False`,
      },
    },
    useCases: [
      'Detecting infinite loops in linked data structures (corrupted pointer chains, malformed graphs serialized as lists)',
      'The same two-speed-pointer trick finds the middle of a list in one pass and detects cycle *entry points* — a building block in duplicate-number-finding problems that map values to a "functional graph"',
    ],
    hints: [
      'You could remember every node you\u2019ve visited and check for repeats — but that costs extra memory proportional to the list.',
      'Two pointers moving at different speeds (1 step vs 2 steps) must eventually meet if — and only if — there\u2019s a cycle, with no extra memory.',
    ],
    commonMistakes: [
      'Tracking visited nodes in a hash set — correct, but O(n) space when O(1) is possible',
      'Comparing node *values* instead of node *identity/reference* — two different nodes can hold the same value, so value comparisons give false positives',
    ],
  },

  // ===================================================================
  // 11. KADANE'S ALGORITHM
  // ===================================================================
  {
    id: 'kadane',
    name: "Kadane's Algorithm",
    category: 'algorithms',
    difficulty: 'medium',
    description: 'Given an array of integers (may include negatives), find the largest sum of any contiguous subarray, and return that sum.',
    constraints: ['1 <= nums.length <= 10^5'],
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', note: '[4,-1,2,1] has the largest sum' }],
    io: { kind: 'function', name: 'maxSubArray' },
    testCases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1, -2, -3]], expected: -1 },
    ],
    languages: {
      javascript: { starter: 'function maxSubArray(nums) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def max_sub_array(nums):\n    pass',
        requiredOptimal: [/curr\s*=\s*max\(|current\s*=\s*max\(/, /best\s*=\s*max\(|max_sum\s*=\s*max\(/],
        requiredNaive: [/for .+ in range\(len\(nums\)\)/, /for .+ in range\(i,\s*len\(nums\)\)/],
      },
      java: {
        starter: 'static int maxSubArray(int[] nums) {\n    \n}',
        requiredOptimal: [/math\.max\(nums\[i\],\s*curr/i],
      },
      c: {
        starter: 'int maxSubArray(int* nums, int n) {\n    \n}',
        requiredOptimal: [/curr\s*=/, /best\s*=/],
      },
      cpp: {
        starter: 'int maxSubArray(vector<int>& nums) {\n    \n}',
        requiredOptimal: [/curr\s*=\s*max\(/, /best\s*=\s*max\(/],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(1)',
      explanation: 'At each position, decide whether to extend the running subarray or start fresh from the current element — `curr = max(nums[i], curr + nums[i])` — and track the best `curr` seen. One pass, constant extra space.',
      code: {
        javascript: `function maxSubArray(nums) {\n  let best = nums[0], curr = nums[0]\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i])\n    best = Math.max(best, curr)\n  }\n  return best\n}`,
        python: `def max_sub_array(nums):\n    best = curr = nums[0]\n    for n in nums[1:]:\n        curr = max(n, curr + n)\n        best = max(best, curr)\n    return best`,
        java: `static int maxSubArray(int[] nums) {\n    int best = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        best = Math.max(best, curr);\n    }\n    return best;\n}`,
        c: `int maxSubArray(int* nums, int n) {\n    int best = nums[0], curr = nums[0];\n    for (int i = 1; i < n; i++) {\n        curr = nums[i] > curr + nums[i] ? nums[i] : curr + nums[i];\n        best = best > curr ? best : curr;\n    }\n    return best;\n}`,
        cpp: `int maxSubArray(vector<int>& nums) {\n    int best = nums[0], curr = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        best = max(best, curr);\n    }\n    return best;\n}`,
      },
    },
    naive: {
      time: 'O(n^2)', space: 'O(1)',
      code: {
        javascript: `function maxSubArray(nums) {\n  let best = -Infinity\n  for (let i = 0; i < nums.length; i++) {\n    let sum = 0\n    for (let j = i; j < nums.length; j++) {\n      sum += nums[j]\n      best = Math.max(best, sum)\n    }\n  }\n  return best\n}`,
        python: `def max_sub_array(nums):\n    best = float('-inf')\n    for i in range(len(nums)):\n        s = 0\n        for j in range(i, len(nums)):\n            s += nums[j]\n            best = max(best, s)\n    return best`,
      },
    },
    useCases: [
      'Financial time-series analysis: best contiguous window of stock-price gains/losses, or a rolling revenue window',
      'Signal processing: finding the strongest contiguous burst in a noisy sequence (e.g. sensor readings, log-anomaly windows)',
    ],
    hints: [
      'Every subarray-ending-here either extends the previous best subarray-ending-here, or starts over at the current element — whichever is larger.',
      'You never need to know the actual subarray, just the best running sum ending at each index and the best seen overall.',
    ],
    commonMistakes: [
      'Checking every possible subarray with nested loops — correct but O(n^2), and doesn\u2019t scale past ~10^4 elements',
      'Resetting the running sum to 0 instead of the current element when it goes negative, which breaks on all-negative arrays',
    ],
  },

  // ===================================================================
  // 12. SLIDING WINDOW MAXIMUM
  // ===================================================================
  {
    id: 'sliding-window-max',
    name: 'Sliding Window Maximum',
    category: 'algorithms',
    difficulty: 'hard',
    description: 'Given an array `nums` and a window size `k`, return an array of the maximum value in each contiguous window of size `k` as it slides from left to right.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' }],
    io: { kind: 'function', name: 'maxSlidingWindow' },
    testCases: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
    ],
    languages: {
      javascript: { starter: 'function maxSlidingWindow(nums, k) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def max_sliding_window(nums, k):\n    pass',
        requiredOptimal: [/deque\(/, /popleft\(\)|pop\(\)/],
        requiredNaive: [/max\(nums\[i:i\s*\+\s*k\]\)/],
      },
      java: {
        starter: 'static int[] maxSlidingWindow(int[] nums, int k) {\n    \n}',
        requiredOptimal: [/deque/i, /pollfirst|polllast/i],
      },
      c: {
        starter: 'int maxSlidingWindow(const int* nums, int n, int k, int* out) {\n    \n}',
        requiredOptimal: [/deque\[/, /dhead|dtail/i],
      },
      cpp: {
        starter: 'vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    \n}',
        requiredOptimal: [/deque\s*</, /pop_front|pop_back/],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(k)',
      explanation: 'Maintain a deque of indices whose values are in decreasing order. Drop indices that fall out of the window from the front, and drop indices from the back whose values are smaller than the incoming value (they can never be the max while the incoming value is in the window). The front of the deque is always the current window\u2019s max. Each index enters and leaves the deque at most once, so the total work is O(n).',
      code: {
        javascript: `function maxSlidingWindow(nums, k) {\n  const deque = [] // indices, values decreasing\n  const result = []\n  for (let i = 0; i < nums.length; i++) {\n    while (deque.length && deque[0] <= i - k) deque.shift()\n    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop()\n    deque.push(i)\n    if (i >= k - 1) result.push(nums[deque[0]])\n  }\n  return result\n}`,
        python: `from collections import deque\ndef max_sliding_window(nums, k):\n    dq = deque()\n    result = []\n    for i, n in enumerate(nums):\n        while dq and dq[0] <= i - k:\n            dq.popleft()\n        while dq and nums[dq[-1]] < n:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result`,
        java: `static int[] maxSlidingWindow(int[] nums, int k) {\n    Deque<Integer> deque = new ArrayDeque<>();\n    List<Integer> result = new ArrayList<>();\n    for (int i = 0; i < nums.length; i++) {\n        while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();\n        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast();\n        deque.addLast(i);\n        if (i >= k - 1) result.add(nums[deque.peekFirst()]);\n    }\n    return result.stream().mapToInt(Integer::intValue).toArray();\n}`,
        c: `int maxSlidingWindow(const int* nums, int n, int k, int* out) {\n    int deque[100000], dHead = 0, dTail = 0;\n    int outLen = 0;\n    for (int i = 0; i < n; i++) {\n        while (dTail > dHead && deque[dHead] <= i - k) dHead++;\n        while (dTail > dHead && nums[deque[dTail - 1]] < nums[i]) dTail--;\n        deque[dTail++] = i;\n        if (i >= k - 1) out[outLen++] = nums[deque[dHead]];\n    }\n    return outLen;\n}`,
        cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;\n    vector<int> result;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) result.push_back(nums[dq.front()]);\n    }\n    return result;\n}`,
      },
    },
    naive: {
      time: 'O(n*k)', space: 'O(1)',
      code: {
        javascript: `function maxSlidingWindow(nums, k) {\n  const result = []\n  for (let i = 0; i <= nums.length - k; i++) {\n    let max = -Infinity\n    for (let j = i; j < i + k; j++) max = Math.max(max, nums[j])\n    result.push(max)\n  }\n  return result\n}`,
        python: `def max_sliding_window(nums, k):\n    result = []\n    for i in range(len(nums) - k + 1):\n        result.append(max(nums[i:i + k]))\n    return result`,
      },
    },
    useCases: [
      'Real-time analytics: rolling maximum over the last N events in a monitoring/metrics stream',
      'Video/audio stream processing (e.g. peak amplitude in a moving window) and network traffic spike detection',
    ],
    hints: [
      'Recomputing the max of every window from scratch repeats a lot of work — can you reuse information from the previous window?',
      'Keep a deque of *candidate* maxima in decreasing order; anything smaller than a newer element can never win while that newer element is still in the window, so you can throw it away immediately.',
    ],
    commonMistakes: [
      'Recomputing `max()` over each window from scratch — correct but O(n*k), which is quadratic-ish for large k',
      'Forgetting to evict indices that have fallen out of the window\u2019s left edge from the front of the deque',
    ],
  },

  // ===================================================================
  // 13. BINARY TREE LEVEL ORDER
  // ===================================================================
  {
    id: 'binary-tree-level-order',
    name: 'Binary Tree Level Order Traversal',
    category: 'dataStructures',
    difficulty: 'medium',
    description: 'Given the root of a binary tree, return its node values grouped by level, top to bottom. (A `TreeNode` class with `val`/`left`/`right` is already defined for you; the tree is passed to you as a level-order array with `null` for missing children, already converted to real nodes.)',
    constraints: ['0 <= number of nodes <= 2000'],
    examples: [{ input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }],
    io: {
      kind: 'function', name: 'levelOrder',
      prepare: (args, h) => [h.arrayToTree(args[0])],
    },
    testCases: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] },
    ],
    languages: {
      javascript: { starter: 'function levelOrder(root) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def level_order(root):\n    pass',
        requiredOptimal: [/queue\s*=\s*\[root\]|queue\s*=\s*deque\(\[root\]\)/, /level\s*=\s*\[\]/],
      },
      java: {
        starter: 'static List<List<Integer>> levelOrder(TreeNode root) {\n    \n}',
        requiredOptimal: [/queue|deque/i, /size\(\)/],
      },
      c: {
        starter: 'int levelOrder(TreeNode* root, int levels[16][16], int* levelSizes) {\n    \n}',
        requiredOptimal: [/queue\[/, /qhead|qtail/i],
      },
      cpp: {
        starter: 'vector<vector<int>> levelOrder(TreeNode* root) {\n    \n}',
        requiredOptimal: [/queue\s*<|deque\s*</, /size\(\)/],
      },
    },
    optimal: {
      time: 'O(n)', space: 'O(n)',
      explanation: 'Standard BFS with a queue: process one full level at a time by snapshotting the current queue size before enqueuing that level\u2019s children. Every node is visited exactly once.',
      code: {
        javascript: `function levelOrder(root) {\n  if (!root) return []\n  const result = []\n  let queue = [root]\n  while (queue.length) {\n    const level = []\n    const next = []\n    for (const node of queue) {\n      level.push(node.val)\n      if (node.left) next.push(node.left)\n      if (node.right) next.push(node.right)\n    }\n    result.push(level)\n    queue = next\n  }\n  return result\n}`,
        python: `def level_order(root):\n    if not root:\n        return []\n    result = []\n    queue = [root]\n    while queue:\n        level = []\n        nxt = []\n        for node in queue:\n            level.append(node.val)\n            if node.left:\n                nxt.append(node.left)\n            if node.right:\n                nxt.append(node.right)\n        result.append(level)\n        queue = nxt\n    return result`,
        java: `static List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    Deque<TreeNode> queue = new ArrayDeque<>();\n    queue.add(root);\n    while (!queue.isEmpty()) {\n        List<Integer> level = new ArrayList<>();\n        int size = queue.size();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            level.add(node.val);\n            if (node.left != null) queue.add(node.left);\n            if (node.right != null) queue.add(node.right);\n        }\n        result.add(level);\n    }\n    return result;\n}`,
        c: `int levelOrder(TreeNode* root, int levels[16][16], int* levelSizes) {\n    if (!root) return 0;\n    TreeNode* queue[64]; int qHead = 0, qTail = 0;\n    queue[qTail++] = root;\n    int numLevels = 0;\n    while (qHead < qTail) {\n        int levelEnd = qTail, idx = 0;\n        for (int i = qHead; i < levelEnd; i++) {\n            TreeNode* node = queue[qHead++];\n            levels[numLevels][idx++] = node->val;\n            if (node->left) queue[qTail++] = node->left;\n            if (node->right) queue[qTail++] = node->right;\n        }\n        levelSizes[numLevels++] = idx;\n    }\n    return numLevels;\n}`,
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> result;\n    if (!root) return result;\n    deque<TreeNode*> queue{root};\n    while (!queue.empty()) {\n        vector<int> level;\n        size_t size = queue.size();\n        for (size_t i = 0; i < size; i++) {\n            TreeNode* node = queue.front(); queue.pop_front();\n            level.push_back(node->val);\n            if (node->left) queue.push_back(node->left);\n            if (node->right) queue.push_back(node->right);\n        }\n        result.push_back(level);\n    }\n    return result;\n}`,
      },
    },
    useCases: [
      'Rendering hierarchical UI trees (file explorers, org charts, comment threads) level by level',
      'Any breadth-first analysis of a tree-shaped structure: finding the "widest" level, serializing a tree for network transfer level-by-level, or computing per-depth aggregates',
    ],
    hints: [
      'BFS naturally visits nodes in level order — the trick is knowing where one level ends and the next begins.',
      'Snapshot the queue\u2019s size before processing it — that size is exactly how many nodes belong to the current level.',
    ],
    commonMistakes: [
      'Doing a plain BFS without tracking level boundaries, which produces a single flat list instead of grouped levels',
      'Using recursion with a depth parameter to bucket nodes by level (works fine and is also O(n) — a legitimate alternative, but easy to get the base cases wrong for missing children)',
    ],
  },

  // ===================================================================
  // 14. DIJKSTRA'S SHORTEST PATH
  // ===================================================================
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'algorithms',
    difficulty: 'hard',
    description: 'Given a weighted graph as an adjacency list (each node maps to an array of `[neighbor, weight]` pairs, all weights non-negative) and a `start` node, return an object mapping every node to its shortest distance from `start`.',
    constraints: ['All edge weights >= 0', 'Graph may be disconnected (unreachable nodes get Infinity)'],
    examples: [{ input: 'graph = {A:[["B",4],["C",1]], B:[["D",1]], C:[["B",1],["D",5]], D:[]}, start = "A"', output: '{A:0, B:2, C:1, D:3}' }],
    io: { kind: 'function', name: 'dijkstra' },
    testCases: [
      {
        args: [{ A: [['B', 4], ['C', 1]], B: [['D', 1]], C: [['B', 1], ['D', 5]], D: [] }, 'A'],
        expected: { A: 0, B: 2, C: 1, D: 3 },
      },
    ],
    languages: {
      javascript: { starter: 'function dijkstra(graph, start) {\n  \n}', requiredOptimal: [], requiredNaive: [] },
      python: {
        starter: 'def dijkstra(graph, start):\n    pass',
        requiredOptimal: [/heapq/, /heappush|heappop/],
        requiredNaive: [/float\(.inf.\)/, /for node in nodes/],
      },
      java: {
        starter: 'static Map<String, Integer> dijkstra(Map<String, List<Object[]>> graph, String start) {\n    \n}',
        requiredOptimal: [/priorityqueue/i],
      },
      c: {
        starter: 'void dijkstra(WNode* graph, int numNodes, int start, int* dist) {\n    \n}',
        requiredOptimal: [/heap\[/, /heappush|heappop/i],
      },
      cpp: {
        starter: 'map<string, int> dijkstra(map<string, vector<pair<string, int>>>& graph, const string& start) {\n    \n}',
        requiredOptimal: [/priority_queue/],
      },
    },
    optimal: {
      time: 'O((V + E) log V)', space: 'O(V)',
      explanation: 'Greedily expand the closest not-yet-finalized node using a min-heap keyed by current best distance. Each edge relaxation may push a new heap entry, giving O((V + E) log V) with a binary heap — the standard production approach for non-negative-weight shortest paths.',
      code: {
        javascript: `function dijkstra(graph, start) {\n  const dist = {}\n  for (const node of Object.keys(graph)) dist[node] = Infinity\n  dist[start] = 0\n  const visited = new Set()\n  const heap = [[0, start]] // [distance, node] pairs, min-heap by distance\n  function heapPush(item) {\n    heap.push(item)\n    let i = heap.length - 1\n    while (i > 0) {\n      const parent = (i - 1) >> 1\n      if (heap[parent][0] <= heap[i][0]) break\n      ;[heap[parent], heap[i]] = [heap[i], heap[parent]]\n      i = parent\n    }\n  }\n  function heapPop() {\n    const top = heap[0]\n    const last = heap.pop()\n    if (heap.length) {\n      heap[0] = last\n      let i = 0\n      while (true) {\n        const l = 2 * i + 1, r = 2 * i + 2\n        let smallest = i\n        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l\n        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r\n        if (smallest === i) break\n        ;[heap[i], heap[smallest]] = [heap[smallest], heap[i]]\n        i = smallest\n      }\n    }\n    return top\n  }\n  while (heap.length) {\n    const [d, node] = heapPop()\n    if (visited.has(node)) continue\n    visited.add(node)\n    for (const [neighbor, weight] of (graph[node] || [])) {\n      const nd = d + weight\n      if (nd < dist[neighbor]) { dist[neighbor] = nd; heapPush([nd, neighbor]) }\n    }\n  }\n  return dist\n}`,
        python: `import heapq\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    visited = set()\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if node in visited:\n            continue\n        visited.add(node)\n        for neighbor, weight in graph.get(node, []):\n            nd = d + weight\n            if nd < dist[neighbor]:\n                dist[neighbor] = nd\n                heapq.heappush(heap, (nd, neighbor))\n    return dist`,
        java: `static Map<String, Integer> dijkstra(Map<String, List<Object[]>> graph, String start) {\n    Map<String, Integer> dist = new HashMap<>();\n    for (String node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);\n    dist.put(start, 0);\n    PriorityQueue<Object[]> heap = new PriorityQueue<>(Comparator.comparingInt(o -> (int) o[0]));\n    heap.add(new Object[]{0, start});\n    Set<String> visited = new HashSet<>();\n    while (!heap.isEmpty()) {\n        Object[] top = heap.poll();\n        int d = (int) top[0];\n        String node = (String) top[1];\n        if (visited.contains(node)) continue;\n        visited.add(node);\n        for (Object[] edge : graph.getOrDefault(node, List.of())) {\n            String neighbor = (String) edge[0];\n            int weight = (int) edge[1];\n            int nd = d + weight;\n            if (nd < dist.get(neighbor)) { dist.put(neighbor, nd); heap.add(new Object[]{nd, neighbor}); }\n        }\n    }\n    return dist;\n}`,
        c: `typedef struct { int to, weight; } Edge;\ntypedef struct { Edge edges[8]; int count; } WNode;\ntypedef struct { int dist, node; } HeapItem;\nvoid heapPush(HeapItem* heap, int* size, HeapItem item) {\n    heap[*size] = item;\n    int i = (*size)++;\n    while (i > 0) {\n        int parent = (i - 1) / 2;\n        if (heap[parent].dist <= heap[i].dist) break;\n        HeapItem t = heap[parent]; heap[parent] = heap[i]; heap[i] = t;\n        i = parent;\n    }\n}\nHeapItem heapPop(HeapItem* heap, int* size) {\n    HeapItem top = heap[0];\n    heap[0] = heap[--(*size)];\n    int i = 0;\n    while (1) {\n        int l = 2*i+1, r = 2*i+2, smallest = i;\n        if (l < *size && heap[l].dist < heap[smallest].dist) smallest = l;\n        if (r < *size && heap[r].dist < heap[smallest].dist) smallest = r;\n        if (smallest == i) break;\n        HeapItem t = heap[i]; heap[i] = heap[smallest]; heap[smallest] = t;\n        i = smallest;\n    }\n    return top;\n}\nvoid dijkstra(WNode* graph, int numNodes, int start, int* dist) {\n    for (int i = 0; i < numNodes; i++) dist[i] = INT_MAX;\n    dist[start] = 0;\n    int visited[64] = {0};\n    HeapItem heap[256]; int heapSize = 0;\n    heapPush(heap, &heapSize, (HeapItem){0, start});\n    while (heapSize > 0) {\n        HeapItem top = heapPop(heap, &heapSize);\n        if (visited[top.node]) continue;\n        visited[top.node] = 1;\n        for (int i = 0; i < graph[top.node].count; i++) {\n            Edge e = graph[top.node].edges[i];\n            int nd = top.dist + e.weight;\n            if (nd < dist[e.to]) { dist[e.to] = nd; heapPush(heap, &heapSize, (HeapItem){nd, e.to}); }\n        }\n    }\n}`,
        cpp: `map<string, int> dijkstra(map<string, vector<pair<string, int>>>& graph, const string& start) {\n    map<string, int> dist;\n    for (auto& [node, _] : graph) dist[node] = INT_MAX;\n    dist[start] = 0;\n    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> heap;\n    heap.push({0, start});\n    set<string> visited;\n    while (!heap.empty()) {\n        auto [d, node] = heap.top(); heap.pop();\n        if (visited.count(node)) continue;\n        visited.insert(node);\n        for (auto& [neighbor, weight] : graph[node]) {\n            int nd = d + weight;\n            if (nd < dist[neighbor]) { dist[neighbor] = nd; heap.push({nd, neighbor}); }\n        }\n    }\n    return dist;\n}`,
      },
    },
    naive: {
      time: 'O(V^2)', space: 'O(V)',
      code: {
        javascript: `function dijkstra(graph, start) {\n  const dist = {}\n  for (const node of Object.keys(graph)) dist[node] = Infinity\n  dist[start] = 0\n  const visited = new Set()\n  const nodes = Object.keys(graph)\n  while (visited.size < nodes.length) {\n    let u = null, best = Infinity\n    for (const node of nodes) {\n      if (!visited.has(node) && dist[node] < best) { best = dist[node]; u = node }\n    }\n    if (u === null) break\n    visited.add(u)\n    for (const [neighbor, weight] of (graph[u] || [])) {\n      const nd = dist[u] + weight\n      if (nd < dist[neighbor]) dist[neighbor] = nd\n    }\n  }\n  return dist\n}`,
        python: `def dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    visited = set()\n    nodes = list(graph.keys())\n    while len(visited) < len(nodes):\n        u, best = None, float('inf')\n        for node in nodes:\n            if node not in visited and dist[node] < best:\n                best = dist[node]; u = node\n        if u is None:\n            break\n        visited.add(u)\n        for neighbor, weight in graph.get(u, []):\n            nd = dist[u] + weight\n            if nd < dist[neighbor]:\n                dist[neighbor] = nd\n    return dist`,
      },
    },
    useCases: [
      'GPS/road-network routing (shortest travel time/distance), with A* as its goal-directed extension',
      'Network routing protocols (OSPF-style link-state routing) and telecom/logistics least-cost-path planning',
    ],
    hints: [
      'At each step, scanning every node to find the closest unvisited one works, but you\u2019re repeating that full scan V times.',
      'A min-heap keyed by current best distance lets you grab the next closest node in O(log V) instead of O(V) — that\u2019s the whole difference.',
    ],
    commonMistakes: [
      'Linear-scanning for the minimum-distance unvisited node each iteration — correct (this is the "naive" O(V^2) Dijkstra taught in some courses) but doesn\u2019t scale to large sparse graphs',
      'Not skipping a node when popped from the heap with a stale (already-improved) distance, which can cause redundant or incorrect relaxations',
    ],
  },

  // ===================================================================
  // 15. UNION-FIND
  // ===================================================================
  {
    id: 'union-find',
    name: 'Union-Find (Disjoint Set)',
    category: 'dataStructures',
    difficulty: 'medium',
    description: 'Implement a Union-Find over `n` elements (labeled 0..n-1). Support `union(a, b)` (merge the sets containing a and b) and `connected(a, b)` (return whether a and b are in the same set).',
    constraints: ['1 <= n <= 10^4'],
    examples: [{ input: 'n=6; union(0,1); union(1,2); union(3,4)', output: 'connected(0,2) -> true, connected(0,3) -> false' }],
    io: { kind: 'class', name: 'UnionFind' },
    testCases: [
      {
        ctorArgs: [6],
        ops: [
          { call: 'union', args: [0, 1] },
          { call: 'union', args: [1, 2] },
          { call: 'union', args: [3, 4] },
          { call: 'connected', args: [0, 2], expected: true },
          { call: 'connected', args: [0, 3], expected: false },
          { call: 'connected', args: [3, 4], expected: true },
          { call: 'connected', args: [4, 5], expected: false },
        ],
      },
    ],
    languages: {
      javascript: {
        starter: 'class UnionFind {\n  constructor(n) {\n    \n  }\n  find(x) {\n    \n  }\n  union(a, b) {\n    \n  }\n  connected(a, b) {\n    \n  }\n}',
        requiredOptimal: [], requiredNaive: [],
      },
      python: {
        starter: 'class UnionFind:\n    def __init__(self, n):\n        pass\n    def find(self, x):\n        pass\n    def union(self, a, b):\n        pass\n    def connected(self, a, b):\n        pass',
        requiredOptimal: [/self\.rank/, /self\.parent\[x\]\s*=\s*self\.find\(self\.parent\[x\]\)/],
        requiredNaive: [/while self\.parent\[x\] != x/],
      },
      java: {
        starter: 'class UnionFind {\n    UnionFind(int n) {\n        \n    }\n    int find(int x) {\n        \n    }\n    void union(int a, int b) {\n        \n    }\n    boolean connected(int a, int b) {\n        \n    }\n}',
        requiredOptimal: [/rank/i, /parent\[x\]\s*=\s*find\(parent\[x\]\)/],
      },
      c: {
        starter: 'void ufInit(UnionFind* uf, int n);\nint ufFind(UnionFind* uf, int x);\nvoid ufUnion(UnionFind* uf, int a, int b);\nint ufConnected(UnionFind* uf, int a, int b);',
        requiredOptimal: [/rank/i, /parent\[x\]\s*=\s*uffind/i],
      },
      cpp: {
        starter: 'class UnionFind {\npublic:\n    UnionFind(int n) {\n        \n    }\n    int find(int x) {\n        \n    }\n    void unite(int a, int b) {\n        \n    }\n    bool connected(int a, int b) {\n        \n    }\n};',
        requiredOptimal: [/rank_?\[/i, /parent\[x\]\s*=\s*find\(/],
      },
    },
    optimal: {
      time: '~O(alpha(n)) amortized (effectively O(1))', space: 'O(n)',
      explanation: 'Two optimizations stack together: path compression (every `find` flattens the tree so future lookups are near-instant) and union by rank (always attach the shorter tree under the taller one, keeping trees flat). Together they bring each operation down to O(alpha(n)) amortized — alpha being the inverse Ackermann function, which is effectively a constant (<=4) for any n you could ever construct.',
      code: {
        javascript: `class UnionFind {\n  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i); this.rank = new Array(n).fill(0) }\n  find(x) {\n    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x])\n    return this.parent[x]\n  }\n  union(a, b) {\n    const ra = this.find(a), rb = this.find(b)\n    if (ra === rb) return\n    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb\n    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra\n    else { this.parent[rb] = ra; this.rank[ra]++ }\n  }\n  connected(a, b) { return this.find(a) === this.find(b) }\n}`,
        python: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return\n        if self.rank[ra] < self.rank[rb]:\n            self.parent[ra] = rb\n        elif self.rank[ra] > self.rank[rb]:\n            self.parent[rb] = ra\n        else:\n            self.parent[rb] = ra\n            self.rank[ra] += 1\n    def connected(self, a, b):\n        return self.find(a) == self.find(b)`,
        java: `class UnionFind {\n    int[] parent, rank;\n    UnionFind(int n) {\n        parent = new int[n]; rank = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);\n        return parent[x];\n    }\n    void union(int a, int b) {\n        int ra = find(a), rb = find(b);\n        if (ra == rb) return;\n        if (rank[ra] < rank[rb]) parent[ra] = rb;\n        else if (rank[ra] > rank[rb]) parent[rb] = ra;\n        else { parent[rb] = ra; rank[ra]++; }\n    }\n    boolean connected(int a, int b) { return find(a) == find(b); }\n}`,
        c: `typedef struct { int parent[10000]; int rank[10000]; } UnionFind;\nvoid ufInit(UnionFind* uf, int n) { for (int i = 0; i < n; i++) { uf->parent[i] = i; uf->rank[i] = 0; } }\nint ufFind(UnionFind* uf, int x) {\n    if (uf->parent[x] != x) uf->parent[x] = ufFind(uf, uf->parent[x]);\n    return uf->parent[x];\n}\nvoid ufUnion(UnionFind* uf, int a, int b) {\n    int ra = ufFind(uf, a), rb = ufFind(uf, b);\n    if (ra == rb) return;\n    if (uf->rank[ra] < uf->rank[rb]) uf->parent[ra] = rb;\n    else if (uf->rank[ra] > uf->rank[rb]) uf->parent[rb] = ra;\n    else { uf->parent[rb] = ra; uf->rank[ra]++; }\n}\nint ufConnected(UnionFind* uf, int a, int b) { return ufFind(uf, a) == ufFind(uf, b); }`,
        cpp: `class UnionFind {\n    vector<int> parent, rank_;\npublic:\n    UnionFind(int n) : parent(n), rank_(n, 0) { iota(parent.begin(), parent.end(), 0); }\n    int find(int x) { if (parent[x] != x) parent[x] = find(parent[x]); return parent[x]; }\n    void unite(int a, int b) {\n        int ra = find(a), rb = find(b);\n        if (ra == rb) return;\n        if (rank_[ra] < rank_[rb]) parent[ra] = rb;\n        else if (rank_[ra] > rank_[rb]) parent[rb] = ra;\n        else { parent[rb] = ra; rank_[ra]++; }\n    }\n    bool connected(int a, int b) { return find(a) == find(b); }\n};`,
      },
    },
    naive: {
      time: 'O(n) per op worst case', space: 'O(n)',
      code: {
        javascript: `class UnionFind {\n  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i) } // no rank, no path compression\n  find(x) { while (this.parent[x] !== x) x = this.parent[x]; return x }\n  union(a, b) { const ra = this.find(a), rb = this.find(b); if (ra !== rb) this.parent[ra] = rb }\n  connected(a, b) { return this.find(a) === this.find(b) }\n}`,
        python: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n    def find(self, x):\n        while self.parent[x] != x:\n            x = self.parent[x]\n        return x\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra != rb:\n            self.parent[ra] = rb\n    def connected(self, a, b):\n        return self.find(a) == self.find(b)`,
      },
    },
    useCases: [
      'Kruskal\u2019s minimum-spanning-tree algorithm uses Union-Find to detect cycles while adding edges',
      'Network connectivity queries, image-processing connected-component labeling, and "friend circles" / social-graph clustering',
    ],
    hints: [
      'Following parent pointers all the way to the root works, but on a skewed tree that chain can get long.',
      'Two tricks fix that: flatten the chain as you walk it (path compression), and always attach the smaller tree under the bigger one (union by rank) so chains stay short in the first place.',
    ],
    commonMistakes: [
      'Implementing `find` without path compression — correct, but a long chain of unions can degrade a single `find` to O(n)',
      'Union without rank/size — arbitrarily attaching one root under the other can build a tall, skewed tree over many unions',
    ],
  },

  // ===================================================================
  // 16. TRIE
  // ===================================================================
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    category: 'dataStructures',
    difficulty: 'medium',
    description: 'Implement a Trie with `insert(word)`, `search(word)` (exact match), and `startsWith(prefix)` (any inserted word begins with this prefix).',
    constraints: ['Words/prefixes are lowercase a-z', 'Up to 10^4 insert/search/startsWith calls'],
    examples: [{ input: 'insert("apple"); search("apple")', output: 'true' }, { input: 'search("app") before inserting "app"', output: 'false' }],
    io: { kind: 'class', name: 'Trie' },
    testCases: [
      {
        ctorArgs: [],
        ops: [
          { call: 'insert', args: ['apple'] },
          { call: 'search', args: ['apple'], expected: true },
          { call: 'search', args: ['app'], expected: false },
          { call: 'startsWith', args: ['app'], expected: true },
          { call: 'insert', args: ['app'] },
          { call: 'search', args: ['app'], expected: true },
        ],
      },
    ],
    languages: {
      javascript: {
        starter: 'class Trie {\n  constructor() {\n    \n  }\n  insert(word) {\n    \n  }\n  search(word) {\n    \n  }\n  startsWith(prefix) {\n    \n  }\n}',
        requiredOptimal: [], requiredNaive: [],
      },
      python: {
        starter: 'class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def starts_with(self, prefix):\n        pass',
        requiredOptimal: [/self\.root\s*=\s*\{\}/, /node\s*=\s*node\[ch\]|node\s*=\s*node\.setdefault/],
        requiredNaive: [/self\.words\s*=\s*\[\]/, /\.startswith\(/],
      },
      java: {
        starter: 'class Trie {\n    Trie() {\n        \n    }\n    void insert(String word) {\n        \n    }\n    boolean search(String word) {\n        \n    }\n    boolean startsWith(String prefix) {\n        \n    }\n}',
        requiredOptimal: [/map<character|hashmap<character/i],
      },
      c: {
        starter: 'void trieInit(Trie* t);\nvoid trieInsert(Trie* t, const char* word);\nint trieSearch(Trie* t, const char* word);\nint trieStartsWith(Trie* t, const char* prefix);',
        requiredOptimal: [/children\[/, /'a'/],
      },
      cpp: {
        starter: 'class Trie {\npublic:\n    Trie() {\n        \n    }\n    void insert(const string& word) {\n        \n    }\n    bool search(const string& word) {\n        \n    }\n    bool startsWith(const string& prefix) {\n        \n    }\n};',
        requiredOptimal: [/unordered_map\s*<\s*char|children\[/],
      },
    },
    optimal: {
      time: 'O(m) per operation (m = word/prefix length)', space: 'O(ALPHABET_SIZE * N)',
      explanation: 'Each node holds a map (or fixed 26-entry array for lowercase-only alphabets) from character to child node, plus an end-of-word flag. Insert/search/startsWith all just walk one character at a time from the root — the cost depends only on the length of the word/prefix, never on how many words are stored.',
      code: {
        javascript: `class Trie {\n  constructor() { this.root = {} }\n  insert(word) {\n    let node = this.root\n    for (const ch of word) { if (!(ch in node)) node[ch] = {}; node = node[ch] }\n    node.isEnd = true\n  }\n  search(word) {\n    let node = this.root\n    for (const ch of word) { if (!(ch in node)) return false; node = node[ch] }\n    return !!node.isEnd\n  }\n  startsWith(prefix) {\n    let node = this.root\n    for (const ch of prefix) { if (!(ch in node)) return false; node = node[ch] }\n    return true\n  }\n}`,
        python: `class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node['$'] = True\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node:\n                return False\n            node = node[ch]\n        return node.get('$', False)\n    def starts_with(self, prefix):\n        node = self.root\n        for ch in prefix:\n            if ch not in node:\n                return False\n            node = node[ch]\n        return True`,
        java: `class Trie {\n    Map<Character, Object> root = new HashMap<>();\n    static final Character END = '$';\n    @SuppressWarnings("unchecked")\n    void insert(String word) {\n        Map<Character, Object> node = root;\n        for (char ch : word.toCharArray()) node = (Map<Character, Object>) node.computeIfAbsent(ch, c -> new HashMap<Character, Object>());\n        node.put(END, true);\n    }\n    @SuppressWarnings("unchecked")\n    boolean search(String word) {\n        Map<Character, Object> node = root;\n        for (char ch : word.toCharArray()) {\n            if (!node.containsKey(ch)) return false;\n            node = (Map<Character, Object>) node.get(ch);\n        }\n        return node.containsKey(END);\n    }\n    @SuppressWarnings("unchecked")\n    boolean startsWith(String prefix) {\n        Map<Character, Object> node = root;\n        for (char ch : prefix.toCharArray()) {\n            if (!node.containsKey(ch)) return false;\n            node = (Map<Character, Object>) node.get(ch);\n        }\n        return true;\n    }\n}`,
        c: `typedef struct TrieNodeC { struct TrieNodeC* children[26]; int isEnd; } TrieNodeC;\ntypedef struct Trie { TrieNodeC* root; } Trie;\nTrieNodeC* trieNewNode(void) { return calloc(1, sizeof(TrieNodeC)); }\nvoid trieInit(Trie* t) { t->root = trieNewNode(); }\nvoid trieInsert(Trie* t, const char* word) {\n    TrieNodeC* node = t->root;\n    for (const char* p = word; *p; p++) {\n        int idx = *p - 'a';\n        if (!node->children[idx]) node->children[idx] = trieNewNode();\n        node = node->children[idx];\n    }\n    node->isEnd = 1;\n}\nint trieSearch(Trie* t, const char* word) {\n    TrieNodeC* node = t->root;\n    for (const char* p = word; *p; p++) {\n        int idx = *p - 'a';\n        if (!node->children[idx]) return 0;\n        node = node->children[idx];\n    }\n    return node->isEnd;\n}\nint trieStartsWith(Trie* t, const char* prefix) {\n    TrieNodeC* node = t->root;\n    for (const char* p = prefix; *p; p++) {\n        int idx = *p - 'a';\n        if (!node->children[idx]) return 0;\n        node = node->children[idx];\n    }\n    return 1;\n}`,
        cpp: `struct TrieNodeCpp { unordered_map<char, TrieNodeCpp*> children; bool isEnd = false; };\nclass Trie {\n    TrieNodeCpp* root;\npublic:\n    Trie() { root = new TrieNodeCpp(); }\n    void insert(const string& word) {\n        TrieNodeCpp* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) node->children[ch] = new TrieNodeCpp();\n            node = node->children[ch];\n        }\n        node->isEnd = true;\n    }\n    bool search(const string& word) {\n        TrieNodeCpp* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->isEnd;\n    }\n    bool startsWith(const string& prefix) {\n        TrieNodeCpp* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};`,
      },
    },
    naive: {
      time: 'O(n*m) per op (n = word count, m = length)', space: 'O(n*m)',
      code: {
        javascript: `class Trie {\n  constructor() { this.words = [] }\n  insert(word) { this.words.push(word) }\n  search(word) { return this.words.includes(word) }\n  startsWith(prefix) { return this.words.some(w => w.startsWith(prefix)) }\n}`,
        python: `class Trie:\n    def __init__(self):\n        self.words = []\n    def insert(self, word):\n        self.words.append(word)\n    def search(self, word):\n        return word in self.words\n    def starts_with(self, prefix):\n        return any(w.startswith(prefix) for w in self.words)`,
      },
    },
    useCases: [
      'Autocomplete and search-as-you-type suggestions (the whole reason this structure exists)',
      'IP routing tables (longest-prefix match), spell-checkers, and T9/predictive-text input',
    ],
    hints: [
      'Storing all words in a list and scanning them on every search works, but gets slower as your dictionary grows.',
      'What if each node in a tree represented "one more character matched so far," shared across every word with that prefix? Then a search only costs as much as the word\u2019s length — never the number of words stored.',
    ],
    commonMistakes: [
      'Storing words in a flat list and using `startswith`/`includes` — correct but re-scans every word on every call',
      'Forgetting the end-of-word marker, which makes `search("app")` incorrectly return true just because "apple" shares that prefix',
    ],
  },
]

if (typeof module !== 'undefined' && module.exports) module.exports = { PROBLEMS }
