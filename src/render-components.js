import React, { createElement as h, useState, useEffect, useRef, useContext, createContext } from "react";
import { icons as lucideIcons } from "lucide-react";
import {
  createAccordionItemStyles,
  createAccordionStyles,
  createButtonStyles,
  createCardStyles,
  createCarouselStyles,
  createCompositeSectionStyles,
  createFilterChipStyles,
  createFilterFieldStyles,
  createFilterStyles,
  createFooterStyles,
  createFormChoiceStyles,
  createFormFieldStyles,
  createFormMessageStyles,
  createFormStyles,
  createGalleryStyles,
  createGridStyles,
  createHeroStyles,
  createIconStyles,
  createIconButtonStyles,
  createImageStyles,
  createInlineInputStyles,
  createLinkStyles,
  createLogoStyles,
  createMediaItemStyles,
  createNavbarStyles,
  createSectionStyles,
  createSocialStyles,
  createStackStyles,
  createSurfaceStyles,
  createTypographyStyles,
} from "./styles.js";
import { resolveNodeProps } from "./resolve-props.js";
import { normalizeSiteStyles } from "./defaults.js";

const px = (value) => typeof value === "number" ? `${value}px` : value || undefined;
const string = (value, fallback = "") => typeof value === "string" ? value : fallback;
const number = (value, fallback = 0) => typeof value === "number" ? value : fallback;
const desktopProps = (node) => ({ ...(node.props || {}), ...(node.styles?.desktop || {}) });

export function getIcon(name) {
  if (!name || name === "none") return null;
  const key = String(name).trim();
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  return lucideIcons[pascal] || lucideIcons[key] || lucideIcons.ArrowRight;
}

const cmsString = (val) =>
  val == null ? "" : typeof val === "object" ? string(val.url) || string(val.src) || string(val.name) || JSON.stringify(val) : String(val);

