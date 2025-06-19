const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`
    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    }
    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers as Record<string, string>),
        },
    }
    const response = await fetch(url, config)
    if (!response.ok) {
        throw await response.json()
    }
    return response.json()
}

function withAuth(userId: string, headers: Record<string, string> = {}) {
    return {
        ...headers,
        "x-user-id": userId,
    }
}

// ===== AUTH API =====
export async function loginUser(data: { email: string; password: string }) {
    return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

// ===== USERS API =====
export async function getAllUsers(userId: string) {
    return apiRequest("/api/users", {
        method: "GET",
        headers: withAuth(userId),
    })
}

export async function createOrUpdateUser(userId: string, data: { email: string; password: string }) {
    return apiRequest("/api/users", {
        method: "POST",
        headers: withAuth(userId),
        body: JSON.stringify(data),
    })
}

export async function deleteUser(userId: string, targetUserId: string) {
    return apiRequest(`/api/users/${targetUserId}`, {
        method: "DELETE",
        headers: withAuth(userId),
    })
}

// ===== OBJECTS API =====
export async function getAllObjects(userId: string) {
    return apiRequest("/api/objects", {
        method: "GET",
        headers: withAuth(userId),
    })
}

export async function createObject(userId: string, data: { name: string; address: string; square: number }) {
    return apiRequest("/api/objects", {
        method: "POST",
        headers: withAuth(userId),
        body: JSON.stringify(data),
    })
}

export async function getObjectById(userId: string, objectId: string) {
    return apiRequest(`/api/objects/${objectId}`, {
        method: "GET",
        headers: withAuth(userId),
    })
}

export async function updateObject(
    userId: string,
    objectId: string,
    data: { name?: string; address?: string; square?: number; description?: string },
) {
    return apiRequest(`/api/objects/${objectId}`, {
        method: "PATCH",
        headers: withAuth(userId),
        body: JSON.stringify(data),
    })
}

export async function deleteObject(userId: string, objectId: string) {
    return apiRequest(`/api/objects/${objectId}`, {
        method: "DELETE",
        headers: withAuth(userId),
    })
}

// ===== OBJECT USERS API =====
export async function addUserToObject(userId: string, objectId: string, targetUserId: string) {
    return apiRequest(`/api/objects/${objectId}/users`, {
        method: "POST",
        headers: withAuth(userId),
        body: JSON.stringify({userId: targetUserId}),
    })
}

export async function removeUserFromObject(userId: string, objectId: string, targetUserId: string) {
    return apiRequest(`/api/objects/${objectId}/users/${targetUserId}`, {
        method: "DELETE",
        headers: withAuth(userId),
    })
}

// ===== RECORDS API =====
export async function createRecord(
    userId: string,
    data: {
        objectId: string
        rent?: number
        heat?: number
        exploitation?: number
        mop?: number
        renovation?: number
        tbo?: number
        electricity?: number
        earthRent?: number
        otherExpenses?: number
        otherIncomes?: number
        security?: number
    },
) {
    return apiRequest("/api/records", {
        method: "POST",
        headers: withAuth(userId),
        body: JSON.stringify(data),
    })
}

export async function getRecordById(userId: string, recordId: string) {
    return apiRequest(`/api/records/${recordId}`, {
        method: "GET",
        headers: withAuth(userId),
    })
}

export async function deleteRecord(userId: string, recordId: string) {
    return apiRequest(`/api/records/${recordId}`, {
        method: "DELETE",
        headers: withAuth(userId),
    })
}

export async function getRecordsByObjectId(userId: string, objectId: string) {
    return apiRequest(`/api/objects/${objectId}/records`, {
        method: "GET",
        headers: withAuth(userId),
    })
}

// ===== DATA FOR SALE API =====
export async function getDataForSaleByObjectId(userId: string, objectId: string) {
    return apiRequest(`/api/objects/${objectId}/data-for-sale`, {
        method: "GET",
        headers: withAuth(userId),
    })
}

export async function updateDataForSale(
    userId: string,
    objectId: string,
    data: { purchasePrice?: number; priceForSale?: number },
) {
    return apiRequest(`/api/objects/${objectId}/data-for-sale`, {
        method: "PATCH",
        headers: withAuth(userId),
        body: JSON.stringify(data),
    })
}
