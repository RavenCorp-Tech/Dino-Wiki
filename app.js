(() => {
  "use strict";

  const state = {
    dinosaurs: [],
    activePage: "home",
    lastPage: "encyclopedia",
    mapPeriod: "all"
  };

  const dom = {};
  const periodOrder = { triassic: 0, jurassic: 1, cretaceous: 2 };
  let animateObserver = null;
  let timelineObserver = null;
  const timelineVisibility = new Map();

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  const capitalize = (value = "") => value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  const commonName = (dino) => dino?.name?.common || dino?.name?.scientific || "Unknown";
  const scientificName = (dino) => dino?.name?.scientific || "";
  const periodLabel = (period) => DINOBASE?.periods?.[period]?.label || capitalize(period || "unknown");
  const dietLabel = (diet) => capitalize(diet || "unknown");
  const dinoColor = (dino) => dino?.color || "#284231";
  const numberValue = (dino, key) => dino?.measurements?.[key]?.value || 0;
  const measurement = (dino, key) => {
    const item = dino?.measurements?.[key];
    if (!item || typeof item.value !== "number") return { value: "N/A", unit: "", notes: "" };
    return { value: item.value, unit: item.unit || "", notes: item.notes || "" };
  };

  const visualStyle = (dino) => {
    const base = dinoColor(dino);
    return `background: radial-gradient(circle at 30% 20%, ${base}55 0%, transparent 55%), linear-gradient(160deg, ${base} 0%, #0a120a 100%);`;
  };

  const cacheDom = () => {
    dom.navbar = qs("#navbar");
    dom.navLinks = qsa(".nav-link");
    dom.drawerLinks = qsa(".drawer-link");
    dom.navBrand = qs(".nav-brand");
    dom.hamburger = qs("#hamburger");
    dom.navDrawer = qs("#navDrawer");
    dom.searchTrigger = qs("#searchTrigger");
    dom.searchOverlay = qs("#searchOverlay");
    dom.searchInput = qs("#searchInput");
    dom.searchResults = qs("#searchResults");
    dom.searchClose = qs("#searchClose");
    dom.featuredGrid = qs("#featuredGrid");
    dom.tickerContent = qs("#tickerContent");
    dom.dinoGrid = qs("#dinoGrid");
    dom.resultsCount = qs("#resultsCount");
    dom.filterSearch = qs("#filterSearch");
    dom.filterReset = qs("#filterReset");
    dom.sortSelect = qs("#sortSelect");
    dom.gridView = qs("#gridView");
    dom.listView = qs("#listView");
    dom.detailContainer = qs("#detailContainer");
    dom.timelineContent = qs("#timelineContent");
    dom.mapButtons = qsa(".map-filter-btn");
    dom.fossilMarkers = qs("#fossilMarkers");
    dom.mapTooltip = qs("#mapTooltip");
    dom.mapSpeciesList = qs("#mapSpeciesList");
    dom.selector1 = qs("#selector1");
    dom.selector2 = qs("#selector2");
    dom.compareResult = qs("#compareResult");
    dom.compareEmpty = qs("#compareEmpty");
    dom.compareCardsRow = qs("#compareCardsRow");
    dom.compareStatsTable = qs("#compareStatsTable");
    dom.compareWinner = qs("#compareWinner");
    dom.particleCanvas = qs("#particleCanvas");
  };

  const init = () => {
    if (!window.DINOBASE || !Array.isArray(window.DINOBASE.dinosaurs)) {
      console.error("DinoBase data layer is missing.");
      return;
    }

    DINOBASE.reindex?.();
    state.dinosaurs = DINOBASE.dinosaurs.slice();
    cacheDom();

    initNavigation();
    initSearch();
    initHome();
    initEncyclopedia();
    initDetail();
    initTimeline();
    initMap();
    initCompare();
    initParticles();
    initScrollEffects();

    navigateTo(location.hash.replace("#", "") || "home", { skipHash: true, skipScroll: true });
    animateStats();
  };

  const initNavigation = () => {
    [...dom.navLinks, ...dom.drawerLinks].forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(link.dataset.page);
      });
    });

    dom.navBrand?.addEventListener("click", () => navigateTo("home"));
    dom.hamburger?.addEventListener("click", () => {
      dom.hamburger.classList.toggle("open");
      dom.navDrawer?.classList.toggle("open");
    });
    window.addEventListener("hashchange", () => navigateTo(location.hash.replace("#", "") || "home", {
      skipHash: true,
      skipScroll: true
    }));
  };

  const navigateTo = (page, options = {}) => {
    const target = qs(`#page-${page}`);
    if (!target) return;

    qsa(".page").forEach((section) => section.classList.toggle("active", section === target));
    [...dom.navLinks, ...dom.drawerLinks].forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
    });
    dom.navDrawer?.classList.remove("open");
    dom.hamburger?.classList.remove("open");

    state.activePage = page;
    if (!options.skipHash) history.replaceState(null, "", `#${page}`);
    if (!options.skipScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initSearch = () => {
    if (!dom.searchOverlay || !dom.searchInput || !dom.searchTrigger || !dom.searchResults) return;

    const close = () => dom.searchOverlay.classList.remove("active");
    const open = () => {
      dom.searchOverlay.classList.add("active");
      dom.searchInput.value = "";
      renderSearchResults("");
      setTimeout(() => dom.searchInput.focus(), 160);
    };

    dom.searchTrigger.addEventListener("click", open);
    dom.searchClose?.addEventListener("click", close);
    dom.searchOverlay.addEventListener("click", (event) => {
      if (event.target === dom.searchOverlay) close();
    });
    dom.searchInput.addEventListener("input", () => renderSearchResults(dom.searchInput.value));
    dom.searchResults.addEventListener("click", (event) => {
      const item = event.target.closest(".search-result-item[data-id]");
      if (!item) return;
      close();
      openDetail(item.dataset.id);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  };

  const renderSearchResults = (term) => {
    const query = term.trim().toLowerCase();
    const results = (query
      ? state.dinosaurs.filter((dino) => searchableText(dino).includes(query))
      : DINOBASE.getFeatured?.() || state.dinosaurs.slice(0, 8)
    ).slice(0, 8);

    dom.searchResults.innerHTML = results.length ? results.map((dino) => `
      <div class="search-result-item" data-id="${escapeHtml(dino.id)}">
        <span class="search-result-emoji">${escapeHtml(dino.emoji || "")}</span>
        <div>
          <div class="search-result-name">${escapeHtml(commonName(dino))}</div>
          <div class="search-result-sub">${escapeHtml(periodLabel(dino.period))} - ${escapeHtml(dietLabel(dino.diet))}</div>
        </div>
      </div>
    `).join("") : `<div class="search-result-item"><div class="search-result-name">No matches found</div></div>`;
  };

  const searchableText = (dino) => [
    commonName(dino),
    scientificName(dino),
    dino.period,
    dino.diet,
    dino.classification,
    dino.subclassification,
    dino.habitat
  ].filter(Boolean).join(" ").toLowerCase();

  const initHome = () => {
    if (dom.featuredGrid) {
      renderFeatured();
      dom.featuredGrid.addEventListener("click", handleCardClick);
    }

    if (dom.tickerContent && Array.isArray(DINOBASE.facts)) {
      dom.tickerContent.innerHTML = DINOBASE.facts.concat(DINOBASE.facts)
        .map((fact) => `<span class="ticker-item">${escapeHtml(fact)}</span>`)
        .join("");
    }

    updateDietCounts();
  };

  const renderFeatured = () => {
    const featured = (DINOBASE.getFeatured?.() || state.dinosaurs.filter((dino) => dino.featured)).slice(0, 6);
    dom.featuredGrid.innerHTML = featured.map(renderDinoCard).join("");
    revealCards(dom.featuredGrid);
  };

  const initEncyclopedia = () => {
    if (!dom.dinoGrid) return;
    qsa(".filter-sidebar input[type='checkbox']").forEach((input) => input.addEventListener("change", applyFilters));
    dom.filterSearch?.addEventListener("input", applyFilters);
    dom.sortSelect?.addEventListener("change", applyFilters);
    dom.filterReset?.addEventListener("click", resetFilters);
    dom.gridView?.addEventListener("click", () => setViewMode("grid"));
    dom.listView?.addEventListener("click", () => setViewMode("list"));
    dom.dinoGrid.addEventListener("click", handleCardClick);
    updatePeriodCounts();
    renderDinosaurs(state.dinosaurs);
  };

  const getSelectedFilters = () => {
    const selected = { period: new Set(), diet: new Set(), classification: new Set(), size: new Set() };
    qsa(".filter-sidebar input[type='checkbox']:checked").forEach((input) => selected[input.name]?.add(input.value));
    return selected;
  };

  const applyFilters = () => {
    const selected = getSelectedFilters();
    const query = (dom.filterSearch?.value || "").trim().toLowerCase();
    const filtered = state.dinosaurs.filter((dino) => {
      const size = DINOBASE.getSizeCategory?.(dino) || dino?.size?.category;
      return (
        (!selected.period.size || selected.period.has(dino.period)) &&
        (!selected.diet.size || selected.diet.has(dino.diet)) &&
        (!selected.classification.size || selected.classification.has(dino.classification)) &&
        (!selected.size.size || selected.size.has(size)) &&
        (!query || searchableText(dino).includes(query))
      );
    });
    renderDinosaurs(sortDinosaurs(filtered, dom.sortSelect?.value || "name"));
  };

  const sortDinosaurs = (items, key) => {
    const sorted = items.slice();
    const byName = (a, b) => commonName(a).localeCompare(commonName(b));
    if (key === "period") {
      sorted.sort((a, b) => (periodOrder[a.period] ?? 99) - (periodOrder[b.period] ?? 99) || byName(a, b));
    } else if (key === "length") {
      sorted.sort((a, b) => numberValue(b, "length") - numberValue(a, "length") || byName(a, b));
    } else if (key === "weight") {
      sorted.sort((a, b) => numberValue(b, "weight") - numberValue(a, "weight") || byName(a, b));
    } else {
      sorted.sort(byName);
    }
    return sorted;
  };

  const renderDinosaurs = (items = state.dinosaurs) => {
    if (!dom.dinoGrid) return;
    dom.resultsCount && (dom.resultsCount.textContent = `Showing ${items.length} of ${state.dinosaurs.length} species`);
    dom.dinoGrid.innerHTML = items.length
      ? items.map(renderDinoCard).join("")
      : `<div class="dino-empty-state">No species match the current filters.</div>`;
    revealCards(dom.dinoGrid);
  };

  const renderDinoCard = (dino) => `
    <article class="dino-card" data-id="${escapeHtml(dino.id)}">
      <div class="dino-card-visual" style="${visualStyle(dino)}">
        <span class="dino-card-period-tag period-tag-${escapeHtml(dino.period)}">${escapeHtml(periodLabel(dino.period))}</span>
        <span class="dino-card-emoji">${escapeHtml(dino.emoji || "")}</span>
      </div>
      <div class="dino-card-body">
        <div class="dino-card-name">${escapeHtml(commonName(dino))}</div>
        <div class="dino-card-scientific">${escapeHtml(scientificName(dino))}</div>
        <div class="dino-card-stats">
          <span class="dino-stat-pill">Length: ${escapeHtml(DINOBASE.formatLength?.(numberValue(dino, "length")) || "N/A")}</span>
          <span class="dino-stat-pill">Weight: ${escapeHtml(DINOBASE.formatWeight?.(numberValue(dino, "weight")) || "N/A")}</span>
        </div>
        <div class="dino-card-diet diet-${escapeHtml(dino.diet)}">${escapeHtml(dietLabel(dino.diet))}</div>
      </div>
    </article>
  `;

  const revealCards = (root) => {
    qsa(".dino-card", root).forEach((card, index) => {
      const delay = Math.min(index * 35, 245);
      card.style.transitionDelay = `${delay}ms, ${delay}ms, 0ms, 0ms`;
      requestAnimationFrame(() => card.classList.add("is-visible"));
      setTimeout(() => { card.style.transitionDelay = ""; }, delay + 500);
    });
  };

  const handleCardClick = (event) => {
    const card = event.target.closest(".dino-card[data-id]");
    if (card) openDetail(card.dataset.id);
  };

  const openDetail = (id) => {
    const dino = DINOBASE.getById?.(id) || state.dinosaurs.find((item) => item.id === id);
    if (!dino || !dom.detailContainer) return;
    if (state.activePage && state.activePage !== "detail") state.lastPage = state.activePage;
    dom.detailContainer.innerHTML = renderDetail(dino);
    setActiveTab("overview");
    navigateTo("detail");
  };

  const initDetail = () => {
    dom.detailContainer?.addEventListener("click", (event) => {
      const back = event.target.closest(".detail-back");
      const tab = event.target.closest(".detail-tab");
      const relation = event.target.closest(".relation-chip");
      if (back) navigateTo(state.lastPage || "encyclopedia");
      if (tab) setActiveTab(tab.dataset.tab);
      if (relation) openDetail(relation.dataset.id);
    });
  };

  const setActiveTab = (tabName) => {
    qsa(".detail-tab", dom.detailContainer).forEach((tab) => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    qsa(".detail-panel", dom.detailContainer).forEach((panel) => {
      const active = panel.dataset.tab === tabName;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
  };

  const renderDetail = (dino) => {
    const facts = Array.isArray(dino.funFacts) && dino.funFacts.length ? dino.funFacts : dino.facts || [];
    const fossilSites = (dino.fossilLocations || []).map((id) => DINOBASE.fossilSites?.find((site) => site.id === id)).filter(Boolean);
    const discovery = dino.discovery
      ? `${dino.discovery.discoveredBy || "Unknown"} (${dino.discovery.year || "Unknown"}) - ${dino.discovery.location || "Unknown"}`
      : "Discovery details unavailable.";
    const mya = dino.mya?.start && dino.mya?.end ? `${dino.mya.start} - ${dino.mya.end} Mya` : "Unknown";
    const size = capitalize(DINOBASE.getSizeCategory?.(dino) || dino.size?.category || "unknown");

    return `
      <div class="detail-back">Back to ${escapeHtml(capitalize(state.lastPage || "encyclopedia"))}</div>
      <div class="detail-hero">
        <div class="detail-visual" style="${visualStyle(dino)}">
          <span class="dino-card-period-tag period-tag-${escapeHtml(dino.period)}">${escapeHtml(periodLabel(dino.period))}</span>
          <span>${escapeHtml(dino.emoji || "")}</span>
        </div>
        <div class="detail-info">
          <div class="detail-eyebrow">
            <span class="dino-card-diet diet-${escapeHtml(dino.diet)}">${escapeHtml(dietLabel(dino.diet))}</span>
            <span class="dino-card-period-tag period-tag-${escapeHtml(dino.period)}">${escapeHtml(periodLabel(dino.period))}</span>
          </div>
          <div class="detail-name">${escapeHtml(commonName(dino))}</div>
          <div class="detail-scientific">${escapeHtml(scientificName(dino))}</div>
          <div class="detail-pronunciation">${escapeHtml(dino.pronunciation || "Pronunciation unknown")}</div>
          <div class="detail-meaning"><strong>Meaning:</strong> ${escapeHtml(dino.meaningOfName || "Unknown")}</div>
          <div class="detail-meaning"><strong>Period:</strong> ${escapeHtml(periodLabel(dino.period))}${dino.subPeriod ? ` (${escapeHtml(dino.subPeriod)})` : ""}</div>
          <div class="detail-meaning"><strong>Range:</strong> ${escapeHtml(mya)}</div>
        </div>
      </div>
      <div class="detail-tabs" role="tablist">
        ${["overview", "stats", "behavior", "discovery", "facts"].map((tab) => `
          <button class="detail-tab" data-tab="${tab}" role="tab">${capitalize(tab)}</button>
        `).join("")}
      </div>
      <div class="detail-panels">
        <section class="detail-panel" data-tab="overview" role="tabpanel">
          <div class="detail-sections">
            <div class="detail-section">
              <div class="detail-section-title">Overview</div>
              <ul class="detail-kv">
                <li><span class="detail-kv-label">Period</span><span class="detail-kv-value">${escapeHtml(periodLabel(dino.period))}</span></li>
                <li><span class="detail-kv-label">Range</span><span class="detail-kv-value">${escapeHtml(mya)}</span></li>
                <li><span class="detail-kv-label">Diet</span><span class="detail-kv-value">${escapeHtml(dietLabel(dino.diet))}</span></li>
                <li><span class="detail-kv-label">Size</span><span class="detail-kv-value">${escapeHtml(size)}</span></li>
                <li><span class="detail-kv-label">Habitat</span><span class="detail-kv-value">${escapeHtml(dino.habitat || "Habitat details unavailable.")}</span></li>
              </ul>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Classification</div>
              <ul class="detail-kv">
                <li><span class="detail-kv-label">Group</span><span class="detail-kv-value">${escapeHtml(capitalize(dino.classification || "unknown"))}</span></li>
                <li><span class="detail-kv-label">Family</span><span class="detail-kv-value">${escapeHtml(dino.subclassification || "Unknown")}</span></li>
                <li><span class="detail-kv-label">Locomotion</span><span class="detail-kv-value">${escapeHtml(capitalize(dino.locomotion || "unknown"))}</span></li>
                <li><span class="detail-kv-label">Social</span><span class="detail-kv-value">${escapeHtml(dino.socialBehavior || "Unknown")}</span></li>
              </ul>
            </div>
          </div>
        </section>
        <section class="detail-panel" data-tab="stats" role="tabpanel">
          <div class="detail-section">
            <div class="detail-section-title">Measurements</div>
            <div class="detail-stats-grid">
              ${renderStatCard("Length", measurement(dino, "length"))}
              ${renderStatCard("Height", measurement(dino, "height"))}
              ${renderStatCard("Weight", measurement(dino, "weight"))}
              ${renderStatCard("Speed", measurement(dino, "speed"))}
            </div>
          </div>
        </section>
        <section class="detail-panel" data-tab="behavior" role="tabpanel">
          <div class="detail-sections">
            <div class="detail-section"><div class="detail-section-title">Behavior</div><p>${escapeHtml(dino.behavior || "Behavior details unavailable.")}</p></div>
            <div class="detail-section"><div class="detail-section-title">Habitat</div><p>${escapeHtml(dino.habitat || "Habitat details unavailable.")}</p></div>
            <div class="detail-section"><div class="detail-section-title">Social</div><p>${escapeHtml(dino.socialBehavior || "Unknown")}</p></div>
          </div>
        </section>
        <section class="detail-panel" data-tab="discovery" role="tabpanel">
          <div class="detail-sections">
            <div class="detail-section"><div class="detail-section-title">Discovery</div><p>${escapeHtml(discovery)}</p></div>
            <div class="detail-section"><div class="detail-section-title">Fossil Locations</div>${renderFossilSites(fossilSites)}</div>
            <div class="detail-section"><div class="detail-section-title">Notable Specimens</div>${renderSpecimens(dino.notableSpecimens)}</div>
          </div>
        </section>
        <section class="detail-panel" data-tab="facts" role="tabpanel">
          <div class="detail-sections">
            <div class="detail-section"><div class="detail-section-title">Fun Facts</div>${renderFacts(facts)}</div>
            <div class="detail-section"><div class="detail-section-title">Predators</div>${renderRelationChips(dino.predators, "No known predators.")}</div>
            <div class="detail-section"><div class="detail-section-title">Prey</div>${renderRelationChips(dino.prey, "No known prey.")}</div>
          </div>
        </section>
      </div>
    `;
  };

  const renderStatCard = (label, item) => `
    <div class="detail-stat-card">
      <div class="detail-stat-label">${escapeHtml(label)}</div>
      <div class="detail-stat-value">${escapeHtml(item.value)}</div>
      ${item.unit ? `<div class="detail-stat-unit">${escapeHtml(item.unit)}</div>` : ""}
      ${item.notes ? `<div class="detail-stat-notes">${escapeHtml(item.notes)}</div>` : ""}
    </div>
  `;

  const renderFacts = (facts) => facts?.length
    ? `<ul class="fun-facts-list">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>`
    : "<p>No fun facts listed yet.</p>";

  const renderFossilSites = (sites) => sites.length
    ? `<ul class="detail-list">${sites.map((site) => `<li><strong>${escapeHtml(site.name)}</strong><span>${escapeHtml(site.country)}</span></li>`).join("")}</ul>`
    : "<p>No fossil locations listed.</p>";

  const renderSpecimens = (specimens) => specimens?.length
    ? `<div class="specimens-list">${specimens.map((specimen) => `
      <div class="specimen-item">
        <div class="specimen-name">${escapeHtml(specimen.name)}</div>
        <div class="specimen-meta">${escapeHtml(specimen.completeness)} - ${escapeHtml(specimen.location)} (${escapeHtml(specimen.year)})</div>
      </div>
    `).join("")}</div>`
    : "<p>No notable specimens listed.</p>";

  const renderRelationChips = (ids, emptyText) => ids?.length
    ? `<div class="relation-chips">${ids.map((id) => {
      const dino = DINOBASE.getById?.(id);
      return `<span class="relation-chip" data-id="${escapeHtml(id)}">${escapeHtml(dino ? commonName(dino) : capitalize(id.replace(/-/g, " ")))}</span>`;
    }).join("")}</div>`
    : `<p>${escapeHtml(emptyText)}</p>`;

  const initTimeline = () => {
    if (!dom.timelineContent) return;
    renderTimeline();
    dom.timelineContent.addEventListener("click", (event) => {
      const chip = event.target.closest(".timeline-species-chip[data-id]");
      if (chip) openDetail(chip.dataset.id);
    });
  };

  const renderTimeline = () => {
    const keys = (DINOBASE.enums?.periods || Object.keys(DINOBASE.periods || {}))
      .slice()
      .sort((a, b) => (periodOrder[a] ?? 99) - (periodOrder[b] ?? 99));

    dom.timelineContent.innerHTML = keys.map((key) => {
      const period = DINOBASE.periods[key];
      if (!period) return "";
      const dinos = (DINOBASE.getByPeriod?.(key) || state.dinosaurs.filter((dino) => dino.period === key))
        .sort((a, b) => commonName(a).localeCompare(commonName(b)));
      const dates = period.startMya && period.endMya ? `${period.startMya} - ${period.endMya} MYA` : "";
      return `
        <section class="timeline-era ${escapeHtml(key)} animate-in" data-period="${escapeHtml(key)}">
          <div class="timeline-era-header">
            <div class="timeline-era-dot"></div>
            <div class="timeline-era-title">${escapeHtml(period.label)}</div>
            <div class="timeline-era-dates">${escapeHtml(dates)}</div>
          </div>
          <div class="timeline-desc">${escapeHtml(period.description || "")}</div>
          ${renderTimelineEvents(period.keyEvents)}
          <div class="timeline-species">
            <div class="timeline-species-label">Dinosaurs of the ${escapeHtml(period.label)}</div>
            <div class="timeline-species-chips">
              ${dinos.map((dino) => `<div class="timeline-species-chip" data-id="${escapeHtml(dino.id)}"><span>${escapeHtml(dino.emoji || "")}</span><span>${escapeHtml(commonName(dino))}</span></div>`).join("")}
            </div>
          </div>
        </section>
      `;
    }).join("");

    observeAnimateIn(qsa(".animate-in", dom.timelineContent));
    observeTimelineActive(qsa(".timeline-era", dom.timelineContent));
  };

  const renderTimelineEvents = (events = []) => events.length ? `
    <div class="timeline-events">
      ${events.map((event) => `<div class="timeline-event"><div class="event-mya">${escapeHtml(event.mya)} MYA</div><div class="event-text">${escapeHtml(event.event)}</div></div>`).join("")}
    </div>
  ` : "";

  const initMap = () => {
    if (!dom.fossilMarkers) return;
    renderMapMarkers("all");
    dom.mapButtons.forEach((button) => {
      button.addEventListener("click", () => {
        dom.mapButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderMapMarkers(button.dataset.period || "all");
      });
    });
  };

  const renderMapMarkers = (period) => {
    state.mapPeriod = period;
    const sites = (DINOBASE.fossilSites || []).filter((site) => period === "all" || site.period === period);
    dom.fossilMarkers.innerHTML = sites.map((site) => `
      <g class="fossil-marker marker-${escapeHtml(site.period)}" data-site="${escapeHtml(site.id)}" transform="translate(${Number(site.cx) || 0} ${Number(site.cy) || 0})">
        <circle r="12"></circle>
        <circle r="5"></circle>
      </g>
    `).join("");

    qsa(".fossil-marker", dom.fossilMarkers).forEach((marker) => {
      marker.addEventListener("mouseenter", showMapTooltip);
      marker.addEventListener("mouseleave", hideMapTooltip);
      marker.addEventListener("click", () => renderMapSpecies(marker.dataset.site));
    });

    if (dom.mapSpeciesList) {
      dom.mapSpeciesList.innerHTML = `<p class="map-hint">Click a marker to see species found at that location</p>`;
    }
  };

  const siteById = (id) => (DINOBASE.fossilSites || []).find((site) => site.id === id);

  const showMapTooltip = (event) => {
    const site = siteById(event.currentTarget.dataset.site);
    if (!site || !dom.mapTooltip) return;
    dom.mapTooltip.innerHTML = `<strong>${escapeHtml(site.name)}</strong><br>${escapeHtml(site.country)}`;
    dom.mapTooltip.style.display = "block";
    dom.mapTooltip.style.left = `${event.pageX + 14}px`;
    dom.mapTooltip.style.top = `${event.pageY - 20}px`;
  };

  const hideMapTooltip = () => {
    if (dom.mapTooltip) dom.mapTooltip.style.display = "none";
  };

  const renderMapSpecies = (siteId) => {
    const site = siteById(siteId);
    if (!site || !dom.mapSpeciesList) return;
    const species = (site.species || []).map((id) => DINOBASE.getById?.(id)).filter(Boolean);
    dom.mapSpeciesList.innerHTML = `
      <p class="map-hint"><strong>${escapeHtml(site.name)}</strong><br>${escapeHtml(site.country)}</p>
      ${species.length ? species.map((dino) => `
        <div class="timeline-species-chip" data-id="${escapeHtml(dino.id)}">
          <span>${escapeHtml(dino.emoji || "")}</span>
          <span>${escapeHtml(commonName(dino))}</span>
        </div>
      `).join("") : `<p class="map-hint">No species linked to this site yet.</p>`}
    `;
    qsa(".timeline-species-chip[data-id]", dom.mapSpeciesList).forEach((chip) => {
      chip.addEventListener("click", () => openDetail(chip.dataset.id));
    });
  };

  const initCompare = () => {
    if (!dom.selector1 || !dom.selector2) return;
    populateCompareSelectors();
    dom.selector1.addEventListener("change", renderCompare);
    dom.selector2.addEventListener("change", renderCompare);
  };

  const populateCompareSelectors = () => {
    const options = state.dinosaurs
      .slice()
      .sort((a, b) => commonName(a).localeCompare(commonName(b)))
      .map((dino) => `<option value="${escapeHtml(dino.id)}">${escapeHtml(commonName(dino))}</option>`)
      .join("");
    dom.selector1.innerHTML = `<option value="">Choose a dinosaur...</option>${options}`;
    dom.selector2.innerHTML = `<option value="">Choose a dinosaur...</option>${options}`;
  };

  const renderCompare = () => {
    const a = DINOBASE.getById?.(dom.selector1.value);
    const b = DINOBASE.getById?.(dom.selector2.value);
    const ready = Boolean(a && b);
    if (dom.compareResult) dom.compareResult.style.display = ready ? "block" : "none";
    if (dom.compareEmpty) dom.compareEmpty.style.display = ready ? "none" : "block";
    if (!ready) return;

    dom.compareCardsRow.innerHTML = [a, b].map((dino) => `
      <div class="compare-dino-card">
        <div class="compare-dino-emoji">${escapeHtml(dino.emoji || "")}</div>
        <div class="compare-dino-name">${escapeHtml(commonName(dino))}</div>
        <div class="compare-dino-sci">${escapeHtml(scientificName(dino))}</div>
        <div class="dino-card-diet diet-${escapeHtml(dino.diet)}">${escapeHtml(dietLabel(dino.diet))}</div>
      </div>
    `).join("");

    const stats = [
      ["Length", "length", "m"],
      ["Height", "height", "m"],
      ["Weight", "weight", "kg"],
      ["Speed", "speed", "km/h"]
    ];

    dom.compareStatsTable.innerHTML = stats.map(([label, key, unit]) => {
      const av = numberValue(a, key);
      const bv = numberValue(b, key);
      const winner = av === bv ? "" : av > bv ? "a" : "b";
      return `
        <div class="compare-stat-row">
          <div class="compare-stat-a ${winner === "a" ? "compare-stat-winner-a" : ""}">${av || "N/A"} ${av ? unit : ""}</div>
          <div class="compare-stat-label">${label}</div>
          <div class="compare-stat-b ${winner === "b" ? "compare-stat-winner-b" : ""}">${bv || "N/A"} ${bv ? unit : ""}</div>
        </div>
      `;
    }).join("");

    const scoreA = numberValue(a, "length") + numberValue(a, "height") + (numberValue(a, "weight") / 1000) + numberValue(a, "speed");
    const scoreB = numberValue(b, "length") + numberValue(b, "height") + (numberValue(b, "weight") / 1000) + numberValue(b, "speed");
    const bigger = scoreA === scoreB ? "It is a close match." : `${escapeHtml(commonName(scoreA > scoreB ? a : b))} has the stronger overall physical profile.`;
    dom.compareWinner.innerHTML = `<h3>Comparison Summary</h3><p>${bigger}</p>`;
  };

  const resetFilters = () => {
    qsa(".filter-sidebar input[type='checkbox']").forEach((input) => { input.checked = false; });
    if (dom.filterSearch) dom.filterSearch.value = "";
    if (dom.sortSelect) dom.sortSelect.value = "name";
    applyFilters();
  };

  const filterByDiet = (diet) => {
    navigateTo("encyclopedia");
    qsa(".filter-sidebar input[type='checkbox']").forEach((input) => {
      input.checked = input.name === "diet" && input.value === diet;
    });
    if (dom.filterSearch) dom.filterSearch.value = "";
    applyFilters();
  };

  const setViewMode = (mode) => {
    dom.dinoGrid?.classList.toggle("list-view", mode === "list");
    dom.gridView?.classList.toggle("active", mode === "grid");
    dom.listView?.classList.toggle("active", mode === "list");
  };

  const updateDietCounts = () => {
    const counts = { carnivore: 0, herbivore: 0, omnivore: 0, piscivore: 0 };
    state.dinosaurs.forEach((dino) => { if (counts[dino.diet] !== undefined) counts[dino.diet] += 1; });
    Object.entries(counts).forEach(([diet, count]) => {
      const el = qs(`#${diet}Count`);
      if (el) el.textContent = count;
    });
  };

  const updatePeriodCounts = () => {
    qsa(".filter-option input[name='period']").forEach((input) => {
      const count = DINOBASE.getByPeriod?.(input.value).length || state.dinosaurs.filter((dino) => dino.period === input.value).length;
      const label = input.closest(".filter-option")?.querySelector(".filter-count");
      if (label) label.textContent = count || "";
    });
  };

  const animateStats = () => {
    qsa(".stat-number").forEach((stat) => {
      const target = Number(stat.dataset.target || 0);
      if (!target) return;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1100, 1);
        stat.textContent = Math.floor(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const initScrollEffects = () => {
    if (!dom.navbar) return;
    const onScroll = () => dom.navbar.classList.toggle("scrolled", scrollY > 10);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  };

  const observeAnimateIn = (items) => {
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }
    animateObserver ||= new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        animateObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    items.forEach((item) => animateObserver.observe(item));
  };

  const observeTimelineActive = (items) => {
    if (!("IntersectionObserver" in window)) return;
    timelineObserver ||= new IntersectionObserver((entries) => {
      entries.forEach((entry) => timelineVisibility.set(entry.target, entry.intersectionRatio));
      let best = null;
      let bestRatio = 0;
      timelineVisibility.forEach((ratio, item) => {
        if (ratio > bestRatio) {
          best = item;
          bestRatio = ratio;
        }
      });
      qsa(".timeline-era").forEach((era) => era.classList.remove("active"));
      if (best && bestRatio > 0.2) best.classList.add("active");
    }, { threshold: [0, 0.2, 0.4, 0.65] });
    items.forEach((item) => timelineObserver.observe(item));
  };

  const initParticles = () => {
    const canvas = dom.particleCanvas;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: Math.random() * 0.00035 + 0.0001
    }));

    const resize = () => {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
    };
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(233, 203, 143, 0.22)";
      particles.forEach((p) => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy) % 1;
        context.beginPath();
        context.arc(p.x * canvas.width, p.y * canvas.height, p.r * devicePixelRatio, 0, Math.PI * 2);
        context.fill();
      });
      requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    draw();
  };

  window.navigateTo = navigateTo;
  window.filterByDiet = filterByDiet;
  window.openDinoDetail = openDetail;
  window.renderDinosaurs = renderDinosaurs;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
