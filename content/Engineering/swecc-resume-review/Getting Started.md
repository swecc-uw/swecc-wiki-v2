---
title: Getting Started
author: Advay Patil
---
In addition to [swecc-server](https://github.com/swecc-uw/swecc-server), make sure you have the following repositories cloned:
- [swecc-ai](https://github.com/swecc-uw/swecc-ai)
- [swecc-sockets](https://github.com/swecc-uw/swecc-sockets)
- [swecc-resume-review](https://github.com/swecc-uw/swecc-resume-review)

# Steps

## Running swecc-server
After activating your virtual environment, run
```bash
docker compose -f docker-compose.dev.yml up --build
```

## Running swecc-sockets

**Make sure you have the following environment variables set**:
```bash
export DB_NAME=...
export DB_NAME=...
export DB_PORT=...
export DB_USER=...
export DB_PASSWORD=...
export JWT_SECRET=...
```
**Note:** Your `JWT_SECRET` must be the same in `swecc-sockets` and `swecc-server`.

After activating your virtual environment, run the following:
```bash
docker compose -f docker-compose.yml up --build
```
## Running swecc-ai

**Make sure you have the following environment variables set:**
```bash
export GEMINI_API_KEY=...
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_BUCKET_NAME=...
```

After activating your virtual environment, run the following:
```bash
docker compose -f docker-compose.yml up --build
```

## Running swecc-resume-review
Install dependencies
```bash
npm install
```
Start the frontend
```bash
npm run dev
```
Go to http://localhost:5173 to view the application.