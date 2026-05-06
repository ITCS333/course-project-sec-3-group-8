// --- Global Data Store ---
let users = [];

// --- Element Selections ---
const userTableBody = document.getElementById("user-table-body");
const addUserForm = document.getElementById("add-user-form");
const changePasswordForm = document.getElementById("password-form");
const searchInput = document.getElementById("search-input");
const tableHeaders = document.querySelectorAll("#user-table thead th");

// --- Functions ---

function createUserRow(user) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.is_admin == 1 ? "Yes" : "No"}</td>
        <td>
            <button class="edit-btn" data-id="${user.id}">Edit</button>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
        </td>
    `;

    return tr;
}

function renderTable(userArray) {
    userTableBody.innerHTML = "";

    userArray.forEach(user => {
        userTableBody.appendChild(createUserRow(user));
    });
}

function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    const id = 1;

    fetch("../api/index.php?action=change_password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            current_password: currentPassword,
            new_password: newPassword
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Password updated successfully!");

            document.getElementById("current-password").value = "";
            document.getElementById("new-password").value = "";
            document.getElementById("confirm-password").value = "";
        } else {
            alert(data.message);
        }
    })
    .catch(err => alert(err));
}

function handleAddUser(event) {
    event.preventDefault();

    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("default-password").value;
    const is_admin = Number(document.getElementById("is-admin").value);

    if (!name || !email || !password) {
        alert("Please fill out all required fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    fetch("../api/index.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            is_admin
        })
    })
    .then(res => {
        if (res.status === 201) {
            return res.json();
        } else {
            return res.json().then(data => { throw data; });
        }
    })
    .then(() => {
        loadUsersAndInitialize();

        document.getElementById("user-name").value = "";
        document.getElementById("user-email").value = "";
        document.getElementById("default-password").value = "";
        document.getElementById("is-admin").value = "0";
    })
    .catch(err => {
        alert(err.message || "Error adding user");
    });
}

function handleTableClick(event) {
    const target = event.target;

    if (target.classList.contains("delete-btn")) {
        const id = target.getAttribute("data-id");

        fetch(`../api/index.php?id=${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw data; });
            }
            return res.json();
        })
        .then(() => {
            users = users.filter(user => user.id != id);
            renderTable(users);
        })
        .catch(err => {
            alert(err.message || "Error deleting user");
        });
    }

    if (target.classList.contains("edit-btn")) {
        const id = target.getAttribute("data-id");
        const user = users.find(u => u.id == id);

        const newName = prompt("Enter new name:", user.name);
        if (!newName) return;

        fetch("../api/index.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                name: newName
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw data; });
            }
            return res.json();
        })
        .then(() => {
            loadUsersAndInitialize();
        })
        .catch(err => {
            alert(err.message || "Error updating user");
        });
    }
}

function handleSearch(event) {
    const term = event.target.value.toLowerCase();

    if (term === "") {
        renderTable(users);
        return;
    }

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );

    renderTable(filtered);
}

function handleSort(event) {
    const th = event.currentTarget;
    const index = th.cellIndex;

    const keyMap = ["name", "email", "is_admin"];
    const key = keyMap[index];

    let dir = th.getAttribute("data-sort-dir") === "asc" ? "desc" : "asc";
    th.setAttribute("data-sort-dir", dir);

    users.sort((a, b) => {
        if (key === "is_admin") {
            return dir === "asc"
                ? Number(a[key]) - Number(b[key])
                : Number(b[key]) - Number(a[key]);
        }

        return dir === "asc"
            ? String(a[key]).localeCompare(String(b[key]))
            : String(b[key]).localeCompare(String(a[key]));
    });

    renderTable(users);
}

async function loadUsersAndInitialize() {
    try {
        const response = await fetch("../api/index.php");

        if (!response.ok) {
            alert("Error fetching users");
            return;
        }

        const result = await response.json();
        users = result.data;

        renderTable(users);

        // attach events (مرة وحدة فقط)
        changePasswordForm.addEventListener("submit", handleChangePassword, { once: true });
        addUserForm.addEventListener("submit", handleAddUser, { once: true });
        userTableBody.addEventListener("click", handleTableClick);
        searchInput.addEventListener("input", handleSearch);

        tableHeaders.forEach(th => {
            th.addEventListener("click", handleSort);
        });

    } catch (err) {
        alert(err);
    }
}

// --- Initial Page Load ---
loadUsersAndInitialize();
