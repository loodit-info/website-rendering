import test from "node:test";
import assert from "node:assert/strict";
import { RenderNode, resolveHref, getIcon } from "../src/index.js";

test("resolveHref resolves page: links properly", () => {
  const site = {
    pages: [{ id: "page-1", slug: "/about" }],
  };
  assert.equal(resolveHref("page:page-1", site), "/about");
  assert.equal(resolveHref("https://example.com", site), "https://example.com");
  assert.equal(resolveHref("", site), "#");
});

test("RenderNode returns react element tree for stack with text and button", () => {
  const node = {
    id: "stack-1",
    type: "stack",
    props: { direction: "row", gap: 16 },
    children: [
      { id: "text-1", type: "text", props: { text: "Hello World" } },
      { id: "btn-1", type: "button", props: { text: "Click Me", href: "https://example.com" } },
    ],
  };

  const element = RenderNode({ node, site: {} });
  assert.equal(element.type, "div");
  assert.equal(element.props.className, "site-stack");
  assert.equal(element.props.style.display, "flex");
  assert.equal(element.props.style.flexDirection, "row");
  assert.equal(element.props.children.length, 2);
});

test("RenderNode supports renderWrapper slot for editor integration", () => {
  const node = {
    id: "btn-1",
    type: "button",
    props: { text: "Click Me" },
  };

  const element = RenderNode({
    node,
    site: {},
    renderWrapper: (n, children) => ({
      wrapped: true,
      nodeId: n.id,
      children,
    }),
  });

  assert.equal(element.wrapped, true);
  assert.equal(element.nodeId, "btn-1");
  assert.ok(element.children);
});
