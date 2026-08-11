<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('exploreGradients.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('exploreGradients.seoDescription') }}
      </p>

      <!-- count + CTA -->
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <p class="italic text-sm">
          {{ savedGradients.length }} {{ $t('exploreGradients.countLabel') }}
        </p>
        <UButton
          icon="i-heroicons-arrow-top-right-on-square"
          :label="$t('exploreGradients.openGenerator')"
          variant="soft"
          :to="localePath('/gradient-generator')"
        />
      </div>
    </div>

    <!-- localStorage -> solo cliente -->
    <ClientOnly>
      <template #fallback>
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <li v-for="index in 8" :key="index">
            <USkeleton class="w-full h-24" />
          </li>
        </ul>
      </template>

      <!-- empty state -->
      <CommonEmptyState
        v-if="savedGradients.length === 0"
        icon="i-heroicons-bars-arrow-down"
        :title="$t('exploreGradients.emptyTitle')"
        :description="$t('exploreGradients.emptyDescription')"
      >
        <UButton
          size="xl"
          color="primary"
          :label="$t('exploreGradients.openGenerator')"
          :to="localePath('/gradient-generator')"
        />
      </CommonEmptyState>

      <!-- grid -->
      <ul
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        <li
          v-for="g in savedGradients"
          :key="g.id"
          class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900"
        >
          <button
            class="w-full h-20 block cursor-pointer hover:opacity-90 transition-opacity"
            :style="{ background: buildGradientValue(g.config) }"
            :title="g.name"
            :aria-label="$t('gradientGenerator.copyCss')"
            @click="onCopyGradient(g)"
          />
          <div class="p-2 bg-white dark:bg-gray-900">
            <div class="flex items-center justify-between gap-1">
              <p class="text-xs font-semibold truncate">
                {{ g.name }}
              </p>
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                variant="ghost"
                color="gray"
                :aria-label="$t('gradientGenerator.deleteGradient')"
                @click="onDelete(g.id)"
              />
            </div>
            <p class="text-[10px] text-gray-500 font-mono truncate">
              {{ $t(`gradientGenerator.types.${g.config.type}`) }} · {{ g.config.angle }}°
            </p>
          </div>
        </li>
      </ul>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { buildCssDeclaration, buildGradientValue, loadSavedGradients, persistSavedGradients, type SavedGradient } from '~/layers/gradient-generator/utils/gradient-generator.util';

const { t } = useI18n();
const localePath = useLocalePath();
const { copy } = useClipboard();
const notifications = useNotifications();

const title = t('exploreGradients.seoTitle');
const description = t('exploreGradients.seoDescription');

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});

const savedGradients = ref<SavedGradient[]>([]);

onMounted(() => {
  savedGradients.value = loadSavedGradients();
});

function onCopyGradient(gradient: SavedGradient): void {
  copy(buildCssDeclaration(gradient.config));
  notifications.addSuccess(t('gradientGenerator.copiedCss'));
}

function onDelete(id: string): void {
  const list = savedGradients.value.filter(g => g.id !== id);
  persistSavedGradients(list);
  savedGradients.value = list;
  notifications.addSuccess(t('gradientGenerator.savedSuccess'));
}
</script>
