<template>
  <div>
    <!-- header -->
    <div class="mb-8">
      <h1>
        {{ $t('exploreImagePalettes.title') }}
      </h1>
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('exploreImagePalettes.seoDescription') }}
      </p>

      <p class="italic text-sm">
        {{ imagePalettes.length }} {{ $t('exploreImagePalettes.countLabel') }}
      </p>
    </div>

    <!-- localStorage -> solo cliente -->
    <ClientOnly>
      <template #fallback>
        <ul class="grid sm:grid-cols-3 gap-4">
          <li v-for="index in 6" :key="index">
            <USkeleton class="w-full h-40" />
          </li>
        </ul>
      </template>

      <!-- empty state -->
      <CommonEmptyState
        v-if="imagePalettes.length === 0"
        icon="i-heroicons-photo"
        :title="$t('exploreImagePalettes.emptyTitle')"
        :description="$t('exploreImagePalettes.emptyDescription')"
      >
        <div class="flex flex-wrap justify-center gap-2">
          <UButton
            size="xl"
            color="primary"
            :label="$t('nav.imageColorPicker')"
            :to="localePath('/image-color-picker')"
          />
          <UButton
            size="xl"
            variant="soft"
            :label="$t('nav.moodPalette')"
            :to="localePath('/mood-palette')"
          />
        </div>
      </CommonEmptyState>

      <!-- grid -->
      <ul
        v-else
        class="grid sm:grid-cols-3 gap-4"
      >
        <li
          v-for="p in imagePalettes"
          :key="p.id"
          class="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900"
        >
          <div class="relative group">
            <img
              :src="p.image"
              :alt="sourceLabel(p)"
              class="w-full h-32 object-cover"
              loading="lazy"
            >
            <span class="absolute bottom-1 left-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/50 text-white">
              {{ sourceLabel(p) }}
            </span>
            <button
              class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-black/40 text-white"
              :title="$t('paletteMaker.remove')"
              :aria-label="$t('paletteMaker.remove')"
              @click="onRemove(p)"
            >
              <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="flex h-9">
            <div
              v-for="(hex, i) in p.colors"
              :key="`${p.id}-${i}`"
              class="flex-1"
              :style="{ backgroundColor: hex }"
              :title="hex"
            />
          </div>

          <div class="p-2 flex items-center justify-between">
            <span class="text-xs text-gray-500 font-mono">{{ p.colors.length }} {{ $t('favorites.savedPalettesCount') }}</span>
            <UButton
              size="xs"
              variant="soft"
              color="primary"
              icon="i-heroicons-clipboard"
              :label="$t('paletteMaker.copyHex')"
              @click="onCopy(p)"
            />
          </div>
        </li>
      </ul>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import type { SavedImagePalette } from '~/layers/common/composables/useImagePalettes';
import { useImagePalettes } from '~/layers/common/composables/useImagePalettes';

const { t } = useI18n();
const localePath = useLocalePath();
const { copy } = useClipboard();
const notifications = useNotifications();

const { saved: imagePalettes, remove: removeImagePalette } = useImagePalettes();

const title = t('exploreImagePalettes.seoTitle');
const description = t('exploreImagePalettes.seoDescription');

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});

function sourceLabel(p: SavedImagePalette): string {
  return p.source === 'mood-palette' ? t('moodPalette.title') : t('imageColorPicker.title');
}

function onCopy(p: SavedImagePalette): void {
  copy(p.colors.join(', '));
  notifications.addSuccess(t('paletteMaker.copied'));
}

function onRemove(p: SavedImagePalette): void {
  removeImagePalette(p.id);
}
</script>
