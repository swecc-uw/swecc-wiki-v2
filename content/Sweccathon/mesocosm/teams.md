---
aliases:
  - teams
  - Teams
---

# Teams

Teams let multiple members share **developer environments** and **benchmark runs** under one `team_id`. Team commands require **member** authentication (`mesocosm auth login`).

## Concepts

| Term | Meaning |
| --- | --- |
| **Team** | A group with an owner, members, and a join code |
| **Active team** | Stored in your credentials as `active_team_id`; used by `env submit`, `env list`, and `run create` unless you override |
| **Solo** | No active team — resources are scoped to you alone |

Set or clear active team:

```bash
mesocosm team use TEAM_ID
mesocosm team clear
```

## Create a team

```bash
mesocosm team create --name "My bench team"
mesocosm team create --name "Lab" --use   # also set as active team
```

Output includes `team_id` and `join_code`.

## Join a team

```bash
mesocosm team join ABCD1234
```

`CODE` is the invite code (normalized to uppercase).

## List and inspect

```bash
mesocosm team list
mesocosm team show TEAM_ID
mesocosm team code show TEAM_ID      # includes join code
```

## Switch active team

```bash
mesocosm team use TEAM_ID
mesocosm team clear                  # back to solo default
```

`team use` updates credentials only (no API call).

## Team runs

```bash
mesocosm team runs TEAM_ID
```

Lists runs associated with that team.

## Invite code management

```bash
mesocosm team code regenerate TEAM_ID   # owner: rotate join code
```

## Membership management (owner)

```bash
mesocosm team members remove TEAM_ID --user-id 42
mesocosm team transfer TEAM_ID --user-id 99
mesocosm team delete TEAM_ID
```

```bash
mesocosm team leave TEAM_ID    # leave as a member
```

## How teams affect other commands

Many platform commands attach `team_id` from **active team** in credentials.

| Override | Effect |
| --- | --- |
| `mesocosm team use TEAM_ID` | Default team for submit/list/runs |
| `--team TEAM_ID` on command | Explicit team for that invocation |
| `--solo` | Force no team in the request |

Examples:

```bash
mesocosm env submit --name "Shared env" --github-url https://github.com/org/repo
# Uses active_team_id if set

mesocosm env submit ... --solo
mesocosm run create ... --team TEAM_ID
mesocosm run create ... --solo
```

See [[Sweccathon/mesocosm/submitting-environments|Submitting environments]] and [[Sweccathon/mesocosm/running-benchmarks|Running benchmarks]].

## Quick reference

| Command | Summary |
| --- | --- |
| `team create --name NAME [--use]` | Create team; optionally set active |
| `team join CODE` | Join with invite code |
| `team list` | List your teams |
| `team show TEAM_ID` | Team details (JSON) |
| `team use TEAM_ID` | Set active team |
| `team clear` | Clear active team |
| `team runs TEAM_ID` | List team runs |
| `team code show TEAM_ID` | Show team + join code |
| `team code regenerate TEAM_ID` | New join code (owner) |
| `team members remove TEAM_ID --user-id N` | Remove member (owner) |
| `team transfer TEAM_ID --user-id N` | Transfer ownership |
| `team leave TEAM_ID` | Leave team |
| `team delete TEAM_ID` | Delete team (owner) |

Full parameters: [[Sweccathon/mesocosm/command-reference#teams|Command reference — Teams]].

## Related

- [[Sweccathon/mesocosm/authentication|Authentication]]
- [[Sweccathon/mesocosm/command-reference|Command reference]]
