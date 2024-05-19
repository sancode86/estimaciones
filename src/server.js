const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { calcularPromedio } = require("./app/scripts");

const port = 4141;
app.set("port", port);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
require("./app/routes")(app);
app.use(express.static(path.join(__dirname, "public")));
const httpServer = createServer(app);
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
  pingTimeout: 2500,
  pingInterval: 5000,
});

var votantes = [];
var mostrarVotos = false;

io.on("connection", (socket) => {

  io.emit("connectionID", `${socket.id}`);

  socket.on("disconnect", () => {
    const index = votantes.findIndex(x => x.id === socket.id);
    votantes.splice(index, 1);
    const data = {
      votantes: votantes,
      puntajesVisibles: mostrarVotos,
      promedio: calcularPromedio(votantes)
    }
    io.emit("votantesActuales", data);
  });

  socket.on("nuevoVotante", (nuevoVotante) => {
    votantes.push(nuevoVotante);
    const data = {
      votantes: votantes,
      puntajesVisibles: mostrarVotos,
      promedio: calcularPromedio(votantes)
    }
    io.emit("votantesActuales", data);
  });

  socket.on("votar", (votante) => {
    const index = votantes.findIndex(x => x.id === votante.id);
    votantes[index].puntaje = votante.puntaje;
    const data = {
      votantes: votantes,
      puntajesVisibles: mostrarVotos,
      promedio: calcularPromedio(votantes)
    }
    io.emit("votantesActuales", data);
  });

  socket.on("quierenTogglearVotos", () => {
    mostrarVotos = !mostrarVotos;
    io.emit("mostrarVotos", mostrarVotos);
  });

  socket.on("resetear", () => {
    for (let i = 0; i < votantes.length; i++) {
      votantes[i].puntaje = null;
    };
    const data = {
      votantes: votantes,
      puntajesVisibles: mostrarVotos,
      promedio: calcularPromedio(votantes)
    }
    io.emit("votantesActuales", data);
  });

});

httpServer.listen(port, () => {
  console.log("Server up 🚀");
});
