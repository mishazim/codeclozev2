/* Fact-check harness for every C optimal reference solution.
 * Build: gcc -std=c11 -O2 verify.c -o verify_c && ./verify_c
 * Not shipped to the browser (v2 grades C by pattern-matching, not execution) --
 * dev-time correctness check before code gets transcribed into data.js.
 *
 * C has no generic hash map/heap in its standard library, so a few "optimal"
 * solutions below use small fixed-capacity hash tables / binary heaps built
 * for this harness -- same algorithmic idea (O(1) amortized hashing, O(log n)
 * heap ops) as the JS/Python/Java/C++ versions, just hand-rolled since C has
 * no stdlib container for it.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

static int pass_ = 0, fail_ = 0;

static void check_int(const char* label, long long actual, long long expected) {
    if (actual == expected) pass_++;
    else { fail_++; printf("FAIL %s\n  expected: %lld\n  actual:   %lld\n", label, expected, actual); }
}
static void check_int_arr(const char* label, const int* actual, int alen, const int* expected, int elen) {
    int ok = (alen == elen);
    if (ok) for (int i = 0; i < alen; i++) if (actual[i] != expected[i]) { ok = 0; break; }
    if (ok) pass_++;
    else {
        fail_++;
        printf("FAIL %s\n  expected: [", label);
        for (int i = 0; i < elen; i++) printf("%d%s", expected[i], i + 1 < elen ? "," : "");
        printf("]\n  actual:   [");
        for (int i = 0; i < alen; i++) printf("%d%s", actual[i], i + 1 < alen ? "," : "");
        printf("]\n");
    }
}
static void check_str(const char* label, const char* actual, const char* expected) {
    if (strcmp(actual, expected) == 0) pass_++;
    else { fail_++; printf("FAIL %s\n  expected: %s\n  actual:   %s\n", label, expected, actual); }
}
static void check_double_arr(const char* label, const double* actual, int alen, const double* expected, int elen) {
    int ok = (alen == elen);
    if (ok) for (int i = 0; i < alen; i++) if (actual[i] != expected[i]) { ok = 0; break; }
    if (ok) pass_++;
    else {
        fail_++;
        printf("FAIL %s\n  expected: [", label);
        for (int i = 0; i < elen; i++) printf("%g%s", expected[i], i + 1 < elen ? "," : "");
        printf("]\n  actual:   [");
        for (int i = 0; i < alen; i++) printf("%g%s", actual[i], i + 1 < alen ? "," : "");
        printf("]\n");
    }
}

/* =====================================================================
 * 1. TWO SUM -- optimal: hash map, O(n)/O(n)
 * ===================================================================== */
#define TS_TABLE_SIZE 1024
typedef struct { int key; int value; int used; } TSEntry;
static int ts_hash(int key) { unsigned int k = (unsigned int)key; return (int)(k % TS_TABLE_SIZE); }
void twoSumOptimal(const int* nums, int n, int target, int* out /* out[0], out[1] */) {
    TSEntry table[TS_TABLE_SIZE];
    memset(table, 0, sizeof(table));
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        int h = ts_hash(complement);
        int probes = 0;
        while (table[h].used && probes < TS_TABLE_SIZE) {
            if (table[h].key == complement) { out[0] = table[h].value; out[1] = i; return; }
            h = (h + 1) % TS_TABLE_SIZE; probes++;
        }
        h = ts_hash(nums[i]);
        probes = 0;
        while (table[h].used) { h = (h + 1) % TS_TABLE_SIZE; probes++; }
        table[h].key = nums[i]; table[h].value = i; table[h].used = 1;
    }
    out[0] = -1; out[1] = -1;
}

/* =====================================================================
 * 2. BINARY SEARCH -- optimal: O(log n)/O(1)
 * ===================================================================== */
int binarySearchOptimal(const int* arr, int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

/* =====================================================================
 * 3. MERGE SORT -- optimal: O(n log n)/O(n)
 * ===================================================================== */
void mergeSortHelper(int* arr, int lo, int hi, int* buf) {
    if (hi - lo <= 1) return;
    int mid = (lo + hi) / 2;
    mergeSortHelper(arr, lo, mid, buf);
    mergeSortHelper(arr, mid, hi, buf);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) buf[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
    while (i < mid) buf[k++] = arr[i++];
    while (j < hi) buf[k++] = arr[j++];
    for (int x = lo; x < hi; x++) arr[x] = buf[x];
}
void mergeSortOptimal(int* arr, int n) {
    int* buf = malloc(sizeof(int) * n);
    mergeSortHelper(arr, 0, n, buf);
    free(buf);
}

/* =====================================================================
 * 4. QUICK SORT -- optimal: average O(n log n)/O(log n)
 * ===================================================================== */
static void swap_int(int* a, int* b) { int t = *a; *a = *b; *b = t; }
int qsPartition(int* a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) if (a[j] < pivot) { swap_int(&a[i], &a[j]); i++; }
    swap_int(&a[i], &a[hi]);
    return i;
}
void quickSortHelper(int* a, int lo, int hi) {
    if (lo < hi) { int p = qsPartition(a, lo, hi); quickSortHelper(a, lo, p - 1); quickSortHelper(a, p + 1, hi); }
}
void quickSortOptimal(int* arr, int n) { quickSortHelper(arr, 0, n - 1); }

