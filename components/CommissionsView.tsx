
import React, { useState } from 'react';
import { Briefcase, MessageCircle, Clock, DollarSign, Send, Star, ArrowLeft, Bell, Coins, ShieldCheck } from 'lucide-react';

const CommissionsView: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chats' | 'notifications'>('chats');

  const mockCommissions = [
    {
      id: 1,
      client: "NeoTokio Studio",
      avatar: "https://picsum.photos/seed/client1/100/100",
      status: "negotiating",
      title: "Ilustración Key Visual Manhwa",
      price: "450 SVG",
      lastMsg: "¿Podrías ajustar la paleta a tonos más cálidos?"
    },
    {
      id: 2,
      client: "CyberPunk Enthusiast",
      avatar: "https://picsum.photos/seed/client2/100/100",
      status: "active",
      title: "Retrato Estilo Cyberpunk",
      price: "120 SVG",
      lastMsg: "¡El boceto inicial se ve increíble!"
    }
  ];

  const businessNotifications = [
    { id: 1, type: 'PAYMENT', content: 'Has recibido un pago de 200 SVG por "Cyber City #4"', time: '2h ago' },
    { id: 2, type: 'OFFER', content: 'Nueva oferta de comisión de "ZenArt Co."', time: '5h ago' },
    { id: 3, type: 'STATUS', content: 'Contrato "Mecha-Warrior" marcado como COMPLETADO', time: '1d ago' }
  ];

  return (
    <div className="flex flex-col min-h-[80vh] bg-black">
      {/* Header Comisiones */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-brand font-black text-lg flex items-center gap-2 text-white uppercase tracking-widest">
            <Briefcase className="text-amber-500" size={20} />
            Gremio de Comisiones
          </h2>
          <div className="flex bg-zinc-900 p-1 rounded-full border border-zinc-800">
            <button 
              onClick={() => setViewMode('chats')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${viewMode === 'chats' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
            >
              CHATS
            </button>
            <button 
              onClick={() => setViewMode('notifications')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${viewMode === 'notifications' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
            >
              ALERTAS
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeChat === null ? (
          <div className="p-4 space-y-4">
            {viewMode === 'chats' ? (
              <>
                {mockCommissions.map((comm) => (
                  <div 
                    key={comm.id}
                    onClick={() => setActiveChat(comm.id)}
                    className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-3xl hover:bg-zinc-800/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img src={comm.avatar} className="w-14 h-14 rounded-2xl grayscale group-hover:grayscale-0 transition-all" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-zinc-100 text-sm">{comm.title}</h3>
                            <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                {comm.status}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{comm.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center gap-1.5 text-amber-500 font-black text-[11px]">
                           <Coins size={12} /> {comm.price}
                        </div>
                        <p className="text-[10px] text-zinc-600 italic truncate max-w-[150px]">"{comm.lastMsg}"</p>
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed border-zinc-800 rounded-3xl p-8 text-center bg-zinc-900/10">
                    <Star className="mx-auto text-zinc-800 mb-2" size={32} />
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">¿Nuevos horizontes?</p>
                    <button className="mt-4 bg-white text-black text-[10px] font-black px-6 py-2 rounded-full hover:bg-amber-500 transition-colors">
                        ABRIR SLOT DE COMISIÓN
                    </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {businessNotifications.map(notif => (
                  <div key={notif.id} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800 items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      {notif.type === 'PAYMENT' ? <Coins size={18} /> : <Bell size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-300 font-medium">{notif.content}</p>
                      <p className="text-[10px] text-zinc-600 uppercase font-black mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Chat Especializado Vanguard */
          <div className="flex flex-col h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/10">
                <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                    <img src={mockCommissions.find(c => c.id === activeChat)?.avatar} className="w-8 h-8 rounded-lg" alt="" />
                    <div>
                        <p className="text-xs font-black text-white">{mockCommissions.find(c => c.id === activeChat)?.client}</p>
                        <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <ShieldCheck size={10} /> Vanguard Contract Secured
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl max-w-[85%] text-xs text-zinc-300 leading-relaxed shadow-xl">
                    Hola. Me gustaría contratarte para el visual de mi nueva serie. El presupuesto es de 450 SVG por pieza única. ¿Aceptas?
                </div>
                <div className="bg-amber-500 p-4 rounded-2xl max-w-[85%] ml-auto text-xs text-black font-medium shadow-xl">
                    ¡Por supuesto! Me encanta el proyecto. Empezaré con los bocetos en cuanto el depósito de garantía en el Gremio esté activo.
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-[10px] text-emerald-400 font-black text-center uppercase tracking-widest">
                    DEPOSITO DE GARANTÍA CONFIRMADO (450 SVG)
                </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-2 bg-zinc-900 rounded-2xl p-2 mb-3 border border-zinc-800">
                    <input 
                        type="text" 
                        placeholder="Escribe un mensaje de negociación..." 
                        className="flex-1 bg-transparent border-none text-xs focus:ring-0 text-white pl-3"
                    />
                    <button className="bg-amber-500 p-2.5 rounded-xl text-black hover:bg-white transition-colors">
                        <Send size={16} />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 text-[10px] font-black py-3 bg-amber-500 text-black rounded-xl uppercase tracking-widest shadow-lg shadow-amber-500/10">
                        FINALIZAR OBRA
                    </button>
                    <button className="flex-1 text-[10px] font-black py-3 bg-zinc-800 text-zinc-400 rounded-xl uppercase tracking-widest border border-zinc-700">
                        SOLICITAR REVISIÓN
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionsView;
