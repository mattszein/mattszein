"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { LinkList } from "@/app/ui/link_list";
import { Suspense } from 'react'

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
  }, [pathname, searchParams]);

  return <></>
}

const NavigationEvents = () => {
  return <Suspense><Navigation /></Suspense>;
};

export default NavigationEvents;
