const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html';
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

let roleCount = 0;

function addRoleRow(defaultName = '') {
  roleCount++;
  const container = document.getElementById('roles-container');
  const rowId = `role-row-${roleCount}`;

  const row = document.createElement('div');
  row.className = 'role-input-row';
  row.id = rowId;
  row.innerHTML = `
    <div>
      <label>Role name</label>
      <input type="text" class="role-name" placeholder="e.g. Backend Developer" value="${defaultName}">
    </div>
    <div>
      <label>Required skills</label>
      <input type="text" class="role-skills" placeholder="Java, Spring Boot, MySQL">
    </div>
    <button type="button" class="remove-role-btn" onclick="document.getElementById('${rowId}').remove()">Remove</button>
  `;
  container.appendChild(row);
}

// Start with two roles pre-added, since a "team" implies more than one
addRoleRow('Backend Developer');
addRoleRow('Frontend Developer');

document.getElementById('add-role-btn').addEventListener('click', () => addRoleRow());

document.getElementById('create-project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('project-error');
  errorEl.textContent = '';

  const title = document.getElementById('p-title').value;
  const description = document.getElementById('p-description').value;

  const roleRows = document.querySelectorAll('.role-input-row');
  const roles = Array.from(roleRows).map(row => {
    const roleName = row.querySelector('.role-name').value.trim();
    const skills = row.querySelector('.role-skills').value
      .split(',').map(s => s.trim()).filter(Boolean);
    return { roleName, skills };
  }).filter(r => r.roleName && r.skills.length > 0);

  if (roles.length === 0) {
    errorEl.textContent = 'Add at least one role with skills.';
    return;
  }

  try {
    const data = await apiRequest('/team/project', 'POST', { title, description, roles }, token);
    await loadRecommendations(data.project.id, title);
  } catch (error) {
    errorEl.textContent = error.message;
  }
});

async function loadRecommendations(projectId, title) {
  const resultsCard = document.getElementById('results-card');
  const rolesResults = document.getElementById('roles-results');
  resultsCard.style.display = 'block';
  document.getElementById('results-title').textContent = `Team Recommendation — ${title}`;
  rolesResults.innerHTML = `<div class="empty-state">Calculating...</div>`;

  try {
    const data = await apiRequest(`/team/project/${projectId}/recommend`, 'GET', null, token);

    document.getElementById('coverage-number').textContent = `${data.teamCoverage}%`;

    rolesResults.innerHTML = data.roles.map(r => {
      const rec = r.recommended;
      const skillsList = r.requiredSkills.join(', ');

      if (!rec || rec.matchedCount === 0) {
        return `
          <div class="role-result-card">
            <div class="role-result-header">
              <span class="role-result-name">${r.roleName}</span>
            </div>
            <p class="no-candidate">No student currently covers any skill for this role (needs: ${skillsList}).</p>
          </div>
        `;
      }

      const circumference = 2 * Math.PI * 23;
      const offset = circumference - (rec.matchPercent / 100) * circumference;

      return `
        <div class="role-result-card">
          <div class="role-result-header">
            <span class="role-result-name">${r.roleName}</span>
            <span class="internship-meta">needs: ${skillsList}</span>
          </div>
          <div class="role-recommended">
            <div class="match-ring">
              <svg viewBox="0 0 56 56">
                <circle class="match-ring-bg" cx="28" cy="28" r="23"></circle>
                <circle class="match-ring-fg" cx="28" cy="28" r="23"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${offset}"></circle>
              </svg>
              <div class="match-ring-label">${rec.matchPercent}%</div>
            </div>
            <div>
              <div class="candidate-name">${rec.studentName}</div>
              <div class="internship-meta">${rec.matchedCount}/${rec.totalRequired} skills matched</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    rolesResults.innerHTML = `<div class="empty-state">Couldn't load recommendations: ${error.message}</div>`;
  }
}