//POR AHORA AQUÍ HAGO PRUEBAS PARA NODE, ESTO NO ES DEFINITIVO

const CartaExp = require("./objetos/cartas.js");
const carta = CartaExp.Carta;
const JugadorExp = require("./objetos/Jugador.js");
const jugador = JugadorExp.Jugador;
const BarajaExp = require("./objetos/Baraja.js");
const baraja = BarajaExp.Baraja;
const MesaExp = require("./objetos/mesa.js");
const mesa = MesaExp.Mesa;

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

const mazo = new baraja();
const j1 = new jugador("Humano");
const j2 = new jugador("IA");

mazo.barajar();
mazo.repartir(j1, 2);
mazo.repartir(j2, 2);

console.log(
  "Jugador 1:",
  j1.mano.map((mano) => mano.carta)
);
console.log(
  "Jugador 2:",
  j2.mano.map((mano) => mano.carta)
);
console.log("Cartas restantes:", mazo.cartas.length);
