import { describe, expect, it, vi } from 'vitest';
import {
  criarUrlMiniPlayer,
  MINI_PLAYER_MESSAGE,
  MINI_PLAYER_QUERY_PARAM,
  MINI_PLAYER_ZOOM,
  limitarZoomMiniPlayer,
  processarMensagemMiniPlayer,
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

describe('processarMensagemMiniPlayer', () => {
  it('envia para a janela o estado atual do botão principal', () => {
    const publicarEstado = vi.fn();

    processarMensagemMiniPlayer({
      data: { type: MINI_PLAYER_MESSAGE.READY },
      desabilitado: true,
      publicarEstado,
      sortear: vi.fn(),
    });

    expect(publicarEstado).toHaveBeenCalledWith({
      type: MINI_PLAYER_MESSAGE.STATE,
      disabled: true,
    });
  });

  it('aciona a mesma ação de sorteio sem repetição quando a mini janela pede', () => {
    const sortearCompartilhado = vi.fn();

    processarMensagemMiniPlayer({
      data: { type: MINI_PLAYER_MESSAGE.DRAW },
      desabilitado: false,
      publicarEstado: vi.fn(),
      sortear: sortearCompartilhado,
    });

    expect(sortearCompartilhado).toHaveBeenCalledTimes(1);
    expect(sortearCompartilhado).toHaveBeenCalledWith(true);
  });

  it('ignora pedidos da mini janela enquanto o botão principal está desabilitado', () => {
    const sortearCompartilhado = vi.fn();

    processarMensagemMiniPlayer({
      data: { type: MINI_PLAYER_MESSAGE.DRAW },
      desabilitado: true,
      publicarEstado: vi.fn(),
      sortear: sortearCompartilhado,
    });

    expect(sortearCompartilhado).not.toHaveBeenCalled();
  });
});

describe('limitarZoomMiniPlayer', () => {
  it('limita o zoom aos valores mínimo e máximo', () => {
    expect(limitarZoomMiniPlayer(0)).toBe(MINI_PLAYER_ZOOM.MIN);
    expect(limitarZoomMiniPlayer(3)).toBe(MINI_PLAYER_ZOOM.MAX);
  });

  it('arredonda o zoom para incrementos de dez por cento', () => {
    expect(limitarZoomMiniPlayer(1.16)).toBe(1.2);
  });
});
