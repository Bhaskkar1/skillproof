const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'issuer') {
  window.location.href = 'index.html';
}
document.getElementById('user-email').textContent = localStorage.getItem('email') || 'Issuer';
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

async function loadQueue() {
  const listEl = document.getElementById('queue-list');
  try {
    const data = await apiRequest('/issuer/pending', 'GET', null, token);
    const pending = data.pending || [];

    document.getElementById('queue-count').textContent = `${pending.length} pending`;

    if (pending.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No pending verifications right now.</div>`;
      return;
    }

    listEl.innerHTML = pending.map(item => `
      <div class="queue-item">
        <div class="queue-info">
          <div class="queue-student">${item.Student.name}</div>
          <div class="queue-skill">${item.Skill.name} <span class="cat">— ${item.Skill.category || 'General'}</span></div>
          <div class="queue-evidence">
            Evidence: ${item.evidenceType || 'not specified'}
            ${item.evidenceLink ? `— <a href="${item.evidenceLink}" target="_blank">view link</a>` : ''}
          </div>
        </div>
        <div class="queue-actions">
          <button class="btn-verify" data-id="${item.id}" data-action="verified">Verify</button>
          <button class="btn-revoke" data-id="${item.id}" data-action="revoked">Revoke</button>
        </div>
      </div>
    `).join('');

    // attach click handlers
    document.querySelectorAll('.btn-verify, .btn-revoke').forEach(btn => {
      btn.addEventListener('click', () => updateStatus(btn.dataset.id, btn.dataset.action));
    });

  } catch (error) {
    listEl.innerHTML = `<div class="empty-state">Couldn't load queue: ${error.message}</div>`;
  }
}

async function updateStatus(studentSkillId, status) {
  try {
    await apiRequest(`/issuer/verify/${studentSkillId}`, 'PATCH', { status }, token);
    loadQueue(); // refresh the list after action
  } catch (error) {
    alert(error.message);
  }
}

loadQueue();