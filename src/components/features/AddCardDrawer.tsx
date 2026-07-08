"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import Stepper from "@/components/ui/Stepper";
import { RarityBadge, type RarityTier } from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import UpgradePrompt from "@/components/features/UpgradePrompt";
import { defaultLanguage, languagesOf, variantLanguage } from "@/lib/languages";

const CONDITION_ORDER = ["NM", "LP", "MP", "HP", "DMG"];
const PENDING_KEY = "kiri.pendingAdd";

export type DrawerCard = {
  _id: Id<"cards">;
  name: string;
  setName: string;
  number?: string;
  rarityTier: RarityTier;
  imageUrl?: string;
};

export type DrawerVariant = {
  _id: Id<"variants">;
  condition: string;
  printing: string;
  language?: string;
  currentPrice?: number;
};

type PendingAdd = {
  variantId?: Id<"variants">;
  spec?: { cardId: Id<"cards">; condition: string; printing: string; language: string };
  quantity: number;
  costBasisPerCard?: number;
  acquiredAt?: number;
  cardName: string;
};

/** Replay an add that was interrupted by sign-in (product-vision § Magic
 * Moment: "the pending add completes"). Mounted once in the layout. */
export function PendingAddReplayer() {
  const { isAuthenticated } = useConvexAuth();
  const add = useMutation(api.holdings.add);
  const toast = useToast();
  useEffect(() => {
    if (!isAuthenticated) return;
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY);
    try {
      const pending = JSON.parse(raw) as PendingAdd;
      add({
        variantId: pending.variantId,
        spec: pending.spec,
        quantity: pending.quantity,
        costBasisPerCard: pending.costBasisPerCard,
        acquiredAt: pending.acquiredAt,
      })
        .then(() =>
          toast(`Added ${pending.quantity} × ${pending.cardName} to your portfolio.`),
        )
        .catch(() => toast("That add didn't go through. Try again from the card page."));
    } catch {
      // malformed stored state; drop it
    }
  }, [isAuthenticated, add, toast]);
  return null;
}

/**
 * The add-card drawer (design.md § Components, drawer add-card flow):
 * selected card row, condition pills (NM default), printing pills (Normal
 * default), quantity stepper, optional price-paid and date-acquired fields,
 * one primary "Add N cards". Two taps for the common case (US-003).
 */
