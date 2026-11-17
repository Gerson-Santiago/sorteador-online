import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import EventoConfig from '../../../src/features/sorteio/SorteioConfig';
import { EventoProvider } from '../../../src/features/sorteio/EventoContext';
import HistoricoSorteios from '../../../src/features/sorteio/HistoricoSorteios';
import BotaoSortearSemRepetir from '../../../src/features/sorteio/componentes/BotaoSortearSemRepetir';
import DisplayNumeroSorteado from '../../../src/features/sorteio/componentes/DisplayNumeroSorteado';
import MarqueeHeader from '../../../src/features/sorteio/componentes/MarqueeHeader';
import TituloEditavel from '../../../src/features/sorteio/componentes/TituloEditavel';

describe('DisplayNumeroSorteado', () => {
  it('prioriza a animação enquanto o sorteio está em andamento', () => {
    const markup = renderToStaticMarkup(
      <DisplayNumeroSorteado numero={42} animando />
    );

    expect(markup).toContain('Sorteando...');
    expect(markup).not.toContain('>42<');
  });

  it('exibe o marcador inicial quando ainda não há resultado', () => {
    const markup = renderToStaticMarkup(
      <DisplayNumeroSorteado numero={null} animando={false} />
    );

    expect(markup).toContain('>?</div>');
  });

  it('exibe todos os números sorteados em modo apresentação', () => {
    const markup = renderToStaticMarkup(
      <DisplayNumeroSorteado numero={[3, 7]} animando={false} apresentacao />
    );

    expect(markup).toContain('>3</div>');
    expect(markup).toContain('>7</div>');
    expect(markup).toContain('text-5xl sm:text-6xl');
  });

  it('exibe um resultado único fora do modo apresentação', () => {
    const markup = renderToStaticMarkup(
      <DisplayNumeroSorteado numero={12} animando={false} />
    );

    expect(markup).toContain('>12</div>');
    expect(markup).toContain('text-7xl');
  });
});

describe('HistoricoSorteios', () => {
  it('informa que o histórico está vazio', () => {
    const markup = renderToStaticMarkup(<HistoricoSorteios historico={[]} />);

    expect(markup).toContain('(0)');
    expect(markup).toContain('Nenhum sorteio realizado ainda');
  });

  it('lista os resultados, horários e marca sorteios sem repetição', () => {
    const markup = renderToStaticMarkup(
      <HistoricoSorteios
        historico={[
          { id: 1, numeros: [4, 8], timestamp: '10:00:00', semRepeticao: true },
          { id: 2, numeros: [9], timestamp: '10:01:00', semRepeticao: false },
        ]}
      />
    );

    expect(markup).toContain('(2)');
    expect(markup).toContain('>4</span>');
    expect(markup).toContain('>8</span>');
    expect(markup).toContain('>9</span>');
    expect(markup).toContain('Único');
    expect(markup).toContain('10:00:00');
    expect(markup).toContain('10:01:00');
  });
});

describe('MarqueeHeader', () => {
  it('mantém o texto estático com velocidade zero', () => {
    const markup = renderToStaticMarkup(
      <MarqueeHeader titulo="Evento anual" speed={0} />
    );

    expect(markup).toContain('Evento anual');
    expect(markup).not.toContain('marquee-scroll');
  });

  it('aplica a animação com a velocidade configurada', () => {
    const markup = renderToStaticMarkup(
      <MarqueeHeader titulo="Evento anual" speed={4} />
    );

    expect(markup).toContain('marquee-scroll 4s linear infinite');
  });
});

describe('BotaoSortearSemRepetir', () => {
  it('desabilita o botão quando não há números disponíveis sem repetição', () => {
    const markup = renderToStaticMarkup(
      <BotaoSortearSemRepetir
        onSortear={() => {}}
        animandoSorteio={false}
        config={{ semRepeticao: true }}
        numerosDisponiveis={[]}
      />
    );

    expect(markup).toContain('disabled=""');
  });

  it('permite sorteio com repetição mesmo sem números disponíveis', () => {
    const markup = renderToStaticMarkup(
      <BotaoSortearSemRepetir
        onSortear={() => {}}
        animandoSorteio={false}
        config={{ semRepeticao: false }}
        numerosDisponiveis={[]}
      />
    );

    expect(markup).not.toContain('disabled=""');
  });

  it('desabilita o botão durante a animação e aplica o layout compacto', () => {
    const markup = renderToStaticMarkup(
      <BotaoSortearSemRepetir
        onSortear={() => {}}
        animandoSorteio
        config={{ semRepeticao: true }}
        numerosDisponiveis={[1]}
        compacto
      />
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('w-full px-4 py-3 text-base');
  });
});

describe('TituloEditavel', () => {
  const callbacks = {
    setTitulo: () => {},
    setEditando: () => {},
    onSalvar: () => {},
    onCancelar: () => {},
  };

  it('exibe o título e a ação de editar fora do modo de edição', () => {
    const markup = renderToStaticMarkup(
      <TituloEditavel titulo="Sorteio anual" editando={false} {...callbacks} />
    );

    expect(markup).toContain('Sorteio anual');
    expect(markup).toContain('aria-label="Editar título"');
  });

  it('exibe campo de texto e ações ao editar', () => {
    const markup = renderToStaticMarkup(
      <TituloEditavel titulo="Sorteio anual" editando {...callbacks} />
    );

    expect(markup).toContain('value="Sorteio anual"');
    expect(markup).toContain('aria-label="Salvar título"');
    expect(markup).toContain('aria-label="Cancelar edição"');
  });
});

describe('SorteioConfig', () => {
  it('exibe os valores de configuração recebidos e os padrões do evento', () => {
    const markup = renderToStaticMarkup(
      <EventoProvider>
        <EventoConfig
          config={{ minimo: 2, maximo: 50, quantidade: 3, semRepeticao: true }}
          setConfig={() => {}}
          resetarSorteio={() => {}}
          onFechar={() => {}}
        />
      </EventoProvider>
    );

    expect(markup).toContain('value="2"');
    expect(markup).toContain('value="50"');
    expect(markup).toContain('value="3"');
    expect(markup).toContain('Seminário de Boas Práticas');
    expect(markup).toContain('value="0"');
    expect(markup).toContain('Resetar Sorteio');
  });
});
