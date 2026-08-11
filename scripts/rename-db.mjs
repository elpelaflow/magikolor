#!/usr/bin/env node
/**
 * Migra la base local de `magicolor` -> `magikolor` (renameCollection).
 *
 * Contexto: el repo pasó por dos rebrands: `colormagic` -> `magicolor` y ahora
 * `magicolor` -> `magikolor`. La DB local existente se llama `magicolor` con
 * el user root `magicolor:secret` (o `colormagic:secret` si nunca se migró
 * del primer rebrand). Este script la lleva a `magikolor` y crea/actualiza el
 * user root `magikolor`.
 *
 * Uso (desde la raiz del repo):
 *   node scripts/rename-db.mjs              # renombra db + asegura user nuevo
 *   node scripts/rename-db.mjs --dry-run    # solo muestra que haria
 *   node scripts/rename-db.mjs --drop-old-user  # ademas borra el user magicolor
 *   node scripts/rename-db.mjs --uri mongodb://user:pass@host:27018/admin?authSource=admin
 *   MONGO_URI=... node scripts/rename-db.mjs   # o por env (patron de scripts hermanos)
 *
 * Que hace:
 *   1) Conecta a la instancia Mongo local (prueba MONGO_URI / --uri, luego
 *      credenciales NUEVAS, del rebrand anterior y VIEJAS, para funcionar con
 *      el container ya recreado o no).
 *   2) Asegura el user root `magikolor` (password `secret` o MONGO_PASSWORD)
 *      en `admin` — SIEMPRE, incluso si la db ya fue migrada (idempotente).
 *   3) Si la db `magicolor` existe, renombra TODAS sus collections a
 *      `magikolor.<collection>` (Mongo crea la db destino implicitamente).
 *      Si todavía existe `colormagic` (primer rebrand sin migrar), primero la
 *      lleva a `magikolor` también.
 *   4) Opcional (`--drop-old-user`): borra los users viejos.
 *   5) Verifica: listado de collections en `magikolor` + conteo de docs.
 *
 * Idempotente: si ya migraste y lo corres de nuevo no rompe nada (y se puede
 * usar para reparar una migración a medias: p.ej. collections renombradas
 * pero user no creado por un corte).
 *
 * IMPORTANTE — recrear el container DESPUES:
 *   Al correr `docker compose up -d` con el compose nuevo (container
 *   `magikolor_database`), Docker preserva el volumen y los DATOS, pero el
 *   init de Mongo NO vuelve a correr (solo corre con volumen nuevo), asi que
 *   el user `magikolor` lo crea este script. Si en cambio arrancas desde cero
 *   (volumen nuevo), no hay nada que migrar: la db ya nace como `magikolor`.
 */

import { MongoClient } from 'mongodb';

const NEW_DB = 'magikolor';
const OLD_DB = 'magicolor';
const LEGACY_DB = 'colormagic';
const PASSWORD = process.env.MONGO_PASSWORD ?? 'secret';

// Orden de conexion: env explicito > --uri > credenciales nuevas > rebrand anterior > viejas.
const DEFAULT_URIS = [
  `mongodb://${NEW_DB}:${PASSWORD}@localhost:27018/admin?authSource=admin`,
  `mongodb://${OLD_DB}:${PASSWORD}@localhost:27018/admin?authSource=admin`,
  `mongodb://${LEGACY_DB}:${PASSWORD}@localhost:27018/admin?authSource=admin`
];

function die(msg) { console.error('\n[ERROR] ' + msg); process.exit(1); }

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const DROP_OLD_USER = args.has('--drop-old-user');
const uriIdx = process.argv.indexOf('--uri');
const uriFlag = uriIdx > -1 ? process.argv[uriIdx + 1] : undefined;
if (uriIdx > -1 && (typeof uriFlag !== 'string' || !uriFlag.startsWith('mongodb'))) {
  die('El flag --uri necesita un valor tipo mongodb://user:pass@host:27018/admin?authSource=admin');
}

async function tryConnect(uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    return client;
  } catch {
    await client.close().catch(() => {});
    return null;
  }
}

async function connect() {
  const uris = uriFlag ? [uriFlag] : [
    ...(process.env.MONGO_URI ? [process.env.MONGO_URI] : []),
    ...DEFAULT_URIS
  ];
  for (const uri of uris) {
    console.log(`Probando: ${uri.replace(/\/\/[^@]+@/, '//***:***@')}`);
    const client = await tryConnect(uri);
    if (client) return { client };
  }
  die('No pude conectarme a Mongo en localhost:27018. ¿Docker está corriendo?\n' +
      '   Si tu password/user difieren, usá --uri mongodb://user:pass@host:27018/admin?authSource=admin');
}

