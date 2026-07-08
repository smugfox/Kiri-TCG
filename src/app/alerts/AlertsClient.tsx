"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useConvexReady } from "@/app/providers";
import Switch from "@/components/ui/Switch";
import Kebab from "@/components/ui/Kebab";
import Banner from "@/components/ui/Banner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { money, relativeTime } from "@/lib/format";

export default function AlertsClient() {
  const ready = useConvexReady();
  const router = useRouter();
  const toast = useToast();
  const alerts = useQuery(api.alerts.list, ready ? {} : "skip");
  const viewer = useQuery(api.users.viewer, ready ? {} : "skip");
  const update = useMutation(api.alerts.update);
  const remove = useMutation(api.alerts.remove);

  if (!ready) return null;

  const tier = viewer?.tier ?? "free";
  const activeCount = (alerts ?? []).filter((a) => a.active).length;
  const atCap = tier === "free" && activeCount >= 1;

  const toggleActive = (alertId: Id<"alerts">, active: boolean) =>
    update({ alertId, active }).catch((err) => {
      const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
      toast(
        code === "LIMIT_REACHED"
          ? "The free tier runs one active alert at a time. Pause the other first, or upgrade."
          : "That didn't save. Try again.",
      );
    });

  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-6) var(--space-5)" }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginBottom: "var(--space-4)" }}>
        Alerts
      </h1>

      {atCap && (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <Banner kind="info" action={<Link href="/pricing">Upgrade to Trader</Link>}>
            Your free alert is in use. Trader runs unlimited alerts.
          </Banner>
        </div>
      )}

      {alerts === undefined && (
        <div aria-busy="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skel" style={{ display: "block", height: 52, marginBottom: 10, borderRadius: "var(--rounded-sm)" }} />
          ))}
        </div>
      )}

      {alerts && alerts.length === 0 && (
        <EmptyState
          title="No alerts yet"
          description="Set one from any card page and Kiri checks it after every nightly price update."
          action={
            <Button onClick={() => router.push("/cards")}>Browse cards</Button>
          }
        />
      )}

      {alerts && alerts.length > 0 && (
        <div className="xscroll">
          <table className="demo htable" style={{ maxWidth: "none", width: "100%" }}>
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">Variant</th>
                <th scope="col">Condition</th>
                <th scope="col" style={{ textAlign: "right" }}>Current</th>
                <th scope="col">Status</th>
                <th scope="col">Last fired</th>
                <th scope="col"><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>
                    <Link
                      href={`/cards/${alert.card.gameSlug}/${alert.card.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <span className="h-nm" style={{ display: "block" }}>{alert.card.name}</span>
                      <span className="h-set">{alert.card.setName}</span>
                    </Link>
                  </td>
                  <td>
                    <span className="cchip">
                      {alert.condition}
                      {alert.printing !== "Normal" ? ` · ${alert.printing}` : ""}
                      {alert.language !== "English" ? ` · ${alert.language}` : ""}
                    </span>
                  </td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>
                    {alert.direction} {money(alert.threshold)}
                  </td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {alert.currentPrice !== undefined ? money(alert.currentPrice) : "·"}
                  </td>
                  <td>
                    <Switch
                      on={alert.active}
                      onToggle={(active) => toggleActive(alert._id, active)}
                      label={`Alert on ${alert.card.name} active`}
                    />
                  </td>
                  <td className="h-set">
                    {alert.lastFiredAt
                      ? `${relativeTime(alert.lastFiredAt)}${alert.lastFiredPrice !== undefined ? ` at ${money(alert.lastFiredPrice)}` : ""}`
                      : "Not yet"}
                  </td>
                  <td>
                    <Kebab
                      label={`Actions for ${alert.card.name} alert`}
                      items={[
                        { label: "View card", onClick: () => router.push(`/cards/${alert.card.gameSlug}/${alert.card.slug}`) },
                        {
                          label: "Remove",
                          danger: true,
                          onClick: () =>
                            remove({ alertId: alert._id }).then(() => toast("Alert removed.")),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
