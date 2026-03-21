import { CATEGORIES, PACKAGES } from '../data/packages';

'use strict';

// ============================================================
//  APP.JS – VNPT Gói Cước Finder
//  Tab 1: Filter & Sort  |  Tab 2: Wizard Recommendation
// ============================================================

// ─── UTILS ───────────────────────────────────────────────────
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const fmtPrice = n => n.toLocaleString('vi-VN');
function getEl(id) { return document.getElementById(id); }
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

// Smart CTA: detect mobile vs desktop
const ZALO_URL = 'https://zalo.me/0822036382';
function _isMobile() {
  if (window.innerWidth <= 768) return true;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(navigator.userAgent || '');
}
function getSmartCtaHtml(phoneLabel: string, zaloLabel: string) {
  if (_isMobile()) {
    return `<a href="tel:18001166" class="btn-register">📞 ${phoneLabel}</a>`;
  }
  return `<a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" class="btn-register">💬 ${zaloLabel}</a>`;
}

// ─── STATE ───────────────────────────────────────────────────
let state = {
    tab: 'tab1',
    // Tab1 filters
    f: {
        category: 'all',
        area: 'urban',
        duration: 'm1',
        minSpeed: 0,
        maxPrice: 5000000,
        features: new Set(),
        sort: 'price-asc'
    },
    // Compare
    compare: [],
    // Tab2 wizard
    wizard: {
        step: 0,
        totalSteps: 7,
        answers: {}
    }
};

// ─── TAB SWITCHING ───────────────────────────────────────────
function initTabs() {
    qsa('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            state.tab = target;
            qsa('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === target));
            qsa('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
        });
    });
}

// ============================================================
//  TAB 1 – FILTER & CARDS
// ============================================================

function initTab1() {
    // category
    getEl('f-category').addEventListener('change', e => {
        state.f.category = e.target.value;
        renderPackages();
    });
    // area
    getEl('f-area').addEventListener('change', e => {
        state.f.area = e.target.value;
        renderPackages();
    });
    // duration
    getEl('f-duration').addEventListener('change', e => {
        state.f.duration = e.target.value;
        renderPackages();
    });
    // speed
    const speedSlider = getEl('f-speed');
    speedSlider.addEventListener('input', e => {
        state.f.minSpeed = +e.target.value;
        getEl('speed-display').textContent = state.f.minSpeed === 0 ? 'Tất cả' : state.f.minSpeed + ' Mbps+';
        updateRangeFill(speedSlider);
        renderPackages();
    });
    // price
    const priceSlider = getEl('f-price');
    priceSlider.addEventListener('input', e => {
        state.f.maxPrice = +e.target.value;
        getEl('price-display').textContent = state.f.maxPrice >= 5000000 ? 'Không giới hạn' : fmt(state.f.maxPrice);
        updateRangeFill(priceSlider);
        renderPackages();
    });
    // features
    qsa('.feat-toggle').forEach(t => {
        t.addEventListener('click', () => {
            const feat = t.dataset.feat;
            if (state.f.features.has(feat)) {
                state.f.features.delete(feat);
                t.classList.remove('active');
            } else {
                state.f.features.add(feat);
                t.classList.add('active');
            }
            renderPackages();
        });
    });
    // sort
    getEl('f-sort').addEventListener('change', e => {
        state.f.sort = e.target.value;
        renderPackages();
    });
    // Init range fills
    updateRangeFill(speedSlider);
    updateRangeFill(priceSlider);
    renderPackages();
}

function updateRangeFill(el) {
    const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
    el.style.setProperty('--range-pct', pct + '%');
}

function filterPackages() {
    const { category, area, duration, minSpeed, maxPrice, features } = state.f;
    return PACKAGES.filter(p => {
        if (category !== 'all' && p.category !== category) return false;
        if (minSpeed > 0 && p.speed < minSpeed) return false;
        const price = p.price[area][duration];
        if (price > maxPrice) return false;
        if (features.has('mesh') && !p.hasMesh) return false;
        if (features.has('tv') && !p.hasTV) return false;
        if (features.has('camera') && !p.hasCamera) return false;
        if (features.has('mobile') && !p.hasMobile) return false;
        return true;
    });
}

function sortPackages(pkgs) {
    const { area, duration, sort } = state.f;
    return [...pkgs].sort((a, b) => {
        const pa = a.price[area][duration];
        const pb = b.price[area][duration];
        if (sort === 'price-asc') return pa - pb;
        if (sort === 'price-desc') return pb - pa;
        if (sort === 'speed-desc') return b.speed - a.speed;
        if (sort === 'speed-asc') return a.speed - b.speed;
        return 0;
    });
}

