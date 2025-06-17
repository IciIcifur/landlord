const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAllUsers(data: any, role: string = 'ADMIN') {
    const res = await fetch(`${API_URL}/api/users`, {
        method: 'GET',
        headers: {
            'x-user-role': role,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw await res.json();
    }
    return res.json();
}

export async function createOrUpdateUser(data: any, role: string = 'ADMIN') {
    const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
            'x-user-role': role,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw await res.json();
    }
    return res.json();
}

export async function deleteUser(userId: string, role: string = 'ADMIN') {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'x-user-role': role,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
        throw await res.json();
    }
    return res.json();
}