export type AsciiMark = {
  id: string
  symbol: string
  x: number
  y: number
  depth: number
  opacity: number
  rotate: number
  delay: number
}

type GenerateAsciiMarksOptions = {
  count: number
  seed: number
}

const ASCII_SYMBOLS = ["#", "[]", "{}", "/", "+", "*", "<>", "//", "()"]

function createRandom(seed: number) {
  let value = seed || 1

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function round(value: number, precision = 3) {
  const factor = 10 ** precision

  return Math.round(value * factor) / factor
}

export function generateAsciiMarks({ count, seed }: GenerateAsciiMarksOptions) {
  const random = createRandom(seed)

  return Array.from({ length: count }, (_, index): AsciiMark => {
    const symbolIndex =
      (index + Math.floor(random() * ASCII_SYMBOLS.length)) %
      ASCII_SYMBOLS.length
    const depth = 0.35 + random() * 0.65

    return {
      id: `ascii-${seed}-${index}`,
      symbol: ASCII_SYMBOLS[symbolIndex],
      x: round(random() * 100),
      y: round(random() * 100),
      depth: round(depth),
      opacity: round(0.08 + random() * 0.2),
      rotate: round(-18 + random() * 36),
      delay: round(random() * 5),
    }
  })
}
