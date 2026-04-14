// enemy.js — Enemy class + type configs

const ENEMY_TYPES = {
  grunt: {
    radius: 13,
    speed: 1.2,
    hp: 1,
    color: '#e53935',
    points: 10,
    particleColor: '#e53935',
  },
  runner: {
    radius: 10,
    speed: 2.6,
    hp: 1,
    color: '#ff6f00',
    points: 20,
    particleColor: '#ff6f00',
  },
  tank: {
    radius: 20,
    speed: 0.65,
    hp: 4,
    color: '#8b0000',
    points: 50,
    particleColor: '#8b0000',
  },
};

class Enemy {
  constructor(type, x, y) {
    const cfg = ENEMY_TYPES[type];
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = cfg.radius;
    this.speed = cfg.speed;
    this.hp = cfg.hp;
    this.maxHp = cfg.hp;
    this.points = cfg.points;
    this.particleColor = cfg.particleColor;

    this.dead = false;
    this.flashTimer = 0;

    // Death animation
    this.dying = false;
    this.deathTimer = 0;
    this.deathDuration = 18;
    this.scale = 1;

    // Runner zigzag
    this.zigzagAngle = 0;
    this.zigzagTimer = 0;
    this.zigzagDir = Math.random() < 0.5 ? 1 : -1;
  }

  update(playerX, playerY) {
    if (this.dying) {
      this.deathTimer++;
      this.scale = 1 - (this.deathTimer / this.deathDuration);
      if (this.deathTimer >= this.deathDuration) {
        this.dead = true;
      }
      return;
    }

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    if (this.type === 'runner') {
      this.zigzagTimer++;
      if (this.zigzagTimer > 30 + Math.random() * 20) {
        this.zigzagTimer = 0;
        this.zigzagDir *= -1;
      }
      // Perpendicular component for zigzag
      const perp = 0.6;
      this.x += (nx + ny * perp * this.zigzagDir) * this.speed;
      this.y += (ny - nx * perp * this.zigzagDir) * this.speed;
    } else {
      this.x += nx * this.speed;
      this.y += ny * this.speed;
    }

    if (this.flashTimer > 0) this.flashTimer--;
  }

  hit(particles) {
    this.hp--;
    this.flashTimer = 8;
    particles.push(...spawnParticles(this.x, this.y, this.particleColor, 5));
    if (this.hp <= 0) {
      this.dying = true;
      particles.push(...spawnParticles(this.x, this.y, this.particleColor, 16));
      return true; // killed
    }
    return false;
  }

  collidesWithPlayer(player) {
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < this.radius + player.radius - 4;
  }

  collidesWithBullet(bullet) {
    const dx = this.x - bullet.x;
    const dy = this.y - bullet.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < this.radius + bullet.radius;
  }

  draw(ctx) {
    drawEnemy(ctx, this);
  }
}

function spawnEnemyAtEdge(type, canvasW, canvasH) {
  const edge = Math.floor(Math.random() * 4);
  let x, y;
  const margin = 30;
  switch (edge) {
    case 0: x = Math.random() * canvasW; y = -margin; break;       // top
    case 1: x = canvasW + margin;        y = Math.random() * canvasH; break; // right
    case 2: x = Math.random() * canvasW; y = canvasH + margin; break; // bottom
    case 3: x = -margin;                 y = Math.random() * canvasH; break; // left
  }
  return new Enemy(type, x, y);
}