function renderPackages() {
    const filtered = sortPackages(filterPackages());
    const grid = getEl('packages-grid');
    const countEl = getEl('result-count');
    countEl.innerHTML = `Hiển thị <strong>${filtered.length}</strong> gói`;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results"><div class="no-icon">🔍</div><p>Không tìm thấy gói phù hợp. Hãy thử điều chỉnh bộ lọc.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => buildCard(p)).join('');
    // Attach listeners
    qsa('.area-btn', grid).forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const card = btn.closest('[data-pkg-id]');
            const area = btn.dataset.cardarea;
            qsa('.area-btn', card).forEach(b => b.classList.toggle('active', b.dataset.cardarea === area));
            updateCardPrices(card, area);
        });
    });
    qsa('.btn-detail', grid).forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const pkgId = btn.closest('[data-pkg-id]').dataset.pkgId;
            showDetail(pkgId);
        });
    });
    qsa('.btn-compare-toggle', grid).forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const pkgId = btn.closest('[data-pkg-id]').dataset.pkgId;
            toggleCompare(pkgId);
        });
    });
    // Restore compare state
    updateCompareUI();
}

function buildCard(p) {
    const area = state.f.area;
    const dur = state.f.duration;
    const cat = CATEGORIES[p.category];
    const price = p.price[area][dur];
    const durLabel = dur === 'm1' ? '/tháng' : dur === 'm6' ? ' (6 tháng)' : ' (12 tháng)';

    const features = buildFeatureChips(p);
    const badges = [
        p.popular ? `<span class="badge badge-popular">⭐ Phổ biến</span>` : '',
        p.badge ? `<span class="badge badge-tag">${p.badge}</span>` : ''
    ].filter(Boolean).join('');

    const isInCompare = state.compare.includes(p.id);

    return `
<div class="pkg-card" data-pkg-id="${p.id}">
  <div class="card-cat-stripe" style="background:${cat.color}"></div>
  <div class="card-top">
    <div class="card-cat-icon">${cat.icon}</div>
    <div class="card-badges">${badges}</div>
  </div>
  <div class="card-name">${p.name}</div>
  <div class="card-speed"><span class="speed-dot">⚡</span> ${p.speedLabel}</div>
  <div class="card-features">${features}</div>
  <div class="card-price-block">
    <div class="price-area-toggle">
      <button class="area-btn ${area === 'urban' ? 'active' : ''}" data-cardarea="urban">Nội thành</button>
      <button class="area-btn ${area === 'suburb' ? 'active' : ''}" data-cardarea="suburb">Ngoại thành</button>
    </div>
    <div class="price-main" id="pm-${p.id}">${fmtPrice(price)}<small style="font-size:0.55em;-webkit-text-fill-color:var(--text-muted);">đ</small></div>
    <div class="price-unit">${durLabel}</div>
    <div class="price-alts">
      ${dur !== 'm1' ? `<span class="price-alt">1T: <strong>${fmtPrice(p.price[area].m1)}đ</strong></span>` : ''}
      ${dur !== 'm6' ? `<span class="price-alt">6T: <strong>${fmtPrice(p.price[area].m6)}đ</strong></span>` : ''}
      ${dur !== 'm12' ? `<span class="price-alt">12T: <strong>${fmtPrice(p.price[area].m12)}đ</strong></span>` : ''}
    </div>
  </div>
  <div class="card-actions">
    <button class="btn-detail">Xem chi tiết</button>
    <button class="btn-compare-toggle ${isInCompare ? 'added' : ''}" title="So sánh gói này">
      ${isInCompare ? '✓ Đang so sánh' : '⊕ So sánh'}
    </button>
  </div>
</div>`;
}

function buildFeatureChips(p) {
    const chips = [];
    if (p.speed > 0) chips.push(`<span class="feat-chip highlight">⚡ ${p.speedLabel}</span>`);
    if (p.hasMesh) chips.push(`<span class="feat-chip highlight">📶 Mesh WiFi</span>`);
    if (p.hasTV) chips.push(`<span class="feat-chip highlight">📺 MyTV ${p.tvPlan ? '(' + p.tvPlan.substring(0, 10) + (p.tvPlan.length > 10 ? '…' : '') + ')' : ''}</span>`);
    if (p.hasCamera) chips.push(`<span class="feat-chip highlight">📷 Camera An Ninh</span>`);
    if (p.hasMobile) chips.push(`<span class="feat-chip highlight">📱 Data ${p.mobileData}</span>`);
    if (p.security) chips.push(`<span class="feat-chip">🛡 ${p.security}</span>`);
    if (p.hasStaticIP) chips.push(`<span class="feat-chip">🖥 IP Tĩnh</span>`);
    if (p.maxMembers) chips.push(`<span class="feat-chip">👥 Tối đa ${p.maxMembers} thành viên</span>`);
    return chips.join('');
}

function updateCardPrices(card, area) {
    const pkgId = card.dataset.pkgId;
    const p = PACKAGES.find(x => x.id === pkgId);
    const dur = state.f.duration;
    const price = p.price[area][dur];
    card.querySelector('.price-main').innerHTML = `${fmtPrice(price)}<small style="font-size:0.55em;-webkit-text-fill-color:var(--text-muted);">đ</small>`;
    // update alts
    const altsEl = card.querySelector('.price-alts');
    altsEl.innerHTML = [
        dur !== 'm1' ? `<span class="price-alt">1T: <strong>${fmtPrice(p.price[area].m1)}đ</strong></span>` : '',
        dur !== 'm6' ? `<span class="price-alt">6T: <strong>${fmtPrice(p.price[area].m6)}đ</strong></span>` : '',
        dur !== 'm12' ? `<span class="price-alt">12T: <strong>${fmtPrice(p.price[area].m12)}đ</strong></span>` : ''
    ].join('');
}

