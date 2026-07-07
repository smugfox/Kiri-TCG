"use client";

import { ReactNode, useState } from "react";

export default function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tip-wrap"
      style={{ marginTop: 0 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {open && <span className="tip" role="tooltip">{text}</span>}
      {children}
    </span>
  );
}
