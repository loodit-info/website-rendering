export type WebsiteBreakpoint = "desktop" | "tablet" | "mobile";
export type PropertyMap = Record<string, unknown>;
export type StyleMap = Record<string, string | number | undefined>;

export interface WebsiteNode {
  id?: string;
  type: string;
  props?: PropertyMap;
  styles?: Partial<Record<WebsiteBreakpoint, PropertyMap>>;
}

export interface WebsiteSiteStyles {
  colors?: PropertyMap;
  typography?: PropertyMap;
  button?: PropertyMap;
  fields?: PropertyMap;
  shape?: PropertyMap;
  spacing?: PropertyMap;
  [group: string]: PropertyMap | undefined;
}

export const DEFAULT_SITE_STYLES: Readonly<Record<string, Readonly<PropertyMap>>>;
export function normalizeSiteStyles(value?: WebsiteSiteStyles): Record<string, PropertyMap>;
export function responsiveProps(node: WebsiteNode, breakpoint?: WebsiteBreakpoint): PropertyMap;
export function themePropsForNode(type: string, siteStyles?: WebsiteSiteStyles): PropertyMap;
export function resolveNodeProps(input: {
  node: WebsiteNode;
  breakpoint?: WebsiteBreakpoint;
  siteStyles?: WebsiteSiteStyles;
}): PropertyMap;
export const DEFAULT_COMPONENT_STYLES: Readonly<Record<string, Readonly<Record<string, Readonly<StyleMap>>>>>;
export function createLogoStyles(props?: PropertyMap): {
  mode: unknown;
  container: StyleMap;
  link: StyleMap;
  wordmark: StyleMap;
  image: StyleMap;
};
export function createFormFieldStyles(props?: PropertyMap): {
  container: StyleMap;
  label: StyleMap;
  requiredMarker: StyleMap;
  control: StyleMap;
  helpText: StyleMap;
};