const escapeMarkup = (val) =>
  val.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const stripMarkdown = (val) =>
  val
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-+*]|\d+\.)\s+/gm, "")
    .replace(/(`{1,3}|\*\*|__|~~|[*_])/g, "")
    .trim();

const markdownHtml = (val) => {
  let html = escapeMarkup(val);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
    /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? `<a href="${href}" rel="noopener noreferrer">${label}</a>` : label
  );
  return html
    .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, "<strong>$1$2</strong>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>")
    .replace(/\r?\n/g, "<br>");
};

export const cmsText = (val, props = {}) => {
  let text = cmsString(val) || string(props.cmsFallback);
  if (props.cmsMarkdownMode === "strip") text = stripMarkdown(text);
  const limit = Math.max(0, number(props.cmsMaxCharacters, 0));
  if (limit && text.length > limit) {
    const clipped = text.slice(0, limit);
    text = props.cmsTruncateWords === false ? clipped : clipped.replace(/\s+\S*$/, "") || clipped;
    text = `${text.trimEnd()}${props.cmsEllipsis === undefined ? "…" : string(props.cmsEllipsis)}`;
  }
  return { text, html: props.cmsMarkdownMode === "render" ? markdownHtml(text) : undefined };
};

export function resolveHref(href, site) {
  if (!href) return "#";
  const target = String(href).trim();
  if (target.startsWith("page:")) {
    const pageId = target.slice(5);
    const page = site?.pages?.find((item) => item.id === pageId);
    return page ? page.slug || "/" : "/";
  }
  return target;
}

export function resolveNode(node, site, record, breakpoint = "desktop") {
  const result = resolveNodeProps({
    node,
    breakpoint,
    siteStyles: normalizeSiteStyles(site?.siteStyles),
  });
  if (!record) return result;

  if (["button", "link", "iconButton"].includes(node.type) && string(result.href).startsWith("overlay:")) {
    return { ...result, href: `cms-overlay:${string(result.href).slice(8)}:${record.id}` };
  }
  if (["button", "link"].includes(node.type) && node.props?.cmsBindingTarget === "detail") {
    const page = site?.pages?.find((item) => item.pageType === "collectionDetail" && item.collectionId === record.collectionId);
    return { ...result, href: page && record.slug ? `${page.slug.replace(/\/\{slug\}\/?$/, "")}/${record.slug}` : result.href };
  }
  const fieldKey = string(node.props?.cmsFieldKey);
  if (!fieldKey) return result;
  const val = record.values?.[fieldKey];
  if (node.type === "image") return { ...result, src: cmsString(val) };
  if (["button", "link"].includes(node.type) && node.props?.cmsBindingTarget === "href") return { ...result, href: cmsString(val) };
  if (["heading", "text", "button", "link"].includes(node.type)) return { ...result, ...cmsText(val, result) };
  return result;
}

export function RenderIcon({ name, size = 18, strokeWidth = 2, fill = "none", className = "", style }) {
  const IconComponent = getIcon(name) || getIcon("ArrowRight");
  if (!IconComponent) return null;
  return h(IconComponent, {
    className: `site-icon ${className}`.trim(),
    size,
    strokeWidth,
    fill: fill === "none" ? undefined : fill,
    "aria-hidden": "true",
    style,
  });
}

export function RenderButton({ props = {}, options = {}, iconComponent, linkWrapper: LinkWrapper, className = "", controlClassName = "", textElement }) {
  const styles = createButtonStyles(props, options);
  const unavailable = Boolean(props.disabled || props.loading);
  const IconComponent = iconComponent || (props.icon && props.icon !== "none" ? getIcon(props.icon) || getIcon("ArrowRight") : null);
  const iconSize = number(props.iconSize, 16);
  const LoaderIcon = getIcon("LoaderCircle");

  const iconElement = props.loading
    ? LoaderIcon ? h(LoaderIcon, { className: "wb-button-spinner", size: iconSize, "aria-hidden": "true" }) : h("span", { className: "wb-button-spinner" }, "…")
    : IconComponent ? h(IconComponent, { size: iconSize, strokeWidth: 2, "aria-hidden": "true" }) : null;

  const iconSlot = iconElement ? h("span", { key: "btn-icon", className: "site-button-icon", style: styles.icon }, iconElement) : null;
  const rawText = props.loading ? (props.loadingText || "Loading…") : props.text;
  const hasText = rawText !== undefined && rawText !== null && rawText !== "";
  const label = textElement
    ? (React.isValidElement(textElement) ? React.cloneElement(textElement, { key: "btn-label" }) : textElement)
    : (hasText ? h("span", { key: "btn-label" }, rawText) : (!IconComponent && !props.loading ? h("span", { key: "btn-label" }, "Get started") : null));

  const inner = [
    props.iconPosition !== "right" ? iconSlot : null,
    label,
    props.iconPosition === "right" ? iconSlot : null,
  ].filter(Boolean);

  const href = unavailable ? undefined : (props.href || "#");

  if (LinkWrapper) {
    return h(
      "div",
      { className: `site-button-wrap ${className}`.trim(), style: styles.wrapper },
      h(
        LinkWrapper,
        {
          className: `site-button ${controlClassName} ${unavailable ? "is-disabled" : ""}`.trim(),
          href,
          target: props.target || "_self",
          rel: props.target === "_blank" ? "noopener noreferrer" : undefined,
          "aria-disabled": unavailable || undefined,
          "aria-busy": props.loading || undefined,
          tabIndex: unavailable ? -1 : undefined,
          style: styles.control,
        },
        inner
      )
    );
  }

  return h(
    "div",
    { className: `site-button-wrap ${className}`.trim(), style: styles.wrapper },
    h(
      "a",
      {
        className: `site-button ${controlClassName} ${unavailable ? "is-disabled" : ""}`.trim(),
        href,
        target: props.target || "_self",
        rel: props.target === "_blank" ? "noopener noreferrer" : undefined,
        "aria-disabled": unavailable || undefined,
        "aria-busy": props.loading || undefined,
        tabIndex: unavailable ? -1 : undefined,
        style: styles.control,
      },
      inner
    )
  );
}

export function RenderIconButton({ props = {}, iconComponent, linkWrapper: LinkWrapper, className = "" }) {
  const styles = createIconButtonStyles(props);
  const IconComponent = iconComponent || (props.icon ? getIcon(props.icon) || getIcon("Menu") : getIcon("Menu"));
  const actionIcon = styles.showIcon && IconComponent ? h(IconComponent, { key: "action-icon", size: number(props.iconSize, 19) }) : null;
  const actionText = styles.showText ? h("span", { key: "action-text" }, string(props.text)) : null;
  const badge = props.badge ? h("small", { key: "action-badge", style: styles.badge }, string(props.badge)) : null;

  const children = [
    !styles.iconOnRight ? actionIcon : null,
    actionText,
    styles.iconOnRight ? actionIcon : null,
    badge,
  ].filter(Boolean);

  if (LinkWrapper) {
    return h(LinkWrapper, { className: `site-icon-button ${className}`.trim(), href: props.href || "#", target: props.target || "_self", style: styles.control }, children);
  }
  return h("a", { className: `site-icon-button ${className}`.trim(), href: props.href || "#", target: props.target || "_self", style: styles.control }, children);
}

export function RenderImage({ props = {}, className = "" }) {
  const styles = createImageStyles(props);
  return h(
    "span",
    { className: `site-image ${styles.hoverOverlayEnabled ? "has-hover-overlay" : ""} ${className}`.trim(), style: styles.frame },
    h("img", { src: string(props.src), alt: string(props.alt, ""), style: styles.image }),
    styles.overlayEnabled ? h("i", { style: styles.overlay, "aria-hidden": "true" }) : null
  );
}

export function RenderLogo({ props = {}, linkWrapper: LinkWrapper, className = "" }) {
  const styles = createLogoStyles(props);
  const content = [
    styles.mode !== "text" && props.src ? h("img", { key: "logo-img", src: string(props.src), alt: string(props.alt, "Logo"), style: styles.image }) : null,
    styles.mode !== "image" ? h("strong", { key: "logo-text", style: styles.wordmark }, string(props.text, "Your brand")) : null,
  ].filter(Boolean);

  const href = props.href || "/";
  const linkEl = LinkWrapper
    ? h(LinkWrapper, { className: "site-logo", href, style: styles.link }, content)
    : h("a", { className: "site-logo", href, style: styles.link }, content);

  return h("div", { className: `site-logo-wrap ${className}`.trim(), style: styles.container }, linkEl);
}

export function RenderSocial({ props = {}, className = "" }) {
  const styles = createSocialStyles(props);
  const networks = string(props.networks, "Instagram\nTwitter\nLinkedIn\nFacebook").split("\n").map((n) => n.trim()).filter(Boolean);
  const links = networks.map((network) => {
    const IconComponent = getIcon(network);
    return h(
      "a",
      { key: network, href: "#", "aria-label": network, style: styles.link },
      IconComponent ? h(IconComponent, { size: number(props.size, 17) }) : null
    );
  });
  return h("div", { className: `site-social ${className}`.trim(), style: styles.container }, links);
}

export function RenderSpacer({ props = {} }) {
  return h("div", { style: { height: px(number(props.height, 32)), width: "100%", flexShrink: 0 }, "aria-hidden": "true" });
}

export function RenderCard({ props = {}, children, className = "" }) {
  const styles = createCardStyles(props);
  return h(
    "article",
    { className: `site-card ${styles.hoverLift ? "has-hover-lift" : ""} ${className}`.trim(), style: styles.container },
    h("div", { className: "site-card-components", style: styles.content }, children)
  );
}

export function RenderMediaItem({ props = {}, children, className = "" }) {
  const styles = createMediaItemStyles(props);
  return h(
    "article",
    { className: `site-media-item ${styles.hoverLift ? "has-hover" : ""} ${className}`.trim(), style: styles.container },
    children
  );
}

export function RenderInlineInput({ props = {}, options = {}, onSubmit, className = "" }) {
  const styles = createInlineInputStyles(props, options);
  const SubmitIcon = props.buttonIcon ? getIcon(props.buttonIcon) || getIcon("ArrowRight") : getIcon("ArrowRight");
  const submitIcon = styles.showIcon && SubmitIcon ? h(SubmitIcon, { size: number(props.buttonIconSize, 16), "aria-hidden": "true" }) : null;
  const submitText = !styles.iconOnly ? h("span", null, string(props.buttonText, "Submit")) : null;

  return h(
    "form",
    { className: `site-inline-form ${className}`.trim(), onSubmit: onSubmit || ((e) => e.preventDefault()), style: styles.form },
    h("input", { type: string(props.inputType, "email"), "aria-label": string(props.placeholder, "Email address"), placeholder: string(props.placeholder), style: styles.input }),
    h("button", { type: "submit", "aria-label": styles.iconOnly ? string(props.buttonText, "Submit") : undefined, style: styles.button },
      !styles.iconOnRight ? submitIcon : null,
      submitText,
      styles.iconOnRight ? submitIcon : null
    )
  );
}

export function RenderFilterChip({ props = {}, options = {}, onClick, className = "" }) {
  const styles = createFilterChipStyles(props, options);
  const IconComponent = props.showIcon && props.icon && props.icon !== "none" ? getIcon(props.icon) : null;
  return h(
    "button",
    { type: "button", className: `site-filter-chip ${styles.selected ? "is-selected" : ""} ${className}`.trim(), style: styles.control, onClick },
    IconComponent ? h(IconComponent, { size: 16 }) : null,
    string(props.text),
    props.count ? h("small", { style: styles.count }, string(props.count)) : null
  );
}

export function RenderFormField({ props = {}, className = "" }) {
  const styles = createFormFieldStyles(props);
  const common = {
    name: string(props.name),
    placeholder: string(props.placeholder),
    required: Boolean(props.required),
    disabled: Boolean(props.disabled),
    readOnly: Boolean(props.readOnly),
    minLength: number(props.minLength, 0) || undefined,
    maxLength: number(props.maxLength, 0) || undefined,
    style: styles.control,
  };
  const control = props.fieldType === "textarea"
    ? h("textarea", { ...common, style: { ...styles.control, ...styles.textarea }, defaultValue: string(props.value), rows: 4 })
    : props.fieldType === "select"
    ? h("select", { ...common, defaultValue: string(props.value) },
        h("option", { value: "" }, string(props.placeholder)),
        string(props.options).split("\n").map((opt) => opt.trim()).filter(Boolean).map((opt) => h("option", { key: opt, value: opt }, opt))
      )
    : h("input", { ...common, defaultValue: string(props.value), type: string(props.fieldType, "text") });

  return h(
    "label",
    { className: `site-field ${className}`.trim(), style: styles.container },
    h("span", { style: styles.label }, string(props.label), props.required ? h("b", { "aria-hidden": "true", style: styles.requiredMarker }, " *") : null),
    control,
    props.helpText ? h("small", { style: styles.helpText }, string(props.helpText)) : null
  );
}

export function RenderFormChoice({ props = {}, disabled = false, className = "" }) {
  const styles = createFormChoiceStyles({ ...props, disabled: disabled || props.disabled });
  return h(
    "label",
    { className: `site-choice ${className}`.trim(), style: styles.container },
    h("input", {
      type: string(props.choiceType, "checkbox"),
      name: string(props.name),
      value: string(props.value),
      defaultChecked: Boolean(props.checked),
      required: Boolean(props.required),
      disabled: Boolean(disabled || props.disabled),
      style: styles.control,
    }),
    h("span", { style: styles.label }, string(props.label))
  );
}

export function RenderFormMessage({ props = {}, className = "" }) {
  const styles = createFormMessageStyles(props);
  return h(
    "div",
    { className: `site-form-message ${className}`.trim() },
    props.successText ? h("p", { className: "is-success", style: styles.success }, string(props.successText)) : null,
    props.errorText ? h("p", { className: "is-error", style: styles.error }, string(props.errorText)) : null
  );
}

const AccordionCtx = createContext(null);

export function RenderAccordion({ props = {}, options = {}, children, className = "" }) {
  const [activeId, setActiveId] = useState(undefined);
  const context = { allowMultiple: props.allowMultiple === true, activeId, toggle: (id, open) => setActiveId(open ? null : id) };
  const styles = createAccordionStyles(props, options);
  return h(
    "section",
    {
      className: `site-accordion is-${styles.template} ${className}`.trim(),
      itemScope: props.schemaEnabled !== false || undefined,
      itemType: props.schemaEnabled !== false ? "https://schema.org/FAQPage" : undefined,
      style: styles.container,
    },
    h(AccordionCtx.Provider, { value: context }, h("div", { className: "site-accordion-components", style: styles.content }, children))
  );
}

export function RenderAccordionItem({ id, props = {}, children, className = "" }) {
  const group = useContext(AccordionCtx);
  const [localOpen, setLocalOpen] = useState(props.defaultOpen === true);
  useEffect(() => setLocalOpen(props.defaultOpen === true), [props.defaultOpen]);
  const usesLocalState = !group || group.allowMultiple;
  const open = usesLocalState ? localOpen : group.activeId === undefined ? props.defaultOpen === true : group.activeId === id;
  const styles = createAccordionItemStyles(props, { open });
  const IconComponent = getIcon(styles.iconName) || getIcon("Plus");
  const icon = h("span", { className: "site-accordion-icon", style: styles.icon }, IconComponent ? h(IconComponent, { size: number(props.iconSize, 20) }) : null);

  return h(
    "article",
    { className: `site-accordion-item ${open ? "is-open" : ""} ${className}`.trim(), itemScope: true, itemProp: "mainEntity", itemType: "https://schema.org/Question", style: styles.item },
    h(
      "button",
      {
        type: "button",
        className: "site-accordion-trigger",
        "aria-expanded": open,
        onClick: () => { if (usesLocalState) setLocalOpen((v) => !v); else group?.toggle(id, open); },
        style: styles.trigger,
        itemProp: "name",
      },
      styles.iconOnLeft && icon,
      h("span", { style: styles.question }, string(props.question)),
      !styles.iconOnLeft && icon
    ),
    h(
      "div",
      { className: "site-accordion-answer", hidden: !open, itemScope: true, itemProp: "acceptedAnswer", itemType: "https://schema.org/Answer", style: styles.answer },
      h("div", { itemProp: "text" }, children)
    )
  );
}

export function RenderNavbar({ props = {}, options = {}, children, logo, trigger, menuItems = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const editing = Boolean(options.editing);

  useEffect(() => {
    if (editing || !props.transparentAtTop) { setScrolled(false); return undefined; }
    const update = () => setScrolled(window.scrollY >= number(props.scrollThreshold, 24));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [editing, props.transparentAtTop, props.scrollThreshold]);

  useEffect(() => {
    if (!open || props.lockMenuScroll === false || editing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open, props.lockMenuScroll, editing]);

  const menuOpen = editing ? Boolean(props.mobileOpen) : open;
  const styles = createNavbarStyles(props, { scrolled: scrolled || (editing && props.previewScrolled), menuOpen, editing });
  const reveal = string(props.menuReveal, "dropdown");
  const triggerText = string(trigger?.props?.text, "Menu");
  const triggerIcon = menuOpen ? "Close" : trigger?.props?.icon || "Menu";

  return h(
    "nav",
    {
      className: `site-navbar template-${string(props.template, "classic")} is-${styles.effectivePosition} ${menuOpen ? "is-open" : ""} ${styles.showScrolled ? "is-scrolled" : "is-at-top"} reveal-${reveal} ${className}`.trim(),
      style: styles.style,
    },
    h(
      "div",
      { className: "site-navbar-inner", style: { maxWidth: px(props.maxWidth) } },
      h("div", { className: "site-navbar-desktop" }, children),
      h(
        "div",
        { className: "site-navbar-mobile-top" },
        logo,
        h(
          "button",
          {
            className: "site-navbar-trigger",
            type: "button",
            onClick: () => !editing && setOpen((v) => !v),
            "aria-expanded": menuOpen,
            "aria-label": menuOpen ? "Close menu" : "Open menu",
          },
          h(RenderIcon, { name: triggerIcon, size: number(trigger?.props?.iconSize, 22) }),
          h("span", null, triggerText)
        )
      )
    ),
    h(
      "div",
      {
        className: "site-navbar-mobile",
        style: {
          background: string(props.menuBackground, string(props.background, "#fff")),
          textAlign: string(props.menuLinkAlign, "left"),
          padding: px(props.menuPadding),
        },
      },
      menuItems
    ),
    menuOpen && (reveal === "drawer" || reveal === "fullscreen")
      ? h("button", {
          className: "site-navbar-backdrop",
          type: "button",
          "aria-label": "Close menu",
          onClick: () => !editing && props.closeOnBackdrop !== false && setOpen(false),
          style: {
            background: string(props.menuBackdrop, "#17221d"),
            opacity: number(props.menuBackdropOpacity, 38) / 100,
            backdropFilter: `blur(${number(props.menuBackdropBlur, 2)}px)`,
          },
        })
      : null
  );
}

export function RenderNode({ node, site, parentType, record, options = {}, renderWrapper, onNodeClick, editableTextRenderer }) {
  if (!node) return null;
  const breakpoint = options.breakpoint || "desktop";
  const p = resolveNode(node, site, record, breakpoint);
  const insideFooter = parentType === "footer";
  const childParentType = insideFooter ? "footer" : node.type === "stack" && parentType === "navbar" ? "navbarStack" : node.type === "stack" && p.direction === "row" ? "rowStack" : node.type;

  let children = node.children?.map((child) =>
    h(RenderNode, {
      key: child.id,
      node: child,
      site,
      parentType: childParentType,
      record,
      options,
      renderWrapper,
      onNodeClick,
      editableTextRenderer,
    })
  );

  if (node.type === "grid" && p.cmsCollectionId && node.children?.length) {
    let records = (site?.contentRecords || []).filter((item) => item.collectionId === p.cmsCollectionId);
    if (p.cmsExcludeCurrent && record) records = records.filter((item) => item.id !== record.id);
    if (p.cmsSort === "oldest") records = records.sort((a, b) => new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime());
    else if (p.cmsSort === "title") records = records.sort((a, b) => string(a.title).localeCompare(string(b.title)));
    else records = records.sort((a, b) => new Date(b.updatedAt || b.publishedAt || 0).getTime() - new Date(a.updatedAt || a.publishedAt || 0).getTime());
    children = records.slice(0, Math.max(1, number(p.cmsLimit, 6))).map((item) =>
      h(RenderNode, {
        key: `${node.children[0].id}-${item.id}`,
        node: node.children[0],
        site,
        parentType: childParentType,
        record: item,
        options,
        renderWrapper,
        onNodeClick,
        editableTextRenderer,
      })
    );
  }

  let content;
  switch (node.type) {
    case "root":
      content = h(React.Fragment, null, children);
      break;

    case "section": {
      const styles = createSectionStyles(p);
      content = h(
        "section",
        { className: "site-section", style: styles.container },
        h("div", { "aria-hidden": "true", style: styles.background }),
        styles.overlayEnabled ? h("div", { "aria-hidden": "true", style: styles.overlay }) : null,
        h("div", { style: styles.content }, children)
      );
      break;
    }

    case "navbar": {
      const allChildren = node.children || [];
      const logoNode = allChildren.find((c) => c.type === "logo");
      const triggerNode = allChildren.find((c) => c.type === "iconButton" && (c.props?.icon === "Menu" || /menu|close/i.test(String(c.props?.text || ""))));
      const menuNodes = allChildren.filter((c) => c !== logoNode && c !== triggerNode);

      const renderedLogo = logoNode ? h(RenderNode, { key: logoNode.id, node: logoNode, site, parentType: "navbar", record, options, renderWrapper, onNodeClick, editableTextRenderer }) : null;
      const desktopChildren = allChildren.filter((c) => c !== triggerNode).map((c) =>
        h(RenderNode, { key: c.id, node: c, site, parentType: "navbar", record, options, renderWrapper, onNodeClick, editableTextRenderer })
      );
      const mobileMenuItems = menuNodes.map((c) =>
        h(RenderNode, { key: c.id, node: c, site, parentType: "navbarMobile", record, options, renderWrapper, onNodeClick, editableTextRenderer })
      );

      content = h(RenderNavbar, {
        props: p,
        options,
        logo: renderedLogo,
        trigger: triggerNode,
        menuItems: mobileMenuItems,
      }, desktopChildren);
      break;
    }

    case "footer": {
      const styles = createFooterStyles(p, { breakpoint });
      content = h(
        "footer",
        { className: `site-footer is-${styles.template}`, style: styles.container },
        h("div", { className: "site-footer-components", style: styles.content }, children)
      );
      break;
    }

    case "hero": {
      const styles = createHeroStyles(p, { breakpoint });
      content = h(
        "section",
        {
          className: `site-composite site-hero is-${styles.template} ${styles.reverse ? "is-reversed" : ""} ${styles.mobileMediaFirst ? "is-mobile-media-first" : ""}`,
          style: styles.container,
        },
        h("div", { className: "site-hero-components", style: styles.content }, children)
      );
      break;
    }

    case "notFound": {
      const styles = createCompositeSectionStyles(p, { type: "notFound", breakpoint });
      content = h(
        "section",
        { className: `site-composite site-notFound is-${styles.template}`, style: styles.container },
        h("div", { className: "site-composite-components", style: styles.content }, children)
      );
      break;
    }

    case "stack":
      content = h("div", { className: "site-stack", style: createStackStyles(p, { suppressMaxWidth: insideFooter, parentDirection: parentType === "rowStack" ? "row" : undefined }) }, children);
      break;

    case "grid": {
      const cols = number(p.columns, 2);
      const layout = createGridStyles(p, { desktopColumns: cols, columns: cols, suppressMaxWidth: insideFooter, breakpoint });
      const ordered = layout.reverse ? [...(children || [])].reverse() : children;
      content = h("div", { className: `site-grid ${layout.scrolling ? `is-scrolling ${p.showScrollbar ? "show-scrollbar" : ""}` : ""}`, style: layout.style }, ordered);
      break;
    }

    case "heading": {
      const level = Math.min(6, Math.max(1, number(p.level, 2)));
      const Tag = `h${level}`;
      const style = createTypographyStyles(p, { defaultLineHeight: 1.08, defaultMaxWidth: 800, parentDirection: parentType === "rowStack" ? "row" : undefined });
      if (editableTextRenderer) {
        content = editableTextRenderer({ as: Tag, style, text: string(p.text), html: string(p.html), node });
      } else if (p.html) {
        content = h(Tag, { style, dangerouslySetInnerHTML: { __html: string(p.html) } });
      } else {
        content = h(Tag, { style }, string(p.text));
      }
      break;
    }

    case "text": {
      const style = createTypographyStyles(p, { defaultLineHeight: 1.65, defaultMaxWidth: 680, surface: true, parentDirection: parentType === "rowStack" ? "row" : undefined });
      if (editableTextRenderer) {
        content = editableTextRenderer({ as: "p", style, text: string(p.text), html: string(p.html), node });
      } else if (p.html) {
        content = h("p", { style, dangerouslySetInnerHTML: { __html: string(p.html) } });
      } else {
        content = h("p", { style }, string(p.text));
      }
      break;
    }

    case "link": {
      const active = string(p.href).startsWith("page:") && string(p.href).slice(5) === site?.page?.id;
      const styles = createLinkStyles(p, { active, preserveParentCrossAxis: parentType === "navbarStack" });
      content = h(
        "a",
        {
          className: `site-link ${active ? "is-active" : ""}`,
          "aria-current": active ? "page" : undefined,
          href: resolveHref(p.href, site),
          target: string(p.target, "_self"),
          style: styles.style,
        },
        string(p.text, "Link")
      );
      break;
    }

    case "icon": {
      const styles = createIconStyles(p, { parentDirection: parentType === "rowStack" ? "row" : undefined, insideRow: parentType === "rowStack" });
      const rendered = h(
        "span",
        { className: "site-icon-wrap", style: styles.control },
        h(RenderIcon, { name: styles.icon, size: styles.size, strokeWidth: styles.strokeWidth, fill: styles.fill })
      );
      if (p.href) {
        content = h("div", { style: styles.container }, h("a", { href: resolveHref(p.href, site), target: string(p.target, "_self"), style: { textDecoration: "none", color: "inherit" } }, rendered));
      } else {
        content = h("div", { style: styles.container }, rendered);
      }
      break;
    }

    case "iconButton": {
      const resolvedPropsWithHref = { ...p, href: resolveHref(p.href, site) };
      content = h(RenderIconButton, { props: resolvedPropsWithHref });
      break;
    }

    case "button": {
      const resolvedPropsWithHref = { ...p, href: resolveHref(p.href, site) };
      content = h(RenderButton, { props: resolvedPropsWithHref, options: { preserveParentCrossAxis: parentType === "rowStack" || parentType === "grid" } });
      break;
    }

    case "image":
      content = h(RenderImage, { props: p });
      break;

    case "logo": {
      const resolvedPropsWithHref = { ...p, href: resolveHref(p.href || "/", site) };
      content = h(RenderLogo, { props: resolvedPropsWithHref });
      break;
    }

    case "input":
      content = h(RenderInlineInput, { props: p, options: { breakpoint } });
      break;

    case "formField":
      content = h(RenderFormField, { props: p });
      break;

    case "formChoice":
      content = h(RenderFormChoice, { props: p });
      break;

    case "formMessage":
      content = h(RenderFormMessage, { props: p });
      break;

    case "accordion":
      content = h(RenderAccordion, { props: p, options: { breakpoint } }, children);
      break;

    case "accordionItem":
      content = h(RenderAccordionItem, { id: node.id, props: p }, children);
      break;

    case "social":
      content = h(RenderSocial, { props: p });
      break;

    case "card":
      content = h(RenderCard, { props: p }, children);
      break;

    case "filterChip":
      content = h(RenderFilterChip, { props: p });
      break;

    case "filter": {
      const styles = createFilterStyles(p);
      content = h("section", { className: `site-filter is-${styles.template}`, style: styles.container }, h("div", { className: "site-filter-components", style: styles.content }, children));
      break;
    }

    case "mediaItem":
      content = h(RenderMediaItem, { props: p }, children);
      break;

    case "gallery": {
      const styles = createGalleryStyles(p, { breakpoint });
      content = h(
        "section",
        { className: `site-gallery is-${styles.template}`, style: styles.container },
        h("div", { className: "site-gallery-grid", style: styles.grid }, children?.map((child, idx) => h("div", { key: idx, style: styles.item(idx) }, child)))
      );
      break;
    }

    case "testimonials":
    case "features":
    case "pricing": {
      const styles = createCompositeSectionStyles(p, { type: node.type, breakpoint });
      content = h(
        "section",
        { className: `site-premium-section site-${node.type} is-${styles.template}`, style: styles.container },
        h("div", { className: "site-composite-components", style: styles.content }, children)
      );
      break;
    }

    case "spacer":
      content = h(RenderSpacer, { props: p });
      break;

    default:
      content = h("div", { className: `site-component site-${node.type}`, style: { ...createSurfaceStyles(p), maxWidth: px(p.maxWidth), marginInline: "auto" } }, children);
      break;
  }

  if (renderWrapper) {
    return renderWrapper(node, content);
  }

  return content;
}
