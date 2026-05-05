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
            alert(result.message);
        }
    } catch (error) {
        alert("Error updating password.");
    }
}

async function handleAddUser(event) {
    event.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('default-password').value;
    const isAdmin = document.getElementById('is-admin').value;

    if (!name || !email || !password) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const response = await fetch('../api/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, is_admin: isAdmin })
        });
        if (response.ok) {
            addUserForm.reset();
            await loadUsersAndInitialize();
        } else {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        alert("Error adding user.");
    }
}

async function handleTableClick(event) {
    const id = event.target.getAttribute('data-id');
    if (event.target.classList.contains('delete-btn')) {
        if (!confirm("Are you sure?")) return;
        try {
            const response = await fetch(`../api/index.php?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                users = users.filter(u => u.id != id);
                renderTable(users);
            }
        } catch (error) {
            alert("Error deleting user.");
        }
    }
}

function handleSearch() {
    const term = searchInput.value.toLowerCase();
    const filtered = users.filter(u => 
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    renderTable(filtered);
}

function handleSort(event) {
    const index = event.currentTarget.cellIndex;
    const props = ['name', 'email', 'is_admin'];
    const prop = props[index];
    const dir = event.currentTarget.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
    event.currentTarget.setAttribute('data-sort-dir', dir);

    users.sort((a, b) => {
        let res = a[prop] > b[prop] ? 1 : -1;
        return dir === 'asc' ? res : -res;
    });
    renderTable(users);
}

async function loadUsersAndInitialize() {
    try {
        const response = await fetch('../api/index.php');
        const result = await response.json();
        users = result.data || [];
        renderTable(users);

        if (!this.initialized) {
            passwordForm.addEventListener('submit', handleChangePassword);
            addUserForm.addEventListener('submit', handleAddUser);
            userTableBody.addEventListener('click', handleTableClick);
            searchInput.addEventListener('input', handleSearch);
            tableHeaders.forEach(th => th.addEventListener('click', handleSort));
            this.initialized = true;
        }
    } catch (error) {
        console.error("Initialization failed.");
    }
}

loadUsersAndInitialize();
