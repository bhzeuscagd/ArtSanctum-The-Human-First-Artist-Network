
import React, { useEffect, useState } from 'react';
import { TrendingUp, Zap, ChevronRight, Hash } from 'lucide-react';
import { getTrends } from '../services/geminiService';

const TrendingSidebar: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getTrends();
        setTrends(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="sticky top-0 h-screen p-4 hidden lg:block w-[350px]">
      <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800 overflow-hidden backdrop-blur-sm h-full flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-brand font-bold text-xl flex items-center gap-2">
            <Zap className="text-amber-400 fill-amber-400" size={20} />
            Momentum Core
          </h2>
        </div>

        <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
                <div className="mb-6 p-3">
                    <h3 className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Tendencias del Gremio</h3>
                    <div className="flex flex-wrap gap-2">
                        {trends?.trendingHashtags?.map((tag: string) => (
                            <span key={tag} className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-black text-amber-500 hover:text-white hover:border-amber-500/50 transition-all cursor-pointer">
                                #{tag.replace('#', '')}
                            </span>
                        ))}
                    </div>
                </div>

                {trends?.categories && Object.keys(trends.categories).map((category) => {
                    const categoryTrends = trends.categories[category];
                    if (!Array.isArray(categoryTrends)) return null;
                    
                    return (
                        <div key={category} className="mb-4">
                        <div className="px-3 py-2 text-zinc-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-between">
                            <span>{category}</span>
                        </div>
                        <div className="space-y-1">
                            {categoryTrends.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                <div className="text-zinc-800 font-brand font-black text-xl group-hover:text-amber-500">{idx + 1}</div>
                                <div className="flex-1">
                                <p className="text-xs font-bold text-zinc-100">{item.artist}</p>
                                <p className="text-[10px] text-zinc-600">@{item.handle}</p>
                                </div>
                                <div className="text-right">
                                <div className="text-[10px] font-black text-emerald-400">
                                    {item.momentum}%
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
