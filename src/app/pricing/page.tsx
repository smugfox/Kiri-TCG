import PricingClient from "./PricingClient";

export const metadata = {
  title: "Pricing",
  description: "Kiri is free for collections up to 100 cards. Trader unlocks unlimited cards and alerts for $6/mo.",
};

export default function PricingPage() {
  return <PricingClient />;
}
