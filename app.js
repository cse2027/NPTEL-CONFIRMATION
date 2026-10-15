/* ===================================================
   NPTEL Confirmation Portal – app.js
   Credentials loaded from config.js (window.ENV)
   =================================================== */

/* -------------------------------------------------------
   Pull config from window.ENV (set in config.js)
   ------------------------------------------------------- */
const CONFIG = {
  SUPABASE_URL:     window.ENV.SUPABASE_URL,
  SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY,
  SUPABASE_TABLE:   window.ENV.SUPABASE_TABLE,
  GOOGLE_SHEET_URL: window.ENV.GOOGLE_SHEET_URL,
  POLL_INTERVAL_MS: window.ENV.POLL_INTERVAL_MS || 5000,
};

/* -------------------------------------------------------
   CSE-A Student Data
   courses  → NPTEL registered courses (cols 3-5 in Excel)
   course41 → 4-1 Semester course (col 6 in Excel)
   ------------------------------------------------------- */
const STUDENTS = [
  { roll: "23BQ1A0501", name: "AALLA TIRUMALA KOTI REDDY", courses: ["SOCIAL NETWORKS"], course41: "" },
  { roll: "23BQ1A0502", name: "Adarsh Kiran Tappita", courses: ["Programming in Modern C++", "Programming in JAVA"], course41: "" },
  { roll: "23BQ1A0503", name: "Akshai Manidev Borugadda", courses: ["Social networks", "Internet of things", "Software testing"], course41: "" },
  { roll: "23BQ1A0504", name: "Akurati Bhavyasree", courses: ["Software Testing", "Introduction to Large Language Models"], course41: "" },
  { roll: "23BQ1A0505", name: "ALA HEMA SRI", courses: ["Fundamentals of Object Oriented Programming", "Cloud Computing", "Introduction to Database Systems"], course41: "Ethical Hacking" },
  { roll: "23BQ1A0506", name: "ALAKUNTA HARSHITHA SAI", courses: ["Introduction to Database Systems", "Getting Started with Competitive Programming", "Programming in Java"], course41: "Ethical Hacking" },
  { roll: "23BQ1A0507", name: "Alamuri Yamini", courses: ["The joy of computing using python", "Cyber security and privacy", "Database management system"], course41: "" },
  { roll: "23BQ1A0508", name: "ALETI SHAKEENA RANI", courses: ["Programming in Java", "Social Networks"], course41: "" },
  { roll: "23BQ1A0509", name: "Allam Ashok Reddy", courses: ["Programming in Java", "Programming in modern C++"], course41: "" },
  { roll: "23BQ1A0510", name: "Amruthaluri Samarpan", courses: ["Introduction to Large Language Models(LLMs)", "PROGRAMMING IN JAVA"], course41: "Software Testing" },
  { roll: "23BQ1A0511", name: "Jayaprakash Amudalapalli", courses: ["Programming in Java", "Cyber Security and Privacy", "Data Analytics with Python"], course41: "" },
  { roll: "23BQ1A0512", name: "ANGOTHU SAI BALAJI NAYAK", courses: ["Introduction to large language models"], course41: "" },
  { roll: "23BQ1A0513", name: "ANKALA PREETHI", courses: ["PROGRAMMING IN JAVA", "CLOUD COMPUTING"], course41: "" },
  { roll: "23BQ1A0514", name: "ANNAPUREDDY LAKSHMI SUSHMA SRI", courses: ["THE JOY OF COMPUTING USING PYTHON", "SOFTWARE TESTING"], course41: "" },
  { roll: "23BQ1A0515", name: "A.Naveen Reddy", courses: [], course41: "SOCIAL NETWORKS AND SOFTWARE TESTING" },
  { roll: "23BQ1A0516", name: "APPIDI SUSHMITHA", courses: ["Programming In Java", "Programming in Modern C++", "Introduction to Large Language Models (LLMs)"], course41: "" },
  { roll: "23bq1a0517", name: "ARUMULLA SARVANTHI", courses: ["The joy of computing python", "Software Testing"], course41: "" },
  { roll: "23BQ1A0518", name: "Bandi Lakshmidhar Reddy", courses: ["Programming in Modern C++"], course41: "" },
  { roll: "23BQ1A0519", name: "Bapathu Srimani Jashitha", courses: ["The Joy of Computing using Python", "Reinforcement Learning", "Data Analytics with Python"], course41: "" },
  { roll: "23BQ1A0520", name: "BAPATLA KAVYA SRI", courses: ["Introduction to Large Language Models (LLMs)"], course41: "" },
  { roll: "23bq1a0521", name: "Bapatla prudhvi", courses: ["Software testing"], course41: "Cyber security and privacy" },
  { roll: "23BQ1A0522", name: "BATCHALAKURI UDAY KIRAN", courses: ["The Joy of Computing using Python", "Programming In Java"], course41: "Introduction to Large Language Models (LLMs)" },
  { roll: "23BQ1A0523", name: "Battineni Sri Varsha", courses: ["Cloud Computing", "Software Project Management"], course41: "" },
  { roll: "23BQ1A0524", name: "BATTULA TEJA SWAROOP", courses: ["Introduction to Large Language Models (LLMs)", "Cyber Security and Privacy"], course41: "Quantum Based" },
  { roll: "23BQ1A0525", name: "Bejawada Manoj Praveen", courses: ["Programming in Java", "Data Analytics with Python", "Data Base Management System"], course41: "" },
  { roll: "23BQ1A0527", name: "BHIMIREDDY VAISHNAVI REDDY", courses: ["Introduction to Large Language Models (LLMs)", "Programming in Modern C++", "Programming In Java"], course41: "" },
  { roll: "23bq1a0528", name: "Bhudadra Mohit Sharma", courses: [], course41: "Software Testing" },
  { roll: "23BQ1A0530", name: "BHUPATHI PRAGYNA", courses: ["Introduction to Quantum Computing: Quantum Algorithms and Qiskit", "Business Analytics and Data Mining Modeling using R"], course41: "" },
  { roll: "23BQ1A0531", name: "Bitra Lokesh", courses: ["Programming in java", "Programming in modern c++"], course41: "" },
  { roll: "23BQ1A0532", name: "Bitra Sri Lakshmi Nivas", courses: ["Programming in Java", "Programming in Modern C++", "Introduction to Large Language Models (LLMs)"], course41: "Software Testing" },
  { roll: "23BQ1A0533", name: "Manogna B", courses: ["Software Testing", "The joy of computing with python"], course41: "" },
  { roll: "23BQ1A0534", name: "Boligarla Nagendrababu", courses: ["Programming in Java", "Programming in modern c++"], course41: "" },
  { roll: "23BQ1A0535", name: "Bolla Jahnavi", courses: ["PROGRAMMING IN JAVA", "CLOUD COMPUTING"], course41: "" },
  { roll: "23BQA10536", name: "B.SaiBalaji", courses: ["Programming In Java"], course41: "" },
  { roll: "23BQ1A0537", name: "BURGULA AJAY KUMAR", courses: ["Programming in Modern C++"], course41: "" },
  { roll: "23BQ1A0538", name: "Ch. Nandu", courses: ["INTRODUCTION TO LARGE LANGUAGE MODELS"], course41: "Social networking" },
  { roll: "23BQ1A0539", name: "Uma Chandra", courses: ["Cyber Security and Privacy", "Introduction to Large Language Models (LLMs)"], course41: "Software Testing" },
  { roll: "23BQ1A0540", name: "Challa Harshitha Reddy", courses: ["The joy of computing using python", "Software testing"], course41: "Cyber security and privacy" },
  { roll: "23BQ1A0541", name: "CHANDRAGIRI SANATH KUMAR", courses: ["The Joy of Computing using Python", "Software Testing", "Social Networks"], course41: "" },
  { roll: "23BQ1A0542", name: "Chandrapati Lakshmi keerthana", courses: ["Cybersecurity and privacy", "Programming in java"], course41: "" },
  { roll: "23BQ1A0543", name: "Chattu Bhavani", courses: ["Software Testing"], course41: "Cyber Security And Privacy" },
  { roll: "23BQ1A0544", name: "Chattu Kumara Vishnu", courses: ["Programming in Java", "Programming in Modern C++", "Introduction to Large Language Models(LLMs)"], course41: "" },
  { roll: "23BQ1A0545", name: "Chebathini Rahul Chandu", courses: ["Programming In Java"], course41: "Software Testing" },
  { roll: "23BQ1A0546", name: "CHENDIKA NOUNITH KASI VISWANADH", courses: ["Introduction to large language models(LLMS)"], course41: "Software testing" },
  { roll: "23BQ1A0547", name: "Chennamallu Vara Lakshmi Prasanna", courses: ["Programming in java", "Cyber security and privacy"], course41: "Software Testing" },
  { roll: "23BQ1A0548", name: "Chimata Mohith", courses: ["programming in java", "Data Analytics with python"], course41: "Social Networks" },
  { roll: "23BQ1A0549", name: "CHITTIBOMMA UMA MAHESWARA RAO", courses: ["THE JOY OF COMPUTING USING PYTHON", "SOFTWARE TESTING"], course41: "" },
  { roll: "23BQ1A0550", name: "CHITTIPOTHULA NAVYA TEJA", courses: [], course41: "Cyber security and privacy" },
  { roll: "23BQ1A0551", name: "CHITTURI VENKATESH", courses: ["The Joy of Computing using Python", "Business Intelligence & Analytics"], course41: "" },
  { roll: "23BQ1A0552", name: "Chunchu sai pavithra", courses: [], course41: "" },
  { roll: "23bq1a0553", name: "Dadi Harika", courses: ["programming in java", "Data analytics with python"], course41: "" },
  { roll: "23BQ1A0555", name: "DARSI MEGHANA SRI", courses: ["INTRODUCTION TO LARGE LANGUAGE MODELS"], course41: "" },
  { roll: "23BQ1A0556", name: "Dasari Bhargavi Jyoshna", courses: ["The joy of computing using python", "Software project management"], course41: "Cyber security and privacy" },
  { roll: "23bq1a0557", name: "Davuluri Maruthiprasad", courses: ["Java"], course41: "Social Networks analysis" },
  { roll: "23BQ1A0558", name: "Davuluri Naga Sri Nidhi", courses: ["Social Networks", "Introduction to Quantum Computing: Quantum Algorithms and Qiskit"], course41: "Cyber Security and Privacy" },
  { roll: "23bq1a0559", name: "Devarapalli manisha", courses: ["Introduction to Large language models", "Programming in Modern C++"], course41: "" },
  { roll: "23BQ1A0560", name: "MANVITH KUMAR REDDY DEVARAPALLI", courses: ["Programming In Java", "Programming in Modern C++"], course41: "" },
  { roll: "23BQ1A0561", name: "DHARMAVARAPU MANISH KUMAR REDDY", courses: ["Programming in Java", "The Joy of Computing Python", "Cyber Security & Privacy"], course41: "" },
  { roll: "23BQ1A0562", name: "Dronadula Krishna Lokesh", courses: ["Business Intelligence & Analytics", "Programming In Java"], course41: "" },
  { roll: "23BQ1A0563", name: "TARUN DUGGEMPUDI", courses: ["The Joy of Computing using Python", "Programming in java"], course41: "Social network analysis" },
  { roll: "24BQ5A0501", name: "Adari Sai Koti", courses: ["Cyber Security and Privacy", "Programming in java"], course41: "" },
  { roll: "24BQ5A0502", name: "Angirekula Lakshmi Siva Naga Manikanta", courses: ["Programming In Java", "Programming In Modern c++"], course41: "" },
  { roll: "24BQ5A0503", name: "Bandaru Sri Ramya", courses: ["Programming in Java", "Programming in Modern C++", "Introduction to Quantum Computing: Quantum Algorithms and Qiskit"], course41: "" },
  { roll: "24BQ5A0504", name: "CHENNU DIVYAKRISHNA", courses: ["Programming in Java"], course41: "Introduction to LLMs" },
  { roll: "24BQ5A0505", name: "Gamini Maheswari Sri", courses: ["Programming in Java", "Large Language Models"], course41: "Social Networks" },
  { roll: "24BQ5A0506", name: "Jonnalagadda Sai Prasad", courses: ["Programming In Java", "Cyber Security and Privacy"], course41: "" },
  { roll: "24BQ5A0507", name: "KALINTA SHALINI", courses: ["The Joy of Computing using Python", "Social Networks"], course41: "Iot" },
  { roll: "24bq5a0508", name: "Kodali Sanjay", courses: [], course41: "Cybersecurity and privacy" },
];

