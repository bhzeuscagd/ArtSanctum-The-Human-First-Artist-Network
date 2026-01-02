
import React, { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import TrendingSidebar from './components/TrendingSidebar';
import CreatePostModal from './components/CreatePostModal';
import SearchBar from './components/SearchBar';
import SearchResultsView from './components/SearchResultsView';
import CommissionsGuild from './components/CommissionsGuild';
import CommissionChat from './components/CommissionChat';
import ProfileView from './components/ProfileView';
import { Post, SearchResults, ArtistProfile, UserProfileData, CommissionSession } from './types';
import { generateFeed, neuralArtistDiscovery, hashtagHierarchySearch } from './services/geminiService';
import { 
  Home, 
  User, 
  Bell, 
  MessageSquare, 
  Briefcase, 
  Plus,
  Coins,
  ShieldAlert,
  Search as SearchIcon
} from 'lucide-react';

const LogoSVG = () => (
  <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
    <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="#f59e0b" strokeWidth="4" fill="black"/>
    <path d="M50 25L70 40V60L50 75L30 60V40L50 25Z" fill="#f59e0b" fillOpacity="0.3"/>
    <circle cx="50" cy="50" r="8" fill="#f59e0b"/>
  </svg>
);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'commissions' | 'profile' | 'artist_profile'>('feed');
  const [svgBalance, setSvgBalance] = useState(1250);
  const [followedHandles, setFollowedHandles] = useState<Set<string>>(new Set(['master_painter']));
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'neural' | 'hashtag' | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);

  const [activeCommissionId, setActiveCommissionId] = useState<string | null>(null);
  const [viewedArtist, setViewedArtist] = useState<UserProfileData | null>(null);

  // Perfil del Usuario (Maestro)
  const [myProfile] = useState<UserProfileData>({
    name: "Vanguard Artist",
    handle: "vanguard_core",
    avatar: "https://picsum.photos/id/10/200/200",
    header: "https://picsum.photos/id/111/1200/400",
    role: "Concept Artist & OS Core",
    bio: "Pionero del ArtSanctum. Protegiendo la creatividad humana mediante protocolos de cifrado neural. El 100% de mis obras son procesadas bajo el Vanguard Shield.",
    location: "Vanguard Station 01",
    birthday: "22 May 2004",
    trustLevel: "Maestro",
    svgBalance: 1250,
    stats: {
        momentum: 88,
        humanScore: 100,
        totalEarned: 15400
    }
  });

  const currentUserHandle = myProfile.handle;

  const [commissionSessions, setCommissionSessions] = useState<CommissionSession[]>([
    {
      id: "s1",
      title: "Key Visual: Project Genesis",
      counterparty: "neotokio_studio",
      avatar: "https://picsum.photos/seed/client1/100/100",
      status: "ACTIVE",
      price: 450,
      lastMessage: "¡El boceto inicial se ve increíble! Procedamos.",
      isUnread: true,
      timestamp: "12 Oct 2023",
      chatHistory: [
        { sender: 'counterparty', text: 'Hola! Estamos interesados en tu estilo para un visual.', time: '10:05 AM' },
        { sender: 'user', text: 'Claro, me encantaría. ¿Cuál es el briefing?', time: '10:15 AM' },
        { sender: 'counterparty', text: '¡El boceto inicial se ve increíble! Procedamos con el color.', time: '11:30 AM' }
      ]
    },
    {
      id: "s2",
      title: "Cyber City #4 - Commercial License",
      counterparty: "ZenArt Co.",
      avatar: "https://picsum.photos/seed/client2/100/100",
      status: "COMPLETED",
      price: 200,
      lastMessage: "Transacción finalizada. Archivos descargados.",
      isUnread: false,
      timestamp: "05 Oct 2023",
      chatHistory: []
    }
  ]);

  const fetchPosts = async (tag?: string) => {
    setLoading(true);
    setSearchMode(null);
    try {
      const data = await generateFeed(tag);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePurchase = (amount: number) => {
    setSvgBalance(prev => prev - amount);
  };

  const toggleFollow = (handle: string) => {
    if (handle === currentUserHandle) return; 
    setFollowedHandles(prev => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

  const handleSearch = async (query: string, mode: 'neural' | 'hashtag') => {
    setIsSearching(true);
    setSearchMode(mode);
    setCurrentView('feed');
    try {
      if (mode === 'neural') {
        const res = await neuralArtistDiscovery(query);
        setSearchResults(res);
      } else {
        const res = await hashtagHierarchySearch(query.replace('#', ''));
        setSearchResults(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setCurrentView('feed');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const resetHome = () => {
    setSearchMode(null);
    setCurrentView('feed');
    setActiveCommissionId(null);
    setViewedArtist(null);
    fetchPosts();
  };

  const viewArtistProfile = (artist: any) => {
    if (artist.handle === currentUserHandle) {
        setCurrentView('profile');
        setViewedArtist(null);
    } else {
        // Mock profile for other artists
        const profile: UserProfileData = {
            name: artist.name || artist.artistName,
            handle: artist.handle,
            avatar: artist.avatar,
            header: "https://picsum.photos/seed/" + artist.handle + "/1200/400",
            role: artist.style || "Vanguard Creator",
            bio: artist.bio || "Artista verificado del Gremio. Mi visión trasciende los límites de lo sintético para reconectar con el rastro humano original.",
            location: "Gremio Central",
            birthday: "Unknown",
            trustLevel: artist.isVerified ? 'Verificado' : 'Maestro',
            svgBalance: 0,
            stats: {
                momentum: artist.momentum || 75,
                humanScore: 100,
                totalEarned: 5000
            }
        };
        setViewedArtist(profile);
        setCurrentView('artist_profile');
    }
    setActiveCommissionId(null);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const startCommission = (artist: UserProfileData) => {
    const newSession: CommissionSession = {
        id: "new_" + Math.random().toString(36).substr(2, 9),
        title: "Nuevo Encargo Vanguard",
        counterparty: artist.handle,
        avatar: artist.avatar,
        status: "NEGOTIATING",
        price: 300,
        lastMessage: "Iniciando protocolo de negociación...",
        isUnread: false,
        timestamp: "Ahora",
        chatHistory: [
            { sender: 'ai', text: `Neural Mediator activado para el contrato con @${artist.handle}. ¿Qué tipo de obra buscas?`, time: 'Ahora' }
        ]
    };
    setCommissionSessions(prev => [newSession, ...prev]);
    setActiveCommissionId(newSession.id);
    setCurrentView('commissions');
  };

  return (
    <div className="flex justify-center min-h-screen max-w-[1400px] mx-auto bg-black relative selection:bg-amber-500 selection:text-black">
      <main className="flex-1 max-w-[600px] border-x border-zinc-800 pb-40 md:pb-32 h-full">
        
        {!activeCommissionId && (
          <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-2xl border-b border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={resetHome} className={`transition-colors ${currentView === 'feed' ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
                  <Home size={22} />
                </button>
                <button onClick={() => {setCurrentView('profile'); setViewedArtist(null);}} className={`transition-colors ${currentView === 'profile' ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
                  <User size={22} />
                </button>
              </div>

              <button onClick={resetHome} className="flex flex-col items-center group">
                 <LogoSVG />
                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mt-1 group-hover:text-white transition-colors">ArtSanctum</span>
              </button>

              <div className="flex items-center gap-6">
                <button className="text-zinc-500 hover:text-white transition-colors relative">
                  <Bell size={22} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-black"></span>
                </button>
                <button onClick={() => {setCurrentView('commissions'); setActiveCommissionId(null);}} className={`transition-colors ${currentView === 'commissions' ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}>
                  <MessageSquare size={22} />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Content View */}
        <div className="flex flex-col min-h-screen">
          {currentView === 'profile' ? (
            <ProfileView 
                profile={myProfile} 
                currentUserHandle={currentUserHandle}
                userPosts={posts.filter(p => p.handle === myProfile.handle)} 
                commissions={[]} 
                isFollowing={false}
                onToggleFollow={() => {}}
            />
          ) : currentView === 'artist_profile' && viewedArtist ? (
            <ProfileView 
                profile={viewedArtist} 
                currentUserHandle={currentUserHandle}
                userPosts={posts.filter(p => p.handle === viewedArtist.handle)} 
                commissions={[]} 
                isFollowing={followedHandles.has(viewedArtist.handle)}
                onToggleFollow={() => toggleFollow(viewedArtist.handle)}
                onHire={() => startCommission(viewedArtist)}
            />
          ) : currentView === 'commissions' ? (
            activeCommissionId ? (
              <CommissionChat 
                session={commissionSessions.find(s => s.id === activeCommissionId)!} 
                onBack={() => setActiveCommissionId(null)}
              />
            ) : (
              <CommissionsGuild 
                sessions={commissionSessions} 
                onSelectSession={(id) => setActiveCommissionId(id)}
                svgBalance={svgBalance}
              />
            )
          ) : isSearching ? (
             <div className="p-20 text-center space-y-6">
                <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest animate-pulse">Sonda Vanguard Activa...</h2>
            </div>
          ) : searchMode ? (
            <SearchResultsView 
                results={searchResults} 
                mode={searchMode} 
                onViewProfile={viewArtistProfile}
            />
          ) : loading && posts.length === 0 ? (
            <div className="p-20 text-center space-y-6">
                <ShieldAlert className="text-zinc-900 mx-auto animate-pulse" size={48} />
                <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">Sincronizando con el Gremio...</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserHandle={currentUserHandle}
                userBalance={svgBalance}
                onPurchase={handlePurchase}
                isFollowing={followedHandles.has(post.handle)}
                onToggleFollow={() => toggleFollow(post.handle)}
                onViewProfile={() => viewArtistProfile(post)}
              />
            ))
          )}
        </div>

        {/* Bottom Command Deck */}
        {!activeCommissionId && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
            <div className="w-full max-w-[500px] flex flex-col gap-4 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                <SearchBar onSearch={handleSearch} isSearching={isSearching} />
              </div>

              <div className="bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800 rounded-full px-10 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <button onClick={resetHome} className={`p-1 transition-all hover:scale-110 ${currentView === 'feed' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-zinc-500'}`}>
                  <Home size={24} />
                </button>
                <button onClick={() => {setCurrentView('profile'); setViewedArtist(null);}} className={`p-1 transition-all hover:scale-110 ${currentView === 'profile' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-zinc-500'}`}>
                  <User size={24} />
                </button>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-amber-500 text-black p-4 rounded-full hover:bg-white transition-all transform hover:scale-110 active:scale-95 shadow-lg shadow-amber-500/20 -mt-8 border-4 border-black"
                >
                  <Plus size={24} />
                </button>
                <button className="p-1 text-zinc-500 hover:text-white transition-all hover:scale-110">
                  <MessageSquare size={24} />
                </button>
                <button 
                    onClick={() => {setCurrentView('commissions'); setActiveCommissionId(null);}}
                    className={`p-1 transition-all hover:scale-110 ${currentView === 'commissions' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-zinc-500'}`}
                >
                  <Briefcase size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {!activeCommissionId && <TrendingSidebar />}

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)} 
          onPostCreated={handlePostCreated} 
        />
      )}
    </div>
  );
};

export default App;
