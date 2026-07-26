import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Soumil Baldota — Systems & Kernel Engineer",
  description:
    "The journey of Soumil Baldota — from a Mars-rover CV system and CERN, to on-device ML at Samsung, industrial infra at Maximl, kernel research at Columbia, and per-cgroup eBPF accounting on Cloudflare's edge.",
  openGraph: {
    title: "Soumil Baldota — Systems & Kernel Engineer",
    description:
      "A scrollable journey through the work: Mars rover, CERN, Samsung, Maximl, Columbia, Cloudflare.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light');}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
