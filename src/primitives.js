import React from "react";
import * as LucideModule from "lucide-react";
import {
  createButtonStyles,
  createCardStyles,
  createFilterChipStyles,
  createFormChoiceStyles,
  createFormMessageStyles,
  createIconButtonStyles,
  createIconStyles,
  createImageStyles,
  createInlineInputStyles,
  createLogoStyles,
  createMediaItemStyles,
  createSocialStyles,
} from "./styles.js";

const h = React.createElement;

const getIcon = (name) => {
  if (!name) return null;
  const iconsDict = LucideModule.icons || {};
  return (
    LucideModule[name] ||
    iconsDict[name] ||
    iconsDict[name.charAt(0).toUpperCase() + name.slice(1)] ||
    null
  );
};

export function RenderIcon({ props = {}, iconComponent, className = "", linkWrapper: LinkWrapper }) {
  const styles = createIconStyles(props);
  const IconComponent = iconComponent || getIcon(styles.icon) || getIcon("Sparkles");
  const strokeWidth = styles.strokeWidth;
  const size = styles.size;
  const fill = styles.fill && styles.fill !== "none" ? styles.fill : "none";

  const rendered = h(
    "span",
    { className: `site-icon ${className}`.trim(), style: styles.control },
    IconComponent ? h(IconComponent, { size, strokeWidth, fill, "aria-hidden": "true" }) : null
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
    instagram: getIcon("Instagram") || getIcon("Camera") || getIcon("ExternalLink"),
    twitter: getIcon("Twitter") || getIcon("Send") || getIcon("ExternalLink"),
    linkedin: getIcon("Linkedin") || getIcon("Briefcase") || getIcon("ExternalLink"),
    facebook: getIcon("Facebook") || getIcon("Share2") || getIcon("ExternalLink"),
  };
  const styles = createSocialStyles(props);
  const networks = (props.networks || "").split("\n").map((n) => n.trim()).filter(Boolean);

  const links = networks.map((name) => {
    const IconComponent = socialIcons[name.toLowerCase()] || getIcon("ExternalLink") || getIcon("Globe");
    const iconElement = IconComponent ? h(IconComponent, { size: props.size || 17 }) : null;
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

export function RenderButton({ props = {}, options = {}, textElement, iconComponent, linkWrapper: LinkWrapper, className = "", controlClassName = "" }) {
  const styles = createButtonStyles(props, options);
  const unavailable = Boolean(props.disabled || props.loading);
  const IconComponent = iconComponent || (props.icon && props.icon !== "none" ? getIcon(props.icon) || getIcon("ArrowRight") : null);
  const iconSize = props.iconSize || 16;
  const LoaderIcon = getIcon("LoaderCircle");
  const iconElement = props.loading
    ? (LoaderIcon ? h(LoaderIcon, { className: "wb-button-spinner", size: iconSize, "aria-hidden": "true" }) : h("span", { className: "wb-button-spinner" }, "…"))
    : IconComponent
    ? h(IconComponent, { size: iconSize, strokeWidth: 2, "aria-hidden": "true" })
    : null;

  const iconSlot = iconElement ? h("span", { className: "site-button-icon", style: styles.icon }, iconElement) : null;
  const label = textElement || h("span", null, props.loading ? (props.loadingText || "Loading…") : (props.text || "Get started"));

  const inner = [
    props.iconPosition !== "right" ? iconSlot : null,
    label,
    props.iconPosition === "right" ? iconSlot : null,
  ].filter(Boolean);

  if (LinkWrapper) {
    return h(
      "div",
      { className: `site-button-wrap ${className}`.trim(), style: styles.wrapper },
      h(
        LinkWrapper,
        {
          className: `site-button ${controlClassName} ${unavailable ? "is-disabled" : ""}`.trim(),
          href: unavailable ? undefined : props.href,
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
        href: unavailable ? undefined : (props.href || "#"),
        target: props.target || "_self",
        rel: props.target === "_blank" ? "noopener noreferrer" : undefined,
        "aria-disabled": unavailable || undefined,
        "aria-busy": props.loading || undefined,
        tabIndex: unavailable ? -1 : undefined,
        style: { ...styles.control, textDecoration: "none" },
      },
      inner
    )
  );
}

export function RenderIconButton({ props = {}, iconComponent, linkWrapper: LinkWrapper, className = "" }) {
  const styles = createIconButtonStyles(props);
  const IconComponent = iconComponent || (props.icon ? getIcon(props.icon) || getIcon("Menu") : getIcon("Menu"));
  const actionIcon = styles.showIcon && IconComponent ? h(IconComponent, { size: props.iconSize || 19 }) : null;
  const actionText = styles.showText ? h("span", null, props.text) : null;
  const badge = props.badge ? h("small", { style: styles.badge }, props.badge) : null;

  const children = [
    !styles.iconOnRight ? actionIcon : null,
    actionText,
    styles.iconOnRight ? actionIcon : null,
    badge,
  ].filter(Boolean);

  if (LinkWrapper) {
    return h(
      LinkWrapper,
      {
        className: `site-icon-button ${className}`.trim(),
        href: props.href || "#",
        target: props.target || "_self",
        style: styles.control,
      },
      children
    );
  }

  return h(
    "a",
    {
      className: `site-icon-button ${className}`.trim(),
      href: props.href || "#",
      target: props.target || "_self",
      style: styles.control,
    },
    children
  );
}

export function RenderCard({ props = {}, children, className = "", contentClassName = "" }) {
  const styles = createCardStyles(props);
  return h(
    "article",
    {
      className: `site-card ${className} ${styles.hoverLift ? "has-hover-lift" : ""}`.trim(),
      style: styles.container,
    },
    h("div", { className: `site-card-components ${contentClassName}`.trim(), style: styles.content }, children)
  );
}

export function RenderMediaItem({ props = {}, children, className = "" }) {
  const styles = createMediaItemStyles(props);
  return h(
    "article",
    {
      className: `site-media-item ${className} ${styles.hoverLift ? "has-hover" : ""}`.trim(),
      style: styles.container,
    },
    children
  );
}

export function RenderInlineInput({ props = {}, options = {}, onSubmit, className = "" }) {
  const styles = createInlineInputStyles(props, options);
  const SubmitIcon = props.buttonIcon ? getIcon(props.buttonIcon) || getIcon("ArrowRight") : getIcon("ArrowRight");
  const submitIcon = styles.showIcon && SubmitIcon ? h(SubmitIcon, { size: props.buttonIconSize || 16, "aria-hidden": "true" }) : null;
  const submitText = !styles.iconOnly ? h("span", null, props.buttonText || "Submit") : null;

  return h(
    "form",
    {
      className: `site-inline-form ${className}`.trim(),
      onSubmit: onSubmit || ((e) => e.preventDefault()),
      style: styles.form,
    },
    h("input", {
      type: props.inputType || "email",
      "aria-label": props.placeholder || "Email address",
      placeholder: props.placeholder,
      style: styles.input,
    }),
    h(
      "button",
      {
        type: "submit",
        "aria-label": styles.iconOnly ? props.buttonText || "Submit" : undefined,
        style: styles.button,
      },
      !styles.iconOnRight ? submitIcon : null,
      submitText,
      styles.iconOnRight ? submitIcon : null
    )
  );
}

export function RenderFilterChip({ props = {}, options = {}, iconComponent, onClick, className = "" }) {
  const styles = createFilterChipStyles(props, options);
  const IconComponent = iconComponent || (props.showIcon && props.icon && props.icon !== "none" ? getIcon(props.icon) : null);

  return h(
    "button",
    {
      type: "button",
      className: `site-filter-chip ${className} ${styles.selected ? "is-selected" : ""}`.trim(),
      style: styles.control,
      onClick,
    },
    IconComponent ? h(IconComponent, { size: 16 }) : null,
    props.text,
    props.count ? h("small", { style: styles.count }, props.count) : null
  );
}

export function RenderFormChoice({ props = {}, disabled = false, className = "" }) {
  const styles = createFormChoiceStyles({ ...props, disabled: disabled || props.disabled });
  return h(
    "label",
    { className: `site-choice ${className}`.trim(), style: styles.container },
    h("input", {
      type: props.choiceType || "checkbox",
      name: props.name,
      value: props.value,
      defaultChecked: Boolean(props.checked),
      required: Boolean(props.required),
      disabled: Boolean(disabled || props.disabled),
      style: styles.control,
    }),
    h("span", { style: styles.label }, props.label)
  );
}

export function RenderFormMessage({ props = {}, className = "" }) {
  const styles = createFormMessageStyles(props);
  return h(
    "div",
    { className: `site-form-message ${className}`.trim() },
    props.successText ? h("p", { className: "is-success", style: styles.success }, props.successText) : null,
    props.errorText ? h("p", { className: "is-error", style: styles.error }, props.errorText) : null
  );
}