// ─── COMPARE ─────────────────────────────────────────────────
function toggleCompare(pkgId) {
    const idx = state.compare.indexOf(pkgId);
    if (idx >= 0) {
        state.compare.splice(idx, 1);
    } else {
        if (state.compare.length >= 3) {
            alert('Chỉ so sánh tối đa 3 gói cùng lúc!');
            return;
        }
        state.compare.push(pkgId);
    }
    updateCompareUI();
    // update card button
    qsa('.btn-compare-toggle').forEach(btn => {
        const id = btn.closest('[data-pkg-id]').dataset.pkgId;
        const inCompare = state.compare.includes(id);
        btn.classList.toggle('added', inCompare);
        btn.textContent = inCompare ? '✓ Đang so sánh' : '⊕ So sánh';
    });
    qsa('.pkg-card').forEach(card => {
        card.classList.toggle('selected-compare', state.compare.includes(card.dataset.pkgId));
    });
}

function updateCompareUI() {
    const bar = getEl('compare-bar');
    const slotsEl = getEl('compare-slots');
    if (state.compare.length === 0) {
        bar.classList.remove('visible');
    } else {
        bar.classList.add('visible');
        slotsEl.innerHTML = state.compare.map(id => {
            const p = PACKAGES.find(x => x.id === id);
            return `<div class="compare-slot">${p.name} <span class="remove-slot" onclick="removeFromCompare('${id}')">✕</span></div>`;
        }).join('');
    }
    getEl('compare-count').textContent = `${state.compare.length}/3`;
}

window.removeFromCompare = function (id) {
    state.compare = state.compare.filter(x => x !== id);
    updateCompareUI();
    qsa('.pkg-card').forEach(card => {
        card.classList.toggle('selected-compare', state.compare.includes(card.dataset.pkgId));
    });
    qsa('.btn-compare-toggle').forEach(btn => {
        const pkgId = btn.closest('[data-pkg-id]').dataset.pkgId;
        const inCompare = state.compare.includes(pkgId);
        btn.classList.toggle('added', inCompare);
        btn.textContent = inCompare ? '✓ Đang so sánh' : '⊕ So sánh';
    });
};

function initCompare() {
    getEl('btn-clear-compare').addEventListener('click', () => {
        state.compare = [];
        updateCompareUI();
        renderPackages();
    });
    getEl('btn-do-compare').addEventListener('click', () => {
        if (state.compare.length < 2) { alert('Hãy chọn ít nhất 2 gói để so sánh!'); return; }
        showCompareModal();
    });
}

// ─── DETAIL MODAL ────────────────────────────────────────────
function showDetail(pkgId) {
    const p = PACKAGES.find(x => x.id === pkgId);
    const modal = getEl('modal-detail');
    const cat = CATEGORIES[p.category];

    qs('#modal-detail .modal-header h2').textContent = p.name;
    qs('#modal-detail .modal-body').innerHTML = `
<div class="modal-detail-grid">
  <div class="detail-item"><div class="di-label">Loại gói</div><div class="di-val">${cat.icon} ${cat.label}</div></div>
  <div class="detail-item"><div class="di-label">Tốc độ</div><div class="di-val">⚡ ${p.speedLabel}</div></div>
  <div class="detail-item" style="grid-column:1/-1"><div class="di-label">Thành phần gói</div><div class="di-val">${p.components}</div></div>
  ${p.hasMesh ? `<div class="detail-item"><div class="di-label">Thiết bị Mesh</div><div class="di-val">📶 ${p.meshDevice}</div></div>` : ''}
  ${p.hasTV ? `<div class="detail-item"><div class="di-label">Truyền hình</div><div class="di-val">📺 ${p.tvPlan || p.tvContent || ''}</div></div>` : ''}
  ${p.hasCamera ? `<div class="detail-item"><div class="di-label">Camera</div><div class="di-val">📷 ${p.cameraCount} Camera Indoor + Cloud ${p.cloudDays} ngày</div></div>` : ''}
  ${p.hasMobile ? `<div class="detail-item"><div class="di-label">Data di động</div><div class="di-val">📱 ${p.mobileData}/ngày • ${p.mobileCall}</div></div>` : ''}
  ${p.maxMembers ? `<div class="detail-item"><div class="di-label">Số thành viên</div><div class="di-val">👥 Tối đa ${p.maxMembers} người</div></div>` : ''}
  ${p.security ? `<div class="detail-item"><div class="di-label">Bảo mật</div><div class="di-val">🛡 ${p.security}</div></div>` : ''}
  ${p.hasStaticIP ? `<div class="detail-item"><div class="di-label">IP</div><div class="di-val">🖥 ${p.components.match(/IP[^,]*/)?.[0] || 'IP Tĩnh'}</div></div>` : ''}
</div>
<div class="section-title">Bảng giá chi tiết</div>
<table class="price-table">
  <thead><tr><th>Khu vực</th><th>1 tháng</th><th>6 tháng</th><th>12 tháng</th></tr></thead>
  <tbody>
    <tr>
      <td class="area-label">🏙 Nội thành</td>
      <td>${fmt(p.price.urban.m1)}</td>
      <td>${fmt(p.price.urban.m6)}</td>
      <td>${fmt(p.price.urban.m12)}</td>
    </tr>
    <tr>
      <td class="area-label">🌿 Ngoại thành</td>
      <td>${fmt(p.price.suburb.m1)}</td>
      <td>${fmt(p.price.suburb.m6)}</td>
      <td>${fmt(p.price.suburb.m12)}</td>
    </tr>
  </tbody>
</table>
${p.category === 'tv' ? '<p style="margin-top:0.75rem;font-size:0.8rem;color:var(--text-muted);">(*) Gói truyền hình dành cho khách hàng đang sử dụng Internet VNPT. 1 tài khoản xem trên tối đa 5 thiết bị, đồng thời 2 thiết bị. Hỗ trợ 4K.</p>' : ''}
<div class="modal-cta">
  ${getSmartCtaHtml('Đăng ký ngay – 1800.1166', 'Chat Zalo đăng ký ngay')}
</div>`;
    modal.classList.add('open');
}

