"use client";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/neovim/Tree"
import { Suspense, useEffect } from 'react'
import { moveRight, moveLeft, moveWordBackward, moveWordForward, moveToFirstChar, moveToLastChar, moveToFirstTextNode, moveToLastTextNode, moveUp, moveDown } from "./Cursor";

function ShortcutsLoader() {
  const [isTree, toggle] = useToggleTree()
  useHotkeys("space+e", () => toggle());
  useHotkeys('l', moveRight, { enabled: !isTree });
  useHotkeys('h', moveLeft, { enabled: !isTree });
  useHotkeys('k', moveUp, { enabled: !isTree });    // Vim up
  useHotkeys('j', moveDown, { enabled: !isTree });  // Vim down
  useHotkeys('w', moveWordForward, { enabled: !isTree });
  useHotkeys('b', moveWordBackward, { enabled: !isTree });
  useHotkeys('0', moveToFirstChar, { enabled: !isTree });
  useHotkeys('shift+4', moveToLastChar, { enabled: !isTree }); // $ key
  useHotkeys('g', moveToFirstTextNode, { enabled: !isTree });  // Double g
  useHotkeys('shift+g', moveToLastTextNode, { enabled: !isTree }); // G key
  return <></>
}

const Shortcuts = () => {
  useEffect(() => {
    window.addEventListener('keydown', function (e) {
      if (e.key == ' ' && e.target == document.body) {
        e.preventDefault();
      }
    });

  }, [])
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
