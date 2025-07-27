// src/App.jsx
import React, { useState } from 'react';
import MarqueeHeader from 'features/sorteio/componentes/MarqueeHeader';
import SorteadorOnline from 'features/sorteio/SorteioPage';

function App() {
  const [tituloMarquee, setTituloMarquee] = useState(
    "Seminário de Boas Práticas no uso da tecnologia!"
  );
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);

  return (
    <div>
      <MarqueeHeader 
        titulo={tituloMarquee} 
        speed={marqueeSpeed} 
      />
      <SorteadorOnline 
        tituloMarquee={tituloMarquee} 
        setTituloMarquee={setTituloMarquee}
        marqueeSpeed={marqueeSpeed}
        setMarqueeSpeed={setMarqueeSpeed}
      />
    </div>
  );
}

export default App;
