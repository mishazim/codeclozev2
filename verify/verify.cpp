// Fact-check harness for every C++ optimal reference solution.
// Run: g++ -std=c++17 -O2 verify.cpp -o verify_cpp && ./verify_cpp
// Not shipped to the browser (v2 grades C++ by pattern-matching, not execution) —
// dev-time correctness check before code gets transcribed into data.js.
#include <bits/stdc++.h>
using namespace std;

static int pass_ = 0, fail_ = 0;

// ostream helpers for vector/pair-ish printing (must precede check<>, needed at template definition point)
template <typename T>
ostream& operator<<(ostream& os, const vector<T>& v) {
    os << "["; for (size_t i = 0; i < v.size(); i++) { if (i) os << ","; os << v[i]; } os << "]"; return os;
}

template <typename A, typename B>
void check(const string& label, const A& actual, const B& expected) {
    ostringstream as, es;
    as << boolalpha << actual;
    es << boolalpha << expected;
    if (as.str() == es.str()) { pass_++; }
    else { fail_++; cout << "FAIL " << label << "\n  expected: " << es.str() << "\n  actual:   " << as.str() << "\n"; }
}

// ---------- shared helpers ----------
struct ListNode { int val; ListNode* next; ListNode(int v) : val(v), next(nullptr) {} };
ListNode* arrayToList(const vector<int>& arr) {
    ListNode *head = nullptr, *tail = nullptr;
    for (int v : arr) {
        ListNode* n = new ListNode(v);
        if (!head) { head = n; tail = n; } else { tail->next = n; tail = n; }
    }
    return head;
}
vector<int> listToArray(ListNode* head) {
    vector<int> out;
    while (head) { out.push_back(head->val); head = head->next; }
    return out;
}
struct TreeNode { int val; TreeNode *left, *right; TreeNode(int v) : val(v), left(nullptr), right(nullptr) {} };
TreeNode* arrayToTree(const vector<optional<int>>& arr) {
    if (arr.empty() || !arr[0].has_value()) return nullptr;
    TreeNode* root = new TreeNode(*arr[0]);
    deque<TreeNode*> q{root};
    size_t i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop_front();
        if (i < arr.size()) { auto v = arr[i++]; if (v.has_value()) { node->left = new TreeNode(*v); q.push_back(node->left); } }
        if (i < arr.size()) { auto v = arr[i++]; if (v.has_value()) { node->right = new TreeNode(*v); q.push_back(node->right); } }
    }
    return root;
}

// =====================================================================
// 1. TWO SUM — optimal: hash map, O(n)/O(n)
// =====================================================================
vector<int> twoSumOptimal(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        auto it = seen.find(complement);
        if (it != seen.end()) return {it->second, i};
        seen[nums[i]] = i;
    }
    return {};
}

// =====================================================================
// 2. BINARY SEARCH — optimal: O(log n)/O(1)
// =====================================================================
int binarySearchOptimal(vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// =====================================================================
// 3. MERGE SORT — optimal: O(n log n)/O(n)
// =====================================================================
vector<int> mergeSortOptimal(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid), right(arr.begin() + mid, arr.end());
    left = mergeSortOptimal(left);
    right = mergeSortOptimal(right);
    vector<int> merged;
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size()) merged.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.size()) merged.push_back(left[i++]);
    while (j < right.size()) merged.push_back(right[j++]);
    return merged;
}

// =====================================================================
// 4. QUICK SORT — optimal: average O(n log n)/O(log n)
// =====================================================================
int partition_(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) if (a[j] < pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}
void quickSortHelper(vector<int>& a, int lo, int hi) {
    if (lo < hi) { int p = partition_(a, lo, hi); quickSortHelper(a, lo, p - 1); quickSortHelper(a, p + 1, hi); }
}
vector<int> quickSortOptimal(vector<int> arr) {
    quickSortHelper(arr, 0, (int)arr.size() - 1);
    return arr;
}

// =====================================================================
// 5. BFS — optimal: O(V+E)/O(V)
// =====================================================================
vector<string> bfsOptimal(map<string, vector<string>>& graph, const string& start) {
    set<string> visited{start};
    deque<string> queue{start};
    vector<string> order;
    while (!queue.empty()) {
        string node = queue.front(); queue.pop_front();
        order.push_back(node);
        for (auto& neighbor : graph[node]) {
            if (!visited.count(neighbor)) { visited.insert(neighbor); queue.push_back(neighbor); }
        }
    }
    return order;
}

