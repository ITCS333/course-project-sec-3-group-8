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

async function handleLogin(event) {
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

  try {
    const response = await fetch("login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.status === "success") {
      displayMessage("Login successful!", "success");

      setTimeout(() => {
  window.location.href = "/index.html";
}, 1000);

    } else {
      displayMessage(data.message, "error");
    }

  } catch (error) {
    displayMessage("Server error", "error");
  }
}

function setupLoginForm() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

// --- Initial Page Load ---
setupLoginForm();
