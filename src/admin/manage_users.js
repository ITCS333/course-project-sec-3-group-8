let users = [];

const userTableBody = document.getElementById('user-table-body');
const addUserForm = document.getElementById('add-user-form');
const passwordForm = document.getElementById('password-form');
const searchInput = document.getElementById('search-input');
const tableHeaders = document.querySelectorAll('#user-table thead th');

function createUserRow(user) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.is_admin == 1 ? 'Yes' : 'No'}</td>
        <td>
            <button class="edit-btn" data-id="${user.id}">Edit</button>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
        </td>
    `;
    return tr;
}

function renderTable(userArray) {
    userTableBody.innerHTML = '';
    userArray.forEach(user => {
        userTableBody.appendChild(createUserRow(user));
    });
}

async function handleChangePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    try {
        const response = await fetch('../api/index.php?action=change_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        });
        const result = await response.json();
        if (result.success) {
            alert("Password updated successfully!");
            passwordForm.reset();
        } else {
            alert(result.message || "Failed to update password.");
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleAddUser(event) {
    event.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('default-password').value;
    const is_admin = document.getElementById('is-admin').value;

    if (!name || !email || !password) {
        alert("Please fill out all required fields.");
        return;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    try {
        const response = await fetch('../api/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, is_admin })
        });
        if (response.status === 201 || response.ok) {
            addUserForm.reset();
            await loadUsersAndInitialize();
        } else {
            const result = await response.json();
            alert(result.message || "Error adding user.");
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleTableClick(event) {
    const id = event.target.getAttribute('data-id');
    if (event.target.classList.contains('delete-btn')) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`../api/index.php?id=${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                users = users.filter(u => u.id != id);
                renderTable(users);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
        renderTable(users);
        return;
    }
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
}

function handleSort(event) {
    const index = event.currentTarget.cellIndex;
    const props = ['name', 'email', 'is_admin'];
    const prop = props[index];
    if (!prop) return;

    let dir = event.currentTarget.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
    event.currentTarget.setAttribute('data-sort-dir', dir);

    users.sort((a, b) => {
        let valA = a[prop];
        let valB = b[prop];
        if (prop === 'is_admin') {
            return dir === 'asc' ? valA - valB : valB - valA;
        } else {
            return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });
    renderTable(users);
}

async function loadUsersAndInitialize() {
    try {
        const response = await fetch('../api/index.php');
        if (!response.ok) throw new Error("Failed to fetch users");
        const result = await response.json();
        users = result.data || [];
        renderTable(users);

        passwordForm.onsubmit = handleChangePassword;
        addUserForm.onsubmit = handleAddUser;
        userTableBody.onclick = handleTableClick;
        searchInput.oninput = handleSearch;
        tableHeaders.forEach(th => th.onclick = handleSort);
    } catch (error) {
        console.error(error);
        alert("Error loading users.");
    }
}

loadUsersAndInitialize();
