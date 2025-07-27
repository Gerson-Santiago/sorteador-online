// src/components/MarqueeHeader.jsx
import React from 'react';

export default function MarqueeHeader({ titulo, speed }) {
  // Monta a string de style para animação (ou vazio se speed = 0)
  const animationStyle =
    speed > 0 
      ? `marquee ${speed}s linear infinite`
      : undefined;

  return (
    <div
      className="bg-blue-600 text-white p-4 rounded mb-2 text-center font-bold"
      style={{
        fontSize: '2rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          animation: animationStyle,
        }}
      >
        {titulo}
      </span>
      <style>
        {`
          @keyframes marquee {
            0% { left: 100%; }
            100% { left: -100%; }
          }
        `}
      </style>
    </div>
  );
}
