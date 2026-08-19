const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "student") {
  window.location.href = "login.html";
}

document.getElementById("user-email").textContent =
  localStorage.getItem("email") || "Student";

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

async function loadInternships() {
  const listEl = document.getElementById("internships-list");
  try {
    const data = await apiRequest("/employer/internships", "GET");
    const internships = data.internships || [];

    if (internships.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No internships posted yet.</div>`;
      return;
    }

    listEl.innerHTML = internships
      .map(
        (i) => `
      <div class="browse-internship-card">
        <div class="browse-internship-info">
          <div class="browse-internship-title">${i.title}</div>
          <div class="browse-internship-desc">${i.description || "No description provided."}</div>
          <div class="tag-row">
            ${(i.Skills || []).map((s) => `<span class="tag" style="background:rgba(11,29,51,0.06); color:var(--text-soft);">${s.name}${s.InternshipSkill.isRequired ? "" : " (optional)"}</span>`).join("")}
          </div>
        </div>
        <div class="match-ring" id="ring-${i.id}">
          <svg viewBox="0 0 56 56"><circle class="match-ring-bg" cx="28" cy="28" r="23"></circle></svg>
          <div class="match-ring-label">···</div>
        </div>
      </div>
    `,
      )
      .join("");

    internships.forEach((i) => loadMatchScore(i.id));
  } catch (error) {
    listEl.innerHTML = `<div class="empty-state">Couldn't load internships: ${error.message}</div>`;
  }
}

async function loadMatchScore(internshipId) {
  const ringEl = document.getElementById(`ring-${internshipId}`);
  try {
    const match = await apiRequest(
      `/match/${internshipId}`,
      "GET",
      null,
      token,
    );
    const pct = match.matchPercent;
    const circumference = 2 * Math.PI * 23;
    const offset = circumference - (pct / 100) * circumference;

    ringEl.innerHTML = `
      <svg viewBox="0 0 56 56">
        <circle class="match-ring-bg" cx="28" cy="28" r="23"></circle>
        <circle class="match-ring-fg" cx="28" cy="28" r="23"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
      </svg>
      <div class="match-ring-label">${pct}%</div>
    `;
  } catch (error) {
    ringEl.innerHTML = `<div class="match-ring-label" style="font-size:9px;">N/A</div>`;
  }
}

loadInternships();
