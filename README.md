<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/10273abf-7558-4676-b3ff-68b91448ecca

## Project documentation

See [Vivekam — Project Documentation](docs/project-documentation.md) for the
application overview, architecture, setup, features, data flow, API, persistence,
and implementation limitations.

The presentation-ready summary is in
[Vivekam — PPT Content](docs/vivekam-presentation.md).

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Optional: set `GEMINI_API_KEY` in a root `.env` file to enable Gemini
   augmentation. Reel generation also works without a key using local templates.
3. Run the app:
   `npm run dev`
4. Open `http://localhost:3000`.

## Quote attribution

Teaching records, direct source links, the quote-change log, and audit scope are
documented in [Quote attribution and source audit](docs/quote-attribution.md).
