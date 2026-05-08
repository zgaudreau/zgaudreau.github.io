# GH Cup — Kingpin Detail Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a detailed Kingpin grid below the existing owner grid showing per-player eagle/birdie/par counts per hole, with eagle taking precedence over birdie, which takes precedence over par.

**Architecture:** Add `calcKingpinDetails` to `scoring.js` (returns rich per-hole objects); refactor `calcKingpin` into a thin wrapper; create `KingpinDetailGrid` component; wire both into `Season.jsx` below the existing grids.

**Tech Stack:** React 18, Vite, Vitest, CSS custom properties

---

## File Map

| File | Change |
|---|---|
| `src/lib/scoring.js` | Add `calcKingpinDetails`; `calcKingpin` becomes thin wrapper |
| `src/lib/scoring.test.js` | Add `describe('calcKingpinDetails')` with 7 tests |
| `src/components/KingpinDetailGrid.jsx` | New component |
| `src/pages/Season.jsx` | Import + call `calcKingpinDetails`; render `KingpinDetailGrid` |
| `src/index.css` | Add `.kingpin-detail` spacing rule |

---

## Task 1: `calcKingpinDetails` — tests then implementation

**Files:**
- Modify: `src/lib/scoring.js`
- Modify: `src/lib/scoring.test.js`

### Background you need

The project tracks golf scores for 4 players (zack, chris, ben, julian) at an 18-hole course split into front 9 and back 9. Each Firestore round document has `half: 'front' | 'back'` and `scores: { [player]: number[] }` where the array is always 9 elements. `calcKingpin` currently returns a 18-element array of owner strings/nulls — it will become a thin wrapper around `calcKingpinDetails`.

**Category hierarchy:** eagle (`score ≤ par − 2`) beats birdie (`score === par − 1`) beats par (`score === par`). Once any player achieves a better category on a hole, only counts for that category matter for ownership.

**Half filtering:** holes 0–8 are front (filter rounds where `r.half === 'front'`); holes 9–17 are back (filter `r.half === 'back'`). Score array index is always local (0–8), computed as `holeIdx < 9 ? holeIdx : holeIdx - 9`.

### Step 1 — Write 7 failing tests

- [ ] **Open `src/lib/scoring.test.js` and add this block after the existing `describe('calcKingpin', ...)` block:**

