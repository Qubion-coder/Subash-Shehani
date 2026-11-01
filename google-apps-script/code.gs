// Subash & Shehani wedding - RSVP endpoint
// Sheet: https://docs.google.com/spreadsheets/d/1z56gBqQwD99L3iGHt2nw7eaQ9mj79tzHVbfbtgwxffY/edit
// Replies are saved straight into the first tab of this spreadsheet (no separate tab)
const SPREADSHEET_ID = '1z56gBqQwD99L3iGHt2nw7eaQ9mj79tzHVbfbtgwxffY';

const RSVP_HEADERS = ['Timestamp', 'Guest Name', 'Attending', 'Guests', 'Invited To', 'Message'];

const EVENT_LABELS = {
  both: 'Church Mass & Reception',
  church: 'Church Mass only',
  reception: 'Reception only',
};

function doPost(e) {
  // Stop two replies arriving at once from overwriting the same row
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload_(e);
    if (!String(payload.fullName || '').trim()) {
      return jsonResponse_({ ok: false, error: 'Missing guest name.' });
    }

    const sheet = getSheet_();
    const attending = String(payload.attendance || '').toLowerCase() === 'yes';

    sheet.appendRow([
      new Date(),
      clean_(payload.fullName),
      attending ? 'Yes' : 'No',
      attending ? Number(payload.guests) || 1 : 0,
      EVENT_LABELS[payload.event] || EVENT_LABELS.both,
      clean_(payload.thoughts || payload.dietaryNotes),
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Subash & Shehani RSVP endpoint is running.',
  });
}

// Run this once from the editor to add the headers and grant access
function setup() {
  getSheet_();
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) {
    return {};
  }

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

// First tab of the spreadsheet, with a header row added if it is empty
function getSheet_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
    sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setFontWeight('bold').setBackground('#e7c3cb');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trim text and stop it being read as a spreadsheet formula
function clean_(value) {
  const text = String(value || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
