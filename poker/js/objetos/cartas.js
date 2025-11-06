export class Carta {
  static valor = {
    2: 0,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    9: 7,
    10: 8,
    J: 9,
    Q: 10,
    K: 11,
    A: 12,
  };
  static palos = ["♠", "♥", "♦", "♣"];
  static colorPalo = { "♠": "negro", "♥": "rojo", "♦": "rojo", "♣": "negro" };

  constructor(num, palo) {
    this.num = num; // 2-10, J, Q, K, A
    this.palo = palo; // ['♠', '♥', '♦', '♣'];
    this.valor = this.conseguirValor();
    this.carta = `${this.num}${this.palo}`;
    this.color = Carta.colorPalo[this.palo];
  }
  conseguirValor() {
    return Carta.valor[this.num];
  }
}
