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
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=(await caches.keys()).filter(k=>k.startsWith('fishtank-'));
  // Retain the previous asset set for tabs still running the older JavaScript.
  const previous=keys.filter(k=>k!==CACHE).slice(-1)[0];
  await Promise.all(keys.filter(k=>k!==CACHE&&k!==previous).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname==='/version.json')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(event.request.mode==='navigate'){
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);
      try { const fresh=await fetch(event.request,{cache:'no-store',signal:controller.signal}); if(fresh.ok)return fresh; }
      catch {} finally { clearTimeout(timer); }
      // The precached shell and its matching assets remain available offline.
      return (await cache.match('/index.html'))||Response.error();
    }
    const hit=(await cache.match(event.request,{ignoreVary:true}))||(await caches.match(event.request,{ignoreVary:true}));
    return hit||fetch(event.request);
  })());
});`,
);
