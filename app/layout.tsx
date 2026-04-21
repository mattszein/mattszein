import type { Metadata } from "next";
import localFont from "next/font/local";
import './globals.css'
import { AppStoreProvider } from "@/app/lib/store/provider";
import Window from "@/app/ui/Window";
import Neovim from "@/app/ui/neovim/Neovim";
import Terminal from "@/app/ui/apps/terminal/Terminal";
import NavigationEvents from "@/app/ui/system/NavigationEvents"
import Shortcuts from "@/app/ui/system/Shortcuts";
import WindowOS from "./ui/os/WindowOS";
import BarOS from "./ui/os/BarOS";
import { WINDOW_APPS } from '@/app/lib/store/slices/window';

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
        <AppStoreProvider>
          <NavigationEvents />
          <Shortcuts />
          <WindowOS>
            <BarOS />
            <Window name={WINDOW_APPS.NVIM} workspace={1}><Neovim>{children}</Neovim></Window>
            <Window name={WINDOW_APPS.TERMINAL} workspace={2}><Terminal /></Window>
          </WindowOS>
        </AppStoreProvider>
      </body>
    </html>
  );
}
