// level.js — wave/level definitions and spawn scheduler

const LEVELS = [
  {
    number: 1,
    title: 'LEVEL 1',
    subtitle: 'THEY COME FOR YOU',
    waves: [
      { type: 'grunt', count: 4, interval: 1400 },
      { type: 'grunt', count: 4, interval: 1200 },
    ],
  },
  {
    number: 2,
    title: 'LEVEL 2',
    subtitle: 'FASTER THREATS',
    waves: [
      { type: 'grunt',  count: 5, interval: 1200 },
      { type: 'runner', count: 4, interval: 1000 },
      { type: 'grunt',  count: 3, interval: 1000 },
    ],
  },
  {
    number: 3,
    title: 'LEVEL 3',
    subtitle: 'TANKS INCOMING',
    waves: [
      { type: 'grunt',  count: 5, interval: 1100 },
      { type: 'runner', count: 4, interval: 900  },
      { type: 'tank',   count: 2, interval: 1500 },
      { type: 'grunt',  count: 4, interval: 1000 },
      { type: 'runner', count: 3, interval: 900  },
    ],
  },
  {
    number: 4,
    title: 'LEVEL 4',
    subtitle: 'NO MERCY',
    waves: [
      { type: 'runner', count: 5, interval: 800  },
      { type: 'tank',   count: 3, interval: 1400 },
      { type: 'grunt',  count: 6, interval: 800  },
      { type: 'runner', count: 5, interval: 700  },
      { type: 'tank',   count: 2, interval: 1200 },
      { type: 'grunt',  count: 4, interval: 700  },
    ],
  },
  {
    number: 5,
    title: 'LEVEL 5',
    subtitle: 'FINAL STAND',
    waves: [
      { type: 'grunt',  count: 6, interval: 700  },
      { type: 'runner', count: 6, interval: 700  },
      { type: 'tank',   count: 4, interval: 1200 },
      { type: 'runner', count: 6, interval: 600  },
      { type: 'grunt',  count: 6, interval: 600  },
      { type: 'tank',   count: 4, interval: 1100 },
      { type: 'runner', count: 5, interval: 600  },
    ],
  },
];

class LevelManager {
  constructor() {
    this.levelIndex = 0;
    this.waveIndex = 0;
    this.spawnQueue = []; // {type, count, interval}
    this.spawnTimer = 0;
    this.spawnedTotal = 0;
    this.killedTotal = 0;
    this._ready = false;
  }

  get currentLevel() {
    return LEVELS[this.levelIndex];
  }

  get totalLevels() {
    return LEVELS.length;
  }

  startLevel() {
    const lvl = LEVELS[this.levelIndex];
    // Flatten all wave entries into a spawn queue
    this.spawnQueue = [];
    for (const wave of lvl.waves) {
      for (let i = 0; i < wave.count; i++) {
        this.spawnQueue.push({ type: wave.type, interval: wave.interval });
      }
    }
    this.waveIndex = 0;
    this.spawnTimer = 0;
    this.spawnedTotal = 0;
    this.killedTotal = 0;
    this._ready = true;
  }

  get totalEnemies() {
    const lvl = LEVELS[this.levelIndex];
    return lvl.waves.reduce((s, w) => s + w.count, 0);
  }

  onEnemyKilled() {
    this.killedTotal++;
  }

  isLevelComplete() {
    return this._ready &&
           this.spawnQueue.length === 0 &&
           this.killedTotal >= this.totalEnemies;
  }

  hasNextLevel() {
    return this.levelIndex < LEVELS.length - 1;
  }

  nextLevel() {
    this.levelIndex++;
    this._ready = false;
  }

  // Returns a new enemy to spawn, or null
  update(dt, canvasW, canvasH) {
    if (!this._ready || this.spawnQueue.length === 0) return null;

    this.spawnTimer += dt;
    const next = this.spawnQueue[0];
    if (this.spawnTimer >= next.interval) {
      this.spawnTimer = 0;
      this.spawnQueue.shift();
      this.spawnedTotal++;
      return spawnEnemyAtEdge(next.type, canvasW, canvasH);
    }
    return null;
  }

  reset() {
    this.levelIndex = 0;
    this._ready = false;
    this.spawnQueue = [];
    this.spawnedTotal = 0;
    this.killedTotal = 0;
  }
}
