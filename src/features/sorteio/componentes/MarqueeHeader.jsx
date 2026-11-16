// src/features/sorteio/componentes/MarqueeHeader.jsx

/**
 * Banner de topo com animação marquee via CSS transform.
 * Usa keyframe definido no index.css (marquee-scroll).
 * speed=0 deixa o texto estático, qualquer valor > 0 anima.
 */
export default function MarqueeHeader({ titulo, speed }) {
  return (
    <div
      className="bg-blue-600 text-white p-4 mb-2 font-bold overflow-hidden text-center"
      style={{ fontSize: '2rem' }}
    >
      <span
        style={
          speed > 0
            ? {
                display: 'inline-block',
                animation: `marquee-scroll ${speed}s linear infinite`,
              }
            : undefined
        }
      >
        {titulo}
      </span>
    </div>
  );
}
