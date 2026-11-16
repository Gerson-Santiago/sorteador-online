import { describe, expect, it } from 'vitest';
import {
  criarUrlMiniPlayer,
  MINI_PLAYER_QUERY_PARAM,
} from '../../../src/features/sorteio/componentes/miniPlayerProtocol';

describe('criarUrlMiniPlayer', () => {
  it('adiciona a rota da mini janela sem perder parâmetros existentes', () => {
    const url = new URL(criarUrlMiniPlayer('https://exemplo.com/sorteio?evento=anual#resultado'));

    expect(url.searchParams.get('evento')).toBe('anual');
    expect(url.searchParams.get(MINI_PLAYER_QUERY_PARAM)).toBe('1');
    expect(url.hash).toBe('#resultado');
  });

  it('substitui o parâmetro da mini janela se ele já existir', () => {
    const url = new URL(
      criarUrlMiniPlayer('https://exemplo.com/sorteio?mini-player=0')
    );

    expect(url.searchParams.getAll(MINI_PLAYER_QUERY_PARAM)).toEqual(['1']);
  });
});
