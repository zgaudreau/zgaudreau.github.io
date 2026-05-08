# GH Cup — Front/Back 9 Selection Design

## Overview

Add a Front 9 / Back 9 toggle to score entry. Each round covers exactly one half of the course. Scores are stored as 9-element arrays with a `half` field indicating which 9 holes were played.

---

## Data Model

### Round document (updated)

```js
{
  id: "2025-05-09",          // date string — one round per day
  date: "2025-05-09",
  half: "front",             // NEW: "front" | "back"
  scores: {
    zack:   [4, 3, 5, 4, 4, 5, 3, 4, 4],   // always 9 elements
    chris:  [4, 4, 4, 5, 3, 4, 4, 4, 5],
    ben:    [5, 3, 4, 4, 4, 4, 4, 5, 4],
    julian: [4, 4, 5, 3, 5, 4, 3, 4, 4]
  }
}
```

- Document ID remains the date string (one outing per day, always one half)
- Score arrays are always 9 elements regardless of front or back
- No Firestore migration needed — no rounds exist yet

### Config document — unchanged

```js
{ pars: [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 5, 5, 4, 4, 3, 4, 3, 4] }  // full 18
```

---

## Constants (`src/constants.js`)

Add two derived exports for convenient half-specific par access:

```js
export const FRONT_PARS = DEFAULT_PARS.slice(0, 9);  // [4,4,4,4,3,4,5,3,4]
export const BACK_PARS  = DEFAULT_PARS.slice(9);      // [4,5,5,4,4,3,4,3,4]
```

---

## Admin Page (`src/pages/Admin.jsx`)

### Half toggle

After PIN auth, a segmented Front 9 / Back 9 control appears above the scorecard. Default: `front`.

- Switching halves resets the score grid (any typed values are cleared)
- The selected half determines which hole numbers and par values appear in the column headers
- `half` state is submitted to Firestore alongside `date` and `scores`

### Score grid

- Always 9 input columns (changed from 18)
- Column headers show `H{startHole + i}` where `startHole` is 1 for front, 10 for back
- Par labels under each header use the correct 9-element par slice
- `emptyScores()` creates `Array(9).fill('')` per player (changed from `DEFAULT_PARS.length`)

### Submit

```js
await setDoc(doc(db, 'rounds', date), { date, half, scores: numericScores });
```

---

## Scoring (`src/lib/scoring.js`)

### `calcRoundPoints` — unchanged

Sums the 9-element score array. Works identically with 9 scores as it did with 18.

### `calcSeasonPoints` — unchanged

Accumulates round points across all rounds regardless of half.

### `calcKingpin` — updated

Currently assumes every round covers all holes. Updated to filter rounds by half and use a local index (0–8) to look up scores.

```js
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
        if (score < par)      birdies[player]++;
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

### Tests (`src/lib/scoring.test.js`)

- All existing `calcKingpin` tests gain `half: 'front'` on each round fixture (previously no `half` field was needed since the function didn't filter)
- New test: back-9 rounds are excluded from front-hole Kingpin ownership (and vice versa)
- `calcRoundPoints` and `calcSeasonPoints` tests unchanged

---

## Display Changes

### `RoundScorecard` component (`src/components/RoundScorecard.jsx`)

New prop: `startHole: number` (1 for front, 10 for back).

- Column headers render as `H{startHole + i}` instead of `H{i + 1}`
- `pars` prop is now a 9-element slice (correct half) — no internal slicing needed
- Score iteration unchanged: `round.scores[player].map(...)` naturally covers 9 holes

### `RoundDetail` page (`src/pages/RoundDetail.jsx`)

Reads `round.half` from Firestore to derive:
- `halfPars`: `round.half === 'back' ? BACK_PARS : FRONT_PARS`
- `startHole`: `round.half === 'back' ? 10 : 1`

Passes both to `<RoundScorecard round={round} pars={halfPars} startHole={startHole} />`.

### Rounds list (`src/pages/Rounds.jsx`)

Each round card shows a "Front 9" or "Back 9" label alongside the date:

```jsx
<h3>{round.date} <span className="half-badge">{round.half === 'back' ? 'Back 9' : 'Front 9'}</span></h3>
```

### `KingpinGrid` component — unchanged

Continues to display all 18 holes. Holes on the half that hasn't been played yet simply show `—` (no owner) until rounds covering those holes are entered.

---

## Styles (`src/index.css`)

One new class for the half toggle and badge:

```css
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

.half-badge {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-family: var(--font-mono);
  margin-left: 0.5rem;
}
```

---

## Files Changed

| File | Change |
|---|---|
| `src/constants.js` | Add `FRONT_PARS`, `BACK_PARS` |
| `src/lib/scoring.js` | Update `calcKingpin` to filter by half + use localIdx |
| `src/lib/scoring.test.js` | Add `half` to fixtures; add back-9 exclusion test |
| `src/pages/Admin.jsx` | Add half toggle, fix `emptyScores` to 9, save `half` field |
| `src/pages/RoundDetail.jsx` | Derive `halfPars` + `startHole` from `round.half` |
| `src/pages/Rounds.jsx` | Show "Front 9" / "Back 9" badge on each round card |
| `src/components/RoundScorecard.jsx` | Accept `startHole` prop, use for hole number rendering |
| `src/index.css` | Add `.half-toggle` and `.half-badge` styles |
