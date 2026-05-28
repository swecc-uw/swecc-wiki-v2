---
aliases:
  - getting-started
  - Getting started
---

# Getting started

Install the Mesocosm CLI, run your first local benchmark, then connect to the SWECC platform when you are ready to submit and run in the cloud.

## Install

Use **`pip`** — the Mesocosm CLI is distributed on PyPI as `swecc-mesocosm`:

```bash
pip install swecc-mesocosm
mesocosm --version
```

**Why pip?** SWECC docs and support assume a plain `pip install`. Other package managers (`uv`, Poetry, conda, Homebrew, etc.) may pin a different Python or an older wheel. If something breaks, retry in a fresh virtualenv with pip first:

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install swecc-mesocosm
```

The package provides:

- The **`mesocosm`** command
- Everything needed to run **`python adapter.py`** after `mesocosm init` (HTTP stack for the env adapter)
- Optional Python client (`BenchClient`) for scripts

You do **not** need a separate “bench” package on PyPI.

### Optional: upgrade

```bash
pip install -U swecc-mesocosm
```

## Your first project

```bash
mkdir my-env && cd my-env
mesocosm init
```

This scaffolds:

| File / folder | Purpose |
| --- | --- |
| `benchanything.json` | Domain manifest (binding vow, scoring) |
| `adapter.py` | HTTP server wrapping your environment |
| `env.py` | Environment logic |
| `requirements.txt` | Extra Python deps for **your** env (installed on the platform at submit time) |
| `LOCAL_DEV.md` | Short local-dev cheat sheet in your repo |
| `showcase/` | Placeholder for replay exports |

See [[Sweccathon/mesocosm/local-development|Local development]] for the two-terminal workflow.

## First commands

| Goal | Command |
| --- | --- |
| Check CLI | `mesocosm --help` |
| Check platform reachability | `mesocosm doctor` |
| Validate manifest before submit | `mesocosm validate benchanything.json` |
| Log in (member) | `mesocosm auth login` |
| Try without an account | `mesocosm auth guest` |
| Who am I? | `mesocosm auth whoami` |
| Local episodes (Ollama) | `mesocosm run local` |
| Submit GitHub repo | `mesocosm env submit --name "…" --github-url https://github.com/…` |
| Platform benchmark | `mesocosm run create --domain … --vow-version … --model …` |

## Production vs local

### Production (default)

Without extra environment variables, the CLI targets SWECC production:

| Service | Default URL |
| --- | --- |
| Member login (swecc-server) | `https://api.swecc.org` |
| Bench API | `https://api.swecc.org/bench` |

```bash
mesocosm doctor
mesocosm auth login
```

**Important:** The production bench API URL must include the **`/bench`** path (e.g. `https://api.swecc.org/bench`). If you override URLs, keep that suffix for production.

### Local development profile

For working against a local SWECC stack (or only the adapter + Ollama):

```bash
export MESOCOSM_LOCAL=1
mesocosm doctor --local
```

With `MESOCOSM_LOCAL=1`, defaults typically become:

| Service | Default |
| --- | --- |
| swecc-server | `http://127.0.0.1:8000` |
| bench-api | `http://127.0.0.1:8010` |
| Env adapter | `http://127.0.0.1:8765` |

`mesocosm run local` uses Ollama on your machine and does not require a running bench-api unless you are also testing platform commands locally.

Full details: [[Sweccathon/mesocosm/troubleshooting#urls-and-environment-variables|Troubleshooting — URLs and environment variables]].

## Configure {#configure}

### Credentials file

After `mesocosm auth login` or `auth guest`, credentials are stored at:

```
~/.config/swecc/bench_credentials.json
```

Override the path with `SWECC_BENCH_CREDENTIALS`.

Typical keys: `mode` (`member` or `guest`), `token`, `server_url`, `bench_url`, and optionally `active_team_id`.

### Environment variables (common)

| Variable | Purpose |
| --- | --- |
| `MESOCOSM_LOCAL` | Set to `1`, `true`, `yes`, or `on` for local URL defaults |
| `MESOCOSM_BASE_URL` | Override bench-api base URL |
| `SWECC_BENCH_URL` | Alias for bench-api URL |
| `SWECC_SERVER_URL` | Override server URL for `auth login` |
| `SWECC_BENCH_TOKEN` | Member JWT for scripts/CI (skip interactive login) |
| `SWECC_BENCH_GUEST_TOKEN` | Guest token for API calls |

See [[Sweccathon/mesocosm/command-reference#global-configuration|Command reference — Global configuration]] for the full list.

### Non-interactive auth

`mesocosm auth login` always prompts for username and password. For CI or automation:

```bash
export SWECC_BENCH_TOKEN='your-member-jwt'
# or
mesocosm auth guest
```

See [[Sweccathon/mesocosm/authentication|Authentication]].

## Typical workflows

### Environment author

1. `mesocosm init` → edit `env.py` / `benchanything.json`
2. `mesocosm validate benchanything.json`
3. [[Sweccathon/mesocosm/local-development|Local development]] with Ollama
4. [[Sweccathon/mesocosm/authentication|Authentication]] → [[Sweccathon/mesocosm/submitting-environments|Submitting environments]]
5. [[Sweccathon/mesocosm/running-benchmarks|Running benchmarks]] on the platform
6. Optional: [[Sweccathon/mesocosm/showcase|Showcase]] export

### Platform user (no env repo)

1. `mesocosm auth login` or `auth guest`
2. [[Sweccathon/mesocosm/teams|Teams]] (optional)
3. `mesocosm run create` against an existing domain
4. `mesocosm run get RUN_ID` / `mesocosm run export RUN_ID`

## Next steps

- [[Sweccathon/mesocosm/local-development|Local development]] — Ollama + adapter loop
- [[Sweccathon/mesocosm/authentication|Authentication]] — Member vs guest
- [[Sweccathon/mesocosm/command-reference|Command reference]] — All commands and flags
