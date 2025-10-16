







const Grilles = document.getElementById("vue_grilles");
const startBtn = document.getElementById("start");
const stepBtn = document.getElementById("step");
const randomBtn = document.getElementById("random");
const resetBtn = document.getElementById("reset");

const nbgeneration = document.querySelector(".generation");

let grid = [];
let simulationEncour = false;
let timer = null;

//je cree la grille vide
function createGrid(n) {
  const g = new Array(n);
  for (let y = 0; y < n; y++) {
    g[y] = new Array(n).fill(0);
  }
  return g;
}

//cree un tableau de grilles
function creetableau_de_grilles() {
  //cree les grilles en visuel
  Grilles.innerHTML = "";

  //insertion tableau 2d
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 30; x++) {
      const cell = document.createElement("div");
      cell.className = "cellules";
      //definition des coordonnes
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener("click", () => {
        if (simulationEncour) return;
        grid[y][x] = grid[y][x] ? 0 : 1;
        verifSi_vivant(cell, grid[y][x]);
      });
      Grilles.appendChild(cell);
    }
  }
  coordonnes();
}

//verifier si vivant
function verifSi_vivant(el, vie) {
  if (vie) el.classList.add("vivant");
  else el.classList.remove("vivant");
}

//changer les couleur si vivant
function coordonnes() {
  const cells = Grilles.children;
  for (let i = 0; i < cells.length; i++) {
    const el = cells[i];
    const x = +el.dataset.x,
      y = +el.dataset.y;
    verifSi_vivant(el, grid[y][x]);
  }
  // Grilles.style.color = "green";
}

//compteur des voisin selon les coodrnnne
function countVoisin(y, x) {
  const n = 30;
  let count = 0;
  //compter les voisins
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dy === 0 && dx === 0) continue;
      let ny = y + dy, nx = x + dx; //ignorer la cellule grid[ny][nx]

      if (ny < 0 || ny >= n || nx < 0 || nx >= n) continue;
      
      if (grid[ny] && grid[ny][nx]) count++;
    }
  }
  return count;
}

//nombre de generation
let generation = 0;

//simuler etape par etape
function step() {
  generation += 1;
  const next = createGrid(30);
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 30; x++) {
      const n = countVoisin(y, x);
      //generatipon suivante en fonction des voisins
      if (grid[y][x]) next[y][x] = n === 2 || n === 3 ? 1 : 0;
      else next[y][x] = n === 3 ? 1 : 0;
    }
  }
  grid = next;
  coordonnes();
  nbgeneration.innerHTML = "Generations : " + generation;
}

//vitesse de la simulation
function get() {
  if (document.querySelector("#speed").value == "") {
    document.querySelector("#speed").innerHTML = 800;
    return 800;
  } else {
  return document.querySelector("#speed").value;
  }
}


let vitesse = get();


//commencer la simulation
function start() {
  if (simulationEncour) return;
  simulationEncour = true;
  startBtn.textContent = "STOP";
  timer = setInterval(step, vitesse);
}

//arreter la simulation
function stop() {
  simulationEncour = false;
  startBtn.textContent = "START";
  clearInterval(timer);
  timer = null;
}

//control la simulation selon l'etat de simulationEncour
startBtn.addEventListener("click", () => (simulationEncour ? stop() : start()));

//simuler etape par etape
stepBtn.addEventListener("click", () => {
  if (!simulationEncour) step();
});

//genere aleatoirement des cellules
randomBtn.addEventListener("click", () => {
  grid = createGrid(30);
  for (let y = 0; y < 30; y++)
    for (let x = 0; x < 30; x++) grid[y][x] = Math.random() < 0.25 ? 1 : 0;
  coordonnes();
});

//reinitialiser la grilles
resetBtn.addEventListener("click", () => {
  stop();
  grid = createGrid(30);
  coordonnes();
  generation = 0;
  nbgeneration.innerHTML = "";
});

// initialisation du tableau de grilles
grid = createGrid(30);
creetableau_de_grilles();

// creation des racourcit pour le clavier
window.addEventListener("keydown", (touche_clavier) => {
  // espace pour commencer la simulation
  if (touche_clavier.key === " ") {
    touche_clavier.preventDefault();
    simulationEncour ? stop() : start();
  }

  //r pour la generation aleatoire
  if (touche_clavier.key === "r") {
    randomBtn.click();
  }

  //s pour le reinitialisation
  if (touche_clavier.key === "s") {
    resetBtn.click();
  }

  //e pour step
  if (touche_clavier.key === "e") {
    stepBtn.click();
  }
});
