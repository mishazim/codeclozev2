# CodeCloze v2 (working name)

A daily coding-challenge site — fork of [CodeCloze](https://github.com/mishazim/codecloze), reimagined as a single-page, no-build static site.

**What's different from the original:** one puzzle a day (algorithm/data-structure name shown upfront, no guessing), a calmer dark theme, free-form code entry graded for real, coaching after 5 failed attempts, and the optimal solution (time/space complexity + real-world use cases) always revealed at the end — even if your own working solution wasn't optimal.

## Running it

Plain HTML/CSS/JS — no build step, no npm install, no CDN. **JavaScript execution runs in a Web Worker for infinite-loop safety, and Chrome blocks Workers on `file://` pages**, so serve the folder instead of double-clicking `index.html`:

```
python -m http.server 8000
```

then open `http://localhost:8000/`. (Firefox will actually run it directly from `file://`, but the local-server route works everywhere.)

## How grading works

- **JavaScript**: your code actually runs, in an isolated Web Worker with a 2-second timeout, against each problem's real test cases.
- **Python / Java / C / C++**: not executed (no WASM runtime — keeps this a true offline static site). Instead your submission is pattern-matched against the structural shape of the verified reference solution. This is checked by structure, not executed — the UI says so next to the language picker.

## Content

16 hand-picked problems. Every **optimal** solution (all 5 languages) and every **naive/contrast** solution (JavaScript + Python) was independently compiled/run before being written into `data.js` — see `verify/`:

- `verify/verify.mjs` — node, JS solutions
- `verify/verify.py` — python, Python solutions
- `verify/Verify.java` — javac + java, Java solutions
- `verify/verify.c` — gcc, C solutions
- `verify/verify.cpp` — g++, C++ solutions
- `verify/verify_data.mjs` — re-runs the exact JS code strings living in `data.js` (not a separate copy) against every test case, so transcription errors get caught too

## Files

- `data.js` — all problem content (descriptions, test cases, reference solutions, hints, coaching)
- `engine.js` — daily problem selection (date-seeded, deterministic), localStorage progress/streak, grading orchestration
- `worker.js` — sandboxed JS execution
- `app.js` / `index.html` / `styles.css` — UI