const TOTAL_STUDENTS = STUDENTS.length;

/* -------------------------------------------------------
   Excluded / Faded Courses
   ------------------------------------------------------- */
const EXCLUDED_PATTERNS = [
  "programming in java",
  "joy of computing",
  "the joy of computing",
];

function isExcludedCourse(name) {
  if (!name || !name.trim()) return false;
  const lower = name.toLowerCase().trim();
  return EXCLUDED_PATTERNS.some((p) => lower.includes(p));
}

/* -------------------------------------------------------
   Supabase helpers
   ------------------------------------------------------- */
const supabase = {
  headers() {
    return {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };
  },

  async insert(table, data) {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase ${res.status}: ${err}`);
    }
    return true;
  },

  /** Fetch only the aggregate count for the public tracker */
  async fetchSubmissionCount() {
    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/rpc/get_submission_count`,
      {
        method: "POST",
        headers: this.headers(),
        body: "{}",
      }
    );
    if (!res.ok) throw new Error(`Supabase fetch ${res.status}`);
    return res.json();
  },

  async hasSubmitted(rollNumber) {
    const url = new URL(`/rest/v1/${CONFIG.SUPABASE_TABLE}`, CONFIG.SUPABASE_URL);
    url.searchParams.set("select", "roll_number");
    url.searchParams.set("roll_number", `ilike.${rollNumber}`);
    url.searchParams.set("limit", "1");
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(`Supabase submission check ${res.status}`);
    const matches = await res.json();
    return matches.length > 0;
  },
};

