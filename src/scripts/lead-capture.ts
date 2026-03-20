const GOOGLE_SCRIPT_URL = import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL || '';

function getLeadForm() {
  const phoneInput = document.getElementById('bottomPhone') as HTMLInputElement | null;
  if (phoneInput?.form) {
    return phoneInput.form;
  }

  return (
    document.querySelector<HTMLFormElement>('form[onsubmit*="this.reset()"]') ||
    document.querySelector<HTMLFormElement>('form')
  );
}

function createStatusElement(form: HTMLFormElement) {
  let statusEl = form.querySelector<HTMLElement>('[data-lead-status]');
  if (statusEl) {
    return statusEl;
  }

  statusEl = document.createElement('p');
  statusEl.setAttribute('data-lead-status', '1');
  statusEl.style.marginTop = '12px';
  statusEl.style.fontSize = '14px';
  statusEl.style.color = 'rgba(255,255,255,0.95)';
  statusEl.style.display = 'none';
  form.appendChild(statusEl);
  return statusEl;
}

function normalizePhone(rawPhone: string) {
  return String(rawPhone || '').replace(/\D+/g, '');
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  };
}

function buildPayload(phone: string) {
  return {
    timestamp: new Date().toISOString(),
    phone,
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title || '',
    referrer: document.referrer || '',
    ip_hint: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    user_agent: navigator.userAgent || '',
    ...getUtmParams(),
  };
}

async function submitLead(payload: ReturnType<typeof buildPayload>) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  let result: { status?: string; message?: string } | null = null;
  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    // Ignore parse errors and rely on HTTP status below.
  }

  if (!response.ok) {
    const isAccessDenied =
      response.status === 401 ||
      response.status === 403 ||
      /truy cap bi tu choi|ban can co quyen truy cap|access denied/i.test(responseText);
    throw new Error(isAccessDenied ? 'access_denied' : `request_failed_${response.status}`);
  }

  if (result?.status && result.status !== 'success') {
    throw new Error(result.message || 'save_failed');
  }
}

function wireLeadForm() {
  const form = getLeadForm();
  if (!form) {
    return;
  }

  form.removeAttribute('onsubmit');

  const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const statusEl = createStatusElement(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const phone = normalizePhone(phoneInput?.value || '');
    if (!/^\d{10,11}$/.test(phone)) {
      statusEl.textContent = 'So dien thoai khong hop le. Vui long nhap 10-11 chu so.';
      statusEl.style.display = 'block';
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      statusEl.textContent = 'Chua cau hinh URL Apps Script. Vui long cap nhat PUBLIC_GOOGLE_SCRIPT_URL.';
      statusEl.style.display = 'block';
      return;
    }

    const originalBtnText = submitBtn?.textContent || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Dang gui...';
      submitBtn.style.opacity = '0.75';
    }
    statusEl.style.display = 'none';

    try {
      await submitLead(buildPayload(phone));
      form.reset();
      statusEl.textContent = 'Cam on ban. Chung toi se lien he trong thoi gian som nhat.';
      statusEl.style.display = 'block';
    } catch (error) {
      statusEl.textContent =
        error instanceof Error && error.message === 'access_denied'
          ? 'He thong tu van dang loi phan quyen. Vui long goi 0822 036 382 de duoc ho tro ngay.'
          : 'Gui thong tin that bai. Vui long thu lai hoac goi 0822 036 382.';
      statusEl.style.display = 'block';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText || 'Tu van cho toi';
        submitBtn.style.opacity = '';
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireLeadForm);
} else {
  wireLeadForm();
}
