// sorteador-online/src/features/sorteio/sorteioUtils.js

/**
 * Sorteio seguro usando crypto.getRandomValues()
 * @param {number} min - valor mínimo (inclusivo)
 * @param {number} max - valor máximo (inclusivo)
 * @returns {number} - número aleatório seguro entre min e max
 */
export function getSecureRandomInt(min, max) {
  const range = max - min + 1;
  if (range <= 0) throw new Error("Intervalo inválido");

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
