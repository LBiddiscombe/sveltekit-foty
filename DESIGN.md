# Footballer of the Year Remake — Design Spec

## 1. Core Identity

- **FotY skeleton** (career management sim) with **JfG/Volley Challenge arcade muscle** for chance resolution
- Single-player career: create a player, improve stats, sign for clubs, climb the English pyramid
- Tech: Svelte + P5.js, fullscreen SPA, mobile-first (phone primary), desktop mouse fallback

## 2. Season & League Structure

- English pyramid of 4 divisions (obvious parody names, e.g. Premiership → Pro League → Challenge League → Regional League — TBD)
- **30-week calendar** — some weeks have 1 game (weekend), some have 2 (midweek + weekend)
- Two domestic cups post-MVP; European competitions as stretch goal
- Summer + winter transfer windows (English league format)
- Fictional club names (obvious parodies), light identity: name + primary colour + monogram crest (~92 clubs)

## 3. Player

- Enter name; always a striker
- Generated pixel art face from name seed
- 4 stats: Power, Accuracy, Technique, Athleticism
- Athleticism opens future training mini-games (track & field style button masher)

### Stat → Mechanic Mapping

| Stat            | Volley effect                           | Penalty effect                             |
| --------------- | --------------------------------------- | ------------------------------------------ |
| **Power**       | Ball speed → harder for keeper to reach | Ball speed → keeper has less reaction time |
| **Accuracy**    | Wider timing tolerance on release       | Wider acceptable straightness of swipe     |
| **Technique**   | Tighter ball placement vs aim           | Cleaner quadrant mapping on swipe          |
| **Athleticism** | Match sim: recovery, injury resistance  | Future: training mini-game difficulty      |

## 2a. Season Calendar (30 weeks)

| League                 | Total games | Double-game weeks | Single-game weeks |
| ---------------------- | ----------- | ----------------- | ----------------- |
| Premier Div (38 games) | 38          | 8                 | 22                |
| Champions Div (46)     | 46          | 16                | 14                |
| Division 1 (46)        | 46          | 16                | 14                |
| Division 2 (46)        | 46          | 16                | 14                |

Double-game weeks are randomly allocated across the season. Not visible in advance.

## 4. Weekly Loop

1. **Hub** → training allocation, shop, fixture list, inbox, player profile
2. **Pre-match (game 1)** → see next deck card (chance count), choose Play or Skip
3. **Match (game 1)** → mini-game(s) if Play'd, sim if Skipped/empty
4. **Pre-match (game 2)** — double-game weeks only → see next deck card, choose Play or Skip
5. **Match (game 2)** — double-game weeks only → mini-game(s) or sim
6. **Vidiprinter** → all league results + updated table
7. **Incident card** (random ~40-60% of weeks) → 4-option spinning wheel
8. Repeat

## 5. Goal Card System

- Start with a deck of ~10 Goal Cards
- Deck is hidden — you only see the top card when deciding Play/Skip
- Skipping puts card to bottom of deck
- Between matches, buy any affordable number of cards to replenish
- Each card: random 1-3 chance count (equal weight)
- Generic card type — mini-game type (volley or penalty) randomly assigned per chance
- Buy with wage money (wage only income in MVP; bonuses + sponsorship later)

### Volley Mini-Game

- Hold (finger/mouse) to move player into position under approaching ball
- Release to kick
- Timing + position quality determines outcome gradient (not binary)
- Two-axis: positioning under ball + release timing
- Outcomes: Miss → Off-target → Saved → Goal

### Penalty Mini-Game

- Swipe gesture on goal view
- Swipe direction → goal quadrant (top/middle/bottom + left/centre/right)
- Swipe speed → power
- Swipe straightness → accuracy
- Outcomes: Miss → Off-target → Saved → Goal

### Keeper

- Uniform difficulty across all clubs
- Simple reach zone vs ball trajectory collision

## 6. Progression

- XP-based stat growth per successful mini-game execution
- Team success (promotion, cup wins) gives flat XP bonus
- **Stat caps per club**: a club's league position determines max stats achievable there
- Overlap between divisions: League 2 caps can overlap League 1 minimums for transfer thresholds
- One-club career or transfer-focused are both viable paths

## 7. Transfers

- Manager interest system: clubs approach when your stats meet their threshold
- Club-specific thresholds within each league (top clubs require higher stats)
- Simple negotiation screen: accept offer, counter (gamble), or reject
- Contract: wage + length offered, you accept/counter/reject

