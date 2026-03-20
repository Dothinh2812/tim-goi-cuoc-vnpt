# -*- coding: utf-8 -*-
from pathlib import Path
import html
import json
from datetime import date, timedelta

ROOT = Path(".")
OUT = ROOT / "blog-content"
OUT.mkdir(exist_ok=True)

POSTS = [
    ("blog-toc-do-mang-mbps-ping-jitter", "Tốc độ mạng là gì? Hiểu đúng Mbps, Ping, Jitter để đánh giá mạng", "Kiến thức Internet cơ bản", "Tuần 1", "tốc độ mạng là gì"),
    ("blog-wifi-24ghz-vs-5ghz", "WiFi 2.4GHz và 5GHz khác nhau gì? Nên dùng băng tần nào?", "Kiến thức Internet cơ bản", "Tuần 1", "wifi 2.4ghz và 5ghz"),
    ("blog-chon-goi-internet-gia-dinh", "Cách chọn gói internet cho gia đình 2-4-6 người", "Kiến thức Internet cơ bản", "Tuần 2", "chọn gói internet gia đình"),
    ("blog-chon-goi-internet-doanh-nghiep-nho", "Cách chọn gói internet cho doanh nghiệp nhỏ tối ưu chi phí", "Kiến thức Internet cơ bản", "Tuần 2", "gói internet doanh nghiệp nhỏ"),
    ("blog-vi-tri-dat-modem-router", "Vị trí đặt modem/router tốt nhất để tăng độ phủ sóng WiFi", "Tối ưu WiFi trong nhà", "Tuần 3", "vị trí đặt modem wifi"),
    ("blog-mesh-vs-repeater", "Mesh và Repeater khác nhau thế nào? Nên chọn giải pháp nào?", "Tối ưu WiFi trong nhà", "Tuần 3", "mesh và repeater khác nhau"),
    ("blog-meo-tang-toc-wifi", "10 mẹo tăng tốc WiFi không cần đổi gói cước", "Tối ưu WiFi trong nhà", "Tuần 4", "tăng tốc wifi không cần đổi gói"),
    ("blog-bo-tri-wifi-nha-nhieu-tang", "Nhà nhiều tầng bố trí WiFi như thế nào để không còn điểm chết", "Tối ưu WiFi trong nhà", "Tuần 4", "bố trí wifi nhà nhiều tầng"),
    ("blog-do-toc-do-mang-dung-cach", "Cách đo tốc độ mạng đúng cách tại nhà để có kết quả chuẩn", "Kiểm tra và xử lý sự cố mạng", "Tuần 5", "cách đo tốc độ mạng đúng cách"),
    ("blog-mang-cham-gio-cao-diem", "Mạng chậm giờ cao điểm: Nguyên nhân và cách xử lý nhanh", "Kiểm tra và xử lý sự cố mạng", "Tuần 5", "mạng chậm giờ cao điểm"),
    ("blog-checklist-tu-kiem-tra-mang", "Checklist 10 phút tự kiểm tra mạng trước khi gọi kỹ thuật", "Kiểm tra và xử lý sự cố mạng", "Tuần 6", "tự kiểm tra mạng trước khi gọi kỹ thuật"),
    ("blog-wifi-song-manh-nhung-lag", "WiFi sóng mạnh nhưng vẫn lag: Vì sao và cách khắc phục", "Kiểm tra và xử lý sự cố mạng", "Tuần 6", "wifi sóng mạnh nhưng mạng chậm"),
    ("blog-checklist-chat-luong-mang", "Checklist đánh giá chất lượng mạng tại nhà theo tuần", "Chất lượng dịch vụ và trải nghiệm", "Tuần 7", "đánh giá chất lượng mạng tại nhà"),
    ("blog-case-toi-uu-wifi-can-ho", "Case thực tế tối ưu WiFi căn hộ: Trước và Sau", "Chất lượng dịch vụ và trải nghiệm", "Tuần 7", "tối ưu wifi căn hộ"),
    ("blog-khi-nao-can-nang-cap-goi-cuoc", "Khi nào cần nâng cấp gói cước? Khi nào chỉ cần đổi thiết bị?", "Chất lượng dịch vụ và trải nghiệm", "Tuần 8", "khi nào cần nâng cấp gói cước internet"),
    ("blog-sai-lam-khien-mang-cham", "7 sai lầm khiến mạng chậm dù đã nâng gói cước", "Chất lượng dịch vụ và trải nghiệm", "Tuần 8", "tại sao nâng gói mà mạng vẫn chậm"),
    ("blog-doi-mat-khau-wifi-an-toan", "Đổi mật khẩu WiFi an toàn trong 3 phút: Hướng dẫn nhanh", "Bảo mật mạng gia đình", "Tuần 9", "đổi mật khẩu wifi an toàn"),
    ("blog-dau-hieu-dung-trom-wifi", "Dấu hiệu có người dùng trộm WiFi và cách chặn ngay", "Bảo mật mạng gia đình", "Tuần 9", "cách phát hiện dùng trộm wifi"),
    ("blog-cau-hinh-router-bao-mat", "Cấu hình router cơ bản để bảo mật mạng gia đình tốt hơn", "Bảo mật mạng gia đình", "Tuần 10", "cấu hình router bảo mật"),
    ("blog-guest-wifi-gia-dinh", "Hướng dẫn tạo Guest WiFi để bảo vệ mạng chính", "Bảo mật mạng gia đình", "Tuần 10", "tạo guest wifi"),
    ("blog-goi-internet-hoc-online-lam-viec", "Chọn gói internet cho học online và làm việc tại nhà", "So sánh gói cước theo nhu cầu", "Tuần 11", "gói internet học online"),
    ("blog-goi-internet-cho-gaming", "Chọn gói internet cho gaming: Ưu tiên tốc độ hay ping?", "So sánh gói cước theo nhu cầu", "Tuần 11", "gói internet cho game"),
    ("blog-goi-internet-cho-livestream", "Chọn gói internet cho livestream YouTube/TikTok ổn định", "So sánh gói cước theo nhu cầu", "Tuần 12", "gói internet livestream"),
    ("blog-goi-internet-cho-camera", "Chọn gói internet cho nhà có camera an ninh 24/7", "So sánh gói cước theo nhu cầu", "Tuần 12", "gói internet cho camera"),
    ("blog-top-goi-noi-thanh-ha-noi", "Top gói internet phù hợp khu vực nội thành Hà Nội", "So sánh gói cước theo nhu cầu", "Bổ sung", "top gói internet nội thành hà nội"),
    ("blog-top-goi-ngoai-thanh-ha-noi", "Top gói internet phù hợp khu vực ngoại thành Hà Nội", "So sánh gói cước theo nhu cầu", "Bổ sung", "top gói internet ngoại thành hà nội"),
    ("blog-so-sanh-goi-theo-nhu-cau", "So sánh gói theo nhu cầu: Học online, Gaming, Livestream, Camera", "So sánh gói cước theo nhu cầu", "Bổ sung", "so sánh gói internet theo nhu cầu"),
    ("blog-faq-internet-wifi", "FAQ Internet/WiFi: 20 câu hỏi thường gặp và cách xử lý", "Tổng hợp", "Bổ sung", "faq internet wifi"),
]

