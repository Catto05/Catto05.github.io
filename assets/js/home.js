/* Home page: shows the featured projects as a preview of the Projects page. */
(function () {
  "use strict";
  const { esc, text, filled, loadProjects, loadError, storeLinks } = window.Portfolio;
  const list = document.getElementById("featured");
  const count = document.getElementById("project-count");
  if (!list) return;

  loadProjects()
    .then((projects) => {
      if (count) count.textContent = ` (${projects.length})`;
      const featured = projects.filter((p) => p.featured).slice(0, 4);
      const shown = featured.length ? featured : projects.slice(0, 2);
      if (!shown.length) {
        list.innerHTML = `<li class="notice">No projects yet. Add one to projects.json.</li>`;
        return;
      }
      list.innerHTML = shown
        .map((p) => {
          const url = `project.html?p=${encodeURIComponent(p.slug)}`;
          const media = filled(p.cover)
            ? `<img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" width="1600" height="1000" loading="lazy" decoding="async">`
            : `<div class="placeholder-media">Cover image goes here</div>`;
          return `<li class="tile">
            <div class="tile-media">${media}</div>
            <div class="tile-body">
              <h3><a href="${url}">${text(p.title)}</a></h3>
              <p>${text(p.tagline)}</p>
              <div class="tile-foot">
                <p class="tile-meta">${text(p.year)} / ${text(p.engine)}</p>
                ${storeLinks(p, false)}
              </div>
            </div>
          </li>`;
        })
        .join("");
    })
    .catch((err) => { list.innerHTML = `<li>${loadError(err)}</li>`; });
})();
