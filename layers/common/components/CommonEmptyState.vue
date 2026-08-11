<template>
  <div
    class="text-center"
    :class="compact ? 'py-6' : 'py-16'"
  >
    <UIcon
      v-if="icon"
      :name="icon"
      class="mx-auto text-gray-300 mb-4"
      :class="compact ? 'w-8 h-8' : 'w-12 h-12'"
    />
    <p
      class="font-semibold mb-2"
      :class="compact ? 'text-sm' : 'text-lg'"
    >
      {{ title }}
    </p>
    <p
      v-if="description"
      class="text-gray-500 max-w-sm mx-auto"
      :class="compact ? 'text-xs' : 'text-base'"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-6"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  /** Versión compacta para estados vacíos dentro de paneles/grupos chicos. */
  compact?: boolean
}>(), {
  icon: 'i-heroicons-circle-stack',
  description: '',
  compact: false
});
</script>
