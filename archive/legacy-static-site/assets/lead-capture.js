'use strict';

// Replace this URL after deploying Google Apps Script Web App.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvKt_Jkcbx6KHtKcLpWJBgjN1riJa4wKnCAqW5vHOMI3f-q-qXItDQfsIqeQDYAHGvBg/exec';

function getLeadForm() {
  const phoneInput = document.getElementById('bottomPhone');
  if (phoneInput && phoneInput.form) return phoneInput.form;
  return document.querySelector('form[onsubmit*="this.reset()"]') || document.querySelector('form');
}

function createStatusElement(form) {
  let statusEl = form.querySelector('[data-lead-status]');
  if (statusEl) return statusEl;

  statusEl = document.createElement('p');
  statusEl.setAttribute('data-lead-status', '1');
  statusEl.style.marginTop = '12px';
  statusEl.style.fontSize = '14px';
  statusEl.style.color = 'rgba(255,255,255,0.95)';
  statusEl.style.display = 'none';
  form.appendChild(statusEl);
  return statusEl;
}

function normalizePhone(rawPhone) {
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

function buildPayload(phone) {
  return {
    timestamp: new Date().toISOString(),
    phone: phone,
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title || '',
    referrer: document.referrer || '',
    ip_hint: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    user_agent: navigator.userAgent || '',
    ...getUtmParams(),
  };
}

async function submitLead(payload) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  let result = null;
  try {
    result = await response.json();
  } catch (error) {
    // Ignore parse error and fall back to HTTP status handling below.
  }

  if (!response.ok) {
    throw new Error('request_failed');
  }
  if (result && result.status && result.status !== 'success') {
    throw new Error(result.message || 'save_failed');
  }
  return result;
}

function wireLeadForm() {
  const form = getLeadForm();
  if (!form) return;

  // Remove old fake submission handler.
  form.removeAttribute('onsubmit');

  const phoneInput = form.querySelector('input[name="phone"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = createStatusElement(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const phone = normalizePhone(phoneInput ? phoneInput.value : '');
    if (!/^\d{10,11}$/.test(phone)) {
      statusEl.textContent = 'So dien thoai khong hop le. Vui long nhap 10-11 chu so.';
      statusEl.style.display = 'block';
      return;
    }

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_')) {
      statusEl.textContent = 'Chua cau hinh URL Apps Script. Vui long cap nhat trong lead-capture.js.';
      statusEl.style.display = 'block';
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : '';
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
      statusEl.textContent = 'Gui thong tin that bai. Vui long thu lai hoac goi 0822 036 382.';
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
