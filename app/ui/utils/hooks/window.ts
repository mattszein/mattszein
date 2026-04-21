"use client"

import { useStore } from "@/app/lib/store/provider";
import { useShallow } from "zustand/react/shallow";
import { WindowFocusType } from '@/app/lib/store/slices/window';

export const useWindow = (): [WindowFocusType, (focus: WindowFocusType) => void, (focus: WindowFocusType) => boolean] => {
  const [windowFocus, setWindowFocus] = useStore(
    useShallow((state) => [state.windowFocus, state.setWindowFocus]),
  );
  const checkFocus = (focus: WindowFocusType): boolean => {
    return windowFocus === focus;
  }

  return [windowFocus, setWindowFocus, checkFocus]
};
