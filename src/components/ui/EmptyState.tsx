import { ReactNode } from "react";

export default function EmptyState({ icon = "⬖", title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="well" aria-hidden="true">{icon}</div>
      <div className="t">{title}</div>
      <div className="d">{description}</div>
      {action}
    </div>
  );
}
