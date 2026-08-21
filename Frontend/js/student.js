const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Guard: only logged-in students allowed here
if (!token || role !== "student") {
  window.location.href = "index.html";
}

document.getElementById("user-email").textContent =
  localStorage.getItem("email") || "Student";

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

let currentStudentId = null;

async function loadPassport() {
  try {
    const data = await apiRequest("/student/passport", "GET", null, token);
    renderPassport(data.student);
  } catch (error) {
    // No profile yet — show the create-profile form instead
    document.getElementById("create-profile-card").style.display = "block";
    document.getElementById("passport-content").style.display = "none";
  }
}

function renderPassport(student) {
  currentStudentId = student.id;

  document.getElementById("create-profile-card").style.display = "none";
  document.getElementById("passport-content").style.display = "block";

  document.getElementById("profile-name").textContent = student.name;

  document.getElementById("profile-bio").textContent =
    student.bio || "No bio yet.";

  const grid = document.getElementById("skills-grid");
  const skills = student.Skills || [];

  if (skills.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        No skills added yet — add your first one above.
      </div>
    `;
    return;
  }

  grid.innerHTML = skills
    .map((skill) => {
      const status = skill.StudentSkill.status;

      return `
        <div class="skill-card">
          <div class="skill-name">${skill.name}</div>

          <div class="skill-category">
            ${skill.category || "General"}
          </div>

          <span class="status-badge status-${status} ${
            status === "verified" ? "stamp-in" : ""
          }">${status}</span>
        </div>
      `;
    })
    .join("");
}

// Create profile
document
  .getElementById("create-profile-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("cp-name").value;
    const bio = document.getElementById("cp-bio").value;

    try {
      await apiRequest(
        "/student/profile",
        "POST",
        { name, bio },
        token
      );

      loadPassport();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

// Add skill
document
  .getElementById("add-skill-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorEl = document.getElementById("skill-error");
    errorEl.textContent = "";

    const skillName =
      document.getElementById("skill-name").value;

    const category =
      document.getElementById("skill-category").value;

    const evidenceType =
      document.getElementById("skill-evidence-type").value;

    const evidenceLink =
      document.getElementById("skill-evidence-link").value;

    try {
      await apiRequest(
        "/student/skill",
        "POST",
        {
          skillName,
          category,
          evidenceType,
          evidenceLink
        },
        token
      );

      document.getElementById("add-skill-form").reset();

      loadPassport();
    } catch (error) {
      errorEl.textContent = error.message;
    }
  });

// QR code
document
  .getElementById("get-qr-btn")
  .addEventListener("click", async () => {
    if (!currentStudentId) return;

    try {
      const data = await apiRequest(
        `/public/qr/${currentStudentId}`,
        "GET"
      );

      const img = document.getElementById("qr-image");

      img.src = data.qrImage;
      img.style.display = "block";
    } catch (error) {
      showToast(error.message, "error");
    }
  });

loadPassport();