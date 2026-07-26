// Capture each chapter of the running site via Chrome DevTools Protocol.
// Usage: node scripts/shoot.mjs
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;
const URL = "http://localhost:3000/";
const SECTIONS = [
  "top",
  "undergrad",
  "rudra",
  "cern",
  "samsung",
  "maximl",
  "superfork",
  "cloudflare",
  "now",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--window-size=1400,1000",
  "about:blank",
]);
process.on("exit", () => chrome.kill());

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("no chrome ws");
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
const send = cdp(ws);

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: URL });
await sleep(2500); // hydrate
const LIGHT = !!process.env.LIGHT;
const PFX = LIGHT ? "l_" : "c_";
if (LIGHT)
  await send("Runtime.evaluate", {
    expression: "document.documentElement.classList.add('light')",
  });

// Scroll each section into the REAL viewport so IntersectionObserver fires
// (reveals become visible + on-screen canvases start animating), then shoot.
for (const id of SECTIONS) {
  await send("Runtime.evaluate", {
    expression: `document.getElementById(${JSON.stringify(id)})?.scrollIntoView({behavior:'instant',block:'start'})`,
  });
  await sleep(1800); // reveal transition + canvas animation warm-up
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`/tmp/shots/${PFX}${id}.png`, Buffer.from(shot.data, "base64"));
  console.log(`${PFX}${id}.png`);
}

ws.close();
chrome.kill();
process.exit(0);
