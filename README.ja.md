[![Magikolor banner](./icons/logo/use-this.png)](https://magikolor.app)

> **🌐 他の言語:** [English](README.en.md) · [日本語](README.ja.md) · [Italiano](README.it.md) · [Español](README.md) · [Français](README.fr.md)

# 🎨 [Magikolor](https://magikolor.app)

Magikolor は、人気の**無料・オープンソースのカラーパレットジェネレーター**です。グラデーション、コントラストチェック、画像パレット、ブランドカラー、Pantone マッチング、CSS トークン抽出など、色に関わるあらゆるサイドツールを拡充中です。

[Nuxt](https://nuxt.com)、[Nuxt UI](https://ui.nuxt.com)、TypeScript で構築され、[OpenAI](https://openai.com) を使ってテキストプロンプトからパレットを生成し、5 言語に完全翻訳されています。

> Magikolor は**月間約 50 万ページビュー**、**毎日 1 万 2 千個のパレット**が生成されています。[ライブサイトのアナリティクスはこちら](https://plausible.io/magikolor.app)で確認できます。

---

## 📑 目次

- [✨ 特徴](#特徴)
- [🧰 ツール](#ツール)
- [🛠️ 技術スタック](#技術スタック)
- [🏗️ アーキテクチャ: Nuxt レイヤー](#アーキテクチャ-nuxt-レイヤー)
- [🚀 はじめに](#はじめに)
- [⚙️ 設定と環境変数](#設定と環境変数)
- [🖥️ API](#api)
- [🧩 カラーレンダラーワーカー (Docker)](#カラーレンダラーワーカー-docker)
- [🌐 国際化 (i18n)](#国際化-i18n)
- [🧪 テスト](#テスト)
- [📜 開発スクリプト](#開発スクリプト)
- [🗂️ リポジトリ構成](#リポジトリ構成)
- [📚 ドキュメント](#ドキュメント)
- [📄 ライセンス](#ライセンス)
- [🤝 コントリビュート](#コントリビュート)
- [🙏 謝辞](#謝辞)

---

## ✨ 特徴

- **AI によるパレット生成** — 任意のテキストプロンプト（"sunset"、 "retro 80s"、hex コード、雰囲気など）から生成。OpenAI を利用し、モデレーションチェックとプロンプトの安全性を備えています。
- **18 以上の無料カラーツール** — それぞれ専用ページがあります（[ツール](#ツール)を参照）。
- **無料のパブリック API** — パレット、ハーモニー、Pantone、コントラスト、カラーネームなどをカバー（[API](#api) を参照）。
- **クライアント側の永続化** — お気に入り、最近の履歴、保存した色、グラデーション、画像パレットは [VueUse `useStorage`](https://vueuse.org/core/useStorage/) でブラウザに保存されます。アカウント不要です。
- **5 言語対応** — 英語、日本語、イタリア語、スペイン語、フランス語（[@nuxtjs/i18n](https://i18n.nuxtjs.org/) 使用）。
- **知覚的な色彩計算** — パレットのハーモニーは **OKLCH** 色空間で計算されます（`pro-color-harmonies` の移植版。数値パリティハーネスで 1:1 を検証済み）。
- **画像ベースのツール** — 任意の画像から主要色を抽出（サーバー側で `sharp` を使用）、ストック写真の検索、ドラッグ可能なスポイト付きムードパレットの作成。
- **アクセシビリティツール** — WCAG コントラストチェッカー（AA/AAA レベル）、スマートサジェスチョン、色覚異常シミュレーター（プロタノピア、デューテラノピア、トリタノピア、アクロマトプシア）。
- **高精度な参照データ** — Delta-E 2000 による Pantone Solid Coated / Pastels & Neons / Metallics のマッチング、名前付きカラー 14,394 色、ブランドパレット 910 個。
- **Docker 化されたレンダラーワーカー** — Playwright ベースのサービスが*実際にレンダリングされた*Web サイトを分析します（使用色、実際の WCAG テキストコントラスト、スクリーンショット、ダークモード検出）。

---

## 🧰 ツール

各ツールは独立したページです。リンクはライブサイトを指しており、開発環境（`http://localhost:3005`）でもすべて利用できます。

### コア
| ツール | ルート | 説明 |
|---|---|---|
| 🎨 **カラーパレットジェネレーター** | [`/`](https://magikolor.app/) | ホームページ。プロンプト（またはサンプル）を入力すると、AI が名前とタグ付きの 5 色パレットを生成します。 |
| 🔍 **カラーパレットを探索** | [`/palette/explore`](https://magikolor.app/palette/explore) | 公開されている全パレットを閲覧。色・トーン・スタイル・季節のタグでフィルタリング、もっと見る／タグページ。 |
| ⭐ **お気に入り** | [`/favorites`](https://magikolor.app/favorites) | 保存したパレット、保存した色、画像パレットをブラウザに永続化。 |
| 🕐 **最近のパレット** | [`/recent`](https://magikolor.app/recent) | 最近作成したパレットと色をブラウザに保存。 |

### ジェネレーターとエディター
| ツール | ルート | 説明 |
|---|---|---|
| 🎛️ **パレットメーカー** | [`/palette-maker`](https://magikolor.app/palette-maker) | 手作業でカスタムパレットを作成：ハーモニーモード、色の追加/削除/固定、ドラッグで並べ替え、元に戻す/やり直す、ティント＆シェード情報、お気に入りに保存。 |
| 🧮 **カラーパレットクリエーター** | [`/color-palette-creator`](https://magikolor.app/color-palette-creator) | 1 つのベースカラーから配色スキームを生成：6 種類のハーモニー × 4 スタイル、クリエイティブなモディファイア、すべて知覚的な OKLCH 空間で計算。PNG/PDF/ASE 出力対応。 |
| 🌈 **グラデーションジェネレーター** | [`/gradient-generator`](https://magikolor.app/gradient-generator) | リニア/ラジアル/コニックの CSS グラデーションを完全なストップ制御で作成。CSS コピー、Tailwind 設定や JSON の出力、グラデーション保存。 |
| 📊 **グラデーションパレット** | [`/gradient-palette`](https://magikolor.app/gradient-palette) | 2 色間を補間してパレットを作成（2〜10 ステップ）。HEX/CSS 変数/グラデーションをコピー、PNG/JSON/ASE 出力、お気に入り保存。 |
| 🎲 **ランダムカラージェネレーター** | [`/random-color`](https://magikolor.app/random-color) | クリック（またはスペースバー）だけで新しいランダムカラー。 |

### 色の参照と分析
| ツール | ルート | 説明 |
|---|---|---|
| 🗂️ **オールカラー** | [`/all-colors`](https://magikolor.app/all-colors) | 任意の色を全カラーモデルで表示し、ティント＆シェードを生成。最も近い **Pantone** インクの代替色（ΔE 2000）も検索。 |
| 🌈 **個別カラーを探索** | [`/explore/colors`](https://magikolor.app/explore/colors) | 数千の名前付きカラーを閲覧。名前または hex で検索し、ワンクリックでコピー。 |
| 🏷️ **ブランドカラー** | [`/brand-colors`](https://magikolor.app/brand-colors) | 有名ブランドのパレット 910 個（2,754 色）を検索・ワンクリックコピー・ブランドリンク付きで提供。 |
| 🧴 **肌の色カラーパレット** | [`/skin-tone-palette`](https://magikolor.app/skin-tone-palette) | 6 グループ 48 色の肌トーン hex コード。ポーセリン〜ディープまで、クール/ニュートラル/ウォーム/ゴールデン/オリーブ/レッドのアンダートーン別。 |
| 🔄 **補色カラー** | [`/complementary-color`](https://magikolor.app/complementary-color) | カラーホイール上の正確な反対色（色相 +180°）。HEX、名前、コピー付き。 |

### 画像ツール
| ツール | ルート | 説明 |
|---|---|---|
| 🖼️ **画像カラーピッカー** | [`/image-color-picker`](https://magikolor.app/image-color-picker) | 画像をアップロード（または URL を貼り付け）して、AI 支援の順序付けで主要色を抽出。画像と一緒に保存されます。 |
| 🎭 **ムードパレット** | [`/mood-palette`](https://magikolor.app/mood-palette) | 任意の画像からパレットを作成：ドラッグ可能なスポイト、手動または AI ハーモニーによる調整、ストック写真検索、書き出し（コラージュ、PDF、カラーカード）。 |

### アクセシビリティとユーティリティ
| ツール | ルート | 説明 |
|---|---|---|
| ☀️ **コントラストチェッカー** | [`/contrast-checker`](https://magikolor.app/contrast-checker) | 通常/大テキスト・UI コンポーネントの AA/AAA バッジ付き WCAG コントラスト比、視覚シミュレーター、アクセシブルなスマートサジェスチョン、PDF 出力。 |
| 🧪 **カラートークン抽出** | [`/color-token-extractor`](https://magikolor.app/color-token-extractor) | 任意の Web サイトから CSS カラートークンを抽出。任意で*レンダリング*分析（実際に使われた色 + WCAG テキストコントラスト + スクリーンショット + ダークモード）を Docker レンダラーワーカー経由で実行。JSON、CSS、Tailwind 設定としてコピー可能。 |
| 🎨 **カラーミキサー** | [`/color-mixer`](https://magikolor.app/color-mixer) | 減法混色 **RYB** ペイントモデルで 2 色をリアルタイムに混色。HSL/RGB リニアのバリエーションとプリセット混色も搭載。 |

> さらに多くのツールを開発中です。サイドバーには今後のツール（*近日公開* と表示）も掲載されています。

---

## 🛠️ 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | [Nuxt 3](https://nuxt.com)（`3.13.2`）+ Nitro サーバーエンジン |
| 言語 | TypeScript（`5.6`）、strict Vue SFC |
| UI | [Nuxt UI](https://ui.nuxt.com)（`2.18.7`）+ [Nuxt UI Pro](https://ui.nuxt.com/pro)（`1.4.4`）、Tailwind CSS |
| 状態管理 / データ取得 | [@tanstack/vue-query](https://github.com/TanStack/query)（`5.56`） |
| サーバー側バリデーション | [@sinclair/typebox](https://github.com/sinclairzx81/typebox) + AJV。クライアントのフォームは [yup](https://github.com/jquense/yup) |
| データベース | [MongoDB](https://www.mongodb.com)（公式 `mongodb` ドライバー `6.9`）— Docker で Mongo 7.0 |
| AI | [OpenAI Node SDK](https://github.com/openai/openai-node)（`4.65`） |
| 画像処理 | [sharp](https://sharp.pixelplumbing.com)（`0.33`） |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/)（`8.5`） |
| アナリティクス | [Plausible](https://plausible.io)（`@nuxtjs/plausible`） |
| フォント | `@nuxtjs/google-fonts` による Inter |
| ロギング | [pino](https://getpino.io) + `pino-pretty` |
| カラーピッカー | `@ckpack/vue-color` |
| HTTP（データスクリプト） | `got` |
| ユーティリティ | `@vueuse/core`、`@apideck/better-ajv-errors`、`@types/twitter-text` |
| Lint | ESLint（`eslint-config-standard-with-typescript` + Vue プラグイン） |

> **注**: `@nuxt/ui-pro` はアイコンパッケージをプライベートな FontAwesome レジストリから取得します。認証トークンはすでに [`.npmrc`](./.npmrc) に設定されています。

---

## 🏗️ アーキテクチャ: Nuxt レイヤー

Magikolor は Nuxt 標準の**レイヤーシステム**を採用しており、アプリの各ドメインが [`layers/`](./layers) 配下の独立したディレクトリに分離されています。各レイヤーは独自の `nuxt.config.ts`、ページ、コンポーネント、composables、ユーティリティ、そして（必要な場合は）Nitro サーバーモジュールを持ちます。

### サーバーモジュールのパターン

サーバー側では、状態を必要とする各レイヤーが**モジュールファクトリー**（例: [`palette.module.ts`](./layers/palette/server/palette.module.ts)）を公開し、サービスとリポジトリを含む小さなオブジェクトを返します。これらのファクトリーは、サーバー起動時に一度だけ実行される中央セットアップユーティリティ [`layers/setup/server/utils/setup.util.ts`](./layers/setup/server/utils/setup.util.ts)（Nitro プラグイン [`setup.plugin.ts`](./layers/setup/server/plugins/setup.plugin.ts) 経由）で接続されます:

1. `pino` ロガーが作成されます。
2. MongoDB に接続します（`MONGO_URL` から設定）。
3. モジュールが依存関係を注入されてインスタンス化されます（OpenAI → AI → Palette → OG、Feedback）。
4. `palette.setup()` がインデックス/コレクションの存在を保証します。
5. `modules` グローバルが `getModules()` を通じてすべての API ハンドラーで利用可能になります — サーバー起動中（例: 起動時に Mongo がダウンしていた場合）はクリーンな **503** を返します。

API ハンドラーは各レイヤーのプレーンな Nitro ルートファイルです。例: `layers/palette/server/api/palette/create.ts` → `POST /api/palette/create`。

### レイヤーリファレンス

| レイヤー | 役割 |
|---|---|
| `setup` | サーバーブートストラップ: Mongo への接続、全モジュールの配線、`getModules()` の公開。 |
| `mongo` | MongoDB クライアント + 接続文字列の設定。 |
| `openai` | OpenAI クライアント/サービス（現在唯一のプロバイダー）。 |
| `ai` | 汎用 AI サービス: モデレーションチェック + プロンプト実行。 |
| `log` | `pino` ロガーの設定。 |
| `common` | 共有コンポーネント（ナビ、フッター、言語切り替え、空状態、色覚シミュレーター…）、composables（`useFavorites`、`useNotifications`、`useModalV2`…）、純粋なカラー ユーティリティ（変換、コントラスト、言語、サンプル）。 |
| `palette` | コアドメイン: パレットのエンティティ/リポジトリ/サービス/バリデーション、パレット API、タグとフィルター、色の並べ替え、パレットページ（`/palette/explore`、`/palette/[id]`）。 |
| `og` | パレットとタググリッドの OpenGraph PNG 画像生成。 |
| `feedback` | フィードバック/問い合わせの永続化。 |
| `plausible` | アナリティクスのラッパーモジュール。 |
| `random-color` | ランダムカラーページ + `/api/random-color`。 |
| `contrast-checker` | コントラストツール: WCAG 比率、視覚シミュレーション、サジェスチョン、アクセシブルなパレット + `/api/contrast-checker`。 |
| `color-mixer` | RYB ペイントミキサーページ + ユーティリティ。 |
| `all-colors` | オールカラーページ: カラーフォーマット、ティント/シェード、Pantone データセットのマッチング + `/api/pantone`、`/api/color-name`。 |
| `color-palette-creator` | OKLCH ハーモニージェネレーター（`pro-color-harmonies` の移植版）、パレット書き出し（PNG/PDF/ASE）+ `/api/harmonies`。 |
| `gradient-generator` | CSS グラデーションビルダー + 書き出し + 保存したグラデーション。 |
| `gradient-palette` | 2 色間の補間パレット + 書き出し。 |
| `palette-maker` | 履歴付き手動パレットエディター + お気に入り連携。 |
| `brand-colors` | ブランドカラーデータセットのページ。 |
| `skin-tone-palette` | 肌トーンリファレンスページ。 |
| `complementary-color` | 補色ページ。 |
| `image-color-picker` | 画像アップロード/URL → 主要色（`sharp`）+ `/api/image-color-picker`、`/api/image-url`。 |
| `mood-palette` | 画像からパレットを作るスタジオ: スポイト、ストック検索 + `/api/stock-search`。 |
| `color-token-extractor` | CSS トークン抽出（フェーズ 1）+ レンダリング分析プロキシ（フェーズ 2）+ `/api/color-token-extractor`、`/api/color-token-extractor/runtime`。 |
| `explore` | 探索ページ: カラー、グラデーション、画像パレット。 |

---

## 🚀 はじめに

### 前提条件

- **Node.js 18+**（レンダラーワーカーは **Node 20+** が必要。22 で開発）
- **Docker Desktop**（MongoDB とレンダラーワーカー用）
- **npm**（`package-lock.json` 参照）

### 1. サービスを起動する

Magikolor の全パレットは MongoDB に保存されます。`compose.yml` は**2 つ**のサービスを起動します:

```bash
docker compose up -d
```

| サービス | イメージ / build | ポート | 目的 |
|---|---|---|---|
| `database` | `mongo:7.0` | `27018:27017` | MongoDB。ユーザー `magikolor` / パスワード `secret`、データベース `magikolor`。 |
| `renderer` | `./workers/color-renderer`（Playwright） | `3100:3100` | カラートークン抽出の*レンダリング分析*に使うヘッドレス Chromium ワーカー（任意 — それ以外のアプリはなくても動作）。 |

> Mongo のデータは Docker ボリュームに保存されるため、`down` 後の `docker compose up -d` でもデータは保持されます。詳細は [mongo レイヤー](./layers/mongo/server/mongo.module.ts) と [`scripts/README.md`](./scripts/README.md) を参照してください。

### 2. `.env` を作成する

プロジェクトルートに `.env` ファイルを作成します。AI 機能に必要なのは OpenAI キーのみです:

```env
# AI パレット作成にのみ必要 (/api/palette/create、/api/palette/clone)
OPENAI_API_KEY=sk-...

# オプション — デフォルト値を表示
MONGO_URL=mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin
SITE_URL=http://localhost:3005
LOG_LEVEL=debug
RENDERER_URL=http://localhost:3100
```

### 3. 依存関係をインストールする

```bash
npm install
```

### 4. ローカルで実行する

```bash
npm run dev
```

開発サーバーは **`http://localhost:3005`** で起動します。プリフライトスクリプト（[`scripts/check-dev-port.mjs`](./scripts/check-dev-port.mjs)）が起動前にポートが空いていることを確認するため、Nuxt が別のポートに静かにフォールバックすることはありません。

その他の一般的なコマンド:

```bash
npm run build        # 本番ビルド (nuxt build)
npm run generate     # 静的生成 (nuxt generate)
npm run preview      # ビルド済みアプリのプレビュー
npm run start        # ビルド出力を配信 (node .output/server/index.mjs)
npm run typecheck    # nuxi typecheck (vue-tsc + tsc)
```

### 5. データベースにシードする（任意だが推奨）

同梱の約 17,400 個のパレットをローカルデータベースに入れて `/palette/explore` にコンテンツを用意する場合:

```bash
node scripts/import-palettes.mjs   # colorpalettes.json を読み込み (REPLACE モード。--keep で追記)
node scripts/migrate-tags.mjs      # タグを小文字化 + Monochrome → monochromatic (冪等)
```

全リストは [開発スクリプト](#開発スクリプト) を参照してください。

---

## ⚙️ 設定と環境変数

| 変数 | デフォルト | 使用箇所 | 説明 |
|---|---|---|---|
| `OPENAI_API_KEY` | *(空)* | `openai` レイヤー | AI パレット生成に必要（`/api/palette/create`、`/api/palette/clone`）。ない場合、これらのエンドポイントは 401 を返します。 |
| `MONGO_URL` | `mongodb://magikolor:secret@localhost:27018/magikolor?authSource=admin` | `mongo` レイヤー | MongoDB 接続文字列（Docker Compose サービスと一致）。 |
| `SITE_URL` | `http://localhost:3005` | ルート設定 | サイトの公開 URL。公開 `apiUrl`（→ `{SITE_URL}/api`）と i18n の `baseUrl` を生成。 |
| `LOG_LEVEL` | `debug` | `log` レイヤー | `pino` のログレベル。 |
| `RENDERER_URL` | `http://localhost:3100` | ルート設定 | カラーレンダラーワーカー（Docker）の URL。 |
| `PALETTE_COLLECTION_NAME` | `palettes` | `palette` レイヤー | パレット用の MongoDB コレクション。 |
| `PALLETTE_AI_NAMES_START_DATE_MS` | `1729116912549` | `palette` レイヤー | シードされたパレットの `createdAt` 日付を配分するために使うタイムスタンプ。 |
| `FEEDBACK_COLLECTION_NAME` | `feedback` | `feedback` レイヤー | フィードバック用の MongoDB コレクション。 |
| `UNSPLASH_ACCESS_KEY` | *(空)* | `mood-palette` | ストック写真検索用の Unsplash API キー（なければサンプル画像にフォールバック）。 |
| `PEXELS_API_KEY` | *(空)* | `mood-palette` | Pexels の API キー（任意のプロバイダー）。 |
| `PIXABAY_API_KEY` | *(空)* | `mood-palette` | Pixabay の API キー（任意のプロバイダー）。 |
| `PORT` | — | Nuxt/Nitro | `npm start` / `npm run preview` / 素の `nuxt dev` のリッスンポート。**注**: `dev` スクリプトは `--port 3005` をハードコードしており CLI フラグが優先されるため、`PORT` は `npm run dev` に影響しません。 |

### レンダラーワーカーの環境変数（`compose.yml` 内）

| 変数 | デフォルト | 説明 |
|---|---|---|
| `PORT` | `3100` | ワーカーがリッスンする HTTP ポート。 |
| `MAX_CONCURRENCY` | `3` | 同時レンダリングジョブの最大数。 |
| `JOB_TIMEOUT_MS` | `20000` | ジョブごとのタイムアウト（20 秒）。 |
| `CACHE_TTL_MS` | `3600000` | 結果キャッシュの TTL（1 時間、200 URL の LRU）。 |
| `SCREENSHOT_CACHE_MAX` | `50` | キャッシュするスクリーンショットの最大数（別の小さい LRU）。 |

---

## 🖥️ API

Magikolor は**無料のパブリック API**を提供しています（ローカルでは認証なし）。特に記載がなければ全エンドポイントが JSON を返します。リクエストボディは `@sinclair/typebox` で実行時バリデーションされます（スキーマは各レイヤーの `server/dtos/` にあります）。

> ⚠️ **注意**: パブリック API は予告なくいつでも削除・変更される場合があります。自己責任でご利用ください。

### エンドポイント一覧

| メソッド | ルート | 説明 | AI が必要? |
|---|---|---|---|
| `GET` | `/api/palette/{id}` | MongoDB の id でパレットを取得 | — |
| `POST` | `/api/palette/list` | ページングされたパレット一覧（タグフィルター任意） | — |
| `POST` | `/api/palette/create` | テキストプロンプトから AI パレットを生成 | ✅ |
| `POST` | `/api/palette/clone` | 新しい色でパレットをクローン | ✅ |
| `GET` | `/api/palette/count` | 直近 24 時間に作成されたパレット数（5 分キャッシュ） | — |
| `GET` | `/api/og/get` | パレットの OpenGraph PNG | — |
| `GET` | `/api/og/tag` | タグの OpenGraph PNG グリッド | — |
| `POST` | `/api/feedback/create` | フィードバックを送信 | — |
| `GET` | `/api/random-color` | ランダムカラー（HEX + RGB） | — |
| `GET` | `/api/contrast-checker` | 2 色間の WCAG コントラスト比 | — |
| `GET` | `/api/color-mixer` | 2 色の混色（HSL + RGB リニア） | — |
| `POST` | `/api/image-color-picker` | base64 画像から主要色を抽出（`sharp`） | — |
| `GET` | `/api/image-url` | 画像 URL → base64 data URL プロキシ（SSRF ガード付き） | — |
| `GET` | `/api/harmonies` | OKLCH ハーモニーパレット生成（カラーパレットクリエーターと 1:1） | — |
| `GET` | `/api/pantone` | Pantone データセット検索: hex（ΔE 2000）、コード、テキスト | — |
| `GET` | `/api/color-name` | 14,394 語の辞書から最も近いカラーネーム | — |
| `POST` | `/api/color-token-extractor` | Web サイトから CSS カラートークンを抽出（フェーズ 1） | — |
| `POST` | `/api/color-token-extractor/runtime` | レンダリングページ分析: 使用パレット、WCAG テキストコントラスト、スクリーンショット、ダークモード（フェーズ 2 — Docker レンダラーワーカーが必要） | — |
| `GET` | `/api/stock-search` | ストック写真検索（Unsplash/Pexels/Pixabay） | — |

### ドキュメントと例

- **インタラクティブなリファレンス**: 実行中のアプリの `/api` ページに各エンドポイントとパラメータが一覧表示されます。
- **完全な技術リファレンス**（リクエスト/レスポンスの形式、WCAG のしきい値、エラーコード、PowerShell の例）: [`docs/API.md`](./docs/API.md) を参照。

---

## 🧩 カラーレンダラーワーカー (Docker)

**カラートークン抽出**には 2 つのフェーズがあります:

1. **フェーズ 1** — サイトの CSS をサーバー側で解析し、宣言された色のカスタムプロパティを探します（単体で動作）。
2. **フェーズ 2（runtime）** — 別の Docker サービス（[`workers/color-renderer/`](./workers/color-renderer)）が**ヘッドレス Chromium（Playwright）**でページを読み込み、JS の実行を待って以下を報告します:
   - **実際にレンダリングされた**色（`getComputedStyle`）と使用率、
   - *有効な*背景に対して計算された**実際の WCAG テキストコントラスト**、
   - 任意の**スクリーンショット**（JPEG、約 56 KB base64）、
   - 2 回のレンダリング（`light` + `dark`）による**ダークモード検出**。

アーキテクチャの要点: 1 つのブラウザインスタンスにジョブごとに 1 つの分離された `BrowserContext`、セマフォ（最大 3 ジョブ同時実行、キューあり）、ジョブごとの 20 秒タイムアウト、メモリ内 LRU キャッシュ（200 URL / 1 時間 TTL）。ワーカーがオフラインの場合、`/runtime` エンドポイントは 502 を返し、ツールはフェーズ 1 に graceful にフォールバックします。

ワーカーはメインアプリから**意図的に分離**されています — Chromium がクラッシュしてもサイトが落ちることはなく、その重いイメージ（約 3.3 GB）がメインの Docker イメージを汚すこともありません。完全な技術レポート（アーキテクチャ、プール、キャッシュ、SSRF ガード、測定メトリクス、既知の制限）: [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md)。

---

## 🌐 国際化 (i18n)

サイトは 5 つのロケールに完全翻訳されています:

| コード | 言語 | フラグ |
|---|---|---|
| `en` | 英語 | 🇬🇧（デフォルト） |
| `ja` | 日本語 | 🇯🇵 |
| `it` | イタリア語 | 🇮🇹 |
| `es` | スペイン語 | 🇪🇸 |
| `fr` | フランス語 | 🇫🇷 |

- 戦略: `prefix_except_default` — 英語は `/`、その他は `/ja`、`/it`、`/es`、`/fr`。
- すべての翻訳は 1 つのファイルにまとめられています: [`i18n.config.ts`](./i18n.config.ts)。
- 言語切り替えは URL ベース（プレフィックス戦略）で、`CommonLangSwitcher` コンポーネントを使用します。
- **CI で強制されるパリティ**: [`scripts/check-i18n-keys.mjs`](./scripts/check-i18n-keys.mjs) が、各ロケールが `en` と完全に同じキーセットを持つことを検証します（`npm run test:i18n` で実行）。

---

## 🧪 テスト

このプロジェクトにはフレームワークベースのテストランナーはなく、Node 標準のタイプストリッピング（`--experimental-strip-types`）で実行する専用の Node スクリプトでテストします。

```bash
npm test   # 以下すべてを実行
```

| コマンド | 検証内容 |
|---|---|
| `npm run test:parity` | OKLCH パレットジェネレーターとオリジナルの `pro-color-harmonies` v0.11.0 ライブラリの数値パリティ（成分ごとの `l, c, h`、許容差 0.0005、2,424 組み合わせ）。参照コピーは [`layers/color-palette-creator/utils/__tests__/reference/`](./layers/color-palette-creator/utils/__tests__/reference/) にあります。 |
| `npm run test:unit` | 純粋なカラーユーティリティ: 正規コンバーター、WCAG コントラスト、RYB 混色、グラデーションビルダー、カラーフォーマット、Pantone マッチャー、色覚異常シミュレーション。 |
| `npm run test:i18n` | 5 言語間のロケールキーパリティ（上記参照）。 |
| `npm run test:favorites` | `useFavorites` の永続化パターン（VueUse `useStorage`）。 |
| `npm run test:image-palettes` | `useImagePalettes` composable（画像と一緒に保存されるパレット）。 |
| `npm run test:token-extractor` | CSS Color 4 パーサー + デザイントークン抽出（フェーズ 1）。 |
| `npm run test:renderer` | レンダラーワーカーの純粋ロジック（`workers/color-renderer/lib.mjs`）。 |

さらに:

- `npm run typecheck` — TypeScript + Vue の完全な型チェック（`nuxi typecheck`）。
- ESLint は設定済み（`eslint-config-standard-with-typescript` + Vue プラグイン）ですが、専用の npm スクリプトはまだありません。

---

## 📜 開発スクリプト

[`scripts/`](./scripts/) 配下のユーティリティスクリプトは、データのシード、マイグレーション、ツール用です。ほとんどは冪等です（2 回実行しても安全）。詳細: [`scripts/README.md`](./scripts/README.md)。

| スクリプト | 目的 |
|---|---|
| `scripts/import-palettes.mjs` | 同梱の約 17,400 個のパレットを `colorpalettes.json` から `db.palettes` にインポート（デフォルトで REPLACE。`--keep` で追記、`--dry-run` で検証のみ）。 |
| `scripts/migrate-tags.mjs` | 既存ドキュメントを現在のフィルターシステムに移行: タグを小文字化、`Monochrome` → `monochromatic`。 |
| `scripts/rename-db.mjs` | ローカルデータベースを旧名（`colormagic`/`magicolor`）から `magikolor` に移行。`--dry-run` でプレビュー、`--drop-old-user` で旧ユーザーを削除。 |
| `scripts/generate-color-names.mjs` | `colordatabase.json` + 従来の NTC データセットから `layers/palette/utils/color-names-data.json`（14,394 語）を生成。 |
| `scripts/import-brand-colors.mjs` | 910 ブランドのデータセットを `layers/brand-colors/utils/brand-colors-data.json` に集約（出典: pickcoloronline/brands、ISC ライセンス）。 |
| `scripts/acb-to-json.mjs` | Adobe Color Book（`.acb`）ファイルを JSON にデコード（Pantone Metallics 用）。 |
| `scripts/check-dev-port.mjs` | `npm run dev` の前にポート 3005 が空いていることを確認するプリフライト（[はじめに](#はじめに) を参照）。 |
| `scripts/check-i18n-keys.mjs` | i18n キーパリティチェック（`test:i18n` としても接続）。 |
| `scripts/unit-tests.mjs` | 純粋なカラーユーティリティ用のユニットテストハーネス（`test:unit` でも）。 |

---

## 🗂️ リポジトリ構成

```
.
├── assets/                  # グローバル CSS（タイポグラフィ、アプリ全体のスタイル）
├── icons/                   # ロゴ + アニメーション付き favicon アセット
├── i18n.config.ts           # すべての翻訳 (en/ja/it/es/fr)
├── layers/                  # Nuxt レイヤー — ドメインごとに 1 つ（アーキテクチャ参照）
├── layouts/                 # アプリのレイアウト (default.vue)
├── pages/                   # ルートページ: home, api, favorites, recent, privacy, terms
├── plugins/                 # Vue Query (TanStack) プラグイン
├── public/                  # 静的アセット (favicons, manifest)
├── scripts/                 # データシード、マイグレーション、テストスクリプト
├── tests/                   # テストフィクスチャ (Pantone Metallics ACB 出力)
├── workers/color-renderer/  # Playwright レンダラーワーカー（Docker サービス）
├── app.config.ts            # Nuxt UI アプリ設定（プライマリカラー、ボタン）
├── compose.yml              # MongoDB + レンダラーワーカーのサービス
├── nuxt.config.ts           # メインの Nuxt 設定
├── tailwind.config.ts       # Tailwind テーマ（色、シャドウ、アスペクト比）
├── databases/               # ローカルデータセット: シードパレット、色、Pantone 参照
```

### 同梱データセット

| データセット | 場所 | サイズ |
|---|---|---|
| パレット（シード） | `databases/colorpalettes.json` | 約 17,390 パレット |
| カラーネーム辞書 | `layers/palette/utils/color-names-data.json` | 14,394 語 |
| Pantone ガイド | `layers/all-colors/utils/pantone-data.json` | 3,219 サンプル（Solid Coated、Pastels & Neons、Metallics） |
| ブランドカラー | `layers/brand-colors/utils/brand-colors-data.json` | 910 ブランド / 2,754 色 |

---

## 📚 ドキュメント

[`docs/`](./docs) フォルダには詳細な技術ドキュメントがあります:

| ドキュメント | 内容 |
|---|---|
| [`docs/API.md`](./docs/API.md) | 完全な API リファレンス: 全エンドポイント、DTO、WCAG のしきい値、エラーコード、例。 |
| [`docs/color-renderer-worker.md`](./docs/color-renderer-worker.md) | Playwright レンダラーワーカーの技術レポート（アーキテクチャ、プール、キャッシュ、SSRF ガード、メトリクス、制限、ロードマップ）。 |
| [`docs/design-audit.md`](./docs/design-audit.md) | ページ間のデザイン一貫性監査（タイポグラフィ、ヘッダー、空状態）。 |
| [`docs/palette-parity-report.md`](./docs/palette-parity-report.md) | OKLCH ジェネレーターと `pro-color-harmonies` の数値パリティレポート。 |
| [`docs/informe-pro-color-harmonies-DEFINITIVO.md`](./docs/informe-pro-color-harmonies-DEFINITIVO.md) | `pro-color-harmonies`（ジェネレーターの参照実装）の全ロジックの詳細分析。 |
| [`docs/palette-parity-code-diff.diff`](./docs/palette-parity-code-diff.diff) | 旧実装とパリティ検証済み実装の差分。 |

---

## 📄 ライセンス

Magikolor は [MIT ライセンス](./LICENSE) の下で公開されています。

---

## 🤝 コントリビュート

コントリビューション大歓迎です。おすすめの入り口:

- **修正や新ツールの提案**: アプリ内の提案フォーム（サイドバー → *Suggest an Idea*）または issue を開いてください。
- **ツールの追加**: `layers/` の下に既存のパターン（ページ + コンポーネント + ユーティリティ + 任意の API + 5 ロケールの i18n キー）に沿って新しい Nuxt レイヤーを作成します。
- **翻訳の追加**: キーセットを `en` と完全に一致させてください — `npm run test:i18n` が検証します。
- **規約に従う**: 送信前に `npm run typecheck` と `npm test` を実行してください。

---

## 🙏 謝辞

- **OpenAI** — AI パレット生成を支えています。
- **`pro-color-harmonies`**（meodai、MIT）— OKLCH ハーモニージェネレーターの参照実装。
- **`dembrandt`**（MIT）— CSS トークン抽出の概念的基盤。
- **pickcoloronline/brands**（ISC）— ブランドカラーデータセット。
- **Name that Color (NTC)** — カラーネーム辞書の基盤。
- **Pantone** — *オールカラー*は Pantone ガイドのデータを使用。参照は近似の視覚的推定値（ΔE 2000）であり、Pantone LLC とは提携・承認されていません。

色のコミュニティに ❤️ を込めて。
