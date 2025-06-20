'use server';
import GetUserId from '@/app/lib/utils/getUserId';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
  };
  const response = await fetch(url, config);
  return response.json();
}

async function withAuth(headers: Record<string, string> = {}) {
  return {
    ...headers,
    'x-user-id': await GetUserId(),
  };
}

// ===== AUTH API =====
export async function LoginUser(data: { email: string; password: string }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ===== USERS API =====
export async function GetUserById() {
  return apiRequest(`/api/users/${await GetUserId()}`, {
    method: 'GET',
  });
}

export async function GetAllUsers() {
  return apiRequest('/api/users', {
    method: 'GET',
    headers: await withAuth(),
  });
}

export async function CreateOrUpdateUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest('/api/users', {
    method: 'POST',
    headers: await withAuth(),
    body: JSON.stringify(data),
  });
}

export async function DeleteUser(targetUserId: string) {
  return apiRequest(`/api/users/${targetUserId}`, {
    method: 'DELETE',
    headers: await withAuth(),
  });
}

// ===== OBJECTS API =====
export async function GetAllObjects() {
  return apiRequest('/api/objects', {
    method: 'GET',
    headers: await withAuth(),
  });
}

export async function CreateObject(data: {
  name: string;
  address: string;
  square: number;
}) {
  return apiRequest('/api/objects', {
    method: 'POST',
    headers: await withAuth(),
    body: JSON.stringify(data),
  });
}

export async function GetObjectById(objectId: string) {
  return apiRequest(`/api/objects/${objectId}`, {
    method: 'GET',
    headers: await withAuth(),
  });
}

export async function UpdateObject(
  objectId: string,
  data: {
    name?: string;
    address?: string;
    square?: number;
    description?: string;
  },
) {
  return apiRequest(`/api/objects/${objectId}`, {
    method: 'PATCH',
    headers: await withAuth(),
    body: JSON.stringify(data),
  });
}

export async function DeleteObject(objectId: string) {
  return apiRequest(`/api/objects/${objectId}`, {
    method: 'DELETE',
    headers: await withAuth(),
  });
}

// ===== OBJECT USERS API =====
export async function AddUserToObject(objectId: string, targetUserId: string) {
  return apiRequest(`/api/objects/${objectId}/users`, {
    method: 'POST',
    headers: await withAuth(),
    body: JSON.stringify({ userId: targetUserId }),
  });
}

export async function RemoveUserFromObject(
  objectId: string,
  targetUserId: string,
) {
  return apiRequest(`/api/objects/${objectId}/users/${targetUserId}`, {
    method: 'DELETE',
    headers: await withAuth(),
  });
}

// ===== RECORDS API =====
export async function CreateRecord(data: {
  objectId: string;
  rent?: number;
  heat?: number;
  exploitation?: number;
  mop?: number;
  renovation?: number;
  tbo?: number;
  electricity?: number;
  earthRent?: number;
  otherExpenses?: number;
  otherIncomes?: number;
  security?: number;
}) {
  return apiRequest('/api/records', {
    method: 'POST',
    headers: await withAuth(),
    body: JSON.stringify(data),
  });
}

export async function GetRecordById(recordId: string) {
  return apiRequest(`/api/records/${recordId}`, {
    method: 'GET',
    headers: await withAuth(),
  });
}

export async function DeleteRecord(recordId: string) {
  return apiRequest(`/api/records/${recordId}`, {
    method: 'DELETE',
    headers: await withAuth(),
  });
}

export async function GetRecordsByObjectId(objectId: string) {
  return apiRequest(`/api/objects/${objectId}/records`, {
    method: 'GET',
    headers: await withAuth(),
  });
}

// ===== DATA FOR SALE API =====
export async function GetDataForSaleByObjectId(objectId: string) {
  return apiRequest(`/api/objects/${objectId}/data-for-sale`, {
    method: 'GET',
    headers: await withAuth(),
  });
}

export async function UpdateDataForSale(
  objectId: string,
  data: { purchasePrice?: number; priceForSale?: number },
) {
  return apiRequest(`/api/objects/${objectId}/data-for-sale`, {
    method: 'PATCH',
    headers: await withAuth(),
    body: JSON.stringify(data),
  });
}

// ===== EXCEL EXPORT API =====
export async function ExportObjectToExcel(objectId: string, returnBlob = false) {
  const userId = await GetUserId()
  const url = `${API_URL}/api/objects/${objectId}/export-excel${returnBlob ? "?returnBlob=true" : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-user-id": userId,
    },
  })

  if (!response.ok) {
    throw new Error("Ошибка при экспорте данных")
  }

  if (returnBlob) {
    return response.json()
  } else {
    return response.blob()
  }
}