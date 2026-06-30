# FotY — Glossary

## Week resolution

**Week-resolution pipeline** — A single `resolveWeek()` module at `src/lib/week-resolve/resolveWeek.ts` extracted from the vidiprinter route. Owns all week-level computation: AI cup simulation, league match resolution, standings processing, line/score entry generation, and the decision tree for what happens after the user presses Continue (transfer scout, incident roll, season-end routing). Returns a `WeekResolution` with `status` (`display` | `auto-continue`), `lines`, `scoreLines`, and an `onContinue()` closure that mutates stores (advanceWeek, recordGamesPlayed, clearActioned, roll scouting/incident) and returns a destination string. The route renders and navigates based on it; `saveGame()` is called by the route. On cup-only weeks where the player is eliminated, the pipeline sets `status: 'auto-continue'` and the route skips display entirely. Store imports are direct (not parameterised). The `pre-match` detour on league-end weeks has been removed — the player returns to hub, can buy cards, and plays FA Cup ties from the normal pre-match flow.

## Project

**FotY** — canonical short name for the app. Used in `short_name` for the web app manifest. "Footballer of the Year Remake" is the full title; "FotY Reboot" is the display name.

**FotY Reboot** — display name for the web app manifest (`name` field).

**PWA icon** — SVG football (classic pentagonal pattern), used as the sole icon source in the web app manifest. Serves all sizes via SVG scaling.

**Footballer of the Year Remake (FotY)** — full project title. A single-player career management sim with arcade mini-game resolution, built in Svelte 5 + P5.js. Takes creative inspiration from the 1986 original — mechanics may be replaced, extended, or omitted.

## Minigames

**Kick sensitivity model** — Distance-dependent magnitude: horizontal/vertical kick velocity is proportional to the screen distance from the ball centre to the tap point, mapped linearly from zero at tap-on-ball to a per-minigame max at the `KICK_RADIUS` boundary. Keeps the unit vector for direction, `p.map(d, 0, KICK_RADIUS, 0, MAX_VX|MAX_VY)` for power.

**KICK_RADIUS** — Dual-purpose constant: (1) hit-test threshold — taps outside this distance from the ball are ignored; (2) sensitivity curve range — the distance at which max kick velocity is reached. A larger radius gives finer control (lower sensitivity).

**Per-minigame max velocities** — Each sketch defines its own max-vx and max-vy constants (First-Time Finish: `KICK_VX_MAX=16` / `KICK_VY_MAX=18`; Penalty: `MAX_VX=16` / `MAX_VY=18`) so each game can feel distinct while sharing the same distance-dependent formula.

**computeKickAim** — Shared helper in `footy.js` that takes the ball's screen position, mouse position, `KICK_RADIUS`, and per-minigame `maxVx`/`maxVy`. Returns `{ vx, vy }` using the direction-unit-vector + distance-mapped magnitude formula. Covers only aim (horizontal + launch angle); `vz` is handled per-minigame.

**Rebound** — Training-ground minigame. A CPU-driven shot from z=-3 (random x, random y) is aimed ¼-width in from a post so the keeper must save it. The ball rebounds fast from the keeper (initial `vz` ≈ -15 to -22, full speed) until it reaches z=8 on the way back, then switches to slow motion (×0.15 speed) with a ball trail back toward z=-3. The keeper stays down for 1000 ms then recovers to center over 600 ms. The player taps the rebounding ball (FTF-style tap within `KICK_RADIUS`) to shoot. The keeper may dive again on the player's shot. Uses the same max velocities as Penalty/FTF: `KICK_VX_MAX=16`, `KICK_VY_MAX=18`, `KICK_VZ=25`.

## Terms

**Hub** — Landing page (`/hub`) with menu buttons linking to sub-pages. No persistent nav bar; each sub-page renders its own back link.

**Route tree** — The full set of SvelteKit route directories defined in the design spec, acting as the navigation skeleton.

**Store module** — A `.svelte.ts` file exporting `$state` runes for a single domain slice (player, season, inbox, match). No `writable()` stores; idiomatic Svelte 5 runes throughout.

**Domain slice** — One of the store modules: `player`, `season`, `inbox`, `match`, `standings`. Components import only the slices they need.

**State of Affairs** — Hub sub-page (`/hub/affairs`) showing team-level data: league position, team morale, fixture results, and the full league table for the player's division. Informationally equivalent to the original's Globe screen.

