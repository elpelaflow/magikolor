#!/usr/bin/env node
/**
 * Test del composable useImagePalettes — paletas generadas desde imágenes
 * guardadas JUNTO con la imagen (Image Color Picker & Mood Palette).
 *
 * Uso: node --experimental-strip-types scripts/test-image-palettes.mjs
 *
 * En Node no hay `document`, así que downscaleImageDataUrl devuelve la imagen
 * sin tocar: acá se valida la lógica de guardado/identidad/borrado/orden sin
 * depender del canvas del navegador.
 */
const { useImagePalettes } = await import('../layers/common/composables/useImagePalettes.ts');

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? '✅' : '❌'} ${name}${ok ? '' : ` — ${detail}`}`);
  if (!ok) failures++;
};

const IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
const PALETTE = ['#ff0000', '#00ff00', '#0000ff'];

// ---------- guardar + identidad ----------
{
  const store = useImagePalettes();

  const added = await store.save({ image: IMAGE, colors: PALETTE, source: 'mood-palette' });
  check('save guarda y devuelve true', added === true);
  check('isSaved true tras guardar', store.isSaved(PALETTE) === true);
  const entry = store.saved.value[0];
  check('conserva imagen y source', entry?.image === IMAGE && entry?.source === 'mood-palette');
  check('conserva los colores en orden', entry?.colors.join(',') === PALETTE.join(','));

  const again = await store.save({ image: IMAGE, colors: PALETTE, source: 'mood-palette' });
  check('guardar la misma paleta no duplica (idempotente)', again === false && store.saved.value.length === 1);
}

// ---------- save con colores vacíos ----------
{
  const store = useImagePalettes();
  const ok = await store.save({ image: IMAGE, colors: [], source: 'mood-palette' });
  check('save con colores vacíos devuelve false', ok === false && store.saved.value.length === 0);
}

// ---------- unsave por firma ----------
{
  const store = useImagePalettes();
  await store.save({ image: IMAGE, colors: PALETTE, source: 'image-color-picker' });
  store.unsave(PALETTE);
  check('unsave quita por firma de colores', store.isSaved(PALETTE) === false && store.saved.value.length === 0);
}

// ---------- varias paletas + orden + remove ----------
{
  const store = useImagePalettes();
  const p1 = ['#111111', '#222222', '#333333'];
  const p2 = ['#aaaaaa', '#bbbbbb', '#cccccc'];
  await store.save({ image: IMAGE, colors: p2, source: 'mood-palette' });
  // espera para que createdAt de p1 sea posterior (orden: más nueva primero)
  await new Promise((r) => setTimeout(r, 5));
  await store.save({ image: IMAGE, colors: p1, source: 'mood-palette' });
  check('dos paletas distintas coexisten', store.saved.value.length === 2);
  check('la más nueva aparece primero', store.saved.value[0]?.colors.join(',') === p1.join(','));
  const idToRemove = store.saved.value[1]?.id;
  store.remove(idToRemove);
  check('remove por id quita la entrada', store.saved.value.length === 1);
}

// ---------- isSaved con paletas distintas ----------
{
  const store = useImagePalettes();
  await store.save({ image: IMAGE, colors: PALETTE, source: 'mood-palette' });
  check('isSaved false para otra paleta', store.isSaved(['#111111', '#222222', '#333333']) === false);
}

console.log(failures === 0 ? '\n✅ TODOS LOS CHECKS PASAN' : `\n❌ ${failures} fallaron`);
process.exit(failures === 0 ? 0 : 1);
