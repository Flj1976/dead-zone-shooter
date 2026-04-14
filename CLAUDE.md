# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

Open `index.html` directly in a browser — no build step, no server, no dependencies. The Google Fonts CDN (`Press Start 2P`) requires an internet connection; without it the game still works but falls back to a system monospace font.

## Git workflow

After every meaningful change: commit with a descriptive message and push to `origin/main`.

```bash
git add <specific files>
git commit -m "short description of what and why"
git push
```

GitHub repo: https://github.com/Flj1976/dead-zone-shooter

## Architecture

All scripts are loaded as plain `<script>` tags in `index.html` in dependency order — **no modules**. Each file adds to the global scope and depends on functions/classes defined in previously loaded files:

```
sprites.js → bullet.js → player.js → enemy.js → level.js → ui.js → main.js
```

### Game loop and state machine (`js/main.js`)

Single `requestAnimationFrame` loop drives everything. The global `state` variable is one of `MAIN_MENU | INTRO | PLAYING | LEVEL_COMPLETE | GAME_OVER | VICTORY`. Each state has a corresponding `update*()` function that both updates and draws for that frame. `tick` is a frame counter that resets on state transitions; it's used for blinking effects and timed banners (e.g. intro shows for 120 ticks ≈ 2s). `dt` (milliseconds since last frame, capped at 50ms) is passed to anything time-sensitive; `performance.now()` is used for the shoot cooldown.

### Drawing (`js/sprites.js`, `js/ui.js`)

No image files — all visuals are drawn each frame with Canvas 2D API calls. `sprites.js` contains low-level draw functions (`drawPlayer`, `drawEnemy`, `drawBullet`, `drawArena`, `drawParticle`). `ui.js` contains screen-level functions (`drawHUD`, `drawMainMenu`, `drawLevelComplete`, `drawGameOver`, `drawVictory`, `drawLevelIntro`). Enemy shapes are type-specific: grunt = circle, runner = diamond, tank = large square.

### Enemy system (`js/enemy.js`)

`ENEMY_TYPES` object holds the stat config (radius, speed, hp, points, color) for the three types: `grunt`, `runner`, `tank`. `Enemy` instances read from this at construction. Adding a new enemy type means adding an entry to `ENEMY_TYPES`, a draw branch in `sprites.js:_draw*`, and referencing the type key in `level.js` wave definitions.

Runner AI uses a perpendicular zigzag: every ~30–50 frames `zigzagDir` flips, adding a sideways component to the normalized direction vector. Grunt and tank move straight toward the player.

### Level/wave system (`js/level.js`)

`LEVELS` array defines the 5 levels. Each level has `waves`, where each wave entry is `{ type, count, interval }` — `interval` is milliseconds between spawns for that batch. `LevelManager.startLevel()` flattens all wave entries into a flat `spawnQueue` of individual spawn jobs. On each `update(dt)` call it accumulates `dt` and pops one job when the timer exceeds its interval. Level complete is detected when `spawnQueue` is empty AND `killedTotal >= totalEnemies`.

### Collision detection (`js/main.js:updatePlaying`)

Simple circle-circle distance checks. Each frame: iterate bullets × enemies (O(n²), fine at this scale), then iterate enemies × player. Objects flag themselves `.dead = true`; arrays are filtered at the end of each frame. Enemies have a `.dying` phase (scale-shrink animation) before `.dead` is set, during which they don't participate in collisions.

### Player shooting (`js/player.js`)

`tryShoot(now)` returns a new `Bullet` or `null` based on a timestamp cooldown (`shootRate = 200ms`). Both `mouseClicked` (single frame flag) and `shootHeld` (held state) trigger `tryShoot` in the game loop, giving both tap and hold-to-fire behavior.

## Adding content

- **New enemy type:** add to `ENEMY_TYPES` in `enemy.js`, add a `_draw*` function in `sprites.js`, add cases in `drawEnemy` and `_drawHealthPips`, reference the key in `level.js` waves.
- **New level:** append an entry to the `LEVELS` array in `level.js`. No other changes needed.
- **New game state:** add the key to `STATES` in `main.js`, add an `update*()` handler, add a `case` in the `switch`, and add a draw function in `ui.js`.
