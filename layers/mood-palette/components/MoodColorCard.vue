<template>
  <div
    class="flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-grab active:cursor-grabbing"
    :class="selected
      ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'"
    draggable="true"
    @dragstart="$emit('dragstart', index)"
    @dragover.prevent
    @drop.prevent="$emit('drop', index)"
    @click="$emit('select')"
  >
    <div
      class="w-10 h-10 rounded-md border border-black/10 shrink-0"
      :style="{ backgroundColor: marker.hex }"
    />
    <div class="flex-1 min-w-0">
      <p class="font-mono text-sm font-semibold truncate">
        {{ marker.hex }}
      </p>
      <p class="text-xs text-gray-500 truncate">
        {{ name }}
      </p>
    </div>
    <div class="flex items-center gap-0.5 shrink-0">
      <UButton
        size="xs"
        icon="i-heroicons-clipboard"
        variant="ghost"
        color="gray"
        :aria-label="t('moodPalette.copyHex')"
        @click.stop="$emit('copy', marker.hex)"
      />
      <UButton
        size="xs"
        icon="i-heroicons-trash"
        variant="ghost"
        color="gray"
        :aria-label="t('moodPalette.removeMarker')"
        @click.stop="$emit('remove', marker.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MoodMarker } from '~/layers/mood-palette/composables/useMoodPalette';
import { hexToName } from '~/layers/palette/utils/color-converter.util';

const props = defineProps<{
  marker: MoodMarker
  index: number
  selected: boolean
}>();

defineEmits<{
  (e: 'select'): void
  (e: 'copy', hex: string): void
  (e: 'remove', id: number): void
  (e: 'dragstart', index: number): void
  (e: 'drop', index: number): void
}>();

const { t } = useI18n();

const name = computed(() => {
  const n = hexToName(props.marker.hex);
  return typeof n === 'string' && n ? n : props.marker.hex;
});
</script>
