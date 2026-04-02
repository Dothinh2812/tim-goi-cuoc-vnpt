// ============================================================
// FILE: Code.gs - Chatbot Leads + Hot Lead Email Alert
// ============================================================

var SPREADSHEET_ID = '1YzovGVunLbjq7Qqprq2AKMeZopVvqL9mwYaQDpCc-_M';
var SHEET_NAME = 'Sheet1';
var SALES_ALERT_EMAIL = 'sales@example.com';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Khong nhan duoc du lieu postData');
    }

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Khong tim thay sheet: ' + SHEET_NAME);
    }

    var data = JSON.parse(e.postData.contents);
    var newTime = data.timestamp || new Date().toLocaleString('vi-VN');
    var newName = data.name || '';
    var newPhone = data.phone || '';
    var newEmail = data.email || '';
    var newSource = data.source || '';
    var newSessionId = data.sessionId || '';
    var newHistory = data.chatHistory || '';
    var newInterest = data.interest || '';
    var newIntentLevel = (data.intent_level || '').toString().toLowerCase();

    var values = sheet.getDataRange().getValues();
    var rowIndexToUpdate = -1;

    if (newSessionId) {
      for (var i = values.length - 1; i > 0; i--) {
        var rowSessionId = values[i][5] ? values[i][5].toString().trim() : '';
        if (rowSessionId === newSessionId) {
          rowIndexToUpdate = i + 1;
          break;
        }
      }
    }

    if (rowIndexToUpdate > -1) {
      var currentRow = values[rowIndexToUpdate - 1];

      if (!currentRow[1] && newName) sheet.getRange(rowIndexToUpdate, 2).setValue(newName);
      if (!currentRow[2] && newPhone) sheet.getRange(rowIndexToUpdate, 3).setValue(newPhone);
      if (!currentRow[3] && newEmail) sheet.getRange(rowIndexToUpdate, 4).setValue(newEmail);
      if (newHistory) sheet.getRange(rowIndexToUpdate, 7).setValue(newHistory);
      if (!currentRow[7] && newInterest) sheet.getRange(rowIndexToUpdate, 8).setValue(newInterest);
      if (!currentRow[8] && newIntentLevel) sheet.getRange(rowIndexToUpdate, 9).setValue(newIntentLevel);

      sheet.getRange(rowIndexToUpdate, 1).setValue(newTime);
    } else {
      sheet.appendRow([
        newTime,
        newName,
        newPhone,
        newEmail,
        newSource,
        newSessionId,
        newHistory,
        newInterest,
        newIntentLevel,
      ]);
    }

    if (newIntentLevel === 'hot') {
      sendHotLeadEmail_({
        timestamp: newTime,
        name: newName,
        phone: newPhone,
        email: newEmail,
        interest: newInterest,
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('API Chatbot Leads dang hoat dong');
}

function sendHotLeadEmail_(lead) {
  if (!SALES_ALERT_EMAIL) {
    return;
  }

  var subject = 'KHACH HANG NONG - CAN LIEN HE NGAY';
  var body =
    'KHACH HANG NONG - CAN LIEN HE NGAY!\n\n' +
    'Ten: ' + (lead.name || '') + '\n' +
    'SDT: ' + (lead.phone || '') + '\n' +
    'Email: ' + (lead.email || '') + '\n' +
    'Quan tam: ' + (lead.interest || '') + '\n' +
    'Thoi gian: ' + (lead.timestamp || '') + '\n\n' +
    'Vui long lien he khach hang nay trong vong 30 phut!';

  MailApp.sendEmail({
    to: SALES_ALERT_EMAIL,
    subject: subject,
    body: body,
  });
}
