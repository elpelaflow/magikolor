[![Magikolor banner](./icons/logo/use-this.png)](https://magikolor.app)

> **🌐 Altre lingue:** [English](README.en.md) · [日本語](README.ja.md) · [Italiano](README.it.md) · [Español](README.md) · [Français](README.fr.md)

# 🎨 [Magikolor](https://magikolor.app)

Magikolor è un popolare **generatore di palette di colori gratuito e open source** con una suite crescente di strumenti dedicati a tutto ciò che riguarda il colore: gradienti, verifica del contrasto, palette da immagini, colori dei brand, corrispondenza Pantone, estrazione di token CSS e altro ancora.

È costruito con [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) e TypeScript, usa [OpenAI](https://openai.com) per generare palette da prompt di testo ed è completamente tradotto in 5 lingue.

> Magikolor riceve circa **~500.000 visualizzazioni al mese**, con **12.000 palette generate ogni giorno**. Puoi vedere le [analytics del sito in tempo reale qui](https://plausible.io/magikolor.app).

---

## 📑 Indice

- [✨ Caratteristiche](#caratteristiche)
- [🧰 Strumenti](#strumenti)
- [🛠️ Stack Tecnologico](#stack-tecnologico)
- [🏗️ Architettura: Layer Nuxt](#architettura-layer-nuxt)
- [🚀 Per Iniziare](#per-iniziare)
- [⚙️ Configurazione e Variabili d'Ambiente](#configurazione-e-variabili-dambiente)
- [🖥️ API](#api)
- [🧩 Worker di Rendering Colori (Docker)](#worker-di-rendering-colori-docker)
- [🌐 Internazionalizzazione (i18n)](#internazionalizzazione-i18n)
- [🧪 Test](#test)
- [📜 Script di Sviluppo](#script-di-sviluppo)
- [🗂️ Struttura del Repository](#struttura-del-repository)
- [📚 Documentazione](#documentazione)
- [📄 Licenza](#licenza)
- [🤝 Contributi](#contributi)
- [🙏 Ringraziamenti](#ringraziamenti)

---

## ✨ Caratteristiche

- **Generazione di palette con IA** da qualsiasi prompt di testo ("tramonto", "retro anni 80", un codice hex, un'atmosfera…) — basata su OpenAI, con controlli di moderazione e sicurezza del prompt.
- **Più di 18 strumenti di colore gratuiti**, ciascuno con la propria pagina (vedi [Strumenti](#strumenti)).
- **API pubblica e gratuita** che copre palette, armonie, Pantone, contrasto, nomi dei colori e altro (vedi [API](#api)).
- **Persistenza lato client**: preferiti, recenti, colori salvati, gradienti e palette da immagini vengono memorizzati nel browser tramite [VueUse `useStorage`](https://vueuse.org/core/useStorage/) — nessun account richiesto.
- **5 lingue**: inglese, giapponese, italiano, spagnolo e francese tramite [@nuxtjs/i18n](https://i18n.nuxtjs.org/).
- **Matematica del colore percettiva**: le armonie delle palette vengono calcolate nello spazio colore **OKLCH** (porting di `pro-color-harmonies`, verificato 1:1 da un harness numerico di parità).
- **Strumenti basati su immagini**: estrai i colori dominanti da qualsiasi immagine (lato server con `sharp`), cerca foto stock e crea palette di atmosfera con contagocce trascinabili.
- **Strumenti di accessibilità**: verificatore di contrasto WCAG con livelli AA/AAA, suggerimenti intelligenti e simulatore di daltonismo (protanopia, deuteranopia, tritanopia, acromatopsia).
- **Dati di riferimento accurati**: corrispondenza con Pantone Solid Coated / Pastels & Neons / Metallics tramite Delta-E 2000, 14.394 colori con nome e 910 palette di brand.
- **Worker di rendering in Docker**: un servizio basato su Playwright che analizza siti web *effettivamente renderizzati* (colori usati, contrasto WCAG reale del testo, screenshot, rilevamento della modalità scura).

---

## 🧰 Strumenti

Ogni strumento è una pagina autonoma. I link puntano al sito live; tutti esistono anche in sviluppo su `http://localhost:3005`.

### Principali
| Strumento | Percorso | Cosa fa |
|---|---|---|
| 🎨 **Generatore di Palette di Colori** | [`/`](https://magikolor.app/) | Home page. Scrivi un prompt (o scegli un esempio) e un'IA genera una palette di 5 colori con nome e tag. |
| 🔍 **Esplora Palette di Colori** | [`/palette/explore`](https://magikolor.app/palette/explore) | Sfoglia tutte le palette pubbliche generate, filtra per colore, tono, stile e stagione, carica altro / pagine per tag. |
| ⭐ **Preferiti** | [`/favorites`](https://magikolor.app/favorites) | Le tue palette salvate, colori salvati e palette da immagini, persistiti nel browser. |
| 🕐 **Recenti** | [`/recent`](https://magikolor.app/recent) | Palette e colori creati di recente, salvati nel tuo browser. |

### Generatori ed editor
| Strumento | Percorso | Cosa fa |
|---|---|---|
| 🎛️ **Palette Maker** | [`/palette-maker`](https://magikolor.app/palette-maker) | Crea palette personalizzate a mano: modalità armonia, aggiungi/rimuovi/blocca colori, trascina per riordinare, annulla/ripeti, info su tinte e ombre, salva nei preferiti. |
| 🧮 **Creatore di Palette di Colori** | [`/color-palette-creator`](https://magikolor.app/color-palette-creator) | Genera schemi completi da un singolo colore base: 6 tipi di armonia × 4 stili, modificatori creativi, tutto nello spazio percettivo OKLCH. Esporta PNG/PDF/ASE. |
| 🌈 **Generatore di Gradient** | [`/gradient-generator`](https://magikolor.app/gradient-generator) | Gradient CSS lineari / radiali / conici con pieno controllo degli stop. Copia CSS, esporta config Tailwind o JSON, salva i gradient. |
| 📊 **Palette di Gradiente** | [`/gradient-palette`](https://magikolor.app/gradient-palette) | Interpola una palette tra due colori (2–10 passi). Copia HEX / variabili CSS / gradiente, esporta PNG/JSON/ASE, salva nei preferiti. |
| 🎲 **Generatore di Colore Casuale** | [`/random-color`](https://magikolor.app/random-color) | Un clic (o barra spaziatrice) per un nuovo colore casuale. |

### Riferimento e analisi del colore
| Strumento | Percorso | Cosa fa |
|---|---|---|
| 🗂️ **Tutti i Colori** | [`/all-colors`](https://magikolor.app/all-colors) | Scegli un colore e vederlo in ogni modello colore, genera tinte e ombre e trova le alternative **Pantone** più vicine (ΔE 2000). |
| 🌈 **Esplora Colori** | [`/explore/colors`](https://magikolor.app/explore/colors) | Sfoglia migliaia di colori con nome, cerca per nome o hex, copia con un clic. |
| 🏷️ **Colori dei Brand** | [`/brand-colors`](https://magikolor.app/brand-colors) | 910 palette di brand noti (2.754 colori) con ricerca, copia con un clic e link ai brand. |
| 🧴 **Paletta Toni della Pelle** | [`/skin-tone-palette`](https://magikolor.app/skin-tone-palette) | 48 codici hex di toni della pelle in 6 gruppi, dai porcellana/chiari ai profondi/ricchi, con sottotoni freddi/neutri/caldi/dorati/oliva/rossi. |
| 🔄 **Colore Complementare** | [`/complementary-color`](https://magikolor.app/complementary-color) | L'esatto opposto di qualsiasi colore sulla ruota cromatica (tonalità + 180°), con HEX, nome e copia. |

### Strumenti per immagini
| Strumento | Percorso | Cosa fa |
|---|---|---|
| 🖼️ **Selettore Colore da Immagine** | [`/image-color-picker`](https://magikolor.app/image-color-picker) | Carica un'immagine (o incolla un URL) ed estrai i colori dominanti con ordinamento assistito dall'IA. Salvata insieme all'immagine. |
| 🎭 **Palette di Atmosfera** | [`/mood-palette`](https://magikolor.app/mood-palette) | Costruisci una palette da qualsiasi immagine: contagocce trascinabili, rifinitura manuale o con armonia IA, ricerca foto stock, esportazioni (collage, PDF, scheda colore). |

### Accessibilità e utilità
| Strumento | Percorso | Cosa fa |
|---|---|---|
| ☀️ **Verificatore di Contrasto** | [`/contrast-checker`](https://magikolor.app/contrast-checker) | Rapporti di contrasto WCAG con badge AA/AAA per testo normale/grande e componenti UI, simulatore di visione, suggerimenti accessibili intelligenti, esportazione PDF. |
| 🧪 **Estrattore di Token di Colore** | [`/color-token-extractor`](https://magikolor.app/color-token-extractor) | Estrai i token di colore CSS da qualsiasi sito; analisi *renderizzata* opzionale (colori reali usati + contrasto WCAG del testo + screenshot + modalità scura) tramite il worker Docker. Copia come JSON, CSS o config Tailwind. |
| 🎨 **Miscelatore di Colori** | [`/color-mixer`](https://magikolor.app/color-mixer) | Mescola due colori in tempo reale con un modello pittorico **RYB** sottrattivo, più varianti HSL/RGB-lineare e miscele preimpostate. |

> Altri strumenti sono in lavorazione — la barra laterale elenca anche quelli in arrivo (marcati *In arrivo*).

---

## 🛠️ Stack Tecnologico

| Livello | Tecnologia |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (`3.13.2`) + motore server Nitro |
| Linguaggio | TypeScript (`5.6`), SFC Vue strict |
| UI | [Nuxt UI](https://ui.nuxt.com) (`2.18.7`) + [Nuxt UI Pro](https://ui.nuxt.com/pro) (`1.4.4`), Tailwind CSS |
| Stato / recupero dati | [@tanstack/vue-query](https://github.com/TanStack/query) (`5.56`) |
| Validazione lato server | [@sinclair/typebox](https://github.com/sinclairzx81/typebox) + AJV; form del client con [yup](https://github.com/jquense/yup) |
| Database | [MongoDB](https://www.mongodb.com) tramite il driver ufficiale `mongodb` (`6.9`) — Mongo 7.0 in Docker |
| IA | [OpenAI Node SDK](https://github.com/openai/openai-node) (`4.65`) |
| Elaborazione immagini | [sharp](https://sharp.pixelplumbing.com) (`0.33`) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (`8.5`) |
| Analytics | [Plausible](https://plausible.io) tramite `@nuxtjs/plausible` |
| Font | Inter tramite `@nuxtjs/google-fonts` |
| Logging | [pino](https://getpino.io) + `pino-pretty` |
| Selettore colore | `@ckpack/vue-color` |
| HTTP (script dati) | `got` |
| Utility | `@vueuse/core`, `@apideck/better-ajv-errors`, `@types/twitter-text` |
| Linting | ESLint (`eslint-config-standard-with-typescript` + plugin Vue) |

> **Nota**: `@nuxt/ui-pro` scarica i pacchetti di icone dal registro privato FontAwesome — il token di autenticazione è già configurato in [`.npmrc`](./.npmrc).

---

## 🏗️ Architettura: Layer Nuxt

Magikolor si basa sul **sistema di layer** integrato di Nuxt, che permette a ogni dominio dell'app di vivere nel proprio directory isolato sotto [`layers/`](./layers). Ogni layer porta il proprio `nuxt.config.ts`, pagine, componenti, composables, utility e (dove necessario) un modulo server Nitro.

### Pattern dei moduli server

Lato server, ogni layer che necessita di stato espone una **factory di modulo** (es. [`palette.module.ts`](./layers/palette/server/palette.module.ts)) che restituisce un piccolo oggetto con i suoi servizi e repository. Queste factory vengono collegate tra loro nell'utility di setup centrale [`layers/setup/server/utils/setup.util.ts`](./layers/setup/server/utils/setup.util.ts), che viene eseguita una volta all'avvio del server (tramite il plugin Nitro [`setup.plugin.ts`](./layers/setup/server/plugins/setup.plugin.ts)):

1. Viene creato un logger `pino`.
2. MongoDB si connette (config da `MONGO_URL`).
3. I moduli vengono istanziati con le loro dipendenze iniettate (OpenAI → AI → Palette → OG; Feedback).
4. `palette.setup()` garantisce l'esistenza di indici/collezioni.
5. Il global `modules` diventa disponibile a ogni handler API tramite `getModules()` — che lancia un **503** pulito se il server è ancora in fase di avvio (es. Mongo era giù all'avvio).

Gli handler API sono semplici file di route Nitro in ogni layer, es. `layers/palette/server/api/palette/create.ts` → `POST /api/palette/create`.

### Riferimento dei layer

| Layer | Responsabilità |
|---|---|
| `setup` | Bootstrap del server: connette Mongo, collega tutti i moduli, espone `getModules()`. |
| `mongo` | Client MongoDB + configurazione della stringa di connessione. |
| `openai` | Client/servizio OpenAI (l'unico provider oggi). |
| `ai` | Servizio IA generico: controlli di moderazione + esecuzione prompt. |
| `log` | Configurazione del logger `pino`. |
| `common` | Componenti condivisi (nav, footer, selettore lingua, stati vuoti, simulatore di daltonismo…), composables (`useFavorites`, `useNotifications`, `useModalV2`…) e utility di colore pure (convertitore, contrasto, lingua, campioni). |
| `palette` | Dominio centrale: entità/repository/servizio/validazione palette, API palette, tag e filtri, disposizione colori, pagine palette (`/palette/explore`, `/palette/[id]`). |
| `og` | Generazione immagini PNG OpenGraph per palette e griglie per tag. |
| `feedback` | Persistenza del feedback/contatti e suggerimenti. |
| `plausible` | Modulo wrapper delle analytics. |
| `random-color` | Pagina colore casuale + `/api/random-color`. |
| `contrast-checker` | Strumento contrasto: rapporti WCAG, simulazione visione, suggerimenti, palette accessibili + `/api/contrast-checker`. |
| `color-mixer` | Pagina miscelatore RYB + utility. |
| `all-colors` | Pagina Tutti i Colori: formati colore, tinte/ombre, corrispondenza dataset Pantone + `/api/pantone`, `/api/color-name`. |
| `color-palette-creator` | Generatore armonie OKLCH (porting di `pro-color-harmonies`), esportazione palette (PNG/PDF/ASE) + `/api/harmonies`. |
| `gradient-generator` | Costruttore gradient CSS + esportazioni + gradient salvati. |
| `gradient-palette` | Palette per interpolazione tra due colori + esportazioni. |
| `palette-maker` | Editor manuale palette con cronologia + integrazione preferiti. |
| `brand-colors` | Pagina del dataset colori dei brand. |
| `skin-tone-palette` | Pagina di riferimento dei toni della pelle. |
| `complementary-color` | Pagina colore complementare. |
| `image-color-picker` | Upload immagine/URL → colori dominanti (`sharp`) + `/api/image-color-picker`, `/api/image-url`. |
| `mood-palette` | Studio immagine → palette: contagocce, ricerca stock + `/api/stock-search`. |
| `color-token-extractor` | Estrazione token CSS (Fase 1) + proxy analisi renderizzata (Fase 2) + `/api/color-token-extractor`, `/api/color-token-extractor/runtime`. |
| `explore` | Pagine di esplorazione: colori, gradient e palette da immagini. |

---

## 🚀 Per Iniziare

### Prerequisiti

- **Node.js 18+** (il worker di rendering richiede **Node 20+**; sviluppato con 22)
- **Docker Desktop** (per MongoDB e il worker di rendering)
- **npm** (il progetto usa npm — vedi `package-lock.json`)

### 1. Avvia i servizi

Tutte le palette di Magikolor sono memorizzate in MongoDB. Il `compose.yml` avvia **due** servizi:

```bash
docker compose up -d
```

| Servizio | Immagine / build | Porta | Scopo |
|---|---|---|---|
| `database` | `mongo:7.0` | `27018:27017` | MongoDB. Utente `magikolor` / password `secret`, database `magikolor`. |
| `renderer` | `./workers/color-renderer` (Playwright) | `3100:3100` | Worker Chromium headless usato dall'analisi *renderizzata* dell'Estrattore di Token di Colore (opzionale — il resto dell'app funziona senza). |

> I dati di Mongo vivono in un volume Docker, quindi `docker compose up -d` dopo un `down` conserva i dati. Per maggiori dettagli vedi il [layer mongo](./layers/mongo/server/mongo.module.ts) e [`scripts/README.md`](./scripts/README.md).

### 2. Crea il `.env`

Crea un file `.env` nella radice del progetto. L'unica variabile richiesta per le funzioni IA è la chiave OpenAI:

```env
# Richiesta solo per la creazione palette con IA (/api/palette/create, /api/palette/clone)
OPENAI_API_KEY=sk-...

# Opzionale — mostrati i valori predefiniti
MONGO_URL=mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin
SITE_URL=http://localhost:3005
LOG_LEVEL=debug
RENDERER_URL=http://localhost:3100
```

### 3. Installa le dipendenze

```bash
npm install
```

### 4. Esegui in locale

```bash
npm run dev
```

Il server di sviluppo gira su **`http://localhost:3005`**. Uno script di preflight ([`scripts/check-dev-port.mjs`](./scripts/check-dev-port.mjs)) verifica che la porta sia libera prima di avviarsi, così Nuxt non cade mai silenziosamente su un'altra porta.

Altri comandi comuni:

```bash
npm run build        # build di produzione (nuxt build)
npm run generate     # generazione statica (nuxt generate)
npm run preview      # anteprima dell'app compilata
npm run start        # serve l'output compilato (node .output/server/index.mjs)
npm run typecheck    # nuxi typecheck (vue-tsc + tsc)
```

### 5. Popola il database (opzionale ma consigliato)

Per riempire il database locale con le ~17,4 mila palette incluse e dare contenuto a `/palette/explore`:

```bash
node scripts/import-palettes.mjs   # carica colorpalettes.json (modalità SOSTITUISCI; --keep per aggiungere)
node scripts/migrate-tags.mjs      # tag in minuscolo + Monochrome → monochromatic (idempotente)
```

Vedi l'elenco completo in [Script di Sviluppo](#script-di-sviluppo).

---

## ⚙️ Configurazione e Variabili d'Ambiente

| Variabile | Valore predefinito | Usata da | Descrizione |
|---|---|---|---|
| `OPENAI_API_KEY` | *(vuoto)* | layer `openai` | Richiesta per la generazione palette con IA (`/api/palette/create`, `/api/palette/clone`). Senza, questi endpoint restituiscono 401. |
| `MONGO_URL` | `mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin` | layer `mongo` | Stringa di connessione MongoDB (coincide con il servizio Docker Compose). |
| `SITE_URL` | `http://localhost:3005` | config radice | URL pubblico del sito; alimenta l'`apiUrl` pubblico (→ `{SITE_URL}/api`) e il `baseUrl` di i18n. |
| `LOG_LEVEL` | `debug` | layer `log` | Livello di log di `pino`. |
| `RENDERER_URL` | `http://localhost:3100` | config radice | URL del worker color-renderer (Docker). |
| `PALETTE_COLLECTION_NAME` | `palettes` | layer `palette` | Collection MongoDB per le palette. |
| `PALLETTE_AI_NAMES_START_DATE_MS` | `1729116912549` | layer `palette` | Timestamp usato per distribuire le date `createdAt` delle palette seedate. |
| `FEEDBACK_COLLECTION_NAME` | `feedback` | layer `feedback` | Collection MongoDB per il feedback. |
| `UNSPLASH_ACCESS_KEY` | *(vuoto)* | `mood-palette` | Chiave API Unsplash per la ricerca foto stock (fallback su immagini di esempio). |
| `PEXELS_API_KEY` | *(vuoto)* | `mood-palette` | Chiave API Pexels (provider opzionale). |
| `PIXABAY_API_KEY` | *(vuoto)* | `mood-palette` | Chiave API Pixabay (provider opzionale). |
| `PORT` | — | Nuxt/Nitro | Porta di ascolto per `npm start` / `npm run preview` / `nuxt dev` puro. **Nota**: lo script `dev` fissa `--port 3005` e la flag CLI vince, quindi `PORT` non influisce su `npm run dev`. |

### Ambiente del worker di rendering (in `compose.yml`)

| Variabile | Valore predefinito | Descrizione |
|---|---|---|
| `PORT` | `3100` | Porta HTTP su cui ascolta il worker. |
| `MAX_CONCURRENCY` | `3` | Massimo di job di rendering simultanei. |
| `JOB_TIMEOUT_MS` | `20000` | Timeout per job (20 s). |
| `CACHE_TTL_MS` | `3600000` | TTL della cache risultati (1 h, LRU di 200 URL). |
| `SCREENSHOT_CACHE_MAX` | `50` | Massimo di screenshot in cache (piccola LRU separata). |

---

## 🖥️ API

Magikolor offre una **API pubblica e gratuita** senza autenticazione (in locale). Tutti gli endpoint restituiscono JSON salvo dove indicato. I body delle richieste vengono validati a runtime con `@sinclair/typebox` (gli schemi vivono in `server/dtos/` di ogni layer).

> ⚠️ **Nota**: l'API pubblica può essere rimossa o modificata in qualsiasi momento, senza preavviso. Usala a tuo rischio.

### Panoramica degli endpoint

| Metodo | Percorso | Descrizione | Serve IA? |
|---|---|---|---|
| `GET` | `/api/palette/{id}` | Ottieni una palette per id MongoDB | — |
| `POST` | `/api/palette/list` | Elenco paginato di palette (filtro tag opzionale) | — |
| `POST` | `/api/palette/create` | Genera una palette IA da un prompt di testo | ✅ |
| `POST` | `/api/palette/clone` | Clona una palette con nuovi colori | ✅ |
| `GET` | `/api/palette/count` | Palette create nelle ultime 24 h (cache 5 min) | — |
| `GET` | `/api/og/get` | PNG OpenGraph di una palette | — |
| `GET` | `/api/og/tag` | PNG OpenGraph a griglia di un tag | — |
| `POST` | `/api/feedback/create` | Invia feedback | — |
| `GET` | `/api/random-color` | Colore casuale (HEX + RGB) | — |
| `GET` | `/api/contrast-checker` | Rapporto di contrasto WCAG tra due colori | — |
| `GET` | `/api/color-mixer` | Mescola due colori (HSL + RGB lineare) | — |
| `POST` | `/api/image-color-picker` | Estrai colori dominanti da un'immagine base64 (`sharp`) | — |
| `GET` | `/api/image-url` | Proxy URL immagine → data URL base64 (con guardie SSRF) | — |
| `GET` | `/api/harmonies` | Generazione armonie OKLCH (1:1 con il Creatore di Palette) | — |
| `GET` | `/api/pantone` | Ricerca dataset Pantone: per hex (ΔE 2000), codice o testo | — |
| `GET` | `/api/color-name` | Nome colore più vicino dal dizionario di 14.394 nomi | — |
| `POST` | `/api/color-token-extractor` | Estrai token di colore CSS da un sito (Fase 1) | — |
| `POST` | `/api/color-token-extractor/runtime` | Analisi pagina renderizzata: palette usata, contrasto WCAG del testo, screenshot, modalità scura (Fase 2 — richiede il worker Docker) | — |
| `GET` | `/api/stock-search` | Ricerca foto stock (Unsplash/Pexels/Pixabay) | — |

### Documentazione ed esempi

- **Riferimento interattivo**: la pagina `/api` dell'app in esecuzione elenca ogni endpoint con i suoi parametri.
- **Riferimento tecnico completo** (forme di richiesta/risposta, soglie WCAG, codici di errore, esempi PowerShell): vedi [`docs/API.md`](./docs/API.md).

---

## 🧩 Worker di Rendering Colori (Docker)

L'**Estrattore di Token di Colore** ha due fasi:

1. **Fase 1** — analizza il CSS del sito lato server per i custom properties di colore dichiarati (funziona da solo).
2. **Fase 2 (runtime)** — un servizio Docker separato ([`workers/color-renderer/`](./workers/color-renderer)) carica la pagina in **Chromium headless (Playwright)**, attende l'esecuzione del JS e riporta:
   - i colori **effettivamente renderizzati** (`getComputedStyle`) con la loro quota d'uso,
   - il **contrasto WCAG reale del testo** calcolato sullo sfondo *effettivo*,
   - uno **screenshot** opzionale (JPEG, ~56 KB base64),
   - il **rilevamento della modalità scura** tramite due render (`light` + `dark`).

Punti salienti dell'architettura: una singola istanza del browser con un `BrowserContext` isolato per job, un semaforo (max 3 job concorrenti, in coda), un timeout di 20 s per job e una cache LRU in memoria (200 URL / 1 h TTL). Se il worker è offline, l'endpoint `/runtime` restituisce 502 e lo strumento degrada con eleganza alla Fase 1.

Il worker è **isolato di proposito** dall'app principale — un crash di Chromium non può mai far cadere il sito, e la sua immagine pesante (~3,3 GB) non inquina l'immagine Docker principale. Report tecnico completo (architettura, pool, cache, guardie SSRF, metriche misurate, limitazioni note): [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md).

---

## 🌐 Internazionalizzazione (i18n)

Il sito è completamente tradotto in 5 lingue:

| Codice | Lingua | Bandiera |
|---|---|---|
| `en` | Inglese | 🇬🇧 (predefinita) |
| `ja` | Giapponese | 🇯🇵 |
| `it` | Italiano | 🇮🇹 |
| `es` | Spagnolo | 🇪🇸 |
| `fr` | Francese | 🇫🇷 |

- Strategia: `prefix_except_default` — inglese su `/`, gli altri su `/ja`, `/it`, `/es`, `/fr`.
- Tutte le traduzioni vivono in un unico file: [`i18n.config.ts`](./i18n.config.ts).
- Il cambio lingua è basato sull'URL (strategia a prefisso) tramite il componente `CommonLangSwitcher`.
- **Parità imposta in CI**: [`scripts/check-i18n-keys.mjs`](./scripts/check-i18n-keys.mjs) verifica che ogni lingua abbia esattamente lo stesso set di chiavi di `en` (eseguito con `npm run test:i18n`).

---

## 🧪 Test

Il progetto non ha un test runner basato su framework; i test sono script Node dedicati eseguiti con lo stripping dei tipi nativo di Node (`--experimental-strip-types`).

```bash
npm test   # esegue tutto quanto segue
```

| Comando | Cosa verifica |
|---|---|
| `npm run test:parity` | Parità numerica del generatore palette OKLCH vs la libreria originale `pro-color-harmonies` v0.11.0 (componente per componente `l, c, h`, tolleranza 0.0005, su 2.424 combinazioni). La copia di riferimento vive in [`layers/color-palette-creator/utils/__tests__/reference/`](./layers/color-palette-creator/utils/__tests__/reference/). |
| `npm run test:unit` | Utility di colore pure: convertitore canonico, contrasto WCAG, miscelazione RYB, costruttori gradient, formati colore, matcher Pantone, simulazione daltonismo. |
| `npm run test:i18n` | Parità delle chiavi tra le 5 lingue (vedi sopra). |
| `npm run test:favorites` | Pattern di persistenza di `useFavorites` (VueUse `useStorage`). |
| `npm run test:image-palettes` | Composable `useImagePalettes` (palette salvate insieme alle immagini). |
| `npm run test:token-extractor` | Parser CSS Color 4 + estrattore token di design (Fase 1). |
| `npm run test:renderer` | Logica pura del worker di rendering (`workers/color-renderer/lib.mjs`). |

Inoltre:

- `npm run typecheck` — controllo completo dei tipi TypeScript + Vue (`nuxi typecheck`).
- ESLint è configurato (`eslint-config-standard-with-typescript` + plugin Vue) ma non ha ancora uno script npm dedicato.

---

## 📜 Script di Sviluppo

Script di utilità sotto [`scripts/`](./scripts/) per seeding dei dati, migrazioni e tooling. La maggior parte è idempotente (eseguibile due volte senza rompere nulla). Dettagli completi: [`scripts/README.md`](./scripts/README.md).

| Script | Scopo |
|---|---|
| `scripts/import-palettes.mjs` | Importa le ~17,4 mila palette incluse da `colorpalettes.json` in `db.palettes` (SOSTITUISCI per default; `--keep` per aggiungere, `--dry-run` solo per validare). |
| `scripts/migrate-tags.mjs` | Migra i documenti esistenti al sistema di filtri attuale: tag in minuscolo, `Monochrome` → `monochromatic`. |
| `scripts/rename-db.mjs` | Migra un database locale dai vecchi nomi (`colormagic`/`magicolor`) a `magikolor`. `--dry-run` per l'anteprima, `--drop-old-user` per ripulire gli utenti legacy. |
| `scripts/generate-color-names.mjs` | Genera `layers/palette/utils/color-names-data.json` (14.394 nomi) da `colordatabase.json` + il dataset NTC legacy. |
| `scripts/import-brand-colors.mjs` | Consolida il dataset di 910 brand in `layers/brand-colors/utils/brand-colors-data.json` (fonte: pickcoloronline/brands, licenza ISC). |
| `scripts/acb-to-json.mjs` | Decodifica file Adobe Color Book (`.acb`) in JSON (usato per Pantone Metallics). |
| `scripts/check-dev-port.mjs` | Preflight che verifica che la porta 3005 sia libera prima di `npm run dev` (vedi [Per Iniziare](#per-iniziare)). |
| `scripts/check-i18n-keys.mjs` | Controllo parità chiavi i18n (collegato anche come `test:i18n`). |
| `scripts/unit-tests.mjs` | Harness di unit test per le utility di colore pure (anche `test:unit`). |

---

## 🗂️ Struttura del Repository

```
.
├── assets/                  # CSS globale (tipografia, stili dell'app)
├── icons/                   # Logo + favicon animato
├── i18n.config.ts           # Tutte le traduzioni (en/ja/it/es/fr)
├── layers/                  # Layer Nuxt — uno per dominio (vedi Architettura)
├── layouts/                 # Layout dell'app (default.vue)
├── pages/                   # Pagine radice: home, api, favorites, recent, privacy, terms
├── plugins/                 # Plugin Vue Query (TanStack)
├── public/                  # Risorse statiche (favicons, manifest)
├── scripts/                 # Seeding dati, migrazioni e script di test
├── tests/                   # Fixture di test (output ACB Pantone Metallics)
├── workers/color-renderer/  # Worker di rendering Playwright (servizio Docker)
├── app.config.ts            # Config UI Nuxt (colore primario, bottoni)
├── compose.yml              # Servizi MongoDB + worker di rendering
├── nuxt.config.ts           # Configurazione principale Nuxt
├── tailwind.config.ts       # Tema Tailwind (colori, ombre, aspect ratio)
├── databases/               # Dataset locali: palette seed, colori e riferimento Pantone
```

### Dataset inclusi

| Dataset | Posizione | Dimensione |
|---|---|---|
| Palette (seed) | `databases/colorpalettes.json` | ~17.390 palette |
| Dizionario nomi colore | `layers/palette/utils/color-names-data.json` | 14.394 nomi |
| Guide Pantone | `layers/all-colors/utils/pantone-data.json` | 3.219 campioni (Solid Coated, Pastels & Neons, Metallics) |
| Colori dei brand | `layers/brand-colors/utils/brand-colors-data.json` | 910 brand / 2.754 colori |

---

## 📚 Documentazione

La cartella [`docs/`](./docs) contiene documenti tecnici approfonditi:

| Documento | Contenuto |
|---|---|
| [`docs/API.md`](./docs/API.md) | Riferimento API completo: ogni endpoint, DTO, soglie WCAG, codici di errore, esempi. |
| [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md) | Report tecnico del worker di rendering Playwright (architettura, pool, cache, guardie SSRF, metriche, limitazioni, roadmap). |
| [`docs/design-audit.md`](./docs/design-audit.md) | Audit di coerenza di design tra le pagine (tipografia, header, stati vuoti). |
| [`docs/palette-parity-report.md`](./docs/palette-parity-report.md) | Report di parità numerica del generatore OKLCH vs `pro-color-harmonies`. |
| [`docs/informe-pro-color-harmonies-DEFINITIVO.md`](./docs/informe-pro-color-harmonies-DEFINITIVO.md) | Analisi approfondita dell'intera logica di `pro-color-harmonies` (l'implementazione di riferimento del generatore). |
| [`docs/palette-parity-code-diff.diff`](./docs/palette-parity-code-diff.diff) | Diff riga per riga tra la vecchia implementazione e quella verificata per parità. |

---

## 📄 Licenza

Magikolor è rilasciato sotto la [licenza MIT](./LICENSE).

---

## 🤝 Contributi

I contributi sono benvenuti! Buoni punti di ingresso:

- **Suggerisci una correzione o un nuovo strumento**: usa il modulo di suggerimenti dell'app (barra laterale → *Suggest an Idea*) o apri un issue.
- **Aggiungi uno strumento**: crea un nuovo layer Nuxt sotto `layers/` seguendo il pattern esistente (pagina + componenti + utility + API opzionale + chiavi i18n in tutte e 5 le lingue).
- **Aggiungi una traduzione**: mantieni il set di chiavi identico a `en` — `npm run test:i18n` lo verificherà.
- **Segui le convenzioni**: esegui `npm run typecheck` e `npm test` prima di inviare.

---

## 🙏 Ringraziamenti

- **OpenAI** — alimenta la generazione di palette con IA.
- **`pro-color-harmonies`** (meodai, MIT) — implementazione di riferimento del generatore di armonie OKLCH.
- **`dembrandt`** (MIT) — base concettuale dell'estrattore di token CSS.
- **pickcoloronline/brands** (ISC) — dataset colori dei brand.
- **Name that Color (NTC)** — base del dizionario dei nomi colore.
- **Pantone** — *Tutti i Colori* usa i dati delle guide Pantone; i riferimenti sono stime visive approssimative (ΔE 2000) e non sono affiliati né approvati da Pantone LLC.

Fatto con ❤️ per la community del colore.