**Team Status** — The header section on the affairs page showing the club avatar, name, division, and current week. Sits directly on a `bg-card` background with no wrapper component.

**Player Status** — Hub sub-page (`/hub/player`) showing the player's avatar, XP level with progress bar, goals, appearances, club, division, weekly earnings, and recent match XP history. Stat bars removed in Cycle 6.

**Team morale** — A team-level stat (1–10 scale, starts at 5, clamped) stored in the `season` store. Shifts the λ of the Poisson distribution for the player's side in `simulateMatch`: `λ = strength×0.15 + 0.5 + morale×0.01` (home) or `λ = strength×0.15 + morale×0.01` (away). Morale only affects the player's team — the opponent's λ uses strength only. Higher morale → team scores more. Morale deltas: +1 for win, 0 for draw, −1 for loss, based purely on match result. Skipped matches still apply the result-based delta.

**Match result scoring** — Unified model. All matches (AI and player) use `simulateMatch()` as the base, which applies `remapPair` to normalise strengths to a 10-point scale, then Poisson-distributes goals from `λ = strength×0.15 + 0.5` (home) or `λ = strength×0.15` (away). On the Play path, the player's minigame goals are **added** to the sim base to form the final score. The player's morale adds a small λ bonus (`+morale×0.01`) to their side only. This means blowout scores are possible when the player performs well in minigames on top of a strong team baseline. No randomness in the Play path's minigame outcomes — those are pure skill.

**AI match simulation** — For matches involving two non-player clubs, both sides use their club strength (1-10, fixed per season with ±1 random variance) in the Poisson model via `simulateMatch()`. Strengths are normalised with `remapPair` before the Poisson draw — the same single function used for player matches (without the player goal addition). Result stored in the week's schedule for league table processing.

**Club strength** — A fixed rating (1-10) assigned to each of the 92 parody clubs. Man Untied is the strongest (9). Dictates AI match outcomes in the Poisson model. Re-rolled with slight ±1 variance each season to prevent deterministic outcomes.

**Strength normalisation** — Before any match, the two clubs' strengths are remapped so the stronger team becomes 10 and the weaker is scaled proportionally (e.g. Gillingham 1 vs Newport 2 → [5, 10] rather than [1, 2]). This ensures all matches produce ~2.2–3.5 average total goals regardless of division while preserving relative gaps. Applied via `remapPair()` inside `simulateMatch()` in `engine.ts`, which is the single formula for all matches (AI, player, league, cup). In cup matches only, a division multiplier is applied to each club's base strength before normalisation (Div 1: ×2.0, Div 2: ×1.2, Div 3: ×1.0, Div 4: ×0.8) to widen the gap between tiers. This multiplier is applied in `playGame()`/`skipGame()` for player cup matches and in `cups.ts::getCupStrength()` for AI cup matches — both use the same `simulateMatch()` underneath.

**Type file** — `src/lib/types/game.ts` defines all TypeScript interfaces used by stores and components. Single source of truth, avoids circular imports.

**Incident cards (hybrid)** — Two sources: (1) automatic ~20-30% of weeks, rolled at vidiprinter completion, and (2) purchasable incident cards in the shop for a pay-to-gamble option anytime. Both paths deliver the card to the inbox as an unactioned message. Cards are mixed-theme: a single story can produce positive, negative, or neutral outcomes across different levers. No fixed card-level theme.

**Incident resolution** — An unactioned incident message in the inbox navigates to a dedicated route (`/hub/incident`) with a 4-option text ticker. Cards are mixed-theme (no card-level theme). The ticker cycles through the options rapidly; the player presses a button to decelerate it to a stop, revealing the result. After resolution, the player is returned to the inbox, not the hub, so they can continue actioning remaining messages.

**Incident categories** — Thematic groupings with weighted draw probabilities: Career & Football (25%), Training & Fitness (15%), Purchases & Sales (10%), Investments & Side Businesses (10%), Family & Relationships (10%), Media & Public Image (10%), Gambling & Risk (8%), Dressing Room & Team (5%), Travel & Weather (3%), Absurd (Animals/Tech/Superstition) (4%). Cards within a category are equally likely.

