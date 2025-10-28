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

//Creacion de mazo y jugadores

const mazo = new baraja();
const mesaJuego = new mesa();
const j1 = new jugador("Humano");
const j2 = new jugador("IA");

//Elección de dealer

JugadorExp.elegirDealer(j1, j2);

//Fase de apostar ciegas en función del dealer. Arbitrariamente decido que las ciegas van a ser esas cantidades

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

mesaJuego.sumarBote(ciegas(j1, j2)); // funcion de ciegas y se suma el bote a la vez

//Fase de barajar y repartir

mazo.barajar();
mazo.repartir(j1, 2);
mazo.repartir(j2, 2);

//Primera fase de apuestas. Opciones: igualar lo de antes (al principio la ciega grande), plantarse o subir apuesta
//Ahora hay que empezar con interacciones HTML antes de continuar.

mazo.colocarEnMesa(mesaJuego, 3);

// Segunda fase de apuestas

//Comprobaciones en consola
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

console.log("Es dealer?: ", j1.isDealer, "Es dealer?: ", j2.isDealer);

console.log("Fichas del jugador 1: ", j1.fichas);
console.log("Fichas del jugador 2: ", j2.fichas);
console.log("Bote en la mesa: ", mesaJuego.bote);
