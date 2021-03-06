type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;
export type ClassMap = Partial<Record<ClassName, boolean>>;

export const cls = {
  page: "page",
  header: "header",
  main: "main",
  mainTab: "main-tab",
  searchTab: "search-tab",
  searchInputGroup: "search-input-group",
  searchInputButton: "search-input-button",
  searchInput: "search-input",
  searchTab_Hidden: "search-tab-hidden",

  //tree
  row: "row",
  rowSelected: "row-selected",
  rowChevron: "row-chevron",
  rowChevronOpen: "row-chevron-open",
  rowChevronActive: "row-chevron-active",

  rowChildren: "row-children",
  rowLoading: "row-loading",
  rowChildrenBorder: "row-children-border",
  rowTitle: "row-title",
  rowTitleInput: "row-title-input",
  rowIcon: "row-icon",
  rowIconOpen: "row-icon-open",
  rowIconImageSquare: "row-icon-image-square",
  rowIconImageRound: "row-icon-image-round",
  rowIconImageClosed: "row-icon-image-closed",
  rowCircleInner: "row-circle-inner",
  rowCircleEmpty: "row-circle-empty",
  rowCircleOuter: "row-circle-outer",

  //themes
  themeToggle: "theme-toggle",
  themeToggleIcon: "theme-toggle-icon",
  darkTheme: "theme-dark",
  lightTheme: "theme-light",
} as const;

export type ElementId = valueof<typeof ids>;
export const ids = {} as const;
