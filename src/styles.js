const value = (candidate, fallback) => candidate === undefined || candidate === null || candidate === "" ? fallback : candidate;
const align = (candidate) => candidate === "center" ? "center" : candidate === "right" || candidate === "end" ? "flex-end" : "flex-start";
const shadow = (props) => props.shadow === "custom" ? props.customShadow : props.shadow === "small" ? "0 2px 8px #0000001f" : props.shadow === "medium" ? "0 7px 20px #00000029" : props.shadow === "large" ? "0 14px 35px #00000033" : "none";

export function createBackgroundStyles(candidate) {
  const defaults = { type: "solid", color: "#ffffff", image: { src: "", position: "center center", size: "cover", repeat: "no-repeat" }, gradient: { angle: 135, start: "#286b4c", end: "#17221d" }, overlay: { enabled: false, color: "#000000", opacity: 40 } };
  const item = typeof candidate === "string" ? { ...defaults, color: candidate } : { ...defaults, ...(candidate || {}), image: { ...defaults.image, ...(candidate?.image || {}) }, gradient: { ...defaults.gradient, ...(candidate?.gradient || {}) }, overlay: { ...defaults.overlay, ...(candidate?.overlay || {}) } };
  const background = item.type === "image"
    ? { backgroundColor: item.color, backgroundImage: item.image.src ? `url("${item.image.src}")` : "none", backgroundPosition: item.image.position, backgroundSize: item.image.size, backgroundRepeat: item.image.repeat }
    : item.type === "gradient"
      ? { background: `linear-gradient(${item.gradient.angle}deg, ${item.gradient.start}, ${item.gradient.end})` }
      : { background: item.color };
  return { background, overlay: item.overlay };
}

export function createSurfaceStyles(props = {}) {
  const background = props.background && props.background !== "transparent" ? createBackgroundStyles(props.background).background : {};
  return {
    boxSizing: "border-box",
    ...(props.padding !== undefined ? { padding: props.padding } : {}),
    ...(props.paddingTop !== undefined ? { paddingTop: props.paddingTop } : {}),
    ...(props.paddingRight !== undefined ? { paddingRight: props.paddingRight } : {}),
    ...(props.paddingBottom !== undefined ? { paddingBottom: props.paddingBottom } : {}),
    ...(props.paddingLeft !== undefined ? { paddingLeft: props.paddingLeft } : {}),
    ...background,
    borderWidth: value(props.borderWidth, 0),
    ...(props.borderTopWidth !== undefined ? { borderTopWidth: props.borderTopWidth } : {}),
    ...(props.borderRightWidth !== undefined ? { borderRightWidth: props.borderRightWidth } : {}),
    ...(props.borderBottomWidth !== undefined ? { borderBottomWidth: props.borderBottomWidth } : {}),
    ...(props.borderLeftWidth !== undefined ? { borderLeftWidth: props.borderLeftWidth } : {}),
    borderStyle: value(props.borderStyle, "solid"),
    borderColor: value(props.borderColor, "transparent"),
    ...(props.radius !== undefined ? { borderRadius: props.radius } : {}),
  };
}

export const DEFAULT_COMPONENT_STYLES = Object.freeze({
  logo: Object.freeze({
    container: Object.freeze({ display: "flex", width: "100%" }),
    link: Object.freeze({ display: "inline-flex", alignItems: "center", textDecoration: "none" }),
    wordmark: Object.freeze({ fontFamily: "Georgia, serif", fontSize: 24.8, fontWeight: 750, lineHeight: 1, letterSpacing: 0, whiteSpace: "nowrap" }),
    image: Object.freeze({ display: "block", flex: "none" }),
  }),
  formField: Object.freeze({
    container: Object.freeze({ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }),
    label: Object.freeze({ color: "#344139", fontSize: 12, fontWeight: 700 }),
    requiredMarker: Object.freeze({ color: "#b04438" }),
    control: Object.freeze({
      boxSizing: "border-box",
      width: "100%",
      minHeight: 48,
      padding: "12px 14px",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#dce3df",
      borderRadius: 10,
      outline: 0,
      background: "#ffffff",
      color: "#17221d",
      fontFamily: "inherit",
      fontSize: 14,
      transition: "border-color .15s ease, box-shadow .15s ease",
    }),
    helpText: Object.freeze({ color: "#7b877f", fontSize: 11 }),
  }),
  formChoice: Object.freeze({
    container: Object.freeze({ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0, fontSize: 13, lineHeight: 1.5 }),
    control: Object.freeze({ width: 17, height: 17, margin: "1px 0 0", flex: "0 0 auto" }),
  }),
  formMessage: Object.freeze({
    container: Object.freeze({ margin: 0, padding: "11px 13px", borderRadius: 9, fontWeight: 650 }),
    success: Object.freeze({ background: "#edf6f0", color: "#286b4c" }),
    error: Object.freeze({ background: "#fff0ee", color: "#a4382c" }),
    loading: Object.freeze({ display: "flex", alignItems: "center", gap: 8, background: "#f3f6f4", color: "#52635a" }),
  }),
});

export function createLogoStyles(props = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.logo;
  const mode = props.displayMode === "iconText" ? "imageText" : props.displayMode === "icon" ? "image" : value(props.displayMode, "imageText");
  const position = value(props.imagePosition, value(props.iconPosition, "left"));
  const direction = position === "top" || position === "bottom" ? "column" : "row";
  const reverse = position === "right" || position === "bottom";
  return {
    mode,
    container: { ...defaults.container, justifyContent: align(props.align) },
    link: { ...defaults.link, flexDirection: reverse ? `${direction}-reverse` : direction, gap: value(props.gap, 10), color: props.color },
    wordmark: {
      ...defaults.wordmark,
      color: props.color,
      fontFamily: value(props.fontFamily, defaults.wordmark.fontFamily),
      fontSize: value(props.fontSize, Math.max(18, value(props.height, 40) * .62)),
      fontWeight: value(props.fontWeight, defaults.wordmark.fontWeight),
      lineHeight: value(props.lineHeight, defaults.wordmark.lineHeight),
      letterSpacing: value(props.letterSpacing, defaults.wordmark.letterSpacing),
    },
    image: { ...defaults.image, width: props.width, height: props.height, objectFit: value(props.fit, "contain") },
  };
}

