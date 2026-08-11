[![Magikolor banner](./icons/logo/use-this.png)](https://magikolor.app)

> **🌐 Read this in other languages:** [English](README.en.md) · [日本語](README.ja.md) · [Italiano](README.it.md) · [Español](README.md) · [Français](README.fr.md)

# 🎨 [Magikolor](https://magikolor.app)

Magikolor is a popular **free and open-source color palette generator** with a growing suite of side-tools for everything color-related: gradients, contrast checking, image palettes, brand colors, Pantone matching, CSS token extraction and more.

It is built with [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and TypeScript, uses [OpenAI](https://openai.com) to generate palettes from text prompts, and is fully translated into 5 languages.

> Magikolor gets around **~500k pageviews per month**, with **12K palettes generated daily**. You can view the [live website analytics here](https://plausible.io/magikolor.app).

---

## 📑 Table of Contents

- [✨ Features](#features)
- [🧰 Tools](#tools)
- [🛠️ Tech Stack](#tech-stack)
- [🏗️ Architecture: Nuxt Layers](#architecture-nuxt-layers)
- [🚀 Getting Started](#getting-started)
- [⚙️ Configuration & Environment Variables](#configuration--environment-variables)
- [🖥️ API](#api)
- [🧩 Color Renderer Worker (Docker)](#color-renderer-worker-docker)
- [🌐 Internationalization (i18n)](#internationalization-i18n)
- [🧪 Testing](#testing)
- [📜 Development Scripts](#development-scripts)
- [🗂️ Repository Layout](#repository-layout)
- [📚 Documentation](#documentation)
- [📄 License](#license)
- [🤝 Contributing](#contributing)
- [🙏 Acknowledgments](#acknowledgments)

---

## ✨ Features

- **AI palette generation** from any text prompt ("sunset", "retro 80s", a hex code, a mood…) — powered by OpenAI, with moderation checks and prompt safety.
- **18+ free color tools**, each with its own page (see [Tools](#tools)).
- **Public, free API** covering palettes, harmonies, Pantone, contrast, color names and more (see [API](#api)).
- **Client-side persistence**: favorites, recents, saved colors, gradients and image palettes are stored in the browser via [VueUse `useStorage`](https://vueuse.org/core/useStorage/) — no account required.
- **5 languages**: English, Japanese, Italian, Spanish and French via [@nuxtjs/i18n](https://i18n.nuxtjs.org/).
- **Perceptual color math**: palette harmonies run in **OKLCH** color space (port of `pro-color-harmonies`, verified 1:1 by a numeric parity harness).
- **Image-powered tools**: extract dominant colors from any image (server-side with `sharp`), search stock photos, and build mood palettes with draggable eyedroppers.
- **Accessibility tooling**: WCAG contrast checker with AA/AAA levels, smart suggestions and a color-blindness simulator (protanopia, deuteranopia, tritanopia, achromatopsia).
- **Ink-accurate reference data**: Pantone Solid Coated / Pastels & Neons / Metallics matching by Delta-E 2000, 14,394 named colors, and 910 brand palettes.
- **Dockerized renderer worker**: a Playwright-based service that analyzes *actually rendered* websites (used colors, real WCAG text contrast, screenshots, dark-mode detection).

---

## 🧰 Tools

Every tool is a standalone page. Links point to the live site; all of them also exist in development at `http://localhost:3005`.

### Core
| Tool | Route | What it does |
|---|---|---|
| 🎨 **Color Palette Generator** | [`/`](https://magikolor.app/) | Home page. Type a prompt (or pick a sample) and an AI generates a 5-color palette with name and tags. |
| 🔍 **Explore Color Palettes** | [`/palette/explore`](https://magikolor.app/palette/explore) | Browse all publicly generated palettes, filter by color, tone, style and season tags, load more / tag pages. |
| ⭐ **Favorites** | [`/favorites`](https://magikolor.app/favorites) | Your saved palettes, saved colors and image palettes, persisted in the browser. |
| 🕐 **Recent** | [`/recent`](https://magikolor.app/recent) | Palettes and colors you recently created, saved in your browser. |

### Generators & Editors
| Tool | Route | What it does |
|---|---|---|
| 🎛️ **Palette Maker** | [`/palette-maker`](https://magikolor.app/palette-maker) | Create custom palettes by hand: harmony mode, add/remove/lock colors, drag to reorder, undo/redo, tints & shades info, save to favorites. |
| 🧮 **Color Palette Creator** | [`/color-palette-creator`](https://magikolor.app/color-palette-creator) | Generate complete schemes from a single base color: 6 harmony types × 4 styles, creative modifiers, all in perceptual OKLCH space. Exports PNG/PDF/ASE. |
| 🌈 **Gradient Generator** | [`/gradient-generator`](https://magikolor.app/gradient-generator) | Linear / radial / conic CSS gradients with full stop control. Copy CSS, export Tailwind config or JSON, save gradients. |
| 📊 **Gradient Palette** | [`/gradient-palette`](https://magikolor.app/gradient-palette) | Interpolate a palette between two colors (2–10 steps). Copy HEX/CSS variables/gradient, export PNG/JSON/ASE, save to favorites. |
| 🎲 **Random Color Generator** | [`/random-color`](https://magikolor.app/random-color) | One click (or spacebar) for a fresh random color. |

### Color Reference & Analysis
| Tool | Route | What it does |
|---|---|---|
| 🗂️ **All Colors** | [`/all-colors`](https://magikolor.app/all-colors) | Pick any color and see it across every color model, generate tints & shades, and find the closest **Pantone** ink alternatives (ΔE 2000). |
| 🌈 **Explore Colors** | [`/explore/colors`](https://magikolor.app/explore/colors) | Browse thousands of named colors, search by name or hex, copy in one click. |
| 🏷️ **Brand Colors** | [`/brand-colors`](https://magikolor.app/brand-colors) | 910 well-known brand palettes (2,754 colors) with search, one-click copy and brand links. |
| 🧴 **Skin Tone Palette** | [`/skin-tone-palette`](https://magikolor.app/skin-tone-palette) | 48 skin-tone hex codes in 6 groups, from fair/porcelain to deep/rich, across cool/neutral/warm/golden/olive/red undertones. |
| 🔄 **Complementary Color** | [`/complementary-color`](https://magikolor.app/complementary-color) | The exact opposite of any color on the wheel (hue + 180°), with HEX, name and copy. |

### Image Tools
| Tool | Route | What it does |
|---|---|---|
| 🖼️ **Image Color Picker** | [`/image-color-picker`](https://magikolor.app/image-color-picker) | Upload an image (or paste a URL) and extract its dominant colors with AI-assisted ordering. Saved together with the image. |
| 🎭 **Mood Palette** | [`/mood-palette`](https://magikolor.app/mood-palette) | Build a palette from any image: draggable eyedroppers, manual or AI harmony refinement, stock photo search, exports (collage, PDF, color card). |

### Accessibility & Utilities
| Tool | Route | What it does |
|---|---|---|
| ☀️ **Contrast Checker** | [`/contrast-checker`](https://magikolor.app/contrast-checker) | WCAG contrast ratios with AA/AAA badges for normal/large text and UI components, vision simulator, smart accessible suggestions, PDF export. |
| 🧪 **Color Token Extractor** | [`/color-token-extractor`](https://magikolor.app/color-token-extractor) | Extract CSS color tokens from any website; optional *rendered* analysis (real used colors + WCAG text contrast + screenshot + dark mode) via the Docker renderer worker. Copy as JSON, CSS or Tailwind config. |
| 🎨 **Color Mixer** | [`/color-mixer`](https://magikolor.app/color-mixer) | Mix two colors in real time with a subtractive **RYB** paint model, plus HSL/RGB-linear variants and preset mixes. |

> More tools are a work in progress — the sidebar also lists upcoming ones (marked *Coming soon*).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (`3.13.2`) + Nitro server engine |
| Language | TypeScript (`5.6`), strict Vue SFCs |
| UI | [Nuxt UI](https://ui.nuxt.com) (`2.18.7`) + [Nuxt UI Pro](https://ui.nuxt.com/pro) (`1.4.4`), Tailwind CSS |
| State / data fetching | [@tanstack/vue-query](https://github.com/TanStack/query) (`5.56`) |
| Server validation | [@sinclair/typebox](https://github.com/sinclairzx81/typebox) + AJV; client forms with [yup](https://github.com/jquense/yup) |
| Database | [MongoDB](https://www.mongodb.com) via official `mongodb` driver (`6.9`) — Mongo 7.0 in Docker |
| AI | [OpenAI Node SDK](https://github.com/openai/openai-node) (`4.65`) |
| Image processing | [sharp](https://sharp.pixelplumbing.com) (`0.33`) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (`8.5`) |
| Analytics | [Plausible](https://plausible.io) via `@nuxtjs/plausible` |
| Fonts | Inter via `@nuxtjs/google-fonts` |
| Logging | [pino](https://getpino.io) + `pino-pretty` |
| Color picking | `@ckpack/vue-color` |
| HTTP (data scripts) | `got` |
| Utilities | `@vueuse/core`, `@apideck/better-ajv-errors`, `@types/twitter-text` |
| Linting | ESLint (`eslint-config-standard-with-typescript` + Vue plugin) |

> **Note**: `@nuxt/ui-pro` pulls icon packages from the private FontAwesome registry — the auth token is already configured in [`.npmrc`](./.npmrc).

---

## 🏗️ Architecture: Nuxt Layers

Magikolor is built on Nuxt's built-in **layer system**, which lets each domain of the app live in its own isolated directory under [`layers/`](./layers). Each layer brings its own `nuxt.config.ts`, pages, components, composables, utils, and (where needed) a Nitro server module.

### Server module pattern

Server-side, each layer that needs state exposes a **module factory** (e.g. [`palette.module.ts`](./layers/palette/server/palette.module.ts)) returning a small object with its services and repositories. These factories are wired together in the central setup utility [`layers/setup/server/utils/setup.util.ts`](./layers/setup/server/utils/setup.util.ts), which runs once on server boot (via the [`setup.plugin.ts`](./layers/setup/server/plugins/setup.plugin.ts) Nitro plugin):

1. A `pino` logger is created.
2. MongoDB connects (config from `MONGO_URL`).
3. Modules are instantiated with their dependencies injected (OpenAI → AI → Palette → OG; Feedback).
4. `palette.setup()` ensures indexes/collections exist.
5. The `modules` global becomes available to every API handler through `getModules()` — which throws a clean **503** if the server is still starting (e.g. Mongo was down at boot).

API handlers are plain Nitro route files in each layer, e.g. `layers/palette/server/api/palette/create.ts` → `POST /api/palette/create`.

### Layer reference

| Layer | Responsibility |
|---|---|
| `setup` | Server bootstrap: connects Mongo, wires all modules, exposes `getModules()`. |
| `mongo` | MongoDB client + connection string config. |
| `openai` | OpenAI client/service (the only provider today). |
| `ai` | Generic AI service: moderation checks + prompt execution. |
| `log` | `pino` logger configuration. |
| `common` | Shared components (nav, footer, lang switcher, empty states, color-blind simulator…), composables (`useFavorites`, `useNotifications`, `useModalV2`…), and pure color utils (converter, contrast, lang, samples). |
| `palette` | Core domain: palette entity/repository/service/validation, palette API, tags & filters, color arrangement, palette pages (`/palette/explore`, `/palette/[id]`). |
| `og` | OpenGraph PNG image generation for palettes and tag grids. |
| `feedback` | Contact/suggestion feedback persistence. |
| `plausible` | Analytics module wrapper. |
| `random-color` | Random color page + `/api/random-color`. |
| `contrast-checker` | Contrast tool: WCAG ratios, vision simulation, suggestions, accessible palettes + `/api/contrast-checker`. |
| `color-mixer` | RYB paint-mixer page + utils. |
| `all-colors` | All Colors page: color formats, tints/shades, Pantone dataset matching + `/api/pantone`, `/api/color-name`. |
| `color-palette-creator` | OKLCH harmony generator (port of `pro-color-harmonies`), palette export (PNG/PDF/ASE) + `/api/harmonies`. |
| `gradient-generator` | CSS gradient builder + exports + saved gradients. |
| `gradient-palette` | Two-color interpolation palettes + exports. |
| `palette-maker` | Manual palette editor with history + favorites integration. |
| `brand-colors` | Brand color dataset page. |
| `skin-tone-palette` | Skin tone reference page. |
| `complementary-color` | Complementary color page. |
| `image-color-picker` | Image upload/URL → dominant colors (`sharp`) + `/api/image-color-picker`, `/api/image-url`. |
| `mood-palette` | Image-to-palette studio: eyedroppers, stock search + `/api/stock-search`. |
| `color-token-extractor` | CSS token extraction (Phase 1) + rendered analysis proxy (Phase 2) + `/api/color-token-extractor`, `/api/color-token-extractor/runtime`. |
| `explore` | Explore pages: colors, gradients and image palettes. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (the renderer worker needs **Node 20+**; developed against 22)
- **Docker Desktop** (for MongoDB and the renderer worker)
- **npm** (the project uses npm — see `package-lock.json`)

### 1. Start the services

All of Magikolor's palettes are stored in MongoDB. The `compose.yml` starts **two** services:

```bash
docker compose up -d
```

| Service | Image / build | Port | Purpose |
|---|---|---|---|
| `database` | `mongo:7.0` | `27018:27017` | MongoDB. User `magikolor` / password `secret`, database `magikolor`. |
| `renderer` | `./workers/color-renderer` (Playwright) | `3100:3100` | Headless Chromium worker used by the Color Token Extractor's *rendered analysis* (optional — the rest of the app works without it). |

> The Mongo data lives in a Docker volume, so `docker compose up -d` after a `down` keeps your data. For more details see the [mongo layer](./layers/mongo/server/mongo.module.ts) and [`scripts/README.md`](./scripts/README.md).

### 2. Create `.env`

Create a `.env` file in the project root. The only variable required for the AI features is the OpenAI key:

```env
# Required only for AI palette creation (/api/palette/create, /api/palette/clone)
OPENAI_API_KEY=sk-...

# Optional — defaults shown
MONGO_URL=mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin
SITE_URL=http://localhost:3005
LOG_LEVEL=debug
RENDERER_URL=http://localhost:3100
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

The dev server runs on **`http://localhost:3005`**. A preflight script ([`scripts/check-dev-port.mjs`](./scripts/check-dev-port.mjs)) verifies the port is free before starting, so Nuxt never silently falls back to another port.

Other common commands:

```bash
npm run build        # production build (nuxt build)
npm run generate     # static generation (nuxt generate)
npm run preview      # preview the built app
npm run start        # serve the built output (node .output/server/index.mjs)
npm run typecheck    # nuxi typecheck (vue-tsc + tsc)
```

### 5. Seed the database (optional but recommended)

To populate the local database with the ~17.4k bundled palettes so `/palette/explore` has content:

```bash
node scripts/import-palettes.mjs   # loads colorpalettes.json (REPLACE mode; --keep to append)
node scripts/migrate-tags.mjs      # lowercases tags + Monochrome → monochromatic (idempotent)
```

See [Development Scripts](#development-scripts) for the full list.

---

## ⚙️ Configuration & Environment Variables

| Variable | Default | Used by | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | *(empty)* | `openai` layer | Required for AI palette generation (`/api/palette/create`, `/api/palette/clone`). Without it those endpoints return 401. |
| `MONGO_URL` | `mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin` | `mongo` layer | MongoDB connection string (matches the Docker Compose service). |
| `SITE_URL` | `http://localhost:3005` | root config | Public site URL; drives the public `apiUrl` (→ `{SITE_URL}/api`) and the i18n `baseUrl`. |
| `LOG_LEVEL` | `debug` | `log` layer | `pino` log level. |
| `RENDERER_URL` | `http://localhost:3100` | root config | URL of the color-renderer worker (Docker). |
| `PALETTE_COLLECTION_NAME` | `palettes` | `palette` layer | MongoDB collection for palettes. |
| `PALLETTE_AI_NAMES_START_DATE_MS` | `1729116912549` | `palette` layer | Timestamp used to distribute seeded palette `createdAt` dates. |
| `FEEDBACK_COLLECTION_NAME` | `feedback` | `feedback` layer | MongoDB collection for feedback. |
| `UNSPLASH_ACCESS_KEY` | *(empty)* | `mood-palette` | Unsplash API key for stock photo search (falls back to sample images). |
| `PEXELS_API_KEY` | *(empty)* | `mood-palette` | Pexels API key (optional provider). |
| `PIXABAY_API_KEY` | *(empty)* | `mood-palette` | Pixabay API key (optional provider). |
| `PORT` | — | Nuxt/Nitro | Listen port for `npm start` / `npm run preview` / bare `nuxt dev`. **Note**: the `dev` script hardcodes `--port 3005` and the CLI flag wins, so `PORT` does not affect `npm run dev`. |

### Renderer worker environment (in `compose.yml`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3100` | HTTP port the worker listens on. |
| `MAX_CONCURRENCY` | `3` | Max simultaneous render jobs. |
| `JOB_TIMEOUT_MS` | `20000` | Per-job timeout (20 s). |
| `CACHE_TTL_MS` | `3600000` | Result cache TTL (1 h, LRU of 200 URLs). |
| `SCREENSHOT_CACHE_MAX` | `50` | Max cached screenshots (separate small LRU). |

---

## 🖥️ API

Magikolor ships a **free, public API** with no authentication (locally). All endpoints return JSON unless noted. Request bodies are validated at runtime with `@sinclair/typebox` (schemas live in each layer's `server/dtos/`).

> ⚠️ **Please note**: the public API may be removed or changed at any time, without warning. Use at your own risk.

### Endpoint overview

| Method | Route | Description | Needs AI? |
|---|---|---|---|
| `GET` | `/api/palette/{id}` | Fetch a palette by MongoDB id | — |
| `POST` | `/api/palette/list` | Paginated palette list (optional tag filter) | — |
| `POST` | `/api/palette/create` | Generate an AI palette from a text prompt | ✅ |
| `POST` | `/api/palette/clone` | Clone a palette with new colors | ✅ |
| `GET` | `/api/palette/count` | Palettes created in the last 24 h (cached 5 min) | — |
| `GET` | `/api/og/get` | OpenGraph PNG of a palette | — |
| `GET` | `/api/og/tag` | OpenGraph PNG grid of a tag | — |
| `POST` | `/api/feedback/create` | Submit feedback | — |
| `GET` | `/api/random-color` | Random color (HEX + RGB) | — |
| `GET` | `/api/contrast-checker` | WCAG contrast ratio between two colors | — |
| `GET` | `/api/color-mixer` | Mix two colors (HSL + linear RGB) | — |
| `POST` | `/api/image-color-picker` | Extract dominant colors from a base64 image (`sharp`) | — |
| `GET` | `/api/image-url` | Image URL → base64 data URL proxy (SSRF-guarded) | — |
| `GET` | `/api/harmonies` | OKLCH harmony palette generation (1:1 with Color Palette Creator) | — |
| `GET` | `/api/pantone` | Pantone dataset lookup: by hex (ΔE 2000), code or search | — |
| `GET` | `/api/color-name` | Closest color name from the 14,394-name dictionary | — |
| `POST` | `/api/color-token-extractor` | Extract CSS color tokens from a website (Phase 1) | — |
| `POST` | `/api/color-token-extractor/runtime` | Rendered-page analysis: used palette, WCAG text contrast, screenshot, dark mode (Phase 2 — requires the Docker renderer worker) | — |
| `GET` | `/api/stock-search` | Stock photo search (Unsplash/Pexels/Pixabay) | — |

### Documentation & examples

- **Interactive reference**: the `/api` page of the running app lists every endpoint with its parameters.
- **Full technical reference** (request/response shapes, WCAG thresholds, error codes, PowerShell examples): see [`docs/API.md`](./docs/API.md).

---

## 🧩 Color Renderer Worker (Docker)

The **Color Token Extractor** has two phases:

1. **Phase 1** — parses the site's CSS server-side for declared color custom properties (works standalone).
2. **Phase 2 (runtime)** — a separate Docker service ([`workers/color-renderer/`](./workers/color-renderer)) loads the page in **headless Chromium (Playwright)**, waits for JS, and reports:
   - the colors **actually rendered** (`getComputedStyle`) with usage share,
   - **real WCAG text contrast** computed against the *effective* background,
   - an optional **screenshot** (JPEG, ~56 KB base64),
   - **dark-mode detection** via two renders (`light` + `dark`).

Architecture highlights: a single browser instance with one isolated `BrowserContext` per job, a semaphore (max 3 concurrent jobs, queued), a 20 s per-job timeout, and an in-memory LRU cache (200 URLs / 1 h TTL). If the worker is offline, the `/runtime` endpoint returns 502 and the tool gracefully degrades to Phase 1.

The worker is intentionally **isolated** from the main app — a Chromium crash can never take down the site, and its heavy image (~3.3 GB) doesn't pollute the main Docker image. Full technical report (architecture, pool, cache, SSRF guards, measured metrics, known limitations): [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md).

---

## 🌐 Internationalization (i18n)

The site is fully translated into 5 locales:

| Code | Language | Flag |
|---|---|---|
| `en` | English | 🇬🇧 (default) |
| `ja` | Japanese | 🇯🇵 |
| `it` | Italian | 🇮🇹 |
| `es` | Spanish | 🇪🇸 |
| `fr` | French | 🇫🇷 |

- Strategy: `prefix_except_default` — English at `/`, the rest at `/ja`, `/it`, `/es`, `/fr`.
- All translations live in a single file: [`i18n.config.ts`](./i18n.config.ts).
- Locale switching is URL-based (prefix strategy) via the `CommonLangSwitcher` component.
- **CI-enforced parity**: [`scripts/check-i18n-keys.mjs`](./scripts/check-i18n-keys.mjs) asserts every locale has exactly the same key set as `en` (run as `npm run test:i18n`).

---

## 🧪 Testing

The project has no framework-based test runner; tests are purpose-built Node scripts executed with Node's native type-stripping (`--experimental-strip-types`).

```bash
npm test   # runs everything below
```

| Command | What it verifies |
|---|---|
| `npm run test:parity` | Numeric parity of the OKLCH palette generator vs the original `pro-color-harmonies` v0.11.0 library (component-by-component `l, c, h`, tolerance 0.0005, across 2,424 combinations). Reference copy lives in [`layers/color-palette-creator/utils/__tests__/reference/`](./layers/color-palette-creator/utils/__tests__/reference/). |
| `npm run test:unit` | Pure color utilities: canonical converter, WCAG contrast, RYB mixing, gradient builders, color formats, Pantone matcher, color-blindness simulation. |
| `npm run test:i18n` | Locale key parity across the 5 languages (see above). |
| `npm run test:favorites` | `useFavorites` persistence pattern (VueUse `useStorage`). |
| `npm run test:image-palettes` | `useImagePalettes` composable (palettes saved together with images). |
| `npm run test:token-extractor` | CSS Color 4 parser + design-token extractor (Phase 1). |
| `npm run test:renderer` | Pure logic of the renderer worker (`workers/color-renderer/lib.mjs`). |

Plus:

- `npm run typecheck` — full TypeScript + Vue type checking (`nuxi typecheck`).
- ESLint is configured (`eslint-config-standard-with-typescript` + Vue plugin) but has no dedicated npm script yet.

---

## 📜 Development Scripts

Utility scripts under [`scripts/`](./scripts/) for data seeding, migrations and tooling. Most are idempotent (safe to run twice). Full details: [`scripts/README.md`](./scripts/README.md).

| Script | Purpose |
|---|---|
| `scripts/import-palettes.mjs` | Imports the ~17.4k bundled palettes from `colorpalettes.json` into `db.palettes` (REPLACE by default; `--keep` to append, `--dry-run` to validate only). |
| `scripts/migrate-tags.mjs` | Migrates existing docs to the current filter system: lowercases tags, `Monochrome` → `monochromatic`. |
| `scripts/rename-db.mjs` | Migrates a local database from the old names (`colormagic`/`magicolor`) to `magikolor`. `--dry-run` to preview, `--drop-old-user` to clean legacy users. |
| `scripts/generate-color-names.mjs` | Builds `layers/palette/utils/color-names-data.json` (14,394 names) from `colordatabase.json` + the legacy NTC dataset. |
| `scripts/import-brand-colors.mjs` | Consolidates the 910-brand dataset into `layers/brand-colors/utils/brand-colors-data.json` (source: pickcoloronline/brands, ISC license). |
| `scripts/acb-to-json.mjs` | Decodes Adobe Color Book (`.acb`) files to JSON (used for Pantone Metallics). |
| `scripts/check-dev-port.mjs` | Preflight that port 3005 is free before `npm run dev` (see [Getting Started](#getting-started)). |
| `scripts/check-i18n-keys.mjs` | i18n key parity check (also wired as `test:i18n`). |
| `scripts/unit-tests.mjs` | Unit test harness for pure color utilities (also `test:unit`). |

---

## 🗂️ Repository Layout

```
.
├── assets/                  # Global CSS (typography, app-wide styles)
├── icons/                   # Logo + animated favicon assets
├── i18n.config.ts           # All translations (en/ja/it/es/fr)
├── layers/                  # Nuxt layers — one per domain (see Architecture)
├── layouts/                 # App layout (default.vue)
├── pages/                   # Root pages: home, api, favorites, recent, privacy, terms
├── plugins/                 # Vue Query (TanStack) plugin
├── public/                  # Static assets (favicons, manifest)
├── scripts/                 # Data seeding, migrations and test scripts
├── tests/                   # Test fixtures (Pantone Metallics ACB output)
├── workers/color-renderer/  # Playwright renderer worker (Docker service)
├── app.config.ts            # Nuxt UI app config (primary color, buttons)
├── compose.yml              # MongoDB + renderer worker services
├── nuxt.config.ts           # Main Nuxt configuration
├── tailwind.config.ts       # Tailwind theme (colors, shadows, aspect ratios)
├── databases/               # Local datasets: seed palettes, colors and Pantone reference
```

### Bundled datasets

| Dataset | Location | Size |
|---|---|---|
| Palettes (seed) | `databases/colorpalettes.json` | ~17,390 palettes |
| Color names dictionary | `layers/palette/utils/color-names-data.json` | 14,394 names |
| Pantone guides | `layers/all-colors/utils/pantone-data.json` | 3,219 samples (Solid Coated, Pastels & Neons, Metallics) |
| Brand colors | `layers/brand-colors/utils/brand-colors-data.json` | 910 brands / 2,754 colors |

---

## 📚 Documentation

The [`docs/`](./docs) folder contains in-depth technical documents:

| Document | Content |
|---|---|
| [`docs/API.md`](./docs/API.md) | Full API reference: every endpoint, DTOs, WCAG thresholds, error codes, examples. |
| [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md) | Technical report of the Playwright renderer worker (architecture, pool, cache, SSRF guards, metrics, limitations, roadmap). |
| [`docs/design-audit.md`](./docs/design-audit.md) | Design consistency audit across pages (typography, headers, empty states). |
| [`docs/palette-parity-report.md`](./docs/palette-parity-report.md) | Numerical parity report of the OKLCH generator vs `pro-color-harmonies`. |
| [`docs/informe-pro-color-harmonies-DEFINITIVO.md`](./docs/informe-pro-color-harmonies-DEFINITIVO.md) | Deep-dive into the full logic of `pro-color-harmonies` (the generator's reference implementation). |
| [`docs/palette-parity-code-diff.diff`](./docs/palette-parity-code-diff.diff) | Line-by-line diff between the old and the parity-verified generator implementation. |

---

## 🤝 Contributing

Contributions are welcome! Good entry points:

- **Suggest a fix or new tool**: use the in-app suggestion form (sidebar → *Suggest an Idea*) or open an issue.
- **Add a tool**: create a new Nuxt layer under `layers/` following the existing pattern (page + components + utils + optional API + i18n keys in all 5 locales).
- **Add a translation**: keep the key set identical to `en` — `npm run test:i18n` will verify.
- **Follow the conventions**: run `npm run typecheck` and `npm test` before submitting.

---

## 📄 License

Magikolor is released under the [MIT License](./LICENSE).

---

## 🙏 Acknowledgments

- **OpenAI** — powers AI palette generation.
- **`pro-color-harmonies`** (meodai, MIT) — reference implementation of the OKLCH harmony generator.
- **`dembrandt`** (MIT) — conceptual basis for the CSS token extractor.
- **pickcoloronline/brands** (ISC) — brand color dataset.
- **Name that Color (NTC)** — basis of the color-name dictionary.
- **Pantone** — *All Colors* uses Pantone guide data; references are approximate visual estimates (ΔE 2000) and are not affiliated with or endorsed by Pantone LLC.

Made with ❤️ for the color community.
