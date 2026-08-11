<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('moodPalette.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('moodPalette.seoDescription') }}
      </p>

      <!-- stepper -->
      <div class="flex items-center gap-2 text-sm">
        <span
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-center gap-1.5"
        >
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
            :class="phase === step.key
              ? 'bg-primary text-white'
              : i < phaseIndex ? 'bg-primary-100 dark:bg-primary-900 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
          >
            {{ i + 1 }}
          </span>
          <span
            :class="phase === step.key ? 'font-semibold' : 'text-gray-500'"
          >
            {{ t(step.label) }}
          </span>
          <span v-if="i < steps.length - 1" class="text-gray-300">→</span>
        </span>
      </div>
    </div>

    <!-- FASE 1 · CARGA -->
    <div v-if="phase === 'load'" class="grid md:grid-cols-[1fr_260px] gap-6">
      <div>
        <!-- dropzone -->
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center transition-colors"
          :class="{ 'border-primary bg-primary-50 dark:bg-primary-900/20': isDraggingFile }"
          @dragover.prevent="isDraggingFile = true"
          @dragleave.prevent="isDraggingFile = false"
          @drop.prevent="onDropFile"
        >
          <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p class="font-medium mb-1">
            {{ $t('moodPalette.dropTitle') }}
          </p>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('moodPalette.dropHint') }}
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <UButton
              icon="i-heroicons-arrow-up-tray"
              :label="$t('moodPalette.chooseImage')"
              color="primary"
              @click="fileInput?.click()"
            />
            <UButton
              icon="i-heroicons-magnifying-glass"
              :label="$t('moodPalette.searchStock')"
              variant="soft"
              @click="stockModal.open()"
            />
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          >
        </div>

        <!-- ejemplos -->
        <p class="text-lg font-bold mt-8 mb-4">
          {{ $t('home.exampleLabel') }}
        </p>
        <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <li v-for="(item, i) in sampleImages" :key="i">
            <button
              type="button"
              class="block w-full rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
              @click="onLoadSample(item)"
            >
              <img :src="item" :alt="`sample ${i + 1}`" class="w-full h-24 object-cover" loading="lazy">
            </button>
          </li>
        </ul>
      </div>

      <!-- panel lateral -->
      <div class="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 h-fit">
        <p class="font-semibold mb-1">
          {{ $t('moodPalette.stateTitle') }}
        </p>
        <p class="text-sm text-gray-500">
          {{ $t('moodPalette.stateCount', { current: 0, max: MAX_MARKERS }) }}
        </p>
        <p class="text-xs text-gray-400 mt-3">
          {{ $t('moodPalette.stateHint') }}
        </p>
      </div>
    </div>

    <!-- FASE 2 · EDICIÓN -->
    <div v-else-if="phase === 'edit'" class="grid lg:grid-cols-[1fr_280px] gap-6">
      <div>
        <!-- toolbar -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <UButton
            size="sm"
            variant="soft"
            icon="i-heroicons-arrow-uturn-left"
            :label="$t('moodPalette.undo')"
            :disabled="!canUndo"
            @click="undo"
          />
          <UButton
            size="sm"
            variant="soft"
            icon="i-heroicons-arrow-uturn-right"
            :label="$t('moodPalette.redo')"
            :disabled="!canRedo"
            @click="redo"
          />
          <UButton
            size="sm"
            variant="soft"
            icon="i-heroicons-arrow-path"
            :label="$t('moodPalette.reset')"
            @click="reset"
          />
          <div class="flex-1" />
          <UButton
            size="sm"
            color="primary"
            icon="i-heroicons-arrow-right"
            :label="$t('moodPalette.finish')"
            :disabled="finalPalette.length === 0"
            @click="onFinish"
          />
        </div>

        <!-- canvas con goteros -->
        <MoodImageCanvas
          :image="image!"
          :markers="markers"
          :selected-id="selectedId"
          @select="selectedId = $event"
          @move="onMarkerMove"
          @move-start="beginMarkerMove"
          @add="addMarkerAt"
        />

        <p class="text-xs text-gray-500 mt-2">
          {{ $t('moodPalette.canvasHint') }}
        </p>

        <!-- paleta automática de respaldo -->
        <div class="mt-6">
          <MoodAutoPalette
            :hexes="autoPalette"
            @copy="onCopyHex"
          />
        </div>

        <!-- créditos -->
        <p v-if="creditText" class="text-xs text-gray-400 mt-4">
          {{ creditText }}
        </p>
      </div>

      <!-- panel lateral -->
      <div class="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 h-fit">
        <div class="flex items-center justify-between mb-2">
          <p class="font-semibold">
            {{ $t('moodPalette.collectedTitle') }}
          </p>
          <span class="text-xs text-gray-500">
            {{ markers.length }}/{{ MAX_MARKERS }}
          </span>
        </div>

        <UButton
          size="sm"
          block
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          :label="$t('moodPalette.addMarker')"
          :disabled="markers.length >= MAX_MARKERS"
          class="mb-3"
          @click="addMarkerCenter"
        />

        <div class="flex items-center gap-2 mb-3">
          <USelect
            v-model="sortMode"
            size="sm"
            :options="sortOptions"
            class="flex-1"
            @change="onSort"
          />
        </div>

        <div class="space-y-2 max-h-[420px] overflow-auto">
          <MoodColorCard
            v-for="(marker, index) in markers"
            :key="marker.id"
            :marker="marker"
            :index="index"
            :selected="selectedId === marker.id"
            @select="selectedId = marker.id"
            @copy="onCopyHex"
            @remove="removeMarker"
            @dragstart="onDragStart"
            @drop="onDrop"
          />
          <CommonEmptyState
            v-if="markers.length === 0"
            compact
            icon="i-heroicons-swatch"
            :title="$t('moodPalette.noMarkers')"
          />
        </div>
      </div>
    </div>

    <!-- FASE 3 · RESULTADOS -->
    <div v-else class="grid lg:grid-cols-[1fr_300px] gap-6">
      <div>
        <!-- collage preview -->
        <div class="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <img :src="image!" :alt="$t('moodPalette.title')" class="w-full h-56 object-cover">
          <div class="flex">
            <div
              v-for="hex in finalPalette.slice(0, 5)"
              :key="hex"
              class="flex-1 h-20 flex items-end justify-center"
              :style="{ backgroundColor: hex }"
            >
              <span class="text-[10px] font-mono font-bold mb-1 px-1 rounded bg-black/40 text-white">
                {{ hex }}
              </span>
            </div>
          </div>
        </div>

        <!-- paleta exhaustiva -->
        <div class="flex items-center justify-between mt-8 mb-3">
          <p class="text-lg font-bold">
            {{ $t('moodPalette.exhaustiveTitle') }}
          </p>
          <USelect
            v-model="sortMode"
            size="sm"
            :options="sortOptions"
            class="w-48"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in exhaustiveList"
            :key="c.hex"
            type="button"
            class="group relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:scale-105 transition-transform"
            :style="{ backgroundColor: c.hex }"
            :title="`${c.hex} · ${c.prevalence}%`"
            @click="onCopyHex(c.hex)"
          >
            <span class="absolute inset-x-0 bottom-0 text-[9px] font-mono text-center bg-black/50 text-white opacity-0 group-hover:opacity-100 py-0.5">
              {{ c.hex }}
            </span>
          </button>
        </div>
      </div>

      <div class="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 h-fit space-y-3">
        <p class="font-semibold">
          {{ $t('moodPalette.exportTitle') }}
        </p>

        <!-- IA opcional -->
        <div class="flex items-center justify-between gap-2 py-1">
          <div>
            <p class="text-sm font-medium">
              {{ $t('moodPalette.aiHarmony') }}
            </p>
            <p class="text-xs text-gray-500">
              {{ $t('moodPalette.aiHarmonyHint') }}
            </p>
          </div>
          <UToggle v-model="aiHarmony" size="md" />
        </div>

        <UButton
          block
          color="primary"
          icon="i-heroicons-sparkles"
          :label="$t('moodPalette.generateFinal')"
          :loading="isAiGenerating"
          @click="onGenerate"
        />

        <UDivider />

        <UButton
          block
          variant="soft"
          icon="i-heroicons-photo"
          :label="$t('moodPalette.downloadCollage')"
          @click="onDownloadCollage"
        />
        <UButton
          block
          variant="soft"
          icon="i-heroicons-document-arrow-down"
          :label="$t('moodPalette.downloadPdf')"
          @click="onDownloadPdf"
        />
        <UButton
          block
          variant="soft"
          icon="i-heroicons-squares-2x2"
          :label="$t('moodPalette.downloadColorCard')"
          @click="onDownloadColorCard"
        />

        <UDivider />

        <div class="flex gap-2">
          <UButton
            flex-1
            variant="soft"
            :icon="isSavedWithImage ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
            :aria-label="$t('moodPalette.saveWithImage')"
            :title="$t('moodPalette.saveWithImage')"
            :color="isSavedWithImage ? 'primary' : 'gray'"
            @click="onSaveWithImage"
          />
          <UButton
            flex-1
            variant="soft"
            :icon="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :aria-label="$t('moodPalette.favorite')"
            :color="isFavorite ? 'red' : 'gray'"
            @click="toggleFavorite"
          />
          <UButton
            flex-1
            variant="soft"
            icon="i-heroicons-share"
            :aria-label="$t('moodPalette.share')"
            @click="onShare"
          />
          <UButton
            flex-1
            variant="soft"
            icon="i-heroicons-arrow-left"
            :aria-label="$t('moodPalette.back')"
            @click="backToEdit"
          />
        </div>
      </div>
    </div>

    <MoodStockModal
      :is-open="stockModal.isOpen.value"
      @close="stockModal.close()"
      @import="onImportStock"
    />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { useImagePalettes } from '~/layers/common/composables/useImagePalettes';
