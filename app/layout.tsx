import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/app/providers";
import { montserrat } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "LandLord",
  description: "A web-app for rental tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
