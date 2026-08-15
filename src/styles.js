const value = (candidate, fallback) => candidate === undefined || candidate === null || candidate === "" ? fallback : candidate;

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

const alignment = (candidate) => candidate === "center" ? "center" : candidate === "right" || candidate === "end" ? "flex-end" : "flex-start";

export function createLogoStyles(props = {}) {
  const defaults = DEFAULT_COMPONENT_STYLES.logo;
  const mode = props.displayMode === "iconText" ? "imageText" : props.displayMode === "icon" ? "image" : value(props.displayMode, "imageText");
  const position = value(props.imagePosition, value(props.iconPosition, "left"));
  const direction = position === "top" || position === "bottom" ? "column" : "row";
  const reverse = position === "right" || position === "bottom";
  return {
    mode,
    container: { ...defaults.container, justifyContent: alignment(props.align) },
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