import { useMoodPalette, MAX_MARKERS } from '~/layers/mood-palette/composables/useMoodPalette';
import { renderCollagePng, renderColorCardPng, downloadDataUrl } from '~/layers/mood-palette/utils/mood-palette.util';
import { getSampleImages, getImageBase64 } from '~/layers/image-color-picker/utils/image-color-picker.util';
import { hexToRgb } from '~/layers/common/utils/color-converter.util';
import { sendPlausibleEvent } from '~/layers/plausible/utils/plausible.util';
import { PlausibleEventName } from '~/layers/plausible/types';

const { t } = useI18n();
const notifications = useNotifications();
const { copy } = useClipboard();

const {
  image, markers, autoPalette, exhaustive, aiHarmony, isAiGenerating, phase,
  isFavorite, canUndo, canRedo, undo, redo, reset,
  loadImage, addMarker, moveMarker, beginMarkerMove, removeMarker, moveMarkerIndex,
  sortMarkersByHue, goToResults, backToEdit, generateWithAi, toggleFavorite,
  finalPalette
} = useMoodPalette();

const selectedId = ref<number | null>(null);
const isDraggingFile = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const stockModal = useModalV2();
const sortMode = ref('none');

const steps = computed(() => [
  { key: 'load', label: 'moodPalette.stepLoad' },
  { key: 'edit', label: 'moodPalette.stepEdit' },
  { key: 'results', label: 'moodPalette.stepResults' }
]);

