import React, { useState } from 'react';
import MarqueeHeader from 'features/sorteio/componentes/MarqueeHeader';
import Login from './pages/Login';
import SorteadorOnline from 'features/sorteio/SorteioPage';
import { useAuth } from './context/AuthContext'; // somente useAuth

function App() {
  const { userInfo } = useAuth(); // use só o hook, não useContext(AuthContext)

  const [tituloMarquee, setTituloMarquee] = useState(
    "Seminário de Boas Práticas no uso da tecnologia!"
  );
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);

  return (
    <div>
      <MarqueeHeader titulo={tituloMarquee} speed={marqueeSpeed} />
      
      {!userInfo ? (
        <Login />
      ) : (
        <SorteadorOnline 
          tituloMarquee={tituloMarquee} 
          setTituloMarquee={setTituloMarquee}
          marqueeSpeed={marqueeSpeed}
          setMarqueeSpeed={setMarqueeSpeed}
        />
      )}
    </div>
  );
}

export default App;
