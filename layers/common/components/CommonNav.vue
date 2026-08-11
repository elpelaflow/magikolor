<template>
  <nav class="border-b border-gray-200">
    <div class="max-w-3xl mx-auto flex items-center justify-between h-16 px-4">
      <div class="flex items-center">
        <!-- logo -->
        <NuxtLinkLocale
          to="/"
          aria-label="Home"
        >
          <img
            width="128px"
            height="auto"
            src="/img/HorizontalLogo.png"
            alt="Magikolor - AI Color Palette generator"
          >
        </NuxtLinkLocale>

        <div class="hidden sm:flex ml-4 items-center">
          <!-- links -->
          <ul class="flex items-center">
            <li
              v-for="(item, index) in links"
              :key="index"
            >
              <UButton
                :to="item.to"
                :label="item.label"
                active-class="text-primary"
                variant="soft"
                class="hover:text-primary font-semibold"
                size="md"
              />
            </li>
          </ul>

          <!-- explore popover -->
          <UPopover
            v-model:open="isExploreOpen"
            mode="hover"
          >
            <UButton
              variant="soft"
              class="hover:text-primary font-semibold"
              size="md"
              icon="i-heroicons-chevron-down-16-solid"
              trailing
            >
              {{ $t('nav.explore') }}
            </UButton>

            <template #panel>
              <div class="p-2">
                <UHeaderPopoverLinks
                  :links="exploreLinks"
                  :ui="{
                    base: 'text-left',
                    wrapper: 'grid gap-2 max-w-xs space-y-0 items-start justify-start text-left',
                    icon: {
                      base: 'text-primary w-4 h-4 mt-2'
                    },
                  }"
                />
              </div>
            </template>
          </UPopover>

          <!-- tools popover -->
          <UPopover
            v-model:open="isOpen"
            mode="hover"
          >
            <UButton
              variant="soft"
              class="hover:text-primary font-semibold"
              size="md"
              icon="i-heroicons-chevron-down-16-solid"
              trailing
            >
              {{ $t('nav.tools') }}
            </UButton>

            <template #panel>
              <div class="p-2">
                <UHeaderPopoverLinks
                  :links="toolsLinks"
                  :ui="{
                    base: 'text-left',
                    wrapper: 'grid gap-2 max-w-xs space-y-0 items-start justify-start text-left',
                    icon: {
                      base: 'text-primary w-4 h-4 mt-2'
                    },
                  }"
                />
              </div>
            </template>
          </UPopover>

          <!-- utils popover -->
          <UPopover
            v-model:open="isUtilsOpen"
            mode="hover"
          >
            <UButton
              variant="soft"
              class="hover:text-primary font-semibold"
              size="md"
              icon="i-heroicons-chevron-down-16-solid"
              trailing
            >
              {{ $t('nav.utils') }}
            </UButton>

            <template #panel>
              <div class="p-2">
                <UHeaderPopoverLinks
                  v-if="utilsLinks.length"
                  :links="utilsLinks"
                  :ui="{
                    base: 'text-left',
                    wrapper: 'grid gap-2 max-w-xs space-y-0 items-start justify-start text-left',
                    icon: {
                      base: 'text-primary w-4 h-4 mt-2'
                    },
                  }"
                />
                <p v-else class="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">
                  {{ $t('utils.comingSoon') }}
                </p>
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <!-- right -->
      <div class="flex items-center gap-2 sm:gap-4">
        <UButton
          icon="i-fa6-brands-github"
          to="https://github.com/elpelaflow/magikolor"
        />

        <!-- lang switcher-->
        <CommonLangSwitcher />

        <!-- mobile bars button -->
        <UButton
          icon="i-heroicons-bars-3"
          class="sm:hidden"
          aria-label="nav"
          @click="openModal()"
        />
      </div>
    </div>

    <!-- mobile menu modal -->
    <UModal
      v-model="isModalOpen"
      fullscreen
    >
      <div class="p-4 overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <!-- logo -->
          <NuxtLinkLocale
            to="/"
            aria-label="Home"
          >
            <img
              width="128px"
              height="auto"
              src="/img/HorizontalLogo.png"
              alt="Magikolor - AI Color Palette generator"
            >
          </NuxtLinkLocale>

          <!-- close button -->
          <UButton
            icon="i-heroicons-x-mark"
            @click="isModalOpen = false"
          />
        </div>

        <!-- links -->
        <UVerticalNavigation :links="[[...links],[...exploreLinks],[...toolsLinks],[...utilsLinks]]" />
      </div>
    </UModal>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const isOpen = ref(false);
