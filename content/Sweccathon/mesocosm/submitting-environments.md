---
aliases:
  - submitting-environments
  - Submitting environments
---

# Submitting environments

Submit a **public GitHub repository** as a developer environment. The platform clones your repo, reads `benchanything.json`, and registers a domain you can benchmark with `mesocosm run create`.

Member authentication is required (`mesocosm auth login`).

## Submit command

```bash
mesocosm env submit \
  --name "My shopping env" \
  --github-url https://github.com/you/your-env-repo \
  --description "Optional short description"
```

| Flag | Required | Description |
| --- | --- | --- |
| `--name` | Yes | Human-readable environment name |
| `--github-url` | Yes | Public GitHub repository URL |
| `--description` | No | Optional description |
| `--team` | No | Submit under a specific team (overrides active team) |
| `--solo` | No | Submit in solo scope (no team) |

### Team scope

If you have an [[mesocosm/teams|active team]], submissions default to that team unless you pass `--team` or `--solo`.

## What happens on submit

1. Mesocosm sends your repo URL to the bench API.
2. The platform **clones** the public repository.
3. It locates **`benchanything.json`** and registers a **draft domain** from that manifest.
4. You do **not** need a separate `register` step for standard `mesocosm init` layouts.

Check status:

```bash
mesocosm env list
mesocosm env list --solo
mesocosm env list --team TEAM_ID
```

When the environment is **ready**, note the **`domain_id`** for `mesocosm run create`.

## GitHub repository requirements

Your repo should be suitable for automated clone and run:

| Requirement | Why |
| --- | --- |
| **Public** repository | Platform must clone without private credentials via this flow |
| **`benchanything.json`** at repo root (or path the platform expects) | Defines binding vow, domain metadata, scoring |
| **`env.py`** + **`adapter.py`** (or equivalent layout from `mesocosm init`) | Runtime environment and HTTP adapter |
| **`requirements.txt`** (if needed) | Optional extra Python packages installed in the cloud runtime |
| Working local loop | Validate with [[mesocosm/local-development]] before submit |

### Recommended layout (from `mesocosm init`)

```
your-repo/
  benchanything.json
  adapter.py
  env.py
  requirements.txt      # optional deps only
  showcase/
    README.md
    replay.example.json
```

Push to GitHub, then submit the HTTPS URL:

```bash
mesocosm env submit \
  --name "My env" \
  --github-url https://github.com/you/your-env-repo
```

## After submit

1. `mesocosm env list` — wait until status indicates ready
2. [[mesocosm/running-benchmarks|Running benchmarks]] — `mesocosm run create --domain DOMAIN_ID …`
3. Optionally pin an environment: `run create --env-id ENV_ID`

## Legacy `domain.py` workflow

Older repos may use `domain.py` with `DOMAIN_CONFIG` instead of the `benchanything.json` scaffold:

```bash
mesocosm register path/to/domain.py [--auto-id] [--publish]
```

New projects should use **`mesocosm init`** + **`env submit`**.

## Validate before submit (optional)

Offline check of domain registration JSON shape:

```bash
mesocosm validate domain.json
# or
cat domain.json | mesocosm validate -
```

See [[mesocosm/command-reference#mesocosm-validate|Command reference — validate]].

## Related

- [[mesocosm/local-development|Local development]]
- [[mesocosm/running-benchmarks|Running benchmarks]]
- [[mesocosm/teams|Teams]]
- [[mesocosm/command-reference#mesocosm-env-submit|Command reference — env submit]]