## 8. Match Flow

- Cards with 1-3 chances: all chances play out regardless of scoring early
- If no card played / empty deck: match simulates, only the result matters
- Full vidiprinter every week: all scores + updated league table

## 9. Incident Cards (~40-60% of weeks)

- Appear after vidiprinter
- 4-option spinning wheel, tap to stop
- One option always neutral
- Effects: stat boosts/nerfs, financial changes, deck manipulation (add/remove/upgrade cards)
- Diverse pool of positive and negative incidents

## 10. Selection & Injuries

- Form-based selection: rolling match rating affects whether you start
- Transfer to new club resets form baseline
- No injuries in core loop; injuries only via negative incident card outcomes

## 11. Match Ratings

- 1-10 rating per match based on goals scored, chances converted
- Rolling form average tracked
- Form feeds transfer interest and can trigger incident card conditions

## 12. Training (Phase 1)

- Passive stat focus allocation before each matchweek
- Selected stat gets flat XP bonus after the match
- Future: optional training mini-game for bonus XP with fail risk

## 13. Save System

- 3 career slots
- Auto-save to current slot after every week
- Resume where you left off on open
- Manual save/load available

## 14. Career End

- Play forever — no forced retirement
- Stats eventually cap out per club, but career continues

## 15. Visual Style

- Svelte-native UI with retro styling (monospace fonts, no CRT scan lines)
- P5.js renders mini-games in pixel-art style
- Generated pixel face for player avatar

## 16. Delivery Plan

### Cycle 1: Clickthrough Mock

**Goal:** Full SvelteKit SPA with all routes navigable, visual identity locked, no real logic.
**Dependency:** Sets store shape, route structure, and design system for all later cycles.

#### Routes

```
/                    → title screen / new career (name entry)
/hub                 → 5 menu buttons + "Next Match" (disabled if inbox unread)
/hub/training        → stat focus picker (4 radio buttons)
/hub/shop            → buy goal cards
/hub/fixtures        → full 30-week fixture list
/hub/inbox           → messages (incidents, news, transfer offers)
/hub/profile         → player name, stats, pixel face placeholder
/pre-match           → deck card reveal (chance count), Play / Skip buttons
/match               → per-chance clickthrough (goal / miss / saved per attempt)
/vidiprinter         → scrolling scores only
```

#### Store Modules

Split by domain in `src/lib/stores/*.svelte.ts`, each exporting `$state` runes:

| Module             | Exports                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| `player.svelte.ts` | player name, stats, wage, bankBalance, goals, appearances, club, division, deck |
| `season.svelte.ts` | weekNumber, seasonNumber, fixtures, gamesPlayed, phase                          |
| `inbox.svelte.ts`  | inbox items array                                                               |
| `match.svelte.ts`  | matchResult or null                                                             |

#### Design System (locked here)

- **Font:** Press Start 2P (Google Fonts)
- **Colour palette:**
  | Role | Hex |
  |------|-----|
  | Background (near-black) | `#0a0a0a` |
  | Surface / card | `#1a1a2e` |
  | Primary text | `#e0e0e0` |
  | Accent (goals, positives) | `#4ade80` |
  | Danger (misses, red cards) | `#ef4444` |
  | Secondary accent (cards, UI) | `#f59e0b` |
  | Muted / border | `#333333` |
- **Styling:** Tailwind CSS utility classes
- **All data:** `$state` runes in `.svelte.ts` modules, hardcoded mock values

#### Component Tree

```
src/
  routes/
    +layout.svelte            — global shell (dark bg, pixel font)
    +page.svelte              — title / new career
    hub/
      +page.svelte            — hub menu (imports shared components)
      training/+page.svelte
      shop/+page.svelte
      fixtures/+page.svelte
      inbox/+page.svelte
      profile/+page.svelte
    pre-match/+page.svelte
    match/+page.svelte
    vidiprinter/+page.svelte
  lib/
    components/
      Card.svelte
      Button.svelte
      StatBar.svelte
      DeckCard.svelte
      VidiprinterLine.svelte
      SpinningWheel.svelte
      P5Canvas.svelte          — wrapper component (created in Cycle 1, used from Cycle 4+)
      minigames/
        Volley.svelte          — imports P5Canvas (Cycle 4)
        Penalty.svelte         — imports P5Canvas (Cycle 5)
    stores/
      player.svelte.ts         — player domain state
      season.svelte.ts         — season/week/fixture state
      inbox.svelte.ts          — inbox state
      match.svelte.ts          — match result state
    types/
      game.ts                  — TypeScript interfaces
```

