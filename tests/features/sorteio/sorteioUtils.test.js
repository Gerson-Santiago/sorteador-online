import { afterEach, describe, expect, it, vi } from "vitest";
import { getSecureRandomInt, sortearNumeros } from "../../../src/features/sorteio/sorteioUtils";

if (typeof globalThis.window === "undefined") {
  globalThis.window = { crypto: globalThis.crypto };
}

afterEach(() => {
  vi.restoreAllMocks();
});

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
});

describe("sortearNumeros", () => {
  it("sorteia números únicos dentro do intervalo na quantidade pedida", () => {
    vi.spyOn(globalThis.window.crypto, "getRandomValues").mockImplementation((array) => {
      array[0] = 0;
      return array;
    });

    const { sorteados } = sortearNumeros({
      minimo: 1,
      maximo: 3,
      quantidade: 2,
      semRepeticao: true,
      disponiveis: [1, 2, 3]
    });

    expect(new Set(sorteados).size).toBe(sorteados.length);
    expect(sorteados).toHaveLength(2);
    expect(sorteados.every((numero) => numero >= 1 && numero <= 3)).toBe(true);
  });

  it("não inclui os números sorteados nos números restantes", () => {
    vi.spyOn(globalThis.window.crypto, "getRandomValues").mockImplementation((array) => {
      array[0] = 0;
      return array;
    });

    const { sorteados, restantes } = sortearNumeros({
      minimo: 1,
      maximo: 3,
      quantidade: 2,
      semRepeticao: true,
      disponiveis: [1, 2, 3]
    });

    expect(sorteados.every((numero) => !restantes.includes(numero))).toBe(true);
    expect(restantes).toEqual([3]);
  });

  it("rejeita quando a quantidade excede os números disponíveis", () => {
    const disponiveis = [1, 2];

    expect(() => sortearNumeros({
      minimo: 1,
      maximo: 3,
      quantidade: 3,
      semRepeticao: true,
      disponiveis
    })).toThrow(RangeError);
    expect(disponiveis).toEqual([1, 2]);
  });
});
