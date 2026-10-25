import { headers } from "next/headers";
import { dictionaries, route, type Language } from "@/lib/content";
export default async function NotFound() {
  const value = (await headers()).get("x-sko-language") || "nl";
  const lang = (["nl", "en", "fr"].includes(value) ? value : "nl") as Language;
  const d = dictionaries[lang];
  return (
    <main className="not-found container">
      <p className="eyebrow">SKO DESIGNS / 404</p>
      <h1>{d.notFound.title}</h1>
      <p>{d.notFound.text}</p>
      <a className="button" href={route(lang)}>
        {d.nav.home} ↗
      </a>
    </main>
  );
}
