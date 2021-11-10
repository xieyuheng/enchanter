export function slug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\- ]+/gu, "")
    .replace(/\s/gu, "-")
    .replace(/\-+/g, "-")
    .replace(/\-$/g, "")
    .replace(/^\-/g, "")
}
