import { ReactNode, useId } from "react";

export default function FormField({
  label,
  help,
  error,
  children,
  className = "",
}: {
  label: string;
  help?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`ffield ${error ? "err" : ""} ${className}`}>
      <div className="flb" id={id}>{label}</div>
      <div role="group" aria-labelledby={id}>{children}</div>
      {(error || help) && <div className="fhelp">{error || help}</div>}
    </div>
  );
}
