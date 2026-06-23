# FotY — Glossary

## Project

**FotY** — canonical short name for the app. Used in `short_name` for the web app manifest. "Footballer of the Year Remake" is the full title; "FotY Reboot" is the display name.

**FotY Reboot** — display name for the web app manifest (`name` field).

**PWA icon** — SVG football (classic pentagonal pattern), used as the sole icon source in the web app manifest. Serves all sizes via SVG scaling.

**Footballer of the Year Remake (FotY)** — full project title. A single-player career management sim with arcade mini-game resolution, built in Svelte 5 + P5.js. Takes creative inspiration from the 1986 original — mechanics may be replaced, extended, or omitted.

## Terms

**Hub** — Landing page (`/hub`) with menu buttons linking to sub-pages. No persistent nav bar; each sub-page renders its own back link.

**Route tree** — The full set of SvelteKit route directories defined in the design spec, acting as the navigation skeleton.

**Store module** — A `.svelte.ts` file exporting `$state` runes for a single domain slice (player, season, inbox, match). No `writable()` stores; idiomatic Svelte 5 runes throughout.

**Domain slice** — One of the store modules: `player`, `season`, `inbox`, `match`, `standings`. Components import only the slices they need.

**State of Affairs** — Hub sub-page (`/hub/affairs`) showing team-level data: league position, team morale, XP level, fixture results. Now also displays the full league table for the player's division (condensed on mobile). Informationally equivalent to the original's Globe screen.

**Player Status** — Hub sub-page (`/hub/player`) showing the player's avatar, XP level with progress bar, goals, appearances, club, division, weekly earnings, and recent match XP history. Stat bars removed in Cycle 6.

**Team morale** — A team-level stat (1–10 scale, starts at 5, clamped) stored in the `season` store. Shifts the λ (mean) of the Poisson distribution used for both team base goals and opponent goals. Team λ ranges from 0.9 (morale=1) to 1.8 (morale=10). Opponent λ ranges from 1.2 (morale=1) to 0.3 (morale=10). Higher morale → team scores more, concedes less. Morale deltas: +1 for win, 0 for draw, −1 for loss. Scoring 2+ personal minigame goals always gives +2 regardless of result. Skipped matches still apply the result-based delta.

**Match result scoring** — Two-part model. (1) The **team base** generates goals via a Poisson distribution whose λ is determined by team morale (applies in both Play and Skip paths). (2) On the Play path, the player's minigame goals are **added** to the team base to form the final score. Opponent goals are also Poisson-distributed from their own λ (derived from the inverse of team morale). This means blowout scores are possible when the player performs well in minigames on top of a strong team baseline. No randomness in the Play path's minigame outcomes — those are pure skill.

**AI match simulation** — For matches involving two non-player clubs, both sides use their club strength (1-10, fixed per season with ±1 random variance) in the Poisson model. Strength replaces morale in the λ formula for AI teams. Result stored in the week's schedule for league table processing.

**Club strength** — A fixed rating (1-10) assigned to each of the 92 parody clubs. Man Untied is the strongest (9). Dictates AI match outcomes in the Poisson model. Re-rolled with slight ±1 variance each season to prevent deterministic outcomes.

**Type file** — `src/lib/types/game.ts` defines all TypeScript interfaces used by stores and components. Single source of truth, avoids circular imports.

**Incident cards (hybrid)** — Two sources: (1) automatic ~20-30% of weeks, rolled at vidiprinter completion, and (2) purchasable incident cards in the shop for a pay-to-gamble option anytime. Both paths deliver the card to the inbox as an unactioned message.

**Incident resolution** — An unactioned incident message in the inbox navigates to a dedicated route (`/hub/incident`) with a 4-option text ticker. Theme (positive/negative) is baked into each card. 3 themed outcomes at escalating strength + 1 neutral. The ticker cycles through the options rapidly; the player presses a button to decelerate it to a stop, revealing the result.

**Incident effect descriptor** — A declarative data structure specifying store mutations: `{ type: 'bankBalance' | 'morale' | 'xp', delta: number }`. The incident route processes these through a switch. Card definitions live as plain data arrays so they can be future-loaded from config without importing store modules.

**Inbox clearing** — Each message must be individually tapped to mark `actioned`. "Next Match" enables only when all inbox items are actioned. Incident cards auto-navigate to the incident spinner when opened from the inbox.

**Save-at-hub** — Game state is persisted to `localStorage` when the player lands on the hub after completing a matchweek (post-incident if applicable). One auto-save slot. Reloading before hub landed restarts the week.

**Phase progression** — Each route auto-sets its phase via `$effect` on mount. Phase is an effect of navigation, not a driver of it. Self-healing on direct URL entry.

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

**Weekly wage** — £200 paid to the player's bank balance each week on hub arrival. Makes shop purchases sustainable over a full season. Applied once per week via the hub's `$effect`.

**Empty deck sim** — When `player.deck` is empty, all matches for the current week are forced to sim (Skip path only). The pre-match page shows an informational message and a single Continue button instead of the per-game Play/Skip loop.

**Repeated shop buys** — Shop purchase buttons remain visible and usable after each purchase (no `bought` guard). The player can tap repeatedly to buy multiple items in one visit. A brief "Card added!" flash confirms each purchase.

**Career XP** — Single progression metric replacing the removed stat system. Tracked per event via `XP_CONFIG`: played (+1), goal (+1), saved (0), miss (-1), skipped (0), win (1), draw (0), loss (0), promotion (+10, conditional on actual promotion). Designed so ~100-125 XP is earnable per season of perfect play (every game played, all chances scored, all wins). Realistic play (~50% match rate, ~0.5 goals/match) yields ~30-35 XP/season. Capped per division. Unaffected by above-cap matches (can still lose XP at cap for misses).

**XP level** — 12 named tiers (Park Kicker → Footballer of the Year), 3 per division. Derived from careerXp. Caps: Div 4 = 100, Div 3 = 200, Div 2 = 350, Div 1 = 500. Interest thresholds for transfers align with division XP minimums. Displayed on Player Status page with progress bar.

**League standings** — Stored in the `standings` store. Updated each week after AI matches are simulated. Sort order: points → goal difference → goals for → head-to-head. Top 3 promoted, bottom 3 relegated at season end. No promotion from Div 1, no relegation from Div 4.

**Season transition** — After week 30, standings settle, promotion/relegation applied, new season generated, player receives +50 promotion XP (if their club promoted), morale reset to 5, standings re-initialised for new division.

**Division schedule** — A shared double round-robin schedule for all clubs in the player's division, generated at season start via `generateDivisionSchedule`. Each week has 1 or 2 games per club. Div 1 = 38 games (8 double weeks), others = 46 (16 double weeks).

**Transfers (hybrid)** — Two paths to move clubs: (1) XP-threshold manager interest triggers naturally when careerXp meets the target division's interest minimum, and (2) purchasable transfer cards in the shop give a chance of early scouting evaluation. Both lead to negotiation + contract screen (Cycle 7).

**Match XP computation** — XP earned per match = played(5) + sum per-outcome + result bonus. Tracked in matchXpHistory (last 5 matches) for form display. Capped at division XP cap — no XP earned if player is at cap (but can still lose XP from misses).
