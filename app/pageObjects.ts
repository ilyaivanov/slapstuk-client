import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByTestId } from "@testing-library/dom";
import { ClassName, cls } from "../infra";

//actions
export const keyboardShortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

//page quieries
export const getRowTitle = (row: Element) =>
  getElementWithClass(cls.rowTitle, row).textContent;

export const getRow = (id: string) => getByTestId(document.body, "row-" + id);
export const queryRow = (id: string) =>
  queryByTestId(document.body, "row-" + id);
export const rowTitle = (id: string) => getRowTitle(getRow(id));

export const getRowIcon = (id: string): HTMLElement =>
  getElementWithClass(cls.rowIcon, getRow(id)) as HTMLElement;
export const getChevronFor = (id: string) =>
  getElementWithClass(cls.rowChevron, getRow(id));
export const searchTab = () => getElementWithClass(cls.searchTab);
export const page = () => getElementWithClass(cls.page);
export const themeToggler = () => getElementWithClass(cls.themeToggle);

export const searchInput = () => getByTestId(document.body, "search-input");
export const searchLoading = () =>
  queryByTestId(document.body, "search-loading");
export const getLoadingIndicator = (id: string) =>
  getByTestId(document.body, "row-loading-" + id);

//TESTS INFRA
//this is interesting, since method type getElementsByClassName is defined separately in Document and Element,
//I can't just type context with Element or Document, because Document is not an Element
type ContextToFindClasses = {
  getElementsByClassName: typeof document.getElementsByClassName;
};
const getElementWithClass = (
  className: ClassName,
  context: ContextToFindClasses = document
) => {
  const elements = context.getElementsByClassName(className);

  if (elements.length === 0)
    throw new Error(`Can't find any element with class ${className}`);
  if (elements.length > 1)
    throw new Error(
      `Found multiple elements with ${className}. I don't want to silently return first one, use a separate method for that`
    );

  return elements[0];
};
