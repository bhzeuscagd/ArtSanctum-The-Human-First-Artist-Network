
import React from 'react';
import { X, Share2, Download, ShieldCheck, Zap, Info, Hash } from 'lucide-react';
import { Post, AssetPermission } from '../types';

interface AssetModalProps {
  post: Post;
  assetUrl: string;
  onClose: () => void;
  permission?: AssetPermission;
}

const AssetModal: React.FC<AssetModalProps> = ({ post, assetUrl, onClose, permission }) => {
  const getPermissionLabel = () => {
    switch (permission) {
      case 'DOWNLOAD': return 'PROPIEDAD TOTAL (Download habilitado)';
      case 'USAGE': return 'USO CREATIVO (Licencia abierta)';
      default: return 'SÓLO LECTURA (Cifrado de Gremio)';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col md:flex-row animate-in fade-in duration-300">
      {/* Visualización del Asset */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
        <img 
          src={assetUrl} 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          alt="Vanguard Full View" 
        />
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-rose-500 rounded-full text-white transition-all shadow-xl md:hidden"
        >
          <X size={24} />
        </button>
      </div>

      {/* Panel de Control y Metadatos */}
      <div className="w-full md:w-[450px] bg-zinc-950 border-l border-zinc-900 p-8 flex flex-col gap-8 overflow-y-auto">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <img src={post.avatar} className="w-10 h-10 rounded-full border border-zinc-800" alt="" />
              <div>
                <p className="text-sm font-black text-white uppercase">{post.artistName}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">@{post.handle}</p>
              </div>
           </div>
           <button onClick={onClose} className="hidden md:block p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Metadatos Superiores (Hashtags) */}
        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Hash size={14} /> Frecuencias de Metadatos
            </h4>
            <div className="flex flex-wrap gap-2">
                {post.hashtags.map((tag, i) => (
                    <span key={i} className="bg-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-black text-zinc-300 border border-zinc-800">
                        #{tag.replace('#', '')}
                    </span>
                ))}
            </div>
        </div>

        {/* Descripción de Obra */}
        <div className="space-y-4 flex-1">
            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Manifiesto Visual</h4>
            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                {post.content}
            </p>
        </div>

        {/* Protocolo de Licencia */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Estado de Licencia</span>
            </div>
            <p className="text-[11px] font-black text-white">{getPermissionLabel()}</p>
            <div className="flex gap-2">
                <button className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center justify-center text-white transition-all border border-white/5">
                    <Share2 size={18} />
                </button>
                {permission === 'DOWNLOAD' && (
                    <button className="flex-[3] bg-amber-500 hover:bg-white text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                        <Download size={16} /> Descargar Master
                    </button>
                )}
            </div>
        </div>

        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
            <Zap className="text-amber-500 shrink-0" size={16} />
            <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                Esta obra está protegida bajo los protocolos Vanguard. Cualquier reproducción fuera del Gremio sin autorización será rastreada mediante firma neural.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
