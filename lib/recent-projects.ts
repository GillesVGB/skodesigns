/** Recent client artwork supplied by the user; original dimensions preserved. */
type RecentProject = {
  id: string;
  title: string;
  category: "logos" | "thumbnails" | "discord" | "banners" | "other";
  image: string;
  animation?: string;
  width: number;
  height: number;
  featured: boolean;
};

export const recentProjects: RecentProject[] = [
  {
    id: "recent-01",
    title: "Voltrix Development",
    category: "logos",
    image: "recent-01.webp",
    width: 1536,
    height: 676,
    featured: true,
  },
  {
    id: "recent-02",
    title: "Xeno",
    category: "thumbnails",
    image: "recent-02.webp",
    width: 1280,
    height: 720,
    featured: true,
  },
  {
    id: "recent-03",
    title: "Voltrix — Character",
    category: "discord",
    image: "recent-03.webp",
    width: 820,
    height: 724,
    featured: false,
  },
  {
    id: "recent-04",
    title: "Voltrix — Banner",
    category: "banners",
    image: "recent-04.webp",
    width: 1584,
    height: 396,
    featured: false,
  },
  {
    id: "recent-05",
    title: "Ocean Roleplay",
    category: "logos",
    image: "recent-05.webp",
    width: 1024,
    height: 1024,
    featured: true,
  },
  {
    id: "recent-06",
    title: "Centraal Roleplay",
    category: "banners",
    image: "recent-06.webp",
    width: 1280,
    height: 720,
    featured: true,
  },
  {
    id: "recent-07",
    title: "Eerste Stream",
    category: "thumbnails",
    image: "recent-07.webp",
    width: 1280,
    height: 720,
    featured: false,
  },
  {
    id: "recent-08",
    title: "Automotive Visual",
    category: "other",
    image: "recent-08.webp",
    width: 1280,
    height: 720,
    featured: true,
  },
  {
    id: "recent-09",
    title: "Axis Roleplay",
    category: "banners",
    image: "recent-09.webp",
    width: 1280,
    height: 720,
    featured: true,
  },
];
