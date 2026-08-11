/**
 * Simulación de daltonismo (color vision deficiency).
 *
 * Matrices de transformación RGB → RGB del proyecto "daltonize"
 * (mudcu.be), basadas en Viénot, Brettel & Mollon (1999). Son las mismas
 * que usa la librería `color-blind` (npm) y herramientas como Polypane.
 *
 * Uso típico: mostrar una paleta como la vería alguien con protanopia,
 * deuteranopia, tritanopia o acromatopsia (escala de grises).
 */

import { hexToRgb, rgbToHex } from './color-converter.util';

export type ColorBlindnessType =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

/** Matrices 3×3 aplicadas directamente sobre los canales RGB. */
const MATRICES: Record<ColorBlindnessType, number[][]> = {
  protanopia: [
    [0.56667, 0.43333, 0],
    [0.55833, 0.44167, 0],
    [0, 0.24167, 0.75833]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.43333, 0.56667],
    [0, 0.475, 0.525]
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ]
};

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

/**
 * Devuelve el hex de cómo se ve `hex` bajo el tipo de deficiencia dado.
 * `achromatopsia` produce siempre una escala de grises (luminancia).
 */
export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  const { r, g, b } = hexToRgb(hex);
  const m = MATRICES[type];
  return rgbToHex({
    r: clampChannel(m[0][0] * r + m[0][1] * g + m[0][2] * b),
    g: clampChannel(m[1][0] * r + m[1][1] * g + m[1][2] * b),
    b: clampChannel(m[2][0] * r + m[2][1] * g + m[2][2] * b)
  });
}

/** Simula una paleta completa bajo un tipo de deficiencia (mantiene el orden). */
export function simulatePaletteColorBlindness(colors: string[], type: ColorBlindnessType): string[] {
  return colors.map(hex => simulateColorBlindness(hex, type));
}
