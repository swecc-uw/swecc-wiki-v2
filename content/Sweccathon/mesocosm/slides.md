---
title: Mesocosm — Overview Slides
aliases:
  - slides
  - mesocosm slides
  - deck
  - overview
tags:
  - mesocosm
  - swecc
  - slides
---

# Mesocosm — Overview Slides

A visual walkthrough of the **mesocosm** platform: environments, the agent loop, the four-endpoint contract, and the three files you ship.

[**Open the slides full-screen ↗**](/static/decks/mesocosm/index.html)

<iframe
  src="/static/decks/mesocosm/index.html"
  title="Mesocosm overview slides"
  loading="lazy"
  allowfullscreen
  style="width:100%; aspect-ratio:16/9; border:1px solid var(--lightgray); border-radius:8px; margin-top:1rem;">
</iframe>

Navigate with the on-screen arrows or your keyboard (← / →). Press **F** for full screen, **Esc** for the slide overview, and **O** to toggle the overview grid.

> [!tip] Self-contained
> The deck lives at `/static/decks/mesocosm/` and is styled with the shared mesocosm design system (`/static/design-system/`). It works offline and embeds anywhere.

## What's inside

1. **mesocosm** — the platform in one line
2. **Definitions** — environment, state, observation, action space, episode (with a Wordle example)
3. **The Environment Workflow** — `reset → observation → action → step → reward → repeat → close`
4. **The Agent Loop** — Observe · Think · Act · Repeat (ReACT)
5. **The Process** — idea → public showcase
6. **The Contract** — the four endpoints (`/health`, `/reset`, `/step`, `/close`)
7. **Local checklist** — run the endpoints by hand
8. **`env.py`** — the game/task logic
9. **`adapter.py`** — the server
10. **`benchanything.json`** — the rulebook
11. **The package** — the files to build everything
12. **We handle the rest** — submit and bench
13. **Automated grading** — your env emits signal, `scoring` decides the verdict
14. **Pass/fail vs scored** — the two rubric flavors
15. **Multi-criteria rubrics** — combine criteria & guard the score
16. **Demo — Intertwine** — *Don't lose your contexts*
17. **Demo — KleoKlaw** — a job board you run from your texts
18. **Q&A / brainstorm**

## Related

- [[Sweccathon/START_HERE|Mesocosm CLI — Start here]]
- [[Sweccathon/event-slides|SWECCATHON 2026 — Event slides]]
