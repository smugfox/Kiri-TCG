import { ReactNode } from "react";
import { WalletCards } from "lucide-react";

/** empty-state (design.md § Components): tinted icon well with a 24px
 * Lucide icon in accent, serif title, muted line, one action. */
export default function EmptyState({
  icon = <WalletCards size={24} strokeWidth={2} />,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="well" aria-hidden="true">{icon}</div>
      <div className="t">{title}</div>
      <div className="d">{description}</div>
      {action}
    </div>
  );
}
