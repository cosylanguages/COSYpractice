#!/usr/bin/env node
'use strict';

const https = require('https');

const URLS = [
  'https://cosylanguages.github.io/COSYlanguages/css/fonts.css',
  'https://cosylanguages.github.io/COSYlanguages/shared/css/tokens.css',
  'https://cosylanguages.github.io/COSYlanguages/css/base.css',
  'https://cosylanguages.github.io/COSYlanguages/css/components.css',
  'https://cosylanguages.github.io/COSYlanguages/css/layout.css',
  'https://cosylanguages.github.io/COSYlanguages/shared/js/cosy-theme.js',
  'https://cosylanguages.github.io/COSYlanguages/css/ecosystem-strip.css',
  'https://cosylanguages.github.io/COSYlanguages/js/ecosystem-strip.js',
  'https://raw.githubusercontent.com/cosylanguages/COSYdata/d7f14f823cc664cdf9986fa85c15e1c07d9c99ac/schemas/themes.json',
  'https://raw.githubusercontent.com/cosylanguages/COSYplatform/72e2ca02a0753527a95fe26014e68b9bd80555d7/reference/grammar/en/lessons/to-be.json'
];

function check(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD', timeout: 15000 }, res => {
      res.resume();
      resolve({ url, status: res.statusCode, location: res.headers.location });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', error => resolve({ url, status: 0, error: error.message }));
    req.end();
  });
}

(async () => {
  const results = await Promise.all(URLS.map(check));
  const failed = results.filter(result => result.status < 200 || result.status >= 400);
  for (const result of results) {
    console.log(`${result.status || 'ERR'} ${result.url}${result.error ? ` (${result.error})` : ''}`);
  }
  if (failed.length) {
    console.error(`\n${failed.length} external reference(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} external references resolve.`);
})();
