
import React, { useState } from 'react';
import { UserProfileData, Commission, Post } from '../types';
import { ShieldCheck, Edit3, MapPin, Calendar, Star, Lock, Eye, EyeOff, Coins, Zap, Fingerprint, MessageSquare, Quote, UserPlus, UserCheck, Briefcase } from 'lucide-react';
import PostCard from './PostCard';

interface ProfileViewProps {
  profile: UserProfileData;
  currentUserHandle?: string;
  userPosts: Post[];
  commissions: Commission[];
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onHire?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, currentUserHandle, userPosts, commissions, isFollowing, onToggleFollow, onHire }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'comisiones' | 'media'>('posts');
  const isMyProfile = profile.handle === currentUserHandle;

  const getLevelColor = () => {
    if (profile.trustLevel === 'Maestro') return 'text-amber-500 border-amber-500 shadow-amber-500/20';
    if (profile.trustLevel === 'Verificado') return 'text-indigo-400 border-indigo-400 shadow-indigo-400/20';
    return 'text-zinc-500 border-zinc-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in duration-700 pb-20">
      {/* Header Bento Section */}
      <div className="relative h-48 md:h-64 overflow-hidden group">
        <img src={profile.header} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all duration-1000" alt="Header" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
            <div className="flex items-center gap-6">
                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 ${getLevelColor()} bg-zinc-950 p-1 shadow-2xl`}>
                    <img src={profile.avatar} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                    {profile.trustLevel === 'Maestro' && (
                        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-1.5 rounded-full shadow-xl">
                            <Star size={16} fill="currentColor" />
                        </div>
                    )}
                </div>
                <div className="mb-2">
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        {profile.name}
                        {profile.trustLevel !== 'Novato' && <ShieldCheck className={getLevelColor()} size={24} />}
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mt-1">@{profile.handle} | <span className="text-amber-500">{profile.role}</span></p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
                {!isMyProfile ? (
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={onToggleFollow}
                            className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all border flex items-center justify-center gap-2 shadow-xl ${isFollowing ? 'bg-zinc-900 text-amber-500 border-amber-500/30' : 'bg-amber-500 text-black border-amber-500 hover:bg-white'}`}
                        >
                            {isFollowing ? <><UserCheck size={14} /> Siguiendo</> : <><UserPlus size={14} /> Seguir</>}
                        </button>
                        <button 
                            onClick={onHire}
                            className="bg-white text-black px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all border border-white hover:bg-amber-500 hover:border-amber-500 flex items-center justify-center gap-2 shadow-xl"
                        >
                            <Briefcase size={14} /> Contratar
                        </button>
                    </div>
                ) : (
                    <button className="bg-zinc-900/80 backdrop-blur-md hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase transition-all border border-zinc-800 flex items-center gap-2">
                        <Edit3 size={14} /> Editar Perfil
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2.5rem] md:col-span-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Fingerprint size={80} />
                </div>
                <h3 className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.4em] mb-4 flex items-center gap-2">
                   <ShieldCheck size={14} className="text-amber-500" /> Biografía Autorizada
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed font-medium relative z-10">
                    {profile.bio}
                </p>
                <div className="flex flex-wrap gap-5 mt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500">
                        <MapPin size={12} className="text-amber-500" /> {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500">
                        <Calendar size={12} className="text-amber-500" /> {profile.birthday}
                    </div>
                </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2.5rem] flex flex-col justify-between">
                <div>
                    <h3 className="text-[9px] font-black uppercase text-amber-500 tracking-[0.4em] mb-4">SVG Wallet</h3>
                    <p className="text-3xl font-black text-amber-500 tracking-tighter">{profile.svgBalance.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 font-black uppercase mt-1">Tokens Disponibles</p>
                </div>
                <div className="pt-4 border-t border-amber-500/10 mt-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span className="text-zinc-500">Momentum</span>
                        <span className="text-amber-500">{profile.stats.momentum}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{width: `${profile.stats.momentum}%`}}></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/50 p-1.5 rounded-full border border-zinc-900 w-fit">
            {[
                {id: 'posts', label: 'Feeds'},
                {id: 'comisiones', label: 'Trust Protocol'},
                {id: 'media', label: 'Bento Media'}
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="mt-4">
            {activeTab === 'posts' && (
                <div className="grid grid-cols-1 gap-2">
                    {userPosts.map(post => <PostCard key={post.id} post={post} currentUserHandle={currentUserHandle} />)}
                    {userPosts.length === 0 && (
                        <div className="py-20 text-center text-zinc-800 font-black uppercase tracking-widest text-xs">
                           Cero transmisiones en el feed local
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'comisiones' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {commissions.length > 0 ? commissions.map((comm) => (
                        <div key={comm.id} className="bg-zinc-900/20 border border-zinc-800 rounded-[3rem] p-6 flex flex-col gap-6 group hover:border-zinc-700 transition-all duration-500">
                            <div className="flex justify-between items-start px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
                                        <MessageSquare size={20} className="text-zinc-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{comm.title}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Cliente: @{comm.clientHandle}</p>
                                    </div>
                                </div>
                                <div className="bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-800">
                                    <span className="text-[10px] font-black text-amber-500">{comm.price} SVG</span>
                                </div>
                            </div>

                            <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner group-hover:shadow-2xl transition-all">
                                {!comm.hasPermission ? (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl"></div>
                                        <div className="relative z-30">
                                            <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 mx-auto">
                                                <EyeOff size={24} className="text-rose-500" />
                                            </div>
                                            <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Activo Restringido</p>
                                            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Protocolo de Privacidad Pagado</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                        Público
                                    </div>
                                )}
                                <img 
                                    src={comm.hasPermission ? comm.finalImageUrl : comm.sketchUrl} 
                                    className={`w-full h-full object-cover grayscale opacity-50 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 ${!comm.hasPermission ? 'blur-xl scale-125' : ''}`} 
                                    alt="Asset" 
                                />
                            </div>

                            <div className="bg-black/40 rounded-[2rem] p-6 border border-zinc-800/50 relative overflow-hidden">
                                <Quote size={40} className="absolute -top-2 -left-2 text-zinc-800/30 -rotate-12" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">Testimonio de Veracidad</span>
                                    <div className="flex gap-1">
                                        {Array.from({length: 5}).map((_, i) => (
                                            <Star key={i} size={10} fill={i < (comm.rating || 5) ? "#f59e0b" : "none"} className={i < (comm.rating || 5) ? "text-amber-500" : "text-zinc-800"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[12px] text-zinc-400 font-medium italic leading-relaxed relative z-10 pl-2 border-l-2 border-amber-500/30">
                                    "{comm.review || "El cliente no proporcionó texto, pero la transacción de confianza fue exitosa."}"
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 py-20 text-center text-zinc-800 font-black uppercase tracking-widest text-xs">
                           Sin historial de Trust Protocol disponible
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'media' && (
                <div className="grid grid-cols-4 grid-rows-4 gap-3 h-[800px]">
                    {userPosts.filter(p => p.imageUrl || p.album).map((p, idx) => {
                        const isLarge = idx === 0;
                        const isWide = idx === 1;
                        const isTall = idx === 4;

                        return (
                            <div 
                                key={idx} 
                                className={`relative rounded-[2rem] overflow-hidden border border-zinc-900 group shadow-lg transition-all duration-500 hover:border-amber-500/50 ${
                                    isLarge ? 'col-span-2 row-span-2' : 
                                    isWide ? 'col-span-2 row-span-1' :
                                    isTall ? 'col-span-1 row-span-2' :
                                    'col-span-1 row-span-1'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                                   <div className="text-[9px] font-black text-white uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform">
                                       {p.type === 'album' ? `${p.album?.length} Assets` : 'Single Frame'}
                                   </div>
                                </div>
                                <img 
                                    src={p.type === 'album' ? p.album![0].url : p.imageUrl} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 cursor-pointer" 
                                    alt="Media Asset" 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
