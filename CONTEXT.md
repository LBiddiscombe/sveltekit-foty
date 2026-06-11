# FotY — Glossary

## Project

**FotY** — Footballer of the Year Remake. A single-player career management sim with arcade mini-game resolution, built in Svelte 5 + P5.js.

## Terms

**Hub** — Landing page (`/hub`) with menu buttons linking to sub-pages. No persistent nav bar; each sub-page renders its own back link.

**Route tree** — The full set of SvelteKit route directories defined in the design spec, acting as the navigation skeleton.

**Store module** — A `.svelte.ts` file exporting `$state` runes for a single domain slice (player, season, inbox, match). No `writable()` stores; idiomatic Svelte 5 runes throughout.

**Domain slice** — One of the four store modules: `player`, `season`, `inbox`, `match`. Components import only the slices they need.

**Shared component** — Reusable UI components (`Card`, `Button`, `DeckCard`, `VidiprinterLine`) built in Cycle 1 to lock the design system. Cycle-specific components like `SpinningWheel` and `P5Canvas` are deferred to their respective cycles.

**Type file** — `src/lib/types/game.ts` defines all TypeScript interfaces used by stores and components. Single source of truth, avoids circular imports.

**Inbox clearing** — Each message must be individually tapped to mark `actioned`. "Next Match" enables only when all inbox items are actioned.

**Phase progression** — Each route auto-sets its phase via `$effect` on mount. Phase is an effect of navigation, not a driver of it. Self-healing on direct URL entry.

**Hub menu** — Simple vertical list of buttons on the hub page. Not an icon grid.

**Fixtures page (Cycle 1)** — Placeholder text "Fixtures would appear here". No real fixture generation until later cycles.

**Match mock (Cycle 1)** — Pre-determined outcome sequence that auto-advances through all chances, then shows result with "Continue → Vidiprinter". No per-chance choice interaction until Cycle 2.

**Vidiprinter mock (Cycle 1)** — Auto-scrolling list of ~10 fake fixture lines via CSS animation. "Continue" button appears after scroll completes.

**Design system** — Tailwind v4 `@theme` directive in `layout.css` to register custom colors as utility classes.

**New career** — Simple name input on `/` sets `player.name` and navigates to `/hub`. No career slots or save system in Cycle 1.

**Title screen** — Centered card on dark background with title text "FOOTBALLER OF THE YEAR", subtitle "— REMake —", name input, and "Start Career" button.

**Training focus (Cycle 1)** — Radio buttons update `player.trainingFocus` in the store. No XP effect until Cycle 6.
