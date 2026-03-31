"use client";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/utils/hooks/TreeHook"
import { Suspense, useEffect } from 'react'
import { WINDOW_APPS } from '@/app/lib/stores/slices/Window';
import { moveRight, moveLeft, moveWordBackward, moveWordForward, moveToFirstChar, moveToLastChar, moveToFirstTextNode, moveToLastTextNode, moveUp, moveDown } from "./cursor";
import { useWindow } from '@/app/ui/utils/hooks/window'

function ShortcutsLoader() {
  const [isTree, toggle] = useToggleTree();
  const [, , checkFocus] = useWindow();
  const treeEnabled = () => !isTree && !!checkFocus(WINDOW_APPS.NVIM);
  useHotkeys("space+e", () => toggle(), { enabled: !!checkFocus(WINDOW_APPS.NVIM) });
  useHotkeys(['l', 'ArrowRight'], moveRight, { enabled: treeEnabled() });
  useHotkeys(['h', 'ArrowLeft'], moveLeft, { enabled: treeEnabled() });
  useHotkeys(['k', 'ArrowUp'], moveUp, { enabled: treeEnabled() });    // Vim up
  useHotkeys(['j', 'ArrowDown'], moveDown, { enabled: treeEnabled() });  // Vim down
  useHotkeys('w', moveWordForward, { enabled: treeEnabled() });
  useHotkeys('b', moveWordBackward, { enabled: treeEnabled() });
  useHotkeys('0', moveToFirstChar, { enabled: treeEnabled() });
  useHotkeys('shift+4', moveToLastChar, { enabled: treeEnabled() }); // $ key
  useHotkeys('g', moveToFirstTextNode, { enabled: treeEnabled() });  // Double g
  useHotkeys('shift+g', moveToLastTextNode, { enabled: treeEnabled() }); // G key
  // useHotkeys('shift+j', () => setWindowFocus(WINDOW_APPS.TERMINAL));
  // useHotkeys('shift+k', () => setWindowFocus(WINDOW_APPS.NVIM));
  return <></>
}

const Shortcuts = () => {
  useEffect(() => {
    window.addEventListener('keydown', function (e) {
      if (e.key == ' ' || e.key == 'ArrowDown' || e.key == 'ArrowRight' || e.key == 'ArrowUp' || e.key == 'ArrowLeft' && e.target == document.body) {
        e.preventDefault();
      }
    });

  }, [])
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
