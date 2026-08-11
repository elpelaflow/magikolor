<template>
  <div
    ref="wrapperRef"
    class="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 select-none cursor-crosshair"
    :class="{ 'outline outline-2 outline-primary': isDragging }"
    @pointerdown="onPointerDown"
  >
    <img
      :src="image"
      alt="Mood palette source"
      class="block w-full h-auto pointer-events-none"
      draggable="false"
    >

    <!-- marcadores -->
    <button
      v-for="marker in markers"
      :key="marker.id"
      type="button"
      class="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-lg pointer-events-auto transition-transform"
      :class="selectedId === marker.id
        ? 'scale-125 ring-2 ring-primary z-20'
        : 'hover:scale-110 z-10'"
      :style="{
        left: `${marker.x * 100}%`,
        top: `${marker.y * 100}%`,
        backgroundColor: marker.hex
      }"
      :aria-label="`Marker ${marker.hex}`"
      @pointerdown.stop="onMarkerDown($event, marker)"
      @click.stop="select(marker.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { MoodMarker } from '~/layers/mood-palette/composables/useMoodPalette';

const props = defineProps<{
  image: string
  markers: MoodMarker[]
  selectedId: number | null
}>();

const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'move', id: number, x: number, y: number): void
  (e: 'moveStart'): void
  (e: 'add', x: number, y: number): void
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);

/** Convierte un evento pointer a coordenadas relativas (0..1) sobre el lienzo. */
function toRelative(event: PointerEvent | MouseEvent): { x: number, y: number } | null {
  const el = wrapperRef.value;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  };
}

let dragId: number | null = null;
let hasDragged = false;

function onMarkerDown(event: PointerEvent, marker: MoodMarker): void {
  event.stopPropagation();
  emit('select', marker.id);
  dragId = marker.id;
  isDragging.value = true;
  hasDragged = false;

  const onMove = (e: PointerEvent): void => {
    if (dragId === null) return;
    // Commit del historial solo cuando empieza un arrastre real (evita no-ops).
    if (!hasDragged) {
      hasDragged = true;
      emit('moveStart');
    }
    const rel = toRelative(e);
    if (rel) {
      emit('move', dragId, rel.x, rel.y);
    }
  };
  const onUp = (): void => {
    dragId = null;
    isDragging.value = false;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

/** Click en el lienzo (fuera de un marcador) → agrega uno nuevo. */
function onPointerDown(event: PointerEvent): void {
  const rel = toRelative(event);
  if (rel) {
    emit('add', rel.x, rel.y);
  }
}

function select(id: number): void {
  emit('select', id);
}
</script>
