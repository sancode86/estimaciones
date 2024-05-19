function calcularPromedio(data) {

  const cantidadParticipantes = data.length;
  let cantidadDeVotantes = 0;
  let sumaVotos = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].puntaje) {
      cantidadDeVotantes += 1;
      sumaVotos += data[i].puntaje;
    };
  };

  const resultado = {
    cantidadParticipantes: cantidadParticipantes,
    cantidadVotantes: cantidadDeVotantes,
    promedio: sumaVotos / cantidadParticipantes
  };



  return resultado;
}

module.exports = { calcularPromedio }