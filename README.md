# Ankit Gupta — Portfolio

An Angular 18 (SSR + prerendered) portfolio, pixel-matched to `design/portfolio-reference.html`,
plus a floating "Ask about Ankit" AI assistant backed by a small .NET 8 API proxy.

## Running it locally

```
npm install
npm run dev:all
```

`dev:all` starts the Angular dev server (`http://localhost:4200`) and the .NET API
(`http://localhost:5053` by default, see `server/Properties/launchSettings.json`) together.
You can also run them separately:

```
npm start            # Angular dev server only
npm run dev:api      # .NET API only (dotnet run --project server)
```

The API needs `server/.env` to exist (copy `server/.env.example` and fill in your provider's
`AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL` — see below). Without it, the API fails fast at
startup with a message naming the missing variable.

## How the AI assistant works

```
Browser (ChatWidgetComponent)
   │  fetch, SSE stream
   ▼
.NET 8 API  ── Redis (rate limiting, optional) ──┐
   │                                              │
   │  knowledge/ankit-profile.md (system prompt)  │
   ▼                                              │
Any OpenAI-compatible /chat/completions endpoint ◄┘
(Groq, OpenRouter, Ollama, Together, ...)
```

The widget never talks to the LLM provider directly — it only ever calls our own API. The
API holds the provider key, builds the system prompt from `server/knowledge/ankit-profile.md`
(the assistant's *only* source of facts about Ankit), and streams the answer back over SSE.
If `REDIS_URL` is set, per-visitor rate limiting is shared across instances via Redis; otherwise
it falls back to an in-memory limiter — no setup required either way.

### The three required variables

Set these in `server/.env` (never commit this file):

| Variable | Meaning |
|---|---|
| `AI_BASE_URL` | Base URL of an OpenAI-compatible API, e.g. `https://api.groq.com/openai/v1` |
| `AI_API_KEY` | API key for that provider |
| `AI_MODEL` | Model name as the provider expects it |

Optional: `AI_MAX_TOKENS` (400), `AI_TEMPERATURE` (0.3), `ALLOWED_ORIGINS`
(`http://localhost:4200`), `REDIS_URL`, `RATE_LIMIT_PER_HOUR` (15).

### Switching provider or model

Change the three variables in `server/.env` — no code changes needed. `server/.env.example`
has worked examples for Groq, OpenRouter and Ollama.

### Running with Docker (API + Redis)

```
docker compose up --build
```

Reads `server/.env` and starts the API on `http://localhost:5080` plus a Redis instance.

## Deploying

### The Angular site

**Vercel:** `vercel` in the project root (auto-detects the Angular SSR build), or connect the
repo in the dashboard with build command `npm run build` and output `dist/ankit-portfolio`.

**GitHub Pages:** the build prerenders a fully static site, so after `npm run build` run
`npx angular-cli-ghpages --dir=dist/ankit-portfolio/browser`.

Either way, set `src/environments/environment.ts`'s `apiUrl` to your deployed API's URL before
building for production.

### The API

Deploy `server/` as a container (it already has a multi-stage, non-root `Dockerfile`) to
**Render** or **Railway**:

1. Create a new Web Service from this repo, root directory `server/`, using its Dockerfile.
2. Set the environment variables `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` (and optionally
   `REDIS_URL`, `RATE_LIMIT_PER_HOUR`) in the platform's dashboard — never commit them.
3. Set `ALLOWED_ORIGINS` to your deployed site's origin, e.g. `https://ankitgupta.dev`.
4. Point the Angular app's `environment.ts` `apiUrl` at the resulting API URL and redeploy the
   frontend.

## Testing

```
dotnet test                     # 31 xUnit tests: PromptBuilder, validation, SSE parsing, rate limiting
npm run build                   # Angular production build
npm run test:visual             # Playwright: visual diff vs the reference, reduced-motion, keyboard nav
npx playwright test e2e/chat-widget.spec.ts   # chat widget screenshots + behavior
```

## Project layout

```
src/app/                  Angular app (standalone components, signals)
  data/portfolio.data.ts  all copy, links, projects, stack rows — components never hard-code content
  sections/                one folder per portfolio section
  shared/chat-widget/      the AI assistant widget + ChatService + safe markdown renderer
server/                   .NET 8 Minimal API — POST /api/chat, GET /api/health
server/knowledge/         ankit-profile.md — the assistant's only source of facts
server.Tests/             xUnit tests for the API
e2e/                      Playwright visual + behavior tests
design/                   portfolio-reference.html — the approved design, source of truth
```