/* =====================================================================
 * 5. BFS -- optimal: O(V+E)/O(V). Graph as fixed adjacency list over
 *    small integer node ids (0..numNodes-1) -- simplest representation in C.
 * ===================================================================== */
typedef struct { int neighbors[8]; int count; } AdjNode;
void bfsOptimal(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {
    int visited[64] = {0};
    int queue[64], qHead = 0, qTail = 0;
    visited[start] = 1;
    queue[qTail++] = start;
    *orderLen = 0;
    while (qHead < qTail) {
        int node = queue[qHead++];
        order[(*orderLen)++] = node;
        for (int i = 0; i < graph[node].count; i++) {
            int neighbor = graph[node].neighbors[i];
            if (!visited[neighbor]) { visited[neighbor] = 1; queue[qTail++] = neighbor; }
        }
    }
}

/* =====================================================================
 * 6. DFS -- optimal: O(V+E)/O(V)
 * ===================================================================== */
void dfsVisit(AdjNode* graph, int node, int* visited, int* order, int* orderLen) {
    if (visited[node]) return;
    visited[node] = 1;
    order[(*orderLen)++] = node;
    for (int i = 0; i < graph[node].count; i++) dfsVisit(graph, graph[node].neighbors[i], visited, order, orderLen);
}
void dfsOptimal(AdjNode* graph, int numNodes, int start, int* order, int* orderLen) {
    int visited[64] = {0};
    *orderLen = 0;
    dfsVisit(graph, start, visited, order, orderLen);
}

/* =====================================================================
 * 7. VALID PARENTHESES -- optimal: stack, O(n)/O(n)
 * ===================================================================== */
int validParensOptimal(const char* s) {
    char stack[256];
    int top = -1;
    for (const char* p = s; *p; p++) {
        char ch = *p;
        if (ch == '(' || ch == '[' || ch == '{') stack[++top] = ch;
        else if (ch == ')' || ch == ']' || ch == '}') {
            if (top < 0) return 0;
            char open = stack[top--];
            if ((ch == ')' && open != '(') || (ch == ']' && open != '[') || (ch == '}' && open != '{')) return 0;
        }
    }
    return top == -1;
}

/* =====================================================================
 * 8. LRU CACHE -- optimal: hash map + doubly linked list, O(1)/O(capacity)
 * ===================================================================== */
typedef struct LRUNode { int key, value; struct LRUNode *prev, *next; } LRUNode;
typedef struct {
    int capacity, size;
    LRUNode *head, *tail; /* head = most recently used */
    LRUNode* table[128];  /* direct-mapped by key % 128 for this harness's small key range */
} LRUCacheOptimal;
LRUCacheOptimal* lruCreate(int capacity) {
    LRUCacheOptimal* c = calloc(1, sizeof(LRUCacheOptimal));
    c->capacity = capacity;
    return c;
}
static void lruDetach(LRUCacheOptimal* c, LRUNode* n) {
    if (n->prev) n->prev->next = n->next; else c->head = n->next;
    if (n->next) n->next->prev = n->prev; else c->tail = n->prev;
}
static void lruPushFront(LRUCacheOptimal* c, LRUNode* n) {
    n->prev = NULL; n->next = c->head;
    if (c->head) c->head->prev = n;
    c->head = n;
    if (!c->tail) c->tail = n;
}
int lruGet(LRUCacheOptimal* c, int key) {
    LRUNode* n = c->table[key % 128];
    if (!n || n->key != key) return -1;
    lruDetach(c, n); lruPushFront(c, n);
    return n->value;
}
void lruPut(LRUCacheOptimal* c, int key, int value) {
    LRUNode* n = c->table[key % 128];
    if (n && n->key == key) { n->value = value; lruDetach(c, n); lruPushFront(c, n); return; }
    if (c->size >= c->capacity) {
        LRUNode* victim = c->tail;
        c->table[victim->key % 128] = NULL;
        lruDetach(c, victim);
        free(victim);
        c->size--;
    }
    LRUNode* fresh = malloc(sizeof(LRUNode));
    fresh->key = key; fresh->value = value;
    lruPushFront(c, fresh);
    c->table[key % 128] = fresh;
    c->size++;
}

/* =====================================================================
 * 9/10. LINKED LIST REVERSAL + FLOYD'S CYCLE DETECTION
 * ===================================================================== */
typedef struct ListNode { int val; struct ListNode* next; } ListNode;
ListNode* arrayToList(const int* arr, int n) {
    ListNode *head = NULL, *tail = NULL;
    for (int i = 0; i < n; i++) {
        ListNode* node = malloc(sizeof(ListNode));
        node->val = arr[i]; node->next = NULL;
        if (!head) { head = node; tail = node; } else { tail->next = node; tail = node; }
    }
    return head;
}
int listToArray(ListNode* head, int* out) {
    int n = 0;
    while (head) { out[n++] = head->val; head = head->next; }
    return n;
}
ListNode* reverseListOptimal(ListNode* head) {
    ListNode *prev = NULL, *curr = head;
    while (curr) { ListNode* next = curr->next; curr->next = prev; prev = curr; curr = next; }
    return prev;
}
int hasCycleOptimal(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}
ListNode* makeCyclicList(const int* arr, int n, int pos) {
    if (n == 0) return NULL;
    ListNode** nodes = malloc(sizeof(ListNode*) * n);
    for (int i = 0; i < n; i++) { nodes[i] = malloc(sizeof(ListNode)); nodes[i]->val = arr[i]; nodes[i]->next = NULL; }
    for (int i = 0; i < n - 1; i++) nodes[i]->next = nodes[i + 1];
    if (pos >= 0) nodes[n - 1]->next = nodes[pos];
    ListNode* head = nodes[0];
    free(nodes);
    return head;
}

/* =====================================================================
 * 11. KADANE'S ALGORITHM -- optimal: O(n)/O(1)
 * ===================================================================== */
int kadaneOptimal(const int* nums, int n) {
    int best = nums[0], curr = nums[0];
    for (int i = 1; i < n; i++) {
        curr = nums[i] > curr + nums[i] ? nums[i] : curr + nums[i];
        best = best > curr ? best : curr;
    }
    return best;
}

/* =====================================================================
 * 12. SLIDING WINDOW MAXIMUM -- optimal: monotonic deque, O(n)/O(k)
 * ===================================================================== */
int slidingWindowMaxOptimal(const int* nums, int n, int k, int* out) {
    int deque[1024], dHead = 0, dTail = 0; /* dHead..dTail-1 holds indices, decreasing values */
    int outLen = 0;
    for (int i = 0; i < n; i++) {
        while (dTail > dHead && deque[dHead] <= i - k) dHead++;
        while (dTail > dHead && nums[deque[dTail - 1]] < nums[i]) dTail--;
        deque[dTail++] = i;
        if (i >= k - 1) out[outLen++] = nums[deque[dHead]];
    }
    return outLen;
}

/* =====================================================================
 * 13. BINARY TREE LEVEL ORDER -- optimal: BFS with queue, O(n)/O(n)
 * ===================================================================== */
typedef struct TreeNode { int val; struct TreeNode *left, *right; } TreeNode;
TreeNode* arrayToTree(const int* arr, const int* isNull, int n) {
    if (n == 0 || isNull[0]) return NULL;
    TreeNode** nodes = malloc(sizeof(TreeNode*) * n);
    for (int i = 0; i < n; i++) {
        if (isNull[i]) { nodes[i] = NULL; continue; }
        nodes[i] = malloc(sizeof(TreeNode));
        nodes[i]->val = arr[i]; nodes[i]->left = NULL; nodes[i]->right = NULL;
    }
    TreeNode* queue[64]; int qHead = 0, qTail = 0;
    queue[qTail++] = nodes[0];
    int i = 1;
    while (qHead < qTail && i < n) {
        TreeNode* node = queue[qHead++];
        if (i < n) { if (!isNull[i]) { node->left = nodes[i]; queue[qTail++] = nodes[i]; } i++; }
        if (i < n) { if (!isNull[i]) { node->right = nodes[i]; queue[qTail++] = nodes[i]; } i++; }
    }
    TreeNode* root = nodes[0];
    free(nodes);
    return root;
}
/* result: levels[level][idx], levelSizes[level], returns numLevels */
int levelOrderOptimal(TreeNode* root, int levels[16][16], int* levelSizes) {
    if (!root) return 0;
    TreeNode* queue[64]; int qHead = 0, qTail = 0;
    queue[qTail++] = root;
    int numLevels = 0;
    while (qHead < qTail) {
        int levelStart = qHead, levelEnd = qTail;
        int idx = 0;
        for (int i = levelStart; i < levelEnd; i++) {
            TreeNode* node = queue[qHead++];
            levels[numLevels][idx++] = node->val;
            if (node->left) queue[qTail++] = node->left;
            if (node->right) queue[qTail++] = node->right;
        }
        levelSizes[numLevels] = idx;
        numLevels++;
    }
    return numLevels;
}

/* =====================================================================
 * 14. DIJKSTRA'S SHORTEST PATH -- optimal: binary heap, O((V+E) log V)/O(V)
 *     Graph as small integer node ids with weighted adjacency.
 * ===================================================================== */
typedef struct { int to, weight; } Edge;
typedef struct { Edge edges[8]; int count; } WNode;
typedef struct { int dist, node; } HeapItem;
void heapPush(HeapItem* heap, int* size, HeapItem item) {
    heap[*size] = item;
    int i = (*size)++;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[parent].dist <= heap[i].dist) break;
        HeapItem t = heap[parent]; heap[parent] = heap[i]; heap[i] = t;
        i = parent;
    }
}
HeapItem heapPop(HeapItem* heap, int* size) {
    HeapItem top = heap[0];
    heap[0] = heap[--(*size)];
    int i = 0;
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < *size && heap[l].dist < heap[smallest].dist) smallest = l;
        if (r < *size && heap[r].dist < heap[smallest].dist) smallest = r;
        if (smallest == i) break;
        HeapItem t = heap[i]; heap[i] = heap[smallest]; heap[smallest] = t;
        i = smallest;
    }
    return top;
}
void dijkstraOptimal(WNode* graph, int numNodes, int start, int* dist) {
    for (int i = 0; i < numNodes; i++) dist[i] = INT_MAX;
    dist[start] = 0;
    int visited[64] = {0};
    HeapItem heap[256]; int heapSize = 0;
    heapPush(heap, &heapSize, (HeapItem){0, start});
    while (heapSize > 0) {
        HeapItem top = heapPop(heap, &heapSize);
        if (visited[top.node]) continue;
        visited[top.node] = 1;
        for (int i = 0; i < graph[top.node].count; i++) {
            Edge e = graph[top.node].edges[i];
            int nd = top.dist + e.weight;
            if (nd < dist[e.to]) { dist[e.to] = nd; heapPush(heap, &heapSize, (HeapItem){nd, e.to}); }
        }
    }
}

