<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('exploreColors.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('exploreColors.seoDescription') }}
      </p>

      <!-- search -->
      <UInput
        v-model="search"
        size="xl"
        icon="i-heroicons-magnifying-glass"
        :placeholder="$t('exploreColors.searchPlaceholder')"
        class="max-w-md"
      />

      <p class="italic text-sm mt-3">
        {{ filteredColors.length.toLocaleString() }} {{ $t('exploreColors.countLabel') }}
      </p>
    </div>

    <!-- grid -->
    <div v-if="visibleColors.length > 0">
      <ul class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-3">
        <li
          v-for="c in visibleColors"
          :key="`${c[0]}-${c[1]}`"
          class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900"
        >
          <!-- swatch -->
          <button
            class="w-full h-16 relative group"
            :style="{ backgroundColor: `#${c[0]}` }"
            :title="`${c[1]} · #${c[0].toLowerCase()}`"
            :aria-label="`Copy ${c[1]}`"
            @click="onCopy(c)"
          >
            <span
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
            >
              <UIcon
                name="i-heroicons-clipboard"
                class="w-5 h-5 text-white"
              />
            </span>
          </button>

          <!-- info -->
          <div class="p-1.5">
            <p class="text-xs font-semibold truncate">
              {{ c[1] }}
            </p>
            <p class="text-[10px] font-mono text-gray-500">
              #{{ c[0].toLowerCase() }}
            </p>
          </div>
        </li>
      </ul>

      <!-- load more -->
      <div class="mt-8 text-center">
        <UButton
          :label="$t('exploreColors.loadMore')"
          :disabled="visibleColors.length >= filteredColors.length"
          @click="visibleCount += PAGE_SIZE"
        />
      </div>
    </div>

    <!-- no results -->
    <CommonEmptyState
      v-else
      icon="i-heroicons-magnifying-glass"
      :title="$t('exploreColors.noResultsTitle')"
      :description="$t('exploreColors.noResultsDescription')"
    />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import ntc from '~/layers/palette/utils/ntc.util';

const { t } = useI18n();
const { copy } = useClipboard();
const notifications = useNotifications();

const title = t('exploreColors.seoTitle');
const description = t('exploreColors.seoDescription');

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});

const PAGE_SIZE = 120;

/** Entradas [hex, name] (+ rgb/hsl agregados por ntc.init()). */
const allColors = ntc.names as Array<[string, string]>;

const search = ref('');
const visibleCount = ref(PAGE_SIZE);

const filteredColors = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (query === '') {
    return allColors;
  }
  return allColors.filter((c) => {
    const hex = c[0].toLowerCase();
    const name = c[1].toLowerCase();
    return hex.includes(query) || name.includes(query);
  });
});

const visibleColors = computed(() => filteredColors.value.slice(0, visibleCount.value));

watch(search, () => {
  visibleCount.value = PAGE_SIZE;
});

function onCopy(c: [string, string]): void {
  const hex = `#${c[0].toLowerCase()}`;
  copy(hex);
  notifications.addSuccess(`${c[1]} ${hex} — ${t('paletteMaker.copied')}`);
}
</script>
