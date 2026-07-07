import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Portfolio" };

/** Placeholder: the real dashboard (hero, holdings, P&L) arrives in Phase 2. */
export default function PortfolioPage() {
  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", padding: "var(--space-9) var(--space-5)" }}>
      <EmptyState
        title="No cards in your portfolio yet"
        description="Card search and the portfolio dashboard arrive in Phase 1 and 2 of the build. You're signed in and ready."
      />
    </div>
  );
}
