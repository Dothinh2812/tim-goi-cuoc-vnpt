/**
 * Google Apps Script - Nhận dữ liệu đăng ký từ Landing Page và lưu vào Google Sheet
 *
 * HƯỚNG DẪN:
 * 1. Mở Google Sheet → Extensions → Apps Script
 * 2. Xóa code mặc định, paste toàn bộ code này vào
 * 3. Click "Deploy" → "New deployment"
 * 4. Type: "Web app"
 * 5. Execute as: "Me"
 * 6. Who has access: "Anyone"
 * 7. Click "Deploy" → Copy URL
 * 8. Dán URL vào biến GOOGLE_SCRIPT_URL trong file index.html
 */

// Tự động tạo header khi chạy lần đầu
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = ['Thời gian', 'Họ tên', 'Số điện thoại', 'Địa chỉ', 'Gói cước', 'Ghi chú', 'Nguồn', 'Trạng thái'];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);

    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0056B3');
    headerRange.setFontColor('#FFFFFF');

    // Set column widths
    sheet.setColumnWidth(1, 160); // Thời gian
    sheet.setColumnWidth(2, 160); // Họ tên
    sheet.setColumnWidth(3, 130); // SĐT
    sheet.setColumnWidth(4, 250); // Địa chỉ
    sheet.setColumnWidth(5, 200); // Gói cước
    sheet.setColumnWidth(6, 200); // Ghi chú
    sheet.setColumnWidth(7, 200); // Nguồn
    sheet.setColumnWidth(8, 120); // Trạng thái

    // Freeze header row
    sheet.setFrozenRows(1);
  }
}

// Xử lý POST request từ landing page
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Setup header nếu chưa có
    if (sheet.getLastRow() === 0) {
      setupSheet();
    }

    const data = JSON.parse(e.postData.contents);

    // Thêm dữ liệu vào sheet
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('vi-VN'),
      data.name || '',
      data.phone || '',
      data.address || '',
      data.package || '',
      data.note || '',
      data.source || '',
      'Mới' // Trạng thái mặc định
    ]);

    // Trả về kết quả
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý GET request (test)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Apps Script is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