/* -------------------------------------------------------
   Google Sheets
   ------------------------------------------------------- */
async function submitToGoogleSheets(payload) {
  await fetch(CONFIG.GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
  });
  return true;
}

/* -------------------------------------------------------
   DOM References — Form
   ------------------------------------------------------- */
const rollInput       = document.getElementById("rollInput");
const rollError       = document.getElementById("rollError");
const rollStatus      = document.getElementById("rollStatus");
const studentNameGroup = document.getElementById("studentNameGroup");
const studentName     = document.getElementById("studentName");
const course41Banner  = document.getElementById("course41Banner");
const course41Name    = document.getElementById("course41Name");
const coursesSection  = document.getElementById("coursesSection");
const coursesGrid     = document.getElementById("coursesGrid");
const noCoursesMsg    = document.getElementById("noCoursesMsg");
const courseNameGroup = document.getElementById("courseNameGroup");
const courseNameField = document.getElementById("courseName");
const courseExclusionNote = document.getElementById("courseExclusionNote");
const submitBtn       = document.getElementById("submitBtn");
const statusMsg       = document.getElementById("statusMsg");
const form            = document.getElementById("confirmationForm");
const successDialog   = document.getElementById("successDialog");
const successMessage  = document.getElementById("successMessage");
const successCloseButton = document.getElementById("successCloseButton");

