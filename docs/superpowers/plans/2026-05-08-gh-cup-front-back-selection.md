# GH Cup — Front/Back 9 Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Front 9 / Back 9 toggle to Admin score entry so each round covers exactly one half of the course, storing a `half` field alongside the 9-score arrays in Firestore.

**Architecture:** Add two derived par-slice constants (FRONT_PARS, BACK_PARS) to `constants.js`; update `calcKingpin` in `scoring.js` to filter rounds by half and use a local 0–8 index; update Admin to show a segmented toggle, reset scores on half switch, and save `half` to Firestore; update RoundScorecard to accept a `startHole` prop so hole numbers display correctly on both halves; update RoundDetail and Rounds display pages to propagate half metadata.

**Tech Stack:** React 18, Vite, Firebase Firestore, Vitest (tests), CSS custom properties

---

## File Map

| File | What changes |
|---|---|
| `src/constants.js` | Add `FRONT_PARS`, `BACK_PARS` derived from `DEFAULT_PARS` |
| `src/lib/scoring.js` | Update `calcKingpin` to filter by `half` + use `localIdx` |
| `src/lib/scoring.test.js` | Add `half: 'front'` to fixtures; update `toHaveLength`; add back-9 exclusion test |
| `src/pages/Admin.jsx` | Half toggle state, 9-hole grid, save `half` to Firestore, drop `useConfig` |
| `src/components/RoundScorecard.jsx` | Accept `startHole` prop, use for column header rendering |
| `src/pages/RoundDetail.jsx` | Derive `halfPars` + `startHole` from `round.half`, pass to `RoundScorecard`, drop `useConfig` |
| `src/pages/Rounds.jsx` | Show "Front 9" / "Back 9" badge on each round card |
| `src/index.css` | Add `.half-toggle` and `.half-badge` styles |

---

## Task 1: Add FRONT_PARS and BACK_PARS constants

**Files:**
- Modify: `src/constants.js`

- [ ] **Step 1: Open `src/constants.js` and add the two derived exports after `DEFAULT_PARS`**

  Current file ends with:
  ```js
  export const DEFAULT_PARS = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 5, 5, 4, 4, 3, 4, 3, 4];
  ```

  Replace with:
  ```js
  export const DEFAULT_PARS = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 5, 5, 4, 4, 3, 4, 3, 4];

  export const FRONT_PARS = DEFAULT_PARS.slice(0, 9);  // [4,4,4,4,3,4,5,3,4]
  export const BACK_PARS  = DEFAULT_PARS.slice(9);     // [4,5,5,4,4,3,4,3,4]
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/constants.js
  git commit -m "feat: add FRONT_PARS and BACK_PARS constants"
  ```

---

## Task 2: Update calcKingpin to filter by half

**Files:**
- Modify: `src/lib/scoring.js`
- Modify: `src/lib/scoring.test.js`

This is a pure-function change. Write the failing tests first, then implement.

### Step 1 — Write the failing tests

