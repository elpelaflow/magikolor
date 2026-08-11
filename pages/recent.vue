<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('recent.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('recent.seoDescription') }}
      </p>
    </div>
    <ul
      v-if="session.size"
      class="grid sm:grid-cols-3 gap-4"
    >
      <li
        v-for="([key, item]) in Array.from(session)"
        :key="key"
      >
        <ColorPaletteButton
          :colors="item.colors"
          :name="item.text"
          :id="key"
          :to="localePath(`/palette/${key}`)"
        />
      </li>
    </ul>

    <CommonEmptyState
      v-else
      icon="i-heroicons-clock"
      :title="$t('recent.noneFound')"
    />
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage, StorageSerializers } from '@vueuse/core';
import type { PaletteModel } from '~/layers/palette/models/palette.model';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t('recent.seoTitle'),
  description: t('home.seoDescription')
});

const session = useLocalStorage<Map<string, PaletteModel>>(
  'palettes:created',
  new Map(),
  { serializer: StorageSerializers.map }
);
</script>
