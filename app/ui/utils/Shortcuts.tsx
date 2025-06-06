"use client";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/neovim/Tree"
import { Suspense } from 'react'
import { moveRight, moveLeft, moveWordBackward, moveWordForward } from "./Cursor";

function ShortcutsLoader() {
  const [toggle] = useToggleTree()
  useHotkeys("space+e", () => toggle());
  useHotkeys('l', moveRight);
  useHotkeys('h', moveLeft);
  useHotkeys('w', moveWordForward);
  useHotkeys('b', moveWordBackward);
  return <></>
}

const Shortcuts = () => {
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
