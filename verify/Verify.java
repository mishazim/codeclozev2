// Fact-check harness for every Java optimal reference solution.
// Run: javac Verify.java && java Verify
// Not shipped to the browser (v2 grades Java by pattern-matching, not execution) —
// dev-time correctness check before code gets transcribed into data.js.
import java.util.*;

public class Verify {
    static int pass = 0, fail = 0;

    static void check(String label, Object actual, Object expected) {
        boolean ok;
        if (actual instanceof int[] && expected instanceof int[]) {
            ok = Arrays.equals((int[]) actual, (int[]) expected);
        } else if (actual instanceof List && expected instanceof List) {
            ok = actual.equals(expected);
        } else {
            ok = Objects.equals(actual, expected);
        }
        if (ok) { pass++; }
        else {
            fail++;
            System.out.println("FAIL " + label + "\n  expected: " + describe(expected) + "\n  actual:   " + describe(actual));
        }
    }
    static String describe(Object o) {
        if (o instanceof int[]) return Arrays.toString((int[]) o);
        return String.valueOf(o);
    }

    // ---------- shared helpers ----------
    static class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }
    static ListNode arrayToList(int[] arr) {
        ListNode head = null, tail = null;
        for (int v : arr) {
            ListNode n = new ListNode(v);
            if (head == null) { head = n; tail = n; } else { tail.next = n; tail = n; }
        }
        return head;
    }
    static List<Integer> listToArray(ListNode head) {
        List<Integer> out = new ArrayList<>();
        while (head != null) { out.add(head.val); head = head.next; }
        return out;
    }
    static class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
    static TreeNode arrayToTree(Integer[] arr) {
        if (arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {
            TreeNode node = q.poll();
            if (i < arr.length) { Integer v = arr[i++]; if (v != null) { node.left = new TreeNode(v); q.add(node.left); } }
            if (i < arr.length) { Integer v = arr[i++]; if (v != null) { node.right = new TreeNode(v); q.add(node.right); } }
        }
        return root;
    }

    // =====================================================================
    // 1. TWO SUM — optimal: hash map, O(n)/O(n)
    // =====================================================================
    static int[] twoSumOptimal(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }

    // =====================================================================
    // 2. BINARY SEARCH — optimal: O(log n)/O(1)
    // =====================================================================
    static int binarySearchOptimal(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // =====================================================================
    // 3. MERGE SORT — optimal: O(n log n)/O(n)
    // =====================================================================
    static int[] mergeSortOptimal(int[] arr) {
        if (arr.length <= 1) return arr.clone();
        int mid = arr.length / 2;
        int[] left = mergeSortOptimal(Arrays.copyOfRange(arr, 0, mid));
        int[] right = mergeSortOptimal(Arrays.copyOfRange(arr, mid, arr.length));
        int[] merged = new int[arr.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) merged[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.length) merged[k++] = left[i++];
        while (j < right.length) merged[k++] = right[j++];
        return merged;
    }

    // =====================================================================
    // 4. QUICK SORT — optimal: average O(n log n)/O(log n)
    // =====================================================================
    static int[] quickSortOptimal(int[] arr) {
        int[] a = arr.clone();
        quickSortHelper(a, 0, a.length - 1);
        return a;
    }
    static void quickSortHelper(int[] a, int lo, int hi) {
        if (lo < hi) {
            int p = partition(a, lo, hi);
            quickSortHelper(a, lo, p - 1);
            quickSortHelper(a, p + 1, hi);
        }
    }
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi], i = lo;
        for (int j = lo; j < hi; j++) {
            if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
        }
        int t = a[i]; a[i] = a[hi]; a[hi] = t;
        return i;
    }

    // =====================================================================
    // 5. BFS — optimal: O(V+E)/O(V)
    // =====================================================================
    static List<String> bfsOptimal(Map<String, List<String>> graph, String start) {
        Set<String> visited = new HashSet<>(Collections.singletonList(start));
        Deque<String> queue = new ArrayDeque<>(Collections.singletonList(start));
        List<String> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            String node = queue.poll();
            order.add(node);
            for (String neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) { visited.add(neighbor); queue.add(neighbor); }
            }
        }
        return order;
    }

    // =====================================================================
    // 6. DFS — optimal: O(V+E)/O(V)
    // =====================================================================
    static List<String> dfsOptimal(Map<String, List<String>> graph, String start) {
        Set<String> visited = new HashSet<>();
        List<String> order = new ArrayList<>();
        dfsVisit(graph, start, visited, order);
        return order;
    }
    static void dfsVisit(Map<String, List<String>> graph, String node, Set<String> visited, List<String> order) {
        if (visited.contains(node)) return;
        visited.add(node);
        order.add(node);
        for (String neighbor : graph.getOrDefault(node, Collections.emptyList())) dfsVisit(graph, neighbor, visited, order);
    }

    // =====================================================================
    // 7. VALID PARENTHESES — optimal: stack, O(n)/O(n)
    // =====================================================================
    static boolean validParensOptimal(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        for (char ch : s.toCharArray()) {
            if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);
            else if (pairs.containsKey(ch)) {
                if (stack.isEmpty() || stack.pop() != pairs.get(ch)) return false;
            }
        }
        return stack.isEmpty();
    }

    // =====================================================================
    // 8. LRU CACHE — optimal: LinkedHashMap (hash map + doubly linked list), O(1)/O(capacity)
    // =====================================================================
    static class LRUCacheOptimal {
        int capacity;
        LinkedHashMap<Integer, Integer> map;
        LRUCacheOptimal(int capacity) {
            this.capacity = capacity;
            this.map = new LinkedHashMap<>(16, 0.75f, true);
        }
        Integer get(int key) {
            if (!map.containsKey(key)) return -1;
            return map.get(key);
        }
        void put(int key, int value) {
            if (map.size() >= capacity && !map.containsKey(key)) {
                Iterator<Integer> it = map.keySet().iterator();
                it.next(); it.remove();
            }
            map.put(key, value);
        }
    }
    static List<Object> runLRU() {
        LRUCacheOptimal c = new LRUCacheOptimal(2);
        List<Object> results = new ArrayList<>();
        c.put(1, 1); results.add(null);
        c.put(2, 2); results.add(null);
        results.add(c.get(1));
        c.put(3, 3); results.add(null);
        results.add(c.get(2));
        c.put(4, 4); results.add(null);
        results.add(c.get(1));
        results.add(c.get(3));
        results.add(c.get(4));
        return results;
    }

    // =====================================================================
    // 9. LINKED LIST REVERSAL — optimal: iterative, O(n)/O(1)
    // =====================================================================
    static ListNode reverseListOptimal(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    // =====================================================================
    // 10. FLOYD'S CYCLE DETECTION — optimal: two-pointer, O(n)/O(1)
    // =====================================================================
    static boolean hasCycleOptimal(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
    static ListNode makeCyclicList(int[] arr, int pos) {
        if (arr.length == 0) return null;
        ListNode[] nodes = new ListNode[arr.length];
        for (int i = 0; i < arr.length; i++) nodes[i] = new ListNode(arr[i]);
        for (int i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
        if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
        return nodes[0];
    }

    // =====================================================================
    // 11. KADANE'S ALGORITHM — optimal: O(n)/O(1)
    // =====================================================================
    static int kadaneOptimal(int[] nums) {
        int best = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            best = Math.max(best, curr);
        }
        return best;
    }

    // =====================================================================
    // 12. SLIDING WINDOW MAXIMUM — optimal: monotonic deque, O(n)/O(k)
    // =====================================================================
    static int[] slidingWindowMaxOptimal(int[] nums, int k) {
        Deque<Integer> deque = new ArrayDeque<>();
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast();
            deque.addLast(i);
            if (i >= k - 1) result.add(nums[deque.peekFirst()]);
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    // =====================================================================
    // 13. BINARY TREE LEVEL ORDER — optimal: BFS with queue, O(n)/O(n)
    // =====================================================================
    static List<List<Integer>> levelOrderOptimal(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            result.add(level);
        }
        return result;
    }

    // =====================================================================
    // 14. DIJKSTRA'S SHORTEST PATH — optimal: binary heap, O((V+E) log V)/O(V)
    // =====================================================================
    static Map<String, Integer> dijkstraOptimal(Map<String, List<int[]>> indexedGraph, List<String> names, String start) {
        // names[i] <-> index i; indexedGraph keyed by name for convenience but edges reference indices via names list order
        return null; // placeholder unused - see dijkstraOptimalByName below
    }
    static Map<String, Integer> dijkstraOptimalByName(Map<String, List<Object[]>> graph, String start) {
        Map<String, Integer> dist = new HashMap<>();
        for (String node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);
        dist.put(start, 0);
        PriorityQueue<Object[]> heap = new PriorityQueue<>(Comparator.comparingInt(o -> (int) o[0]));
        heap.add(new Object[]{0, start});
        Set<String> visited = new HashSet<>();
        while (!heap.isEmpty()) {
            Object[] top = heap.poll();
            int d = (int) top[0];
            String node = (String) top[1];
            if (visited.contains(node)) continue;
            visited.add(node);
            for (Object[] edge : graph.getOrDefault(node, Collections.emptyList())) {
                String neighbor = (String) edge[0];
                int weight = (int) edge[1];
                int nd = d + weight;
                if (nd < dist.get(neighbor)) { dist.put(neighbor, nd); heap.add(new Object[]{nd, neighbor}); }
            }
        }
        return dist;
    }

    // =====================================================================
    // 15. UNION-FIND — optimal: path compression + union by rank, ~O(alpha(n))
    // =====================================================================
    static class UnionFindOptimal {
        int[] parent, rank;
        UnionFindOptimal(int n) {
            parent = new int[n]; rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        }
        void union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return;
            if (rank[ra] < rank[rb]) parent[ra] = rb;
            else if (rank[ra] > rank[rb]) parent[rb] = ra;
            else { parent[rb] = ra; rank[ra]++; }
        }
        boolean connected(int a, int b) { return find(a) == find(b); }
    }

    // =====================================================================
    // 16. TRIE — optimal: nested map nodes, O(m) per op
    // =====================================================================
    static class TrieOptimal {
        Map<Character, Object> root = new HashMap<>();
        static final Character END = '$';
        @SuppressWarnings("unchecked")
        void insert(String word) {
            Map<Character, Object> node = root;
            for (char ch : word.toCharArray()) {
                node = (Map<Character, Object>) node.computeIfAbsent(ch, c -> new HashMap<Character, Object>());
            }
            node.put(END, true);
        }
        @SuppressWarnings("unchecked")
        boolean search(String word) {
            Map<Character, Object> node = root;
            for (char ch : word.toCharArray()) {
                if (!node.containsKey(ch)) return false;
                node = (Map<Character, Object>) node.get(ch);
            }
            return node.containsKey(END);
        }
        @SuppressWarnings("unchecked")
        boolean startsWith(String prefix) {
            Map<Character, Object> node = root;
            for (char ch : prefix.toCharArray()) {
                if (!node.containsKey(ch)) return false;
                node = (Map<Character, Object>) node.get(ch);
            }
            return true;
        }
    }

    // =====================================================================
    // 17. HEAPSORT — optimal: in-place binary heap, O(n log n)/O(1)
    // =====================================================================
    static int[] heapSort(int[] arr) {
        int[] a = arr.clone();
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
        for (int i = n - 1; i > 0; i--) {
            int t = a[0]; a[0] = a[i]; a[i] = t;
            heapify(a, i, 0);
        }
        return a;
    }
    static void heapify(int[] a, int size, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < size && a[l] > a[largest]) largest = l;
        if (r < size && a[r] > a[largest]) largest = r;
        if (largest != i) {
            int t = a[i]; a[i] = a[largest]; a[largest] = t;
            heapify(a, size, largest);
        }
    }

    // =====================================================================
    // 18. INSERTION SORT — optimal: adaptive shift, O(n^2) worst/O(n) best
    // =====================================================================
    static int[] insertionSort(int[] arr) {
        int[] a = arr.clone();
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
        return a;
    }

    // =====================================================================
    // 19. COUNTING SORT — optimal: O(n+k)/O(n+k)
    // =====================================================================
    static int[] countingSort(int[] arr) {
        if (arr.length == 0) return new int[]{};
        int max = arr[0];
        for (int n : arr) max = Math.max(max, n);
        int[] counts = new int[max + 1];
        for (int n : arr) counts[n]++;
        int[] result = new int[arr.length];
        int idx = 0;
        for (int v = 0; v <= max; v++) {
            for (int c = 0; c < counts[v]; c++) result[idx++] = v;
        }
        return result;
    }

    // =====================================================================
    // 20. RADIX SORT — optimal: LSD digit-by-digit, O(d*(n+k))
    // =====================================================================
    static int[] radixSort(int[] arr) {
        if (arr.length == 0) return new int[]{};
        int[] result = arr.clone();
        int max = result[0];
        for (int n : result) max = Math.max(max, n);
        for (int exp = 1; max / exp > 0; exp *= 10) {
            int[] counts = new int[10];
            for (int n : result) counts[(n / exp) % 10]++;
            for (int i = 1; i < 10; i++) counts[i] += counts[i - 1];
            int[] output = new int[result.length];
            for (int i = result.length - 1; i >= 0; i--) {
                int digit = (result[i] / exp) % 10;
                output[--counts[digit]] = result[i];
            }
            result = output;
        }
        return result;
    }

    // =====================================================================
    // 21. BUCKET SORT — optimal: distribute + per-bucket insertion sort, O(n+k) average
    // =====================================================================
    static double[] bucketSort(double[] arr) {
        int n = arr.length;
        if (n == 0) return new double[]{};
        List<List<Double>> buckets = new ArrayList<>();
        for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());
        for (double v : arr) {
            int idx = (int) (v * n);
            if (idx >= n) idx = n - 1;
            buckets.get(idx).add(v);
        }
        for (List<Double> bucket : buckets) {
            for (int i = 1; i < bucket.size(); i++) {
                double key = bucket.get(i);
                int j = i - 1;
                while (j >= 0 && bucket.get(j) > key) {
                    bucket.set(j + 1, bucket.get(j));
                    j--;
                }
                bucket.set(j + 1, key);
            }
        }
        double[] result = new double[n];
        int idx = 0;
        for (List<Double> bucket : buckets) for (double v : bucket) result[idx++] = v;
        return result;
    }

    public static void main(String[] args) {
        // 1. Two Sum
        int[][][] twoSumInputs = {{{2, 7, 11, 15}, {9}}, {{3, 2, 4}, {6}}, {{3, 3}, {6}}, {{1, 2, 3, 4, 5}, {9}}};
        int[][] twoSumExpected = {{0, 1}, {1, 2}, {0, 1}, {3, 4}};
        for (int i = 0; i < twoSumInputs.length; i++) {
            check("twoSumOptimal", twoSumOptimal(twoSumInputs[i][0], twoSumInputs[i][1][0]), twoSumExpected[i]);
        }

        // 2. Binary Search
        int[] bsArr = {1, 3, 5, 7, 9, 11};
        check("binarySearchOptimal", binarySearchOptimal(bsArr, 7), 3);
        check("binarySearchOptimal", binarySearchOptimal(bsArr, 1), 0);
        check("binarySearchOptimal", binarySearchOptimal(bsArr, 11), 5);
        check("binarySearchOptimal", binarySearchOptimal(bsArr, 4), -1);
        check("binarySearchOptimal", binarySearchOptimal(new int[]{}, 5), -1);

        // 3+4. Merge/Quick Sort
        int[][] sortCases = {{5, 3, 8, 1, 9, 2}, {}, {1}, {2, 2, 1, 1}, {5, 4, 3, 2, 1}};
        int[][] sortExpected = {{1, 2, 3, 5, 8, 9}, {}, {1}, {1, 1, 2, 2}, {1, 2, 3, 4, 5}};
        for (int i = 0; i < sortCases.length; i++) {
            check("mergeSortOptimal", mergeSortOptimal(sortCases[i]), sortExpected[i]);
            check("quickSortOptimal", quickSortOptimal(sortCases[i]), sortExpected[i]);
        }

        // 5. BFS
        Map<String, List<String>> bfsGraph = new LinkedHashMap<>();
        bfsGraph.put("A", List.of("B", "C"));
        bfsGraph.put("B", List.of("A", "D"));
        bfsGraph.put("C", List.of("A", "D"));
        bfsGraph.put("D", List.of("B", "C", "E"));
        bfsGraph.put("E", List.of("D"));
        check("bfsOptimal", bfsOptimal(bfsGraph, "A"), List.of("A", "B", "C", "D", "E"));
        Map<String, List<String>> cyc = new LinkedHashMap<>();
        cyc.put("A", List.of("B")); cyc.put("B", List.of("A"));
        check("bfsOptimal-cycle", bfsOptimal(cyc, "A"), List.of("A", "B"));

        // 6. DFS
        Map<String, List<String>> dfsGraph = new LinkedHashMap<>();
        dfsGraph.put("A", List.of("B", "C"));
        dfsGraph.put("B", List.of("D"));
        dfsGraph.put("C", List.of("D"));
        dfsGraph.put("D", List.of());
        check("dfsOptimal", dfsOptimal(dfsGraph, "A"), List.of("A", "B", "D", "C"));
        check("dfsOptimal-cycle", dfsOptimal(cyc, "A"), List.of("A", "B"));

        // 7. Valid Parentheses
        check("validParensOptimal", validParensOptimal("()[]{}"), true);
        check("validParensOptimal", validParensOptimal("(]"), false);
        check("validParensOptimal", validParensOptimal("([)]"), false);
        check("validParensOptimal", validParensOptimal("{[]}"), true);
        check("validParensOptimal", validParensOptimal(""), true);
        check("validParensOptimal", validParensOptimal("((("), false);

        // 8. LRU Cache
        List<Object> lruExpected = Arrays.asList(null, null, 1, null, -1, null, -1, 3, 4);
        check("LRUCacheOptimal", runLRU(), lruExpected);

        // 9. Linked List Reversal
        int[][] llCases = {{1, 2, 3, 4, 5}, {1}, {}};
        Integer[][] llExpected = {{5, 4, 3, 2, 1}, {1}, {}};
        for (int i = 0; i < llCases.length; i++) {
            check("reverseListOptimal", listToArray(reverseListOptimal(arrayToList(llCases[i]))), Arrays.asList(llExpected[i]));
        }

        // 10. Floyd's Cycle Detection
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList(new int[]{3, 2, 0, -4}, 1)), true);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList(new int[]{1, 2}, 0)), true);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList(new int[]{1}, -1)), false);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList(new int[]{1, 2, 3}, -1)), false);

        // 11. Kadane's
        check("kadaneOptimal", kadaneOptimal(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}), 6);
        check("kadaneOptimal", kadaneOptimal(new int[]{1}), 1);
        check("kadaneOptimal", kadaneOptimal(new int[]{5, 4, -1, 7, 8}), 23);
        check("kadaneOptimal", kadaneOptimal(new int[]{-1, -2, -3}), -1);

        // 12. Sliding Window Maximum
        check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3), new int[]{3, 3, 5, 5, 6, 7});
        check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(new int[]{1}, 1), new int[]{1});
        check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(new int[]{9, 8, 7, 6}, 2), new int[]{9, 8, 7});

        // 13. Binary Tree Level Order
        check("levelOrderOptimal", levelOrderOptimal(arrayToTree(new Integer[]{3, 9, 20, null, null, 15, 7})),
                List.of(List.of(3), List.of(9, 20), List.of(15, 7)));
        check("levelOrderOptimal-single", levelOrderOptimal(arrayToTree(new Integer[]{1})), List.of(List.of(1)));
        check("levelOrderOptimal-empty", levelOrderOptimal(arrayToTree(new Integer[]{})), List.of());

        // 14. Dijkstra
        Map<String, List<Object[]>> dijkstraGraph = new LinkedHashMap<>();
        dijkstraGraph.put("A", List.<Object[]>of(new Object[]{"B", 4}, new Object[]{"C", 1}));
        dijkstraGraph.put("B", List.<Object[]>of(new Object[]{"D", 1}));
        dijkstraGraph.put("C", List.<Object[]>of(new Object[]{"B", 1}, new Object[]{"D", 5}));
        dijkstraGraph.put("D", List.<Object[]>of());
        Map<String, Integer> dijkstraExpected = Map.of("A", 0, "B", 2, "C", 1, "D", 3);
        check("dijkstraOptimal", dijkstraOptimalByName(dijkstraGraph, "A"), dijkstraExpected);

        // 15. Union-Find
        UnionFindOptimal uf = new UnionFindOptimal(6);
        uf.union(0, 1); uf.union(1, 2); uf.union(3, 4);
        check("UnionFindOptimal", List.of(uf.connected(0, 2), uf.connected(0, 3), uf.connected(3, 4), uf.connected(4, 5)),
                List.of(true, false, true, false));

        // 16. Trie
        TrieOptimal t = new TrieOptimal();
        t.insert("apple");
        List<Boolean> trieOut = new ArrayList<>(List.of(t.search("apple"), t.search("app"), t.startsWith("app")));
        t.insert("app");
        trieOut.add(t.search("app"));
        check("TrieOptimal", trieOut, List.of(true, false, true, true));

        // 17-20. Heapsort / Insertion Sort / Counting Sort / Radix Sort (share sortCases)
        for (int i = 0; i < sortCases.length; i++) {
            check("heapSort", heapSort(sortCases[i]), sortExpected[i]);
            check("insertionSort", insertionSort(sortCases[i]), sortExpected[i]);
        }
        int[][] countingCases = {{4, 2, 2, 8, 3, 3, 1}, {}, {1}, {5, 5, 5}, {0, 0, 3, 1, 2}};
        int[][] countingExpected = {{1, 2, 2, 3, 3, 4, 8}, {}, {1}, {5, 5, 5}, {0, 0, 1, 2, 3}};
        for (int i = 0; i < countingCases.length; i++) {
            check("countingSort", countingSort(countingCases[i]), countingExpected[i]);
        }
        int[][] radixCases = {{170, 45, 75, 90, 802, 24, 2, 66}, {}, {5}, {100, 10, 1}, {0, 0, 0}};
        int[][] radixExpected = {{2, 24, 45, 66, 75, 90, 170, 802}, {}, {5}, {1, 10, 100}, {0, 0, 0}};
        for (int i = 0; i < radixCases.length; i++) {
            check("radixSort", radixSort(radixCases[i]), radixExpected[i]);
        }

        // 21. Bucket Sort
        double[][] bucketCases = {
            {0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68},
            {}, {0.5}, {0.9, 0.9, 0.1}, {0.1, 0.2, 0.3},
        };
        double[][] bucketExpected = {
            {0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94},
            {}, {0.5}, {0.1, 0.9, 0.9}, {0.1, 0.2, 0.3},
        };
        for (int i = 0; i < bucketCases.length; i++) {
            List<Double> actual = new ArrayList<>();
            for (double v : bucketSort(bucketCases[i])) actual.add(v);
            List<Double> expected = new ArrayList<>();
            for (double v : bucketExpected[i]) expected.add(v);
            check("bucketSort", actual, expected);
        }

        System.out.println("\n" + pass + " passed, " + fail + " failed");
        if (fail > 0) System.exit(1);
    }
}
