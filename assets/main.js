/* ============================================================
   UltimateMine — main.js
   Data, card rendering, listing filters, search overlay, sidebar
   ============================================================ */

/* ---------- Icon SVGs ---------- */
const SVG = {
  crystal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2 L20 8 L12 22 L4 8 Z"/><path d="M4 8 L20 8"/><path d="M12 2 L12 22"/></svg>`,
  pickaxe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21 L13 11"/><path d="M13 11 C13 7 16 4 20 3 C20 7 17 10 13 11 Z"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 L13.5 9 L19.5 10.5 L13.5 12 L12 18 L10.5 12 L4.5 10.5 L10.5 9 Z"/><path d="M19 16 L19.7 18.3 L22 19 L19.7 19.7 L19 22 L18.3 19.7 L16 19 L18.3 18.3 Z"/></svg>`,
  snowflake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 2v20M4 6l16 12M20 6L4 18"/><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3C6.5 3 3 7 3 12c0 4 3 7 6 7 1 0 1.5-.6 1.5-1.5S11 16 12 16h3c3 0 6-2 6-5 0-5-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14" cy="7.5" r="1"/><circle cx="16.5" cy="11" r="1"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 18c-2.5 0-4-1.8-3.5-4-.5-3 2-5.5 5-5 .8-2.2 3.5-3 5.5-2 1.8.8 2.8 2.3 2.8 4 2.2.2 3.7 1.8 3.2 4-.4 1.8-2 3-4 3H6Z"/></svg>`
};

/* ---------- Site Data ---------- */
const MODS_DATA = [
  {
    slug: "crystal-caverns",
    title: "Crystal Caverns",
    description: "Generates breathtaking crystal caves filled with glowing geodes and rare ores beneath your world.",
    category: "World Generation",
    versions: ["1.21", "1.20.6", "1.20.4", "1.20.1"],
    date: "2025-05-12",
    color: "linear-gradient(135deg,#22c55e,#0ea5e9)",
    icon: SVG.crystal
  },
  {
    slug: "swift-tools",
    title: "Swift Tools",
    description: "Quality-of-life tools that speed up mining, crafting, and inventory management without changing balance.",
    category: "Utility",
    versions: ["1.21", "1.20.6", "1.20.4"],
    date: "2025-04-28",
    color: "linear-gradient(135deg,#f59e0b,#ef4444)",
    icon: SVG.pickaxe
  },
  {
    slug: "ambient-overhaul",
    title: "Ambient Overhaul",
    description: "A subtle ambience pack that adds dynamic lighting, atmospheric particles, and richer soundscapes.",
    category: "Graphics",
    versions: ["1.21", "1.20.6", "1.20.4", "1.19.4"],
    date: "2025-03-19",
    color: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    icon: SVG.sparkles
  }
];

const PACKS_DATA = [
  {
    slug: "frostbound",
    title: "Frostbound",
    description: "A frozen-over adventure pack with custom biomes, structures, and a survival-focused progression.",
    category: "Adventure",
    versions: ["1.21", "1.20.6", "1.20.4"],
    date: "2025-05-20",
    color: "linear-gradient(135deg,#38bdf8,#6366f1)",
    icon: SVG.snowflake
  },
  {
    slug: "pixel-realm",
    title: "Pixel Realm",
    description: "A crisp, hand-drawn resource pack that keeps the classic Minecraft feel with a cleaner palette.",
    category: "Resource Pack",
    versions: ["1.21", "1.20.6", "1.20.4", "1.20.1", "1.19.4"],
    date: "2025-04-10",
    color: "linear-gradient(135deg,#ec4899,#8b5cf6)",
    icon: SVG.palette
  },
  {
    slug: "skyblock-elite",
    title: "Skyblock Elite",
    description: "A polished skyblock experience with quests, custom islands, and balanced progression for solo or co-op.",
    category: "Skyblock",
    versions: ["1.21", "1.20.6", "1.20.4"],
    date: "2025-02-22",
    color: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
    icon: SVG.cloud
  }
];

