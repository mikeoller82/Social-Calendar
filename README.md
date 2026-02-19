# Social Calendar (TrendPlanner Pro)

> An AI-powered social media planning workspace for discovering trends, building a content calendar, generating post copy, scheduling campaigns, and monitoring performance in one dashboard.

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-20232A?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-API-339933?logo=node.js&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1) Install Dependencies](#1-install-dependencies)
  - [2) Configure Environment Variables](#2-configure-environment-variables)
  - [3) Start the API Server](#3-start-the-api-server)
  - [4) Start the Frontend](#4-start-the-frontend)
- [How to Use the Application](#how-to-use-the-application)
  - [First Launch and Onboarding](#first-launch-and-onboarding)
  - [Dashboard](#dashboard)
  - [Trend Engine](#trend-engine)
  - [Content Calendar](#content-calendar)
  - [AI Generator](#ai-generator)
  - [Scheduling](#scheduling)
  - [Analytics](#analytics)
  - [Pricing & Settings](#pricing--settings)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Deployment Notes](#deployment-notes)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)

---

## Overview

**Social Calendar** is a single-page application built for creators, marketers, and teams who want to move from trend research to publish-ready content quickly.

The app combines:

- AI-assisted trend discovery
- Calendar planning workflows
- Platform-specific content generation
- Credit-based AI usage simulation
- Performance dashboards for strategy tuning

A lightweight Node.js API powers dynamic data generation using the OpenAI Responses API.

---

## Key Features

- **Guided onboarding flow** to personalize niche, audience, market, and tone.
- **Trend intelligence workspace** with topic scoring, growth, volume, and platform relevance.
- **30-day content calendar support** for planning and campaign pacing.
- **AI content generation** for multiple platforms (Instagram, TikTok, LinkedIn, X, YouTube).
- **A/B content variation toggle** for iterative post testing.
- **Credits model** to emulate usage limits and productized AI workflows.
- **Dark mode + responsive layout** for comfortable use across devices.
- **Unified side navigation** spanning Dashboard, Trends, Calendar, Generator, Scheduling, Analytics, Pricing, and Settings.

---

## Architecture

This project is split into two runtime pieces:

1. **Frontend (Vite + React + TypeScript)**
   - Renders the full product UI and state-driven workflows.
   - Calls backend endpoints through `src/lib/api.ts`.

2. **Backend (Node HTTP server)**
   - Exposes simple JSON endpoints for bootstrap data, trend research, and content generation.
   - Calls OpenAI Responses API and returns structured JSON for frontend consumption.

---

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide React icons
- Recharts (charts/analytics)

### Backend
- Node.js (native `http` server)
- OpenAI Responses API (`/v1/responses`)

---

## Getting Started

### Prerequisites

- **Node.js 18+** (Node 20+ recommended)
- **npm**
- **OpenAI API key** with access to the Responses API

### 1) Install Dependencies

```bash
npm install
```

### 2) Configure Environment Variables

Set the following variables in your shell before starting the server:

```bash
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_MODEL="gpt-5.2"   # optional; defaults to gpt-5.2
export PORT="8787"              # optional; defaults to 8787
```

> On Windows PowerShell:
>
> ```powershell
> $env:OPENAI_API_KEY="your_api_key_here"
> $env:OPENAI_MODEL="gpt-5.2"
> $env:PORT="8787"
> ```

### 3) Start the API Server

```bash
npm run server
```

The backend will run on `http://localhost:8787` by default.

### 4) Start the Frontend

In a second terminal:

```bash
npm run dev
```

Open the local Vite URL shown in your terminal (typically `http://localhost:5173`).

---

## How to Use the Application

### First Launch and Onboarding

1. Open the app in your browser.
2. Complete the onboarding modal:
   - Niche
   - Audience
   - Market
   - Brand tone
3. Finish setup to unlock the full workspace.
4. Your onboarding completion is stored in local storage (`tp_onboarded`).

### Dashboard

Use this page as your daily command center:

- Review high-level KPIs and trend snapshots.
- Monitor recent trend score changes.
- Inspect strategy mix and performance summaries.

### Trend Engine

Use Trend Engine to discover and refresh topic opportunities:

1. Select niche/audience/market/tone filters.
2. Run trend research.
3. Compare topics by score, growth, search volume, and platform alignment.
4. Shortlist ideas for calendar planning.

### Content Calendar

Use the calendar view to spread topics across a 30-day plan:

- Balance evergreen and short-term trends.
- Check publishing cadence and content distribution.
- Align themes with campaign windows.

### AI Generator

Generate platform-tailored copy in a few steps:

1. Pick a platform (Instagram, TikTok, LinkedIn, X, YouTube).
2. Enter your topic.
3. (Optional) Enable **A/B Variations**.
4. Click **Generate Content (5 credits)**.
5. Expand generated fields and copy them to clipboard.

### Scheduling

Manage execution readiness:

- Review upcoming content items.
- Track per-item status (e.g., draft/review/scheduled).
- Validate best posting times and day mapping.

### Analytics

Analyze outcomes across channels:

- Weekly trends
- Platform breakdowns
- Competitor and pillar-level insights
- Time-based engagement patterns

### Pricing & Settings

- **Pricing**: explore plan upgrade experience.
- **Settings**: control preferences like theme and workspace behavior.

---

## API Reference

Base URL (local): `http://localhost:8787`

### `GET /api/bootstrap`
Returns initial datasets used across the app, including:

- `trendingTopics`
- `sampleCalendar` (30 items)
- `analyticsData`
- `weeklyAnalytics`
- `platformBreakdown`
- `competitorData`
- `contentPillarData`
- `engagementByTime`
- `nicheOptions`, `audienceOptions`, `toneOptions`, `marketOptions`

### `POST /api/research`
Generates trend research topics.

**Request body (example):**

```json
{
  "niche": "SaaS",
  "audience": "Founders",
  "market": "US",
  "tone": "Educational"
}
```

### `POST /api/generate-content`
Creates structured social copy.

**Request body (example):**

```json
{
  "platform": "LinkedIn",
  "topic": "AI workflow automation",
  "tone": "Educational",
  "includeAB": true
}
```

---

## Available Scripts

- `npm run dev` – Start Vite development server.
- `npm run build` – Build production frontend assets.
- `npm run preview` – Preview production build locally.
- `npm run server` – Start local Node API server.

---

## Troubleshooting

- **500 errors from API endpoints**
  - Confirm `OPENAI_API_KEY` is set in the same shell session as `npm run server`.
- **Model output parse failures**
  - The backend expects pure JSON-like output from the model; retry request if malformed output occurs.
- **Empty onboarding option lists**
  - Ensure backend is running before frontend; options are loaded from `/api/bootstrap`.
- **CORS/local connection issues**
  - Keep frontend and API on localhost, and verify no port conflicts.

---

## Project Structure

```text
Social-Calendar/
├── server/
│   └── index.js              # Node API server + OpenAI integration
├── src/
│   ├── components/           # UI modules (dashboard, trends, calendar, etc.)
│   ├── hooks/                # Data bootstrap hook
│   ├── lib/                  # API client
│   ├── types/                # TypeScript interfaces
│   ├── App.tsx               # App shell + routing-by-state logic
│   └── main.tsx              # React entrypoint
├── index.html
├── package.json
└── README.md
```

---

## Deployment Notes

For production hosting:

1. Build frontend with `npm run build`.
2. Serve static assets from your preferred host.
3. Run the Node API server where environment variables are securely configured.
4. Restrict CORS and harden API handling before public deployment.

---

## Roadmap Ideas

- Team collaboration (roles/comments/approvals)
- Native integrations with social publishing APIs
- Persistent database for users/workspaces
- Auth and multi-tenant account support
- Webhooks and automated campaign triggers

---

## License

No license file is currently included. Add a `LICENSE` file if you want to define usage rights for this project.
