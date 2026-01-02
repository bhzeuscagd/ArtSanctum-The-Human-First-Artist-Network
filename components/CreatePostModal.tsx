
import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, ShieldCheck, Loader2, Plus, Lock, Zap, Type, Link as LinkIcon, Video, Timer, Sparkles, HeartHandshake, Coins, Check, Eye, Clock, CloudDownload, Hand, ToggleLeft, ToggleRight } from 'lucide-react';
import { analyzeUpload, suggestHashtags } from '../services/geminiService';
import { Post, AlbumImage, LinkMetadata, AssetPermission } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const [postType, setPostType] = useState<'text' | 'media' | 'link'>('media');
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [videoPreviewLength, setVideoPreviewLength] = useState<5 | 10 | 15>(5);
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(true);
  const [pricingMode, setPricingMode] = useState<'BUNDLE' | 'INDIVIDUAL'>('BUNDLE');
  const [bundlePrice, setBundlePrice] = useState(0); 

  const [earlyAccessDays, setEarlyAccessDays] = useState<number>(0);

  const [assetConfigs, setAssetConfigs] = useState<Record<number, { 
    price: number, 
    isFree: boolean, 
    isFlexible: boolean,
    permission: AssetPermission
  }>>({});

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((content.length > 10 || linkUrl.length > 5) && !analyzing) {
        const suggested = await suggestHashtags(content || linkUrl, postType);
        setHashtags(prev => Array.from(new Set([...prev, ...suggested])).slice(0, 10));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, linkUrl, postType]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const readers = files.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        const startIdx = images.length;
        setImages(prev => [...prev, ...results]);
        
        const newConfigs = { ...assetConfigs };
        results.forEach((_, i) => {
            newConfigs[startIdx + i] = { price: 0, isFree: true, isFlexible: false, permission: 'PREVIEW' };
        });
        setAssetConfigs(newConfigs);

        runMediaAnalysis(results);
      });
    }
  };

  const runMediaAnalysis = async (newFiles: string[]) => {
    setAnalyzing(true);
    try {
      for (const file of newFiles) {
        if (file.startsWith('data:image/')) {
          const result = await analyzeUpload(file);
          setHashtags(prev => Array.from(new Set([...prev, ...result.hashtags])));
          if (!content) setContent(result.suggestedCaption);
        } else {
            const suggested = await suggestHashtags("Nuevo asset visual de video", "video");
            setHashtags(prev => Array.from(new Set([...prev, ...suggested])));
        }
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const updateAssetConfig = (idx: number, key: string, value: any) => {
    setAssetConfigs(prev => ({
        ...prev,
        [idx]: { ...prev[idx], [key]: value }
    }));
  };

  const hasPaidMedia = () => {
    if (pricingMode === 'BUNDLE') return bundlePrice > 0 || earlyAccessDays > 0;
    return Object.values(assetConfigs).some((c: any) => !c.isFree) || earlyAccessDays > 0;
  };

  const executeDeployment = async () => {
    setIsDeploying(true);
    const steps = ["Inyectando Cifrado...", "Validando Trust Score...", "Publicando en el Gremio..."];
    for (const step of steps) {
        setDeployStatus(step);
        await new Promise(r => setTimeout(r, 600));
    }

    const type = postType === 'media' ? (images.some(i => i.startsWith('data:video/')) ? 'video' : (images.length > 1 ? 'album' : 'image')) : postType;

    const earlyAccessDate = earlyAccessDays > 0 
        ? new Date(Date.now() + earlyAccessDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

    const albumData: AlbumImage[] = images.map((url, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        url,
        price: assetConfigs[i]?.price || 0,
        isFree: assetConfigs[i]?.isFree || false,
        isFlexible: assetConfigs[i]?.isFlexible || false,
        minPrice: 1,
        visualDescription: "Vanguard Asset",
        permission: assetConfigs[i]?.permission || 'PREVIEW'
    }));

    onPostCreated({
      id: Math.random().toString(36).substr(2, 9),
      artistName: "Vanguard Artist",
      handle: "vanguard_core",
      avatar: "https://picsum.photos/id/10/200/200",
      timestamp: "Ahora mismo",
      content: content,
      hashtags: hashtags,
      likes: 0,
      stars: 0,
      shares: 0,
      commentsCount: 0,
      isVerified: true,
      type: type as any,
      album: albumData,
      imageUrl: images[0],
      videoUrl: type === 'video' ? images[0] : undefined,
      videoPreviewLength: hasPaidMedia() ? videoPreviewLength : undefined,
      isPreviewEnabled: isPreviewEnabled,
      bundlePrice: bundlePrice,
      drmActive: type !== 'text',
      pricingMode: pricingMode,
      earlyAccessDate: earlyAccessDate
    });
    onClose();
  };

  if (isDeploying) return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-3xl">
        <div className="text-center space-y-6">
            <Loader2 className="animate-spin text-amber-500 mx-auto" size={48} />
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">{deployStatus}</p>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl rounded-[3.5rem] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
            <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors"><X size={22} /></button>
            <div className="flex bg-black p-1 rounded-full border border-zinc-800 shadow-inner">
                {[
                    {id: 'text', icon: <Type size={16} />},
                    {id: 'media', icon: <Video size={16} />},
                    {id: 'link', icon: <LinkIcon size={16} />}
                ].map(t => (
                    <button key={t.id} onClick={() => setPostType(t.id as any)} className={`p-2 px-6 rounded-full transition-all text-[11px] font-black flex items-center gap-2 ${postType === t.id ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-600'}`}>
                        {t.icon} <span className="hidden md:inline uppercase tracking-widest">{t.id}</span>
                    </button>
                ))}
            </div>
            <button onClick={executeDeployment} disabled={analyzing} className="bg-amber-500 hover:bg-white text-black px-10 py-2.5 rounded-full font-black text-[10px] uppercase shadow-lg disabled:opacity-30 transition-all">
                {analyzing ? 'Sincronizando...' : 'Desplegar'}
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="flex gap-6">
                <img src="https://picsum.photos/id/10/200/200" className="w-16 h-16 rounded-full ring-2 ring-zinc-900" alt="" />
                <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-medium placeholder-zinc-800 min-h-[120px] resize-none"
                    placeholder="Describe tu visión para el Gremio..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {postType === 'media' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-zinc-800 relative group transition-all duration-300 hover:border-amber-500">
                                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="bg-rose-500 p-2.5 rounded-full text-white shadow-xl"><X size={16} /></button>
                                </div>
                                {assetConfigs[i]?.isFree && !earlyAccessDays && (
                                    <div className="absolute top-3 left-3 bg-emerald-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Free</div>
                                )}
                            </div>
                        ))}
                        <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center text-zinc-800 hover:border-amber-500 hover:text-amber-500 transition-all gap-3">
                            <Plus size={36} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cargar Arte</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" onChange={handleFilesChange} />
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Panel de Mercado */}
                            <div className="bg-zinc-900/20 p-8 rounded-[3.5rem] border border-zinc-800 space-y-8">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                                    <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] flex items-center gap-3">
                                        <Coins size={20} className="text-amber-500" /> Mercado & Chronos
                                    </h3>
                                    <div className="flex bg-black p-1.5 rounded-full border border-zinc-800">
                                        <button onClick={() => setPricingMode('BUNDLE')} className={`px-6 py-2 rounded-full text-[9px] font-black transition-all ${pricingMode === 'BUNDLE' ? 'bg-amber-500 text-black' : 'text-zinc-600'}`}>PACK</button>
                                        <button onClick={() => setPricingMode('INDIVIDUAL')} className={`px-6 py-2 rounded-full text-[9px] font-black transition-all ${pricingMode === 'INDIVIDUAL' ? 'bg-amber-500 text-black' : 'text-zinc-600'}`}>PIEZAS</button>
                                    </div>
                                </div>

                                {/* Selector de Early Access */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={14} className="text-amber-500" /> Liberación Temporal
                                        </span>
                                        <span className="text-xs font-black text-amber-500">{earlyAccessDays === 0 ? 'INSTANTÁNEO' : `${earlyAccessDays} DÍAS`}</span>
                                    </div>
                                    <input type="range" min="0" max="30" step="1" value={earlyAccessDays} onChange={(e) => setEarlyAccessDays(Number(e.target.value))} className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-full appearance-none" />
                                </div>

                                {pricingMode === 'BUNDLE' ? (
                                    <div className="space-y-6 pt-4">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase">Inversión por Pack</p>
                                                <p className="text-4xl font-black text-amber-500">{bundlePrice} SVG</p>
                                            </div>
                                        </div>
                                        <input type="range" min="0" max="5000" step="50" value={bundlePrice} onChange={(e) => setBundlePrice(Number(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {images.map((img, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-3xl border border-zinc-800/50">
                                                <img src={img} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <input type="number" placeholder="SVG" value={assetConfigs[i]?.price} onChange={(e) => updateAssetConfig(i, 'price', Number(e.target.value))} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-amber-500 font-bold" />
                                                    <button onClick={() => updateAssetConfig(i, 'isFree', !assetConfigs[i]?.isFree)} className={`px-3 py-1.5 rounded-xl text-[8px] font-black border ${assetConfigs[i]?.isFree ? 'border-emerald-500/30 text-emerald-500' : 'border-rose-500/30 text-rose-500'}`}>
                                                        {assetConfigs[i]?.isFree ? 'FREE' : 'PAID'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Panel de Permisos & Licencias */}
                            <div className="bg-zinc-900/20 p-8 rounded-[3.5rem] border border-zinc-800 space-y-8">
                                <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-amber-500" /> Protocolo de Permisos
                                </h3>
                                
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {images.map((img, i) => (
                                        <div key={i} className="bg-black/40 p-5 rounded-3xl border border-zinc-800/50 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <img src={img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                <span className="text-[10px] font-black text-zinc-500 uppercase">Configurar Licencia #{i+1}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {[
                                                    { id: 'PREVIEW', icon: <Eye size={12} />, label: 'Sólo Lectura' },
                                                    { id: 'USAGE', icon: <Hand size={12} />, label: 'Uso Abierto' },
                                                    { id: 'DOWNLOAD', icon: <CloudDownload size={12} />, label: 'Descarga Master' }
                                                ].map(perm => (
                                                    <button 
                                                        key={perm.id}
                                                        onClick={() => updateAssetConfig(i, 'permission', perm.id)}
                                                        className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all border ${assetConfigs[i]?.permission === perm.id ? 'bg-amber-500 border-amber-500 text-black shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-300'}`}
                                                    >
                                                        {perm.icon}
                                                        <span className="text-[7px] font-black uppercase">{perm.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Configuración de Previsualización Global - Se activa si hay contenido de pago */}
            {postType === 'media' && hasPaidMedia() && (
                <div className="bg-zinc-900/30 p-10 rounded-[3.5rem] border border-zinc-800 space-y-8 animate-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                        <h4 className="text-[11px] font-black uppercase text-amber-500 flex items-center gap-3 tracking-[0.3em]">
                            <Timer size={20} /> Previsualización Dinámica
                        </h4>
                        <button 
                            onClick={() => setIsPreviewEnabled(!isPreviewEnabled)}
                            className="flex items-center gap-3 text-white transition-all hover:opacity-80"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest">{isPreviewEnabled ? 'PREVIEW ON' : 'PREVIEW OFF'}</span>
                            {isPreviewEnabled ? <ToggleRight className="text-amber-500" size={32} /> : <ToggleLeft className="text-zinc-700" size={32} />}
                        </button>
                    </div>

                    {isPreviewEnabled && (
                        <div className="space-y-4 animate-in slide-in-from-top-4">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Selecciona el momentum de acceso libre (Válido para Imagen y Video):</p>
                            <div className="flex gap-6">
                                {[5, 10, 15].map(time => (
                                    <button key={time} onClick={() => setVideoPreviewLength(time as any)} className={`flex-1 py-4 rounded-[1.5rem] text-[12px] font-black border transition-all ${videoPreviewLength === time ? 'bg-amber-500 border-amber-500 text-black shadow-2xl shadow-amber-500/20' : 'bg-black border-zinc-800 text-zinc-600 hover:text-white'}`}>
                                        {time} SEGUNDOS
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sugerencias de Hashtags */}
            <div className="space-y-5">
                <h4 className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.4em] flex items-center gap-3">
                    <Sparkles size={18} className="text-amber-500" /> Metadatos Sincronizados
                </h4>
                <div className="flex flex-wrap gap-3 min-h-[60px] p-6 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900">
                    {hashtags.map((tag, i) => (
                        <span key={i} className="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-full text-[11px] font-black text-amber-500 flex items-center gap-3">
                            #{tag.replace('#', '')}
                            <button onClick={() => setHashtags(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-white transition-colors"><X size={14} /></button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