GROUP_TIPS = {
    "Kiến thức Internet cơ bản": [
        "Xác định nhu cầu sử dụng theo số người và số thiết bị dùng đồng thời.",
        "Phân biệt rõ tốc độ Download, Upload, Ping và độ ổn định kết nối.",
        "Đo kiểm có phương pháp trước khi quyết định nâng gói cước.",
    ],
    "Tối ưu WiFi trong nhà": [
        "Đặt modem/router ở vị trí thông thoáng, gần trung tâm nhà.",
        "Tách băng tần 2.4GHz và 5GHz để phân bổ thiết bị hợp lý.",
        "Đo lại sau từng thay đổi để biết giải pháp nào thật sự hiệu quả.",
    ],
    "Kiểm tra và xử lý sự cố mạng": [
        "Phân biệt lỗi đường truyền và lỗi WiFi nội bộ để xử lý đúng hướng.",
        "Đo lặp lại tối thiểu 2-3 lần trong cùng điều kiện để giảm sai số.",
        "Ghi lại dữ liệu đo để kỹ thuật xử lý nhanh và chính xác hơn.",
    ],
    "Chất lượng dịch vụ và trải nghiệm": [
        "Theo dõi định kỳ các chỉ số tốc độ, độ trễ và mức độ ổn định.",
        "So sánh trước/sau khi tối ưu để đánh giá hiệu quả thực tế.",
        "Ra quyết định nâng gói hay nâng thiết bị dựa trên dữ liệu đo.",
    ],
    "Bảo mật mạng gia đình": [
        "Đổi mật khẩu WiFi mạnh và cập nhật chuẩn bảo mật WPA2/WPA3.",
        "Kiểm tra thiết bị lạ đang kết nối mạng định kỳ hàng tuần.",
        "Tách Guest WiFi để bảo vệ mạng chính và thiết bị nội bộ.",
    ],
    "So sánh gói cước theo nhu cầu": [
        "So sánh theo nhóm nhu cầu thực tế: học online, gaming, livestream, camera.",
        "Ưu tiên độ ổn định và chỉ số ping/upload theo từng mục đích dùng.",
        "Đối chiếu chi phí theo chu kỳ thanh toán trước khi chốt gói.",
    ],
    "Tổng hợp": [
        "Tổng hợp câu hỏi phổ biến để tra cứu nhanh khi gặp sự cố.",
        "Chuẩn hóa quy trình tự kiểm tra trước khi liên hệ kỹ thuật.",
        "Liên kết sang bài chuyên sâu để đọc theo hành trình nhu cầu.",
    ],
}

