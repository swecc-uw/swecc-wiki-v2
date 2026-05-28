---
aliases:
  - running-benchmarks
  - Running benchmarks
---

# Running benchmarks

Mesocosm supports **local** benchmarks (Ollama + your adapter) and **platform** benchmarks (cloud models on SWECC infrastructure). You can also use **eval** commands for targeted API-driven episodes.

## Local vs platform

| | **Local** (`run local`) | **Platform** (`run create`) |
| --- | --- | --- |
| **Where** | Your machine | SWECC cloud |
| **Model** | Ollama only (`ollama/…`) | Cloud providers (e.g. `gemini/…`, `openai/…`) |
| **Env** | `python adapter.py` | Submitted env or platform-hosted runtime |
| **Auth** | None required | Member or guest session |
| **Registers domain** | No | Uses existing domain from submit/register |

Local workflow: [[Sweccathon/mesocosm/local-development|Local development]].

## Platform run: `run create`

Start a benchmark run on the platform:

```bash
mesocosm run create \
  --domain YOUR_DOMAIN_ID \
  --vow-version 1.0.0 \
  --model gemini/gemini-3.1-flash-lite \
  --episodes 5 \
  --parallel 2
```

### Required flags

| Flag | Description |
| --- | --- |
| `--domain` | Domain id from `env submit` or legacy register |
| `--vow-version` | Binding vow version (e.g. `1.0.0`) |
| `--model` | Model identifier (e.g. `gemini/gemini-3.1-flash-lite`, `openai/gpt-4o-mini`) |

### Common optional flags

| Flag | Default | Description |
| --- | --- | --- |
| `--episodes` | `1` | Number of episodes |
| `--parallel` | `1` | Max parallel episodes |
| `--system-prompt` | — | Extra agent instruction |
| `--temperature` | `0.0` | Sampling temperature |
| `--max-tokens` | `512` | Max tokens per step |
| `--team` | active team | Explicit team id |
| `--solo` | — | Do not attach active team |
| `--visibility` | — | `private` or `gallery_public` |
| `--env-id` | — | Pin a specific developer environment |

### Auth

Uses your saved session (member or guest). For teams, set [[Sweccathon/mesocosm/teams|active team]] or pass `--team` / `--solo`.

## Inspect a run

```bash
mesocosm run get RUN_ID
mesocosm run episodes RUN_ID
mesocosm run episodes RUN_ID --traces
```

`run get` returns status and aggregate scores. `run episodes` lists episodes; `--traces` includes trace payloads.

## Export for showcase

```bash
mesocosm run export RUN_ID -o showcase/my-replay.json
```

See [[Sweccathon/mesocosm/showcase|Showcase]].

## Eval commands (API-driven)

For development and testing against the bench API without the full `run create` UX:

### Single test episode

```bash
mesocosm eval test \
  --domain-id YOUR_DOMAIN_ID \
  --model openai/gpt-4o-mini \
  --seed 42
```

Optional: `--vow-version`, `--env-url`, `--temperature`, `--max-tokens`, `--base-url`.

Exits non-zero if the episode status is `failed`, `cancelled`, or `error`.

### Multi-episode eval with aggregation

```bash
mesocosm eval run \
  --domain-id YOUR_DOMAIN_ID \
  --model openai/gpt-4o-mini \
  --num-episodes 3 \
  --seed-set '[1,2,3]'
```

By default, domains must be **published**; use `--allow-draft` for draft domains.

## Local run recap

```bash
python adapter.py                    # terminal 1
mesocosm run local --episodes 10     # terminal 2
```

Does not create platform runs or submit scores to the gallery.

## End-to-end platform flow

```bash
mesocosm auth login
mesocosm env submit --name "My env" --github-url https://github.com/you/repo
mesocosm env list

mesocosm run create \
  --domain DOMAIN_ID \
  --vow-version 1.0.0 \
  --model gemini/gemini-3.1-flash-lite \
  --episodes 10

mesocosm run get RUN_ID
mesocosm run export RUN_ID -o showcase/replay.json
```

## Related

- [[Sweccathon/mesocosm/local-development|Local development]]
- [[Sweccathon/mesocosm/submitting-environments|Submitting environments]]
- [[Sweccathon/mesocosm/showcase|Showcase]]
- [[Sweccathon/mesocosm/command-reference#running-benchmarks|Command reference — Run and eval]]
