function calcularApostas() {
  const valorTotal = Math.floor(Number(document.getElementById('valorTotal').value));
  const oddW = Number(document.getElementById('oddW').value);
  const oddD = Number(document.getElementById('oddD').value);
  const oddL = Number(document.getElementById('oddL').value); 

  if (!valorTotal || !oddW || !oddD || !oddL) {
    document.getElementById('resultado').innerText = 'Preencha todos os campos corretamente!';
    return;
  }

  // 1. Calcular apostas para W e D para lucro igual, favorecendo W
  // Procurar a combinação de inteiros (x, y) que mais iguala os lucros
  let melhorX = 0, melhorY = 0, menorDif = Infinity, melhorLucroW = -Infinity, melhorLucroD = -Infinity;
  for (let x = valorTotal; x >= 0; x--) {
    let y = valorTotal - x;
    let lucroW = Math.floor(oddW * x - valorTotal);
    let lucroD = Math.floor(oddD * y - valorTotal);
    // Só considerar se lucroW >= lucroD
    if (lucroW >= lucroD) {
      let dif = Math.abs(lucroW - lucroD);
      // Favorecer W: se empate, pega maior x
      if (dif < menorDif || (dif === menorDif && x > melhorX)) {
        melhorX = x;
        melhorY = y;
        menorDif = dif;
        melhorLucroW = lucroW;
        melhorLucroD = lucroD;
      }
    }
  }
  // Se não encontrar nenhuma combinação com lucroW >= lucroD, usar o melhor possível
  if (menorDif === Infinity) {
    for (let x = valorTotal; x >= 0; x--) {
      let y = valorTotal - x;
      let lucroW = Math.floor(oddW * x - valorTotal);
      let lucroD = Math.floor(oddD * y - valorTotal);
      let dif = Math.abs(lucroW - lucroD);
      if (dif < menorDif || (dif === menorDif && x > melhorX)) {
        melhorX = x;
        melhorY = y;
        menorDif = dif;
        melhorLucroW = lucroW;
        melhorLucroD = lucroD;
      }
    }
  }


  // 2. Apostar só em W para ter lucro
  // oddW * x - x > 0 => x > 0
  // oddW > 1
  // x = valor mínimo para lucro: x > 0
  // Mas queremos saber o mínimo para lucro >= 1
  // oddW * x - x >= 1 => x*(oddW-1) >= 1 => x >= 1/(oddW-1)
  let xW = Math.ceil(1/(oddW-1));
  if (xW < 1) xW = 1;
  const lucroWsolo = Math.floor(oddW * xW - xW);

  // 2b. Apostar zero no empate (y=0), quanto apostar em W para lucro zero?
  // oddW * x - x = 0 => x = 0 (não faz sentido), mas queremos oddW * x - valorTotal = 0
  // oddW * x = valorTotal => x = valorTotal / oddW
  let xZeroLucro = Math.ceil(valorTotal / oddW);
  let lucroZeroLucro = Math.floor(oddW * xZeroLucro - valorTotal);
  // Para garantir lucro positivo, x > valorTotal / oddW
  let xLucroPositivo = xZeroLucro;
  while (oddW * xLucroPositivo - valorTotal <= 0) {
    xLucroPositivo++;
  }
  let lucroLucroPositivo = Math.floor(oddW * xLucroPositivo - valorTotal);

  document.getElementById('resultado').innerHTML =
    `<div><b>Aposta para lucro mais igual possível (favorecendo W):</b><br>
    Apostar <b>€${melhorX}</b> em W (odd ${oddW})<br>
    Apostar <b>€${melhorY}</b> em D (odd ${oddD})<br>
    Lucro se W: <b>€${melhorLucroW}</b><br>
    Lucro se D: <b>€${melhorLucroD}</b></div><br>
    <div><b>Aposta só em W para ter lucro:</b><br>
    Apostar <b>€${xW}</b> em W (odd ${oddW})<br>
    Lucro: <b>€${lucroWsolo}</b><br><br>
    <b>Se apostar zero no empate (D):</b><br>
    Para lucro zero, apostar <b>€${xZeroLucro}</b> em W (lucro: €${lucroZeroLucro})<br>
    Para lucro positivo, apostar <b>€${xLucroPositivo}</b> em W (lucro: €${lucroLucroPositivo})
    </div>`;
}
