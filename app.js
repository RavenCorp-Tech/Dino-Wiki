(() => {
  "use strict";

  const state = {
    dinoList: [],
    activePage: "home",
    lastPage: "encyclopedia"
  };

  const dom = {};
  let animateInObserver = null;
  let timelineActiveObserver = null;
  const timelineVisibility = new Map();

  const periodOrder = {
    triassic: 0,
    jurassic: 1,
    cretaceous: 2
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const capitalize = (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatPeriodLabel = (period) => {
    if (!period) return "Unknown";
    return DINOBASE?.periods?.[period]?.label ?? capitalize(period);
  };

  const formatDietLabel = (diet) => {
    if (!diet) return "Unknown";
    return capitalize(diet);
  };

  const formatMeasurement = (measurement) => {
    if (!measurement || typeof measurement.value !== "number") {
      return { value: "N/A", unit: "", notes: "" };
    }
    return {
      value: measurement.value,
      unit: measurement.unit || "",
      notes: measurement.notes || ""
    };
  };

  const getCommonName = (dino) => dino?.name?.common || dino?.name?.scientific || "Unknown";
  const getScientificName = (dino) => dino?.name?.scientific || "";

  const getDinoColor = (dino) => dino?.color || "#2a2f2a";

  const buildVisualStyle = (dino) => {
    const base = getDinoColor(dino);
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
  };

  const init = () => {
    if (!window.DINOBASE || !Array.isArray(DINOBASE.dinosaurs)) return;

    DINOBASE.reindex?.();
    state.dinoList = DINOBASE.dinosaurs.slice();

    cacheDom();
    initNav();
    initSearch();
    initHome();
    initEncyclopedia();
    initDetail();
    initTimeline();
    initScrollEffects();

    applyHash();
    animateStats();
  };

  const ensureAnimateInObserver = () => {
    if (animateInObserver) return;
    animateInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          animateInObserver.unobserve(entry.target);
        });
      },
      { root: null, threshold: 0.18 }
    );
  };

  const observeAnimateIn = (elements) => {
    ensureAnimateInObserver();
    elements.forEach((el) => animateInObserver.observe(el));
  };

  const ensureTimelineActiveObserver = () => {
    if (timelineActiveObserver) return;
    timelineActiveObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          timelineVisibility.set(entry.target, entry.intersectionRatio);
        });

        let best = null;
        let bestRatio = 0;
        timelineVisibility.forEach((ratio, el) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        });

        const eras = qsa(".timeline-era");
        eras.forEach((era) => era.classList.remove("active"));
        if (best && bestRatio > 0.22) best.classList.add("active");
      },
      { root: null, threshold: [0, 0.15, 0.25, 0.4, 0.55, 0.7] }
    );
  };

  const observeTimelineActive = (elements) => {
    ensureTimelineActiveObserver();
    elements.forEach((el) => timelineActiveObserver.observe(el));
  };

  const initScrollEffects = () => {
    if (!dom.navbar) return;
    const onScroll = () => {
      dom.navbar.classList.toggle("scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  };

  const initNav = () => {
    dom.navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(link.dataset.page);
      });
    });

    dom.drawerLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(link.dataset.page);
      });
    });

    if (dom.navBrand) {
      dom.navBrand.addEventListener("click", () => navigateTo("home"));
    }

    if (dom.hamburger && dom.navDrawer) {
      dom.hamburger.addEventListener("click", () => {
        dom.hamburger.classList.toggle("open");
        dom.navDrawer.classList.toggle("open");
      });
    }

    window.addEventListener("hashchange", applyHash);
  };

  const applyHash = () => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    navigateTo(hash, { skipHash: true, skipScroll: true });
  };

  const navigateTo = (page, options = {}) => {
    if (!page) return;
    const target = qs(`#page-${page}`);
    if (!target) return;

    qsa(".page").forEach((section) => {
      section.classList.toggle("active", section === target);
    });

    dom.navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
    });

    dom.drawerLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
    });

    if (dom.navDrawer) dom.navDrawer.classList.remove("open");
    if (dom.hamburger) dom.hamburger.classList.remove("open");

    state.activePage = page;

    if (!options.skipHash) {
      window.history.replaceState(null, "", `#${page}`);
    }

    if (!options.skipScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const initSearch = () => {
    if (!dom.searchOverlay || !dom.searchInput || !dom.searchTrigger) return;

    const openSearch = () => {
      dom.searchOverlay.classList.add("active");
      dom.searchInput.value = "";
      renderSearchResults("");
      setTimeout(() => dom.searchInput.focus(), 300);
    };

    const closeSearch = () => {
      dom.searchOverlay.classList.remove("active");
    };

    dom.searchTrigger.addEventListener("click", openSearch);

    if (dom.searchClose) {
      dom.searchClose.addEventListener("click", closeSearch);
    }

    dom.searchOverlay.addEventListener("click", (event) => {
      if (event.target === dom.searchOverlay) closeSearch();
    });

    dom.searchInput.addEventListener("input", (event) => {
      renderSearchResults(event.target.value);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSearch();
    });

    if (dom.searchResults) {
      dom.searchResults.addEventListener("click", (event) => {
      const item = event.target.closest(".search-result-item");
      if (!item) return;
      const id = item.dataset.id;
      closeSearch();
      openDetail(id);
      });
    }
  };

  const renderSearchResults = (term) => {
    if (!dom.searchResults) return;
    const normalized = (term || "").trim().toLowerCase();

    let results = state.dinoList;
    if (normalized) {
      results = results.filter((dino) => {
        const name = `${dino?.name?.common || ""} ${dino?.name?.scientific || ""}`.toLowerCase();
        const period = dino?.period || "";
        const classification = dino?.classification || "";
        return name.includes(normalized) || period.includes(normalized) || classification.includes(normalized);
      });
    } else {
      results = DINOBASE.getFeatured ? DINOBASE.getFeatured() : results.slice(0, 6);
    }

    results = results.slice(0, 8);

    dom.searchResults.innerHTML = results
      .map((dino) => {
        const periodLabel = formatPeriodLabel(dino.period);
        const dietLabel = formatDietLabel(dino.diet);
        return `
          <div class="search-result-item" data-id="${dino.id}">
            <span class="search-result-emoji">${dino.emoji || ""}</span>
            <div>
              <div class="search-result-name">${getCommonName(dino)}</div>
              <div class="search-result-sub">${periodLabel} - ${dietLabel}</div>
            </div>
          </div>
        `;
      })
      .join("") || "<div class=\"search-result-item\"><div class=\"search-result-name\">No matches found</div></div>";
  };

  const initHome = () => {
    if (dom.featuredGrid) {
      const featured = DINOBASE.getFeatured ? DINOBASE.getFeatured() : state.dinoList.slice(0, 6);
      dom.featuredGrid.innerHTML = featured.map(renderDinoCard).join("");
      dom.featuredGrid.addEventListener("click", handleCardClick);
    }

    if (dom.tickerContent && Array.isArray(DINOBASE.facts)) {
      const facts = DINOBASE.facts;
      const items = facts.concat(facts).map((fact) => `<span class=\"ticker-item\">${fact}</span>`);
      dom.tickerContent.innerHTML = items.join("");
    }

    updateDietCounts();
  };

  const animateStats = () => {
    const stats = qsa(".stat-number");
    if (!stats.length) return;

    stats.forEach((stat) => {
      const target = Number(stat.dataset.target || 0);
      if (!target) return;

      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        stat.textContent = value.toString();
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  const updateDietCounts = () => {
    const counts = { carnivore: 0, herbivore: 0, omnivore: 0, piscivore: 0 };
    state.dinoList.forEach((dino) => {
      if (counts[dino.diet] !== undefined) counts[dino.diet] += 1;
    });

    const setCount = (id, value) => {
      const el = qs(id);
      if (el) el.textContent = value.toString();
    };

    setCount("#carnivoreCount", counts.carnivore);
    setCount("#herbivoreCount", counts.herbivore);
    setCount("#omnivoreCount", counts.omnivore);
    setCount("#piscivoreCount", counts.piscivore);
  };

  const initEncyclopedia = () => {
    if (!dom.dinoGrid) return;

    const filterInputs = qsa(".filter-sidebar input[type=\"checkbox\"]");
    filterInputs.forEach((input) => input.addEventListener("change", applyFilters));

    if (dom.sortSelect) {
      dom.sortSelect.addEventListener("change", applyFilters);
    }

    if (dom.filterSearch) {
      dom.filterSearch.addEventListener("input", applyFilters);
    }

    if (dom.filterReset) {
      dom.filterReset.addEventListener("click", resetFilters);
    }

    if (dom.gridView && dom.listView) {
      dom.gridView.addEventListener("click", () => setViewMode("grid"));
      dom.listView.addEventListener("click", () => setViewMode("list"));
    }

    dom.dinoGrid.addEventListener("click", handleCardClick);

    updatePeriodCounts();
    applyFilters();
  };

  const initTimeline = () => {
    if (!dom.timelineContent) return;

    dom.timelineContent.innerHTML = renderTimeline();

    dom.timelineContent.addEventListener("click", (event) => {
      const chip = event.target.closest(".timeline-species-chip");
      if (!chip) return;
      openDetail(chip.dataset.id);
    });

    observeAnimateIn(qsa(".animate-in", dom.timelineContent));
    observeTimelineActive(qsa(".timeline-era", dom.timelineContent));
  };

  const renderTimeline = () => {
    const periodKeys = Array.isArray(DINOBASE?.enums?.periods)
      ? DINOBASE.enums.periods.slice()
      : Object.keys(DINOBASE?.periods || {}).sort((a, b) => (periodOrder[a] ?? 99) - (periodOrder[b] ?? 99));

    return periodKeys
      .filter((key) => Boolean(DINOBASE?.periods?.[key]))
      .map((key) => {
        const period = DINOBASE.periods[key];
        const dinos = DINOBASE.getByPeriod ? DINOBASE.getByPeriod(key) : state.dinoList.filter((d) => d.period === key);

        const events = Array.isArray(period.keyEvents) && period.keyEvents.length
          ? `
            <div class="timeline-events">
              ${period.keyEvents
                .map((item) => `
                  <div class="timeline-event">
                    <div class="event-mya">${item.mya} MYA</div>
                    <div class="event-text">${item.event}</div>
                  </div>
                `)
                .join("")}
            </div>
          `
          : "";

        const species = dinos.length
          ? `
            <div class="timeline-species">
              <div class="timeline-species-label">Dinosaurs of the ${period.label}</div>
              <div class="timeline-species-chips">
                ${dinos
                  .slice()
                  .sort((a, b) => getCommonName(a).localeCompare(getCommonName(b)))
                  .map((dino) => `
                    <div class="timeline-species-chip" data-id="${dino.id}">
                      <span>${dino.emoji || ""}</span>
                      <span>${getCommonName(dino)}</span>
                    </div>
                  `)
                  .join("")}
              </div>
            </div>
          `
          : `
            <div class="timeline-species">
              <div class="timeline-species-label">Dinosaurs of the ${period.label}</div>
              <p class="map-hint">No species catalogued for this era yet.</p>
            </div>
          `;

        const dateRange = period.startMya && period.endMya ? `${period.startMya} - ${period.endMya} MYA` : "";

        return `
          <section class="timeline-era ${key} animate-in" data-period="${key}">
            <div class="timeline-era-header">
              <div class="timeline-era-dot"></div>
              <div class="timeline-era-title">${period.label}</div>
              <div class="timeline-era-dates">${dateRange}</div>
            </div>
            <div class="timeline-desc">${period.description || ""}</div>
            ${events}
            ${species}
          </section>
        `;
      })
      .join("");
  };

  const setActiveTab = (tabId) => {
    if (!dom.detailContainer) return;
    const tabs = qsa(".detail-tab", dom.detailContainer);
    const panels = qsa(".detail-panel", dom.detailContainer);
    if (!tabs.length || !panels.length) return;

    const targetId = tabId || tabs[0].dataset.tab;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === targetId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tab === targetId;
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  };

  const initDetail = () => {
    if (!dom.detailContainer) return;

    dom.detailContainer.addEventListener("click", (event) => {
      const back = event.target.closest(".detail-back");
      if (back) {
        navigateTo(state.lastPage || "encyclopedia");
        return;
      }

      const tab = event.target.closest(".detail-tab");
      if (tab) {
        setActiveTab(tab.dataset.tab);
        return;
      }

      const chip = event.target.closest(".relation-chip");
      if (chip) {
        openDetail(chip.dataset.id);
      }
    });
  };

  const updatePeriodCounts = () => {
    const counts = {
      triassic: DINOBASE.getByPeriod ? DINOBASE.getByPeriod("triassic").length : 0,
      jurassic: DINOBASE.getByPeriod ? DINOBASE.getByPeriod("jurassic").length : 0,
      cretaceous: DINOBASE.getByPeriod ? DINOBASE.getByPeriod("cretaceous").length : 0
    };

    qsa(".filter-option input[name=\"period\"]").forEach((input) => {
      const count = counts[input.value] ?? 0;
      const countEl = input.closest(".filter-option")?.querySelector(".filter-count");
      if (countEl) countEl.textContent = count ? count.toString() : "";
    });
  };

  const resetFilters = () => {
    qsa(".filter-sidebar input[type=\"checkbox\"]").forEach((input) => {
      input.checked = false;
    });
    if (dom.filterSearch) dom.filterSearch.value = "";
    if (dom.sortSelect) dom.sortSelect.value = "name";
    applyFilters();
  };

  const setViewMode = (mode) => {
    if (!dom.dinoGrid || !dom.gridView || !dom.listView) return;
    dom.dinoGrid.classList.toggle("list-view", mode === "list");
    dom.gridView.classList.toggle("active", mode === "grid");
    dom.listView.classList.toggle("active", mode === "list");
  };

  const getSelectedFilters = () => {
    const selected = {
      period: new Set(),
      diet: new Set(),
      classification: new Set(),
      size: new Set()
    };

    qsa(".filter-sidebar input[type=\"checkbox\"]:checked").forEach((input) => {
      if (selected[input.name]) selected[input.name].add(input.value);
    });

    return selected;
  };

  const applyFilters = () => {
    const selected = getSelectedFilters();
    let results = state.dinoList.slice();
    const query = (dom.filterSearch?.value || "").trim().toLowerCase();

    results = results.filter((dino) => {
      const sizeCategory = DINOBASE.getSizeCategory ? DINOBASE.getSizeCategory(dino) : dino?.size?.category;
      const name = `${dino?.name?.common || ""} ${dino?.name?.scientific || ""}`.toLowerCase();

      return (
        (selected.period.size === 0 || selected.period.has(dino.period)) &&
        (selected.diet.size === 0 || selected.diet.has(dino.diet)) &&
        (selected.classification.size === 0 || selected.classification.has(dino.classification)) &&
        (selected.size.size === 0 || selected.size.has(sizeCategory)) &&
        (!query || name.includes(query))
      );
    });

    results = sortDinosaurs(results, dom.sortSelect?.value || "name");

    renderGrid(results);
    updateResultsCount(results.length, state.dinoList.length);
  };

  const sortDinosaurs = (list, sortKey) => {
    const sorted = list.slice();
    if (sortKey === "name") {
      sorted.sort((a, b) => getCommonName(a).localeCompare(getCommonName(b)));
    } else if (sortKey === "period") {
      sorted.sort((a, b) => {
        const aOrder = periodOrder[a.period] ?? 99;
        const bOrder = periodOrder[b.period] ?? 99;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return getCommonName(a).localeCompare(getCommonName(b));
      });
    } else if (sortKey === "length") {
      sorted.sort((a, b) => {
        const aValue = a?.measurements?.length?.value || 0;
        const bValue = b?.measurements?.length?.value || 0;
        return bValue - aValue;
      });
    } else if (sortKey === "weight") {
      sorted.sort((a, b) => {
        const aValue = a?.measurements?.weight?.value || 0;
        const bValue = b?.measurements?.weight?.value || 0;
        return bValue - aValue;
      });
    }
    return sorted;
  };

  const updateResultsCount = (count, total) => {
    if (!dom.resultsCount) return;
    dom.resultsCount.textContent = `Showing ${count} of ${total} species`;
  };

  const renderGrid = (list) => {
    if (!dom.dinoGrid) return;
    if (!list.length) {
      dom.dinoGrid.innerHTML = "<div class=\"dino-empty-state\">No species match the current filters.</div>";
      return;
    }
    dom.dinoGrid.innerHTML = list.map(renderDinoCard).join("");
    revealGridCards();
  };

  const revealGridCards = () => {
    if (!dom.dinoGrid) return;
    const cards = qsa(".dino-card", dom.dinoGrid);
    cards.forEach((card, index) => {
      const delay = Math.min(index * 40, 240);
      card.style.transitionDelay = `${delay}ms, ${delay}ms, 0ms, 0ms`;
      requestAnimationFrame(() => card.classList.add("is-visible"));
      setTimeout(() => {
        if (card) card.style.transitionDelay = "";
      }, delay + 600);
    });
  };

  const renderDinoCard = (dino) => {
    const periodLabel = formatPeriodLabel(dino.period);
    const dietLabel = formatDietLabel(dino.diet);
    const length = DINOBASE.formatLength?.(dino?.measurements?.length?.value) || "N/A";
    const weight = DINOBASE.formatWeight?.(dino?.measurements?.weight?.value) || "N/A";

    return `
      <article class="dino-card" data-id="${dino.id}">
        <div class="dino-card-visual" style="${buildVisualStyle(dino)}">
          <span class="dino-card-period-tag period-tag-${dino.period}">${periodLabel}</span>
          <span class="dino-card-emoji">${dino.emoji || ""}</span>
        </div>
        <div class="dino-card-body">
          <div class="dino-card-name">${getCommonName(dino)}</div>
          <div class="dino-card-scientific">${getScientificName(dino)}</div>
          <div class="dino-card-stats">
            <span class="dino-stat-pill">Length: ${length}</span>
            <span class="dino-stat-pill">Weight: ${weight}</span>
          </div>
          <div class="dino-card-diet diet-${dino.diet}">${dietLabel}</div>
        </div>
      </article>
    `;
  };

  const handleCardClick = (event) => {
    const card = event.target.closest(".dino-card");
    if (!card) return;
    openDetail(card.dataset.id);
  };

  const openDetail = (id) => {
    if (!dom.detailContainer) return;
    const dino = DINOBASE.getById ? DINOBASE.getById(id) : state.dinoList.find((item) => item.id === id);
    if (!dino) return;

    if (state.activePage && state.activePage !== "detail") {
      state.lastPage = state.activePage;
    }

    dom.detailContainer.innerHTML = renderDetail(dino);
    setActiveTab("overview");
    navigateTo("detail");
  };

  const renderDetail = (dino) => {
    const periodLabel = formatPeriodLabel(dino.period);
    const dietLabel = formatDietLabel(dino.diet);

    const length = formatMeasurement(dino?.measurements?.length);
    const height = formatMeasurement(dino?.measurements?.height);
    const weight = formatMeasurement(dino?.measurements?.weight);
    const speed = formatMeasurement(dino?.measurements?.speed);

    const myaRange = dino?.mya?.start && dino?.mya?.end ? `${dino.mya.start} - ${dino.mya.end} Mya` : "Unknown";
    const subPeriod = dino?.subPeriod ? ` (${dino.subPeriod})` : "";
    const sizeCategory = DINOBASE.getSizeCategory ? DINOBASE.getSizeCategory(dino) : dino?.size?.category;
    const sizeLabel = sizeCategory ? capitalize(sizeCategory) : "Unknown";
    const habitatText = dino.habitat || "Habitat details unavailable.";
    const behaviorText = dino.behavior || "Behavior details unavailable.";
    const locomotionText = dino.locomotion ? capitalize(dino.locomotion) : "Unknown";
    const socialText = dino.socialBehavior || "Unknown";

    const discovery = dino?.discovery
      ? `${dino.discovery.discoveredBy} (${dino.discovery.year}) - ${dino.discovery.location}`
      : "Discovery details unavailable.";

    const facts = Array.isArray(dino.funFacts) && dino.funFacts.length
      ? dino.funFacts
      : (Array.isArray(dino.facts) ? dino.facts : []);

    const funFacts = facts.length
      ? `<ul class=\"fun-facts-list\">${facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>`
      : "<p>No fun facts listed yet.</p>";

    const specimens = Array.isArray(dino.notableSpecimens) && dino.notableSpecimens.length
      ? `<div class=\"specimens-list\">${dino.notableSpecimens
        .map((specimen) => `
          <div class=\"specimen-item\">
            <div class=\"specimen-name\">${specimen.name}</div>
            <div class=\"specimen-meta\">${specimen.completeness} - ${specimen.location} (${specimen.year})</div>
          </div>
        `)
        .join("")}</div>`
      : "<p>No notable specimens listed.</p>";

    const fossilSites = Array.isArray(dino.fossilLocations)
      ? dino.fossilLocations
        .map((id) => DINOBASE.fossilSites?.find((site) => site.id === id))
        .filter(Boolean)
      : [];

    const fossilLocations = fossilSites.length
      ? `<ul class=\"detail-list\">${fossilSites
        .map((site) => `
          <li>
            <strong>${site.name}</strong>
            <span>${site.country}</span>
          </li>
        `)
        .join("")}</ul>`
      : "<p>No fossil locations listed.</p>";

    const predators = renderRelationChips(dino.predators, "No known predators.");
    const prey = renderRelationChips(dino.prey, "No known prey.");

    return `
      <div class="detail-back">Back to ${capitalize(state.lastPage || "encyclopedia")}</div>
      <div class="detail-hero">
        <div class="detail-visual" style="${buildVisualStyle(dino)}">
          <span class="dino-card-period-tag period-tag-${dino.period}">${periodLabel}</span>
          <span>${dino.emoji || ""}</span>
        </div>
        <div class="detail-info">
          <div class="detail-eyebrow">
            <span class="dino-card-diet diet-${dino.diet}">${dietLabel}</span>
            <span class="dino-card-period-tag period-tag-${dino.period}">${periodLabel}</span>
          </div>
          <div class="detail-name">${getCommonName(dino)}</div>
          <div class="detail-scientific">${getScientificName(dino)}</div>
          <div class="detail-pronunciation">${dino.pronunciation || "Pronunciation unknown"}</div>
          <div class="detail-meaning"><strong>Meaning:</strong> ${dino.meaningOfName || "Unknown"}</div>
          <div class="detail-meaning"><strong>Period:</strong> ${periodLabel}${subPeriod}</div>
          <div class="detail-meaning"><strong>Range:</strong> ${myaRange}</div>
        </div>
      </div>

      <div class="detail-tabs" role="tablist">
        <button class="detail-tab active" data-tab="overview" role="tab" aria-selected="true">Overview</button>
        <button class="detail-tab" data-tab="stats" role="tab" aria-selected="false">Stats</button>
        <button class="detail-tab" data-tab="behavior" role="tab" aria-selected="false">Behavior</button>
        <button class="detail-tab" data-tab="discovery" role="tab" aria-selected="false">Discovery</button>
        <button class="detail-tab" data-tab="facts" role="tab" aria-selected="false">Facts</button>
      </div>

      <div class="detail-panels">
        <section class="detail-panel active" data-tab="overview" role="tabpanel" aria-hidden="false">
          <div class="detail-sections">
            <div class="detail-section">
              <div class="detail-section-title">Overview</div>
              <ul class="detail-kv">
                <li><span class="detail-kv-label">Period</span><span class="detail-kv-value">${periodLabel}${subPeriod}</span></li>
                <li><span class="detail-kv-label">Range</span><span class="detail-kv-value">${myaRange}</span></li>
                <li><span class="detail-kv-label">Diet</span><span class="detail-kv-value">${dietLabel}</span></li>
                <li><span class="detail-kv-label">Size</span><span class="detail-kv-value">${sizeLabel}</span></li>
                <li><span class="detail-kv-label">Habitat</span><span class="detail-kv-value">${habitatText}</span></li>
              </ul>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Classification</div>
              <ul class="detail-kv">
                <li><span class="detail-kv-label">Group</span><span class="detail-kv-value">${capitalize(dino.classification || "Unknown")}</span></li>
                <li><span class="detail-kv-label">Family</span><span class="detail-kv-value">${dino.subclassification || "Unknown"}</span></li>
                <li><span class="detail-kv-label">Locomotion</span><span class="detail-kv-value">${locomotionText}</span></li>
                <li><span class="detail-kv-label">Social</span><span class="detail-kv-value">${socialText}</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="detail-panel" data-tab="stats" role="tabpanel" aria-hidden="true">
          <div class="detail-section">
            <div class="detail-section-title">Measurements</div>
            <div class="detail-stats-grid">
              ${renderStatCard("Length", length)}
              ${renderStatCard("Height", height)}
              ${renderStatCard("Weight", weight)}
              ${renderStatCard("Speed", speed)}
            </div>
          </div>
        </section>

        <section class="detail-panel" data-tab="behavior" role="tabpanel" aria-hidden="true">
          <div class="detail-sections">
            <div class="detail-section">
              <div class="detail-section-title">Behavior</div>
              <p>${behaviorText}</p>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Habitat</div>
              <p>${habitatText}</p>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Social</div>
              <p>${socialText}</p>
            </div>
          </div>
        </section>

        <section class="detail-panel" data-tab="discovery" role="tabpanel" aria-hidden="true">
          <div class="detail-sections">
            <div class="detail-section">
              <div class="detail-section-title">Discovery</div>
              <p>${discovery}</p>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Fossil Locations</div>
              ${fossilLocations}
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Notable Specimens</div>
              ${specimens}
            </div>
          </div>
        </section>

        <section class="detail-panel" data-tab="facts" role="tabpanel" aria-hidden="true">
          <div class="detail-sections">
            <div class="detail-section">
              <div class="detail-section-title">Fun Facts</div>
              ${funFacts}
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Predators</div>
              ${predators}
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Prey</div>
              ${prey}
            </div>
          </div>
        </section>
      </div>
    `;
  };

  const renderStatCard = (label, measurement) => {
    const unitMarkup = measurement.unit ? `<div class=\"detail-stat-unit\">${measurement.unit}</div>` : "";
    const notesMarkup = measurement.notes ? `<div class=\"detail-stat-notes\">${measurement.notes}</div>` : "";

    return `
      <div class="detail-stat-card">
        <div class="detail-stat-label">${label}</div>
        <div class="detail-stat-value">${measurement.value}</div>
        ${unitMarkup}
        ${notesMarkup}
      </div>
    `;
  };

  const renderRelationChips = (ids, emptyText) => {
    if (!Array.isArray(ids) || !ids.length) {
      return `<p>${emptyText}</p>`;
    }

    const chips = ids
      .map((id) => {
        const dino = DINOBASE.getById ? DINOBASE.getById(id) : null;
        const name = dino ? getCommonName(dino) : capitalize(id.replace(/-/g, " "));
        return `<span class=\"relation-chip\" data-id=\"${id}\">${name}</span>`;
      })
      .join("");

    return `<div class=\"relation-chips\">${chips}</div>`;
  };

  const filterByDiet = (diet) => {
    if (!diet) return;
    navigateTo("encyclopedia");

    qsa(".filter-sidebar input[type=\"checkbox\"]").forEach((input) => {
      input.checked = input.name === "diet" && input.value === diet;
    });

    if (dom.filterSearch) dom.filterSearch.value = "";

    applyFilters();
  };

  window.navigateTo = navigateTo;
  window.filterByDiet = filterByDiet;

  document.addEventListener("DOMContentLoaded", () => {
  renderDinosaurs(DINOBASE.dinosaurs);
});

function renderDinosaurs(data) {
  const grid = document.getElementById("dinoGrid");
  if (!grid) return;

  grid.innerHTML = "";

  data.forEach(dino => {
    const card = document.createElement("div");
    card.className = "dino-card";

    card.innerHTML = `
      <h3>${dino.name.common}</h3>
      <p>${dino.name.scientific}</p>
      <p>${dino.period} • ${dino.diet}</p>
    `;

    grid.appendChild(card);
  });
}

function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById("page-" + page);
  if (target) target.classList.add("active");
}

function renderTimeline() {
  const container = document.getElementById("timelineContent");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(DINOBASE.periods).forEach(([key, period]) => {
    const section = document.createElement("div");

    section.innerHTML = `
      <h2>${period.label}</h2>
      <p>${period.description}</p>
    `;

    container.appendChild(section);
  });
}

document.addEventListener("DOMContentLoaded", renderTimeline);

document.getElementById("filterSearch")?.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = DINOBASE.dinosaurs.filter(d =>
    d.name.common.toLowerCase().includes(value)
  );

  renderDinosaurs(filtered);
});

document.addEventListener("DOMContentLoaded", init);