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

export function createButtonStyles(props = {}) {
  const disabled = Boolean(props.disabled);
  const width = props.widthMode === "fill" ? "100%" : props.widthMode === "fixed" ? props.width : "auto";
  const background = disabled ? value(props.disabledBackground, "#cbd5cf") : value(props.background, "#286b4c");
  const color = disabled ? value(props.disabledColor, "#718078") : value(props.color, "#ffffff");
  return {
    wrapper: { alignSelf: align(props.align), width },
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

export function createSectionStyles(props = {}) {
  const resolved = createBackgroundStyles(props.background);
  return {
    container: { position: "relative", padding: `${value(props.paddingY, 0)}px ${value(props.paddingX, 0)}px`, textAlign: props.align, overflow: value(props.overflow, "visible") },
    background: { position: "absolute", inset: 0, ...resolved.background },
    overlay: { position: "absolute", inset: 0, background: resolved.overlay.color, opacity: value(resolved.overlay.opacity, 40) / 100 },
    overlayEnabled: Boolean(resolved.overlay.enabled),
    content: { position: "relative", minHeight: props.minHeight || undefined },
  };
}

export function createStackStyles(props = {}, options = {}) {
  const direction = value(options.direction, value(props.direction, "column"));
  const alignment = value(options.align, props.align);
  return {
    ...createSurfaceStyles(props),
    position: "relative",
    display: "flex",
    flexDirection: direction,
    flexWrap: value(options.flexWrap, "wrap"),
    gap: props.gap,
    alignItems: direction === "row" ? value(options.rowAlignItems, "center") : align(alignment),
    justifyContent: direction === "row" ? props.justify === "between" ? "space-between" : props.justify === "center" ? "center" : props.justify === "end" ? "flex-end" : align(alignment) : "flex-start",
    maxWidth: options.suppressMaxWidth ? undefined : props.maxWidth,
    minHeight: props.minHeight || undefined,
    width: props.widthMode === "auto" && !options.forceFill ? "fit-content" : props.widthMode === "fixed" ? props.width : "100%",
    marginLeft: alignment === "center" || alignment === "right" ? "auto" : 0,
    marginRight: alignment === "center" ? "auto" : alignment === "right" ? 0 : "auto",
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

export function createFormFieldStyles(props = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.formField;
  return {
    container: { ...defaults.container, gridColumn: `span ${value(props.span, 1)}` },
    label: { ...defaults.label },
    requiredMarker: { ...defaults.requiredMarker },
    control: {
      ...defaults.control,
      minHeight: value(props.height, defaults.control.minHeight),
      borderColor: value(props.borderColor, defaults.control.borderColor),
      borderRadius: value(props.radius, defaults.control.borderRadius),
      background: value(props.background, defaults.control.background),
      color: value(props.color, defaults.control.color),
    },
    helpText: { ...defaults.helpText },
  };
}
