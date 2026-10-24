import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'
import wireIndex from '@riboseinc/wire'
import sitesYaml from '@riboseinc/wire/sites?raw'
import { LocalWireReader } from './wire'

describe('wire package data', () => {
  it('loads the published full index', () => {
    expect(Array.isArray(wireIndex.articles)).toBe(true)
  })

  it('inlines a body for every published article', () => {
    const reader = new LocalWireReader()
    for (const entry of reader.index()) {
      expect(reader.article(entry).bodyAdoc).toBeTruthy()
    }
  })

  it('parses the sites registry; spoke feeds are https', () => {
    const sites = (parseYaml(sitesYaml) as { sites: { id: string; newsml?: string }[] }).sites
    expect(sites.length).toBeGreaterThan(3)
    for (const site of sites) {
      if (site.newsml) expect(site.newsml).toMatch(/^https:/)
    }
  })
})
