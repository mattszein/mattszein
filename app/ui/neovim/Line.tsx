'use client'
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";

const Line = () => {
  const [lines] = useStore(
    useShallow((state) => [state.contentLines]))
  const items = (lines: number) => Array.from({ length: lines }, (_, index) => (
    <p key={index}>{index + 1}</p>
  ));

  return <div className="h-full text-right  snap-align-none">
    {lines ? items(lines) : null}
  </div>
}

export default Line
