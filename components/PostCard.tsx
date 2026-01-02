
import React, { useState, useEffect, useRef } from 'react';
import { Post, Comment, AlbumImage } from '../types';
import { Heart, Star, Repeat, MessageCircle, ShieldCheck, Share2, MoreHorizontal, Lock, Download, Play, Link as LinkIcon, ExternalLink, Timer, Zap, ChevronLeft, ChevronRight, HeartHandshake, Eye, CloudDownload, Clock, Check, UserPlus, UserCheck, Settings, ShieldAlert } from 'lucide-react';
import { generateComments } from '../services/geminiService';
import AssetModal from './AssetModal';

interface PostCardProps { 
  post: Post;
  currentUserHandle?: string;
  userBalance?: number;
  onPurchase?: (amount: number) => void;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onViewProfile?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserHandle, userBalance = 0, onPurchase, isFollowing, onToggleFollow, onViewProfile }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [videoPreviewActive, setVideoPreviewActive] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isOwner = post.handle === currentUserHandle;

  const isAlbum = post.type === 'album' && post.album && post.album.length > 0;
  const currentAsset: AlbumImage | null = isAlbum ? post.album![currentSlide] : null;

  // Lógica de Early Access (Chronos)
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const isEarlyAccess = post.earlyAccessDate ? new Date(post.earlyAccessDate) > new Date() : false;

  useEffect(() => {
    if (isEarlyAccess) {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(post.earlyAccessDate!).getTime();
            const diff = target - now;
            if (diff <= 0) {
                setTimeRemaining("LIBERADO");
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${hours}h ${mins}m`);
            }
        }, 60000);
        return () => clearInterval(interval);
    }
  }, [isEarlyAccess, post.earlyAccessDate]);

  const effectiveIsFree = post.type === 'text' || post.type === 'link' 
    ? true 
    : (post.pricingMode === 'BUNDLE' 
        ? (post.bundlePrice === 0 && !isEarlyAccess) 
        : (isAlbum ? (currentAsset?.isFree ?? true) && !isEarlyAccess : (post.bundlePrice === 0 && !isEarlyAccess)));

  const minRequired = post.pricingMode === 'BUNDLE' 
    ? (post.bundlePrice || 0) 
    : (currentAsset?.price || 0);

  const isFlexible = post.pricingMode === 'BUNDLE' 
    ? post.bundleIsFlexible 
    : (currentAsset?.isFlexible || false);

  const previewLimit = post.videoPreviewLength || 5;
  const canPreview = !effectiveIsFree && post.isPreviewEnabled !== false && !isUnlocked && !isOwner;

  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner) return;
    if (userBalance < minRequired) {
      alert("Balance SVG insuficiente en tu Wallet Vanguard.");
      return;
    }
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    onPurchase?.(minRequired);
    setIsUnlocked(true);
    setIsProcessing(false);
    setVideoPreviewActive(false);
  };

  useEffect(() => {
    let interval: any;
    if (videoPreviewActive) {
      interval = setInterval(() => {
        setPreviewProgress(p => {
            if (p >= 100) {
                setVideoPreviewActive(false);
                return 100;
            }
            return p + (100 / (previewLimit * 10));
        });
      }, 100);
    } else {
        setPreviewProgress(0);
    }
    return () => clearInterval(interval);
  }, [videoPreviewActive, previewLimit]);

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try { const res = await generateComments(post.content); setComments(res); } catch (err) {} 
      finally { setLoadingComments(false); }
    }
    setShowComments(!showComments);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlbum) setCurrentSlide((prev) => (prev + 1) % post.album!.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlbum) setCurrentSlide((prev) => (prev - 1 + post.album!.length) % post.album!.length);
  };

  const openVisualizer = () => {
    if (isOwner || effectiveIsFree || isUnlocked || videoPreviewActive) {
      setShowLightbox(true);
    }
  };

  return (
    <div className="border-b border-zinc-900 p-6 md:p-8 hover:bg-zinc-950 transition-all group">
      <div className="flex gap-5">
        <img 
            src={post.avatar} 
            className="w-12 h-12 rounded-full ring-1 ring-zinc-800 cursor-pointer" 
            alt="" 
            onClick={onViewProfile}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onViewProfile}>
                <span className="font-black text-white text-sm hover:text-amber-500 transition-colors">{post.artistName}</span>
                {post.isVerified && <ShieldCheck className="text-amber-500" size={14} />}
                <span className="text-zinc-600 text-[10px] font-bold uppercase">@{post.handle}</span>
              </div>
              
              {!isOwner && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFollow?.(); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${isFollowing ? 'bg-zinc-800 text-amber-500 border border-amber-500/20' : 'bg-amber-500 text-black hover:bg-white'}`}
                >
                  {isFollowing ? <><UserCheck size={12} /> Siguiendo</> : <><UserPlus size={12} /> Seguir</>}
                </button>
              )}
            </div>
            <button className="text-zinc-700 hover:text-white"><MoreHorizontal size={18} /></button>
          </div>

          <div className={`${post.type === 'text' ? 'text-lg font-medium text-white mb-4' : 'text-zinc-300 mb-4 text-sm'}`}>
            {post.content}
          </div>

          {(post.type === 'image' || post.type === 'album' || post.type === 'video') && (
            <div 
              className={`relative rounded-[2.5rem] overflow-hidden border border-zinc-800 mb-4 bg-zinc-950 aspect-square md:aspect-auto ${ (effectiveIsFree || isUnlocked || videoPreviewActive || isOwner) ? 'cursor-zoom-in' : 'cursor-default'}`}
              onClick={openVisualizer}
            >
                {isOwner && (
                    <div className="absolute bottom-0 inset-x-0 z-40 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                         <div className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500 rounded-xl text-black">
                                    <ShieldAlert size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Panel de Autor Vanguard</span>
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Activo verificado y protegido</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!effectiveIsFree && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-amber-500 font-mono tracking-tighter">{minRequired} SVG</span>
                                        <span className="text-[7px] font-bold text-zinc-600 uppercase">Precio de Mercado</span>
                                    </div>
                                )}
                                <div className="h-8 w-px bg-zinc-800 mx-1"></div>
                                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                                    <Settings size={16} />
                                </button>
                            </div>
                         </div>
                    </div>
                )}

                {isAlbum && post.album!.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-40 pointer-events-none">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-black/60 text-white pointer-events-auto hover:bg-amber-500 hover:text-black transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-full bg-black/60 text-white pointer-events-auto hover:bg-amber-500 hover:text-black transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {!effectiveIsFree && !isUnlocked && !videoPreviewActive && !isOwner && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500 p-8 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                            {isProcessing ? <Zap className="text-amber-500 animate-pulse" size={28} /> : (isEarlyAccess ? <Clock className="text-amber-500" size={28} /> : (isFlexible ? <HeartHandshake className="text-amber-500" size={28} /> : <Lock className="text-amber-500" size={24} />))}
                        </div>
                        
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">
                            {isProcessing ? 'Procesando Transacción...' : (isEarlyAccess ? 'Protocolo Chronos (Early Access)' : 'Activo Premium')}
                        </h4>
                        
                        <p className="text-zinc-500 text-[11px] mb-6 max-w-[220px]">
                            {isEarlyAccess 
                                ? `Acceso libre en el Gremio en: ${timeRemaining}.` 
                                : (isFlexible ? 'Acepta donaciones voluntarias para ser revelado.' : `Requiere una inversión de ${minRequired} SVG.`)}
                        </p>
                        
                        <div className="flex flex-col gap-3 w-full max-w-[220px]">
                            {canPreview && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setVideoPreviewActive(true); }}
                                    className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Play size={14} fill="currentColor" /> Previsualizar ({previewLimit}s)
                                </button>
                            )}
                            
                            <button 
                                onClick={handlePurchase}
                                disabled={isProcessing}
                                className="bg-amber-500 hover:bg-white text-black py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
                            >
                                {isProcessing ? 'Validando...' : (isEarlyAccess ? `Acceso Inmediato (${minRequired} SVG)` : (isFlexible ? 'Hacer Donación' : `Adquirir por ${minRequired} SVG`))}
                            </button>
                        </div>
                    </div>
                )}

                {videoPreviewActive && (
                    <div className="absolute top-6 left-6 right-6 z-40 bg-black/60 p-4 rounded-2xl backdrop-blur-xl border border-white/10 animate-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Timer size={12} className="text-amber-500" /> Transmisión Vanguard Temporal
                             </span>
                             <span className="text-[10px] font-black text-amber-500 font-mono tracking-tighter">
                                {Math.ceil(((100 - previewProgress) / 100) * previewLimit).toFixed(1)}s
                             </span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b]" style={{width: `${previewProgress}%`}}></div>
                        </div>
                    </div>
                )}

                {isUnlocked && (
                    <div className="absolute top-6 right-6 z-40 bg-emerald-500 text-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl animate-in zoom-in-50 flex items-center gap-2">
                        <Check size={14} /> Adquirido
                    </div>
                )}

                <img 
                    src={isAlbum ? post.album![currentSlide].url : (post.imageUrl || post.videoUrl)} 
                    className={`w-full h-full object-cover max-h-[850px] transition-all duration-700 ${(!effectiveIsFree && !isUnlocked && !videoPreviewActive && !isOwner) ? 'blur-3xl scale-110 opacity-30 grayscale' : 'group-hover:scale-105'}`} 
                    alt="Vanguard Asset" 
                />

                {isAlbum && !isOwner && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        {post.album!.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-amber-500 w-6' : 'bg-white/20'}`}></div>
                        ))}
                    </div>
                )}
                
                {isAlbum && isOwner && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        {post.album!.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/20'}`}></div>
                        ))}
                    </div>
                )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-zinc-900/50 border border-zinc-800/50 px-3.5 py-1.5 rounded-full text-amber-500 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all cursor-pointer">
                #{tag.replace('#', '')}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-zinc-600 pt-5 border-t border-zinc-900">
            <div className="flex items-center gap-8">
                <button onClick={() => {setLikes(l => hasLiked ? l-1 : l+1); setHasLiked(!hasLiked)}} className={`flex items-center gap-2.5 text-xs font-black transition-all ${hasLiked ? 'text-rose-500' : 'hover:text-amber-500'}`}>
                    <Heart size={20} fill={hasLiked ? "currentColor" : "none"} /> {likes}
                </button>
                <button onClick={toggleComments} className="flex items-center gap-2.5 text-xs font-black hover:text-white transition-all">
                    <MessageCircle size={20} /> {post.commentsCount}
                </button>
                <button className="flex items-center gap-2.5 text-xs font-black hover:text-indigo-400 transition-all">
                    <Repeat size={20} /> {post.shares}
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-zinc-700 hover:text-white transition-colors"><Share2 size={20} /></button>
                {(effectiveIsFree || isUnlocked || isOwner) && (
                    <button className="bg-amber-500/10 text-amber-500 p-2.5 rounded-2xl hover:bg-amber-500 hover:text-black transition-all">
                        <Download size={20} />
                    </button>
                )}
            </div>
          </div>

          {showComments && (
              <div className="mt-8 space-y-6 pt-6 border-t border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-500">
                  {loadingComments ? <div className="py-4 text-center"><Zap className="animate-spin text-amber-500 mx-auto" size={20} /></div> : 
                    comments.map(c => (
                        <div key={c.id} className="flex gap-4 group/comment">
                            <img 
                                src={c.avatar} 
                                className="w-10 h-10 rounded-full border border-zinc-800 grayscale group-hover/comment:grayscale-0 transition-all cursor-pointer" 
                                alt="" 
                                onClick={() => onViewProfile && onViewProfile()}
                            />
                            <div className="bg-zinc-900/30 p-4 rounded-3xl flex-1 border border-zinc-800/30">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] font-black text-white uppercase cursor-pointer hover:text-amber-500 transition-colors" onClick={() => onViewProfile && onViewProfile()}>{c.artistName}</p>
                                    <span className="text-[9px] text-zinc-700 font-bold uppercase">{c.timestamp}</span>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed">{c.content}</p>
                            </div>
                        </div>
                    ))
                  }
              </div>
          )}
        </div>
      </div>

      {showLightbox && (
        <AssetModal 
            post={post} 
            assetUrl={isAlbum ? post.album![currentSlide].url : (post.imageUrl || post.videoUrl || '')} 
            permission={currentAsset?.permission || (isOwner ? 'DOWNLOAD' : 'PREVIEW')}
            onClose={() => setShowLightbox(false)} 
        />
      )}
    </div>
  );
};

export default PostCard;
