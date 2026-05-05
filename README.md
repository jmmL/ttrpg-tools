# ttrpg-tools

## Mothership Bounty Board

Retro-futuristic bounty board designed for portrait TV displays and GitHub Pages.

### Features
- 1980s CRT-inspired UI inspired by *Aliens* terminal aesthetics.
- Input jobs via pasted text/markdown or import `.md`/`.txt` files.
- Three display themes: green, orange, red.
- Toggle and tune screen effects: broken-screen glitch + dirt/wear.
- Portrait-first, large-screen layout with keyboard scrolling.
- Optional auto-scroll mode for unattended table display.
- Player lock mode and persisted settings via localStorage.

### Expected input format
Use blank lines between jobs:

```text
Job Name
- Bounty level 5 - 72kcr
- "Description text here"
```

### Local usage
Open `index.html` in a browser.

### GitHub Pages deployment
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Select your main branch and `/ (root)`.
5. Save.