/* =====================================================================
 * 15. UNION-FIND -- optimal: path compression + union by rank, ~O(alpha(n))
 * ===================================================================== */
typedef struct { int parent[64]; int rank[64]; } UnionFindOptimal;
void ufInit(UnionFindOptimal* uf, int n) { for (int i = 0; i < n; i++) { uf->parent[i] = i; uf->rank[i] = 0; } }
int ufFind(UnionFindOptimal* uf, int x) {
    if (uf->parent[x] != x) uf->parent[x] = ufFind(uf, uf->parent[x]);
    return uf->parent[x];
}
void ufUnion(UnionFindOptimal* uf, int a, int b) {
    int ra = ufFind(uf, a), rb = ufFind(uf, b);
    if (ra == rb) return;
    if (uf->rank[ra] < uf->rank[rb]) uf->parent[ra] = rb;
    else if (uf->rank[ra] > uf->rank[rb]) uf->parent[rb] = ra;
    else { uf->parent[rb] = ra; uf->rank[ra]++; }
}
int ufConnected(UnionFindOptimal* uf, int a, int b) { return ufFind(uf, a) == ufFind(uf, b); }

/* =====================================================================
 * 16. TRIE -- optimal: fixed 26-ary array nodes, O(m) per op
 * ===================================================================== */
