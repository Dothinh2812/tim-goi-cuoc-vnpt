// ============================================================
// VNPT Hà Nội 2025 – Dữ liệu gói cước (Bảng giá đơn giản hóa)
// Nguồn: VNPT_Bang_Gia_Goi_Cuoc_2025 - simple.docx
// Gồm 4 nhóm: Internet cơ bản, Internet + Mesh, Internet + Camera, Combo HomeTV
// ============================================================

const PACKAGES = [

    // ─── I.1 INTERNET CƠ BẢN (Không Mesh) ───────────────────
    {
        id: 'home1',
        name: 'Home 1',
        category: 'home',
        subcategory: 'basic',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: false,
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: 'GreenNet / Family Safe',
        components: 'Internet 300 Mbps + Bảo mật GreenNet/Family Safe',
        price: {
            urban: { m1: 235000, m6: 1410000, m12: 2820000 },
            suburb: { m1: 190000, m6: 1140000, m12: 2280000 }
        },
        tags: ['internet', 'basic', 'family', 'kids'],
        badge: null,
        popular: false
    },
    {
        id: 'home2',
        name: 'Home 2',
        category: 'home',
        subcategory: 'basic',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: false,
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 500 Mbps',
        price: {
            urban: { m1: 280000, m6: 1680000, m12: 3360000 },
            suburb: { m1: 240000, m6: 1440000, m12: 2880000 }
        },
        tags: ['internet', 'basic', 'fast', 'wfh', 'game'],
        badge: 'Phổ biến',
        popular: true
    },
    {
        id: 'home3',
        name: 'Home 3',
        category: 'home',
        subcategory: 'basic',
        speed: 1000,
        speedLabel: '500ULM (lên tới 1Gbps)',
        hasMesh: false,
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 500ULM (tối thiểu 500Mbps, tối đa 1Gbps)',
        price: {
            urban: { m1: 320000, m6: 1920000, m12: 3840000 },
            suburb: { m1: 280000, m6: 1680000, m12: 3360000 }
        },
        tags: ['internet', 'basic', 'ultra', 'game', 'stream', '4k'],
        badge: 'Ultra',
        popular: false
    },

    // ─── I.2 INTERNET CÓ MESH ────────────────────────────────
    {
        id: 'home1-mesh',
        name: 'Home 1 (Có Mesh)',
        category: 'home',
        subcategory: 'mesh',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 300 Mbps + 01 Thiết bị Mesh 6',
        price: {
            urban: { m1: 265000, m6: 1590000, m12: 3180000 },
            suburb: { m1: 220000, m6: 1320000, m12: 2640000 }
        },
        tags: ['internet', 'mesh', 'wifi', 'multifloor', 'largeroom'],
        badge: 'Có Mesh',
        popular: false
    },
    {
        id: 'home2-mesh',
        name: 'Home 2 (Có Mesh)',
        category: 'home',
        subcategory: 'mesh',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 500 Mbps + 01 Thiết bị Mesh 6',
        price: {
            urban: { m1: 310000, m6: 1860000, m12: 3720000 },
            suburb: { m1: 270000, m6: 1620000, m12: 3240000 }
        },
        tags: ['internet', 'mesh', 'wifi', 'multifloor', 'wfh', 'game'],
        badge: 'Có Mesh',
        popular: true
    },
    {
        id: 'home3-mesh',
        name: 'Home 3 (Có Mesh)',
        category: 'home',
        subcategory: 'mesh',
        speed: 1000,
        speedLabel: '500ULM (lên tới 1Gbps)',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: false,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 500ULM + 01 Thiết bị Mesh 6',
        price: {
            urban: { m1: 350000, m6: 2100000, m12: 4200000 },
            suburb: { m1: 310000, m6: 1860000, m12: 3720000 }
        },
        tags: ['internet', 'mesh', 'wifi', 'ultra', 'game', 'stream', '4k'],
        badge: 'Ultra + Mesh',
        popular: false
    },

    // ─── I.3 INTERNET + CAMERA ───────────────────────────────
    {
        id: 'homecam1',
        name: 'Home Cam 1',
        category: 'home',
        subcategory: 'camera',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: true,
        cameraCount: 1,
        cloudDays: 7,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 300Mbps + 01 Mesh 6 + 01 Camera Indoor + Cloud 7 ngày',
        price: {
            urban: { m1: 290000, m6: 1740000, m12: 3480000 },
            suburb: { m1: 250000, m6: 1500000, m12: 3000000 }
        },
        tags: ['internet', 'mesh', 'camera', 'security', 'smart-home'],
        badge: 'Smart Home',
        popular: false
    },
    {
        id: 'homecam2',
        name: 'Home Cam 2',
        category: 'home',
        subcategory: 'camera',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: true,
        cameraCount: 1,
        cloudDays: 7,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet 500Mbps + 01 Mesh 6 + 01 Camera Indoor + Cloud 7 ngày',
        price: {
            urban: { m1: 350000, m6: 2100000, m12: 4200000 },
            suburb: { m1: 310000, m6: 1860000, m12: 3720000 }
        },
        tags: ['internet', 'mesh', 'camera', 'security', 'smart-home', 'wfh'],
        badge: 'Smart Home',
        popular: false
    },
    {
        id: 'homecam3',
        name: 'Home Cam 3',
        category: 'home',
        subcategory: 'camera',
        speed: 1000,
        speedLabel: '~1 Gbps',
        hasMesh: true,
        meshDevice: '01 Mesh 6',
        hasTV: false,
        hasCamera: true,
        cameraCount: 1,
        cloudDays: 7,
        hasMobile: false,
        hasStaticIP: false,
        security: '',
        components: 'Internet ~1Gbps + 01 Mesh 6 + 01 Camera Indoor + Cloud 7 ngày',
        price: {
            urban: { m1: 390000, m6: 2340000, m12: 4680000 },
            suburb: { m1: 350000, m6: 2100000, m12: 4200000 }
        },
        tags: ['internet', 'mesh', 'camera', 'security', 'smart-home', 'ultra', '4k'],
        badge: 'Smart Home Ultra',
        popular: false
    },

    // ─── COMBO HOMETV (Internet + Truyền hình) ───────────────
    {
        id: 'hometv1',
        name: 'HomeTV 1',
        category: 'combo',
        subcategory: 'hometv',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: false, hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV (Flexi 1/2, Film hoặc Film+)',
        components: 'Internet 300Mbps + MyTV (Flexi 1/2, Film hoặc Film+)',
        price: {
            urban: { m1: 240000, m6: 1440000, m12: 2880000 },
            suburb: { m1: 200000, m6: 1200000, m12: 2400000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'family'],
        badge: 'Combo', popular: true
    },
    {
        id: 'hometv2',
        name: 'HomeTV 2',
        category: 'combo',
        subcategory: 'hometv',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: false, hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV (Flexi 1/2, Film hoặc Film+)',
        components: 'Internet 500Mbps + MyTV (Flexi 1/2, Film hoặc Film+)',
        price: {
            urban: { m1: 300000, m6: 1800000, m12: 3600000 },
            suburb: { m1: 260000, m6: 1560000, m12: 3120000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'family', 'wfh'],
        badge: 'Combo', popular: true
    },
    {
        id: 'hometv1-mesh',
        name: 'HomeTV 1 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-mesh',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV (Flexi 1/2, Film hoặc Film+)',
        components: 'Internet 300Mbps + Mesh 6 + MyTV (Flexi 1/2, Film hoặc Film+)',
        price: {
            urban: { m1: 270000, m6: 1620000, m12: 3240000 },
            suburb: { m1: 230000, m6: 1380000, m12: 2760000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'mesh', 'family', 'multifloor'],
        badge: 'Combo + Mesh', popular: false
    },
    {
        id: 'hometv2-mesh',
        name: 'HomeTV 2 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-mesh',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV (Flexi 1/2, Film hoặc Film+)',
        components: 'Internet 500Mbps + Mesh 6 + MyTV (Flexi 1/2, Film hoặc Film+)',
        price: {
            urban: { m1: 330000, m6: 1980000, m12: 3960000 },
            suburb: { m1: 290000, m6: 1740000, m12: 3480000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'mesh', 'family', 'wfh', 'multifloor'],
        badge: 'Combo + Mesh', popular: false
    },
    {
        id: 'hometv3-mesh',
        name: 'HomeTV 3 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-mesh',
        speed: 1000,
        speedLabel: '500ULM (lên tới 1Gbps)',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV (Flexi 1/2, Film hoặc Film+)',
        components: 'Internet 500ULM + Mesh 6 + MyTV (Flexi 1/2, Film hoặc Film+)',
        price: {
            urban: { m1: 370000, m6: 2220000, m12: 4440000 },
            suburb: { m1: 330000, m6: 1980000, m12: 3960000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'mesh', 'ultra', 'family', 'multifloor'],
        badge: 'Ultra Combo', popular: false
    },
    {
        id: 'hometv-vip1',
        name: 'HomeTV VIP1',
        category: 'combo',
        subcategory: 'hometv-vip',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: false, hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV VIP',
        components: 'Internet 300Mbps + MyTV VIP (đầy đủ kênh, VOD không quảng cáo)',
        price: {
            urban: { m1: 270000, m6: 1620000, m12: 3240000 },
            suburb: { m1: 230000, m6: 1380000, m12: 2760000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'vip', 'sport', 'family'],
        badge: 'TV VIP', popular: false
    },
    {
        id: 'hometv-vip2',
        name: 'HomeTV VIP2',
        category: 'combo',
        subcategory: 'hometv-vip',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: false, hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV VIP',
        components: 'Internet 500Mbps + MyTV VIP',
        price: {
            urban: { m1: 330000, m6: 1980000, m12: 3960000 },
            suburb: { m1: 290000, m6: 1740000, m12: 3480000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'vip', 'sport', 'family', 'wfh'],
        badge: 'TV VIP', popular: false
    },
    {
        id: 'hometv-vip1-mesh',
        name: 'HomeTV VIP1 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-vip-mesh',
        speed: 300,
        speedLabel: '300 Mbps',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV VIP',
        components: 'Internet 300Mbps + Mesh 6 + MyTV VIP',
        price: {
            urban: { m1: 300000, m6: 1800000, m12: 3600000 },
            suburb: { m1: 260000, m6: 1560000, m12: 3120000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'vip', 'mesh', 'family', 'multifloor'],
        badge: 'VIP + Mesh', popular: false
    },
    {
        id: 'hometv-vip2-mesh',
        name: 'HomeTV VIP2 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-vip-mesh',
        speed: 500,
        speedLabel: '500 Mbps',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV VIP',
        components: 'Internet 500Mbps + Mesh 6 + MyTV VIP',
        price: {
            urban: { m1: 360000, m6: 2160000, m12: 4320000 },
            suburb: { m1: 320000, m6: 1920000, m12: 3840000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'vip', 'mesh', '4k', 'wfh', 'multifloor'],
        badge: 'VIP + Mesh', popular: false
    },
    {
        id: 'hometv-vip3-mesh',
        name: 'HomeTV VIP3 (Có Mesh)',
        category: 'combo',
        subcategory: 'hometv-vip-mesh',
        speed: 1000,
        speedLabel: '500ULM (lên tới 1Gbps)',
        hasMesh: true, meshDevice: '01 Mesh 6', hasTV: true, hasCamera: false, hasMobile: false, hasStaticIP: false,
        tvPlan: 'MyTV VIP',
        components: 'Internet 500ULM + Mesh 6 + MyTV VIP',
        price: {
            urban: { m1: 400000, m6: 2400000, m12: 4800000 },
            suburb: { m1: 360000, m6: 2160000, m12: 4320000 }
        },
        tags: ['combo', 'internet', 'tv', 'mytv', 'vip', 'mesh', 'ultra', '4k', 'multifloor'],
        badge: 'VIP Ultra', popular: false
    }
];

// ─── CATEGORY MAP ─────────────────────────────────────────
const CATEGORIES = {
    home: { label: 'Internet Hộ Gia Đình', icon: '🏠', color: '#2563eb' },
    combo: { label: 'Combo Internet + TV (HomeTV)', icon: '🎬', color: '#059669' }
};
