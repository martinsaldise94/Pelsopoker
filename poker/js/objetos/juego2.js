import { Carta } from "./cartas.js";
import { Jugador, elegirDealer } from "./Jugador.js";
import { Baraja } from "./Baraja.js";
import { Mesa } from "./mesa.js";

// pantalla inicial
const musica = document.getElementById("musicaFondo");
musica.volume = 0.3;
const musica2 = document.getElementById("musicaFondo2");
musica2.volume = 0.3;

document.addEventListener("DOMContentLoaded", () => {
  const panelInicio = document.getElementById("panelInicio");
  const formularioNombres = document.getElementById("nombres");
  const inputJ1 = document.getElementById("nombrej1");
  const inputJ2 = document.getElementById("nombrej2");

  formularioNombres.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre1 = inputJ1.value;
    const nombre2 = inputJ2.value;

    panelInicio.style.display = "none";
    musica.play();

    comenzarJuego(nombre1, nombre2);
  });
});

function comenzarJuego(nombre1, nombre2) {
  const table = document.getElementById("cartasMesa");
  const tableF = document.getElementById("fichasMesa");
  const manoJ1 = document.getElementById("manoJ1");
  const fichasJ1 = document.getElementById("fichasJ1");
  const manoJ2 = document.getElementById("manoJ2");
  const fichasJ2 = document.getElementById("fichasJ2");
  const panel = document.getElementById("panelApuestasJ1");
  const faseMesa = document.getElementById("faseActual");
  const cuentaCosas = document.getElementById("cuentaCosas");

  const mazo = new Baraja();
  const mesaJuego = new Mesa();
  const j1 = new Jugador(nombre1);
  const j2 = new Jugador(nombre2);
  document.querySelector("#jugador1 header").textContent = nombre1;
  document.querySelector("#jugador2 header").textContent = nombre2;

  let turnoActual;
  let ultimaApuesta = 10;
  elegirDealer(j1, j2);
  let faseActual;
  let apuestaNecesaria;
  mostrarFichas();

  console.log(
    `Comienza la partida: ${j1.nombre} vs ${
      j2.nombre
    }. El dealer en la primera ronda es: ${j1.isDealer ? j1.nombre : j2.nombre}`
  );

  setTimeout(() => iniciarRonda(), 3000);

  // funciones

  function iniciarRonda() {
    if (j2.fichas < 30) {
      console.log("Ánimo!!!! Ya le tienes!! Le quedan", j2.fichas, "fichas");
      musica.pause();
      musica2.play();
    }
    setTimeout(() => {
      console.log("Iniciando ronda nueva...");
    }, 2000);
    faseActual = "Preflop";
    j1.mano = [];
    j1.apuesta = 0;
    j1.hasPLayed = false;
    j1.isPlaying = true;
    j2.mano = [];
    j2.apuesta = 0;
    ultimaApuesta = 10;
    j2.hasPLayed = false;
    j2.isPlaying = true;
    mesaJuego.cartasMesa = [];
    mostrarCartasPLayer(j1, manoJ1);
    mostrarCartasPLayer(j2, manoJ2);
    mostrarCartasMesa();
    setTimeout(() => {
      console.log(
        `Fase de ciegas. ${
          j1.isDealer ? j1.nombre : j2.nombre
        } pone 5 fichas y ${j2.isDealer ? j1.nombre : j2.nombre}, 10`
      );
    }, 4000);
    mesaJuego.sumarBote(ciegas(j1, j2));
    mostrarFichas();

    mazo.crearBaraja();

    mazo.barajar();

    setTimeout(() => {
      console.log("Comienza el Preflop...");
    }, 7000);
    setTimeout(() => iniciarPreFLop(), 10000);
  }
  function turnoHumano() {
    apuestaNecesaria = ultimaApuesta - j1.apuesta;
    if (apuestaNecesaria < 0) {
      apuestaNecesaria = 0;
    }

    panel.innerHTML = `<div class = containerbutton>
                      <p> Tu turno</p>
                     <button id="btnPlantar">Plantarse (Fold)</button>
                     <button id="btnIgualar">Igualar: ${apuestaNecesaria} fichas (Call)</button>
                     <button id="btnSubir"> Subir apuesta (Raise)</button>
                     </div>`;

    panel.style.display = "block";
    const fold = document.getElementById("btnPlantar");
    const call = document.getElementById("btnIgualar");
    const raise = document.getElementById("btnSubir");

    fold.addEventListener("click", () => {
      panel.innerHTML = "";
      panel.style.display = "none";
      j1.plantar();
      j1.hasPLayed = true;
      console.log("Te has plantado, cobarde");
      setTimeout(() => terminarMano(), 1500);
    });

    call.addEventListener("click", () => {
      panel.innerHTML = "";
      panel.style.display = "none";
      const apostadoAhora = apuestaNecesaria;
      try {
        j1.apostar(apostadoAhora);
      } catch (error) {
        if (j1.fichas > 0) {
          j1.apostar(j1.fichas);
          console.log(
            j1.nombre,
            "se ve en la obligación de ir ALL IN con",
            j1.fichas,
            "!!!!"
          );
        }
        console.log(j1.nombre, "se mantiene con 0 fichas en la partida!!!");
      }

      mesaJuego.sumarBote(j1.apuesta);
      j1.hasPLayed = true;
      mostrarFichas();

      ultimaApuesta = j1.apuesta;

      turnoActual = j2;
      setTimeout(() => continuarTurnoHumano(), 1500);
    });

    raise.addEventListener("click", () => {
      panel.innerHTML = `<p> Introduce una cantidad a apostar.</p>
  <input id = "cantidadRaise">
  <button id = "postear">Apostar</button>`;

      const cantidadRaiseInput = document.getElementById("cantidadRaise");
      const post = document.getElementById("postear");

      post.addEventListener("click", () => {
        panel.innerHTML = "";
        panel.style.display = "none";
        const subida = parseInt(cantidadRaiseInput.value);
        const apuestaNecesaria = subida;
        try {
          j1.apostar(apuestaNecesaria);
        } catch {
          if (apuestaNecesaria != Number) {
            console.log("Weon, introduce un numero");
            turnoHumano();
            return;
          }
        }
        mesaJuego.sumarBote(apuestaNecesaria);

        ultimaApuesta = j1.apuesta;

        j1.hasPLayed = true;
        j2.hasPLayed = false;
        mostrarFichas();

        turnoActual = j2;

        setTimeout(() => continuarTurnoHumano(), 1500);
      });
    });
    console.log("Tu turno. Esperando acción.");
  }
  function continuarTurnoHumano() {
    j1.hasPLayed = true;
    if (j1.hasPLayed && j2.hasPLayed) {
      avanzarRonda();
      return;
    } else {
      faseApuestas();
    }
  }
  function iniciarPreFLop() {
    faseActual = "Preflop";
    faseMesa.textContent = "Fase actual: " + faseActual;
    console.log(
      `${
        j1.isDealer ? j1.nombre : j2.nombre
      } reparte 2 cartas a cada jugador...`
    );

    mazo.repartir(j1, 1);
    mazo.repartir(j2, 1);
    setTimeout(() => mostrarCartasPLayer(j1, manoJ1), 500);
    setTimeout(() => mostrarCartasPLayer(j2, manoJ2), 1500);

    setTimeout(() => mazo.repartir(j1, 1), 1600);
    setTimeout(() => mazo.repartir(j2, 1), 1600);

    if (j1.isDealer === true) {
      turnoActual = j1;
    } else {
      turnoActual = j2;
    }

    setTimeout(() => mostrarCartasPLayer(j1, manoJ1), 2500);
    setTimeout(() => mostrarCartasPLayer(j2, manoJ2), 3500);
    setTimeout(() => faseApuestas(), 4500);
  }
  function iniciarFLop() {
    faseMesa.textContent = "Fase actual: " + faseActual;

    mazo.colocarEnMesa(mesaJuego, 1);
    setTimeout(() => mostrarCartasMesa(), 1500);

    setTimeout(() => mazo.colocarEnMesa(mesaJuego, 1), 1600);
    setTimeout(() => mostrarCartasMesa(), 2500);

    setTimeout(() => mazo.colocarEnMesa(mesaJuego, 1), 2600);
    setTimeout(() => mostrarCartasMesa(), 3500);

    setTimeout(() => faseApuestas(), 4000);
  }

  function iniciarTurn() {
    faseMesa.textContent = "Fase actual: " + faseActual;
    mazo.colocarEnMesa(mesaJuego, 1);
    setTimeout(() => mostrarCartasMesa(), 1500);

    faseApuestas();
  }

  function iniciarRiver() {
    faseMesa.textContent = "Fase actual: " + faseActual;
    mazo.colocarEnMesa(mesaJuego, 1);
    setTimeout(() => mostrarCartasMesa(), 1500);

    faseApuestas();
  }

  function faseApuestas() {
    if (j1.hasPLayed === true && j2.hasPLayed === true) {
      console.log("Apuestas igualadas. Pasando a siguiente fase");
      setTimeout(() => avanzarRonda, 1500);
      return; // esto quiere decir basicamente que si los dos no se han plantado, se sigue.
    }
    if (turnoActual === j1) {
      turnoHumano();
    } else {
      console.log(`Turno de ${j2.nombre}. Está pensando...`);
      setTimeout(() => turnoIAPreFloop(), 3000);
    }
  }

  function turnoIAPreFloop() {
    apuestaNecesaria = ultimaApuesta - j2.apuesta;
    if (apuestaNecesaria < 0) {
      apuestaNecesaria = 0;
    }

    let decision = Math.random() * 10;
    let montoapostado = 0;

    if (decision < 0.5) {
      j1.isPlaying = true;
      j2.plantar();
      j2.hasPLayed = true;
      console.log(`${j2.nombre} se planta!!`);
      setTimeout(() => terminarMano(), 1500);
    } else if (decision < 9 && decision >= 0.5) {
      const apostadoAhora = apuestaNecesaria;
      try {
        j2.apostar(apostadoAhora);
      } catch (error) {
        if (j2.fichas > 0) {
          let allIn = j2.fichas;
          j2.apostar(allIn);
          console.log(
            j2.nombre,
            "no puede igualar la apuesta y va ALL IN con",
            allIn
          );
        } else {
          console.log(
            j2.nombre,
            "no tiene fichas para igualar, sigue en la mano con 0"
          );
        }
      }
      montoapostado = j2.apuesta;
      mesaJuego.sumarBote(montoapostado);
      j2.hasPLayed = true;
      turnoActual = j1;
      ultimaApuesta = j2.apuesta;
      mostrarFichas();

      setTimeout(() => {
        console.log(j2.nombre, "apuesta", montoapostado, "fichas");
      }, 2000);

      if (j1.hasPLayed && j2.hasPLayed) {
        setTimeout(() => {
          avanzarRonda();
        }, 5000);
      } else {
        setTimeout(() => {
          faseApuestas();
        }, 5000);
      }
    } else {
      let raised = ultimaApuesta + Math.round(Math.random() * 5);
      const aPagar = raised;

      try {
        j2.apostar(aPagar);
      } catch (error) {
        if (j2.fichas > 0) {
          let allIn = j2.fichas;
          j2.apostar(allIn);
          console.log(
            `${j2.nombre} no puede subir y va All In con ${allIn} fichas.`
          );
        } else {
          console.log(
            `${j2.nombre} quiere subir, pero ya no le quedan fichas.`
          );
        }
      }
      montoapostado = j2.apuesta;

      mesaJuego.sumarBote(montoapostado);
      mostrarFichas();

      j2.hasPLayed = true;
      j1.hasPLayed = false;
      ultimaApuesta = j2.apuesta;

      turnoActual = j1;
      setTimeout(() => {
        console.log(j2.nombre, "sube la apuesta!!");
      }, 2000);

      if (j1.hasPLayed && j2.hasPLayed) {
        setTimeout(() => {
          avanzarRonda();
        }, 5000);
      } else {
        setTimeout(() => {
          faseApuestas();
        }, 5000);
      }
    }
  }
  function terminarMano() {
    j1.mano = [];
    j2.mano = [];
    mesaJuego.cartasMesa = [];
    mostrarCartasPLayer(j1, manoJ1);
    mostrarCartasPLayer(j2, manoJ2);
    mostrarCartasMesa();
    panel.innerHTML = "";
    panel.style.display = "none";
    if (j1.isPlaying === true) {
      j1.fichas += mesaJuego.bote;
      setTimeout(() => {
        console.log(`Te llevas el bote y tienes ${j1.fichas} fichas!! `);
      }, 2000);
    } else if (j2.isPlaying === true) {
      j2.fichas += mesaJuego.bote;
      setTimeout(() => {
        console.log(
          `${j2.nombre} se lleva el bote y tiene ${j2.fichas} fichas!!`
        );
      }, 2000);
    }
    mostrarFichas();
    mesaJuego.bote = 0;
    cambiarDealer();
    setTimeout(() => iniciarRonda(), 5000);
  }

  function avanzarRonda() {
    console.log("Cerrando la fase de", faseActual);
    //   ultimaApuesta = 0;
    j1.apuesta = 0;
    j2.apuesta = 0;
    j1.hasPLayed = false;
    j2.hasPLayed = false;

    if (j1.isDealer === true) {
      turnoActual = j2;
    } else {
      turnoActual = j1;
    }
    console.log("Fase actual:", faseActual);
    if (faseActual === "Preflop") {
      faseActual = "Flop";
      console.log(
        "Comienza la fase de Flop!!! Se reparten 3 cartas en la mesa..."
      );
      ultimaApuesta = 5;
      setTimeout(() => iniciarFLop(), 3000);
    } else if (faseActual === "Flop") {
      faseActual = "Turn";
      console.log(
        "Comienza la fase de Turn!!! Se reparte 1 carta en la mesa..."
      );
      ultimaApuesta = 5;
      setTimeout(() => iniciarTurn(), 3000);
    } else if (faseActual === "Turn") {
      faseActual = "River";
      console.log(
        "Comienza la fase de River!!! Se reparten la última carta en la mesa..."
      );
      ultimaApuesta = 5;
      setTimeout(() => iniciarRiver(), 3000);
    } else if (faseActual === "River") {
      faseActual = "Showdown";
      console.log(
        "Se acaban las apuestas!!! Los jugadores muestran sus cartas. El ganador es..."
      );
      setTimeout(() => revelarCartasJ2(), 3000);

      setTimeout(() => iniciarShowdown(), 10000);
    }
  }
  function finalizarRonda() {
    if (j1.fichas == 0) {
      console.log("Has perdido la partida");
    } else if (j2.fichas == 0) {
      console.log(j2.nombre, "ha perdido la partida");
    } else {
      cambiarDealer();
      iniciarRonda();
    }
  }

  //Utilidades

  function mostrarCartasPLayer(player, cMano) {
    cMano.innerHTML = "";
    player.mano.forEach((carta) => {
      const li = document.createElement("li");
      li.textContent = carta.carta;
      li.classList.add(carta.color);
      li.classList.add("oculta");
      cMano.appendChild(li);
    });
  }

  function mostrarCartasMesa() {
    table.innerHTML = "";
    mesaJuego.cartasMesa.forEach((carta) => {
      const li = document.createElement("li");
      li.textContent = carta.carta;
      li.classList.add(carta.color);
      table.appendChild(li);
    });
  }

  function cambiarDealer() {
    if (j1.isDealer === true) {
      j1.isDealer = false;
      j2.isDealer = true;
    } else {
      j1.isDealer = true;
      j2.isDealer = false;
    }
  }
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

  function mostrarFichas() {
    fichasJ1.textContent = `Fichas: ${j1.fichas}.`;
    fichasJ2.textContent = `Fichas: ${j2.fichas}.`;
    tableF.textContent = `Bote: ${mesaJuego.bote}`;
  }
  function revelarCartasJ2() {
    let cartasj2 = document.querySelectorAll("#manoJ2 li");

    for (let carta of cartasj2) {
      carta.classList.remove("oculta");
    }
  }

  // Esta cosa tan rara la he visto en unos cuantos scripts de poker... NO se me ocurre ni en broma a mi usar un objeto aqui
  function contarValor(combinacion) {
    let contador = {};
    for (let carta of combinacion) {
      let valor = carta.valor;
      contador[valor] = (contador[valor] || 0) + 1;
    }
    return contador;
  }

  // funciones para el showdown

  function iniciarShowdown() {
    let j1Cartas = mesaJuego.cartasMesa.concat(j1.mano);
    let j2Cartas = mesaJuego.cartasMesa.concat(j2.mano);

    let bestHandJ1 = mejorManode7(j1Cartas);
    let bestHandJ2 = mejorManode7(j2Cartas);
    let resultadoFinalJ1 = identificarMano(bestHandJ1);
    let resultadoFinalJ2 = identificarMano(bestHandJ2);

    if (bestHandJ1 > bestHandJ2) {
      j1.fichas += mesaJuego.bote;
      console.log(
        j1.nombre,
        "gana la mano con",
        resultadoFinalJ1,
        "!! Se lleva el bote!!"
      );
    } else if (bestHandJ2 > bestHandJ1) {
      j2.fichas += mesaJuego.bote;
      console.log(
        j2.nombre,
        "gana la mano con",
        resultadoFinalJ2,
        "!! Se lleva el bote!!"
      );
    } else {
      solucionarEmpate();
    }
    mesaJuego.bote = 0;
    mostrarFichas();
    setTimeout(() => finalizarRonda(), 4000);
  }

  function combinacionDe5(hand7) {
    const combinaciones5 = [];
    for (let i = 0; i < hand7.length; i++) {
      for (let j = i + 1; j < hand7.length; j++) {
        for (let k = j + 1; k < hand7.length; k++) {
          for (let l = k + 1; l < hand7.length; l++) {
            for (let m = l + 1; m < hand7.length; m++) {
              combinaciones5.push([
                hand7[i],
                hand7[j],
                hand7[k],
                hand7[l],
                hand7[m],
              ]);
            }
          }
        }
      }
    }
    return combinaciones5;
  }

  function mejorManode7(hand7) {
    let combinaciones = combinacionDe5(hand7);
    let resultado = 0;

    for (let combinacion of combinaciones) {
      let puntuacion = evaluacionMano(combinacion);
      if (puntuacion > resultado) {
        resultado = puntuacion;
      }
    }
    return resultado;
  }

  function evaluacionMano(combinacion) {
    if (checkIfRoyalFlush(combinacion)) {
      return 10;
    } else if (checkIfStraightFlush(combinacion)) {
      return 9;
    } else if (checkIfFourOfAKind(combinacion)) {
      return 8;
    } else if (checkIfFullHOuse(combinacion)) {
      return 7;
    } else if (checkIfFlush(combinacion)) {
      return 6;
    } else if (checkIfStraight(combinacion)) {
      return 5;
    } else if (checkIfThreeOfAKind(combinacion)) {
      return 4;
    } else if (checkIfDoublePair(combinacion)) {
      return 3;
    } else if (checkIfOnePair(combinacion)) {
      return 2;
    } else {
      return 1;
    }
  }

  function checkIfRoyalFlush(combinacion) {
    let resultado = false;
    let esRoyal = false;
    let valores = [];
    for (let i = 0; i < combinacion.length; i++) {
      valores.push(combinacion[i].valor);
    }
    let valoresOrdenados = valores.sort((a, b) => a - b);
    if (
      valoresOrdenados[0] == 8 &&
      valoresOrdenados[1] == 9 &&
      valoresOrdenados[2] == 10 &&
      valoresOrdenados[3] == 11 &&
      valoresOrdenados[4] == 12
    ) {
      esRoyal = true;
    }
    if (esRoyal == true && checkIfFlush(combinacion) == true) {
      resultado = true;
    }
    return resultado;
  }
  function checkIfStraightFlush(combinacion) {
    let resultado = false;
    if (checkIfFlush(combinacion) == true && checkIfStraight(combinacion)) {
      resultado = true;
    }
    return resultado;
  }
  function checkIfFourOfAKind(combinacion) {
    let resultado = false;
    let cuenta = 0;
    let valores = Object.values(contarValor(combinacion));
    for (let valor of valores) {
      if (valor === 4) {
        cuenta++;
      }
      if (cuenta == 1) {
        resultado = true;
      }
    }
    return resultado;
  }
  function checkIfFullHOuse(combinacion) {
    let resultado = false;
    let cuentaP = 0;
    let cuentaT = 0;
    let valores = Object.values(contarValor(combinacion));
    for (let valor of valores) {
      if (valor === 2) {
        cuentaP++;
      } else if (valor === 3) {
        cuentaT++;
      }
      if (cuentaP + cuentaT == 2) {
        resultado = true;
      }
    }
    return resultado;
  }
  function checkIfFlush(combinacion) {
    let resultado = true;
    for (let c of combinacion) {
      if (combinacion[0].palo !== c.palo) {
        resultado = false;
        break;
      }
    }
    return resultado;
  }
  function checkIfStraight(combinacion) {
    let resultado = true;
    let valores = [];
    for (let i = 0; i < combinacion.length; i++) {
      valores.push(combinacion[i].valor);
    }
    let valoresOrdenados = valores.sort((a, b) => a - b);
    for (let i = 0; i < valoresOrdenados.length; i++) {
      if (valoresOrdenados[i + 1] != valoresOrdenados[i] + 1) {
        resultado = false;
        break;
      }
    }
    return resultado;
  }

  function checkIfThreeOfAKind(combinacion) {
    let resultado = false;
    let cuenta = 0;
    let valores = Object.values(contarValor(combinacion));
    for (let valor of valores) {
      if (valor === 3) {
        cuenta++;
      }
      if (cuenta == 1) {
        resultado = true;
      }
    }
    return resultado;
  }
  function checkIfDoublePair(combinacion) {
    let resultado = false;
    let cuenta = 0;
    let valores = Object.values(contarValor(combinacion));
    for (let valor of valores) {
      if (valor === 2) {
        cuenta++;
      }
      if (cuenta == 2) {
        resultado = true;
      }
    }
    return resultado;
  }
  function checkIfOnePair(combinacion) {
    let resultado = false;
    let cuenta = 0;
    let valores = Object.values(contarValor(combinacion));
    for (let valor of valores) {
      if (valor === 2) {
        cuenta++;
      }
      if (cuenta == 1) {
        resultado = true;
      }
    }
    return resultado;
  }

  function solucionarEmpate() {
    let cartasOrdenadasJ1 = j1.mano.sort((a, b) => b.valor - a.valor);
    let cartasOrdenadasJ2 = j2.mano.sort((a, b) => b.valor - a.valor);

    if (cartasOrdenadasJ1[0].valor > cartasOrdenadasJ2[0].valor) {
      j1.fichas += mesaJuego.bote;
      console.log(
        j1.nombre,
        "gana la mano por carta más alta!! Se lleva el bote!!"
      );
    } else if (cartasOrdenadasJ2[0].valor > cartasOrdenadasJ1[0].valor) {
      j2.fichas += mesaJuego.bote;
      console.log(
        j2.nombre,
        "gana la mano por carta más alta!! Se lleva el bote!!"
      );
    } else {
      console.log("Empate!! Se reparte el bote de forma equitativa");
      let mitadBote = mesaJuego.bote / 2;
      j1.fichas += mitadBote;
      j2.fichas += mitadBote;
    }
    return;
  }
  function identificarMano(BestHand) {
    let resultado = "";
    if (BestHand == 10) {
      resultado = "Una Escalera Real";
    } else if (BestHand == 9) {
      resultado = "Una Escalera de color";
    } else if (BestHand == 8) {
      resultado = "Un Poker";
    } else if (BestHand == 7) {
      resultado = "Un Full House";
    } else if (BestHand == 6) {
      resultado = "Un Color";
    } else if (BestHand == 5) {
      resultado = "Una Escalera";
    } else if (BestHand == 4) {
      resultado = "Un trío";
    } else if (BestHand == 3) {
      resultado = "Una Doble Pareja";
    } else if (BestHand == 2) {
      resultado = "Una Pareja";
    }
    return resultado;
  }

  // SI llego, Añadir sonidos y mostrar mensajes para que sea más claro
  //Mejoras esteticas
}
const logueos = console.log;
console.log = (...args) => {
  logueos(...args);
  cuentaCosas.textContent = args.join(" ");
};
