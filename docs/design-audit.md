# Auditoría de consistencia de diseño — Magikolor

Mapeo de elementos generales que deberían verse igual en toda la app y no lo
hacen. Ordenado por severidad (de lo que más impacta a lo cosmético).

Fecha: 2026-08-10 · Fuente: revisión de `layouts/`, `pages/` y `layers/*/pages/`.

## Estado de estandarización

| Item | Estado |
|------|--------|
| 1. Jerarquía tipográfica | ✅ Hecho: `h2` = `text-xl font-semibold mb-4`, `h3` = `text-base`, `h4` = `text-sm`; clases ad-hoc removidas (all-colors, palette/[id], palette-maker, favorites, terms) |
| 2. Cabecera de página | 🟡 Parcial: `recent.vue` estandarizado (h1 + descripción). Faltan legales (decisión de producto) |
| 4. Textos hardcodeados | ✅ Hecho: explore (count/loadMore/noMore), home (count/samplePrompt), palette (createError/createdSuccess) → i18n en 5 idiomas |
| 5. Estados vacíos | ✅ Hecho: componente `CommonEmptyState` (completo + `compact`) aplicado en favorites, explore×3, recent, gradient-generator, mood-palette, random-color |
| 3, 6, 7, 8, 9 | ⏳ Pendientes: línea de conteo unificada (parcial), tarjetas/botones, dark mode, SEO helper, hover reveal |

---

## 1. Jerarquía tipográfica rota a nivel global (alta)

`assets/css/global.css` define **h1 y h2 con el mismo tamaño**:

```css
h1 { @apply text-4xl font-extrabold mb-4 }
h2 { @apply text-4xl font-extrabold mb-4 }  /* ← igual que h1 */
h3 { @apply mb-4 }                          /* ← sin tamaño: hereda el default del navegador */
```

Consecuencia: las páginas que usan `<h2>` como título de sección se ven
obligadas a sobreescribirlo con clases ad-hoc, y lo hacen en **3 tamaños
distintos**:

| Clase usada                  | Cantidad | Dónde |
|------------------------------|----------|-------|
| `text-xl font-semibold`      | 24       | panel de export del mood-palette, token-extractor, etc. |
| `text-lg font-semibold mb-3` | 4        | `pages/favorites.vue`, explore image-palettes |
| `text-2xl font-semibold mb-1`| 2        | `all-colors.vue` (secciones shades/pantone) |

Además, las páginas legales difieren entre sí: `privacy.vue` usa `<h2>` plano
(se salva por el plugin `prose`) y `terms.vue` usa `text-xl font-semibold`.

**Propuesta**: fijar en `global.css` una escala única de sección
(h2 = `text-xl font-semibold`, h3 = `text-base font-semibold`) y borrar las
clases ad-hoc de las páginas.

---

## 2. Cabecera de página (patrón del header) (media)

21 de 24 páginas siguen el patrón estándar:

```html
<div class="mb-8">
  <h1>{{ $t('x.title') }}</h1>
  <p class="text-xl font-medium mb-4 max-w-xl">{{ $t('x.seoDescription') }}</p>
</div>
```

Excepciones que rompen el patrón:

| Página | Diferencia |
|--------|------------|
| `pages/recent.vue` | No tiene `<h1>`: usa `<p class="text-lg font-bold mb-4">` como título |
| `pages/privacy.vue` / `terms.vue` | Sin `<h1>`, contenido en `prose pt-8` |
| `palette/[id].vue` | `<h1 class="mb-0">` (intencional: botones al lado) |

**Propuesta**: darle a `recent.vue` el header estándar (h1 + descripción) y
decidir si las legales van con h1 o con un componente de "página legal".

---

## 3. Línea de conteo (media)

- Explore (index/tag) y las 3 explore nuevas: `italic text-sm` — "X public
  color palettes generated".
- Home: `italic text-xs text-center` — "X color palettes generated since
  yesterday".
- **Texto hardcodeado** en ambos (no i18n): ver punto 4.

**Propuesta**: un solo estilo (`italic text-sm`) y un solo texto
i18n (`explore.countLabel`).

