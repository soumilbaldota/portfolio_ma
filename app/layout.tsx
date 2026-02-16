import type { Metadata } from "next";
import "./globals.css";
import { AccentColorProvider } from "./AccentColorContext";

export const metadata: Metadata = {
  title: "Soumil Baldota",
  description: "Portfolio for Soumil Baldota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AccentColorProvider>
          {children}
        </AccentColorProvider>
      </body>
    </html>
  );
}
