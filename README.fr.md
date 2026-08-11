[![Magikolor banner](./icons/logo/use-this.png)](https://magikolor.app)

> **🌐 Autres langues :** [English](README.en.md) · [日本語](README.ja.md) · [Italiano](README.it.md) · [Español](README.md) · [Français](README.fr.md)

# 🎨 [Magikolor](https://magikolor.app)

Magikolor est un **générateur de palettes de couleurs gratuit et open source** très populaire, avec une suite grandissante d'outils annexes pour tout ce qui touche à la couleur : dégradés, vérification de contraste, palettes d'images, couleurs de marques, correspondance Pantone, extraction de tokens CSS et bien plus.

Il est construit avec [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) et TypeScript, utilise [OpenAI](https://openai.com) pour générer des palettes à partir de prompts texte et est entièrement traduit en 5 langues.

> Magikolor reçoit environ **~500 000 pages vues par mois**, avec **12 000 palettes générées chaque jour**. Vous pouvez consulter les [analytics du site en direct ici](https://plausible.io/magikolor.app).

---

## 📑 Sommaire

- [✨ Fonctionnalités](#fonctionnalités)
- [🧰 Outils](#outils)
- [🛠️ Stack Technique](#stack-technique)
- [🏗️ Architecture des couches Nuxt](#architecture-des-couches-nuxt)
- [🚀 Pour Commencer](#pour-commencer)
- [⚙️ Configuration et Variables d'Environnement](#configuration-et-variables-denvironnement)
- [🖥️ API](#api)
- [🧩 Worker de Rendu des Couleurs (Docker)](#worker-de-rendu-des-couleurs-docker)
- [🌐 Internationalisation (i18n)](#internationalisation-i18n)
- [🧪 Tests](#tests)
- [📜 Scripts de Développement](#scripts-de-développement)
- [🗂️ Structure du Dépôt](#structure-du-dépôt)
- [📚 Documentation](#documentation)
- [📄 Licence](#licence)
- [🤝 Contribuer](#contribuer)
- [🙏 Remerciements](#remerciements)

---

## ✨ Fonctionnalités

- **Génération de palettes par IA** à partir de n'importe quel prompt texte (« sunset », « rétro années 80 », un code hex, une ambiance…) — propulsée par OpenAI, avec contrôles de modération et sécurité du prompt.
- **Plus de 18 outils de couleur gratuits**, chacun avec sa propre page (voir [Outils](#outils)).
- **API publique et gratuite** couvrant palettes, harmonies, Pantone, contraste, noms de couleurs et plus (voir [API](#api)).
- **Persistance côté client** : favoris, récents, couleurs enregistrées, dégradés et palettes d'images sont stockés dans le navigateur via [VueUse `useStorage`](https://vueuse.org/core/useStorage/) — aucun compte requis.
- **5 langues** : anglais, japonais, italien, espagnol et français via [@nuxtjs/i18n](https://i18n.nuxtjs.org/).
- **Mathématiques de la couleur perceptives** : les harmonies de palettes sont calculées dans l'espace colorimétrique **OKLCH** (portage de `pro-color-harmonies`, vérifié 1:1 par un harnais numérique de parité).
- **Outils basés sur les images** : extraire les couleurs dominantes de n'importe quelle image (côté serveur avec `sharp`), rechercher des photos stock et créer des palettes d'ambiance avec des pipettes déplaçables.
- **Outils d'accessibilité** : vérificateur de contraste WCAG avec niveaux AA/AAA, suggestions intelligentes et simulateur de daltonisme (protanopie, deutéranopie, tritanopie, achromatopsie).
- **Données de référence précises** : correspondance Pantone Solid Coated / Pastels & Neons / Metallics par Delta-E 2000, 14 394 couleurs nommées et 910 palettes de marques.
- **Worker de rendu dockerisé** : un service basé sur Playwright qui analyse les sites web *réellement rendus* (couleurs utilisées, contraste WCAG réel du texte, captures d'écran, détection du mode sombre).

---

## 🧰 Outils

Chaque outil est une page autonome. Les liens pointent vers le site en ligne ; tous existent aussi en développement sur `http://localhost:3005`.

### Principal
| Outil | Route | Description |
|---|---|---|
| 🎨 **Générateur de Palettes de Couleurs** | [`/`](https://magikolor.app/) | Page d'accueil. Saisissez un prompt (ou choisissez un exemple) et une IA génère une palette de 5 couleurs avec nom et tags. |
| 🔍 **Explorer les Palettes de Couleurs** | [`/palette/explore`](https://magikolor.app/palette/explore) | Parcourez toutes les palettes publiques générées, filtrez par couleur, ton, style et saison, chargez plus / pages par tag. |
| ⭐ **Favoris** | [`/favorites`](https://magikolor.app/favorites) | Vos palettes enregistrées, couleurs enregistrées et palettes d'images, persistées dans le navigateur. |
| 🕐 **Récents** | [`/recent`](https://magikolor.app/recent) | Palettes et couleurs créées récemment, enregistrées dans votre navigateur. |

### Générateurs et éditeurs
| Outil | Route | Description |
|---|---|---|
| 🎛️ **Palette Maker** | [`/palette-maker`](https://magikolor.app/palette-maker) | Créez des palettes personnalisées à la main : mode harmonie, ajouter/supprimer/verrouiller des couleurs, glisser pour réorganiser, annuler/rétablir, info teintes et nuances, enregistrer dans les favoris. |
| 🧮 **Créateur de Palettes de Couleurs** | [`/color-palette-creator`](https://magikolor.app/color-palette-creator) | Générez des schémas complets à partir d'une seule couleur de base : 6 types d'harmonie × 4 styles, modificateurs créatifs, tout dans l'espace perceptif OKLCH. Export PNG/PDF/ASE. |
| 🌈 **Générateur de Dégradés** | [`/gradient-generator`](https://magikolor.app/gradient-generator) | Dégradés CSS linéaires / radiaux / coniques avec contrôle total des stops. Copie CSS, export config Tailwind ou JSON, enregistrez les dégradés. |
| 📊 **Palette de Dégradé** | [`/gradient-palette`](https://magikolor.app/gradient-palette) | Interpolez une palette entre deux couleurs (2–10 étapes). Copie HEX / variables CSS / dégradé, export PNG/JSON/ASE, enregistrer dans les favoris. |
| 🎲 **Générateur de Couleur Aléatoire** | [`/random-color`](https://magikolor.app/random-color) | Un clic (ou barre espace) pour une nouvelle couleur aléatoire. |

### Référence et analyse des couleurs
| Outil | Route | Description |
|---|---|---|
| 🗂️ **Toutes les Couleurs** | [`/all-colors`](https://magikolor.app/all-colors) | Choisissez une couleur et voyez-la dans chaque modèle colorimétrique, générez teintes et nuances, et trouvez les alternatives **Pantone** les plus proches (ΔE 2000). |
| 🌈 **Explorer les Couleurs** | [`/explore/colors`](https://magikolor.app/explore/colors) | Parcourez des milliers de couleurs nommées, recherchez par nom ou hex, copiez en un clic. |
| 🏷️ **Couleurs de Marques** | [`/brand-colors`](https://magikolor.app/brand-colors) | 910 palettes de marques connues (2 754 couleurs) avec recherche, copie en un clic et liens vers les marques. |
| 🧴 **Palette de Tons de Peau** | [`/skin-tone-palette`](https://magikolor.app/skin-tone-palette) | 48 codes hex de tons de peau en 6 groupes, des porcelaine/clairs aux profonds/riches, avec sous-tons froids/neutres/chauds/dorés/olive/rouges. |
| 🔄 **Couleur Complémentaire** | [`/complementary-color`](https://magikolor.app/complementary-color) | L'opposé exact de toute couleur sur le cercle chromatique (teinte + 180°), avec HEX, nom et copie. |

### Outils d'image
| Outil | Route | Description |
|---|---|---|
| 🖼️ **Sélecteur de Couleur d'Image** | [`/image-color-picker`](https://magikolor.app/image-color-picker) | Téléversez une image (ou collez une URL) et extrayez ses couleurs dominantes avec un ordre assisté par IA. Enregistré avec l'image. |
| 🎭 **Palette d'Ambiance** | [`/mood-palette`](https://magikolor.app/mood-palette) | Construisez une palette à partir de n'importe quelle image : pipettes déplaçables, affinage manuel ou harmonie IA, recherche de photos stock, exports (collage, PDF, carte de couleurs). |

### Accessibilité et utilitaires
| Outil | Route | Description |
|---|---|---|
| ☀️ **Vérificateur de Contraste** | [`/contrast-checker`](https://magikolor.app/contrast-checker) | Ratios de contraste WCAG avec badges AA/AAA pour texte normal/grand et composants UI, simulateur de vision, suggestions accessibles intelligentes, export PDF. |
| 🧪 **Extracteur de Tokens de Couleur** | [`/color-token-extractor`](https://magikolor.app/color-token-extractor) | Extrayez les tokens de couleur CSS de n'importe quel site ; analyse *rendue* optionnelle (couleurs réelles utilisées + contraste WCAG du texte + capture + mode sombre) via le worker Docker. Copie en JSON, CSS ou config Tailwind. |
| 🎨 **Mélangeur de Couleurs** | [`/color-mixer`](https://magikolor.app/color-mixer) | Mélangez deux couleurs en temps réel avec un modèle peinture **RYB** soustractif, plus des variantes HSL/RGB-linéaire et des mélanges prédéfinis. |

> D'autres outils sont en cours de développement — la barre latérale liste aussi ceux à venir (marqués *Bientôt disponible*).

---

## 🛠️ Stack Technique

| Couche | Technologie |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (`3.13.2`) + moteur serveur Nitro |
| Langage | TypeScript (`5.6`), SFC Vue stricts |
| UI | [Nuxt UI](https://ui.nuxt.com) (`2.18.7`) + [Nuxt UI Pro](https://ui.nuxt.com/pro) (`1.4.4`), Tailwind CSS |
| État / récupération de données | [@tanstack/vue-query](https://github.com/TanStack/query) (`5.56`) |
| Validation côté serveur | [@sinclair/typebox](https://github.com/sinclairzx81/typebox) + AJV ; formulaires client avec [yup](https://github.com/jquense/yup) |
| Base de données | [MongoDB](https://www.mongodb.com) via le driver officiel `mongodb` (`6.9`) — Mongo 7.0 dans Docker |
| IA | [SDK Node d'OpenAI](https://github.com/openai/openai-node) (`4.65`) |
| Traitement d'images | [sharp](https://sharp.pixelplumbing.com) (`0.33`) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (`8.5`) |
| Analytics | [Plausible](https://plausible.io) via `@nuxtjs/plausible` |
| Polices | Inter via `@nuxtjs/google-fonts` |
| Logging | [pino](https://getpino.io) + `pino-pretty` |
| Sélecteur de couleur | `@ckpack/vue-color` |
| HTTP (scripts de données) | `got` |
| Utilitaires | `@vueuse/core`, `@apideck/better-ajv-errors`, `@types/twitter-text` |
| Linting | ESLint (`eslint-config-standard-with-typescript` + plugin Vue) |

> **Remarque** : `@nuxt/ui-pro` récupère les paquets d'icônes depuis le registre privé FontAwesome — le jeton d'authentification est déjà configuré dans [`.npmrc`](./.npmrc).

---

## 🏗️ Architecture des couches Nuxt

Magikolor repose sur le **système de couches** intégré de Nuxt, qui permet à chaque domaine de l'application de vivre dans son propre répertoire isolé sous [`layers/`](./layers). Chaque couche apporte son propre `nuxt.config.ts`, ses pages, composants, composables, utilitaires et (si nécessaire) un module serveur Nitro.

### Modèle des modules serveur

Côté serveur, chaque couche qui a besoin d'état expose une **fabrique de module** (ex. [`palette.module.ts`](./layers/palette/server/palette.module.ts)) renvoyant un petit objet avec ses services et référentiels. Ces fabriques sont câblées ensemble dans l'utilitaire de configuration central [`layers/setup/server/utils/setup.util.ts`](./layers/setup/server/utils/setup.util.ts), exécuté une seule fois au démarrage du serveur (via le plugin Nitro [`setup.plugin.ts`](./layers/setup/server/plugins/setup.plugin.ts)) :

1. Un logger `pino` est créé.
2. MongoDB se connecte (configuration depuis `MONGO_URL`).
3. Les modules sont instanciés avec leurs dépendances injectées (OpenAI → AI → Palette → OG ; Feedback).
4. `palette.setup()` garantit l'existence des index/collections.
5. Le global `modules` devient disponible pour chaque handler API via `getModules()` — qui renvoie une **503** propre si le serveur démarre encore (ex. Mongo était en panne au démarrage).

Les handlers API sont de simples fichiers de route Nitro dans chaque couche, ex. `layers/palette/server/api/palette/create.ts` → `POST /api/palette/create`.

### Référence des couches

| Couche | Responsabilité |
|---|---|
| `setup` | Bootstrap du serveur : connexion Mongo, câblage de tous les modules, exposition de `getModules()`. |
| `mongo` | Client MongoDB + configuration de la chaîne de connexion. |
| `openai` | Client/service OpenAI (le seul fournisseur aujourd'hui). |
| `ai` | Service IA générique : contrôles de modération + exécution des prompts. |
| `log` | Configuration du logger `pino`. |
| `common` | Composants partagés (nav, footer, sélecteur de langue, états vides, simulateur de daltonisme…), composables (`useFavorites`, `useNotifications`, `useModalV2`…) et utilitaires de couleur purs (convertisseur, contraste, langue, échantillons). |
| `palette` | Domaine central : entité/référentiel/service/validation des palettes, API palette, tags et filtres, disposition des couleurs, pages palette (`/palette/explore`, `/palette/[id]`). |
| `og` | Génération d'images PNG OpenGraph pour les palettes et les grilles par tag. |
| `feedback` | Persistance du feedback/contact et des suggestions. |
| `plausible` | Module enveloppe des analytics. |
| `random-color` | Page couleur aléatoire + `/api/random-color`. |
| `contrast-checker` | Outil de contraste : ratios WCAG, simulation de vision, suggestions, palettes accessibles + `/api/contrast-checker`. |
| `color-mixer` | Page du mélangeur RYB + utilitaires. |
| `all-colors` | Page Toutes les Couleurs : formats de couleur, teintes/ombrures, correspondance dataset Pantone + `/api/pantone`, `/api/color-name`. |
| `color-palette-creator` | Générateur d'harmonies OKLCH (portage de `pro-color-harmonies`), export de palettes (PNG/PDF/ASE) + `/api/harmonies`. |
| `gradient-generator` | Constructeur de dégradés CSS + exports + dégradés enregistrés. |
| `gradient-palette` | Palettes par interpolation entre deux couleurs + exports. |
| `palette-maker` | Éditeur manuel de palettes avec historique + intégration favoris. |
| `brand-colors` | Page du dataset de couleurs de marques. |
| `skin-tone-palette` | Page de référence des tons de peau. |
| `complementary-color` | Page couleur complémentaire. |
| `image-color-picker` | Upload image/URL → couleurs dominantes (`sharp`) + `/api/image-color-picker`, `/api/image-url`. |
| `mood-palette` | Studio image → palette : pipettes, recherche stock + `/api/stock-search`. |
| `color-token-extractor` | Extraction de tokens CSS (Phase 1) + proxy d'analyse rendue (Phase 2) + `/api/color-token-extractor`, `/api/color-token-extractor/runtime`. |
| `explore` | Pages d'exploration : couleurs, dégradés et palettes d'images. |

---

## 🚀 Pour Commencer

### Prérequis

- **Node.js 18+** (le worker de rendu nécessite **Node 20+** ; développé avec 22)
- **Docker Desktop** (pour MongoDB et le worker de rendu)
- **npm** (le projet utilise npm — voir `package-lock.json`)

### 1. Démarrez les services

Toutes les palettes de Magikolor sont stockées dans MongoDB. Le `compose.yml` démarre **deux** services :

```bash
docker compose up -d
```

| Service | Image / build | Port | Objectif |
|---|---|---|---|
| `database` | `mongo:7.0` | `27018:27017` | MongoDB. Utilisateur `magikolor` / mot de passe `secret`, base de données `magikolor`. |
| `renderer` | `./workers/color-renderer` (Playwright) | `3100:3100` | Worker Chromium headless utilisé par l'analyse *rendue* de l'Extracteur de Tokens de Couleur (optionnel — le reste de l'application fonctionne sans). |

> Les données Mongo vivent dans un volume Docker, donc `docker compose up -d` après un `down` conserve vos données. Pour plus de détails, voir la [couche mongo](./layers/mongo/server/mongo.module.ts) et [`scripts/README.md`](./scripts/README.md).

### 2. Créez le `.env`

Créez un fichier `.env` à la racine du projet. La seule variable requise pour les fonctions IA est la clé OpenAI :

```env
# Requise uniquement pour la création de palettes IA (/api/palette/create, /api/palette/clone)
OPENAI_API_KEY=sk-...

# Optionnel — valeurs par défaut affichées
MONGO_URL=mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin
SITE_URL=http://localhost:3005
LOG_LEVEL=debug
RENDERER_URL=http://localhost:3100
```

### 3. Installez les dépendances

```bash
npm install
```

### 4. Exécutez en local

```bash
npm run dev
```

Le serveur de développement tourne sur **`http://localhost:3005`**. Un script de pré-vérification ([`scripts/check-dev-port.mjs`](./scripts/check-dev-port.mjs)) vérifie que le port est libre avant de démarrer, afin que Nuxt ne retombe jamais silencieusement sur un autre port.

Autres commandes courantes :

```bash
npm run build        # build de production (nuxt build)
npm run generate     # génération statique (nuxt generate)
npm run preview      # aperçu de l'application compilée
npm run start        # sert l'output compilé (node .output/server/index.mjs)
npm run typecheck    # nuxi typecheck (vue-tsc + tsc)
```

### 5. Remplissez la base de données (optionnel mais recommandé)

Pour peupler la base de données locale avec les ~17,4 milliers de palettes incluses et donner du contenu à `/palette/explore` :

```bash
node scripts/import-palettes.mjs   # charge colorpalettes.json (mode REMPLACER ; --keep pour ajouter)
node scripts/migrate-tags.mjs      # tags en minuscules + Monochrome → monochromatic (idempotent)
```

Voir la liste complète dans [Scripts de Développement](#scripts-de-développement).

---

## ⚙️ Configuration et Variables d'Environnement

| Variable | Valeur par défaut | Utilisée par | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | *(vide)* | couche `openai` | Requise pour la génération de palettes IA (`/api/palette/create`, `/api/palette/clone`). Sans elle, ces endpoints renvoient 401. |
| `MONGO_URL` | `mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin` | couche `mongo` | Chaîne de connexion MongoDB (correspond au service Docker Compose). |
| `SITE_URL` | `http://localhost:3005` | config racine | URL publique du site ; alimente l'`apiUrl` public (→ `{SITE_URL}/api`) et le `baseUrl` i18n. |
| `LOG_LEVEL` | `debug` | couche `log` | Niveau de log de `pino`. |
| `RENDERER_URL` | `http://localhost:3100` | config racine | URL du worker color-renderer (Docker). |
| `PALETTE_COLLECTION_NAME` | `palettes` | couche `palette` | Collection MongoDB pour les palettes. |
| `PALLETTE_AI_NAMES_START_DATE_MS` | `1729116912549` | couche `palette` | Timestamp utilisé pour répartir les dates `createdAt` des palettes seedées. |
| `FEEDBACK_COLLECTION_NAME` | `feedback` | couche `feedback` | Collection MongoDB pour le feedback. |
| `UNSPLASH_ACCESS_KEY` | *(vide)* | `mood-palette` | Clé API Unsplash pour la recherche de photos stock (repli sur des images d'exemple). |
| `PEXELS_API_KEY` | *(vide)* | `mood-palette` | Clé API Pexels (fournisseur optionnel). |
| `PIXABAY_API_KEY` | *(vide)* | `mood-palette` | Clé API Pixabay (fournisseur optionnel). |
| `PORT` | — | Nuxt/Nitro | Port d'écoute pour `npm start` / `npm run preview` / `nuxt dev` nu. **Remarque** : le script `dev` fixe `--port 3005` et la flag CLI gagne, donc `PORT` n'affecte pas `npm run dev`. |

### Environnement du worker de rendu (dans `compose.yml`)

| Variable | Valeur par défaut | Description |
|---|---|---|
| `PORT` | `3100` | Port HTTP sur lequel le worker écoute. |
| `MAX_CONCURRENCY` | `3` | Maximum de jobs de rendu simultanés. |
| `JOB_TIMEOUT_MS` | `20000` | Timeout par job (20 s). |
| `CACHE_TTL_MS` | `3600000` | TTL du cache de résultats (1 h, LRU de 200 URLs). |
| `SCREENSHOT_CACHE_MAX` | `50` | Maximum de captures en cache (petit LRU séparé). |

---

## 🖥️ API

Magikolor propose une **API publique et gratuite** sans authentification (en local). Tous les endpoints renvoient du JSON sauf indication contraire. Les corps de requêtes sont validés à l'exécution avec `@sinclair/typebox` (les schémas vivent dans `server/dtos/` de chaque couche).

> ⚠️ **Remarque** : l'API publique peut être supprimée ou modifiée à tout moment, sans préavis. Utilisez-la à vos risques.

### Aperçu des endpoints

| Méthode | Route | Description | Besoin d'IA ? |
|---|---|---|---|
| `GET` | `/api/palette/{id}` | Récupérer une palette par son id MongoDB | — |
| `POST` | `/api/palette/list` | Liste paginée de palettes (filtre tag optionnel) | — |
| `POST` | `/api/palette/create` | Générer une palette IA à partir d'un prompt texte | ✅ |
| `POST` | `/api/palette/clone` | Cloner une palette avec de nouvelles couleurs | ✅ |
| `GET` | `/api/palette/count` | Palettes créées dans les 24 dernières heures (cache 5 min) | — |
| `GET` | `/api/og/get` | PNG OpenGraph d'une palette | — |
| `GET` | `/api/og/tag` | PNG OpenGraph en grille d'un tag | — |
| `POST` | `/api/feedback/create` | Envoyer un feedback | — |
| `GET` | `/api/random-color` | Couleur aléatoire (HEX + RGB) | — |
| `GET` | `/api/contrast-checker` | Ratio de contraste WCAG entre deux couleurs | — |
| `GET` | `/api/color-mixer` | Mélanger deux couleurs (HSL + RGB linéaire) | — |
| `POST` | `/api/image-color-picker` | Extraire les couleurs dominantes d'une image base64 (`sharp`) | — |
| `GET` | `/api/image-url` | Proxy URL d'image → data URL base64 (avec gardes SSRF) | — |
| `GET` | `/api/harmonies` | Génération d'harmonies OKLCH (1:1 avec le Créateur de Palettes) | — |
| `GET` | `/api/pantone` | Recherche dans le dataset Pantone : par hex (ΔE 2000), code ou texte | — |
| `GET` | `/api/color-name` | Nom de couleur le plus proche du dictionnaire de 14 394 noms | — |
| `POST` | `/api/color-token-extractor` | Extraire les tokens de couleur CSS d'un site (Phase 1) | — |
| `POST` | `/api/color-token-extractor/runtime` | Analyse de page rendue : palette utilisée, contraste WCAG du texte, capture, mode sombre (Phase 2 — requiert le worker Docker) | — |
| `GET` | `/api/stock-search` | Recherche de photos stock (Unsplash/Pexels/Pixabay) | — |

### Documentation et exemples

- **Référence interactive** : la page `/api` de l'application en cours d'exécution liste chaque endpoint avec ses paramètres.
- **Référence technique complète** (formes requête/réponse, seuils WCAG, codes d'erreur, exemples PowerShell) : voir [`docs/API.md`](./docs/API.md).

---

## 🧩 Worker de Rendu des Couleurs (Docker)

L'**Extracteur de Tokens de Couleur** a deux phases :

1. **Phase 1** — analyse le CSS du site côté serveur pour les propriétés personnalisées de couleur déclarées (fonctionne seul).
2. **Phase 2 (runtime)** — un service Docker séparé ([`workers/color-renderer/`](./workers/color-renderer)) charge la page dans **Chromium headless (Playwright)**, attend l'exécution du JS et rapporte :
   - les couleurs **réellement rendues** (`getComputedStyle`) avec leur part d'utilisation,
   - le **contraste WCAG réel du texte** calculé sur l'arrière-plan *effectif*,
   - une **capture d'écran** optionnelle (JPEG, ~56 Ko en base64),
   - la **détection du mode sombre** via deux rendus (`light` + `dark`).

Points clés de l'architecture : une seule instance du navigateur avec un `BrowserContext` isolé par job, un sémaphore (max 3 jobs simultanés, en file), un timeout de 20 s par job et un cache LRU en mémoire (200 URLs / 1 h de TTL). Si le worker est hors ligne, l'endpoint `/runtime` renvoie 502 et l'outil se dégrade élégamment vers la Phase 1.

Le worker est **isolé volontairement** de l'application principale — un crash de Chromium ne peut jamais faire tomber le site, et son image lourde (~3,3 Go) ne pollue pas l'image Docker principale. Rapport technique complet (architecture, pool, cache, gardes SSRF, métriques mesurées, limitations connues) : [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md).

---

## 🌐 Internationalisation (i18n)

Le site est entièrement traduit en 5 langues :

| Code | Langue | Drapeau |
|---|---|---|
| `en` | Anglais | 🇬🇧 (par défaut) |
| `ja` | Japonais | 🇯🇵 |
| `it` | Italien | 🇮🇹 |
| `es` | Espagnol | 🇪🇸 |
| `fr` | Français | 🇫🇷 |

- Stratégie : `prefix_except_default` — anglais sur `/`, les autres sur `/ja`, `/it`, `/es`, `/fr`.
- Toutes les traductions vivent dans un seul fichier : [`i18n.config.ts`](./i18n.config.ts).
- Le changement de langue est basé sur l'URL (stratégie à préfixe) via le composant `CommonLangSwitcher`.
- **Parité imposée en CI** : [`scripts/check-i18n-keys.mjs`](./scripts/check-i18n-keys.mjs) vérifie que chaque langue a exactement le même ensemble de clés que `en` (exécuté avec `npm run test:i18n`).

---

## 🧪 Tests

Le projet n'a pas de runner de tests basé sur un framework ; les tests sont des scripts Node dédiés exécutés avec le type-stripping natif de Node (`--experimental-strip-types`).

```bash
npm test   # exécute tout ce qui suit
```

| Commande | Ce qu'elle vérifie |
|---|---|
| `npm run test:parity` | Parité numérique du générateur de palettes OKLCH vs la bibliothèque originale `pro-color-harmonies` v0.11.0 (composant par composant `l, c, h`, tolérance 0,0005, sur 2 424 combinaisons). La copie de référence vit dans [`layers/color-palette-creator/utils/__tests__/reference/`](./layers/color-palette-creator/utils/__tests__/reference/). |
| `npm run test:unit` | Utilitaires de couleur purs : convertisseur canonique, contraste WCAG, mélange RYB, constructeurs de dégradés, formats de couleur, matcher Pantone, simulation de daltonisme. |
| `npm run test:i18n` | Parité des clés entre les 5 langues (voir ci-dessus). |
| `npm run test:favorites` | Modèle de persistance de `useFavorites` (VueUse `useStorage`). |
| `npm run test:image-palettes` | Composable `useImagePalettes` (palettes enregistrées avec les images). |
| `npm run test:token-extractor` | Parser CSS Color 4 + extracteur de tokens de design (Phase 1). |
| `npm run test:renderer` | Logique pure du worker de rendu (`workers/color-renderer/lib.mjs`). |

En plus :

- `npm run typecheck` — vérification complète des types TypeScript + Vue (`nuxi typecheck`).
- ESLint est configuré (`eslint-config-standard-with-typescript` + plugin Vue) mais n'a pas encore de script npm dédié.

---

## 📜 Scripts de Développement

Scripts utilitaires sous [`scripts/`](./scripts/) pour le seeding des données, les migrations et l'outillage. La plupart sont idempotents (exécutables deux fois sans rien casser). Détails complets : [`scripts/README.md`](./scripts/README.md).

| Script | Objectif |
|---|---|
| `scripts/import-palettes.mjs` | Importe les ~17,4 milliers de palettes incluses depuis `colorpalettes.json` dans `db.palettes` (REMPLACER par défaut ; `--keep` pour ajouter, `--dry-run` pour valider uniquement). |
| `scripts/migrate-tags.mjs` | Migre les documents existants vers le système de filtres actuel : tags en minuscules, `Monochrome` → `monochromatic`. |
| `scripts/rename-db.mjs` | Migre une base de données locale des anciens noms (`colormagic`/`magicolor`) vers `magikolor`. `--dry-run` pour l'aperçu, `--drop-old-user` pour nettoyer les utilisateurs hérités. |
| `scripts/generate-color-names.mjs` | Génère `layers/palette/utils/color-names-data.json` (14 394 noms) à partir de `colordatabase.json` + le dataset NTC hérité. |
| `scripts/import-brand-colors.mjs` | Consolide le dataset de 910 marques dans `layers/brand-colors/utils/brand-colors-data.json` (source : pickcoloronline/brands, licence ISC). |
| `scripts/acb-to-json.mjs` | Décode les fichiers Adobe Color Book (`.acb`) en JSON (utilisé pour Pantone Metallics). |
| `scripts/check-dev-port.mjs` | Pré-vérification que le port 3005 est libre avant `npm run dev` (voir [Pour Commencer](#pour-commencer)). |
| `scripts/check-i18n-keys.mjs` | Vérification de la parité des clés i18n (également branchée en `test:i18n`). |
| `scripts/unit-tests.mjs` | Harnais de tests unitaires pour les utilitaires de couleur purs (aussi `test:unit`). |

---

## 🗂️ Structure du Dépôt

```
.
├── assets/                  # CSS global (typographie, styles de l'application)
├── icons/                   # Logo + favicon animé
├── i18n.config.ts           # Toutes les traductions (en/ja/it/es/fr)
├── layers/                  # Couches Nuxt — une par domaine (voir Architecture)
├── layouts/                 # Layout de l'application (default.vue)
├── pages/                   # Pages racine : home, api, favorites, recent, privacy, terms
├── plugins/                 # Plugin Vue Query (TanStack)
├── public/                  # Ressources statiques (favicons, manifest)
├── scripts/                 # Seeding de données, migrations et scripts de tests
├── tests/                   # Fixtures de tests (sortie ACB Pantone Metallics)
├── workers/color-renderer/  # Worker de rendu Playwright (service Docker)
├── app.config.ts            # Config UI Nuxt (couleur primaire, boutons)
├── compose.yml              # Services MongoDB + worker de rendu
├── nuxt.config.ts           # Configuration principale de Nuxt
├── tailwind.config.ts       # Thème Tailwind (couleurs, ombres, ratios)
├── colorpalettes.json       # Données de seed incluses : ~17,4 milliers de palettes (suivi)
├── colordatabase.json       # Base de données locale de couleurs (~13,6 milliers ; gitignored)
└── colors_pantone.csv       # Données de référence Pantone (suivi)
```

### Datasets inclus

| Dataset | Emplacement | Taille |
|---|---|---|
| Palettes (seed) | `colorpalettes.json` | ~17 390 palettes |
| Dictionnaire de noms de couleurs | `layers/palette/utils/color-names-data.json` | 14 394 noms |
| Guides Pantone | `layers/all-colors/utils/pantone-data.json` | 3 219 échantillons (Solid Coated, Pastels & Neons, Metallics) |
| Couleurs de marques | `layers/brand-colors/utils/brand-colors-data.json` | 910 marques / 2 754 couleurs |

---

## 📚 Documentation

Le dossier [`docs/`](./docs) contient des documents techniques approfondis :

| Document | Contenu |
|---|---|
| [`docs/API.md`](./docs/API.md) | Référence API complète : chaque endpoint, DTO, seuils WCAG, codes d'erreur, exemples. |
| [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md) | Rapport technique du worker de rendu Playwright (architecture, pool, cache, gardes SSRF, métriques, limitations, feuille de route). |
| [`docs/design-audit.md`](./docs/design-audit.md) | Audit de cohérence de design entre les pages (typographie, en-têtes, états vides). |
| [`docs/palette-parity-report.md`](./docs/palette-parity-report.md) | Rapport de parité numérique du générateur OKLCH vs `pro-color-harmonies`. |
| [`docs/informe-pro-color-harmonies-DEFINITIVO.md`](./docs/informe-pro-color-harmonies-DEFINITIVO.md) | Analyse approfondie de toute la logique de `pro-color-harmonies` (l'implémentation de référence du générateur). |
| [`docs/palette-parity-code-diff.diff`](./docs/palette-parity-code-diff.diff) | Diff ligne par ligne entre l'ancienne implémentation et celle vérifiée par parité. |

---

## 📄 Licence

Magikolor est publié sous la [licence MIT](./LICENSE).

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! De bons points d'entrée :

- **Suggérez une correction ou un nouvel outil** : utilisez le formulaire de suggestions de l'application (barre latérale → *Suggest an Idea*) ou ouvrez un issue.
- **Ajoutez un outil** : créez une nouvelle couche Nuxt sous `layers/` en suivant le modèle existant (page + composants + utilitaires + API optionnelle + clés i18n dans les 5 langues).
- **Ajoutez une traduction** : gardez l'ensemble de clés identique à `en` — `npm run test:i18n` le vérifiera.
- **Suivez les conventions** : exécutez `npm run typecheck` et `npm test` avant d'envoyer.

---

## 🙏 Remerciements

- **OpenAI** — alimente la génération de palettes par IA.
- **`pro-color-harmonies`** (meodai, MIT) — implémentation de référence du générateur d'harmonies OKLCH.
- **`dembrandt`** (MIT) — base conceptuelle de l'extracteur de tokens CSS.
- **pickcoloronline/brands** (ISC) — dataset de couleurs de marques.
- **Name that Color (NTC)** — base du dictionnaire de noms de couleurs.
- **Pantone** — *Toutes les Couleurs* utilise les données des guides Pantone ; les références sont des estimations visuelles approximatives (ΔE 2000) et ne sont ni affiliées ni approuvées par Pantone LLC.

Fait avec ❤️ pour la communauté de la couleur.
