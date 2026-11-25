// Reservoir service worker. It only shows push notifications and opens the app when one is tapped. It caches nothing.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  if (d.test) {
    e.waitUntil((async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      all.forEach((c) => { try { c.postMessage({ type: "push-ack", id: d.test }); } catch (err) {} });
      await self.registration.showNotification("Reservoir", { body: "Checking notifications", tag: "launch-test", silent: true, icon: "icon-192.png", badge: "icon-192.png" });
      const n = await self.registration.getNotifications({ tag: "launch-test" });
      n.forEach((x) => x.close());
    })());
    return;
  }
  e.waitUntil(self.registration.showNotification(d.title || "Reservoir", {
    body: typeof d.body === "string" ? d.body : "Open Reservoir",
    tag: d.tag || undefined,
    silent: d.silent === true,
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { open: d.open || "notices", box: typeof d.box === "string" ? d.box : "", url: typeof d.url === "string" && d.url.charAt(0) === "/" ? d.url : "" }
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const open = e.notification.data && e.notification.data.open || "notices";
  const box = e.notification.data && e.notification.data.box || "";
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const go = e.notification.data && e.notification.data.url;
    // Weir can be saved as /mail or /weir. Its notices only go to a Weir window, and every other notice to a Reservoir window.
    const appOf = (path) => /^\/(mail|weir)(\/|$|\.)/.test(path) ? "mail" : "main";
    const want = go ? appOf(go.split("?")[0]) : "main";
    for (const c of all) {
      let here = "main";
      try { here = appOf(new URL(c.url).pathname); } catch (err) {}
      if (here !== want) continue;
      try { await c.focus(); c.postMessage({ type: "push-open", open, box }); return; } catch (err) {}
    }
    await self.clients.openWindow(go || "./?open=" + open + (box ? "&box=" + encodeURIComponent(box) : ""));
  })());
});
