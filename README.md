# 🦇 Happy Birthday Radhika

A gothic, vampire-themed birthday experience for **Radhika** *(aka Vampika)* — built with [three.js](https://threejs.org/).

## ✨ What's inside
- **Blood moon** with pulsing halo
- **Bat flock** circling the night sky 🦇
- Three-tier **gothic cake** with flickering, light-casting candles 🩸
- Rising **ember / blood motes** + starfield
- **Click anywhere** → blood-burst + the bats scatter
- **Ambient gothic soundtrack** (pure WebAudio — no audio files)
- Animated **typewriter wishes** + "new wish" button
- Fully responsive (mobile + desktop)

## ▶️ Run locally
No build step. Just serve the folder over HTTP (ES modules need a server, not `file://`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 🚀 Deploy on GitHub Pages
1. Push these files to a GitHub repo (root must contain `index.html`).
2. Repo → **Settings → Pages**.
3. **Source:** `Deploy from a branch` → Branch: `main` → Folder: `/ (root)` → **Save**.
4. Wait ~1 min. Live at `https://<your-username>.github.io/<repo>/`.

> three.js loads from a CDN via import map — nothing to bundle. Works on Pages as-is.

## 🛠 Customize
- Name / wishes → top of [main.js](main.js) (`NAME`, `WISHES`).
- Colors → `:root` vars in [style.css](style.css).
