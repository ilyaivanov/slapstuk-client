type valueof<T> = T[keyof T];
export type ClassName = valueof<typeof cls>;

export const cls = {
  page: "page",
  header: "header",
  mainTab: "main-tab",
  searchTab: "search-tab",
} as const;

export type VariableName = valueof<typeof cssVar>;
export const cssVar = {} as const;

export type ElementId = valueof<typeof ids>;
export const ids = {} as const;
