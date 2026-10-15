const ADMIN_CONFIG = {
  url: window.ENV.SUPABASE_URL,
  anonKey: window.ENV.SUPABASE_ANON_KEY,
  table: window.ENV.SUPABASE_TABLE,
};

const ADMIN_USERNAME = "CSE";
const ADMIN_PASSWORD = "2027";

const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const submissionsPanel = document.getElementById("submissionsPanel");
const submissionsBody = document.getElementById("submissionsBody");
const submissionSummary = document.getElementById("submissionSummary");
const emptyState = document.getElementById("emptyState");
const dataMessage = document.getElementById("dataMessage");
const downloadButton = document.getElementById("downloadButton");
const printButton = document.getElementById("printButton");
const signOutButton = document.getElementById("signOutButton");

let submissions = [];

function showMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = `status-msg visible ${type}`;
}

function clearMessage(element) {
  element.textContent = "";
  element.className = "status-msg";
}

function signIn(username, password) {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

async function fetchAllSubmissions() {
  const pageSize = 1000;
  const rows = [];

  for (let offset = 0; ; offset += pageSize) {
    const url = new URL(`/rest/v1/${encodeURIComponent(ADMIN_CONFIG.table)}`, ADMIN_CONFIG.url);
    url.searchParams.set("select", "roll_number,student_name,confirmed_courses,course_41,submitted_at");
    url.searchParams.set("order", "submitted_at.desc");

    const response = await fetch(url, {
      headers: {
        apikey: ADMIN_CONFIG.anonKey,
        Authorization: `Bearer ${ADMIN_CONFIG.anonKey}`,
        Range: `${offset}-${offset + pageSize - 1}`,
      },
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Could not load submissions (${response.status}): ${detail}`);
    }

    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function renderSubmissions(rows) {
  submissionsBody.replaceChildren();
  rows.forEach((submission) => {
    const row = document.createElement("tr");
    const submittedAt = submission.submitted_at
      ? new Date(submission.submitted_at).toLocaleString()
      : "";
    [
      submission.roll_number,
      submission.student_name,
      submission.confirmed_courses,
      submission.course_41,
      submittedAt,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "—";
      row.appendChild(cell);
    });
    submissionsBody.appendChild(row);
  });

  const uniqueStudents = new Set(
    rows.map((row) => (row.roll_number || "").trim().toUpperCase()).filter(Boolean)
  ).size;
  submissionSummary.textContent = `${uniqueStudents} student(s) submitted · ${rows.length} confirmation(s)`;
  emptyState.hidden = rows.length > 0;
  downloadButton.disabled = rows.length === 0;
  printButton.disabled = rows.length === 0;
}

async function loadSubmissions() {
  clearMessage(dataMessage);
  submissionSummary.textContent = "Loading submissions…";
  try {
    submissions = await fetchAllSubmissions();
    renderSubmissions(submissions);
  } catch (error) {
    submissionSummary.textContent = "";
    showMessage(dataMessage, error.message);
    throw error;
  }
}

function excelCell(value) {
  const text = String(value ?? "");
  const escaped = text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
  return `<Cell><Data ss:Type="String">${escaped}</Data></Cell>`;
}

function downloadExcelWorkbook() {
  const headings = ["Roll number", "Student name", "Confirmed courses", "4-1 course", "Submitted at"];
  const records = submissions.map((row) => [
    row.roll_number,
    row.student_name,
    row.confirmed_courses,
    row.course_41,
    row.submitted_at,
  ]);
  const worksheetRows = [headings, ...records]
    .map((row) => `<Row>${row.map(excelCell).join("")}</Row>`)
    .join("");
  const workbook = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Submissions"><Table>${worksheetRows}</Table></Worksheet>
</Workbook>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "nptel-submissions.xml";
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(loginMessage);
  loginButton.disabled = true;

  try {
    const validLogin = signIn(
      document.getElementById("username").value,
      document.getElementById("password").value
    );
    if (!validLogin) throw new Error("Invalid username or password.");
    loginPanel.hidden = true;
    submissionsPanel.hidden = false;
    await loadSubmissions();
  } catch (error) {
    if (submissionsPanel.hidden) showMessage(loginMessage, error.message);
  } finally {
    loginButton.disabled = false;
  }
});

downloadButton.addEventListener("click", downloadExcelWorkbook);
printButton.addEventListener("click", () => window.print());
signOutButton.addEventListener("click", () => {
  submissions = [];
  submissionsBody.replaceChildren();
  loginForm.reset();
  submissionsPanel.hidden = true;
  loginPanel.hidden = false;
  clearMessage(loginMessage);
  clearMessage(dataMessage);
});
