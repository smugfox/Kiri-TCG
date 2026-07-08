import type { RarityTier } from "@/components/ui/Badge";

/**
 * Each game's native rarity names mapped onto the design system's six-tier
 * ladder (design.md § Components, rarity mapping table). The filter panel
 * shows these once a game is chosen; not every game uses every tier.
 */
export const GAME_RARITIES: Record<string, Array<{ tier: RarityTier; label: string }>> = {
  "magic-the-gathering": [
    { tier: "common", label: "Common" },
    { tier: "uncommon", label: "Uncommon" },
    { tier: "rare", label: "Rare" },
    { tier: "mythic", label: "Mythic Rare" },
  ],
  pokemon: [
    { tier: "common", label: "Common" },
    { tier: "uncommon", label: "Uncommon" },
    { tier: "rare", label: "Rare" },
    { tier: "epic", label: "Ultra Rare" },
    { tier: "mythic", label: "Illustration Rare" },
    { tier: "secret", label: "Hyper Rare" },
  ],
  yugioh: [
    { tier: "common", label: "Common" },
    { tier: "uncommon", label: "Rare" },
    { tier: "rare", label: "Super Rare" },
    { tier: "mythic", label: "Ultra Rare" },
    { tier: "secret", label: "Secret Rare" },
  ],
  "sorcery-contested-realm": [
    { tier: "common", label: "Ordinary" },
    { tier: "uncommon", label: "Exceptional" },
    { tier: "rare", label: "Elite" },
    { tier: "mythic", label: "Unique" },
  ],
};