function initModals() {
    // detail modal
    const detailModal = getEl('modal-detail');
    qs('#modal-detail .modal-close').addEventListener('click', () => detailModal.classList.remove('open'));
    detailModal.addEventListener('click', e => { if (e.target === detailModal) detailModal.classList.remove('open'); });

    // compare modal
    const compareModal = getEl('modal-compare');
    qs('#modal-compare .modal-close').addEventListener('click', () => compareModal.classList.remove('open'));
    compareModal.addEventListener('click', e => { if (e.target === compareModal) compareModal.classList.remove('open'); });
}

function showCompareModal() {
    const modal = getEl('modal-compare');
    const pkgs = state.compare.map(id => PACKAGES.find(x => x.id === id));
    const area = state.f.area;
    const n = pkgs.length;

    const colVal = (val) => `<div class="cr-val">${val}</div>`;
    const checkVal = (bool) => `<div class="cr-val">${bool ? '<span class="check-yes">✓</span>' : '<span class="check-no">—</span>'}</div>`;

    const colStyle = `grid-template-columns: 180px repeat(${n}, 1fr)`;

    qs('#modal-compare .modal-body').innerHTML = `
<div class="compare-grid">
  <div class="compare-row row-header" style="${colStyle}; display:grid;">
    <div class="cr-label">Gói cước</div>
    ${pkgs.map(p => colVal(`<strong>${p.name}</strong>`)).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">Loại</div>
    ${pkgs.map(p => colVal(CATEGORIES[p.category].icon + ' ' + CATEGORIES[p.category].label)).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Tốc độ</div>
    ${pkgs.map(p => colVal('⚡ ' + p.speedLabel)).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">Giá 1 tháng (nội thành)</div>
    ${pkgs.map(p => colVal('<strong>' + fmt(p.price.urban.m1) + '</strong>')).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Giá 6 tháng (nội thành)</div>
    ${pkgs.map(p => colVal(fmt(p.price.urban.m6))).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">Giá 12 tháng (nội thành)</div>
    ${pkgs.map(p => colVal(fmt(p.price.urban.m12))).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Giá ngoại thành / tháng</div>
    ${pkgs.map(p => colVal(fmt(p.price.suburb.m1))).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">Có Mesh WiFi</div>
    ${pkgs.map(p => checkVal(p.hasMesh)).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Truyền hình MyTV</div>
    ${pkgs.map(p => checkVal(p.hasTV)).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">Camera an ninh</div>
    ${pkgs.map(p => checkVal(p.hasCamera)).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Data di động</div>
    ${pkgs.map(p => checkVal(p.hasMobile)).join('')}
  </div>
  <div class="compare-row" style="${colStyle}">
    <div class="cr-label">IP Tĩnh</div>
    ${pkgs.map(p => checkVal(p.hasStaticIP)).join('')}
  </div>
  <div class="compare-row row-highlight" style="${colStyle}">
    <div class="cr-label">Thành phần</div>
    ${pkgs.map(p => colVal('<small>' + p.components + '</small>')).join('')}
  </div>
</div>
<div class="modal-cta">
  ${getSmartCtaHtml('Tư vấn đăng ký – 1800.1166', 'Chat Zalo tư vấn đăng ký')}
</div>`;
    modal.classList.add('open');
}

// ============================================================
//  TAB 2 – WIZARD
// ============================================================

