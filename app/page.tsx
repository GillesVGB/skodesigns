import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function Home() {
  const saved = (await cookies()).get("sko-language")?.value;
  redirect(`/${saved && ["nl", "en", "fr"].includes(saved) ? saved : "nl"}/`);
}
