# Vivekam — Project Documentation

Vivekam is a source-linked educational web application that adapts teachings
from Swami Vivekananda into modern, youth-oriented reel storyboards and
practical challenges. Its guiding flow is **ROOT → REEL → ACT**:

- **ROOT:** Start from a catalogue teaching with source and provenance details.
- **REEL:** Present the teaching through a modern scenario, interpretation, and
  takeaway.
- **ACT:** Suggest a practical 24-hour challenge.

This guide documents the implementation currently in this repository. Features
described as planned or limited below should not be presented as already
implemented.

## Contents

- [Project status and scope](#project-status-and-scope)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Configuration and Gemini](#configuration-and-gemini)
- [Application structure](#application-structure)
- [User-facing features](#user-facing-features)
- [Teaching matching and quote checks](#teaching-matching-and-quote-checks)
- [Reel generation and provenance](#reel-generation-and-provenance)
- [Reel studio, challenges, and exports](#reel-studio-challenges-and-exports)
- [Data and persistence](#data-and-persistence)
- [Server API](#server-api)
- [Limitations and known implementation gaps](#limitations-and-known-implementation-gaps)
- [Build and type checking](#build-and-type-checking)
- [Source catalogue and attribution](#source-catalogue-and-attribution)

## Project status and scope

The application is a React single-page web app served by an Express server.
The current reel output is an interactive storyboard with scenes, visual
assets, subtitles, and browser text-to-speech. Users can download a text script
and an SRT caption file.

The repository does **not** currently implement rendering or downloading a
finished MP4/video file. There is no sign-in, shared server-side user database,
payment/subscription flow, or admin authentication in this implementation.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4 with the Tailwind Vite plugin
- **Icons and motion dependencies:** `lucide-react`, `motion`
- **Backend:** Node.js, Express 4, TypeScript run through `tsx`
- **Optional text generation:** Google GenAI SDK (`@google/genai`)
- **Local persistence:** Browser `localStorage`
- **Narration:** Browser Web Speech API (`speechSynthesis`)

## Getting started

### Prerequisites

- Node.js and npm
- A modern browser for the Web Speech API narration feature

### Install and run locally

From the project root:

```powershell
npm install
npm run dev
```

The Express server starts on port `3000` by default and mounts Vite middleware
for development. Open `http://localhost:3000`.

Set `PORT` to use another server port. The development server does not use a
separate Vite frontend port because Vite runs in Express middleware mode.

### Production-style local run

Build the frontend, then start the Express server in production mode:

```powershell
npm run build
$env:NODE_ENV = "production"
npm start
```

The production server serves the generated `dist` directory. Set `PORT` if
port `3000` is not available.

## Configuration and Gemini

Gemini is optional. Without a key, the application can still generate a reel
using its deterministic local templates.

The backend calls `dotenv.config()`, which loads `.env` from the project root
by default. To enable Gemini locally, create a root `.env` file:

```dotenv
GEMINI_API_KEY=your_key_here
PORT=3000
```

Do not commit a real API key. The checked-in `.env.example` is a template and
its placeholder value is not a usable key. Some hosted environments, including
the AI Studio setup described by that template, may inject the secret at
runtime.

The Gemini client is created on the server, not in the browser. The configured
model identifier is currently specified in `server.ts`. If the key is missing,
the request fails, or the response cannot be parsed, the API falls back to the
deterministic generator.

## Application structure

```text
.
├── docs/
│   ├── project-documentation.md
│   ├── quote-attribution.md
│   └── vivekam-presentation.md
├── src/
│   ├── assets/
│   │   ├── assetPaths.ts
│   │   └── images/
│   ├── components/
│   │   ├── AboutView.tsx
│   │   ├── CreateReelFlow.tsx
│   │   ├── EmotionalEntryPoint.tsx
│   │   ├── FeatureStrip.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── MyReels.tsx
│   │   ├── Navbar.tsx
│   │   ├── ReelStudio.tsx
│   │   └── TeachingLibrary.tsx
│   ├── data/
│   │   └── teachings.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── reelGenerator.ts
│   │   └── semanticMatcher.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Important modules

- `src/App.tsx` owns page navigation and the main application state. It connects
  the create flow, studio, library, and saved reels.
- `src/data/teachings.ts` contains the built-in teaching catalogue, user-facing
  prompts, reel presets, and legacy teaching ID aliases.
- `src/utils/semanticMatcher.ts` detects simple concepts in a user's dilemma
  and ranks catalogue records.
- `src/utils/reelGenerator.ts` builds the seven-scene storyboard and attaches
  source/provenance and action-challenge metadata.
- `src/components/CreateReelFlow.tsx` implements the four-step creation flow
  and sends generation requests to the backend.
- `src/components/ReelStudio.tsx` previews scenes, narrates them using browser
  speech synthesis, tracks challenge feedback, and exports script/captions.
- `src/components/TeachingLibrary.tsx` searches and filters the catalogue and
  permits adding local, unverified teaching records.
- `server.ts` serves the frontend and exposes the quote-check and reel
  generation endpoints.

## User-facing features

### Home

The home page introduces the ROOT → REEL → ACT idea and offers entry points to
create a reel, explore the teaching library, and begin from a suggested
personal dilemma.

### Create a reel

The create flow provides four steps:

1. Enter a personal situation or choose a sample prompt/feeling.
2. Review up to three ranked teaching suggestions and select one.
3. Choose a story context: **campus**, **career**, or **everyday**.
4. Choose a language and a duration from 30 to 60 seconds, in five-second
   increments, then generate the reel plan.

The UI lists English, Hindi, Bengali, Tamil, Telugu, and Marathi. Actual
deterministic-language support is narrower; see
[Limitations and known implementation gaps](#limitations-and-known-implementation-gaps).

### Teaching library

Users can search catalogue entries by quote text, title, chapter, or tag and
filter by theme. Each card displays its source metadata and a link to the
record's `sourceUrl`.

The library also has an **Add Teaching** form. Added records are marked
unverified, stored in the current browser's local storage, and made available
for local reel creation. Adding a record is not a source review or verification
process.

### Reel studio

The studio presents an interactive scene sequence, source details, a
provenance/source view, a transcript, language controls, narration settings,
and action-challenge controls. Browser speech synthesis is used for narration
when available.

### My Reels

Generated reels are saved in the browser's local storage and can be reopened
or deleted. A first-run demonstration reel is seeded if there is no saved reel
record.

### About

The About page explains the product's source-grounding intent, its separation
of source material from creative interpretation, and its independence from
Ramakrishna Math, Belur Math, and Advaita Ashrama.

## Teaching matching and quote checks

### Personal dilemma matching

`analyzeUserDilemma()` is a deterministic keyword/concept matcher; it does not
call Gemini or use an embedding/vector search. It:

1. Lowercases and trims the input.
2. Detects concepts using substring checks for terms associated with failure,
   self-doubt, fearlessness, concentration, discipline, or service.
3. Adds confidence for failure/self-doubt cases, or uses fallback concepts if
   no keyword is detected.
4. Applies a special ranked list for common failure/self-doubt wording.
5. Otherwise scores catalogue records by simple text overlap and returns up to
   three matches.

Displayed match scores are heuristic UI values, not probabilities or calibrated
confidence scores.

### Custom quote check in the create flow

The create-flow quote tester searches the built-in verified catalogue locally.
A record can match when the normalized input:

- occurs within a teaching quotation;
- contains the opening 20 characters of a stored teaching; or
- contains one of the record's tags.

This is a lightweight lookup, not an exact quotation proof. A tag match may
identify a teaching even if the entered wording is not a quote. The interface
does not fetch or inspect the linked website during this check.

The backend also exposes `/api/verify-quote` with related substring, tag, and
title matching. The current create-flow handler performs its own local check;
it does not call that API endpoint.

## Reel generation and provenance

### Seven-scene structure

The deterministic generator creates these scenes:

1. Modern dilemma / hook
2. Relatable modern story
3. Teaching quotation
4. Interpretation for today
5. Core takeaway
6. 24-hour action challenge
7. Source card

The generator uses catalogue presets and local text templates, maps available
visual assets to scenes, computes scene timing, and builds the source passport,
challenge, and meaning-lock metadata.

The default duration is 45 seconds. The local browser fallback receives and
uses the selected duration, clamped to 30–60 seconds and rounded to a
five-second step.

### Optional Gemini augmentation

When the backend has `GEMINI_API_KEY`, `/api/generate-reel` asks Gemini for
creative hook/story/interpretation/takeaway/action wording based on the
selected built-in teaching. The deterministic generator still supplies the
scene structure, visual assets, and provenance. If Gemini is unavailable or
returns unusable output, the server returns a deterministic reel instead.

The key should remain server-side. AI output is requested to follow
source-grounding instructions, but the prompt is not equivalent to an
independent fact-check or scholarly review.

### Provenance

The reel data model distinguishes direct quotes, interpretations, fictional
modern stories, practical actions, and source citations. Each built-in
teaching record includes a source name, volume, chapter, URL, and status.
English is kept as the source wording in the catalogue; Hindi reel text is
identified as a translation in the relevant source/export context.

See [Quote attribution and source audit](./quote-attribution.md) for the
catalogue, links, attribution policy, and recorded audit scope.

## Reel studio, challenges, and exports

### Narration and playback

- Scene playback uses the browser's `speechSynthesis` API and attempts to pick
  a voice matching English or Hindi.
- If speech synthesis is unavailable or muted, playback advances using an
  estimated duration based on scene narration length.
- Voice selection and availability vary by browser and operating system.
- Narration is not rendered into a downloadable video or audio file.

### Challenges

Users can accept a generated challenge and mark it complete with a selected
feeling and optional reflection. The app updates the saved reel and increments
the local Viveka streak when submitted.

### Downloads

- **Script:** Plain text (`.txt`) containing source details and each scene's
  timing, visual caption, narration, and subtitle.
- **Captions:** SubRip (`.srt`) subtitles generated from the scenes' timing and
  subtitle text.

These exports are content assets; neither one is a rendered video.

## Data and persistence

### Built-in and user-added teachings

Built-in records and their presets live in `src/data/teachings.ts`. The current
catalogue contains 28 built-in records with legacy ID gaps; the gaps and alias
mapping are documented in the quote audit. User-added records are stored in
the browser under `vivekreel_custom_teachings` and are marked unverified.

### Local storage keys

| Key | Stored data |
| --- | --- |
| `vivekreel_saved_reels` | Saved reel objects, including challenge state |
| `vivekreel_custom_teachings` | User-added teaching records |
| `vivekreel_streak` | Viveka challenge streak counter |

This storage is specific to the browser profile and origin. Clearing browser
storage or switching browser/device loses access to that local data. There is
no server-side account sync or backup in the current project.

On loading saved reels, the app refreshes source-linked reel details from the
current teaching catalogue where possible. Legacy teaching IDs are resolved
using the alias map.

## Server API

The Express server defines the following JSON endpoints.

### `POST /api/verify-quote`

Request:

```json
{
  "quote": "A quote or phrase to search for"
}
```

- Missing or non-string `quote`: HTTP 400 with an error response.
- Match: JSON response with `status: "VERIFIED"`, the teaching record, a source
  citation, and a provenance badge.
- No match: JSON response with `status: "SOURCE_NOT_FOUND"` and an explanatory
  warning.

The endpoint checks built-in `VERIFIED_TEACHINGS` only. Its matching rules are
substring/tag/title checks, not external source verification.

### `POST /api/generate-reel`

Request fields used by the route:

```json
{
  "teachingId": "q04",
  "storyContext": "campus",
  "language": "en",
  "userProblem": "I need courage"
}
```

- `storyContext` defaults to `campus`.
- `language` defaults to `en`.
- Unknown `teachingId` values fall back to the first built-in teaching.
- Success returns `status: "success"`, a mode (`"gemini-augmented"` or
  `"deterministic-verified"`), and the generated `reel`.
- An unhandled server error returns HTTP 500 with an error message.

The create flow also sends `durationSeconds`, but the current server route does
not read that field. Therefore server-generated reels use the generator's
45-second default; the local frontend fallback uses the selected duration.
The route looks up teachings in the built-in catalogue, not the browser's
custom-teaching collection.

## Limitations and known implementation gaps

- **Storyboard, not video rendering:** no finished MP4 or video export is
  implemented.
- **Heuristic matching:** dilemma matching and quote checking use deterministic
  substring/tag logic, not AI semantic search or exact-source validation.
- **Gemini is optional:** reel generation works without an API key through
  local templates. With a key, Gemini augments selected text fields only.
- **Language coverage:** the UI offers six languages, but deterministic
  generation has explicit Hindi handling and otherwise uses English text.
  Studio switching is limited to English and Hindi. Some catalogue records
  include Hindi wording; the other language choices are not complete
  translations in the current generator.
- **Duration through API:** the backend currently ignores the requested
  duration and uses 45 seconds; the local fallback honors the selected value.
- **Custom teaching over API:** the server only resolves built-in teaching IDs.
  Custom records are handled in browser-side flows, not by server lookup.
- **No accounts or cloud sync:** reels, custom teachings, and streaks remain
  local to the browser.
- **No payment or business model implementation:** subscription and
  institutional revenue ideas belong to proposals, not the deployed code.
- **No automated tests are defined in `package.json`:** available checks are
  TypeScript validation and a production frontend build.
- **Source checking has limits:** source URLs and catalogue status are
  maintained as project data; quote matching does not fetch the source page at
  runtime. Consult the source audit and linked works for context.

## Build and type checking

Available npm scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express with Vite development middleware |
| `npm start` | Start the Express server |
| `npm run build` | Build frontend assets into `dist` |
| `npm run preview` | Run Vite's static preview server |
| `npm run lint` | Run `tsc --noEmit` (type-checking; no separate ESLint config) |

Recommended local checks:

```powershell
npm run lint
npm run build
```

## Source catalogue and attribution

The active catalogue entries, direct source URLs, quotation attribution
approach, and audit limitations are documented in
[Quote attribution and source audit](./quote-attribution.md). Review the
linked source passage and its context before publishing a quotation or
claiming scholarly verification.

Vivekam is an independent educational project; it does not imply institutional
endorsement by Ramakrishna Math, Belur Math, or Advaita Ashrama.
