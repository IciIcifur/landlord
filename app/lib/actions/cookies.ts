"use server";

export function SetCookie(
  userId: string,
  userRole: "admin" | "client",
  days: number = 7,
): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `userId=${userId}; ${expires}; path=/`;
  document.cookie = `userRole=${userRole}; ${expires}; path=/`;
}

export function ClearCookie(): void {
  document.cookie = `userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
