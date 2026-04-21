"use client"
import clsx from "clsx";
import { useStore } from "@/app/lib/store/provider";
import { useShallow } from "zustand/react/shallow";
import { WindowFocusType } from '@/app/lib/store/slices/window';

const Window = ({
  children,
  name
}: Readonly<{
  children: React.ReactNode;
  name: WindowFocusType;
}>) => {
  const [windowFocus] = useStore(
    useShallow((state) => [state.windowFocus]),
  );
  return (
    <div className={clsx("flex flex-col flex-1 overflow-hidden snap-align-none rounded-lg m-1  border-2", windowFocus === name ? "border-sky-500" : "border-gray-500")}>
      {children}
    </div>
  );
}

export default Window;