typedef struct TrieNodeC { struct TrieNodeC* children[26]; int isEnd; } TrieNodeC;
typedef struct { TrieNodeC* root; } TrieOptimal;
TrieNodeC* trieNewNode(void) { return calloc(1, sizeof(TrieNodeC)); }
void trieInit(TrieOptimal* t) { t->root = trieNewNode(); }
void trieInsert(TrieOptimal* t, const char* word) {
    TrieNodeC* node = t->root;
    for (const char* p = word; *p; p++) {
        int idx = *p - 'a';
        if (!node->children[idx]) node->children[idx] = trieNewNode();
        node = node->children[idx];
    }
    node->isEnd = 1;
}
int trieSearch(TrieOptimal* t, const char* word) {
    TrieNodeC* node = t->root;
    for (const char* p = word; *p; p++) {
        int idx = *p - 'a';
        if (!node->children[idx]) return 0;
        node = node->children[idx];
    }
    return node->isEnd;
}
int trieStartsWith(TrieOptimal* t, const char* prefix) {
    TrieNodeC* node = t->root;
    for (const char* p = prefix; *p; p++) {
        int idx = *p - 'a';
        if (!node->children[idx]) return 0;
        node = node->children[idx];
    }
    return 1;
}

/* =====================================================================
 * 17. HEAPSORT -- optimal: in-place binary heap, O(n log n)/O(1)
 * ===================================================================== */
