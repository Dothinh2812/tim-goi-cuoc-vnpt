/**
 * Google Apps Script Web App for lead capture.
 *
 * Setup:
 * 1) Create a Google Sheet.
 * 2) Extensions -> Apps Script, paste this file.
 * 3) Deploy -> New deployment -> Web app.
 * 4) Execute as: Me.
 * 5) Who has access: Anyone.
 * 6) Copy Web App URL and paste into lead-capture.js (GOOGLE_SCRIPT_URL).
 */

var SHEET_NAME = 'Leads';
var HEADERS = [
  'created_at',
  'phone',
  'page_url',
  'page_path',
  'page_title',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'user_agent',
  'ip_hint',
  'status',
];

function doGet() {
  return jsonOutput({
    status: 'ok',
    message: 'Lead endpoint is running',
    date: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    var payload = parsePayload_(e);
    var phone = normalizePhone_(payload.phone);

    if (!/^\d{10,11}$/.test(phone)) {
      return jsonOutput({ status: 'error', message: 'invalid_phone' });
    }

    var sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      phone,
      safe_(payload.page_url),
      safe_(payload.page_path),
      safe_(payload.page_title),
      safe_(payload.referrer),
      safe_(payload.utm_source),
      safe_(payload.utm_medium),
      safe_(payload.utm_campaign),
      safe_(payload.utm_term),
      safe_(payload.utm_content),
      safe_(payload.user_agent),
      safe_(payload.ip_hint),
      'new',
    ]);

    return jsonOutput({ status: 'success' });
  } catch (error) {
    return jsonOutput({
      status: 'error',
      message: String(error && error.message ? error.message : error),
    });
  }
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setFontWeight('bold');
    range.setBackground('#003399');
    range.setFontColor('#ffffff');
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 120);
    sheet.setColumnWidth(3, 280);
    sheet.setColumnWidth(4, 140);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 220);
    sheet.setColumnWidth(7, 120);
    sheet.setColumnWidth(8, 120);
    sheet.setColumnWidth(9, 160);
    sheet.setColumnWidth(10, 120);
    sheet.setColumnWidth(11, 120);
    sheet.setColumnWidth(12, 240);
    sheet.setColumnWidth(13, 120);
    sheet.setColumnWidth(14, 100);
  }

  return sheet;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function normalizePhone_(value) {
  return String(value || '').replace(/\D+/g, '');
}

function safe_(value) {
  return value === undefined || value === null ? '' : String(value);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