```js
describe('calcKingpinDetails', () => {
  const pars = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 5, 5, 4, 4, 3, 4, 3, 4];

  it('returns all-null entries for no rounds', () => {
    const result = calcKingpinDetails([], pars);
    expect(result).toHaveLength(18);
    result.forEach(h => {
      expect(h.owner).toBeNull();
      expect(h.category).toBeNull();
      expect(h.bestScore).toBeNull();
    });
  });

  it('detects birdie category and counts correctly', () => {
    const rounds = [
      {
        half: 'front',
        scores: {
          zack:   [3, 4, 4, 4, 3, 4, 5, 3, 4],
          chris:  [4, 4, 4, 4, 3, 4, 5, 3, 4],
          ben:    [4, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [4, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    expect(result[0].category).toBe('birdie');
    expect(result[0].bestScore).toBe(3);
    expect(result[0].counts.zack).toBe(1);
    expect(result[0].counts.chris).toBe(0);
    expect(result[0].owner).toBe('zack');
  });

  it('detects eagle category and ignores birdie counts', () => {
    const rounds = [
      {
        half: 'front',
        scores: {
          zack:   [2, 4, 4, 4, 3, 4, 5, 3, 4], // eagle on hole 0 (2 ≤ par-2=2)
          chris:  [3, 4, 4, 4, 3, 4, 5, 3, 4], // birdie on hole 0 — does NOT count
          ben:    [4, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [4, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    expect(result[0].category).toBe('eagle');
    expect(result[0].bestScore).toBe(2);
    expect(result[0].counts.zack).toBe(1);
    expect(result[0].counts.chris).toBe(0);
    expect(result[0].owner).toBe('zack');
  });

  it('detects par category when no birdies or eagles', () => {
    const rounds = [
      {
        half: 'front',
        scores: {
          zack:   [4, 4, 4, 4, 3, 4, 5, 3, 4], // par on hole 0
          chris:  [5, 4, 4, 4, 3, 4, 5, 3, 4], // bogey
          ben:    [5, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [5, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    expect(result[0].category).toBe('par');
    expect(result[0].bestScore).toBe(4);
    expect(result[0].counts.zack).toBe(1);
    expect(result[0].owner).toBe('zack');
  });

  it('returns null owner when counts are tied', () => {
    const rounds = [
      {
        half: 'front',
        scores: {
          zack:   [3, 4, 4, 4, 3, 4, 5, 3, 4],
          chris:  [3, 4, 4, 4, 3, 4, 5, 3, 4],
          ben:    [4, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [4, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    expect(result[0].category).toBe('birdie');
    expect(result[0].counts.zack).toBe(1);
    expect(result[0].counts.chris).toBe(1);
    expect(result[0].owner).toBeNull();
  });

  it('returns null category for holes with no relevant rounds (half isolation)', () => {
    const rounds = [
      {
        half: 'back',
        scores: {
          zack:   [3, 4, 4, 4, 5, 4, 3, 4, 4],
          chris:  [4, 4, 4, 4, 5, 4, 3, 4, 4],
          ben:    [4, 4, 4, 4, 5, 4, 3, 4, 4],
          julian: [4, 4, 4, 4, 5, 4, 3, 4, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    for (let i = 0; i < 9; i++) {
      expect(result[i].category).toBeNull();
      expect(result[i].owner).toBeNull();
    }
    // hole 9 (back, local index 0): zack scored 3 < par[9]=4 → birdie
    expect(result[9].category).toBe('birdie');
    expect(result[9].owner).toBe('zack');
  });

  it('eagle achieved later resets birdie counts to zero', () => {
    const rounds = [
      {
        half: 'front',
        scores: {
          zack:   [3, 4, 4, 4, 3, 4, 5, 3, 4], // birdie
          chris:  [3, 4, 4, 4, 3, 4, 5, 3, 4], // birdie
          ben:    [4, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [4, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
      {
        half: 'front',
        scores: {
          zack:   [3, 4, 4, 4, 3, 4, 5, 3, 4], // birdie — irrelevant once eagle exists
          chris:  [2, 4, 4, 4, 3, 4, 5, 3, 4], // eagle — new best category
          ben:    [4, 4, 4, 4, 3, 4, 5, 3, 4],
          julian: [4, 4, 4, 4, 3, 4, 5, 3, 4],
        },
      },
    ];
    const result = calcKingpinDetails(rounds, pars);
    expect(result[0].category).toBe('eagle');
    expect(result[0].counts.zack).toBe(0);  // 2 birdies don't count
    expect(result[0].counts.chris).toBe(1); // 1 eagle counts
    expect(result[0].owner).toBe('chris');
  });
});
```

Also add `calcKingpinDetails` to the import at the top of the file:
```js
import { calcRoundPoints, calcSeasonPoints, calcKingpin, calcKingpinDetails } from './scoring';
```

- [ ] **Run tests to verify the new block fails**

  ```bash
  cd C:\Users\zgaud\OneDrive\Documents\GitHub\gh-cup
  npx vitest run src/lib/scoring.test.js
  ```

  Expected: 7 new failures (`calcKingpinDetails is not a function`), 13 existing tests still pass.

### Step 2 — Implement `calcKingpinDetails` and refactor `calcKingpin`

- [ ] **Replace the `calcKingpin` function in `src/lib/scoring.js` with the following two functions** (keep everything above and below unchanged):

