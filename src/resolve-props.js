const BREAKPOINTS = new Set(["desktop", "tablet", "mobile"]);

export function responsiveProps(node, breakpoint = "desktop") {
  const selectedBreakpoint = BREAKPOINTS.has(breakpoint) ? breakpoint : "desktop";
  if (selectedBreakpoint === "mobile") {
    return { ...(node?.styles?.tablet || {}), ...(node?.styles?.mobile || {}) };
  }
  return node?.styles?.[selectedBreakpoint] || {};
}

export function themePropsForNode(type, siteStyles) {
  if (!siteStyles) return {};
  const colors = siteStyles.colors || {};
  const typography = siteStyles.typography || {};
  const button = siteStyles.button || {};
  const fields = siteStyles.fields || {};
  const spacing = siteStyles.spacing || {};

  if (type === "heading") return { color: colors.text, fontFamily: typography.headingFont, fontWeight: typography.headingWeight };
  if (type === "text") return { color: colors.text, fontFamily: typography.bodyFont, fontSize: typography.bodySize };
  if (type === "link") return { color: colors.primary, fontFamily: typography.bodyFont, fontWeight: typography.linkWeight };
  if (type === "button") return { background: colors.primary, fontFamily: typography.bodyFont, radius: button.radius, paddingX: button.paddingX, paddingY: button.paddingY, shadow: button.shadow };
  if (type === "formField" || type === "filterField") return { radius: fields.radius, height: fields.height, fontFamily: typography.bodyFont };
  if (type === "section") return { paddingX: spacing.sectionX, paddingY: spacing.sectionY };
  return {};
}

export function resolveNodeProps({ node, breakpoint = "desktop", siteStyles }) {
  const base = node?.props || {};
  const responsive = responsiveProps(node, breakpoint);
  const local = { ...base, ...responsive };
  if (!siteStyles || base.useSiteStyles === false) return local;

  const theme = themePropsForNode(node?.type, siteStyles);
  const resolved = { ...base, ...theme, ...responsive };
  const localOverrides = new Set(Array.isArray(base.localStyleOverrides) ? base.localStyleOverrides : []);

  // Theme values act as defaults. Explicit inspector overrides, responsive
  // values, and intentional zeroes remain authoritative.
  for (const key of Object.keys(theme)) {
    if (localOverrides.has(key) || responsive[key] !== undefined || base[key] === 0) {
      resolved[key] = responsive[key] ?? base[key];
    }
  }

  return resolved;
}
