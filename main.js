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
  function initNotices() {
    if (typeof noticesData === 'undefined' || !noticesData.length) return;

    injectModalStyles();

    // Create modal element
    const modal = buildModal();
    document.body.appendChild(modal);

    // Render on notices page
    const grid = document.getElementById('notices-grid');
    if (grid) renderGrid(grid, noticesData, modal, false);

    // Render latest 3 on home page
    const homeGrid = document.getElementById('home-notices-grid');
    if (homeGrid) renderGrid(homeGrid, noticesData.slice(0, 3), modal, true);
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
          <span class="badge badge--${n.badge}">
            <span class="i18n-ko">${n.badgeKo}</span>
            <span class="i18n-en">${n.badgeEn}</span>
          </span>
          <h4>
            <span class="i18n-ko">${n.titleKo}</span>
            <span class="i18n-en">${n.titleEn}</span>
          </h4>
          <p>
            <span class="i18n-ko">${n.summaryKo}</span>
            <span class="i18n-en">${n.summaryEn}</span>
          </p>
          <span class="notice-card__date">${n.date}</span>
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
      ['notices-grid', 'home-notices-grid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) applyLangVisibility(el, i18n.getLang());
      });
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

  /* ── Init ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initNav();
    initNotices();
    initContactForm();
    initReveal();
    initFocus();
    initSkipLink();
  });
})();
