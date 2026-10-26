import type { Metadata } from "next";
import Studio from "@/components/studio";
import { languages, type Language } from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) notFound();
  return {
    title: "Staff admin | Sko Designs",
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) notFound();
  return <Studio lang={lang as Language} page="admin" />;
}
