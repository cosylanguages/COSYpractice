#!/usr/bin/env node
/**
 * scripts/generate-app-sources.js
 *
 * Derives the master source images used by the native shells from the site logo:
 *
 *   native/capacitor/assets/icon.png        square app icon
 *   native/capacitor/assets/splash.png      light splash (logo on the brand background)
 *   native/capacitor/assets/splash-dark.png dark splash
 *   native/electron/build/icon.png          desktop icon
 *
 * `npx capacitor-assets generate --android --ios` (run from native/capacitor)
 * expands the splash/icon masters into the full platform density sets.
 *
 * Usage: node scripts/generate-app-sources.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'images', 'logo.png');
const CAP_ASSETS = path.join(ROOT, 'native', 'capacitor', 'assets');
const ELEC_BUILD = path.join(ROOT, 'native', 'electron', 'build');

const ICON_SIZE = 1024;
const SPLASH_SIZE = 2732;
const LIGHT_BG = { r: 250, g: 247, b: 242, alpha: 1 };
const DARK_BG = { r: 26, g: 23, b: 20, alpha: 1 };

async function main() {
  if (!fs.existsSync(LOGO)) throw new Error(`Missing source logo: ${LOGO}`);
  fs.mkdirSync(CAP_ASSETS, { recursive: true });
  fs.mkdirSync(ELEC_BUILD, { recursive: true });

  await sharp(LOGO).resize(ICON_SIZE, ICON_SIZE, { fit: 'cover' }).png()
    .toFile(path.join(CAP_ASSETS, 'icon.png'));

  for (const [name, bg] of [['splash.png', LIGHT_BG], ['splash-dark.png', DARK_BG]]) {
    const logo = await sharp(LOGO).resize(640, 640, { fit: 'contain', background: { ...bg, alpha: 0 } }).png().toBuffer();
    await sharp({ create: { width: SPLASH_SIZE, height: SPLASH_SIZE, channels: 4, background: bg } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile(path.join(CAP_ASSETS, name));
  }

  await sharp(LOGO).resize(512, 512, { fit: 'cover' }).png()
    .toFile(path.join(ELEC_BUILD, 'icon.png'));

  console.log('Wrote native/capacitor/assets/{icon,splash,splash-dark}.png and native/electron/build/icon.png.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
