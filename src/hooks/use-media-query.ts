import { useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );

/** Below 768px the board switches to the tabbed mobile layout */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
