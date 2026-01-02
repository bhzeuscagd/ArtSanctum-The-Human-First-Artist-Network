
import React from 'react';
import { SearchResults, ArtistProfile, Post } from '../types';
import PostCard from './PostCard';
import { Star, Zap, UserPlus, Sparkles, TrendingUp } from 'lucide-react';

interface SearchResultsViewProps {
  results: SearchResults | { reasoning: string, artists: ArtistProfile[] };
  mode: 'neural' | 'hashtag';
  onViewProfile?: (artist: any) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ results, mode, onViewProfile }) => {
  if (mode === 'neural') {
    const neuralRes = results as { reasoning: string, artists: ArtistProfile[] };
    return (
      <div className="p-4 space-y-6">
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                <Sparkles size={18} />
                ArtX Neural Insights
            </h3>
            <p className="text-zinc-300 text-sm italic">"{neuralRes.reasoning}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neuralRes.artists.map((artist, i) => (
                <div 
                    key={i} 
                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-start gap-4 hover:border-indigo-500/50 transition-all group cursor-pointer"
                    onClick={() => onViewProfile && onViewProfile(artist)}
                >
                    <img src={artist.avatar} className="w-14 h-14 rounded-full ring-2 ring-zinc-800 group-hover:ring-indigo-500/50 transition-all" alt="" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white truncate">{artist.name}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                                <TrendingUp size={12} /> {artist.momentum}%
                            </div>
                        </div>
                        <p className="text-zinc-500 text-xs mb-2">@{artist.handle}</p>
                        <p className="text-zinc-400 text-xs line-clamp-2 mb-3">{artist.bio}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{artist.style}</span>
                            <button className="ml-auto text-indigo-400 hover:text-white transition-colors">
                                <UserPlus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  const hashtagRes = results as SearchResults;
  return (
    <div className="space-y-8 pb-10">
      <section>
        <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-brand font-bold text-lg flex items-center gap-2 text-amber-400">
                <Zap size={20} className="fill-amber-400" />
                Ecosistema Actual
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Momentum Hoy</span>
        </div>
        <div>
            {hashtagRes.ecosistema.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    onViewProfile={() => onViewProfile && onViewProfile(post)}
                />
            ))}
        </div>
      </section>

      <section className="px-4">
        <h3 className="font-brand font-bold text-lg flex items-center gap-2 text-indigo-400 mb-4">
            <Star size={20} className="fill-indigo-400" />
            Maestros del Gremio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hashtagRes.maestros.map((m, i) => (
                <div 
                    key={i} 
                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-all"
                    onClick={() => onViewProfile && onViewProfile(m)}
                >
                     <img src={m.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                     <div className="flex-1">
                        <p className="font-bold text-zinc-100">{m.name}</p>
                        <p className="text-zinc-500 text-xs mb-1">@{m.handle}</p>
                        <p className="text-zinc-400 text-xs line-clamp-1">{m.bio}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-tighter">Legado</p>
                        <p className="text-xl font-brand font-bold text-white">{m.momentum}</p>
                     </div>
                </div>
            ))}
        </div>
      </section>

      <section className="px-4">
        <h3 className="font-brand font-bold text-lg flex items-center gap-2 text-emerald-400 mb-4">
            <UserPlus size={20} />
            Sangre Nueva
        </h3>
        <div className="flex flex-col gap-2">
            {hashtagRes.sangreNueva.map((s, i) => (
                <div 
                    key={i} 
                    className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-all cursor-pointer"
                    onClick={() => onViewProfile && onViewProfile(s)}
                >
                    <div className="flex items-center gap-3">
                        <img src={s.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                            <p className="text-sm font-bold text-white">{s.name}</p>
                            <p className="text-[10px] text-zinc-500 italic">{s.bio.substring(0, 40)}...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                             <p className="text-[10px] text-emerald-500 font-bold">Impulso</p>
                             <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
                                <div className="h-full bg-emerald-500" style={{width: `${s.momentum}%`}}></div>
                             </div>
                        </div>
                        <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">Seguir</button>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default SearchResultsView;
