/**
 * Mood Palette — utilidades de la herramienta.
 *
 * Incluye:
 * - Lectura de píxel de una imagen (canvas) para los goteros manuales.
 * - Extracción de paleta exhaustiva (colores únicos de una imagen).
 * - Generación de collage PNG y color card PNG en canvas (reutiliza el
 *   patrón de `renderPalettePng` de color-palette-creator).
 */

import { hexToRgb, rgbToHex } from '~/layers/common/utils/color-converter.util';

const isBrowser = (): boolean => typeof document !== 'undefined';

/** Buffer de píxeles cacheado de la imagen cargada, para leer muestras rápido durante el drag. */
export interface PixelBuffer {
  data: Uint8ClampedArray
  width: number
  height: number
}

/**
 * Pre-renderiza la imagen a un buffer de píxeles (tamaño acotado) una sola vez.
 * Evita dibujar el canvas en cada `pointermove` del drag de marcadores.
 */
export function createPixelBuffer(img: HTMLImageElement, maxDim = 400): PixelBuffer | null {
  if (!isBrowser()) return null;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);
  try {
    return {
      data: ctx.getImageData(0, 0, width, height).data,
      width,
      height
    };
  } catch {
    return null;
  }
}

/** Lee el color del píxel (x, y) desde un buffer cacheado. Devuelve hex o null. */
export function readPixelFromBuffer(buffer: PixelBuffer, x: number, y: number): string | null {
  const xi = Math.min(buffer.width - 1, Math.max(0, Math.round(x)));
  const yi = Math.min(buffer.height - 1, Math.max(0, Math.round(y)));
  const i = (yi * buffer.width + xi) * 4;
  return rgbToHex({ r: buffer.data[i], g: buffer.data[i + 1], b: buffer.data[i + 2] });
}

/** Agrupa píxeles de un buffer en buckets de color y devuelve los más frecuentes. */
export function extractPaletteFromBuffer(
  buffer: PixelBuffer,
  bucketSize = 16,
  maxColors = 60
): { hex: string; prevalence: number }[] {
  const { data, width, height } = buffer;
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const step = 8; // muestreo
  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.floor(r / bucketSize)}-${Math.floor(g / bucketSize)}-${Math.floor(b / bucketSize)}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  const total = [...buckets.values()].reduce((s, b) => s + b.count, 0);
  return [...buckets.values()]
    .map(b => ({
      hex: rgbToHex({
        r: Math.round(b.r / b.count),
        g: Math.round(b.g / b.count),
        b: Math.round(b.b / b.count)
      }),
      prevalence: Number(((b.count / total) * 100).toFixed(2))
    }))
    .sort((a, b) => b.prevalence - a.prevalence)
    .slice(0, maxColors);
}

/** Luminancia simple para elegir texto claro/oscuro sobre un swatch. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export interface CollageRow {
  title: string
  hexes: string[]
}

/** Genera un PNG (data URL) de un collage: fila de título + swatches con hex superpuesto. */
export function renderCollagePng(rows: CollageRow[]): string {
  if (!isBrowser()) return '';
  const swatchW = 140;
  const swatchH = 72;
  const rowH = swatchH + 26;
  const maxCols = Math.max(...rows.map(r => r.hexes.length), 1);
  const width = maxCols * swatchW + 24;
  const height = rows.length * rowH + 24;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  rows.forEach((row, ri) => {
    const y = 12 + ri * rowH;
    ctx.fillStyle = '#111111';
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(row.title, 12, y + swatchH + 4);

    row.hexes.forEach((hex, ci) => {
      const x = 12 + ci * swatchW;
      ctx.fillStyle = hex;
      ctx.fillRect(x, y, swatchW - 4, swatchH);
      ctx.fillStyle = luminance(hex) > 0.6 ? '#111111' : '#ffffff';
      ctx.font = '600 12px ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText(hex.toUpperCase(), x + 8, y + swatchH / 2);
    });
  });

  return canvas.toDataURL('image/png');
}

/** Genera una color card (grilla de swatches con hex) en PNG. */
export function renderColorCardPng(hexes: string[], columns = 5): string {
  if (!isBrowser()) return '';
  const cols = Math.min(columns, Math.max(hexes.length, 1));
  const rows = Math.ceil(hexes.length / cols);
  const swatchW = 160;
  const swatchH = 90;
  const width = cols * swatchW + 24;
  const height = rows * swatchH + 40;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#111111';
  ctx.font = '700 16px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('Mood Palette', 12, 12);

  hexes.forEach((hex, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 12 + col * swatchW;
    const y = 36 + row * swatchH;
    ctx.fillStyle = hex;
    ctx.fillRect(x, y, swatchW - 4, swatchH - 4);
    ctx.fillStyle = luminance(hex) > 0.6 ? '#111111' : '#ffffff';
    ctx.font = '600 12px ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText(hex.toUpperCase(), x + 8, y + (swatchH - 4) / 2);
  });

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  if (!isBrowser()) return;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

/** Ordena hexes por hue (rojo→verde→azul). */
export function sortByHue(hexes: string[]): string[] {
  return [...hexes].sort((a, b) => {
    const ha = hueOf(a);
    const hb = hueOf(b);
    return ha - hb;
  });
}

function hueOf(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
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
