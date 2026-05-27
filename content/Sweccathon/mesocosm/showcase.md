---
aliases:
  - showcase
  - Showcase
---

# Showcase

Use the **showcase** folder in your environment repo to store **replay JSON** exported from platform runs — for demos, documentation, or sharing benchmark trajectories.

## Folder from `mesocosm init`

When you scaffold a project:

```bash
mesocosm init
```

you get:

```
showcase/
  README.md              # Brief notes on showcase usage
  replay.example.json    # Example shape (not a real run)
```

Keep exported replays here (or anywhere in your repo) and commit them if you want them in version control.

## Export a run

After a platform benchmark completes:

```bash
mesocosm run export RUN_ID -o showcase/my-replay.json
```

Without `-o`, JSON is written to **stdout** (pipe to a file or another tool).

| Argument | Description |
| --- | --- |
| `RUN_ID` | Platform run id from `run create` or `run get` |
| `-o`, `--output` | Output file path (optional) |

The export includes run data suitable for replay or analysis (episodes, traces, replay payload as provided by the API).

### Requirements

- You must be authenticated (member or guest, depending on run visibility)
- `RUN_ID` must be a run you can access on the bench API

## Typical workflow

1. [[mesocosm/running-benchmarks|Run a platform benchmark]] and wait for completion
2. `mesocosm run get RUN_ID` — confirm status and scores
3. `mesocosm run export RUN_ID -o showcase/replay.json`
4. Review JSON locally; commit to GitHub if sharing with reviewers
5. Reference the file in your repo README or docs

## Replay JSON

The exact schema follows the bench API export format. Use `replay.example.json` from `mesocosm init` as a structural hint; always treat a real `run export` as the source of truth for your run.

For episode-level detail without a full export:

```bash
mesocosm run episodes RUN_ID --traces
```

## Visibility

When creating runs, you can set visibility for gallery features:

```bash
mesocosm run create ... --visibility gallery_public
```

See [[mesocosm/running-benchmarks|Running benchmarks]] for `run create` flags.

## Related

- [[mesocosm/running-benchmarks|Running benchmarks]]
- [[mesocosm/command-reference#mesocosm-run-export|Command reference — run export]]
- [[mesocosm/local-development|Local development]] — local runs do not produce showcase exports; export is for platform `RUN_ID`s
