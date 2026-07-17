"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Bell } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { relativeTime } from "@/lib/format";
import { capture, EVENTS } from "@/lib/analytics";

/**
 * The bell with its notification-dot counter and the 320px panel
 * (design.md § Components): unread rows tinted with a corner accent dot,
 * mark-all-read in the header, view-all footer.
 */
export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const unread = useQuery(api.notifications.unreadCount, {}) ?? 0;
  const notifications = useQuery(
    api.notifications.list,
    open ? { paginationOpts: { numItems: 8, cursor: null } } : "skip",
  );
  const markRead = useMutation(api.notifications.markRead);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        className="bellwrap"
        style={{ cursor: "pointer" }}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell aria-hidden />
        {unread > 0 && <span className="ndot">{unread > 99 ? "99+" : unread}</span>}
      </button>
      {open && (
        <div
          className="npanel"
          role="dialog"
          aria-label="Notifications"
          style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 200 }}
        >
          <div className="nh">
            Notifications
            {unread > 0 && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  markRead({});
                }}
              >
                Mark all read
              </a>
            )}
          </div>
          {(notifications?.page ?? []).map((n) => (
            <div
              key={n._id}
              className={`nitem ${n.read ? "" : "unread"}`}
              style={{ cursor: n.cardPath ? "pointer" : "default" }}
              onClick={() => {
                if (!n.read) markRead({ ids: [n._id] });
                if (n.kind === "alert") capture(EVENTS.ALERT_FIRED_OPENED);
                if (n.cardPath) {
                  setOpen(false);
                  router.push(n.cardPath);
                }
              }}
            >
              <span
                className="nico"
                style={
                  n.kind === "alert"
                    ? { background: "color-mix(in srgb, var(--color-trend-up) 14%, var(--color-surface))", color: "var(--color-trend-up)" }
                    : { background: "color-mix(in srgb, var(--color-info) 12%, var(--color-surface))", color: "var(--color-info)" }
                }
                aria-hidden
              >
                {n.kind === "alert" ? "▲" : "ℹ"}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="nt"><b>{n.title}</b></div>
                <div className="nt" style={{ color: "var(--color-on-surface-muted)" }}>
                  {n.body.startsWith(n.title) ? n.body.slice(n.title.length).replace(/^ /, "") : n.body}
                </div>
                <div className="ntime">{relativeTime(n.createdAt)}</div>
              </div>
            </div>
          ))}
          {notifications && notifications.page.length === 0 && (
            <div className="nitem" style={{ color: "var(--color-on-surface-muted)" }}>
              <div className="nt">Nothing yet. Alerts land here when they fire.</div>
            </div>
          )}
          <div className="nfoot">
            <Link href="/alerts" onClick={() => setOpen(false)}>View all alerts</Link>
          </div>
        </div>
      )}
    </span>
  );
}