- [ ] **Open `src/lib/scoring.test.js`**

  The file currently has a `describe('calcKingpin')` block using `const pars = [4, 3, 4, 4, 5, 4, 3, 4, 4]` (9 elements). After this change, `calcKingpin` will take the full 18-element pars and return an 18-element array. Make all the following changes to that block:

  **a) Change the local `pars` constant to 18 elements:**
  ```js
  // Replace:
  const pars = [4, 3, 4, 4, 5, 4, 3, 4, 4];
  // With:
  const pars = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 5, 5, 4, 4, 3, 4, 3, 4]; // full 18 — GREEN HARBOR
  ```

  **b) Update `returns all null for no rounds` to expect length 18:**
  ```js
  it('returns all null for no rounds', () => {
    const result = calcKingpin([], pars);
    expect(result).toHaveLength(18);
    result.forEach(owner => expect(owner).toBeNull());
  });
  ```

  **c) Add `half: 'front'` to every round fixture in the remaining tests.** Each round object that currently has `{ scores: { ... } }` becomes `{ half: 'front', scores: { ... } }`. There are five existing tests — update all of them. Example for "assigns hole to player with the most birdies":
  ```js
  const rounds = [
    {
      half: 'front',
      scores: {
        zack:   [3, 4, 4, 4, 5, 4, 3, 4, 4],
        chris:  [4, 4, 4, 4, 5, 4, 3, 4, 4],
        ben:    [4, 4, 4, 4, 5, 4, 3, 4, 4],
        julian: [4, 4, 4, 4, 5, 4, 3, 4, 4],
      },
    },
    {
      half: 'front',
      scores: {
        zack:   [3, 4, 4, 4, 5, 4, 3, 4, 4],
        chris:  [4, 4, 4, 4, 5, 4, 3, 4, 4],
        ben:    [4, 4, 4, 4, 5, 4, 3, 4, 4],
        julian: [4, 4, 4, 4, 5, 4, 3, 4, 4],
      },
    },
  ];
  ```
  Apply the same `half: 'front'` addition to the single-round fixtures in the other four tests.

  **d) Add a new test for half isolation at the bottom of the `describe` block:**
  ```js
  it('back-9 rounds do not affect front-hole ownership (and vice versa)', () => {
    const rounds = [
      {
        half: 'back',
        scores: {
          // score index 0 = hole 9 in a back-9 round
          // par for hole 9 is pars[9] = 4, so score 3 is a birdie
          zack:   [3, 4, 4, 4, 5, 4, 3, 4, 4],
          chris:  [4, 4, 4, 4, 5, 4, 3, 4, 4],
          ben:    [4, 4, 4, 4, 5, 4, 3, 4, 4],
          julian: [4, 4, 4, 4, 5, 4, 3, 4, 4],
        },
      },
    ];
    const result = calcKingpin(rounds, pars);
    // Front-9 holes (0–8) must be null — no front rounds
    for (let i = 0; i < 9; i++) {
      expect(result[i]).toBeNull();
    }
    // Back-9 hole 9 (result[9]) — zack got birdie (score[0]=3 < par[9]=4)
    expect(result[9]).toBe('zack');
  });
  ```

- [ ] **Step 2: Run tests to verify they fail**

  ```bash
  cd C:\Users\zgaud\OneDrive\Documents\GitHub\gh-cup
  npx vitest run src/lib/scoring.test.js
  ```

  Expected: failures on `calcKingpin` tests — the `toHaveLength(18)` assertion fails (currently returns 9), and the half-isolation test fails (all holes return data regardless of `half`).

