type WordmarkProps = {
  lines: [string, string]
}

export function Wordmark({ lines }: WordmarkProps) {
  return (
    <h1 className="reveal-up flex flex-col">
      <Line text={lines[0]} />
      <Line text={lines[1]} />
    </h1>
  )
}

function Line({ text }: { text: string }) {
  return (
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
  )
}
