import type { Language } from "@/lib/content";

const nl = {
  teamTitle: "Het team",
  teamSubtitle: "Wie zit er achter het werk",
  servicesTitle: "Wat we maken",
  servicesSubtitle: "GFX-diensten",
  contactTitle: "Klaar om op te vallen?",
  contactDescription:
    "Jij brengt het idee. Sko Designs maakt de visuals. Strak, herkenbaar en passend bij jouw merk.",
};

const en: typeof nl = {
  teamTitle: "The team",
  teamSubtitle: "Who's behind the work",
  servicesTitle: "What we offer",
  servicesSubtitle: "GFX services",
  contactTitle: "Ready to stand out?",
  contactDescription:
    "Bring the idea. Sko Designs handles the visuals. Clean, on-brand and built to fit.",
};

const fr: typeof nl = {
  teamTitle: "L’équipe",
  teamSubtitle: "Derrière les créations",
  servicesTitle: "Nos créations",
  servicesSubtitle: "Services graphiques",
  contactTitle: "Prêt à vous démarquer ?",
  contactDescription:
    "Vous apportez l’idée. Sko Designs crée les visuels. Un résultat soigné, cohérent et adapté à votre marque.",
};

export const referenceCopy: Record<Language, typeof nl> = { nl, en, fr };
