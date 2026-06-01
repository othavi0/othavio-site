export const siteUrl = "https://othavio.com"

export const siteName = "Othavio Quiliao"

export const siteAliases = ["Othavio", "Othavio Quiliao", "Quiliao"] as const

export const siteDescription =
  "Othavio Quiliao: Terminal-native tools for developers coordinating AI agents, from Waybar telemetry to Rust token-saving CLIs."

export const sitePersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  alternateName: ["Othavio", "Quiliao"],
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  description: siteDescription,
  sameAs: [
    "https://github.com/othavioquiliao",
    "https://www.linkedin.com/in/othavioquiliao/",
    "https://x.com/NoctuaCore",
  ],
  knowsAbout: [
    "AI agents",
    "developer tools",
    "terminal user interfaces",
    "Rust CLI",
    "Next.js",
  ],
} as const
