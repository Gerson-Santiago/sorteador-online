import { describe, expect, it } from 'vitest';
import { semRepeticaoEsgotada } from '../../../src/features/sorteio/componentes/sorteioButtonUtils';

describe('semRepeticaoEsgotada', () => {
  it('indica indisponibilidade quando todos os números sem repetição foram usados', () => {
    expect(semRepeticaoEsgotada({ semRepeticao: true }, [])).toBe(true);
  });

  it('mantém o botão disponível enquanto há números restantes', () => {
    expect(semRepeticaoEsgotada({ semRepeticao: true }, [1])).toBe(false);
  });

  it('mantém a regra atual quando a configuração permite repetição', () => {
    expect(semRepeticaoEsgotada({ semRepeticao: false }, [])).toBe(false);
  });
});