**Incident effect descriptor** — A declarative data structure specifying store mutations: `{ type, delta }`. The incident route processes these through a switch. Supported effect types: `bankBalance`, `morale`, `xp`, `deckAdd`, `deckRemove`, `appearanceSkip`, `wageMultiplier`. Card definitions live as plain data arrays so they can be future-loaded from config without importing store modules. Boundary rules: bankBalance floors at £0 (effects cap at current balance); deck can hit 0 (triggers empty-deck sim); appearanceSkip stacks across cards.

**Inbox clearing** — Each message must be individually tapped to mark `actioned`. "Next Match" enables only when all inbox items are actioned. Incident cards auto-navigate to the incident spinner when opened from the inbox.

**Save-at-hub** — Game state is persisted to `localStorage` when the player lands on the hub after completing a matchweek (post-incident if applicable). One auto-save slot. Reloading before hub landed restarts the week.

**Phase progression** — Each route auto-sets its phase via `$effect` on mount. Phase is an effect of navigation, not a driver of it. Self-healing on direct URL entry.

**Training Ground** — A practice mode route (`/training-ground`) where the player can play minigames in an infinite loop with no impact on career state (no XP, no deck consumption, no goals, no morale changes, no appearances). Accessible from the hub via a button. The player selects which minigame to practice, and loops it until they choose to return to the hub.

**Hub menu** — Simple vertical list of buttons on the hub page. Not an icon grid.

**Minigame** — A unified Svelte wrapper (`Minigame.svelte`) that accepts a `createSketch` factory prop and renders it via `<P5Canvas>`. Eliminates per-minigame boilerplate. Sketch factories live in their own `*Sketch.ts` files and conform to the `MinigameSketchFactory` type.

**Design system** — Tailwind v4 `@theme` directive in `layout.css` to register custom colors as utility classes.

**Save system** — Full game state persisted to `localStorage` when the player lands on the hub after completing a matchweek (post-incident if applicable). On fresh load, if saved state exists, offer to resume or start new career. 1 auto-save slot; no manual save/load UI until Cycle 8. Includes careerXp, matchXpHistory, and standings.

**New career (title flow)** — Name entry on `/`, then team selection (pick from 24 Division 4 clubs), then navigate to `/hub`. If a saved game exists, offer resume option before name entry.

**Team selection** — A full-list picker of 24 Division 4 clubs presented as a scrollable list after name entry. Player taps one to confirm.

**Title screen** — Centered card on dark background with title text "FOOTBALLER OF THE YEAR", subtitle "— REMake —", name input, and "Start Career" button. After name entry, player picks a starting club from Division 4 before reaching the hub.

**Starting age** — Player starts at age 17. Affects profile display and future career-length mechanics.

**Starting cash** — £5,000 seed money in the player's bank balance at career start.

**Starting deck** — 10 goal cards in the player's deck at career start.

**Economy config** — `src/lib/config/economy.ts` defines division-based card prices and XP-level-based wages. Goal card prices rise steeply with division; incident cards cost ~¼ of goal cards. Wages are tied to XP level, not division, so one-club careers see wage growth as XP improves even before promotion.

| Div | Goal card | Incident card | Wage range (3 levels per div) | Weeks per goal card |
| --- | --------- | ------------- | ----------------------------- | ------------------- |
| 4   | £400      | £100          | £75 → £100 → £150             | 5.3 → 4.0 → 2.7     |
| 3   | £800      | £200          | £200 → £275 → £375            | 4.0 → 2.9 → 2.1     |
| 2   | £1,500    | £375          | £450 → £600 → £800            | 3.3 → 2.5 → 1.9     |
| 1   | £2,000    | £500          | £900 → £1,050 → £1,200        | 2.2 → 1.9 → 1.7     |

**Wage progression** — `player.addXp()` recalculates `player.wage` from `wageForLevel(getLevelIndex(careerXp))`. Wage is no longer persisted independently; it is derived from careerXp on save load. Promotion and XP gains automatically increase wage.