/* -------------------------------------------------------
   DOM References — Tracker
   ------------------------------------------------------- */
const headerSubmittedCount = document.getElementById("headerSubmittedCount");

/* -------------------------------------------------------
   Roll input debounce
   ------------------------------------------------------- */
let debounceTimer = null;
let activeSubmissionId = 0;
let submissionCheckState = "unchecked";

function handleRollInput() {
  activeSubmissionId++;
  clearTimeout(debounceTimer);
  rollError.textContent = "";
  rollStatus.textContent = "";
  submissionCheckState = "unchecked";
  updateSubmitState();
  debounceTimer = setTimeout(() => {
    const typed = rollInput.value.trim();
    resetForm();
    if (!typed) return;

    const student = STUDENTS.find(
      (s) => s.roll.toLowerCase() === typed.toLowerCase()
    );

    if (!student) {
      rollError.textContent = "Roll number not found in CSE-A records.";
      return;
    }

    rollError.textContent = "";
    loadStudent(student);
    checkSubmissionStatus(student);
  }, 400);
}

async function checkSubmissionStatus(student) {
  const rollNumber = student.roll.toUpperCase();
  submissionCheckState = "checking";
  rollStatus.textContent = "";
  updateSubmitState();

  try {
    const alreadySubmitted = await supabase.hasSubmitted(rollNumber);
    if (rollInput.value.trim().toUpperCase() !== rollNumber) return;

    submissionCheckState = alreadySubmitted ? "submitted" : "clear";
    rollStatus.textContent = alreadySubmitted ? "Already submitted." : "";
    coursesGrid.querySelectorAll("input[type=checkbox]").forEach((course) => {
      if (course.classList.contains("course-excluded")) return;
      course.disabled = alreadySubmitted || course.disabled;
      course.closest(".course-item").classList.toggle("course-already-submitted", alreadySubmitted);
    });
    updateSubmitState();
  } catch (error) {
    if (rollInput.value.trim().toUpperCase() !== rollNumber) return;
    submissionCheckState = "error";
    rollStatus.textContent = "Could not check submission status. Please try again.";
    console.error("Submission status check failed:", error);
    updateSubmitState();
  }
}

