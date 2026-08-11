[![Magikolor banner](./icons/logo/use-this.png)](https://magikolor.app)

> **🌐 Otros idiomas:** [English](README.en.md) · [日本語](README.ja.md) · [Italiano](README.it.md) · [Español](README.md) · [Français](README.fr.md)

# 🎨 [Magikolor](https://magikolor.app)

Magikolor es un generador de paletas de colores **gratuito y de código abierto** con un conjunto creciente de herramientas complementarias para todo lo relacionado con el color: gradientes, comprobación de contraste, paletas a partir de imágenes, colores de marca, coincidencia con Pantone, extracción de tokens CSS y mucho más.

Está construido con [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) y TypeScript, utiliza [OpenAI](https://openai.com) para generar paletas a partir de prompts de texto y está completamente traducido a 5 idiomas.

> Magikolor recibe alrededor de **~500 mil visitas mensuales**, con **12 mil paletas generadas diariamente**. Puedes ver las [analíticas del sitio en vivo aquí](https://plausible.io/magikolor.app).

---

## 📑 Índice

- [✨ Características](#características)
- [🧰 Herramientas](#herramientas)
- [🛠️ Stack Tecnológico](#stack-tecnológico)
- [🏗️ Arquitectura: Capas de Nuxt](#arquitectura-capas-de-nuxt)
- [🚀 Primeros Pasos](#primeros-pasos)
- [⚙️ Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)
- [🖥️ API](#api)
- [🧩 Worker de Renderizado de Color (Docker)](#worker-de-renderizado-de-color-docker)
- [🌐 Internacionalización (i18n)](#internacionalización-i18n)
- [🧪 Tests](#tests)
- [📜 Scripts de Desarrollo](#scripts-de-desarrollo)
- [🗂️ Estructura del Repositorio](#estructura-del-repositorio)
- [📚 Documentación](#documentación)
- [📄 Licencia](#licencia)
- [🤝 Contribuciones](#contribuciones)
- [🙏 Agradecimientos](#agradecimientos)

---

## ✨ Características

- **Generación de paletas con IA** a partir de cualquier prompt de texto ("atardecer", "retro 80s", un código hex, un estado de ánimo…) — impulsada por OpenAI, con comprobaciones de moderación y seguridad del prompt.
- **Más de 18 herramientas de color gratuitas**, cada una con su propia página (ver [Herramientas](#herramientas)).
- **API pública y gratuita** que cubre paletas, armonías, Pantone, contraste, nombres de color y más (ver [API](#api)).
- **Persistencia en el navegador**: favoritos, recientes, colores guardados, gradientes y paletas de imágenes se almacenan en el navegador mediante [VueUse `useStorage`](https://vueuse.org/core/useStorage/) — sin necesidad de cuenta.
- **5 idiomas**: inglés, japonés, italiano, español y francés mediante [@nuxtjs/i18n](https://i18n.nuxtjs.org/).
- **Matemática de color perceptual**: las armonías de paleta se calculan en el espacio de color **OKLCH** (port de `pro-color-harmonies`, verificado 1:1 con un harness numérico de paridad).
- **Herramientas basadas en imágenes**: extrae los colores dominantes de cualquier imagen (en el servidor con `sharp`), busca fotos de stock y crea paletas de ambiente con cuentagotas arrastrables.
- **Herramientas de accesibilidad**: comprobador de contraste WCAG con niveles AA/AAA, sugerencias inteligentes y un simulador de daltonismo (protanopia, deuteranopia, tritanopia, acromatopsia).
- **Datos de referencia precisos**: coincidencia con Pantone Solid Coated / Pastels & Neons / Metallics mediante Delta-E 2000, 14.394 colores con nombre y 910 paletas de marcas.
- **Worker de renderizado en Docker**: un servicio basado en Playwright que analiza sitios web *realmente renderizados* (colores usados, contraste WCAG real de texto, capturas de pantalla, detección de modo oscuro).

---

## 🧰 Herramientas

Cada herramienta es una página independiente. Los enlaces apuntan al sitio en vivo; todas existen también en desarrollo en `http://localhost:3005`.

### Núcleo
| Herramienta | Ruta | Qué hace |
|---|---|---|
| 🎨 **Generador de Paletas de Color** | [`/`](https://magikolor.app/) | Página principal. Escribe un prompt (o elige un ejemplo) y una IA genera una paleta de 5 colores con nombre y etiquetas. |
| 🔍 **Explorar Paletas de Color** | [`/palette/explore`](https://magikolor.app/palette/explore) | Navega por todas las paletas públicas generadas, filtra por color, tono, estilo y temporada, carga más / páginas por etiqueta. |
| ⭐ **Favoritos** | [`/favorites`](https://magikolor.app/favorites) | Tus paletas guardadas, colores guardados y paletas de imágenes, persistidos en el navegador. |
| 🕐 **Recientes** | [`/recent`](https://magikolor.app/recent) | Paletas y colores que creaste recientemente, guardados en tu navegador. |

### Generadores y editores
| Herramienta | Ruta | Qué hace |
|---|---|---|
| 🎛️ **Palette Maker** | [`/palette-maker`](https://magikolor.app/palette-maker) | Crea paletas personalizadas a mano: modo armonía, añadir/eliminar/bloquear colores, arrastrar para reordenar, deshacer/rehacer, información de tintes y sombras, guardar en favoritos. |
| 🧮 **Creador de Paletas de Color** | [`/color-palette-creator`](https://magikolor.app/color-palette-creator) | Genera esquemas completos a partir de un solo color base: 6 tipos de armonía × 4 estilos, modificadores creativos, todo en el espacio perceptual OKLCH. Exporta PNG/PDF/ASE. |
| 🌈 **Generador de Gradientes** | [`/gradient-generator`](https://magikolor.app/gradient-generator) | Gradientes CSS lineales / radiales / cónicos con control total de los stops. Copia CSS, exporta config de Tailwind o JSON, guarda gradientes. |
| 📊 **Paleta de Gradiente** | [`/gradient-palette`](https://magikolor.app/gradient-palette) | Interpola una paleta entre dos colores (2–10 pasos). Copia HEX / variables CSS / gradiente, exporta PNG/JSON/ASE, guarda en favoritos. |
| 🎲 **Generador de Color Aleatorio** | [`/random-color`](https://magikolor.app/random-color) | Un clic (o la barra espaciadora) para un color aleatorio nuevo. |

### Referencia y análisis de color
| Herramienta | Ruta | Qué hace |
|---|---|---|
| 🗂️ **Todos los Colores** | [`/all-colors`](https://magikolor.app/all-colors) | Elige cualquier color y míralo en todos los modelos de color, genera tintes y sombras, y encuentra las alternativas **Pantone** más cercanas (ΔE 2000). |
| 🌈 **Explorar Colores** | [`/explore/colors`](https://magikolor.app/explore/colors) | Navega por miles de colores con nombre, busca por nombre o hex, copia con un clic. |
| 🏷️ **Colores de Marca** | [`/brand-colors`](https://magikolor.app/brand-colors) | 910 paletas de marcas conocidas (2.754 colores) con búsqueda, copia con un clic y enlaces a las marcas. |
| 🧴 **Paleta de Tonos de Piel** | [`/skin-tone-palette`](https://magikolor.app/skin-tone-palette) | 48 códigos hex de tonos de piel en 6 grupos, de porcelana/claros a profundos/ricos, en subtonos fríos/neutros/cálidos/dorados/oliva/rojos. |
| 🔄 **Color Complementario** | [`/complementary-color`](https://magikolor.app/complementary-color) | El opuesto exacto de cualquier color en el círculo cromático (tono + 180°), con HEX, nombre y copia. |

### Herramientas de imagen
| Herramienta | Ruta | Qué hace |
|---|---|---|
| 🖼️ **Selector de Color de Imágenes** | [`/image-color-picker`](https://magikolor.app/image-color-picker) | Sube una imagen (o pega una URL) y extrae sus colores dominantes con ordenación asistida por IA. Se guarda junto con la imagen. |
| 🎭 **Paleta de Ambiente** | [`/mood-palette`](https://magikolor.app/mood-palette) | Crea una paleta a partir de cualquier imagen: cuentagotas arrastrables, refinamiento manual o con armonía IA, búsqueda de fotos de stock, exportaciones (collage, PDF, tarjeta de color). |

### Accesibilidad y utilidades
| Herramienta | Ruta | Qué hace |
|---|---|---|
| ☀️ **Comprobador de Contraste** | [`/contrast-checker`](https://magikolor.app/contrast-checker) | Ratios de contraste WCAG con insignias AA/AAA para texto normal/grande y componentes UI, simulador de visión, sugerencias accesibles inteligentes, exportación a PDF. |
| 🧪 **Extractor de Tokens de Color** | [`/color-token-extractor`](https://magikolor.app/color-token-extractor) | Extrae tokens de color CSS de cualquier sitio web; análisis *renderizado* opcional (colores reales usados + contraste WCAG de texto + captura + modo oscuro) mediante el worker Docker. Copia como JSON, CSS o config de Tailwind. |
| 🎨 **Mezclador de Colores** | [`/color-mixer`](https://magikolor.app/color-mixer) | Mezcla dos colores en tiempo real con un modelo de pintura **RYB** sustractivo, más variantes HSL/RGB-lineal y mezclas predefinidas. |

> Más herramientas están en desarrollo: la barra lateral también lista las próximas (marcadas como *Próximamente*).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (`3.13.2`) + motor de servidor Nitro |
| Lenguaje | TypeScript (`5.6`), SFCs Vue estrictos |
| UI | [Nuxt UI](https://ui.nuxt.com) (`2.18.7`) + [Nuxt UI Pro](https://ui.nuxt.com/pro) (`1.4.4`), Tailwind CSS |
| Estado / obtención de datos | [@tanstack/vue-query](https://github.com/TanStack/query) (`5.56`) |
| Validación en el servidor | [@sinclair/typebox](https://github.com/sinclairzx81/typebox) + AJV; formularios del cliente con [yup](https://github.com/jquense/yup) |
| Base de datos | [MongoDB](https://www.mongodb.com) mediante el driver oficial `mongodb` (`6.9`) — Mongo 7.0 en Docker |
| IA | [SDK de Node de OpenAI](https://github.com/openai/openai-node) (`4.65`) |
| Procesamiento de imágenes | [sharp](https://sharp.pixelplumbing.com) (`0.33`) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (`8.5`) |
| Analíticas | [Plausible](https://plausible.io) mediante `@nuxtjs/plausible` |
| Fuentes | Inter mediante `@nuxtjs/google-fonts` |
| Logging | [pino](https://getpino.io) + `pino-pretty` |
| Selector de color | `@ckpack/vue-color` |
| HTTP (scripts de datos) | `got` |
| Utilidades | `@vueuse/core`, `@apideck/better-ajv-errors`, `@types/twitter-text` |
| Linting | ESLint (`eslint-config-standard-with-typescript` + plugin de Vue) |

> **Nota**: `@nuxt/ui-pro` obtiene los paquetes de iconos del registro privado de FontAwesome: el token de autenticación ya está configurado en [`.npmrc`](./.npmrc).

---

## 🏗️ Arquitectura: Capas de Nuxt

Magikolor se basa en el **sistema de capas** integrado de Nuxt, que permite que cada dominio de la aplicación viva en su propio directorio aislado bajo [`layers/`](./layers). Cada capa aporta su propio `nuxt.config.ts`, páginas, componentes, composables, utilidades y (donde sea necesario) un módulo de servidor Nitro.

### Patrón de módulos del servidor

En el lado del servidor, cada capa que necesita estado expone una **fábrica de módulo** (p. ej. [`palette.module.ts`](./layers/palette/server/palette.module.ts)) que devuelve un pequeño objeto con sus servicios y repositorios. Estas fábricas se conectan entre sí en la utilidad central de configuración [`layers/setup/server/utils/setup.util.ts`](./layers/setup/server/utils/setup.util.ts), que se ejecuta una vez al arrancar el servidor (a través del plugin de Nitro [`setup.plugin.ts`](./layers/setup/server/plugins/setup.plugin.ts)):

1. Se crea un logger `pino`.
2. MongoDB se conecta (config desde `MONGO_URL`).
3. Los módulos se instancian con sus dependencias inyectadas (OpenAI → AI → Palette → OG; Feedback).
4. `palette.setup()` garantiza que existan índices/colecciones.
5. El global `modules` queda disponible para todos los handlers de la API mediante `getModules()` — que lanza un **503** limpio si el servidor aún está arrancando (p. ej. si Mongo estaba caído al iniciar).

Los handlers de la API son archivos de ruta Nitro simples en cada capa, p. ej. `layers/palette/server/api/palette/create.ts` → `POST /api/palette/create`.

### Referencia de capas

| Capa | Responsabilidad |
|---|---|
| `setup` | Arranque del servidor: conecta Mongo, conecta todos los módulos, expone `getModules()`. |
| `mongo` | Cliente de MongoDB + configuración de la cadena de conexión. |
| `openai` | Cliente/servicio de OpenAI (el único proveedor hoy). |
| `ai` | Servicio de IA genérico: comprobaciones de moderación + ejecución de prompts. |
| `log` | Configuración del logger `pino`. |
| `common` | Componentes compartidos (nav, footer, selector de idioma, estados vacíos, simulador de daltonismo…), composables (`useFavorites`, `useNotifications`, `useModalV2`…) y utilidades puras de color (conversor, contraste, idioma, muestras). |
| `palette` | Dominio central: entidad/repositorio/servicio/validación de paletas, API de paletas, etiquetas y filtros, ordenación de colores, páginas de paletas (`/palette/explore`, `/palette/[id]`). |
| `og` | Generación de imágenes PNG OpenGraph para paletas y cuadrículas por etiqueta. |
| `feedback` | Persistencia del feedback/contacto y sugerencias. |
| `plausible` | Módulo envoltorio de analíticas. |
| `random-color` | Página de color aleatorio + `/api/random-color`. |
| `contrast-checker` | Herramienta de contraste: ratios WCAG, simulación de visión, sugerencias, paletas accesibles + `/api/contrast-checker`. |
| `color-mixer` | Página del mezclador RYB + utilidades. |
| `all-colors` | Página Todos los Colores: formatos de color, tintes/sombras, coincidencia con el dataset Pantone + `/api/pantone`, `/api/color-name`. |
| `color-palette-creator` | Generador de armonías OKLCH (port de `pro-color-harmonies`), exportación de paletas (PNG/PDF/ASE) + `/api/harmonies`. |
| `gradient-generator` | Constructor de gradientes CSS + exportaciones + gradientes guardados. |
| `gradient-palette` | Paletas por interpolación entre dos colores + exportaciones. |
| `palette-maker` | Editor manual de paletas con historial + integración con favoritos. |
| `brand-colors` | Página del dataset de colores de marcas. |
| `skin-tone-palette` | Página de referencia de tonos de piel. |
| `complementary-color` | Página de color complementario. |
| `image-color-picker` | Subida de imagen/URL → colores dominantes (`sharp`) + `/api/image-color-picker`, `/api/image-url`. |
| `mood-palette` | Estudio de imagen a paleta: cuentagotas, búsqueda de stock + `/api/stock-search`. |
| `color-token-extractor` | Extracción de tokens CSS (Fase 1) + proxy de análisis renderizado (Fase 2) + `/api/color-token-extractor`, `/api/color-token-extractor/runtime`. |
| `explore` | Páginas de exploración: colores, gradientes y paletas de imágenes. |

---

## 🚀 Primeros Pasos

### Requisitos previos

- **Node.js 18+** (el worker de renderizado necesita **Node 20+**; desarrollado con 22)
- **Docker Desktop** (para MongoDB y el worker de renderizado)
- **npm** (el proyecto usa npm — ver `package-lock.json`)

### 1. Arranca los servicios

Todas las paletas de Magikolor se almacenan en MongoDB. El `compose.yml` arranca **dos** servicios:

```bash
docker compose up -d
```

| Servicio | Imagen / build | Puerto | Propósito |
|---|---|---|---|
| `database` | `mongo:7.0` | `27018:27017` | MongoDB. Usuario `magikolor` / contraseña `secret`, base de datos `magikolor`. |
| `renderer` | `./workers/color-renderer` (Playwright) | `3100:3100` | Worker de Chromium headless usado por el análisis *renderizado* del Extractor de Tokens de Color (opcional — el resto de la aplicación funciona sin él). |

> Los datos de Mongo viven en un volumen de Docker, así que `docker compose up -d` después de un `down` conserva tus datos. Para más detalles, consulta la [capa mongo](./layers/mongo/server/mongo.module.ts) y [`scripts/README.md`](./scripts/README.md).

### 2. Crea el `.env`

Crea un archivo `.env` en la raíz del proyecto. La única variable requerida para las funciones de IA es la clave de OpenAI:

```env
# Requerida solo para la creación de paletas con IA (/api/palette/create, /api/palette/clone)
OPENAI_API_KEY=sk-...

# Opcional — se muestran los valores por defecto
MONGO_URL=mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin
SITE_URL=http://localhost:3005
LOG_LEVEL=debug
RENDERER_URL=http://localhost:3100
```

### 3. Instala las dependencias

```bash
npm install
```

### 4. Ejecuta en local

```bash
npm run dev
```

El servidor de desarrollo corre en **`http://localhost:3005`**. Un script de preflight ([`scripts/check-dev-port.mjs`](./scripts/check-dev-port.mjs)) verifica que el puerto esté libre antes de arrancar, para que Nuxt nunca caiga silenciosamente a otro puerto.

Otros comandos habituales:

```bash
npm run build        # build de producción (nuxt build)
npm run generate     # generación estática (nuxt generate)
npm run preview      # previsualizar la app compilada
npm run start        # servir el output compilado (node .output/server/index.mjs)
npm run typecheck    # nuxi typecheck (vue-tsc + tsc)
```

### 5. Poblar la base de datos (opcional pero recomendado)

Para llenar la base de datos local con las ~17,4 mil paletas incluidas y que `/palette/explore` tenga contenido:

```bash
node scripts/import-palettes.mjs   # carga colorpalettes.json (modo REEMPLAZO; --keep para añadir)
node scripts/migrate-tags.mjs      # minúsculas en etiquetas + Monochrome → monochromatic (idempotente)
```

Consulta la lista completa en [Scripts de Desarrollo](#scripts-de-desarrollo).

---

## ⚙️ Configuración y Variables de Entorno

| Variable | Valor por defecto | Usada por | Descripción |
|---|---|---|---|
| `OPENAI_API_KEY` | *(vacío)* | capa `openai` | Requerida para la generación de paletas con IA (`/api/palette/create`, `/api/palette/clone`). Sin ella, esos endpoints devuelven 401. |
| `MONGO_URL` | `mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin` | capa `mongo` | Cadena de conexión a MongoDB (coincide con el servicio de Docker Compose). |
| `SITE_URL` | `http://localhost:3005` | config raíz | URL pública del sitio; alimenta el `apiUrl` público (→ `{SITE_URL}/api`) y el `baseUrl` de i18n. |
| `LOG_LEVEL` | `debug` | capa `log` | Nivel de log de `pino`. |
| `RENDERER_URL` | `http://localhost:3100` | config raíz | URL del worker color-renderer (Docker). |
| `PALETTE_COLLECTION_NAME` | `palettes` | capa `palette` | Colección de MongoDB para las paletas. |
| `PALLETTE_AI_NAMES_START_DATE_MS` | `1729116912549` | capa `palette` | Marca de tiempo usada para repartir las fechas `createdAt` de las paletas sembradas. |
| `FEEDBACK_COLLECTION_NAME` | `feedback` | capa `feedback` | Colección de MongoDB para el feedback. |
| `UNSPLASH_ACCESS_KEY` | *(vacío)* | `mood-palette` | Clave de API de Unsplash para la búsqueda de fotos de stock (usa imágenes de muestra si falta). |
| `PEXELS_API_KEY` | *(vacío)* | `mood-palette` | Clave de API de Pexels (proveedor opcional). |
| `PIXABAY_API_KEY` | *(vacío)* | `mood-palette` | Clave de API de Pixabay (proveedor opcional). |
| `PORT` | — | Nuxt/Nitro | Puerto de escucha para `npm start` / `npm run preview` / `nuxt dev` pelado. **Nota**: el script `dev` fija `--port 3005` y la flag del CLI gana, así que `PORT` no afecta a `npm run dev`. |

### Entorno del worker de renderizado (en `compose.yml`)

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `3100` | Puerto HTTP en el que escucha el worker. |
| `MAX_CONCURRENCY` | `3` | Máximo de trabajos de renderizado simultáneos. |
| `JOB_TIMEOUT_MS` | `20000` | Timeout por trabajo (20 s). |
| `CACHE_TTL_MS` | `3600000` | TTL de la caché de resultados (1 h, LRU de 200 URLs). |
| `SCREENSHOT_CACHE_MAX` | `50` | Máximo de capturas en caché (LRU pequeña aparte). |

---

## 🖥️ API

Magikolor incluye una **API pública y gratuita** sin autenticación (en local). Todos los endpoints devuelven JSON salvo que se indique lo contrario. Los cuerpos de las peticiones se validan en tiempo de ejecución con `@sinclair/typebox` (los esquemas viven en `server/dtos/` de cada capa).

> ⚠️ **Nota**: la API pública puede ser eliminada o modificada en cualquier momento, sin previo aviso. Úsala bajo tu propio riesgo.

### Resumen de endpoints

| Método | Ruta | Descripción | ¿Necesita IA? |
|---|---|---|---|
| `GET` | `/api/palette/{id}` | Obtener una paleta por su id de MongoDB | — |
| `POST` | `/api/palette/list` | Lista paginada de paletas (filtro opcional por etiqueta) | — |
| `POST` | `/api/palette/create` | Generar una paleta con IA a partir de un prompt de texto | ✅ |
| `POST` | `/api/palette/clone` | Clonar una paleta con nuevos colores | ✅ |
| `GET` | `/api/palette/count` | Paletas creadas en las últimas 24 h (caché de 5 min) | — |
| `GET` | `/api/og/get` | PNG OpenGraph de una paleta | — |
| `GET` | `/api/og/tag` | PNG OpenGraph en cuadrícula de una etiqueta | — |
| `POST` | `/api/feedback/create` | Enviar feedback | — |
| `GET` | `/api/random-color` | Color aleatorio (HEX + RGB) | — |
| `GET` | `/api/contrast-checker` | Ratio de contraste WCAG entre dos colores | — |
| `GET` | `/api/color-mixer` | Mezclar dos colores (HSL + RGB lineal) | — |
| `POST` | `/api/image-color-picker` | Extraer colores dominantes de una imagen base64 (`sharp`) | — |
| `GET` | `/api/image-url` | Proxy de URL de imagen → data URL base64 (con guardas SSRF) | — |
| `GET` | `/api/harmonies` | Generación de armonías OKLCH (1:1 con el Creador de Paletas de Color) | — |
| `GET` | `/api/pantone` | Búsqueda en el dataset Pantone: por hex (ΔE 2000), código o texto | — |
| `GET` | `/api/color-name` | Nombre de color más cercano del diccionario de 14.394 nombres | — |
| `POST` | `/api/color-token-extractor` | Extraer tokens de color CSS de un sitio web (Fase 1) | — |
| `POST` | `/api/color-token-extractor/runtime` | Análisis de página renderizada: paleta usada, contraste WCAG de texto, captura, modo oscuro (Fase 2 — requiere el worker Docker) | — |
| `GET` | `/api/stock-search` | Búsqueda de fotos de stock (Unsplash/Pexels/Pixabay) | — |

### Documentación y ejemplos

- **Referencia interactiva**: la página `/api` de la aplicación en ejecución lista cada endpoint con sus parámetros.
- **Referencia técnica completa** (formas de petición/respuesta, umbrales WCAG, códigos de error, ejemplos en PowerShell): consulta [`docs/API.md`](./docs/API.md).

---

## 🧩 Worker de Renderizado de Color (Docker)

El **Extractor de Tokens de Color** tiene dos fases:

1. **Fase 1** — analiza el CSS del sitio en el servidor para encontrar propiedades personalizadas de color declaradas (funciona de forma independiente).
2. **Fase 2 (runtime)** — un servicio Docker separado ([`workers/color-renderer/`](./workers/color-renderer)) carga la página en **Chromium headless (Playwright)**, espera a que corra el JS e informa:
   - los colores **realmente renderizados** (`getComputedStyle`) con su porcentaje de uso,
   - el **contraste WCAG real de texto** calculado sobre el fondo *efectivo*,
   - una **captura de pantalla** opcional (JPEG, ~56 KB en base64),
   - la **detección de modo oscuro** mediante dos renders (`light` + `dark`).

Aspectos destacados de la arquitectura: una única instancia del navegador con un `BrowserContext` aislado por trabajo, un semáforo (máximo 3 trabajos concurrentes, con cola), un timeout de 20 s por trabajo y una caché LRU en memoria (200 URLs / 1 h de TTL). Si el worker está offline, el endpoint `/runtime` devuelve 502 y la herramienta degrada con elegancia a la Fase 1.

El worker está **aislado a propósito** de la aplicación principal: un cuelgue de Chromium nunca puede tumbar el sitio, y su imagen pesada (~3,3 GB) no ensucia la imagen Docker principal. Informe técnico completo (arquitectura, pool, caché, guardas SSRF, métricas medidas, limitaciones conocidas): [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md).

---

## 🌐 Internacionalización (i18n)

El sitio está completamente traducido a 5 idiomas:

| Código | Idioma | Bandera |
|---|---|---|
| `en` | Inglés | 🇬🇧 (por defecto) |
| `ja` | Japonés | 🇯🇵 |
| `it` | Italiano | 🇮🇹 |
| `es` | Español | 🇪🇸 |
| `fr` | Francés | 🇫🇷 |

- Estrategia: `prefix_except_default` — inglés en `/`, el resto en `/ja`, `/it`, `/es`, `/fr`.
- Todas las traducciones viven en un único archivo: [`i18n.config.ts`](./i18n.config.ts).
- El cambio de idioma se basa en la URL (estrategia de prefijo) mediante el componente `CommonLangSwitcher`.
- **Paridad impuesta en CI**: [`scripts/check-i18n-keys.mjs`](./scripts/check-i18n-keys.mjs) comprueba que cada idioma tenga exactamente el mismo conjunto de claves que `en` (se ejecuta con `npm run test:i18n`).

---

## 🧪 Tests

El proyecto no tiene un runner de tests basado en frameworks; los tests son scripts Node específicos que se ejecutan con el type-stripping nativo de Node (`--experimental-strip-types`).

```bash
npm test   # ejecuta todo lo siguiente
```

| Comando | Qué verifica |
|---|---|
| `npm run test:parity` | Paridad numérica del generador de paletas OKLCH frente a la librería original `pro-color-harmonies` v0.11.0 (componente a componente `l, c, h`, tolerancia 0.0005, en 2.424 combinaciones). La copia de referencia vive en [`layers/color-palette-creator/utils/__tests__/reference/`](./layers/color-palette-creator/utils/__tests__/reference/). |
| `npm run test:unit` | Utilidades puras de color: conversor canónico, contraste WCAG, mezcla RYB, constructores de gradientes, formatos de color, matcher Pantone, simulación de daltonismo. |
| `npm run test:i18n` | Paridad de claves entre los 5 idiomas (ver arriba). |
| `npm run test:favorites` | Patrón de persistencia de `useFavorites` (VueUse `useStorage`). |
| `npm run test:image-palettes` | Composable `useImagePalettes` (paletas guardadas junto con las imágenes). |
| `npm run test:token-extractor` | Parser CSS Color 4 + extractor de tokens de diseño (Fase 1). |
| `npm run test:renderer` | Lógica pura del worker de renderizado (`workers/color-renderer/lib.mjs`). |

Además:

- `npm run typecheck` — comprobación completa de tipos TypeScript + Vue (`nuxi typecheck`).
- ESLint está configurado (`eslint-config-standard-with-typescript` + plugin de Vue) pero aún no tiene un script npm dedicado.

---

## 📜 Scripts de Desarrollo

Scripts de utilidad bajo [`scripts/`](./scripts/) para poblar datos, migraciones y herramientas. La mayoría son idempotentes (se pueden ejecutar dos veces sin romper nada). Detalles completos: [`scripts/README.md`](./scripts/README.md).

| Script | Propósito |
|---|---|
| `scripts/import-palettes.mjs` | Importa las ~17,4 mil paletas incluidas desde `colorpalettes.json` a `db.palettes` (REEMPLAZO por defecto; `--keep` para añadir, `--dry-run` solo valida). |
| `scripts/migrate-tags.mjs` | Migra los documentos existentes al sistema de filtros actual: etiquetas en minúsculas, `Monochrome` → `monochromatic`. |
| `scripts/rename-db.mjs` | Migra una base de datos local de los nombres antiguos (`colormagic`/`magicolor`) a `magikolor`. `--dry-run` para previsualizar, `--drop-old-user` para limpiar los usuarios antiguos. |
| `scripts/generate-color-names.mjs` | Genera `layers/palette/utils/color-names-data.json` (14.394 nombres) a partir de `colordatabase.json` + el dataset NTC heredado. |
| `scripts/import-brand-colors.mjs` | Consolida el dataset de 910 marcas en `layers/brand-colors/utils/brand-colors-data.json` (fuente: pickcoloronline/brands, licencia ISC). |
| `scripts/acb-to-json.mjs` | Decodifica archivos Adobe Color Book (`.acb`) a JSON (usado para Pantone Metallics). |
| `scripts/check-dev-port.mjs` | Preflight que verifica que el puerto 3005 esté libre antes de `npm run dev` (ver [Primeros Pasos](#primeros-pasos)). |
| `scripts/check-i18n-keys.mjs` | Comprobación de paridad de claves i18n (también conectado como `test:i18n`). |
| `scripts/unit-tests.mjs` | Harness de tests unitarios para las utilidades puras de color (también `test:unit`). |

---

## 🗂️ Estructura del Repositorio

```
.
├── assets/                  # CSS global (tipografía, estilos de la app)
├── icons/                   # Logo + favicon animado
├── i18n.config.ts           # Todas las traducciones (en/ja/it/es/fr)
├── layers/                  # Capas de Nuxt — una por dominio (ver Arquitectura)
├── layouts/                 # Layout de la app (default.vue)
├── pages/                   # Páginas raíz: home, api, favorites, recent, privacy, terms
├── plugins/                 # Plugin de Vue Query (TanStack)
├── public/                  # Recursos estáticos (favicons, manifest)
├── scripts/                 # Poblamiento de datos, migraciones y scripts de tests
├── tests/                   # Fixtures de tests (output ACB de Pantone Metallics)
├── workers/color-renderer/  # Worker de renderizado con Playwright (servicio Docker)
├── app.config.ts            # Config de UI de Nuxt (color primario, botones)
├── compose.yml              # Servicios de MongoDB + worker de renderizado
├── nuxt.config.ts           # Configuración principal de Nuxt
├── tailwind.config.ts       # Tema de Tailwind (colores, sombras, aspect ratios)
├── colorpalettes.json       # Datos de seed incluidos: ~17,4 mil paletas (trackeado)
├── colordatabase.json       # Base de datos local de colores (~13,6 mil colores; gitignored)
└── colors_pantone.csv       # Datos de referencia de Pantone (trackeado)
```

### Datasets incluidos

| Dataset | Ubicación | Tamaño |
|---|---|---|
| Paletas (seed) | `colorpalettes.json` | ~17.390 paletas |
| Diccionario de nombres de color | `layers/palette/utils/color-names-data.json` | 14.394 nombres |
| Guías Pantone | `layers/all-colors/utils/pantone-data.json` | 3.219 muestras (Solid Coated, Pastels & Neons, Metallics) |
| Colores de marca | `layers/brand-colors/utils/brand-colors-data.json` | 910 marcas / 2.754 colores |

---

## 📚 Documentación

La carpeta [`docs/`](./docs) contiene documentos técnicos en profundidad:

| Documento | Contenido |
|---|---|
| [`docs/API.md`](./docs/API.md) | Referencia completa de la API: cada endpoint, DTOs, umbrales WCAG, códigos de error, ejemplos. |
| [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md) | Informe técnico del worker de renderizado con Playwright (arquitectura, pool, caché, guardas SSRF, métricas, limitaciones, roadmap). |
| [`docs/design-audit.md`](./docs/design-audit.md) | Auditoría de consistencia de diseño entre páginas (tipografía, cabeceras, estados vacíos). |
| [`docs/palette-parity-report.md`](./docs/palette-parity-report.md) | Informe de paridad numérica del generador OKLCH frente a `pro-color-harmonies`. |
| [`docs/informe-pro-color-harmonies-DEFINITIVO.md`](./docs/informe-pro-color-harmonies-DEFINITIVO.md) | Análisis profundo de toda la lógica de `pro-color-harmonies` (la implementación de referencia del generador). |
| [`docs/palette-parity-code-diff.diff`](./docs/palette-parity-code-diff.diff) | Diff línea a línea entre la implementación antigua y la verificada por paridad. |

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Buenos puntos de entrada:

- **Sugiere un arreglo o una nueva herramienta**: usa el formulario de sugerencias de la app (barra lateral → *Suggest an Idea*) o abre un issue.
- **Añade una herramienta**: crea una nueva capa de Nuxt bajo `layers/` siguiendo el patrón existente (página + componentes + utilidades + API opcional + claves i18n en los 5 idiomas).
- **Añade una traducción**: mantén el conjunto de claves idéntico al de `en` — `npm run test:i18n` lo verificará.
- **Sigue las convenciones**: ejecuta `npm run typecheck` y `npm test` antes de enviar.

---

## 📄 Licencia

Magikolor se distribuye bajo la [licencia MIT](./LICENSE).

---

## 🙏 Agradecimientos

- **OpenAI** — impulsa la generación de paletas con IA.
- **`pro-color-harmonies`** (meodai, MIT) — implementación de referencia del generador de armonías OKLCH.
- **`dembrandt`** (MIT) — base conceptual del extractor de tokens CSS.
- **pickcoloronline/brands** (ISC) — dataset de colores de marca.
- **Name that Color (NTC)** — base del diccionario de nombres de color.
- **Pantone** — *Todos los Colores* usa datos de las guías Pantone; las referencias son estimaciones visuales aproximadas (ΔE 2000) y no están afiliadas ni respaldadas por Pantone LLC.

Hecho con ❤️ para la comunidad del color.
