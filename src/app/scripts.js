function calcularPromedio(data) {

  const cantidadParticipantes = data?.length;
  let cantidadDeVotantes = 0;
  let sumaVotos = 0;

  for (let i = 0; i < data?.length; i++) {
    if (data[i]?.puntaje) {
      cantidadDeVotantes += 1;
      sumaVotos += (+data[i]?.puntaje);
    };
  };

  const votosOrdenados = data.sort((a, b) => (+a?.puntaje) - (+b?.puntaje));
  const count = {};

  for (let i = 0; i < votosOrdenados?.length; i++) {
    if (votosOrdenados[i]?.puntaje) {
      let ele = votosOrdenados[i]?.puntaje;
      if (count[ele]) {
        count[ele] += 1;
      } else {
        count[ele] = 1;
      }
    }
  };

  const resultado = {
    cantidadParticipantes: cantidadParticipantes,
    cantidadVotantes: cantidadDeVotantes,
    promedio: sumaVotos / cantidadDeVotantes,
    valoresVotados: count,
  };



  return resultado;
}

module.exports = { calcularPromedio }