/**
 * ============================================================
 * Google Apps Script — NPTEL Confirmation Portal
 * Paste this ENTIRE script into your Apps Script editor,
 * then deploy it as a Web App.
 * ============================================================
 *
 * HOW TO SET UP:
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste this entire file into the editor (replace any existing code)
 * 3. Click "Deploy" → "New deployment"
 * 4. Select type: "Web app"
 * 5. Set "Execute as": Me
 * 6. Set "Who has access": Anyone
 * 7. Click "Deploy" and copy the Web App URL
 * 8. Paste that URL into app.js → CONFIG.GOOGLE_SHEET_URL
 */

const SHEET_NAME = "NPTEL Submissions";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Roll Number",
        "Student Name",
        "Section",
        "Confirmed Courses",
        "Submitted At"
      ]);
      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#4f6ef7");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
    }

    // Append data row
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.roll_number || "",
      data.student_name || "",
      data.section || "CSE-A",
      data.confirmed_courses || "",
      data.submitted_at || new Date().toISOString(),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually in Apps Script to verify it works
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        roll_number: "23BQ1A0501",
        student_name: "Test Student",
        section: "CSE-A",
        confirmed_courses: "Software Testing, Cloud Computing",
        submitted_at: new Date().toISOString(),
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