const WIZARD_STEPS = [
    {
        id: 'house',
        title: 'Thông tin nhà ở',
        desc: 'Giúp chúng tôi hiểu không gian sử dụng của bạn',
        icon: '🏠',
        fields: [
            {
                id: 'floors', type: 'choices', label: 'Nhà bạn có mấy tầng?',
                choices: [
                    { val: 1, icon: '🏠', label: '1 tầng', sub: 'Nhà cấp 4, chung cư' },
                    { val: 2, icon: '🏘', label: '2 tầng', sub: 'Nhà phố nhỏ' },
                    { val: 3, icon: '🏗', label: '3 tầng', sub: 'Nhà phố' },
                    { val: 4, icon: '🏢', label: '4+ tầng', sub: 'Biệt thự, shophouse' }
                ]
            },
            {
                id: 'area', type: 'choices', label: 'Diện tích mỗi tầng?',
                choices: [
                    { val: 40, icon: '📐', label: 'Dưới 60m²', sub: 'Nhỏ gọn' },
                    { val: 80, icon: '📏', label: '60 – 100m²', sub: 'Trung bình' },
                    { val: 120, icon: '🏛', label: 'Trên 100m²', sub: 'Rộng rãi' }
                ]
            },
            {
                id: 'rooms', type: 'choices', label: 'Số phòng riêng?',
                choices: [
                    { val: 2, icon: '🚪', label: '1 – 2 phòng', sub: '' },
                    { val: 4, icon: '🏠', label: '3 – 4 phòng', sub: '' },
                    { val: 6, icon: '🏘', label: '5+ phòng', sub: 'Nhiều phòng' }
                ]
            },
            {
                id: 'location', type: 'choices', label: 'Khu vực của bạn?',
                choices: [
                    { val: 'urban', icon: '🏙', label: 'Nội thành', sub: 'Quận nội thành HN' },
                    { val: 'suburb', icon: '🌿', label: 'Ngoại thành', sub: 'Huyện ngoại thành HN' }
                ]
            }
        ]
    },
    {
        id: 'family',
        title: 'Gia đình & Người dùng',
        desc: 'Số lượng và đặc điểm người sử dụng',
        icon: '👨‍👩‍👧‍👦',
        fields: [
            {
                id: 'users', type: 'choices', label: 'Số người thường xuyên dùng internet?',
                choices: [
                    { val: 1, icon: '👤', label: '1 – 2 người', sub: 'ở 1 mình hoặc 2 người' },
                    { val: 3, icon: '👥', label: '3 – 4 người', sub: 'Gia đình nhỏ' },
                    { val: 5, icon: '👨‍👩‍👧‍👦', label: '5 – 6 người', sub: 'Gia đình lớn' },
                    { val: 7, icon: '🏘', label: '7+ người', sub: 'Nhiều người' }
                ]
            },
            {
                id: 'hasKids', type: 'toggle', label: 'Có trẻ em trong gia đình không?',
                sub: 'Gợi ý tính năng bảo mật GreenNet / Family Safe'
            }
        ]
    },
    {
        id: 'devices',
        title: 'Thiết bị & Kết nối',
        desc: 'Xác định hạ tầng internet cần thiết',
        icon: '📱',
        fields: [
            {
                id: 'numDevices', type: 'choices', label: 'Số thiết bị kết nối internet đồng thời?',
                choices: [
                    { val: 2, icon: '📱', label: '1 – 3 thiết bị', sub: 'Điện thoại, laptop' },
                    { val: 5, icon: '💻', label: '4 – 7 thiết bị', sub: 'Cả nhà dùng' },
                    { val: 10, icon: '🖥', label: '8 – 15 thiết bị', sub: 'Smart home nhỏ' },
                    { val: 20, icon: '🌐', label: '15+ thiết bị', sub: 'IoT, camera, ...' }
                ]
            },
            {
                id: 'hasSmartTV', type: 'toggle', label: 'Có Smart TV kết nối internet không?',
                sub: 'Smart TV cần băng thông ổn định cho streaming'
            },
            {
                id: 'hasIoT', type: 'toggle', label: 'Có thiết bị IoT/Camera tại nhà không?',
                sub: 'Camera, khóa thông minh, đèn thông minh,...'
            }
        ]
    },
    {
        id: 'entertainment',
        title: 'Nhu cầu giải trí',
        desc: 'Phim, nhạc, game và truyền hình',
        icon: '🎬',
        fields: [
            {
                id: 'tvNeed', type: 'choices', label: 'Nhu cầu xem truyền hình/IPTV?',
                choices: [
                    { val: 'none', icon: '❌', label: 'Không cần', sub: 'Chỉ cần internet' },
                    { val: 'basic', icon: '📺', label: 'Xem thỉnh thoảng', sub: 'Kênh trong nước' },
                    { val: 'regular', icon: '🎬', label: 'Xem thường xuyên', sub: 'Phim, kênh HD' },
                    { val: 'sport', icon: '⚽', label: 'Thể thao & VIP', sub: 'SPOTV, K+, Galaxy VIP' }
                ]
            },
            {
                id: 'numTVs', type: 'choices', label: 'Số TV trong nhà?',
                choices: [
                    { val: 0, icon: '🚫', label: 'Không có TV', sub: '' },
                    { val: 1, icon: '📺', label: '1 TV', sub: '' },
                    { val: 2, icon: '📺📺', label: '2+ TV', sub: 'Phòng khách + phòng ngủ' }
                ]
            },
            {
                id: 'stream4k', type: 'toggle', label: 'Có xem nội dung 4K (Netflix, YouTube 4K)?',
                sub: 'Đòi hỏi tốc độ ổn định ≥ 25Mbps mỗi màn hình'
            }
        ]
    },
    {
        id: 'work',
        title: 'Làm việc & Học tập',
        desc: 'Nhu cầu công việc từ xa và bảo mật',
        icon: '💼',
        fields: [
            {
                id: 'wfh', type: 'toggle', label: 'Làm việc từ xa (WFH) thường xuyên?',
                sub: 'Họp Zoom/Meet, upload file lớn cần băng thông cao'
            },
            {
                id: 'videoCall', type: 'toggle', label: 'Họp video hàng ngày (Zoom, Google Meet...)?',
                sub: 'Cần đường truyền ổn định, upload tốt'
            },
            {
                id: 'needCamera', type: 'toggle', label: 'Cần camera an ninh theo dõi tại nhà?',
                sub: 'Camera Indoor + lưu trữ đám mây 7 ngày'
            },
            {
                id: 'homeBiz', type: 'toggle', label: 'Kinh doanh nhỏ tại nhà / văn phòng nhỏ?',
                sub: 'Cần IP tĩnh hoặc gói doanh nghiệp'
            }
        ]
    },
    {
        id: 'gaming',
        title: 'Game & Giải trí số',
        desc: 'Xác định yêu cầu về tốc độ và độ trễ',
        icon: '🎮',
        fields: [
            {
                id: 'gaming', type: 'choices', label: 'Có chơi game online không?',
                choices: [
                    { val: 'none', icon: '😴', label: 'Không chơi', sub: '' },
                    { val: 'casual', icon: '🕹', label: 'Thỉnh thoảng', sub: 'Mobile game nhẹ' },
                    { val: 'regular', icon: '👾', label: 'Thường chơi', sub: 'PC/Console game' },
                    { val: 'hardcore', icon: '🎮', label: 'Game thủ', sub: 'FPS, Esport, 60fps+' }
                ]
            },
            {
                id: 'streaming', type: 'toggle', label: 'Hay xem/tải video chất lượng cao (HD/4K)?',
                sub: 'Netflix, YouTube, phim tải lớn'
            },
            {
                id: 'isCreator', type: 'toggle', label: 'Làm nội dung (YouTuber, Livestreamer)?',
                sub: 'Cần upload tốc độ cao để stream/upload video'
            }
        ]
    },
    {
        id: 'budget',
        title: 'Ngân sách & Thời hạn',
        desc: 'Tìm gói tốt nhất trong khả năng của bạn',
        icon: '💰',
        fields: [
            {
                id: 'budget', type: 'budget',
                budgets: [
                    { val: 200000, label: 'Dưới 200k', sub: '/tháng', cls: '' },
                    { val: 350000, label: '200k – 350k', sub: '/tháng', cls: '' },
                    { val: 500000, label: '350k – 500k', sub: '/tháng', cls: '' },
                    { val: 999999999, label: 'Trên 500k', sub: '/tháng – Không giới hạn', cls: '' }
                ]
            },
            {
                id: 'duration', type: 'choices', label: 'Thời hạn thanh toán ưu tiên?',
                choices: [
                    { val: 'm1', icon: '📅', label: '1 tháng', sub: 'Linh hoạt' },
                    { val: 'm6', icon: '📆', label: '6 tháng', sub: 'Tiết kiệm nhẹ' },
                    { val: 'm12', icon: '🗓', label: '12 tháng', sub: 'Tiết kiệm nhất' }
                ]
            }
        ]
    }
];