---

## 4. Textos hardcodeados en templates (media)

Estos strings deberían ir por i18n (el repo exige 5 idiomas):

| Archivo | Texto |
|---------|-------|
| `pages/index.vue` | `color palettes generated since yesterday` |
| `layers/palette/pages/palette/explore/index.vue` | `public color palettes generated`, `Load more...`, `No more results` |
| `layers/palette/pages/palette/explore/[tag].vue` | `color palettes generated`, `Load more...`, `No more results` |
| `layers/palette/pages/palette/[id].vue` | `Successfully created ... palette.` |

---

## 5. Estados vacíos — 3 patrones distintos (media)

| Patrón | Uso |
|--------|-----|
| **Completo** (icono `w-12 h-12 text-gray-300` + título `text-lg font-semibold` + texto `text-gray-500 max-w-sm` + CTA) | `favorites.vue`, explore/gradients, explore/colors, explore/image-palettes |
| **Solo texto, chico** | gradient-generator `savedEmpty`, mood-palette `noMarkers`, `recent.vue` |
| **Conteo simple** | random-color `noneFound` |

**Propuesta**: extraer un componente `EmptyState` (icono, título, descripción,
CTA opcional) y usarlo en todos; para los estados inline chicos definir un
patrón único (`text-sm text-gray-500`).

---

## 6. Tarjetas / paneles (media-baja)

- Bordes: 63 usos de `border border-gray-200` **sin** variante dark vs 19 con
  `dark:border-gray-800` — el dark mode se aplica de forma inconsistente en el
  código (hoy la app fuerza light, pero es deuda).
- Radio: `rounded-xl` mayoritario, pero `rounded-lg` y `rounded-2xl` aparecen
  (mood-palette usa `rounded-2xl` en paneles; explore usa `rounded-xl`).
- Grillas de paletas: `grid sm:grid-cols-3 gap-4` (14×) es el estándar, pero
  hay `sm:grid-cols-2 gap-3` y `gap-4` sueltos.

**Propuesta**: componente `Card` único (rounded-xl + border + shadow-sm +
bg-white dark:bg-gray-900) y grilla `PaletteGrid` con el gap estándar.

---

## 7. Botones (media-baja)

- Tamaños en uso: xs 26, sm 48, md 26, lg 9, xl 15.
- Submit principal: `block size="xl" color="primary"` (home e ICP ✅).
- Botones de "copiar" sobre tarjetas: mezcla de `variant="soft"`,
  `variant="ghost"` y `soft + color="primary"`.
- Botones de borrar en tarjetas: `size="xs" variant="ghost"` en unos,
  `variant="soft"` en otros.

**Propuesta**: definir convenciones por rol (primario = primary solid xl;
secundario = soft; ícono en tarjeta = ghost xs) y aplicar en las páginas.

---

## 8. SEO / meta (baja)

- 24 páginas usan `useSeoMeta`, pero solo 16 incluyen `ogImageUrl`:
  mood-palette, gradient-generator, gradient-palette, palette-maker, etc. no lo
  tienen (y el SSR termina con og genérico del layout).

**Propuesta**: helper `usePageSeo({ title, description, ogImageUrl? })` que
cubra las 5 tags y lo apliquen todas las páginas.

---

## 9. Hover reveal en tarjetas (baja)

- El botón "borrar" con `opacity-0 group-hover:opacity-100` existe en
  favoritos / explore image-palettes, pero no en las demás galerías
  (gradient-generator, explore/gradients).

**Propuesta**: mismo patrón de reveal en todas las galerías.

---

## Cosas que YA son consistentes ✅

- Contenedor global: `max-w-3xl mx-auto` en layout, nav y footer.
- `<h1>` de página: 21 de 24 usan el `<h1>` plano (estilo global).
- Descripción de página: 22 de 24 usan `text-xl font-medium mb-4 max-w-xl`.
- Header wrapper `mb-8`: 21 páginas.
- Submit principal `block size="xl" color="primary"`.
- i18n en los textos nuevos (explore gradients/colors/image-palettes).
