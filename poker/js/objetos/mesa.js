const CartaExp = require("./cartas.js");
const carta = CartaExp.Carta;
const JugadorExp = require("./Jugador.js");
const jugador = JugadorExp.Jugador;
const BarajaExp = require("./Baraja.js");
const baraja = BarajaExp.Baraja;

class Mesa {
  constructor() {
    this.cartasMesa = cartasMesa;
    this.bote = bote;
  }
}

module.exports = {
  Mesa,
};
