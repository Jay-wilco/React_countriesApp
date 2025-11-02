"use client";
import { useState, useEffect } from "react";

export function useScrollPosition(threshold = 300) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;

      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  if (!isMounted) return false;

  return isVisible;
}
