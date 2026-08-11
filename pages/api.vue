<template>
  <div>
    <!-- header-->
    <div class="mb-8">
      <!-- title -->
      <h1>
        {{ $t('api.title') }}
      </h1>

      <!-- description-->
      <p class="text-xl font-medium mb-4 max-w-xl">
        {{ description }}
      </p>
    </div>

    <!-- get color palette -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] color palette:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ getPaletteUrl }}</pre>
    </div>

    <!-- list color palettes -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] list color palettes:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ listPalettesUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "page": number, "size": number }</pre>
    </div>

    <!-- create color palette -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] create color palette:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ createPaletteUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "prompt": string }</pre>
    </div>

    <!-- clone color palette -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] clone color palette:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ clonePaletteUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "id": string, "colors": string[] }</pre>
    </div>

    <!-- count color palettes -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] count color palettes (last 24h):
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ countPalettesUrl }}</pre>
    </div>

    <!-- harmonies -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] color harmonies:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ harmoniesUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { base: string, type?: "analogous" | "complementary" | "triadic" | "tetradic" | "splitComplementary" | "tintsShades", style?: "square" | "triangle" | "circle" | "diamond", count?: number (3-30), sine?: number, wave?: number, zap?: number, block?: number }</pre>
    </div>

    <!-- pantone -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] pantone lookup:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ pantoneUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { hex?: string, code?: string, q?: string, limit?: number }</pre>
    </div>

    <!-- color name -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] color name:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ colorNameUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { hex: string }</pre>
    </div>

    <!-- random color -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] random color:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ randomColorUrl }}</pre>
    </div>

    <!-- contrast checker -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] contrast checker:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ contrastCheckerUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { primary: string, secondary: string }</pre>
    </div>

    <!-- color mixer -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] color mixer:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ colorMixerUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { a: string, b: string, ratio?: number }</pre>
    </div>

    <!-- image color picker -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] image color picker:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ imageColorPickerUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "image": "data:image/...;base64,...", "count": number }</pre>
    </div>

    <!-- image url proxy -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] image url (proxy to data URL):
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ imageUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { url: string }</pre>
    </div>

    <!-- color token extractor -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] color token extractor:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ colorTokenExtractorUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "url": "https://example.com" }</pre>
    </div>

    <!-- color token extractor runtime -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] color token extractor — rendered colors (runtime):
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ colorTokenRuntimeUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "url": "https://example.com" } — requiere el worker color-renderer (Playwright)</pre>
    </div>

    <!-- feedback -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [POST] feedback:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ feedbackUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">body: { "email": string, "feedback": string }</pre>
    </div>

    <!-- og get -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] open graph image (palette):
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ ogGetUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { colors: string, text: string } — devuelve image/png</pre>
    </div>

    <!-- og tag -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] open graph image (tag grid):
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ ogTagUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { tag: string, text: string } — devuelve image/png</pre>
    </div>

    <!-- stock search -->
    <div class="mb-4 space-y-2">
      <p class="font-semibold">
        [GET] stock image search:
      </p>
      <pre class="border bg-gray-50 rounded-sm px-1">{{ stockSearchUrl }}</pre>
      <pre class="border bg-gray-50 rounded-sm px-1 text-sm">query: { q: string, provider?: "unsplash" | "pexels" | "pixabay" }</pre>
    </div>

    <UAlert
      class="mt-8"
      color="yellow"
      variant="subtle"
      title="Disclaimer"
      :description="$t('api.disclaimer')"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const title = t('api.seoTitle');
const description = t('api.seoDescription');

const { apiUrl } = useRuntimeConfig().public;
const getPaletteUrl = `${apiUrl}/palette/{paletteId}`;
const listPalettesUrl = `${apiUrl}/palette/list`;
const createPaletteUrl = `${apiUrl}/palette/create`;
const clonePaletteUrl = `${apiUrl}/palette/clone`;
const countPalettesUrl = `${apiUrl}/palette/count`;
const harmoniesUrl = `${apiUrl}/harmonies?base=%232D6A4F&type=analogous&style=circle&count=8`;
const pantoneUrl = `${apiUrl}/pantone?hex=%23f6eb64&limit=3`;
const colorNameUrl = `${apiUrl}/color-name?hex=%232C3E50`;
const randomColorUrl = `${apiUrl}/random-color`;
const contrastCheckerUrl = `${apiUrl}/contrast-checker?primary=%23ffffff&secondary=%23000000`;
const colorMixerUrl = `${apiUrl}/color-mixer?a=%23ff0000&b=%230000ff&ratio=0.5`;
const imageColorPickerUrl = `${apiUrl}/image-color-picker`;
const imageUrl = `${apiUrl}/image-url?url=https%3A%2F%2Fexample.com%2Fimage.jpg`;
const colorTokenExtractorUrl = `${apiUrl}/color-token-extractor`;
const colorTokenRuntimeUrl = `${apiUrl}/color-token-extractor/runtime`;
const feedbackUrl = `${apiUrl}/feedback/create`;
const ogGetUrl = `${apiUrl}/og/get?colors=%23ff0000:%2300ff00:%230000ff&text=My%20palette`;
const ogTagUrl = `${apiUrl}/og/tag?tag=green&text=Green%20palettes`;
const stockSearchUrl = `${apiUrl}/stock-search?q=sunset`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});
</script>
