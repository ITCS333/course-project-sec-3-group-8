document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
});

async function fetchUsers() {
    try {
        const response = await fetch('manage_users.php?action=list');
        const users = await response.json();
        const tableBody = document.querySelector('#user-table tbody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.is_admin ? 'Admin' : 'Student'}</td>
                    <td>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function deleteUser(id) {
    if (confirm('Are you sure?')) {
        const response = await fetch('manage_users.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const result = await response.json();
        if (result.success) fetchUsers();
    }
}
