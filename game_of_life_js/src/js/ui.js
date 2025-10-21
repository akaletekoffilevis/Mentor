// ========================================= //
//   INTERFACE UTILISATEUR :: JEU DE LA VIE //
// ======================================== //

import { Grid } from "./core.js";
import { CONFIG, validateSpeed } from "./utils.js";

//Les Constantes
const startBtn = document.getElementById("start");
const stepBtn = document.getElementById("step");
const randomBtn = document.getElementById("random");
const resetBtn = document.getElementById("reset");
const nbgeneration = document.querySelector(".generation");
const speedInput = document.getElementById("speed");
const canvas = document.getElementById("gameCanvas");

// Jeu principal (utilise requestAnimationFrame et rendu partiel)
export class GameOfLife {
  constructor({
    size = CONFIG.GRID_SIZE,
    cellSize = CONFIG.CELL_SIZE,
    speed = CONFIG.DEFAULT_SPEED,
    canvasEl = canvas,
  } = {}) {
    this.grid = new Grid(size);
    this.renderer = new CanvasRenderer(canvasEl, size, cellSize);
    this.generation = 0;
    this.isRunning = false;
    this.speed = validateSpeed(speed);
    this.rafId = null;
    this.lastUpdate = 0;
    this.updateView(true); // rendu initial complet
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastUpdate = performance.now();
    const loop = (timestamp) => {
      if (!this.isRunning) return;
      if (timestamp - this.lastUpdate >= this.speed) {
        const changes = this.grid.nextGeneration(); // calcule et renvoie changements
        this.generation++;
        // mise à jour optimisée
        if (changes.length === this.grid.size * this.grid.size) {
          // cas rare : tout change -> rendu complet plus simple
          this.updateView(true);
        } else {
          this.renderer.updateCells(changes);
          nbgeneration.textContent = "Generations : " + this.generation;
        }
        this.lastUpdate = timestamp;
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  step() {
    const changes = this.grid.nextGeneration();
    this.generation++;
    if (changes.length === this.grid.size * this.grid.size) {
      this.updateView(true);
    } else {
      this.renderer.updateCells(changes);
      nbgeneration.textContent = "Generations : " + this.generation;
    }
  }

  toggleCellAtCanvasPos(px, py) {
    const x = Math.floor(px / this.renderer.cellSize);
    const y = Math.floor(py / this.renderer.cellSize);
    // Basculer et mettre à jour une seule cellule
    this.grid.toggleCell(x, y);
    this.renderer.updateCells([{ x, y, isAlive: !!this.grid.cells[y][x] }]);
  }

  randomize(prob = CONFIG.RANDOM_PROBABILITY) {
    this.grid.randomize(prob);
    this.generation = 0;
    this.updateView(true);
  }

  reset() {
    this.stop();
    this.grid.reset();
    this.generation = 0;
    this.updateView(true);
  }

  setSpeed(ms) {
    const v = validateSpeed(ms);
    this.speed = v;
  }

  updateView(full = false) {
    if (full) {
      this.renderer.render(this.grid.cells);
    } else {
      // fallback: compute diff and update
      // simple implémentation : full render
      this.renderer.render(this.grid.cells);
    }
    nbgeneration.textContent = "Generations : " + this.generation;
  }
}

// Renderer : dessine la grille sur un canvas
export class CanvasRenderer {
  constructor(
    canvasEl,
    gridSize = CONFIG.GRID_SIZE,
    cellSize = CONFIG.CELL_SIZE
  ) {
    this.canvas = canvasEl;
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    this.canvas.width = gridSize * cellSize;
    this.canvas.height = gridSize * cellSize;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this._drawGridLines = true;
  }

  // rendu complet (initial)
  render(cells) {
    const ctx = this.ctx;
    const s = this.cellSize;
    ctx.fillStyle = CONFIG.DEAD_COLOR;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = CONFIG.ALIVE_COLOR;
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (cells[y][x]) {
          ctx.fillRect(x * s, y * s, s, s);
        }
      }
    }

    if (this._drawGridLines) this._drawLines();
  }

  // ne met à jour que les cellules données
  updateCells(changes) {
    if (!changes || changes.length === 0) return;
    const ctx = this.ctx;
    const s = this.cellSize;

    changes.forEach(({ x, y, isAlive }) => {
      const px = x * s,
        py = y * s;
      // Peindre fond mort
      ctx.fillStyle = CONFIG.DEAD_COLOR;
      ctx.fillRect(px, py, s, s);
      // Peindre vivant si nécessaire
      if (isAlive) {
        ctx.fillStyle = CONFIG.ALIVE_COLOR;
        ctx.fillRect(px, py, s, s);
      }
      // Re-dessine les lignes de grille locales (1px) pour propreté
      if (this._drawGridLines) {
        ctx.strokeStyle = CONFIG.GRID_LINE_COLOR;
        ctx.lineWidth = 0.5;
        // vertical left
        ctx.beginPath();
        ctx.moveTo(px + 0.5, py);
        ctx.lineTo(px + 0.5, py + s);
        ctx.stroke();
        // vertical right
        ctx.beginPath();
        ctx.moveTo(px + s + 0.5, py);
        ctx.lineTo(px + s + 0.5, py + s);
        ctx.stroke();
        // horizontal top
        ctx.beginPath();
        ctx.moveTo(px, py + 0.5);
        ctx.lineTo(px + s, py + 0.5);
        ctx.stroke();
        // horizontal bottom
        ctx.beginPath();
        ctx.moveTo(px, py + s + 0.5);
        ctx.lineTo(px + s, py + s + 0.5);
        ctx.stroke();
      }
    });
  }

  _drawLines() {
    const ctx = this.ctx;
    const s = this.cellSize;
    ctx.strokeStyle = CONFIG.GRID_LINE_COLOR;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * s + 0.5;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(this.canvas.width, pos);
      ctx.stroke();
    }
  }
}

