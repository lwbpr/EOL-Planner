import type { Metadata } from "next";
import { Montserrat, Newsreader } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Directorio de Final de Vida | AMORir",
  description:
    "Directorio integrado de recursos de final de vida en Puerto Rico, con doulas, hospicios y servicios fúnebres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
