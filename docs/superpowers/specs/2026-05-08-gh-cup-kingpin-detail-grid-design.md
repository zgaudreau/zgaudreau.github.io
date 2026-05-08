# GH Cup — Kingpin Detail Grid Design

## Overview

Add a detailed Kingpin grid below the existing owner-row grid. The new grid shows, per hole, the **best score category** (eagle / birdie / par) that has been achieved and how many times each player has achieved that category. Ownership (highest count) is highlighted. When a better category is first achieved on a hole, counts for the old category become irrelevant and the new category starts from zero for all players.

---

## Category Hierarchy

```
eagle  (score ≤ par − 2)  — highest tier
birdie (score === par − 1)
par    (score === par)     — lowest tier
```

Once any player achieves a given category on a hole, only that category's counts determine ownership. A player with 10 pars instantly loses ownership the moment anyone birdies the hole. A player with 10 birdies instantly loses ownership the moment anyone eagles the hole.

---

## Scoring Logic (`src/lib/scoring.js`)

### `calcKingpinDetails(rounds, pars)` — new export

**Signature:** `calcKingpinDetails(rounds, pars) → HoleDetail[]`

Returns an 18-element array. Each element is:

```js
{
  owner:     string | null,   // player key with highest count, null if tied or no data
  category:  'eagle' | 'birdie' | 'par' | null,  // null if no scores on this hole
  bestScore: number | null,   // actual score value: par-2, par-1, or par; null if no data
  counts:    { [playerKey: string]: number }      // count per player for that category
}
```

**Per-hole algorithm** (same half-filtering + localIdx as existing `calcKingpin`):

1. Filter `rounds` to only those matching the hole's half (`'front'` for holes 0–8, `'back'` for holes 9–17). Use `localIdx = holeIdx < 9 ? holeIdx : holeIdx - 9` for score lookup.
2. If no relevant rounds → return `{ owner: null, category: null, bestScore: null, counts: {} }`
3. Determine category from lowest score achieved across all players and relevant rounds:
   - Any score ≤ par − 2 → `'eagle'`
   - Any score === par − 1 → `'birdie'`
   - Any score === par → `'par'`
   - Otherwise → `null`
4. Compute `bestScore`: `par − 2` for eagle, `par − 1` for birdie, `par` for par.
5. Count per player: number of relevant rounds where `score` falls in the category:
   - eagle: `score ≤ par − 2`
   - birdie: `score === par − 1`
   - par: `score === par`
6. Determine owner: player with the highest count. If tied (or all zero) → `null`.

### `calcKingpin(rounds, pars)` — updated to thin wrapper

```js
export function calcKingpin(rounds, pars) {
  return calcKingpinDetails(rounds, pars).map(h => h.owner);
}
```

Existing tests and callers continue to work without changes.

---

## Tests (`src/lib/scoring.test.js`)

New `describe('calcKingpinDetails')` block:

| Test | What it verifies |
|---|---|
| Returns 18 nulls for no rounds | Empty rounds → all holes null |
| Eagle category when any score ≤ par−2 | Eagle detected; birdie/par counts ignored |
| Eagle owner has highest eagle count | Owner derived from eagle counts |
| Birdie category when no eagles | Falls back to birdie; par counts ignored |
| Par category when no birdies or eagles | Falls back to par counts |
| Tied counts → null owner | Equal counts → no owner |
| Half isolation | Back-9 rounds excluded from front holes and vice versa |

All existing `calcKingpin` tests remain unchanged — they test the thin wrapper behaviour.

---

## Component (`src/components/KingpinDetailGrid.jsx`)

**Props:**
```js
{ details: HoleDetail[], pars: number[] }
```

**Outer element:** `<section className="kingpin kingpin-detail">` — inherits base `.kingpin` styles and adds margin via `.kingpin-detail`.

**Layout** (scrollable table, same `.kingpin-scroll` wrapper pattern):

```
             H1     H2     H3   ...  H18
Best Score  Birdie  Par   Par        Birdie
              (3)   (4)   (4)          (3)
Zack           0     2     1            1
Chris          1     2     1            1
Ben            0     2     3            0
Julian         0     0     1            0
```

- **Header row**: `H{i + 1}` hole numbers (matches existing KingpinGrid pattern — no startHole needed since this is always displayed as a full 18-hole season view)
- **Best Score row**: category label (`Eagle` / `Birdie` / `Par`) in a `<td>` with the matching score color class (`eagle`, `birdie`, `par`). Score value in small text below: `(2)`, `(3)`, `(4)`. Holes with no data show `—`.
- **Player rows**: one row per player (in PLAYERS order). Each cell shows the player's count for that hole. Cells where the player is the owner get `className="owned"`. Holes with `category === null` show `—`.
- **Section heading**: `<h2>Kingpin — Detail</h2>` to distinguish from the owner grid above.

---

## Season Page (`src/pages/Season.jsx`)

Replace the single `calcKingpin` call with `calcKingpinDetails`, then derive owners:

```js
import { calcSeasonPoints, calcKingpin, calcKingpinDetails } from '../lib/scoring';
import KingpinDetailGrid from '../components/KingpinDetailGrid';

// inside Season():
const kingpinDetails = calcKingpinDetails(rounds, pars);
const kingpinOwners  = kingpinDetails.map(h => h.owner);
```

Render `KingpinDetailGrid` directly below `KingpinGrid`:

```jsx
<KingpinGrid owners={kingpinOwners} pars={pars} />
<KingpinDetailGrid details={kingpinDetails} pars={pars} />
```

---

## Styles (`src/index.css`)

One new rule to space the detail grid from the owner grid:

```css
.kingpin-detail { margin-top: 1.5rem; }
```

Score coloring in the Best Score row reuses existing classes: `.eagle`, `.birdie`, `.par`.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/scoring.js` | Add `calcKingpinDetails`; `calcKingpin` becomes thin wrapper |
| `src/lib/scoring.test.js` | Add `describe('calcKingpinDetails')` with 7 tests |
| `src/components/KingpinDetailGrid.jsx` | New component |
| `src/pages/Season.jsx` | Import + call `calcKingpinDetails`; render `KingpinDetailGrid` |
| `src/index.css` | Add `.kingpin-detail` spacing rule |
