// app/utils/slugify.ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_') // replace non-alphanumeric with underscores
    .replace(/^_+|_+$/g, '');     // remove leading/trailing underscores
}