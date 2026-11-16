import { afterEach, describe, expect, it, vi } from "vitest";
import {
  criarFaixa,
  gerarIntervalo,
  getSecureRandomInt,
  sortearNumeros,
} from "../../../src/features/sorteio/sorteioUtils";

if (typeof globalThis.window === "undefined") {
  globalThis.window = { crypto: globalThis.crypto };
}

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Helper DRY para mockar retornos sucessivos do crypto.getRandomValues
 */
function mockCryptoValues(...values) {
  let callIndex = 0;
  return vi.spyOn(globalThis.window.crypto, "getRandomValues").mockImplementation((array) => {
    const value = values[callIndex % values.length];
    callIndex++;
    array[0] = value;
    return array;
  });
}

describe("getSecureRandomInt", () => {
  it("retorna um valor dentro do intervalo", () => {
    const resultado = getSecureRandomInt(3, 8);

    expect(resultado).toBeGreaterThanOrEqual(3);
    expect(resultado).toBeLessThanOrEqual(8);
  });

  it("retorna o único valor quando min e max são iguais", () => {
    expect(getSecureRandomInt(5, 5)).toBe(5);
  });

  it("lança erro para um intervalo invertido", () => {
    expect(() => getSecureRandomInt(8, 3)).toThrow();
  });

  it("lança erro para limites fracionários", () => {
    expect(() => getSecureRandomInt(1.5, 3)).toThrow();
  });

  it("funciona com um intervalo de exatamente 2 ** 32 valores", () => {
    mockCryptoValues(0xFFFFFFFF);
    expect(getSecureRandomInt(0, 2 ** 32 - 1)).toBe(2 ** 32 - 1);
  });

  it("lança RangeError para intervalos maiores que 2 ** 32 valores", () => {
    expect(() => getSecureRandomInt(0, 2 ** 32)).toThrow(RangeError);
  });
});

describe("criarFaixa / gerarIntervalo", () => {
  it("cria uma faixa inclusiva de 1 a 5", () => {
    expect(criarFaixa(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("cria uma faixa com um único valor quando mínimo e máximo são iguais", () => {
    expect(criarFaixa(4, 4)).toEqual([4]);
  });

  it("gerarIntervalo funciona como alias de criarFaixa (SSoT)", () => {
    expect(gerarIntervalo(1, 3)).toEqual(criarFaixa(1, 3));
  });
});

describe("sortearNumeros", () => {
  it("sorteia números únicos dentro do intervalo na quantidade pedida (sem repetição)", () => {
    mockCryptoValues(0);

    const { sorteados } = sortearNumeros({
      minimo: 1,
      maximo: 3,
      quantidade: 2,
      semRepeticao: true,
      disponiveis: [1, 2, 3],
    });

    expect(new Set(sorteados).size).toBe(sorteados.length);
    expect(sorteados).toHaveLength(2);
    expect(sorteados.every((numero) => numero >= 1 && numero <= 3)).toBe(true);
  });

  it("não inclui os números sorteados nos números restantes", () => {
    mockCryptoValues(0);

    const { sorteados, restantes } = sortearNumeros({
      minimo: 1,
      maximo: 3,
      quantidade: 2,
      semRepeticao: true,
      disponiveis: [1, 2, 3],
    });

    expect(sorteados.every((numero) => !restantes.includes(numero))).toBe(true);
    expect(restantes).toEqual([3]);
  });

  it("rejeita quando a quantidade excede os números disponíveis", () => {
    const disponiveis = [1, 2];

    expect(() =>
      sortearNumeros({
        minimo: 1,
        maximo: 3,
        quantidade: 3,
        semRepeticao: true,
        disponiveis,
      })
    ).toThrow(RangeError);
    expect(disponiveis).toEqual([1, 2]);
  });

  it("permite sorteio com repetição (sem alterar disponíveis)", () => {
    mockCryptoValues(0);

    const { sorteados, restantes } = sortearNumeros({
      minimo: 1,
      maximo: 5,
      quantidade: 3,
      semRepeticao: false,
      disponiveis: [1, 2, 3, 4, 5],
    });

    expect(sorteados).toHaveLength(3);
    expect(sorteados.every((n) => n >= 1 && n <= 5)).toBe(true);
    expect(restantes).toEqual([1, 2, 3, 4, 5]);
  });
});
