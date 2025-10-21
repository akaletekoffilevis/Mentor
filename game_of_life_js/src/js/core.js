// ================================== //
//   LOGIQUE METIER :: JEU DE LA VIE  //
// ================================== //

// Grid : encapsule l'état et les règles
export class Grid {
  constructor(size = CONFIG.GRID_SIZE) {
    this.size = size;
    this.cells = this.createEmptyGrid();
  }

  createEmptyGrid() {
    const g = new Array(this.size);
    for (let y = 0; y < this.size; y++) {
      g[y] = new Array(this.size).fill(0);
    }
    return g;
  }

  cloneCells() {
    return this.cells.map(row => row.slice());
  }

  countNeighbors(y, x) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const ny = y + dy, nx = x + dx;
        if (ny < 0 || ny >= this.size || nx < 0 || nx >= this.size) continue;
        if (this.cells[ny][nx]) count++;
      }
    }
    return count;
  }

  // Calcule la génération suivante et renvoie la liste des changements
  nextGeneration() {
    const next = this.createEmptyGrid();
    const changes = []; // {x,y,isAlive}
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const n = this.countNeighbors(y, x);
        const nextState = this.cells[y][x] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        next[y][x] = nextState;
        if (nextState !== this.cells[y][x]) {
          changes.push({ x, y, isAlive: !!nextState });
        }
      }
    }
    this.cells = next;
    return changes;
  }

  toggleCell(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return;
    this.cells[y][x] = this.cells[y][x] ? 0 : 1;
  }

  randomize(prob = CONFIG.RANDOM_PROBABILITY) {
    for (let y = 0; y < this.size; y++)
      for (let x = 0; x < this.size; x++)
        this.cells[y][x] = Math.random() < prob ? 1 : 0;
  }

  reset() {
    this.cells = this.createEmptyGrid();
  }
}

