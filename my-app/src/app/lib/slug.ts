// Used when auto-generating a slug FROM the title.
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // drop invalid characters
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, ""); // trim edge hyphens
}

// Used when the admin TYPES in the slug box directly.
export function normalizeSlugInput(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