// Controller : lie l'UI au jeu
export class Controller {
  constructor(game) {
    this.game = game;
    this.bindUI();
    this.bindKeyboard();
  }

  bindUI() {
    startBtn.addEventListener("click", () => {
      if (this.game.isRunning) {
        this.game.stop();
        startBtn.textContent = "START";
      } else {
        this.game.start();
        startBtn.textContent = "STOP";
      }
    });

    stepBtn.addEventListener("click", () => {
      if (!this.game.isRunning) this.game.step();
    });

    randomBtn.addEventListener("click", () => {
      this.game.randomize(CONFIG.RANDOM_PROBABILITY);
    });

    resetBtn.addEventListener("click", () => {
      this.game.reset();
      startBtn.textContent = "START";
    });

    speedInput.addEventListener("change", () => {
      const v = validateSpeed(speedInput.value);
      this.game.setSpeed(v);
    });

    // clic sur canvas
    canvas.addEventListener("click", (ev) => {
      const rect = canvas.getBoundingClientRect();
      const px = ev.clientX - rect.left;
      const py = ev.clientY - rect.top;
      this.game.toggleCellAtCanvasPos(px, py);
    });
  }

  bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        startBtn.click();
      } else if (e.key === "r") {
        randomBtn.click();
      } else if (e.key === "s") {
        resetBtn.click();
      } else if (e.key === "e") {
        stepBtn.click();
      }
    });
  }

  // //navigation au clavier
  // function handleCellKeyboard(e, x, y) {
  //   switch(e.key) {
  //     case 'ArrowRight': this.focusCell(x+1, y); break;
  //     case 'ArrowLeft': this.focusCell(x-1, y); break;
  //     case 'ArrowDown': this.focusCell(x, y+1); break;
  //     case 'ArrowUp': this.focusCell(x, y-1); break;
  //     case 'Enter':
  //     case ' ': this.toggleCell(x, y); break;
  //   }
  // }
}