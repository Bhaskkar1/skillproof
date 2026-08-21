let isRegisterMode = false;

const form = document.getElementById('auth-form');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const nameField = document.getElementById('name-field');
const roleField = document.getElementById('role-field');
const errorMsg = document.getElementById('error-msg');

toggleLink.addEventListener('click', () => {
  isRegisterMode = !isRegisterMode;

  formTitle.textContent = isRegisterMode
    ? 'Create your account'
    : 'Login to SkillProof';

  submitBtn.textContent = isRegisterMode
    ? 'Register'
    : 'Login';

  toggleText.textContent = isRegisterMode
    ? 'Already have an account?'
    : "Don't have an account?";

  toggleLink.textContent = isRegisterMode
    ? 'Login'
    : 'Register';

  nameField.style.display = isRegisterMode
    ? 'block'
    : 'none';

  roleField.style.display = isRegisterMode
    ? 'block'
    : 'none';

  document.getElementById('form-eyebrow').textContent =
    isRegisterMode
      ? 'FIELD 01 — REGISTRATION'
      : 'FIELD 01 — ACCESS';

  document.getElementById('form-subtitle').textContent =
    isRegisterMode
      ? 'Create your verified skill passport.'
      : 'Log in to your skill passport.';

  errorMsg.textContent = '';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    if (isRegisterMode) {

      // Registration
      const role = document.getElementById('role').value;

      await apiRequest(
        '/auth/register',
        'POST',
        {
          email,
          password,
          role
        }
      );

     showToast('Registered successfully — please log in.');
      // Switch back to login mode
      toggleLink.click();

    } else {

      // Login
      const data = await apiRequest(
        '/auth/login',
        'POST',
        {
          email,
          password
        }
      );

      // Save user information
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('userId', data.user.id);

      // Redirect based on role
      if (data.user.role === 'student') {
        window.location.href = 'student-dashboard.html';

      } else if (data.user.role === 'issuer') {
        window.location.href = 'issuer-dashboard.html';

      } else if (data.user.role === 'employer') {
        window.location.href = 'employer-dashboard.html';

      } else {
        // Unknown role → go back to index.html
        window.location.href = 'index.html';
      }
    }

  } catch (error) {
    errorMsg.textContent = error.message;
  }
});