import { Suspense } from "react";
import PortfolioClient from "./PortfolioClient";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  // Suspense: PortfolioClient reads useSearchParams (?upgraded=1).
  return (
    <Suspense>
      <PortfolioClient />
    </Suspense>
  );
}
