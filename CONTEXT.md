# FotY — Glossary

## Project

**FotY** — Footballer of the Year Remake (inspired reboot). A single-player career management sim with arcade mini-game resolution, built in Svelte 5 + P5.js. Takes creative inspiration from the 1986 original — mechanics may be replaced, extended, or omitted.

## Terms

**Hub** — Landing page (`/hub`) with menu buttons linking to sub-pages. No persistent nav bar; each sub-page renders its own back link.

**Route tree** — The full set of SvelteKit route directories defined in the design spec, acting as the navigation skeleton.

**Store module** — A `.svelte.ts` file exporting `$state` runes for a single domain slice (player, season, inbox, match). No `writable()` stores; idiomatic Svelte 5 runes throughout.

**Domain slice** — One of the four store modules: `player`, `season`, `inbox`, `match`. Components import only the slices they need.

**State of Affairs** — Hub sub-page (`/hub/affairs`) showing team-level data: league position, team morale, goals scored in league (and cups in future cycles). Analogous to the original's Globe screen.

**Player Status** — Hub sub-page (`/hub/player`) showing the player's avatar, stat bars, goals, appearances, club, division, weekly earnings. Analogous to the original's Footballer Head screen. Renamed from "Profile" to disambiguate from State of Affairs.

**Team morale** — A team-level stat (1–10 scale, starts at 5, clamped) stored in the `season` store. Affects match simulation: each point above/below 5 shifts your team's simulated score by ±0.05 goals. Morale deltas are defined in a single `MORALE_CONFIG` object: +1 for win, 0 for draw, −1 for loss. Scoring 2+ goals in a match always gives +2 regardless of result. Skipped matches still apply the result-based delta.

**Type file** — `src/lib/types/game.ts` defines all TypeScript interfaces used by stores and components. Single source of truth, avoids circular imports.

**Incident cards (hybrid)** — Two sources: (1) automatic ~20-30% of weeks, appearing as a forced spinning-wheel encounter after the vidiprinter, and (2) purchasable incident cards in the shop for a pay-to-gamble option anytime.

**Inbox clearing** — Each message must be individually tapped to mark `actioned`. "Next Match" enables only when all inbox items are actioned.

**Phase progression** — Each route auto-sets its phase via `$effect` on mount. Phase is an effect of navigation, not a driver of it. Self-healing on direct URL entry.

**Hub menu** — Simple vertical list of buttons on the hub page. Not an icon grid.

**Fixtures page (Cycle 1)** — Placeholder text "Fixtures would appear here". No real fixture generation until later cycles.

**Minigame** — A unified Svelte wrapper (`Minigame.svelte`) that accepts a `createSketch` factory prop and renders it via `<P5Canvas>`. Eliminates per-minigame boilerplate. Sketch factories live in their own `*Sketch.ts` files and conform to the `MinigameSketchFactory` type.

**Match mock (Cycle 1)** — Pre-determined outcome sequence that auto-advances through all chances, then shows result with "Continue → Vidiprinter". No per-chance choice interaction until Cycle 2.

**Vidiprinter mock (Cycle 1)** — Auto-scrolling list of ~10 fake fixture lines via CSS animation. "Continue" button appears after scroll completes.

**Design system** — Tailwind v4 `@theme` directive in `layout.css` to register custom colors as utility classes.

**Save system** — Full game state persisted to `localStorage` when the vidiprinter screen completes (end of matchweek). On fresh load, if saved state exists, offer to resume or start new career. 1 auto-save slot; no manual save/load UI until Cycle 8.

**New career (title flow)** — Name entry on `/`, then team selection (pick from 24 Division 4 clubs), then navigate to `/hub`. If a saved game exists, offer resume option before name entry.

**Team selection** — A full-list picker of 24 Division 4 clubs presented as a scrollable list after name entry. Player taps one to confirm.

**Title screen** — Centered card on dark background with title text "FOOTBALLER OF THE YEAR", subtitle "— REMake —", name input, and "Start Career" button. After name entry, player picks a starting club from Division 4 before reaching the hub.

**Starting age** — Player starts at age 17. Affects profile display and future career-length mechanics.

**Starting cash** — £5,000 seed money in the player's bank balance at career start.

**Starting deck** — 10 goal cards in the player's deck at career start.

**Training focus (Cycle 1)** — Radio buttons update `player.trainingFocus` in the store. No XP effect until Cycle 6.

**Transfers (hybrid)** — Two paths to move clubs: (1) stat-threshold manager interest triggers naturally when stats are sufficient, and (2) purchasable transfer cards in the shop give a chance of early scouting evaluation regardless of current stats. Both lead to negotiation + contract screen (Cycle 7).
