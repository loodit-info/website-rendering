export const DEFAULT_SITE_STYLES = Object.freeze({
  colors: Object.freeze({ primary: "#286b4c", text: "#17221d", muted: "#718078", background: "#ffffff", surface: "#f4f7f5" }),
  typography: Object.freeze({ headingFont: "Inter, sans-serif", bodyFont: "Inter, sans-serif", headingWeight: 650, bodySize: 16, linkWeight: 600 }),
  button: Object.freeze({ radius: 9, paddingX: 21, paddingY: 13, shadow: "none" }),
  fields: Object.freeze({ radius: 10, height: 48 }),
  shape: Object.freeze({ radius: 16, shadow: "small" }),
  spacing: Object.freeze({ sectionX: 40, sectionY: 72 }),
});

export function normalizeSiteStyles(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    Object.entries(DEFAULT_SITE_STYLES).map(([group, defaults]) => [
      group,
      { ...defaults, ...(source[group] && typeof source[group] === "object" ? source[group] : {}) },
    ]),
  );
}
