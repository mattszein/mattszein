"use client";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/neovim/Tree"
import { Suspense } from 'react'
import { moveRight, moveLeft, moveWordBackward, moveWordForward, moveToFirstChar, moveToLastChar, moveToFirstTextNode, moveToLastTextNode } from "./Cursor";

function ShortcutsLoader() {
  const [toggle] = useToggleTree()
  useHotkeys("space+e", () => toggle());
  useHotkeys('l', moveRight);
  useHotkeys('h', moveLeft);
  useHotkeys('w', moveWordForward);
  useHotkeys('b', moveWordBackward);
  useHotkeys('0', moveToFirstChar);
  useHotkeys('shift+4', moveToLastChar); // $ key
  useHotkeys('g', moveToFirstTextNode);  // Double g
  useHotkeys('shift+g', moveToLastTextNode); // G key
  return <></>
}

const Shortcuts = () => {
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
