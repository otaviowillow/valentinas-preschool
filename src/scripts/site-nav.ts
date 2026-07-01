/** Same-page link clicks — scroll in place without a full reload. */
export function bindSamePageNav() {
  if (document.documentElement.dataset.samePageNavBound === 'true') return;
  document.documentElement.dataset.samePageNavBound = 'true';

  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest('a[href]');
      if (!a || a.target === '_blank' || a.origin !== location.origin) return;
      const target = new URL(a.href);
      const here = new URL(location.href);
      if (
        target.pathname !== here.pathname ||
        target.search !== here.search
      ) {
        return;
      }
      e.preventDefault();
      const next = target.pathname + target.search + target.hash;
      if (target.hash) history.pushState(null, '', next);
      else history.replaceState(null, '', next);
      if (target.hash) {
        document.querySelector(target.hash)?.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
    },
    true
  );
}

/** Close the mobile nav when tapping outside or following a link. */
export function bindMobileNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('nav-toggle') as HTMLInputElement | null;
  if (!header || !toggle || header.dataset.mobileNavBound === 'true') return;
  header.dataset.mobileNavBound = 'true';

  document.addEventListener('click', (e) => {
    if (!toggle.checked) return;
    const target = e.target as Node;
    if (header.contains(target)) return;
    toggle.checked = false;
  });

  header.querySelectorAll('.nav__link, .nav__cta .btn').forEach((el) => {
    el.addEventListener('click', () => {
      toggle.checked = false;
    });
  });
}