const isExploreOpen = ref(false);
const isUtilsOpen = ref(false);

const {
  isOpen: isModalOpen,
  open: openModal,
  close: closeModal
} = useModalV2();

const links = computed(() => [
  {
    label: t('nav.home'),
    to: localePath('/')
  },
  {
    label: t('nav.recent'),
    to: localePath('/recent')
  },
  {
    label: t('nav.favorites'),
    to: localePath('/favorites')
  }
]);

const exploreLinks = computed(() => [
  {
    to: localePath('/palette/explore'),
    label: t('nav.exploreColorPalettes'),
    description: t('explore.seoDescription'),
    icon: 'i-heroicons-swatch'
  },
  {
    to: localePath('/explore/gradients'),
    label: t('nav.exploreGradients'),
    description: t('exploreGradients.seoDescription'),
    icon: 'i-heroicons-bars-arrow-down'
  },
  {
    to: localePath('/explore/colors'),
    label: t('nav.exploreColors'),
    description: t('exploreColors.seoDescription'),
    icon: 'i-heroicons-circle-stack'
  },
  {
    to: localePath('/explore/image-palettes'),
    label: t('nav.exploreImagePalettes'),
    description: t('exploreImagePalettes.seoDescription'),
    icon: 'i-heroicons-photo'
  }
]);

const toolsLinks = computed(() => [{
  to: localePath('/'),
  label: t('nav.colorPaletteGenrator'),
  description: t('home.title'),
  icon: 'i-heroicons-paint-brush'
},
{
  to: localePath('/random-color'),
  label: t('nav.randomColor'),
  description: t('randomColor.seoDescription'),
  icon: 'i-heroicons-arrow-path'
},
{
  to: localePath('/image-color-picker'),
  label: t('nav.imageColorPicker'),
  description: t('imageColorPicker.seoDescription'),
  icon: 'i-heroicons-photo'
},
{
  to: localePath('/contrast-checker'),
  label: t('nav.contrastChecker'),
  description: t('contrastChecker.seoDescription'),
  icon: 'i-heroicons-sun'
},
{
  to: localePath('/color-mixer'),
  label: t('nav.colorMixer'),
  description: t('colorMixer.seoDescription'),
  icon: 'i-heroicons-swatch'
},
{
  to: localePath('/all-colors'),
  label: t('nav.allColors'),
  description: t('allColors.seoDescription'),
  icon: 'i-heroicons-adjustments-horizontal'
},
{
  to: localePath('/color-palette-creator'),
  label: t('nav.colorPaletteCreator'),
  description: t('colorPaletteCreator.seoDescription'),
  icon: 'i-heroicons-squares-2x2'
},
{
  to: localePath('/gradient-generator'),
  label: t('nav.gradientGenerator'),
  description: t('gradientGenerator.seoDescription'),
  icon: 'i-heroicons-bars-arrow-down'
},
{
  to: localePath('/gradient-palette'),
  label: t('nav.gradientPalette'),
  description: t('gradientPalette.seoDescription'),
  icon: 'i-heroicons-swatch'
},
{
  to: localePath('/color-token-extractor'),
  label: t('nav.tokenExtractor'),
  description: t('tokenExtractor.seoDescription'),
  icon: 'i-heroicons-code-bracket'
},
{
  to: localePath('/palette-maker'),
  label: t('nav.paletteMaker'),
  description: t('paletteMaker.seoDescription'),
  icon: 'i-heroicons-swatch'
},
{
  to: localePath('/mood-palette'),
  label: t('nav.moodPalette'),
  description: t('moodPalette.seoDescription'),
  icon: 'i-heroicons-photo'
}]);

watch(useRoute(), () => {
  isOpen.value = false;
  isExploreOpen.value = false;
  isUtilsOpen.value = false;
  closeModal();
});

/**
 * Utilidades: se van agregando acá a medida que se crean.
 * Cada entrada: { to, label, description, icon } — mismo shape que toolsLinks.
 */
const utilsLinks = computed<{ to: string; label: string; description: string; icon: string }[]>(() => [{
  to: localePath('/skin-tone-palette'),
  label: t('nav.skinTonePalette'),
  description: t('skinTonePalette.seoDescription'),
  icon: 'i-heroicons-face-smile'
},
{
  to: localePath('/complementary-color'),
  label: t('nav.complementaryColor'),
  description: t('complementaryColor.seoDescription'),
  icon: 'i-heroicons-adjustments-horizontal'
},
{
  to: localePath('/brand-colors'),
  label: t('nav.brandColors'),
  description: t('brandColors.seoDescription'),
  icon: 'i-heroicons-building-office-2'
}]);
</script>
