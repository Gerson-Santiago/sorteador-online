import React from 'react';
import { Edit2, Check, X } from 'lucide-react';

export default function TituloEditable({
  titulo,
  setTitulo,
  editando,
  setEditando,
  onSalvar,
  onCancelar
}) {
  return (
    <div className="flex items-center gap-2">
      {editando ? (
        <>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="text-xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
            onKeyPress={(e) => e.key === 'Enter' && onSalvar()}
            autoFocus
          />
          <button
            onClick={onSalvar}
            className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
          >
            <Check size={20} />
          </button>
          <button
            onClick={onCancelar}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-gray-800">{titulo}</h1>
          <button
            onClick={() => setEditando(true)}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit2 size={18} />
          </button>
        </>
      )}
    </div>
  );
}
