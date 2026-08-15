import test from "node:test";
import assert from "node:assert/strict";
import { createButtonStyles, createFormChoiceStyles, createFormFieldStyles, createFormMessageStyles, createFormStyles, createGalleryStyles, createGridStyles, createHeroStyles, createIconButtonStyles, createImageStyles, createLinkStyles, createLogoStyles, createNavbarStyles, createSectionStyles, createStackStyles, createTypographyStyles, normalizeSiteStyles, resolveNodeProps } from "../src/index.js";

const styles = normalizeSiteStyles({
  colors: { primary: "#123456", text: "#202020" },
  typography: { bodySize: 18 },
  button: { radius: 12 },
});

test("normalizes partial site styles against shared defaults", () => {
  assert.equal(styles.colors.primary, "#123456");
  assert.equal(styles.colors.background, "#ffffff");
  assert.equal(styles.typography.bodySize, 18);
  assert.equal(styles.typography.headingWeight, 650);
});

test("applies theme values as defaults", () => {
  const result = resolveNodeProps({ node: { type: "text", props: { text: "Hello", fontSize: 12 } }, siteStyles: styles });
  assert.equal(result.fontSize, 18);
  assert.equal(result.color, "#202020");
});

test("preserves explicit local inspector overrides", () => {
  const result = resolveNodeProps({
    node: { type: "text", props: { fontSize: 12, localStyleOverrides: ["fontSize"] } },
    siteStyles: styles,
  });
  assert.equal(result.fontSize, 12);
});

test("responsive values override theme and base values", () => {
  const result = resolveNodeProps({
    node: { type: "button", props: { radius: 4 }, styles: { mobile: { radius: 20, widthMode: "fill" } } },
    breakpoint: "mobile",
    siteStyles: styles,
  });
  assert.equal(result.radius, 20);
  assert.equal(result.widthMode, "fill");
});

test("preserves intentional zero values", () => {
  const result = resolveNodeProps({ node: { type: "button", props: { radius: 0, paddingX: 0 } }, siteStyles: styles });
  assert.equal(result.radius, 0);
  assert.equal(result.paddingX, 0);
});

test("can opt out of site styles", () => {
  const result = resolveNodeProps({
    node: { type: "text", props: { color: "#abcdef", fontSize: 11, useSiteStyles: false }, styles: { tablet: { fontSize: 13 } } },
    breakpoint: "tablet",
    siteStyles: styles,
  });
  assert.equal(result.color, "#abcdef");
  assert.equal(result.fontSize, 13);
});

test("preserves configured layout modes for renderer-specific style generation", () => {
  const grid = resolveNodeProps({
    node: { type: "grid", props: { columns: 2, columnSizing: "equal", columnRatios: [1.05, .95] } },
    siteStyles: styles,
  });
  const button = resolveNodeProps({
    node: { type: "button", props: { widthMode: "fixed", width: 180 } },
    siteStyles: styles,
  });

  assert.equal(grid.columnSizing, "equal");
  assert.deepEqual(grid.columnRatios, [1.05, .95]);
  assert.equal(button.widthMode, "fixed");
  assert.equal(button.width, 180);
});

test("creates one semantic style contract for every form-field part", () => {
  const result = createFormFieldStyles({ span: 2, height: 52, radius: 6, borderColor: "#123456", background: "#fafafa", color: "#111111" });

  assert.equal(result.container.gridColumn, "span 2");
  assert.equal(result.label.fontSize, 12);
  assert.equal(result.requiredMarker.color, "#b04438");
  assert.equal(result.control.minHeight, 52);
  assert.equal(result.control.borderRadius, 6);
  assert.equal(result.control.borderColor, "#123456");
  assert.equal(result.control.background, "#fafafa");
  assert.equal(result.control.color, "#111111");
  assert.equal(result.textarea.resize, "vertical");
  assert.equal(result.helpText.fontSize, 11);
});

