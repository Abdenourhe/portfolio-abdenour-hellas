export const DEFAULT_SECTIONS_ORDER = [
  "stats",
  "experience",
  "education",
  "skills",
  "projects",
  "testimonials",
  "blog",
];

export const DEFAULT_SECTIONS_VISIBILITY: Record<string, boolean> = {
  stats: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  testimonials: true,
  blog: true,
};

export const DEFAULT_VISIBLE_STATS = ["years_exp", "projects", "education", "skills"];

export function getDefaultHomepageSettings() {
  return {
    id: "1",
    sectionsOrder: DEFAULT_SECTIONS_ORDER,
    sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
    visibleStatsTypes: DEFAULT_VISIBLE_STATS,
    featuredProjectIds: [],
    typewriterPhrasesFr: [],
    typewriterPhrasesEn: [],
    typewriterPhrasesAr: [],
    heroTitle: null,
    heroTitleEn: null,
    heroTitleAr: null,
    heroSubtitle: null,
    heroSubtitleEn: null,
    heroSubtitleAr: null,
    updatedAt: new Date(),
  };
}
