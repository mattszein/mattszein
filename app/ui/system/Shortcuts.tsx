"use client";
import { useHotkeys } from "react-hotkeys-hook";
import { useToggleTree } from "@/app/ui/utils/hooks/useTree"
import { Suspense, useEffect } from 'react'
import { WINDOW_APPS } from '@/app/lib/store/slices/window';
import { moveRight, moveLeft, moveWordBackward, moveWordForward, moveToFirstChar, moveToLastChar, moveToFirstTextNode, moveToLastTextNode, moveUp, moveDown } from "@/app/lib/cursor-engine";
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

const NAV_KEYS = new Set([' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']);

const Shortcuts = () => {
  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (NAV_KEYS.has(e.key) && e.target === document.body) {
        e.preventDefault();
      }
    });
  }, [])
  return <Suspense><ShortcutsLoader /></Suspense>
};

export default Shortcuts;
