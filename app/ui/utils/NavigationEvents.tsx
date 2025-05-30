"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { LinkList } from "@/app/ui/link_list";
import { Suspense } from 'react'
import { wrapFirstLetter } from "./Cursor";

function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [setNeovimTreeLink] = useStore(
    useShallow((state) => [state.setNeovimTreeLink]),
  );

  useEffect(() => {
    // init neovimTree index
    const navTreeIndex = LinkList.findIndex((link) => {
      return link.href === pathname;
    })
    setNeovimTreeLink(navTreeIndex)

    console.log("this is executed")
    wrapFirstLetter();
  }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return <></>
}

const NavigationEvents = () => {
  return <Suspense><Navigation /></Suspense>;
};

export default NavigationEvents;
