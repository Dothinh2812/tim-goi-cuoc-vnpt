/**
 * Smart CTA — Responsive Call-to-Action
 * Mobile: giữ tel: link (gọi trực tiếp)
 * Desktop: chuyển sang Zalo chat (hoạt động tốt trên web)
 */

const ZALO_URL = 'https://zalo.me/0822036382';

function isMobileDevice(): boolean {
  // Check screen width first (most reliable for responsive)
  if (window.innerWidth <= 768) return true;

  // Fallback to User Agent for tablets that may have larger screens
  const ua = navigator.userAgent || navigator.vendor || '';
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
}

function swapCtaForDesktop(): void {
  if (isMobileDevice()) return; // Mobile: keep tel: links

  // --- 1. Swap all CTA buttons marked with data-smart-cta ---
  document.querySelectorAll<HTMLAnchorElement>('[data-smart-cta]').forEach(el => {
    const ctaType = el.getAttribute('data-smart-cta');

    // Change href to Zalo
    el.href = ZALO_URL;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');

    // Update text based on CTA type
    if (ctaType === 'register') {
      // Pricing card buttons: "Đăng Ký Ngay" / "Gọi Đăng Ký"
      el.textContent = 'Chat Zalo Đăng Ký';
    } else if (ctaType === 'call-main') {
      // Main CTA "Gọi: 0822 036 382"
      const svgEl = el.querySelector('svg');
      const zaloSvg = createZaloIcon();
      if (svgEl) {
        svgEl.replaceWith(zaloSvg);
      }
      // Update text node
      const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      textNodes.forEach(n => {
        if (n.textContent && n.textContent.trim().includes('0822')) {
          n.textContent = ' Chat Zalo tư vấn ';
        }
      });
    } else if (ctaType === 'call-hotline') {
      // Revert the Zalo href swap and keep the original phone number functionality + text
      el.href = 'tel:0822036382';
      el.removeAttribute('target');
      el.removeAttribute('rel');
      
      const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      textNodes.forEach(n => {
        if (n.textContent && n.textContent.trim().includes('0822')) {
          n.textContent = ' Hotline: 0822 036 382 ';
        }
      });
    } else if (ctaType === 'call-cta') {
      // Generic CTA button with phone icon + text
      const svgEl = el.querySelector('svg');
      const zaloSvg = createZaloIcon();
      if (svgEl) {
        svgEl.replaceWith(zaloSvg);
      }
      const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      textNodes.forEach(n => {
        if (n.textContent) {
          n.textContent = n.textContent
            .replace(/Gọi Ngay:\s*0822\s*036\s*382/i, 'Chat Zalo Đăng Ký')
            .replace(/Gọi:\s*0822\s*036\s*382/i, 'Chat Zalo Tư Vấn');
        }
      });
    } else if (ctaType === 'contact-link') {
      // Simple contact link
      const svgEl = el.querySelector('svg');
      if (svgEl) {
        const zaloSvg = createZaloIcon('w-6 h-6');
        svgEl.replaceWith(zaloSvg);
      }
      const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      textNodes.forEach(n => {
        if (n.textContent && n.textContent.trim().includes('0822')) {
          n.textContent = ' Chat Zalo: 0822 036 382 ';
        }
      });
    }
  });

  // --- 2. Hide phone floating button, only keep Zalo ---
  const floatingPhone = document.querySelector<HTMLElement>('[data-floating-phone]');
  if (floatingPhone) {
    floatingPhone.style.display = 'none';
  }
}

function createZaloIcon(extraClass = 'w-6 h-6'): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', `${extraClass} fill-current`);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z');
  svg.appendChild(path);
  return svg;
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', swapCtaForDesktop);
} else {
  swapCtaForDesktop();
}

// Export for use in package-finder.ts
export { isMobileDevice, ZALO_URL };