async function ensureNewUser(admin) {
  const users = await admin.command({ usersInfo: { user: NEW_DB, db: 'admin' } });
  const exists = (users.users ?? []).length > 0;
  console.log(`User '${NEW_DB}' en admin: ${exists ? 'existe (actualizo password/roles)' : 'no existe (lo creo)'}`);
  if (DRY) return;
  if (exists) {
    await admin.command({ updateUser: NEW_DB, pwd: PASSWORD, roles: [{ role: 'root', db: 'admin' }] });
  } else {
    await admin.command({ createUser: NEW_DB, pwd: PASSWORD, roles: [{ role: 'root', db: 'admin' }] });
  }
}

async function dropOldUsers(admin) {
  for (const user of [OLD_DB, LEGACY_DB]) {
    const oldUsers = await admin.command({ usersInfo: { user, db: 'admin' } });
    const exists = (oldUsers.users ?? []).length > 0;
    console.log(`\nUser viejo '${user}': ${exists ? 'lo borro (--drop-old-user)' : 'no existe'}`);
    if (exists && !DRY) await admin.command({ dropUser: user });
  }
}

async function listCollections(client, db) {
  const colls = await client.db(db).listCollections().toArray();
  if (colls.length === 0) {
    console.log(`  db '${db}': sin collections.`);
    return;
  }
  console.log(`  db '${db}':`);
  for (const c of colls) {
    const count = await client.db(db).collection(c.name).countDocuments({});
    console.log(`    ${c.name}: ${count} docs`);
  }
}

async function renameDbCollections(client, admin, fromDb, toDb) {
  const colls = await client.db(fromDb).listCollections().toArray();
  console.log(`\nDb '${fromDb}': ${colls.length} collection(s) a renombrar a '${toDb}'.`);
  for (const c of colls) {
    const from = `${fromDb}.${c.name}`;
    const to = `${toDb}.${c.name}`;
    const count = await client.db(fromDb).collection(c.name).countDocuments({});
    console.log(`  ${from} (${count} docs) -> ${to}`);
    if (!DRY) {
      await admin.command({ renameCollection: from, to, dropTarget: false });
    }
  }
}

async function main() {
  console.log('--- Migrador de DB Magikolor (magicolor -> magikolor) ---');
  console.log(`modo : ${DRY ? 'DRY-RUN (no escribe nada)' : 'EJECUTANDO'}\n`);

  const { client } = await connect();
  try {
    const admin = client.db('admin');

    // 1) Asegurar user root nuevo — SIEMPRE (idempotente, repara migraciones parciales)
    await ensureNewUser(admin);

    // 2) Chequear que dbs viejas existen
    const dbs = (await admin.command({ listDatabases: 1 })).databases.map(d => d.name);

    if (!dbs.includes(OLD_DB) && !dbs.includes(LEGACY_DB)) {
      console.log(`\nNi '${OLD_DB}' ni '${LEGACY_DB}' existen.`);
      if (dbs.includes(NEW_DB)) {
        console.log(`La db '${NEW_DB}' ya existe -> nada que migrar.`);
        await listCollections(client, NEW_DB);
      } else {
        console.log(`La db '${NEW_DB}' tampoco existe. Parece una instancia nueva (sin datos).`);
      }
    } else {
      // 3) Migrar: primero el rebrand anterior (colormagic), luego el actual (magicolor)
      if (dbs.includes(LEGACY_DB)) {
        await renameDbCollections(client, admin, LEGACY_DB, NEW_DB);
      }
      if (dbs.includes(OLD_DB)) {
        await renameDbCollections(client, admin, OLD_DB, NEW_DB);
      }

      // 4) Borrar users viejos (opcional)
      if (DROP_OLD_USER) {
        await dropOldUsers(admin);
      } else {
        console.log(`\nUsers viejos '${OLD_DB}'/'${LEGACY_DB}' se conservan (usá --drop-old-user para borrarlos).`);
      }

      // 5) Verificacion
      console.log('\n--- Verificacion ---');
      await listCollections(client, NEW_DB);
    }

    if (!DRY) console.log('\nListo. La app ya conecta con mongodb://magikolor:secret@localhost:27018/magikolor');
  } catch (e) {
    die(e.message);
  } finally {
    await client.close();
  }
}

main().catch(die);
