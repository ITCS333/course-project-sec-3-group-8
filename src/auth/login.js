// --- Element Selections ---
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");

// --- Functions ---

function displayMessage(message, type) {
  messageContainer.textContent = message;
  messageContainer.className = type; // success or error
}

function isValidEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}

function handleLogin(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate email
  if (!isValidEmail(email)) {
    displayMessage("Invalid email format.", "error");
    return;
  }

  // Validate password
  if (!isValidPassword(password)) {
    displayMessage("Password must be at least 8 characters.", "error");
    return;
  }

  // Success
  displayMessage("Login successful!", "success");

  // Optional: clear inputs
  emailInput.value = "";
  passwordInput.value = "";
}

function setupLoginForm() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

// --- Initial Page Load ---
setupLoginForm();
