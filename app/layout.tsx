import "./globals.css";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = (await headers()).get("x-sko-language") || "nl";
  return (
    <html lang={language} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
