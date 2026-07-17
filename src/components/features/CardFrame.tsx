/**
 * card-frame (design.md § Components): the card image at trading-card
 * proportions (63:88), rounded-md, hairline border; Haku-gradient
 * placeholder when no image exists.
 */
export default function CardFrame({ imageUrl, name }: { imageUrl?: string; name: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      style={{
        aspectRatio: "63 / 88",
        width: "100%",
        borderRadius: "var(--rounded-md)",
        border: "1px solid var(--color-border-strong)",
        background: imageUrl ? `center / cover no-repeat url(${imageUrl})` : "var(--gradient-haku)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#F5F4F2",
        fontSize: 40,
      }}
    >
      {!imageUrl && <span aria-hidden style={{ width: 22, height: 22, background: "rgba(50,32,20,.45)", transform: "rotate(45deg)", borderRadius: 3 }} />}
    </div>
  );
}
