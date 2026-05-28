---
aliases:
  - command-reference
  - Command reference
---

# Command reference

Complete parameter reference for the **`mesocosm`** CLI (`pip install swecc-mesocosm`, currently **0.2.14** on swecc-core main).

**See also:** [[Sweccathon/START_HERE|Mesocosm CLI]], [[Sweccathon/mesocosm/getting-started|Getting started]], [[Sweccathon/mesocosm/local-development|Local development]].

Run `mesocosm --help` or `mesocosm run --help` for the built-in command tree.

---

## Quick reference

| Command | Arguments / flags | Description |
| --- | --- | --- |
| *(root)* | `-V`, `--version` | Show mesocosm version and exit |
| `auth login` | `--server-url` | Log in; prompts for username and password |
| `auth token` | — | Print saved member JWT for curl or scripts |
| `auth guest` | `--bench-url` | Create guest session on bench-api |
| `auth whoami` | `--bench-url` | Show current principal via GET /v1/me |
| `auth logout` | — | Clear saved credentials file |
| `team create` | `--name`; `--use` | Create team; optionally set active |
| `team join` | `CODE` | Join team using invite code |
| `team list` | — | List teams you belong to |
| `team show` | `TEAM_ID` | Print team details as JSON |
| `team use` | `TEAM_ID` | Set active team in credentials |
| `team clear` | — | Clear active team; use solo default |
| `team runs` | `TEAM_ID` | List runs for a team |
| `team code show` | `TEAM_ID` | Show team including join code |
| `team code regenerate` | `TEAM_ID` | Rotate team join invite code |
| `team members remove` | `TEAM_ID`; `--user-id` | Remove member from team (owner) |
| `team transfer` | `TEAM_ID`; `--user-id` | Transfer team ownership to user |
| `team leave` | `TEAM_ID` | Leave a team you belong to |
| `team delete` | `TEAM_ID` | Delete a team (owner) |
| `init` | `--dir`; `--force` | Scaffold benchanything.json, adapter, env, showcase |
| `run local` | see below | Bench locally with Ollama and benchanything.json |
| `env submit` | `--name`; `--github-url`; … | Submit GitHub repo as developer environment |
| `env list` | `--team`; `--solo` | List your developer environments |
| `env delete` | `ENV_ID` | Delete a developer environment (member auth) |
| `run create` | `--domain`; `--vow-version`; … | Start platform bench run via API |
| `run export` | `RUN_ID`; `-o` / `--output` | Download run JSON for showcase or replay |
| `register` | `domain.py`; `--auto-id`; `--publish` | Legacy register domain.py; prefer env submit |
| `doctor` | `--base-url`; `--local` | Check bench-api reachability; local checks adapter |
| `validate` | `FILE` or `-` | Validate domain JSON against policy constraints |
| `eval test` | `--domain-id`; … | Run single test episode via bench-api |
| `eval run` | `--domain-id`; … | Run multi-episode eval with scoring aggregation |
| `run get` | `RUN_ID`; `--base-url` | Fetch run status and aggregate scores |
| `run episodes` | `RUN_ID`; `--traces`; `--base-url` | List episodes for a run; optional traces |

---

## Global configuration {#global-configuration}

### Credentials file

| Item | Description |
| --- | --- |
| **Default path** | `~/.config/swecc/bench_credentials.json` |
| **Override** | Set `SWECC_BENCH_CREDENTIALS` to another file path. |
| **Typical keys** | `mode` (`member` \| `guest`), `token`, `server_url`, `bench_url`, `active_team_id` (optional). |

Written by `auth login`, `auth guest`, `team use`, `team clear`, and `team create --use`. Cleared by `auth logout`.

### Environment variables

