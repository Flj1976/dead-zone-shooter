// ui.js — menus, HUD, overlays

function drawHUD(ctx, player, levelManager, score, canvasW) {
  const padX = 16;
  const padY = 14;

  // --- HP bar (left) ---
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(padX - 4, padY - 4, 120, 28);

  ctx.font = '8px "Press Start 2P"';
  ctx.fillStyle = '#00e5ff';
  ctx.fillText('HP', padX, padY + 10);

  for (let i = 0; i < player.maxHp; i++) {
    const hpX = padX + 28 + i * 18;
    ctx.fillStyle = i < player.hp ? '#e53935' : '#333344';
    ctx.fillRect(hpX, padY, 14, 14);
    if (i < player.hp) {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(hpX + 2, padY + 2, 6, 4);
    }
  }

  // --- Level indicator (center) ---
  const lvlText = `LEVEL ${levelManager.currentLevel.number}`;
  ctx.font = '10px "Press Start 2P"';
  const tw = ctx.measureText(lvlText).width;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(canvasW / 2 - tw / 2 - 8, padY - 4, tw + 16, 24);
  ctx.fillStyle = '#ffe032';
  ctx.fillText(lvlText, canvasW / 2 - tw / 2, padY + 13);

  // --- Score (right) ---
  const scoreText = `${score}`;
  ctx.font = '8px "Press Start 2P"';
  const sw = ctx.measureText(scoreText).width;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(canvasW - sw - padX - 44, padY - 4, sw + 48, 28);
  ctx.fillStyle = '#aaaaaa';
  ctx.fillText('SCORE', canvasW - sw - padX - 38, padY + 10);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreText, canvasW - sw - padX + 2, padY + 10 + 14);

  // --- Enemy counter ---
  const remaining = levelManager.totalEnemies - levelManager.killedTotal;
  const remText = `x${remaining}`;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(canvasW / 2 + 60, padY - 4, 80, 24);
  ctx.fillStyle = '#e53935';
  ctx.fillText('ENMY', canvasW / 2 + 64, padY + 10);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(remText, canvasW / 2 + 110, padY + 10);
}

function drawMainMenu(ctx, canvasW, canvasH, tick) {
  // Dark overlay
  ctx.fillStyle = 'rgba(10, 10, 26, 0.92)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Title
  ctx.font = 'bold 32px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e53935';
  ctx.fillText('DEAD ZONE', canvasW / 2, canvasH / 2 - 110);
  ctx.font = '13px "Press Start 2P"';
  ctx.fillStyle = '#00e5ff';
  ctx.fillText('TOP-DOWN SHOOTER', canvasW / 2, canvasH / 2 - 72);

  // Blinking start prompt
  if (Math.floor(tick / 35) % 2 === 0) {
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#ffe032';
    ctx.fillText('CLICK TO START', canvasW / 2, canvasH / 2);
  }

  // Controls
  ctx.font = '7px "Press Start 2P"';
  ctx.fillStyle = '#888899';
  ctx.fillText('MOVE: ARROW KEYS    AIM: MOUSE    SHOOT: CLICK', canvasW / 2, canvasH / 2 + 50);

  // Flavor
  ctx.font = '6px "Press Start 2P"';
  ctx.fillStyle = '#444466';
  ctx.fillText('5 LEVELS  |  3 ENEMY TYPES  |  SURVIVE', canvasW / 2, canvasH / 2 + 80);

  ctx.textAlign = 'left';
}

function drawLevelComplete(ctx, canvasW, canvasH, levelNum, score, tick) {
  ctx.fillStyle = 'rgba(10, 10, 26, 0.88)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.textAlign = 'center';

  ctx.font = '22px "Press Start 2P"';
  ctx.fillStyle = '#ffe032';
  ctx.fillText(`LEVEL ${levelNum} CLEAR!`, canvasW / 2, canvasH / 2 - 70);

  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`SCORE: ${score}`, canvasW / 2, canvasH / 2 - 20);

  if (Math.floor(tick / 35) % 2 === 0) {
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('CLICK TO CONTINUE', canvasW / 2, canvasH / 2 + 40);
  }

  ctx.textAlign = 'left';
}

function drawGameOver(ctx, canvasW, canvasH, score, tick) {
  ctx.fillStyle = 'rgba(10, 10, 26, 0.92)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.textAlign = 'center';

  ctx.font = '30px "Press Start 2P"';
  ctx.fillStyle = '#e53935';
  ctx.fillText('GAME OVER', canvasW / 2, canvasH / 2 - 70);

  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`FINAL SCORE: ${score}`, canvasW / 2, canvasH / 2 - 20);

  if (Math.floor(tick / 35) % 2 === 0) {
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#ffe032';
    ctx.fillText('CLICK TO PLAY AGAIN', canvasW / 2, canvasH / 2 + 40);
  }

  ctx.textAlign = 'left';
}

function drawVictory(ctx, canvasW, canvasH, score, tick) {
  ctx.fillStyle = 'rgba(10, 10, 26, 0.92)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.textAlign = 'center';

  ctx.font = '28px "Press Start 2P"';
  ctx.fillStyle = '#ffe032';
  ctx.fillText('YOU WIN!', canvasW / 2, canvasH / 2 - 90);

  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#00e5ff';
  ctx.fillText('ALL 5 LEVELS CLEARED', canvasW / 2, canvasH / 2 - 45);

  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`FINAL SCORE: ${score}`, canvasW / 2, canvasH / 2);

  if (Math.floor(tick / 35) % 2 === 0) {
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#e53935';
    ctx.fillText('CLICK TO PLAY AGAIN', canvasW / 2, canvasH / 2 + 55);
  }

  ctx.textAlign = 'left';
}

function drawLevelIntro(ctx, canvasW, canvasH, level, tick) {
  const alpha = Math.min(1, Math.max(0, 1 - (tick - 90) / 30));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(10, 10, 26, 0.75)';
  ctx.fillRect(0, canvasH / 2 - 60, canvasW, 120);
  ctx.textAlign = 'center';
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = '#ffe032';
  ctx.fillText(level.title, canvasW / 2, canvasH / 2 - 10);
  ctx.font = '9px "Press Start 2P"';
  ctx.fillStyle = '#aaaacc';
  ctx.fillText(level.subtitle, canvasW / 2, canvasH / 2 + 22);
  ctx.textAlign = 'left';
  ctx.restore();
}
