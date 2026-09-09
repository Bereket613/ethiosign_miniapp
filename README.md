# EthioSign — Inclusive CTE Learning (Telegram Mini App)

An independent, accessible Telegram Mini App for the six CTE professional-development
modules. Built with React + Vite. Works standalone in any browser and inside Telegram.
The client's existing Elixir bot is not touched — later it can launch this same Mini App
through a Telegram Web App button.

---

## 1. Installation

```bash
cd ethiosign_miniapp
npm install
```

## 2. Run (development)

```bash
npm run dev
```

Open http://localhost:5173 in a browser. Production build:

```bash
npm run build
npm run preview
```

### Permanent deployment (GitHub Pages)

The live deployment URL: **https://bereket613.github.io/ethiosign_miniapp/**

To redeploy after changes:

```bash
npm run deploy:pages
```

This builds with the `/ethiosign_miniapp/` base and pushes the `dist/` folder to
the `gh-pages` branch. The site is permanent — no tunnels, no shutdowns.
(Requires the repo to be public on the free plan.)

## 3. Folder creation (only if rebuilding from scratch)

The `public/` media tree is created automatically by the placeholder script:

```bash
node scripts/generate-placeholders.mjs
```

It creates, for every lesson:

```
public/videos/modules/module-<N>/<section>/<lesson>.mp4   (original demo video)
public/videos/signs/module-<N>/<lesson>.mp4               (sign-language demo video)
public/captions/module-<N>/<lesson>.vtt                   (demo captions)
```

## 4. Environment (`.env.example`)

```
BOT_TOKEN=123456:ABC-your-token-from-BotFather
ETHIOSIGN_MINIAPP_URL=https://your-deployed-mini-app.example.com
```

Never commit `.env` (it is gitignored).

## 5. Adding real MP4 course videos

Each lesson in `src/data/modules.js` points at a stable path:

```
originalVideo: "/videos/modules/module-1/overview/wellbeing.mp4"
```

Replace the demo file at that path with the real course video (same filename) —
no React changes needed. If a lesson needs a new file name, update the
`originalVideo` field in `src/data/modules.js` only.

## 6. Adding sign-language videos

Sign-language videos are a separate media track:

```
signVideo: "/videos/signs/module-1/wellbeing.mp4"
```

Drop the Ethiopian Sign Language MP4 at that path (or update the field).
If the file is missing, the app shows a friendly
"Sign-language version coming soon." message and nothing breaks.

## 7. Adding WebVTT captions

Caption files live in `public/captions/module-<N>/<lesson-slug>.vtt`:

```
WEBVTT

00:00:00.000 --> 00:00:04.000
Teacher wellbeing is an important part of effective teaching.

00:00:04.000 --> 00:00:08.000
Teachers in crisis-affected settings face unique challenges.
```

Replace the demo `.vtt` at the lesson's `captions` path. If captions are missing,
the CC button is disabled and a "Captions coming soon" note is shown.

## 8. Testing in a normal browser

`npm run dev`, then open http://localhost:5173. The app detects that
`Telegram.WebApp` is unavailable and runs in normal browser/demo mode:
all screens, lessons, videos, captions, transcripts, and progress tracking work.

## 9. Testing inside Telegram

1. Deploy the app to a public HTTPS URL (Telegram requires HTTPS), e.g.:
   - any static host: `npm run build` then upload `dist/`
   - or a tunnel/dev expose tool for quick tests
2. Put the URL into `.env` as `ETHIOSIGN_MINIAPP_URL`.
3. Start the demo bot (section 10) and press **Open EthioSign** in your Telegram bot chat.

## 10. Connecting the independent demo bot

1. Create a bot with [@BotFather](https://t.me/BotFather) → `/newbot`.
2. Copy the token into `.env` as `BOT_TOKEN`.
3. Install and run:

```bash
pip install -r bot/requirements.txt
python bot/bot.py
```

`/start` replies with the welcome message and an **Open EthioSign** button
(a Telegram Web App button pointing at `ETHIOSIGN_MINIAPP_URL`).

## 11. Integrating into the client's Elixir bot later

The Mini App is fully decoupled. The Elixir bot only needs to send a button that
opens the deployed URL:

- **Reply/inline keyboard button** with `web_app` URL
  (in Telegram Bot API terms: `WebAppInfo(url)`), or
- a `web_app` button rendered by the Elixir bot framework (e.g. `Telegram.WebApp`
  button in ex_telegram libraries).

Recommended hardening when moving to the client's bot:

- Verify `Telegram.WebApp.initData` HMAC signature server-side (bot token check)
  and pass the validated user id to the backend.
- Replace localStorage progress with API calls (React → FastAPI/Phoenix → PostgreSQL).
  The progress logic is isolated in `src/progress.jsx`, so only that file changes.
- Serve the built `dist/` from the client's HTTPS domain and update the bot's
  `web_app` URL to it.
- Optionally pass Telegram `initDataUnsafe.user` to personalize the Home screen
  (already supported: `Home` reads `telegram.user.first_name`).

---

## Project structure

```
ethiosign_miniapp/
├── package.json
├── vite.config.js
├── index.html
├── .env / .env.example
├── bot/                 # independent Python aiogram demo bot
├── scripts/             # demo placeholder generator + templates
├── public/
│   ├── images/signs/    # sign phrase images
│   ├── videos/modules/  # original lesson videos (module-1..6)
│   ├── videos/signs/    # sign-language videos (module-1..6)
│   └── captions/        # WebVTT captions (module-1..6)
└── src/
    ├── main.jsx, App.jsx, index.css, telegram.js, progress.jsx
    ├── data/            # modules.js, phrases.js
    ├── components/      # Hero, ModuleCard, LessonCard, VideoPlayer,
    │                    # SignLanguagePlayer, ProgressBar, BottomNavigation, icons
    └── pages/           # Home, Courses, Module, Lesson, Learn
```
