type WordmarkProps = {
  lines: [string, string]
}

export function Wordmark({ lines }: WordmarkProps) {
  return (
    <h1 className="parallax-wordmark flex flex-col">
      <Line text={lines[0]} delayMs={0} />
      <Line text={lines[1]} delayMs={140} />
    </h1>
  )
}

function Line({ text, delayMs }: { text: string; delayMs: number }) {
  return (
    <span className="wordmark-line" style={{ animationDelay: `${delayMs}ms` }}>
      <span className="flex items-end">
        <span
          className="font-extrabold text-foreground"
          style={{
            fontSize: "clamp(4rem, 14vw, 11rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.82,
          }}
        >
          {text}
        </span>
      </span>
    </span>
  )
}
