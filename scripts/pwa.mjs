import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = (await readdir("dist", { recursive: true })).filter(
  (f) =>
    /\.(js|css|html|svg|png|woff2|woff|webmanifest)$/.test(f) && f !== "sw.js",
);
const hash = createHash("sha256");
for (const f of files) hash.update(await readFile("dist/" + f));
const cache = "fishtank-" + hash.digest("hex").slice(0, 12);
await writeFile(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(cache)},FILES=${JSON.stringify(files.map((f) => "/" + f))};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fishtank-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname==='/version.json')return;event.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(event.request.mode==='navigate'?'/index.html':event.request,{ignoreVary:true});return hit||fetch(event.request);}));});`,
);
