export const languages = ["nl", "en", "fr"] as const;
export type Language = (typeof languages)[number];
export const pages = [
  "home",
  "portfolio",
  "services",
  "pricing",
  "about",
  "reviews",
  "contact",
  "privacy",
] as const;
export type Page = (typeof pages)[number];
export const discord = "https://discord.gg/zBPeuExUS3";
export const canonicalOrigin = "https://thomdesigns.nl";
export const languageNames = {
  nl: "Nederlands",
  en: "English",
  fr: "Français",
};
export const route = (lang: Language, page: Page = "home") =>
  `/${lang}/${page === "home" ? "" : page + "/"}`;
export const projects = [
  {
    id: "sko-identity",
    title: "Sko Designs",
    category: "logos",
    image: "sko-icon.webp",
    width: 640,
    height: 640,
    featured: true,
  },
  {
    id: "sko-banner",
    title: "Sko Designs",
    category: "banners",
    image: "sko-banner.webp",
    width: 1983,
    height: 793,
    featured: true,
  },
  {
    id: "sko-motion",
    title: "Sko Designs — V3",
    category: "motion",
    image: "sko-v3-still.webp",
    animation: "sko-v3.gif",
    width: 640,
    height: 640,
    featured: true,
  },
  {
    id: "sko-white",
    title: "Sko Designs — White",
    category: "motion",
    image: "sko-white-still.webp",
    animation: "sko-white-banner.gif",
    width: 793,
    height: 317,
  },
  {
    id: "skodax",
    title: "Skodax",
    category: "motion",
    image: "skodax-still.webp",
    animation: "skodax.gif",
    width: 640,
    height: 640,
  },
  {
    id: "sko-intro",
    title: "Sko Designs — Intro",
    category: "motion",
    image: "sko-still.webp",
    animation: "sko.gif",
    width: 640,
    height: 640,
  },
  {
    id: "your-vision",
    title: "Your Vision, Our Design",
    category: "other",
    image: "your-vision.webp",
    width: 1024,
    height: 536,
    featured: true,
  },
];
export type Project = (typeof projects)[number];
export const packagePrices = [1849, 1299, 3699];
export const singlePrices = [549, 549, 899, 899, 349];
export const boxCounts = [1, 3, 5, 10, 15];
export const boxPrices = [349, 599, 899, 1649, 2199];
export const money = (cents: number, lang: Language) =>
  new Intl.NumberFormat({ nl: "nl-NL", en: "en-IE", fr: "fr-FR" }[lang], {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
const nl = {
  nav: {
    home: "Home",
    portfolio: "Portfolio",
    services: "Diensten",
    pricing: "Prijzen",
    about: "Over ons",
    reviews: "Reviews",
    contact: "Contact",
    privacy: "Privacy",
  },
  seo: {
    home: [
      "Grafisch design dat opvalt",
      "Sko Designs maakt logo’s, banners, thumbnails, Discord graphics en animaties voor creators, communities en online merken.",
    ],
    portfolio: [
      "Portfolio — logo’s, banners & GFX",
      "Ontdek het werk van Sko Designs: branding, FiveM graphics, YouTube thumbnails, product mockups en animaties.",
    ],
    services: [
      "Grafisch design & creatieve diensten",
      "Logo’s, banners, product boxes, thumbnails, animaties en Discord emoji’s. Bekijk wat Sko Designs voor jouw merk kan ontwerpen.",
    ],
    pricing: [
      "Prijzen & designpakketten",
      "Bekijk de startprijzen voor FiveM-, Discord- en streamerpakketten, losse designs en product boxes. Stel je eigen pakket samen.",
    ],
    about: [
      "Over Sko Designs",
      "Maak kennis met Skodax, CEO en eigenaar van Sko Designs. Grafisch design met aandacht voor jouw ideeën en de kleinste details.",
    ],
    reviews: [
      "Reviews van onze klanten",
      "Lees wat klanten vertellen over hun ervaring met de designs, samenwerking en communicatie.",
    ],
    contact: [
      "Start jouw project",
      "Een idee voor je merk, kanaal of community? Bespreek je project met Sko Designs via Discord.",
    ],
    privacy: [
      "Privacy & voorkeuren",
      "Lees hoe Sko Designs omgaat met taalvoorkeuren, cookies en contact via Discord.",
    ],
  },
  ui: {
    start: "Start een project",
    explore: "Ontdek ons portfolio",
    discover: "Bekijk onze diensten",
    allWork: "Bekijk al het werk",
    view: "Bekijk project",
    close: "Sluiten",
    previous: "Vorig project",
    next: "Volgend project",
    language: "Taal kiezen",
    menu: "Menu openen",
    closeMenu: "Menu sluiten",
    skip: "Naar de inhoud",
    home: "Naar de homepage",
    play: "Animatie afspelen",
    pause: "Stilstaand beeld",
    image: "Ontwerp",
    newTab: "opent in een nieuw tabblad",
    workCount: "projecten",
    back: "Terug naar portfolio",
    copy: "Kopieer je selectie",
    copied: "Gekopieerd",
    copyError: "Kopiëren lukt niet. Selecteer de tekst hieronder.",
    order: "Bestel via Discord",
    from: "Vanaf",
    selected: "Geselecteerd werk",
    more: "Meer over ons",
    contact: "Neem contact op",
    quote: "Bespreek je project",
    logoAlt: "Officieel Sko Design-logo",
    artAlt: "Origineel ontwerp uit het portfolio van Sko Designs",
    stars: "5 van 5 sterren",
  },
  hero: {
    eyebrow: "CREATIEVE DESIGNSTUDIO",
    line1: "Design dat",
    line2: "jou laat",
    accent: "opvallen.",
    description:
      "Creatieve graphics. Krachtige branding. Premium visuals die jouw merk onmogelijk te negeren maken.",
    note: "Voor creators, communities & merken met ambitie.",
    visual: "Jouw visie. Onze signatuur.",
    index: "01 / EEN EERSTE INDRUK DIE BLIJFT",
    scroll: "SCROLL OM TE ONTDEKKEN",
  },
  band: [
    "GRAFISCH DESIGN",
    "DIGITALE BRANDING",
    "CREATIEVE VISUALS",
    "GEMAAKT OM OP TE VALLEN",
  ],
  work: {
    eyebrow: "01 — HET WERK",
    title: "Laat het werk",
    accent: "spreken.",
    description:
      "Van een herkenbaar logo tot een complete visuele wereld. Een selectie van onze designs.",
    pageTitle: "Werk dat blijft hangen.",
    pageDescription:
      "Identiteiten, visuals en beweging. Ontdek het portfolio en bekijk elk ontwerp van dichtbij.",
    filters: {
      all: "Alle projecten",
      logos: "Logo’s",
      banners: "Banners",
      thumbnails: "Thumbnails",
      mockups: "Product mockups",
      discord: "Discord graphics",
      motion: "Animaties",
      other: "Overige designs",
    },
    empty: "Er zijn nog geen projecten in deze categorie.",
    detail: "Het originele ontwerp, in alle details.",
    motionNote: "Animaties starten alleen wanneer je op afspelen drukt.",
    inquiry: "Ook zoiets voor jouw merk?",
  },
  services: {
    eyebrow: "02 — WAT WE MAKEN",
    title: "Jouw ideeën.",
    accent: "Sterk ontworpen.",
    description:
      "Een eigen uitstraling, op ieder platform. Van het eerste logo tot de laatste pixel.",
    items: [
      [
        "Logo design",
        "Een herkenbaar logo voor je merk, Discord-community of FiveM-server.",
      ],
      [
        "Banners",
        "Sterke banners voor servers, socials en storefronts. Ontworpen voor de plek waar ze verschijnen.",
      ],
      [
        "Product boxes",
        "Tebex-mockups die digitale producten een heldere, professionele presentatie geven.",
      ],
      [
        "Thumbnails",
        "Opvallende YouTube-thumbnails met een duidelijke compositie die de aandacht trekt.",
      ],
      [
        "Animaties",
        "Logo- en banneranimaties met heldere, doelgerichte beweging.",
      ],
      [
        "Discord emoji’s",
        "Eigen emoji’s die passen bij de uitstraling en persoonlijkheid van jouw server.",
      ],
    ],
    cta: "Bekijk voorbeelden",
    processTitle: "Van jouw visie naar het eindresultaat.",
    steps: [
      ["Vertel je idee", "Deel je stijl, wensen en referenties via Discord."],
      [
        "Stem de opdracht af",
        "We bespreken de inhoud en definitieve prijs voordat het project start.",
      ],
      [
        "Breng je merk tot leven",
        "Jouw idee wordt uitgewerkt tot graphics die bij je merk passen.",
      ],
    ],
  },
  about: {
    eyebrow: "03 — ACHTER DE PIXELS",
    title: "Klein in team.",
    accent: "Groot in aandacht.",
    description:
      "Sko Designs maakt graphics en overlays voor creators, online merken en communities. Een sterke visuele identiteit begint met luisteren naar jouw idee.",
    detail:
      "Met oog voor detail en een creatieve aanpak vertalen we jouw wensen naar visuals die passen bij je merk en het platform. Van een los ontwerp tot een samenhangend pakket.",
    role: "CEO / Eigenaar",
    bio: "Skodax is de creatieve kracht achter Sko Designs. Hij ontwerpt graphics en overlays met aandacht voor kwaliteit, een eigen uitstraling en wat jij voor ogen hebt.",
    signature: "Jouw visie, tot in de details.",
    values: [
      [
        "Een eigen gezicht",
        "Geen merk is hetzelfde. Je visuals horen dat ook niet te zijn.",
      ],
      [
        "Details maken het verschil",
        "Van typografie tot compositie: ieder element telt.",
      ],
      [
        "Samen naar het ontwerp",
        "Jouw wensen en referenties vormen het vertrekpunt.",
      ],
    ],
  },
  reviews: {
    eyebrow: "04 — WOORDEN VAN KLANTEN",
    title: "Mooi werk is één ding.",
    accent: "Fijn samenwerken ook.",
    description:
      "Ervaringen van klanten, overgenomen van de bestaande website. Vertalingen behouden de betekenis van het origineel.",
    source: "Klantreview",
    all: "Lees alle reviews",
    items: [
      [
        "CryzZ",
        "Snelle, strakke en professionele designs. Gemaakt met precisie, creativiteit en oog voor detail om je merk te laten opvallen.",
      ],
      [
        "Project Globe",
        "De designs zijn ontzettend strak en professioneel. Alles ziet er verzorgd en goed in balans uit, precies zoals ik het me had voorgesteld.",
      ],
      [
        "buyvolt.xyz",
        "Snel en prettig samenwerken! De communicatie verliep soepel, het proces ging vlot en het eindresultaat was precies wat ik wilde.",
      ],
      ["Simon", "Een vertrouwd adres voor thumbnails van hoge kwaliteit."],
      [
        "Berry Bengel",
        "Goede communicatie, snelle levering en geweldige kwaliteit. Alles werd professioneel aangepakt en het eindresultaat was zelfs beter dan verwacht.",
      ],
      [
        "Yenzotjeuhhh",
        "Supersnelle levering en echt betaalbare prijzen. De kwaliteit is eerlijk gezegd geweldig voor wat je betaalt. Zeker een aanrader, jongens.",
      ],
      [
        "Ducky",
        "Een van de makkelijkste designers om mee te werken. Hij begrijpt meteen wat je wilt, heeft oog voor detail en maakt van ideeën iets unieks en professioneels. Voor een nieuw ontwerp kom ik hier steeds terug.",
      ],
      [
        "Fasnoo",
        "Weer goed geholpen, zoals altijd. Stelt nooit teleur en levert precies wat ik nodig heb. Elke keer mijn vaste designer.",
      ],
      [
        "Jorikkie",
        "Echt onder de indruk van zijn creatieve en originele designs. Hij komt steeds met frisse ideeën en weet hoe een ontwerp opvalt. Zeker iemand die ik zou aanbevelen.",
      ],
      [
        "Tonic",
        "Mijn streamerpakket laten maken en ik ben er ontzettend blij mee. Alles past perfect bij elkaar, ziet er professioneel uit en geeft mijn stream een heel andere uitstraling.",
      ],
    ],
  },
  pricing: {
    eyebrow: "05 — HELDER VANAF HET BEGIN",
    title: "Sterk design.",
    accent: "Heldere prijzen.",
    description:
      "Een compleet pakket of precies dat ene ontwerp. Kies wat bij jouw project past.",
    condition: "Startprijzen; definitieve prijs in overleg.",
    popular: "Populair",
    packages: [
      [
        "FiveM",
        "Voor een server met een eigen identiteit.",
        [
          "Logo (3 kleuren)",
          "Discord banner",
          "FiveM banner",
          "Connecting banner",
        ],
      ],
      [
        "Discord",
        "Een samenhangende look voor je community.",
        ["Logo", "Serverbanner", "Profielbanner", "5 emoji’s"],
      ],
      [
        "Streamer",
        "Jouw kanaal, helemaal in dezelfde stijl.",
        ["Logo", "Banner", "3 overlays", "3 thumbnails"],
      ],
    ],
    singles: "Losse designs",
    singleNames: [
      "Logo",
      "Banner",
      "Logo-animatie",
      "Banner-animatie",
      "Thumbnail",
    ],
    boxes: "Images / Boxes",
    boxUnit: "image / box",
    boxUnits: "images / boxes",
    builder: "Jouw pakket, jouw keuze.",
    builderDesc:
      "Selecteer losse designs en product sets. De indicatie telt automatisch op.",
    total: "Totaalindicatie",
    selection: "Jouw selectie",
    noSelection: "Selecteer een ontwerp om je pakket samen te stellen.",
    builderNote:
      "Kopieer je selectie en deel deze via Discord. Dit is een prijsindicatie, geen bestelling.",
    custom: "Iets anders in gedachten?",
    customDesc: "Bespreek je wensen voor een offerte op maat.",
    copyPrefix: "Mijn project bij Sko Designs",
    copyPrice: "Startprijsindicatie",
    faqTitle: "Goed om te weten.",
    faqs: [
      [
        "Hoe plaats ik een bestelling?",
        "Open onze Discord en vertel welk ontwerp of pakket je wilt. Deel ook je ideeën en referenties.",
      ],
      [
        "Zijn dit vaste prijzen?",
        "Dit zijn startprijzen. De definitieve prijs wordt in overleg bepaald, op basis van jouw wensen.",
      ],
      [
        "Wanneer is mijn ontwerp klaar?",
        "Bespreek de planning via Discord voordat je bestelt. Er staat geen vaste levertijd bij de pakketten.",
      ],
      [
        "Kan ik een eigen pakket samenstellen?",
        "Ja. Gebruik de pakketbouwer voor een indicatie en deel je selectie via Discord.",
      ],
    ],
  },
  contact: {
    eyebrow: "LATEN WE IETS MAKEN",
    title: "Jij hebt de visie.",
    accent: "Wij het design.",
    description: "Vertel ons over je project. Samen maken we iets dat opvalt.",
    discord: "Start je project op Discord",
    discordDesc:
      "Onze plek voor ideeën, vragen en bestellingen. Bespreek je wensen rechtstreeks met Sko Designs.",
    button: "Open Discord",
    hint: "Je wordt doorgestuurd naar Discord. Er wordt hier geen aanvraag verzonden.",
    briefTitle: "Een goede start is het halve werk.",
    briefDesc: "Neem dit mee naar het gesprek:",
    briefs: [
      "Je merk, kanaal of community",
      "Het ontwerp of pakket dat je zoekt",
      "Stijl, kleuren en visuele referenties",
      "Je gewenste planning en budget",
    ],
    pricingLink: "Eerst de prijzen bekijken",
    footer: "Een idee verdient een sterk ontwerp.",
    mini: "Logo’s, banners & meer — met aandacht gemaakt.",
  },
  footer: {
    description:
      "Een creatieve designstudio voor merken, creators en communities die willen opvallen.",
    navigation: "Ontdek",
    connect: "Laten we praten",
    social: "Discord-community",
    copyright: "Alle rechten voorbehouden.",
    credit: "Jouw visie. Ons design.",
    language: "Deze website in jouw taal",
  },
  privacy: {
    title: "Privacy, helder uitgelegd.",
    intro:
      "Deze website gebruikt geen advertentietrackers of analytische cookies.",
    sections: [
      [
        "Taalvoorkeur",
        "We bewaren alleen je gekozen taal (nl, en of fr) in de lokale opslag van je browser. Zo opent de website bij een volgend bezoek in jouw taal. Je kunt deze voorkeur wissen via je browserinstellingen.",
      ],
      [
        "Contact via Discord",
        "Voor vragen en bestellingen verwijzen we naar de officiële Discord-community. Op deze website staat geen contactformulier en worden geen projectgegevens verstuurd of opgeslagen. Discord verwerkt gegevens volgens zijn eigen privacybeleid.",
      ],
      [
        "Pakketbouwer",
        "Je selectie en prijsindicatie blijven in je browser. Alleen als je op kopiëren drukt, wordt de tekst naar je klembord gekopieerd. Je kiest zelf wat je vervolgens via Discord deelt.",
      ],
      [
        "Vragen",
        "Neem voor vragen over je privacy of een project contact op via onze Discord.",
      ],
    ],
  },
  notFound: {
    title: "Deze pagina bestaat niet.",
    text: "Ga terug naar de homepage en ontdek Sko Designs.",
  },
};
const en: typeof nl = {
  nav: {
    home: "Home",
    portfolio: "Portfolio",
    services: "Services",
    pricing: "Pricing",
    about: "About",
    reviews: "Reviews",
    contact: "Contact",
    privacy: "Privacy",
  },
  seo: {
    home: [
      "Graphic design that stands out",
      "Sko Designs creates logos, banners, thumbnails, Discord graphics and animations for creators, communities and online brands.",
    ],
    portfolio: [
      "Portfolio — logos, banners & GFX",
      "Explore Sko Designs’ work: branding, FiveM graphics, YouTube thumbnails, product mockups and animations.",
    ],
    services: [
      "Graphic design & creative services",
      "Logos, banners, product boxes, thumbnails, animations and Discord emojis. Discover what Sko Designs can create for your brand.",
    ],
    pricing: [
      "Pricing & design packages",
      "Explore starting prices for FiveM, Discord and streamer packages, individual designs and product boxes. Build your own package.",
    ],
    about: [
      "About Sko Designs",
      "Meet Skodax, CEO and owner of Sko Designs. Graphic design shaped around your ideas, down to the smallest detail.",
    ],
    reviews: [
      "Client reviews",
      "Read what clients say about their designs, communication and experience working together.",
    ],
    contact: [
      "Start your project",
      "An idea for your brand, channel or community? Talk to Sko Designs about your project on Discord.",
    ],
    privacy: [
      "Privacy & preferences",
      "Learn how Sko Designs handles language preferences, cookies and contact through Discord.",
    ],
  },
  ui: {
    start: "Start a project",
    explore: "Explore our portfolio",
    discover: "Discover our services",
    allWork: "View all work",
    view: "View project",
    close: "Close",
    previous: "Previous project",
    next: "Next project",
    language: "Select language",
    menu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
    home: "Go to homepage",
    play: "Play animation",
    pause: "Still image",
    image: "Design",
    newTab: "opens in a new tab",
    workCount: "projects",
    back: "Back to portfolio",
    copy: "Copy your selection",
    copied: "Copied",
    copyError: "Unable to copy. Select the text below.",
    order: "Order on Discord",
    from: "From",
    selected: "Selected work",
    more: "More about us",
    contact: "Get in touch",
    quote: "Discuss your project",
    logoAlt: "Official Sko Design logo",
    artAlt: "Original design from the Sko Designs portfolio",
    stars: "5 out of 5 stars",
  },
  hero: {
    eyebrow: "INDEPENDENT CREATIVE STUDIO",
    line1: "Design that",
    line2: "makes you",
    accent: "stand out.",
    description:
      "Creative graphics. Powerful branding. Premium visuals designed to make your brand impossible to ignore.",
    note: "For creators, communities & brands with ambition.",
    visual: "Your vision. Our signature.",
    index: "01 / A FIRST IMPRESSION THAT LASTS",
    scroll: "SCROLL TO EXPLORE",
  },
  band: [
    "GRAPHIC DESIGN",
    "DIGITAL BRANDING",
    "CREATIVE VISUALS",
    "MADE TO STAND OUT",
  ],
  work: {
    eyebrow: "01 — SELECTED WORK",
    title: "Let the work",
    accent: "do the talking.",
    description:
      "From a distinctive logo to a complete visual world. A selection of our designs.",
    pageTitle: "Work that stays with you.",
    pageDescription:
      "Identities, visuals and motion. Explore the portfolio and take a closer look at each design.",
    filters: {
      all: "All projects",
      logos: "Logos",
      banners: "Banners",
      thumbnails: "Thumbnails",
      mockups: "Product mockups",
      discord: "Discord graphics",
      motion: "Animations",
      other: "Other designs",
    },
    empty: "There are no projects in this category yet.",
    detail: "The original design, in every detail.",
    motionNote: "Animations only start when you press play.",
    inquiry: "Something like this for your brand?",
  },
  services: {
    eyebrow: "02 — WHAT WE CREATE",
    title: "Your ideas.",
    accent: "Beautifully designed.",
    description:
      "A distinctive look, on every platform. From the first logo to the final pixel.",
    items: [
      [
        "Logo design",
        "A distinctive logo for your brand, Discord community or FiveM server.",
      ],
      [
        "Banners",
        "Striking banners for servers, social media and storefronts. Designed for the platform they call home.",
      ],
      [
        "Product boxes",
        "Tebex mockups that give digital products a clear, professional presentation.",
      ],
      [
        "Thumbnails",
        "Eye-catching YouTube thumbnails with a strong composition that draws attention.",
      ],
      [
        "Animations",
        "Logo and banner animations with clear, purposeful motion.",
      ],
      [
        "Discord emojis",
        "Custom emojis that reflect your server’s look and personality.",
      ],
    ],
    cta: "Explore examples",
    processTitle: "From your vision to the finished design.",
    steps: [
      [
        "Share your idea",
        "Tell us your style, wishes and references on Discord.",
      ],
      [
        "Agree on the project",
        "We discuss the scope and final price before the project starts.",
      ],
      [
        "Bring your brand to life",
        "Your idea takes shape as graphics made for your brand.",
      ],
    ],
  },
  about: {
    eyebrow: "03 — BEHIND THE PIXELS",
    title: "A small team.",
    accent: "A lot of attention.",
    description:
      "Sko Designs creates graphics and overlays for creators, online brands and communities. A strong visual identity starts with listening to your idea.",
    detail:
      "With an eye for detail and a creative approach, we turn your brief into visuals that fit your brand and its platform. From an individual design to a cohesive package.",
    role: "CEO / Owner",
    bio: "Skodax is the creative force behind Sko Designs. He designs graphics and overlays with a focus on quality, a distinctive look and what you have in mind.",
    signature: "Your vision, down to the details.",
    values: [
      [
        "A look of your own",
        "No two brands are the same. Your visuals should reflect that.",
      ],
      [
        "Details make the difference",
        "From typography to composition, every element matters.",
      ],
      [
        "A shared creative process",
        "Your ideas and references are our starting point.",
      ],
    ],
  },
  reviews: {
    eyebrow: "04 — CLIENT WORDS",
    title: "Great design is one thing.",
    accent: "Working well together matters too.",
    description:
      "Client experiences from the existing website. Translations preserve the meaning of the original reviews.",
    source: "Client review",
    all: "Read all reviews",
    items: [
      [
        "CryzZ",
        "Fast, clean and professional designs. Crafted with precision, creativity and attention to detail to make your brand stand out.",
      ],
      [
        "Project Globe",
        "The designs are incredibly clean and professional. Everything looks polished, well-balanced, and exactly how I imagined it.",
      ],
      [
        "buyvolt.xyz",
        "Fast and easy to deal with! The communication was smooth, the process was quick, and the final design turned out exactly how I wanted it.",
      ],
      ["Simon", "A trusted name for high-quality thumbnail designs."],
      [
        "Berry Bengel",
        "Great communication, fast delivery, and amazing quality. Everything was handled professionally, the communication was smooth, and the final design turned out even better than I expected.",
      ],
      [
        "Yenzotjeuhhh",
        "Super fast delivery and really affordable prices. The quality is honestly great for what you pay, definitely recommend checking him out, boys.",
      ],
      [
        "Ducky",
        "Honestly one of the easiest designers to work with. He understands what you want right away, has a great eye for detail, and always manages to turn ideas into something unique and professional. I always come back here whenever I need a new design.",
      ],
      [
        "Fasnoo",
        "Sorted again, as always. Never disappoints and always delivers exactly what I need. Definitely my go-to designer every time.",
      ],
      [
        "Jorikkie",
        "Really impressed with how creative and original his designs are. He always brings a fresh idea to the table and knows exactly how to make a design stand out. Definitely someone I’d recommend.",
      ],
      [
        "Tonic",
        "Got my streamer package done and I couldn’t be happier with it. Everything matches perfectly, looks professional, and gives my stream a completely different feel. Definitely happy with how it turned out!",
      ],
    ],
  },
  pricing: {
    eyebrow: "05 — CLEAR FROM THE START",
    title: "Standout design.",
    accent: "Straightforward pricing.",
    description:
      "A complete package or the one design you need. Choose what fits your project.",
    condition: "Starting prices; final price agreed together.",
    popular: "Popular",
    packages: [
      [
        "FiveM",
        "A distinct identity for your server.",
        [
          "Logo (3 colours)",
          "Discord banner",
          "FiveM banner",
          "Connecting banner",
        ],
      ],
      [
        "Discord",
        "A cohesive look for your community.",
        ["Logo", "Server banner", "Profile banner", "5 emojis"],
      ],
      [
        "Streamer",
        "Your channel, with one consistent style.",
        ["Logo", "Banner", "3 overlays", "3 thumbnails"],
      ],
    ],
    singles: "Individual designs",
    singleNames: [
      "Logo",
      "Banner",
      "Logo animation",
      "Banner animation",
      "Thumbnail",
    ],
    boxes: "Images / Boxes",
    boxUnit: "image / box",
    boxUnits: "images / boxes",
    builder: "Your package, your choice.",
    builderDesc:
      "Select individual designs and product sets. Your estimate updates automatically.",
    total: "Estimated total",
    selection: "Your selection",
    noSelection: "Select a design to start building your package.",
    builderNote:
      "Copy your selection and share it on Discord. This is an estimate, not an order.",
    custom: "Have something else in mind?",
    customDesc: "Tell us what you need for a custom quote.",
    copyPrefix: "My project with Sko Designs",
    copyPrice: "Starting price estimate",
    faqTitle: "Good to know.",
    faqs: [
      [
        "How do I place an order?",
        "Open our Discord and tell us which design or package you want. Share your ideas and references too.",
      ],
      [
        "Are these fixed prices?",
        "These are starting prices. The final price is agreed together, based on your requirements.",
      ],
      [
        "When will my design be ready?",
        "Discuss the schedule on Discord before ordering. Packages do not have a fixed delivery time.",
      ],
      [
        "Can I build my own package?",
        "Yes. Use the package builder for an estimate, then share your selection on Discord.",
      ],
    ],
  },
  contact: {
    eyebrow: "LET’S CREATE SOMETHING",
    title: "Have a vision?",
    accent: "Let’s design it.",
    description:
      "Tell us about your project. Let’s create something that stands out.",
    discord: "Start your project on Discord",
    discordDesc:
      "Our place for ideas, questions and orders. Discuss your project directly with Sko Designs.",
    button: "Open Discord",
    hint: "You will be taken to Discord. No enquiry is sent from this website.",
    briefTitle: "A great project starts with a good brief.",
    briefDesc: "Bring these to the conversation:",
    briefs: [
      "Your brand, channel or community",
      "The design or package you need",
      "Style, colours and visual references",
      "Your preferred schedule and budget",
    ],
    pricingLink: "Explore pricing first",
    footer: "An idea deserves a great design.",
    mini: "Logos, banners & more — thoughtfully made.",
  },
  footer: {
    description:
      "A creative design studio for brands, creators and communities that want to stand out.",
    navigation: "Explore",
    connect: "Let’s talk",
    social: "Discord community",
    copyright: "All rights reserved.",
    credit: "Your vision. Our design.",
    language: "This website in your language",
  },
  privacy: {
    title: "Privacy, clearly explained.",
    intro: "This website uses no advertising trackers or analytics cookies.",
    sections: [
      [
        "Language preference",
        "We only store your selected language (nl, en or fr) in your browser’s local storage. This lets the website open in your preferred language next time. You can remove this preference in your browser settings.",
      ],
      [
        "Contact through Discord",
        "Questions and orders are handled through the official Discord community. There is no contact form on this website, and no project information is sent or stored here. Discord processes information under its own privacy policy.",
      ],
      [
        "Package builder",
        "Your selection and estimate stay in your browser. Text is only copied to your clipboard when you press copy. You decide what to share on Discord afterwards.",
      ],
      [
        "Questions",
        "For questions about your privacy or a project, contact us through Discord.",
      ],
    ],
  },
  notFound: {
    title: "This page does not exist.",
    text: "Return to the homepage and discover Sko Designs.",
  },
};
const fr: typeof nl = {
  nav: {
    home: "Accueil",
    portfolio: "Portfolio",
    services: "Services",
    pricing: "Tarifs",
    about: "À propos",
    reviews: "Avis",
    contact: "Contact",
    privacy: "Confidentialité",
  },
  seo: {
    home: [
      "Du design graphique qui se démarque",
      "Sko Designs crée logos, bannières, miniatures YouTube, visuels Discord et animations pour les créateurs, communautés et marques en ligne.",
    ],
    portfolio: [
      "Portfolio — logos, bannières & GFX",
      "Découvrez les créations de Sko Designs : identités visuelles, graphismes FiveM, miniatures YouTube, mockups et animations.",
    ],
    services: [
      "Design graphique & services créatifs",
      "Logos, bannières, visuels produits, miniatures, animations et émojis Discord. Découvrez les services créatifs de Sko Designs.",
    ],
    pricing: [
      "Tarifs & packs graphiques",
      "Consultez les tarifs de départ des packs FiveM, Discord et streamer, des créations à l’unité et des visuels produits. Composez votre pack.",
    ],
    about: [
      "À propos de Sko Designs",
      "Découvrez Skodax, dirigeant et propriétaire de Sko Designs. Un design graphique à l’écoute de vos idées, jusque dans les moindres détails.",
    ],
    reviews: [
      "Les avis de nos clients",
      "Découvrez les témoignages de nos clients sur leurs créations, les échanges et la collaboration.",
    ],
    contact: [
      "Démarrez votre projet",
      "Une idée pour votre marque, chaîne ou communauté ? Parlez de votre projet avec Sko Designs sur Discord.",
    ],
    privacy: [
      "Confidentialité & préférences",
      "Découvrez comment Sko Designs gère les préférences linguistiques, les cookies et les échanges via Discord.",
    ],
  },
  ui: {
    start: "Démarrer un projet",
    explore: "Découvrez notre portfolio",
    discover: "Découvrez nos services",
    allWork: "Voir toutes les créations",
    view: "Voir le projet",
    close: "Fermer",
    previous: "Projet précédent",
    next: "Projet suivant",
    language: "Choisir la langue",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    skip: "Aller au contenu",
    home: "Retour à l’accueil",
    play: "Lancer l’animation",
    pause: "Image fixe",
    image: "Création",
    newTab: "s’ouvre dans un nouvel onglet",
    workCount: "projets",
    back: "Retour au portfolio",
    copy: "Copier votre sélection",
    copied: "Copié",
    copyError: "Copie impossible. Sélectionnez le texte ci-dessous.",
    order: "Commander sur Discord",
    from: "À partir de",
    selected: "Sélection de créations",
    more: "En savoir plus",
    contact: "Contactez-nous",
    quote: "Parlons de votre projet",
    logoAlt: "Logo officiel Sko Design",
    artAlt: "Création originale du portfolio de Sko Designs",
    stars: "5 étoiles sur 5",
  },
  hero: {
    eyebrow: "STUDIO DE DESIGN CRÉATIF",
    line1: "Le design",
    line2: "qui vous",
    accent: "distingue.",
    description:
      "Des graphismes créatifs. Une identité forte. Des visuels soignés pour une marque impossible à ignorer.",
    note: "Pour les créateurs, communautés et marques ambitieuses.",
    visual: "Votre vision. Notre signature.",
    index: "01 / UNE PREMIÈRE IMPRESSION DURABLE",
    scroll: "FAITES DÉFILER POUR DÉCOUVRIR",
  },
  band: [
    "DESIGN GRAPHIQUE",
    "IDENTITÉ NUMÉRIQUE",
    "VISUELS CRÉATIFS",
    "POUR SE DÉMARQUER",
  ],
  work: {
    eyebrow: "01 — NOS CRÉATIONS",
    title: "Laissons parler",
    accent: "les créations.",
    description:
      "D’un logo distinctif à un univers visuel complet. Une sélection de nos créations.",
    pageTitle: "Des créations qui marquent.",
    pageDescription:
      "Identités, visuels et animations. Explorez le portfolio et découvrez chaque création en détail.",
    filters: {
      all: "Tous les projets",
      logos: "Logos",
      banners: "Bannières",
      thumbnails: "Miniatures",
      mockups: "Mockups produits",
      discord: "Visuels Discord",
      motion: "Animations",
      other: "Autres créations",
    },
    empty: "Aucun projet dans cette catégorie pour le moment.",
    detail: "La création originale, dans tous ses détails.",
    motionNote:
      "Les animations ne démarrent que lorsque vous appuyez sur lecture.",
    inquiry: "Et si nous créions cela pour votre marque ?",
  },
  services: {
    eyebrow: "02 — CE QUE NOUS CRÉONS",
    title: "Vos idées.",
    accent: "Un design soigné.",
    description:
      "Une identité singulière, sur chaque plateforme. Du premier logo au dernier pixel.",
    items: [
      [
        "Création de logos",
        "Un logo reconnaissable pour votre marque, votre communauté Discord ou votre serveur FiveM.",
      ],
      [
        "Bannières",
        "Des bannières percutantes pour vos serveurs, réseaux sociaux et boutiques. Pensées pour leur plateforme.",
      ],
      [
        "Visuels produits",
        "Des mockups Tebex pour présenter vos produits numériques de manière claire et professionnelle.",
      ],
      [
        "Miniatures",
        "Des miniatures YouTube à la composition soignée qui attirent le regard.",
      ],
      [
        "Animations",
        "Des animations de logos et de bannières aux mouvements clairs et maîtrisés.",
      ],
      [
        "Émojis Discord",
        "Des émojis personnalisés qui reflètent l’identité et la personnalité de votre serveur.",
      ],
    ],
    cta: "Voir les exemples",
    processTitle: "De votre vision à la création finale.",
    steps: [
      [
        "Partagez votre idée",
        "Présentez votre style, vos envies et vos références sur Discord.",
      ],
      [
        "Définissons le projet",
        "Nous convenons du contenu et du prix final avant le début du projet.",
      ],
      [
        "Donnons vie à votre marque",
        "Votre idée prend forme avec des visuels adaptés à votre marque.",
      ],
    ],
  },
  about: {
    eyebrow: "03 — DERRIÈRE LES PIXELS",
    title: "Une petite équipe.",
    accent: "Une grande attention.",
    description:
      "Sko Designs crée des graphismes et des overlays pour les créateurs, les marques en ligne et les communautés. Une identité forte commence par l’écoute de votre idée.",
    detail:
      "Avec un regard créatif et le souci du détail, nous transformons vos envies en visuels adaptés à votre marque et à sa plateforme. D’une création à l’unité à un pack cohérent.",
    role: "Dirigeant / Propriétaire",
    bio: "Skodax est la force créative de Sko Designs. Il conçoit des graphismes et des overlays en privilégiant la qualité, une identité singulière et le respect de vos attentes.",
    signature: "Votre vision, jusque dans les détails.",
    values: [
      [
        "Votre propre identité",
        "Chaque marque est unique. Vos visuels doivent l’être aussi.",
      ],
      [
        "Les détails font la différence",
        "De la typographie à la composition, chaque élément compte.",
      ],
      [
        "Une création à vos côtés",
        "Vos envies et vos références sont notre point de départ.",
      ],
    ],
  },
  reviews: {
    eyebrow: "04 — LA PAROLE AUX CLIENTS",
    title: "Un beau design compte.",
    accent: "Une belle collaboration aussi.",
    description:
      "Témoignages issus du site existant. Les traductions préservent le sens des avis originaux.",
    source: "Avis client",
    all: "Lire tous les avis",
    items: [
      [
        "CryzZ",
        "Des créations rapides, soignées et professionnelles. Réalisées avec précision, créativité et souci du détail pour faire ressortir votre marque.",
      ],
      [
        "Project Globe",
        "Les créations sont incroyablement soignées et professionnelles. Tout est abouti, bien équilibré et exactement comme je l’imaginais.",
      ],
      [
        "buyvolt.xyz",
        "Rapide et très agréable ! La communication était fluide, le processus rapide et le résultat correspondait exactement à mes attentes.",
      ],
      [
        "Simon",
        "Une référence de confiance pour des miniatures de grande qualité.",
      ],
      [
        "Berry Bengel",
        "Une excellente communication, une livraison rapide et une qualité remarquable. Tout a été géré avec professionnalisme et le résultat était encore meilleur que prévu.",
      ],
      [
        "Yenzotjeuhhh",
        "Une livraison super rapide et des prix vraiment abordables. La qualité est excellente pour le prix payé. Je vous le recommande, les gars.",
      ],
      [
        "Ducky",
        "L’un des designers avec qui il est le plus facile de travailler. Il comprend tout de suite vos attentes, a le souci du détail et transforme les idées en créations uniques et professionnelles. Je reviens toujours ici pour un nouveau design.",
      ],
      [
        "Fasnoo",
        "Encore bien servi, comme toujours. Jamais déçu, il livre exactement ce dont j’ai besoin. Mon designer de référence à chaque fois.",
      ],
      [
        "Jorikkie",
        "Vraiment impressionné par sa créativité et l’originalité de ses créations. Il apporte toujours des idées nouvelles et sait comment faire ressortir un design. Je le recommande sans hésiter.",
      ],
      [
        "Tonic",
        "J’ai fait réaliser mon pack streamer et je suis ravi du résultat. Tout s’accorde parfaitement, le rendu est professionnel et donne une tout autre ambiance à mon stream. Très satisfait !",
      ],
    ],
  },
  pricing: {
    eyebrow: "05 — CLAIR DÈS LE DÉPART",
    title: "Un design fort.",
    accent: "Des tarifs clairs.",
    description:
      "Un pack complet ou la création qu’il vous faut. Choisissez ce qui convient à votre projet.",
    condition: "Tarifs de départ ; prix final convenu ensemble.",
    popular: "Populaire",
    packages: [
      [
        "FiveM",
        "Une identité unique pour votre serveur.",
        [
          "Logo (3 couleurs)",
          "Bannière Discord",
          "Bannière FiveM",
          "Bannière de connexion",
        ],
      ],
      [
        "Discord",
        "Un univers cohérent pour votre communauté.",
        ["Logo", "Bannière de serveur", "Bannière de profil", "5 émojis"],
      ],
      [
        "Streamer",
        "Votre chaîne, dans un style cohérent.",
        ["Logo", "Bannière", "3 overlays", "3 miniatures"],
      ],
    ],
    singles: "Créations à l’unité",
    singleNames: [
      "Logo",
      "Bannière",
      "Animation de logo",
      "Animation de bannière",
      "Miniature",
    ],
    boxes: "Images / Boxes",
    boxUnit: "image / box",
    boxUnits: "images / boxes",
    builder: "Votre pack, vos choix.",
    builderDesc:
      "Choisissez vos créations et lots de visuels. L’estimation se met à jour automatiquement.",
    total: "Total estimé",
    selection: "Votre sélection",
    noSelection: "Sélectionnez une création pour composer votre pack.",
    builderNote:
      "Copiez votre sélection et partagez-la sur Discord. Il s’agit d’une estimation, pas d’une commande.",
    custom: "Une autre idée en tête ?",
    customDesc: "Présentez vos besoins pour un devis personnalisé.",
    copyPrefix: "Mon projet avec Sko Designs",
    copyPrice: "Estimation du tarif de départ",
    faqTitle: "Bon à savoir.",
    faqs: [
      [
        "Comment passer commande ?",
        "Rejoignez notre Discord et indiquez la création ou le pack souhaité. Partagez aussi vos idées et vos références.",
      ],
      [
        "Ces prix sont-ils fixes ?",
        "Ce sont des tarifs de départ. Le prix final est convenu ensemble, selon vos besoins.",
      ],
      [
        "Quand ma création sera-t-elle prête ?",
        "Discutez du calendrier sur Discord avant de commander. Les packs n’ont pas de délai de livraison fixe.",
      ],
      [
        "Puis-je composer mon propre pack ?",
        "Oui. Utilisez le configurateur pour une estimation, puis partagez votre sélection sur Discord.",
      ],
    ],
  },
  contact: {
    eyebrow: "CRÉONS QUELQUE CHOSE ENSEMBLE",
    title: "Vous avez la vision.",
    accent: "Créons le design.",
    description:
      "Parlez-nous de votre projet. Créons ensemble quelque chose qui se démarque.",
    discord: "Démarrez votre projet sur Discord",
    discordDesc:
      "Notre espace pour les idées, les questions et les commandes. Échangez directement avec Sko Designs.",
    button: "Ouvrir Discord",
    hint: "Vous allez être redirigé vers Discord. Aucune demande n’est envoyée depuis ce site.",
    briefTitle: "Un beau projet commence par un bon brief.",
    briefDesc: "Préparez ces éléments pour notre échange :",
    briefs: [
      "Votre marque, chaîne ou communauté",
      "La création ou le pack souhaité",
      "Votre style, vos couleurs et références visuelles",
      "Le calendrier et le budget envisagés",
    ],
    pricingLink: "Découvrir les tarifs d’abord",
    footer: "Une idée mérite un beau design.",
    mini: "Logos, bannières et plus — créés avec soin.",
  },
  footer: {
    description:
      "Un studio créatif pour les marques, créateurs et communautés qui souhaitent se démarquer.",
    navigation: "Découvrir",
    connect: "Parlons-en",
    social: "Communauté Discord",
    copyright: "Tous droits réservés.",
    credit: "Votre vision. Notre design.",
    language: "Ce site dans votre langue",
  },
  privacy: {
    title: "La confidentialité, simplement.",
    intro: "Ce site n’utilise aucun traceur publicitaire ni cookie analytique.",
    sections: [
      [
        "Préférence linguistique",
        "Nous conservons uniquement la langue choisie (nl, en ou fr) dans le stockage local de votre navigateur. Le site pourra ainsi s’ouvrir dans votre langue lors de votre prochaine visite. Vous pouvez supprimer cette préférence dans les paramètres du navigateur.",
      ],
      [
        "Contact via Discord",
        "Les questions et les commandes passent par notre communauté Discord officielle. Ce site ne dispose d’aucun formulaire de contact et n’envoie ni ne conserve de données de projet. Discord traite les données selon sa propre politique de confidentialité.",
      ],
      [
        "Configurateur de pack",
        "Votre sélection et l’estimation restent dans votre navigateur. Le texte est copié dans votre presse-papiers uniquement lorsque vous appuyez sur copier. Vous choisissez ensuite ce que vous partagez sur Discord.",
      ],
      [
        "Questions",
        "Pour toute question sur votre confidentialité ou sur un projet, contactez-nous via Discord.",
      ],
    ],
  },
  notFound: {
    title: "Cette page n’existe pas.",
    text: "Revenez à l’accueil pour découvrir Sko Designs.",
  },
};
export const dictionaries = { nl, en, fr };
export type Dictionary = typeof nl;
