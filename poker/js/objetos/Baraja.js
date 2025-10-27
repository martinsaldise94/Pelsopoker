const CartaExp = require("./cartas.js");
const carta = CartaExp.Carta;
const JugadorExp = require("./Jugador.js");
const jugador = JugadorExp.Jugador;
const MesaExp = require("./mesa.js");
const mesa = MesaExp.Mesa;

class Baraja {
  constructor() {
    this.cartas = this.crearBaraja();
  }
  crearBaraja() {
    const nuevaBaraja = [];
    const valores = Object.keys(carta.valor);
    for (const palo of carta.palos) {
      for (const valor of valores) {
        nuevaBaraja.push(new carta(valor, palo));
      }
    }

    return nuevaBaraja;
  }
  barajar() {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  repartir(jugador, num) {
    for (let i = 0; i < num; i++) {
      let repartido = [];
      repartido = this.cartas.pop();
      jugador.mano.push(repartido);
    }
  }

  colocarEnMesa(mesa, num) {
    for (let i = 0; i < num; i++) {
      let repartido = [];
      repartido = this.cartas.pop();
      mesa.cartasMesa.push(repartido);
    }
  }
}

module.exports = {
  Baraja,
};
