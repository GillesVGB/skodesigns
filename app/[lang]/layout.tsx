import "../globals.css";
import "../reference-shell.css";
import { notFound } from "next/navigation";
import { languages } from "@/lib/content";
import type { Language } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) notFound();
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
