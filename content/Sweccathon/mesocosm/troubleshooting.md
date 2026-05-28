---
aliases:
  - troubleshooting
  - Troubleshooting
---

# Troubleshooting

Common issues when using the Mesocosm CLI, connectivity checks, and URL configuration.

## Run `doctor` first

```bash
mesocosm doctor
```

Checks reachability of the bench API (default production: `https://api.swecc.org/bench`).

For local adapter + local bench API:

```bash
export MESOCOSM_LOCAL=1
mesocosm doctor --local
```

- **Exit 0:** checks passed  
- **Exit 1:** failures; output includes JSON `issues` and hints  

`doctor --local` verifies:

| Target | Default URL |
| --- | --- |
| Env adapter | `http://127.0.0.1:8765` (override: `MESOCOSM_ENV_URL` or `MESOCOSM_ADAPTER_URL`) |
| bench-api | `http://127.0.0.1:8010` |

**Note:** In local profile, `doctor` can pass when only the env adapter is healthy. That is expected for the Ollama + `run local` loop even if bench-api is not running.

## URLs and environment variables {#urls-and-environment-variables}

### Production bench API must include `/bench`

Wrong:

```
https://api.swecc.org
```

Right:

```
https://api.swecc.org/bench
```

If `doctor` or API calls fail against production, confirm `MESOCOSM_BASE_URL` / `SWECC_BENCH_URL` includes the `/bench` suffix.

### `MESOCOSM_LOCAL`

Set when working against a local SWECC stack or when you want local URL defaults everywhere:

```bash
export MESOCOSM_LOCAL=1   # also: true, yes, on
```

Typical local defaults:

| Service | URL |
| --- | --- |
| swecc-server | `http://127.0.0.1:8000` |
| bench-api | `http://127.0.0.1:8010` |
| Env adapter | `http://127.0.0.1:8765` |

Equivalent to running `mesocosm doctor --local` for URL selection in many commands.

### Override bench API URL

Any of:

```bash
export MESOCOSM_BASE_URL=https://api.swecc.org/bench
export SWECC_BENCH_URL=https://api.swecc.org/bench
mesocosm run create ... --bench-url https://api.swecc.org/bench
mesocosm run get RUN_ID --base-url https://api.swecc.org/bench
```

### Guest vs member URL behavior

- **`auth guest`** defaults to production bench URL unless you pass `--bench-url` or set env vars — it does **not** read `MESOCOSM_LOCAL` or saved credentials for the default.
- **`auth login`** saves `bench_url` derived from the server you used.

If `whoami` fails after guest login, re-run `auth guest` with the correct `--bench-url`.

## Authentication issues {#authentication-issues}

| Symptom | Things to try |
| --- | --- |
| `auth token` fails | Run `auth login` first; guest sessions cannot print member token |
| `team` / `env submit` forbidden | Use `auth login` (member), not guest |
| Login works but bench calls fail | Check saved `bench_url` in credentials; use `doctor` |
| CI needs non-interactive auth | `export SWECC_BENCH_TOKEN=…` or `mesocosm auth guest` |

Clear stale credentials:

```bash
mesocosm auth logout
mesocosm auth login
```

Credentials path: `~/.config/swecc/bench_credentials.json` (override with `SWECC_BENCH_CREDENTIALS`).

## Local development issues {#local-development-issues}

| Symptom | Things to try |
| --- | --- |
| `run local` exits on model | Use `--model ollama/MODEL` where `MODEL` is pulled (`ollama pull …`) |
| Connection refused to adapter | Start `python adapter.py`; check `http://localhost:8765/health` |
| `doctor --local` adapter fail | Set `MESOCOSM_ENV_URL` if adapter uses a non-default port |
| Ollama errors | Ensure `ollama serve` is running; pull the model |

`run local` does **not** call the bench API — bench-api being down is fine for pure local iteration.

## Platform run issues

| Symptom | Things to try |
| --- | --- |
| `run create` domain not found | `mesocosm env list`; wait until env is ready after submit |
| `eval run` rejects domain | Domain may need to be published; try `--allow-draft` for drafts |
| `run export` 404 / forbidden | Confirm `RUN_ID`, auth, and run visibility |
| Wrong team on run | `mesocosm team use TEAM_ID` or pass `--team` / `--solo` |

## `validate` failures

`mesocosm validate` is **offline** — it does not hit the network. Pass a `benchanything.json` manifest or legacy register JSON:

```bash
mesocosm validate benchanything.json
```

A failure means the JSON does not match bundled policy constraints. Fix the reported fields and re-run.

## Connection errors (general)

1. `mesocosm doctor` (or `doctor --local`)
2. `mesocosm auth whoami`
3. Verify URL includes `/bench` for production
4. Check firewall/VPN blocking `api.swecc.org`

## Get help on the CLI

```bash
mesocosm --help
mesocosm run --help
mesocosm auth login --help
```

Full flag list: [[Sweccathon/mesocosm/command-reference|Command reference]].

## Related

- [[Sweccathon/mesocosm/getting-started#configure|Getting started — Configure]]
- [[Sweccathon/mesocosm/authentication|Authentication]]
- [[Sweccathon/mesocosm/local-development|Local development]]
