# Landing Page - Internet VNPT Giá Rẻ

Landing page cho nhóm KH: gia đình nhỏ, phòng trọ, internet thuần, không mesh, nhạy cảm giá.

## Cấu trúc file

```
landing-internet/
├── index.html        # Landing page (HTML + CSS + JS tất cả trong 1 file)
├── apps-script.js    # Code Google Apps Script để lưu form vào Google Sheet
└── README.md         # File này
```

## Setup Google Sheet (nhận dữ liệu form)

### Bước 1: Tạo Google Sheet
1. Vào [Google Sheets](https://sheets.google.com) → Tạo bảng tính mới
2. Đặt tên: `Đăng ký Internet VNPT`

### Bước 2: Cài đặt Apps Script
1. Trong Google Sheet → **Extensions** → **Apps Script**
2. Xóa hết code mặc định
3. Copy toàn bộ nội dung file `apps-script.js` → paste vào
4. Click **Save** (Ctrl+S)

### Bước 3: Deploy Web App
1. Click **Deploy** → **New deployment**
2. Click biểu tượng bánh răng → chọn **Web app**
3. Cấu hình:
   - **Description**: `Form Landing Page`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. **Authorize** khi được hỏi (chọn tài khoản Google, Allow)
6. **Copy URL** Web App

### Bước 4: Kết nối Landing Page
1. Mở file `index.html`
2. Tìm dòng:
   ```js
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Thay `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` bằng URL đã copy ở Bước 3

## Deploy lên Vercel

### Cách 1: Deploy trực tiếp (nhanh nhất)
1. Cài [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
2. Mở terminal tại thư mục `landing-internet/`
3. Chạy: `vercel`
4. Làm theo hướng dẫn → nhận URL

### Cách 2: Deploy qua GitHub
1. Push thư mục `landing-internet/` lên GitHub repo
2. Vào [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo từ GitHub
4. Framework Preset: **Other**
5. Root Directory: `landing-internet`
6. Click **Deploy**

## Thông tin liên hệ trên page
- **Hotline**: 0822.036.382
- **Zalo**: https://zalo.me/0946827186

## Gói cước hiển thị

| Gói | Tốc độ | Nội thành | Ngoại thành |
|---|---|---|---|
| Home 1 | 300 Mbps | 235K/th | 190K/th |
| Home 2 | 500 Mbps | 280K/th | 240K/th |
| Home 3 | 500-1000 Mbps | 320K/th | 280K/th |

## Test trước khi live
1. Mở `index.html` trên trình duyệt
2. Kiểm tra responsive (F12 → toggle device)
3. Click nút Gọi → mở app call
4. Click nút Zalo → mở Zalo
5. Toggle Nội thành/Ngoại thành → giá phải thay đổi
6. Submit form → kiểm tra Google Sheet có nhận dữ liệu
