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
  // x = aposta em W, y = aposta em D
  // x + y <= valorTotal
  // oddW * x - y = oddD * y - x
  // Lucro igual: oddW * x - (x + y) = oddD * y - (x + y)
  // Simplifica: oddW * x = oddD * y
  // y = (oddW/oddD) * x
  // x + y <= valorTotal => x + (oddW/oddD)*x <= valorTotal
  // x*(1 + oddW/oddD) <= valorTotal
  // x <= valorTotal / (1 + oddW/oddD)
  let x = Math.floor(valorTotal / (1 + (oddW/oddD)));
  let y = Math.floor(valorTotal - x);
  // Favorecer W: se possível, arredondar y para baixo e dar o resto para x
  x = valorTotal - y;

  const lucroW = Math.floor(oddW * x - valorTotal);
  const lucroD = Math.floor(oddD * y - valorTotal);

  // 2. Apostar só em W para ter lucro
  // oddW * x - x > 0 => x > 0
  // oddW > 1
  // x = valor mínimo para lucro: x > 0
  // Mas queremos saber o mínimo para lucro >= 1
  // oddW * x - x >= 1 => x*(oddW-1) >= 1 => x >= 1/(oddW-1)
  let xW = Math.ceil(1/(oddW-1));
  if (xW < 1) xW = 1;
  const lucroWsolo = Math.floor(oddW * xW - xW);

  document.getElementById('resultado').innerHTML =
    `<div><b>Aposta para lucro igual (favorecendo W):</b><br>
    Apostar <b>€${x}</b> em W (odd ${oddW})<br>
    Apostar <b>€${y}</b> em D (odd ${oddD})<br>
    Lucro se W: <b>€${lucroW}</b><br>
    Lucro se D: <b>€${lucroD}</b></div><br>
    <div><b>Aposta só em W para ter lucro:</b><br>
    Apostar <b>€${xW}</b> em W (odd ${oddW})<br>
    Lucro: <b>€${lucroWsolo}</b></div>`;
}
