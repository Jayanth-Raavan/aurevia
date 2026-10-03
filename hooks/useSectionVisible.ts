"use client";

import { RefObject, useEffect, useState } from "react";

export function useSectionVisible(ref: RefObject<HTMLElement | null>, initial = false) {
  const [visible, setVisible] = useState(initial);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100% 0px 100% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}
