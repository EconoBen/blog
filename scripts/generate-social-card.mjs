import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = async (path, type) => `data:${type};base64,${(await readFile(resolve(root, path))).toString('base64')}`;
const font = await data('node_modules/next/dist/next-devtools/server/font/geist-latin.woff2', 'font/woff2');
const portrait = await data('design/social/grebe-portrait-source-v1.png', 'image/png');
const cover = await data('public/assets/agent-memory-cover-early-release.png', 'image/png');
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><style>
    @font-face { font-family:Geist;src:url(${font});font-weight:100 900; }
    * { box-sizing:border-box; } body { margin:0; }
    .card { position:relative;width:1200px;height:630px;overflow:hidden;background:#f7f2e8;color:#211e1f;font-family:Geist,Arial,sans-serif; }
    .top-rule { position:absolute;left:64px;right:64px;top:52px;height:1px;background:#b8b8a1; }
    .name { position:absolute;left:64px;top:109px;font-size:100px;font-weight:660;letter-spacing:-5.5px;line-height:.99;margin:0; }
    .practice { position:absolute;left:69px;top:337px;font-size:25px;color:#56654f;letter-spacing:-.4px; }
    .book-line { position:absolute;left:67px;top:402px;font-size:25px;line-height:1.2; }
    .book-line strong { display:block;margin-top:7px;font-size:47px;font-weight:560;letter-spacing:-1.7px;color:#176b69; }
    .cover { position:absolute;left:846px;top:105px;width:276px;height:363px;overflow:hidden;transform:rotate(3deg);box-shadow:10px 17px 20px #283e2f26,1px 1px 2px #283e2f40;z-index:2; }
    .cover img { display:block;position:absolute;width:322.26px;height:402.82px;left:-23px;top:-20px;max-width:none; }
    .bird { position:absolute;width:287px;height:287px;object-fit:contain;left:527px;top:267px;z-index:3; }
    .water { position:absolute;left:556px;top:486px;width:610px;height:124px;color:#8ba79a;opacity:.55; }
    .domain { position:absolute;left:68px;bottom:46px;color:#176b69;font-size:21px;font-weight:580;letter-spacing:.7px; }
    .publisher { position:absolute;right:76px;bottom:46px;color:#56654f;font-size:18px; }
  </style><main class="card"><div class="top-rule"></div>
    <h1 class="name">Ben<br>Labaschin</h1>
    <div class="practice">AI engineering &amp; writing</div>
    <div class="book-line">Author of<strong>Agent Memory</strong></div>
    <svg class="water" viewBox="0 0 610 124" fill="none" aria-hidden="true"><path d="M12 49C120 14 338 17 484 50S593 80 609 72" stroke="currentColor" stroke-width="1.2"/><path d="M0 71C93 35 270 31 426 66S579 106 610 94" stroke="currentColor" stroke-width=".8"/><path d="M115 96C210 76 371 78 493 101" stroke="currentColor" stroke-width="1"/></svg>
    <div class="cover"><img src="${cover}" alt="The exact O’Reilly Agent Memory Early Release cover"></div>
    <img class="bird" src="${portrait}" alt="Adult horned grebe portrait">
    <div class="domain">econoben.dev</div><div class="publisher">O’Reilly · Early Release</div>
  </main></html>`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(resolve(root, 'public/social'), { recursive: true });
  const screenshot = await page.screenshot();
  await sharp(screenshot).png({ compressionLevel: 9 }).toFile(resolve(root, 'public/social/ben-labaschin-agent-memory-v2.png'));
  console.log('Created public/social/ben-labaschin-agent-memory-v2.png (1200 × 630)');
} finally {
  await browser.close();
}