let wizardAnswers = {};
let wizardStep = 0;
let wizardResults = [];

function initWizard() {
    renderWizardStep(0);
    getEl('btn-prev').addEventListener('click', () => {
        if (wizardStep > 0) { wizardStep--; renderWizardStep(wizardStep); }
    });
    getEl('btn-next').addEventListener('click', () => {
        if (wizardStep < WIZARD_STEPS.length - 1) {
            wizardStep++;
            renderWizardStep(wizardStep);
        } else {
            // last step => compute
            computeRecommendations();
        }
    });
    getEl('btn-restart').addEventListener('click', () => {
        wizardAnswers = {};
        wizardStep = 0;
        getEl('recommendation-section').style.display = 'none';
        getEl('wizard-steps-container').style.display = 'block';
        getEl('wizard-progress').style.display = 'block';
        renderWizardStep(0);
    });
}

function renderWizardStep(stepIndex) {
    const step = WIZARD_STEPS[stepIndex];
    const total = WIZARD_STEPS.length;
    const pct = ((stepIndex) / total * 100).toFixed(0);

    // Progress
    getEl('progress-step-cur').textContent = stepIndex + 1;
    getEl('progress-step-tot').textContent = total;
    getEl('progress-fill').style.width = pct + '%';
    const dots = getEl('step-dots');
    dots.innerHTML = WIZARD_STEPS.map((s, i) => `<div class="step-dot ${i < stepIndex ? 'done' : i === stepIndex ? 'current' : ''}"></div>`).join('');

    // Nav
    getEl('btn-prev').disabled = stepIndex === 0;
    getEl('btn-next').textContent = stepIndex === total - 1 ? '🎯 Tìm gói phù hợp' : 'Tiếp theo →';

    // Step
    getEl('wizard-steps-container').innerHTML = renderStepHTML(step, stepIndex);
    attachStepListeners(step);
}