FAQS = [
    ("Bao lâu nên kiểm tra lại tốc độ mạng?", "Nên kiểm tra định kỳ mỗi tuần hoặc khi có dấu hiệu chậm/rớt mạng bất thường."),
    ("Khi nào cần gọi kỹ thuật?", "Khi đã làm checklist tự kiểm tra nhưng mạng vẫn chậm, ping dao động cao hoặc mất kết nối lặp lại."),
    ("Có nên nâng gói ngay khi thấy chậm?", "Không nên nâng ngay. Cần xác định rõ lỗi do WiFi nội bộ hay do băng thông gói cước trước."),
]

def article_body(category: str) -> str:
    t = GROUP_TIPS.get(category, GROUP_TIPS["Tổng hợp"])
    faqs = "\n".join([f"<li><strong>{html.escape(q)}</strong> {html.escape(a)}</li>" for q, a in FAQS])
    return f"""
<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">Mở đầu</h2>
<p class="text-darkText/80 leading-relaxed">Bài viết giúp bạn xử lý đúng vấn đề thường gặp khi dùng Internet/WiFi tại nhà. Mục tiêu là kiểm tra nhanh, tối ưu đúng chỗ và tiết kiệm chi phí trước khi nâng gói hoặc thay thiết bị.</p>

<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">Vấn đề người dùng thường gặp</h2>
<ul class="list-disc pl-6 space-y-2 text-darkText/80">
  <li>{html.escape(t[0])}</li>
  <li>{html.escape(t[1])}</li>
  <li>{html.escape(t[2])}</li>
</ul>

<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">Hướng dẫn tự kiểm tra và tối ưu</h2>
<ol class="list-decimal pl-6 space-y-2 text-darkText/80">
  <li>Đo trong cùng điều kiện tối thiểu 2-3 lần.</li>
  <li>Ghi lại chỉ số Download, Upload, Ping và mức ổn định.</li>
  <li>So sánh trước/sau khi tối ưu để xác định bước hiệu quả.</li>
</ol>

<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">Checklist áp dụng nhanh</h2>
<ul class="list-disc pl-6 space-y-2 text-darkText/80">
  <li>Khởi động lại modem/router đúng cách.</li>
  <li>Đặt modem ở vị trí thông thoáng, gần trung tâm khu vực sử dụng.</li>
  <li>Ưu tiên 5GHz cho thiết bị gần, 2.4GHz cho thiết bị xa.</li>
  <li>Kiểm tra thiết bị lạ hoặc lưu lượng bất thường.</li>
  <li>Đo lại tốc độ mạng sau mỗi thay đổi.</li>
</ul>

<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">FAQ</h2>
<ul class="list-disc pl-6 space-y-2 text-darkText/80">
  {faqs}
</ul>

<h2 class="text-2xl font-heading text-darkText mt-8 mb-3">CTA</h2>
<ul class="list-disc pl-6 space-y-2 text-darkText/80">
  <li>Muốn tìm gói phù hợp: <a class="text-primary font-semibold hover:underline" href="tim-goi-cuoc.html">Tìm gói cước</a>.</li>
  <li>Muốn so sánh chi phí nhanh: <a class="text-primary font-semibold hover:underline" href="bang-gia.html">Xem bảng giá</a>.</li>
  <li>Cần tư vấn trực tiếp: gọi <a class="text-primary font-semibold hover:underline" href="tel:0822036382">0822 036 382</a>.</li>
</ul>
""".strip()