function loadStudent(student) {
  studentName.value = student.name;
  studentNameGroup.hidden = false;
  courseExclusionNote.hidden = false;

  if (student.course41 && student.course41.trim()) {
    course41Name.textContent = student.course41;
    course41Banner.style.display = "flex";
  }

  coursesSection.style.display = "block";
  courseNameGroup.style.display = "block";

  const valid = student.courses.filter((c) => c && c.trim());
  if (valid.length === 0) {
    noCoursesMsg.style.display = "block";
    coursesGrid.style.display = "none";
  } else {
    noCoursesMsg.style.display = "none";
    coursesGrid.style.display = "flex";
    renderCourses(valid);
  }
  updateSubmitState();
}

/* -------------------------------------------------------
   Render course checkboxes
   ------------------------------------------------------- */
function renderCourses(courses) {
  coursesGrid.innerHTML = "";
  courses.forEach((course, idx) => {
    const faded = isExcludedCourse(course);
    const label = document.createElement("label");
    label.className = "course-item" + (faded ? " course-faded" : "");
    label.htmlFor = `course_${idx}`;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = `course_${idx}`;
    cb.value = course;
    cb.disabled = faded;
    cb.classList.toggle("course-excluded", faded);
    cb.setAttribute("aria-label", course);

    if (!faded) {
      cb.addEventListener("change", () => {
        label.classList.toggle("course-selected", cb.checked);
        updateCourseAvailability();
        updateConfirmedField();
        updateSubmitState();
      });
    }

    const span = document.createElement("span");
    span.className = "course-label";
    span.textContent = course;

    label.appendChild(cb);
    label.appendChild(span);

    if (faded) {
      const tag = document.createElement("span");
      tag.className = "faded-tag";
      tag.textContent = "Not Applicable";
      label.appendChild(tag);
    }

    coursesGrid.appendChild(label);
  });
}

function updateCourseAvailability() {
  const eligibleCourses = [...coursesGrid.querySelectorAll("input[type=checkbox]:not(.course-excluded)")];
  const selectedCourse = eligibleCourses.find((course) => course.checked);

  eligibleCourses.forEach((course) => {
    const label = course.closest(".course-item");
    const unavailable = Boolean(selectedCourse && selectedCourse !== course);
    course.disabled = unavailable;
    label.classList.toggle("course-choice-faded", unavailable);
  });
}

function updateConfirmedField() {
  const sel = [...coursesGrid.querySelectorAll("input:checked")]
    .map((cb) => cb.value).filter(Boolean);
  courseNameField.value = sel.join(", ");
}

function updateSubmitState() {
  const typedRoll  = rollInput.value.trim().toLowerCase();
  const hasStudent = STUDENTS.some((student) => student.roll.toLowerCase() === typedRoll);
  const hasChecked = coursesGrid.querySelectorAll("input:checked").length > 0;
  const allDisabled = [...coursesGrid.querySelectorAll("input[type=checkbox]")].every((cb) => cb.disabled);
  const noCBs = coursesGrid.querySelectorAll("input[type=checkbox]").length === 0;
  submitBtn.disabled = !(
    hasStudent &&
    submissionCheckState === "clear" &&
    (hasChecked || allDisabled || noCBs)
  );
}

