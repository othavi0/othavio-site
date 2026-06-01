import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"

import "./globals.css"

import { ConsoleSignature } from "@/components/console-signature"
import { LangProvider } from "@/components/lang-provider"
import { ScrollOrchestrator } from "@/components/scroll-orchestrator"
import { ThemeProvider } from "@/components/theme-provider"
import {
  siteAliases,
  siteDescription,
  siteName,
  sitePersonJsonLd,
  siteUrl,
} from "@/lib/site-metadata"
import { cn } from "@/lib/utils"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    ...siteAliases,
    "Noctua Core",
    "agent-bar",
    "AI agents",
    "developer tools",
    "terminal tools",
    "Rust CLI",
    "Waybar",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    creator: "@NoctuaCore",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        alt: siteName,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(geistMono.variable)}>
      <head>
        <ConsoleSignature />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitePersonJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LangProvider>
            <ScrollOrchestrator />
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
