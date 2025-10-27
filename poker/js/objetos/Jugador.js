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

module.exports = {
  Jugador,
};