function renderStepHTML(step, stepIndex) {
    return `
<div class="wizard-step">
  <div class="step-header">
    <div class="step-number">${stepIndex + 1}</div>
    <div class="step-title">${step.icon} ${step.title}</div>
    <div class="step-desc">${step.desc}</div>
  </div>
  ${step.fields.map(f => renderField(f)).join('')}
</div>`;
}

function renderField(f) {
    if (f.type === 'choices') {
        return `
<div class="wizard-field">
  <label>${f.label}</label>
  <div class="choices-grid ${f.choices.length === 2 ? 'cols-2' : ''}">
    ${f.choices.map(c => `
    <label class="choice-card ${wizardAnswers[f.id] === c.val ? 'selected' : ''}" data-field="${f.id}" data-val='${JSON.stringify(c.val)}'>
      <input type="radio" name="${f.id}" value="${c.val}">
      <div class="c-icon">${c.icon}</div>
      <div class="c-label">${c.label}</div>
      ${c.sub ? `<div class="c-sub">${c.sub}</div>` : ''}
    </label>`).join('')}
  </div>
</div>`;
    }
    if (f.type === 'toggle') {
        const checked = wizardAnswers[f.id] === true;
        return `
<div class="toggle-item">
  <div class="toggle-info">
    <div class="t-label">${f.label}</div>
    <div class="t-sub">${f.sub || ''}</div>
  </div>
  <label class="toggle-switch">
    <input type="checkbox" data-field="${f.id}" ${checked ? 'checked' : ''}>
    <div class="toggle-track"></div>
    <div class="toggle-thumb"></div>
  </label>
</div>`;
    }
    if (f.type === 'budget') {
        return `
<div class="wizard-field">
  <label>Ngân sách hàng tháng?</label>
  <div class="budget-grid">
    ${f.budgets.map(b => `
    <div class="budget-card ${wizardAnswers['budget'] === b.val ? 'selected' : ''}" data-field="budget" data-val="${b.val}">
      <div class="b-price">${b.val >= 999999999 ? '500k+' : (b.val / 1000).toFixed(0) + 'k'}</div>
      <div class="b-label">${b.label}<br>${b.sub}</div>
    </div>`).join('')}
  </div>
</div>`;
    }
    return '';
}

