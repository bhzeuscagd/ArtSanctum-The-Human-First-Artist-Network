
import React, { useState } from 'react';
import { Briefcase, Star, Coins, Bell, MoreHorizontal, Sparkles, MessageSquare, ChevronRight, Search } from 'lucide-react';
import { CommissionSession, CommissionStatus } from '../types';

interface CommissionsGuildProps {
  sessions: CommissionSession[];
  onSelectSession: (id: string) => void;
  svgBalance: number;
}

const LogoSVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="#f59e0b" strokeWidth="4" fill="black"/>
    <path d="M50 25L70 40V60L50 75L30 60V40L50 25Z" fill="#f59e0b" fillOpacity="0.3"/>
  </svg>
);

const StatusBadge: React.FC<{ status: CommissionStatus }> = ({ status }) => {
  const styles = {
    NEGOTIATING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REVIEW: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-[0.15em] ${styles[status]}`}>
      {status === 'NEGOTIATING' ? 'En Negociación' : status}
    </span>
  );
};

const CommissionCard: React.FC<{ session: CommissionSession; onClick: () => void }> = ({ session, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl hover:bg-zinc-800/40 transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img src={session.avatar} className="w-14 h-14 rounded-2xl grayscale group-hover:grayscale-0 transition-all border border-zinc-800" alt="" />
          {session.isUnread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-zinc-950"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-zinc-100 text-sm truncate uppercase tracking-tight">{session.title}</h3>
            <StatusBadge status={session.status} />
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-widest">Estudio: @{session.counterparty}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-amber-500" />
          <span className="text-amber-500 font-black text-xs tracking-tighter">{session.price} SVG</span>
        </div>
        <p className="text-[10px] text-zinc-500 italic truncate max-w-[200px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
          "{session.lastMessage}"
        </p>
        <ChevronRight size={14} className="text-zinc-700 group-hover:text-amber-500 transition-all" />
      </div>
    </div>
  );
};

const CommissionsGuild: React.FC<CommissionsGuildProps> = ({ sessions, onSelectSession, svgBalance }) => {
  const [viewMode, setViewMode] = useState<'chats' | 'notifications'>('chats');

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header Premium ArtSanctum */}
      <div className="p-6 md:p-8 flex items-center justify-between sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <LogoSVG />
          <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">ArtSanctum</h2>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 px-5 py-2 rounded-full flex items-center gap-3 shadow-2xl shadow-amber-500/10">
          <Coins size={16} className="text-amber-500" />
          <span className="text-xs font-black text-amber-500 tracking-tighter">{svgBalance.toLocaleString()} SVG</span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 pb-32">
        <div className="flex items-center justify-between">
           <h1 className="text-xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
             <Briefcase className="text-amber-500" /> Gremio de Comisiones
           </h1>
           <button className="text-zinc-600 hover:text-white transition-colors">
             <Search size={20} />
           </button>
        </div>

        {/* Toggle Nav */}
        <div className="flex bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800 w-fit mx-auto shadow-inner">
          <button 
            onClick={() => setViewMode('chats')}
            className={`px-10 py-2 rounded-full text-[10px] font-black transition-all tracking-[0.2em] ${viewMode === 'chats' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500'}`}
          >
            CHATS
          </button>
          <button 
            onClick={() => setViewMode('notifications')}
            className={`px-10 py-2 rounded-full text-[10px] font-black transition-all tracking-[0.2em] ${viewMode === 'notifications' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500'}`}
          >
            ALERTAS
          </button>
        </div>

        {viewMode === 'chats' ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <CommissionCard 
                key={session.id} 
                session={session} 
                onClick={() => onSelectSession(session.id)} 
              />
            ))}

            {/* Empty Slot CTA */}
            <button className="w-full border-2 border-dashed border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/[0.03] rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all group mt-8">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 group-hover:text-amber-500 group-hover:scale-110 transition-all mb-4 border border-zinc-800 shadow-xl">
                <Star size={32} />
              </div>
              <h4 className="text-[11px] font-black text-zinc-500 group-hover:text-white uppercase tracking-[0.3em]">
                Abrir Slot de Comisión
              </h4>
              <p className="text-[9px] text-zinc-700 mt-2 font-bold uppercase tracking-widest">Capacidad Actual: 2 de 5</p>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-5 p-6 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300 font-bold uppercase tracking-tight">Notificación del Gremio</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">Nueva oferta de contrato para "Concept Art #22".</p>
                  <p className="text-[9px] text-zinc-700 uppercase font-black mt-2">Hace {i*2} horas</p>
                </div>
                <Sparkles size={18} className="text-zinc-800" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionsGuild;
