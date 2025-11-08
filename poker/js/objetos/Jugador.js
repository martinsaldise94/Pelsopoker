export class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.mano = [];
    this.fichas = 100; // juego con 100 fichas predeterminadas
    this.apuesta = 0;
    this.isDealer = false;
    this.isPlaying = true;
    this.hasPLayed = false;
  }

  apostar(monto) {
    let montoNumero = parseInt(monto);

    if (isNaN(montoNumero) || montoNumero < 0) {
      throw new Error(
        "El monto de la apuesta debe ser un número positivo válido."
      );
    }
    if (montoNumero > this.fichas) {
      throw new Error("¡No tienes fichas suficientes!");
    } else {
      this.fichas -= montoNumero;
      this.apuesta = montoNumero;
      return montoNumero;
    }
  }
  plantar() {
    this.isPlaying = false;
    this.mano = [];
  }
}

// Elección de dealer aleatoria
export function elegirDealer(j1, j2) {
  let resultado = Math.random() * 10;
  if (resultado < 5) {
    j1.isDealer = true;
    j2.isDealer = false;
  } else {
    j2.isDealer = true;
    j1.isDealer = false;
  }
}
