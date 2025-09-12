// search-wrapper-loader.js
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('searchOverlay');
  const modal   = document.getElementById('searchModal');
  const trigger = document.querySelector('.search-tutorial-btn');

  // Load the transcript data FIRST, then the live-search behavior.
  const REQUIRED_SCRIPTS = [
    'tutorial-transcript.js', // defines window.TUTORIAL_INDEX (array of { title, transcript })
    'search-wrapper.js'       // defines window.SearchWrapperMount (mounts live search UI)
  ];

  if (!overlay || !modal || !trigger) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  async function openModal() {
    // Show overlay + empty shell first (prevents flash)
    overlay.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    try {
      // 1) Inject the HTML fragment for the modal body
      const res = await fetch('search-wrapper.html', { cache: 'no-store' });
      if (!res.ok) throw new Error(`fetch search-wrapper.html: ${res.status}`);
      modal.innerHTML = await res.text();

      // 2) Ensure required scripts are loaded (in order)
      for (const src of REQUIRED_SCRIPTS) {
        await ensureScript(src);
      }

      // 3) Close handlers
      const close = () => {
        overlay.hidden = true;
        modal.hidden   = true;
        document.body.style.overflow = '';
        modal.innerHTML = '';
        window.removeEventListener('keydown', onEsc);
      };
      const onEsc = (ev) => { if (ev.key === 'Escape') close(); };
      overlay.addEventListener('click', close, { once: true });
      window.addEventListener('keydown', onEsc);

      // 4) Navigate handler: DO NOT change window.location.
      //    Emit an event the host UI can handle to open the section in-place.
      const navigate = (layer /* title only, url ignored */) => {
        window.dispatchEvent(new CustomEvent('search:openTutorial', {
          detail: { title: layer }
        }));
        close();
      };

      // 5) Mount the live search behavior
      if (typeof window.SearchWrapperMount !== 'function') {
        console.error('SearchWrapperMount is missing (search-wrapper.js not loaded?)');
        // Fallback: allow the X button to close even if mount failed
        modal.querySelector('#closeSearch')?.addEventListener('click', close);
        return;
      }
      window.SearchWrapperMount(modal, { close, navigate });

      // 6) Focus the input
      modal.querySelector('#searchInput')?.focus();

      // Debug: confirm data is present
      console.log('TUTORIAL_INDEX length:', (window.TUTORIAL_INDEX || []).length);

    } catch (err) {
      console.error(err);
      modal.innerHTML = `
        <div style="padding:16px">
          <h2 style="margin:0 0 8px;color:#b91c1c;">Couldn’t load search</h2>
          <p style="margin:0 0 12px;color:#374151;">${String(err)}</p>
          <button id="retryFetch" class="sw-btn" type="button">Retry</button>
        </div>`;
      modal.querySelector('#retryFetch')?.addEventListener('click', () => {
        modal.innerHTML = '';
        openModal();
      });
    }
  }

  function ensureScript(src) {
    return new Promise((resolve, reject) => {
      // Already loaded?
      if ([...document.scripts].some(s => (s.src || '').endsWith(src))) return resolve();
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = () => reject(new Error('failed to load ' + src));
      document.body.appendChild(el);
    });
  }
});
