import { CSSProperties } from "react";

export default function Skeleton({ width, height = 12, radius, className = "" }: { width: number | string; height?: number | string; radius?: number; className?: string }) {
  const style: CSSProperties = { width, height, display: "block" };
  if (radius !== undefined) style.borderRadius = radius;
  return <span className={`skel ${className}`} style={style} aria-hidden="true" />;
}
