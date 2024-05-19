var socket = io();
var votante = {
  nombre: "",
  puntaje: null,
  id: null,
};

console.log("😃😃😃😃😃😃😃😃😃😃😃😃😃");
console.log("Fuaa...");
console.log("😃😃😃😃😃😃😃😃😃😃😃😃😃");


var puntajesVisibles = false;
var votantes = [];
var promedio;
var botonMostrarVotos = document.getElementById("botonMostrarVotos");

focusInputNombre();

votante.id = Date.now() + Math.random();

socket.on("mostrarVotos", function (mostrarVotos) {
  puntajesVisibles = mostrarVotos;
  mostrarVotantes();
});

function aceptarNombre() {
  const input = document.getElementById("inputNombre").value;

  if (!input) {
    return;
  }

  votante.nombre = input;
  socket.emit("nuevoVotante", votante);

  const ingresarNombre = document.getElementById("ingresarNombre");
  ingresarNombre.style.display = "none";

  const seccionPuntuar = document.getElementById("seccionPuntuar");
  seccionPuntuar.style.display = "block";
  botonMostrarVotosToggle();
}

socket.on("votantesActuales", function (todosLosVotantes) {
  votantes = todosLosVotantes?.votantes;
  puntajesVisibles = todosLosVotantes?.puntajesVisibles;
  promedio = todosLosVotantes?.promedio;
  mostrarVotantes();
});

function mostrarVotantes() {
  const participantesDiv = document.getElementById("participantesBody");
  participantesDiv.innerHTML = '';
  let html = '';

  for (let i = 0; i < votantes?.length; i++) {
    if (votantes[i]?.nombre && votantes[i]?.id) {
      html += `
      <tr>
        <td>${votantes[i]?.nombre}</td>
        
        <td>${estadoDelPuntaje(votantes[i])}</td>
      </tr>
      `
    }

  };

  participantesDiv.innerHTML = html;
  botonMostrarVotosToggle()
}

function estadoDelPuntaje(votante) {

  let html = '';

  if (votante?.puntaje == null) {
    html = '➖';
  }

  if (votante?.puntaje && !puntajesVisibles) {
    html = '✅';
  }

  if (votante?.puntaje && puntajesVisibles) {
    html = votante?.puntaje;
  }

  return html;
}

function votar(puntaje) {
  votante.puntaje = puntaje;
  socket.emit("votar", votante);
}

function mostrarVotos() {
  socket.emit("quierenTogglearVotos");
}

function resetear() {
  socket.emit("resetear");
}

function botonMostrarVotosToggle() {
  botonMostrarVotos.innerHTML = puntajesVisibles ? "Ocultar Votos" : "Mostrar Votos";
  mostrarResultados();
}

function focusInputNombre() {
  document.getElementById("inputNombre").focus();
}

function teclaEnter() {
  if (event.key === 'Enter') {
    aceptarNombre();
  }
}

function mostrarResultados() {
  let htmlValoresVotados = '';

  const resultados = document.getElementById("resultados");
  const valoresVotados = promedio?.valoresVotados || 0;

  for (const [key, value] of Object.entries(valoresVotados)) {
    htmlValoresVotados += `<p>${value} votaron <strong>${key}</strong> <br></p>`;
  }

  if (!puntajesVisibles) {
    resultados.innerHTML = '';
  } else {
    resultados.innerHTML = `
    <section class="resultadoContenedor animate__animated animate__fadeIn">
      <div class="contenedorNumeroPromedio">

        <p class="textoPromedio">
        Promedio 
        </p>
        
        <span class="numeroPromedio">
        ${promedio?.promedio || 0}
        </span>

      </div>

      <div>
        <p>
        Votaron: ${promedio?.cantidadVotantes}/${promedio?.cantidadParticipantes}
        </p>
        <div>
        ${htmlValoresVotados}
        </div>
      </div>
</section>
    `;
  }

}