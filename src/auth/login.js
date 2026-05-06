const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");

function displayMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = type;
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

    if (!isValidEmail(email)) {
        displayMessage("Invalid email format.", "error");
        return;
    }

    if (!isValidPassword(password)) {
        displayMessage("Password must be at least 8 characters.", "error");
        return;
    }

    try {
        const res = await fetch("src/auth/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `email=${email}&password=${password}`
        });

        const data = await res.json();

        displayMessage(data.message, data.success ? "success" : "error");

        if (data.success) {
            if (data.is_admin == 1) {
                window.location.href = "src/admin/manage_users.html";
            } else {
                window.location.href = "index.html";
            }
        }

    } catch (error) {
        displayMessage("Server error. Please try again.", "error");
    }

    emailInput.value = "";
    passwordInput.value = "";
}

function setupLoginForm() {
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
}

setupLoginForm();
