/**
 * Búsqueda de imágenes de stock (Unsplash / Pexels / Pixabay).
 *
 * Si la API key del proveedor está configurada en el entorno, consulta la API
 * real y devuelve resultados con { id, url, author, pageUrl }. Si no hay key,
 * devuelve un fallback de imágenes de muestra (las mismas del Image Color
 * Picker) para que la herramienta funcione sin configuración.
 *
 * Env vars: UNSPLASH_ACCESS_KEY, PEXELS_API_KEY, PIXABAY_API_KEY.
 */

interface StockImage {
  id: string
  url: string
  author: string
  pageUrl: string
  provider: string
}

const SAMPLE_IMAGES: StockImage[] = [
  { id: 'sample-1', url: 'https://images.unsplash.com/photo-1503785640985-f62e3aeee448?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-2', url: 'https://images.unsplash.com/photo-1498354136128-58f790194fa7?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-3', url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-4', url: 'https://images.unsplash.com/photo-1495467033336-2effd8753d51?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-5', url: 'https://images.unsplash.com/photo-1491591462767-3b91b2a19487?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-6', url: 'https://images.unsplash.com/photo-1542279836-8369a296a95b?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-7', url: 'https://images.unsplash.com/photo-1484766280341-87861644c80d?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' },
  { id: 'sample-8', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=70&w=600&auto=format&fit=crop', author: 'Unsplash', pageUrl: 'https://unsplash.com', provider: 'sample' }
];

export default defineEventHandler(async (event) => {
  const query = getQuery<{ q?: string, provider?: string }>(event);
  const q = (query.q ?? '').trim();
  const provider = query.provider ?? 'unsplash';
  const config = useRuntimeConfig(event);

  if (!q) {
    return { results: SAMPLE_IMAGES };
  }

  try {
    if (provider === 'pexels' && config.pexelsApiKey) {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=12`, {
        headers: { Authorization: config.pexelsApiKey }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          results: (data.photos ?? []).map((p: any) => ({
            id: `pexels-${p.id}`,
            url: p.src?.large ?? p.src?.original,
            author: p.photographer ?? '',
            pageUrl: p.url ?? '',
            provider: 'pexels'
          }))
        };
      }
    }

    if (provider === 'pixabay' && config.pixabayApiKey) {
      const res = await fetch(`https://pixabay.com/api/?key=${config.pixabayApiKey}&q=${encodeURIComponent(q)}&per_page=12`);
      if (res.ok) {
        const data = await res.json();
        return {
          results: (data.hits ?? []).map((h: any) => ({
            id: `pixabay-${h.id}`,
            url: h.largeImageURL ?? h.webformatURL,
            author: h.user ?? '',
            pageUrl: h.pageURL ?? '',
            provider: 'pixabay'
          }))
        };
      }
    }

    // Unsplash (default)
    if (config.unsplashAccessKey) {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12`, {
        headers: { Authorization: `Client-ID ${config.unsplashAccessKey}` }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          results: (data.results ?? []).map((p: any) => ({
            id: `unsplash-${p.id}`,
            url: p.urls?.regular ?? p.urls?.raw,
            author: p.user?.name ?? '',
            pageUrl: p.links?.html ?? '',
            provider: 'unsplash'
          }))
        };
      }
    }

    // Sin key: fallback filtrado por la query (devuelve las muestras).
    return { results: SAMPLE_IMAGES, fallback: true };
  } catch {
    return { results: SAMPLE_IMAGES, fallback: true };
  }
});
