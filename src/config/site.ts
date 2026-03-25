export const siteConfig = {
  name: 'VNPT Hà Nội',
  shortName: 'VNPT',
  phoneDisplay: '0822 036 382',
  phoneRaw: '0822036382',
  hotlineDisplay: '1800.1166',
  hotlineRaw: '18001166',
  zaloUrl: 'https://zalo.me/0822036382',
  email: 'thinhdx.hni@vnpt.vn',
  address: '75 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
  employeeName: 'Đỗ Xuân Thịnh',
  employeeCode: '002120',
  officialWebsite: 'https://vnpt.com.vn/',
  legalDisclaimer:
    'Website kênh đại lý/nhân viên VNPT. Không phải website chính thức của Tập đoàn VNPT.',
  navLinks: [
    { href: '/bang-gia.html', label: 'Bảng giá' },
    { href: '/tim-goi-cuoc.html', label: 'Tìm gói cước' },
    { href: '/huong-dan-dang-ky.html', label: 'Hướng dẫn đăng ký' },
    { href: '/faq.html', label: 'Hỏi đáp' },
    { href: '/blog.html', label: 'Blog' },
  ],
  footerLinks: [
    { href: '/gioi-thieu.html', label: 'Giới thiệu' },
    { href: '/lien-he.html', label: 'Liên hệ' },
    { href: '/tuyen-bo-minh-bach.html', label: 'Tuyên bố minh bạch' },
    { href: '/chinh-sach-bao-mat.html', label: 'Chính sách bảo mật' },
    { href: '/dieu-khoan-su-dung.html', label: 'Điều khoản sử dụng' },
    { href: '/bang-gia.html', label: 'Bảng giá' },
    { href: '/tim-goi-cuoc.html', label: 'Tìm gói cước' },
    { href: '/blog.html', label: 'Blog' },
  ],
};

export function getSiteUrl() {
  return (import.meta.env.SITE_URL || '').replace(/\/+$/, '');
}

export function getGtagId() {
  return import.meta.env.PUBLIC_GTAG_ID || '';
}

export function getGoogleScriptUrl() {
  return import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL || '';
}
