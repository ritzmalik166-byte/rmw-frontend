"use client";

import { useEffect } from "react";
import { onFirstInteraction } from "@/lib/onFirstInteraction";

export default function GoogleAnalytics({ id }) {
  useEffect(
    () =>
      onFirstInteraction(() => {
        if (window.gtag) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", id);

        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        script.async = true;
        document.head.appendChild(script);
      }),
    [id]
  );

  return null;
}