/* ---------- Helpers ---------- */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function cardHTML(item, prefix) {
  const tags = item.versions.slice(0, 3).map(v => `<span class="tag">${escapeHTML(v)}</span>`).join("");
  const extra = item.versions.length > 3
    ? `<span class="tag tag-more">+${item.versions.length - 3}</span>` : "";
  return `
    <a class="card" href="${prefix}${item.slug}/index.html">
      <div class="card-icon" style="--icon-bg:${item.color}" aria-hidden="true">${item.icon}</div>
      <div class="card-body">
        <span class="card-category">${escapeHTML(item.category)}</span>
        <h3 class="card-title">${escapeHTML(item.title)}</h3>
        <p class="card-desc">${escapeHTML(item.description)}</p>
        <div class="card-tags">${tags}${extra}</div>
      </div>
    </a>`;
}

function renderCards(container, items, prefix) {
  if (!container) return;
  container.innerHTML = items.map(i => cardHTML(i, prefix)).join("");
  container.querySelectorAll(".card").forEach((c, i) => {
    c.style.animationDelay = (i * 40) + "ms";
    c.classList.add("fade-up");
  });
}

/* ---------- Homepage ---------- */
function initHome() {
  const byDate = (a, b) => b.date.localeCompare(a.date);
  renderCards(document.getElementById("latestMods"), MODS_DATA.slice().sort(byDate).slice(0, 3), "mods/");
  renderCards(document.getElementById("latestPacks"), PACKS_DATA.slice().sort(byDate).slice(0, 3), "packs/");
}

/* ---------- Listing pages ---------- */
function initListing() {
  const grid = document.querySelector("[data-listing]");
  if (!grid) return;

  const type = grid.dataset.type;              // "mod" | "pack"
  const data = type === "mod" ? MODS_DATA : PACKS_DATA;
  const prefix = grid.dataset.prefix || "";    // "" on listing pages

  const state = { q: "", category: "all", version: "all", sort: "newest", page: 1, perPage: 6 };

  const searchEl   = document.getElementById("listingSearch");
  const categoryEl = document.getElementById("filterCategory");
  const versionEl  = document.getElementById("filterVersion");
  const sortEl     = document.getElementById("sortBy");
  const clearEl    = document.getElementById("clearFilters");
  const noResults  = document.getElementById("noResults");
  const loadMore   = document.getElementById("loadMore");
  const countEl    = document.getElementById("resultCount");

  // Populate filter options from data
  const categories = [...new Set(data.map(i => i.category))].sort();
  const versions = [...new Set(data.flatMap(i => i.versions))].sort().reverse();
  categories.forEach(c => categoryEl.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
  versions.forEach(v => versionEl.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));

  // Prefill search from ?q=
  const params = new URLSearchParams(location.search);
  if (params.get("q")) { state.q = params.get("q"); searchEl.value = state.q; }

  function apply() {
    let items = data.slice();
    if (state.q) {
      const q = state.q.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }
    if (state.category !== "all") items = items.filter(i => i.category === state.category);
    if (state.version !== "all") items = items.filter(i => i.versions.includes(state.version));
    if (state.sort === "newest") items.sort((a, b) => b.date.localeCompare(a.date));
    else if (state.sort === "oldest") items.sort((a, b) => a.date.localeCompare(b.date));
    else if (state.sort === "az") items.sort((a, b) => a.title.localeCompare(b.title));
    else if (state.sort === "za") items.sort((a, b) => b.title.localeCompare(a.title));
    return items;
  }

  function render() {
    const items = apply();
    const shown = items.slice(0, state.page * state.perPage);

    grid.innerHTML = shown.map(i => cardHTML(i, prefix)).join("");
    grid.querySelectorAll(".card").forEach((c, i) => {
      c.style.animationDelay = (i * 40) + "ms";
      c.classList.add("fade-up");
    });

    if (countEl) {
      const noun = type === "mod" ? "mod" : "pack";
      countEl.textContent = items.length + " " + noun + (items.length === 1 ? "" : "s") + " found";
    }
    if (noResults) noResults.hidden = items.length !== 0;
    if (loadMore) loadMore.hidden = shown.length >= items.length;
  }

  searchEl.addEventListener("input", e => { state.q = e.target.value.trim(); state.page = 1; render(); });
  categoryEl.addEventListener("change", e => { state.category = e.target.value; state.page = 1; render(); });
  versionEl.addEventListener("change", e => { state.version = e.target.value; state.page = 1; render(); });
  sortEl.addEventListener("change", e => { state.sort = e.target.value; state.page = 1; render(); });

  clearEl.addEventListener("click", () => {
    state.q = ""; state.category = "all"; state.version = "all"; state.sort = "newest"; state.page = 1;
    searchEl.value = ""; categoryEl.value = "all"; versionEl.value = "all"; sortEl.value = "newest";
    render();
    searchEl.focus();
  });

  loadMore.addEventListener("click", () => { state.page++; render(); });

  render();
}

