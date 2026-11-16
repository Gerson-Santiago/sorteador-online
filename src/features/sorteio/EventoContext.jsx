// src/features/sorteio/EventoContext.jsx
import { createContext, useContext, useState } from 'react';

const EventoContext = createContext(null);

/**
 * Provedor do contexto de evento — elimina o prop drilling de
 * titulo, marqueeTexto e marqueeSpeed por toda a árvore de componentes.
 */
export function EventoProvider({ children }) {
  const [titulo, setTitulo] = useState('Sorteio de Números');
  const [marqueeTexto, setMarqueeTexto] = useState('Seminário de Boas Práticas');
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);

  return (
    <EventoContext.Provider
      value={{ titulo, setTitulo, marqueeTexto, setMarqueeTexto, marqueeSpeed, setMarqueeSpeed }}
    >
      {children}
    </EventoContext.Provider>
  );
}

/**
 * Hook para consumir o EventoContext.
 * Lança erro descritivo se usado fora do EventoProvider.
 */
export function useEvento() {
  const ctx = useContext(EventoContext);
  if (!ctx) throw new Error('useEvento deve ser usado dentro de <EventoProvider>');
  return ctx;
}