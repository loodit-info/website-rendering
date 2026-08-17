import React from "react";
import { icons as lucideIcons } from "lucide-react";
import {
  createIconStyles,
  createImageStyles,
  createLogoStyles,
  createSocialStyles,
} from "./styles.js";

const h = React.createElement;

export function RenderIcon({ props = {}, iconComponent, className = "", linkWrapper: LinkWrapper }) {
  const styles = createIconStyles(props);
  const IconComponent = iconComponent || lucideIcons[styles.icon] || lucideIcons.Sparkles;
  const strokeWidth = styles.strokeWidth;
  const size = styles.size;
  const fill = styles.fill && styles.fill !== "none" ? styles.fill : "none";

  const rendered = h(
    "span",
    { className: `site-icon ${className}`.trim(), style: styles.control },
    h(IconComponent, { size, strokeWidth, fill, "aria-hidden": "true" })
  );

  if (props.href && LinkWrapper) {
    return h(
      "div",
      { style: styles.container },
      h(LinkWrapper, { href: props.href, target: props.target || "_self" }, rendered)
    );
  }

  if (props.href) {
    return h(
      "div",
      { style: styles.container },
      h("a", { href: props.href, target: props.target || "_self", style: { textDecoration: "none", color: "inherit" } }, rendered)
    );
  }

  return h("div", { style: styles.container }, rendered);
}

export function RenderImage({ props = {}, className = "", frameClassName = "" }) {
  const styles = createImageStyles(props);
  const children = [
    h("img", {
      key: "img",
      className: `site-image-img ${className}`.trim(),
      src: props.src,
      alt: props.alt || "",
      draggable: false,
      style: styles.image,
    }),
  ];

  if (styles.overlayEnabled) {
    children.push(
      h("span", {
        key: "overlay",
        className: "site-image-overlay",
        "aria-hidden": "true",
        style: styles.overlay,
      })
    );
  }

  return h(
    "span",
    {
      className: `site-image ${frameClassName} ${styles.hoverOverlayEnabled ? "has-hover-overlay" : ""}`.trim(),
      style: styles.frame,
    },
    children
  );
}

export function RenderLogo({ props = {}, imageElement, wordmarkElement, linkWrapper: LinkWrapper, className = "" }) {
  const styles = createLogoStyles(props);
  const elements = [];

  if (styles.mode !== "text") {
    elements.push(
      imageElement ||
        (props.src
          ? h("img", { key: "logo-img", src: props.src, alt: props.alt || "Logo", draggable: false, style: styles.image })
          : null)
    );
  }

  if (styles.mode !== "image") {
    elements.push(
      wordmarkElement ||
        h("span", { key: "logo-wordmark", style: styles.wordmark }, props.text || "Your brand")
    );
  }

  if (LinkWrapper) {
    return h(
      "div",
      { className: `site-logo ${className}`.trim(), style: styles.container },
      h(LinkWrapper, { href: props.href || "/", style: styles.link }, elements)
    );
  }

  return h(
    "div",
    { className: `site-logo ${className}`.trim(), style: styles.container },
    h("a", { href: props.href || "/", style: styles.link }, elements)
  );
}

export function RenderSocial({ props = {}, linkWrapper: LinkWrapper, className = "" }) {
  const socialIcons = {
    instagram: lucideIcons.Instagram || lucideIcons.Camera,
    twitter: lucideIcons.Twitter || lucideIcons.Send,
    linkedin: lucideIcons.Linkedin || lucideIcons.Briefcase,
    facebook: lucideIcons.Facebook || lucideIcons.Share2,
  };
  const styles = createSocialStyles(props);
  const networks = (props.networks || "").split("\n").map((n) => n.trim()).filter(Boolean);

  const links = networks.map((name) => {
    const IconComponent = socialIcons[name.toLowerCase()] || lucideIcons.ExternalLink || lucideIcons.Globe;
    const iconElement = h(IconComponent, { size: props.size || 17 });
    if (LinkWrapper) {
      return h(LinkWrapper, { key: name, href: "#", "aria-label": name, style: styles.link }, iconElement);
    }
    return h("a", { key: name, href: "#", "aria-label": name, style: styles.link }, iconElement);
  });

  return h("div", { className: `site-social ${className}`.trim(), style: styles.container }, links);
}

export function RenderSpacer({ props = {} }) {
  return h("div", { style: { height: `${props.height || 32}px`, width: "100%", flexShrink: 0 }, "aria-hidden": "true" });
}
