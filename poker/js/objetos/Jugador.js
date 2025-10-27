const CartaExp = require("./cartas.js");
const carta = CartaExp.Carta;

const BarajaExp = require("./Baraja.js");
const baraja = BarajaExp.Baraja;

const MesaExp = require("./mesa.js");
const mesa = MesaExp.Mesa;

class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.mano = [];
    this.fichas = 100; // juego con 100 fichas predeterminadas
    this.apuesta = 0;
    this.isDealer = false;
  }

  apostar(monto) {
    if (monto > this.fichas) {
      throw Error("¡No tienes fichas suficientes!");
    } else {
      this.fichas -= monto;
      this.apuesta += monto;
      mesa.bote += this.apuesta;
    }
  }
}

// Elección de dealer aleatoria
function elegirDealer(j1, j2) {
  let resultado = Math.random() * 10;
  if (resultado < 5) {
    j1.isDealer = true;
  } else {
    j2.isDealer = true;
  }
}

module.exports = {
  Jugador,
  elegirDealer,
};
