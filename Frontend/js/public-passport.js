const params = new URLSearchParams(window.location.search);
const studentId = params.get('id');

async function loadPublicPassport() {
  const contentEl = document.getElementById('content');

  if (!studentId) {
    contentEl.innerHTML = `<p class="public-empty">No passport ID provided.</p>`;
    return;
  }

  try {
    const data = await apiRequest(`/public/passport/${studentId}`, 'GET');
    render(data);
  } catch (error) {
    contentEl.innerHTML = `<p class="public-empty">Passport not found.</p>`;
  }
}

function render(data) {
  const contentEl = document.getElementById('content');
  const skills = data.verifiedSkills || [];

  contentEl.innerHTML = `
    <div class="public-passport-card">
      <div class="public-passport-header">
        <span class="public-brand">SP · SkillProof</span>
        <span class="public-passport-id">PASSPORT NO. ${String(studentId).padStart(4, '0')}</span>
      </div>

      <div class="public-name">${data.name}</div>
      <div class="public-bio">${data.bio || 'No bio provided.'}</div>

      <div class="public-section-label">Verified Skills</div>

      ${skills.length === 0
        ? `<p class="public-empty" style="text-align:left; padding:0;">No verified skills yet.</p>`
        : skills.map(s => `
            <div class="public-skill-row">
              <div>
                <div class="public-skill-name">${s.name}</div>
                <div class="public-skill-category">${s.category || 'General'}</div>
              </div>
              <span class="public-verified-badge">Verified</span>
            </div>
          `).join('')
      }

      <div class="public-footer">Verified via SkillProof · Evidence-backed skill passport</div>
    </div>
  `;
}

loadPublicPassport();