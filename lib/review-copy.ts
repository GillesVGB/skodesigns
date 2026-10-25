import type { Language } from "./content";

export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  body: string;
  language: Language;
  createdAt: number;
};

const nl = {
  title: "Reviews",
  subtitle: "Wat klanten zeggen",
  create: "Schrijf een review",
  emptyTitle: "Jouw ervaring verdient een plek.",
  empty:
    "Er zijn nog geen reviews. Deel als eerste jouw ervaring met Sko Designs.",
  loading: "Reviews worden geladen…",
  loadError: "Reviews konden niet worden geladen.",
  retry: "Opnieuw proberen",
  close: "Sluiten",
  formTitle: "Hoe was jouw ervaring?",
  formDescription:
    "Deel een eerlijke review over je samenwerking met Sko Designs.",
  name: "Jouw naam",
  namePlaceholder: "Naam die bij je review verschijnt",
  rating: "Jouw beoordeling",
  ratingLabel: "Beoordeling kiezen",
  stars: "sterren",
  review: "Jouw review",
  reviewPlaceholder: "Vertel over je ontwerp en de samenwerking…",
  consent:
    "Mijn naam, beoordeling en review mogen openbaar op deze website worden getoond.",
  privacy: "Privacy",
  submit: "Review plaatsen",
  submitting: "Review wordt geplaatst…",
  success: "Bedankt! Je review is opgeslagen en staat nu op de website.",
  publicNote: "Je review en naam zijn openbaar. We vragen geen e-mailadres.",
  fields: {
    name: "Vul een naam van 2 tot 60 tekens in.",
    rating: "Kies een beoordeling van 1 tot 5 sterren.",
    body: "Schrijf een review van 10 tot 1200 tekens.",
    consent: "Geef toestemming om je naam en review openbaar te tonen.",
  },
  errors: {
    invalid: "Controleer de ingevulde gegevens.",
    rateLimited:
      "Je hebt net een review geplaatst. Probeer het over een minuut opnieuw.",
    unavailable: "Je review is niet opgeslagen. Probeer het later opnieuw.",
    forbidden:
      "De review kon niet veilig worden verzonden. Herlaad de pagina en probeer opnieuw.",
    tooLarge: "Je review is te lang. Gebruik maximaal 1200 tekens.",
  },
};
const en: typeof nl = {
  title: "Reviews",
  subtitle: "What clients say",
  create: "Write a review",
  emptyTitle: "Your experience belongs here.",
  empty:
    "There are no reviews yet. Be the first to share your experience with Sko Designs.",
  loading: "Loading reviews…",
  loadError: "Reviews could not be loaded.",
  retry: "Try again",
  close: "Close",
  formTitle: "How was your experience?",
  formDescription: "Share an honest review of working with Sko Designs.",
  name: "Your name",
  namePlaceholder: "The name shown with your review",
  rating: "Your rating",
  ratingLabel: "Choose a rating",
  stars: "stars",
  review: "Your review",
  reviewPlaceholder: "Tell us about your design and the collaboration…",
  consent:
    "My name, rating and review may be displayed publicly on this website.",
  privacy: "Privacy",
  submit: "Post review",
  submitting: "Posting your review…",
  success: "Thank you! Your review has been saved and is now on the website.",
  publicNote:
    "Your review and name are public. We do not ask for an email address.",
  fields: {
    name: "Enter a name between 2 and 60 characters.",
    rating: "Choose a rating from 1 to 5 stars.",
    body: "Write a review between 10 and 1200 characters.",
    consent: "Allow your name and review to be displayed publicly.",
  },
  errors: {
    invalid: "Please check the information you entered.",
    rateLimited: "You just posted a review. Please try again in a minute.",
    unavailable: "Your review has not been saved. Please try again later.",
    forbidden:
      "Your review could not be sent securely. Reload the page and try again.",
    tooLarge: "Your review is too long. Use no more than 1200 characters.",
  },
};
const fr: typeof nl = {
  title: "Avis",
  subtitle: "Ce que disent nos clients",
  create: "Rédiger un avis",
  emptyTitle: "Votre expérience a sa place ici.",
  empty:
    "Aucun avis pour le moment. Partagez votre expérience avec Sko Designs en premier.",
  loading: "Chargement des avis…",
  loadError: "Impossible de charger les avis.",
  retry: "Réessayer",
  close: "Fermer",
  formTitle: "Comment s’est passée votre expérience ?",
  formDescription:
    "Partagez un avis sincère sur votre collaboration avec Sko Designs.",
  name: "Votre nom",
  namePlaceholder: "Le nom affiché avec votre avis",
  rating: "Votre note",
  ratingLabel: "Choisir une note",
  stars: "étoiles",
  review: "Votre avis",
  reviewPlaceholder: "Parlez de votre création et de la collaboration…",
  consent:
    "Mon nom, ma note et mon avis peuvent être affichés publiquement sur ce site.",
  privacy: "Confidentialité",
  submit: "Publier l’avis",
  submitting: "Publication de votre avis…",
  success:
    "Merci ! Votre avis a été enregistré et figure maintenant sur le site.",
  publicNote:
    "Votre nom et votre avis sont publics. Aucune adresse e-mail n’est demandée.",
  fields: {
    name: "Saisissez un nom de 2 à 60 caractères.",
    rating: "Choisissez une note de 1 à 5 étoiles.",
    body: "Rédigez un avis de 10 à 1200 caractères.",
    consent: "Autorisez l’affichage public de votre nom et de votre avis.",
  },
  errors: {
    invalid: "Vérifiez les informations saisies.",
    rateLimited: "Vous venez de publier un avis. Réessayez dans une minute.",
    unavailable: "Votre avis n’a pas été enregistré. Réessayez plus tard.",
    forbidden:
      "L’avis n’a pas pu être envoyé de manière sécurisée. Rechargez la page et réessayez.",
    tooLarge: "Votre avis est trop long. Utilisez 1200 caractères maximum.",
  },
};
export const reviewCopy = { nl, en, fr };
