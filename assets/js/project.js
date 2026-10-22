/* Renders a single project page: project.html?p=<slug> */
(function () {
  "use strict";
  const { esc, text, filled, isTodo, loadProjects, factsList, loadError } = window.Portfolio;
  const root = document.getElementById("project");
  const slug = new URLSearchParams(location.search).get("p");

  // Accepts a bare YouTube ID or a full youtube.com / youtu.be URL.
  function youtubeId(v) {
    if (!filled(v)) return null;
    const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : /^[\w-]{11}$/.test(v.trim()) ? v.trim() : null;
  }

  // Shows a visible reminder for TODO fields, nothing for empty ones.
  const todoNote = (v, msg) => (isTodo(v) ? `<p class="todo-block">${esc(v)}<br>${esc(msg)}</p>` : "");

  function setMeta(p) {
    const title = `${p.title} · Lorenzo Cattolico`;
    document.title = title;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.setAttribute("content", val); };
    set('meta[name="description"]', p.tagline);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', p.tagline);
    if (filled(p.cover)) set('meta[property="og:image"]', new URL(p.cover, location.href).href);
  }

  function render(p, next) {
    setMeta(p);
    const yt = youtubeId(p.youtube);
    const itch = filled(p.itchEmbed) ? p.itchEmbed : null;
    const links = (p.links || []).filter((l) => filled(l.url));

    const cover = filled(p.cover)
      ? `<div class="p-cover"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" width="1600" height="900" fetchpriority="high"></div>`
      : `<div class="p-cover"><div class="placeholder-media">Cover image goes here</div></div>`;

    const videos = (p.videos || [])
      .map(
        (v) => `<figure>
          <video controls muted playsinline preload="none" poster="${esc(v.poster || "")}">
            <source src="${esc(v.src)}" type="video/mp4">
            Your browser can't play this video. <a href="${esc(v.src)}">Download it</a>.
          </video>
          ${v.caption ? `<figcaption>${esc(v.caption)}</figcaption>` : ""}
        </figure>`
      )
      .join("");

    const gallery = (p.gallery || [])
      .map(
        (g, i) => `<li><button type="button" data-i="${i}" aria-label="Enlarge image: ${esc(g.alt)}">
          <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async" width="600" height="600">
        </button></li>`
      )
      .join("");

    root.innerHTML = `
      <a class="back" href="projects.html">Back to all projects</a>
      <header class="p-hero">
        <h1>${text(p.title)}</h1>
        <p class="project-tagline">${text(p.tagline)}</p>
      </header>
      ${cover}

      <div class="p-body">
        <aside aria-label="Project facts">
          ${factsList(p, ["year", "genre", "engine", "duration", "team", "role"])}
          ${links.length ? `<div class="actions">${links
            .map((l, i) => `<a class="btn ${i === 0 ? "btn-primary" : ""}" href="${esc(l.url)}">${esc(l.label)}</a>`)
            .join("")}</div>` : ""}
        </aside>

        <article class="p-main">
          <h2>Overview</h2>
          <p>${text(p.summary)}</p>

          ${p.contribution?.length ? `<h2>What I built</h2><ul>${p.contribution.map((c) => `<li>${text(c)}</li>`).join("")}</ul>` : ""}

          ${p.challenge ? `<h2>The hard part</h2><p class="challenge">${text(p.challenge)}</p>` : ""}

          ${yt ? `<h2>Trailer</h2>
            <iframe class="embed" src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(p.title)} trailer on YouTube"
              loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
            : todoNote(p.youtube, "Paste the trailer's YouTube ID or link in projects.json, or leave the field empty to hide this.")}

          ${itch ? `<h2>Play in your browser</h2>
            <iframe class="embed embed-itch" src="${esc(itch)}" title="Play ${esc(p.title)} on itch.io" loading="lazy" allowfullscreen></iframe>`
            : todoNote(p.itchEmbed, "Get it from itch.io: your game's Edit page, then Distribute, then Embed game. Leave empty to hide.")}

          ${videos ? `<h2>In motion</h2><div class="media-grid">${videos}</div>` : ""}

          ${gallery ? `<h2>Gallery</h2><ul class="gallery">${gallery}</ul>` : ""}

          ${filled(p.credits) ? `<h2>Credits</h2><p>${esc(p.credits)}</p>` : ""}

          ${p.tags?.length ? `<ul class="tags" aria-label="Tags">${p.tags.map((t) => `<li>${text(t)}</li>`).join("")}</ul>` : ""}

          ${next ? `<h2>Next project</h2><p><a class="btn" href="project.html?p=${encodeURIComponent(next.slug)}">${text(next.title)}</a></p>` : ""}
        </article>
      </div>`;

    wireLightbox(p.gallery || []);
  }

  function wireLightbox(items) {
    const dlg = document.getElementById("lightbox");
    if (!dlg || !dlg.showModal) return;
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-cap");
    root.querySelectorAll(".gallery button").forEach((b) =>
      b.addEventListener("click", () => {
        const g = items[+b.dataset.i];
        img.src = g.src; img.alt = g.alt; cap.textContent = g.alt;
        dlg.showModal();
      })
    );
    document.getElementById("lightbox-close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  loadProjects()
    .then((projects) => {
      const i = projects.findIndex((p) => p.slug === slug);
      if (i < 0) {
        root.innerHTML = `<div class="p-hero"><h1>Project not found</h1>
          <p class="project-tagline">There's no project called "${esc(slug || "")}". It may have been renamed.</p>
          <a class="btn btn-primary" href="projects.html">See all projects</a></div>`;
        document.title = "Project not found · Lorenzo Cattolico";
        return;
      }
      render(projects[i], projects.length > 1 ? projects[(i + 1) % projects.length] : null);
    })
    .catch((err) => { root.innerHTML = loadError(err); });
})();
