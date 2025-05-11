---
title: Cohort
author: Advay Patil
---


This Django app is used primarily to manage our cohort program, handling things like cohort assignment, statistics aggregation, and some administrative features (to name a few).

## Models

### Cohort

This holds information about a specific cohort.
| **Field** | **Type** | **Description** |
| -------------- | ----------------- | ----------------------------------------------------- |
| `members` | `ManyToMany` | Links users to cohorts |
| `name` | `CharField` | The name of the cohort. Must be unique | `max_length=255`, `unique=True` |
| `level` | `CharField` | Classification of the cohort. Either Beginner, Intermediate, or Advanced |
| `is_active` | `BooleanField` | Whether or not the cohort is currently active. A user should only be in one active cohort at a time. |

**Note**: To store statistics about a particular cohort, we use `CohortStatsData`, which includes the following fields:

- `appliations`
- `online_assessments`
- `interviews`
- `offers`
- `daily_checks`
- `streak`

## Routes

### GET `/cohort/`

- **Description**: Returns all cohorts
- **Permissions**: `IsAuthenticated`

### POST `/cohort`

- **Description**: Creates...
