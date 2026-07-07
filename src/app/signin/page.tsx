import AuthCard from "@/components/features/AuthCard";

export const metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", padding: "var(--space-9) var(--space-5)" }}>
      <AuthCard next={next && next.startsWith("/") ? next : "/portfolio"} />
    </div>
  );
}
