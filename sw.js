const C="threnody-v58";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const req=e.request;
  const isDoc = req.mode==="navigate" || req.destination==="document" || (req.url && req.url.split("?")[0].endsWith(".html"));
  if(isDoc){
    e.respondWith(
      fetch(req,{cache:"no-store"}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{});return r;})
        .catch(()=>caches.match(req,{ignoreSearch:true}).then(m=>m||caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{});return r;}).catch(()=>caches.match(req,{ignoreSearch:true})));
});