function resetForm() {
  submissionCheckState = "unchecked";
  rollStatus.textContent = "";
  studentName.value = "";
  studentNameGroup.hidden = true;
  courseExclusionNote.hidden = true;
  course41Banner.style.display = "none";
  course41Name.textContent = "";
  coursesSection.style.display = "none";
  coursesGrid.innerHTML = "";
  coursesGrid.style.display = "flex";
  noCoursesMsg.style.display = "none";
  courseNameGroup.style.display = "none";
  courseNameField.value = "";
  submitBtn.disabled = true;
  hideStatus();
}

/* -------------------------------------------------------
   Form submission
   ------------------------------------------------------- */
async function handleSubmit(e) {
  e.preventDefault();
  hideStatus();

  const typed = rollInput.value.trim();
  const student = STUDENTS.find((s) => s.roll.toLowerCase() === typed.toLowerCase());

  if (!student) {
    showStatus("Roll number not found in CSE-A records.", "error");
    return;
  }

  if (submissionCheckState !== "clear") {
    showStatus(
      submissionCheckState === "submitted"
        ? "This roll number has already submitted."
        : "Please wait while we check this roll number's submission status.",
      "error"
    );
    return;
  }

  const selectedCourses = [...coursesGrid.querySelectorAll("input:checked")]
    .map((cb) => cb.value.trim()).filter(Boolean);

  const payload = {
    roll_number: student.roll.toUpperCase(),
    student_name: student.name,
    section: "CSE-A",
    confirmed_courses: selectedCourses.join(", "),
    course_41: student.course41 || "",
    submitted_at: new Date().toISOString(),
  };

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.querySelector(".btn-text").textContent = "Submitting";

  const submissionId = ++activeSubmissionId;
  let supabaseSaved = false;
  let sheetsError = null;
  void submitToGoogleSheets(payload).catch((err) => {
    sheetsError = err;
    console.error("Google Sheets submission failed:", err);
    if (supabaseSaved && submissionId === activeSubmissionId) {
      showStatus("Saved to the portal, but the Google Sheets copy failed.", "error");
    }
  });

  let supabaseError = null;
  try {
    await supabase.insert(CONFIG.SUPABASE_TABLE, payload);
  } catch (err) {
    supabaseError = err;
    console.error("Supabase submission failed:", err);
  }

  submitBtn.classList.remove("loading");
  submitBtn.querySelector(".btn-text").textContent = "Submit Confirmation";

  if (!supabaseError) {
    supabaseSaved = true;
    successMessage.textContent =
      sheetsError
        ? "Saved to the portal, but the Google Sheets copy failed."
        : `Submitted successfully for ${student.roll.toUpperCase()}.`;
    successDialog.showModal();
    refreshTracker();
  } else {
    showStatus(`Submission failed. Supabase: ${supabaseError.message}`, "error");
    submitBtn.disabled = false;
  }
}

successCloseButton.addEventListener("click", () => successDialog.close());
successDialog.addEventListener("close", () => window.location.reload());

/* -------------------------------------------------------
   Status helpers
   ------------------------------------------------------- */
function showStatus(msg, type) {
  statusMsg.textContent = msg;
  statusMsg.className = `status-msg visible ${type}`;
}
function hideStatus() {
  statusMsg.className = "status-msg";
  statusMsg.textContent = "";
}

/** Refresh tracker from Supabase */
async function refreshTracker() {
  try {
    const count = await supabase.fetchSubmissionCount();
    if (headerSubmittedCount) headerSubmittedCount.textContent = count;
  } catch (err) {
    console.error("Tracker refresh failed:", err);
  }
}

/* -------------------------------------------------------
   Init
   ------------------------------------------------------- */
function init() {
  rollInput.addEventListener("input", handleRollInput);
  form.addEventListener("submit", handleSubmit);

  refreshTracker();                                    // immediate first load
  setInterval(refreshTracker, CONFIG.POLL_INTERVAL_MS); // live polling
}

document.addEventListener("DOMContentLoaded", init);
