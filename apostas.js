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


  // 2b. Apostar no empate (D) para garantir lucro zero se D acontecer,
  // e apostar o resto em W para ter lucro positivo se W acontecer.
  // Queremos: oddD * y - (y + x) = 0 => oddD * y = y + x => x = y * (oddD - 1)
  // y + x <= valorTotal
  // Substituindo x: y + y*(oddD-1) <= valorTotal => y*oddD <= valorTotal => y <= valorTotal/oddD
  let yEmpateZero = Math.floor(valorTotal / oddD);
  let xWlucro = valorTotal - yEmpateZero;
  // Lucro se D: oddD*yEmpateZero - (yEmpateZero + xWlucro) = 0
  // Lucro se W: oddW*xWlucro - (yEmpateZero + xWlucro)
  let lucroWlucro = Math.floor(oddW * xWlucro - (yEmpateZero + xWlucro));

  document.getElementById('resultado').innerHTML =
    `<div style="margin-bottom:1.5em;">
      <span style="color:#d32f2f;font-weight:bold;">Opção 1</span><br>
  <span style="font-weight:normal;font-size:0.70em;">Aposta para lucro mais igual possível (favorecendo W):</span><br>
      Apostar <span style="font-weight:bold;color:#1976d2;">€${melhorX}</span> em W (odd ${oddW})<br>
      Apostar <span style="font-weight:bold;color:#1976d2;">€${melhorY}</span> em D (odd ${oddD})<br>
      <span style="font-weight:normal;">Lucro se W: <span style="font-weight:bold;color:#388e3c;">€${melhorLucroW}</span></span><br>
      <span style="font-weight:normal;">Lucro se D: <span style="font-weight:bold;color:#388e3c;">€${melhorLucroD}</span></span>
    </div>
    <div>
      <span style="color:#d32f2f;font-weight:bold;">Opção 2</span><br>
  <span style="font-weight:normal;font-size:0.70em;">Empate (D) com lucro zero, W com lucro positivo:</span><br>
  Apostar <span style="font-weight:bold;color:#bfa100;">€${xWlucro}</span> em W (odd ${oddW})<br>
  Apostar <span style="font-weight:bold;color:#bfa100;">€${yEmpateZero}</span> em D (odd ${oddD})<br>
  <span style="font-weight:normal;">Lucro se W: <span style="font-weight:bold;color:#388e3c;">€${lucroWlucro}</span></span><br>
  <span style="font-weight:normal;">Lucro se D: <span style="font-weight:bold;color:#388e3c;">€0</span></span>
    </div>`;
}
