"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import UpgradePrompt from "@/components/features/UpgradePrompt";
import { useToast } from "@/components/ui/Toast";

/**
 * price-alert row (design.md § Components): $ threshold input, above/below
 * select, and a toggle switch. An existing alert for the variant edits in
 * place. "Above" fires at ≥ the threshold, "below" at ≤.
 */
export default function PriceAlertRow({ variantId }: { variantId: Id<"variants"> }) {
  const { isAuthenticated } = useConvexAuth();
  const toast = useToast();
  const existing = useQuery(api.alerts.forVariant, isAuthenticated ? { variantId } : "skip");
  const create = useMutation(api.alerts.create);
  const update = useMutation(api.alerts.update);

  const [direction, setDirection] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    if (existing) {
      setDirection(existing.direction);
      setThreshold(existing.threshold.toFixed(2));
    }
  }, [existing]);

  if (!isAuthenticated) return null;

  const parsed = parseFloat(threshold.replace(/[$,]/g, ""));
  const valid = Number.isFinite(parsed) && parsed >= 0.01 && parsed <= 100_000;
  const dirty =
    !existing ||
    existing.direction !== direction ||
    (valid && Math.abs(existing.threshold - parsed) > 0.004);

  const save = async () => {
    if (!valid) return;
    setSaving(true);
    setLimitHit(false);
    try {
      if (existing) {
        await update({ alertId: existing._id, direction, threshold: parsed });
        toast("Alert updated.");
      } else {
        await create({ variantId, direction, threshold: parsed });
        toast("Alert set. Kiri checks after each nightly price update.");
      }
    } catch (err) {
      const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
      if (code === "LIMIT_REACHED") setLimitHit(true);
      else toast("That didn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="palert" style={{ width: "100%" }}>
        <span className="lb">Alert me when the price is</span>
        <Select
          aria-label="Direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value as "above" | "below")}
          style={{ minWidth: 96 }}
        >
          <option value="above">above</option>
          <option value="below">below</option>
        </Select>
        <input
          className="input"
          style={{ width: 110 }}
          inputMode="decimal"
          placeholder="$0.00"
          aria-label="Alert threshold in dollars"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
        {existing ? (
          <>
            {dirty && valid && (
              <Button size="sm" onClick={save} loading={saving}>Save</Button>
            )}
            <Switch
              on={existing.active}
              onToggle={(active) => update({ alertId: existing._id, active }).catch((err) => {
                const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
                if (code === "LIMIT_REACHED") setLimitHit(true);
              })}
              label="Alert active"
            />
          </>
        ) : (
          <Button size="sm" onClick={save} loading={saving} disabled={!valid}>
            Set alert
          </Button>
        )}
      </div>
      {limitHit && (
        <div style={{ marginTop: "var(--space-2)" }}>
          <UpgradePrompt kind="alerts" />
        </div>
      )}
    </div>
  );
}
