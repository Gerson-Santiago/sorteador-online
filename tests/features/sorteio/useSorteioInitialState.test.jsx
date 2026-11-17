import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useSorteio } from '../../../src/features/sorteio/useSorteio';

function EstadoInicialSorteio() {
  const {
    config,
    numerosDisponiveis,
    numeroSorteado,
    historico,
    animandoSorteio,
  } = useSorteio();

  return (
    <pre>
      {JSON.stringify({
        config,
        numerosDisponiveis: [
          numerosDisponiveis[0],
          numerosDisponiveis[numerosDisponiveis.length - 1],
          numerosDisponiveis.length,
        ],
        numeroSorteado,
        historico,
        animandoSorteio,
      })}
    </pre>
  );
}

describe('useSorteio', () => {
  it('inicia com as configurações e o estado padrão do sorteio', () => {
    const markup = renderToStaticMarkup(<EstadoInicialSorteio />);

    expect(markup.replace(/&quot;/g, '"')).toContain(
      '{"config":{"minimo":1,"maximo":200,"quantidade":1,"semRepeticao":true},"numerosDisponiveis":[1,200,200],"numeroSorteado":null,"historico":[],"animandoSorteio":false}'
    );
  });
});
