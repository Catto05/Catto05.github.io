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


  // Brand marks from Simple Icons (CC0).
  const ICONS = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    itch: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.33 0 2.436-1.102 2.436-2.41 0 1.308 1.07 2.41 2.4 2.41 1.328 0 2.362-1.102 2.362-2.41 0 1.308 1.137 2.41 2.466 2.41h.024c1.33 0 2.466-1.102 2.466-2.41 0 1.308 1.034 2.41 2.363 2.41 1.33 0 2.4-1.102 2.4-2.41 0 1.308 1.106 2.41 2.435 2.41C22.78 8.43 24 7.282 24 5.98V4.95c-.02-.62-2.082-2.99-3.13-3.612-3.253-.114-5.508-.134-8.87-.133-3.362 0-7.945.053-8.87.133zm6.376 6.477a2.74 2.74 0 0 1-.468.602c-.5.49-1.19.795-1.947.795a2.786 2.786 0 0 1-1.95-.795c-.182-.178-.32-.37-.446-.59-.127.222-.303.412-.486.59a2.788 2.788 0 0 1-1.95.795c-.092 0-.187-.025-.264-.052-.107 1.113-.152 2.176-.168 2.95v.005l-.006 1.167c.02 2.334-.23 7.564 1.03 8.85 1.952.454 5.545.662 9.15.663 3.605 0 7.198-.21 9.15-.664 1.26-1.284 1.01-6.514 1.03-8.848l-.006-1.167v-.004c-.016-.775-.06-1.838-.168-2.95-.077.026-.172.052-.263.052a2.788 2.788 0 0 1-1.95-.795c-.184-.178-.36-.368-.486-.59-.127.22-.265.412-.447.59a2.786 2.786 0 0 1-1.95.794c-.76 0-1.446-.303-1.948-.793a2.74 2.74 0 0 1-.468-.602 2.738 2.738 0 0 1-.463.602 2.787 2.787 0 0 1-1.95.794h-.16a2.787 2.787 0 0 1-1.95-.793 2.738 2.738 0 0 1-.464-.602zm-2.004 2.59v.002c.795.002 1.5 0 2.373.953.687-.072 1.406-.108 2.125-.107.72 0 1.438.035 2.125.107.873-.953 1.578-.95 2.372-.953.376 0 1.876 0 2.92 2.934l1.123 4.028c.832 2.995-.266 3.068-1.636 3.07-2.03-.075-3.156-1.55-3.156-3.025-1.124.184-2.436.276-3.748.277-1.312 0-2.624-.093-3.748-.277 0 1.475-1.125 2.95-3.156 3.026-1.37-.004-2.468-.077-1.636-3.072l1.122-4.027c1.045-2.934 2.545-2.934 2.92-2.934zM12 12.714c-.002.002-2.14 1.964-2.523 2.662l1.4-.056v1.22c0 .056.56.033 1.123.007.562.026 1.124.05 1.124-.008v-1.22l1.4.055C14.138 14.677 12 12.713 12 12.713z"/></svg>',
  };

  // GitHub and itch.io buttons for a project. withText adds a visible label next to the logo.
  function storeLinks(p, withText) {
    const items = [
      ["github", "GitHub", "Source code on GitHub"],
      ["itch", "itch.io", "Play on itch.io"],
    ].filter(([k]) => filled(p[k]));
    if (!items.length) return "";
    return `<ul class="store-links${withText ? " with-text" : ""}">${items
      .map(([k, short, long]) => `<li><a class="store-link store-${k}" href="${esc(p[k])}" aria-label="${esc(long)}" title="${esc(long)}">${ICONS[k]}${withText ? `<span>${esc(long)}</span>` : ""}</a></li>`)
      .join("")}</ul>`;
  }

  window.Portfolio = { esc, text, filled, isTodo, loadProjects, factsList, loadError, storeLinks };

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
