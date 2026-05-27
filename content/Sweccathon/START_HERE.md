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

Central hub for the **mesocosm** command-line tool — SWECC's BenchAnything / Mesocosm platform. Install with `pip install swecc-mesocosm`; no backend source code required.

## Quick start

```bash
pip install swecc-mesocosm
mesocosm --help

mkdir my-env && cd my-env
mesocosm init

ollama pull llama3.2
python adapter.py          # terminal 1
mesocosm run local         # terminal 2
```

Platform:

```bash
mesocosm auth login
mesocosm env submit --name "My env" --github-url https://github.com/you/your-repo
mesocosm run create --domain YOUR_DOMAIN_ID --vow-version 1.0.0 --model gemini/gemini-3.1-flash-lite
```

## Guides

- [[mesocosm/getting-started]] — Install, first commands, production vs local
- [[mesocosm/local-development]] — Ollama loop, adapter, `run local`
- [[mesocosm/authentication]] — Login, guest, tokens, logout
- [[mesocosm/teams]] — Create, join, active team context
- [[mesocosm/submitting-environments]] — `env submit`, GitHub requirements
- [[mesocosm/running-benchmarks]] — Platform runs, local runs, eval
- [[mesocosm/showcase]] — Replay JSON, `run export`
- [[mesocosm/command-reference]] — Full parameter reference
- [[mesocosm/troubleshooting]] — `doctor`, URLs, common errors

## Who this is for

- **Environment authors** — `benchanything.json`, `env.py`, adapter
- **Platform users** — runs, teams, showcase exports

## Production vs local

| Mode | Typical use |
| --- | --- |
| **Production** (default) | `mesocosm auth login`, `env submit`, `run create` → `https://api.swecc.org` |
| **Local** | `export MESOCOSM_LOCAL=1`, `mesocosm doctor --local`, `mesocosm run local` with Ollama |

Details: [[mesocosm/getting-started#configure|Configure]] · [[mesocosm/troubleshooting|Troubleshooting]]

## Related vault notes

- [[SWECCathon 2026 Information Hub]] — hackathon logistics and links

## CLI help

```bash
mesocosm --help
mesocosm auth --help
mesocosm run --help
```

Every flag and default: [[mesocosm/command-reference|Command reference]].