| Variable | Used by | Description |
| --- | --- | --- |
| `MESOCOSM_LOCAL` | URL defaults, `doctor --local` | When set to `1`, `true`, `yes`, or `on`, use local URLs (`127.0.0.1:8000` server, `:8010` bench-api, `:8765` adapter) unless overridden. See [[Sweccathon/mesocosm/getting-started#configure]] (Configure). |
| `MESOCOSM_BASE_URL` | `--base-url`, URL resolution | bench-api base URL. Production must include `/bench` (e.g. `https://api.swecc.org/bench`). |
| `SWECC_BENCH_URL` | URL resolution | Alias for bench-api base URL. |
| `BENCH_API_URL` | URL resolution | Third alias for bench-api base URL. |
| `SWECC_SERVER_URL` | `auth login` default | swecc-server base URL for member login (default prod: `https://api.swecc.org`). |
| `SWECC_BENCH_TOKEN` | API calls without `auth login` | Member JWT for scripts/CI. |
| `SWECC_BENCH_GUEST_TOKEN` | API calls | Guest token; forces guest mode when set. |
| `SWECC_BENCH_CREDENTIALS` | Credential store | Path to JSON credentials file. |
| `MESOCOSM_ENV_URL` | `doctor --local` | Override env adapter URL (default `http://127.0.0.1:8765`). |
| `MESOCOSM_ADAPTER_URL` | `doctor --local` | Alias for env adapter URL. |
| `BENCH_AUTH_DISABLED` | bench_common session (dev) | When `1`/`true`/`yes`, skip auth and use empty bearer (local bench-api dev only). |

**Resolution order (member bench-api URL):** CLI `--bench-url` / `--base-url` → environment variables above → saved `bench_url` in credentials → derive from `server_url` → `MESOCOSM_LOCAL` → production default.

**Guest default URL:** `auth guest` uses CLI `--bench-url` or env bench URL vars only — **not** saved credentials and **not** `MESOCOSM_LOCAL` — defaulting to `https://api.swecc.org/bench` when unset.

### Global CLI flags

| Flag | Applies to | Description |
| --- | --- | --- |
| `--bench-url` | `auth`, `team`, `env`, `init`, `register`, `run create`, `local`, `export` | Override bench-api base URL for that invocation. |
| `--base-url` | `doctor`, `validate`, `eval`, `run get`, `run episodes` | Same role as `--bench-url`; also reads `MESOCOSM_BASE_URL`. |
| `-V`, `--version` | Root | Print package version and exit. |

### Active team context

Many platform commands attach `team_id` from credentials `active_team_id`, unless you pass `--team TEAM_ID` or `--solo`. Set active team with `mesocosm team use TEAM_ID` or `team create --use`.

See [[Sweccathon/mesocosm/teams|Teams]].

---

## Authentication {#authentication}

### `mesocosm auth login`

**Summary:** Interactive member login via SWECC API; saves JWT and bench URL to credentials.

| Parameter | Required | Description |
| --- | --- | --- |
| `--server-url` | No | Server base URL for login. Default: `SWECC_SERVER_URL`, else `MESOCOSM_LOCAL` → `http://127.0.0.1:8000`, else `https://api.swecc.org`. |
| `--bench-url` | No | bench-api URL stored after login. Default derived from server (prod → `https://api.swecc.org/bench`, local server → `:8010`). |
| *(interactive)* | Yes | Prompts for **username** (default: OS username) and **password**. No `--username` / `--password` flags. |

**After success:** Writes `mode: member`, `token`, `server_url`, `bench_url`. For CI, use `SWECC_BENCH_TOKEN` ([[Sweccathon/mesocosm/authentication|Authentication]]).

### `mesocosm auth token`

**Summary:** Print the saved member JWT for curl or scripts.

| Parameter | Required | Description |
| --- | --- | --- |
| `--bench-url` | No | Parent flag (unused for output). |

**Requires:** Prior `auth login` with `mode: member`. Errors if only guest credentials exist.

### `mesocosm auth guest`

**Summary:** Create a short-lived guest session on bench-api (no SWECC account).

| Parameter | Required | Description |
| --- | --- | --- |
| `--bench-url` | No | bench-api URL for `POST /v1/auth/guest`. Default: env vars, else **production** `https://api.swecc.org/bench` (ignores saved credentials and `MESOCOSM_LOCAL`). |

**After success:** Saves `mode: guest`, `token`, `bench_url`. Guest cannot run member-only commands (`team *`, `env submit`, etc.).

### `mesocosm auth whoami`

**Summary:** Call `GET /v1/me` and print JSON principal.

| Parameter | Required | Description |
| --- | --- | --- |
| `--bench-url` | No | Combined with credentials for URL resolution. |

**Errors:** Connection failures print hints for prod vs local. If guest token is rejected, suggests re-running `auth guest`.

### `mesocosm auth logout`

**Summary:** Delete the credentials file. No arguments.

---

## Teams {#teams}

### `mesocosm team create`

| Parameter | Required | Description |
| --- | --- | --- |
| `--name` | Yes | Display name for the new team. |
| `--use` | No | Save returned `team_id` as `active_team_id`. |
| `--bench-url` | No | Parent flag. |

**Output:** `team_id` and `join_code`.

### `mesocosm team join`

| Parameter | Required | Description |
| --- | --- | --- |
| `CODE` | Yes | Invite code (normalized to uppercase). |
| `--bench-url` | No | Parent flag. |

### `mesocosm team list` / `team show` / `team use` / `team clear` / `team runs`

| Command | Positional | Notes |
| --- | --- | --- |
| `team list` | — | One line per team |
| `team show` | `TEAM_ID` | JSON details |
| `team use` | `TEAM_ID` | Sets `active_team_id` (no API call) |
| `team clear` | — | Removes active team |
| `team runs` | `TEAM_ID` | `GET /v1/teams/{id}/runs` |

### `mesocosm team code show` / `team code regenerate`

Same as `team show` for `code show`. `code regenerate` rotates join code (owner).

### `mesocosm team members remove` / `team transfer` / `team leave` / `team delete`

| Command | Required flags |
| --- | --- |
| `team members remove` | `TEAM_ID`, `--user-id` (owner) |
| `team transfer` | `TEAM_ID`, `--user-id` (owner) |
| `team leave` | `TEAM_ID` |
| `team delete` | `TEAM_ID` (owner) |

---

## Project scaffolding

### `mesocosm init`

**Summary:** Scaffold a new env author repo (no API calls).

| Parameter | Required | Description |
| --- | --- | --- |
| `--dir` | No | Target directory (default: `.`). |
| `--force` | No | Overwrite existing scaffold files. |
| `--bench-url` | No | Parent flag (unused by init). |

**Writes:** `benchanything.json`, `adapter.py`, `env.py`, `requirements.txt`, `LOCAL_DEV.md`, `showcase/README.md`, `showcase/replay.example.json`.

See [[Sweccathon/mesocosm/local-development|Local development]].

---

## Running benchmarks {#running-benchmarks}

### `mesocosm run local` {#mesocosm-run-local}

**Summary:** Run episodes locally via Ollama + `benchanything.json` (no platform submit).

| Parameter | Required | Description |
| --- | --- | --- |
| `--manifest` | No | Path to `benchanything.json` (default: `./benchanything.json`). |
| `--domain-id` | No | Override domain id; default from manifest or parent folder name. |
| `--model` | No | LiteLLM model id (default: `ollama/llama3.2`). Must start with `ollama/`. |
| `--env-url` | No | Env adapter URL (default: `http://localhost:8765`). |
| `--episodes` | No | Number of episodes (default: `5`). |
| `--seeds` | No | Space-separated integer seeds. |
| `--system-prompt` | No | Optional system prompt for the agent. |
| `--temperature` | No | Sampling temperature (default: `0.0`). |
| `--max-tokens` | No | Max tokens per step (default: `512`). |
| `--parallel` | No | Max parallel episodes (default: `1`). |
| `--quiet` | No | Reduce progress output. |
| `--bench-url` | No | Parent flag (unused; no bench-api call). |

### `mesocosm run create`

**Summary:** Start a bench run on the platform (`POST /v1/runs`).

| Parameter | Required | Description |
| --- | --- | --- |
| `--domain` | Yes | Target domain id. |
| `--vow-version` | Yes | Binding vow version (e.g. `1.0.0`). |
| `--model` | Yes | Model identifier (e.g. `gemini/gemini-3.1-flash-lite`). |
| `--episodes` | No | Episode count (default: `1`). |
| `--parallel` | No | Max parallel episodes (default: `1`). |
| `--system-prompt` | No | Optional system prompt in `agent_config`. |
| `--temperature` | No | Agent temperature (default: `0.0`). |
| `--max-tokens` | No | Max tokens per step (default: `512`). |
| `--team` | No | Explicit team id on the run. |
| `--solo` | No | Do not attach active team. |
| `--visibility` | No | `private` or `gallery_public`. |
| `--env-id` | No | Developer environment id to pin env URL/runtime. |
| `--bench-url` | No | Parent flag. |

### `mesocosm run export` {#mesocosm-run-export}

**Summary:** Download run JSON (traces + replay) for showcase.

| Parameter | Required | Description |
| --- | --- | --- |
| `RUN_ID` | Yes | Platform run id. |
| `-o`, `--output` | No | Write JSON to file; default stdout. |
| `--bench-url` | No | Parent flag. |

**API:** `GET /v1/runs/{run_id}/export`. See [[Sweccathon/mesocosm/showcase|Showcase]].

### `mesocosm run get`

**Summary:** Fetch run status, episodes, and aggregate scores.

| Parameter | Required | Description |
| --- | --- | --- |
| `RUN_ID` | Yes | Platform run id. |
| `--base-url` | No | bench-api base URL. |

### `mesocosm run episodes`

**Summary:** List episodes for a run; optionally include traces.

| Parameter | Required | Description |
| --- | --- | --- |
| `RUN_ID` | Yes | Platform run id. |
| `--traces` | No | Also fetch run traces keyed by episode. |
| `--base-url` | No | bench-api base URL. |

---

## Environments

### `mesocosm env submit` {#mesocosm-env-submit}

**Summary:** Submit a GitHub repo as a developer environment (member auth).

| Parameter | Required | Description |
| --- | --- | --- |
| `--name` | Yes | Human-readable environment name. |
| `--github-url` | Yes | Public GitHub repo URL; platform clones and registers from `benchanything.json`. |
| `--description` | No | Optional description (default: empty). |
| `--team` | No | Explicit `team_id` (overrides active team). |
| `--solo` | No | Force solo scope (no `team_id`). |
| `--bench-url` | No | Parent flag. |

See [[Sweccathon/mesocosm/submitting-environments|Submitting environments]].

### `mesocosm env list`

| Parameter | Required | Description |
| --- | --- | --- |
| `--team` | No | Explicit team id filter. |
| `--solo` | No | List solo-scoped environments only. |
| `--bench-url` | No | Parent flag. |

### `mesocosm env delete`

**Summary:** Delete a developer environment by id (member auth).

| Parameter | Required | Description |
| --- | --- | --- |
| `ENV_ID` | Yes | Developer environment id from `env list` or submit output. |
| `--bench-url` | No | Parent flag. |

**API:** `DELETE /v1/developer/environments/{env_id}`.

---

## Legacy register

### `mesocosm register`

**Summary:** Legacy: register `domain.py` with `DOMAIN_CONFIG` (prefer `env submit` for new repos).

| Parameter | Required | Description |
| --- | --- | --- |
| `domain_file` | Yes | Path to `domain.py`. |
| `--auto-id` | No | Set domain id to parent directory name. |
| `--publish` | No | Publish domain after register. |
| `--bench-url` | No | bench-api URL for register/publish API. |

---

## Diagnostics and validation

### `mesocosm doctor`

**Summary:** Probe bench-api health; with `--local`, also probe env adapter.

| Parameter | Required | Description |
| --- | --- | --- |
| `--base-url` | No | bench-api URL. Default prod `https://api.swecc.org/bench` or local when `MESOCOSM_LOCAL=1`. |
| `--local` | No | Check adapter at `MESOCOSM_ENV_URL` / default `:8765` and bench-api at `:8010`. |

**Exit code:** `0` if checks pass, `1` otherwise. Prints JSON with `issues` and hints (e.g. missing `/bench` on prod).

**Local profile:** With `--local` or `MESOCOSM_LOCAL=1`, `doctor` passes if the env adapter health check succeeds — bench-api can be down, which is fine for the Ollama + `run local` loop.

See [[Sweccathon/mesocosm/troubleshooting|Troubleshooting]].

### `mesocosm validate` {#mesocosm-validate}

**Summary:** Validate JSON against bundled policy constraints (offline, no HTTP).

| Parameter | Required | Description |
| --- | --- | --- |
| `FILE` | Yes | Path to JSON file, or `-` for stdin. Auto-detects **`benchanything.json` manifest** shape or legacy **POST `/v1/domains` register body**. |
| `--base-url` | No | Declared but unused (no network). |

**Output:** JSON with `ok`, `issues`, `suggested_fixes`, `rules_version`, and optional `schema: benchanything_manifest`.

**Exit code:** `0` if validation `ok`, else `1`.

---

## Eval

### `mesocosm eval test`

**Summary:** Run one dev test episode (`POST /v1/test/episode`).

| Parameter | Required | Description |
| --- | --- | --- |
| `--domain-id` | Yes | Target domain id. |
| `--vow-version` | No | If omitted, read from domain record. |
| `--model` | Yes | Model id. |
| `--env-url` | No | Override environment HTTP URL. |
| `--seed` | No | Episode seed integer. |
| `--temperature` | No | Default `0.0`. |
| `--max-tokens` | No | Default `4096`. |
| `--base-url` | No | bench-api base URL. |

**Exit:** Non-zero if episode status is `failed`, `cancelled`, or `error`.

### `run create` vs `eval run`

Both call `POST /v1/runs`, but they target different workflows:

| | `run create` | `eval run` |
| --- | --- | --- |
| Domain flag | `--domain` | `--domain-id` |
| Episodes | `--episodes` | `--num-episodes` |
| Parallelism | `--parallel` | `--max-parallel` |
| Default `max_tokens` | 512 | 4096 |
| `--vow-version` | required | optional (from domain record) |
| Draft domains | no guard | `--require-published` / `--allow-draft` |
| Teams / visibility / env-id | yes | no |

Prefer **`run create`** for hackathon platform benchmarks; use **`eval run`** for developer eval workflows.

### `mesocosm eval run`

**Summary:** Multi-episode run with aggregation (`POST /v1/runs`).

| Parameter | Required | Description |
| --- | --- | --- |
| `--domain-id` | Yes | Target domain id. |
| `--vow-version` | No | Default from domain record if omitted. |
| `--model` | Yes | Model id. |
| `--num-episodes` | No | Default `1`. |
| `--seed-set` | No | JSON array of integers, e.g. `'[1,2,3]'`. |
| `--temperature` | No | Default `0.0`. |
| `--max-tokens` | No | Default `4096`. |
| `--max-parallel` | No | Default `1`. |
| `--require-published` / `--allow-draft` | No | Default rejects non-`published` domains; `--allow-draft` allows draft. |
| `--base-url` | No | bench-api base URL. |

---

## Root

### `mesocosm` (root)

| Parameter | Required | Description |
| --- | --- | --- |
| `-V`, `--version` | No | Print `mesocosm <version>` and exit. |
| `--help` | No | Show command tree or subcommand help. |

`mesocosm run` with no subcommand shows run subcommand help.
