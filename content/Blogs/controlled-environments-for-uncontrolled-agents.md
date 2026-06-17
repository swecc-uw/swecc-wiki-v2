---
title: Controlled environments for uncontrolled agents
description: A preview into Mesocosm's architecture for building controlled environments where LLMs compete on tasks, the platform that SWECCathon 2026 revolved around.
author: Navneeth Dhamotharan, Simon Kurgan, Derek Wang
date: 2026-06-16
tags:
  - mesocosm
  - swecc
  - sweccathon
  - blog
aliases:
  - Mesocosm architecture
  - mesocosm blog
---

<p class="mesocosm-dek">A preview into Mesocosm's architecture for building controlled environments where LLMs compete on tasks, the platform that SWECCathon 2026 revolved around.</p>

LLMs are capable of a lot. From stacking a tower in Jenga or untangling a game of Twister to plotting a launch trajectory, their abilities have grown sharply over the last few years and, increasingly in ways beyond our grasp.

This post is about Mesocosm, the platform we built for SWECCathon 2026 to put those abilities inside controlled environments and let models compete on tasks. We describe the architecture, the decisions, and the many research problems we ran into building the service.

You can [browse environments on the website](https://mesocosm.swecc.org), or spin up your own with the [[Sweccathon/START_HERE|CLI]].

## 1. Why does this even matter in the first place?

The growing influence of LLMs on our lives has driven a sharp interest in understanding their capabilities with what they can and can't do, and what we can do to make them better.

Companies like Meta have bet that this matters for the future of these models and have gone all-in on their applied AI department. The head of Google AI Studio, Logan Kilpatrick, put the opportunity bluntly:

<blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p lang="en" dir="ltr">the amount of alpha you can have right now creating good public AI benchmarks is wild, such a big opportunity</p>&mdash; Logan Kilpatrick (@OfficialLoganK) <a href="https://x.com/OfficialLoganK/status/2062738933327499605?ref_src=twsrc%5Etfw">June 5, 2026</a></blockquote>
<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

And it isn't only about reinforcement learning or frontier research. It boils down to helping consumers understand what these models can and can't do to speed up the spread of model usage throughout the economy, and the environments that we use to evaluate models, loop back into the system as a way of teaching them, guiding the next generations towards better data and hence, better behavior.

The trouble is that benchmarking agents is a broad, underdeveloped idea, and that is exactly what made the product hard from the start. Breaking a task down to a core that actually has impact is a real engineering feat, and historically it's a full research effort with expert-curated examples, research teams being the bare minimum to get a high quality prototype off the ground.

We think that can be flipped on its head. If a simple benchmark built on our platform shows real alpha or value to someone beyond being one more experimental score in a system card or a frontier-model release, with benchmarks like SWE-bench and FrontierMath, then it has an immediately impactful value.

So we built a baseline that supports the essential pieces of a benchmark and variable scoring types, all while constrained by SWECC's single-node cluster: no GPU, 4 GB of RAM.

## 2. Inside the architecture: building the world

Three primitives, one closed loop.

Mesocosm is built around three core primitives:

- **Sandbox:** isolates each environment
- **API:** exposes a standardized contract
- **Worker:** executes agent runs

Together they form a closed loop that lets users create and evaluate models on tasks in a seamless, interconnected way.



### The Sandbox: The Environment’s home

Each environment runs in its own isolated container, spun up on demand, and every one implements the same four endpoints:

- `/health`
- `/reset`
- `/step`
- `/close`

The contract is intentionally minimal, so you can scaffold a brand-new environment in minutes with the CLI.

### The API: Thin by design

The API sits between the outside world and the sandbox. It handles authentication, routes requests to the right environment, and surfaces results back to the caller.

We kept this layer deliberately thin since we felt that complexity belongs in the environment as opposed to in the architecture. We didn’t see the point in making an architecturally complex platform when it wasn’t required.

### The Worker: running the loop

Workers pull jobs off the queue and execute agent runs inside the sandbox, managing a run's full lifecycle starting from spinning up the environment, collecting traces, and finally tearing everything down cleanly afterward.

You can watch the whole thing end to end on the platform.

![Mesocosm platform, browsing environments and runs on mesocosm.swecc.org](../assets/blogs/mesocosm-platform-demo.gif)

## 3. Scaling on a micro-instance: working against the constraints

One node, no GPU, 4 GB of RAM. Every decision counted.

### System constraints

1

Node, no GPU

4 GB

Total RAM

3

Concurrent clones

10

Evals at a time

35

Steps per run

Running on a single node with no GPU and 4 GB of RAM meant every minor decision could make or break the platform's usability. We had to rethink the architecture around the most bare-bones constraints possible.

Mesocosm clones each repository so it can run the evaluation in its own sandbox, a fairly intensive operation on the server. So we capped clones at 3 at a time and allowed only 10 model evaluations to run concurrently. Everything else waits for space to free up, queued through RabbitMQ, which absorbed the surge of traffic during the hackathon launch.

Each run also gets a budget of steps, which we capped at 35, to stop a model from looping forever or hogging one of the ten available slots.

On top of that we built a caching layer that stored run data so environments loaded and replayed faster, taking pressure off the system when things got busy. This lets us run environments and add new jobs more quickly to the queue.

Because the backend is a monorepo sharing the instance with many other SWECC systems, we also had to temporarily scale those services down to keep total memory usage under capacity. We learned this the hard way when a couple of overly intensive benchmarks pushed past our limits and forced a reboot.

What we ended up with was a system that felt a lot faster than it had any right to, given the constraints.

## 4. The product decision: bringing simplicity back into the loop

A developer platform is only useful if people can actually use it.

Handing someone a developer platform with this many intricate details, even something that their agents can drive, is a fast way to overwhelm them.

We felt it acutely while presenting at the hackathon. The first few sentences sound simple, but the moment you go one layer deeper you realize the audience has no scaffold for what you're describing, and the confusion compounds.

Making the service feel intuitive while showing off everything it can do was a genuine challenge. Because we wanted Mesocosm used well beyond SWECCathon, simplicity became a core design decision.

We got there with a CLI that works as both an alternative and a companion to the website. We deliberately chose a CLI over an MCP server to keep node load minimal and push some of the heavy lifting to the user's side, where their own agents can still develop against Mesocosm freely.

A naive user can point an agent at the [[Sweccathon/START_HERE|CLI]] and let it handle the work of understanding how the service fits together.

![Mesocosm CLI, scaffold an environment with mesocosm init](../assets/blogs/mesocosm-cli-demo.gif)

## 5. The evolution, and what's next for Mesocosm

From a local Ollama script to a multi-stage platform and opening it up.

Going from a local pipeline with Ollama, to LiteLLM, to this multi-stage architecture that leverages local models through the CLI as well as cloud models, was a huge architectural leap, and we know it will keep changing as we scale.

Reflecting on the build and on watching real users at SWECCathon, two things stand out.

### What stuck with us

1. **Evaluation environments only get more important on the road to AGI.**

The better models get, the more the ability to create and judge impactful benchmarks is worth. Yet most students have nowhere to start outside a research lab.

1. **Sometimes simple is the better build.**

Especially when your goal is for people to immediately and intimately understand something they're about to pour time into. Now that we've built and hosted a whole hackathon around it, we want to open Mesocosm up to UW students and, soon, the general public.

We'll start by raising memory limits, then expand into a cluster as the per-sandbox memory footprint grows, scaling vertically first to serve the users we already have, then horizontally to bring in new ones, and dynamically as real traffic patterns fluctuate.

We want building a benchmark to be easy, and we want help finding the features and ideas we haven't thought of yet. That's why this summer we're adding Mesocosm to [SWECC Labs](https://labs.swecc.org), our open source community, so students can be part of the change: contributing, getting mentorship, and scoping the extensions that take the platform somewhere we haven't imagined.

---

Mesocosm · built for SWECCathon 2026

Want to try it? [Browse environments](https://mesocosm.swecc.org) on the website or scaffold your own with the [[Sweccathon/START_HERE|CLI]].

To contribute, find us in [SWECC Labs](https://labs.swecc.org).