base_date = date(2026, 3, 23)
cards_by_cat = {}

for i, (slug, title, category, week, keyword) in enumerate(POSTS):
    d = base_date + timedelta(days=i)
    desc = f"Bài viết chuẩn SEO về {keyword}, có checklist và FAQ giúp bạn áp dụng ngay tại nhà."

    article_schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": desc,
        "datePublished": d.isoformat(),
        "dateModified": d.isoformat(),
        "author": {"@type": "Person", "name": "Đỗ Xuân Thịnh"},
        "publisher": {"@type": "Organization", "name": "VNPT Hà Nội", "logo": {"@type": "ImageObject", "url": "logo-vnpt.png"}},
        "mainEntityOfPage": {"@type": "WebPage", "@id": f"blog-content/{slug}.html"},
    }
    breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "index.html"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "blog.html"},
            {"@type": "ListItem", "position": 3, "name": title, "item": f"blog-content/{slug}.html"},
        ],
    }

    page = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)} | VNPT Blog</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="keywords" content="{html.escape(keyword)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = {{ theme: {{ extend: {{ colors: {{ primary:'#003399', secondary:'#0099CC', accent:'#FF6600', surface:'#F5F7FA', darkText:'#1A1A2E' }} }} }} }};</script>
  <style>
    body {{ font-family: 'Open Sans', 'Segoe UI', Arial, sans-serif; color: #1A1A2E; }}
    h1, h2, h3, .font-heading {{ font-family: 'Helvetica Neue', 'Arial', 'sans-serif'; font-weight: 700; }}
    .glass-nav {{ background: rgba(255,255,255,.95); backdrop-filter: blur(10px); }}
  </style>
  <script type="application/ld+json">{json.dumps(article_schema, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(breadcrumb_schema, ensure_ascii=False)}</script>
</head>
<body class="bg-surface antialiased">
  <nav class="fixed w-full z-50 glass-nav border-b border-primary/10">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <a href="../blog.html" class="text-primary font-bold">Blog</a>
        <a href="tel:0822036382" class="bg-accent text-white px-5 py-2 rounded-full font-bold">0822 036 382</a>
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 pt-28 pb-14">
    <div class="mb-5">
      <a href="../blog.html" class="text-primary font-semibold hover:underline">&larr; Quay lại trang Blog</a>
      <p class="text-sm text-darkText/60 mt-2">Chuyên mục: {html.escape(category)}</p>
    </div>
    <article class="bg-white border border-primary/10 rounded-2xl p-6 md:p-8 space-y-2">
      <h1 class="text-3xl md:text-4xl font-bold text-darkText mb-4">{html.escape(title)}</h1>
      {article_body(category)}
    </article>
  </main>
</body>
</html>
"""
    (OUT / f"{slug}.html").write_text(page, encoding="utf-8")

    cards_by_cat.setdefault(category, []).append((slug, title, week, desc))

cat_order = [
    "Kiến thức Internet cơ bản",
    "Tối ưu WiFi trong nhà",
    "Kiểm tra và xử lý sự cố mạng",
    "Chất lượng dịch vụ và trải nghiệm",
    "Bảo mật mạng gia đình",
    "So sánh gói cước theo nhu cầu",
    "Tổng hợp",
]

sections = []
for cat in cat_order:
    items = cards_by_cat.get(cat, [])
    if not items:
        continue
    cards = []
    for slug, title, week, desc in items:
        cards.append(
            f"""
        <article class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
          <p class="text-xs font-semibold text-secondary mb-2">{html.escape(week)}</p>
          <h3 class="text-xl font-heading text-darkText mb-2">{html.escape(title)}</h3>
          <p class="text-darkText/70 mb-4">{html.escape(desc)}</p>
          <a href="blog-content/{slug}.html" class="text-primary font-bold hover:underline">Đọc bài viết -&gt;</a>
        </article>
        """
        )
    sections.append(
        f"""
    <section class="mt-10">
      <h2 class="text-2xl md:text-3xl font-heading text-darkText mb-5">{html.escape(cat)}</h2>
      <div class="grid md:grid-cols-2 gap-6">{''.join(cards)}</div>
    </section>
    """
    )

blog_index = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Internet và WiFi | VNPT Hà Nội</title>
  <meta name="description" content="Tổng hợp bài viết kiến thức Internet, tối ưu WiFi, xử lý sự cố mạng và tư vấn gói cước theo nhu cầu.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = {{ theme: {{ extend: {{ colors: {{ primary:'#003399', secondary:'#0099CC', accent:'#FF6600', surface:'#F5F7FA', darkText:'#1A1A2E' }} }} }} }};</script>
  <style>
    body {{ font-family: 'Open Sans', 'Segoe UI', Arial, sans-serif; color: #1A1A2E; }}
    h1, h2, h3, .font-heading {{ font-family: 'Helvetica Neue', 'Arial', 'sans-serif'; font-weight:700; }}
    .glass-nav {{ background: rgba(255,255,255,.95); backdrop-filter: blur(10px); }}
  </style>
</head>
<body class="bg-surface antialiased">
  <nav class="fixed w-full z-50 glass-nav border-b border-primary/10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <a href="index.html" class="flex items-center gap-2">
          <img src="logo-vnpt.png" alt="VNPT Logo" class="h-12 w-auto object-contain">
          <span class="font-heading text-xl font-bold text-primary">VNPT Hà Nội</span>
        </a>
        <a href="tel:0822036382" class="bg-accent text-white px-6 py-3 rounded-full font-bold">0822 036 382</a>
      </div>
    </div>
  </nav>

  <header class="pt-32 pb-10 px-4 text-center max-w-5xl mx-auto">
    <span class="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">Blog chia sẻ kiến thức</span>
    <h1 class="text-4xl md:text-5xl font-heading text-darkText mt-4 mb-4">Cẩm nang Internet và WiFi</h1>
    <p class="text-darkText/70 text-lg">Toàn bộ bài viết SEO được sắp theo cụm chủ đề để dễ đọc, dễ tìm và dễ chuyển đổi.</p>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
    {''.join(sections)}
    <section class="mt-12 bg-white border border-primary/10 rounded-2xl p-7">
      <h2 class="text-2xl font-heading mb-3">Cần tư vấn gói phù hợp?</h2>
      <div class="flex flex-wrap gap-3">
        <a href="tim-goi-cuoc.html" class="bg-primary text-white px-5 py-3 rounded-full font-bold">Tìm gói cước</a>
        <a href="bang-gia.html" class="bg-primary/10 text-primary px-5 py-3 rounded-full font-bold">Xem bảng giá</a>
      </div>
    </section>
  </main>
</body>
</html>
"""

(ROOT / "blog.html").write_text(blog_index, encoding="utf-8")
print("Regenerated UTF-8 blog pages:", len(POSTS))
