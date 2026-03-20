# Lead Capture Setup (Google Sheets + Apps Script)

## 1) Deploy Google Apps Script
1. Create/open a Google Sheet for leads.
2. Open `Extensions -> Apps Script`.
3. Replace default code with file `google-apps-script-leads.gs`.
4. Click `Deploy -> New deployment -> Web app`.
5. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
6. Copy the Web App URL.

## 2) Connect website form
1. Open `lead-capture.js`.
2. Update:
   - `const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
3. Save file and deploy/update site.

## 3) Verify
1. Open site, submit phone in bottom form on `index.html`.
2. Check Sheet tab `Leads`:
   - `created_at`, `phone`, `page_url`, UTM fields, `status = new`.

## 4) Notes
- Current front-end validates phone by regex `10-11` digits.
- Form is now handled by `lead-capture.js` (old inline fake alert is bypassed).
- If you regenerate/redeploy Apps Script, URL may change. Update `lead-capture.js`.
