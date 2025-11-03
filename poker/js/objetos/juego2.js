import { Carta } from "./cartas.js";
import { Jugador, elegirDealer } from "./Jugador.js";
import { Baraja } from "./Baraja.js";
import { Mesa } from "./mesa.js";

const table = document.getElementById("cartasMesa");
const tableF = document.getElementById("fichasMesa");
const manoJ1 = document.getElementById("manoJ1");
const fichasj1 = document.getElementById("fichasJ1");
const manoJ2 = document.getElementById("manoJ2");
const fichasj2 = document.getElementById("fichasJ2");
const panel = document.getElementById("panelApuestasJ1");
const faseMesa = document.getElementById("faseActual");

const mazo = new Baraja();
const mesaJuego = new Mesa();
const j1 = new Jugador(" El humano");
const j2 = new Jugador(" La IA");
let turnoActual;
let ultimaApuesta = 10;
let ultimoEnSubir = null;
elegirDealer(j1, j2);
let faseActual;
let apuestaNecesaria;
mostrarFichas();

console.log(
  `Comienza la partida"" Humano vs IA. El dealer es:${
    j1.isDealer ? j1.nombre : j2.nombre
  }`
);

setTimeout(() => iniciarRonda(), 1000);

// funciones

function iniciarRonda() {
  console.log("Iniciando ronda nueva...");
  faseActual = "Preflop";
  j1.mano = [];
  j1.apuesta = 0;
  j1.hasPLayed = false;
  j2.mano = [];
  j2.apuesta = 0;
  j2.hasPLayed = false;
  ultimaApuesta = 10;
  mesaJuego.cartasMesa = [];

  console.log("Fase de ciegas. El dealer pone 5 fichas y el otro, 10");

  mesaJuego.sumarBote(ciegas(j1, j2));
  console.log("Bote en la mesa:", mesaJuego.bote);
  mostrarFichas();

  mazo.crearBaraja();

  mazo.barajar();

  console.log("Comienza el Preflop...");
  console.log(
    "--------------------------------------------------------------------------------------------"
  );
  setTimeout(() => iniciarPreFLop(), 2000);
}
function turnoHumano() {
  apuestaNecesaria = ultimaApuesta;

  panel.innerHTML = `<div class = containerbutton>
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
    console.log("j1 se planta, menudo cagón");
    setTimeout(() => terminarMano(), 1500);
  });

  call.addEventListener("click", () => {
    panel.innerHTML = "";
    panel.style.display = "none";
    const apostadoAhora = ultimaApuesta;
    j1.apostar(apostadoAhora);
    mesaJuego.sumarBote(apostadoAhora);
    j1.hasPLayed = true;
    mostrarFichas();

    console.log("TURNO HUMANO, CALL");
    console.log("cuantas fichas tiene", j1.fichas);
    console.log("apuesta j1", j1.apuesta);
    console.log("ultima apuesta", ultimaApuesta);
    console.log("Bote en la mesa", mesaJuego.bote, "fichas");
    console.log("-----------------------------------------");
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

      j1.apostar(apuestaNecesaria);
      mesaJuego.sumarBote(apuestaNecesaria);

      ultimaApuesta = j1.apuesta;
      ultimoEnSubir = j1;

      j1.hasPLayed = true;
      j2.hasPLayed = false;
      mostrarFichas();

      turnoActual = j2;

      console.log("TURNO HUMANO, JUGADA RAISE");
      console.log("cuantas fichas tiene", j1.fichas);
      console.log("apuesta j1", j1.apuesta);
      console.log("ultima apuesta", ultimaApuesta);
      console.log("Bote en la mesa", mesaJuego.bote, "fichas");
      console.log("---------------------------------");
      setTimeout(() => continuarTurnoHumano(), 1500);
    });
  });
  console.log("TURNO HUMANO: Esperando acción.");
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
    `Dealer ${
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
    turnoActual = j2;
    ultimoEnSubir = j1;
  } else {
    turnoActual = j1;
    ultimoEnSubir = j2;
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
    console.log(" Turno de la IA. Está pensando...");
    setTimeout(() => turnoIAPreFloop(), 3000);
  }
}

function turnoIAPreFloop() {
  apuestaNecesaria = ultimaApuesta;

  let decision = Math.random() * 10;

  if (decision < 0.5) {
    j2.plantar();
    j2.hasPLayed = true;
    console.log("j2 se planta, los robots también se cagan");
    setTimeout(() => terminarMano(), 1500);
  } else if (decision < 9 && decision >= 0.5) {
    const apostadoAhora = apuestaNecesaria;
    j2.apostar(apostadoAhora);
    mesaJuego.sumarBote(apostadoAhora);
    j2.hasPLayed = true;
    turnoActual = j1;
    ultimaApuesta = j2.apuesta;
    mostrarFichas();

    console.log("La IA apuesta", apostadoAhora, "fichas");
    console.log("---------------------------------------");

    if (j1.hasPLayed && j2.hasPLayed) {
      avanzarRonda();
    } else {
      faseApuestas();
    }
  } else {
    let raised = ultimaApuesta + Math.round(Math.random() * 5);
    const aPagar = raised;

    j2.apostar(aPagar);
    mesaJuego.sumarBote(aPagar);
    mostrarFichas();

    j2.hasPLayed = true;
    j1.hasPLayed = false;
    ultimaApuesta = j2.apuesta;
    ultimoEnSubir = j2;

    turnoActual = j1;
    console.log("La IA sube la apuesta!!");
    console.log("cuantas fichas tiene", j2.fichas);
    console.log("apuesta j2", j2.apuesta);
    console.log("ultima apuesta", raised);
    if (j1.hasPLayed && j2.hasPLayed) {
      avanzarRonda();
    } else {
      faseApuestas();
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
    console.log(`j1 se lleva ${mesaJuego.bote} fichas!!`);
    console.log("j1 tiene", j1.fichas, "fichas");
  } else {
    j2.fichas += mesaJuego.bote;
    console.log(`j2 se lleva ${mesaJuego.bote} fichas!!`);
    console.log("j2 tiene", j2.fichas, "fichas");
  }
  mostrarFichas();
  mesaJuego.bote = 0;
  console.log("El rol de dealer se invierte...");
  cambiarDealer();
  setTimeout(() => iniciarRonda(), 4000);
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
    ultimoEnSubir = j1;
  } else {
    turnoActual = j1;
    ultimoEnSubir = j2;
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
    console.log("Comienza la fase de Turn!!! Se reparte 1 carta en la mesa...");
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
    console.log("Se acaban las apuestas!!! El ganador es...");
    setTimeout(() => iniciarShowdown(), 3000);
  }
}

//Utilidades

function mostrarCartasPLayer(player, cMano) {
  cMano.innerHTML = "";
  player.mano.forEach((carta) => {
    const li = document.createElement("li");
    li.textContent = carta.carta;
    cMano.appendChild(li);
  });
}

function mostrarCartasMesa() {
  table.innerHTML = "";
  mesaJuego.cartasMesa.forEach((carta) => {
    const li = document.createElement("li");
    li.textContent = carta.carta;
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
  fichasJ1.textContent = `Fichas: ${j1.fichas}. Última apuesta: ${j1.apuesta}`;
  fichasJ2.textContent = `Fichas: ${j2.fichas}. Última apuesta: ${j2.apuesta}`;
  tableF.textContent = `Bote: ${mesaJuego.bote}`;
}