const phaseIndex = computed(() => {
  const idx = steps.value.findIndex(s => s.key === phase.value);
  return idx === -1 ? 0 : idx;
});

const sampleImages = getSampleImages();

const sortOptions = computed(() => [
  { label: t('moodPalette.sortNone'), value: 'none' },
  { label: t('moodPalette.sortHue'), value: 'hue' },
  { label: t('moodPalette.sortLightness'), value: 'lightness' }
]);

const exhaustiveList = computed(() => {
  // Dedupe por hex (dos buckets pueden redondear al mismo color) para claves estables.
  const seen = new Set<string>();
  const list = exhaustive.value.filter(c => {
    if (seen.has(c.hex)) return false;
    seen.add(c.hex);
    return true;
  });
  if (sortMode.value === 'hue') {
    return [...list].sort((a, b) => hueOf(a.hex) - hueOf(b.hex));
  }
  if (sortMode.value === 'lightness') {
    return [...list].sort((a, b) => lightness(a.hex) - lightness(b.hex));
  }
  return list;
});

const creditText = ref('');

const title = t('moodPalette.seoTitle');
const description = t('moodPalette.seoDescription');

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
});

/* ---------- carga ---------- */

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    readFile(file);
  }
  input.value = '';
}

function onDropFile(event: DragEvent): void {
  isDraggingFile.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    readFile(file);
  }
}

