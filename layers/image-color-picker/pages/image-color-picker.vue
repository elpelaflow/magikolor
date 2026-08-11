<template>
  <div>
    <!-- header-->
    <div class="mb-8">
      <!-- title -->
      <h1>
        {{ $t('imageColorPicker.title') }}
      </h1>

      <!-- description-->
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ $t('imageColorPicker.seoDescription') }}
      </p>
    </div>

    <!-- form -->
    <UForm
      :state="state"
      :schema="FormSchema"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- image -->
      <UFormGroup
        name="dataUrl"
        :label="$t('imageColorPicker.uploadPlaceholder')"
      >
        <img
          v-if="state.dataUrl !== ''"
          :src="state.dataUrl"
          class="w-full h-40 mb-4 object-contain bg-gray-200"
        >
        <UInput
          type="file"
          size="xl"
          accept="image/*"
          icon="i-heroicons-photo"
          @change="files = $event"
        />
      </UFormGroup>

      <!-- divider: upload file OR image URL -->
      <UDivider
        :label="$t('imageColorPicker.orLabel')"
        class="py-1"
      />

      <!-- image url -->
      <UFormGroup
        name="imageUrl"
        :label="$t('imageColorPicker.imageUrl')"
      >
        <div class="flex gap-2">
          <UInput
            v-model="imageUrl"
            size="xl"
            :placeholder="$t('imageColorPicker.imageUrlPlaceholder')"
            icon="i-heroicons-link"
            class="flex-1"
            :disabled="isPending || isFetchingImage"
            @keyup.enter="onClickUrl"
          />
          <UButton
            size="xl"
            icon="i-heroicons-arrow-down-tray"
            :label="$t('imageColorPicker.imageUrlLoad')"
            :loading="isFetchingImage"
            :disabled="isPending"
            @click="onClickUrl"
          />
        </div>
      </UFormGroup>

      <!-- submit button -->
      <UButton
        type="submit"
        block
        size="xl"
        class="mt-4"
        color="primary"
        :label="$t('generate.label')"
        :loading="isPending || isFetchingImage"
      />
    </UForm>

    <!-- examples -->
    <div class="max-w-3xl mt-8">
      <p class="text-lg font-bold mb-4">
        {{ $t('home.exampleLabel') }}
      </p>
      <ul class="grid sm:grid-cols-3 gap-4">
        <li
          v-for="(item, index) in getSampleImages()"
          :key="index"
        >
          <ImageButton
            :thumbnail-url="item"
            :name="'dunno'"
            :disabled="isPending || isFetchingImage"
            @click="onClickExample(item)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, type InferType, string } from 'yup';
import type { FormSubmitEvent } from '#ui/types';

import { extractPaletteFromImage } from '../utils/image-color-picker.util';
import { useImagePalettes } from '~/layers/common/composables/useImagePalettes';
import { sendPlausibleEvent } from '~/layers/plausible/utils/plausible.util';
import { PlausibleEventName } from '~/layers/plausible/types';

const { t } = useI18n();
const localePath = useLocalePath();

const title = t('imageColorPicker.seoTitle');
const description = t('imageColorPicker.seoDescription');

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});

const notifications = useNotifications();
const { mutate: create, isPending } = useCreatePalette();
const imagePalettes = useImagePalettes();

const files = ref<FileList>();
const imageUrl = ref('');
const isFetchingImage = ref(false);
/** Colores extraídos de la imagen actual (para guardarlos junto con ella). */
const extractedColors = ref<string[]>([]);

const state = ref({
  prompt: '',
  dataUrl: ''
});

const FormSchema = object({
  prompt: string().required(),
  dataUrl: string().required()
});

export type Form = InferType<typeof FormSchema>;

function onSubmit(event: FormSubmitEvent<Form>): void {
  create({ prompt: event.data.prompt }, {
    onError: (err) => {
      notifications.addError(err.message ?? t('palette.createError'));
    },
    onSuccess: (value) => {
      void savePaletteWithImage(extractedColors.value);
      void navigateTo(localePath(`/palette/${value.id}`));
    }
  });
}

/**
 * Persiste la paleta extraída JUNTO con la imagen (localStorage) para que
 * quede guardada en la sección "Image palettes" de /favorites.
 */
async function savePaletteWithImage(colors: string[], image?: string): Promise<void> {
  const img = image ?? state.value.dataUrl;
  if (colors.length === 0 || img === '') {
    return;
  }
  const ok = await imagePalettes.save({ image: img, colors, source: 'image-color-picker' });
  if (ok) {
    notifications.addSuccess(t('imageColorPicker.savedWithImage'));
    sendPlausibleEvent(PlausibleEventName.IMAGE_PALETTE_SAVED);
  }
}

async function onClickExample(thumbnailUrl: string): Promise<void> {
  isFetchingImage.value = true;

  const imageBase64 = await getImageBase64(thumbnailUrl);
  if (imageBase64 === null) {
    isFetchingImage.value = false;
    return;
  }

  const colors = await extractPaletteFromImage(imageBase64);
  if (colors === null || colors.length === 0) {
    notifications.addError(t('imageColorPicker.extractionError'));
    isFetchingImage.value = false;
    return;
  }
  extractedColors.value = colors;

  create({ prompt: colors.toString() }, {
    onError: (err) => {
      notifications.addError(err.message ?? t('palette.createError'));
    },
    onSuccess: (value) => {
      void savePaletteWithImage(extractedColors.value, imageBase64);
      void navigateTo(localePath(`/palette/${value.id}`));
    }
  });

  isFetchingImage.value = false;
}

/** @description load an image from a pasted URL (server-side proxy to avoid CORS) */
async function onClickUrl(): Promise<void> {
  const url = imageUrl.value.trim();
  if (url === '' || isPending.value || isFetchingImage.value) {
    return;
  }

  isFetchingImage.value = true;
  try {
    const response = await $fetch<{ dataUrl: string }>('/api/image-url', { query: { url } });
    state.value.dataUrl = response.dataUrl;

    const colors = await extractPaletteFromImage(response.dataUrl);
    if (colors !== null && colors.length > 0) {
      extractedColors.value = colors;
      state.value.prompt = colors.toString();
    } else {
      notifications.addError(t('imageColorPicker.extractionError'));
    }
  } catch (err: any) {
    const message = err?.data?.statusMessage ?? err?.message;
    notifications.addError(message ?? t('imageColorPicker.imageUrlError'));
  } finally {
    isFetchingImage.value = false;
  }
}

/** @description load the image preview */
watch(files, () => {
  if (files.value?.[0] !== undefined) {
    const reader = new FileReader();

    reader.onload = () => {
      state.value.dataUrl = reader.result as string;
      void extractPaletteFromImage(state.value.dataUrl).then(colors => {
        if (colors !== null && colors.length > 0) {
          extractedColors.value = colors;
          state.value.prompt = colors.toString();
        } else {
          notifications.addError(t('imageColorPicker.extractionError'));
        }
      });
    };

    reader.readAsDataURL(files.value[0]);
  } else {
    state.value.dataUrl = '';
  }
});
</script>