test("creates one semantic style contract for complete forms", () => {
  const form = createFormStyles({ columns: 2, padding: 32, gap: 18, maxWidth: 800, shadow: "medium" }, { breakpoint: "mobile", state: "loading" });
  const choice = createFormChoiceStyles({ color: "#123456", accentColor: "#654321", disabled: true });
  const message = createFormMessageStyles({ color: "#245c3c", errorColor: "#9b3025", fontSize: 14 }, { state: "error" });

  assert.equal(form.container.display, "flex");
  assert.equal(form.container.padding, 22);
  assert.equal(form.container.width, "calc(100% - 24px)");
  assert.equal(form.container.pointerEvents, "none");
  assert.equal(form.grid.gridTemplateColumns, "repeat(1, minmax(0, 1fr))");
  assert.equal(choice.control.accentColor, "#654321");
  assert.equal(choice.container.opacity, .55);
  assert.equal(message.current.color, "#9b3025");
  assert.equal(message.current.fontSize, 14);
});

test("creates one semantic style contract for every logo part", () => {
  const result = createLogoStyles({ height: 40, width: 120, align: "right", imagePosition: "right", gap: 12, color: "#123456", fontFamily: "Inter, sans-serif", fontSize: 31, fontWeight: 600, lineHeight: 1.2, letterSpacing: 1.5 });

  assert.equal(result.container.justifyContent, "flex-end");
  assert.equal(result.link.flexDirection, "row-reverse");
  assert.equal(result.link.gap, 12);
  assert.equal(result.wordmark.fontFamily, "Inter, sans-serif");
  assert.equal(result.wordmark.fontSize, 31);
  assert.equal(result.wordmark.fontWeight, 600);
  assert.equal(result.wordmark.lineHeight, 1.2);
  assert.equal(result.wordmark.letterSpacing, 1.5);
  assert.equal(result.image.width, 120);
});

test("resolves all configured typography properties through one contract", () => {
  const result = createTypographyStyles({ fontFamily: "Georgia", fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: 1.5, align: "center", fontStyle: "italic", textDecoration: "underline", widthMode: "fixed", width: 420, maxWidth: 500, wrap: "nowrap" }, { defaultMaxWidth: 800 });
  assert.equal(result.fontFamily, "Georgia");
  assert.equal(result.fontSize, 32);
  assert.equal(result.letterSpacing, 1.5);
  assert.equal(result.textAlign, "center");
  assert.equal(result.width, 420);
  assert.equal(result.maxWidth, 500);
  assert.equal(result.whiteSpace, "nowrap");
  assert.equal(result.marginLeft, "auto");
});

test("resolves image sizing, placement and overlays through one contract", () => {
  const result = createImageStyles({ widthMode: "fixed", width: 640, maxWidth: 720, heightMode: "fixed", height: 360, aspectRatio: "16 / 9", fit: "contain", position: "right top", opacity: 80, radius: 18, overlayEnabled: true, overlayType: "gradient", overlayColor: "#111111", overlayGradientEnd: "#222222", overlayAngle: 90 });
  assert.equal(result.frame.width, 640);
  assert.equal(result.frame.height, 360);
  assert.equal(result.frame.aspectRatio, "16 / 9");
  assert.equal(result.frame.marginLeft, "auto");
  assert.equal(result.image.objectFit, "contain");
  assert.equal(result.image.objectPosition, "right top");
  assert.equal(result.image.opacity, .8);
  assert.equal(result.overlay.background, "linear-gradient(90deg, #111111, #222222)");
});

test("centers hero content within the configured minimum height", () => {
  const result = createHeroStyles({ background: "#f6f8f6", paddingX: 56, paddingY: 72, minHeight: 620, maxWidth: 1280, contentAlign: "center" });
  assert.equal(result.container.display, "flex");
  assert.equal(result.container.alignItems, "center");
  assert.equal(result.container.minHeight, 620);
  assert.equal(result.container.padding, "72px 56px");
  assert.equal(result.content.maxWidth, 1280);
  assert.equal(result.content.textAlign, "center");
});

test("resolves link active, hover and underline treatments", () => {
  const result = createLinkStyles({ color: "#111111", hoverColor: "#225533", activeColor: "#337744", activePreset: "underline", activeThickness: 3, activeOffset: 7, fontWeight: 500, activeFontWeight: 700 }, { active: true });
  assert.equal(result.style.color, "#337744");
  assert.equal(result.style.fontWeight, 700);
  assert.equal(result.style.textDecoration, "underline");
  assert.equal(result.style.textDecorationThickness, 3);
  assert.equal(result.style.textUnderlineOffset, 7);
  assert.equal(result.style["--loodit-link-hover-color"], "#225533");
});

