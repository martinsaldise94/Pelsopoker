import { Carta } from "./js/objetos/cartas.js";
import { Jugador, elegirDealer } from "./js/objetos/Jugador.js";
import { Baraja } from "./js/objetos/Baraja.js";
import { Mesa } from "./js/objetos/mesa.js";

function poker(main) {
  main.innerHTML = `
    <iframe src="./poker/poker.html" 
    style="width: 100%; height: 100vh; border: none;">
    </iframe>
  `;
}

window.poker = poker;
