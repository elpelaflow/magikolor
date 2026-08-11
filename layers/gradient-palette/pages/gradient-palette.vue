<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('gradientPalette.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('gradientPalette.seoDescription') }}
      </p>
    </div>

    <!-- color inputs -->
    <div class="border border-gray-200 rounded-2xl p-4 mb-6 space-y-4">
      <div class="flex items-center justify-between">
        <p class="font-semibold text-sm">
          {{ $t('gradientPalette.colorA') }}
        </p>
        <ColorNameBadge :name="nameA" />
      </div>

      <div class="flex gap-2 items-center">
        <ColorPicker
          :initial-color="state.colorA"
          @select="value => state.colorA = value"
        />
        <UInput
          v-model="state.colorA"
          placeholder="#000000"
        />
        <UButton
          icon="i-heroicons-sparkles"
          variant="soft"
          :label="$t('gradientPalette.random')"
          @click="randomize('A')"
        />
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <p class="font-semibold text-sm">
          {{ $t('gradientPalette.colorB') }}
        </p>
        <ColorNameBadge :name="nameB" />
      </div>

      <div class="flex gap-2 items-center">
        <ColorPicker
          :initial-color="state.colorB"
          @select="value => state.colorB = value"
        />
        <UInput
          v-model="state.colorB"
          placeholder="#000000"
        />
        <UButton
          icon="i-heroicons-sparkles"
          variant="soft"
          :label="$t('gradientPalette.random')"
          @click="randomize('B')"
        />
      </div>

      <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
        <UButton
          icon="i-heroicons-arrows-right-left"
          variant="soft"
          color="gray"
          :label="$t('gradientPalette.swapColors')"
          @click="swapColors"
        />
      </div>
    </div>

    <!-- color count -->
    <div class="border border-gray-200 rounded-2xl p-4 mb-6">
      <div class="flex items-center justify-between mb-2">
        <p class="font-semibold text-sm">
          {{ $t('gradientPalette.colorsCount') }}
        </p>
        <p class="font-semibold text-sm">
          {{ state.colorCount }}
        </p>
      </div>
      <URange
        v-model="state.colorCount"
        :min="MIN_COLORS"
        :max="MAX_COLORS"
        :step="1"
        size="lg"
      />
    </div>

    <!-- live preview: gradiente suave + paleta discreta -->
    <div class="border border-gray-200 rounded-2xl overflow-hidden mb-6">
      <div
        class="h-24 sm:h-32 w-full"
        :style="{ background: previewGradient }"
      />

      <div class="p-4 bg-white">
        <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p class="text-sm font-semibold">
            {{ $t('gradientPalette.paletteTitle') }}
          </p>
          <div class="flex items-center gap-2">
            <UButton
              size="sm"
              icon="i-heroicons-clipboard"
              variant="soft"
              :label="$t('gradientPalette.copyAll')"
              :disabled="!isValidPalette"
              @click="onCopyAll"
            />
            <UButton
              size="sm"
              :icon="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              variant="soft"
              :color="isFavorite ? 'red' : 'gray'"
              :label="$t('gradientPalette.favorite')"
              :disabled="!isValidPalette"
              @click="onToggleFavorite"
            />
          </div>
        </div>

        <p
          v-if="!isValidPalette"
          class="text-sm text-red-500 mb-3"
        >
          {{ $t('gradientPalette.invalidColors') }}
        </p>

        <div
          v-else
          class="flex overflow-hidden rounded-xl border border-gray-200"
        >
          <button
            v-for="(hex, i) in palette"
            :key="i"
            class="flex-1 min-w-0 h-24 group relative cursor-pointer"
            :style="{ background: hex }"
            :aria-label="`${$t('gradientPalette.copyHex')} ${hex}`"
            @click="onCopyColor(hex)"
          >
            <span
              class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              :style="{ background: 'rgba(0,0,0,0.55)', color: getContrastTextColor(hex) }"
            >
              {{ hex }}
            </span>
          </button>
        </div>

        <div
          v-if="isValidPalette"
          class="flex mt-1"
        >
          <p
            v-for="(hex, i) in palette"
            :key="i"
            class="flex-1 text-center text-[10px] text-gray-500 font-mono py-1 truncate"
          >
            {{ hex }}
          </p>
        </div>
      </div>
    </div>

    <!-- Color Blindness Simulator -->
    <div class="border border-gray-200 rounded-2xl p-4 mb-6">
      <h2>
        {{ $t('colorBlind.title') }}
      </h2>
      <ColorBlindSimulator
        v-if="isValidPalette"
        :colors="palette"
      />
    </div>

    <!-- css helpers -->
    <div class="border border-gray-200 rounded-2xl p-4 mb-6 space-y-4">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <p class="text-sm font-semibold">
          {{ $t('gradientPalette.cssVariablesTitle') }}
        </p>
        <UButton
          size="sm"
          variant="soft"
          icon="i-heroicons-clipboard"
          :label="$t('gradientPalette.copyCssVariables')"
          :disabled="!isValidPalette"
          @click="onCopyCssVariables"
        />
      </div>
      <code class="block text-xs text-gray-600 font-mono bg-gray-50 rounded-lg p-3 break-all whitespace-pre-wrap">
        {{ cssVariables }}
      </code>

      <div class="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-gray-100">
        <p class="text-sm font-semibold">
          {{ $t('gradientPalette.copyCssGradient') }}
        </p>
        <UButton
          size="sm"
          variant="soft"
          icon="i-heroicons-clipboard"
          :label="$t('gradientPalette.copyCssGradient')"
          :disabled="!isValidPalette"
          @click="onCopyCssGradient"
        />
      </div>
      <code class="block text-xs text-gray-600 font-mono bg-gray-50 rounded-lg p-3 break-all">
        {{ cssGradientDeclaration }}
      </code>
    </div>

    <!-- export options -->
    <div class="border border-gray-200 rounded-2xl p-4">
      <p class="font-semibold text-sm mb-3">
        {{ $t('gradientPalette.exportTitle') }}
      </p>
      <div class="flex flex-wrap gap-2">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="soft"
          :label="$t('gradientPalette.downloadPng')"
          :disabled="!isValidPalette"
          @click="onDownloadPng"
        />
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="soft"
          :label="$t('gradientPalette.downloadJson')"
          :disabled="!isValidPalette"
          @click="onDownloadJson"
        />
        <UButton
          icon="i-heroicons-swatch"
          variant="soft"
          :label="$t('gradientPalette.exportAse')"
          :disabled="!isValidPalette"
          @click="onDownloadAse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { PlausibleEventName } from '~/layers/plausible/types';
import { getContrastTextColor } from '~/layers/common/utils/color-converter.util';
import { hexToName } from '~/layers/palette/utils/color-converter.util';
import {
  MAX_COLORS,
  MIN_COLORS,
  buildCssVariables,
  buildGradientPaletteJson,
  buildLinearGradient,
  createGradientPalette,
  normalizeHex
} from '~/layers/gradient-palette/utils/gradient-palette.util';
import {
  buildAseFile,
  downloadBlob,
  downloadDataUrl,
  renderPalettePng
} from '~/layers/color-palette-creator/utils/palette-export.util';
import { usePaletteFavorites } from '~/layers/common/composables/usePaletteFavorites';

const { t } = useI18n();
const notifications = useNotifications();
const { copy } = useClipboard();
const { isSaved, toggleSave } = usePaletteFavorites();

const title = t('gradientPalette.seoTitle');
const description = t('gradientPalette.seoDescription');

const state = reactive({
  colorA: '#15437F',
  colorB: '#F59E0B',
  colorCount: 5
});

const normalizedA = computed(() => normalizeHex(state.colorA));
const normalizedB = computed(() => normalizeHex(state.colorB));

const palette = computed(() => createGradientPalette(state.colorA, state.colorB, state.colorCount));
const isValidPalette = computed(() => palette.value.length > 0);

const isFavorite = computed(() => isSaved(palette.value));

const nameA = computed(() => colorName(normalizedA.value));
const nameB = computed(() => colorName(normalizedB.value));

function colorName(hex: string | null): string {
  if (!hex) return '';
  const name = hexToName(hex);
  return typeof name === 'string' && name ? name : hex;
}

const previewGradient = computed(() => {
  if (!normalizedA.value || !normalizedB.value) return '#ffffff';
  return `linear-gradient(90deg, ${normalizedA.value}, ${normalizedB.value})`;
});

const cssVariables = computed(() => buildCssVariables(palette.value));
const cssGradientDeclaration = computed(() => `background-image: ${buildLinearGradient(palette.value)};`);

const fileStem = computed(() => {
  const a = normalizedA.value?.replace('#', '') ?? 'a';
  const b = normalizedB.value?.replace('#', '') ?? 'b';
  return `magikolor-gradient-palette-${a}-${b}`;
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
});

function randomize(which: 'A' | 'B'): void {
  const hex = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
  if (which === 'A') {
    state.colorA = hex;
  } else {
    state.colorB = hex;
  }
}

function swapColors(): void {
  const tmp = state.colorA;
  state.colorA = state.colorB;
  state.colorB = tmp;
}

function onCopyColor(hex: string): void {
  copy(hex);
  notifications.addSuccess(t('gradientPalette.copied'));
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_COLOR_COPIED);
}

