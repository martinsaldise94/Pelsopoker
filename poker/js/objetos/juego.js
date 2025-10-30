import { Carta } from "./cartas.js";
import { Jugador, elegirDealer } from "./Jugador.js";
import { Baraja } from "./Baraja.js";
import { Mesa } from "./mesa.js";

const table = document.getElementById("cartasMesa");
const manoJ1 = document.getElementById("manoJ1");
const manoJ2 = document.getElementById("manoJ2");
const panel = document.getElementById("panelApuestasJ1");
const fold = document.getElementById("btnPlantar");
const call = document.getElementById("btnIgualar");
const raise = document.getElementById("btnSubir");

//Fases
// - Elegir dealer aleatoriamente
// - Crear mazo, barajar
// - Ciega pequeña el dealer y ciega grande el otro. Serán 10 y 20 ****** VER COMO ALTERNAR DEALER EN CADA RONDA
// - Repartir a cada jugador 2 cartas iniciales. S empieza por el que no es dealer
// - Fase de apuestas inicial... Plantarse , igualar(al principio será igualar la ciega grande), subir
// - Mostrar 3 cartas en la mesa
// - Segunda ronda de apuestas. EMpieza quien no es dealer
// - Mostrar 1 carta en la mesa
// - Tercera ronda de apuestas
// - MOstrar la última carta  en la mesa
// - Última ronda de apuestas
// - Showdown: Revelar manos. Se combinan las dos cartas de la mano y las 5 de la mesa y gana la mejro mano
// - El ganador se queda con el bote
// - Se cambia de dealer

//Creacion de mazo y jugadores

const mazo = new Baraja();
const mesaJuego = new Mesa();
const j1 = new Jugador("Humano");
const j2 = new Jugador("IA");
let turnoActual;
let ultimaApuesta = 10;

iniciar();

mazo.colocarEnMesa(mesaJuego, 3);

// Segunda fase de apuestas

console.log(
  "Jugador 1:",
  j1.mano.map((mano) => mano.carta)
);

console.log(
  "Jugador 2:",

  j2.mano.map((mano) => mano.carta)
);

console.log(
  "Mesa:",

  mesaJuego.cartasMesa.map((mesa) => mesa.carta)
);

console.log("Cartas restantes:", mazo.cartas.length);

console.log("j1 es dealer?", j1.isDealer);

console.log("j2 es dealer", j2.isDealer);
console.log("Bote en la mesa", mesaJuego.bote, "fichas");
console.log("Última apuesta", ultimaApuesta);

//funciones del juego

function ciegas(j1, j2) {
  let ciegaPequeña = 0;
  let ciegaGrande = 0;
  if (j1.isDealer === true) {
    ciegaPequeña = j1.apostar(5);
    ciegaGrande = j2.apostar(10);
  } else if (j2.isDealer === true) {
    ciegaGrande = j1.apostar(10);
    ciegaPequeña = j2.apostar(5);
  }
  return ciegaGrande + ciegaPequeña;
}

function mostrarCartasPLayer(player, cMano) {
  cMano.innerHTML = "";
  player.mano.forEach((carta) => {
    const li = document.createElement("li");
    li.textContent = carta.carta;
    cMano.appendChild(li);
  });
}

function turnoHumano(j1, j2, mesaJuego) {
  fold.addEventListener("click", () => {
    j1.plantar();
    console.log("j1 se planta");
  });
  call.addEventListener("click", () => {
    j1.apostar(ultimaApuesta);
    mesaJuego.bote += ultimaApuesta;
    turnoActual = j2;
  });
  raise.addEventListener("click", () => {
    panel.innerHTML += `<p> Introduce una cantidad a apostar.</p>
  <input id = "cantidadRaise">
  <button id = "postear">Apostar</button>`;
    const cantidadRaise = document.getElementById("cantidadRaise");
    const post = document.getElementById("postear");
    post.addEventListener("click", () => {
      apostar(cantidadRaise.value);
      mesaJuego.bote += ultimaApuesta;
      turnoActual = j2;
    });
  });
}

function iniciar() {
  //Elección de dealer

  elegirDealer(j1, j2);

  //Fase de apostar ciegas en función del dealer. Arbitrariamente decido que las ciegas van a ser esas cantidades

  mesaJuego.sumarBote(ciegas(j1, j2)); // funcion de ciegas y se suma el bote a la vez

  //Fase de barajar y repartir

  mazo.barajar();
  mazo.repartir(j1, 2);
  mazo.repartir(j2, 2);

  mostrarCartasPLayer(j1, manoJ1);
  mostrarCartasPLayer(j2, manoJ2); // esto solo lo uso ahora para ver que funciona, logicamente no veremos las cartas
  if (j1.isDealer === true) {
    turnoActual = j1;
  } else {
    turnoActual = j2;
  }
  turnoHumano(j1, j2, mesaJuego);
}
