import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import CardPageClient from "./CardPageClient";

type Params = { game: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return { title: "Card" };
  const { game, slug } = await params;
  const data = await fetchQuery(api.cards.getBySlug, { gameSlug: game, slug });
  if (!data) return { title: "Card not found" };
  const description = `Current ${data.card.name} (${data.card.setName}) prices by condition and printing, with daily history.`;
  return {
    title: `${data.card.name} price`, // layout template appends "· Kiri"
    description,
    openGraph: {
      title: `${data.card.name} price · Kiri`,
      description,
      type: "website",
    },
  };
}

export default async function CardPage({ params }: { params: Promise<Params> }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) notFound();
  const { game, slug } = await params;
  const preloaded = await preloadQuery(api.cards.getBySlug, { gameSlug: game, slug });
  return <CardPageClient preloaded={preloaded} />;
}
