// src/hooks/useDarkMode.ts
import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    return (
      localStorage.theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [enabled]);

  return [enabled, setEnabled] as const;
};
