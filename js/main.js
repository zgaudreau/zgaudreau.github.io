(function () {
  const HASH = 'aeaa2cec33e27d65690e726e1710d3f4a99a2bf0ae9a3bd9087488f1dfb4d38d';
  const form = document.getElementById('gate-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const input = document.getElementById('gate-input');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
    const hash = [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');

    if (hash === HASH) {
      try { localStorage.setItem('zgaudreau_auth', '1'); } catch (_) {}
      document.documentElement.removeAttribute('data-gated');
    } else {
      input.classList.add('shake');
      input.addEventListener('animationend', function () {
        input.classList.remove('shake');
        input.value = '';
        input.focus();
      }, { once: true });
    }
  });
})();

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? 'Close' : 'Menu';
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const html = document.documentElement;

    function updateLabel() {
      const isDark = html.getAttribute('data-theme') === 'dark';
      themeToggle.textContent = isDark ? 'LIGHT' : 'DARK';
      themeToggle.setAttribute('aria-pressed', String(isDark));
    }

    updateLabel();

    themeToggle.addEventListener('click', function () {
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateLabel();
    });
  }
});
