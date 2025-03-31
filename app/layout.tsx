import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Terminal from "./ui/Terminal";

const cousineFont = localFont({
  src: "./fonts/Cousine-Regular.woff",
  variable: "--font-cousine-regular",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Matt Szein Website",
  description: "Personal website of Matias Szeinfeld",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cousineFont.variable} antialiased`}>
        <Terminal>{children}</Terminal>
      </body>
    </html>
  );
}
