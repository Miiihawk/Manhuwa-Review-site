"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 2200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!mounted) return null;

  // Portal to <body> so the fixed toast is positioned against the viewport,
  // not against any transformed/backdrop-filtered ancestor (e.g. the login card).
  return createPortal(
    <div className="fixed top-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/10 bg-black/90 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md">
      {message}
    </div>,
    document.body,
  );
}
