type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  page: "page",
  header: "header",
  main: "main",
  mainTab: "main-tab",
  searchTab: "search-tab",
  searchTab_Hidden: "search-tab-hidden",

  //tree
  row: "row",
  rowTitle: "row-title",
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {} as const;

export type ElementId = valueof<typeof ids>;
export const ids = {} as const;
