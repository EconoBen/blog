# Subscribe Form Setup — Google Sheets Backend

## How it works

1. User enters email on the book page → hits Subscribe
2. Next.js `/api/subscribe` route validates the email
3. Route POSTs to a Google Apps Script web app
4. Apps Script appends a row (email, timestamp) to a Google Sheet
5. User sees "You're on the list" confirmation

## Setup Steps

### 1. Create the Google Sheet

1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it "Agent Memory Subscribers"
3. In row 1, add headers: `Email` | `Timestamp` | `Source`
4. Note the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Create the Google Apps Script

1. In the spreadsheet, go to Extensions > Apps Script
2. Replace the default code with:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Check for duplicate emails
    var emails = sheet.getRange("A:A").getValues().flat();
    if (emails.includes(data.email)) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'already_subscribed' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      data.email,
      data.timestamp || new Date().toISOString(),
      'book-page'
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click Deploy > New deployment
4. Type: Web app
5. Execute as: Me
6. Who has access: Anyone
7. Click Deploy and authorize when prompted
8. Copy the web app URL

### 3. Add the URL to your environment

Add to `.env` (or `.env.local`):

```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Test

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Check the Google Sheet — you should see a new row.

### 5. Production

Add `GOOGLE_APPS_SCRIPT_URL` to your Vercel environment variables.

## Notes

- The Apps Script handles duplicate checking
- No service account needed — Apps Script runs as you
- Free, unlimited rows in Google Sheets
- You can add columns later (name, referrer, etc.)
- To send updates, export the sheet and use Gmail BCC or any bulk sender
