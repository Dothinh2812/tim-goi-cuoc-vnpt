---
name: vnpt-design
description: >
  Tạo ảnh minh họa, thiết kế đồ họa và prompt AI cho bài đăng Fanpage theo đúng bộ nhận diện
  thương hiệu VNPT (màu #003399, #0099CC, phong cách tối giản hiện đại). Dùng skill này bất
  cứ khi nào người dùng yêu cầu tạo ảnh bài đăng, thiết kế infographic, prompt Canva/Midjourney/
  Firefly cho VNPT, tạo banner khuyến mãi, thiết kế ảnh minh họa Fanpage viễn thông, hoặc hỏi
  về màu sắc và bộ nhận diện thương hiệu VNPT. LUÔN dùng skill này kết hợp với skill fanpage-vien-thong
  khi người dùng yêu cầu thiết kế đi kèm bài viết.
---

# Skill: Thiết Kế Đồ Họa & Tạo Prompt AI theo Brand VNPT

## Bước 1 – Đọc tài liệu nền tảng

Đọc các file sau trước khi xuất bất kỳ thiết kế hay prompt nào:

- `references/brand-colors.md` — Bảng màu, typography, logo, kích thước chuẩn Facebook
- `references/design-templates.md` — 6 template bố cục theo loại bài đăng
- `references/prompt-library.md` — Thư viện prompt AI sẵn có theo chủ đề

---

## Bước 2 – Xác định yêu cầu

Hỏi gọn nếu thiếu thông tin (tối đa 1 lần hỏi):

| Thông tin | Ví dụ |
|---|---|
| **Loại thiết kế** | Infographic / Banner / Post ảnh / Story / Ảnh nền |
| **Chủ đề / Nội dung** | Mẹo WiFi / Cảnh báo / Khuyến mãi / Kỹ thuật viên |
| **Trụ cột nội dung** | Education / Human / Engagement / Promotion |
| **Công cụ dùng** | Canva / Midjourney / Firefly / DALL-E / Leonardo / Khác |
| **Kích thước** | Vuông 1080×1080 / Ngang 1200×628 / Story 1080×1920 |

---

## Bước 3 – Chọn template và quy tắc màu

Dựa vào loại bài đăng, chọn template phù hợp từ `design-templates.md`:

| Loại bài | Template |
|---|---|
| Mẹo / Hướng dẫn (Education) | Template 1: Infographic Mẹo |
| Cảnh báo / An toàn số | Template 2: Cảnh báo |
| Câu chuyện / Cảm hứng (Human) | Template 3: Quote ảnh thực |
| So sánh / Tư vấn | Template 4: A vs B |
| Khuyến mãi (Promotion) | Template 5: Ưu đãi |
| Tương tác / Mini-game | Template 6: Engagement |

**Luôn áp dụng quy tắc màu 60-25-10-5:**
- 60% xanh đậm `#003399`
- 25% trắng `#FFFFFF`
- 10% xanh nhạt `#0099CC`
- 5% cam accent `#FF6600` (chỉ 1 điểm nhấn duy nhất)

---

## Bước 4 – Xuất output theo cấu trúc chuẩn

Mọi output đều xuất đủ 4 phần sau:

```
🎨 THÔNG SỐ THIẾT KẾ
─────────────────────────────────
Template    : [Tên template]
Kích thước  : [px × px]
Định dạng   : [JPG/PNG/MP4]

📐 BỐ CỤC & MÔ TẢ LAYOUT
─────────────────────────────────
[Mô tả chi tiết từng vùng của thiết kế:
 Header / Body / Footer / Các yếu tố nổi bật
 Vị trí logo, màu từng vùng, nội dung text cần đặt vào]

🤖 PROMPT AI (Tiếng Anh – dùng cho image generation)
─────────────────────────────────
[Prompt đầy đủ, copy-paste được, tối ưu cho tool đã chọn]
Negative prompt: --no [danh sách loại trừ]

🎨 PROMPT CANVA (Tiếng Việt – nếu dùng Canva Magic Design)
─────────────────────────────────
[Prompt tiếng Việt ngắn gọn cho Canva AI]

⚙️ HƯỚNG DẪN THỰC HIỆN TRONG CANVA
─────────────────────────────────
[Các bước cụ thể để hoàn thiện thiết kế trong Canva:
 màu cần chỉnh, font cần dùng, phần tử cần thêm/bỏ]
```

---

## Bước 5 – Tạo hàng loạt (Batch Design)

Khi người dùng cần thiết kế cho cả lịch tuần hoặc nhiều bài cùng lúc:

1. Tạo output theo thứ tự ngày trong tuần (Thứ 2 → Chủ nhật)
2. Đảm bảo đa dạng template — không dùng cùng 1 template 2 ngày liên tiếp
3. Thống nhất bộ màu xuyên suốt để tạo visual identity nhất quán
4. Ghi rõ tên file gợi ý: `VNPT_[Ngày]_[ChủĐề]_[KíchThước].png`

---

## Quy tắc thương hiệu BẮT BUỘC (không được bỏ qua)

### ✅ PHẢI có trong mọi thiết kế
- Logo VNPT đúng phiên bản (trắng trên nền xanh, màu trên nền sáng)
- Màu `#003399` chiếm ít nhất 60% diện tích
- Wave pattern / orbit line xuất hiện ít nhất 1 lần (thường ở footer)
- Font: Helvetica Bold (headline) / Open Sans (body) — không dùng font trang trí
- Text đủ lớn để đọc rõ trên màn hình điện thoại (headline ≥ 48px với 1080px canvas)

### ❌ TUYỆT ĐỐI KHÔNG
- Dùng ảnh stock có watermark
- Đặt logo lên vùng bận (cluttered background) không có clear space
- Dùng quá nhiều màu (tối đa 4 màu theo bảng chuẩn)
- Font chữ có chân (Serif) hoặc font trang trí khó đọc
- Kéo dãn / bóp méo logo
- Dùng màu xanh lá, vàng, tím — không thuộc bộ màu VNPT

---

## Ví dụ output hoàn chỉnh

### Yêu cầu: "Tạo ảnh infographic mẹo WiFi, dùng Canva"

```
🎨 THÔNG SỐ THIẾT KẾ
─────────────────────────────────
Template    : Template 1 – Infographic Mẹo/Hướng dẫn
Kích thước  : 1080 × 1080px (Post vuông Facebook)
Định dạng   : PNG

📐 BỐ CỤC & MÔ TẢ LAYOUT
─────────────────────────────────
• Header (15% trên – 162px):
  Nền: #003399 | Badge cam #FF6600: "MẸO HỮU ÍCH"
  Logo VNPT trắng – góc trên trái | Padding: 24px

• Body (70% giữa – 756px):
  Nền: #FFFFFF
  Tiêu đề lớn: "ĐẶT MODEM ĐÚNG CHỖ – MẠNG KHỎE CẢ NHÀ"
  Font: Open Sans Bold, 52px, màu #003399

  4 điểm nội dung (icon trái + text phải):
  ✅ [Icon nhà giữa] Đặt ở trung tâm nhà → phủ đều
  ❌ [Icon tường góc] Sát tường ngoài → sóng ra đường
  ❌ [Icon lò vi sóng] Cạnh lò vi sóng → nhiễu sóng
  ❌ [Icon tủ gỗ] Trong tủ kín → sóng bị chặn

  Icon màu: ✅ #0099CC | ❌ #CC2200
  Text: Open Sans Regular, 26px, #1A1A2E

• Footer (15% dưới – 162px):
  Gradient: #003399 → #0099CC (trái → phải)
  Wave pattern opacity 20% | Text trắng: "Inbox mình để được tư vấn miễn phí!"
  Logo VNPT trắng góc phải

🤖 PROMPT AI (Tiếng Anh)
─────────────────────────────────
Flat design infographic illustration, Vietnamese telecom brand style.
House floor plan from top view showing WiFi router placement.
One router in center of house glowing blue (#0099CC), signal waves spreading evenly.
Three incorrect positions marked with red X: corner wall, near microwave, inside cabinet.
Color palette: deep blue #003399, cyan #0099CC, white background, red #CC2200 for wrong.
Clean rounded icons, modern sans-serif labels area (no actual text).
3 subtle arc wave lines in footer area, opacity 20%.
Professional corporate minimalist style. 1080x1080px square.
--no text, watermark, realistic photo, dark background, green color, cluttered

🎨 PROMPT CANVA
─────────────────────────────────
Infographic nhà và vị trí đặt router WiFi, flat design hiện đại,
màu xanh đậm #003399 và xanh nhạt #0099CC, nền trắng, icon tối giản,
phong cách chuyên nghiệp viễn thông, không có chữ

⚙️ HƯỚNG DẪN THỰC HIỆN TRONG CANVA
─────────────────────────────────
1. Tạo canvas mới: 1080 × 1080px
2. Thêm rectangle header 1080×162px, fill: #003399
3. Upload logo VNPT (white version), đặt góc trên trái, padding 24px
4. Thêm badge hình tròn/pill, fill: #FF6600, text: "MẸO HỮU ÍCH"
5. Import ảnh AI vừa tạo vào vùng body (góc 0, 162 → 918px)
6. Thêm rectangle footer 1080×162px, gradient #003399→#0099CC
7. Thêm wave pattern element (Elements → tìm "wave") màu trắng opacity 20%
8. Font toàn bộ: Open Sans (cài qua Brand Kit)
9. Export: PNG chất lượng cao
10. Lưu file: VNPT_T4_MeoWifi_1080x1080.png
```

---

## Tích hợp với skill fanpage-vien-thong

Khi người dùng dùng cả 2 skill cùng lúc (viết bài + tạo ảnh):
1. Đọc "Ghi chú sản xuất" từ output của skill `fanpage-vien-thong`
2. Dùng thông tin đó làm input cho Bước 2 của skill này
3. Đảm bảo ảnh và caption cùng tone, cùng đối tượng mục tiêu
