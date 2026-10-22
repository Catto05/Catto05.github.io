/* Shared helpers: load projects.json, escape text, highlight TODO placeholders. */
(function () {
  "use strict";

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const isTodo = (s) => typeof s === "string" && /^\s*TODO/i.test(s);

  // Text that starts with "TODO" is wrapped in a highlighted span so it stands out.
  const text = (s) => (isTodo(s) ? `<span class="todo">${esc(s)}</span>` : esc(s));

  // Usable value = non-empty and not a TODO placeholder.
  const filled = (s) => typeof s === "string" && s.trim() !== "" && !isTodo(s);

  async function loadProjects() {
    const res = await fetch("projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`projects.json returned ${res.status}`);
    const all = await res.json();
    return all.filter((p) => !p.hidden);
  }

  function factsList(p, keys) {
    const labels = { genre: "Genre", engine: "Engine", duration: "Duration", team: "Team", role: "My role", year: "Year" };
    return `<dl class="facts">${keys
      .filter((k) => p[k])
      .map((k) => `<dt>${labels[k]}</dt><dd>${text(p[k])}</dd>`)
      .join("")}</dl>`;
  }

  const loadError = (err) =>
    `<p class="notice">Couldn't load projects.json (${esc(err.message)}). If you opened the file directly from disk, start a local server instead: see README.md.</p>`;

  window.Portfolio = { esc, text, filled, isTodo, loadProjects, factsList, loadError };

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
