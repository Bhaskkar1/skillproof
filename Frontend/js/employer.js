const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'employer') {
  window.location.href = 'index.html';
}
document.getElementById('user-email').textContent = localStorage.getItem('email') || 'Employer';
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

// ---- Load employer's internships ----
async function loadInternships() {
  const listEl = document.getElementById('internships-list');
  try {
    const data = await apiRequest('/employer/my-internships', 'GET', null, token);
    const internships = data.internships || [];

    if (internships.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No internships posted yet.</div>`;
      return;
    }

    listEl.innerHTML = internships.map(i => `
      <div class="internship-item" data-id="${i.id}" data-title="${i.title}">
        <div class="internship-title">${i.title}</div>
        <div class="internship-meta">${(i.Skills || []).length} skills listed</div>
      </div>
    `).join('');

    document.querySelectorAll('.internship-item').forEach(el => {
      el.addEventListener('click', () => showCandidates(el.dataset.id, el.dataset.title));
    });

  } catch (error) {
    listEl.innerHTML = `<div class="empty-state">Couldn't load: ${error.message}</div>`;
  }
}

// ---- Create internship ----
document.getElementById('create-internship-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('internship-error');
  errorEl.textContent = '';

  const title = document.getElementById('i-title').value;
  const description = document.getElementById('i-description').value;
  const requiredSkills = document.getElementById('i-required').value
    .split(',').map(s => s.trim()).filter(Boolean);
  const optionalSkills = document.getElementById('i-optional').value
    .split(',').map(s => s.trim()).filter(Boolean);

  try {
    await apiRequest('/employer/internship', 'POST', { title, description, requiredSkills, optionalSkills }, token);
    document.getElementById('create-internship-form').reset();
    loadInternships();
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

// ---- Show candidates for a selected internship ----
async function showCandidates(internshipId, title) {
  document.getElementById('internships-card').style.display = 'none';
  document.getElementById('candidates-card').style.display = 'block';
  document.getElementById('candidates-title').textContent = `Candidates — ${title}`;

  const listEl = document.getElementById('candidates-list');
  listEl.innerHTML = `<div class="empty-state">Loading...</div>`;

  try {
    const data = await apiRequest(`/employer/candidates/${internshipId}`, 'GET', null, token);
    const candidates = data.candidates || [];

    if (candidates.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No students in the system yet.</div>`;
      return;
    }

    listEl.innerHTML = candidates.map(c => {
      const pct = c.matchPercent;
      const circumference = 2 * Math.PI * 23; // r=23
      const offset = circumference - (pct / 100) * circumference;

      const matchedTags = c.matched.map(s => `<span class="tag tag-matched">✓ ${s.name}</span>`).join('');
      const missingTags = c.missing.map(s => `<span class="tag tag-missing">${s.required ? '✕' : '○'} ${s.name}</span>`).join('');

      return `
        <div class="candidate-row">
          <div class="match-ring">
            <svg viewBox="0 0 56 56">
              <circle class="match-ring-bg" cx="28" cy="28" r="23"></circle>
              <circle class="match-ring-fg" cx="28" cy="28" r="23"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"></circle>
            </svg>
            <div class="match-ring-label">${pct}%</div>
          </div>
          <div class="candidate-info">
            <div class="candidate-name">${c.studentName}</div>
            <div class="tag-row">${matchedTags}${missingTags}</div>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    listEl.innerHTML = `<div class="empty-state">Couldn't load candidates: ${error.message}</div>`;
  }
}

document.getElementById('back-to-list').addEventListener('click', () => {
  document.getElementById('candidates-card').style.display = 'none';
  document.getElementById('internships-card').style.display = 'block';
});

loadInternships();