void heapify(int* a, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest != i) {
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        heapify(a, size, largest);
    }
}
void heapSort(int* arr, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}

/* =====================================================================
 * 18. INSERTION SORT -- optimal: adaptive shift, O(n^2) worst/O(n) best
 * ===================================================================== */
void insertionSort(int* arr, int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
        arr[j + 1] = key;
    }
}

/* =====================================================================
 * 19. COUNTING SORT -- optimal: O(n+k)/O(n+k)
 * ===================================================================== */
void countingSort(int* arr, int n) {
    if (n == 0) return;
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];
    int* counts = calloc(max + 1, sizeof(int));
    for (int i = 0; i < n; i++) counts[arr[i]]++;
    int idx = 0;
    for (int v = 0; v <= max; v++) for (int c = 0; c < counts[v]; c++) arr[idx++] = v;
    free(counts);
}

/* =====================================================================
 * 20. RADIX SORT -- optimal: LSD digit-by-digit, O(d*(n+k))
 * ===================================================================== */
void radixSort(int* arr, int n) {
    if (n == 0) return;
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];
    int* output = malloc(sizeof(int) * n);
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int counts[10] = {0};
        for (int i = 0; i < n; i++) counts[(arr[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++) counts[i] += counts[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[--counts[digit]] = arr[i];
        }
        for (int i = 0; i < n; i++) arr[i] = output[i];
    }
    free(output);
}

/* =====================================================================
 * 21. BUCKET SORT -- optimal: distribute + per-bucket sort, O(n+k) average
 * ===================================================================== */
int cmpDouble(const void* a, const void* b) {
    double da = *(const double*)a, db = *(const double*)b;
    return (da > db) - (da < db);
}
void bucketSort(double* arr, int n) {
    if (n == 0) return;
    double** buckets = malloc(sizeof(double*) * n);
    int* counts = calloc(n, sizeof(int));
    int* capacities = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) { capacities[i] = 4; buckets[i] = malloc(sizeof(double) * capacities[i]); }
    for (int i = 0; i < n; i++) {
        int idx = (int)(arr[i] * n);
        if (idx >= n) idx = n - 1;
        if (counts[idx] == capacities[idx]) { capacities[idx] *= 2; buckets[idx] = realloc(buckets[idx], sizeof(double) * capacities[idx]); }
        buckets[idx][counts[idx]++] = arr[i];
    }
    int pos = 0;
    for (int i = 0; i < n; i++) {
        qsort(buckets[i], counts[i], sizeof(double), cmpDouble);
        for (int j = 0; j < counts[i]; j++) arr[pos++] = buckets[i][j];
        free(buckets[i]);
    }
    free(buckets); free(counts); free(capacities);
}

