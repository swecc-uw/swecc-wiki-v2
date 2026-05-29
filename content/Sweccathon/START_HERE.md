---
title: Mesocosm CLI — Start here
aliases:
  - START_HERE
  - Mesocosm
  - mesocosm
  - Mesocosm CLI
  - mesocosm CLI
tags:
  - mesocosm
  - swecc
  - cli
---

# Mesocosm CLI

Central hub for the **mesocosm** command-line tool — SWECC's BenchAnything / Mesocosm platform.

> [!tip] New here?
> Event logistics → **[[Sweccathon/event-slides|SWECCATHON 2026 slides]]**. Then the platform tour → **[[Sweccathon/mesocosm/slides|mesocosm overview slides]]**.

**Install with pip** (recommended — the package is published on PyPI):

```bash
pip install swecc-mesocosm
```

Use **`pip`**, not Homebrew, `uv`, Poetry, or other wrappers, unless you know what you are doing. Those can install a different Python environment or an outdated build and cause confusing `mesocosm: command not found` errors. No backend source code required.

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate   # macOS/Linux — Windows: .venv\Scripts\activate

pip install swecc-mesocosm
mesocosm --help

mkdir my-env && cd my-env
mesocosm init

ollama serve                # or open the Ollama app
ollama pull llama3.2
python adapter.py           # terminal 1
mesocosm run local          # terminal 2
```

Platform:

```bash
mesocosm auth login
mesocosm env submit --name "My env" --github-url https://github.com/you/your-repo
mesocosm run create --domain YOUR_DOMAIN_ID --vow-version 1.0.0 --model gemini/gemini-3.1-flash-lite
```

## Guides

- [[Sweccathon/mesocosm/slides]] — **Overview slides** — visual tour of the platform
- [[Sweccathon/mesocosm/getting-started]] — Install, first commands, production vs local
- [[Sweccathon/mesocosm/local-development]] — Ollama loop, adapter, `run local`
- [[Sweccathon/mesocosm/authentication]] — Login, guest, tokens, logout
- [[Sweccathon/mesocosm/teams]] — Create, join, active team context
- [[Sweccathon/mesocosm/submitting-environments]] — `env submit`, GitHub requirements
- [[Sweccathon/mesocosm/running-benchmarks]] — Platform runs, local runs, eval
- [[Sweccathon/mesocosm/showcase]] — Replay JSON, `run export`
- [[Sweccathon/mesocosm/command-reference]] — Full parameter reference
- [[Sweccathon/mesocosm/troubleshooting]] — `doctor`, URLs, common errors

## Who this is for

- **Environment authors** — `benchanything.json`, `env.py`, adapter
- **Platform users** — runs, teams, showcase exports

## Production vs local

| Mode | Typical use |
| --- | --- |
| **Production** (default) | `mesocosm auth login`, `env submit`, `run create` → `https://api.swecc.org` |
| **Local** | `export MESOCOSM_LOCAL=1`, `mesocosm doctor --local`, `mesocosm run local` with Ollama |

Details: [[Sweccathon/mesocosm/getting-started#configure|Configure]] · [[Sweccathon/mesocosm/troubleshooting|Troubleshooting]]

## Related vault notes

- [[Sweccathon/SWECCathon 2026 Information Hub]] — hackathon logistics and links

## CLI help

```bash
mesocosm --help
mesocosm auth --help
mesocosm run --help
```

Every flag and default: [[Sweccathon/mesocosm/command-reference|Command reference]].
