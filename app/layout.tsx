import type { Metadata } from "next";
import localFont from "next/font/local";
import './globals.css'
import { AppStoreProvider } from "@/app/ui/stores/AppStoreProvider";
import Window from "@/app/ui/Window";
import Neovim from "@/app/ui/neovim/Neovim";
import NavigationEvents from "@/app/ui/utils/NavigationEvents"
import Shortcuts from "./ui/utils/Shortcuts";
import WindowOS from "./ui/OS/WindowOS";
import BarOS from "./ui/OS/BarOS";
import { WINDOW_APPS } from '@/app/lib/stores/slices/Window';

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
      <AppStoreProvider>
        <body className={`${cousineFont.variable} antialiased`}>
          <NavigationEvents />
          <Shortcuts />
          <WindowOS>
            <BarOS />
            <Window name={WINDOW_APPS.NVIM}><Neovim>{children}</Neovim></Window>
          </WindowOS>
        </body>
      </AppStoreProvider>
    </html>
  );
}
