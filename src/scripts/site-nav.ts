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
