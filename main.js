/**
 * =========================================================
 * LU YE // 04 · HIGH PERFORMANCE TECHNICAL DOSSIER
 * INTERACTION CONTROLLER & TELEMETRY SUBSYSTEM (MAIN.JS)
 * =========================================================
 */

(function () {
  'use strict';

  // ---------- 1. REAL-TIME TELEMETRY CLOCK ----------
  const timestampEl = document.getElementById('telemetry-timestamp');
  const footerYearEl = document.getElementById('footer-year');

  function updateTelemetryClock() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} CST`;
    if (timestampEl) {
      timestampEl.textContent = timeStr;
    }
  }

  setInterval(updateTelemetryClock, 1000);
  updateTelemetryClock();

  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  // ---------- 2. ARCHITECTURE TOPOLOGY INSPECTOR TABS ----------
  const tabs = document.querySelectorAll('.insp-tab');
  const panels = document.querySelectorAll('.console-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Update active states
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ---------- 3. HUD SCROLL STATE & ACTIVE LINK SPY ----------
  const hudHeader = document.getElementById('hud-header');
  const navLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
  const trackedSections = navLinks
    .map((link) => {
      const href = link.getAttribute('href');
      const section = document.querySelector(href);
      return { link, section };
    })
    .filter((item) => item.section !== null);

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header style on scroll
    if (hudHeader) {
      if (scrollY > 30) {
        hudHeader.classList.add('scrolled');
      } else {
        hudHeader.classList.remove('scrolled');
      }
    }

    // Scroll spy for navigation
    const triggerY = scrollY + window.innerHeight * 0.35;
    let activeLink = null;

    for (let i = 0; i < trackedSections.length; i++) {
      const top = trackedSections[i].section.offsetTop;
      const height = trackedSections[i].section.offsetHeight;
      if (triggerY >= top && triggerY < top + height) {
        activeLink = trackedSections[i].link;
        break;
      }
    }

    navLinks.forEach((link) => {
      if (link === activeLink) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- 4. TOAST NOTIFICATION & ONE-CLICK COPY ----------
  const toast = document.getElementById('hud-toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function triggerToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;

    toast.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  function copyText(str) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(str)
        .then(() => {
          triggerToast(`SYSTEM // 已复制到剪贴板: ${str}`);
        })
        .catch(() => {
          fallbackCopy(str);
        });
    } else {
      fallbackCopy(str);
    }
  }

  function fallbackCopy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      triggerToast(`SYSTEM // 已复制到剪贴板: ${str}`);
    } catch (e) {
      triggerToast(`ERROR // 复制失败: ${str}`);
    }
    document.body.removeChild(el);
  }

  // Bind copy triggers to buttons
  document.querySelectorAll('.btn-copy-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.getAttribute('data-text');
      if (text) copyText(text);
    });
  });

  // Bind copy triggers to cards
  document.querySelectorAll('.cc-action-card[data-copy]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.classList.contains('cca-btn')) {
        return; // Allow direct link to trigger
      }
      const text = card.getAttribute('data-copy');
      if (text) copyText(text);
    });
  });

  // ---------- 5. SMOOTH IN-PAGE ANCHOR SCROLLING ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = hudHeader ? hudHeader.offsetHeight : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
})();
