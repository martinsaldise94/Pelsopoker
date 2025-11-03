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
    if (monto > this.fichas) {
      throw Error("¡No tienes fichas suficientes!");
    } else {
      this.fichas -= monto;
      this.apuesta = monto;
      return monto;
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