function readFile(file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      void loadImage(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

async function onLoadSample(url: string): Promise<void> {
  const dataUrl = await getImageBase64(url);
  if (dataUrl !== null) {
    creditText.value = `Photo: ${url.split('/')[4] ?? ''} (Unsplash)`;
    void loadImage(dataUrl);
  }
}

async function onImportStock(dataUrl: string): Promise<void> {
  void loadImage(dataUrl);
}

/* ---------- edición ---------- */

function addMarkerAt(x: number, y: number): void {
  addMarker(x, y);
}

function addMarkerCenter(): void {
  addMarker(0.5, 0.5);
}

function onMarkerMove(id: number, x: number, y: number): void {
  moveMarker(id, x, y);
}

function onSort(): void {
  if (sortMode.value === 'hue') {
    sortMarkersByHue();
  }
}

function onDragStart(index: number): void {
  dragFrom.value = index;
}

function onDrop(index: number): void {
  if (dragFrom.value !== null && dragFrom.value !== index) {
    moveMarkerIndex(dragFrom.value, index);
  }
  dragFrom.value = null;
}

const dragFrom = ref<number | null>(null);

/* ---------- resultados ---------- */

async function onFinish(): Promise<void> {
  goToResults();
}

async function onGenerate(): Promise<void> {
  const base = finalPalette.value;
  if (base.length === 0) return;

  let result: string[] = base;
  if (aiHarmony.value) {
    const ai = await generateWithAi(base);
    if (ai && ai.length > 0) {
      result = ai;
      notifications.addSuccess(t('moodPalette.aiGenerated'));
    } else {
      notifications.addError(t('moodPalette.aiFailed'));
    }
  }
  displayPalette.value = result;
  notifications.addSuccess(t('moodPalette.generated', { count: result.length }));
  sendPlausibleEvent(PlausibleEventName.MOOD_PALETTE_GENERATED);
}

const displayPalette = ref<string[]>([]);

/* ---------- guardar paleta + imagen ---------- */

const imagePalettes = useImagePalettes();

/** Paleta a guardar: la generada con IA si existe, si no la final. */
const paletteToSave = computed(() => displayPalette.value.length > 0 ? displayPalette.value : finalPalette.value);

const isSavedWithImage = computed(() => paletteToSave.value.length > 0 && imagePalettes.isSaved(paletteToSave.value));

async function onSaveWithImage(): Promise<void> {
  const colors = paletteToSave.value;
  if (colors.length === 0 || image.value === null) {
    return;
  }
  if (imagePalettes.isSaved(colors)) {
    imagePalettes.unsave(colors);
    notifications.addSuccess(t('moodPalette.removedWithImage'));
    sendPlausibleEvent(PlausibleEventName.IMAGE_PALETTE_REMOVED);
    return;
  }
  const ok = await imagePalettes.save({ image: image.value, colors, source: 'mood-palette' });
  if (ok) {
    notifications.addSuccess(t('moodPalette.savedWithImage'));
    sendPlausibleEvent(PlausibleEventName.IMAGE_PALETTE_SAVED);
  } else {
    notifications.addError(t('moodPalette.saveFailed'));
  }
}

function onDownloadCollage(): void {
  const hexes = (displayPalette.value.length > 0 ? displayPalette.value : finalPalette.value).slice(0, 5);
  if (hexes.length === 0) return;
  const dataUrl = renderCollagePng([{ title: 'Mood Palette', hexes }]);
  downloadDataUrl(dataUrl, 'mood-palette-collage.png');
  sendPlausibleEvent(PlausibleEventName.MOOD_PALETTE_COLLAGE_DOWNLOADED);
}

function onDownloadPdf(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
  sendPlausibleEvent(PlausibleEventName.MOOD_PALETTE_PDF_EXPORTED);
}

function onDownloadColorCard(): void {
  const hexes = displayPalette.value.length > 0 ? displayPalette.value : finalPalette.value;
  if (hexes.length === 0) return;
  const dataUrl = renderColorCardPng(hexes);
  downloadDataUrl(dataUrl, 'mood-palette-color-card.png');
  sendPlausibleEvent(PlausibleEventName.MOOD_PALETTE_CARD_DOWNLOADED);
}

async function onShare(): Promise<void> {
  const text = `Mood Palette: ${finalPalette.value.join(', ')}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: t('moodPalette.title'), text });
    } catch {
      /* cancelado */
    }
  } else {
    await copy(text);
    notifications.addSuccess(t('moodPalette.copied'));
  }
}

function onCopyHex(hex: string): void {
  void copy(hex);
  notifications.addSuccess(`${hex} — ${t('moodPalette.copied')}`);
  sendPlausibleEvent(PlausibleEventName.MOOD_PALETTE_COLOR_COPIED);
}

/* helpers visuales (reusan hexToRgb de common) */
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

function lightness(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
</script>