```js
/**
 * @param {Array<{ half: string, scores: Object }>} rounds
 * @param {number[]} pars  full 18-element par array
 * @returns {Array<{ owner: string|null, category: string|null, bestScore: number|null, counts: Object }>}
 */
export function calcKingpinDetails(rounds, pars) {
  if (rounds.length === 0) {
    return pars.map(() => ({ owner: null, category: null, bestScore: null, counts: {} }));
  }

  const players = Object.keys(rounds[0].scores);

  return pars.map((par, holeIdx) => {
    const half        = holeIdx < 9 ? 'front' : 'back';
    const localIdx    = holeIdx < 9 ? holeIdx : holeIdx - 9;
    const relevantRounds = rounds.filter(r => r.half === half);

    if (relevantRounds.length === 0) {
      return { owner: null, category: null, bestScore: null, counts: Object.fromEntries(players.map(p => [p, 0])) };
    }

    let hasEagle = false;
    let hasBirdie = false;
    let hasPar = false;

    for (const round of relevantRounds) {
      for (const player of players) {
        const score = round.scores[player][localIdx];
        if (score <= par - 2)      hasEagle = true;
        else if (score === par - 1) hasBirdie = true;
        else if (score === par)     hasPar = true;
      }
    }

    let category = null;
    if (hasEagle)       category = 'eagle';
    else if (hasBirdie) category = 'birdie';
    else if (hasPar)    category = 'par';

    if (category === null) {
      return { owner: null, category: null, bestScore: null, counts: Object.fromEntries(players.map(p => [p, 0])) };
    }

    const bestScore = category === 'eagle' ? par - 2 : category === 'birdie' ? par - 1 : par;

    const counts = Object.fromEntries(players.map(p => [p, 0]));
    for (const round of relevantRounds) {
      for (const player of players) {
        const score = round.scores[player][localIdx];
        if      (category === 'eagle'  && score <= par - 2)    counts[player]++;
        else if (category === 'birdie' && score === par - 1)   counts[player]++;
        else if (category === 'par'    && score === par)        counts[player]++;
      }
    }

    const maxCount = Math.max(...players.map(p => counts[p]));
    if (maxCount === 0) return { owner: null, category, bestScore, counts };

    const leaders = players.filter(p => counts[p] === maxCount);
    const owner   = leaders.length === 1 ? leaders[0] : null;

    return { owner, category, bestScore, counts };
  });
}

/**
 * @param {Array<{ half: string, scores: Object }>} rounds
 * @param {number[]} pars  full 18-element par array
 * @returns {(string | null)[]}  18-element array, one owner per hole
 */
export function calcKingpin(rounds, pars) {
  return calcKingpinDetails(rounds, pars).map(h => h.owner);
}
```

- [ ] **Run all tests to verify all 20 pass**

  ```bash
  npx vitest run src/lib/scoring.test.js
  ```

  Expected: 20 passed (13 existing + 7 new), 0 failed.

- [ ] **Commit**

  ```bash
  git add src/lib/scoring.js src/lib/scoring.test.js
  git commit -m "feat: add calcKingpinDetails with eagle/birdie/par category logic"
  ```

---

## Task 2: `KingpinDetailGrid` component

**Files:**
- Create: `src/components/KingpinDetailGrid.jsx`

### Background

- `PLAYERS = ['zack', 'chris', 'ben', 'julian']` — use this order for rows
- `PLAYER_NAMES = { zack: 'Zack', chris: 'Chris', ben: 'Ben', julian: 'Julian' }` — already first names only
- CSS classes available: `.eagle` (gold bg), `.birdie` (green bg), `.par` (dim text), `.owned` (gold text + bold), `.kingpin-scroll` (overflow-x: auto)
- The `details` prop is an 18-element array from `calcKingpinDetails`. Each entry: `{ owner, category, bestScore, counts }`. `category` is `null` for holes with no data.

- [ ] **Create `src/components/KingpinDetailGrid.jsx` with this content:**

