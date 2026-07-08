import { describe, expect, it, vi } from "vitest";
import { cardSlug, normalizeCondition, normalizeRarity, splitPrinting } from "./normalize";

describe("normalizeCondition", () => {
  it("maps standard labels", () => {
    expect(normalizeCondition("Near Mint")).toBe("NM");
    expect(normalizeCondition("Lightly Played")).toBe("LP");
    expect(normalizeCondition("Moderately Played")).toBe("MP");
    expect(normalizeCondition("Heavily Played")).toBe("HP");
    expect(normalizeCondition("Damaged")).toBe("DMG");
  });

  it("maps abbreviations and TCG synonyms", () => {
    expect(normalizeCondition("NM")).toBe("NM");
    expect(normalizeCondition("Excellent")).toBe("LP");
    expect(normalizeCondition("Good")).toBe("MP");
    expect(normalizeCondition("Poor")).toBe("DMG");
  });

  it("defaults unknown to NM with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeCondition("Sealed")).toBe("NM");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("normalizeRarity", () => {
  it("maps Magic rarities", () => {
    expect(normalizeRarity("magic-the-gathering", "Common")).toBe("common");
    expect(normalizeRarity("magic-the-gathering", "Uncommon")).toBe("uncommon");
    expect(normalizeRarity("magic-the-gathering", "Rare")).toBe("rare");
    expect(normalizeRarity("magic-the-gathering", "Mythic Rare")).toBe("mythic");
  });

  it("maps Pokémon rarities", () => {
    expect(normalizeRarity("pokemon", "Common")).toBe("common");
    expect(normalizeRarity("pokemon", "Uncommon")).toBe("uncommon");
    expect(normalizeRarity("pokemon", "Rare")).toBe("rare");
    expect(normalizeRarity("pokemon", "Ultra Rare")).toBe("epic");
    expect(normalizeRarity("pokemon", "Illustration Rare")).toBe("mythic");
    expect(normalizeRarity("pokemon", "Hyper Rare")).toBe("secret");
  });

  it("maps Yu-Gi-Oh rarities (Rare sits at uncommon prestige)", () => {
    expect(normalizeRarity("yugioh", "Common")).toBe("common");
    expect(normalizeRarity("yugioh", "Rare")).toBe("uncommon");
    expect(normalizeRarity("yugioh", "Super Rare")).toBe("rare");
    expect(normalizeRarity("yugioh", "Ultra Rare")).toBe("mythic");
    expect(normalizeRarity("yugioh", "Secret Rare")).toBe("secret");
  });

  it("maps Sorcery rarities", () => {
    expect(normalizeRarity("sorcery-contested-realm", "Ordinary")).toBe("common");
    expect(normalizeRarity("sorcery-contested-realm", "Exceptional")).toBe("uncommon");
    expect(normalizeRarity("sorcery-contested-realm", "Elite")).toBe("rare");
    expect(normalizeRarity("sorcery-contested-realm", "Unique")).toBe("mythic");
  });

  it("defaults unknown rarity or game to common with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeRarity("magic-the-gathering", "Bonus")).toBe("common");
    expect(normalizeRarity("unknown-game", "Rare")).toBe("common");
    expect(normalizeRarity("pokemon", undefined)).toBe("common");
    expect(warn).toHaveBeenCalledTimes(2); // undefined rarity does not warn
    warn.mockRestore();
  });
});

describe("cardSlug", () => {
  it("builds url-safe slugs from name, set, and number", () => {
    expect(cardSlug("Lightning Bolt", "Magic 2011", "146")).toBe(
      "lightning-bolt-magic-2011-146",
    );
  });

  it("strips punctuation and diacritics", () => {
    expect(cardSlug("Jace, the Mind Sculptor", "Worldwake", "31")).toBe(
      "jace-the-mind-sculptor-worldwake-31",
    );
    expect(cardSlug("Séance", "Dark Ascension", "1")).toBe("seance-dark-ascension-1");
  });

  it("handles a missing number", () => {
    expect(cardSlug("Charizard", "Base Set", null)).toBe("charizard-base-set");
  });
});

describe("splitPrinting", () => {
  it("splits language suffixes", () => {
    expect(splitPrinting("Normal - Japanese")).toEqual({ printing: "Normal", language: "Japanese" });
    expect(splitPrinting("1st Edition - Japanese")).toEqual({ printing: "1st Edition", language: "Japanese" });
    expect(splitPrinting("Normal - Chinese (S)")).toEqual({ printing: "Normal", language: "Chinese (S)" });
    expect(splitPrinting("Foil - German")).toEqual({ printing: "Foil", language: "German" });
  });

  it("leaves plain and exotic printings alone", () => {
    expect(splitPrinting("Normal")).toEqual({ printing: "Normal", language: "English" });
    expect(splitPrinting("Reverse Holofoil")).toEqual({ printing: "Reverse Holofoil", language: "English" });
    expect(splitPrinting("Foo - Bar")).toEqual({ printing: "Foo - Bar", language: "English" });
  });

  it("defaults empty to Normal / English", () => {
    expect(splitPrinting(undefined)).toEqual({ printing: "Normal", language: "English" });
  });
});
