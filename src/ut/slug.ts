export function slug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\-_ ]+/gu, "")
    .replace(/\s/gu, "-")
    .replace(/_/g, "-")
    .replace(/\-+/g, "-")
    .replace(/\-$/g, "")
    .replace(/^\-/g, "")
}
