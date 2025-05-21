export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface Object {
    id: string;
    name: string;
    square: number;
    description?: string;
    records: Record[];
    dataForSale: DataForSale;
}

export interface Record {
    id: string;
    date: string;
    rent?: number;
    heat?: number;
    explotation?: number;
    mop?: number;
    renovation?: number;
    tbo?: number;
    electricity?: number;
    earthRent?: number;
    otherExpenses?: number;
    otherIncomes?: number;
    security?: number;
    totalExpenses?: number;
    totalIncomes?: number;
    totalProfit?: number;
}

export interface DataForSale {
    id: string;
    purchasePrice: number;
    priceForSale: number;
    countOfMonth?: number;
    profitPerMonth?: number;
    totalProfit?: number;
    payback5Year?: number;
    payback7Year?: number;
    payback10Year?: number;
    percentPerYear?: number;
}

export enum UserRole {
    CLIENT,
    ADMIN,
}
