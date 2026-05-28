---
aliases:
  - local-development
  - Local development
---

# Local development

Iterate on `env.py` and `benchanything.json` on your machine **before** submitting to the platform. Local runs use [Ollama](https://ollama.com) — no cloud API keys required.

## Prerequisites

1. **CLI:** `pip install swecc-mesocosm`
2. **Project:** `mesocosm init` in your env directory (or use an existing repo with the same layout)
3. **Ollama:** Install from [ollama.com](https://ollama.com), then pull a model:

   ```bash
   ollama pull llama3.2
   ```

4. **Ollama running:** The desktop app usually starts the server; otherwise run `ollama serve`.

### About `requirements.txt`

The file created by `mesocosm init` is for **optional libraries your environment imports** (for example NumPy). You do **not** need `pip install -r requirements.txt` just to run `adapter.py` and `mesocosm run local` — the CLI already includes the HTTP stack.

When you [[Sweccathon/mesocosm/submitting-environments|submit]] to the platform, Mesocosm installs those dependencies in the cloud runtime.

## Dev loop

Optional but recommended when using a local SWECC stack:

```bash
export MESOCOSM_LOCAL=1
mesocosm doctor --local
```

`doctor --local` checks that your adapter responds on port **8765** (and local bench-api on **8010** if you have it running).

### Terminal 1 — env adapter

```bash
python adapter.py
# Health check: http://localhost:8765/health
```

### Terminal 2 — benchmark episodes

```bash
mesocosm run local
# Equivalent: mesocosm run local --model ollama/llama3.2
```

`run local`:

- Reads **`benchanything.json`** for the binding vow and scoring rules
- Calls your adapter at **`http://localhost:8765`** by default
- Uses an **Ollama** model (`ollama/…` prefix required)
- Does **not** register the domain or create platform runs

## Useful flags

| Flag | Default | Purpose |
| --- | --- | --- |
| `--model` | `ollama/llama3.2` | LiteLLM model id; must start with `ollama/` and match a pulled model |
| `--episodes` | `5` | Number of episodes |
| `--env-url` | `http://localhost:8765` | Adapter base URL if you changed the port |
| `--manifest` | `benchanything.json` | Alternate manifest path |
| `--domain-id` | from manifest or folder name | Override domain id for local runs |
| `--system-prompt` | — | Extra instruction for the agent |
| `--temperature` | `0.0` | Sampling temperature |
| `--max-tokens` | `512` | Max tokens per step |
| `--parallel` | `1` | Max parallel episodes |
| `--seeds` | — | Space-separated integer seeds |
| `--quiet` | — | Less progress output |

Full reference: [[Sweccathon/mesocosm/command-reference#mesocosm-run-local|Command reference — run local]].

## Ship to the platform

When local runs look good:

```bash
mesocosm auth login
mesocosm env submit \
  --name "My env" \
  --github-url https://github.com/you/your-repo

mesocosm env list    # note domain_id when status is ready

mesocosm run create \
  --domain DOMAIN_ID \
  --vow-version 1.0.0 \
  --model gemini/gemini-3.1-flash-lite \
  --episodes 5
```

Platform runs use **cloud models** on SWECC infrastructure. Ollama is only for your machine.

See [[Sweccathon/mesocosm/submitting-environments|Submitting environments]] and [[Sweccathon/mesocosm/running-benchmarks|Running benchmarks]].

## Legacy `domain.py` repos

Repos created before `benchanything.json` scaffolding may use `domain.py` with `DOMAIN_CONFIG`. You can still register manually:

```bash
mesocosm register path/to/domain.py [--auto-id] [--publish]
```

New projects should prefer `mesocosm init` + `env submit`.

## Related

- [[Sweccathon/mesocosm/getting-started|Getting started]]
- [[Sweccathon/mesocosm/troubleshooting#local-development-issues|Troubleshooting — local checks]]
- [[Sweccathon/mesocosm/command-reference|Command reference]]
