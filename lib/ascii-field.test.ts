import { describe, expect, test } from "bun:test"

import { generateAsciiMarks } from "./ascii-field"

describe("generateAsciiMarks", () => {
  test("returns deterministic marks for the same seed", () => {
    const first = generateAsciiMarks({ count: 8, seed: 42 })
    const second = generateAsciiMarks({ count: 8, seed: 42 })

    expect(second).toEqual(first)
  })

  test("keeps coordinates and animation values inside useful bounds", () => {
    const marks = generateAsciiMarks({ count: 24, seed: 7 })

    for (const mark of marks) {
      expect(mark.x).toBeGreaterThanOrEqual(0)
      expect(mark.x).toBeLessThanOrEqual(100)
      expect(mark.y).toBeGreaterThanOrEqual(0)
      expect(mark.y).toBeLessThanOrEqual(100)
      expect(mark.depth).toBeGreaterThanOrEqual(0.35)
      expect(mark.depth).toBeLessThanOrEqual(1)
      expect(mark.opacity).toBeGreaterThanOrEqual(0.08)
      expect(mark.opacity).toBeLessThanOrEqual(0.28)
    }
  })

  test("cycles through ASCII symbols instead of repeating one glyph", () => {
    const marks = generateAsciiMarks({ count: 18, seed: 11 })
    const uniqueSymbols = new Set(marks.map((mark) => mark.symbol))

    expect(uniqueSymbols.size).toBeGreaterThan(4)
  })
})
