import { isValidEmail, isValidPhone, digitsOnlyPhone } from '../lib/contact-form-validation';
import {
  CHILD_AGE_MAX_MONTHS,
  CHILD_AGE_MIN_MONTHS,
} from '../lib/inquiries';

export function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form || form.dataset.validationBound === 'true') return;
  form.dataset.validationBound = 'true';

  const params = new URLSearchParams(location.search);
  const intent = params.get('intent');
  const radios = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="intent"]')
  );
  const wasReferred = document.getElementById('was-referred');
  const referredBy = document.querySelector('.referred-by');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const referredInput = document.getElementById('referred');
  const parentInput = document.getElementById('parent');
  const childAgeInput = document.getElementById('childage');
  const submitBtn = form.querySelector('button[type="submit"]');
  const formTs = document.getElementById('form_ts');
  if (formTs instanceof HTMLInputElement) formTs.value = String(Date.now());

  let emailTouched = false;

  function isChildAgeValid(): boolean {
    if (!(childAgeInput instanceof HTMLInputElement)) return false;
    const raw = childAgeInput.value.trim();
    if (!raw) return false;
    const age = Number(raw);
    return (
      Number.isInteger(age) &&
      age >= CHILD_AGE_MIN_MONTHS &&
      age <= CHILD_AGE_MAX_MONTHS
    );
  }

  function isFormReady(): boolean {
    if (!(parentInput instanceof HTMLInputElement)) return false;
    if (!parentInput.value.trim()) return false;
    if (!(emailInput instanceof HTMLInputElement)) return false;
    if (!isValidEmail(emailInput.value)) return false;
    if (!(phoneInput instanceof HTMLInputElement)) return false;
    if (!isValidPhone(phoneInput.value)) return false;
    return isChildAgeValid();
  }

  function syncSubmitState() {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = !isFormReady();
    }
  }

  function setFieldError(
    input: HTMLInputElement | null,
    errorEl: HTMLElement | null,
    message: string
  ) {
    if (!input || !errorEl) return;
    errorEl.textContent = message;
    if (message) errorEl.removeAttribute('hidden');
    else errorEl.setAttribute('hidden', '');
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateEmail(requireValue = false) {
    if (!(emailInput instanceof HTMLInputElement)) return true;
    const value = emailInput.value.trim();
    let message = '';
    if (!value) {
      if (requireValue || emailTouched) message = 'Email is required';
    } else if (!isValidEmail(value)) {
      message = 'Enter a valid email address';
    }
    setFieldError(emailInput, emailError, message);
    return !message;
  }

  function validatePhone() {
    if (!(phoneInput instanceof HTMLInputElement)) return true;
    const value = phoneInput.value.trim();
    let message = '';
    if (value && !isValidPhone(value)) {
      message = 'Enter a valid 10-digit phone number';
    }
    setFieldError(phoneInput, phoneError, message);
    return !message;
  }

  function syncReferredField() {
    const showReferral =
      wasReferred instanceof HTMLInputElement && wasReferred.checked;
    if (referredBy instanceof HTMLElement) referredBy.hidden = !showReferral;
    if (referredInput instanceof HTMLInputElement) {
      referredInput.disabled = !showReferral;
      if (!showReferral) referredInput.value = '';
    }
  }

  if (intent && radios.some((r) => r.value === intent)) {
    radios.forEach((r) => (r.checked = r.value === intent));
  }
  if (
    (params.get('referred') === '1' || intent === 'referral') &&
    wasReferred instanceof HTMLInputElement
  ) {
    wasReferred.checked = true;
  }
  wasReferred?.addEventListener('change', syncReferredField);
  syncReferredField();

  parentInput?.addEventListener('input', syncSubmitState);
  childAgeInput?.addEventListener('input', syncSubmitState);

  emailInput?.addEventListener('input', () => {
    emailTouched = true;
    validateEmail();
    syncSubmitState();
  });
  emailInput?.addEventListener('blur', () => {
    emailTouched = true;
    validateEmail(true);
    syncSubmitState();
  });
  phoneInput?.addEventListener('beforeinput', (e) => {
    if (!(e instanceof InputEvent) || !e.data || e.data.length !== 1) return;
    if (/\D/.test(e.data)) e.preventDefault();
  });
  phoneInput?.addEventListener('input', () => {
    if (!(phoneInput instanceof HTMLInputElement)) return;
    const cleaned = digitsOnlyPhone(phoneInput.value);
    if (phoneInput.value !== cleaned) phoneInput.value = cleaned;
    validatePhone();
    syncSubmitState();
  });
  phoneInput?.addEventListener('blur', () => {
    validatePhone();
    syncSubmitState();
  });

  form.addEventListener('submit', (e) => {
    emailTouched = true;
    const emailOk = validateEmail(true);
    const phoneOk = validatePhone();
    if (!emailOk || !phoneOk) {
      e.preventDefault();
      if (!emailOk && emailInput instanceof HTMLInputElement) emailInput.focus();
      else if (!phoneOk && phoneInput instanceof HTMLInputElement) phoneInput.focus();
    }
  });

  if (new URLSearchParams(location.search).get('error') === '1') {
    const banner = document.getElementById('form-error');
    if (banner instanceof HTMLElement) banner.hidden = false;
  }

  syncSubmitState();
}
