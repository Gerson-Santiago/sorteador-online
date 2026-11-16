# Sorteador Online

Aplicação web responsiva para realizar sorteios de números em eventos.

🔗 **Acesse:** [gerson-santiago.github.io/sorteador-online](https://gerson-santiago.github.io/sorteador-online/)

## Funcionalidades

- Configure os números mínimo e máximo do sorteio.
- Escolha a quantidade de números a sortear (de 1 a 10).
- Faça sorteios com ou sem repetição.
- Acompanhe os resultados e horários no histórico da sessão.
- Edite o título do sorteio e o texto do banner superior.
- Ajuste a velocidade do banner ou deixe-o parado.
- Reinicie o sorteio e o histórico a qualquer momento.

Os resultados são gerados com `crypto.getRandomValues()` e rejection sampling para evitar viés na seleção. No modo sem repetição, os números sorteados são removidos do conjunto disponível até o sorteio ser reiniciado ou o intervalo ser alterado.

## Tecnologias

- React 19 e Vite
- Tailwind CSS
- Lucide React
- Vitest
- Web Crypto API
- GitHub Pages

## Requisitos

- Node.js compatível com a versão do Vite usada pelo projeto
- pnpm

## Executar localmente

```bash
# Clone o repositório
git clone https://github.com/Gerson-Santiago/sorteador-online.git
cd sorteador-online

# Instale as dependências usando o lockfile do projeto
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

O Vite informará no terminal o endereço local para abrir no navegador.

## Comandos

```bash
pnpm dev             # Servidor de desenvolvimento
pnpm build           # Gera a versão de produção em dist/
pnpm preview         # Visualiza localmente a versão de produção
pnpm test            # Executa os testes
pnpm test:coverage   # Executa os testes e gera cobertura
pnpm deploy          # Gera a build e publica em GitHub Pages
```

## Estrutura principal

```text
src/
├── App.jsx
├── features/
│   ├── AutorFooter.jsx
│   └── sorteio/
│       ├── EventoContext.jsx
│       ├── HistoricoSorteios.jsx
│       ├── SorteioConfig.jsx
│       ├── SorteioPage.jsx
│       ├── sorteioUtils.js
│       ├── useSorteio.js
│       └── componentes/
└── styles/
    └── index.css
```

As configurações do evento são compartilhadas por contexto; a lógica de estado do sorteio está em `useSorteio.js`, e as regras de geração ficam em `sorteioUtils.js`.
