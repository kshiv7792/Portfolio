# Shiv Kumar Paswan — Interactive AI Portfolio

3 files, no build step — pure HTML/CSS/JS. It can be deployed directly to Vercel.

## What's Interactive

* **Boot screen** — An `"initializing..."` animation appears when the page loads.
* **Neural network background** — Animated nodes and connecting lines on a canvas that react to mouse movement.
* **Custom cursor** — A glowing ring cursor on desktop that expands when hovering over links and buttons.
* **Terminal hero** — Commands are typed out with a typewriter effect, displaying output in a continuous loop.
* **"Ask about me"** — A small scripted chat widget. Click a chip to get an AI-style typed response. Everything runs client-side with no backend/API.
* **Skill constellation** — Hover or tap on a skill category to view details, with the connected line highlighted.
* **Scroll-animated timeline** — The timeline progressively fills as you scroll through the section.
* **Filterable project grid** — Filter projects using category chips, and expand each project card to view additional details.
* **Magnetic buttons**, **scroll progress bar**, and **copy-to-clipboard contact buttons**.
* Everything respects **`prefers-reduced-motion`** — animations are disabled for users who prefer reduced motion.

## Files

* `index.html` — Structure and content
* `styles.css` — All styling
* `script.js` — All interactivity

## View Locally

Open `index.html` directly in your browser — it will work.

For the best experience, you can run it using a local server, as some browsers can be strict about `fetch` requests when using `file://`. However, this site does not use any external fetch requests, so opening it directly should normally work fine.

## Deploy to Vercel

### Option A — Using the CLI (Fastest)

Open a terminal inside this folder and run:

```bash
npm install -g vercel

vercel login

vercel
```

You will be asked a few questions. Press **Enter** to accept the default options.

Vercel will provide you with a live URL once the deployment is complete.

After making updates, deploy the production version with:

```bash
vercel --prod
```

### Option B — Using the Website

1. Go to [vercel.com](https://vercel.com?utm_source=chatgpt.com) and log in with GitHub.
2. Push this folder to a GitHub repository.
3. In the Vercel dashboard, go to **Add New Project** and import the repository.
4. Keep the Framework set to **Other**, then click **Deploy**.
5. Every new push to the repository will automatically trigger a new deployment.

## Customize

* **Colors/fonts** — Edit the CSS variables inside `:root { ... }` at the top of `styles.css`.
* **Terminal lines** — Edit the `termLines` array in `script.js`.
* **Ask-AI answers** — Edit the `QA` array in `script.js`. You can add or remove questions and answers.
* **Skills** — Edit the `skillData` array in `script.js`.
* **GitHub link** — In `index.html`, update the actual profile URL inside the `<a href="...">` for **"GitHub ↗"**.
* **Projects** — Edit the text, `data-tags` (used for filtering), and `.proj-more` (expanded details) inside each `.proj-card` in `index.html`.

If you want to tweak anything or add a new interactive section, just let me know.
