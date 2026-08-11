<template>
  <div>
    <p class="text-sm font-semibold mb-2">
      {{ t('moodPalette.autoPaletteTitle') }}
    </p>
    <div class="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      <button
        v-for="hex in hexes"
        :key="hex"
        type="button"
        class="flex-1 h-12 group relative transition-all hover:brightness-110"
        :style="{ backgroundColor: hex }"
        :title="`${hex} · ${t('moodPalette.copyHex')}`"
        :aria-label="`${hex} · ${t('moodPalette.copyHex')}`"
        @click="$emit('copy', hex)"
      >
        <span class="sr-only">{{ hex }}</span>
        <span
          class="absolute inset-x-0 bottom-0 text-[10px] font-mono text-center bg-black/40 text-white opacity-0 group-hover:opacity-100 py-0.5 transition-opacity"
        >
          {{ hex }}
        </span>
      </button>
    </div>
    <p v-if="hexes.length === 0" class="text-xs text-gray-500">
      {{ t('moodPalette.autoPaletteEmpty') }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hexes: string[]
}>();

defineEmits<{
  (e: 'copy', hex: string): void
}>();

const { t } = useI18n();
</script>
