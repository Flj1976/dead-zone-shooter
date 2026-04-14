// sprites.js — all canvas drawing functions (pixel-art style via Canvas 2D)

function drawPlayer(ctx, x, y, angle, flashTimer) {
  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(2, 4, 14, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Body (circle)
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  if (flashTimer > 0) {
    ctx.fillStyle = '#ffffff';
  } else {
    ctx.fillStyle = '#00e5ff';
  }
  ctx.fill();
  ctx.strokeStyle = '#006080';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Armor details (pixel stripes)
  ctx.fillStyle = '#006080';
  ctx.fillRect(-6, -3, 12, 2);
  ctx.fillRect(-6,  2, 12, 2);

  // Gun barrel (rotates with angle)
  ctx.rotate(angle);
  // Barrel
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(8, -4, 18, 8);
  // Muzzle
  ctx.fillStyle = '#707070';
  ctx.fillRect(24, -5, 6, 10);
  // Grip
  ctx.fillStyle = '#404040';
  ctx.fillRect(10, 4, 8, 6);

  ctx.restore();
}

function drawEnemy(ctx, enemy) {
  const { x, y, type, hp, maxHp, flashTimer, deathTimer, scale } = enemy;
  const s = scale !== undefined ? scale : 1;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  if (deathTimer > 0) {
    ctx.globalAlpha = Math.max(0, s); // fade as scale shrinks toward 0
  }

  if (type === 'grunt') {
    _drawGrunt(ctx, hp, maxHp, flashTimer);
  } else if (type === 'runner') {
    _drawRunner(ctx, hp, maxHp, flashTimer, enemy.zigzagAngle || 0);
  } else if (type === 'tank') {
    _drawTank(ctx, hp, maxHp, flashTimer);
  }

  ctx.restore();
}

function _drawGrunt(ctx, hp, maxHp, flashTimer) {
  // Shadow
  ctx.beginPath();
  ctx.ellipse(2, 5, 12, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();

  // Body circle
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fillStyle = flashTimer > 0 ? '#ffffff' : '#e53935';
  ctx.fill();
  ctx.strokeStyle = '#7f0000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Eye holes
  if (flashTimer <= 0) {
    ctx.fillStyle = '#7f0000';
    ctx.fillRect(-6, -4, 4, 4);
    ctx.fillRect(2, -4, 4, 4);
    // Mouth snarl
    ctx.fillRect(-5, 4, 10, 2);
    ctx.fillRect(-3, 6, 6, 2);
  }

  _drawHealthPips(ctx, hp, maxHp, 13);
}

function _drawRunner(ctx, hp, maxHp, flashTimer, zigzag) {
  // Shadow
  ctx.beginPath();
  ctx.ellipse(2, 5, 9, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // Diamond shape
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(10, 0);
  ctx.lineTo(0, 14);
  ctx.lineTo(-10, 0);
  ctx.closePath();
  ctx.fillStyle = flashTimer > 0 ? '#ffffff' : '#ff6f00';
  ctx.fill();
  ctx.strokeStyle = '#7f3000';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (flashTimer <= 0) {
    // Eye
    ctx.fillStyle = '#7f3000';
    ctx.fillRect(-3, -4, 6, 5);
  }

  _drawHealthPips(ctx, hp, maxHp, 14);
}

function _drawTank(ctx, hp, maxHp, flashTimer) {
  // Shadow
  ctx.beginPath();
  ctx.ellipse(3, 6, 20, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Body square (chunky)
  const s = 20;
  ctx.fillStyle = flashTimer > 0 ? '#ffffff' : '#8b0000';
  ctx.fillRect(-s, -s, s * 2, s * 2);
  ctx.strokeStyle = '#4a0000';
  ctx.lineWidth = 3;
  ctx.strokeRect(-s, -s, s * 2, s * 2);

  if (flashTimer <= 0) {
    // Armor plating lines
    ctx.fillStyle = '#4a0000';
    ctx.fillRect(-s, -2, s * 2, 4);
    ctx.fillRect(-2, -s, 4, s * 2);
    // Eyes (menacing squares)
    ctx.fillStyle = '#ff1a1a';
    ctx.fillRect(-12, -12, 7, 7);
    ctx.fillRect(5, -12, 7, 7);
    // Mouth
    ctx.fillStyle = '#ff1a1a';
    for (let i = -10; i <= 6; i += 4) {
      ctx.fillRect(i, 8, 3, 6);
    }
  }

  _drawHealthPips(ctx, hp, maxHp, 22);
}

function _drawHealthPips(ctx, hp, maxHp, radius) {
  const pipW = 6;
  const pipH = 4;
  const gap = 2;
  const total = maxHp;
  const totalW = total * (pipW + gap) - gap;
  const startX = -totalW / 2;
  const y = radius + 6;

  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i < hp ? '#4caf50' : '#333';
    ctx.fillRect(startX + i * (pipW + gap), y, pipW, pipH);
  }
}

function drawBullet(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Glow
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 230, 50, 0.25)';
  ctx.fill();
  // Core
  ctx.fillStyle = '#ffe032';
  ctx.fillRect(-6, -3, 12, 6);
  ctx.fillStyle = '#fff8a0';
  ctx.fillRect(-4, -1, 8, 2);
  ctx.restore();
}

function drawParticle(ctx, p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  ctx.restore();
}

function drawArena(ctx, w, h) {
  // Floor
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.06)';
  ctx.lineWidth = 1;
  const grid = 40;
  for (let x = 0; x < w; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Border
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  // Corner accents
  const corner = 20;
  ctx.lineWidth = 4;
  ['#e53935', '#e53935', '#e53935', '#e53935'].forEach((c, i) => {
    ctx.strokeStyle = c;
    const cx = i % 2 === 0 ? 2 : w - 2;
    const cy = i < 2 ? 2 : h - 2;
    const dx = i % 2 === 0 ? corner : -corner;
    const dy = i < 2 ? corner : -corner;
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy);
    ctx.stroke();
  });
}
