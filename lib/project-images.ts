export const PROJECT_IMAGE_FALLBACK = "/img/default-project.png";

export const PROJECT_IMAGE_NAMES = ["cover"] as const;

export type ProjectImageName = (typeof PROJECT_IMAGE_NAMES)[number];

const PROJECT_SLUG_ALIASES: Record<string, string> = {
  "arena-chapas": "arena-chapas",
  arenachapas: "arena-chapas",
  arenachpas: "arena-chapas",
  "atlas-estoque": "atlasestoque",
  atlasestoque: "atlasestoque",
  "atlas-reserve": "atlas-reserve",
  eventosthe: "eventos-the",
  "eventos-the": "eventos-the",
  rimpots: "rimpots",
  rrimpots: "rimpots",
};

export function toProjectImageSlug(project: string) {
  const slug = project
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return PROJECT_SLUG_ALIASES[slug] ?? slug;
}

export function getProjectImage(project: string, image: ProjectImageName = "cover") {
  return `/img/projects/${toProjectImageSlug(project)}/${image}.png`;
}
