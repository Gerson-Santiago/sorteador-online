// src/features/sorteio/componentes/TituloEditavel.jsx
import { Edit2, Check, X } from 'lucide-react';

/**
 * Componente de título inline editável.
 * Aceita onIniciarEdicao opcional para permitir salvar o valor anterior
 * antes de entrar no modo de edição (fix do cancel hardcoded).
 */
export default function TituloEditavel({
  titulo,
  setTitulo,
  editando,
  setEditando,
  onIniciarEdicao,
  onSalvar,
  onCancelar,
}) {
  const handleIniciarEdicao = () => {
    onIniciarEdicao?.(); // notifica o pai para salvar o valor anterior
    setEditando(true);
  };

  return (
    <div className="flex items-center gap-2">
      {editando ? (
        <>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="text-xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
            onKeyDown={(e) => e.key === 'Enter' && onSalvar()} // onKeyPress foi depreciado
            autoFocus
          />
          <button
            onClick={onSalvar}
            className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
            aria-label="Salvar título"
          >
            <Check size={20} />
          </button>
          <button
            onClick={onCancelar}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Cancelar edição"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-gray-800">{titulo}</h1>
          <button
            onClick={handleIniciarEdicao}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Editar título"
          >
            <Edit2 size={18} />
          </button>
        </>
      )}
    </div>
  );
}
