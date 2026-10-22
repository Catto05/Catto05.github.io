# Lorenzo Cattolico · Portfolio

A static portfolio site in plain HTML, CSS and JavaScript. No framework, no build step: what's in this folder is exactly what gets published.

```
index.html            Home: hero + one preview band per page (Projects, About, Contact)
projects.html         Full project list with tag filters
about.html            Bio and skills
contact.html          Email and links (itch.io, GitHub, LinkedIn)
project.html          Single project template (project.html?p=<slug>)
projects.json         ALL project data lives here
404.html              "Page not found"
assets/css/style.css  Styles (colors and fonts at the top, in :root)
assets/js/            common.js, home.js, projects.js, project.js, tiles.js (the hero grid)
assets/img/           Images (WebP), favicon, og-image.jpg for social previews
assets/video/         Gameplay clips (MP4) + poster frames
robots.txt, sitemap.xml, .nojekyll
```

## Preview it on your computer

The pages read `projects.json` with `fetch`, which browsers block when you double-click an HTML file. Start a small local server from this folder instead:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. In VS Code, the "Live Server" extension does the same thing.

## Add or edit a project

Open `projects.json`. Every project is one `{ ... }` block; the order in the file is the order on the site.

1. Copy an existing block, paste it after it, and add a comma between the two blocks.
2. Give it a unique `slug` (lowercase, dashes, no spaces). The page will be `project.html?p=your-slug`. Its tags automatically become filter buttons on the Projects page.
3. Put its images in `assets/img/projects/your-slug/` and its clips in `assets/video/`.
4. Fill in the fields:

| Field | What it's for |
|---|---|
| `hidden` | `true` hides the project everywhere without deleting it |
| `featured` | `true` shows it in the Projects preview on the home page (up to 3) |
| `title`, `tagline` | Name and one-line pitch |
| `year`, `genre`, `engine`, `duration`, `team`, `role` | The facts shown in the list and sidebar |
| `summary` | 2-3 sentences: what the game is |
| `contribution` | List of what *you* built |
| `challenge` | The hardest technical problem and how you solved it |
| `credits`, `tags` | Optional |
| `cover`, `coverAlt` | Cover image (16:10 or 16:9 works best) and its description for screen readers |
| `gallery` | List of `{ "src": "...", "alt": "..." }` |
| `videos` | Short looping clips: list of `{ "src": "assets/gif/x.gif", "poster": "x.webp", "caption": "..." }` |
| `trailer` | `{"youtube": "<ID or link>"}` or a local file `{"src": "assets/video/x.mp4", "poster": "assets/video/x.webp"}`. Empty = hidden |
| `github`, `itch` | Links shown as GitHub and itch.io logo buttons. Empty = hidden |
| `itchEmbed` | Browser build from itch.io. Empty = hidden |
| `links` | Buttons: list of `{ "label": "...", "url": "..." }`. The first one is highlighted |

Any text that starts with `TODO` is shown on the site with a yellow highlight, so you can't miss what's left to fill in. Empty fields are simply not shown.

Check the file is valid JSON (missing commas are the classic mistake) by pasting it into https://jsonlint.com.

### Getting the itch.io embed

On itch.io open your game's **Edit game** page, then **Distribute → Embed game**. Pick a size, copy the `src="..."` URL from the iframe code (it looks like `https://itch.io/embed-upload/1234567?color=333333` for a playable HTML5 build) and paste it into `itchEmbed`. Only HTML5/WebGL builds can be played in the page.

### Image and video tips

- Export images as WebP around 1200-1600 px wide. https://squoosh.app does this in the browser.
- Keep clips short and compressed. With ffmpeg:
  `ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 28 -movflags +faststart -c:a aac -b:a 96k out.mp4`
- Long trailers belong on YouTube, not in the repo.

## Publish on GitHub Pages

You already have the `Catto05/Catto05.github.io` repository with the old Hugo site. Pick one option.

### Option A: replace the old site (recommended, URL stays https://catto05.github.io)

1. Back up the old site: on GitHub, create a branch called `old-hugo-site` from `main` (branch menu → type the name → Create branch).
2. In your local `Catto05.github.io` folder, on `main`, delete everything except the `.git` folder. This includes `.github/workflows/hugo.yaml`, otherwise GitHub will keep trying to build the Hugo site.
3. Copy the contents of this folder (including the hidden `.nojekyll` file) into it.
4. Commit and push:
   ```bash
   git add -A
   git commit -m "New portfolio"
   git push
   ```
5. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, Save.
6. After a minute or two the site is live at https://catto05.github.io.

### Option B: new repository (URL becomes https://catto05.github.io/portfolio)

1. Create a new public repository, e.g. `portfolio`, and push this folder to it.
2. **Settings → Pages → Deploy from a branch → main / (root)**.
3. Update the absolute URLs listed below to `https://catto05.github.io/portfolio/`, and in `404.html` change the `/assets/` paths to `/portfolio/assets/` and `href="/"` to `href="/portfolio/"`.

All other links are relative, so the site works in both setups.

### URLs to update if the address changes

The `<head>` of every HTML page (canonical, og:url, og:image; JSON-LD in `index.html`), `robots.txt`, `sitemap.xml`. When you add a project, add its line to `sitemap.xml` too.

### Custom domain (optional)

Buy a domain, add it in **Settings → Pages → Custom domain**, and follow GitHub's DNS instructions. Then update the URLs above.

## Customising

- **Colors and fonts**: the variables at the top of `assets/css/style.css` (light theme) and the `prefers-color-scheme: dark` block right after (dark theme).
- **After changing CSS or JS**: change the `?v=...` number after `style.css` and the `.js` files in every HTML page (any new value works, e.g. today's date). Browsers then download the new files instead of mixing old and new ones from their cache.
- **Hero grid**: `assets/js/tiles.js`. `CELL` is the tile size, `FADE` how quickly tiles disappear, `MAX_ALPHA` how dark they get.
- **Text** of each page: directly in `index.html`, `about.html` and `contact.html`. The header menu is repeated at the top of every HTML file: if you add a page, add its link to all of them.

## Known limits

- Social networks read the default preview (`assets/img/og-image.jpg`) for every page, including project pages, because the project title is filled in by JavaScript. If you want a custom preview for one project, make a copy of `project.html` with its own `<meta property="og:...">` tags.
- The font (Schibsted Grotesk) loads from Google Fonts. Without it the site falls back to the system font.
  
