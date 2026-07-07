"use client";

export default function Stepper({
  value,
  onChange,
  min = 1,
  max = 999,
  label = "Quantity",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <span className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label="Decrease" onClick={() => onChange(clamp(value - 1))} disabled={value <= min}>−</button>
      <span className="q" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase" onClick={() => onChange(clamp(value + 1))} disabled={value >= max}>+</button>
    </span>
  );
}
