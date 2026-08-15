import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSiteStyles, resolveNodeProps } from "../src/index.js";

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
