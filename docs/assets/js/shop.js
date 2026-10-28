document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const closeButtons = document.querySelectorAll('[data-menu-close]');
  let priorFocus = null;

  function closeMenu(restoreFocus = true) {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('nav-is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus && priorFocus && typeof priorFocus.focus === 'function') {
      priorFocus.focus({preventScroll: true});
    }
    priorFocus = null;
  }

  function openMenu() {
    if (!menu || !toggle) return;
    priorFocus = document.activeElement;
    menu.classList.add('is-open');
    document.body.classList.add('nav-is-open');
    toggle.setAttribute('aria-expanded', 'true');
    const firstFocusable = menu.querySelector('[data-menu-close], a');
    if (firstFocusable) firstFocusable.focus({preventScroll: true});
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    closeButtons.forEach(function (button) {
      button.addEventListener('click', function () { closeMenu(); });
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (!menu.classList.contains('is-open')) return;
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(menu.querySelectorAll('a, button')).filter(function (el) {
        return !el.disabled && getComputedStyle(el).display !== 'none';
      });
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length-1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 700 && menu.classList.contains('is-open')) {
        closeMenu(false);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const anchor = link.getAttribute('href');
      if (anchor.length < 2) return;
      const target = document.getElementById(anchor.slice(1));
      if (target) { event.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
});
