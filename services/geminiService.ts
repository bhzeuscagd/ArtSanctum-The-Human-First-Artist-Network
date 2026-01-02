
import { GoogleGenAI, Type } from "@google/genai";
import { Post, Comment, ArtistProfile, SearchResults } from "../types";

// Always use named parameter for apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Caché en memoria para reducir hits redundantes
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

/**
 * Utilidad de reintento con Exponential Backoff mejorado
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Pequeño jitter inicial para evitar colisiones de peticiones paralelas
      if (i > 0) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errorStatus = err.status || (err.message?.includes("429") ? 429 : 0);
      
      if (errorStatus === 429 || errorStatus >= 500) {
        console.warn(`ArtX Core: Limitación de cuota detectada (429/5xx). Reintento ${i + 1}/${maxRetries}...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

const getCachedOrFetch = async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  if (cache[key] && (now - cache[key].timestamp < CACHE_TTL)) {
    return cache[key].data as T;
  }
  const result = await fetchFn();
  cache[key] = { data: result, timestamp: now };
  return result;
};

/**
 * Genera el feed de publicaciones basado en un tag opcional
 */
export const generateFeed = async (tag?: string): Promise<Post[]> => {
  const cacheKey = `feed_${tag || 'general'}`;
  
  return getCachedOrFetch(cacheKey, () => withRetry(async () => {
    // Basic text task: use gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 10 highly creative social media posts for ArtX Core, a futuristic art sanctuary. ${tag ? `The posts should focus on #${tag}.` : "The posts should be a mix of high-end digital art, cyberpunk themes, and conceptual design."} Each post should feel authentic to a professional artist.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              artistName: { type: Type.STRING },
              handle: { type: Type.STRING },
              avatar: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              likes: { type: Type.INTEGER },
              stars: { type: Type.INTEGER },
              shares: { type: Type.INTEGER },
              commentsCount: { type: Type.INTEGER },
              isVerified: { type: Type.BOOLEAN },
              type: { type: Type.STRING, description: 'Must be image, album, video, text, or link' },
              imageUrl: { type: Type.STRING },
              videoUrl: { type: Type.STRING },
              drmActive: { type: Type.BOOLEAN },
              bundlePrice: { type: Type.INTEGER },
              pricingMode: { type: Type.STRING, description: 'BUNDLE or INDIVIDUAL' }
            },
            required: ["id", "artistName", "handle", "avatar", "timestamp", "content", "hashtags", "likes", "stars", "shares", "commentsCount", "isVerified", "type", "drmActive"]
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  }));
};

/**
 * Genera comentarios simulados para una publicación
 */
export const generateComments = async (postContent: string): Promise<Comment[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 insightful and artistic comments for this post: "${postContent}". The comments should come from other artists in the ArtX Core community.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              artistName: { type: Type.STRING },
              handle: { type: Type.STRING },
              avatar: { type: Type.STRING },
              content: { type: Type.STRING },
              timestamp: { type: Type.STRING }
            },
            required: ["id", "artistName", "handle", "avatar", "content", "timestamp"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

/**
 * Obtiene las tendencias actuales del Gremio
 */
export const getTrends = async (): Promise<any> => {
  return getCachedOrFetch('trends', () => withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate trending hashtags and top performing categories for ArtX Core artists. Include momentum percentages for artists.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trendingHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            categories: {
              type: Type.OBJECT,
              properties: {
                ConceptArt: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      artist: { type: Type.STRING },
                      handle: { type: Type.STRING },
                      momentum: { type: Type.INTEGER }
                    }
                  }
                },
                NeuralDesign: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      artist: { type: Type.STRING },
                      handle: { type: Type.STRING },
                      momentum: { type: Type.INTEGER }
                    }
                  }
                },
                CyberSculpt: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      artist: { type: Type.STRING },
                      handle: { type: Type.STRING },
                      momentum: { type: Type.INTEGER }
                    }
                  }
                }
              }
            }
          },
          required: ["trendingHashtags", "categories"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }));
};

/**
 * Analiza un archivo cargado para sugerir metadatos
 */
export const analyzeUpload = async (file: string): Promise<{ hashtags: string[], suggestedCaption: string }> => {
  return withRetry(async () => {
    // Handle base64 from data URL
    const base64Data = file.includes(',') ? file.split(',')[1] : file;
    const mimeType = file.includes(';') ? file.split(';')[0].split(':')[1] : 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Analyze this artwork. Provide a sophisticated, artistic caption for a social media post and 5 relevant hashtags for ArtX Core."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCaption: { type: Type.STRING }
          },
          required: ["hashtags", "suggestedCaption"]
        }
      }
    });
    return JSON.parse(response.text || '{"hashtags":[], "suggestedCaption":""}');
  });
};

/**
 * Sugiere hashtags basados en contenido de texto
 */
export const suggestHashtags = async (content: string, type: string): Promise<string[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this ${type} content, suggest 5 trending hashtags for the ArtX Core community: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  });
};

/**
 * Descubrimiento de artistas mediante búsqueda semántica (Complejo: use Pro)
 */
export const neuralArtistDiscovery = async (query: string): Promise<{ reasoning: string, artists: ArtistProfile[] }> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User is searching for artists using a 'neural probe': "${query}". Find artists that match this vibe. Provide deep reasoning and 4 matching artist profiles.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            artists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  handle: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  style: { type: Type.STRING },
                  momentum: { type: Type.INTEGER }
                },
                required: ["name", "handle", "avatar", "bio", "style", "momentum"]
              }
            }
          },
          required: ["reasoning", "artists"]
        }
      }
    });
    return JSON.parse(response.text || '{"reasoning": "", "artists": []}');
  });
};

/**
 * Búsqueda jerárquica por hashtags
 */
export const hashtagHierarchySearch = async (tag: string): Promise<SearchResults> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search the ArtX Core hierarchy for #${tag}. Provide related ecosystem posts, established masters, and rising 'new blood' artists.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ecosistema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  artistName: { type: Type.STRING },
                  handle: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  content: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  likes: { type: Type.INTEGER },
                  stars: { type: Type.INTEGER },
                  shares: { type: Type.INTEGER },
                  commentsCount: { type: Type.INTEGER },
                  isVerified: { type: Type.BOOLEAN },
                  type: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  drmActive: { type: Type.BOOLEAN }
                },
                required: ["id", "artistName", "handle", "avatar", "timestamp", "content", "hashtags", "likes", "stars", "shares", "commentsCount", "isVerified", "type", "drmActive"]
              }
            },
            maestros: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  handle: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  style: { type: Type.STRING },
                  momentum: { type: Type.INTEGER }
                },
                required: ["name", "handle", "avatar", "bio", "style", "momentum"]
              }
            },
            sangreNueva: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  handle: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  style: { type: Type.STRING },
                  momentum: { type: Type.INTEGER }
                },
                required: ["name", "handle", "avatar", "bio", "style", "momentum"]
              }
            }
          },
          required: ["ecosistema", "maestros", "sangreNueva"]
        }
      }
    });
    return JSON.parse(response.text || '{"ecosistema": [], "maestros": [], "sangreNueva": []}');
  });
};
