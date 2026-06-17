import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as direccionesService from '../services/direcciones';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import type { Direccion, DireccionCreate, DireccionUpdate } from '../types';

const emptyForm: DireccionCreate = {
  alias: '', direccion: '', ciudad: '', codigo_postal: '', es_principal: false,
};

export default function MisDirecciones() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Direccion | null>(null);
  const [form, setForm] = useState<DireccionCreate>({ ...emptyForm });

  const { data: direcciones, isLoading } = useQuery({
    queryKey: ['direcciones'],
    queryFn: direccionesService.getDirecciones,
  });

  const createMut = useMutation({
    mutationFn: direccionesService.createDireccion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      setModalOpen(false);
      setForm({ ...emptyForm });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DireccionUpdate }) =>
      direccionesService.updateDireccion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      setModalOpen(false);
      setEditando(null);
      setForm({ ...emptyForm });
    },
  });

  const deleteMut = useMutation({
    mutationFn: direccionesService.deleteDireccion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direcciones'] }),
  });

  const setPrincipalMut = useMutation({
    mutationFn: direccionesService.setDireccionPrincipal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direcciones'] }),
  });

  const abrirModal = (dir?: Direccion) => {
    if (dir) {
      setEditando(dir);
      setForm({
        alias: dir.alias,
        direccion: dir.direccion,
        ciudad: dir.ciudad,
        codigo_postal: dir.codigo_postal,
        es_principal: dir.es_principal,
      });
    } else {
      setEditando(null);
      setForm({ ...emptyForm });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      updateMut.mutate({ id: editando.id, data: form });
    } else {
      createMut.mutate(form);
    }
  };

  if (isLoading) return <LoadingSpinner text="Cargando direcciones..." />;

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              📍 Mis Direcciones
            </span>
          </h1>
          <p className="text-gray-500 text-lg">Gestioná tus direcciones de entrega</p>
        </div>
        <button onClick={() => abrirModal()}
          className="btn-primary text-base px-6 py-3">
          + Nueva Dirección
        </button>
      </div>

      <div className="space-y-4">
        {(!direcciones || direcciones.length === 0) ? (
          <EmptyState icon="📍" title="No tenés direcciones guardadas"
            subtitle="Agregá una dirección para recibir tus pedidos" />
        ) : (
          direcciones.map((dir) => (
            <div key={dir.id} className="card p-5 flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">{dir.alias}</h3>
                  {dir.es_principal && (
                    <span className="badge badge-amber text-[10px]">⭐ Principal</span>
                  )}
                </div>
                <p className="text-gray-300">{dir.direccion}</p>
                <p className="text-gray-500 text-sm">{dir.ciudad} — CP: {dir.codigo_postal}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!dir.es_principal && (
                  <button onClick={() => setPrincipalMut.mutate(dir.id)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-400 text-sm transition cursor-pointer"
                    title="Marcar como principal">
                    ⭐
                  </button>
                )}
                <button onClick={() => abrirModal(dir)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition cursor-pointer">
                  ✏️
                </button>
                <button onClick={() => deleteMut.mutate(dir.id)}
                  className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 text-sm transition cursor-pointer">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="card w-full max-w-lg p-8 animate-fadeInUp">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {editando ? 'Editar Dirección' : 'Nueva Dirección'}
              </span>
            </h2>
            <div className="grid gap-4">
              <input type="text" placeholder="Alias (ej: Casa, Trabajo)" value={form.alias}
                onChange={(e) => setForm({ ...form, alias: e.target.value })}
                className="input" required />
              <input type="text" placeholder="Dirección (calle y número)" value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="input" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Ciudad" value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  className="input" required />
                <input type="text" placeholder="Código Postal" value={form.codigo_postal}
                  onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
                  className="input" required />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={form.es_principal}
                  onChange={(e) => setForm({ ...form, es_principal: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-white/10 text-amber-500 focus:ring-amber-500" />
                Establecer como dirección principal
              </label>
            </div>
            <div className="flex gap-3 justify-end pt-6">
              <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }}
                className="btn-secondary text-base px-6 py-3">Cancelar</button>
              <button type="submit" className="btn-primary text-base px-6 py-3">
                {editando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
