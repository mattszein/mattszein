"use client"

import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";

export const useToggleTree = (): [boolean, () => void] => {
  const [isTree, setIsTree] = useStore(
    useShallow((state) => [state.isNeovimTree, state.setIsNeovimTree]),
  );
  const closeTree = () => {
    document.getElementById("tree")!.classList.add("hidden");
    setIsTree(false);
  };

  const openTree = () => {
    document.getElementById("tree")!.classList.remove("hidden");
    setIsTree(true);
  };

  const toggle = () => isTree ? closeTree() : openTree();
  ;

  return [isTree, toggle]
};
