/**
 * useMoodPalette — estado central de la herramienta Mood Palette.
 *
 * Fases:
 *   1. Carga: image (data URL) + panel 0/N.
 *   2. Edición: markers manuales (hasta MAX_MARKERS), autoPalette de respaldo,
 *      undo/redo sobre los markers.
 *   3. Resultados: palette final (manual + opcional IA), exhaustive palette.
 *
 * La IA es OPCIONAL: aiHarmony controla si se llama a /api/palette/create
 * (requiere OPENAI_API_KEY). Sin IA, la paleta final es la extraída.
 */

import { createPixelBuffer, readPixelFromBuffer, extractPaletteFromBuffer, type PixelBuffer } from '~/layers/mood-palette/utils/mood-palette.util';
import { usePaletteFavorites } from '~/layers/common/composables/usePaletteFavorites';

export const MAX_MARKERS = 20;
export const DEFAULT_MARKER_COUNT = 5;

export interface MoodMarker {
  id: number
  /** Posición relativa sobre la imagen (0..1). */
  x: number
  y: number
  hex: string
}

export interface MoodPaletteState {
  image: string | null
  markers: MoodMarker[]
  autoPalette: string[]
  exhaustive: Array<{ hex: string, prevalence: number }>
  aiHarmony: boolean
  isAiGenerating: boolean
}

