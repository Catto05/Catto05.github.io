/* Hero tile grid: move the pointer (or drag a finger) to paint tiles that slowly fade,
   like painting a TileMap in an editor. Purely decorative, hidden from screen readers. */
(function () {
  "use strict";
  const canvas = document.getElementById("tiles");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const CELL = 44;          // tile size in CSS pixels
  const FADE = 0.012;       // how fast painted tiles fade per frame
  const MAX_ALPHA = 0.13;   // stays subtle so the text on top remains readable

  let cols = 0, rows = 0, cells = new Float32Array(0), dpr = 1, raf = 0, rgb = "31,35,38";
  let last = null;

  function readColor() {
    rgb = getComputedStyle(document.documentElement).getPropertyValue("--tile").trim() || rgb;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    const nc = Math.ceil(r.width / CELL), nr = Math.ceil(r.height / CELL);
    if (nc !== cols || nr !== rows) { cols = nc; rows = nr; cells = new Float32Array(cols * rows); }
    draw();
  }

  function draw() {
    const w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // painted tiles
    for (let i = 0; i < cells.length; i++) {
      const a = cells[i];
      if (a <= 0.002) continue;
      const x = (i % cols) * CELL, y = Math.floor(i / cols) * CELL;
      ctx.fillStyle = `rgba(${rgb},${(a * MAX_ALPHA).toFixed(3)})`;
      ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1);
    }
    // grid lines
    ctx.strokeStyle = `rgba(${rgb},0.07)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += CELL) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
    for (let y = 0; y <= h; y += CELL) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
    ctx.stroke();
  }

  function tick() {
    let alive = false;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] > 0) { cells[i] = Math.max(0, cells[i] - FADE); alive = true; }
    }
    draw();
    raf = alive ? requestAnimationFrame(tick) : 0;
  }

  function wake() {
    if (reduce.matches) { draw(); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function paint(cx, cy) {
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
    cells[cy * cols + cx] = 1;
  }

  // paint every tile on the line between two cells, so fast moves don't leave gaps
  function paintLine(a, b) {
    let x0 = a[0], y0 = a[1];
    const x1 = b[0], y1 = b[1];
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (let n = 0; n < 200; n++) {
      paint(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const c = [Math.floor((e.clientX - r.left) / CELL), Math.floor((e.clientY - r.top) / CELL)];
    if (last) paintLine(last, c); else paint(c[0], c[1]);
    last = c;
    wake();
  }

  // listen on the whole hero so the text on top doesn't block painting
  const hero = canvas.parentElement;
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerleave", () => { last = null; });

  // one short opening move: a tile path traced across the grid on load
  function intro() {
    if (reduce.matches) { draw(); return; }
    const y = Math.max(1, Math.floor(rows * 0.3));
    let x = cols - 1, step = 0;
    const id = setInterval(() => {
      paint(x, y + (step % 6 < 3 ? 0 : 1));
      x--; step++; wake();
      if (x < cols * 0.45) clearInterval(id);
    }, 35);
  }

  readColor();
  resize();
  intro();
  window.addEventListener("resize", resize);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { readColor(); draw(); });
})();