**Transfer signing fee** — One-time lump sum paid on transfer: 5× weekly wage for same-division moves, 10× for one-division-up moves. Multi-division jumps are not possible (XP caps prevent exceeding the target division's minimum). Ready in `TRANSFER_SIGNING_MULTIPLIERS` for Cycle 7.

**Empty deck sim** — When `player.deck` is empty, all matches for the current week are forced to sim (Skip path only). The pre-match page shows an informational message and a single Continue button instead of the per-game Play/Skip loop.

**Repeated shop buys** — Shop purchase buttons remain visible and usable after each purchase (no `bought` guard). The player can tap repeatedly to buy multiple items in one visit. A brief "Card added!" flash confirms each purchase.

**Zero baseline result bonus** — Match XP result component computed as `points(actual score) − points(score minus player goals)`. Reflects the league-table points the player personally added via their goals. Misses do not affect the counterfactual score (they are penalised separately via per-outcome XP). Always ≥ 0. Replaces the flat win/draw/loss XP constant.

**Career XP** — Single progression metric replacing the removed stat system. Tracked per event via `XP_CONFIG`: played (+1), goal (+1), saved (0), miss (-1), skipped (0), win (1), draw (0), loss (0), promotion (+10, conditional on actual promotion). Designed so ~100-125 XP is earnable per season of perfect play (every game played, all chances scored, all wins). Realistic play (~50% match rate, ~0.5 goals/match) yields ~30-35 XP/season. Capped per division. XP is frozen at the cap — no XP is earned or lost from any match once the player is at cap.

**XP level** — 12 named tiers (Park Kicker → Footballer of the Year), 3 per division. Derived from careerXp. Caps: Div 4 = 100, Div 3 = 200, Div 2 = 350, Div 1 = 500. Interest thresholds for transfers align with division XP minimums. Displayed on Player Status page with progress bar. On relegation to a lower-division cap, XP is never reduced; earning is simply blocked until the player reaches a division whose cap exceeds their total.

**Level-up message** — When `addXp` pushes `careerXp` into a new level tier, a news-type inbox message is auto-created with the level title and a punchy description of the wage boost. `LEVEL_UP_MESSAGES` in `levels.ts` defines one line per tier (levels 1–11; level 0 is starting). The message is non-actionable (no required read) so it doesn't block the Next Match button.

**League standings** — Stored in the `standings` store. Only the player's division standings are tracked each week (real). Other divisions' standings are never materialised; promotion/relegation decisions for non-player divisions use static club strength as a proxy.

**Promotion/relegation (full pyramid)** — At season end, each division boundary is processed top-down (Div 1↔2, then 2↔3, then 3↔4). For each boundary U/L: top 3 of L (by real standings if L = player's division, else by strongest club strength) swap with bottom 3 of U (by real standings if U = player's division, else by weakest club strength). Strength ties among non-player-division clubs are broken randomly. Division rosters are updated in-place to reflect the swaps, so a club relegated from Div 2 into Div 3 is available when processing the 3↔4 boundary. No promotion from Div 1, no relegation from Div 4.

**Season transition** — After week 30, vidiprinter's Continue navigates to the season review route rather than the hub. The season review page processes promotion/relegation, division roster updates, new-season generation, and XP awards. A new-season inbox message is created for the player to see on hub arrival. No incident card on week 30.

**Season deck cards** — 10 random goal cards are added to the player's deck at every season start (in season review, before navigating to hub). Cards are appended to any existing stockpile — not a reset.

**Promotion signing bonus** — On promotion, the player receives a one-time cash bonus of 10× their current wage (XP-level-based), credited in season review alongside the +10 XP award.

**Division schedule** — A shared double round-robin schedule for all clubs in the player's division, generated at season start via `generateDivisionSchedule`. Each week has 1 or 2 games per club. Div 1 = 38 games (8 double weeks), others = 46 (16 double weeks).

**Transfer windows** — Two 4-week periods per 30-week season: weeks 1–4 (early season) and weeks 16–19 (mid-season). Transfer activity (both voluntary and involuntary) only occurs during these windows.

**XP caps (revised)** — Div 4: 110, Div 3: 220, Div 2: 380, Div 1: 500. ~10% overlap between consecutive divisions so players can reach the lower XP bands of the division above while still capped in their current division.

**Season 1 first-window exclusion** — The first transfer window (weeks 1–4) of Season 1 is blocked. The player has just joined their club and lacks XP. The winter window (weeks 16–19) of Season 1 is active as normal.

**Transfer card** — Purchasable shop item. In-window: played immediately on purchase with confirmation; scout evaluation fires right then (displays scout report page, then returns to hub). Out-of-window: locked; queues a scout for the first week of the next transfer window (replaces the passive 25% roll for that week; next season if no remaining window this season). After a successful transfer, transfer cards are blocked for the remainder of the window with message "Recently moved clubs — transfer cards unavailable." Same block applies in Season 1.

**Once-per-window outcome** — The outcome limit (max 1 transfer per window) gates the result, not the attempt. Multiple failed evaluations can occur in one window.

**Scout evaluation** — When a scout evaluates (passive roll, in-window card, or queued card): pick a random band from the scout's division's target range. If player's careerXp >= that band's minXp, transfer succeeds. Otherwise, the scout report shows what was sought vs what the player has.

**Same-division scout target** — Top 2 bands of the player's division (e.g., Div 4 = Sunday Leaguer or Trialist). NEVER the bottom band (Park Kicker).

**Division-above scout target** — Bottom 2 bands (+1 and +2) of the division above (e.g., Div 3 = Prospect or Reserve). The +2 band is typically unreachable from below — only the +1 band (Prospect) is achievable from Div 4 at the revised cap of 110 XP.

**Scout division selection** — 50/50 random between same division and division above for players in Div 2-4. Div 1 players always get same-division scouts (no division above).

**Transfer card prices** — Div 4: £2,500, Div 3: £4,000, Div 2: £7,500, Div 1: £10,000.

**Signing fee** — One-time payment on transfer: 5× current wage for same-division moves, 10× for moves up one division.

**Fresh-start deck bonus** — On successful transfer, 10 goal cards added to the player's deck.

**Transfer state** — Two new fields in the player store (persisted in saves): `queuedTransferCard: boolean` (locked card awaiting next window) and `lastTransferWindow: { season: number, window: 1 | 2 } | null` (blocks further transfers for the remainder of that window).

**Scout report page** — Route shown between weeks after vidiprinter (during transfer windows, or when a queued card fires on week 1 of the next window). Shows evaluation outcome. On success: routes to a "transferred" confirmation, archives current stats, pays signing fee, adds welcome message to inbox. On failure: shows what the scout sought vs the player's current level.

**Passive scouting** — During transfer windows, each week has a 25% chance of a scout evaluating the player. Same evaluation logic as the transfer card path, no cost to the player, but no control over timing either. The first window (weeks 1–4) of Season 1 is excluded; the winter window (weeks 16–19) of Season 1 is active.

**Transfers (hybrid)** — Two paths to move clubs: (1) XP-threshold manager interest triggers naturally when careerXp meets the target division's interest minimum, and (2) purchasable transfer cards in the shop give a chance of early scouting evaluation. Both lead to negotiation + contract screen (Cycle 7).

**Stats snapshot** — Baseline values (goals, appearances, XP, chances, saves, misses) recorded at career start via `recordStatsSnapshot()`. On season end (or future club change), `getStatsSinceSnapshot()` computes the delta and `archiveCurrentStats()` pushes the entry to the archive and resets the snapshot for the next period.

**Stats archive** — `StatsArchiveEntry[]` on the player store. Each entry records `{ seasonNumber, club, division, chances, saves, misses, goals, appearances, xpEarned, finalPosition }`. Supports multiple entries per season (one per club after a mid-season transfer). Displayed on the Player Status page as a per-season list with career totals. Archive + current-season snapshot delta form the `careerTotal` derived values.

**Outcome tracking** — Each played match records per-outcome counts via `player.recordMatchOutcomes(outcomes)`. `'goal'` increments only the global `chances` counter (goals tracked separately via `addGoals`); `'saved'` increments `saves` and `chances`; `'miss'` increments `misses` and `chances`. These feed the snapshot system and archive to show conversion percentages on the Player Status page.

**Match XP computation** — XP earned per match = played(1) + sum per-outcome + zero-baseline result bonus. Tracked in matchXpHistory (last 5 matches) for form display. Capped at division XP cap — XP is frozen at cap (no XP earned or lost).

**Appearance rule** — Only matches where the player chooses Play count as appearances. Both voluntary skips and forced skips (from appearanceSkip incidents) record zero appearances.

**Voluntary skip (card economy)** — Player draws a deck card, sees the chance count, and chooses Skip. Card is pushed to bottom of deck (recycled). No appearance recorded, zero XP earned. Team sims result as normal.

**Forced skip (injury/suspension)** — When `appearanceSkips > 0`, pre-match shows "You are unavailable — forced to miss this match (N remaining)" and auto-resolves. No deck card consumed (stays on top). No appearance recorded, zero XP earned. Resolution bypasses `/match` and goes directly to next game or vidiprinter.

**Goal card rewards** — Incident cards in career and training categories can reward goal cards via `deckAdd` effect. Tiered: best outcome 2-3 cards, good outcome 1 card, bad/neutral unchanged. Thematically placed where the narrative supports earning extra chances.

## Cups

**Cup competition** — One of two knockout tournaments: League Cup (rounds 1-5 two-leg, rounds 6-7 one-leg) and FA Cup (all one-leg). Both use a 128-team bracket: 92 league clubs + 36 randomly selected non-league clubs at season start.

**Non-league club** — Fictional club with `(N/L)` suffix, strength 1, drawn from a seasonal pool. Never playable, not part of the promotion/relegation pyramid. Re-selected each season.

**League Cup week** — Dedicated weeks (no league games) where both legs of rounds 1-5 are played (Tue 1st leg, Sat 2nd leg): weeks 1, 5, 9, 13, 17. Semi Final is week 21 (alongside league). Final is week 25 (alongside league).

**FA Cup week** — A week where an FA Cup round (1 leg) is added alongside regular league games. Occurs weeks 3, 7, 11, 15, 19, 23. Final is week 31 (after league season ends).

**Cup division multiplier** — Each club's base strength is multiplied by a division factor before cup match simulation: Div 1 ×2.0, Div 2 ×1.2, Div 3 ×1.0, Div 4 ×0.8. Non-league clubs are treated as Div 4 with a further reduction (effective ×0.5). Applied in both player cup matches (`playGame`/`skipGame` with `isCup=true`) and AI cup matches (`cups.ts::getCupStrength`). Both paths feed into the same `simulateMatch()` function. This ensures top-division clubs dominate cross-division ties more realistically, preventing excessive early elimination from random draws.

**Cup tie resolution** — Drawn cup matches decided by coin toss (no extra time). A future penalties minigame will replace the coin toss.

**Cup draw** — Random pairing per round, including home/away assignment. Seeded at season start for round 1; subsequent rounds drawn during vidiprinter when the previous round's results are resolved. Pairings are available on the hub immediately after the previous round completes.

**Cup fixtures page** — Hub sub-page (`/hub/cup-fixtures`) showing bracket pairings and results for one or both cups. Accepts an optional `?cup=league-cup|fa-cup` query param to filter to a single competition. Completed rounds are shown as collapsible accordions (collapsed by default, "Done" tag). The current round is expanded ("Current" tag). Future undrawn rounds are collapsed ("Upcoming" tag). Drawn but unplayed ties display as "Team A v Team B" rather than being hidden.

**Cup fixtures on fixture list** — The `/hub/fixtures` page interleaves cup fixtures chronologically with league fixtures when the player is still participating and the tie has been drawn. League Cup two-leg ties produce two entries (H and A) for the same week. Displayed in warning colour with the cup round label, e.g. "Liverpoool (LC Round 1)". Cup results are not shown on the main fixture list — they are visible on the cup-fixtures page. Once a cup tie is resolved (played), it is removed from the fixture list.

**Cup rewards** — Per-match XP identical to league (played +1, goal +1, miss -1, result bonus). Flat XP bonus per round survived (+1 to +5). Prize money per round (£500 to £20,000 for League Cup, £1,000 to £50,000 for FA Cup). Morale changes same as league.

**Cup elimination taunt** — When the player's club is eliminated from a cup, subsequent pre-match views in cup weeks show a reminder that they're out.

**Cup draw on vidiprinter** — After every cup week's results, the vidiprinter shows the next round's draw. Structure: cup name title (e.g. `LEAGUE CUP DRAW`), dash separator, optionally "You're in the draw for {Round Name}" if the player is still alive, then all pairings listed as `Team A v Team B` (player's tie in `text-primary`, others in `text-subtle`), "That concludes today's {Cup Name} draw.", and "All matches to be played in week {X}." No draw shown for finals.

**Cup elimination on vidiprinter** — On the week the player is eliminated from a cup, a `YOU'RE OUT OF THE {CUP NAME}!` line in `text-error` appears immediately after the cup result and before the draw section. Not shown on subsequent cup weeks.

**Cup final on vidiprinter** — The final result is shown on the vidiprinter even if the player is not involved. Always show the score line. If the player played: show "RESULT - WIN/LOSE : YOU SCORED X" commentary, then "YOU WON THE {CUP NAME}!" in `text-success` (win) or "YOU'RE OUT OF THE {CUP NAME}!" in `text-error` (loss). If the player didn't play: just the score line and "`{Club}` WON THE {CUP NAME}!" in standard text — no result commentary. No draw section after a final.