```jsx
import { PLAYERS, PLAYER_NAMES } from '../constants';

const CATEGORY_LABEL = { eagle: 'Eagle', birdie: 'Birdie', par: 'Par' };

export default function KingpinDetailGrid({ details, pars }) {
  return (
    <section className="kingpin kingpin-detail">
      <h2>Kingpin — Detail</h2>
      <div className="kingpin-scroll">
        <table>
          <thead>
            <tr>
              <th className="left">Hole</th>
              {pars.map((_, i) => <th key={i}>{i + 1}</th>)}
            </tr>
            <tr>
              <th className="left">Par</th>
              {pars.map((par, i) => <th key={i}>{par}</th>)}
            </tr>
            <tr>
              <th className="left">Best</th>
              {details.map((hole, i) => (
                <th key={i} className={hole.category ?? ''}>
                  {hole.category ? (
                    <>
                      {CATEGORY_LABEL[hole.category]}
                      <br />
                      <small>({hole.bestScore})</small>
                    </>
                  ) : '—'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map(player => (
              <tr key={player}>
                <td className="left">{PLAYER_NAMES[player]}</td>
                {details.map((hole, i) => {
                  const count   = hole.counts[player] ?? 0;
                  const isOwner = hole.owner === player;
                  return (
                    <td key={i} className={isOwner ? 'owned' : ''}>
                      {hole.category ? count : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Commit**

  ```bash
  git add src/components/KingpinDetailGrid.jsx
  git commit -m "feat: add KingpinDetailGrid component"
  ```

---

## Task 3: Add `.kingpin-detail` CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Open `src/index.css` and add `.kingpin-detail` to the existing `/* ── Kingpin ── */` section**

  Find the `/* ── Kingpin ── */` section (around line 162) which currently reads:
  ```css
  /* ── Kingpin ── */
  .kingpin-scroll { overflow-x: auto; }
  .owned { color: var(--gold); font-weight: 600; }
  .unowned { color: var(--bg-light); }
  ```

  Add `.kingpin-detail` to make it:
  ```css
  /* ── Kingpin ── */
  .kingpin-scroll { overflow-x: auto; }
  .owned { color: var(--gold); font-weight: 600; }
  .unowned { color: var(--bg-light); }
  .kingpin-detail { margin-top: 1.5rem; }
  ```

- [ ] **Commit**

  ```bash
  git add src/index.css
  git commit -m "feat: add kingpin-detail spacing CSS"
  ```

---

## Task 4: Wire up `Season.jsx`

**Files:**
- Modify: `src/pages/Season.jsx`

The current file:
```jsx
import { useRounds } from '../hooks/useRounds';
import { useConfig } from '../hooks/useConfig';
import { calcSeasonPoints, calcKingpin } from '../lib/scoring';
import StrokeLeaderboard from '../components/StrokeLeaderboard';
import KingpinGrid from '../components/KingpinGrid';

export default function Season() {
  const { rounds, loading: roundsLoading } = useRounds();
  const { pars, loading: configLoading } = useConfig();

  if (roundsLoading || configLoading) return <div className="loading">Loading…</div>;

  const seasonPoints = calcSeasonPoints(rounds);
  const kingpinOwners = calcKingpin(rounds, pars);

  return (
    <main className="season">
      <h1>GH Cup — Season Standings</h1>
      <div className="season-grid">
        <StrokeLeaderboard seasonPoints={seasonPoints} rounds={rounds} />
        <KingpinGrid owners={kingpinOwners} pars={pars} />
      </div>
    </main>
  );
}
```

- [ ] **Replace the full contents of `src/pages/Season.jsx` with:**

```jsx
import { useRounds } from '../hooks/useRounds';
import { useConfig } from '../hooks/useConfig';
import { calcSeasonPoints, calcKingpinDetails } from '../lib/scoring';
import StrokeLeaderboard from '../components/StrokeLeaderboard';
import KingpinGrid from '../components/KingpinGrid';
import KingpinDetailGrid from '../components/KingpinDetailGrid';

export default function Season() {
  const { rounds, loading: roundsLoading } = useRounds();
  const { pars, loading: configLoading } = useConfig();

  if (roundsLoading || configLoading) return <div className="loading">Loading…</div>;

  const seasonPoints   = calcSeasonPoints(rounds);
  const kingpinDetails = calcKingpinDetails(rounds, pars);
  const kingpinOwners  = kingpinDetails.map(h => h.owner);

  return (
    <main className="season">
      <h1>GH Cup — Season Standings</h1>
      <div className="season-grid">
        <StrokeLeaderboard seasonPoints={seasonPoints} rounds={rounds} />
        <KingpinGrid owners={kingpinOwners} pars={pars} />
      </div>
      <KingpinDetailGrid details={kingpinDetails} pars={pars} />
    </main>
  );
}
```

- [ ] **Commit**

  ```bash
  git add src/pages/Season.jsx
  git commit -m "feat: wire KingpinDetailGrid into Season page"
  ```

---

## Task 5: Run full test suite and push

- [ ] **Run all tests**

  ```bash
  cd C:\Users\zgaud\OneDrive\Documents\GitHub\gh-cup
  npx vitest run
  ```

  Expected: 20 passed, 0 failed.

- [ ] **Push to remote (triggers GitHub Actions deploy)**

  ```bash
  git push
  ```

  Expected: GitHub Actions workflow deploys to `zgaudreau.github.io/gh-cup`.
