// One frontmatter reader for every content collection. The grammar of a
// migrated Jekyll file — optional `---` YAML block, then body — lives here
// and nowhere else; collection modules keep only their typed projections.
// (The \A-regex incident of 2026-08-30 had to be fixed in three separate
// copies of this logic: keep it single-sourced.)
import { parse as parseYaml } from 'yaml'

export interface ContentDoc {
  /** file basename without extension (or permalink override from the caller) */
  id: string
  frontmatter: Record<string, any>
  body: string
}

const FM_RE = /^---\r?\n(?:([\s\S]*?)\r?\n)?---\r?\n?/

export const splitFrontmatter = (raw: string): Pick<ContentDoc, 'frontmatter' | 'body'> => {
  const match = raw.match(FM_RE)
  return {
    frontmatter: match ? (parseYaml(match[1] ?? '') ?? {}) : {},
    body: match ? raw.slice(match[0].length) : raw,
  }
}

/** Glob maps must be built by the caller (literal patterns, `?raw` query). */
export const readDocs = (
  files: Record<string, string>,
  idOf: (key: string) => string,
): ContentDoc[] =>
  Object.entries(files).map(([key, raw]) => ({
    id: idOf(key),
    ...splitFrontmatter(raw),
  }))