export function createTypographyStyles(props = {}, options = {}) {
  const alignment = value(props.align, "left");
  const maxLines = Math.max(0, Number(value(props.cmsMaxLines, 0)) || 0);
  const wrapMode = value(props.wrap, "wrap");
  const whiteSpace = props.whiteSpace || (wrapMode === "nowrap" ? "nowrap" : wrapMode === "preserve" ? "pre" : "pre-wrap");
  return {
    ...(options.surface ? createSurfaceStyles(props) : {}),
    color: props.color,
    fontFamily: props.fontFamily,
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle,
    lineHeight: value(props.lineHeight, value(options.defaultLineHeight, "normal")),
    letterSpacing: value(props.letterSpacing, 0),
    textAlign: alignment,
    textDecoration: value(props.textDecoration, "none"),
    whiteSpace,
    overflowWrap: value(props.overflowWrap, wrapMode === "nowrap" ? "normal" : "break-word"),
    wordBreak: value(props.wordBreak, "normal"),
    width: props.widthMode === "fixed" ? props.width : props.widthMode === "auto" || options.parentDirection === "row" ? "auto" : "100%",
    maxWidth: value(props.maxWidth, options.defaultMaxWidth),
    alignSelf: align(alignment),
    marginLeft: alignment === "center" || alignment === "right" ? "auto" : 0,
    marginRight: alignment === "center" ? "auto" : 0,
    ...(maxLines ? { display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical", overflow: "hidden" } : {}),
  };
}

export function createInlineInputStyles(props = {}, options = {}) {
  const mobile = options.breakpoint === "mobile";
  const fixed = props.widthMode === "fixed";
  const iconOnly = props.buttonDisplayMode === "icon";
  return {
    iconOnly,
    showIcon: props.buttonDisplayMode === "icon" || props.buttonDisplayMode === "iconText",
    iconOnRight: props.buttonIconPosition !== "left",
    form: { boxSizing: "border-box", display: "flex", width: mobile ? "100%" : fixed ? props.width : "100%", maxWidth: value(props.maxWidth, 720), height: value(props.height, 46), overflow: "hidden", borderWidth: value(props.borderWidth, 1), borderStyle: "solid", borderColor: value(props.borderColor, "#ffffff35"), borderRadius: value(props.radius, 9), background: props.background },
    input: { boxSizing: "border-box", minWidth: 0, flex: 1, width: "100%", border: 0, outline: 0, padding: `0 ${value(props.paddingX, 14)}px`, background: "transparent", color: props.color, font: "inherit" },
    button: { "--loodit-inline-submit-hover": value(props.buttonHoverBackground, props.buttonBackground), boxSizing: "border-box", flex: "none", minWidth: iconOnly ? value(props.height, 46) : undefined, height: "100%", padding: iconOnly ? 0 : `0 ${value(props.buttonPaddingX, 17)}px`, border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: value(props.buttonGap, 7), background: props.buttonBackground, color: props.buttonColor, fontFamily: "inherit", fontWeight: value(props.buttonFontWeight, 700), whiteSpace: "nowrap", cursor: "pointer" },
  };
}

export function createSocialStyles(props = {}) {
  const shape = value(props.shape, "circle");
  const itemSize = value(props.itemSize, 34);
  return {
    container: { display: "flex", alignItems: "center", justifyContent: align(props.align), flexWrap: "wrap", gap: value(props.gap, 9), color: props.color },
    link: { "--loodit-social-hover-bg": value(props.hoverBackground, "#ffffff12"), "--loodit-social-hover-color": value(props.hoverColor, props.color), boxSizing: "border-box", width: itemSize, height: itemSize, borderWidth: value(props.borderWidth, 1), borderStyle: "solid", borderColor: value(props.borderColor, "currentColor"), borderRadius: shape === "square" ? value(props.radius, 6) : shape === "rounded" ? value(props.radius, 10) : 999, display: "grid", placeItems: "center", background: props.background, color: "inherit", textDecoration: "none", transition: "transform .15s ease, background-color .15s ease, color .15s ease" },
  };
}

export function createImageStyles(props = {}) {
  const imagePosition = value(props.position, "center center");
  const horizontalPosition = value(props.align, String(imagePosition).split(" ")[0]);
  const aspectRatio = props.aspectRatio && props.aspectRatio !== "auto" ? props.aspectRatio : undefined;
  const fixedHeight = props.heightMode === "fixed";
  const overlayBackground = props.overlayType === "gradient"
    ? `linear-gradient(${value(props.overlayAngle, 180)}deg, ${value(props.overlayColor, "#102019")}, ${value(props.overlayGradientEnd, "#000000")})`
    : value(props.overlayColor, "#102019");
  return {
    hoverOverlayEnabled: Boolean(props.hoverOverlayEnabled),
    overlayEnabled: Boolean(props.overlayEnabled),
    frame: {
      "--loodit-image-hover-overlay": value(props.hoverOverlayColor, "#102019"),
      "--loodit-image-hover-opacity": value(props.hoverOverlayOpacity, 40) / 100,
      "--loodit-image-overlay-duration": `${value(props.overlayTransition, 240)}ms`,
      "--wb-image-hover-overlay": value(props.hoverOverlayColor, "#102019"),
      "--wb-image-hover-opacity": value(props.hoverOverlayOpacity, 40) / 100,
      "--wb-image-overlay-duration": `${value(props.overlayTransition, 240)}ms`,
      position: "relative",
      display: "block",
      overflow: "hidden",
      width: props.widthMode === "fixed" ? props.width : props.widthMode === "auto" ? "auto" : "100%",
      maxWidth: value(props.maxWidth, "100%"),
      height: fixedHeight ? props.height : "auto",
      aspectRatio,
      marginLeft: horizontalPosition === "left" ? 0 : "auto",
      marginRight: horizontalPosition === "right" ? 0 : "auto",
      borderRadius: value(props.radius, 0),
    },
    image: {
      display: "block",
      width: "100%",
      maxWidth: "100%",
      height: fixedHeight || aspectRatio ? "100%" : "auto",
      aspectRatio,
      objectFit: value(props.fit, "cover"),
      objectPosition: imagePosition,
      opacity: value(props.opacity, 100) / 100,
    },
    overlay: { position: "absolute", inset: 0, pointerEvents: "none", background: overlayBackground, opacity: value(props.overlayOpacity, 25) / 100, mixBlendMode: value(props.overlayBlendMode, "normal") },
  };
}

export function createButtonStyles(props = {}, options = {}) {
  const disabled = Boolean(props.disabled);
  const width = props.widthMode === "fill" || props.widthMode === "full" ? "100%" : props.widthMode === "fixed" ? props.width : "auto";
  const background = disabled ? value(props.disabledBackground, "#cbd5cf") : value(props.background, "#286b4c");
  const color = disabled ? value(props.disabledColor, "#718078") : value(props.color, "#ffffff");
  return {
    wrapper: { alignSelf: options.preserveParentCrossAxis ? undefined : align(props.align), width },
    control: {
      "--wb-button-hover-bg": value(props.hoverBackground, background),
      "--wb-button-hover-color": value(props.hoverColor, color),
      "--wb-button-active-bg": value(props.activeBackground, value(props.hoverBackground, background)),
      "--wb-button-active-color": value(props.activeColor, value(props.hoverColor, color)),
      "--site-button-hover-bg": value(props.hoverBackground, background),
      "--site-button-hover-color": value(props.hoverColor, color),
      "--site-button-active-bg": value(props.activeBackground, value(props.hoverBackground, background)),
      "--site-button-active-color": value(props.activeColor, value(props.hoverColor, color)),
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: value(props.iconGap, 8),
      padding: `${value(props.paddingY, 13)}px ${value(props.paddingX, 21)}px`,
      background,
      color,
      opacity: disabled ? value(props.disabledOpacity, 70) / 100 : 1,
      borderWidth: value(props.borderWidth, 0),
      borderStyle: value(props.borderStyle, "solid"),
      borderColor: value(props.borderColor, background),
      borderRadius: value(props.radius, 9),
      boxShadow: shadow(props),
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      fontStyle: props.fontStyle,
      lineHeight: value(props.lineHeight, 1.2),
      letterSpacing: value(props.letterSpacing, 0),
      textDecoration: props.textDecoration,
      textAlign: "center",
      transitionDuration: `${value(props.transitionDuration, 180)}ms`,
      transitionTimingFunction: value(props.transitionEasing, "ease"),
    },
    icon: { color: value(props.iconColor, "currentColor") },
  };
}

export function createLinkStyles(props = {}, options = {}) {
  const active = Boolean(options.active);
  const preset = value(props.activePreset, "underline");
  const activeTreatment = active && preset !== "none";
  const activeFill = activeTreatment && (preset === "pill" || props.activeFillEnabled === true);
  const activeColor = value(props.activeColor, props.color);
  const thickness = value(props.activeThickness, 2);
  const offset = value(props.activeOffset, 6);
  return {
    active,
    preset,
    style: {
      ...createTypographyStyles(props, { defaultMaxWidth: "100%" }),
      "--loodit-link-hover-color": value(props.hoverColor, props.color),
      "--loodit-link-hover-opacity": value(props.hoverOpacity, 90) / 100,
      "--wb-link-hover": value(props.hoverColor, props.color),
      display: "inline-flex",
      alignItems: "center",
      width: props.widthMode === "fixed" ? props.width : props.widthMode === "fill" ? "100%" : "max-content",
      maxWidth: value(props.maxWidth, "100%"),
      alignSelf: options.preserveParentCrossAxis ? undefined : align(props.align),
      marginLeft: undefined,
      marginRight: undefined,
      color: activeTreatment ? activeColor : props.color,
      fontWeight: activeTreatment ? value(props.activeFontWeight, props.fontWeight) : props.fontWeight,
      background: activeFill ? value(props.activeFillColor, value(props.activeBackground, "#eaf4ee")) : undefined,
      borderRadius: activeFill ? value(props.activeRadius, preset === "pill" ? 999 : 8) : undefined,
      padding: activeFill ? `${value(props.activePaddingY, 7)}px ${value(props.activePaddingX, 11)}px` : undefined,
      textDecoration: activeTreatment && preset === "underline" ? "underline" : props.underline ? "underline" : "none",
      textDecorationThickness: activeTreatment && preset === "underline" ? thickness : undefined,
      textUnderlineOffset: activeTreatment && preset === "underline" ? offset : undefined,
      borderBottom: activeTreatment && preset === "border" ? `${thickness}px solid ${activeColor}` : undefined,
      paddingBottom: activeTreatment && preset === "border" && !activeFill ? offset : undefined,
      transition: `color ${value(props.transitionDuration, 160)}ms ease, opacity ${value(props.transitionDuration, 160)}ms ease, background-color ${value(props.transitionDuration, 160)}ms ease`,
    },
  };
}

export function createIconStyles(props = {}, options = {}) {
  const size = value(props.size, 32);
  const strokeWidth = value(props.strokeWidth, 2);
  const padding = value(props.padding, 0);
  const radius = value(props.radius, 0);
  const borderWidth = value(props.borderWidth, 0);
  const alignment = align(props.align);
  const width = padding > 0 ? size + padding * 2 : size;
  const height = width;
  const fillMode = value(props.fillMode, "outline");
  const isFilled = fillMode === "solid" || fillMode === "fill";
  const fill = isFilled ? value(props.fillColor, props.color || "currentColor") : "none";
  const insideRow = Boolean(options.insideRow || options.parentDirection === "row");

  return {
    size,
    strokeWidth,
    icon: value(props.icon, "Sparkles"),
    fill,
    fillMode: isFilled ? "solid" : "outline",
    container: {
      display: insideRow ? "inline-flex" : "flex",
      justifyContent: alignment,
      width: insideRow ? "auto" : "100%",
      flexShrink: insideRow ? 0 : undefined,
    },
    control: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: "border-box",
      color: value(props.color, "#286b4c"),
      background: value(props.background, "transparent"),
      borderRadius: radius ? `${radius}px` : undefined,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderStyle: borderWidth ? "solid" : undefined,
      borderColor: borderWidth ? value(props.borderColor, "#dfe5e1") : undefined,
      textDecoration: "none",
      flexShrink: 0,
    },
  };
}

export function createIconButtonStyles(props = {}) {
  const displayMode = value(props.displayMode, "icon");
  return {
    showIcon: displayMode !== "text",
    showText: displayMode !== "icon",
    iconOnRight: props.iconPosition === "right",
    control: {
      "--loodit-icon-button-hover-bg": value(props.hoverBackground, props.background),
      "--loodit-icon-button-hover-color": value(props.hoverColor, props.color),
      "--wb-icon-button-hover-bg": value(props.hoverBackground, props.background),
      "--wb-icon-button-hover-color": value(props.hoverColor, props.color),
      position: "relative",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: value(props.gap, 7),
      padding: `${value(props.paddingY, 10)}px ${value(props.paddingX, 10)}px`,
      borderRadius: value(props.radius, 9),
      borderWidth: value(props.borderWidth, 0),
      borderStyle: value(props.borderStyle, "solid"),
      borderColor: value(props.borderColor, "transparent"),
      background: value(props.background, "transparent"),
      color: props.color,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      lineHeight: value(props.lineHeight, 1),
      textDecoration: "none",
      whiteSpace: "nowrap",
      transition: `background-color ${value(props.transitionDuration, 150)}ms ease, color ${value(props.transitionDuration, 150)}ms ease`,
    },
    badge: {
      position: "absolute",
      right: value(props.badgeRight, 2),
      top: value(props.badgeTop, 1),
      minWidth: value(props.badgeSize, 15),
      height: value(props.badgeSize, 15),
      padding: `0 ${value(props.badgePaddingX, 3)}px`,
      borderRadius: value(props.badgeRadius, 9),
      background: value(props.badgeBackground, "#286b4c"),
      color: value(props.badgeColor, "#ffffff"),
      display: "grid",
      placeItems: "center",
      fontSize: value(props.badgeFontSize, 9),
      lineHeight: 1,
    },
  };
}

export function createCardStyles(props = {}) {
  const baseShadow = props.shadow === "small" ? "0 4px 14px #17221d14" : props.shadow === "large" ? "0 22px 55px #17221d26" : props.shadow === "none" ? "none" : "0 12px 32px #17221d1c";
  return {
    hoverLift: Boolean(props.hoverLift),
    container: {
      ...createSurfaceStyles(props),
      "--loodit-card-hover-transform": `translateY(-${value(props.hoverLiftDistance, 4)}px)`,
      "--loodit-card-hover-shadow": value(props.hoverShadow, "0 20px 48px #17221d24"),
      width: "100%",
      maxWidth: value(props.maxWidth, 460),
      margin: "0 auto",
      overflow: value(props.overflow, "hidden"),
      boxShadow: baseShadow,
      transition: `transform ${value(props.transitionDuration, 200)}ms ease, box-shadow ${value(props.transitionDuration, 200)}ms ease`,
    },
    content: { display: "flex", flexDirection: "column", gap: value(props.gap, 22) },
  };
}

export function createMediaItemStyles(props = {}) {
  return {
    hoverLift: Boolean(props.hoverOverlay),
    container: {
      ...createSurfaceStyles(props),
      "--loodit-media-hover-transform": `translateY(-${value(props.hoverLiftDistance, 3)}px)`,
      "--loodit-media-hover-shadow": value(props.hoverShadow, "0 18px 40px #17221d1c"),
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: value(props.overflow, "hidden"),
      transition: `transform ${value(props.transitionDuration, 250)}ms ease, box-shadow ${value(props.transitionDuration, 250)}ms ease`,
    },
  };
}

export function createFooterStyles(props = {}, options = {}) {
  const breakpoint = value(options.breakpoint, "desktop");
  const mobile = breakpoint === "mobile";
  const tablet = breakpoint === "tablet";
  const paddingX = mobile ? Math.min(value(props.paddingX, 48), 24) : tablet ? Math.min(value(props.paddingX, 48), 32) : value(props.paddingX, 48);
  const paddingY = mobile ? Math.min(value(props.paddingY, 56), 44) : value(props.paddingY, 56);
  return {
    template: value(props.template, "basic"),
    container: {
      ...createBackgroundStyles(props.background).background,
      "--loodit-footer-tablet-padding-x": `${Math.min(value(props.paddingX, 48), 32)}px`,
      "--loodit-footer-mobile-padding-x": `${Math.min(value(props.paddingX, 48), 24)}px`,
      "--loodit-footer-mobile-padding-y": `${Math.min(value(props.paddingY, 56), 44)}px`,
      "--loodit-footer-mobile-gap": `${value(props.mobileGap, 28)}px`,
      boxSizing: "border-box",
      position: "relative",
      width: "100%",
      padding: `${paddingY}px ${paddingX}px`,
    },
    content: { display: "flex", flexDirection: "column", gap: mobile ? value(props.mobileGap, 28) : value(props.gap, 34), width: "100%", maxWidth: props.maxWidth, margin: props.maxWidth ? "0 auto" : 0 },
  };
}

export function createAccordionStyles(props = {}, options = {}) {
  const mobile = options.breakpoint === "mobile";
  const template = value(props.template, "minimal");
  const templatePadding = template === "dark" ? 22 : template === "helpCentre" ? 28 : props.padding;
  const templateBackground = template === "dark" ? "#101b16" : template === "helpCentre" ? "#f5f8f6" : props.background;
  const templateRadius = template === "dark" ? 22 : template === "helpCentre" ? 24 : props.radius;
  return {
    template,
    container: {
      ...createSurfaceStyles({ ...props, padding: mobile && (template === "dark" || template === "helpCentre") ? 16 : templatePadding, background: templateBackground, radius: templateRadius }),
      boxSizing: "border-box",
      width: `calc(100% - ${mobile ? 24 : 32}px)`,
      maxWidth: template === "split" ? value(props.maxWidth, 1180) : props.maxWidth,
      margin: "24px auto",
    },
    content: { display: "flex", flexDirection: "column", gap: value(props.gap, 10), width: "100%", minWidth: 0 },
  };
}

export function createAccordionItemStyles(props = {}, options = {}) {
  const open = Boolean(options.open);
  const iconType = value(props.icon, "plus");
  return {
    open,
    iconName: iconType === "chevron" ? "ChevronDown" : open ? "Minus" : "Plus",
    iconOnLeft: props.iconPosition === "left",
    item: {
      boxSizing: "border-box",
      overflow: "hidden",
      background: open ? value(props.activeBackground, props.background) : props.background,
      color: props.color,
      borderWidth: value(props.borderWidth, 1),
      borderStyle: value(props.borderStyle, "solid"),
      borderColor: value(props.borderColor, "#dfe5e1"),
      borderRadius: value(props.radius, 12),
    },
    trigger: { boxSizing: "border-box", width: "100%", padding: `${value(props.paddingY, 18)}px ${value(props.paddingX, 20)}px`, border: 0, background: "transparent", color: props.color, display: "flex", alignItems: "center", justifyContent: "space-between", gap: value(props.triggerGap, 20), textAlign: "left", fontFamily: "inherit", fontSize: value(props.questionFontSize, 16), fontWeight: value(props.questionFontWeight, 700), lineHeight: value(props.questionLineHeight, 1.35), cursor: "pointer" },
    question: { flex: 1 },
    icon: { flex: "none", transform: open && iconType === "chevron" ? "rotate(180deg)" : undefined, transition: `transform ${value(props.transitionDuration, 220)}ms ease` },
    answer: { boxSizing: "border-box", color: props.answerColor, padding: `0 ${value(props.paddingX, 20)}px ${value(props.paddingY, 18)}px`, lineHeight: value(props.answerLineHeight, 1.65) },
  };
}

export function createCarouselStyles(props = {}, options = {}) {
  const breakpoint = value(options.breakpoint, "desktop");
  const template = value(props.template, "editorialFeature");
  const railTemplate = template === "productShowcase" || template === "logoMarquee";
  const suggestedDesktop = template === "productShowcase" ? 3 : template === "logoMarquee" ? 4 : 1;
  const perView = Math.max(1, Number(breakpoint === "mobile" ? value(props.mobileSlides, 1) : breakpoint === "tablet" ? value(props.tabletSlides, railTemplate ? 2 : 1) : props.slidesPerView === 1 && railTemplate ? suggestedDesktop : value(props.slidesPerView, suggestedDesktop)) || 1);
  const itemCount = Math.max(0, Number(value(options.itemCount, 0)) || 0);
  const maxIndex = Math.max(0, itemCount - perView);
  const index = Math.min(maxIndex, Math.max(0, Number(value(options.index, 0)) || 0));
  const gap = value(props.gap, 22);
  const peek = value(props.peek, 0);
  const slideWidth = `calc((100% - ${(perView - 1) * gap}px - ${peek}px) / ${perView})`;
  const transition = value(props.transition, "swipe");
  const fade = transition === "fade" || transition === "scaleFade";
  const fullWidth = props.widthMode === "full" || props.widthMode === "viewport";
  const height = props.heightMode === "viewport" ? "100vh" : props.heightMode === "fixed" ? props.height : undefined;
  const sideArrows = props.showArrows !== false && props.arrowPosition === "centerEdges";
  const duration = `${value(props.transitionDuration, 520)}ms`;
  return {
    template, transition, perView, maxIndex, fade, sideArrows,
    showArrows: props.showArrows !== false,
    showDots: props.showDots !== false,
    container: { ...createSurfaceStyles(props), "--loodit-carousel-arrow-inset": `${value(props.arrowInset, 28)}px`, boxSizing: "border-box", position: "relative", width: props.widthMode === "viewport" ? "100vw" : fullWidth ? "100%" : "calc(100% - 32px)", maxWidth: fullWidth ? "none" : props.maxWidth, minHeight: height, margin: fullWidth ? 0 : "24px auto", overflow: "hidden" },
    viewport: { overflow: "hidden", minHeight: height, touchAction: "pan-y" },
    track: { display: fade ? "block" : "flex", alignItems: "stretch", gap: fade ? 0 : gap, transform: fade ? "none" : `translateX(calc(-${index} * (${slideWidth} + ${gap}px)))`, transitionProperty: "transform, opacity", transitionDuration: duration, transitionTimingFunction: "cubic-bezier(.22,1,.36,1)", minHeight: height, willChange: "transform" },
    slide: (slideIndex) => ({ display: fade ? slideIndex === index ? "block" : "none" : "block", position: fade ? slideIndex === index ? "relative" : "absolute" : "relative", inset: fade ? 0 : undefined, flex: fade ? undefined : `0 0 ${slideWidth}`, width: fade ? "100%" : undefined, minWidth: 0, opacity: fade ? slideIndex === index ? 1 : 0 : 1, transform: transition === "scaleFade" && slideIndex !== index ? "scale(1.035)" : undefined, transitionProperty: "opacity, transform", transitionDuration: duration }),
    controls: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginTop: 18 },
    edgeControls: { position: "absolute", zIndex: 20, left: value(props.arrowInset, 28), right: value(props.arrowInset, 28), top: "50%", display: "flex", justifyContent: "space-between", pointerEvents: "none", transform: "translateY(-50%)" },
    arrow: { width: 44, height: 44, border: "1px solid #dbe3df", borderRadius: 999, background: "#ffffffde", color: "#17221d", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 8px 25px #17221d24" },
    dots: { position: "static", left: "auto", bottom: "auto", transform: "none", display: "flex", alignItems: "center", gap: 8 },
    dot: (active) => ({ width: active ? 24 : 7, height: 7, padding: 0, border: 0, borderRadius: 99, background: active ? value(props.activeDotColor, "#286b4c") : value(props.dotColor, "#bbc7c0"), cursor: "pointer", transition: "width .2s ease, background .2s ease" }),
  };
}

export function createCompositeSectionStyles(props = {}, options = {}) {
  const breakpoint = value(options.breakpoint, "desktop");
  const type = value(options.type, "features");
  const notFound = type === "notFound";
  const defaultY = notFound ? 80 : type === "testimonials" ? 72 : 80;
  const defaultX = notFound ? 48 : 40;
  const mobileX = Math.min(value(props.paddingX, defaultX), notFound ? 22 : 20);
  const tabletX = Math.min(value(props.paddingX, defaultX), notFound ? 34 : 30);
  const mobileY = Math.min(value(props.paddingY, defaultY), notFound ? 54 : 48);
  const paddingX = breakpoint === "mobile" ? mobileX : breakpoint === "tablet" ? tabletX : value(props.paddingX, defaultX);
  const paddingY = breakpoint === "mobile" ? mobileY : value(props.paddingY, defaultY);
  const configuredBackground = notFound && props.template === "dark" ? "#10231b" : props.background;
  return {
    template: value(props.template, notFound ? "minimal" : ""),
    container: {
      ...createBackgroundStyles(configuredBackground).background,
      "--loodit-composite-tablet-x": `${tabletX}px`,
      "--loodit-composite-mobile-x": `${mobileX}px`,
      "--loodit-composite-mobile-y": `${mobileY}px`,
      boxSizing: "border-box",
      position: "relative",
      width: "100%",
      minHeight: notFound ? breakpoint === "mobile" ? 520 : props.minHeight : undefined,
      padding: `${paddingY}px ${paddingX}px`,
      display: notFound ? "flex" : undefined,
      alignItems: notFound ? "center" : undefined,
      justifyContent: notFound ? "center" : undefined,
    },
    content: { display: "flex", flexDirection: "column", gap: value(props.gap, notFound ? 24 : 40), width: "100%", maxWidth: props.maxWidth, margin: "0 auto" },
  };
}

export function createFilterStyles(props = {}, options = {}) {
  const mobile = options.breakpoint === "mobile";
  const filterShadow = props.shadow === "small" ? "0 5px 18px #17221d12" : props.shadow === "large" ? "0 24px 60px #17221d24" : props.shadow === "none" ? "none" : "0 14px 38px #17221d18";
  return {
    template: value(props.template, "compact"),
    container: {
      ...createSurfaceStyles({ ...props, padding: mobile ? value(props.mobilePadding, 16) : props.padding, radius: mobile ? value(props.mobileRadius, 18) : props.radius }),
      "--loodit-filter-mobile-padding": `${value(props.mobilePadding, 16)}px`,
      "--loodit-filter-mobile-radius": `${value(props.mobileRadius, 18)}px`,
      boxSizing: "border-box",
      width: `calc(100% - ${mobile ? 24 : 32}px)`,
      maxWidth: props.maxWidth,
      margin: "18px auto",
      boxShadow: filterShadow,
    },
    content: { display: "flex", flexDirection: "column", gap: value(props.gap, 18), width: "100%" },
  };
}

export function createFilterFieldStyles(props = {}) {
  const control = {
    "--loodit-filter-focus-border": value(props.focusBorderColor, "#6e9b82"),
    "--loodit-filter-focus-ring": value(props.focusRing, "0 0 0 3px #286b4c14"),
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: value(props.iconGap, 10),
    width: "100%",
    minHeight: value(props.height, 54),
    paddingInline: value(props.paddingX, 16),
    background: props.background,
    color: props.color,
    borderWidth: value(props.borderWidth, 1),
    borderStyle: value(props.borderStyle, "solid"),
    borderColor: value(props.borderColor, "transparent"),
    borderRadius: value(props.radius, 14),
    transition: "border-color .15s ease, box-shadow .15s ease",
  };
  return {
    container: { position: "relative", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 7, width: "100%", minWidth: 0 },
    label: { color: value(props.labelColor, "#17221d"), fontSize: value(props.labelFontSize, 12), fontWeight: value(props.labelFontWeight, 650) },
    control,
    input: { minWidth: 0, width: "100%", height: "100%", border: 0, outline: 0, background: "transparent", color: "inherit", fontFamily: "inherit", fontSize: value(props.fontSize, 13) },
    trigger: { ...control, textAlign: "left", fontFamily: "inherit", cursor: "pointer" },
    value: { minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: value(props.fontSize, 13) },
    placeholder: { color: value(props.placeholderColor, "#89958e") },
    menu: { position: "absolute", zIndex: 100, left: 0, right: 0, top: "calc(100% + 8px)", maxHeight: value(props.menuMaxHeight, 260), overflow: "auto", padding: value(props.menuPadding, 7), background: value(props.menuBackground, "#ffffff"), border: `${value(props.menuBorderWidth, 1)}px solid ${value(props.menuBorderColor, "#dfe5e1")}`, borderRadius: value(props.menuRadius, 14), boxShadow: value(props.menuShadow, "0 18px 48px #17221d2b") },
    option: { boxSizing: "border-box", width: "100%", minHeight: value(props.optionHeight, 42), border: 0, borderRadius: value(props.optionRadius, 9), color: value(props.optionColor, "#344139"), padding: `${value(props.optionPaddingY, 10)}px ${value(props.optionPaddingX, 11)}px`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", fontFamily: "inherit", fontSize: value(props.optionFontSize, 13), cursor: "pointer" },
    selectedOption: { background: value(props.selectedOptionBackground, "#e7f1eb"), color: value(props.selectedOptionColor, "#205b40"), fontWeight: value(props.selectedOptionFontWeight, 700) },
  };
}

export function createFilterChipStyles(props = {}, options = {}) {
  const selected = options.selected === undefined ? Boolean(props.selected) : Boolean(options.selected);
  return {
    selected,
    control: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: value(props.gap, 7),
      whiteSpace: "nowrap",
      background: selected ? props.selectedBackground : props.background,
      color: selected ? props.selectedColor : props.color,
      borderWidth: value(props.borderWidth, 1),
      borderStyle: value(props.borderStyle, "solid"),
      borderColor: selected ? props.selectedBorderColor : props.borderColor,
      borderRadius: value(props.radius, 999),
      padding: `${value(props.paddingY, 9)}px ${value(props.paddingX, 17)}px`,
      fontSize: value(props.fontSize, 13),
      cursor: "pointer",
      transition: "background .15s ease, color .15s ease, border-color .15s ease, transform .15s ease",
    },
    count: { fontSize: ".8em", opacity: .7 },
  };
}

export function createSectionStyles(props = {}, options = {}) {
  const resolved = createBackgroundStyles(props.background);
  return {
    container: { position: "relative", padding: `${value(props.paddingY, 0)}px ${value(props.paddingX, 0)}px`, textAlign: props.align, overflow: value(props.overflow, "visible"), overflowX: "clip" },
    background: { position: "absolute", inset: 0, ...resolved.background },
    overlay: { position: "absolute", inset: 0, background: resolved.overlay.color, opacity: value(resolved.overlay.opacity, 40) / 100 },
    overlayEnabled: Boolean(resolved.overlay.enabled),
    content: { position: "relative", minHeight: props.minHeight || undefined },
  };
}

export function createHeroStyles(props = {}, options = {}) {
  const breakpoint = value(options.breakpoint, "desktop");
  const mobile = breakpoint === "mobile";
  const tablet = breakpoint === "tablet";
  const paddingX = mobile ? Math.min(value(props.paddingX, 56), 24) : tablet ? Math.min(value(props.paddingX, 56), 36) : value(props.paddingX, 56);
  const paddingY = mobile ? Math.min(value(props.paddingY, 72), 48) : value(props.paddingY, 72);
  return {
    template: value(props.template, "split"),
    reverse: Boolean(props.reverse),
    mobileMediaFirst: Boolean(props.mobileMediaFirst),
    container: {
      ...createBackgroundStyles(value(options.background, props.background)).background,
      "--loodit-hero-mobile-padding-x": `${Math.min(value(props.paddingX, 56), 24)}px`,
      "--loodit-hero-mobile-padding-y": `${Math.min(value(props.paddingY, 72), 48)}px`,
      "--loodit-hero-tablet-padding-x": `${Math.min(value(props.paddingX, 56), 36)}px`,
      boxSizing: "border-box",
      width: "100%",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      padding: `${paddingY}px ${paddingX}px`,
      minHeight: mobile ? undefined : props.minHeight,
    },
    content: { width: "100%", maxWidth: props.maxWidth, margin: "auto", textAlign: value(props.contentAlign, "left") },
  };
}

export function createStackStyles(props = {}, options = {}) {
  const direction = value(options.direction, value(props.direction, "column"));
  const isRow = direction === "row";
  const insideRow = Boolean(options.insideRowStack || options.parentDirection === "row");
  const widthMode = props.widthMode || (insideRow ? "auto" : "fill");

  let width;
  let flex;

  if (widthMode === "fixed") {
    width = props.width || 300;
    flex = "0 0 auto";
  } else if (widthMode === "auto" || widthMode === "fit") {
    width = options.forceFill ? "100%" : "fit-content";
    flex = "0 0 auto";
  } else {
    if (insideRow) {
      width = "auto";
      flex = "1 1 0%";
    } else {
      width = "100%";
      flex = undefined;
    }
  }

  let alignItems;
  let justifyContent;

  if (isRow) {
    const vert = props.alignItems || props.verticalAlign || options.rowAlignItems;
    if (vert === "top" || vert === "start" || vert === "flex-start") alignItems = "flex-start";
    else if (vert === "bottom" || vert === "end" || vert === "flex-end") alignItems = "flex-end";
    else if (vert === "stretch") alignItems = "stretch";
    else if (vert === "baseline") alignItems = "baseline";
    else if (vert === "center") alignItems = "center";
    else alignItems = "flex-start";

    const horiz = props.justify || props.horizontalAlign;
    if (horiz === "center") justifyContent = "center";
    else if (horiz === "end" || horiz === "right" || horiz === "flex-end") justifyContent = "flex-end";
    else if (horiz === "between" || horiz === "space-between") justifyContent = "space-between";
    else if (horiz === "around" || horiz === "space-around") justifyContent = "space-around";
    else justifyContent = "flex-start";
  } else {
    const horiz = props.align || props.horizontalAlign || "left";
    if (horiz === "center") alignItems = "center";
    else if (horiz === "right" || horiz === "end" || horiz === "flex-end") alignItems = "flex-end";
    else if (horiz === "stretch") alignItems = "stretch";
    else alignItems = "flex-start";

    const vert = props.justify || props.verticalAlign;
    if (vert === "center") justifyContent = "center";
    else if (vert === "end" || vert === "bottom" || vert === "flex-end") justifyContent = "flex-end";
    else if (vert === "between" || vert === "space-between") justifyContent = "space-between";
    else justifyContent = "flex-start";
  }

  const stackAlign = props.align;

  return {
    ...createSurfaceStyles(props),
    position: "relative",
    display: "flex",
    flexDirection: direction,
    flexWrap: value(options.flexWrap, "wrap"),
    gap: props.gap,
    alignItems,
    justifyContent,
    maxWidth: options.suppressMaxWidth ? undefined : props.maxWidth,
    minHeight: props.minHeight || undefined,
    width,
    flex,
    minWidth: 0,
    marginLeft: !isRow && (stackAlign === "center" || stackAlign === "right") ? "auto" : 0,
    marginRight: !isRow && stackAlign === "center" ? "auto" : !isRow && stackAlign === "right" ? 0 : "auto",
  };
}

export function createGridStyles(props = {}, options = {}) {
  const desktopColumns = Math.max(1, Number(value(options.desktopColumns, value(props.columns, 1))) || 1);
  const count = Math.max(1, Number(value(options.columns, value(props.columns, desktopColumns))) || 1);
  const scrolling = props.behavior === "scroll";
  const columnFlow = !scrolling && props.direction === "column";
  const ratios = Array.from({ length: desktopColumns }, (_, index) => Math.max(.1, Number(props.columnRatios?.[index]) || 1));
  const useCustomRatios = options.allowCustomRatios !== false && count === desktopColumns && props.columnSizing === "custom";
  const columnTemplate = useCustomRatios ? ratios.map((ratio) => `minmax(0, ${ratio}fr)`).join(" ") : `repeat(${count}, minmax(0, 1fr))`;
  return {
    scrolling,
    reverse: props.order === "reverse",
    style: {
      ...createSurfaceStyles(props),
      position: "relative",
      display: "grid",
      gridTemplateColumns: scrolling || columnFlow ? undefined : columnTemplate,
      gridTemplateRows: columnFlow ? `repeat(${count}, minmax(0, auto))` : undefined,
      gridAutoFlow: scrolling || columnFlow ? "column" : "row",
      gridAutoColumns: scrolling ? `calc((100% - ${(count - 1) * value(props.columnGap, 0)}px) / ${count})` : columnFlow ? "minmax(0, 1fr)" : undefined,
      columnGap: props.columnGap,
      rowGap: props.rowGap,
      alignItems: value(props.align, "stretch"),
      maxWidth: options.suppressMaxWidth ? undefined : props.maxWidth,
      minHeight: props.minHeight || undefined,
      margin: "0 auto",
      width: "100%",
      overflowX: scrolling ? "auto" : "visible",
      scrollSnapType: scrolling ? "x mandatory" : undefined,
      scrollBehavior: scrolling ? "smooth" : undefined,
      "--columns": columnTemplate,
      "--tablet-columns": value(props.tabletColumns, Math.min(desktopColumns, 2)),
      "--mobile-columns": value(props.mobileColumns, 1),
    },
  };
}

export function createGalleryStyles(props = {}, options = {}) {
  const breakpoint = value(options.breakpoint, "desktop");
  const columns = breakpoint === "mobile" ? value(props.mobileColumns, 1) : breakpoint === "tablet" ? value(props.tabletColumns, 2) : value(props.columns, 3);
  const template = value(props.template, "grid");
  const collageExpanded = template === "collage" && breakpoint !== "mobile" && Number(columns) > 1;
  return {
    template,
    container: {
      ...createSurfaceStyles(props),
      width: "calc(100% - 32px)",
      maxWidth: props.maxWidth,
      margin: "24px auto",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: props.gap,
      alignItems: template === "masonry" || template === "editorial" ? "start" : undefined,
      minWidth: 0,
      "--gallery-columns": value(props.columns, 3),
      "--gallery-tablet": value(props.tabletColumns, 2),
      "--gallery-mobile": value(props.mobileColumns, 1),
    },
    item: (index) => index === 0 && collageExpanded ? { gridColumn: "span 2", gridRow: "span 2" } : { gridColumn: "auto", gridRow: "auto" },
  };
}

export function createNavbarStyles(props = {}, options = {}) {
  const transparentAtTop = props.transparentAtTop === true;
  const scrolled = Boolean(options.scrolled);
  const menuOpen = Boolean(options.menuOpen);
  const editing = Boolean(options.editing);
  const showScrolled = transparentAtTop && scrolled;
  const solidState = showScrolled || menuOpen;
  const backgroundValue = solidState ? value(props.scrolledBackground, props.background) : transparentAtTop ? "transparent" : props.background;
  const shadowName = solidState ? value(props.scrolledShadow, props.shadow) : props.shadow;
  const boxShadow = shadowName === "small" ? "0 3px 14px #17221d12" : shadowName === "medium" ? "0 8px 26px #17221d18" : shadowName === "large" ? "0 14px 38px #17221d24" : "none";
  const configuredPosition = value(props.position, "normal");
  const effectivePosition = transparentAtTop && !editing ? "fixed" : configuredPosition;
  return {
    showScrolled,
    solidState,
    effectivePosition,
    style: {
      ...createBackgroundStyles(backgroundValue).background,
      color: props.color,
      padding: `${value(props.paddingY, 14)}px ${value(options.paddingX, value(props.paddingX, 40))}px`,
      borderBottomWidth: solidState || !transparentAtTop ? value(props.borderBottomWidth, 0) : 0,
      borderBottomStyle: "solid",
      borderBottomColor: value(props.borderColor, "transparent"),
      boxShadow,
      position: effectivePosition === "sticky" ? "sticky" : effectivePosition === "fixed" ? "fixed" : "relative",
      insetInline: effectivePosition === "fixed" ? 0 : undefined,
      top: effectivePosition === "normal" ? undefined : 0,
      transition: `background-color ${value(props.transitionDuration, 240)}ms ease, box-shadow ${value(props.transitionDuration, 240)}ms ease, border-color ${value(props.transitionDuration, 240)}ms ease`,
    },
  };
}

export function createFormStyles(props = {}, options = {}) {
  const mobile = options.breakpoint === "mobile";
  const state = value(options.state, "default");
  const formShadow = props.shadow === "medium" ? "0 14px 38px #17221d18" : props.shadow === "large" ? "0 24px 60px #17221d24" : props.shadow === "none" ? "none" : "0 5px 18px #17221d12";
  return {
    container: {
      ...createSurfaceStyles({ ...props, padding: mobile ? Math.min(value(props.padding, 32), 22) : props.padding }),
      position: "relative",
      "--loodit-form-mobile-padding": `${Math.min(value(props.padding, 32), 22)}px`,
      display: "flex",
      flexDirection: "column",
      width: `calc(100% - ${mobile ? 24 : 32}px)`,
      maxWidth: props.maxWidth,
      margin: "22px auto",
      gap: value(props.gap, 20),
      boxShadow: formShadow,
      pointerEvents: state === "loading" ? "none" : undefined,
      opacity: state === "loading" ? .78 : 1,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${mobile ? 1 : Math.max(1, Number(value(props.columns, 1)) || 1)}, minmax(0, 1fr))`,
      gap: value(props.gap, 20),
      width: "100%",
    },
    loadingOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 9, borderRadius: "inherit", background: "#ffffffc7", color: "#52635a" },
  };
}

export function createFormFieldStyles(props = {}, options = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.formField;
  const disabled = Boolean(props.disabled);
  return {
    container: { ...defaults.container, gridColumn: `span ${options.breakpoint === "mobile" ? 1 : value(props.span, 1)}` },
    label: { ...defaults.label },
    requiredMarker: { ...defaults.requiredMarker },
    control: {
      ...defaults.control,
      "--loodit-form-focus-border": value(props.focusBorderColor, value(props.borderColor, "#4d8b68")),
      "--loodit-form-focus-ring": value(props.focusRing, "0 0 0 3px #4d8b6824"),
      minHeight: value(props.height, defaults.control.minHeight),
      borderColor: value(props.borderColor, defaults.control.borderColor),
      borderRadius: value(props.radius, defaults.control.borderRadius),
      background: value(props.background, defaults.control.background),
      color: value(props.color, defaults.control.color),
      opacity: disabled ? value(props.disabledOpacity, 55) / 100 : 1,
      cursor: disabled ? "not-allowed" : undefined,
    },
    textarea: { resize: value(props.resize, "vertical"), lineHeight: value(props.lineHeight, 1.5), minHeight: value(props.height, 120) },
    helpText: { ...defaults.helpText },
  };
}

export function createFormChoiceStyles(props = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.formChoice;
  const disabled = Boolean(props.disabled);
  return {
    container: { ...defaults.container, color: props.color, opacity: disabled ? value(props.disabledOpacity, 55) / 100 : 1, cursor: disabled ? "not-allowed" : undefined },
    control: { ...defaults.control, accentColor: value(props.accentColor, "#286b4c"), cursor: disabled ? "not-allowed" : undefined },
    label: { minWidth: 0 },
  };
}

export function createFormMessageStyles(props = {}, options = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.formMessage;
  const fontSize = value(props.fontSize, 13);
  return {
    container: { ...defaults.container, fontSize },
    success: { ...defaults.container, ...defaults.success, color: value(props.color, defaults.success.color), fontSize },
    error: { ...defaults.container, ...defaults.error, color: value(props.errorColor, defaults.error.color), fontSize },
    loading: { ...defaults.container, ...defaults.loading, fontSize },
    current: options.state === "error" ? { ...defaults.container, ...defaults.error, color: value(props.errorColor, defaults.error.color), fontSize } : options.state === "loading" ? { ...defaults.container, ...defaults.loading, fontSize } : { ...defaults.container, ...defaults.success, color: value(props.color, defaults.success.color), fontSize },
  };
}