/* ---------- Global search overlay ---------- */
let openSearchWith = null;

function initSearchOverlay() {
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("searchClose");
  const input = document.getElementById("globalSearchInput");
  const results = document.getElementById("globalSearchResults");
  if (!toggle || !overlay) return;

  const BASE = document.body.dataset.base || "";
  const HINT = '<p class="search-hint">Start typing to search mods and packs.</p>';

  function open() {
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    toggle.setAttribute("aria-expanded", "true");
    setTimeout(() => input.focus(), 40);
  }
  function close() {
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
    input.value = "";
    results.innerHTML = HINT;
  }

  function renderResults() {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = HINT; return; }

    const all = [
      ...MODS_DATA.map(i => ({ ...i, _type: "mod",  _prefix: BASE + "mods/" })),
      ...PACKS_DATA.map(i => ({ ...i, _type: "pack", _prefix: BASE + "packs/" }))
    ];
    const matches = all.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = `<p class="search-hint">No results for "${escapeHTML(input.value)}". Try another keyword.</p>`;
      return;
    }
    results.innerHTML = matches.map(i => `
      <a class="search-result" href="${i._prefix}${i.slug}/index.html">
        <span class="search-result-icon">${i.icon}</span>
        <span class="search-result-body">
          <span class="search-result-title">${escapeHTML(i.title)}</span>
          <span class="search-result-meta">${i._type === "mod" ? "Mod" : "Pack"} · ${escapeHTML(i.category)}</span>
        </span>
      </a>`).join("");
  }

  toggle.addEventListener("click", () => overlay.hidden ? open() : close());
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !overlay.hidden) close();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); overlay.hidden ? open() : close();
    }
  });
  input.addEventListener("input", renderResults);

  // Expose global opener for the hero search
  openSearchWith = (query) => {
    open();
    if (query) { input.value = query; renderResults(); }
  };
}

/* ---------- Hero search ---------- */
function initHeroSearch() {
  const form = document.getElementById("heroSearch");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = document.getElementById("heroSearchInput").value.trim();
    if (typeof openSearchWith === "function") openSearchWith(q);
  });
}

/* ---------- Mobile sidebar ---------- */
function initSidebar() {
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (!toggle || !sidebar) return;

  function open() {
    sidebar.classList.add("open");
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add("no-scroll");
    toggle.setAttribute("aria-expanded", "true");
  }
  function close() {
    sidebar.classList.remove("open");
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => sidebar.classList.contains("open") ? close() : open());
  if (backdrop) backdrop.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  sidebar.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => { if (window.innerWidth < 1024) close(); });
  });
}

/* ---------- Footer year ---------- */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initSidebar();
  initSearchOverlay();
  initHeroSearch();
  initHome();
  initListing();
});