#### P5.js Integration Pattern

- Use a single wrapper component `P5Canvas.svelte` that creates/destroys a p5 instance
- `onMount` creates the p5 instance in instance mode, attaches to a container div
- `onDestroy` calls `p5.remove()`
- Sketch function receives the container element and optional reactive props
- Each mini-game (Volley, Penalty) is a self-contained Svelte component importing `P5Canvas` and passing its sketch as a prop
- Routes render `<Volley />` or `<Penalty />` — no P5 lifecycle code in route pages

#### Weekly Loop (as implemented)

1. **Hub** — menu + "Next Match" (disabled if unread inbox)
2. **Pre-match** — see next deck card (draw from array), Play or Skip
3. **Match** — click through N chances with fake outcomes → result screen
4. **Vidiprinter** — fake scores scroll past → "Continue" → back to hub
5. **Inbox** populated with incident + news → must clear before next match
6. Repeat

#### Vidiprinter example content

```
INCOMING RESULTS
----------------

 LEAGUE.
---------

HOME
  EXETER      1 - 2    NORTHAMPTON
  RESULT - LOSE : YOU SCORED 1

AWAY
  SHREWSBURY  0 - 1         EXETER
  RESULT - WIN : YOU SCORED 1
```

### Cycle 2: Goal Card Engine

**Goal:** Real deck, shop, play/skip logic. Match placeholder updated to show per-chance outcome buttons (goal/miss/saved).

### Cycle 3: Vidiprinter Scores + Incident Cards

**Goal:** Real vidiprinter with live league scores. Real incident card spinning wheel with outcomes.

### Cycle 4: Volley Mini-Game

**Goal:** First real P5.js mini-game — hold-and-release volley mechanic.

### Cycle 5: Penalty Mini-Game

**Goal:** Second real P5.js mini-game — swipe-based penalty mechanic.

### Cycle 6: League Table + Stats & Progression

**Goal:** Standings table, XP tracking, stat growth, club stat caps.

Team names to use;

Premier League

- Arsenul
- Viller
- Bornmuth
- Brentfurd
- Bryton
- Chelsee
- Coventry
- Pallace
- Evarton
- Fullum
- Hull
- Ipswitch
- Leeds
- Liverpoool
- Man Citeh
- Man Untied
- Newcassel
- Forrist
- Sunderlund
- Spurs

Championship

- Birmingum
- Blackbirn
- Boltun
- Bristol City
- Burnlee
- Cardif
- Charltun
- Darbee
- Linkun
- Boro
- Millwol
- Norrich
- Pompee
- Prestun
- Cue Pee Arr
- Sheff Yoonited
- Saynts
- Stoak
- Swanzee
- Wattfud
- West Brom
- West Ham
- Woolvz
- Rexham

League One

- Wimbledon
- Barnslee
- Blackpool
- Bradfud
- Bromlee
- Burtun
- Caimbridge
- Doncaster
- Huddersfeeld
- Lestur
- Orient
- Looton
- Mansfeeld
- Em Kay Dons
- Notts County
- Oxfud
- Peterbura
- Plimuth
- Redding
- Sheff Wensday
- Stevenij
- Stockport
- Wiggun
- Wickham

League Two

- Ackrington
- Barnett
- Bristol Rovers
- Cheltnum
- Chesterfeeld
- Colchestur
- Crawlee
- Croo
- Exetur
- Fleetwud
- Gillingham
- Grimzbee
- Newport
- Northamptun
- Oldum
- Port Vayle
- Rochdayle
- Rotherum
- Salfud
- Shroosbury
- Swindun
- Tranmere
- Walsawl
- York

### Cycle 7: Transfers & Clubs

**Goal:** Manager interest system, contract negotiation, move clubs.

### Cycle 8: Season Loop + Save System

**Goal:** Full season progression, retirement, save/load across 3 slots.

### Cycle 9+: Stretch Goals

- Domestic cups (FA Cup, League Cup)
- Training mini-games
- Defensive goal cards
- European competitions
- Sponsorship income / performance bonuses

## 17. Future Enhancements (Recorded)

- Defensive goal cards (defending mini-games)
- Agent system
- Training mini-games (track & field style)
- Two domestic cups (FA Cup, League Cup)
- European competitions
- Sponsorship income
- Performance bonuses in contracts
