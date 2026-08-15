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
export function createBackgroundStyles(value?: unknown): { background: StyleMap; overlay: PropertyMap };
export function createSurfaceStyles(props?: PropertyMap): StyleMap;
export function createButtonStyles(props?: PropertyMap, options?: PropertyMap): { wrapper: StyleMap; control: StyleMap; icon: StyleMap };
export function createSectionStyles(props?: PropertyMap): { container: StyleMap; background: StyleMap; overlay: StyleMap; overlayEnabled: boolean; content: StyleMap };
export function createStackStyles(props?: PropertyMap, options?: PropertyMap): StyleMap;
export function createGridStyles(props?: PropertyMap, options?: PropertyMap): { scrolling: boolean; reverse: boolean; style: StyleMap };
export function createGalleryStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; grid: StyleMap; item(index: number): StyleMap };
export function createNavbarStyles(props?: PropertyMap, options?: PropertyMap): { showScrolled: boolean; solidState: boolean; effectivePosition: unknown; style: StyleMap };
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