test("resolves icon-button placement, hover and badge styles", () => {
  const result = createIconButtonStyles({ displayMode: "iconText", iconPosition: "right", hoverBackground: "#eeeeee", hoverColor: "#123456", badge: "2", badgeBackground: "#990000", badgeSize: 18 });
  assert.equal(result.showIcon, true);
  assert.equal(result.showText, true);
  assert.equal(result.iconOnRight, true);
  assert.equal(result.control["--loodit-icon-button-hover-bg"], "#eeeeee");
  assert.equal(result.badge.background, "#990000");
  assert.equal(result.badge.height, 18);
});

test("button width and visual properties come from configuration", () => {
  const result = createButtonStyles({ widthMode: "fixed", width: 184, align: "right", paddingX: 24, paddingY: 11, radius: 5, background: "#123456", hoverBackground: "#234567", fontSize: 15 });
  assert.equal(result.wrapper.width, 184);
  assert.equal(result.wrapper.alignSelf, "flex-end");
  assert.equal(result.control.width, "100%");
  assert.equal(result.control.padding, "11px 24px");
  assert.equal(result.control.borderRadius, 5);
  assert.equal(result.control["--site-button-hover-bg"], "#234567");
  assert.equal(result.control.fontSize, 15);
});

test("a button inside a row or grid preserves the parent cross-axis alignment", () => {
  const result = createButtonStyles({ widthMode: "auto", align: "left" }, { preserveParentCrossAxis: true });
  assert.equal(result.wrapper.alignSelf, undefined);
  assert.equal(result.wrapper.width, "auto");
});

test("section, stack, and grid layout styles come from configuration", () => {
  const section = createSectionStyles({ paddingX: 32, paddingY: 48, minHeight: 500, overflow: "hidden", background: { type: "gradient", gradient: { angle: 90, start: "#000", end: "#fff" }, overlay: { enabled: true, color: "#111", opacity: 25 } } });
  const stack = createStackStyles({ direction: "row", gap: 18, widthMode: "fixed", width: 640, align: "center", justify: "between" });
  const grid = createGridStyles({ columns: 2, columnSizing: "custom", columnRatios: [1.2, .8], columnGap: 20, rowGap: 12 });
  assert.equal(section.container.padding, "48px 32px");
  assert.equal(section.background.background, "linear-gradient(90deg, #000, #fff)");
  assert.equal(section.overlayEnabled, true);
  assert.equal(stack.width, 640);
  assert.equal(stack.justifyContent, "space-between");
  assert.equal(grid.style.gridTemplateColumns, "minmax(0, 1.2fr) minmax(0, 0.8fr)");
  assert.equal(grid.style.columnGap, 20);
});

test("collage gallery placement and responsive reset come from one contract", () => {
  const props = { template: "collage", columns: 3, tabletColumns: 2, mobileColumns: 1, gap: 18, maxWidth: 1200 };
  const desktop = createGalleryStyles(props, { breakpoint: "desktop" });
  const mobile = createGalleryStyles(props, { breakpoint: "mobile" });
  assert.equal(desktop.grid.gridTemplateColumns, "repeat(3, minmax(0, 1fr))");
  assert.deepEqual(desktop.item(0), { gridColumn: "span 2", gridRow: "span 2" });
  assert.deepEqual(desktop.item(1), { gridColumn: "auto", gridRow: "auto" });
  assert.equal(mobile.grid.gridTemplateColumns, "repeat(1, minmax(0, 1fr))");
  assert.deepEqual(mobile.item(0), { gridColumn: "auto", gridRow: "auto" });
});

test("transparent navbar overlays content and becomes solid after scrolling", () => {
  const props = { transparentAtTop: true, position: "normal", background: "#ffffff", scrolledBackground: "#f8faf9", borderBottomWidth: 1, borderColor: "#dde5e0", scrolledShadow: "small" };
  const top = createNavbarStyles(props, { scrolled: false });
  const scrolled = createNavbarStyles(props, { scrolled: true });
  assert.equal(top.effectivePosition, "fixed");
  assert.equal(top.style.position, "fixed");
  assert.equal(top.style.background, "transparent");
  assert.equal(top.style.borderBottomWidth, 0);
  assert.equal(scrolled.style.background, "#f8faf9");
  assert.equal(scrolled.style.borderBottomWidth, 1);
  assert.equal(scrolled.style.boxShadow, "0 3px 14px #17221d12");
});
