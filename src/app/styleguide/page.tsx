"use client";

/**
 * Dev scratch page: renders the ui primitives for side-by-side verification
 * against docs/design.html. Not linked from navigation.
 */
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Badge, RarityBadge, RarityDot } from "@/components/ui/Badge";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Switch from "@/components/ui/Switch";
import Stepper from "@/components/ui/Stepper";
import Alert from "@/components/ui/Alert";
import Tooltip from "@/components/ui/Tooltip";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Banner from "@/components/ui/Banner";
import Modal from "@/components/ui/Modal";
import Drawer from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", margin: "16px 0 40px" }}>{children}</div>
);
const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)", marginTop: 48 }}>{children}</h2>
);

export default function Styleguide() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("nm");
  const [on, setOn] = useState(true);
  const [qty, setQty] = useState(4);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const toast = useToast();

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginTop: 32 }}>Styleguide scratch page</h1>
      <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)" }}>
        Verify against docs/design.html. Toggle dark mode:{" "}
        <button className="btn btn-secondary sm" onClick={() => {
          const h = document.documentElement;
          h.dataset.theme = h.dataset.theme === "light" ? "dark" : "light";
        }}>Toggle theme</button>
      </p>

      <H>Buttons</H>
      <Row>
        <Button>Add to deck</Button>
        <Button disabled>Add to deck</Button>
        <Button loading>Adding…</Button>
        <Button variant="secondary">Browse cards</Button>
        <Button variant="ghost">View rules</Button>
        <Button variant="destructive">Delete deck</Button>
        <Button variant="inverted">Create your account</Button>
        <Button size="sm">Small</Button>
      </Row>

      <H>Badges and chips</H>
      <Row>
        <Badge>Origins</Badge>
        <RarityBadge tier="common">Common</RarityBadge>
        <RarityBadge tier="rare">Rare</RarityBadge>
        <RarityBadge tier="mythic">Mythic</RarityBadge>
        <RarityBadge tier="secret" prismatic>Secret</RarityBadge>
        <RarityDot tier="mythic">Mythic</RarityDot>
        <Chip>Featured</Chip>
        <Chip selected onRemove={() => {}}>Mythic only</Chip>
      </Row>

      <H>Forms</H>
      <Row>
        <Input placeholder="Search cards…" />
        <Input error value="???" readOnly />
        <Input disabled value="Sold out" />
        <Select defaultValue="mtg"><option value="mtg">Magic: The Gathering</option><option value="pkm">Pokémon</option></Select>
        <Stepper value={qty} onChange={setQty} />
      </Row>
      <Row>
        <FormField label="Price paid (each)" help="Used to compute your cost basis and P&L.">
          <Input defaultValue="$30.50" style={{ width: "100%" }} />
        </FormField>
        <FormField label="Quantity" error="Quantity must be at least 1.">
          <Input error defaultValue="0" style={{ width: "100%" }} />
        </FormField>
        <FormField label="Trade notes" help="Visible to trade partners only.">
          <Textarea defaultValue="Prefer local pickup." style={{ width: "100%" }} />
        </FormField>
      </Row>
      <Row>
        <Checkbox checked={checked} onChange={setChecked}>Foils only</Checkbox>
        <Checkbox checked={false} onChange={() => {}} disabled>Graded slabs</Checkbox>
        <Radio checked={radio === "nm"} onChange={() => setRadio("nm")} name="cond">Near Mint</Radio>
        <Radio checked={radio === "lp"} onChange={() => setRadio("lp")} name="cond">Lightly Played</Radio>
        <Switch on={on} onToggle={setOn} label="Email alerts" />
      </Row>

      <H>Feedback</H>
      <div style={{ display: "grid", gap: 12, maxWidth: 440, marginBottom: 24 }}>
        <Alert kind="info">New set “Origins II” previews begin next week.</Alert>
        <Alert kind="success">Deck saved to your collection.</Alert>
        <Alert kind="warning">This deck is 2 cards under the 60-card minimum.</Alert>
        <Alert kind="error">Card could not be added: collection limit reached.</Alert>
      </div>
      <Banner kind="warning" action={<a href="#s">Status page</a>}>Price updates are delayed while our data provider is under maintenance.</Banner>
      <Row>
        <Button variant="secondary" onClick={() => toast("Deck exported · View file")}>Show toast</Button>
        <Tooltip text="Prices refresh nightly"><Button variant="secondary" size="sm">Hover me</Button></Tooltip>
        <Skeleton width={220} height={14} />
      </Row>
      <Row>
        <EmptyState
          title="No cards in your portfolio yet"
          description="Search for any card across Magic, Pokémon, Yu-Gi-Oh, and Sorcery to start tracking its value."
          action={<Button>Add your first card</Button>}
        />
      </Row>

      <H>Overlays</H>
      <Row>
        <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
        <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
      </Row>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Delete this deck?"
        dismissable={false}
        actions={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button variant="destructive" onClick={() => setModal(false)}>Delete deck</Button></>}
      >
        “Mist Riders v3” will be removed from your collection. This can&apos;t be undone.
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Add to portfolio"
        actions={<><Button variant="secondary" onClick={() => setDrawer(false)}>Cancel</Button><Button onClick={() => setDrawer(false)}>Add 2 cards</Button></>}
      >
        <FormField label="Quantity"><Stepper value={qty} onChange={setQty} /></FormField>
      </Drawer>
    </div>
  );
}