// =====================================================================
// 6. DFS — optimal: O(V+E)/O(V)
// =====================================================================
void dfsVisit(map<string, vector<string>>& graph, const string& node, set<string>& visited, vector<string>& order) {
    if (visited.count(node)) return;
    visited.insert(node);
    order.push_back(node);
    for (auto& neighbor : graph[node]) dfsVisit(graph, neighbor, visited, order);
}
vector<string> dfsOptimal(map<string, vector<string>>& graph, const string& start) {
    set<string> visited;
    vector<string> order;
    dfsVisit(graph, start, visited, order);
    return order;
}

// =====================================================================
// 7. VALID PARENTHESES — optimal: stack, O(n)/O(n)
// =====================================================================
bool validParensOptimal(const string& s) {
    vector<char> stack;
    map<char, char> pairs{{')', '('}, {']', '['}, {'}', '{'}};
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') stack.push_back(ch);
        else if (pairs.count(ch)) {
            if (stack.empty() || stack.back() != pairs[ch]) return false;
            stack.pop_back();
        }
    }
    return stack.empty();
}

// =====================================================================
// 8. LRU CACHE — optimal: hash map + doubly linked list, O(1)/O(capacity)
// =====================================================================
class LRUCacheOptimal {
    int capacity;
    list<pair<int, int>> order; // front = most recently used
    unordered_map<int, list<pair<int, int>>::iterator> map_;
public:
    LRUCacheOptimal(int cap) : capacity(cap) {}
    int get(int key) {
        auto it = map_.find(key);
        if (it == map_.end()) return -1;
        order.splice(order.begin(), order, it->second);
        return it->second->second;
    }
    void put(int key, int value) {
        auto it = map_.find(key);
        if (it != map_.end()) { order.erase(it->second); map_.erase(it); }
        else if ((int)order.size() >= capacity) { map_.erase(order.back().first); order.pop_back(); }
        order.push_front({key, value});
        map_[key] = order.begin();
    }
};
vector<optional<int>> runLRU() {
    LRUCacheOptimal c(2);
    vector<optional<int>> results;
    c.put(1, 1); results.push_back(nullopt);
    c.put(2, 2); results.push_back(nullopt);
    results.push_back(c.get(1));
    c.put(3, 3); results.push_back(nullopt);
    results.push_back(c.get(2));
    c.put(4, 4); results.push_back(nullopt);
    results.push_back(c.get(1));
    results.push_back(c.get(3));
    results.push_back(c.get(4));
    return results;
}

// =====================================================================
// 9. LINKED LIST REVERSAL — optimal: iterative, O(n)/O(1)
// =====================================================================
ListNode* reverseListOptimal(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// =====================================================================
// 10. FLOYD'S CYCLE DETECTION — optimal: two-pointer, O(n)/O(1)
// =====================================================================
bool hasCycleOptimal(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
ListNode* makeCyclicList(const vector<int>& arr, int pos) {
    if (arr.empty()) return nullptr;
    vector<ListNode*> nodes;
    for (int v : arr) nodes.push_back(new ListNode(v));
    for (size_t i = 0; i + 1 < nodes.size(); i++) nodes[i]->next = nodes[i + 1];
    if (pos >= 0) nodes.back()->next = nodes[pos];
    return nodes[0];
}

// =====================================================================
// 11. KADANE'S ALGORITHM — optimal: O(n)/O(1)
// =====================================================================
int kadaneOptimal(vector<int>& nums) {
    int best = nums[0], curr = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        curr = max(nums[i], curr + nums[i]);
        best = max(best, curr);
    }
    return best;
}

// =====================================================================
// 12. SLIDING WINDOW MAXIMUM — optimal: monotonic deque, O(n)/O(k)
// =====================================================================
vector<int> slidingWindowMaxOptimal(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}

// =====================================================================
// 13. BINARY TREE LEVEL ORDER — optimal: BFS with queue, O(n)/O(n)
// =====================================================================
vector<vector<int>> levelOrderOptimal(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    deque<TreeNode*> queue{root};
    while (!queue.empty()) {
        vector<int> level;
        size_t size = queue.size();
        for (size_t i = 0; i < size; i++) {
            TreeNode* node = queue.front(); queue.pop_front();
            level.push_back(node->val);
            if (node->left) queue.push_back(node->left);
            if (node->right) queue.push_back(node->right);
        }
        result.push_back(level);
    }
    return result;
}

// =====================================================================
// 14. DIJKSTRA'S SHORTEST PATH — optimal: binary heap, O((V+E) log V)/O(V)
// =====================================================================
map<string, int> dijkstraOptimal(map<string, vector<pair<string, int>>>& graph, const string& start) {
    map<string, int> dist;
    for (auto& [node, _] : graph) dist[node] = INT_MAX;
    dist[start] = 0;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> heap;
    heap.push({0, start});
    set<string> visited;
    while (!heap.empty()) {
        auto [d, node] = heap.top(); heap.pop();
        if (visited.count(node)) continue;
        visited.insert(node);
        for (auto& [neighbor, weight] : graph[node]) {
            int nd = d + weight;
            if (nd < dist[neighbor]) { dist[neighbor] = nd; heap.push({nd, neighbor}); }
        }
    }
    return dist;
}

// =====================================================================
// 15. UNION-FIND — optimal: path compression + union by rank, ~O(alpha(n))
// =====================================================================
class UnionFindOptimal {
    vector<int> parent, rank_;
public:
    UnionFindOptimal(int n) : parent(n), rank_(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { if (parent[x] != x) parent[x] = find(parent[x]); return parent[x]; }
    void unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rank_[ra] < rank_[rb]) parent[ra] = rb;
        else if (rank_[ra] > rank_[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank_[ra]++; }
    }
    bool connected(int a, int b) { return find(a) == find(b); }
};

// =====================================================================
// 16. TRIE — optimal: nested map nodes, O(m) per op
// =====================================================================
struct TrieNode_ {
    unordered_map<char, TrieNode_*> children;
    bool isEnd = false;
};
class TrieOptimal {
    TrieNode_* root;
public:
    TrieOptimal() { root = new TrieNode_(); }
    void insert(const string& word) {
        TrieNode_* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) node->children[ch] = new TrieNode_();
            node = node->children[ch];
        }
        node->isEnd = true;
    }
    bool search(const string& word) {
        TrieNode_* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->isEnd;
    }
    bool startsWith(const string& prefix) {
        TrieNode_* node = root;
        for (char ch : prefix) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return true;
    }
};

