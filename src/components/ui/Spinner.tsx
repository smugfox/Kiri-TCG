export default function Spinner({ className = "" }: { className?: string }) {
  return <span className={`spin ${className}`} aria-hidden="true" />;
}
