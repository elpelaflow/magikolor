<template>
  <div>
    <!-- selector de tipo -->
    <div class="flex flex-wrap gap-2 mb-4">
      <UButtonGroup size="sm">
        <UButton
          v-for="type in TYPES"
          :key="type"
          :label="t(`colorBlind.${type}`)"
          :variant="selected === type ? 'solid' : 'soft'"
          @click="onSelect(type)"
        />
      </UButtonGroup>
    </div>

    <!-- swatches simulados -->
    <ul class="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <li
        v-for="(hex, i) in simulated"
        :key="`${selected}-${i}`"
        class="flex-1 relative min-w-0"
        :style="{ backgroundColor: hex }"
      >
        <span
          class="absolute inset-x-0 bottom-0 text-center text-[10px] font-mono py-0.5 truncate"
          :style="{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }"
        >
          {{ hex }}
        </span>
      </li>
    </ul>

    <p
      v-if="selected !== 'normal'"
      class="text-xs text-gray-500 mt-2"
    >
      {{ t('colorBlind.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PlausibleEventName } from '~/layers/plausible/types';
import { simulatePaletteColorBlindness, type ColorBlindnessType } from '~/layers/common/utils/color-blind.util';

const props = defineProps<{
  colors: string[]
}>();

const { t } = useI18n();

const TYPES = ['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const;
type VisionType = 'normal' | ColorBlindnessType;

const selected = ref<VisionType>('normal');

const simulated = computed(() =>
  selected.value === 'normal'
    ? props.colors
    : simulatePaletteColorBlindness(props.colors, selected.value)
);

watch(() => props.colors, () => {
  selected.value = 'normal';
});

function onSelect(type: VisionType): void {
  selected.value = type;
  if (type !== 'normal') {
    sendPlausibleEvent(PlausibleEventName.COLOR_BLIND_SIMULATED);
  }
}
</script>
