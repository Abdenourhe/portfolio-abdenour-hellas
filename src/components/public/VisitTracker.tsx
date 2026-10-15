"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("visit_tracked")) return;
      sessionStorage.setItem("visit_tracked", "1");
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "visit" }),
      }).catch(() => {});
    } catch {
      // sessionStorage indisponible
    }
  }, []);

  return null;
}
