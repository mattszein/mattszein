"use client";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/neovim/Tree"
import { Suspense } from 'react'

function ShortcutsLoader() {
  const [toggle] = useToggleTree()
  useHotkeys("space+e", () => toggle());
  return <></>
}

const Shortcuts = () => {
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
