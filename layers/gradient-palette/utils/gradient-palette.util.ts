/**
 * Utilidades de Gradient Palette: genera una paleta de N colores interpolando
 * perceptivamente (OKLab) entre dos colores extremos.
 *
 * La matemática es la misma de `interpolateHex` de palette-maker (validada por
 * el parity test de pro-color-harmonies), pero se implementa acá contra
 * `oklch.util` (autocontenido, sin dependencias) para que la utilidad siga
 * siendo testeable en el harness de unit-tests sin arrastrar la cadena de
 * imports de ntc.
 *
 * Rango de colores: MIN_COLORS (2) a MAX_COLORS (10). Con count=2 la paleta
 * devuelve exactamente [hexA, hexB].
 */

import {
  hexToOklch,
  oklchToHex,
  oklchToOklab,
  oklabToOklch,
  clampChroma,
  lerp
} from '~/layers/color-palette-creator/utils/oklch.util';

export const MIN_COLORS = 2;
export const MAX_COLORS = 10;

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normaliza a `#rrggbb` (lowercase). Devuelve null si no es un hex válido. */
export function normalizeHex(value: string): string | null {
  const hex = value.trim();
  if (!HEX_RE.test(hex)) return null;
  const clean = hex.replace('#', '').toLowerCase();
  const full = clean.length === 3
    ? clean.split('').map((ch) => ch + ch).join('')
    : clean;
  return `#${full}`;
}

/** Mezcla perceptiva entre dos hex en OKLab (ratio 0..1). */
export function interpolateHex(hexA: string, hexB: string, ratio = 0.5): string {
  const labA = oklchToOklab(hexToOklch(hexA));
  const labB = oklchToOklab(hexToOklch(hexB));
  const mid = oklabToOklch({
    l: lerp(ratio, labA.l, labB.l),
    a: lerp(ratio, labA.a, labB.a),
    b: lerp(ratio, labA.b, labB.b)
  });
  return oklchToHex(clampChroma(mid));
}

/** Clampa un count a [MIN_COLORS, MAX_COLORS] (redondeado a entero). */
export function clampColorCount(count: number): number {
  return Math.min(MAX_COLORS, Math.max(MIN_COLORS, Math.round(count)));
}

/**
 * Genera la paleta: N colores interpolados en pasos parejos entre hexA y hexB.
 * Con count=2 devuelve exactamente [hexA, hexB]. Si algún extremo es un hex
 * inválido devuelve una lista vacía.
 */
export function createGradientPalette(hexA: string, hexB: string, count: number): string[] {
  const a = normalizeHex(hexA);
  const b = normalizeHex(hexB);
  if (!a || !b) return [];
  const n = clampColorCount(count);
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    // Extremos exactos: clampChroma limita l a [0.01, 0.99], lo que degradaría
    // negros/blancos puros (p. ej. #ffffff → #fcfcfc). El usuario eligió esos
    // colores, así que la paleta debe incluirlos tal cual.
    if (i === 0) {
      colors.push(a);
    } else if (i === n - 1) {
      colors.push(b);
    } else {
      colors.push(interpolateHex(a, b, i / (n - 1)));
    }
  }
  return colors;
}

/** CSS variables `--gradient-1..N` listas para copiar. */
export function buildCssVariables(colors: string[]): string {
  return colors
    .map((hex, i) => `  --gradient-${i + 1}: ${hex};`)
    .join('\n');
}

/** Valor de `background-image` (sin la propiedad) con los colores de la paleta. */
export function buildLinearGradient(colors: string[]): string {
  if (colors.length === 0) return '';
  return `linear-gradient(90deg, ${colors.join(', ')})`;
}

export interface GradientPaletteJson {
  colorA: string
  colorB: string
  count: number
  colors: string[]
  cssVariables: string
  cssGradient: string
}

/** JSON estructurado para exportar. */
export function buildGradientPaletteJson(hexA: string, hexB: string, colors: string[]): GradientPaletteJson {
  return {
    colorA: hexA,
    colorB: hexB,
    count: colors.length,
    colors,
    cssVariables: buildCssVariables(colors),
    cssGradient: buildLinearGradient(colors)
  };
}
