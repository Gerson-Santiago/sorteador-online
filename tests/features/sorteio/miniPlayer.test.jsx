import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MiniPlayer from '../../../src/features/sorteio/mini-player/MiniPlayer';

describe('MiniPlayer', () => {
  it('não exibe um botão para fechar a janela', () => {
    const markup = renderToStaticMarkup(<MiniPlayer />);

    expect(markup).not.toContain('aria-label="Fechar mini sorteador"');
  });
});
