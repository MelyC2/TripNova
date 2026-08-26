import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/Navbar";


export const metadata: Metadata = {
  title: "DevPort - Portal de empleos tech",
  description: "Encuentra proyectos y empleos tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
    >
      <body className="bg-slate-950 text-white min-h-screen">
        <Navbar />
        <main>{children} </main>
      </body>
    </html>
  );
}
