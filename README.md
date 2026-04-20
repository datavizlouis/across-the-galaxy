# Star Wars · Across the Galaxy

An animated, interactive atlas of every journey taken across the Star Wars saga — Episodes I through IX, 14 characters, 27 canonical worlds.

**Live site:** [Deployed on Vercel](https://your-deployment-url.vercel.app) *(update after deploying)*

---

## What This Is

**The Inspiration**
A few months ago, I chanced upon the official Star Wars Galaxy Map (Thanks to my buddy Kevin Wee) that was created to complement the 2009 book Star Wars: The Essential Atlas. Being a huge fan of the franchise, this was very exciting to see how much depth and lore the story was built upon. I wanted to share my excitement, but over 6,000 planets is a bit much to explain to someone new isn't it? I think I say this for every dataviz nerd, but we get so much satisfaction from being able to simplify data for non-data folks.

**The Idea**
I landed on an idea to visualize the planetary travel for each character, but obviously that would be a crazy endeavor. So I wanted to test this out with AI. I started off asking ChatGPT to do deep research on the topic, feeding it context like the official Star Wars databank and Wookieepedia. The initial D3 visualizations it came out with was pretty lackluster, but it had the right idea of showing travel through animated lines. I didn't get too far with ChatGPT because it kept breaking the animations as I tried to add more design to it, so I migrated to Claude.

**A coding partner**
To be completely honest, I'm still a novice in D3 but I understand CSS and code structures. Having Claude as my dedicated coding sidekick as I prompted through requests from like adding particles, fog system, cinematic camera control to page snap scrolling... was liberating. However, I relied heavily on my design and UXUI knowledge, often questioning and correcting course when Claude tries to do something weird. It's definitely not 100% accurate nor my best work, but it's a close replication of what I had in mind. And the best part? I didn't have to scrap any data either. But it did take burning through maybe ~$50 worth of Claude tokens due to the verbose nature of the franchise 😅

---

## Data Sources

### Planets

The 27 worlds were selected by cross-referencing character journey data: only planets that appear in at least one character's canonical Episodes I–IX journey are included. Planet metadata was sourced from:

- **[Wookieepedia](https://starwars.fandom.com/wiki/Main_Page)** — geography, inhabitants, and population figures
- **[StarWars.com Databank](https://www.starwars.com/databank)** — canonical species and location descriptions
- **[Star Wars: The Essential Atlas](https://starwars.fandom.com/wiki/The_Essential_Atlas)** (2009) — the official galaxy map used as the positional reference for all planet coordinates

Planet `x`/`y` coordinates are expressed as percentages of the galaxy map's bounding box, derived from planet positions on the Essential Atlas. These are approximations, not precise astronomical data — the galaxy map itself is a stylised representation.

### Characters

14 characters were selected based on having meaningful multi-planet journeys across the saga:

| Character | Faction | Films |
|---|---|---|
| Anakin Skywalker | Republic / Sith | I, II, III, VI |
| Luke Skywalker | Rebel / Jedi | III, IV, V, VI, VIII, IX |
| Leia Organa | Rebel / Resistance | III, IV, V, VI, VII, VIII, IX |
| Han Solo | Rebel | IV, V, VI, VII |
| Chewbacca | Rebel / Resistance | III, IV, V, VI, VII, VIII, IX |
| Obi-Wan Kenobi | Jedi / Republic | I, II, III, IV |
| Yoda | Jedi | I, II, III, V, VI |
| R2-D2 | Rebel / Resistance | I, II, III, IV, V, VI, VII, VIII, IX |
| C-3PO | Rebel / Resistance | I, II, III, IV, V, VI, VII, IX |
| Palpatine / Darth Sidious | Sith / Empire | I, II, III, VI, IX |
| Rey | Resistance / Jedi | VII, VIII, IX |
| Kylo Ren | First Order | VII, VIII, IX |
| Qui-Gon Jinn | Jedi | I |
| Mace Windu | Jedi | I, II, III |

### Story Beats

Each character has between 5 and 15 story beats. A beat represents a meaningful narrative event at a given planet in a given episode. Beats were written to:

1. Identify *what happened* at that location (the dramatic event)
2. Give enough context for a viewer who may not remember the details
3. Preserve the emotional and narrative arc of the character across films

Beats are ordered chronologically within each character's journey, spanning across episodes.

### Population Data

Canonical sentient population figures were sourced from Wookieepedia. Where Wookieepedia provides a range, the midpoint or most commonly cited figure is used. Several planets have no official population (e.g. Hoth, Dagobah, Crait) and are excluded from the population chart.

### Inter-Planetary Distances

Distances are calculated from planet `(x, y)` coordinates using Euclidean distance, then scaled by a factor of 1,000 to produce light-year approximations. These are not canon distances — no official light-year distances between all 27 planets exist. The figures are proportionally consistent with the galaxy map positions and intended to give a relative sense of scale, not precise astronomical measurements.

---

## Assumptions and Notes

- **Episodes I–IX only.** The Mandalorian, Andor, Clone Wars, Rebels, and other expanded-universe content are excluded. Canon is defined as the nine theatrical films.
- **Character selection is curated.** Supporting characters who appear on multiple worlds (e.g. Padmé Amidala, Finn, Poe Dameron) were considered but excluded to keep the visualisation legible. The 14 selected characters cover the full geographic range of the saga.
- **Planet positions are approximate.** The Essential Atlas is a stylised galaxy map, not an astronomical dataset. Coordinates were estimated by hand from the published map.
- **Population figures are estimates.** Wookieepedia figures are themselves drawn from in-universe documents of varying canonicity. Treat them as order-of-magnitude indicators.
- **Distance is proportional, not precise.** The light-year values in the Distance Travelled chart are derived from map coordinates scaled for readability.
- **Hoth, Dagobah, Crait, D'Qar, Kef Bir, Starkiller Base, Yavin 4, Ajan Kloss** have no permanent sentient population and are excluded from the population bubble chart.

---

## Project Structure

```
├── index.html              # Main page — all four sections
├── css/
│   └── styles.css          # Full stylesheet (dark space theme, snap scroll)
├── js/
│   ├── helpers.js          # Shared D3 utilities (galaxy base, planet nodes, coordinate mapping)
│   ├── starfield.js        # Animated canvas starfield background
│   ├── follow.js           # Section 1 — Follow a Character
│   ├── journeys.js         # Section 2 — Journey by Episode
│   └── dashboard.js        # Section 3 — Galactic Intelligence dashboard
├── data/
│   ├── sw-data.js          # All planet and journey data (PLANETS, JOURNEYS constants)
│   └── images.js           # Character portrait image data
├── assets/
│   └── louis_lightsaber.webp
├── star-wars-data.xlsx     # Raw source dataset (planets, beats, populations)
├── vercel.json             # Vercel static deployment config
└── README.md
```

---

## Sections

### Hero

Full-viewport landing with an animated starfield canvas, and navigation links to each section. The starfield uses a seeded random distribution of stars across three depth layers (foreground, mid, background) that drift at different speeds to create a parallax effect. The page uses **CSS scroll-snap** at the `html` level with `scroll-snap-type: y mandatory`, locking each section to the full viewport height on scroll.

---

### Section 1 — Follow a Character

**The question:** Where did this character go, and what happened when they got there?

A D3.js galaxy map on the left shows all 27 planets as nodes. Selecting a character animates a path between the planets they visited, in chronological order, using a `stroke-dashoffset` animation that traces the route across the galaxy.

On the right, a scrollable story panel shows the selected character's beats as cards — each card contains the episode, the planet name, a one-line summary, and an expandable narrative description. The panel and the map are kept in sync: scrolling through beats highlights the current planet on the map.

**Key decisions:**
- **Character grid is pinned** to the top of the story panel so it's always visible regardless of scroll position.
- **Beat cards page vertically** rather than scroll continuously — each beat occupies the full panel height, making it feel more like turning pages than scrolling a list.
- **Beat image overlay** shows the character's name in large type, giving each card a cinematic header without requiring images for every planet.
- **Path animation is per-segment** — each leg of the journey animates in sequence rather than all at once, so you can follow the route visually.
- **Dimmed planets** — planets not in the selected character's journey are shown at low opacity, keeping the map readable without removing context.

---

### Section 2 — How the Story Unfolds (By Episode)

**The question:** What does the full picture of one film's character movements look like?

Structurally identical to Section 1 but pivoted to episodes rather than characters. Selecting an episode draws all the paths for all characters who appear in that film simultaneously, colour-coded by character. The story panel shows beats in narrative order across all characters for that episode.

**Key decisions:**
- **All paths drawn at once** for the selected episode, using each character's `CHAR_COLORS` colour. This creates a dense web of lines that visually conveys how interconnected the saga's geography is within a single film.
- **Beat image overlay** shows the film title (e.g. `THE PHANTOM MENACE`) rather than a planet name, grounding each card in the episode context.
- **Episode selector** uses roman numerals (I–IX) for immediate recognisability.
- **Section subtitle forced to one line** — whitespace-nowrap prevents the sub-heading from wrapping awkwardly at mid-range viewport widths.

---

### Section 3 — Galactic Intelligence (Dashboard)

**The question:** What patterns emerge when you aggregate across all characters and all films?

A two-page snap-scroll dashboard with four KPI cards, two per page. The section always resets to Page 1 whenever it is scrolled into view.

#### Page 1 — Planets

**Most Visited World** — A bubble map on the galaxy coordinate grid where bubble size and colour (blue → gold scale) encode the total number of character visits to each planet. The most visited planet is called out in the card header. Tooltips on hover show visit count, which characters visited, and the planet's geography.

**Most Populated World** — The same galaxy grid, with bubble size now encoding sentient population. A toggle button hides the two outliers (Coruscant at ~1 trillion and Geonosis at ~100 billion) which otherwise compress all other planets to invisible dots. When toggled, the scale recalculates live and the colour gradient redistributes across the remaining planets. Tooltip populations display as full untruncated numbers.

#### Page 2 — Characters

**Most Travelled Character** — A matrix of coloured squares, one square per unique planet visited. Characters are sorted top-to-bottom by number of unique worlds visited. Each row shows the planets in alphabetical order. The top character is highlighted in gold; all others in blue. Hovering a square shows the planet and its geography.

**Distance Travelled** — A dot plot where each row is a character, dots mark each planet stop along their journey, and the x-axis encodes cumulative distance in light-years. The rightmost dot has a ship icon. Characters are sorted by the same metric as the Most Travelled chart (unique worlds visited) so the two charts can be compared row-for-row. Tooltips show the exact full light-year distance at each stop.


---

## Tech Stack

- **Vanilla HTML/CSS/JavaScript** — no build step, no framework
- **D3.js v7** — all SVG map rendering, scales, and force-layout bubbles
- **CSS scroll-snap** — full-viewport section locking and inner dashboard paging
- **Google Fonts** — Orbitron (display), Share Tech Mono (data labels), Rajdhani (UI)
- **Vercel** — static hosting via GitHub integration

---


## Dataset

The raw dataset (`star-wars-data.xlsx`) contains the full planet table, journey beats per character, and population figures used to generate `data/sw-data.js`.

---