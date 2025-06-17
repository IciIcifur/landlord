"use server"

interface RentalObject {
    id: string
    name: string
    address: string
    square: number
    description?: string
    users?: { id: string; email: string }[]
}

interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export async function getUserObjects(token: string): Promise<ApiResponse<RentalObject[]>> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}

export async function getObjectById(objectId: string, token: string): Promise<ApiResponse<RentalObject>> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects/${objectId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}

export async function updateObject(
    objectId: string,
    updateData: Partial<Pick<RentalObject, "name" | "address" | "square" | "description">>,
    token: string,
): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects/${objectId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            },
        )

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}

export async function createObject(
    objectData: Pick<RentalObject, "name" | "address" | "square">,
    token: string,
): Promise<ApiResponse<{ id: string }>> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(objectData),
        })

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}

export async function addUserToObject(
    objectId: string,
    userId: string,
    token: string,
): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects/${objectId}/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            },
        )

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}

export async function removeUserFromObject(
    objectId: string,
    userId: string,
    token: string,
): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/objects/${objectId}/users/${userId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        const result = await response.json()
        return result
    } catch (error) {
        return {
            success: false,
            error: "Network error occurred",
        }
    }
}
