type WordmarkProps = {
  lines: [string, string]
  marginalia: [string, string]
}

export function Wordmark({ lines, marginalia }: WordmarkProps) {
  return (
    <h1 className="reveal-up flex flex-col">
      <Line text={lines[0]} marginalia={marginalia[0]} />
      <Line text={lines[1]} marginalia={marginalia[1]} />
    </h1>
  )
}

function Line({ text, marginalia }: { text: string; marginalia: string }) {
  return (
    <span className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
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
      <span
        aria-hidden
        className="text-muted-foreground"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
        }}
      >
        {marginalia}
      </span>
    </span>
  )
}
