"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setDark((v) => !v)}>
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
