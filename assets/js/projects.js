/* Projects page: full list of projects from projects.json, with tag filters. */
(function () {
  "use strict";
  const { esc, text, filled, isTodo, loadProjects, factsList, loadError } = window.Portfolio;
  const list = document.getElementById("project-list");
  const filters = document.getElementById("filters");
  const counter = document.getElementById("result-count");
  if (!list) return;

  let all = [];
  let active = new URLSearchParams(location.search).get("tag") || "All";

  function card(p) {
    const url = `project.html?p=${encodeURIComponent(p.slug)}`;
    const media = filled(p.cover)
      ? `<img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" width="1600" height="1000" loading="lazy" decoding="async">`
      : `<div class="placeholder-media">Cover image goes here</div>`;
    const ext = (p.links || []).find((l) => filled(l.url));
    const tags = (p.tags || []).map((t) => `<li>${text(t)}</li>`).join("");

    return `<li>
      <article class="entry" aria-labelledby="t-${esc(p.slug)}">
        <a class="entry-media" href="${url}" tabindex="-1" aria-hidden="true">${media}</a>
        <div class="entry-body">
          <p class="entry-year">${text(p.year)}</p>
          <h2 id="t-${esc(p.slug)}"><a href="${url}">${text(p.title)}</a></h2>
          <p class="entry-tagline">${text(p.tagline)}</p>
          ${factsList(p, ["genre", "engine", "role", "team", "duration"])}
          ${tags ? `<ul class="tags" aria-label="Tags">${tags}</ul>` : ""}
          <div class="actions">
            <a class="btn btn-primary" href="${url}">Open project</a>
            ${ext ? `<a class="btn" href="${esc(ext.url)}">${esc(ext.label)}</a>` : ""}
          </div>
        </div>
      </article>
    </li>`;
  }

  function render() {
    const shown = active === "All" ? all : all.filter((p) => (p.tags || []).includes(active));
    list.innerHTML = shown.length
      ? shown.map(card).join("")
      : `<li class="notice">No projects tagged "${esc(active)}" yet.</li>`;
    if (counter) counter.textContent = `${shown.length} of ${all.length} projects`;
    filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tag === active)));
  }

  function buildFilters() {
    const tags = [...new Set(all.flatMap((p) => p.tags || []))].filter((t) => !isTodo(t));
    if (!tags.includes(active)) active = "All";
    filters.innerHTML = ["All", ...tags]
      .map((t) => `<button type="button" class="filter" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`)
      .join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      active = b.dataset.tag;
      const u = new URL(location.href);
      active === "All" ? u.searchParams.delete("tag") : u.searchParams.set("tag", active);
      history.replaceState(null, "", u);
      render();
    });
  }

  loadProjects()
    .then((projects) => {
      all = projects; // same order as projects.json
      buildFilters();
      render();
    })
    .catch((err) => { list.innerHTML = `<li>${loadError(err)}</li>`; });
})();
