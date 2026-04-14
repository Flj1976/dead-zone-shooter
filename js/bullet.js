// bullet.js — Bullet and Particle classes

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 9;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.radius = 6;
    this.dead = false;
  }

  update(canvasW, canvasH) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20 || this.x > canvasW + 20 ||
        this.y < -20 || this.y > canvasH + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    drawBullet(ctx, this.x, this.y, this.angle);
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 4 + Math.random() * 6;
    const speed = 1.5 + Math.random() * 3.5;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.03 + Math.random() * 0.04;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.alpha -= this.decay;
    if (this.alpha <= 0) {
      this.alpha = 0;
      this.dead = true;
    }
  }

  draw(ctx) {
    drawParticle(ctx, this);
  }
}

function spawnParticles(x, y, color, count = 12) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
  return particles;
}
