"use client";

import * as React from "react";
import { useUiStore } from "@/stores/ui-store";

export function useKeyboardShortcuts() {
  const toggleCommand = useUiStore((state) => state.toggleCommand);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCommand = event.metaKey || event.ctrlKey;

      if (isCommand && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommand();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleCommand]);
}
