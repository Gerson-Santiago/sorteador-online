// src/App.jsx
import { EventoProvider, useEvento } from 'features/sorteio/EventoContext';
import MarqueeHeader from 'features/sorteio/componentes/MarqueeHeader';
import SorteadorOnline from 'features/sorteio/SorteioPage';
import AutorFooter from 'features/AutorFooter';

/**
 * Conteúdo interno que consome o EventoContext.
 * Separado de App para poder usar useEvento() dentro do provider.
 */
function AppContent() {
  const { marqueeTexto, marqueeSpeed } = useEvento();
  return (
    <div>
      <MarqueeHeader titulo={marqueeTexto} speed={marqueeSpeed} />
      <SorteadorOnline />
      <AutorFooter />
    </div>
  );
}

/**
 * Raiz da aplicação.
 * EventoProvider envolve tudo — elimina o prop drilling de titulo/marquee
 * que antes atravessava App → SorteioPage → SorteioConfig.
 */
export default function App() {
  return (
    <EventoProvider>
      <AppContent />
    </EventoProvider>
  );
}
