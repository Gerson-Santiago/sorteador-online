// sorteador-online/src/features/sorteio/sorteioUtils.js

/**
 * Sorteio seguro usando crypto.getRandomValues()
 * @param {number} min - valor mínimo (inclusivo)
 * @param {number} max - valor máximo (inclusivo)
 * @returns {number} - número aleatório seguro entre min e max
 */
export function getSecureRandomInt(min, max) {
  const range = max - min + 1;
  if (!Number.isInteger(min) || !Number.isInteger(max) || range <= 0) {
    throw new Error("Intervalo inválido");
  }

  const maxUint32 = 0xFFFFFFFF;
  const limit = Math.floor(maxUint32 / range) * range;

  const array = new Uint32Array(1);
  let randomNumber;

  do {
    window.crypto.getRandomValues(array);
    randomNumber = array[0];
  } while (randomNumber >= limit);

  return min + (randomNumber % range);
}

export function sortearNumeros({
  minimo,
  maximo,
  quantidade,
  semRepeticao,
  disponiveis
}) {
  const sorteados = [];
  const restantes = [...disponiveis];

  if (semRepeticao && quantidade > restantes.length) {
    throw new RangeError("Quantidade solicitada excede os números disponíveis.");
  }

  for (let i = 0; i < quantidade; i++) {
    let numero;

    if (semRepeticao) {
      const indice = getSecureRandomInt(0, restantes.length - 1);
      numero = restantes[indice];
      restantes.splice(indice, 1);
    } else {
      numero = getSecureRandomInt(minimo, maximo);
    }

    sorteados.push(numero);
  }

  return { sorteados, restantes };
}
