import { describe, expect, it } from 'vitest'
import { readDocs, splitFrontmatter } from './frontmatter'

// The frontmatter grammar, pinned. A bad anchor regex here once made every
// post title render as its slug — these cases are the incident record.
describe('splitFrontmatter', () => {
  it('splits LF-delimited frontmatter from the body', () => {
    const { frontmatter, body } = splitFrontmatter('---\ntitle: Hello\ncategories:\n  - press\n---\nBody text')
    expect(frontmatter).toEqual({ title: 'Hello', categories: ['press'] })
    expect(body).toBe('Body text')
  })

  it('splits CRLF-delimited frontmatter (Windows-authored files)', () => {
    const { frontmatter, body } = splitFrontmatter('---\r\ntitle: Hello\r\n---\r\nBody')
    expect(frontmatter.title).toBe('Hello')
    expect(body).toBe('Body')
  })

  it('treats a file without frontmatter as all body', () => {
    const { frontmatter, body } = splitFrontmatter('Just some AsciiDoc')
    expect(frontmatter).toEqual({})
    expect(body).toBe('Just some AsciiDoc')
  })

  it('does not strip a mid-document delimiter', () => {
    const { body } = splitFrontmatter('---\ntitle: T\n---\na\n---\nb')
    expect(body).toBe('a\n---\nb')
  })

  it('survives empty frontmatter', () => {
    const { frontmatter, body } = splitFrontmatter('---\n---\nbody')
    expect(frontmatter).toEqual({})
    expect(body).toBe('body')
  })
})

describe('readDocs', () => {
  it('maps glob keys through idOf and splits frontmatter', () => {
    const files = {
      '../content/posts/2013-10-07-a-post.adoc': '---\ntitle: A\n---\nbody-a',
      '../content/posts/2013-10-08-b-post.adoc': 'no frontmatter here',
    }
    const docs = readDocs(files, (key) => key.split('/').pop()!.replace(/\.adoc$/, ''))
    expect(docs).toEqual([
      { id: '2013-10-07-a-post', frontmatter: { title: 'A' }, body: 'body-a' },
      { id: '2013-10-08-b-post', frontmatter: {}, body: 'no frontmatter here' },
    ])
  })
})
