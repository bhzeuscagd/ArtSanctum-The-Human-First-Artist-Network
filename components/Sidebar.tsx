
import React from 'react';
import { Shield } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex sticky top-0 h-screen flex-col p-4 border-r border-zinc-800 w-[275px]">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Shield className="text-white" size={24} />
        </div>
        <h1 className="font-brand font-bold text-2xl tracking-tight text-white uppercase italic">ArtX Core</h1>
      </div>
      
      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Gremio de Artistas</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Bienvenido al centro de mando. Aquí la IA no crea, solo protege. 
        </p>
        <div className="mt-6 space-y-3">
           <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Sincronización Neural Activa
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Protección Pixel-Guard V2.4
           </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-800/50">
          <p className="text-[10px] text-zinc-600 uppercase font-black">Algorithm build 0.9.12</p>
      </div>
    </div>
  );
};

export default Sidebar;