function onCopyAll(): void {
  copy(palette.value.join(', '));
  notifications.addSuccess(t('gradientPalette.allCopied', { count: palette.value.length }));
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_PALETTE_COPIED);
}

function onCopyCssVariables(): void {
  copy(cssVariables.value);
  notifications.addSuccess(t('gradientPalette.cssVariablesCopied'));
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_CSS_VARIABLES_COPIED);
}

function onCopyCssGradient(): void {
  copy(cssGradientDeclaration.value);
  notifications.addSuccess(t('gradientPalette.cssGradientCopied'));
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_CSS_GRADIENT_COPIED);
}

function onToggleFavorite(): void {
  const saved = toggleSave(palette.value);
  notifications.addSuccess(saved
    ? t('gradientPalette.savedToFavorites')
    : t('gradientPalette.removedFromFavorites'));
  sendPlausibleEvent(saved
    ? PlausibleEventName.GRADIENT_PALETTE_SAVED
    : PlausibleEventName.GRADIENT_PALETTE_UNSAVED);
}

function onDownloadPng(): void {
  const dataUrl = renderPalettePng([{
    title: t('gradientPalette.paletteTitle'),
    hexes: palette.value
  }]);
  if (dataUrl) {
    downloadDataUrl(dataUrl, `${fileStem.value}.png`);
    sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_PNG_DOWNLOADED);
  }
}

function onDownloadJson(): void {
  const json = buildGradientPaletteJson(normalizedA.value ?? '', normalizedB.value ?? '', palette.value);
  downloadBlob(
    new TextEncoder().encode(JSON.stringify(json, null, 2)),
    `${fileStem.value}.json`,
    'application/json'
  );
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_JSON_DOWNLOADED);
}

function onDownloadAse(): void {
  const colors = palette.value.map((hex, i) => ({
    name: t('gradientPalette.colorName', { number: i + 1 }),
    hex
  }));
  downloadBlob(buildAseFile(colors), `${fileStem.value}.ase`, 'application/octet-stream');
  sendPlausibleEvent(PlausibleEventName.GRADIENT_PALETTE_ASE_DOWNLOADED);
}
</script>
