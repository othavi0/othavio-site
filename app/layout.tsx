import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"

import "./globals.css"

import { ConsoleSignature } from "@/components/console-signature"
import { LangProvider } from "@/components/lang-provider"
import { ScrollOrchestrator } from "@/components/scroll-orchestrator"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const description =
  "Terminal-native tools for developers coordinating AI agents, from Waybar telemetry to Rust token-saving CLIs."

export const metadata: Metadata = {
  metadataBase: new URL("https://othavio.com"),
  title: {
    default: "Othavio Quiliao",
    template: "%s · Othavio Quiliao",
  },
  description,
  openGraph: {
    title: "Othavio Quiliao",
    description,
    url: "/",
    siteName: "othavio.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Othavio Quiliao",
    description,
    creator: "@NoctuaCore",
  },
  robots: { index: true, follow: true },
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
