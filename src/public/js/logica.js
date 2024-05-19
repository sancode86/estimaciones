var socket = io();
var votante = {
  nombre: "",
  puntaje: null,
  id: null,
};

var puntajesVisibles = false;
var votantes = [];
var promedio;
var botonMostrarVotos = document.getElementById("botonMostrarVotos");

focusInputNombre();


socket.on("connectionID", function (connectionID) {
  votante.id = connectionID;
});

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
  votantes = todosLosVotantes.votantes;
  puntajesVisibles = todosLosVotantes.puntajesVisibles;
  promedio = todosLosVotantes.promedio;
  mostrarVotantes();
});

function mostrarVotantes() {
  const participantesDiv = document.getElementById("participantesBody");
  participantesDiv.innerHTML = '';
  let html = '';

  for (let i = 0; i < votantes?.length; i++) {
    if (votantes[i].nombre && votantes[i].id) {
      html += `
      <tr>
        <td>${votantes[i].nombre}</td>
        
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

  if (votante.puntaje == null) {
    html = '';
  }

  if (votante.puntaje && !puntajesVisibles) {
    html = '✅';
  }

  if (votante.puntaje && puntajesVisibles) {
    html = votante.puntaje;
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
  const resultados = document.getElementById("resultados");

  if (!puntajesVisibles) {
    resultados.innerHTML = '';
  } else {
    resultados.innerHTML = `
    <p>
    Promedio: ${promedio.promedio}
    </p>
    <p>
    Votaron: ${promedio.cantidadVotantes}/${promedio.cantidadParticipantes}
    </p>  
    `;
  }

}