"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/90 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md">
      {message}
    </div>
  );
}
