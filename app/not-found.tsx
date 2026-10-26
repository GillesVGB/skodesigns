import { dictionaries, route } from "@/lib/content";
export default function NotFound() {
  const lang = "en";
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
