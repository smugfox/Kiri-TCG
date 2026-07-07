"use client";

import { ReactNode, useRef } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ReactNode;
  /** Destructive confirmations set this false: scrim clicks don't close them. */
  dismissable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="overlay-scrim" onClick={dismissable ? onClose : undefined}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref} onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{children}</p>
        <div className="actions">{actions}</div>
      </div>
    </div>
  );
}
