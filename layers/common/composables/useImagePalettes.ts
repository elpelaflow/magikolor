import { computed } from 'vue';
import { useLocalStorage, StorageSerializers } from '@vueuse/core';

export type ImagePaletteSource = 'image-color-picker' | 'mood-palette';

export interface SavedImagePalette {
  id: string
  /** Imagen persistida (data URL JPEG redimensionada para caber en localStorage). */
  image: string
  colors: string[]
  source: ImagePaletteSource
  createdAt: number
}

const IMAGE_PALETTES_KEY = 'magikolor:image-palettes';
const MAX_SAVED_IMAGE_PALETTES = 30;
const MAX_IMAGE_DIMENSION = 640;
const JPEG_QUALITY = 0.8;

/**
 * Redimensiona una imagen (data URL) a JPEG acotado para que quepa en
 * localStorage junto con la paleta. En Node (tests / SSR) devuelve la imagen
 * original sin tocar.
 */
export async function downscaleImageDataUrl(
  dataUrl: string,
  maxDim: number = MAX_IMAGE_DIMENSION,
  quality: number = JPEG_QUALITY
): Promise<string> {
  if (typeof document === 'undefined') {
    return dataUrl;
  }
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return dataUrl;
    }
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    return dataUrl;
  }
}

/**
 * Paletas generadas desde una imagen (Image Color Picker y Mood Palette)
 * guardadas JUNTO con la imagen. Persistentes en localStorage del navegador y
 * visibles en la sección "Image palettes" de /favorites. Mismo patrón que
 * usePaletteFavorites / useColorFavorites.
 *
 * La identidad de una paleta es su firma (hex en orden unidos por coma):
 * `save` es idempotente (guardar dos veces la misma paleta no la duplica) y
 * `unsave` la quita por firma.
 */
export function useImagePalettes() {
  const savedPalettes = useLocalStorage<SavedImagePalette[]>(
    IMAGE_PALETTES_KEY,
    [],
    { serializer: StorageSerializers.object }
  );

  /** Descarta entradas corruptas (p. ej. si la key fue pisada por otro formato). */
  function clean(): void {
    if (!Array.isArray(savedPalettes.value)) {
      savedPalettes.value = [];
      return;
    }
    const valid = savedPalettes.value.filter(
      (p) => p && typeof p.id === 'string' && typeof p.image === 'string' && Array.isArray(p.colors) && p.colors.length > 0
    );
    if (valid.length !== savedPalettes.value.length) {
      savedPalettes.value = valid;
    }
  }

  const signature = (colors: string[]): string => colors.join(',');

  /** Lista ordenada de más nueva a más vieja. */
  const saved = computed(() => {
    clean();
    return [...savedPalettes.value].sort((a, b) => b.createdAt - a.createdAt);
  });

  function isSaved(colors: string[]): boolean {
    clean();
    const sig = signature(colors);
    return savedPalettes.value.some((p) => p.colors.join(',') === sig);
  }

  /**
   * Guarda la paleta junto con su imagen. Devuelve `true` si quedó guardada,
   * `false` si ya existía (misma firma de colores) o si falló la escritura
   * (localStorage lleno).
   */
  async function save(params: { image: string; colors: string[]; source: ImagePaletteSource }): Promise<boolean> {
    clean();
    if (params.colors.length === 0) {
      return false;
    }
    const sig = signature(params.colors);
    if (savedPalettes.value.some((p) => p.colors.join(',') === sig)) {
      return false;
    }
    const image = await downscaleImageDataUrl(params.image);
    const next: SavedImagePalette = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      image,
      colors: [...params.colors],
      source: params.source,
      createdAt: Date.now()
    };
    const list = [...savedPalettes.value, next];
    // Evita crecer sin límite: descarta las más viejas pasando el tope.
    if (list.length > MAX_SAVED_IMAGE_PALETTES) {
      list.sort((a, b) => a.createdAt - b.createdAt);
      list.splice(0, list.length - MAX_SAVED_IMAGE_PALETTES);
    }
    try {
      savedPalettes.value = list;
      return true;
    } catch {
      return false;
    }
  }

  /** Quita todas las entradas con la misma firma de colores. */
  function unsave(colors: string[]): void {
    clean();
    const sig = signature(colors);
    savedPalettes.value = savedPalettes.value.filter((p) => p.colors.join(',') !== sig);
  }

  function remove(id: string): void {
    clean();
    savedPalettes.value = savedPalettes.value.filter((p) => p.id !== id);
  }

  return {
    saved,
    isSaved,
    save,
    unsave,
    remove
  };
}
