<template>
  <UModal
    :model-value="isOpen"
    @update:model-value="close"
  >
    <div class="p-4">
      <p class="text-lg font-bold mb-2">
        {{ t('moodPalette.stockSearchTitle') }}
      </p>

      <div class="flex gap-2 mb-3">
        <UInput
          v-model="query"
          size="md"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('moodPalette.stockSearchPlaceholder')"
          class="flex-1"
          @keyup.enter="search"
        />
        <UButton
          size="md"
          icon="i-heroicons-magnifying-glass"
          :label="t('moodPalette.stockSearchButton')"
          :loading="isLoading"
          @click="search"
        />
      </div>

      <div class="flex items-center gap-2 mb-3">
        <USelect
          v-model="provider"
          size="sm"
          :options="providers"
          class="w-40"
        />
        <p v-if="isFallback" class="text-xs text-gray-500">
          {{ t('moodPalette.stockFallback') }}
        </p>
      </div>

      <p v-if="!isLoading && results.length === 0" class="text-sm text-gray-500 py-6 text-center">
        {{ t('moodPalette.stockEmpty') }}
      </p>

      <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-auto">
        <li
          v-for="item in results"
          :key="item.id"
        >
          <button
            type="button"
            class="block w-full rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
            @click="importImage(item)"
          >
            <img
              :src="item.url"
              :alt="item.author"
              class="w-full h-24 object-cover"
              loading="lazy"
            >
            <span class="block text-[10px] text-gray-500 px-1 py-0.5 truncate text-left">
              {{ item.author }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { getImageBase64 } from '~/layers/image-color-picker/utils/image-color-picker.util';

interface StockImage {
  id: string
  url: string
  author: string
  pageUrl: string
  provider: string
}

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'import', dataUrl: string): void
}>();

const { t } = useI18n();

const query = ref('');
const provider = ref('unsplash');
const results = ref<StockImage[]>([]);
const isLoading = ref(false);
const isFallback = ref(false);

const providers = computed(() => [
  { label: 'Unsplash', value: 'unsplash' },
  { label: 'Pexels', value: 'pexels' },
  { label: 'Pixabay', value: 'pixabay' }
]);

async function search(): Promise<void> {
  isLoading.value = true;
  isFallback.value = false;
  try {
    const res = await $fetch<{ results: StockImage[], fallback?: boolean }>('/api/stock-search', {
      query: { q: query.value, provider: provider.value }
    });
    results.value = res.results ?? [];
    isFallback.value = res.fallback ?? false;
  } catch {
    results.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function importImage(item: StockImage): Promise<void> {
  const dataUrl = await getImageBase64(item.url);
  if (dataUrl !== null) {
    emit('import', dataUrl);
    emit('close');
  }
}

function close(): void {
  emit('close');
}

// busca al abrir por primera vez
watch(() => props.isOpen, (open) => {
  if (open && results.value.length === 0) {
    void search();
  }
});
</script>
