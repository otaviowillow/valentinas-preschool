const ISO = /^\d{4}-\d{2}-\d{2}$/;

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso: string): string {
  return parseIso(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function todayIso(): string {
  return toIso(new Date());
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function bindDatePicker(root: HTMLElement) {
  if (root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const min = root.dataset.min ?? '';
  const max = root.dataset.max ?? '';
  const hidden = root.querySelector('input[type="hidden"]') as HTMLInputElement | null;
  const trigger = root.querySelector('.date-picker__trigger') as HTMLButtonElement | null;
  const valueEl = root.querySelector('.date-picker__value') as HTMLElement | null;
  const popover = root.querySelector('.date-picker__popover') as HTMLElement | null;
  const monthEl = root.querySelector('.date-picker__month') as HTMLElement | null;
  const grid = root.querySelector('.date-picker__grid') as HTMLElement | null;
  const prevBtn = root.querySelector('[data-dir="prev"]') as HTMLButtonElement | null;
  const nextBtn = root.querySelector('[data-dir="next"]') as HTMLButtonElement | null;
  const clearBtn = root.querySelector('.date-picker__clear') as HTMLButtonElement | null;
  const todayBtn = root.querySelector('.date-picker__today') as HTMLButtonElement | null;

  if (!hidden || !trigger || !valueEl || !popover || !monthEl || !grid) return;

  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selected = '';

  const inRange = (iso: string) => {
    if (!ISO.test(iso)) return false;
    if (min && iso < min) return false;
    if (max && iso > max) return false;
    return true;
  };

  const setSelected = (iso: string) => {
    if (iso && !inRange(iso)) return;
    selected = iso;
    hidden.value = iso;
    if (iso) {
      valueEl.textContent = formatDisplay(iso);
      valueEl.classList.add('is-set');
    } else {
      valueEl.textContent = 'Select a date';
      valueEl.classList.remove('is-set');
    }
    render();
  };

  const close = () => {
    popover.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    if (selected) {
      const d = parseIso(selected);
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
    }
    render();
    popover.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  };

  const canGoPrev = () => {
    if (!min) return true;
    const lastOfPrevMonth = toIso(new Date(viewYear, viewMonth, 0));
    return lastOfPrevMonth >= min;
  };

  const canGoNext = () => {
    if (!max) return true;
    const firstOfNextMonth = toIso(new Date(viewYear, viewMonth + 1, 1));
    return firstOfNextMonth <= max;
  };

  const render = () => {
    monthEl.textContent = monthLabel(viewYear, viewMonth);
    if (prevBtn) prevBtn.disabled = !canGoPrev();
    if (nextBtn) nextBtn.disabled = !canGoNext();

    grid.replaceChildren();
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = todayIso();

    for (let i = 0; i < firstDow; i++) {
      const pad = document.createElement('span');
      pad.className = 'date-picker__day is-empty';
      pad.setAttribute('aria-hidden', 'true');
      grid.appendChild(pad);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIso(new Date(viewYear, viewMonth, day));
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-picker__day';
      btn.textContent = String(day);
      btn.setAttribute('role', 'gridcell');
      btn.dataset.date = iso;

      if (iso === today) btn.classList.add('is-today');
      if (iso === selected) btn.classList.add('is-selected');
      if (!inRange(iso)) btn.disabled = true;

      btn.addEventListener('click', () => {
        setSelected(iso);
        close();
      });
      grid.appendChild(btn);
    }
  };

  trigger.addEventListener('click', () => {
    if (popover.hidden) open();
    else close();
  });

  prevBtn?.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    render();
  });

  nextBtn?.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    render();
  });

  clearBtn?.addEventListener('click', () => {
    setSelected('');
    close();
  });

  todayBtn?.addEventListener('click', () => {
    const t = todayIso();
    if (inRange(t)) {
      setSelected(t);
      close();
    }
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target as Node)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popover.hidden) close();
  });

  render();
}

export function initDatePickers() {
  document.querySelectorAll('.date-picker').forEach((el) => {
    if (el instanceof HTMLElement) bindDatePicker(el);
  });
}