int main(void) {
    /* 1. Two Sum */
    {
        int nums1[] = {2, 7, 11, 15}; int out[2];
        twoSumOptimal(nums1, 4, 9, out); check_int_arr("twoSumOptimal", out, 2, (int[]){0, 1}, 2);
        int nums2[] = {3, 2, 4};
        twoSumOptimal(nums2, 3, 6, out); check_int_arr("twoSumOptimal", out, 2, (int[]){1, 2}, 2);
        int nums3[] = {3, 3};
        twoSumOptimal(nums3, 2, 6, out); check_int_arr("twoSumOptimal", out, 2, (int[]){0, 1}, 2);
        int nums4[] = {1, 2, 3, 4, 5};
        twoSumOptimal(nums4, 5, 9, out); check_int_arr("twoSumOptimal", out, 2, (int[]){3, 4}, 2);
    }
    /* 2. Binary Search */
    {
        int arr[] = {1, 3, 5, 7, 9, 11};
        check_int("binarySearchOptimal", binarySearchOptimal(arr, 6, 7), 3);
        check_int("binarySearchOptimal", binarySearchOptimal(arr, 6, 1), 0);
        check_int("binarySearchOptimal", binarySearchOptimal(arr, 6, 11), 5);
        check_int("binarySearchOptimal", binarySearchOptimal(arr, 6, 4), -1);
        check_int("binarySearchOptimal-empty", binarySearchOptimal(arr, 0, 5), -1);
    }
    /* 3+4. Sorts */
    {
        int a1[] = {5, 3, 8, 1, 9, 2}; int e1[] = {1, 2, 3, 5, 8, 9};
        int a1q[] = {5, 3, 8, 1, 9, 2};
        mergeSortOptimal(a1, 6); check_int_arr("mergeSortOptimal", a1, 6, e1, 6);
        quickSortOptimal(a1q, 6); check_int_arr("quickSortOptimal", a1q, 6, e1, 6);

        int a2[] = {1}; int e2[] = {1};
        mergeSortOptimal(a2, 1); check_int_arr("mergeSortOptimal", a2, 1, e2, 1);

        int a3[] = {2, 2, 1, 1}; int e3[] = {1, 1, 2, 2};
        int a3q[] = {2, 2, 1, 1};
        mergeSortOptimal(a3, 4); check_int_arr("mergeSortOptimal", a3, 4, e3, 4);
        quickSortOptimal(a3q, 4); check_int_arr("quickSortOptimal", a3q, 4, e3, 4);

        int a4[] = {5, 4, 3, 2, 1}; int e4[] = {1, 2, 3, 4, 5};
        int a4q[] = {5, 4, 3, 2, 1};
        mergeSortOptimal(a4, 5); check_int_arr("mergeSortOptimal", a4, 5, e4, 5);
        quickSortOptimal(a4q, 5); check_int_arr("quickSortOptimal", a4q, 5, e4, 5);
    }
    /* 5. BFS -- nodes: 0=A,1=B,2=C,3=D,4=E */
    {
        AdjNode graph[5] = {0};
        graph[0].neighbors[0] = 1; graph[0].neighbors[1] = 2; graph[0].count = 2; /* A: B,C */
        graph[1].neighbors[0] = 0; graph[1].neighbors[1] = 3; graph[1].count = 2; /* B: A,D */
        graph[2].neighbors[0] = 0; graph[2].neighbors[1] = 3; graph[2].count = 2; /* C: A,D */
        graph[3].neighbors[0] = 1; graph[3].neighbors[1] = 2; graph[3].neighbors[2] = 4; graph[3].count = 3; /* D: B,C,E */
        graph[4].neighbors[0] = 3; graph[4].count = 1; /* E: D */
        int order[5], orderLen;
        bfsOptimal(graph, 5, 0, order, &orderLen);
        check_int_arr("bfsOptimal", order, orderLen, (int[]){0, 1, 2, 3, 4}, 5);

        AdjNode cyc[2] = {0};
        cyc[0].neighbors[0] = 1; cyc[0].count = 1;
        cyc[1].neighbors[0] = 0; cyc[1].count = 1;
        int order2[2], orderLen2;
        bfsOptimal(cyc, 2, 0, order2, &orderLen2);
        check_int_arr("bfsOptimal-cycle", order2, orderLen2, (int[]){0, 1}, 2);
    }
    /* 6. DFS -- nodes: 0=A,1=B,2=C,3=D */
    {
        AdjNode graph[4] = {0};
        graph[0].neighbors[0] = 1; graph[0].neighbors[1] = 2; graph[0].count = 2; /* A: B,C */
        graph[1].neighbors[0] = 3; graph[1].count = 1; /* B: D */
        graph[2].neighbors[0] = 3; graph[2].count = 1; /* C: D */
        graph[3].count = 0; /* D: */
        int order[4], orderLen;
        dfsOptimal(graph, 4, 0, order, &orderLen);
        check_int_arr("dfsOptimal", order, orderLen, (int[]){0, 1, 3, 2}, 4);

        AdjNode cyc[2] = {0};
        cyc[0].neighbors[0] = 1; cyc[0].count = 1;
        cyc[1].neighbors[0] = 0; cyc[1].count = 1;
        int order2[2], orderLen2;
        dfsOptimal(cyc, 2, 0, order2, &orderLen2);
        check_int_arr("dfsOptimal-cycle", order2, orderLen2, (int[]){0, 1}, 2);
    }
    /* 7. Valid Parentheses */
    {
        check_int("validParensOptimal", validParensOptimal("()[]{}"), 1);
        check_int("validParensOptimal", validParensOptimal("(]"), 0);
        check_int("validParensOptimal", validParensOptimal("([)]"), 0);
        check_int("validParensOptimal", validParensOptimal("{[]}"), 1);
        check_int("validParensOptimal", validParensOptimal(""), 1);
        check_int("validParensOptimal", validParensOptimal("((("), 0);
    }
    /* 8. LRU Cache */
    {
        LRUCacheOptimal* c = lruCreate(2);
        lruPut(c, 1, 1);
        lruPut(c, 2, 2);
        check_int("LRUCacheOptimal-get1", lruGet(c, 1), 1);
        lruPut(c, 3, 3); /* evicts key 2 */
        check_int("LRUCacheOptimal-get2", lruGet(c, 2), -1);
        lruPut(c, 4, 4); /* evicts key 1 */
        check_int("LRUCacheOptimal-get1b", lruGet(c, 1), -1);
        check_int("LRUCacheOptimal-get3", lruGet(c, 3), 3);
        check_int("LRUCacheOptimal-get4", lruGet(c, 4), 4);
    }
    /* 9. Linked List Reversal */
    {
        int a1[] = {1, 2, 3, 4, 5}; int e1[] = {5, 4, 3, 2, 1};
        ListNode* l1 = arrayToList(a1, 5);
        int out1[5]; int n1 = listToArray(reverseListOptimal(l1), out1);
        check_int_arr("reverseListOptimal", out1, n1, e1, 5);

        int a2[] = {1};
        ListNode* l2 = arrayToList(a2, 1);
        int out2[1]; int n2 = listToArray(reverseListOptimal(l2), out2);
        check_int_arr("reverseListOptimal-single", out2, n2, a2, 1);

        ListNode* l3 = arrayToList(NULL, 0);
        int out3[1]; int n3 = listToArray(reverseListOptimal(l3), out3);
        check_int_arr("reverseListOptimal-empty", out3, n3, NULL, 0);
    }
    /* 10. Floyd's Cycle Detection */
    {
        int a1[] = {3, 2, 0, -4};
        check_int("hasCycleOptimal", hasCycleOptimal(makeCyclicList(a1, 4, 1)), 1);
        int a2[] = {1, 2};
        check_int("hasCycleOptimal", hasCycleOptimal(makeCyclicList(a2, 2, 0)), 1);
        int a3[] = {1};
        check_int("hasCycleOptimal", hasCycleOptimal(makeCyclicList(a3, 1, -1)), 0);
        int a4[] = {1, 2, 3};
        check_int("hasCycleOptimal", hasCycleOptimal(makeCyclicList(a4, 3, -1)), 0);
    }
    /* 11. Kadane's */
    {
        int a1[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        check_int("kadaneOptimal", kadaneOptimal(a1, 9), 6);
        int a2[] = {1};
        check_int("kadaneOptimal", kadaneOptimal(a2, 1), 1);
        int a3[] = {5, 4, -1, 7, 8};
        check_int("kadaneOptimal", kadaneOptimal(a3, 5), 23);
        int a4[] = {-1, -2, -3};
        check_int("kadaneOptimal", kadaneOptimal(a4, 3), -1);
    }
    /* 12. Sliding Window Maximum */
    {
        int a1[] = {1, 3, -1, -3, 5, 3, 6, 7}; int out1[8];
        int n1 = slidingWindowMaxOptimal(a1, 8, 3, out1);
        check_int_arr("slidingWindowMaxOptimal", out1, n1, (int[]){3, 3, 5, 5, 6, 7}, 6);

        int a2[] = {1}; int out2[1];
        int n2 = slidingWindowMaxOptimal(a2, 1, 1, out2);
        check_int_arr("slidingWindowMaxOptimal", out2, n2, (int[]){1}, 1);

        int a3[] = {9, 8, 7, 6}; int out3[4];
        int n3 = slidingWindowMaxOptimal(a3, 4, 2, out3);
        check_int_arr("slidingWindowMaxOptimal", out3, n3, (int[]){9, 8, 7}, 3);
    }
    /* 13. Binary Tree Level Order */
    {
        int arr1[] = {3, 9, 20, 0, 0, 15, 7};
        int isNull1[] = {0, 0, 0, 1, 1, 0, 0};
        TreeNode* root1 = arrayToTree(arr1, isNull1, 7);
        int levels[16][16], sizes[16];
        int numLevels = levelOrderOptimal(root1, levels, sizes);
        check_int("levelOrderOptimal-numLevels", numLevels, 3);
        check_int_arr("levelOrderOptimal-L0", levels[0], sizes[0], (int[]){3}, 1);
        check_int_arr("levelOrderOptimal-L1", levels[1], sizes[1], (int[]){9, 20}, 2);
        check_int_arr("levelOrderOptimal-L2", levels[2], sizes[2], (int[]){15, 7}, 2);

        int arr2[] = {1}; int isNull2[] = {0};
        TreeNode* root2 = arrayToTree(arr2, isNull2, 1);
        int levels2[16][16], sizes2[16];
        int numLevels2 = levelOrderOptimal(root2, levels2, sizes2);
        check_int("levelOrderOptimal-single", numLevels2, 1);
        check_int_arr("levelOrderOptimal-single-L0", levels2[0], sizes2[0], (int[]){1}, 1);

        int numLevels3 = levelOrderOptimal(NULL, levels2, sizes2);
        check_int("levelOrderOptimal-empty", numLevels3, 0);
    }
    /* 14. Dijkstra -- nodes: 0=A,1=B,2=C,3=D */
    {
        WNode graph[4] = {0};
        graph[0].edges[0] = (Edge){1, 4}; graph[0].edges[1] = (Edge){2, 1}; graph[0].count = 2; /* A: B(4), C(1) */
        graph[1].edges[0] = (Edge){3, 1}; graph[1].count = 1; /* B: D(1) */
        graph[2].edges[0] = (Edge){1, 1}; graph[2].edges[1] = (Edge){3, 5}; graph[2].count = 2; /* C: B(1), D(5) */
        graph[3].count = 0; /* D: */
        int dist[4];
        dijkstraOptimal(graph, 4, 0, dist);
        check_int_arr("dijkstraOptimal", dist, 4, (int[]){0, 2, 1, 3}, 4);
    }
    /* 15. Union-Find */
    {
        UnionFindOptimal uf;
        ufInit(&uf, 6);
        ufUnion(&uf, 0, 1); ufUnion(&uf, 1, 2); ufUnion(&uf, 3, 4);
        check_int("UnionFindOptimal-02", ufConnected(&uf, 0, 2), 1);
        check_int("UnionFindOptimal-03", ufConnected(&uf, 0, 3), 0);
        check_int("UnionFindOptimal-34", ufConnected(&uf, 3, 4), 1);
        check_int("UnionFindOptimal-45", ufConnected(&uf, 4, 5), 0);
    }
    /* 16. Trie */
    {
        TrieOptimal t;
        trieInit(&t);
        trieInsert(&t, "apple");
        check_int("TrieOptimal-search-apple", trieSearch(&t, "apple"), 1);
        check_int("TrieOptimal-search-app", trieSearch(&t, "app"), 0);
        check_int("TrieOptimal-startswith-app", trieStartsWith(&t, "app"), 1);
        trieInsert(&t, "app");
        check_int("TrieOptimal-search-app2", trieSearch(&t, "app"), 1);
    }

    /* 17+18. Heapsort / Insertion Sort (share sort cases) */
    {
        int a1[] = {5, 3, 8, 1, 9, 2}; int e1[] = {1, 2, 3, 5, 8, 9};
        int a1i[] = {5, 3, 8, 1, 9, 2};
        heapSort(a1, 6); check_int_arr("heapSort", a1, 6, e1, 6);
        insertionSort(a1i, 6); check_int_arr("insertionSort", a1i, 6, e1, 6);

        int a2[] = {2, 2, 1, 1}; int e2[] = {1, 1, 2, 2};
        int a2i[] = {2, 2, 1, 1};
        heapSort(a2, 4); check_int_arr("heapSort", a2, 4, e2, 4);
        insertionSort(a2i, 4); check_int_arr("insertionSort", a2i, 4, e2, 4);

        int a3[] = {5, 4, 3, 2, 1}; int e3[] = {1, 2, 3, 4, 5};
        int a3i[] = {5, 4, 3, 2, 1};
        heapSort(a3, 5); check_int_arr("heapSort", a3, 5, e3, 5);
        insertionSort(a3i, 5); check_int_arr("insertionSort", a3i, 5, e3, 5);
    }
    /* 19. Counting Sort */
    {
        int a1[] = {4, 2, 2, 8, 3, 3, 1}; int e1[] = {1, 2, 2, 3, 3, 4, 8};
        countingSort(a1, 7); check_int_arr("countingSort", a1, 7, e1, 7);

        int a2[] = {0, 0, 3, 1, 2}; int e2[] = {0, 0, 1, 2, 3};
        countingSort(a2, 5); check_int_arr("countingSort", a2, 5, e2, 5);
    }
    /* 20. Radix Sort */
    {
        int a1[] = {170, 45, 75, 90, 802, 24, 2, 66}; int e1[] = {2, 24, 45, 66, 75, 90, 170, 802};
        radixSort(a1, 8); check_int_arr("radixSort", a1, 8, e1, 8);

        int a2[] = {100, 10, 1}; int e2[] = {1, 10, 100};
        radixSort(a2, 3); check_int_arr("radixSort", a2, 3, e2, 3);

        int a3[] = {0, 0, 0}; int e3[] = {0, 0, 0};
        radixSort(a3, 3); check_int_arr("radixSort", a3, 3, e3, 3);
    }
    /* 21. Bucket Sort */
    {
        double a1[] = {0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68};
        double e1[] = {0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94};
        bucketSort(a1, 10); check_double_arr("bucketSort", a1, 10, e1, 10);

        double a2[] = {0.9, 0.9, 0.1}; double e2[] = {0.1, 0.9, 0.9};
        bucketSort(a2, 3); check_double_arr("bucketSort", a2, 3, e2, 3);
    }

    printf("\n%d passed, %d failed\n", pass_, fail_);
    return fail_ ? 1 : 0;
}
