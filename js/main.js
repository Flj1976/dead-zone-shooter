// main.js — game loop, state machine, input handling

const STATES = {
  MAIN_MENU: 'MAIN_MENU',
  INTRO: 'INTRO',
  PLAYING: 'PLAYING',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// --- State ---
let state = STATES.MAIN_MENU;
let tick = 0;
let score = 0;

let player = null;
let enemies = [];
let bullets = [];
let particles = [];
let levelManager = new LevelManager();

// --- Input ---
const keys = {};
let mouseX = W / 2;
let mouseY = H / 2;
let mouseClicked = false;
let shootHeld = false;

window.addEventListener('keydown', e => {
  keys[e.key] = true;
  e.preventDefault && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  mouseX = (e.clientX - rect.left) * scaleX;
  mouseY = (e.clientY - rect.top) * scaleY;
});

canvas.addEventListener('mousedown', e => {
  if (e.button === 0) {
    mouseClicked = true;
    shootHeld = true;
  }
});
canvas.addEventListener('mouseup', e => {
  if (e.button === 0) shootHeld = false;
});

// --- Game init ---
function startGame() {
  score = 0;
  enemies = [];
  bullets = [];
  particles = [];
  player = new Player(W / 2, H / 2);
  levelManager.reset();
  levelManager.startLevel();
  tick = 0;
  state = STATES.INTRO;
}

function nextLevel() {
  enemies = [];
  bullets = [];
  levelManager.nextLevel();
  levelManager.startLevel();
  tick = 0;
  state = STATES.INTRO;
}

// --- Game loop ---
let lastTime = 0;

function loop(timestamp) {
  const dt = Math.min(timestamp - lastTime, 50); // cap at 50ms
  lastTime = timestamp;

  ctx.clearRect(0, 0, W, H);
  drawArena(ctx, W, H);

  tick++;

  switch (state) {
    case STATES.MAIN_MENU:
      updateMainMenu();
      break;
    case STATES.INTRO:
      updateIntro(dt);
      break;
    case STATES.PLAYING:
      updatePlaying(dt);
      break;
    case STATES.LEVEL_COMPLETE:
      updateLevelComplete();
      break;
    case STATES.GAME_OVER:
      updateGameOver();
      break;
    case STATES.VICTORY:
      updateVictory();
      break;
  }

  mouseClicked = false;
  requestAnimationFrame(loop);
}

// --- State handlers ---

function updateMainMenu() {
  drawMainMenu(ctx, W, H, tick);
  if (mouseClicked) startGame();
}

function updateIntro(dt) {
  // Show level intro banner for ~120 ticks (~2s), then switch to PLAYING
  drawLevelIntro(ctx, W, H, levelManager.currentLevel, tick);
  if (tick > 120) {
    state = STATES.PLAYING;
    tick = 0;
  }
}

function updatePlaying(dt) {
  const now = performance.now();

  // Update player
  player.update(keys, mouseX, mouseY, W, H, now);

  // Shooting (held or clicked)
  if (shootHeld || mouseClicked) {
    const bullet = player.tryShoot(now);
    if (bullet) bullets.push(bullet);
  }

  // Spawn enemies
  const newEnemy = levelManager.update(dt, W, H);
  if (newEnemy) enemies.push(newEnemy);

  // Update bullets
  for (const b of bullets) b.update(W, H);

  // Update enemies
  for (const e of enemies) e.update(player.x, player.y);

  // Bullet-enemy collisions
  for (const b of bullets) {
    if (b.dead) continue;
    for (const e of enemies) {
      if (e.dying || e.dead) continue;
      if (e.collidesWithBullet(b)) {
        b.dead = true;
        const killed = e.hit(particles);
        if (killed) {
          score += e.points;
          levelManager.onEnemyKilled();
        }
        break;
      }
    }
  }

  // Enemy-player collisions
  if (!player.dead) {
    for (const e of enemies) {
      if (e.dying || e.dead) continue;
      if (e.collidesWithPlayer(player)) {
        player.takeDamage(particles);
      }
    }
  }

  // Cleanup dead objects
  bullets  = bullets.filter(b => !b.dead);
  enemies  = enemies.filter(e => !e.dead);
  particles = particles.filter(p => !p.dead);

  // Update particles
  for (const p of particles) p.update();

  // Draw everything
  for (const e of enemies)   e.draw(ctx);
  for (const b of bullets)   b.draw(ctx);
  for (const p of particles) p.draw(ctx);
  if (!player.dead) player.draw(ctx);

  drawHUD(ctx, player, levelManager, score, W);

  // State transitions
  if (player.dead) {
    state = STATES.GAME_OVER;
    tick = 0;
  } else if (levelManager.isLevelComplete()) {
    if (levelManager.hasNextLevel()) {
      state = STATES.LEVEL_COMPLETE;
      tick = 0;
    } else {
      state = STATES.VICTORY;
      tick = 0;
    }
  }
}

function updateLevelComplete() {
  // Keep drawing any leftover particles
  for (const p of particles) { p.update(); p.draw(ctx); }
  particles = particles.filter(p => !p.dead);

  drawLevelComplete(ctx, W, H, levelManager.currentLevel.number, score, tick);
  if (mouseClicked) nextLevel();
}

function updateGameOver() {
  drawGameOver(ctx, W, H, score, tick);
  if (mouseClicked) startGame();
}

function updateVictory() {
  drawVictory(ctx, W, H, score, tick);
  if (mouseClicked) startGame();
}

// --- Kick off ---
requestAnimationFrame(loop);
