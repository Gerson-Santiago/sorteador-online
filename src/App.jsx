// src/App.jsx
import { EventoProvider } from 'features/sorteio/EventoContext';
import {
  MiniPlayer,
  MINI_PLAYER_QUERY_PARAM,
} from 'features/sorteio/mini-player';
import SorteadorOnline from 'features/sorteio/SorteioPage';
import AutorFooter from 'features/AutorFooter';

/**
 * Conteúdo interno que consome o EventoContext.
 * Separado de App para poder usar useEvento() dentro do provider.
 */
function AppContent() {
  const isMiniPlayer = new URLSearchParams(window.location.search).has(
    MINI_PLAYER_QUERY_PARAM
  );

  if (isMiniPlayer) return <MiniPlayer />;

  return (
    <div>
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