function attachStepListeners(step) {
    // choice cards
    qsa('.choice-card').forEach(card => {
        card.addEventListener('click', () => {
            const field = card.dataset.field;
            const val = JSON.parse(card.dataset.val);
            wizardAnswers[field] = val;
            // deselect siblings
            qsa(`.choice-card[data-field="${field}"]`).forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
    // toggles
    qsa('input[type="checkbox"][data-field]').forEach(inp => {
        inp.addEventListener('change', () => {
            wizardAnswers[inp.dataset.field] = inp.checked;
        });
    });
    // budget cards
    qsa('.budget-card').forEach(card => {
        card.addEventListener('click', () => {
            wizardAnswers['budget'] = +card.dataset.val;
            qsa('.budget-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}

// ─── RECOMMENDATION ENGINE ────────────────────────────────────
function computeRecommendations() {
    const a = wizardAnswers;
    const location = a.location || 'urban';
    const duration = a.duration || 'm1';
    const budget = a.budget || 999999999;

    // Determine needs
    const needMesh = (a.floors >= 2) || (a.area >= 120) || (a.rooms >= 5);
    const needTV = a.tvNeed && a.tvNeed !== 'none';
    const needTVVIP = a.tvNeed === 'sport';
    const needCamera = a.needCamera === true;
    const needHighSpeed = (a.users >= 5) || (a.gaming === 'hardcore') || (a.isCreator === true) || (a.stream4k === true) || a.numDevices >= 10;
    const needMidSpeed = (a.users >= 3) || (a.wfh === true) || (a.gaming === 'regular') || (a.numDevices >= 5);
    const needSecurity = a.hasKids === true;

    // Min speed
    let minSpeed = 100;
    if (needMidSpeed) minSpeed = 300;
    if (needHighSpeed) minSpeed = 500;

    // ─── INLINE SCORING ───────────────────────────────────────
    function doScore(pkgList, strictBudget, strictSpeed) {
        return pkgList.map(p => {
            if (p.category === 'tv') return null;
            const price = p.price[location][duration];
            if (strictBudget && price > budget) return null;
            if (strictSpeed && p.speed < minSpeed) return null;
            if (!strictSpeed && p.speed < Math.max(minSpeed - 200, 0)) return null;

            let score = 0;
            const speedRatio = Math.min(p.speed / Math.max(minSpeed, 100), 2);
            score += 30 * Math.min(speedRatio, 1.5) / 1.5;
            const budgetEff = budget > 0 ? Math.max(0, 1 - (price / Math.max(budget, 1))) : 0.5;
            score += 25 * budgetEff;
            if (needMesh && p.hasMesh) score += 20;
            else if (!needMesh && !p.hasMesh) score += 10;
            else if (needMesh && !p.hasMesh) score -= 5;
            if (needTV && p.hasTV) {
                score += (needTVVIP && p.tvPlan && p.tvPlan.includes('VIP')) ? 15 : (!needTVVIP ? 12 : 8);
            } else if (!needTV && !p.hasTV) score += 5;
            else if (needTV && !p.hasTV) score -= 5;
            if (needCamera && p.hasCamera) score += 10;
            if (needSecurity && p.security) score += 5;

            return { pkg: p, score, price, reasons: buildReasons(p, a, needMesh, needTV, needCamera, needSecurity, location, duration) };
        }).filter(Boolean).sort((x, y) => y.score - x.score);
    }

    const scoredStrict = doScore(PACKAGES, true, true);
    const scored = scoredStrict.length > 0 ? scoredStrict : doScore(PACKAGES, false, false);
    const budgetRelaxed = scoredStrict.length === 0 && scored.length > 0;

    if (scored.length === 0) {
        getEl('rec-grid').innerHTML = `<div class="no-results" style="grid-column:1/-1"><div class="no-icon">😕</div><p>Không tìm thấy gói phù hợp với ngân sách. Hãy thử tăng ngân sách hoặc đổi thời hạn.</p></div>`;
        showResults();
        return;
    }

    // Pick 3: economy, best-fit, premium
    const bestFit = scored[0];
    const economy = scored.find(s => s.price < bestFit.price * 0.85) || scored[Math.min(1, scored.length - 1)];
    const premium = scored.find(s => s.price > bestFit.price * 1.1 && s.score > bestFit.score * 0.7) || scored[Math.min(2, scored.length - 1)];

    const recs = [
        { type: 'economy', label: 'Tiết kiệm nhất', item: economy },
        { type: 'best-fit', label: '⭐ Phù hợp nhất', item: bestFit, isBest: true },
        { type: 'premium', label: 'Cao cấp hơn', item: premium }
    ].filter((r, i, arr) => {
        // deduplicate
        return !arr.slice(0, i).some(x => x.item.pkg.id === r.item.pkg.id);
    });

    getEl('rec-grid').innerHTML =
        (budgetRelaxed ? `<div style="grid-column:1/-1;background:rgba(244,159,10,0.1);border:1px solid rgba(244,159,10,0.3);border-radius:10px;padding:1rem;margin-bottom:0.5rem;font-size:0.85rem;color:#f59e0b;">⚠️ Không có gói nào trong ngân sách bạn chọn. Dưới đây là các gói gần nhất — hãy cân nhắc thanh toán 12 tháng để tiết kiệm hơn!</div>` : '') +
        recs.map(r => buildRecCard(r, location, duration)).join('');
    qsa('.btn-rec-detail').forEach(btn => {
        btn.addEventListener('click', () => showDetail(btn.dataset.pkgId));
    });

    showResults();
}

function buildReasons(p, a, needMesh, needTV, needCamera, needSecurity, location, duration) {
    const reasons = [];
    const price = p.price[location][duration];
    reasons.push(`Giá ${fmt(price)}/tháng phù hợp ngân sách`);
    if (p.speed >= 500) reasons.push('Tốc độ cao ≥ 500Mbps – mượt mà cho nhiều người dùng');
    else if (p.speed >= 300) reasons.push('Tốc độ 300Mbps – đủ dùng cho gia đình nhỏ');
    if (needMesh && p.hasMesh) reasons.push('Có Mesh WiFi phủ sóng toàn nhà nhiều tầng');
    if (needTV && p.hasTV) reasons.push('Bao gồm truyền hình MyTV – không cần đăng ký thêm');
    if (needCamera && p.hasCamera) reasons.push('Bao gồm Camera an ninh + lưu trữ Cloud 7 ngày');
    if (needSecurity && p.security) reasons.push('Tích hợp bảo mật GreenNet/Family Safe cho trẻ em');
    return reasons.slice(0, 3);
}

function buildRecCard(r, location, duration) {
    const { pkg: p, price, score, reasons } = r.item;
    return `
<div class="rec-card ${r.isBest ? 'best' : ''}">
  ${r.isBest ? '<div class="best-ribbon">⭐ PHÙ HỢP NHẤT</div>' : ''}
  <div class="rec-type ${r.type}">${r.label}</div>
  <div class="rec-name">${p.name}</div>
  <div class="rec-price">${fmtPrice(price)}<small style="font-size:0.55em;">đ</small></div>
  <div class="rec-price-note">${duration === 'm1' ? '/tháng' : duration === 'm6' ? ' cho 6 tháng' : ' cho 12 tháng'} • ${location === 'urban' ? 'Nội thành' : 'Ngoại thành'}</div>
  <ul class="rec-reasons">
    ${reasons.map(r => `<li>${r}</li>`).join('')}
  </ul>
  <div class="score-bar"><div class="score-fill" style="width:${Math.min(score, 100).toFixed(0)}%"></div></div>
  <div style="font-size:0.72rem;color:var(--text-dim);margin:4px 0 1rem;">Điểm phù hợp: ${Math.min(score, 100).toFixed(0)}/100</div>
  <button class="btn-rec-detail" data-pkg-id="${p.id}">Xem chi tiết gói</button>
</div>`;
}

function showResults() {
    getEl('wizard-steps-container').style.display = 'none';
    getEl('wizard-progress').style.display = 'none';
    getEl('recommendation-section').style.display = 'block';
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTab1();
    initCompare();
    initModals();
    initWizard();
});
