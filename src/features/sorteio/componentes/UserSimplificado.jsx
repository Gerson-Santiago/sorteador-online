// src/components/UserInfoSimplificado.jsx
import React from 'react';

export default function UserInfoSimplificado({ user, onLogout }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Exibe a foto do usuário ou uma imagem padrão */}
      {/* Exibe o nome do usuário */}

      <img
        src={user.foto || user.picture}
        alt={user.nome || 'Usuário'}
        className="w-9 h-9 rounded-full border border-blue-300 shadow-sm"
      />

      <button
        onClick={onLogout}
        className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full hover:bg-red-200 transition"
      >
        Sair
      </button>
    </div>
  );
}
