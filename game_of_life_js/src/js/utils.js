// ============================================ //
//   UTILITAIRES :: JEU DE LA VIE //
// ============================================ //

// Configuration
export const CONFIG = {
  GRID_SIZE: 30,
  CELL_SIZE: 20,
  DEFAULT_SPEED: 800,
  RANDOM_PROBABILITY: 0.25,
  MIN_SPEED: 50,
  MAX_SPEED: 5000,
  ALIVE_COLOR: "#2c7",
  DEAD_COLOR: "#fff",
  GRID_LINE_COLOR: "#ddd"
};

// Utilitaire pour valider la vitesse
export function validateSpeed(value) {
  const s = parseInt(value);
  if (isNaN(s) || s < CONFIG.MIN_SPEED || s > CONFIG.MAX_SPEED) {
    return CONFIG.DEFAULT_SPEED;
  }
  return s;
}

