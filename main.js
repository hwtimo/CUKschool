/**
 * CUK School — Main Script
 */
(function () {
  "use strict";

  /* ── Notice Modal Styles (injected once) ───────── */
  function injectModalStyles() {
    if (document.getElementById('cuk-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'cuk-modal-styles';
    style.textContent = `
      .notice-modal {
        position: fixed; inset: 0; z-index: 9000;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none;
        transition: opacity .25s ease;
      }
      .notice-modal.is-open { opacity: 1; pointer-events: all; }
      .notice-modal__overlay {
        position: absolute; inset: 0;
        background: rgba(0,0,0,.55);
      }
      .notice-modal__box {
        position: relative; background: #fff;
        border-radius: 12px; max-width: 700px; width: 92%;
        max-height: 90vh; overflow-y: auto;
        box-shadow: 0 24px 64px rgba(0,0,0,.28);
        z-index: 1;
      }
      .notice-modal__close {
        position: absolute; top: 14px; right: 14px;
        width: 34px; height: 34px; border-radius: 50%;
        border: none; background: rgba(0,0,0,.08);
        cursor: pointer; font-size: 16px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        z-index: 2; transition: background .15s;
        color: #333;
      }
      .notice-modal__close:hover { background: rgba(0,0,0,.18); }
      .notice-modal__img img {
        width: 100%; display: block;
        border-radius: 12px 12px 0 0;
        max-height: 420px; object-fit: contain;
        background: #f5f5f5;
      }
      .notice-modal__body { padding: 24px 28px 32px; }
      .notice-modal__body .badge { display: inline-block; margin-bottom: 10px; }
      .notice-modal__body h3 {
        font-size: 1.2rem; font-weight: 700;
        margin: 0 0 6px; color: #1a1a2e; line-height: 1.4;
      }
      .notice-modal__date { font-size: 0.85rem; color: #999; display: block; margin-bottom: 16px; }
      .notice-modal__detail { line-height: 1.75; color: #444; }
      .notice-card { cursor: pointer; transition: transform .15s, box-shadow .15s; }
      .notice-card:hover { transform: translateY(-2px); }
      .notice-card:focus-visible { outline: 3px solid var(--c-primary, #2563eb); outline-offset: 2px; }
    `;
    document.head.appendChild(style);
  }

  /* ── Notices Rendering ─────────────────────────── */
  let noticesData = [];
  const NOTICES_PAGE_SIZE = 6;
  const noticesState = { filter: 'all', query: '', visibleCount: NOTICES_PAGE_SIZE, modal: null };

  async function initNotices() {
    const grid = document.getElementById('notices-grid');
    const homeGrid = document.getElementById('home-notices-grid');
    if (!grid && !homeGrid) return;

    try {
      const res = await fetch('/notices.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      noticesData = Array.isArray(data.items) ? data.items.slice() : [];
    } catch (err) {
      console.error('Failed to load notices:', err);
      noticesData = [];
    }

    noticesData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    injectModalStyles();
    const modal = buildModal();
    document.body.appendChild(modal);
    noticesState.modal = modal;

    if (homeGrid) {
      if (noticesData.length) {
        renderGrid(homeGrid, noticesData.slice(0, 3), modal, true);
      } else {
        homeGrid.innerHTML = `<p class="notices-empty">${i18n.t('home.notices.empty')}</p>`;
      }
    }

    if (grid) {
      buildNoticesToolbar();
      renderNoticesPage();
    }
  }

  function buildNoticesToolbar() {
    const grid = document.getElementById('notices-grid');
    if (!grid || document.getElementById('notices-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'notices-toolbar';
    toolbar.className = 'notices-toolbar';

    const filters = [
      { key: 'all',     ko: '전체',     en: 'All' },
      { key: 'recruit', ko: '학생모집', en: 'Enrollment' },
      { key: 'event',   ko: '행사',     en: 'Event' },
      { key: 'info',    ko: '안내',     en: 'Notice' },
      { key: 'new',     ko: '새소식',   en: 'News' }
    ];
    const chips = filters.map(f =>
      `<button class="filter-chip${f.key === 'all' ? ' is-active' : ''}" data-filter="${f.key}" type="button">
        <span class="i18n-ko">${f.ko}</span><span class="i18n-en">${f.en}</span>
      </button>`
    ).join('');

    toolbar.innerHTML = `
      <div class="notices-filters" role="group">${chips}</div>
      <div class="notices-search-wrap">
        <input type="search" id="notices-search" class="notices-search"
          placeholder="검색..." aria-label="공지사항 검색">
      </div>
    `;
    grid.parentNode.insertBefore(toolbar, grid);

    // Empty state + more button containers
    const more = document.createElement('div');
    more.className = 'notices-more-wrap';
    more.innerHTML = `<button id="notices-more-btn" class="btn btn--outline" type="button" hidden>
      <span class="i18n-ko">더 보기</span><span class="i18n-en">Show more</span>
    </button>`;
    grid.parentNode.insertBefore(more, grid.nextSibling);

    applyLangVisibility(toolbar, i18n.getLang());
    applyLangVisibility(more, i18n.getLang());

    // Wire up filter chips
    toolbar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        toolbar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        noticesState.filter = btn.dataset.filter;
        noticesState.visibleCount = NOTICES_PAGE_SIZE;
        renderNoticesPage();
      });
    });

    // Search input with debounce
    const search = toolbar.querySelector('#notices-search');
    const ph = i18n.getLang() === 'ko' ? '검색...' : 'Search...';
    search.placeholder = ph;
    let t = null;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        noticesState.query = search.value.trim().toLowerCase();
        noticesState.visibleCount = NOTICES_PAGE_SIZE;
        renderNoticesPage();
      }, 150);
    });

    // More button
    more.querySelector('#notices-more-btn').addEventListener('click', () => {
      noticesState.visibleCount += NOTICES_PAGE_SIZE;
      renderNoticesPage();
    });
  }

  function getFilteredNotices() {
    return noticesData.filter(n => {
      if (noticesState.filter !== 'all' && n.badge !== noticesState.filter) return false;
      if (noticesState.query) {
        const hay = [n.titleKo, n.titleEn, n.summaryKo, n.summaryEn, n.badgeKo, n.badgeEn]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(noticesState.query)) return false;
      }
      return true;
    });
  }

  function renderNoticesPage() {
    const grid = document.getElementById('notices-grid');
    if (!grid) return;
    const filtered = getFilteredNotices();
    const visible = filtered.slice(0, noticesState.visibleCount);

    if (!visible.length) {
      grid.innerHTML = `<div class="notices-empty">
        <p><span class="i18n-ko">${noticesState.query || noticesState.filter !== 'all'
          ? '조건에 맞는 공지사항이 없습니다.' : '등록된 공지사항이 없습니다.'}</span>
        <span class="i18n-en">${noticesState.query || noticesState.filter !== 'all'
          ? 'No matching notices.' : 'No notices yet.'}</span></p>
      </div>`;
      applyLangVisibility(grid, i18n.getLang());
    } else {
      renderGrid(grid, visible, noticesState.modal, false);
    }

    const moreBtn = document.getElementById('notices-more-btn');
    if (moreBtn) moreBtn.hidden = visible.length >= filtered.length;
  }

  function renderGrid(container, notices, modal, isHome) {
    const lang = i18n.getLang();
    container.innerHTML = notices.map(n => noticeCardHTML(n)).join('');

    // Apply i18n visibility to newly rendered elements
    applyLangVisibility(container, lang);

    // Click/keyboard handlers for modal
    container.querySelectorAll('.notice-card[data-notice-id]').forEach(card => {
      const id = parseInt(card.dataset.noticeId);
      const notice = noticesData.find(n => n.id === id);
      if (!notice) return;
      card.addEventListener('click', () => openModal(modal, notice));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(modal, notice); }
      });
    });

    // Re-init scroll reveal for new cards
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      container.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    } else {
      container.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
  }

  function noticeCardHTML(n) {
    const imgHTML = n.image
      ? `<div class="notice-card__img"><img src="${n.image}" alt="${n.imageAlt || ''}" loading="lazy"></div>`
      : `<div class="notice-card__img" style="display:flex;align-items:center;justify-content:center;min-height:120px;background:var(--c-bg-alt,#f8f8f8);">
           <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--c-text-3,#aaa)" stroke-width="1.5" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
         </div>`;
    return `
      <article class="notice-card reveal" data-notice-id="${n.id}" role="button" tabindex="0" aria-label="${n.titleKo}">
        ${imgHTML}
        <div class="notice-card__body">
          <div class="notice-card__meta">
            <span class="badge badge--${n.badge}">
              <span class="i18n-ko">${n.badgeKo}</span>
              <span class="i18n-en">${n.badgeEn}</span>
            </span>
            <span class="notice-card__date">${n.date}</span>
          </div>
          <h4>
            <span class="i18n-ko">${n.titleKo}</span>
            <span class="i18n-en">${n.titleEn}</span>
          </h4>
          <p>
            <span class="i18n-ko">${n.summaryKo || ''}</span>
            <span class="i18n-en">${n.summaryEn || ''}</span>
          </p>
          <span class="notice-card__more">
            <span class="i18n-ko">자세히 보기</span><span class="i18n-en">Read more</span> →
          </span>
        </div>
      </article>`;
  }

  function buildModal() {
    const modal = document.createElement('div');
    modal.className = 'notice-modal';
    modal.id = 'noticeModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="notice-modal__overlay"></div>
      <div class="notice-modal__box">
        <button class="notice-modal__close" aria-label="닫기">✕</button>
        <div class="notice-modal__img" id="modalImgWrap"></div>
        <div class="notice-modal__body">
          <span class="badge" id="modalBadge"></span>
          <h3 id="modalTitle"></h3>
          <span class="notice-modal__date" id="modalDate"></span>
          <div class="notice-modal__detail" id="modalDetail"></div>
        </div>
      </div>`;

    // Close on overlay click
    modal.querySelector('.notice-modal__overlay').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.notice-modal__close').addEventListener('click', () => closeModal(modal));

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
    });
    return modal;
  }

  function openModal(modal, notice) {
    const lang = i18n.getLang();
    const imgWrap = modal.querySelector('#modalImgWrap');
    imgWrap.innerHTML = notice.image
      ? `<img src="${notice.image}" alt="${notice.imageAlt || ''}">`
      : '';

    modal.querySelector('#modalBadge').className = `badge badge--${notice.badge}`;
    modal.querySelector('#modalBadge').textContent = lang === 'ko' ? notice.badgeKo : notice.badgeEn;
    modal.querySelector('#modalTitle').textContent = lang === 'ko' ? notice.titleKo : notice.titleEn;
    modal.querySelector('#modalDate').textContent = notice.date;
    modal.querySelector('#modalDetail').innerHTML = lang === 'ko' ? notice.detailKo : notice.detailEn;

    modal._currentNoticeId = notice.id;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.notice-modal__close').focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function applyLangVisibility(container, lang) {
    container.querySelectorAll('.i18n-ko').forEach(el => { el.hidden = lang !== 'ko'; });
    container.querySelectorAll('.i18n-en').forEach(el => { el.hidden = lang !== 'en'; });
  }

  /* ── Language Toggle ───────────────────────────── */
  function initLang() {
    i18n.init();
    document.addEventListener("click", (e) => {
      const sw = e.target.closest(".lang-switch");
      if (!sw) return;
      const current = i18n.getLang();
      i18n.setLang(current === "ko" ? "en" : "ko");
      // Re-apply lang visibility to dynamically rendered notices
      ['notices-grid', 'home-notices-grid', 'notices-toolbar', 'gallery-grid', 'schedule-list'].forEach(id => {
        const el = document.getElementById(id);
        if (el) applyLangVisibility(el, i18n.getLang());
      });
      document.querySelectorAll('.notices-more-wrap').forEach(el =>
        applyLangVisibility(el, i18n.getLang())
      );
      const search = document.getElementById('notices-search');
      if (search) search.placeholder = i18n.getLang() === 'ko' ? '검색...' : 'Search...';
      // Update open modal if any
      const modal = document.getElementById('noticeModal');
      if (modal && modal.classList.contains('is-open')) {
        const openCard = document.querySelector('.notice-card[data-notice-id]');
        // Re-render modal with new language by re-reading the modal's current notice id
        // (stored on the modal element)
        const noticeId = modal._currentNoticeId;
        if (noticeId && typeof noticesData !== 'undefined') {
          const notice = noticesData.find(n => n.id === noticeId);
          if (notice) openModal(modal, notice);
        }
      }
    });
  }

  /* ── Active Nav Highlight (derived from URL) ───── */
  function initActiveNav() {
    const file = (location.pathname.split('/').pop() || 'index.html');
    const slug = file.replace(/\.html$/, '') || 'index';
    const groups = {
      about:   ['programs', 'teachers', 'schedule', 'gallery'],
      classes: ['danbi', 'hanbyul', 'gaon', 'goeup']
    };
    document.querySelectorAll('[data-nav]').forEach((el) => {
      if (el.dataset.nav === slug) el.classList.add('is-active');
    });
    Object.keys(groups).forEach((key) => {
      if (groups[key].includes(slug)) {
        const trigger = document.querySelector(`.dropdown-trigger[data-nav="${key}"]`);
        if (trigger) trigger.classList.add('is-active');
      }
    });
  }

  /* ── Mobile Navigation ─────────────────────────── */
  function initNav() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const menu   = document.querySelector(".nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !open);
      menu.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      })
    );

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        menu.querySelectorAll(".dropdown.is-open").forEach((d) =>
          d.classList.remove("is-open")
        );
      }
    });

    menu.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        if (window.innerWidth > 960) return;
        e.preventDefault();
        const dd = trigger.closest(".dropdown");
        const wasOpen = dd.classList.contains("is-open");
        menu.querySelectorAll(".dropdown.is-open").forEach((d) =>
          d.classList.remove("is-open")
        );
        if (!wasOpen) dd.classList.add("is-open");
      });
    });

    const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Contact Form (Formspree) ──────────────────── */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = i18n.t("contact.form.sending");
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        showToast(
          res.ok ? "success" : "error",
          i18n.t(res.ok ? "contact.form.success" : "contact.form.error")
        );
        if (res.ok) form.reset();
      } catch {
        showToast("error", i18n.t("contact.form.error"));
      }
      btn.textContent = origText;
      btn.disabled = false;
    });
  }

  function showToast(type, msg) {
    let toast = document.querySelector(".toast");
    if (toast) toast.remove();
    toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "alert");
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  /* ── Scroll Reveal ─────────────────────────────── */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
  }

  /* ── Focus Visible Polyfill ────────────────────── */
  function initFocus() {
    document.body.addEventListener("keydown", (e) => {
      if (e.key === "Tab") document.body.classList.add("user-tabbing");
    });
    document.body.addEventListener("mousedown", () => {
      document.body.classList.remove("user-tabbing");
    });
  }

  /* ── Skip-to-content ───────────────────────────── */
  function initSkipLink() {
    const skip = document.querySelector(".skip-link");
    if (!skip) return;
    skip.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(skip.getAttribute("href"));
      if (target) { target.focus(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  }

  /* ── Gallery ────────────────────────────────────── */
  async function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    let items = [];
    try {
      const res = await fetch('/gallery.json', { cache: 'no-cache' });
      if (res.ok) items = (await res.json()).items || [];
    } catch {}
    items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (!items.length) {
      grid.innerHTML = `<p class="notices-empty">
        <span class="i18n-ko">사진이 곧 업데이트됩니다.</span>
        <span class="i18n-en">Photos coming soon.</span></p>`;
      applyLangVisibility(grid, i18n.getLang());
      return;
    }

    injectModalStyles();
    grid.innerHTML = items.map((g, i) => `
      <figure class="gallery-card" data-idx="${i}" tabindex="0" role="button"
        aria-label="${g.captionKo || g.captionEn || ''}">
        <img src="${g.image}" alt="${g.captionKo || g.captionEn || ''}" loading="lazy">
        ${g.captionKo || g.captionEn ? `<figcaption>
          <span class="i18n-ko">${g.captionKo || ''}</span>
          <span class="i18n-en">${g.captionEn || ''}</span>
          ${g.date ? `<span class="gallery-card__date">${g.date}</span>` : ''}
        </figcaption>` : ''}
      </figure>
    `).join('');
    applyLangVisibility(grid, i18n.getLang());

    // Lightbox
    const lb = document.createElement('div');
    lb.className = 'notice-modal';
    lb.innerHTML = `
      <div class="notice-modal__overlay"></div>
      <div class="notice-modal__box" style="background:transparent;box-shadow:none;max-width:1000px;">
        <button class="notice-modal__close" aria-label="닫기" style="background:rgba(255,255,255,.85);">✕</button>
        <img id="lb-img" style="width:100%;max-height:80vh;object-fit:contain;border-radius:8px;background:#000;">
        <p id="lb-caption" style="color:#fff;text-align:center;padding:12px;font-size:0.95rem;"></p>
      </div>`;
    document.body.appendChild(lb);
    const close = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; };
    lb.querySelector('.notice-modal__overlay').addEventListener('click', close);
    lb.querySelector('.notice-modal__close').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    grid.querySelectorAll('.gallery-card').forEach(card => {
      const open = () => {
        const g = items[+card.dataset.idx];
        lb.querySelector('#lb-img').src = g.image;
        const cap = i18n.getLang() === 'ko' ? (g.captionKo || '') : (g.captionEn || '');
        lb.querySelector('#lb-caption').textContent = cap + (g.date ? `  ·  ${g.date}` : '');
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  /* ── Schedule ───────────────────────────────────── */
  const TYPE_LABEL = {
    class:   { ko: '수업', en: 'Class' },
    break:   { ko: '방학', en: 'Break' },
    event:   { ko: '행사', en: 'Event' },
    exam:    { ko: '시험', en: 'Exam' },
    holiday: { ko: '휴일', en: 'Holiday' }
  };
  async function initSchedule() {
    const list = document.getElementById('schedule-list');
    if (!list) return;
    let items = [];
    try {
      const res = await fetch('/schedule.json', { cache: 'no-cache' });
      if (res.ok) items = (await res.json()).items || [];
    } catch {}
    items.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    if (!items.length) {
      list.innerHTML = `<p class="notices-empty">
        <span class="i18n-ko">학사 일정은 추후 공지됩니다.</span>
        <span class="i18n-en">Schedule will be announced soon.</span></p>`;
      applyLangVisibility(list, i18n.getLang());
      return;
    }

    list.innerHTML = items.map(s => {
      const t = TYPE_LABEL[s.type] || { ko: '', en: '' };
      // "쉬는 날" (break/holiday = no class) gets red emphasis so it's easy to scan.
      const isOff = s.type === 'break' || s.type === 'holiday';
      return `<div class="schedule-row${isOff ? ' schedule-row--off' : ''}">
        <div class="schedule-row__date">${s.date || ''}</div>
        <div class="schedule-row__body">
          <span class="schedule-tag schedule-tag--${s.type || 'event'}">
            <span class="i18n-ko">${t.ko}</span><span class="i18n-en">${t.en}</span>
          </span>
          <h4 class="schedule-row__title">
            <span class="i18n-ko">${s.titleKo || ''}</span>
            <span class="i18n-en">${s.titleEn || s.titleKo || ''}</span>
          </h4>
          ${s.descKo || s.descEn ? `<p class="schedule-row__desc">
            <span class="i18n-ko">${s.descKo || ''}</span>
            <span class="i18n-en">${s.descEn || ''}</span>
          </p>` : ''}
        </div>
      </div>`;
    }).join('');
    applyLangVisibility(list, i18n.getLang());
  }

  /* ── Init ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initActiveNav();
    initNav();
    initNotices();
    initGallery();
    initSchedule();
    initContactForm();
    initReveal();
    initFocus();
    initSkipLink();
  });
})();
