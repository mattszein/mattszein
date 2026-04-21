"use client"
import clsx from "clsx";
import { useStore } from "@/app/lib/store/provider";
import { useShallow } from "zustand/react/shallow";
import { WindowFocusType } from '@/app/lib/store/slices/window';

const Window = ({
  children,
  name,
  workspace
}: Readonly<{
  children: React.ReactNode;
  name: WindowFocusType;
  workspace: number;
}>) => {
  const [windowFocus, activeWorkspace] = useStore(
    useShallow((state) => [state.windowFocus, state.activeWorkspace]),
  );
  const isActive = activeWorkspace === workspace;
  return (
    <div className={clsx(
      "flex flex-col flex-1 overflow-hidden snap-align-none rounded-lg m-1 border-2",
      windowFocus === name ? "border-sky-500" : "border-gray-500",
      !isActive && "hidden"
    )}>
      {children}
    </div>
  );
}

export default Window;
