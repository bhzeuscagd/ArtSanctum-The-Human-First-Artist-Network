
export type TrustLevel = 'Novato' | 'Verificado' | 'Maestro';
export type AssetPermission = 'PREVIEW' | 'USAGE' | 'DOWNLOAD';
export type CommissionStatus = 'NEGOTIATING' | 'ACTIVE' | 'REVIEW' | 'COMPLETED';

export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export interface ContractDetails {
  serviceType: string;
  isCommercial: boolean; // Si es true, aplica multiplicador de precio x3
  hasReferences: boolean;
  deadlineDays: number;
  milestones: { description: string; percentage: number; released: boolean }[];
  finalPrice: number;
}

export interface CommissionSession {
  id: string;
  title: string;
  counterparty: string;
  avatar: string;
  status: CommissionStatus;
  price: number;
  lastMessage: string;
  isUnread: boolean;
  timestamp: string;
  contract?: ContractDetails;
  chatHistory: Array<{
    sender: 'user' | 'counterparty' | 'system' | 'ai';
    text: string;
    time: string;
  }>;
}

// Added Commission interface to fix import error in ProfileView.tsx
export interface Commission {
  id: string;
  title: string;
  clientHandle: string;
  price: number;
  hasPermission: boolean;
  sketchUrl: string;
  finalImageUrl: string;
  rating?: number;
  review?: string;
}

export interface UserProfileData {
  name: string;
  handle: string;
  avatar: string;
  header: string;
  bio: string;
  role: string;
  location: string;
  birthday: string;
  trustLevel: TrustLevel;
  svgBalance: number;
  stats: {
    momentum: number;
    humanScore: number;
    totalEarned: number;
  };
}

export interface AlbumImage {
  id: string;
  url: string;
  price: number;
  isFree: boolean;
  isFlexible: boolean;
  minPrice: number;
  visualDescription: string;
  permission: AssetPermission;
}

export interface Post {
  id: string;
  artistName: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  hashtags: string[];
  likes: number;
  stars: number;
  shares: number;
  commentsCount: number;
  isVerified: boolean;
  type: 'image' | 'album' | 'video' | 'text' | 'link';
  album?: AlbumImage[];
  linkData?: LinkMetadata;
  videoUrl?: string;
  videoPreviewLength?: 5 | 10 | 15;
  isPreviewEnabled?: boolean; 
  pricingMode?: 'BUNDLE' | 'INDIVIDUAL';
  bundlePrice?: number;
  bundleIsFlexible?: boolean;
  bundleMinPrice?: number;
  drmActive: boolean;
  imageUrl?: string; 
  earlyAccessDate?: string; 
}

export interface Comment {
  id: string;
  artistName: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface ArtistProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  style: string;
  momentum: number;
}

export interface SearchResults {
  ecosistema: Post[];
  maestros: ArtistProfile[];
  sangreNueva: ArtistProfile[];
}