int main() {
    // 1. Two Sum
    {
        vector<vector<int>> inputs = {{2, 7, 11, 15}, {3, 2, 4}, {3, 3}, {1, 2, 3, 4, 5}};
        vector<int> targets = {9, 6, 6, 9};
        vector<vector<int>> expected = {{0, 1}, {1, 2}, {0, 1}, {3, 4}};
        for (size_t i = 0; i < inputs.size(); i++) check("twoSumOptimal", twoSumOptimal(inputs[i], targets[i]), expected[i]);
    }
    // 2. Binary Search
    {
        vector<int> arr = {1, 3, 5, 7, 9, 11};
        check("binarySearchOptimal", binarySearchOptimal(arr, 7), 3);
        check("binarySearchOptimal", binarySearchOptimal(arr, 1), 0);
        check("binarySearchOptimal", binarySearchOptimal(arr, 11), 5);
        check("binarySearchOptimal", binarySearchOptimal(arr, 4), -1);
        vector<int> empty;
        check("binarySearchOptimal", binarySearchOptimal(empty, 5), -1);
    }
    // 3+4. Sorts
    {
        vector<vector<int>> cases = {{5, 3, 8, 1, 9, 2}, {}, {1}, {2, 2, 1, 1}, {5, 4, 3, 2, 1}};
        vector<vector<int>> expected = {{1, 2, 3, 5, 8, 9}, {}, {1}, {1, 1, 2, 2}, {1, 2, 3, 4, 5}};
        for (size_t i = 0; i < cases.size(); i++) {
            check("mergeSortOptimal", mergeSortOptimal(cases[i]), expected[i]);
            check("quickSortOptimal", quickSortOptimal(cases[i]), expected[i]);
        }
    }
    // 5. BFS
    {
        map<string, vector<string>> graph{{"A", {"B", "C"}}, {"B", {"A", "D"}}, {"C", {"A", "D"}}, {"D", {"B", "C", "E"}}, {"E", {"D"}}};
        check("bfsOptimal", bfsOptimal(graph, "A"), vector<string>{"A", "B", "C", "D", "E"});
        map<string, vector<string>> cyc{{"A", {"B"}}, {"B", {"A"}}};
        check("bfsOptimal-cycle", bfsOptimal(cyc, "A"), vector<string>{"A", "B"});
    }
    // 6. DFS
    {
        map<string, vector<string>> graph{{"A", {"B", "C"}}, {"B", {"D"}}, {"C", {"D"}}, {"D", {}}};
        check("dfsOptimal", dfsOptimal(graph, "A"), vector<string>{"A", "B", "D", "C"});
        map<string, vector<string>> cyc{{"A", {"B"}}, {"B", {"A"}}};
        check("dfsOptimal-cycle", dfsOptimal(cyc, "A"), vector<string>{"A", "B"});
    }
    // 7. Valid Parentheses
    {
        check("validParensOptimal", validParensOptimal("()[]{}"), true);
        check("validParensOptimal", validParensOptimal("(]"), false);
        check("validParensOptimal", validParensOptimal("([)]"), false);
        check("validParensOptimal", validParensOptimal("{[]}"), true);
        check("validParensOptimal", validParensOptimal(""), true);
        check("validParensOptimal", validParensOptimal("((("), false);
    }
    // 8. LRU Cache
    {
        auto out = runLRU();
        vector<string> got, exp;
        for (auto& o : out) got.push_back(o.has_value() ? to_string(*o) : "null");
        vector<optional<int>> expVals = {nullopt, nullopt, 1, nullopt, -1, nullopt, -1, 3, 4};
        for (auto& o : expVals) exp.push_back(o.has_value() ? to_string(*o) : "null");
        check("LRUCacheOptimal", got, exp);
    }
    // 9. Linked List Reversal
    {
        vector<vector<int>> cases = {{1, 2, 3, 4, 5}, {1}, {}};
        vector<vector<int>> expected = {{5, 4, 3, 2, 1}, {1}, {}};
        for (size_t i = 0; i < cases.size(); i++)
            check("reverseListOptimal", listToArray(reverseListOptimal(arrayToList(cases[i]))), expected[i]);
    }
    // 10. Floyd's Cycle Detection
    {
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList({3, 2, 0, -4}, 1)), true);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList({1, 2}, 0)), true);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList({1}, -1)), false);
        check("hasCycleOptimal", hasCycleOptimal(makeCyclicList({1, 2, 3}, -1)), false);
    }
    // 11. Kadane's
    {
        vector<int> a1{-2, 1, -3, 4, -1, 2, 1, -5, 4}; check("kadaneOptimal", kadaneOptimal(a1), 6);
        vector<int> a2{1}; check("kadaneOptimal", kadaneOptimal(a2), 1);
        vector<int> a3{5, 4, -1, 7, 8}; check("kadaneOptimal", kadaneOptimal(a3), 23);
        vector<int> a4{-1, -2, -3}; check("kadaneOptimal", kadaneOptimal(a4), -1);
    }
    // 12. Sliding Window Maximum
    {
        vector<int> a1{1, 3, -1, -3, 5, 3, 6, 7}; check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(a1, 3), vector<int>{3, 3, 5, 5, 6, 7});
        vector<int> a2{1}; check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(a2, 1), vector<int>{1});
        vector<int> a3{9, 8, 7, 6}; check("slidingWindowMaxOptimal", slidingWindowMaxOptimal(a3, 2), vector<int>{9, 8, 7});
    }
    // 13. Binary Tree Level Order
    {
        vector<optional<int>> a1{3, 9, 20, nullopt, nullopt, 15, 7};
        check("levelOrderOptimal", levelOrderOptimal(arrayToTree(a1)), vector<vector<int>>{{3}, {9, 20}, {15, 7}});
        vector<optional<int>> a2{1};
        check("levelOrderOptimal-single", levelOrderOptimal(arrayToTree(a2)), vector<vector<int>>{{1}});
        vector<optional<int>> a3{};
        check("levelOrderOptimal-empty", levelOrderOptimal(arrayToTree(a3)), vector<vector<int>>{});
    }
    // 14. Dijkstra
    {
        map<string, vector<pair<string, int>>> graph{
            {"A", {{"B", 4}, {"C", 1}}}, {"B", {{"D", 1}}}, {"C", {{"B", 1}, {"D", 5}}}, {"D", {}}};
        auto dist = dijkstraOptimal(graph, "A");
        map<string, int> expected{{"A", 0}, {"B", 2}, {"C", 1}, {"D", 3}};
        ostringstream got, exp;
        for (auto& [k, v] : dist) got << k << ":" << v << " ";
        for (auto& [k, v] : expected) exp << k << ":" << v << " ";
        check("dijkstraOptimal", got.str(), exp.str());
    }
    // 15. Union-Find
    {
        UnionFindOptimal uf(6);
        uf.unite(0, 1); uf.unite(1, 2); uf.unite(3, 4);
        vector<bool> got{uf.connected(0, 2), uf.connected(0, 3), uf.connected(3, 4), uf.connected(4, 5)};
        ostringstream gs; for (bool b : got) gs << b << " ";
        check("UnionFindOptimal", gs.str(), string("1 0 1 0 "));
    }
    // 16. Trie
    {
        TrieOptimal t;
        t.insert("apple");
        vector<bool> out{t.search("apple"), t.search("app"), t.startsWith("app")};
        t.insert("app");
        out.push_back(t.search("app"));
        ostringstream gs; for (bool b : out) gs << b << " ";
        check("TrieOptimal", gs.str(), string("1 0 1 1 "));
    }

    cout << "\n" << pass_ << " passed, " << fail_ << " failed\n";
    return fail_ ? 1 : 0;
}
