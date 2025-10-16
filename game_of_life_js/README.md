# JEU DE LA VIE DE CONWAY

## Fichier : `index.html`,`style.css`, et `script.js`

## Description

- Ce jeu de la vie cree par conway simule la vie
  des cellules
  
- **Ses regles son simples :**
- Si une cellules est vivante (case rempli) , elle meurt si elle a des voisins vivante > 4 (cause : Surpopulation ou etouffement)
- Si une cellule est vivante , meurt si elle a des voisins vivantes < 1 (cause : isolement)
- Si une cellule est vivante, ells survit si elle a exactement 2 ou 3 voisine vivante
- si une cellule est morte (case vide), elle nait si elle a exactement 3 voisine vivante

## Fonctionnalités

- Boutoun START/STOP, STEP (une génération), RANDOM, RESET

- **Raccourcis clavier :**
  - Espace : START/STOP (demarrer / arreter la simulation)
  - R : ( RANDOM ) remplir aléatoirement
  - S : ( RESET ) vider
  - E : STEP (étape par generation)

## Emplacement

- `game_of_life_js/index.html`

## Recapitulatif des fonctions cree et utilisee

- **`function createGrid(n)`** qui cree une grille de `n` colones et `n` lignes
-**`function creetableau_de_grilles()`** qui cree une grille vide
- **`function verifSi_vivant(el, vie)`** qui verifie si `el` est vivant grace a `vie`
- **`function coordonnes()`** qui change la couleur de la cellule si vivant ou mort
- **`function countVoisin(y, x)`** qui compte les voisins de la cellule `cellules[y][x]`
- **`function step()`** qui simule `1` (une) generation
- **`function start()`** qui demarre la simulation
- **`function stop()`** qui arrete la simulation
-  **`function get()`** qui recupere la vitesse de la simulation


