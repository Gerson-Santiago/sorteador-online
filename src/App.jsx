// sorteador-online/src/App.jsx
import React from 'react';
import SorteadorOnline from 'features/sorteio/SorteioPage'

function App() {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded mb-4">
        Seminário de Boas Práticas no uso da tecnologia!
      </div>
      <SorteadorOnline />
    </div>
  );
}

export default App;
