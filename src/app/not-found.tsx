import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--space-9) var(--space-5)" }}>
      <div className="errdemo">
        <div className="ee">Error 404</div>
        <div className="et">This card isn&apos;t in any set.</div>
        <div className="ed">The page you&apos;re after was traded away, renamed, or never printed.</div>
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
