
import React, { useState } from 'react';
import { Search, Cpu, Hash, X, Sparkles, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, mode: 'neural' | 'hashtag') => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'neural' | 'hashtag'>('neural');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query, mode);
  };

  return (
    <div className="w-full px-4 py-3">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {mode === 'neural' ? (
            <Cpu className={`transition-colors ${isSearching ? 'text-indigo-500 animate-pulse' : 'text-zinc-500 group-hover:text-indigo-400'}`} size={20} />
          ) : (
            <Hash className={`transition-colors ${isSearching ? 'text-emerald-500 animate-pulse' : 'text-zinc-500 group-hover:text-emerald-400'}`} size={20} />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'neural' ? "Sonda Neural: Pregúntale a Gemini por artistas..." : "Filtro por Momentum: Busca un #hashtag..."}
          className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-full py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-zinc-600"
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode(mode === 'neural' ? 'hashtag' : 'neural')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
              mode === 'neural' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
            }`}
          >
            {mode}
          </button>
          
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-zinc-800 rounded-full text-zinc-500"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-all active:scale-90 disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
