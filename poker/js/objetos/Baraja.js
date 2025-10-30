import { Carta } from "./cartas.js";
export class Baraja {
  constructor() {
    this.cartas = this.crearBaraja();
  }
  crearBaraja() {
    const nuevaBaraja = [];
    const valores = Object.keys(Carta.valor);
    for (const palo of Carta.palos) {
      for (const valor of valores) {
        nuevaBaraja.push(new Carta(valor, palo));
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
