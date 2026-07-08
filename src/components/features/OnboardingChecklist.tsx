"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "@/components/ui/Button";

type Step = { label: string; done: boolean };

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** onboarding-checklist card: progress toward the magic moment, dismissable
 * once complete (design.md § Components). State lives on the user doc. */
export default function OnboardingChecklist({
  cardCount,
  alertCount = 0,
}: {
  cardCount: number;
  alertCount?: number;
}) {
  const dismiss = useMutation(api.users.dismissOnboarding);
  const steps: Step[] = [
    { label: "Create your account", done: true },
    { label: "Add your first card", done: cardCount >= 1 },
    { label: "Set a price alert", done: alertCount >= 1 },
    { label: "Add ten cards", done: cardCount >= 10 },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const nextIndex = steps.findIndex((s) => !s.done);
  const complete = doneCount === steps.length;

  return (
    <div className="obc">
      <div className="ot">
        Get set up <span className="oc">{doneCount} of {steps.length}</span>
      </div>
      <div className="prog">
        <div className="track" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={steps.length}>
          <div className="fill" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
        </div>
      </div>
      {steps.map((step, i) => (
        <div key={step.label} className={`obrow ${step.done ? "done" : i === nextIndex ? "next" : ""}`}>
          <span className="oc2">{step.done && <Check />}</span>
          <span className="otx">{step.label}</span>
          {!step.done && <span className="ochev">›</span>}
        </div>
      ))}
      {complete && (
        <div style={{ marginTop: "var(--space-3)", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" size="sm" onClick={() => dismiss()}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
