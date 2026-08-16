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
export function createLinkStyles(props?: PropertyMap, options?: PropertyMap): { active: boolean; preset: unknown; style: StyleMap };
export function createIconStyles(props?: PropertyMap): { size: number; strokeWidth: number; icon: string; container: StyleMap; control: StyleMap };
export function createIconButtonStyles(props?: PropertyMap): { showIcon: boolean; showText: boolean; iconOnRight: boolean; control: StyleMap; badge: StyleMap };
export function createCardStyles(props?: PropertyMap): { hoverLift: boolean; container: StyleMap; content: StyleMap };
export function createMediaItemStyles(props?: PropertyMap): { hoverLift: boolean; container: StyleMap };
export function createFooterStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; content: StyleMap };
export function createAccordionStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; content: StyleMap };
export function createAccordionItemStyles(props?: PropertyMap, options?: PropertyMap): { open: boolean; iconName: unknown; iconOnLeft: boolean; item: StyleMap; trigger: StyleMap; question: StyleMap; icon: StyleMap; answer: StyleMap };
export function createCarouselStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; transition: unknown; perView: number; maxIndex: number; fade: boolean; sideArrows: boolean; showArrows: boolean; showDots: boolean; container: StyleMap; viewport: StyleMap; track: StyleMap; slide(index: number): StyleMap; controls: StyleMap; edgeControls: StyleMap; arrow: StyleMap; dots: StyleMap; dot(active: boolean): StyleMap };
export function createCompositeSectionStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; content: StyleMap };
export function createFilterStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; content: StyleMap };
export function createFilterFieldStyles(props?: PropertyMap): { container: StyleMap; label: StyleMap; control: StyleMap; input: StyleMap; trigger: StyleMap; value: StyleMap; placeholder: StyleMap; menu: StyleMap; option: StyleMap; selectedOption: StyleMap };
export function createFilterChipStyles(props?: PropertyMap, options?: PropertyMap): { selected: boolean; control: StyleMap; count: StyleMap };
export function createTypographyStyles(props?: PropertyMap, options?: PropertyMap): StyleMap;
export function createInlineInputStyles(props?: PropertyMap, options?: PropertyMap): { iconOnly: boolean; showIcon: boolean; iconOnRight: boolean; form: StyleMap; input: StyleMap; button: StyleMap };
export function createSocialStyles(props?: PropertyMap): { container: StyleMap; link: StyleMap };
export function createImageStyles(props?: PropertyMap): { hoverOverlayEnabled: boolean; overlayEnabled: boolean; frame: StyleMap; image: StyleMap; overlay: StyleMap };
export function createSectionStyles(props?: PropertyMap): { container: StyleMap; background: StyleMap; overlay: StyleMap; overlayEnabled: boolean; content: StyleMap };
export function createHeroStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; reverse: boolean; mobileMediaFirst: boolean; container: StyleMap; content: StyleMap };
export function createStackStyles(props?: PropertyMap, options?: PropertyMap): StyleMap;
export function createGridStyles(props?: PropertyMap, options?: PropertyMap): { scrolling: boolean; reverse: boolean; style: StyleMap };
export function createGalleryStyles(props?: PropertyMap, options?: PropertyMap): { template: unknown; container: StyleMap; grid: StyleMap; item(index: number): StyleMap };
export function createNavbarStyles(props?: PropertyMap, options?: PropertyMap): { showScrolled: boolean; solidState: boolean; effectivePosition: unknown; style: StyleMap };
export function createFormStyles(props?: PropertyMap, options?: PropertyMap): { container: StyleMap; grid: StyleMap; loadingOverlay: StyleMap };
export function createLogoStyles(props?: PropertyMap): {
  mode: unknown;
  container: StyleMap;
  link: StyleMap;
  wordmark: StyleMap;
  image: StyleMap;
};
export function createFormFieldStyles(props?: PropertyMap, options?: PropertyMap): {
  container: StyleMap;
  label: StyleMap;
  requiredMarker: StyleMap;
  control: StyleMap;
  textarea: StyleMap;
  helpText: StyleMap;
};
export function createFormChoiceStyles(props?: PropertyMap): { container: StyleMap; control: StyleMap; label: StyleMap };
export function createFormMessageStyles(props?: PropertyMap, options?: PropertyMap): { container: StyleMap; success: StyleMap; error: StyleMap; loading: StyleMap; current: StyleMap };