export function useMoodPalette() {
  const image = ref<string | null>(null);
  const imageEl = ref<HTMLImageElement | null>(null);
  const pixelBuffer = ref<PixelBuffer | null>(null);
  const markers = ref<MoodMarker[]>([]);
  const autoPalette = ref<string[]>([]);
  const exhaustive = ref<Array<{ hex: string, prevalence: number }>>([]);
  const aiHarmony = ref(false);
  const isAiGenerating = ref(false);
  const phase = ref<'load' | 'edit' | 'results'>(getInitialPhase());

  // historial (undo/redo) de markers
  const history = ref<MoodMarker[][]>([]);
  const future = ref<MoodMarker[][]>([]);
  const HISTORY_LIMIT = 20;

  function getInitialPhase(): 'load' | 'edit' | 'results' {
    return 'load';
  }

  const isImageLoaded = computed(() => image.value !== null);

  /** Paleta final de los markers (colores manuales). */
  const manualPalette = computed(() => markers.value.map(m => m.hex));

  /** Paleta final: markers si hay, si no autoPalette. */
  const finalPalette = computed(() => {
    const base = manualPalette.value.length > 0 ? manualPalette.value : autoPalette.value;
    return base.length > 0 ? base : [];
  });

  const favorites = usePaletteFavorites();

  const isFavorite = computed(() => favorites.isSaved(finalPalette.value));

  /* ---------- historial ---------- */

  function commitHistory(): void {
    history.value = [...history.value, markers.value.map(m => ({ ...m }))].slice(-HISTORY_LIMIT);
    future.value = [];
  }

  function undo(): void {
    if (history.value.length === 0) return;
    future.value = [markers.value.map(m => ({ ...m })), ...future.value].slice(0, HISTORY_LIMIT);
    markers.value = history.value[history.value.length - 1];
    history.value = history.value.slice(0, -1);
  }

  function redo(): void {
    if (future.value.length === 0) return;
    history.value = [...history.value, markers.value.map(m => ({ ...m }))].slice(-HISTORY_LIMIT);
    markers.value = future.value[0];
    future.value = future.value.slice(1);
  }

  const canUndo = computed(() => history.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  /* ---------- carga de imagen ---------- */

  async function loadImage(dataUrl: string): Promise<void> {
    image.value = dataUrl;
    markers.value = [];
    autoPalette.value = [];
    exhaustive.value = [];
    phase.value = 'edit';

    const img = new Image();
    img.onload = () => {
      imageEl.value = img;
      // Buffer de píxeles cacheado: se extrae UNA vez y se reutiliza para
      // muestrear en el drag y para las paletas automática/exhaustiva.
      const buffer = createPixelBuffer(img);
      pixelBuffer.value = buffer;
      if (buffer) {
        const palette = extractPaletteFromBuffer(buffer, 24, 60);
        autoPalette.value = palette.slice(0, 5).map(p => p.hex);
        exhaustive.value = palette;
        seedMarkers(autoPalette.value);
      }
    };
    img.src = dataUrl;
  }

  /** Coloca marcadores iniciales repartidos en la imagen. */
  function seedMarkers(hexes: string[]): void {
    const n = Math.min(hexes.length, MAX_MARKERS);
    const positions = distributePoints(n);
    markers.value = hexes.slice(0, n).map((hex, i) => ({
      id: Date.now() + i,
      x: positions[i].x,
      y: positions[i].y,
      hex
    }));
  }

  /** Posiciones pseudo-aleatorias con dispersión (grid + jitter). */
  function distributePoints(n: number): Array<{ x: number, y: number }> {
    const cols = Math.ceil(Math.sqrt(n * 1.6));
    const points: Array<{ x: number, y: number }> = [];
    for (let i = 0; i < n; i++) {
      const cx = (i % cols) / Math.max(cols - 1, 1);
      const cy = Math.floor(i / cols) / Math.max(Math.ceil(n / cols) - 1, 1);
      points.push({
        x: clamp01(cx + (Math.random() - 0.5) * 0.18),
        y: clamp01(cy + (Math.random() - 0.5) * 0.18)
      });
    }
    return points;
  }

  function clamp01(v: number): number {
    return Math.min(1, Math.max(0, v));
  }

  /* ---------- marcadores ---------- */

  /** Lee el color de un punto (relativo 0..1) desde el buffer cacheado. */
  function sampleHex(x: number, y: number): string {
    const buffer = pixelBuffer.value;
    if (!buffer) return '#000000';
    return readPixelFromBuffer(buffer, x * buffer.width, y * buffer.height) ?? '#000000';
  }

  /** Agrega un marcador en la posición (relativa 0..1) leyendo el píxel. */
  function addMarker(x: number, y: number): void {
    if (markers.value.length >= MAX_MARKERS || !pixelBuffer.value) return;
    commitHistory();
    markers.value.push({ id: Date.now(), x, y, hex: sampleHex(x, y) });
  }

  /** Actualiza la posición de un marcador y refresca su hex. */
  function moveMarker(id: number, x: number, y: number): void {
    const idx = markers.value.findIndex(m => m.id === id);
    if (idx === -1) return;
    markers.value[idx] = { ...markers.value[idx], x, y, hex: sampleHex(x, y) };
  }

  /** Marca el inicio de un arrastre para no ensuciar el historial. */
  function beginMarkerMove(): void {
    commitHistory();
  }

  function removeMarker(id: number): void {
    commitHistory();
    markers.value = markers.value.filter(m => m.id !== id);
  }

  /** Reordena markers: mueve de from a to (drag & drop en el panel). */
  function moveMarkerIndex(from: number, to: number): void {
    if (from === to) return;
    commitHistory();
    const next = [...markers.value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    markers.value = next;
  }

  /** Ordena los markers por hue (dropdown del panel). */
  function sortMarkersByHue(): void {
    commitHistory();
    markers.value = [...markers.value].sort((a, b) => hueNumber(a.hex) - hueNumber(b.hex));
  }

  function hueNumber(hex: string): number {
    const { r, g, b } = hexToRgbSafe(hex);
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const d = max - min;
    if (d === 0) return 0;
    let h = 0;
    if (max === r / 255) h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) % 6;
    else if (max === g / 255) h = (b / 255 - r / 255) / d + 2;
    else h = (r / 255 - g / 255) / d + 4;
    return h * 60;
  }

  function hexToRgbSafe(hex: string): { r: number, g: number, b: number } {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match
      ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
      : { r: 0, g: 0, b: 0 };
  }

  /* ---------- fases ---------- */

  function goToResults(): void {
    phase.value = 'results';
  }

  function backToEdit(): void {
    phase.value = 'edit';
  }

  function reset(): void {
    image.value = null;
    imageEl.value = null;
    pixelBuffer.value = null;
    markers.value = [];
    autoPalette.value = [];
    exhaustive.value = [];
    history.value = [];
    future.value = [];
    phase.value = 'load';
  }

  /* ---------- IA opcional ---------- */

  async function generateWithAi(promptHexes: string[]): Promise<string[] | null> {
    if (!aiHarmony.value) return null;
    isAiGenerating.value = true;
    try {
      const response = await $fetch<{ colors: string[] }>('/api/palette/create', {
        method: 'POST',
        body: { prompt: promptHexes.join(', '), colors: promptHexes }
      });
      return response.colors ?? null;
    } catch (err: any) {
      // Si la IA falla (401 sin key, etc.), seguimos con la paleta extraída.
      // eslint-disable-next-line no-console
      console.error('[mood-palette] AI generation failed:', err?.data?.statusMessage ?? err?.message);
      return null;
    } finally {
      isAiGenerating.value = false;
    }
  }

  function toggleFavorite(): void {
    favorites.toggleSave(finalPalette.value);
  }

  return {
    image,
    imageEl,
    pixelBuffer,
    markers,
    autoPalette,
    exhaustive,
    aiHarmony,
    isAiGenerating,
    phase,
    isImageLoaded,
    manualPalette,
    finalPalette,
    isFavorite,
    canUndo,
    canRedo,
    undo,
    redo,
    loadImage,
    addMarker,
    moveMarker,
    beginMarkerMove,
    removeMarker,
    moveMarkerIndex,
    sortMarkersByHue,
    goToResults,
    backToEdit,
    reset,
    generateWithAi,
    toggleFavorite,
    MAX_MARKERS
  };
}

export type MoodPalette = ReturnType<typeof useMoodPalette>;
