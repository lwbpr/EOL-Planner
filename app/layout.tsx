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
  title: "Coordinador de Final de Vida",
  description:
    "Orientador digital para Puerto Rico con rutas guiadas, pasos prácticos y recursos contextualizados para momentos de final de vida.",
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
