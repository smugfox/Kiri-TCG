"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import Sparkline from "@/components/charts/Sparkline";
import FreshnessChip from "@/components/features/FreshnessChip";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import Stepper from "@/components/ui/Stepper";
import Kebab from "@/components/ui/Kebab";
import Pagination from "@/components/ui/Pagination";
import { RarityDot } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { money, signedMoney } from "@/lib/format";

const PAGE_SIZE = 50;
const STALE_MS = 48 * 60 * 60 * 1000;

type SortKey = "name" | "price" | "pl";
type Row = NonNullable<ReturnType<typeof useHoldingsPage>["rows"]>[number];

function useHoldingsPage(sort: SortKey, dir: "asc" | "desc", offset: number) {
  const result = useQuery(api.holdings.list, {
    sort,
    dir,
    paginationOpts: { numItems: PAGE_SIZE, cursor: offset > 0 ? String(offset) : null },
  });
  return { rows: result?.page, total: result?.total ?? 0, loading: result === undefined };
}

function EditDrawer({ row, onClose }: { row: Row; onClose: () => void }) {
  const update = useMutation(api.holdings.update);
  const toast = useToast();
  const [quantity, setQuantity] = useState(row.quantity);
  const [cost, setCost] = useState(row.costBasisPerCard?.toString() ?? "");
  const [date, setDate] = useState(
    row.acquiredAt ? new Date(row.acquiredAt).toISOString().slice(0, 10) : "",
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const parsed = cost.trim() ? parseFloat(cost.replace(/[$,]/g, "")) : null;
      const result = await update({
        holdingId: row._id,
        quantity,
        costBasisPerCard: parsed !== null && Number.isFinite(parsed) ? parsed : null,
        acquiredAt: date ? new Date(date + "T00:00:00Z").getTime() : null,
      });
      toast(result.removed ? `Removed ${row.card.name} from your portfolio.` : `Updated ${row.card.name}.`);
      onClose();
    } catch {
      toast("That didn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title="Edit holding"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={saving}>Save</Button>
        </>
      }
    >
      <div className="fld">
        <div className="lb">Card</div>
        <div className="selrow">
          <span className="cs-thumb" aria-hidden style={row.card.imageUrl ? { background: `center / cover url(${row.card.imageUrl})` } : undefined} />
          <span>
            <span className="cs-name" style={{ display: "block" }}>{row.card.name}</span>
            <span className="cs-set">
              {row.condition} · {row.printing}
              {row.language !== "English" ? ` · ${row.language}` : ""}
            </span>
          </span>
        </div>
      </div>
      <div className="fld" style={{ display: "flex", gap: "var(--space-3)" }}>
        <div style={{ flex: "none" }}>
          <div className="lb">Quantity</div>
          <Stepper value={quantity} min={0} max={999} onChange={setQuantity} />
          {quantity === 0 && <div className="cs-set" style={{ marginTop: 6 }}>Saving at zero removes this card</div>}
        </div>
        <div style={{ flex: 1 }}>
          <div className="lb">Price paid (each)</div>
          <input className="input" style={{ width: "100%" }} inputMode="decimal" placeholder="Optional" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </div>
      <div className="fld">
        <div className="lb">Date acquired</div>
        <input className="input" style={{ width: "100%" }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
    </Drawer>
  );
}

export default function HoldingsTable() {
  const [sort, setSort] = useState<SortKey>("name");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const remove = useMutation(api.holdings.remove);
  const toast = useToast();
  const router = useRouter();

  const { rows, total, loading } = useHoldingsPage(sort, dir, (page - 1) * PAGE_SIZE);
  const filtered = useMemo(
    () => (rows ?? []).filter((r) => r.card.name.toLowerCase().includes(filter.trim().toLowerCase())),
    [rows, filter],
  );
  // Freshness speaks for market prices only; local placeholders don't count.
  const freshest = Math.max(
    0,
    ...(rows ?? []).filter((r) => r.currentPrice !== undefined).map((r) => r.lastUpdatedAt),
  );
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const header = (key: SortKey, label: string, align?: "right") => {
    const active = sort === key;
    return (
      <th
        scope="col"
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined}
        style={{ textAlign: align ?? "left", cursor: "pointer" }}
        tabIndex={0}
        onClick={() => {
          if (active) setDir(dir === "asc" ? "desc" : "asc");
          else {
            setSort(key);
            setDir(key === "name" ? "asc" : "desc");
          }
          setPage(1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") (e.target as HTMLElement).click();
        }}
      >
        {label}
        {active && <span className="sort">{dir === "asc" ? "▲" : "▼"}</span>}
      </th>
    );
  };

  const doRemove = async (row: Row) => {
    try {
      const result = await remove({ holdingId: row._id });
      toast(`Removed ${result.quantity} × ${row.card.name} from your portfolio.`);
    } catch {
      toast("That didn't work. Try again.");
    }
  };

  const kebabFor = (row: Row) => (
    <Kebab
      label={`Actions for ${row.card.name}`}
      items={[
        { label: "Edit", onClick: () => setEditing(row) },
        { label: "View card", onClick: () => router.push(`/cards/${row.card.gameSlug}/${row.card.slug}`) },
        { label: "Set alert", onClick: () => toast("Price alerts arrive in the next phase.") },
        { label: "Remove", danger: true, onClick: () => doRemove(row) },
      ]}
    />
  );

  const stale = (row: Row) => Date.now() - row.lastUpdatedAt > STALE_MS;

  return (
    <div>
      <div className="fbar" style={{ maxWidth: "none" }}>
        <input
          className="input"
          placeholder="Filter holdings"
          aria-label="Filter holdings by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="spacer" />
        {freshest > 0 && <FreshnessChip updatedAt={freshest} />}
      </div>

      <div className="holdings-desktop xscroll">
        <table className="demo htable" style={{ maxWidth: "none", width: "100%" }}>
          <thead>
            <tr>
              {header("name", "Card")}
              <th scope="col">Rarity</th>
              <th scope="col">Cond.</th>
              <th scope="col" style={{ textAlign: "right" }}>Qty</th>
              <th scope="col" style={{ textAlign: "right" }}>Cost</th>
              {header("price", "Price", "right")}
              {header("pl", "P&L", "right")}
              <th scope="col">30d</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }, (_, i) => (
                <tr key={i} aria-hidden>
                  <td colSpan={9}><span className="skel" style={{ display: "block", height: 14 }} /></td>
                </tr>
              ))}
            {!loading &&
              filtered.map((row) => (
                <tr key={row._id}>
                  <td>
                    <span className="h-card">
                      <span className="h-thumb" style={row.card.imageUrl ? { background: `center / cover url(${row.card.imageUrl})` } : undefined} />
                      <span>
                        <span className="h-nm" style={{ display: "block" }}>{row.card.name}</span>
                        <span className="h-set">
                          {row.card.setName}
                          {row.card.number ? ` · ${row.card.number}` : ""}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td><RarityDot tier={row.card.rarityTier}>{row.card.rarity ?? row.card.rarityTier}</RarityDot></td>
                  <td><span className="cchip">{row.condition}{row.printing !== "Normal" ? ` · ${row.printing}` : ""}{row.language !== "English" ? ` · ${row.language}` : ""}</span></td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.quantity}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {row.costBasisPerCard !== undefined ? money(row.costBasisPerCard) : "·"}
                  </td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {row.currentPrice !== undefined ? money(row.currentPrice) : <span className="cs-set">No price data</span>}
                    {stale(row) && row.currentPrice !== undefined && <span className="cs-set"> · stale</span>}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {row.pl !== null ? <span className={`pl ${row.pl >= 0 ? "up" : "down"}`}>{signedMoney(row.pl)}</span> : <span className="cs-set">·</span>}
                  </td>
                  <td><Sparkline points={row.sparkline} /></td>
                  <td>{kebabFor(row)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="holdings-mobile">
        {!loading &&
          filtered.map((row) => (
            <div className="hmob" key={row._id} style={{ width: "100%", marginBottom: "var(--space-3)" }}>
              <span className="h-thumb" style={row.card.imageUrl ? { background: `center / cover url(${row.card.imageUrl})` } : undefined} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="h-nm" style={{ display: "block" }}>{row.card.name}</span>
                <span className="h-set" style={{ display: "block" }}>
                  {row.condition} · qty {row.quantity}
                  {row.currentPrice !== undefined ? ` · ${money(row.currentPrice)}` : " · no price"}
                </span>
                {row.pl !== null && <span className={`pl ${row.pl >= 0 ? "up" : "down"}`} style={{ fontSize: 13 }}>{signedMoney(row.pl)}</span>}
              </span>
              <Sparkline points={row.sparkline} width={64} height={24} />
              {kebabFor(row)}
            </div>
          ))}
      </div>

      {total > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-5)" }}>
          <Pagination page={page} pageCount={pageCount} onPage={(n) => setPage(Math.min(Math.max(1, n), pageCount))} />
        </div>
      )}

      {editing && (
        <EditDrawer
          row={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
