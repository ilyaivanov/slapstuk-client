import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByTestId } from "@testing-library/dom";
import { ClassName, cls } from "../../infra";

//actions
export const keyboardShortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  f2: () => fireEvent.keyDown(document, { code: "F2" }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

export const toggleTheme = () => fireEvent.click(themeToggler());
export const toggleItemVisibility = (id: string) =>
  fireEvent.click(getChevronFor(id));

export const inputInSearch = (text: string) =>
  fireEvent.input(searchInput(), { target: { value: text } });

export const inputTitleIntoRowInput = (id: string, text: string) =>
  fireEvent.input(queryInputForTitle(id), { target: { value: text } });

export const pressEnterInRowInput = (id: string) =>
  fireEvent.keyDown(queryInputForTitle(id), { key: "Enter" });
export const pressEnterInDocument = () =>
  fireEvent.keyDown(document, { key: "Enter" });

export const pressEscapeInRowInput = (id: string) =>
  fireEvent.keyDown(queryInputForTitle(id), { key: "Escape" });

export const pressEnterInSearch = () =>
  fireEvent.keyDown(searchInput(), { key: "Enter" });

//page quieries
const getRowTitle = (row: Element) =>
  getElementWithClass(cls.rowTitle, row).textContent;
const queryRowInput = (row: Element) =>
  queryElementWithClass(cls.rowTitleInput, row);

export const getRow = (id: string) => getByTestId(document.body, "row-" + id);
export const queryRow = (id: string) =>
  queryByTestId(document.body, "row-" + id);
export const rowTitle = (id: string) => getRowTitle(getRow(id));
export const queryInputForTitle = (id: string) => queryRowInput(getRow(id));

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

const queryElementWithClass = (
  className: ClassName,
  context: ContextToFindClasses = document
) => {
  const elements = context.getElementsByClassName(className);

  if (elements.length > 1)
    throw new Error(
      `Found multiple elements with ${className}. I don't want to silently return first one, use a separate method for that`
    );

  return elements[0];
};
