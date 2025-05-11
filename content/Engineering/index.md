---
title: Engineering @ SWECC
---

The Software Engineering Career Club has a lot of [software](https://github.com/swecc-uw/), and a great team behind it. The majority of our software is open source, and we encourage you to contribute! If you are looking for a place to start, check out [SWECC Labs](https://labs.swecc.org).

## SWECC Labs vs. Engineering @ SWECC

SWECC Labs is a program meant to help you gain skills and learn how to contribute to open source. Projects are designed to be easy to set up, with minimal dependencies on other projects in production. On the other hand, Engineering @ SWECC is an internal team of officers that maintain all of SWECC's software, among other things. This documentation will primarily be helpful if you're interested in contributing to repositories that aren't part of SWECC Labs, or if you're currently an officer on the Engineering team.

## Getting Started

### Setting up your development environment (Eng@SWECC)

#### Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Depending on what you'll be working on, you may need to install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and/or [Python](https://www.python.org/downloads/)

#### Clone the repositories

Create a directory to store all of your SWECC projects. For example, you can create a directory called `~/repos/swecc/`:

```bash
mkdir -p ~/repos/swecc/ && pushd ~/repos/swecc/
```

Then clone the repositories you want to work with. For example, here are some of our server-side projects:
```bash
# main server (usually required)
git clone https://github.com/swecc-uw/swecc-server.git

# deployment configs (optional, required if you're adding an env variable)
git clone https://github.com/swecc-uw/swecc-infra.git

# websocket server (optional)
git clone https://github.com/swecc-uw/swecc-sockets.git

# discord bot (optional)
git clone https://github.com/swecc-uw/swecc-bot.git

# mtrics server (optional)
git clone https://github.com/swecc-uw/swecc-chronos.git

# scheduler (optional)
git clone https://github.com/swecc-uw/swecc-scheduler.git
```

And here are a few of our client-side projects:
```bash
# https://swecc.org
git clone https://github.com/swecc-uw/swecc-website.git

# https://engagement.swecc.org
git clone https://github.com/swecc-uw/swecc-engagement.git

# https://labs.swecc.org
git clone https://github.com/swecc-uw/swecc-labs.git

# https://leaderboard.swecc.org
git clone https://github.com/swecc-uw/swecc-leaderboard.git

# https://interview.swecc.org
git clone https://github.com/swecc-uw/swecc-interview.git
```

#### Setting up the environment
For most, if not all of the python projects, you will need to set up a virtual environment
```bash
python3 -m venv venv
```

Now, add all the required environment variables to `venv/bin/activate` (or `venv/Scripts/activate` on Windows). You can find the required environment variables either in the repo's README (if not create an issue/submit a PR!), or centrally [here](https://github.com/swecc-uw/swecc-infra/blob/main/.github/workflows/sync-configs.yml). Export all of them in the `activate` file. For example, if you need to set up the `SWECC_API_KEY` environment variable, you can add the following line to the `activate` file:

```bash
# Linux/Mac
export SWECC_API_KEY=your_api_key_here
```
```ps1
# Windows
set SWECC_API_KEY=your_api_key_here
```

Then, activate the virtual environment:
```bash
source venv/bin/activate
```

If you plan on running code locally (not always supported), you will need to install the required dependencies. For most of the python projects, you can do this by running:
```bash
pip install -r requirements.txt
```

For most of the react projects, you will need to install the dependencies using npm:
```bash
npm install
```

#### Running the projects
Most backend projects can be run locally using docker-compose. For example, to run the main server in development mode (along with all dependencies), you can run:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

You can then verify by visiting `http://localhost/health` in your browser.