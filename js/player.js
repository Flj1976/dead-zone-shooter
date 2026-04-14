// player.js — Player class

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.speed = 3.2;
    this.angle = 0;       // gun angle (toward mouse)
    this.hp = 5;
    this.maxHp = 5;
    this.dead = false;

    this.shootCooldown = 0;
    this.shootRate = 200; // ms between shots
    this.lastShotTime = 0;

    this.flashTimer = 0;  // white flash when hit
    this.invulnTimer = 0; // brief invulnerability after hit

    this.gunOffsetX = 14; // barrel pivot from center
  }

  update(keys, mouseX, mouseY, canvasW, canvasH, now) {
    // Movement
    let dx = 0, dy = 0;
    if (keys['ArrowLeft']  || keys['a']) dx -= 1;
    if (keys['ArrowRight'] || keys['d']) dx += 1;
    if (keys['ArrowUp']    || keys['w']) dy -= 1;
    if (keys['ArrowDown']  || keys['s']) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    this.x = Math.max(this.radius, Math.min(canvasW - this.radius, this.x + dx * this.speed));
    this.y = Math.max(this.radius, Math.min(canvasH - this.radius, this.y + dy * this.speed));

    // Aim gun at mouse
    this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);

    // Timers
    if (this.flashTimer > 0) this.flashTimer--;
    if (this.invulnTimer > 0) this.invulnTimer--;
  }

  tryShoot(now) {
    if (now - this.lastShotTime < this.shootRate) return null;
    this.lastShotTime = now;

    // Bullet spawns from tip of gun barrel
    const barrelLen = 26;
    const bx = this.x + Math.cos(this.angle) * (this.gunOffsetX + barrelLen);
    const by = this.y + Math.sin(this.angle) * (this.gunOffsetX + barrelLen);
    return new Bullet(bx, by, this.angle);
  }

  takeDamage(particles) {
    if (this.invulnTimer > 0) return;
    this.hp--;
    this.flashTimer = 10;
    this.invulnTimer = 60; // ~1s invulnerability
    particles.push(...spawnParticles(this.x, this.y, '#00e5ff', 8));
    if (this.hp <= 0) {
      this.dead = true;
      particles.push(...spawnParticles(this.x, this.y, '#00e5ff', 24));
    }
  }

  draw(ctx) {
    if (this.dead) return;
    drawPlayer(ctx, this.x, this.y, this.angle, this.flashTimer);
  }
}
