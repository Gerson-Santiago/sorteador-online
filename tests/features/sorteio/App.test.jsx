import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../../src/App';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderiza o sorteador principal fora da rota mini-player', () => {
    vi.stubGlobal('window', { location: { search: '' } });

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('Sortear Agora');
    expect(markup).toContain('Histórico');
    expect(markup).toContain('Nenhum sorteio realizado ainda');
    expect(markup).toContain('Desenvolvido por');
    expect(markup).not.toContain('Mini sorteador');
  });

  it('renderiza a mini janela quando o parâmetro mini-player está presente', () => {
    vi.stubGlobal('window', { location: { search: '?mini-player=1' } });

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('Mini sorteador');
    expect(markup).toContain('Aguardando conexão com o sorteio principal');
    expect(markup).not.toContain('Sortear Agora');
  });
});
