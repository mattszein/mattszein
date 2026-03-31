"use client"

import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { WindowFocusType } from '@/app/lib/stores/slices/Window';

export const useWindow = (): [WindowFocusType, (focus: WindowFocusType) => void, (focus: WindowFocusType) => Boolean] => {
  const [windowFocus, setWindowFocus] = useStore(
    useShallow((state) => [state.windowFocus, state.setWindowFocus]),
  );
  const checkFocus = (focus: WindowFocusType): Boolean => {
    return windowFocus === focus;
  }

  return [windowFocus, setWindowFocus, checkFocus]
};
