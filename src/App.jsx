// sorteador-online/src/App.jsx
import React from 'react';
import SorteadorOnline from 'features/sorteio/SorteioPage'

function App() {
  return (
    <div>
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
            animation: 'marquee 25s linear infinite',
          }}
        >
          Seminário de Boas Práticas no uso da tecnologia!
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
      <SorteadorOnline />
    </div>
  )
}

export default App;
