import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce, sectionOf } from './searchCore'

describe('sectionOf', () => {
  it('labels top-level pages Home', () => {
    expect(sectionOf('/')).toBe('Home')
  })

  it('labels each primary section', () => {
    expect(sectionOf('/platforms/metanorma')).toBe('Platform')
    expect(sectionOf('/technologies/rnp')).toBe('Technology')
    expect(sectionOf('/news/2026-01-01-x/')).toBe('News')
    expect(sectionOf('/security/advisories/x')).toBe('Security')
  })

  it('falls back to Page for unknown sections', () => {
    expect(sectionOf('/mystery/deep/path')).toBe('Page')
  })
})

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('coalesces bursts into one call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced(); debounced(); debounced()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
