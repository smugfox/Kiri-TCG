/** Language helpers for variant lists. English leads; the rest alphabetical. */

export function variantLanguage(variant: { language?: string }): string {
  return variant.language ?? "English";
}

export function languagesOf(variants: Array<{ language?: string }>): string[] {
  const set = new Set(variants.map(variantLanguage));
  return [...set].sort((a, b) =>
    a === "English" ? -1 : b === "English" ? 1 : a.localeCompare(b),
  );
}

/** Default UI language: English when stocked, else the first available. */
export function defaultLanguage(variants: Array<{ language?: string }>): string {
  const all = languagesOf(variants);
  return all.includes("English") ? "English" : (all[0] ?? "English");
}