- [ ] **Step 3: Implement the updated `calcKingpin` in `src/lib/scoring.js`**

  Replace the current `calcKingpin` function (lines 56–82) with:
  ```js
  /**
   * @param {Array<{ half: string, scores: Object }>} rounds
   * @param {number[]} pars  full 18-element par array
   * @returns {(string | null)[]}  18-element array, one owner per hole
   */
  export function calcKingpin(rounds, pars) {
    if (rounds.length === 0) return pars.map(() => null);

    const players = Object.keys(rounds[0].scores);

    return pars.map((par, holeIdx) => {
      const half = holeIdx < 9 ? 'front' : 'back';
      const localIdx = holeIdx < 9 ? holeIdx : holeIdx - 9;
      const relevantRounds = rounds.filter(r => r.half === half);

      if (relevantRounds.length === 0) return null;

      const birdies  = Object.fromEntries(players.map(p => [p, 0]));
      const parCount = Object.fromEntries(players.map(p => [p, 0]));

      for (const round of relevantRounds) {
        for (const player of players) {
          const score = round.scores[player][localIdx];
          if (score < par)       birdies[player]++;
          else if (score === par) parCount[player]++;
        }
      }

      const hasBirdie = players.some(p => birdies[p] > 0);
      const metric    = hasBirdie ? birdies : parCount;
      const maxCount  = Math.max(...players.map(p => metric[p]));

      if (maxCount === 0) return null;

      const leaders = players.filter(p => metric[p] === maxCount);
      return leaders.length === 1 ? leaders[0] : null;
    });
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  npx vitest run src/lib/scoring.test.js
  ```

  Expected: all tests pass including the new half-isolation test.

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/scoring.js src/lib/scoring.test.js
  git commit -m "feat: update calcKingpin to filter rounds by half and use local index"
  ```

---

## Task 3: Add CSS styles for half toggle and badge

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Open `src/index.css` and append the following at the end of the file (after `.success`)**

  ```css
  /* ── Half toggle (Admin) ── */
  .half-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1.25rem;
  }

  .half-toggle button {
    border-radius: 0;
    background: var(--bg-light);
    color: var(--text-dim);
    border: 1px solid #3d7a55;
  }

  .half-toggle button:first-child { border-radius: var(--radius) 0 0 var(--radius); }
  .half-toggle button:last-child  { border-radius: 0 var(--radius) var(--radius) 0; }

  .half-toggle button.active {
    background: var(--gold);
    color: var(--bg);
  }

  /* ── Half badge (Rounds list) ── */
  .half-badge {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    font-family: var(--font-mono);
    margin-left: 0.5rem;
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/index.css
  git commit -m "feat: add half-toggle and half-badge CSS"
  ```

---

## Task 4: Update Admin.jsx with half toggle

**Files:**
- Modify: `src/pages/Admin.jsx`

The current Admin imports `useConfig` and uses its `pars` for the scorecard headers. After this change it uses `FRONT_PARS` / `BACK_PARS` directly, so `useConfig` is no longer needed here.

- [ ] **Step 1: Replace the full contents of `src/pages/Admin.jsx` with**

  ```jsx
  import { useState } from 'react';
  import { doc, setDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { PLAYERS, PLAYER_NAMES, FRONT_PARS, BACK_PARS } from '../constants';
  import { calcRoundPoints } from '../lib/scoring';

  const PIN = import.meta.env.VITE_ADMIN_PIN ?? '1234';

  function emptyScores() {
    return Object.fromEntries(PLAYERS.map(p => [p, Array(9).fill('')]));
  }

  function scoreClass(score, par) {
    const diff = score - par;
    if (diff <= -2) return 'eagle';
    if (diff === -1) return 'birdie';
    if (diff === 0) return 'par';
    if (diff === 1) return 'bogey';
    if (diff >= 2) return 'double';
    return '';
  }

  function totalFor(playerScores) {
    const nums = playerScores.map(Number);
    if (nums.some(n => isNaN(n) || n <= 0)) return null;
    return nums.reduce((a, b) => a + b, 0);
  }

  export default function Admin() {
    const [pin, setPin] = useState('');
    const [authed, setAuthed] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [half, setHalf] = useState('front');
    const [scores, setScores] = useState(emptyScores);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!authed) {
      return (
        <main className="admin-pin">
          <h1>Admin</h1>
          <form onSubmit={e => { e.preventDefault(); if (pin === PIN) setAuthed(true); }}>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="PIN"
              autoFocus
            />
            <button type="submit">Enter</button>
          </form>
        </main>
      );
    }

    const halfPars  = half === 'back' ? BACK_PARS : FRONT_PARS;
    const startHole = half === 'back' ? 10 : 1;

    function switchHalf(newHalf) {
      setHalf(newHalf);
      setScores(emptyScores());
      setSaved(false);
    }

    function setScore(player, holeIdx, value) {
      setScores(prev => ({
        ...prev,
        [player]: prev[player].map((s, i) => i === holeIdx ? value : s),
      }));
    }

    const allFilled = PLAYERS.every(p =>
      scores[p].every(s => s !== '' && !isNaN(Number(s)) && Number(s) > 0)
    );

    const pointsResult = allFilled
      ? calcRoundPoints(Object.fromEntries(PLAYERS.map(p => [p, scores[p].map(Number)])))
      : null;

    async function handleSubmit(e) {
      e.preventDefault();
      if (!allFilled) return;
      const numericScores = Object.fromEntries(
        PLAYERS.map(p => [p, scores[p].map(Number)])
      );
      setSaving(true);
      await setDoc(doc(db, 'rounds', date), { date, half, scores: numericScores });
      setSaving(false);
      setSaved(true);
      setScores(emptyScores());
    }

    return (
      <main className="admin">
        <h1>Enter Round</h1>
        {saved && <p className="success">Round saved!</p>}
        <form onSubmit={handleSubmit}>
          <div className="date-row">
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); setSaved(false); }}
              />
            </label>
          </div>
          <div className="half-toggle">
            <button
              type="button"
              className={half === 'front' ? 'active' : ''}
              onClick={() => switchHalf('front')}
            >
              Front 9
            </button>
            <button
              type="button"
              className={half === 'back' ? 'active' : ''}
              onClick={() => switchHalf('back')}
            >
              Back 9
            </button>
          </div>
          <div className="scorecard-wrap">
            <table className="admin-scorecard">
              <thead>
                <tr>
                  <th className="left">Player</th>
                  {halfPars.map((par, i) => (
                    <th key={i}>H{startHole + i}<br /><small>par {par}</small></th>
                  ))}
                  <th>Total</th>
                  {pointsResult && <th>Pts</th>}
                </tr>
              </thead>
              <tbody>
                {PLAYERS.map(player => {
                  const playerTotal = totalFor(scores[player]);
                  return (
                    <tr key={player}>
                      <td className="left">{PLAYER_NAMES[player]}</td>
                      {scores[player].map((s, holeIdx) => {
                        const num = Number(s);
                        const cls = s && !isNaN(num) && num > 0
                          ? scoreClass(num, halfPars[holeIdx])
                          : '';
                        return (
                          <td key={holeIdx}>
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={s}
                              className={cls}
                              onChange={e => { setScore(player, holeIdx, e.target.value); setSaved(false); }}
                            />
                          </td>
                        );
                      })}
                      <td className="total">{playerTotal ?? '—'}</td>
                      {pointsResult && <td className="pts">{pointsResult.points[player]}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type="submit" disabled={!allFilled || saving}>
            {saving ? 'Saving…' : 'Submit Round'}
          </button>
        </form>
      </main>
    );
  }
  ```

- [ ] **Step 2: Verify the dev server runs without errors**

  ```bash
  cd C:\Users\zgaud\OneDrive\Documents\GitHub\gh-cup
  npm run dev
  ```

  Navigate to `http://localhost:5173/gh-cup/admin`. Enter the PIN, verify:
  - Two-button toggle appears (Front 9 / Back 9) with Front 9 active (gold)
  - Grid shows 9 columns labelled H1–H9 with pars 4,4,4,4,3,4,5,3,4
  - Clicking Back 9 clears all inputs, columns switch to H10–H18 with pars 4,5,5,4,4,3,4,3,4
  - Switching back to Front 9 clears inputs again

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/Admin.jsx
  git commit -m "feat: add front/back half toggle to Admin score entry"
  ```

---

## Task 5: Update RoundScorecard to accept startHole prop

**Files:**
- Modify: `src/components/RoundScorecard.jsx`

- [ ] **Step 1: Add the `startHole` prop and use it in column headers**

  Replace the current component signature and header row with:
  ```jsx
  export default function RoundScorecard({ round, pars, startHole = 1 }) {
  ```

  Change the header row from:
  ```jsx
  {pars.map((_, i) => <th key={i}>H{i + 1}</th>)}
  ```
  To:
  ```jsx
  {pars.map((_, i) => <th key={i}>H{startHole + i}</th>)}
  ```

  Full updated file for reference:
  ```jsx
  import { PLAYERS, PLAYER_NAMES } from '../constants';
  import { calcRoundPoints } from '../lib/scoring';

  function scoreClass(score, par) {
    const diff = score - par;
    if (diff <= -2) return 'eagle';
    if (diff === -1) return 'birdie';
    if (diff === 0) return 'par';
    if (diff === 1) return 'bogey';
    return 'double';
  }

  export default function RoundScorecard({ round, pars, startHole = 1 }) {
    const { totals, points } = calcRoundPoints(round.scores);

    return (
      <div className="scorecard-wrap">
        <table className="scorecard">
          <thead>
            <tr>
              <th className="left">Player</th>
              {pars.map((_, i) => <th key={i}>H{startHole + i}</th>)}
              <th>Total</th>
              <th>Pts</th>
            </tr>
            <tr>
              <th className="left">Par</th>
              {pars.map((par, i) => <th key={i}>{par}</th>)}
              <th>{pars.reduce((a, b) => a + b, 0)}</th>
              <th>—</th>
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map(player => (
              <tr key={player}>
                <td className="left">{PLAYER_NAMES[player]}</td>
                {round.scores[player].map((score, holeIdx) => (
                  <td key={holeIdx} className={scoreClass(score, pars[holeIdx])}>
                    {score}
                  </td>
                ))}
                <td className="total">{totals[player]}</td>
                <td className="pts">{points[player]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/RoundScorecard.jsx
  git commit -m "feat: add startHole prop to RoundScorecard for correct hole numbering"
  ```

---

## Task 6: Update RoundDetail to derive halfPars and startHole

**Files:**
- Modify: `src/pages/RoundDetail.jsx`

The current component imports `useConfig` and passes its `pars` to `RoundScorecard`. After this change it reads `round.half` and uses `FRONT_PARS` / `BACK_PARS` directly, so `useConfig` and its loading state can be removed.

- [ ] **Step 1: Replace the full contents of `src/pages/RoundDetail.jsx` with**

  ```jsx
  import { useParams, Link } from 'react-router-dom';
  import { useRounds } from '../hooks/useRounds';
  import { FRONT_PARS, BACK_PARS } from '../constants';
  import RoundScorecard from '../components/RoundScorecard';

  export default function RoundDetail() {
    const { id } = useParams();
    const { rounds, loading } = useRounds();

    if (loading) return <div className="loading">Loading…</div>;

    const round = rounds.find(r => r.id === id);
    if (!round) {
      return (
        <main>
          <Link to="/rounds" className="back">← All Rounds</Link>
          <p className="empty">Round not found.</p>
        </main>
      );
    }

    const halfPars  = round.half === 'back' ? BACK_PARS : FRONT_PARS;
    const startHole = round.half === 'back' ? 10 : 1;

    return (
      <main className="round-detail">
        <Link to="/rounds" className="back">← All Rounds</Link>
        <h1>{round.date}</h1>
        <RoundScorecard round={round} pars={halfPars} startHole={startHole} />
      </main>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/RoundDetail.jsx
  git commit -m "feat: derive halfPars and startHole from round.half in RoundDetail"
  ```

---

## Task 7: Add half badge to Rounds list

**Files:**
- Modify: `src/pages/Rounds.jsx`

- [ ] **Step 1: Update the round card header in `src/pages/Rounds.jsx`**

  Find this line inside the `sorted.map(round => ...)` block:
  ```jsx
  <h3>{round.date}</h3>
  ```

  Replace with:
  ```jsx
  <h3>
    {round.date}
    <span className="half-badge">{round.half === 'back' ? 'Back 9' : 'Front 9'}</span>
  </h3>
  ```

- [ ] **Step 2: Verify in the browser**

  With the dev server running, navigate to `http://localhost:5173/gh-cup/rounds`. If any rounds exist, each card header should show the date followed by a small "Front 9" or "Back 9" label in mono dimmed text.

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/Rounds.jsx
  git commit -m "feat: show Front 9 / Back 9 badge on each round card"
  ```

---

## Task 8: Run full test suite and push

- [ ] **Step 1: Run all tests**

  ```bash
  cd C:\Users\zgaud\OneDrive\Documents\GitHub\gh-cup
  npx vitest run
  ```

  Expected: all tests pass. The `calcKingpin` suite now has 7 tests (5 existing + 1 half-isolation).

- [ ] **Step 2: Push to remote (triggers GitHub Actions deploy)**

  ```bash
  git push
  ```

  Expected: GitHub Actions workflow runs, builds, and deploys to `zgaudreau.github.io/gh-cup`.
