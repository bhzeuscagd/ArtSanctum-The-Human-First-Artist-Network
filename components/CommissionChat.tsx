
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, ShieldCheck, Coins, Sparkles, Briefcase, Info, CheckCircle2, CloudDownload, Hand, ChevronRight, Lock, Users, Clock, Zap, Paperclip } from 'lucide-react';
import { CommissionSession, ContractDetails } from '../types';

interface CommissionChatProps {
  session: CommissionSession;
  onBack: () => void;
}

const CommissionChat: React.FC<CommissionChatProps> = ({ session, onBack }) => {
  const [message, setMessage] = useState('');
  const [showContractHud, setShowContractHud] = useState(true);
  
  // Local state for live contract simulation
  const [contract, setContract] = useState<ContractDetails>(session.contract || {
    serviceType: "Ilustración Conceptual",
    isCommercial: false,
    hasReferences: true,
    deadlineDays: 7,
    milestones: [],
    finalPrice: session.price
  });

  const toggleCommercial = () => {
    setContract(prev => {
        const isComm = !prev.isCommercial;
        return {
            ...prev,
            isCommercial: isComm,
            finalPrice: isComm ? session.price * 3 : session.price
        };
    });
  };

  return (
    <div className="flex flex-col h-[85vh] md:flex-row bg-black animate-in slide-in-from-right-4 duration-500 overflow-hidden">
      
      {/* Left Panel: The Neural Chat */}
      <div className="flex-1 flex flex-col border-r border-zinc-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center gap-4 bg-zinc-900/10 backdrop-blur-xl sticky top-0 z-30">
            <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-all">
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
                <img src={session.avatar} className="w-10 h-10 rounded-xl border border-zinc-800 grayscale hover:grayscale-0 transition-all" alt="" />
                <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">{session.counterparty}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-black uppercase tracking-tighter">
                        <ShieldCheck size={12} /> Vanguard Escrow Ready
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setShowContractHud(!showContractHud)}
                className="ml-auto md:hidden p-2 bg-zinc-900 rounded-full text-amber-500"
            >
                <Briefcase size={20} />
            </button>
        </div>

        {/* Neural Feed (Messages) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.02)_0%,_transparent_70%)]">
            {/* Gemini Mediator Intro */}
            {session.status === 'NEGOTIATING' && (
                <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-[2.5rem] flex items-start gap-5 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                    <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                        <Sparkles size={22} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            Mediador Gemini Vanguard <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed italic font-medium">
                            "He analizado los requerimientos previos del cliente. Basado en el volumen de trabajo y tu Trust Level (Maestro), recomiendo una licencia comercial x3 y un depósito de garantía del 50%. ¿Deseas que genere el contrato?"
                        </p>
                        <div className="flex gap-2">
                            <button className="text-[9px] font-black bg-indigo-600 text-white px-5 py-2.5 rounded-full uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Generar Borrador
                            </button>
                            <button className="text-[9px] font-black bg-zinc-900 text-zinc-500 px-5 py-2.5 rounded-full uppercase tracking-widest border border-zinc-800 hover:text-white transition-all">
                                Ignorar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat History */}
            {session.chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col gap-1 ${chat.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className={`p-5 rounded-[1.8rem] shadow-2xl ${
                            chat.sender === 'user' 
                                ? 'bg-amber-500 text-black font-semibold rounded-tr-none' 
                                : chat.sender === 'ai'
                                ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 rounded-tl-none italic'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                        }`}>
                            <p className="text-xs leading-relaxed">{chat.text}</p>
                        </div>
                        <span className="text-[8px] font-black text-zinc-700 uppercase px-2">{chat.time}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Input Dock */}
        <div className="p-6 border-t border-zinc-900 bg-black/50 backdrop-blur-2xl">
            <div className="flex items-center gap-4 bg-zinc-900/50 rounded-2xl p-2.5 border border-zinc-800 focus-within:border-amber-500/50 transition-all shadow-inner">
                <button className="p-2 text-zinc-600 hover:text-amber-500 transition-colors">
                    <Paperclip size={20} />
                </button>
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu propuesta al Gremio..." 
                    className="flex-1 bg-transparent border-none text-xs focus:ring-0 text-white font-medium pl-2"
                />
                <button className="bg-amber-500 p-3 rounded-xl text-black hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-amber-500/20">
                    <Send size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Right Panel: Live Contract HUD */}
      <div className={`w-full md:w-[380px] bg-zinc-950 border-l border-zinc-900 flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar transition-all ${showContractHud ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                <Briefcase size={18} className="text-amber-500" /> Contrato en Vivo
            </h3>
            <div className="p-1 bg-zinc-900 rounded-lg">
                <ShieldCheck size={16} className="text-emerald-500" />
            </div>
        </div>

        <div className="space-y-6 flex-1">
            {/* Service Config */}
            <div className="space-y-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Tipo de Servicio</p>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">{contract.serviceType}</span>
                    <Info size={14} className="text-zinc-700" />
                </div>
            </div>

            {/* License Toggles */}
            <div className="space-y-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Licencia de Uso</p>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => toggleCommercial()}
                        className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${!contract.isCommercial ? 'bg-amber-500 border-amber-500 text-black shadow-xl' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Hand size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Personal</span>
                    </button>
                    <button 
                        onClick={() => toggleCommercial()}
                        className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${contract.isCommercial ? 'bg-amber-500 border-amber-500 text-black shadow-xl' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Users size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Comercial (x3)</span>
                    </button>
                </div>
            </div>

            {/* Timeframes */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Plazo de Entrega</p>
                    <span className="text-[10px] font-black text-white">{contract.deadlineDays} DÍAS</span>
                </div>
                <input 
                    type="range" min="1" max="30" step="1" 
                    value={contract.deadlineDays}
                    onChange={(e) => setContract({...contract, deadlineDays: Number(e.target.value)})}
                    className="w-full h-1.5 bg-zinc-900 rounded-full accent-amber-500 appearance-none cursor-pointer"
                />
            </div>

            {/* Price Visualization */}
            <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-800 flex flex-col items-center gap-2 shadow-inner">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Precio Acordado</p>
                <div className="flex items-center gap-3">
                    <Coins size={24} className="text-amber-500" />
                    <span className="text-4xl font-black text-amber-500 tracking-tighter">{contract.finalPrice}</span>
                    <span className="text-xs font-black text-amber-500/50">SVG</span>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-zinc-900">
            {session.status === 'NEGOTIATING' ? (
                <button className="w-full bg-white text-black py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 hover:bg-amber-500 transition-all">
                    <Lock size={16} /> Aceptar y Congelar Fondos
                </button>
            ) : session.status === 'ACTIVE' ? (
                <button className="w-full bg-amber-500 text-black py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:bg-white transition-all">
                    <CloudDownload size={16} /> Subir Entregable (Beta)
                </button>
            ) : (
                <div className="flex items-center justify-center gap-2 py-4 text-emerald-500 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <CheckCircle2 size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Contrato Completado</span>
                </div>
            )}
            <button className="w-full bg-zinc-900 text-zinc-500 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:text-white transition-all">
                Historial de Cambios
            </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionChat;
