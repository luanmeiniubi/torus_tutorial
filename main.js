// main.js
console.log('main.js loaded');

(function () {
  /* =========================
     Tiny DOM helpers
  ========================= */
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);

  // Normalize sidebar badges: move inner text -> data-label, hide from name
document.querySelectorAll('.submenu .badge').forEach(badge => {
  if (!badge.hasAttribute('data-label')) {
    badge.setAttribute('data-label', badge.textContent.trim());
    badge.textContent = '';                 // remove real text node
  }
  badge.setAttribute('aria-hidden', 'true'); // keep it out of accessible name
});

  /* =========================
     Robust matching helpers
  ========================= */
  const _norm = (s) => String(s || '')
    .toLowerCase()
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")   // normalize smart quotes
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s'"]/gu, ' ')           // keep letters/numbers/quotes/spaces
    .trim();

  const _tokens = (s) => _norm(s).split(' ').filter(Boolean);

  function _score(label, wanted) {
    const a = _tokens(label);
    const b = _tokens(wanted);
    if (!a.length || !b.length) return 0;

    if (a.join(' ') === b.join(' ')) return 100; // exact normalized match

    const aset = new Set(a);
    const hits = b.filter(t => aset.has(t)).length;
    const coverage = hits / b.length; // 0..1

    const aStr = a.join(' ');
    const bStr = b.join(' ');
    const starts = aStr.startsWith(bStr) ? 0.2 : 0;
    const incl   = aStr.includes(bStr)    ? 0.1 : 0;

    return Math.round((coverage * 80) + (starts * 10) + (incl * 10)); // ~0..100
  }

  // Optional aliases if sidebar labels differ from titles
  const TITLE_ALIASES = {
    // 'Create a New Project': 'Create New Project',
    // 'Learning Objectives': 'Objectives',
     'Project Attributes': 'Project Attributions',
     'Project Labels': 'Project Labels',
  };

  function findMenuItemByTitleSmart(title) {
    const wanted = TITLE_ALIASES[title] || title || '';
    const esc = (v) => (window.CSS && CSS.escape) ? CSS.escape(v) : v;

    // Fast path: exact attributes
    let li =
      document.querySelector(`.submenu li[data-section="${esc(wanted)}"]`) ||
      document.querySelector(`.submenu li[data-title="${esc(wanted)}"]`);
    if (li) return li;

    // Score all <li> by label/attrs/text
    let best = null, bestScore = 0;
    $all('.submenu li').forEach(el => {
      const label = el.getAttribute('data-section') ||
                    el.getAttribute('data-title') ||
                    el.textContent || '';
      const s = _score(label, wanted);
      if (s > bestScore) { best = el; bestScore = s; }
    });
    return bestScore >= 60 ? best : null;
  }

  /* =========================
     Scroll helpers (sidebar container)
  ========================= */
  function getScrollContainer(el) {
    let node = el?.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const overflowY = style.overflowY;
      if (/(auto|scroll|overlay)/i.test(overflowY) && node.scrollHeight > node.clientHeight) {
        return node;
      }
      node = node.parentElement;
    }
    return document.querySelector('.sidebar') || document.scrollingElement || document.documentElement;
  }

  function scrollIntoViewWithin(container, target) {
    if (!container || !target) return;
    // center the item in the container
    const offsetTop = target.offsetTop - container.offsetTop;
    const targetCenter = offsetTop - (container.clientHeight / 2) + (target.clientHeight / 2);
    container.scrollTo({ top: Math.max(0, targetCenter), behavior: 'smooth' });
  }

  /* =========================
     Selection + content loading
  ========================= */
  function selectMenuItem(li) {
    $all('.submenu li.selected').forEach(el => el.classList.remove('selected'));
    li.classList.add('selected');
  }

  function loadPage(page) {
    const contentEl = $('.content');
    if (!page || !contentEl) return;
    fetch(page)
      .then(r => r.text())
      .then(html => {
        contentEl.innerHTML = html;
        if (window.hydrateInjectedVideo) {
          try { window.hydrateInjectedVideo(contentEl); } catch (e) { console.warn(e); }
        }
      })
      .catch(err => {
        console.error('Error loading content:', err);
        contentEl.innerHTML = `<p>Failed to load content.</p>`;
      });
  }

  function bindSubmenuClicks() {
    $all('.submenu li').forEach(item => {
      if (item._bound) return; // avoid double-binding
      item._bound = true;
      item.addEventListener('click', () => {
        selectMenuItem(item);
        const page = item.getAttribute('data-page');
        loadPage(page);
      }, { passive: true });
    });
  }
  bindSubmenuClicks();