export default function AddCardDrawer({
  open,
  onClose,
  card,
  variants,
}: {
  open: boolean;
  onClose: () => void;
  card: DrawerCard | null;
  variants: DrawerVariant[];
}) {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const add = useMutation(api.holdings.add);

  const [condition, setCondition] = useState("NM");
  const [printing, setPrinting] = useState("Normal");
  const [language, setLanguage] = useState("English");
  const [quantity, setQuantity] = useState(1);
  const [pricePaid, setPricePaid] = useState("");
  const [dateAcquired, setDateAcquired] = useState("");
  const [saving, setSaving] = useState(false);
  const [limitHit, setLimitHit] = useState(false);

  // English leads; other languages sit behind the select (one language at a time).
  const languages = useMemo(() => languagesOf(variants), [variants]);
  const pool = useMemo(
    () => variants.filter((x) => variantLanguage(x) === language),
    [variants, language],
  );
  // The full condition ladder is always offered: a collector's copy exists
  // even when the market has no listing for it. Printings stay grounded in
  // what this card is known to have in the chosen language.
  const conditions = CONDITION_ORDER;
  const printings = useMemo(() => {
    const known = [...new Set(pool.map((x) => x.printing))];
    if (known.length === 0) known.push("Normal");
    return known.sort((a, b) => (a === "Normal" ? -1 : b === "Normal" ? 1 : a.localeCompare(b)));
  }, [pool]);

  // Reset to smart defaults each time the drawer opens (US-003).
  useEffect(() => {
    if (!open) return;
    setLanguage(defaultLanguage(variants));
    setQuantity(1);
    setPricePaid("");
    setDateAcquired("");
    setLimitHit(false);
  }, [open, variants]);

  useEffect(() => {
    if (!conditions.includes(condition)) setCondition(conditions[0] ?? "NM");
  }, [conditions, condition]);
  useEffect(() => {
    if (!printings.includes(printing)) setPrinting(printings[0] ?? "Normal");
  }, [printings, printing]);

  const selected = pool.find((x) => x.condition === condition && x.printing === printing);
  // No market listing for this exact version: the add still works via spec,
  // creating an unpriced local variant (excluded from totals, honestly).
  const unpriced = !selected;

  const submit = async () => {
    if (!card) return;
    const costBasisPerCard = pricePaid.trim() ? parseFloat(pricePaid.replace(/[$,]/g, "")) : undefined;
    const acquiredAt = dateAcquired ? new Date(dateAcquired + "T00:00:00Z").getTime() : undefined;
    const payload = {
      variantId: selected?._id,
      spec: selected ? undefined : { cardId: card._id, condition, printing, language },
      quantity,
      costBasisPerCard: Number.isFinite(costBasisPerCard) ? costBasisPerCard : undefined,
      acquiredAt,
    };
    if (!isAuthenticated) {
      // Sign-up must not precede value: park the add, finish it after auth.
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ ...payload, cardName: card.name }));
      router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setSaving(true);
    try {
      await add(payload);
      toast(`Added ${quantity} × ${card.name} to your portfolio.`);
      onClose();
    } catch (err) {
      const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
      if (code === "LIMIT_REACHED") setLimitHit(true);
      else toast("That didn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!card) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add to portfolio"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} loading={saving}>
            Add {quantity} {quantity === 1 ? "card" : "cards"}
          </Button>
        </>
      }
    >
      <div className="fld">
        <div className="lb">Card</div>
        <div className="selrow">
          {card.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cs-thumb" src={card.imageUrl} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <span className="cs-thumb" aria-hidden />
          )}
          <span>
            <span className="cs-name" style={{ display: "block" }}>{card.name}</span>
            <span className="cs-set">
              {card.setName}
              {card.number ? ` · ${card.number}` : ""}
            </span>
          </span>
          <span style={{ marginLeft: "auto" }}>
            <RarityBadge tier={card.rarityTier}>{card.rarityTier}</RarityBadge>
          </span>
        </div>
      </div>

      {(languages.length > 1 || language !== "English") && (
        <div className="fld">
          <div className="lb">Language</div>
          <Select
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: "100%" }}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </Select>
        </div>
      )}

      <div className="fld">
        <div className="lb">Condition</div>
        <div className="range-tabs" role="tablist" aria-label="Condition">
          {conditions.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={condition === c}
              className={condition === c ? "active" : ""}
              onClick={() => setCondition(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="fld">
        <div className="lb">Printing</div>
        <div className="range-tabs" role="tablist" aria-label="Printing">
          {printings.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={printing === p}
              className={printing === p ? "active" : ""}
              onClick={() => setPrinting(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="fld" style={{ display: "flex", gap: "var(--space-3)" }}>
        <div style={{ flex: "none" }}>
          <div className="lb">Quantity</div>
          <Stepper value={quantity} min={1} max={999} onChange={setQuantity} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="lb">Price paid (each)</div>
          <input
            className="input"
            style={{ width: "100%" }}
            inputMode="decimal"
            placeholder="Optional"
            value={pricePaid}
            onChange={(e) => setPricePaid(e.target.value)}
          />
        </div>
      </div>

      <div className="fld">
        <div className="lb">Date acquired</div>
        <input
          className="input"
          style={{ width: "100%" }}
          type="date"
          value={dateAcquired}
          onChange={(e) => setDateAcquired(e.target.value)}
        />
      </div>

      {unpriced && (
        <div className="cs-set" style={{ marginTop: "var(--space-2)" }}>
          No market price for this version yet. It counts in your collection and
          stays out of your totals until pricing appears.
        </div>
      )}

      {limitHit && <UpgradePrompt />}
    </Drawer>
  );
}
