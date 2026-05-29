const SIGNATURE = [
  "/* othavio quiliao */",
  "/* curitiba, br · 2026 */",
  "/* github.com/othavioquiliao */",
]

const script = `try{var l=${JSON.stringify(SIGNATURE)};for(var i=0;i<l.length;i++)console.log(l[i])}catch(e){}`

export function ConsoleSignature() {
  return (
    <script
      // Inline, runs once on first paint. Dev-only audience; speaks the same
      // `/* */` grammar the section labels use. No interaction, no styling.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  )
}