// -- Home button: jump to "Get Started: Logging In", scroll, and spotlight
const HOME_TARGET_PAGE = 'pages/introduction/logging-in.html';

const homeBtn = document.querySelector('.home-btn');
if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    // find the target <li>
    const li = document.querySelector(`.submenu li[data-page="${HOME_TARGET_PAGE}"]`);
    if (!li) { console.warn('Home target page not found:', HOME_TARGET_PAGE); return; }

    // expand its section if collapsed
    const submenu = li.closest('.submenu');
    if (submenu && submenu.classList.contains('collapsed')) {
      const header = submenu.previousElementSibling;
      if (header && (header.classList.contains('section-title') || header.classList.contains('section-header'))) {
        header.click(); // uses existing toggle logic
      } else {
        submenu.classList.remove('collapsed');
      }
    }

    // select + load (reuse existing click binding on <li>)
    selectMenuItem(li);
    li.click(); // triggers your existing loadPage via bindSubmenuClicks()

    // scroll the sidebar container so the item "pops" into view
    const container = getScrollContainer(li);
    scrollIntoViewWithin(container, li);

    // spotlight animation (home-only)
    li.classList.add('spotlight');
    setTimeout(() => li.classList.remove('spotlight'), 1100);
  });
}

  /* =========================
     Sidebar toggle (mobile/offcanvas)
  ========================= */
  const toggleBtn = $('#menu-toggle');
  const mainContainer = $('.main-container');
  toggleBtn?.addEventListener('click', () => {
    mainContainer?.classList.toggle('offcanvas');
  });

  /* =========================
     Section collapse/expand
     (matches CSS: .submenu.collapsed { display:none; })
  ========================= */
  function initSectionToggles() {
    $all('.section-title, .section-header').forEach((header) => {
      const submenu = header.nextElementSibling;
      if (!submenu || !submenu.classList.contains('submenu')) return;

      // Initialize from DOM
      const isCollapsed = submenu.classList.contains('collapsed');
      header.classList.toggle('open', !isCollapsed);
      header.classList.toggle('closed', isCollapsed);
      header.setAttribute('aria-expanded', String(!isCollapsed));

      const textIcon = header.querySelector('.toggle-icon, .dropdown-icon'); // text chevron
      const setIcon = (collapsed) => { if (textIcon) textIcon.textContent = collapsed ? '▶' : '▼'; };
      setIcon(isCollapsed);

      const toggle = () => {
        const willCollapse = !submenu.classList.contains('collapsed'); // invert
        submenu.classList.toggle('collapsed', willCollapse);
        header.classList.toggle('open', !willCollapse);
        header.classList.toggle('closed', willCollapse);
        header.setAttribute('aria-expanded', String(!willCollapse));
        setIcon(willCollapse);
      };

      header.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }
  initSectionToggles();

  /* =========================
     Open from search modal
     - accepts detail.title or detail.layer
     - expands section, selects, loads, scrolls container, spotlight pulse
  ========================= */
  /* Open from search modal: expands section, selects, loads, scrolls, spotlight */
window.addEventListener('search:openTutorial', (e) => {
  // 🔧 FORCE SIDEBAR OPEN
  const mainContainer = document.querySelector('.main-container');
  const sidebar       = document.querySelector('.sidebar');
  mainContainer?.classList.remove('offcanvas', 'collapsed'); // slide-in + rail modes OFF
  sidebar?.classList.remove('collapsed');                    // ensure sidebar itself isn't collapsed

  const title = (e.detail && (e.detail.title || e.detail.layer)) || '';
  if (!title) return;

  const li = findMenuItemByTitleSmart(title);
  if (!li) {
    console.warn('No menu item matched:', title);
    return;
  }

  // Expand its section if needed
  const submenu = li.closest('.submenu');
  if (submenu && submenu.classList.contains('collapsed')) {
    const header = submenu.previousElementSibling;
    if (header && (header.classList.contains('section-title') || header.classList.contains('section-header'))) {
      header.click();
    } else {
      submenu.classList.remove('collapsed');
    }
  }

  // Select and load via existing handler
  selectMenuItem(li);
  li.click();

  // Scroll the correct container (sidebar)
  const container = getScrollContainer(li);
  scrollIntoViewWithin(container, li);

  // Spotlight pulse
  li.classList.add('spotlight');
  setTimeout(() => li.classList.remove('spotlight'), 1100);
});


})();
