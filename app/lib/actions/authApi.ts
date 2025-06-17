const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function loginUser(data: any) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw await res.json();
    }
    return res.json();
}
