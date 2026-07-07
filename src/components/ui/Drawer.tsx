"use client";

import { ReactNode, useRef } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function Drawer({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="overlay-scrim drawer-scrim" onClick={onClose}>
      <div className="drawer app-drawer" role="dialog" aria-modal="true" aria-label={title} ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="dh">
          <span className="t">{title}</span>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
        {actions && <div className="factions">{actions}</div>}
      </div>
    </div>
  );
}
